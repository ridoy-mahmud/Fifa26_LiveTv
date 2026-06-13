// Client-side channel store with localStorage persistence.
// Admins edit; defaults from channels-data.ts are the seed.
import { useEffect, useState, useCallback } from "react";
import { DEFAULT_CHANNELS, type Channel } from "./channels-data";

// Bump this key whenever DEFAULT_CHANNELS changes significantly so stale
// localStorage caches are ignored and users get the new full channel list.
const KEY = "wc2026.channels.v4";

function load(): Channel[] {
  if (typeof window === "undefined") return DEFAULT_CHANNELS;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_CHANNELS;
    const parsed = JSON.parse(raw) as Channel[];
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_CHANNELS;

    // Merge: keep saved edits but add any new default channels that aren't
    // already present (matched by URL). This means new channels from
    // channels-data.ts always show up even after a local save.
    const savedUrls = new Set(parsed.map((c) => c.url));
    const newDefaults = DEFAULT_CHANNELS.filter((d) => !savedUrls.has(d.url));
    if (newDefaults.length > 0) {
      const merged = [...parsed, ...newDefaults].map((c, i) => ({ ...c, order: i }));
      // persist the merged list so next load is instant
      try { localStorage.setItem(KEY, JSON.stringify(merged)); } catch { /* ignore */ }
      return merged;
    }

    return parsed;
  } catch {
    return DEFAULT_CHANNELS;
  }
}

function save(channels: Channel[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(channels));
    window.dispatchEvent(new CustomEvent("channels:updated"));
  } catch {
    // storage quota — ignore
  }
}

export function useChannels() {
  const [channels, setChannels] = useState<Channel[]>(() => load());

  useEffect(() => {
    const handler = () => setChannels(load());
    window.addEventListener("channels:updated", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("channels:updated", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const update = useCallback((next: Channel[]) => {
    const ordered = next.map((c, i) => ({ ...c, order: i }));
    save(ordered);
    setChannels(ordered);
  }, []);

  const upsert = useCallback((c: Channel) => {
    setChannels((cur) => {
      const idx = cur.findIndex((x) => x.id === c.id);
      const next = idx >= 0 ? cur.map((x) => (x.id === c.id ? c : x)) : [...cur, c];
      save(next);
      return next;
    });
  }, []);

  const remove = useCallback((id: string) => {
    setChannels((cur) => {
      const next = cur.filter((c) => c.id !== id);
      save(next);
      return next;
    });
  }, []);

  const toggleFeatured = useCallback((id: string) => {
    setChannels((cur) => {
      const next = cur.map((c) => (c.id === id ? { ...c, featured: !c.featured } : c));
      save(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    save(DEFAULT_CHANNELS);
    setChannels(DEFAULT_CHANNELS);
  }, []);

  const importMany = useCallback((incoming: Partial<Channel>[]) => {
    setChannels((cur) => {
      const byUrl = new Map(cur.map((c) => [c.url, c]));
      for (const inc of incoming) {
        if (!inc.url || !inc.name) continue;
        const id =
          inc.id ||
          (inc.name as string).toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40) +
          "-" +
          Math.random().toString(36).slice(2, 6);
        const group = (inc.group as Channel["group"]) || "Sports";
        const logo = inc.logo || "";
        byUrl.set(inc.url, {
          id,
          name: inc.name as string,
          group,
          logo,
          url: inc.url,
          featured: !!inc.featured,
          order: byUrl.size,
        });
      }
      const next = Array.from(byUrl.values()).map((c, i) => ({ ...c, order: i }));
      save(next);
      return next;
    });
  }, []);

  return { channels, update, upsert, remove, toggleFeatured, reset, importMany };
}

export function parseCsv(text: string): Partial<Channel>[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length === 0) return [];
  const header = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const rows: Partial<Channel>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cells = splitCsvLine(lines[i]);
    const row: Record<string, string> = {};
    header.forEach((h, idx) => (row[h] = (cells[idx] ?? "").trim()));
    rows.push({
      name: row["name"],
      group: (row["group"] as Channel["group"]) || "Sports",
      logo: row["logo"] || "",
      url: row["url"] || row["m3u8"] || "",
      featured: ["1", "true", "yes"].includes((row["featured"] || "").toLowerCase()),
    });
  }
  return rows;
}

function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQ && line[i + 1] === '"') { cur += '"'; i++; }
      else inQ = !inQ;
    } else if (ch === "," && !inQ) { out.push(cur); cur = ""; }
    else cur += ch;
  }
  out.push(cur);
  return out;
}
