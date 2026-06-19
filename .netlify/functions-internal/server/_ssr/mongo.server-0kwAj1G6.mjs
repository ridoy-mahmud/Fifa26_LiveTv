import { T as TSS_SERVER_FUNCTION } from "./index.mjs";
import * as os from "node:os";
var createServerRpc = (serverFnMeta, splitImportFn) => {
  const url = "/_serverFn/" + serverFnMeta.id;
  return Object.assign(splitImportFn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const DEFAULT_DB = "wc2026";
const MONGO_URI_KEYS = ["MONGODB_URI", "DATABASE_URL", "MONGODB_URL", "MONGO_URL"];
const MONGO_DB_KEYS = ["MONGODB_DB", "DATABASE_NAME", "MONGO_DB"];
const MONGO_AUTH_SOURCE_KEYS = [
  "MONGODB_AUTH_SOURCE",
  "MONGO_AUTH_SOURCE",
  "DATABASE_AUTH_SOURCE"
];
function readEnv(keys) {
  for (const key of keys) {
    const raw = process.env[key];
    if (!raw) continue;
    const value = raw.trim();
    if (!value) continue;
    return value.replace(/^['\"]|['\"]$/g, "");
  }
  return void 0;
}
function normalizeMongoUri(rawUri) {
  const cleaned = rawUri.trim().replace(/^['\"]|['\"]$/g, "");
  try {
    const url = new URL(cleaned);
    if (url.username) {
      url.username = decodeURIComponent(url.username);
    }
    if (url.password) {
      url.password = decodeURIComponent(url.password);
    }
    if (!url.searchParams.has("authSource")) {
      url.searchParams.set("authSource", readEnv(MONGO_AUTH_SOURCE_KEYS) || "admin");
    }
    return url.toString();
  } catch {
    return cleaned;
  }
}
function getMongoUri() {
  const uri = readEnv(MONGO_URI_KEYS);
  if (!uri) {
    throw new Error(
      "MongoDB connection string is not configured. Set MONGODB_URI (or DATABASE_URL / MONGODB_URL) in Vercel project env vars."
    );
  }
  return normalizeMongoUri(uri);
}
function getMongoDbName() {
  return readEnv(MONGO_DB_KEYS) || DEFAULT_DB;
}
let connecting = null;
async function createClient() {
  const { MongoClient, ServerApiVersion } = await import("../_libs/mongodb.mjs").then(function(n) {
    return n.i;
  });
  const uri = getMongoUri();
  const client = new MongoClient(uri, {
    maxPoolSize: 10,
    // Increased timeouts for Vercel serverless cold starts
    serverSelectionTimeoutMS: 15e3,
    connectTimeoutMS: 15e3,
    socketTimeoutMS: 3e4,
    appName: "wc2026-companion",
    serverApi: {
      version: ServerApiVersion.v1,
      // strict: false so that additional commands work on Vercel
      strict: false,
      deprecationErrors: false
    },
    // TLS is always required by Atlas; make it explicit
    tls: true,
    authMechanism: "SCRAM-SHA-256",
    runtimeAdapters: {
      os: {
        release: os.release,
        platform: os.platform,
        arch: os.arch,
        type: os.type
      }
    }
  });
  return client.connect();
}
async function getMongoClient() {
  if (globalThis.__mongoClient) {
    try {
      await globalThis.__mongoClient.db("admin").command({ ping: 1 });
      return globalThis.__mongoClient;
    } catch {
      globalThis.__mongoClient = void 0;
      connecting = null;
    }
  }
  if (!connecting) {
    connecting = createClient().then((c) => {
      globalThis.__mongoClient = c;
      globalThis.__mongoConnectedAt = Date.now();
      return c;
    }).catch((err) => {
      connecting = null;
      throw err;
    });
  }
  return connecting;
}
async function getDb() {
  const c = await getMongoClient();
  return c.db(getMongoDbName());
}
export {
  getMongoDbName as a,
  getDb as b,
  createServerRpc as c,
  getMongoUri as d,
  getMongoClient as g
};
