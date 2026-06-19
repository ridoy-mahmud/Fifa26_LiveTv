import { createServerFn } from "@tanstack/react-start";
import { getDb } from "@/lib/mongo.server";
import { DEFAULT_CHANNELS, type Channel } from "@/lib/channels-data";
import { MATCHES, TEAMS, type Match, type Team } from "@/lib/worldcup-data";

/**
 * Seed the database if empty.
 *
 * Populates the following collections from the bundled defaults:
 *   - channels : DEFAULT_CHANNELS (from @/lib/channels-data)
 *   - teams    : TEAMS          (from @/lib/worldcup-data)
 *   - matches  : MATCHES        (from @/lib/worldcup-data)
 *
 * Admin auth is cookie-based (see admin-auth.functions.ts) — there is no
 * admins collection to seed.
 *
 * Returns:
 *   { channels, teams, matches, admin }
 *     - each numeric field is the number of documents inserted (0 if the
 *       collection was already populated)
 *     - admin is always `false` (kept for backward compatibility with the
 *       admin dashboard seed message)
 *
 * Requires MONGODB_URI. Without it the function throws so the UI can show
 * the underlying error. The admin UI uses this for one-click bootstrap.
 */
export interface SeedResult {
  channels: number;
  teams: number;
  matches: number;
  admin: boolean;
}

const COL_CHANNELS = "channels";
const COL_TEAMS = "teams";
const COL_MATCHES = "matches";

export const seedIfEmpty = createServerFn({ method: "POST" }).handler(
  async (): Promise<SeedResult> => {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not configured");
    }
    const db = await getDb();

    // Channels
    const channelsCol = db.collection<Channel>(COL_CHANNELS);
    const existingChannels = await channelsCol.estimatedDocumentCount();
    let insertedChannels = 0;
    if (existingChannels === 0 && DEFAULT_CHANNELS.length > 0) {
      const res = await channelsCol.insertMany(DEFAULT_CHANNELS, {
        ordered: false,
      });
      insertedChannels = res.insertedCount;
      // Ensure the `id` field is uniquely indexed so future upserts are fast
      // and the seed itself can be re-run idempotently.
      await channelsCol.createIndex({ id: 1 }, { unique: true });
    }

    // Teams
    const teamsCol = db.collection<Team>(COL_TEAMS);
    const existingTeams = await teamsCol.estimatedDocumentCount();
    let insertedTeams = 0;
    if (existingTeams === 0 && TEAMS.length > 0) {
      const res = await teamsCol.insertMany(TEAMS, { ordered: false });
      insertedTeams = res.insertedCount;
      await teamsCol.createIndex({ code: 1 }, { unique: true });
    }

    // Matches
    const matchesCol = db.collection<Match>(COL_MATCHES);
    const existingMatches = await matchesCol.estimatedDocumentCount();
    let insertedMatches = 0;
    if (existingMatches === 0 && MATCHES.length > 0) {
      const res = await matchesCol.insertMany(MATCHES, { ordered: false });
      insertedMatches = res.insertedCount;
      await matchesCol.createIndex({ id: 1 }, { unique: true });
      await matchesCol.createIndex({ date: 1 });
    }

    return {
      channels: insertedChannels,
      teams: insertedTeams,
      matches: insertedMatches,
      admin: false,
    };
  },
);
