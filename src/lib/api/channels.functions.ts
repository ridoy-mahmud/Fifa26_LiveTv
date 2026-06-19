import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { MongoClient, type Db, type Collection } from "mongodb";
import { DEFAULT_CHANNELS, type Channel, type ChannelGroup } from "@/lib/channels-data";

/**
 * Server-side channel storage backed by MongoDB.
 *
 * Public function signatures are stable so the client
 * (`useChannels`, `useChannelMutations`, `/admin`) does not need changes.
 *
 * If MONGODB_URI is not set we fall back to an in-memory map so the admin
 * UI still works in dev. Set the env var in production to persist data.
 */

const DB_NAME = process.env.MONGODB_DB || "wc2026";
const COL_CHANNELS = "channels";

const ChannelInput = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  group: z.string().min(1),
  logo: z.string().optional().default(""),
  url: z.string().min(1),
  fallbackUrl: z.string().nullable().optional().default(null),
  featured: z.boolean().optional().default(false),
  order: z.number().int().optional(),
}) satisfies z.ZodType<Channel>;

const ChannelPatch = z.object({
  id: z.string().min(1),
  name: z.string().min(1).optional(),
  group: z.string().min(1).optional(),
  logo: z.string().optional(),
  url: z.string().min(1).optional(),
  fallbackUrl: z.string().nullable().optional(),
  featured: z.boolean().optional(),
  order: z.number().int().optional(),
});

const IdsInput = z.object({ orderedIds: z.array(z.string().min(1)) });

const ReplaceAllInput = z.object({ rows: z.array(ChannelInput) });

const ImportInput = z.object({
  rows: z.array(
    z.object({
      name: z.string().min(1),
      group: z.string().min(1),
      logo: z.string().optional().default(""),
      url: z.string().min(1),
      fallbackUrl: z.string().nullable().optional().default(null),
      featured: z.boolean().optional().default(false),
    }),
  ),
});

let _clientPromise: Promise<MongoClient> | null = null;
function getClient(): Promise<MongoClient> {
  if (!_clientPromise) {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("MONGODB_URI is not configured");
    _clientPromise = new MongoClient(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5_000,
    }).connect();
  }
  return _clientPromise;
}

async function channelsCol(): Promise<Collection<Channel>> {
  const c = await getClient();
  return c.db(DB_NAME).collection<Channel>(COL_CHANNELS);
}

type MemStore = { map: Map<string, Channel>; seeded: boolean };
const _mem: MemStore = { map: new Map(), seeded: false };
function memSeed() {
  if (_mem.seeded) return;
  _mem.seeded = true;
  for (const c of DEFAULT_CHANNELS) _mem.map.set(c.id, { ...c });
}
function memNextOrder(): number {
  let max = 0;
  for (const c of _mem.map.values()) {
    if (typeof c.order === "number" && c.order > max) max = c.order;
  }
  return max + 1;
}
function memSnapshot(): Channel[] {
  memSeed();
  return Array.from(_mem.map.values()).sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0),
  );
}
function usingMemory() {
  return !process.env.MONGODB_URI;
}

export const listChannels = createServerFn({ method: "GET" }).handler(
  async (): Promise<Channel[]> => {
    if (usingMemory()) return memSnapshot();
    const col = await channelsCol();
    return col.find({}, { projection: { _id: 0 } }).sort({ order: 1 }).toArray();
  },
);

export const upsertChannel = createServerFn({ method: "POST" })
  .validator((d) => ChannelInput.parse(d))
  .handler(async ({ data }) => {
    const incoming = data as Channel;
    if (usingMemory()) {
      memSeed();
      const existing = _mem.map.get(incoming.id);
      const merged: Channel = {
        ...incoming,
        group: incoming.group as ChannelGroup,
        order: existing?.order ?? incoming.order ?? memNextOrder(),
      };
      _mem.map.set(merged.id, merged);
      return { ok: true, channel: merged };
    }
    const col = await channelsCol();
    const existing = await col.findOne({ id: incoming.id });
    const merged: Channel = {
      ...incoming,
      group: incoming.group as ChannelGroup,
      order: existing?.order ?? incoming.order ?? memNextOrder(),
    };
    await col.replaceOne({ id: incoming.id }, merged, { upsert: true });
    return { ok: true, channel: merged };
  });

export const patchChannel = createServerFn({ method: "POST" })
  .validator((d) => ChannelPatch.parse(d))
  .handler(async ({ data }) => {
    if (usingMemory()) {
      memSeed();
      const cur = _mem.map.get(data.id);
      if (!cur) throw new Error(`Channel not found: ${data.id}`);
      const next: Channel = {
        ...cur,
        ...data,
        group: ((data.group as ChannelGroup | undefined) ?? cur.group) as ChannelGroup,
        id: cur.id,
      };
      _mem.map.set(cur.id, next);
      return { ok: true, channel: next };
    }
    const col = await channelsCol();
    const cur = await col.findOne({ id: data.id });
    if (!cur) throw new Error(`Channel not found: ${data.id}`);
    const { id: _ignore, ...rest } = data;
    const next: Channel = {
      ...cur,
      ...rest,
      group: ((data.group as ChannelGroup | undefined) ?? cur.group) as ChannelGroup,
    };
    await col.replaceOne({ id: data.id }, next);
    return { ok: true, channel: next };
  });

export const toggleFeatured = createServerFn({ method: "POST" })
  .validator((d) => z.object({ id: z.string().min(1) }).parse(d))
  .handler(async ({ data }) => {
    if (usingMemory()) {
      memSeed();
      const cur = _mem.map.get(data.id);
      if (!cur) throw new Error(`Channel not found: ${data.id}`);
      cur.featured = !cur.featured;
      _mem.map.set(data.id, cur);
      return { ok: true, channel: cur };
    }
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
    if (usingMemory()) {
      memSeed();
      _mem.map.delete(data.id);
      return { ok: true };
    }
    const col = await channelsCol();
    await col.deleteOne({ id: data.id });
    return { ok: true };
  });

export const reorderChannels = createServerFn({ method: "POST" })
  .validator((d) => IdsInput.parse(d))
  .handler(async ({ data }) => {
    if (usingMemory()) {
      memSeed();
      data.orderedIds.forEach((id, idx) => {
        const cur = _mem.map.get(id);
        if (cur) {
          cur.order = idx;
          _mem.map.set(id, cur);
        }
      });
      return { ok: true };
    }
    const col = await channelsCol();
    await Promise.all(
      data.orderedIds.map((id, idx) =>
        col.updateOne({ id }, { $set: { order: idx } }),
      ),
    );
    return { ok: true };
  });

export const replaceAllChannels = createServerFn({ method: "POST" })
  .validator((d) => ReplaceAllInput.parse(d))
  .handler(async ({ data }) => {
    if (usingMemory()) {
      _mem.map.clear();
      data.rows.forEach((c, idx) => {
        const row = { ...c, order: c.order ?? idx } as Channel;
        _mem.map.set(row.id, row);
      });
      _mem.seeded = true;
      return { ok: true, count: _mem.map.size };
    }
    const col = await channelsCol();
    await col.deleteMany({});
    const docs = data.rows.map((c, idx) => ({ ...c, order: c.order ?? idx }) as Channel);
    if (docs.length) await col.insertMany(docs, { ordered: false });
    return { ok: true, count: docs.length };
  });

export const importChannels = createServerFn({ method: "POST" })
  .validator((d) => ImportInput.parse(d))
  .handler(async ({ data }) => {
    if (usingMemory()) {
      memSeed();
      let added = 0;
      let skipped = 0;
      for (const r of data.rows) {
        if ([..._mem.map.values()].some((c) => c.url === r.url)) {
          skipped++;
          continue;
        }
        const id = `imp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        _mem.map.set(id, {
          id,
          name: r.name,
          group: r.group as ChannelGroup,
          logo: r.logo ?? "",
          url: r.url,
          fallbackUrl: r.fallbackUrl ?? null,
          featured: !!r.featured,
          order: memNextOrder(),
        });
        added++;
      }
      return { ok: true, added, skipped };
    }
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
      const last = await col.find({}, { projection: { order: 1 } })
        .sort({ order: -1 }).limit(1).toArray();
      const order = (last[0]?.order ?? 0) + 1;
      await col.insertOne({
        id,
        name: r.name,
        group: r.group as ChannelGroup,
        logo: r.logo ?? "",
        url: r.url,
        fallbackUrl: r.fallbackUrl ?? null,
        featured: !!r.featured,
        order,
      });
      added++;
    }
    return { ok: true, added, skipped };
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
      if (usingMemory()) {
        memSeed();
        return {
          ok: true,
          channelCount: _mem.map.size,
          activeSessions: _activeSessions,
          reason: "in-memory",
        };
      }
      const c = await getClient();
      const db: Db = c.db(DB_NAME);
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
