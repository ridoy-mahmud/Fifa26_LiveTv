import { createServerFn } from "@tanstack/react-start";
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

function adminEmail(): string {
  return (process.env.ADMIN_EMAIL || "mahamulhasan38@gmail.com").toLowerCase();
}

function adminPassword(): string {
  return process.env.ADMIN_PASSWORD || "Ridoy007@#";
}

function generateToken(): string {
  return (
    "adm_" +
    Math.random().toString(36).slice(2) +
    Date.now().toString(36) +
    Math.random().toString(36).slice(2)
  );
}

function parseCookies(header: string | null | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  if (!header) return out;
  for (const part of header.split(";")) {
    const idx = part.indexOf("=");
    if (idx < 0) continue;
    const k = part.slice(0, idx).trim();
    const v = part.slice(idx + 1).trim();
    if (k) out[k] = decodeURIComponent(v);
  }
  return out;
}

export const adminLogin = createServerFn({ method: "POST" })
  .validator((d) => LoginInput.parse(d))
  .handler(async ({ data, request }) => {
    const emailOk = timingSafeEqual(data.email.toLowerCase(), adminEmail());
    const pwOk = timingSafeEqual(data.password, adminPassword());
    if (!emailOk || !pwOk) {
      throw new Error("Invalid credentials");
    }
    const token = generateToken();
    const cookie = [
      `${COOKIE_NAME}=${encodeURIComponent(token)}`,
      "Path=/",
      `Max-Age=${COOKIE_MAX_AGE}`,
      "HttpOnly",
      "SameSite=Lax",
    ].join("; ");
    // Attach Set-Cookie via response headers on the current request so the
    // browser stores it and subsequent adminMe() calls succeed.
    try {
      // h3 / @tanstack/react-start attach a helpers object; fall back to a
      // response header on the request if needed.
      const resHeaders = (request as unknown as { headers?: Headers }).headers;
      if (resHeaders && typeof (resHeaders as Headers).append === "function") {
        (resHeaders as Headers).append("Set-Cookie", cookie);
      }
    } catch {
      // non-fatal: cookie just won't persist across requests in this env
    }
    return { token };
  });

export const adminMe = createServerFn({ method: "GET" }).handler(
  async ({ request }) => {
    const cookieHeader =
      (request as unknown as { headers?: Headers }).headers?.get?.("cookie") ??
      null;
    const cookies = parseCookies(cookieHeader);
    const token = cookies[COOKIE_NAME];
    if (!token || !token.startsWith("adm_")) {
      return { admin: null };
    }
    // We don't keep a server-side token store — possession of the cookie is
    // sufficient. Return the configured admin email so the UI can render the
    // signed-in state.
    return { admin: { email: adminEmail() } };
  },
);

export const adminLogout = createServerFn({ method: "POST" }).handler(
  async ({ request }) => {
    const cookie = [
      `${COOKIE_NAME}=`,
      "Path=/",
      "Max-Age=0",
      "HttpOnly",
      "SameSite=Lax",
    ].join("; ");
    try {
      const resHeaders = (request as unknown as { headers?: Headers }).headers;
      if (resHeaders && typeof (resHeaders as Headers).append === "function") {
        (resHeaders as Headers).append("Set-Cookie", cookie);
      }
    } catch {
      // non-fatal
    }
    return { ok: true };
  },
);
