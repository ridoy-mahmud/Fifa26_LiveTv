import { Link } from "@tanstack/react-router";
import { flagUrl, getTeam, type Match } from "@/lib/worldcup-data";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

function useCountdown(target: string, enabled: boolean) {
  const [diff, setDiff] = useState(() => new Date(target).getTime() - Date.now());
  useEffect(() => {
    if (!enabled) return;
    const id = setInterval(() => setDiff(new Date(target).getTime() - Date.now()), 1000);
    return () => clearInterval(id);
  }, [target, enabled]);
  return diff;
}

function StatusPill({ match }: { match: Match }) {
  const isScheduled = match.status === "scheduled";
  const diff = useCountdown(match.kickoff, isScheduled);

  if (match.status === "live") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-live/15 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-live">
        <span className="h-1.5 w-1.5 animate-pulse-live rounded-full bg-live" />
        Live {match.minute ? `${match.minute}'` : ""}
      </span>
    );
  }
  if (match.status === "ht") {
    return <span className="rounded-full bg-gold/20 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-gold">Half time</span>;
  }
  if (match.status === "ft") {
    return <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Full time</span>;
  }

  // Scheduled — show countdown if within 7 days, otherwise show date
  if (isScheduled && diff > 0) {
    const totalSec = Math.floor(diff / 1000);
    const days = Math.floor(totalSec / 86400);

    if (days < 7) {
      const h = Math.floor((totalSec % 86400) / 3600);
      const m = Math.floor((totalSec % 3600) / 60);
      const s = totalSec % 60;
      const label = days > 0
        ? `${days}d ${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}m`
        : `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold tabular-nums text-primary ring-1 ring-primary/20">
          <Clock className="h-2.5 w-2.5 shrink-0" />{label}
        </span>
      );
    }
  }

  return (
    <span className="rounded-full bg-secondary/60 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
      {format(new Date(match.kickoff), "MMM d · HH:mm")}
    </span>
  );
}

function TeamLine({ code, score, showScore }: { code: string; score: number; showScore: boolean }) {
  const t = getTeam(code);
  const isTbd = code === "TBD";
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        {isTbd ? (
          <div className="h-6 w-8 rounded-sm bg-secondary ring-1 ring-border" />
        ) : (
          <img
            src={flagUrl(code)}
            alt={t.name}
            width={32}
            height={24}
            loading="lazy"
            decoding="async"
            className="h-6 w-8 rounded-sm object-cover ring-1 ring-border"
          />
        )}
        <span className="truncate font-medium">{isTbd ? "TBD" : t.name}</span>
      </div>
      <span className={`font-display text-2xl font-bold tabular-nums ${showScore ? "" : "text-muted-foreground/40"}`}>
        {showScore ? score : "–"}
      </span>
    </div>
  );
}

function stageLabel(m: Match): string {
  if (m.stage === "Group") return `Group ${m.group} · #${m.matchNumber}`;
  if (m.stage === "R32") return `Round of 32 · #${m.matchNumber}`;
  if (m.stage === "R16") return `Round of 16 · #${m.matchNumber}`;
  if (m.stage === "QF") return `Quarterfinal · #${m.matchNumber}`;
  if (m.stage === "SF") return `Semifinal · #${m.matchNumber}`;
  if (m.stage === "3rd") return "Third Place";
  if (m.stage === "Final") return "★ Final";
  return `#${m.matchNumber}`;
}

export function MatchCard({ match }: { match: Match }) {
  const showScore = match.status !== "scheduled";
  const isLive = match.status === "live" || match.status === "ht";
  const isFinal = match.stage === "Final";

  return (
    <Link
      to="/matches/$id"
      params={{ id: match.id }}
      className={`group relative block overflow-hidden rounded-xl border bg-card p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-glow ${isFinal
          ? "border-gold/40 bg-gradient-to-br from-card to-gold/5"
          : isLive
            ? "border-live/40 live-ring"
            : "border-border hover:border-primary/40"
        }`}
    >
      <div className="mb-3 flex items-center justify-between gap-2 min-w-0">
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground truncate">
          {stageLabel(match)}
        </span>
        <StatusPill match={match} />
      </div>
      <div className="space-y-2.5">
        <TeamLine code={match.homeCode} score={match.homeScore} showScore={showScore} />
        <TeamLine code={match.awayCode} score={match.awayScore} showScore={showScore} />
      </div>
      <div className="mt-3 border-t border-border/60 pt-2.5 text-[11px] text-muted-foreground truncate">
        {match.venue} · {match.city}
      </div>
    </Link>
  );
}
