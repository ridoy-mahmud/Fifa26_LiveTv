import { Q as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { S as notFound, m as isRedirect } from "../_libs/tanstack__router-core.mjs";
import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { c as createServerFn, T as TSS_SERVER_FUNCTION, g as getServerFnById } from "./server-CWPfp1hj.mjs";
import { f as format } from "../_libs/date-fns.mjs";
import { W as Wifi, G as Github, L as LayoutDashboard, a as LogOut, S as ShieldCheck, X, b as LoaderCircle } from "../_libs/lucide-react.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
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
function useServerFn(serverFn) {
  const router2 = useRouter();
  return reactExports.useCallback(async (...args) => {
    try {
      const res = await serverFn(...args);
      if (isRedirect(res)) throw res;
      return res;
    } catch (err) {
      if (isRedirect(err)) {
        err.options._fromLocation = router2.stores.location.get();
        return router2.navigate(router2.resolveRedirect(err).options);
      }
      throw err;
    }
  }, [router2, serverFn]);
}
const appCss = "/assets/styles-CNq3S3kC.css";
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
const LoginInput = objectType({
  email: stringType().email().max(255),
  password: stringType().min(1).max(200)
});
const adminLogin = createServerFn({
  method: "POST"
}).inputValidator((d) => LoginInput.parse(d)).handler(createSsrRpc("89f029f4fc21ed092423cd54f44fb61078423691288a3a89663a6e0973cd86ea"));
const KEY = "wc2026.admin.session.v1";
function setAdminSession(token) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(KEY, token);
  window.dispatchEvent(new CustomEvent("admin:changed"));
}
function clearAdminSession() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(KEY);
  window.dispatchEvent(new CustomEvent("admin:changed"));
}
function getAdminSession() {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(KEY);
}
function isAdmin() {
  return !!getAdminSession();
}
function AdminButton() {
  const router2 = useRouter();
  const login = useServerFn(adminLogin);
  const [open, setOpen] = reactExports.useState(false);
  const [authed, setAuthed] = reactExports.useState(false);
  const [email, setEmail] = reactExports.useState("");
  const [pw, setPw] = reactExports.useState("");
  const [err, setErr] = reactExports.useState(null);
  const [busy, setBusy] = reactExports.useState(false);
  reactExports.useEffect(() => {
    setAuthed(isAdmin());
    const sync = () => setAuthed(isAdmin());
    window.addEventListener("admin:changed", sync);
    return () => window.removeEventListener("admin:changed", sync);
  }, []);
  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const res = await login({ data: { email, password: pw } });
      setAdminSession(res.token);
      setOpen(false);
      setEmail("");
      setPw("");
      router2.navigate({ to: "/admin" });
    } catch {
      setErr("Invalid credentials.");
    } finally {
      setBusy(false);
    }
  };
  const onLogout = () => {
    clearAdminSession();
    router2.navigate({ to: "/" });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    authed ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => router2.navigate({ to: "/admin" }),
          title: "Admin dashboard",
          className: "flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-primary ring-1 ring-primary/40 transition hover:bg-primary/25",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutDashboard, { className: "h-4 w-4" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onLogout,
          title: "Sign out",
          className: "flex h-8 w-8 items-center justify-center rounded-full bg-secondary/60 text-muted-foreground transition hover:text-foreground",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4" })
        }
      )
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => setOpen(true),
        title: "Admin",
        className: "flex h-8 w-8 items-center justify-center rounded-full bg-secondary/60 text-muted-foreground transition hover:bg-primary/15 hover:text-primary",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-4 w-4" })
      }
    ),
    open && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md animate-fade-up",
        onClick: () => setOpen(false),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-2xl",
            onClick: (e) => e.stopPropagation(),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-br from-primary/20 via-card to-card px-6 pt-6 pb-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => setOpen(false),
                    className: "absolute right-3 top-3 rounded-full p-1.5 text-muted-foreground hover:bg-secondary",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 ring-1 ring-primary/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-6 w-6 text-primary" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-3 font-display text-2xl font-bold", children: "Admin sign-in" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Manage channels and the Top 10 lineup." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit, className: "space-y-4 px-6 pb-6 pt-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Email" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "email",
                      required: true,
                      autoFocus: true,
                      value: email,
                      onChange: (e) => setEmail(e.target.value),
                      className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Password" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "password",
                      required: true,
                      value: pw,
                      onChange: (e) => setPw(e.target.value),
                      className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                    }
                  )
                ] }),
                err && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md border border-live/40 bg-live/10 px-3 py-2 text-xs text-live", children: err }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "submit",
                    disabled: busy,
                    className: "flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-glow disabled:opacity-60",
                    children: [
                      busy && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
                      "Sign in"
                    ]
                  }
                )
              ] })
            ]
          }
        )
      }
    )
  ] });
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
const TEAMS = [
  // Group A
  { code: "MEX", name: "Mexico", group: "A" },
  { code: "ZAF", name: "South Africa", group: "A" },
  { code: "KOR", name: "South Korea", group: "A" },
  { code: "CZE", name: "Czechia", group: "A" },
  // Group B
  { code: "CAN", name: "Canada", group: "B" },
  { code: "BIH", name: "Bosnia-Herzegovina", group: "B" },
  { code: "QAT", name: "Qatar", group: "B" },
  { code: "SUI", name: "Switzerland", group: "B" },
  // Group C
  { code: "BRA", name: "Brazil", group: "C" },
  { code: "MAR", name: "Morocco", group: "C" },
  { code: "HAI", name: "Haiti", group: "C" },
  { code: "SCO", name: "Scotland", group: "C" },
  // Group D
  { code: "USA", name: "United States", group: "D" },
  { code: "PAR", name: "Paraguay", group: "D" },
  { code: "AUS", name: "Australia", group: "D" },
  { code: "TUR", name: "Türkiye", group: "D" },
  // Group E
  { code: "GER", name: "Germany", group: "E" },
  { code: "CUW", name: "Curaçao", group: "E" },
  { code: "CIV", name: "Ivory Coast", group: "E" },
  { code: "ECU", name: "Ecuador", group: "E" },
  // Group F
  { code: "NED", name: "Netherlands", group: "F" },
  { code: "JPN", name: "Japan", group: "F" },
  { code: "SWE", name: "Sweden", group: "F" },
  { code: "TUN", name: "Tunisia", group: "F" },
  // Group G
  { code: "BEL", name: "Belgium", group: "G" },
  { code: "EGY", name: "Egypt", group: "G" },
  { code: "IRN", name: "Iran", group: "G" },
  { code: "NZL", name: "New Zealand", group: "G" },
  // Group H
  { code: "ESP", name: "Spain", group: "H" },
  { code: "CPV", name: "Cape Verde", group: "H" },
  { code: "KSA", name: "Saudi Arabia", group: "H" },
  { code: "URU", name: "Uruguay", group: "H" },
  // Group I
  { code: "FRA", name: "France", group: "I" },
  { code: "SEN", name: "Senegal", group: "I" },
  { code: "IRQ", name: "Iraq", group: "I" },
  { code: "NOR", name: "Norway", group: "I" },
  // Group J
  { code: "ARG", name: "Argentina", group: "J" },
  { code: "ALG", name: "Algeria", group: "J" },
  { code: "AUT", name: "Austria", group: "J" },
  { code: "JOR", name: "Jordan", group: "J" },
  // Group K
  { code: "POR", name: "Portugal", group: "K" },
  { code: "COD", name: "DR Congo", group: "K" },
  { code: "UZB", name: "Uzbekistan", group: "K" },
  { code: "COL", name: "Colombia", group: "K" },
  // Group L
  { code: "ENG", name: "England", group: "L" },
  { code: "CRO", name: "Croatia", group: "L" },
  { code: "GHA", name: "Ghana", group: "L" },
  { code: "PAN", name: "Panama", group: "L" }
];
function getTeam(code) {
  return TEAMS.find((t) => t.code === code) ?? { code, name: code, group: "?" };
}
function flagUrl(code) {
  const map = {
    MEX: "mx",
    ZAF: "za",
    KOR: "kr",
    CZE: "cz",
    CAN: "ca",
    BIH: "ba",
    QAT: "qa",
    SUI: "ch",
    BRA: "br",
    MAR: "ma",
    HAI: "ht",
    SCO: "gb-sct",
    USA: "us",
    PAR: "py",
    AUS: "au",
    TUR: "tr",
    GER: "de",
    CUW: "cw",
    CIV: "ci",
    ECU: "ec",
    NED: "nl",
    JPN: "jp",
    SWE: "se",
    TUN: "tn",
    BEL: "be",
    EGY: "eg",
    IRN: "ir",
    NZL: "nz",
    ESP: "es",
    CPV: "cv",
    KSA: "sa",
    URU: "uy",
    FRA: "fr",
    SEN: "sn",
    IRQ: "iq",
    NOR: "no",
    ARG: "ar",
    ALG: "dz",
    AUT: "at",
    JOR: "jo",
    POR: "pt",
    COD: "cd",
    UZB: "uz",
    COL: "co",
    ENG: "gb-eng",
    CRO: "hr",
    GHA: "gh",
    PAN: "pa"
  };
  const iso = map[code] ?? code.toLowerCase().slice(0, 2);
  return `https://flagcdn.com/w160/${iso}.png`;
}
const MATCHES = [
  // ===== GROUP STAGE =====
  // Thursday June 11
  { id: "m1", matchNumber: 1, stage: "Group", group: "A", homeCode: "MEX", awayCode: "ZAF", venue: "Mexico City Stadium", city: "Mexico City", kickoff: "2026-06-11T19:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m2", matchNumber: 2, stage: "Group", group: "A", homeCode: "KOR", awayCode: "CZE", venue: "Estadio Guadalajara", city: "Guadalajara", kickoff: "2026-06-12T02:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  // Friday June 12
  { id: "m3", matchNumber: 3, stage: "Group", group: "B", homeCode: "CAN", awayCode: "BIH", venue: "Toronto Stadium", city: "Toronto", kickoff: "2026-06-12T19:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m4", matchNumber: 4, stage: "Group", group: "D", homeCode: "USA", awayCode: "PAR", venue: "Los Angeles Stadium", city: "Los Angeles", kickoff: "2026-06-13T01:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  // Saturday June 13
  { id: "m5", matchNumber: 5, stage: "Group", group: "B", homeCode: "QAT", awayCode: "SUI", venue: "San Francisco Bay Area Stadium", city: "San Francisco", kickoff: "2026-06-13T19:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m6", matchNumber: 6, stage: "Group", group: "C", homeCode: "BRA", awayCode: "MAR", venue: "New York New Jersey Stadium", city: "New Jersey", kickoff: "2026-06-13T22:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m7", matchNumber: 7, stage: "Group", group: "C", homeCode: "HAI", awayCode: "SCO", venue: "Boston Stadium", city: "Boston", kickoff: "2026-06-14T01:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m8", matchNumber: 8, stage: "Group", group: "D", homeCode: "AUS", awayCode: "TUR", venue: "BC Place", city: "Vancouver", kickoff: "2026-06-14T04:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  // Sunday June 14
  { id: "m9", matchNumber: 9, stage: "Group", group: "E", homeCode: "GER", awayCode: "CUW", venue: "Houston Stadium", city: "Houston", kickoff: "2026-06-14T17:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m10", matchNumber: 10, stage: "Group", group: "F", homeCode: "NED", awayCode: "JPN", venue: "Dallas Stadium", city: "Dallas", kickoff: "2026-06-14T20:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m11", matchNumber: 11, stage: "Group", group: "E", homeCode: "CIV", awayCode: "ECU", venue: "Philadelphia Stadium", city: "Philadelphia", kickoff: "2026-06-14T23:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m12", matchNumber: 12, stage: "Group", group: "F", homeCode: "SWE", awayCode: "TUN", venue: "Estadio Monterrey", city: "Guadalupe", kickoff: "2026-06-15T02:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  // Monday June 15
  { id: "m13", matchNumber: 13, stage: "Group", group: "H", homeCode: "ESP", awayCode: "CPV", venue: "Atlanta Stadium", city: "Atlanta", kickoff: "2026-06-15T16:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m14", matchNumber: 14, stage: "Group", group: "G", homeCode: "BEL", awayCode: "EGY", venue: "BC Place", city: "Vancouver", kickoff: "2026-06-15T19:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m15", matchNumber: 15, stage: "Group", group: "H", homeCode: "KSA", awayCode: "URU", venue: "Miami Stadium", city: "Miami", kickoff: "2026-06-15T22:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m16", matchNumber: 16, stage: "Group", group: "G", homeCode: "IRN", awayCode: "NZL", venue: "Los Angeles Stadium", city: "Los Angeles", kickoff: "2026-06-16T01:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  // Tuesday June 16
  { id: "m17", matchNumber: 17, stage: "Group", group: "I", homeCode: "FRA", awayCode: "SEN", venue: "New York New Jersey Stadium", city: "New Jersey", kickoff: "2026-06-16T19:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m18", matchNumber: 18, stage: "Group", group: "I", homeCode: "IRQ", awayCode: "NOR", venue: "Boston Stadium", city: "Boston", kickoff: "2026-06-16T22:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m19", matchNumber: 19, stage: "Group", group: "J", homeCode: "ARG", awayCode: "ALG", venue: "Kansas City Stadium", city: "Kansas City", kickoff: "2026-06-17T01:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m20", matchNumber: 20, stage: "Group", group: "J", homeCode: "AUT", awayCode: "JOR", venue: "San Francisco Bay Area Stadium", city: "San Francisco", kickoff: "2026-06-17T04:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  // Wednesday June 17
  { id: "m21", matchNumber: 21, stage: "Group", group: "K", homeCode: "POR", awayCode: "COD", venue: "Houston Stadium", city: "Houston", kickoff: "2026-06-17T17:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m22", matchNumber: 22, stage: "Group", group: "L", homeCode: "ENG", awayCode: "CRO", venue: "Dallas Stadium", city: "Dallas", kickoff: "2026-06-17T20:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m23", matchNumber: 23, stage: "Group", group: "L", homeCode: "GHA", awayCode: "PAN", venue: "Toronto Stadium", city: "Toronto", kickoff: "2026-06-17T23:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m24", matchNumber: 24, stage: "Group", group: "K", homeCode: "UZB", awayCode: "COL", venue: "Mexico City Stadium", city: "Mexico City", kickoff: "2026-06-18T02:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  // Thursday June 18
  { id: "m25", matchNumber: 25, stage: "Group", group: "A", homeCode: "CZE", awayCode: "ZAF", venue: "Atlanta Stadium", city: "Atlanta", kickoff: "2026-06-18T16:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m26", matchNumber: 26, stage: "Group", group: "B", homeCode: "SUI", awayCode: "BIH", venue: "Los Angeles Stadium", city: "Los Angeles", kickoff: "2026-06-18T19:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m27", matchNumber: 27, stage: "Group", group: "B", homeCode: "CAN", awayCode: "QAT", venue: "BC Place", city: "Vancouver", kickoff: "2026-06-18T22:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m28", matchNumber: 28, stage: "Group", group: "A", homeCode: "MEX", awayCode: "KOR", venue: "Estadio Guadalajara", city: "Guadalajara", kickoff: "2026-06-19T01:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  // Friday June 19
  { id: "m29", matchNumber: 29, stage: "Group", group: "C", homeCode: "SCO", awayCode: "MAR", venue: "Boston Stadium", city: "Boston", kickoff: "2026-06-19T22:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m30", matchNumber: 30, stage: "Group", group: "D", homeCode: "USA", awayCode: "AUS", venue: "Seattle Stadium", city: "Seattle", kickoff: "2026-06-19T19:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m31", matchNumber: 31, stage: "Group", group: "C", homeCode: "BRA", awayCode: "HAI", venue: "Philadelphia Stadium", city: "Philadelphia", kickoff: "2026-06-20T00:30:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m32", matchNumber: 32, stage: "Group", group: "D", homeCode: "TUR", awayCode: "PAR", venue: "San Francisco Bay Area Stadium", city: "San Francisco", kickoff: "2026-06-20T03:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  // Saturday June 20
  { id: "m33", matchNumber: 33, stage: "Group", group: "F", homeCode: "NED", awayCode: "SWE", venue: "Houston Stadium", city: "Houston", kickoff: "2026-06-20T17:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m34", matchNumber: 34, stage: "Group", group: "E", homeCode: "GER", awayCode: "CIV", venue: "Toronto Stadium", city: "Toronto", kickoff: "2026-06-20T20:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m35", matchNumber: 35, stage: "Group", group: "E", homeCode: "ECU", awayCode: "CUW", venue: "Kansas City Stadium", city: "Kansas City", kickoff: "2026-06-21T03:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m36", matchNumber: 36, stage: "Group", group: "F", homeCode: "TUN", awayCode: "JPN", venue: "Estadio Monterrey", city: "Guadalupe", kickoff: "2026-06-21T04:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  // Sunday June 21
  { id: "m37", matchNumber: 37, stage: "Group", group: "H", homeCode: "ESP", awayCode: "KSA", venue: "Atlanta Stadium", city: "Atlanta", kickoff: "2026-06-21T16:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m38", matchNumber: 38, stage: "Group", group: "G", homeCode: "BEL", awayCode: "IRN", venue: "Los Angeles Stadium", city: "Los Angeles", kickoff: "2026-06-21T19:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m39", matchNumber: 39, stage: "Group", group: "H", homeCode: "URU", awayCode: "CPV", venue: "Miami Stadium", city: "Miami", kickoff: "2026-06-21T22:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m40", matchNumber: 40, stage: "Group", group: "G", homeCode: "NZL", awayCode: "EGY", venue: "BC Place", city: "Vancouver", kickoff: "2026-06-22T01:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  // Monday June 22
  { id: "m41", matchNumber: 41, stage: "Group", group: "J", homeCode: "ARG", awayCode: "AUT", venue: "Dallas Stadium", city: "Dallas", kickoff: "2026-06-22T17:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m42", matchNumber: 42, stage: "Group", group: "I", homeCode: "FRA", awayCode: "IRQ", venue: "Philadelphia Stadium", city: "Philadelphia", kickoff: "2026-06-22T21:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m43", matchNumber: 43, stage: "Group", group: "I", homeCode: "NOR", awayCode: "SEN", venue: "New York New Jersey Stadium", city: "New Jersey", kickoff: "2026-06-23T00:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m44", matchNumber: 44, stage: "Group", group: "J", homeCode: "JOR", awayCode: "ALG", venue: "San Francisco Bay Area Stadium", city: "San Francisco", kickoff: "2026-06-23T03:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  // Tuesday June 23
  { id: "m45", matchNumber: 45, stage: "Group", group: "K", homeCode: "POR", awayCode: "UZB", venue: "Houston Stadium", city: "Houston", kickoff: "2026-06-23T17:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m46", matchNumber: 46, stage: "Group", group: "L", homeCode: "ENG", awayCode: "GHA", venue: "Boston Stadium", city: "Boston", kickoff: "2026-06-23T20:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m47", matchNumber: 47, stage: "Group", group: "L", homeCode: "PAN", awayCode: "CRO", venue: "Toronto Stadium", city: "Toronto", kickoff: "2026-06-23T23:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m48", matchNumber: 48, stage: "Group", group: "K", homeCode: "COL", awayCode: "COD", venue: "Estadio Guadalajara", city: "Guadalajara", kickoff: "2026-06-24T02:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  // Wednesday June 24
  { id: "m49", matchNumber: 49, stage: "Group", group: "B", homeCode: "SUI", awayCode: "CAN", venue: "BC Place", city: "Vancouver", kickoff: "2026-06-24T19:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m50", matchNumber: 50, stage: "Group", group: "B", homeCode: "BIH", awayCode: "QAT", venue: "Seattle Stadium", city: "Seattle", kickoff: "2026-06-24T19:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m51", matchNumber: 51, stage: "Group", group: "C", homeCode: "SCO", awayCode: "BRA", venue: "Miami Stadium", city: "Miami", kickoff: "2026-06-24T22:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m52", matchNumber: 52, stage: "Group", group: "C", homeCode: "MAR", awayCode: "HAI", venue: "Atlanta Stadium", city: "Atlanta", kickoff: "2026-06-24T22:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m53", matchNumber: 53, stage: "Group", group: "A", homeCode: "CZE", awayCode: "MEX", venue: "Mexico City Stadium", city: "Mexico City", kickoff: "2026-06-25T01:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m54", matchNumber: 54, stage: "Group", group: "A", homeCode: "ZAF", awayCode: "KOR", venue: "Estadio Monterrey", city: "Guadalupe", kickoff: "2026-06-25T01:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  // Thursday June 25
  { id: "m55", matchNumber: 55, stage: "Group", group: "E", homeCode: "ECU", awayCode: "GER", venue: "New York New Jersey Stadium", city: "New Jersey", kickoff: "2026-06-25T20:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m56", matchNumber: 56, stage: "Group", group: "E", homeCode: "CUW", awayCode: "CIV", venue: "Philadelphia Stadium", city: "Philadelphia", kickoff: "2026-06-25T20:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m57", matchNumber: 57, stage: "Group", group: "F", homeCode: "JPN", awayCode: "SWE", venue: "Dallas Stadium", city: "Dallas", kickoff: "2026-06-25T23:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m58", matchNumber: 58, stage: "Group", group: "F", homeCode: "TUN", awayCode: "NED", venue: "Kansas City Stadium", city: "Kansas City", kickoff: "2026-06-25T23:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m59", matchNumber: 59, stage: "Group", group: "D", homeCode: "TUR", awayCode: "USA", venue: "Los Angeles Stadium", city: "Los Angeles", kickoff: "2026-06-26T02:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m60", matchNumber: 60, stage: "Group", group: "D", homeCode: "PAR", awayCode: "AUS", venue: "San Francisco Bay Area Stadium", city: "San Francisco", kickoff: "2026-06-26T02:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  // Friday June 26
  { id: "m61", matchNumber: 61, stage: "Group", group: "I", homeCode: "NOR", awayCode: "FRA", venue: "Boston Stadium", city: "Boston", kickoff: "2026-06-26T19:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m62", matchNumber: 62, stage: "Group", group: "I", homeCode: "SEN", awayCode: "IRQ", venue: "Toronto Stadium", city: "Toronto", kickoff: "2026-06-26T19:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m63", matchNumber: 63, stage: "Group", group: "H", homeCode: "CPV", awayCode: "KSA", venue: "Houston Stadium", city: "Houston", kickoff: "2026-06-27T00:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m64", matchNumber: 64, stage: "Group", group: "H", homeCode: "URU", awayCode: "ESP", venue: "Estadio Guadalajara", city: "Guadalajara", kickoff: "2026-06-27T00:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m65", matchNumber: 65, stage: "Group", group: "G", homeCode: "EGY", awayCode: "IRN", venue: "Seattle Stadium", city: "Seattle", kickoff: "2026-06-27T03:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m66", matchNumber: 66, stage: "Group", group: "G", homeCode: "NZL", awayCode: "BEL", venue: "BC Place", city: "Vancouver", kickoff: "2026-06-27T03:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  // Saturday June 27
  { id: "m67", matchNumber: 67, stage: "Group", group: "L", homeCode: "PAN", awayCode: "ENG", venue: "New York New Jersey Stadium", city: "New Jersey", kickoff: "2026-06-27T21:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m68", matchNumber: 68, stage: "Group", group: "L", homeCode: "CRO", awayCode: "GHA", venue: "Philadelphia Stadium", city: "Philadelphia", kickoff: "2026-06-27T21:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m69", matchNumber: 69, stage: "Group", group: "K", homeCode: "COL", awayCode: "POR", venue: "Miami Stadium", city: "Miami", kickoff: "2026-06-27T23:30:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m70", matchNumber: 70, stage: "Group", group: "K", homeCode: "COD", awayCode: "UZB", venue: "Atlanta Stadium", city: "Atlanta", kickoff: "2026-06-27T23:30:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m71", matchNumber: 71, stage: "Group", group: "J", homeCode: "ALG", awayCode: "AUT", venue: "Kansas City Stadium", city: "Kansas City", kickoff: "2026-06-28T02:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m72", matchNumber: 72, stage: "Group", group: "J", homeCode: "JOR", awayCode: "ARG", venue: "Dallas Stadium", city: "Dallas", kickoff: "2026-06-28T02:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  // ===== ROUND OF 32 =====
  { id: "r32-1", matchNumber: 73, stage: "R32", homeCode: "TBD", awayCode: "TBD", venue: "Los Angeles Stadium", city: "Los Angeles", kickoff: "2026-06-28T19:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "r32-2", matchNumber: 74, stage: "R32", homeCode: "TBD", awayCode: "TBD", venue: "Houston Stadium", city: "Houston", kickoff: "2026-06-29T19:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "r32-3", matchNumber: 75, stage: "R32", homeCode: "TBD", awayCode: "TBD", venue: "Boston Stadium", city: "Boston", kickoff: "2026-06-29T20:30:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "r32-4", matchNumber: 76, stage: "R32", homeCode: "TBD", awayCode: "TBD", venue: "Estadio Monterrey", city: "Guadalupe", kickoff: "2026-06-30T01:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "r32-5", matchNumber: 77, stage: "R32", homeCode: "TBD", awayCode: "TBD", venue: "Dallas Stadium", city: "Dallas", kickoff: "2026-06-30T17:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "r32-6", matchNumber: 78, stage: "R32", homeCode: "TBD", awayCode: "TBD", venue: "New York New Jersey Stadium", city: "New Jersey", kickoff: "2026-06-30T21:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "r32-7", matchNumber: 79, stage: "R32", homeCode: "TBD", awayCode: "TBD", venue: "Mexico City Stadium", city: "Mexico City", kickoff: "2026-07-01T01:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "r32-8", matchNumber: 80, stage: "R32", homeCode: "TBD", awayCode: "TBD", venue: "Atlanta Stadium", city: "Atlanta", kickoff: "2026-07-01T16:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "r32-9", matchNumber: 81, stage: "R32", homeCode: "TBD", awayCode: "TBD", venue: "Seattle Stadium", city: "Seattle", kickoff: "2026-07-01T20:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "r32-10", matchNumber: 82, stage: "R32", homeCode: "TBD", awayCode: "TBD", venue: "San Francisco Bay Area Stadium", city: "San Francisco", kickoff: "2026-07-01T20:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "r32-11", matchNumber: 83, stage: "R32", homeCode: "TBD", awayCode: "TBD", venue: "Los Angeles Stadium", city: "Los Angeles", kickoff: "2026-07-02T19:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "r32-12", matchNumber: 84, stage: "R32", homeCode: "TBD", awayCode: "TBD", venue: "Toronto Stadium", city: "Toronto", kickoff: "2026-07-02T23:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "r32-13", matchNumber: 85, stage: "R32", homeCode: "TBD", awayCode: "TBD", venue: "BC Place", city: "Vancouver", kickoff: "2026-07-03T03:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "r32-14", matchNumber: 86, stage: "R32", homeCode: "TBD", awayCode: "TBD", venue: "Dallas Stadium", city: "Dallas", kickoff: "2026-07-03T18:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "r32-15", matchNumber: 87, stage: "R32", homeCode: "TBD", awayCode: "TBD", venue: "Miami Stadium", city: "Miami", kickoff: "2026-07-03T22:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "r32-16", matchNumber: 88, stage: "R32", homeCode: "TBD", awayCode: "TBD", venue: "Kansas City Stadium", city: "Kansas City", kickoff: "2026-07-04T01:30:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  // ===== ROUND OF 16 =====
  { id: "r16-1", matchNumber: 89, stage: "R16", homeCode: "TBD", awayCode: "TBD", venue: "Houston Stadium", city: "Houston", kickoff: "2026-07-04T17:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "r16-2", matchNumber: 90, stage: "R16", homeCode: "TBD", awayCode: "TBD", venue: "Philadelphia Stadium", city: "Philadelphia", kickoff: "2026-07-04T21:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "r16-3", matchNumber: 91, stage: "R16", homeCode: "TBD", awayCode: "TBD", venue: "New York New Jersey Stadium", city: "New Jersey", kickoff: "2026-07-05T20:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "r16-4", matchNumber: 92, stage: "R16", homeCode: "TBD", awayCode: "TBD", venue: "Mexico City Stadium", city: "Mexico City", kickoff: "2026-07-06T00:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "r16-5", matchNumber: 93, stage: "R16", homeCode: "TBD", awayCode: "TBD", venue: "Dallas Stadium", city: "Dallas", kickoff: "2026-07-06T19:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "r16-6", matchNumber: 94, stage: "R16", homeCode: "TBD", awayCode: "TBD", venue: "Seattle Stadium", city: "Seattle", kickoff: "2026-07-07T00:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "r16-7", matchNumber: 95, stage: "R16", homeCode: "TBD", awayCode: "TBD", venue: "Atlanta Stadium", city: "Atlanta", kickoff: "2026-07-07T16:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "r16-8", matchNumber: 96, stage: "R16", homeCode: "TBD", awayCode: "TBD", venue: "BC Place", city: "Vancouver", kickoff: "2026-07-07T20:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  // ===== QUARTERFINALS =====
  { id: "qf-1", matchNumber: 97, stage: "QF", homeCode: "TBD", awayCode: "TBD", venue: "Boston Stadium", city: "Boston", kickoff: "2026-07-09T20:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "qf-2", matchNumber: 98, stage: "QF", homeCode: "TBD", awayCode: "TBD", venue: "Los Angeles Stadium", city: "Los Angeles", kickoff: "2026-07-10T19:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "qf-3", matchNumber: 99, stage: "QF", homeCode: "TBD", awayCode: "TBD", venue: "Miami Stadium", city: "Miami", kickoff: "2026-07-11T20:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "qf-4", matchNumber: 100, stage: "QF", homeCode: "TBD", awayCode: "TBD", venue: "Kansas City Stadium", city: "Kansas City", kickoff: "2026-07-12T01:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  // ===== SEMIFINALS =====
  { id: "sf-1", matchNumber: 101, stage: "SF", homeCode: "TBD", awayCode: "TBD", venue: "Dallas Stadium", city: "Dallas", kickoff: "2026-07-14T19:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "sf-2", matchNumber: 102, stage: "SF", homeCode: "TBD", awayCode: "TBD", venue: "Atlanta Stadium", city: "Atlanta", kickoff: "2026-07-15T19:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  // ===== THIRD PLACE =====
  { id: "3rd", matchNumber: 103, stage: "3rd", homeCode: "TBD", awayCode: "TBD", venue: "Miami Stadium", city: "Miami", kickoff: "2026-07-18T21:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  // ===== FINAL =====
  { id: "final", matchNumber: 104, stage: "Final", homeCode: "TBD", awayCode: "TBD", venue: "New York New Jersey Stadium", city: "New Jersey", kickoff: "2026-07-19T19:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 }
];
function getMatch(id) {
  return MATCHES.find((m) => m.id === id);
}
function upcomingMatches(limit = 6) {
  const now = Date.now();
  return MATCHES.filter((m) => m.status === "scheduled" && new Date(m.kickoff).getTime() > now).sort((a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime()).slice(0, limit);
}
function matchesByGroup(group) {
  return MATCHES.filter((m) => m.group === group);
}
function groupStandings(group) {
  const teams = TEAMS.filter((t) => t.group === group);
  const rows = {};
  for (const t of teams) rows[t.code] = { team: t, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 };
  for (const match of MATCHES.filter((m) => m.group === group && (m.status === "live" || m.status === "ht" || m.status === "ft"))) {
    const h = rows[match.homeCode];
    const a = rows[match.awayCode];
    if (!h || !a) continue;
    h.p++;
    a.p++;
    h.gf += match.homeScore;
    h.ga += match.awayScore;
    a.gf += match.awayScore;
    a.ga += match.homeScore;
    if (match.status === "ft") {
      if (match.homeScore > match.awayScore) {
        h.w++;
        h.pts += 3;
        a.l++;
      } else if (match.homeScore < match.awayScore) {
        a.w++;
        a.pts += 3;
        h.l++;
      } else {
        h.d++;
        a.d++;
        h.pts++;
        a.pts++;
      }
    }
  }
  return Object.values(rows).map((r) => ({ ...r, gd: r.gf - r.ga })).sort((x, y) => y.pts - x.pts || y.gd - x.gd || y.gf - x.gf);
}
const GROUPS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
const worldcupData = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  GROUPS,
  MATCHES,
  TEAMS,
  flagUrl,
  getMatch,
  getTeam,
  groupStandings,
  matchesByGroup,
  upcomingMatches
}, Symbol.toStringTag, { value: "Module" }));
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
const $$splitComponentImporter$7 = () => import("./teams-LPVsNBqj.mjs");
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
        const { MATCHES: MATCHES2, TEAMS: TEAMS2 } = await Promise.resolve().then(() => worldcupData);
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
const $$splitComponentImporter$6 = () => import("./schedule-CpIIeUkC.mjs");
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
const $$splitComponentImporter$5 = () => import("./live-DcIKgIqJ.mjs");
const Route$5 = createFileRoute("/live")({
  head: () => ({
    meta: [{
      title: "Live TV — WC 2026 Live"
    }, {
      name: "description",
      content: "Watch live sports channels — FIFA+, beIN Sports, T Sports, FOX Sports and more on BDIX-optimised streams."
    }, {
      property: "og:title",
      content: "Live TV — WC 2026 Live"
    }, {
      property: "og:description",
      content: "Live sports streaming."
    }],
    links: [{
      rel: "canonical",
      href: "/live"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./groups-B_SWiEdG.mjs");
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
const $$splitComponentImporter$3 = () => import("./admin-xf2giTRZ.mjs");
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
const $$splitComponentImporter$2 = () => import("./index-BhhRExLW.mjs");
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
const $$splitComponentImporter$1 = () => import("./teams._code-CZ8hyOwg.mjs");
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
const $$splitErrorComponentImporter = () => import("./matches._id-CkEgbDnQ.mjs");
const $$splitNotFoundComponentImporter = () => import("./matches._id-BgFvS8yN.mjs");
const $$splitComponentImporter = () => import("./matches._id-Bv8E_SaH.mjs");
const Route = createFileRoute("/matches/$id")({
  loader: ({
    params
  }) => {
    const match = getMatch(params.id);
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
  GROUPS as G,
  MATCHES as M,
  Route$1 as R,
  TEAMS as T,
  getTeam as a,
  Route as b,
  flagUrl as f,
  groupStandings as g,
  isAdmin as i,
  matchesByGroup as m,
  router as r,
  upcomingMatches as u
};
