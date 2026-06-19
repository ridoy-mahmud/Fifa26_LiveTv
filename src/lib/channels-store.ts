// Client-side channel hooks backed by the MongoDB server functions.
// Replaces the previous localStorage-only store; admin edits now go
// straight to the DB and the public `/live` page reads the same
// canonical source.
//
// The store still exports the same `useChannels()` API so consumers
// (`/live`, `ChannelList`) keep working without changes. Admin-only
// mutation helpers live alongside and are called from `/admin`.

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useMemo } from "react";
import {
  deleteChannel,
  importChannels,
  listChannels,
  patchChannel,
  replaceAllChannels,
  reorderChannels,
  toggleFeatured as toggleFeaturedFn,
  upsertChannel,
} from "@/lib/api/channels.functions";
import {
  DEFAULT_CHANNELS,
  type Channel,
  type ChannelGroup,
} from "./channels-data";

export const channelsQueryKey = ["channels"] as const;

// ── Public read hook ───────────────────────────────────────────────────────
export function useChannels() {
  const fetch = useServerFn(listChannels);
  const query = useQuery({
    queryKey: channelsQueryKey,
    queryFn: () => fetch(),
    staleTime: 30_000,
  });
  const channels = useMemo<Channel[]>(
    () => query.data ?? DEFAULT_CHANNELS,
    [query.data],
  );
  return { channels, isLoading: query.isLoading, isError: query.isError, refetch: query.refetch };
}

// ── Admin mutation hooks ───────────────────────────────────────────────────
export function useChannelMutations() {
  const qc = useQueryClient();
  const upsertFn = useServerFn(upsertChannel);
  const patchFn = useServerFn(patchChannel);
  const toggleFn = useServerFn(toggleFeaturedFn);
  const delFn = useServerFn(deleteChannel);
  const reorderFn = useServerFn(reorderChannels);
  const replaceAllFn = useServerFn(replaceAllChannels);
  const importFn = useServerFn(importChannels);

  const invalidate = useCallback(() => qc.invalidateQueries({ queryKey: channelsQueryKey }), [qc]);

  const upsert = useMutation({
    mutationFn: (c: Channel) => upsertFn({ data: c }),
    onSuccess: invalidate,
  });

  const patch = useMutation({
    mutationFn: (c: Partial<Channel> & { id: string }) => patchFn({ data: c }),
    onSuccess: invalidate,
  });

  const toggleFeatured = useMutation({
    mutationFn: (id: string) => toggleFn({ data: { id } }),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: string) => delFn({ data: { id } }),
    onSuccess: invalidate,
  });

  const reorder = useMutation({
    mutationFn: (orderedIds: string[]) => reorderFn({ data: { orderedIds } }),
    onSuccess: invalidate,
  });

  const reset = useMutation({
    mutationFn: () => replaceAllFn({ data: { rows: DEFAULT_CHANNELS } }),
    onSuccess: invalidate,
  });

  const importMany = useMutation({
    mutationFn: (rows: Partial<Channel>[]) =>
      importFn({
        data: {
          rows: rows
            .filter((r) => r.url && r.name)
            .map((r) => ({
              name: r.name as string,
              group: ((r.group as ChannelGroup) ?? "Sports") as ChannelGroup,
              logo: r.logo ?? "",
              url: r.url as string,
              fallbackUrl: r.fallbackUrl ?? null,
              featured: !!r.featured,
            })),
        },
      }),
    onSuccess: invalidate,
  });

  return { upsert, patch, toggleFeatured, remove, reorder, reset, importMany, invalidate };
}

// ── CSV parser (unchanged) ────────────────────────────────────────────────
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
