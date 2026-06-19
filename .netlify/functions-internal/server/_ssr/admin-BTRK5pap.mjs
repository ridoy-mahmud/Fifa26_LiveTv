import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useRouter } from "../_libs/tanstack__react-router.mjs";
import { u as useQueryClient, b as useQuery, a as useMutation } from "../_libs/tanstack__react-query.mjs";
import { b as useAdminSession, u as useServerFn, g as getMongoStatus, c as createSsrRpc } from "./router-C62mR_UY.mjs";
import { u as useChannels, a as useChannelMutations, p as parseCsv } from "./channels-store-BfEVNsUx.mjs";
import { A as ALL_GROUPS, F as FALLBACK_LOGO } from "./worldcup-data-CM7yYn8t.mjs";
import { c as createServerFn } from "./index.mjs";
import "../_libs/seroval.mjs";
import { U as Upload, q as RotateCcw, n as Search, X, r as GripVertical, o as Star, A as ArrowUp, s as ArrowDown, t as Trash2, T as Tv, b as LoaderCircle, D as Database, u as ShieldAlert, v as Plus, d as ChevronDown, i as Check, w as Pencil } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/date-fns.mjs";
import "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
const seedIfEmpty = createServerFn({
  method: "POST"
}).handler(createSsrRpc("0f0c0925c0faa0ca4f8965e7dd11a0bfbf21172124df463dc7fe074f12705c5d"));
function AdminPage() {
  const router = useRouter();
  const {
    channels,
    isLoading,
    refetch
  } = useChannels();
  const mutations = useChannelMutations();
  const {
    admin,
    isLoading: authLoading
  } = useAdminSession();
  const statusFn = useServerFn(getMongoStatus);
  const seedFn = useServerFn(seedIfEmpty);
  const qc = useQueryClient();
  const [authed, setAuthed] = reactExports.useState(false);
  const [q, setQ] = reactExports.useState("");
  const [groupFilter, setGroupFilter] = reactExports.useState("All");
  const [sortKey, setSortKey] = reactExports.useState("order");
  const [sortAsc, setSortAsc] = reactExports.useState(true);
  const mongoQ = useQuery({
    queryKey: ["mongo", "status"],
    queryFn: () => statusFn(),
    staleTime: 3e4,
    retry: false
  });
  reactExports.useEffect(() => {
    if (authLoading) return;
    if (!admin) {
      router.navigate({
        to: "/"
      });
      return;
    }
    setAuthed(true);
  }, [admin, authLoading, router]);
  const seedMut = useMutation({
    mutationFn: () => seedFn(),
    onSuccess: async (res) => {
      await qc.invalidateQueries({
        queryKey: ["mongo", "status"]
      });
      await qc.invalidateQueries({
        queryKey: ["channels"]
      });
      alert(`Seeded. Channels: ${res.channels}, admin: ${res.admin ? "created" : "existed"}.`);
    },
    onError: (e) => alert(e instanceof Error ? e.message : "Seed failed")
  });
  const filtered = reactExports.useMemo(() => {
    let list = [...channels];
    if (groupFilter === "★ Top") list = list.filter((c) => c.featured);
    else if (groupFilter !== "All") list = list.filter((c) => c.group === groupFilter);
    if (q.trim()) {
      const n = q.toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(n) || c.group.toLowerCase().includes(n));
    }
    if (sortKey === "name") list.sort((a, b) => a.name.localeCompare(b.name) * (sortAsc ? 1 : -1));
    else if (sortKey === "group") list.sort((a, b) => a.group.localeCompare(b.group) * (sortAsc ? 1 : -1));
    else list.sort((a, b) => ((a.order ?? 0) - (b.order ?? 0)) * (sortAsc ? 1 : -1));
    return list;
  }, [channels, q, groupFilter, sortKey, sortAsc]);
  if (!authed) return null;
  const totalFeatured = channels.filter((c) => c.featured).length;
  const moveInMaster = async (id, dir) => {
    const idx = channels.findIndex((x) => x.id === id);
    const j = idx + dir;
    if (j < 0 || j >= channels.length) return;
    const next = [...channels];
    [next[idx], next[j]] = [next[j], next[idx]];
    await mutations.reorder.mutate(next.map((c) => c.id));
  };
  const onFile = async (file) => {
    const text = await file.text();
    if (file.name.endsWith(".csv")) {
      mutations.importMany.mutate(parseCsv(text));
    } else {
      try {
        const json = JSON.parse(text);
        const arr = Array.isArray(json) ? json : json.channels ?? json.streams;
        if (!Array.isArray(arr)) throw new Error("Bad JSON");
        mutations.importMany.mutate(arr.map((r) => ({
          name: r.name ?? r.channel_name ?? "",
          group: r.group ?? "Sports",
          logo: r.logo ?? "",
          url: (r.url || r.m3u8 || r.m3u8_url) ?? "",
          featured: !!r.featured
        })));
      } catch {
        alert("Invalid JSON file");
      }
    }
  };
  const toggleSort = (key) => {
    if (sortKey === key) setSortAsc((v) => !v);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  };
  const SortBtn = ({
    k,
    label
  }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => toggleSort(k), className: `inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider transition ${sortKey === k ? "text-primary" : "text-muted-foreground hover:text-foreground"}`, children: [
    label,
    /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: `h-3 w-3 transition-transform ${sortKey === k && !sortAsc ? "rotate-180" : ""}` })
  ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "mb-6 flex flex-wrap items-end justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold uppercase tracking-[0.2em] text-primary", children: "Admin" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-1 font-display text-3xl font-bold sm:text-4xl", children: "Channel manager" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-semibold", children: channels.length }),
          " channels ·",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gold font-semibold", children: totalFeatured }),
          " in Top 10 ·",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
            filtered.length,
            " shown"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold transition hover:bg-secondary", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-4 w-4" }),
          " Import JSON/CSV",
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept: ".json,.csv", className: "hidden", onChange: (e) => {
            const f = e.target.files?.[0];
            if (f) onFile(f);
            e.currentTarget.value = "";
          } })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
          if (confirm("Reset all channels to defaults?")) mutations.reset.mutate();
        }, className: "inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold transition hover:bg-secondary", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "h-4 w-4" }),
          " Reset"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DbStatusBar, { connected: !!mongoQ.data?.ok, channelCount: mongoQ.data?.channelCount ?? 0, sessionCount: mongoQ.data?.activeSessions ?? 0, reason: mongoQ.data?.reason, loading: mongoQ.isLoading, onSeed: () => seedMut.mutate(), seeding: seedMut.isPending, onRefresh: async () => {
      await Promise.all([mongoQ.refetch(), refetch()]);
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AddChannelForm, { onAdd: async (c) => {
      try {
        await mutations.upsert.mutateAsync(c);
      } catch (e) {
        alert(e instanceof Error ? e.message : "Add failed");
      }
    }, disabled: mutations.upsert.isPending }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 min-w-[200px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Search channels…", className: "w-full rounded-lg border border-border bg-card py-2 pl-9 pr-3 text-sm outline-none focus:border-primary" }),
          q && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setQ(""), className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Sort:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SortBtn, { k: "order", label: "Order" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SortBtn, { k: "name", label: "Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SortBtn, { k: "group", label: "Group" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: ["All", "★ Top", ...ALL_GROUPS].map((g) => {
        const count = g === "All" ? channels.length : g === "★ Top" ? totalFeatured : channels.filter((c) => c.group === g).length;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setGroupFilter(g), className: `inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold transition ${groupFilter === g ? "bg-primary text-primary-foreground" : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"}`, children: [
          g,
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "opacity-70", children: [
            "(",
            count,
            ")"
          ] })
        ] }, g);
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-secondary/40 text-[11px] uppercase tracking-wider text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "w-8 px-2 py-2.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2.5 text-left w-6", children: "#" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2.5 text-left", children: "Channel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2.5 text-left hidden sm:table-cell", children: "Group" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2.5 text-left hidden lg:table-cell", children: "Stream URL" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2.5 text-center w-12", children: "Top" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2.5 text-right", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
        isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 7, className: "px-4 py-12 text-center text-sm text-muted-foreground", children: "Loading…" }) }),
        !isLoading && filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 7, className: "px-4 py-12 text-center text-sm text-muted-foreground", children: "No channels match your filter." }) }),
        filtered.map((c) => {
          const masterIdx = channels.findIndex((x) => x.id === c.id);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "group/row border-t border-border hover:bg-secondary/20 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2 text-muted-foreground/30 group-hover/row:text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(GripVertical, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-xs text-muted-foreground tabular-nums", children: masterIdx + 1 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-background ring-1 ring-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: c.logo || FALLBACK_LOGO, alt: "", loading: "lazy", className: "h-full w-full object-contain p-0.5", onError: (e) => e.currentTarget.src = FALLBACK_LOGO }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold leading-tight truncate max-w-[160px]", children: c.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground sm:hidden", children: c.group })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 hidden sm:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx(GroupBadge, { group: c.group }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 hidden lg:table-cell max-w-[240px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block truncate text-[11px] text-muted-foreground font-mono", title: c.url, children: c.url }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => mutations.toggleFeatured.mutate(c.id), title: c.featured ? "Remove from Top 10" : "Add to Top 10", disabled: mutations.toggleFeatured.isPending, className: `inline-flex h-7 w-7 items-center justify-center rounded-full transition ${c.featured ? "bg-gold/20 text-gold hover:bg-gold/30" : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-gold"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: `h-3.5 w-3.5 ${c.featured ? "fill-gold" : ""}` }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => moveInMaster(c.id, -1), title: "Move up", className: "rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUp, { className: "h-3.5 w-3.5" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => moveInMaster(c.id, 1), title: "Move down", className: "rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDown, { className: "h-3.5 w-3.5" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(EditChannelModal, { channel: c, onSave: async (next) => {
                try {
                  await mutations.upsert.mutateAsync(next);
                } catch (e) {
                  alert(e instanceof Error ? e.message : "Save failed");
                }
              } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
                if (confirm(`Delete "${c.name}"?`)) mutations.remove.mutate(c.id);
              }, disabled: mutations.remove.isPending, title: "Delete", className: "rounded p-1.5 text-muted-foreground hover:bg-live/10 hover:text-live", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }) })
            ] }) })
          ] }, c.id);
        })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-4 text-xs text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Tv, { className: "mr-1 inline h-3 w-3" }),
      "Edits persist in MongoDB Atlas. Changes are visible to all visitors."
    ] })
  ] });
}
function DbStatusBar({
  connected,
  channelCount,
  sessionCount,
  reason,
  loading,
  onSeed,
  seeding,
  onRefresh
}) {
  const empty = connected && channelCount === 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex flex-wrap items-center justify-between gap-3 rounded-lg border px-3 py-2 text-xs ${connected ? empty ? "border-gold/40 bg-gold/10" : "border-emerald-500/40 bg-emerald-500/10" : "border-live/40 bg-live/10"}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : connected ? /* @__PURE__ */ jsxRuntimeExports.jsx(Database, { className: "h-3.5 w-3.5 text-emerald-400" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "h-3.5 w-3.5 text-live" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: loading ? "Checking database…" : !connected ? `MongoDB not reachable${reason ? `: ${reason}` : ""}` : empty ? "Database is empty" : `MongoDB connected · ${channelCount} channels · ${sessionCount} active session${sessionCount === 1 ? "" : "s"}` })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      empty && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: onSeed, disabled: seeding, className: "inline-flex items-center gap-1.5 rounded-md bg-gold px-2.5 py-1 font-semibold text-background disabled:opacity-60", children: [
        seeding && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3 w-3 animate-spin" }),
        "Seed from defaults"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onRefresh, title: "Refresh", className: "rounded-md border border-border bg-card px-2 py-1 font-semibold hover:bg-secondary", children: "Refresh" })
    ] })
  ] });
}
const GROUP_COLORS = {
  Football: "bg-green-500/15 text-green-400",
  Sports: "bg-blue-500/15 text-blue-400",
  Cricket: "bg-yellow-500/15 text-yellow-400",
  Entertainment: "bg-purple-500/15 text-purple-400",
  Movies: "bg-pink-500/15 text-pink-400",
  Music: "bg-indigo-500/15 text-indigo-400",
  Cartoon: "bg-orange-500/15 text-orange-400",
  Bangladesh: "bg-red-500/15 text-red-400",
  Documentary: "bg-teal-500/15 text-teal-400",
  News: "bg-cyan-500/15 text-cyan-400"
};
function GroupBadge({
  group
}) {
  const cls = GROUP_COLORS[group] ?? "bg-secondary text-muted-foreground";
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${cls}`, children: group });
}
function AddChannelForm({
  onAdd,
  disabled
}) {
  const [open, setOpen] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState({
    name: "",
    url: "",
    logo: "",
    group: "Sports",
    featured: false
  });
  const submit = (e) => {
    e.preventDefault();
    if (!form.name || !form.url) return;
    onAdd({
      id: form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40) + "-" + Math.random().toString(36).slice(2, 6),
      ...form
    });
    setForm({
      name: "",
      url: "",
      logo: "",
      group: "Sports",
      featured: false
    });
    setOpen(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setOpen((v) => !v), className: "flex w-full items-center justify-between px-5 py-3.5 text-left transition hover:bg-secondary/40", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 font-display font-semibold", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 text-primary" }),
        " Add new channel"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: `h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}` })
    ] }),
    open && /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "border-t border-border px-5 pb-5 pt-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { placeholder: "Channel name *", value: form.name, required: true, onChange: (e) => setForm({
          ...form,
          name: e.target.value
        }), className: "rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { placeholder: "m3u8 stream URL *", value: form.url, required: true, onChange: (e) => setForm({
          ...form,
          url: e.target.value
        }), className: "rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary lg:col-span-2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { placeholder: "Logo URL", value: form.logo, onChange: (e) => setForm({
          ...form,
          logo: e.target.value
        }), className: "rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: form.group, onChange: (e) => setForm({
          ...form,
          group: e.target.value
        }), className: "rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary", children: ALL_GROUPS.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: g }, g)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex cursor-pointer items-center gap-2 text-sm text-muted-foreground select-none", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: form.featured, onChange: (e) => setForm({
            ...form,
            featured: e.target.checked
          }), className: "accent-primary" }),
          "Add to Top 10"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setOpen(false), className: "rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:bg-secondary", children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "submit", disabled, className: "inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-glow disabled:opacity-60", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }),
            " Add channel"
          ] })
        ] })
      ] })
    ] })
  ] });
}
function EditChannelModal({
  channel,
  onSave
}) {
  const [open, setOpen] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState(channel);
  reactExports.useEffect(() => setForm(channel), [channel]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setOpen(true), title: "Edit", className: "rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3.5 w-3.5" }) }),
    open && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md animate-fade-up", onClick: () => setOpen(false), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-border px-6 py-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 overflow-hidden rounded-lg bg-background ring-1 ring-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: form.logo || FALLBACK_LOGO, alt: "", className: "h-full w-full object-contain p-0.5", onError: (e) => e.currentTarget.src = FALLBACK_LOGO }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg font-bold", children: "Edit channel" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setOpen(false), className: "rounded-full p-1.5 text-muted-foreground hover:bg-secondary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 p-6", children: [
        ["name", "url", "logo"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-1 block text-[11px] font-bold uppercase tracking-wider text-muted-foreground", children: k }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: form[k] || "", onChange: (e) => setForm({
            ...form,
            [k]: e.target.value
          }), className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" })
        ] }, k)),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-1 block text-[11px] font-bold uppercase tracking-wider text-muted-foreground", children: "Group" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: form.group, onChange: (e) => setForm({
            ...form,
            group: e.target.value
          }), className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary", children: ALL_GROUPS.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: g }, g)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex cursor-pointer items-center gap-2 text-sm text-muted-foreground select-none", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: !!form.featured, onChange: (e) => setForm({
            ...form,
            featured: e.target.checked
          }), className: "accent-primary" }),
          "Featured (Top 10)"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 border-t border-border px-6 py-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setOpen(false), className: "rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:bg-secondary", children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
          onSave(form);
          setOpen(false);
        }, className: "inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-glow", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }),
          " Save"
        ] })
      ] })
    ] }) })
  ] });
}
export {
  AdminPage as component
};
