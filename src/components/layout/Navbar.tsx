import { Link } from "@tanstack/react-router";
import { Wifi } from "lucide-react";
import { AdminButton } from "@/components/admin/AdminButton";

const LOGO = "https://i.ibb.co.com/xqDjvtSg/fifa-world-cup-2026-logo-white.png";

const links = [
  { to: "/", label: "Home" },
  { to: "/live", label: "Live TV" },
  { to: "/schedule", label: "Schedule" },
] as const;

export function Navbar() {
  return (
    <header className="glass sticky top-0 z-50">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5 group">
          <img
            src={LOGO}
            alt="FIFA World Cup 2026"
            width={36}
            height={36}
            className="h-9 w-9 object-contain transition-transform group-hover:scale-110"
          />
          <div className="flex flex-col leading-none">
            <span className="font-display text-base font-bold tracking-tight">WC&nbsp;2026</span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Live</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              activeProps={{ className: "bg-primary/15 text-primary" }}
              inactiveProps={{ className: "text-muted-foreground hover:text-foreground hover:bg-secondary/60" }}
              className="rounded-md px-3 py-2 text-sm font-medium transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-1.5 rounded-full bg-primary/15 px-2.5 py-1 text-[11px] font-semibold text-primary ring-1 ring-primary/30 sm:inline-flex">
            <Wifi className="h-3 w-3" /> BDIX Ready
          </span>
          <AdminButton />
        </div>
      </div>

      {/* mobile nav */}
      <nav className="flex items-center gap-1 overflow-x-auto px-4 pb-2 md:hidden">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            activeOptions={{ exact: l.to === "/" }}
            activeProps={{ className: "bg-primary/15 text-primary" }}
            inactiveProps={{ className: "text-muted-foreground" }}
            className="shrink-0 rounded-md px-3 py-1.5 text-sm font-medium"
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
