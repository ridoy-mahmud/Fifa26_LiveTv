import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { MATCHES, type Match } from "@/lib/worldcup-data";
import { listMatches } from "@/lib/api/channels.functions";
import { MatchCard } from "@/components/match/MatchCard";
import { format } from "date-fns";
import { useMemo } from "react";

export const Route = createFileRoute("/schedule")({
  head: () => ({
    meta: [
      { title: "Full Schedule — WC 2026 Live" },
      { name: "description", content: "Complete FIFA World Cup 2026 match schedule — all 104 matches with live countdowns, kick-off times, venues, and scores." },
      { property: "og:title", content: "Full Schedule — WC 2026 Live" },
      { property: "og:description", content: "Every match, every kick-off. All 104 FIFA World Cup 2026 matches." },
      { property: "og:url", content: "/schedule" },
    ],
    links: [{ rel: "canonical", href: "/schedule" }],
  }),
  component: SchedulePage,
});

const STAGE_LABELS: Record<string, string> = {
  Group: "Group Stage",
  R32: "Round of 32",
  R16: "Round of 16",
  QF: "Quarterfinals",
  SF: "Semifinals",
  "3rd": "Third Place",
  Final: "Final",
};

const STAGE_ORDER = ["Group", "R32", "R16", "QF", "SF", "3rd", "Final"];

function SchedulePage() {
  const matchesFn = useServerFn(listMatches);
  const { data: dbMatches } = useQuery({
    queryKey: ["matches", "schedule"],
    queryFn: () => matchesFn(),
    staleTime: 30_000,
  });
  const matches = (dbMatches && dbMatches.length > 0 ? dbMatches : MATCHES) as Match[];

  // Group by stage, then by day within each stage
  const byStage = useMemo(() => {
    const stages: Record<string, Match[]> = {};
    for (const m of matches) {
      (stages[m.stage] ||= []).push(m);
    }
    return stages;
  }, [matches]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">FIFA World Cup 2026</span>
        <h1 className="mt-1 font-display text-4xl font-bold sm:text-5xl">Match schedule</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          All {matches.length} matches — group stage through the final. Times shown in your local timezone.
        </p>
      </header>

      <div className="space-y-14">
        {STAGE_ORDER.map((stage) => {
          const matches = byStage[stage];
          if (!matches || matches.length === 0) return null;

          // Group by day
          const byDay: Record<string, typeof MATCHES> = {};
          for (const m of matches) {
            const day = m.kickoff.slice(0, 10);
            (byDay[day] ||= []).push(m);
          }
          const days = Object.keys(byDay).sort();

          return (
            <div key={stage}>
              <div className="mb-6 flex items-center gap-4">
                <h2 className="font-display text-2xl font-bold text-primary">{STAGE_LABELS[stage]}</h2>
                <div className="h-px flex-1 bg-border" />
                <span className="text-sm text-muted-foreground">{matches.length} match{matches.length !== 1 ? "es" : ""}</span>
              </div>

              <div className="space-y-8">
                {days.map((day) => (
                  <section key={day}>
                    <div className="mb-3 flex flex-wrap items-center gap-3">
                      <h3 className="font-display text-lg font-semibold">
                        {format(new Date(day + "T12:00:00Z"), "EEEE, MMMM d")}
                      </h3>
                      <span className="text-xs text-muted-foreground">{byDay[day].length} match{byDay[day].length !== 1 ? "es" : ""}</span>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {byDay[day].map((m) => (
                        <MatchCard key={m.id} match={m} />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
