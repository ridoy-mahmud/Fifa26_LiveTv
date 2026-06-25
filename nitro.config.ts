import { defineNitroConfig } from "nitro/config";

export default defineNitroConfig({
  preset: "vercel",
  // Externalize MongoDB to prevent bundling issues with native modules
  external: ["mongodb", "@mongodb-js/zstd", "@mongodb-js/snappy", "bson"],
});
