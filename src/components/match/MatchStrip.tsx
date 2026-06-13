import { Link } from "@tanstack/react-router";
import { MATCHES, getTeam, liveMatches } from "@/lib/worldcup-data";
import { format } from "date-fns";
import { useMemo } from "react";

// Show live matches first, then all upcoming group-stage + knockout matches (sorted by kickoff)
function useStripMatches() {
    return useMemo(() => {
        const live = MATCHES.filter((m) => m.status === "live" || m.status === "ht");
        const scheduled = MATCHES
            .filter((m) => m.status === "scheduled")
            .sort((a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime());
        const ft = MATCHES
            .filter((m) => m.status === "ft")
            .sort((a, b) => new Date(b.kickoff).getTime() - new Date(a.kickoff).getTime())
            .slice(0, 6);
        // live first, then scheduled, then recent FT results
        return [...live, ...scheduled, ...ft];
    }, []);
}

export function MatchStrip() {
    const matches = useStripMatches();
    if (matches.length === 0) return null;

    // Duplicate for seamless infinite scroll
    const items = [...matches, ...matches];

    return (
        <div className="relative z-[60] overflow-hidden border-b border-border bg-card/80 backdrop-blur-sm py-0">
            {/* fade edges */}
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-card/90 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-card/90 to-transparent" />

            <div
                className="flex w-max items-center gap-0 whitespace-nowrap"
                style={{ animation: "ticker 600s linear infinite" }}
            >
                {items.map((m, i) => {
                    const home = getTeam(m.homeCode);
                    const away = getTeam(m.awayCode);
                    const isLive = m.status === "live" || m.status === "ht";
                    const isFt = m.status === "ft";

                    let scoreOrTime: React.ReactNode;
                    if (isLive) {
                        scoreOrTime = (
                            <span className="flex items-center gap-1 font-display font-bold text-live">
                                <span className="h-1.5 w-1.5 animate-pulse-live rounded-full bg-live" />
                                {m.homeScore}–{m.awayScore}
                                <span className="text-[10px] font-normal opacity-80">{m.minute}'</span>
                            </span>
                        );
                    } else if (isFt) {
                        scoreOrTime = (
                            <span className="font-display font-bold text-muted-foreground">
                                {m.homeScore}–{m.awayScore}
                                <span className="ml-0.5 text-[9px] font-normal uppercase tracking-wide opacity-70"> FT</span>
                            </span>
                        );
                    } else {
                        // scheduled — show date + time
                        scoreOrTime = (
                            <span className="font-mono text-[11px] text-muted-foreground">
                                · {format(new Date(m.kickoff), "MMM d HH:mm")}
                            </span>
                        );
                    }

                    const homeName = home.code === "TBD" ? "TBD" : home.code;
                    const awayName = away.code === "TBD" ? "TBD" : away.code;

                    return (
                        <Link
                            key={`strip-${m.id}-${i}`}
                            to="/matches/$id"
                            params={{ id: m.id }}
                            className={`group flex items-center gap-1.5 px-4 py-2 text-[12px] transition-colors hover:bg-primary/10 ${isLive ? "text-foreground" : "text-foreground/80"
                                }`}
                        >
                            <span className="font-semibold tracking-wide group-hover:text-primary">{homeName}</span>
                            <span className="text-muted-foreground">vs</span>
                            <span className="font-semibold tracking-wide group-hover:text-primary">{awayName}</span>
                            {scoreOrTime}

                            {/* separator dot */}
                            <span className="ml-2 text-border">•</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
