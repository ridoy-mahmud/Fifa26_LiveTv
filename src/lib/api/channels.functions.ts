import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { Db, Collection } from "mongodb";
import { ALL_GROUPS, DEFAULT_CHANNELS, type Channel, type ChannelGroup } from "@/lib/channels-data";
import { MATCHES, TEAMS, type Match, type Team } from "@/lib/worldcup-data";
import { getDb, getMongoClient, getMongoDbName } from "@/lib/mongo.server";

/**
 * Server-side channel storage backed by MongoDB.
 *
 * Public function signatures are stable so the client
 * (`useChannels`, `useChannelMutations`, `/admin`) does not need changes.
 *
 * If MONGODB_URI is not set we fall back to an in-memory map so the admin
 * UI still works in dev. Set the env var in production to persist data.
 */

const COL_CHANNELS = "channels";
const COL_MATCHES = "matches";
const COL_TEAMS = "teams";

// Input schema for channel writes. Defaults are applied at parse time so the
// output matches the Channel type (logo: string, featured: boolean).
// We don't use `satisfies z.ZodType<Channel>` because optional Zod fields
// with `.default()` have input type `T | undefined` while Channel expects
// concrete types — the runtime output is fine.
const ChannelInput = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  group: z.enum(ALL_GROUPS as [ChannelGroup, ...ChannelGroup[]]),
  logo: z.string().optional().default(""),
  url: z.string().min(1),
  fallbackUrl: z.string().optional(),
  featured: z.boolean().optional().default(false),
  order: z.number().int().optional(),
});

const ChannelPatch = z.object({
  id: z.string().min(1),
  name: z.string().min(1).optional(),
  group: z.enum(ALL_GROUPS as [ChannelGroup, ...ChannelGroup[]]).optional(),
  logo: z.string().optional(),
  url: z.string().min(1).optional(),
  fallbackUrl: z.string().optional(),
  featured: z.boolean().optional(),
  order: z.number().int().optional(),
});

const IdsInput = z.object({ orderedIds: z.array(z.string().min(1)) });

const ReplaceAllInput = z.object({ rows: z.array(ChannelInput) });

const ImportInput = z.object({
  rows: z.array(
    z.object({
      name: z.string().min(1),
      group: z.enum(ALL_GROUPS as [ChannelGroup, ...ChannelGroup[]]),
      logo: z.string().optional().default(""),
      url: z.string().min(1),
      fallbackUrl: z.string().optional(),
      featured: z.boolean().optional().default(false),
    }),
  ),
});

let _clientPromise: Promise<Db> | null = null;
async function getDbHandle(): Promise<Db> {
  if (!_clientPromise) _clientPromise = getDb();
  return _clientPromise;
}
async function channelsCol(): Promise<Collection<Channel>> {
  const db = await getDbHandle();
  return db.collection<Channel>(COL_CHANNELS);
}
async function matchesCol(): Promise<Collection<Match>> {
  const db = await getDbHandle();
  return db.collection<Match>(COL_MATCHES);
}
async function teamsCol(): Promise<Collection<Team>> {
  const db = await getDbHandle();
  return db.collection<Team>(COL_TEAMS);
}

export const listChannels = createServerFn({ method: "GET" }).handler(
  async (): Promise<Channel[]> => {
    const col = await channelsCol();
    return col
      .find({}, { projection: { _id: 0 } })
      .sort({ order: 1 })
      .toArray();
  },
);

export const upsertChannel = createServerFn({ method: "POST" })
  .validator((d) => ChannelInput.parse(d))
  .handler(async ({ data }) => {
    const incoming = data as Channel;
    const col = await channelsCol();
    const existing = await col.findOne({ id: incoming.id });

    let newOrder = incoming.order;
    if (newOrder === undefined) {
      if (existing?.order !== undefined) {
        newOrder = existing.order;
      } else {
        const last = await col
          .find({}, { projection: { order: 1 } })
          .sort({ order: -1 })
          .limit(1)
          .toArray();
        newOrder = (last[0]?.order ?? 0) + 1;
      }
    }

    const merged: Channel = {
      ...incoming,
      group: incoming.group as ChannelGroup,
      order: newOrder,
    };
    await col.replaceOne({ id: incoming.id }, merged, { upsert: true });
    return { ok: true, channel: merged };
  });

export const patchChannel = createServerFn({ method: "POST" })
  .validator((d) => ChannelPatch.parse(d))
  .handler(async ({ data }) => {
    const col = await channelsCol();
    const cur = await col.findOne({ id: data.id });
    if (!cur) throw new Error(`Channel not found: ${data.id}`);
    const { id: _ignore, fallbackUrl, ...rest } = data;
    const next: Channel = {
      ...cur,
      ...rest,
      fallbackUrl: fallbackUrl ?? cur.fallbackUrl,
      group: ((data.group as ChannelGroup | undefined) ?? cur.group) as ChannelGroup,
    };
    await col.replaceOne({ id: data.id }, next);
    return { ok: true, channel: next };
  });

export const toggleFeatured = createServerFn({ method: "POST" })
  .validator((d) => z.object({ id: z.string().min(1) }).parse(d))
  .handler(async ({ data }) => {
    const col = await channelsCol();
    const cur = await col.findOne({ id: data.id });
    if (!cur) throw new Error(`Channel not found: ${data.id}`);
    const next: Channel = { ...cur, featured: !cur.featured };
    await col.replaceOne({ id: data.id }, next);
    return { ok: true, channel: next };
  });

export const deleteChannel = createServerFn({ method: "POST" })
  .validator((d) => z.object({ id: z.string().min(1) }).parse(d))
  .handler(async ({ data }) => {
    const col = await channelsCol();
    await col.deleteOne({ id: data.id });
    return { ok: true };
  });

export const reorderChannels = createServerFn({ method: "POST" })
  .validator((d) => IdsInput.parse(d))
  .handler(async ({ data }) => {
    const col = await channelsCol();
    await Promise.all(
      data.orderedIds.map((id, idx) => col.updateOne({ id }, { $set: { order: idx } })),
    );
    return { ok: true };
  });

export const replaceAllChannels = createServerFn({ method: "POST" })
  .validator((d) => ReplaceAllInput.parse(d))
  .handler(async ({ data }) => {
    const col = await channelsCol();
    await col.deleteMany({});
    const docs = data.rows.map((c, idx) => ({ ...c, order: c.order ?? idx }) as Channel);
    if (docs.length) await col.insertMany(docs, { ordered: false });
    return { ok: true, count: docs.length };
  });

export const importChannels = createServerFn({ method: "POST" })
  .validator((d) => ImportInput.parse(d))
  .handler(async ({ data }) => {
    const col = await channelsCol();
    let added = 0;
    let skipped = 0;
    for (const r of data.rows) {
      const exists = await col.findOne({ url: r.url });
      if (exists) {
        skipped++;
        continue;
      }
      const id = `imp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const last = await col
        .find({}, { projection: { order: 1 } })
        .sort({ order: -1 })
        .limit(1)
        .toArray();
      const order = (last[0]?.order ?? 0) + 1;
      await col.insertOne({
        id,
        name: r.name,
        group: r.group as ChannelGroup,
        logo: r.logo ?? "",
        url: r.url,
        fallbackUrl: r.fallbackUrl ?? undefined,
        featured: !!r.featured,
        order,
      });
      added++;
    }
    return { ok: true, added, skipped };
  });

// ------------------------------------------------------------------
// Reads for the public site (channels + matches + teams).
// Falls back to the bundled defaults when the collection is empty so
// the site still renders before the first seed run.
// ------------------------------------------------------------------

export const listMatches = createServerFn({ method: "GET" }).handler(async (): Promise<Match[]> => {
  try {
    const col = await matchesCol();
    const count = await col.estimatedDocumentCount();
    if (count === 0) return MATCHES;
    return col.find({}, { projection: { _id: 0 } }).toArray();
  } catch {
    return MATCHES;
  }
});

export const listTeams = createServerFn({ method: "GET" }).handler(async (): Promise<Team[]> => {
  try {
    const col = await teamsCol();
    const count = await col.estimatedDocumentCount();
    if (count === 0) return TEAMS;
    return col.find({}, { projection: { _id: 0 } }).toArray();
  } catch {
    return TEAMS;
  }
});

const IdInput = z.object({ id: z.string().min(1) });

export const getMatchById = createServerFn({ method: "GET" })
  .validator((d) => IdInput.parse(d))
  .handler(async ({ data }) => {
    try {
      const col = await matchesCol();
      const found = await col.findOne({ id: data.id }, { projection: { _id: 0 } });
      if (found) return { match: found as Match };
    } catch {
      // fall through to bundled defaults
    }
    const match = MATCHES.find((m) => m.id === data.id) ?? null;
    return { match };
  });

export interface MongoStatus {
  ok: boolean;
  channelCount: number;
  activeSessions: number;
  reason?: string;
}

let _activeSessions = 0;

export const getMongoStatus = createServerFn({ method: "GET" }).handler(
  async (): Promise<MongoStatus> => {
    try {
      const c = await getMongoClient();
      const db: Db = c.db(getMongoDbName());
      const channelCount = await db.collection(COL_CHANNELS).countDocuments();
      return { ok: true, channelCount, activeSessions: _activeSessions };
    } catch (e) {
      return {
        ok: false,
        channelCount: 0,
        activeSessions: 0,
        reason: e instanceof Error ? e.message : "unknown",
      };
    }
  },
);

export function _bumpSessions(delta: 1 | -1) {
  _activeSessions = Math.max(0, _activeSessions + delta);
}
