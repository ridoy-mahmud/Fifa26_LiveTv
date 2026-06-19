import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { GROUPS, TEAMS, flagUrl, type Team } from "@/lib/worldcup-data";
import { listTeams } from "@/lib/api/channels.functions";

export const Route = createFileRoute("/teams")({
  head: () => ({
    meta: [
      { title: "All 48 Teams — WC 2026 Companion" },
      { name: "description", content: "Browse every national team in the FIFA World Cup 2026, organized by group." },
      { property: "og:title", content: "All 48 Teams — WC 2026 Companion" },
      { property: "og:description", content: "Browse every national team competing in FIFA World Cup 2026." },
      { property: "og:url", content: "/teams" },
    ],
    links: [{ rel: "canonical", href: "/teams" }],
  }),
  component: TeamsPage,
});

function TeamsPage() {
  const teamsFn = useServerFn(listTeams);
  const { data: dbTeams } = useQuery({
    queryKey: ["teams", "list"],
    queryFn: () => teamsFn(),
    staleTime: 30_000,
  });
  const teams = (dbTeams && dbTeams.length > 0 ? dbTeams : TEAMS) as Team[];
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-10">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Nations</span>
        <h1 className="mt-1 font-display text-4xl font-bold sm:text-5xl">All 48 teams</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          From CONMEBOL to UEFA, AFC to CAF — every nation chasing the trophy.
        </p>
      </header>

      <div className="space-y-10">
        {GROUPS.map((g) => (
          <section key={g}>
            <h2 className="mb-4 flex items-baseline gap-3 font-display text-2xl font-bold">
              Group <span className="text-primary">{g}</span>
              <span className="text-sm font-normal text-muted-foreground">4 teams</span>
            </h2>
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {teams.filter((t) => t.group === g).map((t) => (
                <Link
                  key={t.code}
                  to="/teams/$code"
                  params={{ code: t.code }}
                  className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-glow"
                >
                  <img src={flagUrl(t.code)} alt={t.name} width={48} height={36} className="h-9 w-12 rounded-md object-cover ring-1 ring-border" />
                  <div className="min-w-0">
                    <div className="truncate font-semibold">{t.name}</div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">{t.code}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
