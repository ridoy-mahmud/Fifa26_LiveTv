import { useEffect, useRef, useState, useCallback } from "react";
import Hls, { type Level } from "hls.js";
import {
  RefreshCw, Maximize2, Minimize2,
  Volume2, VolumeX, Settings, Check,
  AlertTriangle, PictureInPicture2, Play, Pause,
  Rewind, FastForward,
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
  // ── seek / time-tracking state ───────────────────────────────────────────
  // For VOD (finite duration) we render a regular timeline. For live streams
  // we expose a "rewind window" equal to the currently buffered back-buffer
  // so users can re-watch the last 20-60 seconds of a live broadcast. The
  // default hls.js back-buffer is 30s; we set 90s via hls.config below.
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seekableStart, setSeekableStart] = useState(0);
  const [seekableEnd, setSeekableEnd] = useState(0);
  const [isLive, setIsLive] = useState(true);

  // transient seek-feedback overlay (arrow + seconds)
  type SeekFlash = { dir: -1 | 1; secs: number; key: number } | null;
  const [seekFlash, setSeekFlash] = useState<SeekFlash>(null);
  const seekFlashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // swipe tracking for mobile
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchStartT = useRef<number>(0);
  const lastTapAt = useRef<{ t: number; x: number }>({ t: 0, x: 0 });

  // controls visibility — always visible on mobile, hover-or-tap on desktop
  const [controlsVisible, setControlsVisible] = useState(true);

  // ── show controls and start auto-hide timer ──────────────────────────────
  // Declared before seekBy so seekBy's useCallback body can safely reference
  // it without hitting the temporal dead zone during the first render.
  const showControls = useCallback(() => {
    setControlsVisible(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setControlsVisible(false), 3500);
  }, []);

  // ── seek helper ─────────────────────────────────────────────────────────
  // dir = -1 for back, +1 for forward, secs = seconds. Shows a flash overlay.
  const seekBy = useCallback((dir: -1 | 1, secs: number) => {
    const v = videoRef.current;
    if (!v) return;
    // VOD: clamp to [0, duration]. Live: clamp to [seekableStart, seekableEnd]
    // which is the playable back-buffer range exposed by hls.js.
    const s = v.seekable;
    const start = s.length > 0 ? s.start(0) : 0;
    const end = s.length > 0 ? s.end(s.length - 1) : (isFinite(v.duration) ? v.duration : v.currentTime);
    const target = Math.max(start, Math.min(end, v.currentTime + dir * secs));
    v.currentTime = target;
    setCurrentTime(target);
    showControls();
    // flash overlay
    if (seekFlashTimer.current) clearTimeout(seekFlashTimer.current);
    const key = Date.now();
    setSeekFlash({ dir, secs, key });
    seekFlashTimer.current = setTimeout(() => setSeekFlash((f) => (f && f.key === key ? null : f)), 700);
  }, [showControls]);

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
      // keep ~90s of back-buffer so live rewind (-10/-30s) has a usable range.
      // Without this hls.js trims to 30s by default which makes ArrowLeft feel
      // like a no-op on live channels.
      backBufferLength: 90,
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

  // ─── progress + play/pause + duration/seekable tracking ───────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const refreshSeekable = () => {
      const s = video.seekable;
      if (s.length > 0) {
        setSeekableStart(s.start(0));
        setSeekableEnd(s.end(s.length - 1));
      } else {
        setSeekableStart(0);
        setSeekableEnd(video.duration || 0);
      }
    };
    const onTime = () => {
      setCurrentTime(video.currentTime);
      const dur = video.duration;
      setDuration(isFinite(dur) ? dur : 0);
      // percentage: 0% = oldest seekable point, 100% = newest (live edge or VOD end)
      const s = video.seekable;
      if (s.length > 0) {
        const start = s.start(0);
        const end = s.end(s.length - 1);
        const range = end - start;
        if (range > 0) {
          setPlayed(((video.currentTime - start) / range) * 100);
          setBuffered(((video.buffered.length ? video.buffered.end(video.buffered.length - 1) : end) - start) / range * 100);
        } else {
          setPlayed(0); setBuffered(0);
        }
      } else if (dur > 0 && isFinite(dur)) {
        setPlayed((video.currentTime / dur) * 100);
      }
    };
    const onProg = () => {
      // already covered by onTime; kept for safety on browsers that don't fire timeupdate for buffered updates
      const s = video.seekable;
      if (s.length > 0) {
        const start = s.start(0);
        const end = s.end(s.length - 1);
        const range = end - start;
        if (range > 0) {
          setBuffered(((video.buffered.length ? video.buffered.end(video.buffered.length - 1) : end) - start) / range * 100);
        }
      }
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onMeta = () => {
      setIsLive(!isFinite(video.duration));
      setDuration(isFinite(video.duration) ? video.duration : 0);
      refreshSeekable();
    };
    video.addEventListener("timeupdate", onTime);
    video.addEventListener("progress", onProg);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("loadedmetadata", onMeta);
    video.addEventListener("durationchange", onMeta);
    video.addEventListener("seeked", refreshSeekable);
    return () => {
      video.removeEventListener("timeupdate", onTime);
      video.removeEventListener("progress", onProg);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("loadedmetadata", onMeta);
      video.removeEventListener("durationchange", onMeta);
      video.removeEventListener("seeked", refreshSeekable);
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
  useEffect(() => () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    if (seekFlashTimer.current) clearTimeout(seekFlashTimer.current);
  }, []);

  // ─── keyboard shortcuts (VLC / YouTube style) ────────────────────────────
  //   ← / →       : ±5s
  //   Shift+← / → : ±30s
  //   , / .       : ±1 frame (≈ 1/25s)
  //   Home        : jump to live edge (live streams)
  // Skipped when focus is in an editable element so the admin login isn't
  // hijacked while typing.
  useEffect(() => {
    const isEditable = (el: EventTarget | null) => {
      const t = el as HTMLElement | null;
      if (!t) return false;
      const tag = t.tagName;
      return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || t.isContentEditable;
    };
    const onKey = (ev: KeyboardEvent) => {
      // only react when the player wrapper is the most relevant focus
      if (isEditable(ev.target)) return;
      const v = videoRef.current;
      if (!v) return;
      switch (ev.key) {
        case "ArrowLeft":
          ev.preventDefault();
          seekBy(-1, ev.shiftKey ? 30 : 5);
          break;
        case "ArrowRight":
          ev.preventDefault();
          seekBy(1, ev.shiftKey ? 30 : 5);
          break;
        case "Home":
          if (isLive) {
            ev.preventDefault();
            const s = v.seekable;
            if (s.length > 0) {
              v.currentTime = s.end(s.length - 1);
              setCurrentTime(v.currentTime);
            }
          }
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isLive, seekBy]);

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

  // ─── mobile touch: swipe-to-seek + double-tap-to-seek (YouTube-style) ─
  // swipe: horizontal delta > 40px triggers ±1s per 12px (≈ iOS video seek)
  // double-tap: on the left half = back 10s, on the right half = forward 10s
  const onTouchStart = (e: React.TouchEvent) => {
    if (showQuality) { setShowQuality(false); return; }
    const t = e.touches[0];
    touchStartX.current = t.clientX;
    touchStartY.current = t.clientY;
    touchStartT.current = Date.now();
  };
  const onTouchMove = () => { /* swipe distance is read on touchend */ };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (showQuality) return;
    const t = e.changedTouches[0];
    if (touchStartX.current == null || touchStartY.current == null) return;
    const dx = t.clientX - touchStartX.current;
    const dy = t.clientY - touchStartY.current;
    const dt = Date.now() - touchStartT.current;
    touchStartX.current = null;
    touchStartY.current = null;
    // ignore vertical scrolls and quick taps
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy) || dt > 800) {
      // treat as a tap: toggle controls visibility
      if (controlsVisible) {
        setControlsVisible(false);
        if (hideTimer.current) clearTimeout(hideTimer.current);
      } else {
        showControls();
      }
      return;
    }
    // horizontal swipe → seek. ~12px per second, capped at 60s in either direction.
    const secs = Math.max(-60, Math.min(60, Math.round(dx / 12)));
    if (secs !== 0) seekBy(secs > 0 ? 1 : -1, Math.abs(secs));
  };

  const onDoubleClick = (e: React.MouseEvent) => {
    // double-click on the left/right half of the player seeks ±10s
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mid = rect.left + rect.width / 2;
    const dir: -1 | 1 = e.clientX < mid ? -1 : 1;
    seekBy(dir, 10);
  };

  // tap on the video area (mouse only — touch is handled above) shows controls
  const handleMouseTap = () => {
    if (showQuality) { setShowQuality(false); return; }
    showControls();
  };

  // ─── render ─────────────────────────────────────────────────────────────
  return (
    <div
      ref={wrapRef}
      className={`relative h-full w-full overflow-hidden bg-black ${isFullscreen ? "" : "rounded-xl"} ${className ?? ""}`}
      onMouseMove={showControls}
      onClick={handleMouseTap}
      onDoubleClick={onDoubleClick}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
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
              if (!v) return;
              const r = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
              const ratio = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
              const s = v.seekable;
              if (s.length > 0) {
                // jump within seekable window (works for live back-buffer and VOD)
                const start = s.start(0);
                const end = s.end(s.length - 1);
                v.currentTime = start + ratio * (end - start);
              } else if (v.duration && isFinite(v.duration)) {
                v.currentTime = ratio * v.duration;
              }
              setCurrentTime(v.currentTime);
            }}
          >
            <div className="absolute inset-y-0 left-0 rounded-full bg-white/30" style={{ width: `${Math.min(100, Math.max(0, buffered))}%` }} />
            <div className="absolute inset-y-0 left-0 rounded-full bg-primary transition-[width]" style={{ width: `${Math.min(100, Math.max(0, played))}%` }} />
          </div>
          {/* LIVE badge — clickable to jump to the live edge when paused in the back-buffer */}
          <button
            onPointerDown={(e) => {
              e.stopPropagation();
              const v = videoRef.current;
              if (!v) return;
              const s = v.seekable;
              if (s.length > 0) {
                v.currentTime = s.end(s.length - 1);
                setCurrentTime(v.currentTime);
              }
              showControls();
            }}
            className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white transition ${
              isLive && seekableEnd > 0 && Math.abs(currentTime - seekableEnd) < 1
                ? "bg-live/90 cursor-default"
                : "bg-live/60 ring-1 ring-live/60 hover:bg-live active:scale-95"
            }`}
            title="Jump to live edge"
            aria-label="Jump to live edge"
          >
            <span className="h-1.5 w-1.5 animate-pulse-live rounded-full bg-white" />
            LIVE
          </button>
          {viaProxy && (
            <span className="hidden shrink-0 rounded-full bg-yellow-500/20 px-1.5 py-0.5 text-[9px] font-semibold text-yellow-400 sm:inline">
              proxy
            </span>
          )}
        </div>

        {/* Buttons row */}
        <div className="flex items-center gap-1">

          {/* Back 10s — VLC-style seek (works for VOD and live back-buffer) */}
          <button
            onPointerDown={(e) => { e.stopPropagation(); seekBy(-1, 10); }}
            className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white active:bg-white/20 sm:h-8 sm:w-8 sm:rounded-md"
            aria-label="Back 10 seconds"
            title="Back 10s (←)"
          >
            <Rewind className="h-5 w-5 sm:h-4 sm:w-4" />
            <span className="pointer-events-none absolute -bottom-0.5 text-[8px] font-bold leading-none sm:-bottom-1">10</span>
          </button>

          {/* Play / Pause */}
          <button
            onPointerDown={(e) => { e.stopPropagation(); togglePlay(); }}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white active:bg-white/20 sm:h-8 sm:w-8 sm:rounded-md"
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? <Pause className="h-5 w-5 sm:h-4 sm:w-4" /> : <Play className="h-5 w-5 sm:h-4 sm:w-4" />}
          </button>

          {/* Forward 10s — VLC-style seek (works for VOD and live) */}
          <button
            onPointerDown={(e) => { e.stopPropagation(); seekBy(1, 10); }}
            className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white active:bg-white/20 sm:h-8 sm:w-8 sm:rounded-md"
            aria-label="Forward 10 seconds"
            title="Forward 10s (→)"
          >
            <FastForward className="h-5 w-5 sm:h-4 sm:w-4" />
            <span className="pointer-events-none absolute -bottom-0.5 text-[8px] font-bold leading-none sm:-bottom-1">10</span>
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

      {/* ── Seek feedback overlay (YouTube-style center flash) ── */}
      {seekFlash && (
        <div
          key={seekFlash.key}
          className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center"
        >
          <div className="flex flex-col items-center gap-1 rounded-2xl bg-black/60 px-5 py-3 text-white backdrop-blur-sm animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2">
              {seekFlash.dir === -1
                ? <Rewind className="h-7 w-7" />
                : <FastForward className="h-7 w-7" />}
              <span className="font-display text-2xl font-bold tabular-nums">{seekFlash.secs}s</span>
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-white/70">
              {seekFlash.dir === -1 ? "Back" : "Forward"}
            </span>
          </div>
        </div>
      )}

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
