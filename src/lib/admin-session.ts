// Tiny client-side admin session (sessionStorage). Backed by server auth, but stored
// locally so route guards work without re-querying. Token format is intentionally opaque.
const KEY = "wc2026.admin.session.v1";

export function setAdminSession(token: string) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(KEY, token);
  window.dispatchEvent(new CustomEvent("admin:changed"));
}

export function clearAdminSession() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(KEY);
  window.dispatchEvent(new CustomEvent("admin:changed"));
}

export function getAdminSession(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(KEY);
}

export function isAdmin(): boolean {
  return !!getAdminSession();
}
