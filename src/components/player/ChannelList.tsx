import { useMemo, useState } from "react";
import { Search, Star } from "lucide-react";
import type { Channel } from "@/lib/channels-data";
import { FALLBACK_LOGO } from "@/lib/channels-data";

interface Props {
  channels: Channel[];
  activeId?: string;
  onPick: (c: Channel) => void;
}

const TABS = ["Top 10", "All", "Football", "Sports", "Cricket", "Entertainment", "Movies", "Bangladesh", "Cartoon", "Documentary", "News"] as const;
type Tab = (typeof TABS)[number];

export function ChannelList({ channels, activeId, onPick }: Props) {
  const [tab, setTab] = useState<Tab>("Top 10");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    let list = channels;
    if (tab === "Top 10") list = list.filter((c) => c.featured).slice(0, 10);
    else if (tab !== "All") list = list.filter((c) => c.group === tab);
    if (q.trim()) {
      const needle = q.trim().toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(needle));
    }
    return list;
  }, [channels, tab, q]);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card">
      <div className="border-b border-border p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search channels…"
            className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider transition ${tab === t
                ? "bg-primary text-primary-foreground"
                : "bg-secondary/60 text-muted-foreground hover:bg-secondary"
                }`}
            >
              {t === "Top 10" ? "★ Top 10" : t}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {filtered.length === 0 && (
          <div className="px-3 py-10 text-center text-sm text-muted-foreground">No channels.</div>
        )}
        <ul className="space-y-1">
          {filtered.map((c) => {
            const active = c.id === activeId;
            return (
              <li key={c.id}>
                <button
                  onClick={() => onPick(c)}
                  className={`group flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition ${active
                    ? "bg-primary/15 ring-1 ring-primary/40"
                    : "hover:bg-secondary/60"
                    }`}
                >
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-background ring-1 ring-border">
                    <img
                      src={c.logo || FALLBACK_LOGO}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-contain p-1"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = FALLBACK_LOGO;
                      }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className={`truncate text-sm font-semibold ${active ? "text-primary" : ""}`}>
                        {c.name}
                      </span>
                      {c.featured && <Star className="h-3 w-3 shrink-0 fill-gold text-gold" />}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      {c.group}
                    </div>
                  </div>
                  {active && (
                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-live">
                      <span className="h-1.5 w-1.5 animate-pulse-live rounded-full bg-live" />
                      Live
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
