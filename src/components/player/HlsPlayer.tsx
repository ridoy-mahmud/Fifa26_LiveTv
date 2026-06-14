import { useEffect, useRef, useState, useCallback } from "react";
import Hls, { type Level } from "hls.js";
import {
  RefreshCw, Maximize2, Minimize2,
  Volume2, VolumeX, Settings, Check,
  AlertTriangle, PictureInPicture2, Play, Pause,
} from "lucide-react";
import { buildUrlChain } from "@/lib/stream-proxy";

interface Props {
  src: string;
  fallbackUrl?: string;
  poster?: string;
  className?: string;
}

function qualityLabel(l: Level): string {
  if (l.height) return `${l.height}p`;
  if (l.bitrate) return `${Math.round(l.bitrate / 1000)}k`;
  return "HD";
}

export function HlsPlayer({ src, fallbackUrl, poster, className }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const chainRef = useRef<string[]>([]);
  const idxRef = useRef(0);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viaProxy, setViaProxy] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [levels, setLevels] = useState<Level[]>([]);
  const [curLevel, setCurLevel] = useState(-1);
  const [activeLevel, setActiveLevel] = useState(-1);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPip, setIsPip] = useState(false);
  const [showQuality, setShowQuality] = useState(false);
  const [buffered, setBuffered] = useState(0);
  const [played, setPlayed] = useState(0);
  // controls visibility — always visible on mobile, hover-or-tap on desktop
  const [controlsVisible, setControlsVisible] = useState(true);

  // ── show controls and start auto-hide timer ──────────────────────────────
  const showControls = useCallback(() => {
    setControlsVisible(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setControlsVisible(false), 3500);
  }, []);

  // Keep controls visible permanently when paused or loading
  useEffect(() => {
    if (!playing || loading || error) {
      setControlsVisible(true);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    }
  }, [playing, loading, error]);

  // ─── core: try one URL ──────────────────────────────────────────────────
  const tryUrl = useCallback((url: string) => {
    const video = videoRef.current;
    if (!video) return;
    if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; }

    setViaProxy(url.startsWith("/api/proxy"));
    setLoading(true);
    setError(null);

    if (!Hls.isSupported()) {
      video.src = url;
      video.load();
      video.play().catch(() => { });
      return;
    }

    const hls = new Hls({
      enableWorker: true,
      startLevel: -1,
      lowLatencyMode: false,
      maxBufferLength: 20,
      maxMaxBufferLength: 60,
      manifestLoadingMaxRetry: 2,
      levelLoadingMaxRetry: 2,
      fragLoadingMaxRetry: 3,
      manifestLoadingTimeOut: 15000,
      levelLoadingTimeOut: 15000,
      fragLoadingTimeOut: 20000,
    });
    hlsRef.current = hls;
    hls.loadSource(url);
    hls.attachMedia(video);

    hls.once(Hls.Events.MANIFEST_PARSED, (_e, data) => {
      setLevels(data.levels);
      setLoading(false);
      video.play().catch(() => { });
    });

    hls.on(Hls.Events.LEVEL_SWITCHED, (_e, data) => setActiveLevel(data.level));

    hls.on(Hls.Events.ERROR, (_e, data) => {
      if (!data.fatal) return;
      const next = idxRef.current + 1;
      if (next < chainRef.current.length) {
        idxRef.current = next;
        tryUrl(chainRef.current[next]);
      } else {
        setError("Stream unavailable — try another channel.");
        setLoading(false);
      }
    });
  }, []);

  // ─── init on src change ─────────────────────────────────────────────────
  useEffect(() => {
    if (!src) return;
    const chain = buildUrlChain(src, fallbackUrl);
    chainRef.current = chain;
    idxRef.current = 0;
    setLevels([]); setCurLevel(-1); setActiveLevel(-1);
    setBuffered(0); setPlayed(0); setError(null);
    tryUrl(chain[0]);
    return () => {
      if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; }
      const v = videoRef.current;
      if (v) { v.pause(); v.removeAttribute("src"); v.load(); }
    };
  }, [src, fallbackUrl, tryUrl]);

  // ─── progress + play/pause tracking ────────────────────────────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onTime = () => { if (video.duration > 0) setPlayed((video.currentTime / video.duration) * 100); };
    const onProg = () => { if (video.buffered.length && video.duration > 0) setBuffered((video.buffered.end(video.buffered.length - 1) / video.duration) * 100); };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    video.addEventListener("timeupdate", onTime);
    video.addEventListener("progress", onProg);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    return () => {
      video.removeEventListener("timeupdate", onTime);
      video.removeEventListener("progress", onProg);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
    };
  }, []);

  // ─── fullscreen ─────────────────────────────────────────────────────────
  useEffect(() => {
    const h = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", h);
    return () => document.removeEventListener("fullscreenchange", h);
  }, []);

  // ─── PiP ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const enter = () => setIsPip(true);
    const leave = () => setIsPip(false);
    v.addEventListener("enterpictureinpicture", enter);
    v.addEventListener("leavepictureinpicture", leave);
    return () => {
      v.removeEventListener("enterpictureinpicture", enter);
      v.removeEventListener("leavepictureinpicture", leave);
    };
  }, []);

  // cleanup timer on unmount
  useEffect(() => () => { if (hideTimer.current) clearTimeout(hideTimer.current); }, []);

  // ─── actions ────────────────────────────────────────────────────────────
  const retry = () => {
    const chain = buildUrlChain(src, fallbackUrl);
    chainRef.current = chain; idxRef.current = 0;
    setError(null); setLevels([]);
    tryUrl(chain[0]);
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => { }); else v.pause();
    showControls();
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    showControls();
  };

  const changeVolume = (val: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.volume = val; v.muted = val === 0;
    setVolume(val); setMuted(val === 0);
  };

  const toggleFullscreen = () => {
    const el = wrapRef.current;
    if (!el) return;
    if (!document.fullscreenElement) el.requestFullscreen().catch(() => { });
    else document.exitFullscreen().catch(() => { });
    showControls();
  };

  const togglePip = async () => {
    const v = videoRef.current;
    if (!v) return;
    try {
      if (document.pictureInPictureElement) await document.exitPictureInPicture();
      else if (document.pictureInPictureEnabled) await v.requestPictureInPicture();
    } catch { }
    showControls();
  };

  const pickQuality = (level: number) => {
    if (hlsRef.current) hlsRef.current.currentLevel = level;
    setCurLevel(level);
    setShowQuality(false);
    showControls();
  };

  const resLabel = levels.length === 0
    ? "HD"
    : curLevel === -1
      ? (levels[activeLevel]?.height ? `Auto·${levels[activeLevel].height}p` : "Auto")
      : qualityLabel(levels[curLevel]);

  // tap on the video area toggles controls on touch, shows on mouse move
  const handlePlayerInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    if (showQuality) { setShowQuality(false); return; }
    if ("touches" in e) {
      // touch: toggle visibility
      if (controlsVisible) {
        setControlsVisible(false);
        if (hideTimer.current) clearTimeout(hideTimer.current);
      } else {
        showControls();
      }
    } else {
      showControls();
    }
  };

  // ─── render ─────────────────────────────────────────────────────────────
  return (
    <div
      ref={wrapRef}
      className={`relative h-full w-full overflow-hidden bg-black ${isFullscreen ? "" : "rounded-xl"} ${className ?? ""}`}
      onMouseMove={showControls}
      onClick={handlePlayerInteraction}
      onTouchStart={handlePlayerInteraction}
    >
      {/* Video — fills 100% */}
      <video
        ref={videoRef}
        poster={poster}
        playsInline
        autoPlay
        preload="auto"
        className="absolute inset-0 h-full w-full object-contain"
      />

      {/* ── Controls overlay ── */}
      <div
        className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/95 via-black/50 to-transparent px-3 pt-10 pb-3 transition-opacity duration-200"
        style={{ opacity: controlsVisible ? 1 : 0, pointerEvents: controlsVisible ? "auto" : "none" }}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
      >
        {/* Progress bar */}
        <div className="mb-3 flex items-center gap-2">
          <div
            className="relative h-2 flex-1 cursor-pointer rounded-full bg-white/20 touch-none"
            onClick={(e) => {
              const v = videoRef.current;
              if (!v || !v.duration) return;
              const r = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
              v.currentTime = ((e.clientX - r.left) / r.width) * v.duration;
            }}
          >
            <div className="absolute inset-y-0 left-0 rounded-full bg-white/30" style={{ width: `${buffered}%` }} />
            <div className="absolute inset-y-0 left-0 rounded-full bg-primary transition-[width]" style={{ width: `${played}%` }} />
          </div>
          {/* LIVE badge */}
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-live/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
            <span className="h-1.5 w-1.5 animate-pulse-live rounded-full bg-white" />LIVE
          </span>
          {viaProxy && (
            <span className="hidden shrink-0 rounded-full bg-yellow-500/20 px-1.5 py-0.5 text-[9px] font-semibold text-yellow-400 sm:inline">
              proxy
            </span>
          )}
        </div>

        {/* Buttons row */}
        <div className="flex items-center gap-1">

          {/* Play / Pause */}
          <button
            onPointerDown={(e) => { e.stopPropagation(); togglePlay(); }}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white active:bg-white/20 sm:h-8 sm:w-8 sm:rounded-md"
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? <Pause className="h-5 w-5 sm:h-4 sm:w-4" /> : <Play className="h-5 w-5 sm:h-4 sm:w-4" />}
          </button>

          {/* Mute */}
          <button
            onPointerDown={(e) => { e.stopPropagation(); toggleMute(); }}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white active:bg-white/20 sm:h-8 sm:w-8 sm:rounded-md"
            aria-label={muted ? "Unmute" : "Mute"}
          >
            {muted || volume === 0 ? <VolumeX className="h-5 w-5 sm:h-4 sm:w-4" /> : <Volume2 className="h-5 w-5 sm:h-4 sm:w-4" />}
          </button>

          {/* Volume slider — hidden on small mobile, shown on sm+ */}
          <input
            type="range" min={0} max={1} step={0.05}
            value={muted ? 0 : volume}
            onChange={(e) => changeVolume(Number(e.target.value))}
            className="hidden h-1 w-16 cursor-pointer accent-primary sm:block"
            aria-label="Volume"
          />

          <div className="flex-1" />

          {/* Quality */}
          <div className="relative" onClick={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()}>
            <button
              onPointerDown={(e) => { e.stopPropagation(); setShowQuality(v => !v); }}
              className={`flex h-9 items-center gap-1 rounded-full px-2.5 text-[11px] font-bold sm:h-8 sm:rounded-md sm:text-xs ${showQuality ? "bg-primary text-primary-foreground" : "bg-white/10 text-white active:bg-white/20"
                }`}
              aria-label="Quality"
            >
              <Settings className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
              <span className="hidden sm:inline">{resLabel}</span>
            </button>

            {showQuality && (
              <div className="absolute bottom-12 right-0 z-50 min-w-[160px] max-h-64 overflow-y-auto overscroll-contain rounded-xl border border-border bg-card shadow-2xl backdrop-blur-md">
                <div className="sticky top-0 border-b border-border bg-card px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Quality
                </div>
                <button
                  onPointerDown={() => pickQuality(-1)}
                  className={`flex w-full items-center justify-between px-3 py-3 text-sm sm:py-2 ${curLevel === -1 ? "font-bold text-primary" : ""}`}
                >
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-primary/60" />
                    Auto
                    {curLevel === -1 && levels[activeLevel]?.height && (
                      <span className="text-[10px] text-muted-foreground">({levels[activeLevel].height}p)</span>
                    )}
                  </span>
                  {curLevel === -1 && <Check className="h-4 w-4 text-primary" />}
                </button>
                {[...levels]
                  .map((l, i) => ({ l, i }))
                  .sort((a, b) => (b.l.height ?? b.l.bitrate ?? 0) - (a.l.height ?? a.l.bitrate ?? 0))
                  .map(({ l, i }) => (
                    <button
                      key={i}
                      onPointerDown={() => pickQuality(i)}
                      className={`flex w-full items-center justify-between px-3 py-3 text-sm sm:py-2 ${curLevel === i ? "font-bold text-primary" : ""}`}
                    >
                      <span className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${(l.height ?? 0) >= 1080 ? "bg-gold" :
                            (l.height ?? 0) >= 720 ? "bg-primary" :
                              (l.height ?? 0) >= 480 ? "bg-blue-400" : "bg-muted-foreground"
                          }`} />
                        {qualityLabel(l)}
                        {l.bitrate && (
                          <span className="text-[10px] text-muted-foreground">
                            {l.bitrate >= 1_000_000 ? `${(l.bitrate / 1_000_000).toFixed(1)}M` : `${Math.round(l.bitrate / 1000)}k`}
                          </span>
                        )}
                      </span>
                      {curLevel === i && <Check className="h-4 w-4 text-primary" />}
                    </button>
                  ))}
                {levels.length === 0 && (
                  <div className="px-3 py-3 text-xs text-muted-foreground">Detecting…</div>
                )}
              </div>
            )}
          </div>

          {/* PiP — hidden on mobile (not supported) */}
          {typeof document !== "undefined" && "pictureInPictureEnabled" in document && (
            <button
              onPointerDown={(e) => { e.stopPropagation(); togglePip(); }}
              className={`hidden h-8 w-8 shrink-0 items-center justify-center rounded-md transition sm:flex ${isPip ? "bg-primary/30 text-primary" : "text-white/80 hover:bg-white/10"
                }`}
              aria-label="Picture-in-Picture"
            >
              <PictureInPicture2 className="h-4 w-4" />
            </button>
          )}

          {/* Fullscreen */}
          <button
            onPointerDown={(e) => { e.stopPropagation(); toggleFullscreen(); }}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white active:bg-white/20 sm:h-8 sm:w-8 sm:rounded-md sm:bg-transparent sm:hover:bg-white/10"
            aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullscreen
              ? <Minimize2 className="h-5 w-5 sm:h-4 sm:w-4" />
              : <Maximize2 className="h-5 w-5 sm:h-4 sm:w-4" />}
          </button>
        </div>
      </div>

      {/* ── Loading overlay ── */}
      {loading && !error && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3 text-white">
            <div className="relative h-14 w-14">
              <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
              <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-primary" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-white/60">
              {idxRef.current > 0 ? `Trying source ${idxRef.current + 1}…` : "Connecting…"}
            </span>
          </div>
        </div>
      )}

      {/* ── Error overlay ── */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 px-6 text-center">
          <div className="flex flex-col items-center gap-3 text-white">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-live/20 ring-1 ring-live/40">
              <AlertTriangle className="h-7 w-7 text-live" />
            </div>
            <p className="max-w-xs text-sm">{error}</p>
            <button
              onPointerDown={retry}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground active:scale-95 sm:py-2.5"
            >
              <RefreshCw className="h-4 w-4" /> Retry
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
