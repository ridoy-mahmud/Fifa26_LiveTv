import { createFileRoute } from "@tanstack/react-router";
import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import {
  Plus,
  Trash2,
  Star,
  ArrowUp,
  ArrowDown,
  Upload,
  RotateCcw,
  Pencil,
  Search,
  Tv,
  X,
  Check,
  ChevronDown,
  GripVertical,
} from "lucide-react";
import { useChannels, useChannelMutations, parseCsv } from "@/lib/channels-store";
import { FALLBACK_LOGO, ALL_GROUPS, type Channel, type ChannelGroup } from "@/lib/channels-data";

const AdminAccessGate = lazy(() =>
  import("@/components/admin/AdminAccess.client").then((mod) => ({ default: mod.AdminAccessGate })),
);
const MongoStatusBar = lazy(() =>
  import("@/components/admin/AdminAccess.client").then((mod) => ({ default: mod.MongoStatusBar })),
);

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin — WC 2026" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: AdminPage,
});

type SortKey = "order" | "name" | "group";

function AdminPage() {
  const { channels, isLoading } = useChannels();
  const mutations = useChannelMutations();

  const [q, setQ] = useState("");
  const [groupFilter, setGroupFilter] = useState<ChannelGroup | "All" | "★ Top">("All");
  const [sortKey, setSortKey] = useState<SortKey>("order");
  const [sortAsc, setSortAsc] = useState(true);

  const filtered = useMemo(() => {
    let list = [...channels];
    if (groupFilter === "★ Top") list = list.filter((c) => c.featured);
    else if (groupFilter !== "All") list = list.filter((c) => c.group === groupFilter);
    if (q.trim()) {
      const n = q.toLowerCase();
      list = list.filter(
        (c) => c.name.toLowerCase().includes(n) || c.group.toLowerCase().includes(n),
      );
    }
    if (sortKey === "name") list.sort((a, b) => a.name.localeCompare(b.name) * (sortAsc ? 1 : -1));
    else if (sortKey === "group")
      list.sort((a, b) => a.group.localeCompare(b.group) * (sortAsc ? 1 : -1));
    else list.sort((a, b) => ((a.order ?? 0) - (b.order ?? 0)) * (sortAsc ? 1 : -1));
    return list;
  }, [channels, q, groupFilter, sortKey, sortAsc]);

  const totalFeatured = channels.filter((c) => c.featured).length;

  const moveInMaster = async (id: string, dir: -1 | 1) => {
    const idx = channels.findIndex((x) => x.id === id);
    const j = idx + dir;
    if (j < 0 || j >= channels.length) return;
    const next = [...channels];
    [next[idx], next[j]] = [next[j], next[idx]];
    await mutations.reorder.mutate(next.map((c) => c.id));
  };

  const onFile = async (file: File) => {
    const text = await file.text();
    if (file.name.endsWith(".csv")) {
      mutations.importMany.mutate(parseCsv(text));
    } else {
      try {
        const json = JSON.parse(text);
        const arr = Array.isArray(json) ? json : (json.channels ?? json.streams);
        if (!Array.isArray(arr)) throw new Error("Bad JSON");
        mutations.importMany.mutate(
          arr.map((r: Record<string, unknown>) => ({
            name: (r.name as string) ?? (r.channel_name as string) ?? "",
            group: (r.group as ChannelGroup) ?? "Sports",
            logo: (r.logo as string) ?? "",
            url: ((r.url as string) || (r.m3u8 as string) || (r.m3u8_url as string)) ?? "",
            featured: !!r.featured,
          })),
        );
      } catch {
        alert("Invalid JSON file");
      }
    }
  };

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc((v) => !v);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const SortBtn = ({ k, label }: { k: SortKey; label: string }) => (
    <button
      onClick={() => toggleSort(k)}
      className={`inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider transition ${sortKey === k ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
    >
      {label}
      <ChevronDown
        className={`h-3 w-3 transition-transform ${sortKey === k && !sortAsc ? "rotate-180" : ""}`}
      />
    </button>
  );

  return (
    <Suspense
      fallback={
        <div className="mx-auto flex min-h-[60vh] max-w-2xl items-center justify-center px-4 py-12">
          <div className="w-full rounded-2xl border border-border bg-card p-8 text-center shadow-card">
            <div className="text-sm text-muted-foreground">Loading admin panel…</div>
          </div>
        </div>
      }
    >
      <AdminAccessGate>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Admin</span>
          <h1 className="mt-1 font-display text-3xl font-bold sm:text-4xl">Channel manager</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            <span className="text-foreground font-semibold">{channels.length}</span> channels ·{" "}
            <span className="text-gold font-semibold">{totalFeatured}</span> in Top 10 ·{" "}
            <span className="text-muted-foreground">{filtered.length} shown</span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold transition hover:bg-secondary">
            <Upload className="h-4 w-4" /> Import JSON/CSV
            <input
              type="file"
              accept=".json,.csv"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onFile(f);
                e.currentTarget.value = "";
              }}
            />
          </label>
          <button
            onClick={() => {
              if (confirm("Reset all channels to defaults?")) mutations.reset.mutate();
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold transition hover:bg-secondary"
          >
            <RotateCcw className="h-4 w-4" /> Reset
          </button>
        </div>
      </header>

      <div className="mb-4">
        <MongoStatusBar />
      </div>

      {/* Add channel form */}
      <div className="mt-4">
        <AddChannelForm
          onAdd={async (c) => {
            try {
              await mutations.upsert.mutateAsync(c);
            } catch (e) {
              alert(e instanceof Error ? e.message : "Add failed");
            }
          }}
          disabled={mutations.upsert.isPending}
        />
      </div>

      {/* Filters bar */}
      <div className="mt-6 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search channels…"
              className="w-full rounded-lg border border-border bg-card py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
            />
            {q && (
              <button
                onClick={() => setQ("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2 text-sm">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Sort:
            </span>
            <SortBtn k="order" label="Order" />
            <SortBtn k="name" label="Name" />
            <SortBtn k="group" label="Group" />
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {(["All", "★ Top", ...ALL_GROUPS] as const).map((g) => {
            const count =
              g === "All"
                ? channels.length
                : g === "★ Top"
                  ? totalFeatured
                  : channels.filter((c) => c.group === g).length;
            return (
              <button
                key={g}
                onClick={() => setGroupFilter(g as typeof groupFilter)}
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold transition ${
                  groupFilter === g
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                {g} <span className="opacity-70">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40 text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="w-8 px-2 py-2.5" />
                <th className="px-3 py-2.5 text-left w-6">#</th>
                <th className="px-3 py-2.5 text-left">Channel</th>
                <th className="px-3 py-2.5 text-left hidden sm:table-cell">Group</th>
                <th className="px-3 py-2.5 text-left hidden lg:table-cell">Stream URL</th>
                <th className="px-3 py-2.5 text-center w-12">Top</th>
                <th className="px-3 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-muted-foreground">
                    Loading…
                  </td>
                </tr>
              )}
              {!isLoading && filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-muted-foreground">
                    No channels match your filter.
                  </td>
                </tr>
              )}
              {filtered.map((c) => {
                const masterIdx = channels.findIndex((x) => x.id === c.id);
                return (
                  <tr
                    key={c.id}
                    className="group/row border-t border-border hover:bg-secondary/20 transition-colors"
                  >
                    <td className="px-2 py-2 text-muted-foreground/30 group-hover/row:text-muted-foreground">
                      <GripVertical className="h-4 w-4" />
                    </td>
                    <td className="px-3 py-2 text-xs text-muted-foreground tabular-nums">
                      {masterIdx + 1}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2.5">
                        <div className="h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-background ring-1 ring-border">
                          <img
                            src={c.logo || FALLBACK_LOGO}
                            alt=""
                            loading="lazy"
                            className="h-full w-full object-contain p-0.5"
                            onError={(e) =>
                              ((e.currentTarget as HTMLImageElement).src = FALLBACK_LOGO)
                            }
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold leading-tight truncate max-w-[160px]">
                            {c.name}
                          </div>
                          <div className="text-[10px] text-muted-foreground sm:hidden">
                            {c.group}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2 hidden sm:table-cell">
                      <GroupBadge group={c.group} />
                    </td>
                    <td className="px-3 py-2 hidden lg:table-cell max-w-[240px]">
                      <span
                        className="block truncate text-[11px] text-muted-foreground font-mono"
                        title={c.url}
                      >
                        {c.url}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-center">
                      <button
                        onClick={() => mutations.toggleFeatured.mutate(c.id)}
                        title={c.featured ? "Remove from Top 10" : "Add to Top 10"}
                        disabled={mutations.toggleFeatured.isPending}
                        className={`inline-flex h-7 w-7 items-center justify-center rounded-full transition ${
                          c.featured
                            ? "bg-gold/20 text-gold hover:bg-gold/30"
                            : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-gold"
                        }`}
                      >
                        <Star className={`h-3.5 w-3.5 ${c.featured ? "fill-gold" : ""}`} />
                      </button>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center justify-end gap-0.5">
                        <button
                          onClick={() => moveInMaster(c.id, -1)}
                          title="Move up"
                          className="rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => moveInMaster(c.id, 1)}
                          title="Move down"
                          className="rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                        <EditChannelModal
                          channel={c}
                          onSave={async (next) => {
                            try {
                              await mutations.upsert.mutateAsync(next);
                            } catch (e) {
                              alert(e instanceof Error ? e.message : "Save failed");
                            }
                          }}
                        />
                        <button
                          onClick={() => {
                            if (confirm(`Delete "${c.name}"?`)) mutations.remove.mutate(c.id);
                          }}
                          disabled={mutations.remove.isPending}
                          title="Delete"
                          className="rounded p-1.5 text-muted-foreground hover:bg-live/10 hover:text-live"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        <Tv className="mr-1 inline h-3 w-3" />
        Edits persist in MongoDB Atlas. Changes are visible to all visitors.
      </p>
        </div>
      </AdminAccessGate>
    </Suspense>
  );
}

const GROUP_COLORS: Record<string, string> = {
  Football: "bg-green-500/15 text-green-400",
  Sports: "bg-blue-500/15 text-blue-400",
  Cricket: "bg-yellow-500/15 text-yellow-400",
  Entertainment: "bg-purple-500/15 text-purple-400",
  Movies: "bg-pink-500/15 text-pink-400",
  Music: "bg-indigo-500/15 text-indigo-400",
  Cartoon: "bg-orange-500/15 text-orange-400",
  Bangladesh: "bg-red-500/15 text-red-400",
  Documentary: "bg-teal-500/15 text-teal-400",
  News: "bg-cyan-500/15 text-cyan-400",
};

function GroupBadge({ group }: { group: string }) {
  const cls = GROUP_COLORS[group] ?? "bg-secondary text-muted-foreground";
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${cls}`}
    >
      {group}
    </span>
  );
}

function AddChannelForm({ onAdd, disabled }: { onAdd: (c: Channel) => void; disabled?: boolean }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    url: "",
    logo: "",
    group: "Sports" as ChannelGroup,
    featured: false,
  });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.url) return;
    onAdd({
      id:
        form.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .slice(0, 40) +
        "-" +
        Math.random().toString(36).slice(2, 6),
      ...form,
    });
    setForm({ name: "", url: "", logo: "", group: "Sports", featured: false });
    setOpen(false);
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-5 py-3.5 text-left transition hover:bg-secondary/40"
      >
        <span className="flex items-center gap-2 font-display font-semibold">
          <Plus className="h-4 w-4 text-primary" /> Add new channel
        </span>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <form onSubmit={submit} className="border-t border-border px-5 pb-5 pt-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <input
              placeholder="Channel name *"
              value={form.name}
              required
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <input
              placeholder="m3u8 stream URL *"
              value={form.url}
              required
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary lg:col-span-2"
            />
            <input
              placeholder="Logo URL"
              value={form.logo}
              onChange={(e) => setForm({ ...form, logo: e.target.value })}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <select
              value={form.group}
              onChange={(e) => setForm({ ...form, group: e.target.value as ChannelGroup })}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            >
              {ALL_GROUPS.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground select-none">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="accent-primary"
              />
              Add to Top 10
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:bg-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={disabled}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-glow disabled:opacity-60"
              >
                <Check className="h-4 w-4" /> Add channel
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

function EditChannelModal({ channel, onSave }: { channel: Channel; onSave: (c: Channel) => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(channel);
  useEffect(() => setForm(channel), [channel]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        title="Edit"
        className="rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
      >
        <Pencil className="h-3.5 w-3.5" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md animate-fade-up"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 overflow-hidden rounded-lg bg-background ring-1 ring-border">
                  <img
                    src={form.logo || FALLBACK_LOGO}
                    alt=""
                    className="h-full w-full object-contain p-0.5"
                    onError={(e) => ((e.currentTarget as HTMLImageElement).src = FALLBACK_LOGO)}
                  />
                </div>
                <h3 className="font-display text-lg font-bold">Edit channel</h3>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-full p-1.5 text-muted-foreground hover:bg-secondary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 p-6">
              {(["name", "url", "logo"] as const).map((k) => (
                <label key={k} className="block">
                  <span className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    {k}
                  </span>
                  <input
                    value={form[k] || ""}
                    onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </label>
              ))}
              <label className="block">
                <span className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Group
                </span>
                <select
                  value={form.group}
                  onChange={(e) => setForm({ ...form, group: e.target.value as ChannelGroup })}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                >
                  {ALL_GROUPS.map((g) => (
                    <option key={g}>{g}</option>
                  ))}
                </select>
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground select-none">
                <input
                  type="checkbox"
                  checked={!!form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="accent-primary"
                />
                Featured (Top 10)
              </label>
            </div>

            <div className="flex justify-end gap-2 border-t border-border px-6 py-4">
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:bg-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onSave(form);
                  setOpen(false);
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-glow"
              >
                <Check className="h-4 w-4" /> Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
