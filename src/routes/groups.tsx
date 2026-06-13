import { createFileRoute } from "@tanstack/react-router";
import { GROUPS, groupStandings, matchesByGroup, flagUrl } from "@/lib/worldcup-data";
import { MatchCard } from "@/components/match/MatchCard";

export const Route = createFileRoute("/groups")({
  head: () => ({
    meta: [
      { title: "Group Standings — WC 2026 Companion" },
      { name: "description", content: "Live group standings for all 12 FIFA World Cup 2026 groups." },
      { property: "og:title", content: "Group Standings — WC 2026 Companion" },
      { property: "og:description", content: "Points, goal difference, and qualification picture for all 12 groups." },
      { property: "og:url", content: "/groups" },
    ],
    links: [{ rel: "canonical", href: "/groups" }],
  }),
  component: GroupsPage,
});

function GroupsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-10">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">12 groups · 48 teams</span>
        <h1 className="mt-1 font-display text-4xl font-bold sm:text-5xl">Group standings</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Top two from each group advance, plus the eight best third-placed teams qualify for the Round of 32.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        {GROUPS.map((g) => {
          const standings = groupStandings(g);
          const matches = matchesByGroup(g);
          return (
            <section key={g} className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
              <header className="flex items-center justify-between border-b border-border bg-secondary/50 px-5 py-3">
                <h2 className="font-display text-lg font-bold">
                  Group <span className="text-primary">{g}</span>
                </h2>
                <span className="text-xs text-muted-foreground">{matches.length} matches</span>
              </header>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    <th className="px-4 py-2 text-left font-medium">#</th>
                    <th className="py-2 text-left font-medium">Team</th>
                    <th className="px-2 py-2 text-center font-medium">P</th>
                    <th className="px-2 py-2 text-center font-medium">W</th>
                    <th className="px-2 py-2 text-center font-medium">D</th>
                    <th className="px-2 py-2 text-center font-medium">L</th>
                    <th className="px-2 py-2 text-center font-medium">GD</th>
                    <th className="px-4 py-2 text-center font-medium">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((row, i) => (
                    <tr key={row.team.code} className={`border-t border-border ${i < 2 ? "bg-primary/5" : ""}`}>
                      <td className="px-4 py-2.5 text-muted-foreground">{i + 1}</td>
                      <td className="py-2.5">
                        <div className="flex items-center gap-2.5">
                          <img src={flagUrl(row.team.code)} alt="" width={24} height={18} className="h-[18px] w-6 rounded-sm object-cover ring-1 ring-border" />
                          <span className="font-medium">{row.team.name}</span>
                        </div>
                      </td>
                      <td className="px-2 py-2.5 text-center tabular-nums">{row.p}</td>
                      <td className="px-2 py-2.5 text-center tabular-nums">{row.w}</td>
                      <td className="px-2 py-2.5 text-center tabular-nums">{row.d}</td>
                      <td className="px-2 py-2.5 text-center tabular-nums">{row.l}</td>
                      <td className="px-2 py-2.5 text-center tabular-nums">{row.gd > 0 ? `+${row.gd}` : row.gd}</td>
                      <td className="px-4 py-2.5 text-center font-bold tabular-nums text-foreground">{row.pts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {matches.length > 0 && (
                <div className="grid gap-3 border-t border-border bg-background/40 p-4 sm:grid-cols-2">
                  {matches.map((m) => <MatchCard key={m.id} match={m} />)}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
