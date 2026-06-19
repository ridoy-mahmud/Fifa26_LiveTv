import { c as createServerRpc, g as getMongoClient, a as getMongoDbName, b as getDb } from "./mongo.server-0kwAj1G6.mjs";
import { c as createServerFn } from "./index.mjs";
import { A as ALL_GROUPS, M as MATCHES, T as TEAMS } from "./worldcup-data-CJq_BX3J.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, n as numberType, b as booleanType, s as stringType, e as enumType, a as arrayType } from "../_libs/zod.mjs";
import "node:os";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
const COL_CHANNELS = "channels";
const COL_MATCHES = "matches";
const COL_TEAMS = "teams";
const ChannelInput = objectType({
  id: stringType().min(1),
  name: stringType().min(1),
  group: enumType(ALL_GROUPS),
  logo: stringType().optional().default(""),
  url: stringType().min(1),
  fallbackUrl: stringType().optional(),
  featured: booleanType().optional().default(false),
  order: numberType().int().optional()
});
const ChannelPatch = objectType({
  id: stringType().min(1),
  name: stringType().min(1).optional(),
  group: enumType(ALL_GROUPS).optional(),
  logo: stringType().optional(),
  url: stringType().min(1).optional(),
  fallbackUrl: stringType().optional(),
  featured: booleanType().optional(),
  order: numberType().int().optional()
});
const IdsInput = objectType({
  orderedIds: arrayType(stringType().min(1))
});
const ReplaceAllInput = objectType({
  rows: arrayType(ChannelInput)
});
const ImportInput = objectType({
  rows: arrayType(objectType({
    name: stringType().min(1),
    group: enumType(ALL_GROUPS),
    logo: stringType().optional().default(""),
    url: stringType().min(1),
    fallbackUrl: stringType().optional(),
    featured: booleanType().optional().default(false)
  }))
});
let _clientPromise = null;
async function getDbHandle() {
  if (!_clientPromise) _clientPromise = getDb();
  return _clientPromise;
}
async function channelsCol() {
  const db = await getDbHandle();
  return db.collection(COL_CHANNELS);
}
async function matchesCol() {
  const db = await getDbHandle();
  return db.collection(COL_MATCHES);
}
async function teamsCol() {
  const db = await getDbHandle();
  return db.collection(COL_TEAMS);
}
const listChannels_createServerFn_handler = createServerRpc({
  id: "a4d3d836b2ec5bb18595e71927da1043708e773f21a27e8c78ac3b045561cb92",
  name: "listChannels",
  filename: "src/lib/api/channels.functions.ts"
}, (opts) => listChannels.__executeServer(opts));
const listChannels = createServerFn({
  method: "GET"
}).handler(listChannels_createServerFn_handler, async () => {
  const col = await channelsCol();
  return col.find({}, {
    projection: {
      _id: 0
    }
  }).sort({
    order: 1
  }).toArray();
});
const upsertChannel_createServerFn_handler = createServerRpc({
  id: "b64bc6ca3288aee8e0155452ab066f5313a726a471dcca2309979b41aad835d6",
  name: "upsertChannel",
  filename: "src/lib/api/channels.functions.ts"
}, (opts) => upsertChannel.__executeServer(opts));
const upsertChannel = createServerFn({
  method: "POST"
}).validator((d) => ChannelInput.parse(d)).handler(upsertChannel_createServerFn_handler, async ({
  data
}) => {
  const incoming = data;
  const col = await channelsCol();
  const existing = await col.findOne({
    id: incoming.id
  });
  let newOrder = incoming.order;
  if (newOrder === void 0) {
    if (existing?.order !== void 0) {
      newOrder = existing.order;
    } else {
      const last = await col.find({}, {
        projection: {
          order: 1
        }
      }).sort({
        order: -1
      }).limit(1).toArray();
      newOrder = (last[0]?.order ?? 0) + 1;
    }
  }
  const merged = {
    ...incoming,
    group: incoming.group,
    order: newOrder
  };
  await col.replaceOne({
    id: incoming.id
  }, merged, {
    upsert: true
  });
  return {
    ok: true,
    channel: merged
  };
});
const patchChannel_createServerFn_handler = createServerRpc({
  id: "44e3db047e42fd4696efb5a8651409a2b9c34e0bbb4006866523d2eb80d0a06c",
  name: "patchChannel",
  filename: "src/lib/api/channels.functions.ts"
}, (opts) => patchChannel.__executeServer(opts));
const patchChannel = createServerFn({
  method: "POST"
}).validator((d) => ChannelPatch.parse(d)).handler(patchChannel_createServerFn_handler, async ({
  data
}) => {
  const col = await channelsCol();
  const cur = await col.findOne({
    id: data.id
  });
  if (!cur) throw new Error(`Channel not found: ${data.id}`);
  const {
    id: _ignore,
    fallbackUrl,
    ...rest
  } = data;
  const next = {
    ...cur,
    ...rest,
    fallbackUrl: fallbackUrl ?? cur.fallbackUrl,
    group: data.group ?? cur.group
  };
  await col.replaceOne({
    id: data.id
  }, next);
  return {
    ok: true,
    channel: next
  };
});
const toggleFeatured_createServerFn_handler = createServerRpc({
  id: "2e815e0d02eccf425172a4e87c131b25a0720e19cb4706bae13ebd6d21a5ed78",
  name: "toggleFeatured",
  filename: "src/lib/api/channels.functions.ts"
}, (opts) => toggleFeatured.__executeServer(opts));
const toggleFeatured = createServerFn({
  method: "POST"
}).validator((d) => objectType({
  id: stringType().min(1)
}).parse(d)).handler(toggleFeatured_createServerFn_handler, async ({
  data
}) => {
  const col = await channelsCol();
  const cur = await col.findOne({
    id: data.id
  });
  if (!cur) throw new Error(`Channel not found: ${data.id}`);
  const next = {
    ...cur,
    featured: !cur.featured
  };
  await col.replaceOne({
    id: data.id
  }, next);
  return {
    ok: true,
    channel: next
  };
});
const deleteChannel_createServerFn_handler = createServerRpc({
  id: "885d71df7f59db4c5aad3feb4660cedbabb379054c28cb66f294a6c56f0961b2",
  name: "deleteChannel",
  filename: "src/lib/api/channels.functions.ts"
}, (opts) => deleteChannel.__executeServer(opts));
const deleteChannel = createServerFn({
  method: "POST"
}).validator((d) => objectType({
  id: stringType().min(1)
}).parse(d)).handler(deleteChannel_createServerFn_handler, async ({
  data
}) => {
  const col = await channelsCol();
  await col.deleteOne({
    id: data.id
  });
  return {
    ok: true
  };
});
const reorderChannels_createServerFn_handler = createServerRpc({
  id: "044c5c43fb51f439091dec031369c9b2618383d2a6da4d4ffbafc6cd49769e10",
  name: "reorderChannels",
  filename: "src/lib/api/channels.functions.ts"
}, (opts) => reorderChannels.__executeServer(opts));
const reorderChannels = createServerFn({
  method: "POST"
}).validator((d) => IdsInput.parse(d)).handler(reorderChannels_createServerFn_handler, async ({
  data
}) => {
  const col = await channelsCol();
  await Promise.all(data.orderedIds.map((id, idx) => col.updateOne({
    id
  }, {
    $set: {
      order: idx
    }
  })));
  return {
    ok: true
  };
});
const replaceAllChannels_createServerFn_handler = createServerRpc({
  id: "614a55c1a8ef8c1d548e6b6f99714d7ce9c0202eebbbf07b8f398eb1e4dce871",
  name: "replaceAllChannels",
  filename: "src/lib/api/channels.functions.ts"
}, (opts) => replaceAllChannels.__executeServer(opts));
const replaceAllChannels = createServerFn({
  method: "POST"
}).validator((d) => ReplaceAllInput.parse(d)).handler(replaceAllChannels_createServerFn_handler, async ({
  data
}) => {
  const col = await channelsCol();
  await col.deleteMany({});
  const docs = data.rows.map((c, idx) => ({
    ...c,
    order: c.order ?? idx
  }));
  if (docs.length) await col.insertMany(docs, {
    ordered: false
  });
  return {
    ok: true,
    count: docs.length
  };
});
const importChannels_createServerFn_handler = createServerRpc({
  id: "86e14cfe6762e92d796d752b59cec0f253a5f9727f3283b4d72fee4cfef6edc1",
  name: "importChannels",
  filename: "src/lib/api/channels.functions.ts"
}, (opts) => importChannels.__executeServer(opts));
const importChannels = createServerFn({
  method: "POST"
}).validator((d) => ImportInput.parse(d)).handler(importChannels_createServerFn_handler, async ({
  data
}) => {
  const col = await channelsCol();
  let added = 0;
  let skipped = 0;
  for (const r of data.rows) {
    const exists = await col.findOne({
      url: r.url
    });
    if (exists) {
      skipped++;
      continue;
    }
    const id = `imp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const last = await col.find({}, {
      projection: {
        order: 1
      }
    }).sort({
      order: -1
    }).limit(1).toArray();
    const order = (last[0]?.order ?? 0) + 1;
    await col.insertOne({
      id,
      name: r.name,
      group: r.group,
      logo: r.logo ?? "",
      url: r.url,
      fallbackUrl: r.fallbackUrl ?? void 0,
      featured: !!r.featured,
      order
    });
    added++;
  }
  return {
    ok: true,
    added,
    skipped
  };
});
const listMatches_createServerFn_handler = createServerRpc({
  id: "4f50a6fd1428ed49ce9a72f40ff4cd5948db4a5c46e768f8cf7ef21d8ca9ed1a",
  name: "listMatches",
  filename: "src/lib/api/channels.functions.ts"
}, (opts) => listMatches.__executeServer(opts));
const listMatches = createServerFn({
  method: "GET"
}).handler(listMatches_createServerFn_handler, async () => {
  try {
    const col = await matchesCol();
    const count = await col.estimatedDocumentCount();
    if (count === 0) return MATCHES;
    return col.find({}, {
      projection: {
        _id: 0
      }
    }).toArray();
  } catch {
    return MATCHES;
  }
});
const listTeams_createServerFn_handler = createServerRpc({
  id: "ed2f19cf3696be8f208607eda59418183a49b316debb90f42feda95f734ad234",
  name: "listTeams",
  filename: "src/lib/api/channels.functions.ts"
}, (opts) => listTeams.__executeServer(opts));
const listTeams = createServerFn({
  method: "GET"
}).handler(listTeams_createServerFn_handler, async () => {
  try {
    const col = await teamsCol();
    const count = await col.estimatedDocumentCount();
    if (count === 0) return TEAMS;
    return col.find({}, {
      projection: {
        _id: 0
      }
    }).toArray();
  } catch {
    return TEAMS;
  }
});
const IdInput = objectType({
  id: stringType().min(1)
});
const getMatchById_createServerFn_handler = createServerRpc({
  id: "a4f5f49fc2d6c87836a81659ac558896ffeec8946d9cd025ddee9808d2853953",
  name: "getMatchById",
  filename: "src/lib/api/channels.functions.ts"
}, (opts) => getMatchById.__executeServer(opts));
const getMatchById = createServerFn({
  method: "GET"
}).validator((d) => IdInput.parse(d)).handler(getMatchById_createServerFn_handler, async ({
  data
}) => {
  try {
    const col = await matchesCol();
    const found = await col.findOne({
      id: data.id
    }, {
      projection: {
        _id: 0
      }
    });
    if (found) return {
      match: found
    };
  } catch {
  }
  const match = MATCHES.find((m) => m.id === data.id) ?? null;
  return {
    match
  };
});
let _activeSessions = 0;
const getMongoStatus_createServerFn_handler = createServerRpc({
  id: "6a5d1c579e0c5f653528260f2a8441d75ad8eec1dbaf5715f3caedb6ef47078c",
  name: "getMongoStatus",
  filename: "src/lib/api/channels.functions.ts"
}, (opts) => getMongoStatus.__executeServer(opts));
const getMongoStatus = createServerFn({
  method: "GET"
}).handler(getMongoStatus_createServerFn_handler, async () => {
  try {
    const c = await getMongoClient();
    const db = c.db(getMongoDbName());
    const channelCount = await db.collection(COL_CHANNELS).countDocuments();
    return {
      ok: true,
      channelCount,
      activeSessions: _activeSessions
    };
  } catch (e) {
    return {
      ok: false,
      channelCount: 0,
      activeSessions: 0,
      reason: e instanceof Error ? e.message : "unknown"
    };
  }
});
export {
  deleteChannel_createServerFn_handler,
  getMatchById_createServerFn_handler,
  getMongoStatus_createServerFn_handler,
  importChannels_createServerFn_handler,
  listChannels_createServerFn_handler,
  listMatches_createServerFn_handler,
  listTeams_createServerFn_handler,
  patchChannel_createServerFn_handler,
  reorderChannels_createServerFn_handler,
  replaceAllChannels_createServerFn_handler,
  toggleFeatured_createServerFn_handler,
  upsertChannel_createServerFn_handler
};
