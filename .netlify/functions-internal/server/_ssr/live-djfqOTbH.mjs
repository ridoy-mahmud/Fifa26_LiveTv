import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { H as Hls } from "../_libs/hls.js.mjs";
import { F as FALLBACK_LOGO } from "./worldcup-data-DNtykFWW.mjs";
import { u as useChannels } from "./channels-store-Du0PiS64.mjs";
import "./index.mjs";
import "../_libs/seroval.mjs";
import { W as Wifi, R as Radio, d as ChevronDown, X, e as Rewind, P as Pause, f as Play, F as FastForward, V as VolumeX, g as Volume2, h as Settings, i as Check, j as PictureInPicture2, M as Minimize2, k as Maximize2, l as TriangleAlert, m as RefreshCw, n as Search, o as Star, p as TvMinimal } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__query-core.mjs";
import "./router-CAxrt4u7.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/date-fns.mjs";
import "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
function toProxy(url) {
  return `/api/proxy?url=${encodeURIComponent(url)}`;
}
function isHttp(url) {
  return url.startsWith("http://");
}
function buildUrlChain(url, fallbackUrl) {
  const chain = [];
  if (isHttp(url)) {
    chain.push(toProxy(url));
    chain.push(url);
  } else {
    chain.push(url);
    chain.push(toProxy(url));
  }
  if (fallbackUrl && fallbackUrl !== url) {
    if (isHttp(fallbackUrl)) {
      chain.push(toProxy(fallbackUrl));
      chain.push(fallbackUrl);
    } else {
      chain.push(fallbackUrl);
      chain.push(toProxy(fallbackUrl));
    }
  }
  return chain;
}
function qualityLabel(l) {
  if (l.height) return `${l.height}p`;
  if (l.bitrate) return `${Math.round(l.bitrate / 1e3)}k`;
  return "HD";
}
function HlsPlayer({ src, fallbackUrl, poster, className }) {
  const videoRef = reactExports.useRef(null);
  const wrapRef = reactExports.useRef(null);
  const hlsRef = reactExports.useRef(null);
  const chainRef = reactExports.useRef([]);
  const idxRef = reactExports.useRef(0);
  const hideTimer = reactExports.useRef(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  const [viaProxy, setViaProxy] = reactExports.useState(false);
  const [playing, setPlaying] = reactExports.useState(false);
  const [levels, setLevels] = reactExports.useState([]);
  const [curLevel, setCurLevel] = reactExports.useState(-1);
  const [activeLevel, setActiveLevel] = reactExports.useState(-1);
  const [muted, setMuted] = reactExports.useState(false);
  const [volume, setVolume] = reactExports.useState(1);
  const [isFullscreen, setIsFullscreen] = reactExports.useState(false);
  const [isPip, setIsPip] = reactExports.useState(false);
  const [showQuality, setShowQuality] = reactExports.useState(false);
  const [buffered, setBuffered] = reactExports.useState(0);
  const [played, setPlayed] = reactExports.useState(0);
  const [currentTime, setCurrentTime] = reactExports.useState(0);
  const [duration, setDuration] = reactExports.useState(0);
  const [seekableStart, setSeekableStart] = reactExports.useState(0);
  const [seekableEnd, setSeekableEnd] = reactExports.useState(0);
  const [isLive, setIsLive] = reactExports.useState(true);
  const [seekFlash, setSeekFlash] = reactExports.useState(null);
  const seekFlashTimer = reactExports.useRef(null);
  const touchStartX = reactExports.useRef(null);
  const touchStartY = reactExports.useRef(null);
  const touchStartT = reactExports.useRef(0);
  reactExports.useRef({ t: 0, x: 0 });
  const [controlsVisible, setControlsVisible] = reactExports.useState(true);
  const showControls = reactExports.useCallback(() => {
    setControlsVisible(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setControlsVisible(false), 3500);
  }, []);
  const seekBy = reactExports.useCallback((dir, secs) => {
    const v = videoRef.current;
    if (!v) return;
    const s = v.seekable;
    const start = s.length > 0 ? s.start(0) : 0;
    const end = s.length > 0 ? s.end(s.length - 1) : isFinite(v.duration) ? v.duration : v.currentTime;
    const target = Math.max(start, Math.min(end, v.currentTime + dir * secs));
    v.currentTime = target;
    setCurrentTime(target);
    showControls();
    if (seekFlashTimer.current) clearTimeout(seekFlashTimer.current);
    const key = Date.now();
    setSeekFlash({ dir, secs, key });
    seekFlashTimer.current = setTimeout(() => setSeekFlash((f) => f && f.key === key ? null : f), 700);
  }, [showControls]);
  reactExports.useEffect(() => {
    if (!playing || loading || error) {
      setControlsVisible(true);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    }
  }, [playing, loading, error]);
  const tryUrl = reactExports.useCallback((url) => {
    const video = videoRef.current;
    if (!video) return;
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
    setViaProxy(url.startsWith("/api/proxy"));
    setLoading(true);
    setError(null);
    if (!Hls.isSupported()) {
      video.src = url;
      video.load();
      video.play().catch(() => {
      });
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
      manifestLoadingTimeOut: 15e3,
      levelLoadingTimeOut: 15e3,
      fragLoadingTimeOut: 2e4
    });
    hlsRef.current = hls;
    hls.loadSource(url);
    hls.attachMedia(video);
    hls.once(Hls.Events.MANIFEST_PARSED, (_e, data) => {
      setLevels(data.levels);
      setLoading(false);
      video.play().catch(() => {
      });
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
  reactExports.useEffect(() => {
    if (!src) return;
    const chain = buildUrlChain(src, fallbackUrl);
    chainRef.current = chain;
    idxRef.current = 0;
    setLevels([]);
    setCurLevel(-1);
    setActiveLevel(-1);
    setBuffered(0);
    setPlayed(0);
    setError(null);
    tryUrl(chain[0]);
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      const v = videoRef.current;
      if (v) {
        v.pause();
        v.removeAttribute("src");
        v.load();
      }
    };
  }, [src, fallbackUrl, tryUrl]);
  reactExports.useEffect(() => {
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
      const s = video.seekable;
      if (s.length > 0) {
        const start = s.start(0);
        const end = s.end(s.length - 1);
        const range = end - start;
        if (range > 0) {
          setPlayed((video.currentTime - start) / range * 100);
          setBuffered(((video.buffered.length ? video.buffered.end(video.buffered.length - 1) : end) - start) / range * 100);
        } else {
          setPlayed(0);
          setBuffered(0);
        }
      } else if (dur > 0 && isFinite(dur)) {
        setPlayed(video.currentTime / dur * 100);
      }
    };
    const onProg = () => {
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
  reactExports.useEffect(() => {
    const h = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", h);
    return () => document.removeEventListener("fullscreenchange", h);
  }, []);
  reactExports.useEffect(() => {
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
  reactExports.useEffect(() => () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    if (seekFlashTimer.current) clearTimeout(seekFlashTimer.current);
  }, []);
  reactExports.useEffect(() => {
    const isEditable = (el) => {
      const t = el;
      if (!t) return false;
      const tag = t.tagName;
      return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || t.isContentEditable;
    };
    const onKey = (ev) => {
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
  const retry = () => {
    const chain = buildUrlChain(src, fallbackUrl);
    chainRef.current = chain;
    idxRef.current = 0;
    setError(null);
    setLevels([]);
    tryUrl(chain[0]);
  };
  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {
    });
    else v.pause();
    showControls();
  };
  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    showControls();
  };
  const changeVolume = (val) => {
    const v = videoRef.current;
    if (!v) return;
    v.volume = val;
    v.muted = val === 0;
    setVolume(val);
    setMuted(val === 0);
  };
  const toggleFullscreen = () => {
    const el = wrapRef.current;
    if (!el) return;
    if (!document.fullscreenElement) el.requestFullscreen().catch(() => {
    });
    else document.exitFullscreen().catch(() => {
    });
    showControls();
  };
  const togglePip = async () => {
    const v = videoRef.current;
    if (!v) return;
    try {
      if (document.pictureInPictureElement) await document.exitPictureInPicture();
      else if (document.pictureInPictureEnabled) await v.requestPictureInPicture();
    } catch {
    }
    showControls();
  };
  const pickQuality = (level) => {
    if (hlsRef.current) hlsRef.current.currentLevel = level;
    setCurLevel(level);
    setShowQuality(false);
    showControls();
  };
  const resLabel = levels.length === 0 ? "HD" : curLevel === -1 ? levels[activeLevel]?.height ? `Auto·${levels[activeLevel].height}p` : "Auto" : qualityLabel(levels[curLevel]);
  const onTouchStart = (e) => {
    if (showQuality) {
      setShowQuality(false);
      return;
    }
    const t = e.touches[0];
    touchStartX.current = t.clientX;
    touchStartY.current = t.clientY;
    touchStartT.current = Date.now();
  };
  const onTouchMove = () => {
  };
  const onTouchEnd = (e) => {
    if (showQuality) return;
    const t = e.changedTouches[0];
    if (touchStartX.current == null || touchStartY.current == null) return;
    const dx = t.clientX - touchStartX.current;
    const dy = t.clientY - touchStartY.current;
    const dt = Date.now() - touchStartT.current;
    touchStartX.current = null;
    touchStartY.current = null;
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy) || dt > 800) {
      if (controlsVisible) {
        setControlsVisible(false);
        if (hideTimer.current) clearTimeout(hideTimer.current);
      } else {
        showControls();
      }
      return;
    }
    const secs = Math.max(-60, Math.min(60, Math.round(dx / 12)));
    if (secs !== 0) seekBy(secs > 0 ? 1 : -1, Math.abs(secs));
  };
  const onDoubleClick = (e) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mid = rect.left + rect.width / 2;
    const dir = e.clientX < mid ? -1 : 1;
    seekBy(dir, 10);
  };
  const handleMouseTap = () => {
    if (showQuality) {
      setShowQuality(false);
      return;
    }
    showControls();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      ref: wrapRef,
      className: `relative h-full w-full overflow-hidden bg-black ${isFullscreen ? "" : "rounded-xl"} ${className ?? ""}`,
      onMouseMove: showControls,
      onClick: handleMouseTap,
      onDoubleClick,
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "video",
          {
            ref: videoRef,
            poster,
            playsInline: true,
            autoPlay: true,
            preload: "auto",
            className: "absolute inset-0 h-full w-full object-contain"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/95 via-black/50 to-transparent px-3 pt-10 pb-3 transition-opacity duration-200",
            style: { opacity: controlsVisible ? 1 : 0, pointerEvents: controlsVisible ? "auto" : "none" },
            onClick: (e) => e.stopPropagation(),
            onTouchStart: (e) => e.stopPropagation(),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "relative h-2 flex-1 cursor-pointer rounded-full bg-white/20 touch-none",
                    onClick: (e) => {
                      const v = videoRef.current;
                      if (!v) return;
                      const r = e.currentTarget.getBoundingClientRect();
                      const ratio = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
                      const s = v.seekable;
                      if (s.length > 0) {
                        const start = s.start(0);
                        const end = s.end(s.length - 1);
                        v.currentTime = start + ratio * (end - start);
                      } else if (v.duration && isFinite(v.duration)) {
                        v.currentTime = ratio * v.duration;
                      }
                      setCurrentTime(v.currentTime);
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-y-0 left-0 rounded-full bg-white/30", style: { width: `${Math.min(100, Math.max(0, buffered))}%` } }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-y-0 left-0 rounded-full bg-primary transition-[width]", style: { width: `${Math.min(100, Math.max(0, played))}%` } })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    onPointerDown: (e) => {
                      e.stopPropagation();
                      const v = videoRef.current;
                      if (!v) return;
                      const s = v.seekable;
                      if (s.length > 0) {
                        v.currentTime = s.end(s.length - 1);
                        setCurrentTime(v.currentTime);
                      }
                      showControls();
                    },
                    className: `inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white transition ${isLive && seekableEnd > 0 && Math.abs(currentTime - seekableEnd) < 1 ? "bg-live/90 cursor-default" : "bg-live/60 ring-1 ring-live/60 hover:bg-live active:scale-95"}`,
                    title: "Jump to live edge",
                    "aria-label": "Jump to live edge",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 animate-pulse-live rounded-full bg-white" }),
                      "LIVE"
                    ]
                  }
                ),
                viaProxy && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden shrink-0 rounded-full bg-yellow-500/20 px-1.5 py-0.5 text-[9px] font-semibold text-yellow-400 sm:inline", children: "proxy" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    onPointerDown: (e) => {
                      e.stopPropagation();
                      seekBy(-1, 10);
                    },
                    className: "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white active:bg-white/20 sm:h-8 sm:w-8 sm:rounded-md",
                    "aria-label": "Back 10 seconds",
                    title: "Back 10s (←)",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Rewind, { className: "h-5 w-5 sm:h-4 sm:w-4" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "pointer-events-none absolute -bottom-0.5 text-[8px] font-bold leading-none sm:-bottom-1", children: "10" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onPointerDown: (e) => {
                      e.stopPropagation();
                      togglePlay();
                    },
                    className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white active:bg-white/20 sm:h-8 sm:w-8 sm:rounded-md",
                    "aria-label": playing ? "Pause" : "Play",
                    children: playing ? /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, { className: "h-5 w-5 sm:h-4 sm:w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-5 w-5 sm:h-4 sm:w-4" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    onPointerDown: (e) => {
                      e.stopPropagation();
                      seekBy(1, 10);
                    },
                    className: "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white active:bg-white/20 sm:h-8 sm:w-8 sm:rounded-md",
                    "aria-label": "Forward 10 seconds",
                    title: "Forward 10s (→)",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(FastForward, { className: "h-5 w-5 sm:h-4 sm:w-4" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "pointer-events-none absolute -bottom-0.5 text-[8px] font-bold leading-none sm:-bottom-1", children: "10" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onPointerDown: (e) => {
                      e.stopPropagation();
                      toggleMute();
                    },
                    className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white active:bg-white/20 sm:h-8 sm:w-8 sm:rounded-md",
                    "aria-label": muted ? "Unmute" : "Mute",
                    children: muted || volume === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(VolumeX, { className: "h-5 w-5 sm:h-4 sm:w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Volume2, { className: "h-5 w-5 sm:h-4 sm:w-4" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "range",
                    min: 0,
                    max: 1,
                    step: 0.05,
                    value: muted ? 0 : volume,
                    onChange: (e) => changeVolume(Number(e.target.value)),
                    className: "hidden h-1 w-16 cursor-pointer accent-primary sm:block",
                    "aria-label": "Volume"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", onClick: (e) => e.stopPropagation(), onTouchStart: (e) => e.stopPropagation(), children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      onPointerDown: (e) => {
                        e.stopPropagation();
                        setShowQuality((v) => !v);
                      },
                      className: `flex h-9 items-center gap-1 rounded-full px-2.5 text-[11px] font-bold sm:h-8 sm:rounded-md sm:text-xs ${showQuality ? "bg-primary text-primary-foreground" : "bg-white/10 text-white active:bg-white/20"}`,
                      "aria-label": "Quality",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-4 w-4 sm:h-3.5 sm:w-3.5" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: resLabel })
                      ]
                    }
                  ),
                  showQuality && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-12 right-0 z-50 min-w-[160px] max-h-64 overflow-y-auto overscroll-contain rounded-xl border border-border bg-card shadow-2xl backdrop-blur-md", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sticky top-0 border-b border-border bg-card px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground", children: "Quality" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        onPointerDown: () => pickQuality(-1),
                        className: `flex w-full items-center justify-between px-3 py-3 text-sm sm:py-2 ${curLevel === -1 ? "font-bold text-primary" : ""}`,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2 w-2 rounded-full bg-primary/60" }),
                            "Auto",
                            curLevel === -1 && levels[activeLevel]?.height && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground", children: [
                              "(",
                              levels[activeLevel].height,
                              "p)"
                            ] })
                          ] }),
                          curLevel === -1 && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4 text-primary" })
                        ]
                      }
                    ),
                    [...levels].map((l, i) => ({ l, i })).sort((a, b) => (b.l.height ?? b.l.bitrate ?? 0) - (a.l.height ?? a.l.bitrate ?? 0)).map(({ l, i }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        onPointerDown: () => pickQuality(i),
                        className: `flex w-full items-center justify-between px-3 py-3 text-sm sm:py-2 ${curLevel === i ? "font-bold text-primary" : ""}`,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `h-2 w-2 rounded-full ${(l.height ?? 0) >= 1080 ? "bg-gold" : (l.height ?? 0) >= 720 ? "bg-primary" : (l.height ?? 0) >= 480 ? "bg-blue-400" : "bg-muted-foreground"}` }),
                            qualityLabel(l),
                            l.bitrate && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: l.bitrate >= 1e6 ? `${(l.bitrate / 1e6).toFixed(1)}M` : `${Math.round(l.bitrate / 1e3)}k` })
                          ] }),
                          curLevel === i && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4 text-primary" })
                        ]
                      },
                      i
                    )),
                    levels.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-3 text-xs text-muted-foreground", children: "Detecting…" })
                  ] })
                ] }),
                typeof document !== "undefined" && "pictureInPictureEnabled" in document && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onPointerDown: (e) => {
                      e.stopPropagation();
                      togglePip();
                    },
                    className: `hidden h-8 w-8 shrink-0 items-center justify-center rounded-md transition sm:flex ${isPip ? "bg-primary/30 text-primary" : "text-white/80 hover:bg-white/10"}`,
                    "aria-label": "Picture-in-Picture",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(PictureInPicture2, { className: "h-4 w-4" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onPointerDown: (e) => {
                      e.stopPropagation();
                      toggleFullscreen();
                    },
                    className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white active:bg-white/20 sm:h-8 sm:w-8 sm:rounded-md sm:bg-transparent sm:hover:bg-white/10",
                    "aria-label": isFullscreen ? "Exit fullscreen" : "Fullscreen",
                    children: isFullscreen ? /* @__PURE__ */ jsxRuntimeExports.jsx(Minimize2, { className: "h-5 w-5 sm:h-4 sm:w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Maximize2, { className: "h-5 w-5 sm:h-4 sm:w-4" })
                  }
                )
              ] })
            ]
          }
        ),
        seekFlash && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "pointer-events-none absolute inset-0 z-30 flex items-center justify-center",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-1 rounded-2xl bg-black/60 px-5 py-3 text-white backdrop-blur-sm animate-in fade-in zoom-in-95 duration-150", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                seekFlash.dir === -1 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Rewind, { className: "h-7 w-7" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(FastForward, { className: "h-7 w-7" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display text-2xl font-bold tabular-nums", children: [
                  seekFlash.secs,
                  "s"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold uppercase tracking-wider text-white/70", children: seekFlash.dir === -1 ? "Back" : "Forward" })
            ] })
          },
          seekFlash.key
        ),
        loading && !error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3 text-white", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-14 w-14", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 rounded-full border-2 border-primary/20" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-primary" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold uppercase tracking-widest text-white/60", children: idxRef.current > 0 ? `Trying source ${idxRef.current + 1}…` : "Connecting…" })
        ] }) }),
        error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-black/80 px-6 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3 text-white", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-14 w-14 items-center justify-center rounded-full bg-live/20 ring-1 ring-live/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-7 w-7 text-live" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "max-w-xs text-sm", children: error }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onPointerDown: retry,
              className: "inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground active:scale-95 sm:py-2.5",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4" }),
                " Retry"
              ]
            }
          )
        ] }) })
      ]
    }
  );
}
const TABS = ["Top 10", "All", "Football", "Sports", "Cricket", "Entertainment", "Movies", "Bangladesh", "Cartoon", "Documentary", "News"];
function ChannelList({ channels, activeId, onPick, fullHeight = false }) {
  const [tab, setTab] = reactExports.useState("Top 10");
  const [q, setQ] = reactExports.useState("");
  const filtered = reactExports.useMemo(() => {
    let list = channels;
    if (tab === "Top 10") list = list.filter((c) => c.featured).slice(0, 10);
    else if (tab !== "All") list = list.filter((c) => c.group === tab);
    if (q.trim()) {
      const needle = q.trim().toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(needle));
    }
    return list;
  }, [channels, tab, q]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex flex-col overflow-hidden rounded-xl border border-border bg-card ${fullHeight ? "h-full" : "h-full"}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-border p-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            value: q,
            onChange: (e) => setQ(e.target.value),
            placeholder: "Search channels…",
            className: "w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 flex flex-wrap gap-1.5", children: TABS.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setTab(t),
          className: `rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider transition ${tab === t ? "bg-primary text-primary-foreground" : "bg-secondary/60 text-muted-foreground hover:bg-secondary"}`,
          children: t === "Top 10" ? "★ Top 10" : t
        },
        t
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-2", children: [
      filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-10 text-center text-sm text-muted-foreground", children: "No channels." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1", children: filtered.map((c) => {
        const active = c.id === activeId;
        return /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => onPick(c),
            className: `group flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition ${active ? "bg-primary/15 ring-1 ring-primary/40" : "hover:bg-secondary/60"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-background ring-1 ring-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: c.logo || FALLBACK_LOGO,
                  alt: "",
                  loading: "lazy",
                  className: "h-full w-full object-contain p-1",
                  onError: (e) => {
                    e.currentTarget.src = FALLBACK_LOGO;
                  }
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `truncate text-sm font-semibold ${active ? "text-primary" : ""}`, children: c.name }),
                  c.featured && /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-3 w-3 shrink-0 fill-gold text-gold" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: c.group })
              ] }),
              active && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-[10px] font-bold uppercase text-live", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 animate-pulse-live rounded-full bg-live" }),
                "Live"
              ] })
            ]
          }
        ) }, c.id);
      }) })
    ] })
  ] });
}
function LivePage() {
  const {
    channels
  } = useChannels();
  const [active, setActive] = reactExports.useState(null);
  const [showChannelDrawer, setShowChannelDrawer] = reactExports.useState(false);
  const playerRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (!active && channels.length > 0) {
      setActive(channels.find((c) => c.featured) ?? channels[0]);
    }
  }, [channels, active]);
  const pickChannel = reactExports.useCallback((c) => {
    setActive(c);
    setShowChannelDrawer(false);
    setTimeout(() => {
      playerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 60);
  }, []);
  const meta = reactExports.useMemo(() => active ? {
    name: active.name,
    group: active.group
  } : null, [active]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-6 lg:px-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "mb-3 flex flex-wrap items-end justify-between gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold uppercase tracking-[0.2em] text-primary", children: "Live TV" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-0.5 truncate font-display text-xl font-bold sm:text-3xl", children: meta?.name ?? "Select a channel" }),
        meta && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-0.5 text-xs text-muted-foreground sm:text-sm", children: [
          meta.group,
          " · BDIX-optimised"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex shrink-0 items-center gap-1.5 text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-1 text-[11px] font-semibold text-primary ring-1 ring-primary/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Wifi, { className: "h-3 w-3" }),
          " BDIX"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-live/15 px-2 py-1 text-[11px] font-semibold text-live ring-1 ring-live/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Radio, { className: "h-3 w-3 animate-pulse-live" }),
          " LIVE"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: playerRef, className: "flex flex-col gap-3 lg:grid lg:grid-cols-[1fr_340px] lg:gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full overflow-hidden rounded-xl border border-border bg-black shadow-card", style: {
        aspectRatio: "16/9",
        maxHeight: "70vh"
      }, children: active ? /* @__PURE__ */ jsxRuntimeExports.jsx(HlsPlayer, { src: active.url, fallbackUrl: active.fallbackUrl, poster: active.logo || FALLBACK_LOGO, className: "h-full w-full" }, active.id) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-full items-center justify-center text-sm text-muted-foreground", children: "Loading channels…" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden lg:block", style: {
        height: "min(calc(100vh - 200px), 70vh)"
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChannelList, { channels, activeId: active?.id, onPick: pickChannel }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 lg:hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setShowChannelDrawer(true), className: "flex w-full items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 text-left transition hover:border-primary/40 active:bg-secondary/40", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-w-0 items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-background ring-1 ring-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: active?.logo || FALLBACK_LOGO, alt: active?.name || "", className: "h-full w-full object-contain p-1", onError: (e) => e.currentTarget.src = FALLBACK_LOGO }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-sm font-semibold", children: active?.name ?? "Select a channel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: active?.group ?? "Tap to browse channels" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex shrink-0 items-center gap-1 text-xs text-primary font-semibold", children: [
        "Change ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4" })
      ] })
    ] }) }),
    showChannelDrawer && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-50 lg:hidden", onClick: () => setShowChannelDrawer(false), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/70 backdrop-blur-sm" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-x-0 bottom-0 flex max-h-[80vh] flex-col rounded-t-2xl border-t border-border bg-card", onClick: (e) => e.stopPropagation(), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-3 border-b border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto h-1 w-10 rounded-full bg-border absolute top-2 left-1/2 -translate-x-1/2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-base font-bold", children: "Channels" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowChannelDrawer(false), className: "flex h-8 w-8 items-center justify-center rounded-full hover:bg-secondary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChannelList, { channels, activeId: active?.id, onPick: pickChannel }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AllChannelsGrid, { channels, activeId: active?.id, onPick: pickChannel })
  ] });
}
const GROUP_ORDER = ["Football", "Sports", "Cricket", "Entertainment", "Movies", "Music", "Cartoon", "Bangladesh", "Documentary", "News"];
function AllChannelsGrid({
  channels,
  activeId,
  onPick
}) {
  const [activeGroup, setActiveGroup] = reactExports.useState("All");
  const byGroup = reactExports.useMemo(() => {
    const map = {};
    for (const c of channels) (map[c.group] ||= []).push(c);
    return map;
  }, [channels]);
  const groupsWithChannels = GROUP_ORDER.filter((g) => (byGroup[g]?.length ?? 0) > 0);
  const displayList = reactExports.useMemo(() => activeGroup === "All" ? channels : byGroup[activeGroup] ?? [], [channels, byGroup, activeGroup]);
  if (channels.length === 0) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-8 sm:mt-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-3 flex flex-wrap items-center justify-between gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "flex items-center gap-2 font-display text-lg font-bold sm:text-xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TvMinimal, { className: "h-5 w-5 text-primary" }),
      "All Channels",
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-normal text-muted-foreground", children: [
        "(",
        channels.length,
        ")"
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex gap-1.5 overflow-x-auto pb-1 scrollbar-none", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setActiveGroup("All"), className: `shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition ${activeGroup === "All" ? "bg-primary text-primary-foreground" : "bg-secondary/60 text-muted-foreground"}`, children: [
        "All (",
        channels.length,
        ")"
      ] }),
      groupsWithChannels.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setActiveGroup(g), className: `shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition ${activeGroup === g ? "bg-primary text-primary-foreground" : "bg-secondary/60 text-muted-foreground"}`, children: [
        g,
        " (",
        byGroup[g]?.length ?? 0,
        ")"
      ] }, g))
    ] }),
    activeGroup === "All" ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: groupsWithChannels.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-px flex-1 bg-border" }),
        g,
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-px flex-1 bg-border" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChannelGrid, { channels: byGroup[g] ?? [], activeId, onPick })
    ] }, g)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChannelGrid, { channels: displayList, activeId, onPick })
  ] });
}
function ChannelGrid({
  channels,
  activeId,
  onPick
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 gap-2 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 xl:grid-cols-11", children: channels.map((c) => {
    const isActive = c.id === activeId;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => onPick(c), title: c.name, className: `group relative flex flex-col items-center gap-1 rounded-xl border p-1.5 transition-all active:scale-95 sm:p-2 ${isActive ? "border-primary/60 bg-primary/10 shadow-glow" : "border-border bg-card"}`, children: [
      isActive && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "absolute right-1 top-1 flex h-2 w-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute inline-flex h-full w-full animate-pulse-live rounded-full bg-live opacity-75" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "relative inline-flex h-2 w-2 rounded-full bg-live" })
      ] }),
      c.featured && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-1 top-1 text-[9px] text-gold", children: "★" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 overflow-hidden rounded-lg bg-background ring-1 ring-border sm:h-11 sm:w-11", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: c.logo || FALLBACK_LOGO, alt: c.name, loading: "lazy", decoding: "async", className: "h-full w-full object-contain p-0.5", onError: (e) => e.currentTarget.src = FALLBACK_LOGO }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `line-clamp-2 w-full text-center text-[9px] font-semibold leading-tight sm:text-[10px] ${isActive ? "text-primary" : "text-foreground/80"}`, children: c.name })
    ] }, c.id);
  }) });
}
export {
  LivePage as component
};
