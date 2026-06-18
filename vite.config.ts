// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Use default TanStack Start server configuration
  },
  // Pin the Nitro preset to Vercel so the build emits a `.vercel/output/`
  // directory that Vercel can serve. Without this, Nitro skips its Vercel
  // adapter and the deployment returns 404 NOT_FOUND at runtime.
  nitro: {
    preset: "vercel",
  },
});
