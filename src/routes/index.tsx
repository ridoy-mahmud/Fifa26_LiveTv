import { createFileRoute, Link } from "@tanstack/react-router";
import { Calendar, Radio, Zap, Globe2 } from "lucide-react";
import heroImg from "@/assets/hero-stadium.jpg";
import { MatchCard } from "@/components/match/MatchCard";
import { upcomingMatches } from "@/lib/worldcup-data";

const LOGO = "https://i.ibb.co.com/xqDjvtSg/fifa-world-cup-2026-logo-white.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WC 2026 Live — Live Scores, Schedule & Streaming" },
      { name: "description", content: "Follow FIFA World Cup 2026 with live scores, real-time match updates, the full schedule with countdowns, and live streaming." },
      { property: "og:title", content: "WC 2026 Live" },
      { property: "og:description", content: "Live scores, schedule, and streaming for FIFA World Cup 2026." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

const stats = [
  { value: "48", label: "Teams" },
  { value: "12", label: "Groups" },
  { value: "104", label: "Matches" },
  { value: "16", label: "Host cities" },
];

function HomePage() {
  const upcoming = upcomingMatches(6);

  return (
    <div>
      {/* ── HERO ── */}
      <section className="relative isolate overflow-hidden min-h-[75vh] flex items-center">
        {/* background */}
        <img
          src={heroImg}
          alt=""
          width={1920}
          height={1080}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-40"
        />
        {/* layered gradients for depth */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/50 via-background/65 to-background" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background/30 via-transparent to-background/30" />
        {/* subtle green pitch glow */}
        <div className="absolute bottom-0 left-1/2 -z-10 h-[40%] w-[80%] -translate-x-1/2 rounded-full bg-primary/10 blur-[80px]" />

        <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16 text-center">
          {/* animated logo */}
          <div className="mb-8 flex justify-center animate-fade-up">
            <div className="relative">
              <div className="absolute -inset-3 rounded-full bg-primary/10 blur-xl animate-pulse" />
              <img
                src={LOGO}
                alt="FIFA World Cup 2026"
                width={120}
                height={120}
                className="relative h-28 w-28 sm:h-36 sm:w-36 object-contain drop-shadow-[0_0_28px_rgba(100,200,100,0.45)] transition-transform hover:scale-105"
              />
            </div>
          </div>

          {/* badge */}
          <div
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary animate-fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            FIFA World Cup 2026 · USA · Canada · Mexico
          </div>

          {/* headline */}
          <h1
            className="font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl animate-fade-up"
            style={{ animationDelay: "0.15s" }}
          >
            The road to the{" "}
            <span className="text-gradient-gold">2026 final</span>.
          </h1>

          {/* sub */}
          <p
            className="mt-5 mx-auto max-w-xl text-base text-muted-foreground sm:text-lg animate-fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            Every match. Every goal. Live scores and real-time streaming from the biggest World Cup ever.
          </p>

          {/* CTA buttons */}
          <div
            className="mt-10 flex flex-wrap justify-center gap-4 animate-fade-up"
            style={{ animationDelay: "0.25s" }}
          >
            <Link
              to="/live"
              className="group inline-flex items-center gap-2.5 rounded-xl bg-primary px-7 py-3.5 text-sm font-bold text-primary-foreground shadow-glow transition-all hover:bg-primary-glow hover:scale-105 hover:shadow-[0_0_30px_-4px_var(--primary)]"
            >
              <Radio className="h-4 w-4 animate-pulse-live" />
              Watch Live TV
            </Link>
            <Link
              to="/schedule"
              className="group inline-flex items-center gap-2.5 rounded-xl border border-border bg-card/70 px-7 py-3.5 text-sm font-bold backdrop-blur transition-all hover:border-primary/50 hover:bg-card hover:scale-105"
            >
              <Calendar className="h-4 w-4" />
              Full Schedule
            </Link>
          </div>

          {/* stat pills */}
          <div
            className="mt-14 flex flex-wrap justify-center gap-3 animate-fade-up"
            style={{ animationDelay: "0.3s" }}
          >
            {stats.map((s) => (
              <div
                key={s.label}
                className="flex items-center gap-2 rounded-full border border-border bg-card/60 px-5 py-2 backdrop-blur transition-all hover:border-primary/40 hover:bg-primary/5 hover:scale-105 cursor-default"
              >
                <span className="font-display text-xl font-bold text-primary">{s.value}</span>
                <span className="text-xs font-medium text-muted-foreground">{s.label}</span>
              </div>
            ))}
          </div>

          {/* host cities row */}
          <div
            className="mt-6 flex flex-wrap justify-center gap-2 animate-fade-up"
            style={{ animationDelay: "0.35s" }}
          >
            {["🇺🇸 USA", "🇨🇦 Canada", "🇲🇽 Mexico"].map((flag) => (
              <span
                key={flag}
                className="rounded-full border border-border/60 bg-secondary/40 px-3 py-1 text-xs font-medium text-muted-foreground"
              >
                {flag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── UPCOMING ── */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Coming up</span>
            <h2 className="mt-1 font-display text-3xl font-bold sm:text-4xl">Next kick-offs</h2>
          </div>
          <Link to="/schedule" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Full schedule →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {upcoming.map((m) => <MatchCard key={m.id} match={m} />)}
        </div>
        {upcoming.length === 0 && (
          <p className="text-center text-muted-foreground py-12">No upcoming matches. Check back soon.</p>
        )}
      </section>

      {/* ── QUICK NAV ── */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2">
          <Link
            to="/schedule"
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-7 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow"
          >
            <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-primary/5 blur-2xl transition group-hover:bg-primary/10" />
            <Calendar className="h-7 w-7 text-primary" />
            <h3 className="mt-4 font-display text-xl font-bold">Match schedule</h3>
            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">All 104 matches with live countdowns, venues, and real-time results.</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:underline">
              View schedule <Zap className="h-3.5 w-3.5" />
            </span>
          </Link>
          <Link
            to="/live"
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-7 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow"
          >
            <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-live/5 blur-2xl transition group-hover:bg-live/10" />
            <Radio className="h-7 w-7 text-primary" />
            <h3 className="mt-4 font-display text-xl font-bold">Live TV</h3>
            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">Stream beIN Sports, FIFA+, T Sports, Fox Sports and more — BDIX optimised.</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:underline">
              Watch now <Globe2 className="h-3.5 w-3.5" />
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
