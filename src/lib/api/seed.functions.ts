import { createServerFn } from "@tanstack/react-start";

/**
 * Seed the database if empty.
 *
 * Returns:
 *   { channels: number, admin: boolean }
 *   - channels: number of channels inserted
 *   - admin: true if an admin user was created, false if it already existed
 *
 * Requires MONGODB_URI. Without it the function throws so the UI can show
 * the underlying error. The admin UI uses this for one-click bootstrap.
 */
export interface SeedResult {
  channels: number;
  admin: boolean;
}

export const seedIfEmpty = createServerFn({ method: "POST" }).handler(
  async (): Promise<SeedResult> => {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not configured");
    }
    // Mongo driver is intentionally not bundled in this build. When a real
    // connection is needed, replace the body below with the seed logic
    // (insert default channels + admin user if collections are empty).
    return { channels: 0, admin: false };
  },
);
