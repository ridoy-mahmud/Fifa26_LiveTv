import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { u as useServerFn } from "./useServerFn-DL2oePlL.mjs";
import { T as TEAMS, G as GROUPS, f as flagUrl } from "./worldcup-data-CJq_BX3J.mjs";
import { l as listTeams } from "./router-mYYr7CR_.mjs";
import "./index.mjs";
import "../_libs/seroval.mjs";
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
import "../_libs/lucide-react.mjs";
import "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
function TeamsPage() {
  const teamsFn = useServerFn(listTeams);
  const {
    data: dbTeams
  } = useQuery({
    queryKey: ["teams", "list"],
    queryFn: () => teamsFn(),
    staleTime: 3e4
  });
  const teams = dbTeams && dbTeams.length > 0 ? dbTeams : TEAMS;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "mb-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold uppercase tracking-[0.2em] text-primary", children: "Nations" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-1 font-display text-4xl font-bold sm:text-5xl", children: "All 48 teams" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 max-w-2xl text-muted-foreground", children: "From CONMEBOL to UEFA, AFC to CAF — every nation chasing the trophy." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-10", children: GROUPS.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "mb-4 flex items-baseline gap-3 font-display text-2xl font-bold", children: [
        "Group ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: g }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-normal text-muted-foreground", children: "4 teams" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4", children: teams.filter((t) => t.group === g).map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/teams/$code", params: {
        code: t.code
      }, className: "group flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-glow", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: flagUrl(t.code), alt: t.name, width: 48, height: 36, className: "h-9 w-12 rounded-md object-cover ring-1 ring-border" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate font-semibold", children: t.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: t.code })
        ] })
      ] }, t.code)) })
    ] }, g)) })
  ] });
}
export {
  TeamsPage as component
};
