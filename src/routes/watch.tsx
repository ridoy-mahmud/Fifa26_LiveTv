import { createFileRoute } from "@tanstack/react-router";
import { Tv, Globe, Info } from "lucide-react";

export const Route = createFileRoute("/watch")({
  head: () => ({
    meta: [
      { title: "Where to Watch — WC 2026 Companion" },
      { name: "description", content: "Official FIFA World Cup 2026 broadcasters by region. Find the licensed broadcaster in your country." },
      { property: "og:title", content: "Where to Watch FIFA World Cup 2026" },
      { property: "og:description", content: "Official broadcasters by region." },
      { property: "og:url", content: "/watch" },
    ],
    links: [{ rel: "canonical", href: "/watch" }],
  }),
  component: WatchPage,
});

const broadcasters = [
  { region: "Bangladesh", names: ["T Sports", "Bangladesh Television (BTV)"], note: "Free-to-air broadcasts on terrestrial TV." },
  { region: "India", names: ["JioCinema / JioHotstar", "Sports18"], note: "Streaming + linear coverage." },
  { region: "Pakistan", names: ["PTV Sports"], note: "Free-to-air broadcaster." },
  { region: "United Kingdom", names: ["BBC", "ITV"], note: "Free-to-air, all matches shared between the two." },
  { region: "United States", names: ["FOX (English)", "Telemundo / Peacock (Spanish)"], note: "Linear TV plus streaming." },
  { region: "Canada", names: ["TSN", "CTV", "RDS (French)"], note: "Bell Media holds rights." },
  { region: "Australia", names: ["Optus Sport", "SBS (selected matches)"], note: "Streaming + free-to-air highlights." },
  { region: "Middle East & North Africa", names: ["beIN Sports"], note: "Region-wide exclusive holder." },
  { region: "Sub-Saharan Africa", names: ["SuperSport"], note: "Pay-TV across most of the region." },
];

function WatchPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Broadcast partners</span>
        <h1 className="mt-1 font-display text-4xl font-bold sm:text-5xl">Where to watch</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          FIFA licenses World Cup broadcasting rights region by region. Watch through the official partner in your country.
        </p>
      </header>

      <div className="mb-8 flex items-start gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <div className="text-sm">
          <strong className="font-semibold">Watch legally.</strong> Unofficial streams hurt the players, the teams, and your local broadcaster's ability to license future tournaments. Stick with the licensed partner below.
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {broadcasters.map((b) => (
          <div key={b.region} className="rounded-xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
              <Globe className="h-3.5 w-3.5" /> {b.region}
            </div>
            <div className="mt-3 space-y-1.5">
              {b.names.map((n) => (
                <div key={n} className="flex items-center gap-2">
                  <Tv className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold">{n}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 text-xs text-muted-foreground">{b.note}</div>
          </div>
        ))}
      </div>

      <p className="mt-10 text-xs text-muted-foreground">
        Broadcaster list reflects publicly announced agreements and may change. Check your local provider for current details.
      </p>
    </div>
  );
}
