import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { g as getTeam, f as flagUrl } from "./worldcup-data-CM7yYn8t.mjs";
import { j as Route } from "./router-C62mR_UY.mjs";
import "./index.mjs";
import "../_libs/seroval.mjs";
import { H as Hash, y as MapPin, x as Calendar } from "../_libs/lucide-react.mjs";
import { f as format } from "../_libs/date-fns.mjs";
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
import "../_libs/tanstack__react-query.mjs";
import "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
function StatusBadge({
  match
}) {
  if (match.status === "live") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-full bg-live/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-live", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 animate-pulse-live rounded-full bg-live" }),
      "Live · ",
      match.minute,
      "'"
    ] });
  }
  if (match.status === "ht") return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-gold/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-gold", children: "Half time" });
  if (match.status === "ft") return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-secondary px-3 py-1 text-xs font-bold uppercase tracking-wider text-muted-foreground", children: "Full time" });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-primary/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary", children: "Upcoming" });
}
function MatchPage() {
  const {
    match
  } = Route.useLoaderData();
  const home = getTeam(match.homeCode);
  const away = getTeam(match.awayCode);
  const showScore = match.status !== "scheduled";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/schedule", className: "text-sm text-muted-foreground hover:text-primary", children: "← All matches" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3 border-b border-border bg-gradient-to-r from-primary/10 to-transparent px-6 py-3 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Hash, { className: "h-3.5 w-3.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Match ",
            match.matchNumber
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "·" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: match.group ? `Group ${match.group}` : match.stage })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { match })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-6 py-10 sm:gap-8 sm:py-14", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/teams/$code", params: {
          code: home.code
        }, className: "flex flex-col items-center gap-3 text-center group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: flagUrl(home.code), alt: home.name, width: 120, height: 90, className: "h-20 w-28 rounded-lg object-cover ring-1 ring-border group-hover:ring-primary/50" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-xl font-bold sm:text-2xl", children: home.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: home.code })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
          showScore ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display text-5xl font-bold tabular-nums sm:text-7xl", children: [
            match.homeScore,
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/50", children: "–" }),
            " ",
            match.awayScore
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-3xl font-bold text-muted-foreground sm:text-4xl", children: "vs" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 text-xs uppercase tracking-wider text-muted-foreground", children: format(new Date(match.kickoff), "MMM d · HH:mm 'UTC'") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/teams/$code", params: {
          code: away.code
        }, className: "flex flex-col items-center gap-3 text-center group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: flagUrl(away.code), alt: away.name, width: 120, height: 90, className: "h-20 w-28 rounded-lg object-cover ring-1 ring-border group-hover:ring-primary/50" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-xl font-bold sm:text-2xl", children: away.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: away.code })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-px bg-border sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 bg-card px-6 py-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-4 w-4 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: "Venue" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-semibold", children: [
              match.venue,
              ", ",
              match.city
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 bg-card px-6 py-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-4 w-4 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: "Kick-off" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-semibold", children: [
              format(new Date(match.kickoff), "EEEE d MMM, HH:mm"),
              " UTC"
            ] })
          ] })
        ] })
      ] })
    ] }),
    match.events && match.events.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-8 rounded-2xl border border-border bg-card p-6 shadow-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-4 font-display text-xl font-bold", children: "Match events" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "space-y-3", children: match.events.map((e, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-4 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "w-12 shrink-0 text-right font-mono font-semibold text-muted-foreground", children: [
          e.minute,
          "'"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${e.type === "goal" ? "bg-primary/20 text-primary" : e.type === "yellow" ? "bg-gold/30 text-gold" : e.type === "red" ? "bg-live/20 text-live" : "bg-secondary text-muted-foreground"}`, children: e.type === "goal" ? "⚽" : e.type === "yellow" ? "🟨" : e.type === "red" ? "🟥" : "↔" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: e.player }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-2 text-muted-foreground", children: [
            e.type === "goal" ? "scores for" : e.type === "yellow" ? "booked · " : e.type === "red" ? "sent off · " : "substitution · ",
            e.side === "home" ? home.name : away.name
          ] })
        ] })
      ] }, i)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-8 rounded-2xl border border-border bg-gradient-to-br from-card to-secondary/40 p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold", children: "Watch this match live" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Stream FIFA+, beIN Sports, T Sports and more — BDIX optimised." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/live", className: "mt-4 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-glow", children: "Open Live TV →" })
    ] })
  ] });
}
export {
  MatchPage as component
};
