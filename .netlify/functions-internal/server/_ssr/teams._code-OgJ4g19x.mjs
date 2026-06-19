import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { b as useQuery } from "../_libs/tanstack__react-query.mjs";
import { R as Route$1, u as useServerFn, a as listMatches, l as listTeams } from "./router-C62mR_UY.mjs";
import { M as MATCHES, T as TEAMS, g as getTeam, f as flagUrl } from "./worldcup-data-CM7yYn8t.mjs";
import { M as MatchCard } from "./MatchCard-D7hMQvST.mjs";
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
function TeamPage() {
  const {
    team: loaderTeam
  } = Route$1.useLoaderData();
  const matchesFn = useServerFn(listMatches);
  const teamsFn = useServerFn(listTeams);
  const {
    data: dbMatches
  } = useQuery({
    queryKey: ["matches", "team", loaderTeam.code],
    queryFn: () => matchesFn(),
    staleTime: 3e4
  });
  const {
    data: dbTeams
  } = useQuery({
    queryKey: ["teams", "team", loaderTeam.code],
    queryFn: () => teamsFn(),
    staleTime: 3e4
  });
  const allMatches = dbMatches && dbMatches.length > 0 ? dbMatches : MATCHES;
  const allTeams = dbTeams && dbTeams.length > 0 ? dbTeams : TEAMS;
  const team = getTeam(loaderTeam.code, allTeams);
  const matches = allMatches.filter((m) => m.homeCode === team.code || m.awayCode === team.code);
  const groupmates = allTeams.filter((t) => t.group === team.group && t.code !== team.code);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/teams", className: "text-sm text-muted-foreground hover:text-primary", children: "← All teams" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "mt-6 flex flex-wrap items-center gap-6 rounded-2xl border border-border bg-card p-8 shadow-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: flagUrl(team.code), alt: team.name, width: 120, height: 90, className: "h-[90px] w-[120px] rounded-lg object-cover ring-1 ring-border" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs font-bold uppercase tracking-[0.2em] text-primary", children: [
          "Group ",
          team.group
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-1 font-display text-4xl font-bold sm:text-5xl", children: team.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 text-sm text-muted-foreground", children: [
          "FIFA code · ",
          team.code
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-4 font-display text-2xl font-bold", children: "Group stage fixtures" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3", children: matches.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(MatchCard, { match: m }, m.id)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "mb-4 font-display text-2xl font-bold", children: [
        "Group ",
        team.group,
        " rivals"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3 grid-cols-1 sm:grid-cols-3", children: groupmates.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/teams/$code", params: {
        code: t.code
      }, className: "flex items-center gap-3 rounded-xl border border-border bg-card p-3 hover:border-primary/40", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: flagUrl(t.code), alt: "", width: 40, height: 30, className: "h-[30px] w-10 rounded-md object-cover ring-1 ring-border" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: getTeam(t.code).name })
      ] }, t.code)) })
    ] })
  ] });
}
export {
  TeamPage as component
};
