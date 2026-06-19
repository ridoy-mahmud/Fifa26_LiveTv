import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { TEAMS, MATCHES, getTeam, flagUrl, type Match, type Team } from "@/lib/worldcup-data";
import { listMatches, listTeams } from "@/lib/api/channels.functions";
import { MatchCard } from "@/components/match/MatchCard";

export const Route = createFileRoute("/teams/$code")({
  loader: ({ params }) => {
    const team = TEAMS.find((t) => t.code === params.code.toUpperCase());
    if (!team) throw notFound();
    return { team };
  },
  head: ({ params, loaderData }) => {
    const name = loaderData?.team.name ?? params.code;
    return {
      meta: [
        { title: `${name} — WC 2026 Companion` },
        { name: "description", content: `${name} at FIFA World Cup 2026: matches, group, and results.` },
        { property: "og:title", content: `${name} — WC 2026` },
        { property: "og:description", content: `Follow ${name} at the FIFA World Cup 2026.` },
        { property: "og:url", content: `/teams/${params.code}` },
      ],
      links: [{ rel: "canonical", href: `/teams/${params.code}` }],
    };
  },
  component: TeamPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="font-display text-3xl font-bold">Team not found</h1>
      <Link to="/teams" className="mt-4 inline-block text-primary hover:underline">← All teams</Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="font-display text-3xl font-bold">Couldn't load team</h1>
      <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
    </div>
  ),
});

function TeamPage() {
  const { team: loaderTeam } = Route.useLoaderData();
  const matchesFn = useServerFn(listMatches);
  const teamsFn = useServerFn(listTeams);
  const { data: dbMatches } = useQuery({
    queryKey: ["matches", "team", loaderTeam.code],
    queryFn: () => matchesFn(),
    staleTime: 30_000,
  });
  const { data: dbTeams } = useQuery({
    queryKey: ["teams", "team", loaderTeam.code],
    queryFn: () => teamsFn(),
    staleTime: 30_000,
  });
  const allMatches = (dbMatches && dbMatches.length > 0 ? dbMatches : MATCHES) as Match[];
  const allTeams = (dbTeams && dbTeams.length > 0 ? dbTeams : TEAMS) as Team[];
  const team = getTeam(loaderTeam.code, allTeams);
  const matches = allMatches.filter((m) => m.homeCode === team.code || m.awayCode === team.code);
  const groupmates = allTeams.filter((t) => t.group === team.group && t.code !== team.code);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <Link to="/teams" className="text-sm text-muted-foreground hover:text-primary">← All teams</Link>
      <header className="mt-6 flex flex-wrap items-center gap-6 rounded-2xl border border-border bg-card p-8 shadow-card">
        <img src={flagUrl(team.code)} alt={team.name} width={120} height={90} className="h-[90px] w-[120px] rounded-lg object-cover ring-1 ring-border" />
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Group {team.group}</div>
          <h1 className="mt-1 font-display text-4xl font-bold sm:text-5xl">{team.name}</h1>
          <div className="mt-2 text-sm text-muted-foreground">FIFA code · {team.code}</div>
        </div>
      </header>

      <section className="mt-10">
        <h2 className="mb-4 font-display text-2xl font-bold">Group stage fixtures</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {matches.map((m) => <MatchCard key={m.id} match={m} />)}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="mb-4 font-display text-2xl font-bold">Group {team.group} rivals</h2>
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
          {groupmates.map((t) => (
            <Link key={t.code} to="/teams/$code" params={{ code: t.code }}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 hover:border-primary/40">
              <img src={flagUrl(t.code)} alt="" width={40} height={30} className="h-[30px] w-10 rounded-md object-cover ring-1 ring-border" />
              <span className="font-medium">{getTeam(t.code).name}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
