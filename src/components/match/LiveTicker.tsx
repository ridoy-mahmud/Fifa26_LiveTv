import { Link } from "@tanstack/react-router";
import { liveMatches, upcomingMatches, getTeam } from "@/lib/worldcup-data";
import { format } from "date-fns";
import { Clock } from "lucide-react";

export function LiveTicker() {
  const live = liveMatches();

  if (live.length > 0) {
    const items = [...live, ...live]; // duplicate for seamless loop
    return (
      <div className="relative overflow-hidden border-y border-border bg-card/60 py-2.5">
        <div className="absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-card/80 to-transparent" />
        <div className="absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-card/80 to-transparent" />
        <div className="flex w-max animate-ticker gap-8 whitespace-nowrap pl-4">
          {items.map((m, i) => {
            const home = getTeam(m.homeCode);
            const away = getTeam(m.awayCode);
            return (
              <Link
                key={`${m.id}-${i}`}
                to="/matches/$id"
                params={{ id: m.id }}
                className="flex items-center gap-2 text-sm hover:text-primary"
              >
                <span className="inline-flex h-1.5 w-1.5 animate-pulse-live rounded-full bg-live" />
                <span className="font-semibold">{home.code}</span>
                <span className="font-display font-bold text-foreground">{m.homeScore} – {m.awayScore}</span>
                <span className="font-semibold">{away.code}</span>
                <span className="text-muted-foreground">· {m.minute ?? 0}'</span>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  // No live matches — show next upcoming matches
  const upcoming = upcomingMatches(4);
  if (upcoming.length === 0) {
    return (
      <div className="border-y border-border bg-card/60 py-2.5 text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
        Stay tuned — matches start June 11
      </div>
    );
  }

  const items = [...upcoming, ...upcoming];
  return (
    <div className="relative overflow-hidden border-y border-border bg-card/60 py-2.5">
      <div className="absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-card/80 to-transparent" />
      <div className="absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-card/80 to-transparent" />
      <div className="flex w-max animate-ticker gap-8 whitespace-nowrap pl-4">
        {items.map((m, i) => {
          const home = getTeam(m.homeCode);
          const away = getTeam(m.awayCode);
          return (
            <Link
              key={`${m.id}-${i}`}
              to="/matches/$id"
              params={{ id: m.id }}
              className="flex items-center gap-2 text-sm hover:text-primary"
            >
              <Clock className="h-3 w-3 text-primary" />
              <span className="font-semibold">{home.code}</span>
              <span className="text-muted-foreground">vs</span>
              <span className="font-semibold">{away.code}</span>
              <span className="text-muted-foreground">· {format(new Date(m.kickoff), "MMM d HH:mm")}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
