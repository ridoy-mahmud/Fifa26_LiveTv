import { T as TSS_SERVER_FUNCTION, c as createServerFn } from "./server-CWPfp1hj.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
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
var createServerRpc = (serverFnMeta, splitImportFn) => {
  const url = "/_serverFn/" + serverFnMeta.id;
  return Object.assign(splitImportFn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const LoginInput = objectType({
  email: stringType().email().max(255),
  password: stringType().min(1).max(200)
});
function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}
const adminLogin_createServerFn_handler = createServerRpc({
  id: "89f029f4fc21ed092423cd54f44fb61078423691288a3a89663a6e0973cd86ea",
  name: "adminLogin",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminLogin.__executeServer(opts));
const adminLogin = createServerFn({
  method: "POST"
}).inputValidator((d) => LoginInput.parse(d)).handler(adminLogin_createServerFn_handler, async ({
  data
}) => {
  const email = process.env.ADMIN_EMAIL || "mahamulhasan38@gmail.com";
  const password = process.env.ADMIN_PASSWORD || "Ridoy007@#";
  const ok = timingSafeEqual(data.email.toLowerCase(), email.toLowerCase()) && timingSafeEqual(data.password, password);
  if (!ok) {
    throw new Error("Invalid credentials");
  }
  const token = "adm_" + Math.random().toString(36).slice(2) + Date.now().toString(36) + Math.random().toString(36).slice(2);
  return {
    token
  };
});
export {
  adminLogin_createServerFn_handler
};
