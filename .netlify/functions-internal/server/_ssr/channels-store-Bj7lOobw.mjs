import { u as useQuery, a as useQueryClient, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { u as useServerFn } from "./useServerFn-DL2oePlL.mjs";
import { r as reactExports } from "../_libs/react.mjs";
import { b as listChannels, u as upsertChannel, p as patchChannel, t as toggleFeatured, d as deleteChannel, r as reorderChannels, e as replaceAllChannels, i as importChannels } from "./router-mYYr7CR_.mjs";
import { D as DEFAULT_CHANNELS } from "./worldcup-data-CJq_BX3J.mjs";
const channelsQueryKey = ["channels"];
function useChannels() {
  const fetch = useServerFn(listChannels);
  const query = useQuery({
    queryKey: channelsQueryKey,
    queryFn: () => fetch(),
    staleTime: 3e4
  });
  const channels = reactExports.useMemo(
    () => query.data ?? DEFAULT_CHANNELS,
    [query.data]
  );
  return { channels, isLoading: query.isLoading, isError: query.isError, refetch: query.refetch };
}
function useChannelMutations() {
  const qc = useQueryClient();
  const upsertFn = useServerFn(upsertChannel);
  const patchFn = useServerFn(patchChannel);
  const toggleFn = useServerFn(toggleFeatured);
  const delFn = useServerFn(deleteChannel);
  const reorderFn = useServerFn(reorderChannels);
  const replaceAllFn = useServerFn(replaceAllChannels);
  const importFn = useServerFn(importChannels);
  const invalidate = reactExports.useCallback(() => qc.invalidateQueries({ queryKey: channelsQueryKey }), [qc]);
  const upsert = useMutation({
    mutationFn: (c) => upsertFn({ data: c }),
    onSuccess: invalidate
  });
  const patch = useMutation({
    mutationFn: (c) => patchFn({ data: c }),
    onSuccess: invalidate
  });
  const toggleFeatured$1 = useMutation({
    mutationFn: (id) => toggleFn({ data: { id } }),
    onSuccess: invalidate
  });
  const remove = useMutation({
    mutationFn: (id) => delFn({ data: { id } }),
    onSuccess: invalidate
  });
  const reorder = useMutation({
    mutationFn: (orderedIds) => reorderFn({ data: { orderedIds } }),
    onSuccess: invalidate
  });
  const reset = useMutation({
    mutationFn: () => replaceAllFn({ data: { rows: DEFAULT_CHANNELS } }),
    onSuccess: invalidate
  });
  const importMany = useMutation({
    mutationFn: (rows) => importFn({
      data: {
        rows: rows.filter((r) => r.url && r.name).map((r) => ({
          name: r.name,
          group: r.group ?? "Sports",
          logo: r.logo ?? "",
          url: r.url,
          fallbackUrl: r.fallbackUrl ?? null,
          featured: !!r.featured
        }))
      }
    }),
    onSuccess: invalidate
  });
  return { upsert, patch, toggleFeatured: toggleFeatured$1, remove, reorder, reset, importMany, invalidate };
}
function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length === 0) return [];
  const header = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const cells = splitCsvLine(lines[i]);
    const row = {};
    header.forEach((h, idx) => row[h] = (cells[idx] ?? "").trim());
    rows.push({
      name: row["name"],
      group: row["group"] || "Sports",
      logo: row["logo"] || "",
      url: row["url"] || row["m3u8"] || "",
      featured: ["1", "true", "yes"].includes((row["featured"] || "").toLowerCase())
    });
  }
  return rows;
}
function splitCsvLine(line) {
  const out = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQ && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else inQ = !inQ;
    } else if (ch === "," && !inQ) {
      out.push(cur);
      cur = "";
    } else cur += ch;
  }
  out.push(cur);
  return out;
}
export {
  useChannelMutations as a,
  parseCsv as p,
  useChannels as u
};
