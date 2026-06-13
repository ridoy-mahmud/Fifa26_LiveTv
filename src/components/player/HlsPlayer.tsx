/**
 * HlsPlayer — universal HLS player with automatic CORS-proxy fallback.
 *
 * Many IPTV streams (e.g. http://198.195.239.50:8095/...) work in Chrome
 * extensions because extensions bypass CORS, but browsers block them.
 * This player tries the raw URL first, then automatically retries through a
 * chain of CORS proxies so streams that need it still play seamlessly.
 */
import { useEffect, useRef, useState, useCallback } from "react";
import Hls, { type Level } from "hls.js";
import {
  RefreshCw, Maximize2, Minimize2,
  Volume2, VolumeX, Settings, Check,
  AlertTriangle, PictureInPicture2,
} from "lucide-react";
import { buildUrlChain } from "@/lib/stream-proxy";

interface Props {
  src: string;
  fallbackUrl?: string; // additional URL to try before giving up
  poster?: string;
  className?: string;
}

function qualityLabel(l: Level): string {
  if (l.height) return `${l.height}p`;
  if (l.bitrate) return `${Math.round(l.bitrate / 1000)}kbps`;
  return "HD";
}

export function HlsPlayer({ src, fallbackUrl, poster, className }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const volRef = useRef<HTMLInputElement>(null);

  // URL chain: [raw, proxy1, proxy2, ...] or [proxy1, proxy2, ..., raw]
  const chainRef = useRef<string[]>([]);
  const chainIdxRef = useRef(0);     // which URL in the chain we're currently trying
  const hardRetryRef = useRef(0);    // retries within a single URL (network blips)

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [proxyLabel, setProxyLabel] = useState<string | null>(null); // shows "via proxy" badge
  const [levels, setLevels] = useState<Level[]>([]);
  const [curLevel, setCurLevel] = useState<number>(-1);
  const [activeLevel, setActiveLevel] = useState<number>(-1);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPip, setIsPip] = useState(false);
  const [showQuality, setShowQuality] = useState(false);
  const [buffered, setBuffered] = useState(0);
  const [played, setPlayed] = useState(0);

  // ── destroy ───────────────────────────────────────────────────────────────
  const destroy = useCallback(() => {
    if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; }
  }, []);

  // ── load one URL from the chain ───────────────────────────────────────────
  const loadUrl = useCallback((url: string) => {
    const video = videoRef.current;
    if (!video) return;
    destroy();
    hardRetryRef.current = 0;

    // Mark if we're going through a proxy
    const isProxy = url !== src;
    setProxyLabel(isProxy ? "via proxy" : null);

    video.addEventListener("canplay", () => setLoading(false), { once: true });

    const onProgress = () => {
      if (!video.duration) return;
      if (video.buffered.length)
        setBuffered((video.buffered.end(video.buffered.length - 1) / video.duration) * 100);
      setPlayed((video.currentTime / video.duration) * 100);
    };
    // Remove old listeners before adding new ones
    video.removeEventListener("timeupdate", onProgress);
    video.removeEventListener("progress", onProgress);
    video.addEventListener("timeupdate", onProgress);
    video.addEventListener("progress", onProgress);

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Safari native HLS — can't intercept with hls.js, try raw URL
      video.src = url;
      video.load();
      video.play().catch(() => { });
      return;
    }

    if (!Hls.isSupported()) {
      setError("HLS not supported in this browser.");
      setLoading(false);
      return;
    }

    const hls = new Hls({
      lowLatencyMode: true,
      enableWorker: true,
      maxBufferLength: 15,
      maxMaxBufferLength: 60,
      maxBufferSize: 20 * 1000 * 1000,
      maxBufferHole: 0.3,
      startLevel: -1,
      abrEwmaDefaultEstimate: 2_000_000,
      abrBandWidthFactor: 0.92,
      abrBandWidthUpFactor: 0.8,
      manifestLoadingMaxRetry: 2,   // fail fast → try next proxy
      levelLoadingMaxRetry: 2,
      fragLoadingMaxRetry: 3,
      manifestLoadingRetryDelay: 500,
      levelLoadingRetryDelay: 500,
      fragLoadingRetryDelay: 500,
      progressive: true,
      liveSyncDurationCount: 3,
      liveMaxLatencyDurationCount: 10,
    });
    hlsRef.current = hls;

    hls.loadSource(url);
    hls.attachMedia(video);

    hls.on(Hls.Events.MANIFEST_PARSED, (_e, data) => {
      setLevels(data.levels);
      video.play().catch(() => { });
    });

    hls.on(Hls.Events.LEVEL_SWITCHED, (_e, data) => setActiveLevel(data.level));

    hls.on(Hls.Events.ERROR, (_e, data) => {
      if (!data.fatal) return;

      // Try another URL in the chain
      const nextIdx = chainIdxRef.current + 1;
      if (nextIdx < chainRef.current.length) {
        chainIdxRef.current = nextIdx;
        setLoading(true);
        setError(null);
        setLevels([]);
        loadUrl(chainRef.current[nextIdx]);
        return;
      }

      // Exhausted all URLs
      setError(
        data.type === Hls.ErrorTypes.NETWORK_ERROR
          ? "Stream unavailable. The channel may be offline right now."
          : "Playback error — please try again."
      );
      setLoading(false);
    });
  }, [src, destroy]);

  // ── init: build chain and start ───────────────────────────────────────────
  const init = useCallback(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    setLoading(true);
    setError(null);
    setLevels([]);
    setCurLevel(-1);
    setActiveLevel(-1);
    setBuffered(0);
    setPlayed(0);

    // Build chain: server proxy + raw + optional fallback + proxy of fallback
    const chain = buildUrlChain(src);
    if (fallbackUrl && fallbackUrl !== src) {
      const fallbackChain = buildUrlChain(fallbackUrl);
      // Add unique entries from fallback chain
      for (const u of fallbackChain) {
        if (!chain.includes(u)) chain.push(u);
      }
    }
    chainRef.current = chain;
    chainIdxRef.current = 0;

    loadUrl(chain[0]);
  }, [src, fallbackUrl, loadUrl]);

  useEffect(() => {
    init();
    return () => {
      destroy();
      const v = videoRef.current;
      if (v) { v.removeAttribute("src"); v.load(); }
    };
  }, [src, fallbackUrl, init, destroy]);

  // ── fullscreen + PiP listeners ────────────────────────────────────────────
  useEffect(() => {
    const hFS = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", hFS);
    return () => document.removeEventListener("fullscreenchange", hFS);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onEnter = () => setIsPip(true);
    const onLeave = () => setIsPip(false);
    video.addEventListener("enterpictureinpicture", onEnter);
    video.addEventListener("leavepictureinpicture", onLeave);
    return () => {
      video.removeEventListener("enterpictureinpicture", onEnter);
      video.removeEventListener("leavepictureinpicture", onLeave);
    };
  }, []);

  // ── actions ───────────────────────────────────────────────────────────────
  const retry = useCallback(() => init(), [init]);

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const changeVolume = (val: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.volume = val;
    v.muted = val === 0;
    setVolume(val);
    setMuted(val === 0);
  };

  const toggleFullscreen = () => {
    if (!wrapRef.current) return;
    if (!document.fullscreenElement) wrapRef.current.requestFullscreen().catch(() => { });
    else document.exitFullscreen().catch(() => { });
  };

  const togglePip = async () => {
    const video = videoRef.current;
    if (!video) return;
    try {
      if (document.pictureInPictureElement) await document.exitPictureInPicture();
      else if (document.pictureInPictureEnabled) await video.requestPictureInPicture();
    } catch { /* not supported */ }
  };

  const pickQuality = (level: number) => {
    if (hlsRef.current) hlsRef.current.currentLevel = level;
    setCurLevel(level);
    setShowQuality(false);
  };

  const resLabel = (() => {
    if (levels.length === 0) return "HD";
    if (curLevel === -1) {
      const a = activeLevel >= 0 && activeLevel < levels.length ? levels[activeLevel] : null;
      return a?.height ? `Auto · ${a.height}p` : "Auto";
    }
    return qualityLabel(levels[curLevel]);
  })();

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <div
      ref={wrapRef}
      className={`relative flex h-full w-full flex-col overflow-hidden rounded-xl bg-black ${className ?? ""}`}
      onClick={() => showQuality && setShowQuality(false)}
    >
      {/* video */}
      <video
        ref={videoRef}
        poster={poster}
        playsInline
        autoPlay
        preload="auto"
        className="min-h-0 flex-1 w-full object-contain"
      />

      {/* ══ CONTROL BAR ══════════════════════════════════════════════════════ */}
      <div className="relative z-20 flex-shrink-0 bg-gradient-to-t from-black/95 to-black/70 px-3 pt-2 pb-2.5">

        {/* Progress / seek */}
        <div className="mb-2 flex items-center gap-2">
          <div
            className="relative h-1.5 flex-1 cursor-pointer rounded-full bg-white/10"
            onClick={(e) => {
              const v = videoRef.current;
              if (!v || !v.duration) return;
              const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
              v.currentTime = ((e.clientX - rect.left) / rect.width) * v.duration;
            }}
          >
            <div className="absolute inset-y-0 left-0 rounded-full bg-white/20" style={{ width: `${buffered}%` }} />
            <div className="absolute inset-y-0 left-0 rounded-full bg-primary transition-[width]" style={{ width: `${played}%` }} />
          </div>

          {/* LIVE badge */}
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-live/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
            <span className="h-1 w-1 animate-pulse-live rounded-full bg-white" />
            LIVE
          </span>

          {/* Proxy indicator */}
          {proxyLabel && (
            <span className="shrink-0 rounded-full bg-yellow-500/20 px-2 py-0.5 text-[9px] font-semibold text-yellow-400">
              {proxyLabel}
            </span>
          )}
        </div>

        {/* Button row */}
        <div className="flex items-center gap-1.5">

          {/* Mute */}
          <button
            onClick={(e) => { e.stopPropagation(); toggleMute(); }}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-white/80 hover:bg-white/10 hover:text-white transition"
            title={muted ? "Unmute" : "Mute"}
          >
            {muted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>

          {/* Volume slider */}
          <input
            ref={volRef}
            type="range" min={0} max={1} step={0.05}
            value={muted ? 0 : volume}
            onChange={(e) => changeVolume(Number(e.target.value))}
            className="h-1 w-16 cursor-pointer accent-primary"
            title="Volume"
          />

          <div className="flex-1" />

          {/* Quality selector */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowQuality((v) => !v)}
              className={`flex h-7 items-center gap-1.5 rounded-md px-2.5 text-xs font-bold transition ${showQuality ? "bg-primary text-primary-foreground" : "bg-white/10 text-white hover:bg-white/20"
                }`}
              title="Video quality"
            >
              <Settings className="h-3.5 w-3.5" />
              {resLabel}
            </button>

            {showQuality && (
              <div className="absolute bottom-9 right-0 z-50 min-w-[160px] overflow-hidden rounded-xl border border-border bg-card shadow-2xl backdrop-blur-md">
                <div className="border-b border-border px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Video Quality
                </div>

                {/* Auto */}
                <button
                  onClick={() => pickQuality(-1)}
                  className={`flex w-full items-center justify-between px-3 py-2.5 text-sm transition hover:bg-secondary/60 ${curLevel === -1 ? "font-bold text-primary" : "text-foreground"
                    }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-primary/60" />
                    Auto
                    {curLevel === -1 && activeLevel >= 0 && levels[activeLevel]?.height && (
                      <span className="text-[10px] text-muted-foreground">({levels[activeLevel].height}p)</span>
                    )}
                  </span>
                  {curLevel === -1 && <Check className="h-3.5 w-3.5 text-primary" />}
                </button>

                {/* Per-level, highest first */}
                {[...levels]
                  .map((l, i) => ({ l, i }))
                  .sort((a, b) => (b.l.height ?? b.l.bitrate ?? 0) - (a.l.height ?? a.l.bitrate ?? 0))
                  .map(({ l, i }) => (
                    <button
                      key={i}
                      onClick={() => pickQuality(i)}
                      className={`flex w-full items-center justify-between px-3 py-2.5 text-sm transition hover:bg-secondary/60 ${curLevel === i ? "font-bold text-primary" : "text-foreground"
                        }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${(l.height ?? 0) >= 1080 ? "bg-gold" :
                          (l.height ?? 0) >= 720 ? "bg-primary" :
                            (l.height ?? 0) >= 480 ? "bg-blue-400" : "bg-muted-foreground"
                          }`} />
                        {qualityLabel(l)}
                        {l.bitrate && (
                          <span className="text-[10px] text-muted-foreground">
                            {l.bitrate >= 1_000_000
                              ? `${(l.bitrate / 1_000_000).toFixed(1)} Mbps`
                              : `${Math.round(l.bitrate / 1000)} kbps`}
                          </span>
                        )}
                      </span>
                      {curLevel === i && <Check className="h-3.5 w-3.5 text-primary" />}
                    </button>
                  ))}

                {levels.length === 0 && (
                  <div className="px-3 py-2.5 text-xs text-muted-foreground">Loading stream info…</div>
                )}
              </div>
            )}
          </div>

          {/* PiP */}
          {typeof document !== "undefined" && "pictureInPictureEnabled" in document && (
            <button
              onClick={(e) => { e.stopPropagation(); togglePip(); }}
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition ${isPip ? "bg-primary/30 text-primary" : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              title={isPip ? "Exit Picture-in-Picture" : "Picture-in-Picture"}
            >
              <PictureInPicture2 className="h-4 w-4" />
            </button>
          )}

          {/* Fullscreen */}
          <button
            onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-white/80 hover:bg-white/10 hover:text-white transition"
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* ── Loading overlay ── */}
      {loading && !error && (
        <div className="pointer-events-none absolute inset-0 bottom-[60px] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3 text-white">
            <div className="relative h-14 w-14">
              <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
              <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-primary" />
              <div className="absolute inset-2 animate-ping rounded-full border border-primary/10" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
              {chainIdxRef.current > 0 ? `Trying alternate source ${chainIdxRef.current}…` : "Connecting to stream…"}
            </span>
          </div>
        </div>
      )}

      {/* ── Error overlay ── */}
      {error && (
        <div className="absolute inset-0 bottom-[60px] flex items-center justify-center bg-black/80 px-6 text-center">
          <div className="flex flex-col items-center gap-3 text-white">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-live/20 ring-1 ring-live/40">
              <AlertTriangle className="h-7 w-7 text-live" />
            </div>
            <p className="max-w-xs text-sm leading-relaxed">{error}</p>
            <button
              onClick={retry}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition hover:bg-primary-glow hover:scale-105"
            >
              <RefreshCw className="h-4 w-4" /> Retry
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
