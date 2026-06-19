// Server-only MongoDB client singleton.
// The `.server.ts` suffix prevents Vite from bundling this file into the
// client — values here never reach the browser.
//
// Why a global singleton? Vercel serverless functions can spin up many
// isolated instances per region. Caching the MongoClient on `globalThis`
// reuses the TCP connection across warm invocations and avoids exhausting
// the Atlas connection pool.
//
// Required env: MONGODB_URI (e.g. mongodb+srv://user:pass@cluster0.xx.mongodb.net)
// Optional:      MONGODB_DB (default: "wc2026")
// We also accept common aliases such as DATABASE_URL and MONGODB_URL so a
// Vercel deployment keeps working even if the env name differs from local.

import { createRequire } from "node:module";

const DEFAULT_DB = "wc2026";
const require = createRequire(import.meta.url);

const MONGO_URI_KEYS = ["MONGODB_URI", "DATABASE_URL", "MONGODB_URL", "MONGO_URL"] as const;
const MONGO_DB_KEYS = ["MONGODB_DB", "DATABASE_NAME", "MONGO_DB"] as const;

function readEnv(keys: readonly string[]): string | undefined {
  for (const key of keys) {
    const raw = process.env[key];
    if (!raw) continue;
    const value = raw.trim();
    if (!value) continue;
    return value.replace(/^['\"]|['\"]$/g, "");
  }
  return undefined;
}

export function getMongoUri(): string {
  const uri = readEnv(MONGO_URI_KEYS);
  if (!uri) {
    throw new Error(
      "MongoDB connection string is not configured. Set MONGODB_URI (or DATABASE_URL / MONGODB_URL) in Vercel project env vars.",
    );
  }
  return uri;
}

export function getMongoDbName(): string {
  return readEnv(MONGO_DB_KEYS) || DEFAULT_DB;
}

declare global {
  // eslint-disable-next-line no-var
  var __mongoClient: import("mongodb").MongoClient | undefined;
  // eslint-disable-next-line no-var
  var __mongoConnectedAt: number | undefined;
}

let connecting: Promise<import("mongodb").MongoClient> | null = null;

async function createClient(): Promise<import("mongodb").MongoClient> {
  const { MongoClient, ServerApiVersion } = require("mongodb") as typeof import("mongodb");
  const uri = getMongoUri();
  const client = new MongoClient(uri, {
    maxPoolSize: 10,
    // Increased timeouts for Vercel serverless cold starts
    serverSelectionTimeoutMS: 15_000,
    connectTimeoutMS: 15_000,
    socketTimeoutMS: 30_000,
    appName: "wc2026-companion",
    serverApi: {
      version: ServerApiVersion.v1,
      // strict: false so that additional commands work on Vercel
      strict: false,
      deprecationErrors: false,
    },
    // TLS is always required by Atlas; make it explicit
    tls: true,
  });
  return client.connect();
}

/**
 * Returns a connected MongoClient. The client is cached on `globalThis`
 * so Vercel warm invocations reuse the same TCP connection.
 */
export async function getMongoClient(): Promise<import("mongodb").MongoClient> {
  // If we have a cached client, verify it's still alive before returning
  if (globalThis.__mongoClient) {
    try {
      await globalThis.__mongoClient.db("admin").command({ ping: 1 });
      return globalThis.__mongoClient;
    } catch {
      // stale connection – reconnect
      globalThis.__mongoClient = undefined;
      connecting = null;
    }
  }
  if (!connecting) {
    connecting = createClient()
      .then((c) => {
        globalThis.__mongoClient = c;
        globalThis.__mongoConnectedAt = Date.now();
        return c;
      })
      .catch((err) => {
        connecting = null; // allow retry next request
        throw err;
      });
  }
  return connecting;
}

/** Returns the default database handle. */
export async function getDb(): Promise<import("mongodb").Db> {
  const c = await getMongoClient();
  return c.db(getMongoDbName());
}

/** Cheap reachability check used by the admin dashboard status card. */
export async function pingMongo(): Promise<{
  ok: boolean;
  latencyMs?: number;
  reason?: string;
}> {
  try {
    const c = await getMongoClient();
    const t0 = Date.now();
    await c.db(getMongoDbName()).command({ ping: 1 });
    return { ok: true, latencyMs: Date.now() - t0 };
  } catch (e) {
    return {
      ok: false,
      reason: e instanceof Error ? e.message : String(e),
    };
  }
}
