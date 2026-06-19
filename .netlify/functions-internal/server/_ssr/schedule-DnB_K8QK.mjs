import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { u as useServerFn } from "./useServerFn-DL2oePlL.mjs";
import { M as MATCHES } from "./worldcup-data-CJq_BX3J.mjs";
import { a as listMatches } from "./router-mYYr7CR_.mjs";
import { M as MatchCard } from "./MatchCard-CnyEo4MH.mjs";
import "./index.mjs";
import "../_libs/seroval.mjs";
import { f as format } from "../_libs/date-fns.mjs";
import "../_libs/tanstack__query-core.mjs";
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
import "../_libs/lucide-react.mjs";
import "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
const STAGE_LABELS = {
  Group: "Group Stage",
  R32: "Round of 32",
  R16: "Round of 16",
  QF: "Quarterfinals",
  SF: "Semifinals",
  "3rd": "Third Place",
  Final: "Final"
};
const STAGE_ORDER = ["Group", "R32", "R16", "QF", "SF", "3rd", "Final"];
function SchedulePage() {
  const matchesFn = useServerFn(listMatches);
  const {
    data: dbMatches
  } = useQuery({
    queryKey: ["matches", "schedule"],
    queryFn: () => matchesFn(),
    staleTime: 3e4
  });
  const matches = dbMatches && dbMatches.length > 0 ? dbMatches : MATCHES;
  const byStage = reactExports.useMemo(() => {
    const stages = {};
    for (const m of matches) {
      (stages[m.stage] ||= []).push(m);
    }
    return stages;
  }, [matches]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold uppercase tracking-[0.2em] text-primary", children: "FIFA World Cup 2026" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-1 font-display text-4xl font-bold sm:text-5xl", children: "Match schedule" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-3 max-w-2xl text-muted-foreground", children: [
        "All ",
        matches.length,
        " matches — group stage through the final. Times shown in your local timezone."
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-14", children: STAGE_ORDER.map((stage) => {
      const matches2 = byStage[stage];
      if (!matches2 || matches2.length === 0) return null;
      const byDay = {};
      for (const m of matches2) {
        const day = m.kickoff.slice(0, 10);
        (byDay[day] ||= []).push(m);
      }
      const days = Object.keys(byDay).sort();
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 flex items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-bold text-primary", children: STAGE_LABELS[stage] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1 bg-border" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground", children: [
            matches2.length,
            " match",
            matches2.length !== 1 ? "es" : ""
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-8", children: days.map((day) => /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex flex-wrap items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg font-semibold", children: format(/* @__PURE__ */ new Date(day + "T12:00:00Z"), "EEEE, MMMM d") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
              byDay[day].length,
              " match",
              byDay[day].length !== 1 ? "es" : ""
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3", children: byDay[day].map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(MatchCard, { match: m }, m.id)) })
        ] }, day)) })
      ] }, stage);
    }) })
  ] });
}
export {
  SchedulePage as component
};
