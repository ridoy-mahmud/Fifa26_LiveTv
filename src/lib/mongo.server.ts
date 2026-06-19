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

const DEFAULT_DB = "wc2026";

declare global {
  // eslint-disable-next-line no-var
  var __mongoClient: import("mongodb").MongoClient | undefined;
  // eslint-disable-next-line no-var
  var __mongoConnectedAt: number | undefined;
}

let connecting: Promise<import("mongodb").MongoClient> | null = null;

async function createClient(): Promise<import("mongodb").MongoClient> {
  const { MongoClient, ServerApiVersion } = await import("mongodb");
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "MONGODB_URI is not configured. Set it in .env (locally) and in Vercel project env vars.",
    );
  }
  const client = new MongoClient(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5_000,
    appName: "wc2026-companion",
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
  return client.connect();
}

/**
 * Returns a connected MongoClient. The client is cached on `globalThis`
 * so Vercel warm invocations reuse the same TCP connection.
 */
export async function getMongoClient(): Promise<import("mongodb").MongoClient> {
  if (globalThis.__mongoClient) return globalThis.__mongoClient;
  if (!connecting) {
    connecting = createClient().then((c) => {
      globalThis.__mongoClient = c;
      globalThis.__mongoConnectedAt = Date.now();
      return c;
    });
  }
  return connecting;
}

/** Returns the default database handle. */
export async function getDb(): Promise<import("mongodb").Db> {
  const c = await getMongoClient();
  return c.db(process.env.MONGODB_DB || DEFAULT_DB);
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
    await c.db(process.env.MONGODB_DB || DEFAULT_DB).command({ ping: 1 });
    return { ok: true, latencyMs: Date.now() - t0 };
  } catch (e) {
    return {
      ok: false,
      reason: e instanceof Error ? e.message : String(e),
    };
  }
}
