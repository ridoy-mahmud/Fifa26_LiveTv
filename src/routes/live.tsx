import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Radio, Wifi, Tv2, X, ChevronDown } from "lucide-react";
import { HlsPlayer } from "@/components/player/HlsPlayer";
import { ChannelList } from "@/components/player/ChannelList";
import { useChannels } from "@/lib/channels-store";
import { FALLBACK_LOGO, type Channel, type ChannelGroup } from "@/lib/channels-data";

export const Route = createFileRoute("/live")({
  head: () => ({
    meta: [
      { title: "Live TV — WC 2026 Live" },
      { name: "description", content: "Watch live sports channels — FIFA+, beIN Sports, T Sports, FOX Sports and more." },
      { property: "og:title", content: "Live TV — WC 2026 Live" },
    ],
    links: [{ rel: "canonical", href: "/live" }],
  }),
  component: LivePage,
});

function LivePage() {
  const { channels } = useChannels();
  const [active, setActive] = useState<Channel | null>(null);
  const [showChannelDrawer, setShowChannelDrawer] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active && channels.length > 0) {
      setActive(channels.find((c) => c.featured) ?? channels[0]);
    }
  }, [channels, active]);

  const pickChannel = useCallback((c: Channel) => {
    setActive(c);
    setShowChannelDrawer(false);
    setTimeout(() => {
      playerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  }, []);

  const meta = useMemo(() => active ? { name: active.name, group: active.group } : null, [active]);

  return (
    <div className="mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-6 lg:px-8">

      {/* ── Header ── */}
      <header className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div className="min-w-0 flex-1">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Live TV</span>
          <h1 className="mt-0.5 truncate font-display text-xl font-bold sm:text-3xl">
            {meta?.name ?? "Select a channel"}
          </h1>
          {meta && (
            <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">{meta.group} · BDIX-optimised</p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1.5 text-xs">
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-1 text-[11px] font-semibold text-primary ring-1 ring-primary/30">
            <Wifi className="h-3 w-3" /> BDIX
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-live/15 px-2 py-1 text-[11px] font-semibold text-live ring-1 ring-live/30">
            <Radio className="h-3 w-3 animate-pulse-live" /> LIVE
          </span>
        </div>
      </header>

      {/* ── Player + sidebar ── */}
      <div ref={playerRef} className="flex flex-col gap-3 lg:grid lg:grid-cols-[1fr_340px] lg:gap-4">

        {/* Player — 16:9 aspect on mobile, tall on desktop */}
        <div className="w-full overflow-hidden rounded-xl border border-border bg-black shadow-card"
          style={{ aspectRatio: "16/9", maxHeight: "70vh" }}>
          {active ? (
            <HlsPlayer
              key={active.id}
              src={active.url}
              fallbackUrl={active.fallbackUrl}
              poster={active.logo || FALLBACK_LOGO}
              className="h-full w-full"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Loading channels…
            </div>
          )}
        </div>

        {/* Channel list sidebar — desktop only */}
        <div className="hidden lg:block" style={{ height: "min(calc(100vh - 200px), 70vh)" }}>
          <ChannelList channels={channels} activeId={active?.id} onPick={pickChannel} />
        </div>
      </div>

      {/* ── Mobile: current channel bar + drawer trigger ── */}
      <div className="mt-3 lg:hidden">
        <button
          onClick={() => setShowChannelDrawer(true)}
          className="flex w-full items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 text-left transition hover:border-primary/40 active:bg-secondary/40"
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-background ring-1 ring-border">
              <img
                src={active?.logo || FALLBACK_LOGO}
                alt={active?.name || ""}
                className="h-full w-full object-contain p-1"
                onError={(e) => ((e.currentTarget as HTMLImageElement).src = FALLBACK_LOGO)}
              />
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold">{active?.name ?? "Select a channel"}</div>
              <div className="text-xs text-muted-foreground">{active?.group ?? "Tap to browse channels"}</div>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1 text-xs text-primary font-semibold">
            Change <ChevronDown className="h-4 w-4" />
          </div>
        </button>
      </div>

      {/* ── Mobile channel drawer ── */}
      {showChannelDrawer && (
        <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setShowChannelDrawer(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div
            className="absolute inset-x-0 bottom-0 flex max-h-[80vh] flex-col rounded-t-2xl border-t border-border bg-card"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer handle */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="mx-auto h-1 w-10 rounded-full bg-border absolute top-2 left-1/2 -translate-x-1/2" />
              <h2 className="font-display text-base font-bold">Channels</h2>
              <button
                onClick={() => setShowChannelDrawer(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-secondary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <ChannelList channels={channels} activeId={active?.id} onPick={pickChannel} />
            </div>
          </div>
        </div>
      )}

      {/* ── All channels grid ── */}
      <AllChannelsGrid channels={channels} activeId={active?.id} onPick={pickChannel} />
    </div>
  );
}

// ── All Channels Grid ──────────────────────────────────────────────────────
const GROUP_ORDER: ChannelGroup[] = [
  "Football", "Sports", "Cricket", "Entertainment",
  "Movies", "Music", "Cartoon", "Bangladesh", "Documentary", "News",
];

function AllChannelsGrid({
  channels, activeId, onPick,
}: { channels: Channel[]; activeId?: string; onPick: (c: Channel) => void }) {
  const [activeGroup, setActiveGroup] = useState<ChannelGroup | "All">("All");

  const byGroup = useMemo(() => {
    const map: Record<string, Channel[]> = {};
    for (const c of channels) (map[c.group] ||= []).push(c);
    return map;
  }, [channels]);

  const groupsWithChannels = GROUP_ORDER.filter((g) => (byGroup[g]?.length ?? 0) > 0);

  const displayList = useMemo(
    () => activeGroup === "All" ? channels : byGroup[activeGroup] ?? [],
    [channels, byGroup, activeGroup]
  );

  if (channels.length === 0) return null;

  return (
    <section className="mt-8 sm:mt-10">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 font-display text-lg font-bold sm:text-xl">
          <Tv2 className="h-5 w-5 text-primary" />
          All Channels
          <span className="text-sm font-normal text-muted-foreground">({channels.length})</span>
        </h2>
      </div>

      {/* Group tabs — scrollable on mobile */}
      <div className="mb-4 flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveGroup("All")}
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition ${activeGroup === "All" ? "bg-primary text-primary-foreground" : "bg-secondary/60 text-muted-foreground"
            }`}
        >
          All ({channels.length})
        </button>
        {groupsWithChannels.map((g) => (
          <button key={g} onClick={() => setActiveGroup(g)}
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition ${activeGroup === g ? "bg-primary text-primary-foreground" : "bg-secondary/60 text-muted-foreground"
              }`}
          >
            {g} ({byGroup[g]?.length ?? 0})
          </button>
        ))}
      </div>

      {/* Grid */}
      {activeGroup === "All" ? (
        <div className="space-y-6">
          {groupsWithChannels.map((g) => (
            <div key={g}>
              <h3 className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <span className="h-px flex-1 bg-border" />{g}<span className="h-px flex-1 bg-border" />
              </h3>
              <ChannelGrid channels={byGroup[g] ?? []} activeId={activeId} onPick={onPick} />
            </div>
          ))}
        </div>
      ) : (
        <ChannelGrid channels={displayList} activeId={activeId} onPick={onPick} />
      )}
    </section>
  );
}

function ChannelGrid({ channels, activeId, onPick }: { channels: Channel[]; activeId?: string; onPick: (c: Channel) => void }) {
  return (
    <div className="grid grid-cols-4 gap-2 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 xl:grid-cols-11">
      {channels.map((c) => {
        const isActive = c.id === activeId;
        return (
          <button key={c.id} onClick={() => onPick(c)} title={c.name}
            className={`group relative flex flex-col items-center gap-1 rounded-xl border p-1.5 transition-all active:scale-95 sm:p-2 ${isActive ? "border-primary/60 bg-primary/10 shadow-glow" : "border-border bg-card"
              }`}
          >
            {isActive && (
              <span className="absolute right-1 top-1 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-pulse-live rounded-full bg-live opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-live" />
              </span>
            )}
            {c.featured && <span className="absolute left-1 top-1 text-[9px] text-gold">★</span>}
            <div className="h-10 w-10 overflow-hidden rounded-lg bg-background ring-1 ring-border sm:h-11 sm:w-11">
              <img src={c.logo || FALLBACK_LOGO} alt={c.name} loading="lazy" decoding="async"
                className="h-full w-full object-contain p-0.5"
                onError={(e) => ((e.currentTarget as HTMLImageElement).src = FALLBACK_LOGO)} />
            </div>
            <span className={`line-clamp-2 w-full text-center text-[9px] font-semibold leading-tight sm:text-[10px] ${isActive ? "text-primary" : "text-foreground/80"}`}>
              {c.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function useMemo2<T>(fn: () => T, deps: unknown[]): T {
  return useMemo(fn, deps);
}
