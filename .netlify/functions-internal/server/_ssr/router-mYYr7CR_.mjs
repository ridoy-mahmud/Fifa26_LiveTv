import { b as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { S as notFound } from "../_libs/tanstack__router-core.mjs";
import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { g as getTeam, T as TEAMS, M as MATCHES, A as ALL_GROUPS } from "./worldcup-data-CJq_BX3J.mjs";
import { c as createServerFn, T as TSS_SERVER_FUNCTION, g as getServerFnById } from "./index.mjs";
import { f as format } from "../_libs/date-fns.mjs";
import { W as Wifi, G as Github, L as LayoutDashboard } from "../_libs/lucide-react.mjs";
import { o as objectType, s as stringType, n as numberType, b as booleanType, e as enumType, a as arrayType } from "../_libs/zod.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
const appCss = "/assets/styles-CETWnbQn.css";
function reportLovableError(error, context = {}) {
  if (typeof window === "undefined") return;
  window.__lovableEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error"
    }
  );
}
function AdminButton() {
  const router2 = useRouter();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      onClick: () => router2.navigate({ to: "/admin" }),
      title: "Admin dashboard",
      className: "flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-primary ring-1 ring-primary/40 transition hover:bg-primary/25",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutDashboard, { className: "h-4 w-4" })
    }
  );
}
const LOGO = "https://i.ibb.co.com/xqDjvtSg/fifa-world-cup-2026-logo-white.png";
const links = [
  { to: "/", label: "Home" },
  { to: "/live", label: "Live TV" },
  { to: "/schedule", label: "Schedule" }
];
function Navbar() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "glass sticky top-0 z-50", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-2.5 group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: LOGO,
            alt: "FIFA World Cup 2026",
            width: 36,
            height: 36,
            className: "h-9 w-9 object-contain transition-transform group-hover:scale-110"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col leading-none", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-base font-bold tracking-tight", children: "WC 2026" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-[0.18em] text-muted-foreground", children: "Live" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "hidden items-center gap-1 md:flex", children: links.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: l.to,
          activeOptions: { exact: l.to === "/" },
          activeProps: { className: "bg-primary/15 text-primary" },
          inactiveProps: { className: "text-muted-foreground hover:text-foreground hover:bg-secondary/60" },
          className: "rounded-md px-3 py-2 text-sm font-medium transition-colors",
          children: l.label
        },
        l.to
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "hidden items-center gap-1.5 rounded-full bg-primary/15 px-2.5 py-1 text-[11px] font-semibold text-primary ring-1 ring-primary/30 sm:inline-flex", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Wifi, { className: "h-3 w-3" }),
          " BDIX Ready"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AdminButton, {})
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex items-center gap-1 overflow-x-auto px-4 pb-2 md:hidden", children: links.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: l.to,
        activeOptions: { exact: l.to === "/" },
        activeProps: { className: "bg-primary/15 text-primary" },
        inactiveProps: { className: "text-muted-foreground" },
        className: "shrink-0 rounded-md px-3 py-1.5 text-sm font-medium",
        children: l.label
      },
      l.to
    )) })
  ] });
}
function Footer() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "mt-24 border-t border-border bg-card/40", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg font-bold", children: "WC 2026 Live" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Live scores, the full match schedule, and streaming for FIFA World Cup 2026 across the USA, Canada, and Mexico." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-semibold uppercase tracking-wider text-muted-foreground", children: "Navigate" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-3 space-y-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { className: "transition hover:text-primary", href: "/schedule", children: "Full schedule" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { className: "transition hover:text-primary", href: "/live", children: "Live TV" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-semibold uppercase tracking-wider text-muted-foreground", children: "About" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-muted-foreground", children: "Independent fan companion. Not affiliated with FIFA. All broadcasting rights belong to their respective licensed holders." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-4 sm:flex-row sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " WC 2026 Live"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "a",
        {
          href: "https://github.com/ridoy-mahmud",
          target: "_blank",
          rel: "noopener noreferrer",
          className: "group inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-foreground",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Github, { className: "h-3.5 w-3.5 transition group-hover:text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Built by" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground group-hover:text-primary", children: "Ridoy" })
          ]
        }
      )
    ] }) })
  ] });
}
function NoInspect() {
  reactExports.useEffect(() => {
    const onCtx = (e) => e.preventDefault();
    const onKey = (e) => {
      const k = e.key.toLowerCase();
      if (k === "f12" || (e.ctrlKey || e.metaKey) && e.shiftKey && (k === "i" || k === "j" || k === "c") || (e.ctrlKey || e.metaKey) && k === "u") {
        e.preventDefault();
      }
    };
    const onDrag = (e) => e.preventDefault();
    document.addEventListener("contextmenu", onCtx);
    document.addEventListener("keydown", onKey);
    document.addEventListener("dragstart", onDrag);
    return () => {
      document.removeEventListener("contextmenu", onCtx);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("dragstart", onDrag);
    };
  }, []);
  return null;
}
function useStripMatches() {
  return reactExports.useMemo(() => {
    const live = MATCHES.filter((m) => m.status === "live" || m.status === "ht");
    const scheduled = MATCHES.filter((m) => m.status === "scheduled").sort((a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime());
    const ft = MATCHES.filter((m) => m.status === "ft").sort((a, b) => new Date(b.kickoff).getTime() - new Date(a.kickoff).getTime()).slice(0, 6);
    return [...live, ...scheduled, ...ft];
  }, []);
}
function MatchStrip() {
  const matches = useStripMatches();
  if (matches.length === 0) return null;
  const items = [...matches, ...matches];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-[60] overflow-hidden border-b border-border bg-card/80 backdrop-blur-sm py-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-card/90 to-transparent" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-card/90 to-transparent" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex w-max items-center gap-0 whitespace-nowrap",
        style: { animation: "ticker 600s linear infinite" },
        children: items.map((m, i) => {
          const home = getTeam(m.homeCode);
          const away = getTeam(m.awayCode);
          const isLive = m.status === "live" || m.status === "ht";
          const isFt = m.status === "ft";
          let scoreOrTime;
          if (isLive) {
            scoreOrTime = /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 font-display font-bold text-live", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 animate-pulse-live rounded-full bg-live" }),
              m.homeScore,
              "–",
              m.awayScore,
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-normal opacity-80", children: [
                m.minute,
                "'"
              ] })
            ] });
          } else if (isFt) {
            scoreOrTime = /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display font-bold text-muted-foreground", children: [
              m.homeScore,
              "–",
              m.awayScore,
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-0.5 text-[9px] font-normal uppercase tracking-wide opacity-70", children: " FT" })
            ] });
          } else {
            scoreOrTime = /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[11px] text-muted-foreground", children: [
              "· ",
              format(new Date(m.kickoff), "MMM d HH:mm")
            ] });
          }
          const homeName = home.code === "TBD" ? "TBD" : home.code;
          const awayName = away.code === "TBD" ? "TBD" : away.code;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link,
            {
              to: "/matches/$id",
              params: { id: m.id },
              className: `group flex items-center gap-1.5 px-4 py-2 text-[12px] transition-colors hover:bg-primary/10 ${isLive ? "text-foreground" : "text-foreground/80"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold tracking-wide group-hover:text-primary", children: homeName }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "vs" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold tracking-wide group-hover:text-primary", children: awayName }),
                scoreOrTime,
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 text-border", children: "•" })
              ]
            },
            `strip-${m.id}-${i}`
          );
        })
      }
    )
  ] });
}
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-7xl font-bold text-gradient-gold", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold", children: "Off the pitch" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "That page doesn't exist. Try the schedule or head home." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-glow", children: "Home" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/schedule", className: "rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-secondary", children: "Schedule" })
    ] })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  reactExports.useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight", children: "Something went off-side" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "An error occurred while loading this page." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-glow",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/", className: "rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-secondary", children: "Go home" })
    ] })
  ] }) });
}
const Route$a = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "WC 2026 Companion — FIFA World Cup Schedule, Scores & Groups" },
      { name: "description", content: "Your independent companion for FIFA World Cup 2026. Live scores, full schedule, group standings, and team info across the USA, Canada, and Mexico." },
      { name: "theme-color", content: "#0a1419" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "WC 2026 Companion" },
      { property: "og:title", content: "WC 2026 Companion — Schedule, Scores & Groups" },
      { property: "og:description", content: "Live scores, schedule, and group standings for FIFA World Cup 2026." },
      { name: "twitter:card", content: "summary_large_image" }
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "https://i.ibb.co.com/xqDjvtSg/fifa-world-cup-2026-logo-white.png" },
      { rel: "apple-touch-icon", href: "https://i.ibb.co.com/xqDjvtSg/fifa-world-cup-2026-logo-white.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@500;600;700;800&display=swap" }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$a.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(QueryClientProvider, { client: queryClient, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(NoInspect, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-screen flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(MatchStrip, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Navbar, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
    ] })
  ] });
}
const $$splitComponentImporter$8 = () => import("./watch-BJMTPFVO.mjs");
const Route$9 = createFileRoute("/watch")({
  head: () => ({
    meta: [{
      title: "Where to Watch — WC 2026 Companion"
    }, {
      name: "description",
      content: "Official FIFA World Cup 2026 broadcasters by region. Find the licensed broadcaster in your country."
    }, {
      property: "og:title",
      content: "Where to Watch FIFA World Cup 2026"
    }, {
      property: "og:description",
      content: "Official broadcasters by region."
    }, {
      property: "og:url",
      content: "/watch"
    }],
    links: [{
      rel: "canonical",
      href: "/watch"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./teams-Cu2ZBtNP.mjs");
const Route$8 = createFileRoute("/teams")({
  head: () => ({
    meta: [{
      title: "All 48 Teams — WC 2026 Companion"
    }, {
      name: "description",
      content: "Browse every national team in the FIFA World Cup 2026, organized by group."
    }, {
      property: "og:title",
      content: "All 48 Teams — WC 2026 Companion"
    }, {
      property: "og:description",
      content: "Browse every national team competing in FIFA World Cup 2026."
    }, {
      property: "og:url",
      content: "/teams"
    }],
    links: [{
      rel: "canonical",
      href: "/teams"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const BASE_URL = "";
const Route$7 = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const { MATCHES: MATCHES2, TEAMS: TEAMS2 } = await import("./worldcup-data-CJq_BX3J.mjs").then((n) => n.w);
        const entries = [
          { path: "/", changefreq: "daily", priority: "1.0" },
          { path: "/schedule", changefreq: "daily", priority: "0.9" },
          { path: "/groups", changefreq: "daily", priority: "0.9" },
          { path: "/teams", changefreq: "weekly", priority: "0.8" },
          { path: "/watch", changefreq: "monthly", priority: "0.6" },
          ...MATCHES2.map((m) => ({ path: `/matches/${m.id}`, changefreq: "hourly", priority: "0.7" })),
          ...TEAMS2.map((t) => ({ path: `/teams/${t.code}`, changefreq: "weekly", priority: "0.6" }))
        ];
        const urls = entries.map(
          (e) => [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`
          ].filter(Boolean).join("\n")
        );
        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`
        ].join("\n");
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" }
        });
      }
    }
  }
});
const $$splitComponentImporter$6 = () => import("./schedule-DnB_K8QK.mjs");
const Route$6 = createFileRoute("/schedule")({
  head: () => ({
    meta: [{
      title: "Full Schedule — WC 2026 Live"
    }, {
      name: "description",
      content: "Complete FIFA World Cup 2026 match schedule — all 104 matches with live countdowns, kick-off times, venues, and scores."
    }, {
      property: "og:title",
      content: "Full Schedule — WC 2026 Live"
    }, {
      property: "og:description",
      content: "Every match, every kick-off. All 104 FIFA World Cup 2026 matches."
    }, {
      property: "og:url",
      content: "/schedule"
    }],
    links: [{
      rel: "canonical",
      href: "/schedule"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./live-BkE9ecLm.mjs");
const Route$5 = createFileRoute("/live")({
  head: () => ({
    meta: [{
      title: "Live TV — WC 2026 Live"
    }, {
      name: "description",
      content: "Watch live sports channels — FIFA+, beIN Sports, T Sports, FOX Sports and more."
    }, {
      property: "og:title",
      content: "Live TV — WC 2026 Live"
    }],
    links: [{
      rel: "canonical",
      href: "/live"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./groups-CIvRBSqm.mjs");
const Route$4 = createFileRoute("/groups")({
  head: () => ({
    meta: [{
      title: "Group Standings — WC 2026 Companion"
    }, {
      name: "description",
      content: "Live group standings for all 12 FIFA World Cup 2026 groups."
    }, {
      property: "og:title",
      content: "Group Standings — WC 2026 Companion"
    }, {
      property: "og:description",
      content: "Points, goal difference, and qualification picture for all 12 groups."
    }, {
      property: "og:url",
      content: "/groups"
    }],
    links: [{
      rel: "canonical",
      href: "/groups"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./admin-CmM3KT26.mjs");
const Route$3 = createFileRoute("/admin")({
  head: () => ({
    meta: [{
      title: "Admin — WC 2026"
    }, {
      name: "robots",
      content: "noindex, nofollow"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./index-Jc3N6AOC.mjs");
const Route$2 = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "WC 2026 Live — Live Scores, Schedule & Streaming"
    }, {
      name: "description",
      content: "Follow FIFA World Cup 2026 with live scores, real-time match updates, the full schedule with countdowns, and live streaming."
    }, {
      property: "og:title",
      content: "WC 2026 Live"
    }, {
      property: "og:description",
      content: "Live scores, schedule, and streaming for FIFA World Cup 2026."
    }, {
      property: "og:url",
      content: "/"
    }],
    links: [{
      rel: "canonical",
      href: "/"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitErrorComponentImporter$1 = () => import("./teams._code-Blkv86Xf.mjs");
const $$splitNotFoundComponentImporter$1 = () => import("./teams._code-CbXdr24X.mjs");
const $$splitComponentImporter$1 = () => import("./teams._code-jy8-7lTS.mjs");
const Route$1 = createFileRoute("/teams/$code")({
  loader: ({
    params
  }) => {
    const team = TEAMS.find((t) => t.code === params.code.toUpperCase());
    if (!team) throw notFound();
    return {
      team
    };
  },
  head: ({
    params,
    loaderData
  }) => {
    const name = loaderData?.team.name ?? params.code;
    return {
      meta: [{
        title: `${name} — WC 2026 Companion`
      }, {
        name: "description",
        content: `${name} at FIFA World Cup 2026: matches, group, and results.`
      }, {
        property: "og:title",
        content: `${name} — WC 2026`
      }, {
        property: "og:description",
        content: `Follow ${name} at the FIFA World Cup 2026.`
      }, {
        property: "og:url",
        content: `/teams/${params.code}`
      }],
      links: [{
        rel: "canonical",
        href: `/teams/${params.code}`
      }]
    };
  },
  component: lazyRouteComponent($$splitComponentImporter$1, "component"),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter$1, "notFoundComponent"),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter$1, "errorComponent")
});
var createSsrRpc = (functionId) => {
  const url = "/_serverFn/" + functionId;
  const serverFnMeta = { id: functionId };
  const fn = async (...args) => {
    return (await getServerFnById(functionId))(...args);
  };
  return Object.assign(fn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const ChannelInput = objectType({
  id: stringType().min(1),
  name: stringType().min(1),
  group: enumType(ALL_GROUPS),
  logo: stringType().optional().default(""),
  url: stringType().min(1),
  fallbackUrl: stringType().optional(),
  featured: booleanType().optional().default(false),
  order: numberType().int().optional()
});
const ChannelPatch = objectType({
  id: stringType().min(1),
  name: stringType().min(1).optional(),
  group: enumType(ALL_GROUPS).optional(),
  logo: stringType().optional(),
  url: stringType().min(1).optional(),
  fallbackUrl: stringType().optional(),
  featured: booleanType().optional(),
  order: numberType().int().optional()
});
const IdsInput = objectType({
  orderedIds: arrayType(stringType().min(1))
});
const ReplaceAllInput = objectType({
  rows: arrayType(ChannelInput)
});
const ImportInput = objectType({
  rows: arrayType(objectType({
    name: stringType().min(1),
    group: enumType(ALL_GROUPS),
    logo: stringType().optional().default(""),
    url: stringType().min(1),
    fallbackUrl: stringType().optional(),
    featured: booleanType().optional().default(false)
  }))
});
const listChannels = createServerFn({
  method: "GET"
}).handler(createSsrRpc("a4d3d836b2ec5bb18595e71927da1043708e773f21a27e8c78ac3b045561cb92"));
const upsertChannel = createServerFn({
  method: "POST"
}).validator((d) => ChannelInput.parse(d)).handler(createSsrRpc("b64bc6ca3288aee8e0155452ab066f5313a726a471dcca2309979b41aad835d6"));
const patchChannel = createServerFn({
  method: "POST"
}).validator((d) => ChannelPatch.parse(d)).handler(createSsrRpc("44e3db047e42fd4696efb5a8651409a2b9c34e0bbb4006866523d2eb80d0a06c"));
const toggleFeatured = createServerFn({
  method: "POST"
}).validator((d) => objectType({
  id: stringType().min(1)
}).parse(d)).handler(createSsrRpc("2e815e0d02eccf425172a4e87c131b25a0720e19cb4706bae13ebd6d21a5ed78"));
const deleteChannel = createServerFn({
  method: "POST"
}).validator((d) => objectType({
  id: stringType().min(1)
}).parse(d)).handler(createSsrRpc("885d71df7f59db4c5aad3feb4660cedbabb379054c28cb66f294a6c56f0961b2"));
const reorderChannels = createServerFn({
  method: "POST"
}).validator((d) => IdsInput.parse(d)).handler(createSsrRpc("044c5c43fb51f439091dec031369c9b2618383d2a6da4d4ffbafc6cd49769e10"));
const replaceAllChannels = createServerFn({
  method: "POST"
}).validator((d) => ReplaceAllInput.parse(d)).handler(createSsrRpc("614a55c1a8ef8c1d548e6b6f99714d7ce9c0202eebbbf07b8f398eb1e4dce871"));
const importChannels = createServerFn({
  method: "POST"
}).validator((d) => ImportInput.parse(d)).handler(createSsrRpc("86e14cfe6762e92d796d752b59cec0f253a5f9727f3283b4d72fee4cfef6edc1"));
const listMatches = createServerFn({
  method: "GET"
}).handler(createSsrRpc("4f50a6fd1428ed49ce9a72f40ff4cd5948db4a5c46e768f8cf7ef21d8ca9ed1a"));
const listTeams = createServerFn({
  method: "GET"
}).handler(createSsrRpc("ed2f19cf3696be8f208607eda59418183a49b316debb90f42feda95f734ad234"));
const IdInput = objectType({
  id: stringType().min(1)
});
const getMatchById = createServerFn({
  method: "GET"
}).validator((d) => IdInput.parse(d)).handler(createSsrRpc("a4f5f49fc2d6c87836a81659ac558896ffeec8946d9cd025ddee9808d2853953"));
const getMongoStatus = createServerFn({
  method: "GET"
}).handler(createSsrRpc("6a5d1c579e0c5f653528260f2a8441d75ad8eec1dbaf5715f3caedb6ef47078c"));
const $$splitErrorComponentImporter = () => import("./matches._id-CkEgbDnQ.mjs");
const $$splitNotFoundComponentImporter = () => import("./matches._id-BgFvS8yN.mjs");
const $$splitComponentImporter = () => import("./matches._id-CTZvHmlK.mjs");
const Route = createFileRoute("/matches/$id")({
  loader: async ({
    params
  }) => {
    const {
      match
    } = await getMatchById({
      data: {
        id: params.id
      }
    });
    if (!match) throw notFound();
    return {
      match
    };
  },
  head: ({
    params,
    loaderData
  }) => {
    const m = loaderData?.match;
    const title = m ? `${getTeam(m.homeCode).name} vs ${getTeam(m.awayCode).name} — WC 2026` : `Match ${params.id}`;
    const desc = m ? `${getTeam(m.homeCode).name} vs ${getTeam(m.awayCode).name} · ${m.venue}, ${m.city} · Group ${m.group ?? m.stage}` : "FIFA World Cup 2026 match";
    return {
      meta: [{
        title
      }, {
        name: "description",
        content: desc
      }, {
        property: "og:title",
        content: title
      }, {
        property: "og:description",
        content: desc
      }, {
        property: "og:type",
        content: "article"
      }, {
        property: "og:url",
        content: `/matches/${params.id}`
      }],
      links: [{
        rel: "canonical",
        href: `/matches/${params.id}`
      }],
      scripts: m ? [{
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SportsEvent",
          name: `${getTeam(m.homeCode).name} vs ${getTeam(m.awayCode).name}`,
          startDate: m.kickoff,
          sport: "Soccer",
          location: {
            "@type": "Place",
            name: m.venue,
            address: m.city
          },
          competitor: [{
            "@type": "SportsTeam",
            name: getTeam(m.homeCode).name
          }, {
            "@type": "SportsTeam",
            name: getTeam(m.awayCode).name
          }]
        })
      }] : []
    };
  },
  component: lazyRouteComponent($$splitComponentImporter, "component"),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent"),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent")
});
const WatchRoute = Route$9.update({
  id: "/watch",
  path: "/watch",
  getParentRoute: () => Route$a
});
const TeamsRoute = Route$8.update({
  id: "/teams",
  path: "/teams",
  getParentRoute: () => Route$a
});
const SitemapDotxmlRoute = Route$7.update({
  id: "/sitemap.xml",
  path: "/sitemap.xml",
  getParentRoute: () => Route$a
});
const ScheduleRoute = Route$6.update({
  id: "/schedule",
  path: "/schedule",
  getParentRoute: () => Route$a
});
const LiveRoute = Route$5.update({
  id: "/live",
  path: "/live",
  getParentRoute: () => Route$a
});
const GroupsRoute = Route$4.update({
  id: "/groups",
  path: "/groups",
  getParentRoute: () => Route$a
});
const AdminRoute = Route$3.update({
  id: "/admin",
  path: "/admin",
  getParentRoute: () => Route$a
});
const IndexRoute = Route$2.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$a
});
const TeamsCodeRoute = Route$1.update({
  id: "/$code",
  path: "/$code",
  getParentRoute: () => TeamsRoute
});
const MatchesIdRoute = Route.update({
  id: "/matches/$id",
  path: "/matches/$id",
  getParentRoute: () => Route$a
});
const TeamsRouteChildren = {
  TeamsCodeRoute
};
const TeamsRouteWithChildren = TeamsRoute._addFileChildren(TeamsRouteChildren);
const rootRouteChildren = {
  IndexRoute,
  AdminRoute,
  GroupsRoute,
  LiveRoute,
  ScheduleRoute,
  SitemapDotxmlRoute,
  TeamsRoute: TeamsRouteWithChildren,
  WatchRoute,
  MatchesIdRoute
};
const routeTree = Route$a._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Route$1 as R,
  listMatches as a,
  listChannels as b,
  createSsrRpc as c,
  deleteChannel as d,
  replaceAllChannels as e,
  Route as f,
  getMongoStatus as g,
  router as h,
  importChannels as i,
  listTeams as l,
  patchChannel as p,
  reorderChannels as r,
  toggleFeatured as t,
  upsertChannel as u
};
