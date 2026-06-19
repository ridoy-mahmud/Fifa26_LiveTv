import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { b as useQuery } from "../_libs/tanstack__react-query.mjs";
import { u as useServerFn, a as listMatches } from "./router-C62mR_UY.mjs";
import { M as MatchCard } from "./MatchCard-D7hMQvST.mjs";
import { u as upcomingMatches } from "./worldcup-data-CM7yYn8t.mjs";
import "./index.mjs";
import "../_libs/seroval.mjs";
import { R as Radio, x as Calendar, Z as Zap, E as Earth } from "../_libs/lucide-react.mjs";
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
const heroImg = "/assets/hero-stadium-B-1n0HDK.jpg";
const LOGO = "https://i.ibb.co.com/xqDjvtSg/fifa-world-cup-2026-logo-white.png";
const stats = [{
  value: "48",
  label: "Teams"
}, {
  value: "12",
  label: "Groups"
}, {
  value: "104",
  label: "Matches"
}, {
  value: "16",
  label: "Host cities"
}];
function HomePage() {
  const matchesFn = useServerFn(listMatches);
  const {
    data: matches = []
  } = useQuery({
    queryKey: ["matches", "home"],
    queryFn: () => matchesFn(),
    staleTime: 3e4
  });
  const upcoming = upcomingMatches(6, matches.length > 0 ? matches : void 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative isolate overflow-hidden min-h-[75vh] flex items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: heroImg, alt: "", width: 1920, height: 1080, fetchPriority: "high", decoding: "async", className: "absolute inset-0 -z-10 h-full w-full object-cover opacity-40" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 -z-10 bg-gradient-to-b from-background/50 via-background/65 to-background" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 -z-10 bg-gradient-to-r from-background/30 via-transparent to-background/30" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 left-1/2 -z-10 h-[40%] w-[80%] -translate-x-1/2 rounded-full bg-primary/10 blur-[80px]" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-8 flex justify-center animate-fade-up", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -inset-3 rounded-full bg-primary/10 blur-xl animate-pulse" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: LOGO, alt: "FIFA World Cup 2026", width: 120, height: 120, className: "relative h-28 w-28 sm:h-36 sm:w-36 object-contain drop-shadow-[0_0_28px_rgba(100,200,100,0.45)] transition-transform hover:scale-105" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary animate-fade-up", style: {
          animationDelay: "0.1s"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-primary animate-pulse" }),
          "FIFA World Cup 2026 · USA · Canada · Mexico"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl animate-fade-up", style: {
          animationDelay: "0.15s"
        }, children: [
          "The road to the",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient-gold", children: "2026 final" }),
          "."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-5 mx-auto max-w-xl text-base text-muted-foreground sm:text-lg animate-fade-up", style: {
          animationDelay: "0.2s"
        }, children: "Every match. Every goal. Live scores and real-time streaming from the biggest World Cup ever." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 flex flex-wrap justify-center gap-4 animate-fade-up", style: {
          animationDelay: "0.25s"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/live", className: "group inline-flex items-center gap-2.5 rounded-xl bg-primary px-7 py-3.5 text-sm font-bold text-primary-foreground shadow-glow transition-all hover:bg-primary-glow hover:scale-105 hover:shadow-[0_0_30px_-4px_var(--primary)]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Radio, { className: "h-4 w-4 animate-pulse-live" }),
            "Watch Live TV"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/schedule", className: "group inline-flex items-center gap-2.5 rounded-xl border border-border bg-card/70 px-7 py-3.5 text-sm font-bold backdrop-blur transition-all hover:border-primary/50 hover:bg-card hover:scale-105", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-4 w-4" }),
            "Full Schedule"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-14 flex flex-wrap justify-center gap-3 animate-fade-up", style: {
          animationDelay: "0.3s"
        }, children: stats.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-full border border-border bg-card/60 px-5 py-2 backdrop-blur transition-all hover:border-primary/40 hover:bg-primary/5 hover:scale-105 cursor-default", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-xl font-bold text-primary", children: s.value }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-muted-foreground", children: s.label })
        ] }, s.label)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 flex flex-wrap justify-center gap-2 animate-fade-up", style: {
          animationDelay: "0.35s"
        }, children: ["🇺🇸 USA", "🇨🇦 Canada", "🇲🇽 Mexico"].map((flag) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full border border-border/60 bg-secondary/40 px-3 py-1 text-xs font-medium text-muted-foreground", children: flag }, flag)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 flex items-end justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold uppercase tracking-[0.2em] text-primary", children: "Coming up" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-1 font-display text-3xl font-bold sm:text-4xl", children: "Next kick-offs" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/schedule", className: "text-sm text-muted-foreground hover:text-primary transition-colors", children: "Full schedule →" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3", children: upcoming.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(MatchCard, { match: m }, m.id)) }),
      upcoming.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-muted-foreground py-12", children: "No upcoming matches. Check back soon." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/schedule", className: "group relative overflow-hidden rounded-2xl border border-border bg-card p-7 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 h-32 w-32 rounded-full bg-primary/5 blur-2xl transition group-hover:bg-primary/10" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-7 w-7 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-4 font-display text-xl font-bold", children: "Match schedule" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1.5 text-sm text-muted-foreground leading-relaxed", children: "All 104 matches with live countdowns, venues, and real-time results." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:underline", children: [
          "View schedule ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-3.5 w-3.5" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/live", className: "group relative overflow-hidden rounded-2xl border border-border bg-card p-7 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 h-32 w-32 rounded-full bg-live/5 blur-2xl transition group-hover:bg-live/10" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Radio, { className: "h-7 w-7 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-4 font-display text-xl font-bold", children: "Live TV" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1.5 text-sm text-muted-foreground leading-relaxed", children: "Stream beIN Sports, FIFA+, T Sports, Fox Sports and more — BDIX optimised." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:underline", children: [
          "Watch now ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Earth, { className: "h-3.5 w-3.5" })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  HomePage as component
};
