import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { I as Info, a as Globe, T as Tv } from "../_libs/lucide-react.mjs";
const broadcasters = [{
  region: "Bangladesh",
  names: ["T Sports", "Bangladesh Television (BTV)"],
  note: "Free-to-air broadcasts on terrestrial TV."
}, {
  region: "India",
  names: ["JioCinema / JioHotstar", "Sports18"],
  note: "Streaming + linear coverage."
}, {
  region: "Pakistan",
  names: ["PTV Sports"],
  note: "Free-to-air broadcaster."
}, {
  region: "United Kingdom",
  names: ["BBC", "ITV"],
  note: "Free-to-air, all matches shared between the two."
}, {
  region: "United States",
  names: ["FOX (English)", "Telemundo / Peacock (Spanish)"],
  note: "Linear TV plus streaming."
}, {
  region: "Canada",
  names: ["TSN", "CTV", "RDS (French)"],
  note: "Bell Media holds rights."
}, {
  region: "Australia",
  names: ["Optus Sport", "SBS (selected matches)"],
  note: "Streaming + free-to-air highlights."
}, {
  region: "Middle East & North Africa",
  names: ["beIN Sports"],
  note: "Region-wide exclusive holder."
}, {
  region: "Sub-Saharan Africa",
  names: ["SuperSport"],
  note: "Pay-TV across most of the region."
}];
function WatchPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold uppercase tracking-[0.2em] text-primary", children: "Broadcast partners" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-1 font-display text-4xl font-bold sm:text-5xl", children: "Where to watch" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 max-w-2xl text-muted-foreground", children: "FIFA licenses World Cup broadcasting rights region by region. Watch through the official partner in your country." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8 flex items-start gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "mt-0.5 h-5 w-5 shrink-0 text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "font-semibold", children: "Watch legally." }),
        " Unofficial streams hurt the players, the teams, and your local broadcaster's ability to license future tournaments. Stick with the licensed partner below."
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 sm:grid-cols-2", children: broadcasters.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-5 shadow-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "h-3.5 w-3.5" }),
        " ",
        b.region
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 space-y-1.5", children: b.names.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tv, { className: "h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: n })
      ] }, n)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 text-xs text-muted-foreground", children: b.note })
    ] }, b.region)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-10 text-xs text-muted-foreground", children: "Broadcaster list reflects publicly announced agreements and may change. Check your local provider for current details." })
  ] });
}
export {
  WatchPage as component
};
