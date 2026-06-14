import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Radio, Wifi, Signal, Tv2, ChevronDown, X } from "lucide-react";
import { HlsPlayer } from "@/components/player/HlsPlayer";
import { ChannelList } from "@/components/player/ChannelList";
import { useChannels } from "@/lib/channels-store";
import { FALLBACK_LOGO, ALL_GROUPS, type Channel, type ChannelGroup } from "@/lib/channels-data";

export const Route = createFileRoute("/live")({
  head: () => ({
    meta: [
      { title: "Live TV — WC 2026 Live" },
      { name: "description", content: "Watch live sports channels — FIFA+, beIN Sports, T Sports, FOX Sports and more on BDIX-optimised streams." },
      { property: "og:title", content: "Live TV — WC 2026 Live" },
      { property: "og:description", content: "Live sports streaming." },
    ],
    links: [{ rel: "canonical", href: "/live" }],
  }),
  component: LivePage,
});

function LivePage() {
  const { channels } = useChannels();
  const [active, setActive] = useState<Channel | null>(null);
  const [showMobileChannels, setShowMobileChannels] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);

  // Pick default channel on mount
  useEffect(() => {
    if (!active && channels.length > 0) {
      const top = channels.find((c) => c.featured) ?? channels[0];
      setActive(top);
    }
  }, [channels, active]);

  // Switch channel and scroll player into view
  const pickChannel = useCallback((c: Channel) => {
    setActive(c);
    // small timeout so the player re-mounts first
    setTimeout(() => {
      playerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  }, []);

  const meta = useMemo(() => {
    if (!active) return null;
    return { name: active.name, group: active.group };
  }, [active]);

  const playerHeight = "min(calc(100vh - 200px), 74vh)";
  const mobilePlayerHeight = "min(calc(100vh - 280px), 56vh)";

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Live TV</span>
          <h1 className="mt-1 font-display text-3xl font-bold sm:text-4xl">
            {meta?.name ?? "Select a channel"}
          </h1>
          {meta && (
            <p className="mt-1 text-sm text-muted-foreground">
              {meta.group} · BDIX-optimised
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Badge icon={<Wifi className="h-3 w-3" />} label="BDIX Ready" tone="primary" />
          <Badge icon={<Signal className="h-3 w-3" />} label="Auto HD" tone="secondary" />
          <Badge icon={<Radio className="h-3 w-3 animate-pulse-live text-live" />} label="LIVE" tone="live" />
        </div>
      </header>

      {/* Player + sidebar — ref on outer wrapper for scroll target */}
      <div ref={playerRef} className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <div
          className="relative overflow-hidden rounded-xl border border-border bg-black shadow-card"
          style={{ height: 'min(calc(100vh - 280px), 56vh)', minHeight: '300px' }}
        >
          {active ? (
            <HlsPlayer key={active.id} src={active.url} fallbackUrl={active.fallbackUrl} poster={active.logo || FALLBACK_LOGO} />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Loading channels…
            </div>
          )}
        </div>

        <div className="hidden lg:block" style={{ height: playerHeight }}>
          <ChannelList
            channels={channels}
            activeId={active?.id}
            onPick={pickChannel}
            fullHeight={true}
          />
        </div>
      </div>

      {/* Mobile channel selector */}
      <div className="lg:hidden mt-4">
        <button
          onClick={() => setShowMobileChannels(true)}
          className="flex w-full items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 text-left hover:border-primary/50 transition"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 overflow-hidden rounded-lg bg-background ring-1 ring-border">
              <img
                src={active?.logo || FALLBACK_LOGO}
                alt={active?.name || "Select channel"}
                className="h-full w-full object-contain p-1"
              />
            </div>
            <div>
              <div className="text-sm font-semibold">{active?.name || "Select a channel"}</div>
              <div className="text-xs text-muted-foreground">{active?.group || "Choose from list"}</div>
            </div>
          </div>
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>

      {/* Mobile channel modal */}
      {showMobileChannels && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm lg:hidden">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-border bg-card p-4">
              <h2 className="font-display text-lg font-bold">Select Channel</h2>
              <button
                onClick={() => setShowMobileChannels(false)}
                className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-secondary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <ChannelList
                channels={channels}
                activeId={active?.id}
                onPick={(c) => {
                  pickChannel(c);
                  setShowMobileChannels(false);
                }}
                fullHeight={true}
              />
            </div>
          </div>
        </div>
      )}

      {/* All channels grid — grouped by category */}
      <AllChannelsGrid channels={channels} activeId={active?.id} onPick={pickChannel} />
    </div>
  );
}

// ── All Channels Grid ─────────────────────────────────────────────────────
const GROUP_ORDER: ChannelGroup[] = [
  "Football", "Sports", "Cricket", "Entertainment",
  "Movies", "Music", "Cartoon", "Bangladesh", "Documentary", "News",
];

function AllChannelsGrid({
  channels,
  activeId,
  onPick,
}: {
  channels: Channel[];
  activeId?: string;
  onPick: (c: Channel) => void;
}) {
  const [activeGroup, setActiveGroup] = useState<ChannelGroup | "All">("All");

  const byGroup = useMemo(() => {
    const map: Record<string, Channel[]> = {};
    for (const c of channels) {
      (map[c.group] ||= []).push(c);
    }
    return map;
  }, [channels]);

  const groupsWithChannels = GROUP_ORDER.filter((g) => (byGroup[g]?.length ?? 0) > 0);

  const displayList = useMemo(() => {
    if (activeGroup === "All") return channels;
    return byGroup[activeGroup] ?? [];
  }, [channels, byGroup, activeGroup]);

  if (channels.length === 0) return null;

  return (
    <section className="mt-10">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-display text-xl font-bold">
          <Tv2 className="h-5 w-5 text-primary" />
          All Channels
          <span className="text-sm font-normal text-muted-foreground">({channels.length})</span>
        </h2>
      </div>

      {/* Group filter tabs */}
      <div className="mb-5 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveGroup("All")}
          className={`rounded-full px-4 py-2 text-xs font-semibold transition touch-manipulation ${activeGroup === "All"
            ? "bg-primary text-primary-foreground"
            : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
        >
          All ({channels.length})
        </button>
        {groupsWithChannels.map((g) => (
          <button
            key={g}
            onClick={() => setActiveGroup(g)}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition touch-manipulation ${activeGroup === g
              ? "bg-primary text-primary-foreground"
              : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
          >
            {g} ({byGroup[g]?.length ?? 0})
          </button>
        ))}
      </div>

      {/* Channel grid */}
      {activeGroup === "All" ? (
        // show grouped sections when "All" selected
        <div className="space-y-8">
          {groupsWithChannels.map((g) => (
            <div key={g}>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                <span className="h-px flex-1 bg-border" />
                {g}
                <span className="h-px flex-1 bg-border" />
              </h3>
              <ChannelGrid
                channels={byGroup[g] ?? []}
                activeId={activeId}
                onPick={onPick}
              />
            </div>
          ))}
        </div>
      ) : (
        <ChannelGrid channels={displayList} activeId={activeId} onPick={onPick} />
      )}
    </section>
  );
}

function ChannelGrid({
  channels,
  activeId,
  onPick,
}: {
  channels: Channel[];
  activeId?: string;
  onPick: (c: Channel) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
      {channels.map((c) => {
        const isActive = c.id === activeId;
        return (
          <button
            key={c.id}
            onClick={() => onPick(c)}
            title={c.name}
            className={`group relative flex flex-col items-center gap-2 rounded-xl border p-3 transition-all hover:-translate-y-0.5 hover:shadow-glow sm:p-2 sm:gap-1.5 ${isActive
              ? "border-primary/60 bg-primary/10 shadow-glow"
              : "border-border bg-card hover:border-primary/40"
              }`}
          >
            {/* live indicator */}
            {isActive && (
              <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-pulse-live rounded-full bg-live opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-live" />
              </span>
            )}
            {/* logo */}
            <div className="h-12 w-12 overflow-hidden rounded-lg bg-background ring-1 ring-border sm:h-11 sm:w-11">
              <img
                src={c.logo || FALLBACK_LOGO}
                alt={c.name}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-contain p-0.5"
                onError={(e) => ((e.currentTarget as HTMLImageElement).src = FALLBACK_LOGO)}
              />
            </div>
            {/* name */}
            <span className={`line-clamp-2 w-full text-center text-[11px] font-semibold leading-tight sm:text-[10px] ${isActive ? "text-primary" : "text-foreground/80"
              }`}>
              {c.name}
            </span>
            {/* featured star */}
            {c.featured && (
              <span className="absolute left-1.5 top-1.5 text-[9px] text-gold">★</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ── Badge ─────────────────────────────────────────────────────────────────
function Badge({ icon, label, tone }: { icon: React.ReactNode; label: string; tone: "primary" | "secondary" | "live" }) {
  const cls =
    tone === "primary" ? "bg-primary/15 text-primary ring-1 ring-primary/30"
      : tone === "live" ? "bg-live/15 text-live ring-1 ring-live/30"
        : "bg-secondary/60 text-muted-foreground ring-1 ring-border";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-semibold ${cls}`}>
      {icon}{label}
    </span>
  );
}
