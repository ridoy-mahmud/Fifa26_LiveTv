import { c as createServerRpc, d as getMongoUri, b as getDb } from "./mongo.server-0kwAj1G6.mjs";
import { c as createServerFn } from "./index.mjs";
import { D as DEFAULT_CHANNELS, T as TEAMS, M as MATCHES } from "./worldcup-data-CJq_BX3J.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
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
const COL_TEAMS = "teams";
const COL_MATCHES = "matches";
const seedIfEmpty_createServerFn_handler = createServerRpc({
  id: "0f0c0925c0faa0ca4f8965e7dd11a0bfbf21172124df463dc7fe074f12705c5d",
  name: "seedIfEmpty",
  filename: "src/lib/api/seed.functions.ts"
}, (opts) => seedIfEmpty.__executeServer(opts));
const seedIfEmpty = createServerFn({
  method: "POST"
}).handler(seedIfEmpty_createServerFn_handler, async () => {
  getMongoUri();
  const db = await getDb();
  const channelsCol = db.collection(COL_CHANNELS);
  const existingChannels = await channelsCol.estimatedDocumentCount();
  let insertedChannels = 0;
  if (existingChannels === 0 && DEFAULT_CHANNELS.length > 0) {
    const res = await channelsCol.insertMany(DEFAULT_CHANNELS, {
      ordered: false
    });
    insertedChannels = res.insertedCount;
    await channelsCol.createIndex({
      id: 1
    }, {
      unique: true
    });
  }
  const teamsCol = db.collection(COL_TEAMS);
  const existingTeams = await teamsCol.estimatedDocumentCount();
  let insertedTeams = 0;
  if (existingTeams === 0 && TEAMS.length > 0) {
    const res = await teamsCol.insertMany(TEAMS, {
      ordered: false
    });
    insertedTeams = res.insertedCount;
    await teamsCol.createIndex({
      code: 1
    }, {
      unique: true
    });
  }
  const matchesCol = db.collection(COL_MATCHES);
  const existingMatches = await matchesCol.estimatedDocumentCount();
  let insertedMatches = 0;
  if (existingMatches === 0 && MATCHES.length > 0) {
    const res = await matchesCol.insertMany(MATCHES, {
      ordered: false
    });
    insertedMatches = res.insertedCount;
    await matchesCol.createIndex({
      id: 1
    }, {
      unique: true
    });
    await matchesCol.createIndex({
      date: 1
    });
  }
  return {
    channels: insertedChannels,
    teams: insertedTeams,
    matches: insertedMatches,
    admin: false
  };
});
export {
  seedIfEmpty_createServerFn_handler
};
