import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { G as GROUPS, g as groupStandings, m as matchesByGroup, f as flagUrl } from "./router-DWtAOtfv.mjs";
import { M as MatchCard } from "./MatchCard-FZBZmMT5.mjs";
import "../_libs/seroval.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__react-router.mjs";
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
import "./server-CWPfp1hj.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "../_libs/date-fns.mjs";
import "../_libs/lucide-react.mjs";
import "../_libs/zod.mjs";
function GroupsPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "mb-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold uppercase tracking-[0.2em] text-primary", children: "12 groups · 48 teams" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-1 font-display text-4xl font-bold sm:text-5xl", children: "Group standings" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 max-w-2xl text-muted-foreground", children: "Top two from each group advance, plus the eight best third-placed teams qualify for the Round of 32." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-6 lg:grid-cols-2", children: GROUPS.map((g) => {
      const standings = groupStandings(g);
      const matches = matchesByGroup(g);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "overflow-hidden rounded-xl border border-border bg-card shadow-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex items-center justify-between border-b border-border bg-secondary/50 px-5 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-lg font-bold", children: [
            "Group ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: g })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            matches.length,
            " matches"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-[11px] uppercase tracking-wider text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2 text-left font-medium", children: "#" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 text-left font-medium", children: "Team" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-2 text-center font-medium", children: "P" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-2 text-center font-medium", children: "W" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-2 text-center font-medium", children: "D" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-2 text-center font-medium", children: "L" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-2 text-center font-medium", children: "GD" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2 text-center font-medium", children: "Pts" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: standings.map((row, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: `border-t border-border ${i < 2 ? "bg-primary/5" : ""}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-muted-foreground", children: i + 1 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: flagUrl(row.team.code), alt: "", width: 24, height: 18, className: "h-[18px] w-6 rounded-sm object-cover ring-1 ring-border" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: row.team.name })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2.5 text-center tabular-nums", children: row.p }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2.5 text-center tabular-nums", children: row.w }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2.5 text-center tabular-nums", children: row.d }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2.5 text-center tabular-nums", children: row.l }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2.5 text-center tabular-nums", children: row.gd > 0 ? `+${row.gd}` : row.gd }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-center font-bold tabular-nums text-foreground", children: row.pts })
          ] }, row.team.code)) })
        ] }),
        matches.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3 border-t border-border bg-background/40 p-4 sm:grid-cols-2", children: matches.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(MatchCard, { match: m }, m.id)) })
      ] }, g);
    }) })
  ] });
}
export {
  GroupsPage as component
};
