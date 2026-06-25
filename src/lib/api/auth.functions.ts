import { createServerFn } from "@tanstack/react-start";

const ADMIN_EMAIL = "mahamulhasan38@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

// Simple session-based authentication
// In production, use proper session management with cookies
let activeSession: { email: string; expiresAt: number } | null = null;
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

function isAllowedEmail(email: string) {
  return email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

function isSessionValid() {
  if (!activeSession) return false;
  return Date.now() < activeSession.expiresAt;
}

export const checkAuth = createServerFn({ method: "GET" })
  .handler(async () => {
    if (isSessionValid() && activeSession) {
      return {
        user: { email: activeSession.email },
        isAdmin: isAllowedEmail(activeSession.email),
      };
    }
    return { user: null, isAdmin: false };
  });

export const login = createServerFn({ method: "POST" })
  .validator((data: { email: string; password: string }) => data)
  .handler(async ({ data }) => {
    const { email, password } = data;

    if (!isAllowedEmail(email)) {
      return { success: false, error: `Use ${ADMIN_EMAIL} to access the admin panel.` };
    }

    if (password !== ADMIN_PASSWORD) {
      return { success: false, error: "Invalid password" };
    }

    activeSession = {
      email,
      expiresAt: Date.now() + SESSION_DURATION,
    };

    return { success: true, user: { email } };
  });

export const logout = createServerFn({ method: "POST" })
  .handler(async () => {
    activeSession = null;
    return { success: true };
  });
