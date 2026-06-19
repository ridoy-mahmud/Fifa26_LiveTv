import { c as createServerRpc } from "./createServerRpc-wV0Vk4NU.mjs";
import { c as createServerFn, s as setCookie, d as getCookie, e as deleteCookie } from "./index.mjs";
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
const COOKIE_NAME = "wc_admin";
const COOKIE_MAX_AGE = 60 * 60 * 8;
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
function adminEmail() {
  const fromVite = "mahamulhasan38@gmail.com";
  globalThis.process?.env?.ADMIN_EMAIL;
  return fromVite.toLowerCase();
}
function adminPassword() {
  const fromVite = "Ridoy007@#";
  globalThis.process?.env?.ADMIN_PASSWORD;
  return fromVite;
}
const isDev = globalThis.process?.env?.NODE_ENV !== "production";
let _authDebugLogged = false;
function logAuthDebug() {
  if (!isDev || _authDebugLogged) return;
  _authDebugLogged = true;
  const src = {
    viteEmail: true,
    vitePassword: true,
    procEmail: !!globalThis.process?.env?.ADMIN_EMAIL,
    procPassword: !!globalThis.process?.env?.ADMIN_PASSWORD
  };
  console.log("[admin-auth] env sources:", JSON.stringify(src));
  console.log("[admin-auth] active email:", adminEmail(), "pw length:", adminPassword().length);
}
function generateToken() {
  return "adm_" + Math.random().toString(36).slice(2) + Date.now().toString(36) + Math.random().toString(36).slice(2);
}
const adminLogin_createServerFn_handler = createServerRpc({
  id: "20a78c18b0630a37383f6b8ccf6985fcaa46b2b7e5c8768b05a94d463c1ca324",
  name: "adminLogin",
  filename: "src/lib/api/admin-auth.functions.ts"
}, (opts) => adminLogin.__executeServer(opts));
const adminLogin = createServerFn({
  method: "POST"
}).validator((d) => LoginInput.parse(d)).handler(adminLogin_createServerFn_handler, async ({
  data
}) => {
  logAuthDebug();
  const cfgEmail = adminEmail();
  const cfgPw = adminPassword();
  const emailOk = timingSafeEqual(data.email.toLowerCase(), cfgEmail);
  const pwOk = timingSafeEqual(data.password, cfgPw);
  if (!emailOk || !pwOk) {
    if (isDev) {
      console.log("[admin-auth] login failed for:", data.email, "expected email:", cfgEmail, "pwLen:", cfgPw.length, "inputPwLen:", data.password.length);
    }
    throw new Error("Invalid credentials");
  }
  const token = generateToken();
  setCookie(COOKIE_NAME, token, {
    path: "/",
    maxAge: COOKIE_MAX_AGE,
    httpOnly: true,
    sameSite: "lax"
  });
  return {
    token
  };
});
const adminMe_createServerFn_handler = createServerRpc({
  id: "dd94d4a392bb45b7f791f816ec920c3a47ac3d254a29a721a9bee7d71f1abfd7",
  name: "adminMe",
  filename: "src/lib/api/admin-auth.functions.ts"
}, (opts) => adminMe.__executeServer(opts));
const adminMe = createServerFn({
  method: "GET"
}).handler(adminMe_createServerFn_handler, async () => {
  const token = getCookie(COOKIE_NAME);
  if (!token || !token.startsWith("adm_")) {
    return {
      admin: null
    };
  }
  return {
    admin: {
      email: adminEmail()
    }
  };
});
const adminLogout_createServerFn_handler = createServerRpc({
  id: "4557679850f5bc8eef8d2f67e1b26e8ea97f9dcabf61a11617b65e9ccf20d934",
  name: "adminLogout",
  filename: "src/lib/api/admin-auth.functions.ts"
}, (opts) => adminLogout.__executeServer(opts));
const adminLogout = createServerFn({
  method: "POST"
}).handler(adminLogout_createServerFn_handler, async () => {
  deleteCookie(COOKIE_NAME, {
    path: "/"
  });
  return {
    ok: true
  };
});
export {
  adminLogin_createServerFn_handler,
  adminLogout_createServerFn_handler,
  adminMe_createServerFn_handler
};
