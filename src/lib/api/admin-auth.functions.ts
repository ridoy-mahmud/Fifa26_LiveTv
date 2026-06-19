import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie, deleteCookie } from "@tanstack/react-start/server";
import { z } from "zod";

/**
 * Server-side admin auth.
 *
 * - adminLogin  : POST { email, password } → sets an httpOnly `wc_admin` cookie
 *                 and returns { token }. Validates against ADMIN_EMAIL /
 *                 ADMIN_PASSWORD env vars, falling back to the seed defaults.
 * - adminMe     : reads the cookie and returns { admin: { email } } or
 *                 { admin: null }. Used by the client's React-Query to know
 *                 whether to render the signed-in vs signed-out UI.
 * - adminLogout : clears the cookie.
 *
 * The token is opaque and only meaningful server-side. Timing-safe equality is
 * used so login is not vulnerable to a side-channel timing attack.
 */

const COOKIE_NAME = "wc_admin";
const COOKIE_MAX_AGE = 60 * 60 * 8; // 8 hours

const LoginInput = z.object({
  email: z.string().email().max(255),
  password: z.string().min(1).max(200),
});

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

// Vite only injects env vars prefixed with VITE_ into the runtime, so
// ADMIN_EMAIL / ADMIN_PASSWORD from `.env` are NOT visible to server code
// unless we also check the VITE_ variants. We accept both: the VITE_
// prefixes are populated by Vite in dev/build; the unprefixed versions are
// populated by the production runtime (Vercel/Cloudflare) via process.env.
// Order: VITE_* → process.env → hard-coded fallback.
function adminEmail(): string {
  const fromVite = (import.meta as { env?: Record<string, string | undefined> }).env?.VITE_ADMIN_EMAIL;
  const fromRuntime = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env?.ADMIN_EMAIL;
  return (fromVite || fromRuntime || "mahamulhasan38@gmail.com").toLowerCase();
}

function adminPassword(): string {
  const fromVite = (import.meta as { env?: Record<string, string | undefined> }).env?.VITE_ADMIN_PASSWORD;
  const fromRuntime = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env?.ADMIN_PASSWORD;
  return fromVite || fromRuntime || "Ridoy007@#";
}

// One-time diagnostic so you can see exactly which env values the server
// is reading. Logged on first login attempt — only visible server-side.
// Gated to dev mode to keep production logs clean.
const isDev = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env?.NODE_ENV !== "production";
let _authDebugLogged = false;
function logAuthDebug() {
  if (!isDev || _authDebugLogged) return;
  _authDebugLogged = true;
  const src = {
    viteEmail: !!(import.meta as { env?: Record<string, unknown> }).env?.VITE_ADMIN_EMAIL,
    vitePassword: !!(import.meta as { env?: Record<string, unknown> }).env?.VITE_ADMIN_PASSWORD,
    procEmail: !!(globalThis as { process?: { env?: Record<string, unknown> } }).process?.env?.ADMIN_EMAIL,
    procPassword: !!(globalThis as { process?: { env?: Record<string, unknown> } }).process?.env?.ADMIN_PASSWORD,
  };
  // eslint-disable-next-line no-console
  console.log("[admin-auth] env sources:", JSON.stringify(src));
  // eslint-disable-next-line no-console
  console.log("[admin-auth] active email:", adminEmail(), "pw length:", adminPassword().length);
}

function generateToken(): string {
  return (
    "adm_" +
    Math.random().toString(36).slice(2) +
    Date.now().toString(36) +
    Math.random().toString(36).slice(2)
  );
}

export const adminLogin = createServerFn({ method: "POST" })
  .validator((d) => LoginInput.parse(d))
  .handler(async ({ data }) => {
    logAuthDebug();
    const cfgEmail = adminEmail();
    const cfgPw = adminPassword();
    const emailOk = timingSafeEqual(data.email.toLowerCase(), cfgEmail);
    const pwOk = timingSafeEqual(data.password, cfgPw);
    if (!emailOk || !pwOk) {
      if (isDev) {
        // Helpful server-side log for debugging — the client just gets a
        // generic message so we don't leak which field is wrong.
        // eslint-disable-next-line no-console
        console.log(
          "[admin-auth] login failed for:",
          data.email,
          "expected email:",
          cfgEmail,
          "pwLen:",
          cfgPw.length,
          "inputPwLen:",
          data.password.length,
        );
      }
      throw new Error("Invalid credentials");
    }
    const token = generateToken();
    // setCookie() writes to the response Set-Cookie header so the browser
    // stores the value and subsequent adminMe() calls succeed.
    setCookie(COOKIE_NAME, token, {
      path: "/",
      maxAge: COOKIE_MAX_AGE,
      httpOnly: true,
      sameSite: "lax",
    });
    return { token };
  });

export const adminMe = createServerFn({ method: "GET" }).handler(async () => {
  const token = getCookie(COOKIE_NAME);
  if (!token || !token.startsWith("adm_")) {
    return { admin: null };
  }
  // We don't keep a server-side token store — possession of the cookie is
  // sufficient. Return the configured admin email so the UI can render the
  // signed-in state.
  return { admin: { email: adminEmail() } };
});

export const adminLogout = createServerFn({ method: "POST" }).handler(
  async () => {
    deleteCookie(COOKIE_NAME, { path: "/" });
    return { ok: true };
  },
);
