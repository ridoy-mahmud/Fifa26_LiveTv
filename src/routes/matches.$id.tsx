import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getMatch, getTeam, flagUrl, type Match, type MatchEvent } from "@/lib/worldcup-data";
import { getMatchById } from "@/lib/api/channels.functions";
import { format } from "date-fns";
import { MapPin, Calendar, Hash } from "lucide-react";

export const Route = createFileRoute("/matches/$id")({
  loader: async ({ params }) => {
    // Server-side lookup through the canonical MongoDB-backed source,
    // falling back to the bundled defaults if the DB has no record.
    const { match } = await getMatchById({ data: { id: params.id } });
    if (!match) throw notFound();
    return { match };
  },
  head: ({ params, loaderData }) => {
    const m = loaderData?.match;
    const title = m ? `${getTeam(m.homeCode).name} vs ${getTeam(m.awayCode).name} — WC 2026` : `Match ${params.id}`;
    const desc = m ? `${getTeam(m.homeCode).name} vs ${getTeam(m.awayCode).name} · ${m.venue}, ${m.city} · Group ${m.group ?? m.stage}` : "FIFA World Cup 2026 match";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/matches/${params.id}` },
      ],
      links: [{ rel: "canonical", href: `/matches/${params.id}` }],
      scripts: m ? [{
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SportsEvent",
          name: `${getTeam(m.homeCode).name} vs ${getTeam(m.awayCode).name}`,
          startDate: m.kickoff,
          sport: "Soccer",
          location: { "@type": "Place", name: m.venue, address: m.city },
          competitor: [
            { "@type": "SportsTeam", name: getTeam(m.homeCode).name },
            { "@type": "SportsTeam", name: getTeam(m.awayCode).name },
          ],
        }),
      }] : [],
    };
  },
  component: MatchPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="font-display text-3xl font-bold">Match not found</h1>
      <Link to="/schedule" className="mt-4 inline-block text-primary hover:underline">← Schedule</Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="font-display text-3xl font-bold">Couldn't load match</h1>
      <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
    </div>
  ),
});

function StatusBadge({ match }: { match: Match }) {
  if (match.status === "live") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-live/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-live">
        <span className="h-1.5 w-1.5 animate-pulse-live rounded-full bg-live" />
        Live · {match.minute}'
      </span>
    );
  }
  if (match.status === "ht") return <span className="rounded-full bg-gold/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-gold">Half time</span>;
  if (match.status === "ft") return <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">Full time</span>;
  return <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">Upcoming</span>;
}

function MatchPage() {
  const { match } = Route.useLoaderData();
  const home = getTeam(match.homeCode);
  const away = getTeam(match.awayCode);
  const showScore = match.status !== "scheduled";

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <Link to="/schedule" className="text-sm text-muted-foreground hover:text-primary">← All matches</Link>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-card">
        {/* Header bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-gradient-to-r from-primary/10 to-transparent px-6 py-3 text-sm">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Hash className="h-3.5 w-3.5" />
            <span>Match {match.matchNumber}</span>
            <span>·</span>
            <span>{match.group ? `Group ${match.group}` : match.stage}</span>
          </div>
          <StatusBadge match={match} />
        </div>

        {/* Scoreline */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-6 py-10 sm:gap-8 sm:py-14">
          <Link to="/teams/$code" params={{ code: home.code }} className="flex flex-col items-center gap-3 text-center group">
            <img src={flagUrl(home.code)} alt={home.name} width={120} height={90} className="h-20 w-28 rounded-lg object-cover ring-1 ring-border group-hover:ring-primary/50" />
            <div>
              <div className="font-display text-xl font-bold sm:text-2xl">{home.name}</div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">{home.code}</div>
            </div>
          </Link>
          <div className="flex flex-col items-center">
            {showScore ? (
              <div className="font-display text-5xl font-bold tabular-nums sm:text-7xl">
                {match.homeScore} <span className="text-muted-foreground/50">–</span> {match.awayScore}
              </div>
            ) : (
              <div className="font-display text-3xl font-bold text-muted-foreground sm:text-4xl">vs</div>
            )}
            <div className="mt-3 text-xs uppercase tracking-wider text-muted-foreground">
              {format(new Date(match.kickoff), "MMM d · HH:mm 'UTC'")}
            </div>
          </div>
          <Link to="/teams/$code" params={{ code: away.code }} className="flex flex-col items-center gap-3 text-center group">
            <img src={flagUrl(away.code)} alt={away.name} width={120} height={90} className="h-20 w-28 rounded-lg object-cover ring-1 ring-border group-hover:ring-primary/50" />
            <div>
              <div className="font-display text-xl font-bold sm:text-2xl">{away.name}</div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">{away.code}</div>
            </div>
          </Link>
        </div>

        {/* Venue */}
        <div className="grid gap-px bg-border sm:grid-cols-2">
          <div className="flex items-center gap-3 bg-card px-6 py-4">
            <MapPin className="h-4 w-4 text-primary" />
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Venue</div>
              <div className="text-sm font-semibold">{match.venue}, {match.city}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-card px-6 py-4">
            <Calendar className="h-4 w-4 text-primary" />
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Kick-off</div>
              <div className="text-sm font-semibold">{format(new Date(match.kickoff), "EEEE d MMM, HH:mm")} UTC</div>
            </div>
          </div>
        </div>
      </div>

      {/* Events */}
      {match.events && match.events.length > 0 && (
        <section className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-card">
          <h2 className="mb-4 font-display text-xl font-bold">Match events</h2>
          <ol className="space-y-3">
            {match.events.map((e: MatchEvent, i: number) => (
              <li key={i} className="flex items-center gap-4 text-sm">
                <span className="w-12 shrink-0 text-right font-mono font-semibold text-muted-foreground">{e.minute}'</span>
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${e.type === "goal" ? "bg-primary/20 text-primary" :
                    e.type === "yellow" ? "bg-gold/30 text-gold" :
                      e.type === "red" ? "bg-live/20 text-live" :
                        "bg-secondary text-muted-foreground"
                  }`}>
                  {e.type === "goal" ? "⚽" : e.type === "yellow" ? "🟨" : e.type === "red" ? "🟥" : "↔"}
                </span>
                <span className="flex-1">
                  <span className="font-semibold">{e.player}</span>
                  <span className="ml-2 text-muted-foreground">
                    {e.type === "goal" ? "scores for" : e.type === "yellow" ? "booked · " : e.type === "red" ? "sent off · " : "substitution · "}
                    {e.side === "home" ? home.name : away.name}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Live TV CTA */}
      <section className="mt-8 rounded-2xl border border-border bg-gradient-to-br from-card to-secondary/40 p-6">
        <h2 className="font-display text-xl font-bold">Watch this match live</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Stream FIFA+, beIN Sports, T Sports and more — BDIX optimised.
        </p>
        <Link to="/live" className="mt-4 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-glow">
          Open Live TV →
        </Link>
      </section>
    </div>
  );
}
