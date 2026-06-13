import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { H as Hls } from "../_libs/hls.js.mjs";
import { u as useChannels, F as FALLBACK_LOGO } from "./channels-store-CBUMdJ47.mjs";
import { W as Wifi, d as Signal, R as Radio, P as Pause, e as Play, V as VolumeX, f as Volume2, g as Settings, C as Check, h as PictureInPicture2, M as Minimize2, i as Maximize2, j as TriangleAlert, k as RefreshCw, l as Search, m as Star, n as TvMinimal } from "../_libs/lucide-react.mjs";
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
  if (l.bitrate) return `${Math.round(l.bitrate / 1e3)}kbps`;
  return "HD";
}
function HlsPlayer({ src, fallbackUrl, poster, className }) {
  const videoRef = reactExports.useRef(null);
  const wrapRef = reactExports.useRef(null);
  const hlsRef = reactExports.useRef(null);
  const chainRef = reactExports.useRef([]);
  const idxRef = reactExports.useRef(0);
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
    const onTime = () => {
      if (video.duration > 0) setPlayed(video.currentTime / video.duration * 100);
    };
    const onProg = () => {
      if (video.buffered.length && video.duration > 0)
        setBuffered(video.buffered.end(video.buffered.length - 1) / video.duration * 100);
    };
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
  };
  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
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
    if (!document.fullscreenElement) {
      el.requestFullscreen().catch(() => {
      });
    } else {
      document.exitFullscreen().catch(() => {
      });
    }
  };
  const togglePip = async () => {
    const v = videoRef.current;
    if (!v) return;
    try {
      if (document.pictureInPictureElement) await document.exitPictureInPicture();
      else if (document.pictureInPictureEnabled) await v.requestPictureInPicture();
    } catch {
    }
  };
  const pickQuality = (level) => {
    if (hlsRef.current) hlsRef.current.currentLevel = level;
    setCurLevel(level);
    setShowQuality(false);
  };
  const resLabel = levels.length === 0 ? "HD" : curLevel === -1 ? levels[activeLevel]?.height ? `Auto · ${levels[activeLevel].height}p` : "Auto" : qualityLabel(levels[curLevel]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      ref: wrapRef,
      className: `group/player relative h-full w-full overflow-hidden bg-black ${isFullscreen ? "" : "rounded-xl"} ${className ?? ""}`,
      onClick: () => showQuality && setShowQuality(false),
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
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-x-0 bottom-0 z-20 translate-y-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent px-3 pt-8 pb-2.5\n                      opacity-0 transition-all duration-200\n                      group-hover/player:opacity-100\n                      focus-within:opacity-100", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "relative h-1.5 flex-1 cursor-pointer rounded-full bg-white/10",
                onClick: (e) => {
                  const v = videoRef.current;
                  if (!v || !v.duration) return;
                  const r = e.currentTarget.getBoundingClientRect();
                  v.currentTime = (e.clientX - r.left) / r.width * v.duration;
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-y-0 left-0 rounded-full bg-white/20", style: { width: `${buffered}%` } }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-y-0 left-0 rounded-full bg-primary transition-[width]", style: { width: `${played}%` } })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex shrink-0 items-center gap-1 rounded-full bg-live/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1 w-1 animate-pulse-live rounded-full bg-white" }),
              "LIVE"
            ] }),
            viaProxy && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0 rounded-full bg-yellow-500/20 px-2 py-0.5 text-[9px] font-semibold text-yellow-400", children: "proxy" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: (e) => {
                  e.stopPropagation();
                  togglePlay();
                },
                className: "flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-white/90 hover:bg-white/10 hover:text-white transition",
                title: playing ? "Pause" : "Play",
                children: playing ? /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: (e) => {
                  e.stopPropagation();
                  toggleMute();
                },
                className: "flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-white/80 hover:bg-white/10 hover:text-white transition",
                title: muted ? "Unmute" : "Mute",
                children: muted || volume === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(VolumeX, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Volume2, { className: "h-4 w-4" })
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
                className: "h-1 w-16 cursor-pointer accent-primary"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", onClick: (e) => e.stopPropagation(), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: () => setShowQuality((v) => !v),
                  className: `flex h-7 items-center gap-1.5 rounded-md px-2.5 text-xs font-bold transition ${showQuality ? "bg-primary text-primary-foreground" : "bg-white/10 text-white hover:bg-white/20"}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-3.5 w-3.5" }),
                    resLabel
                  ]
                }
              ),
              showQuality && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-9 right-0 z-50 min-w-[150px] overflow-hidden rounded-xl border border-border bg-card shadow-2xl backdrop-blur-md", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-border px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground", children: "Quality" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    onClick: () => pickQuality(-1),
                    className: `flex w-full items-center justify-between px-3 py-2 text-sm hover:bg-secondary/60 ${curLevel === -1 ? "font-bold text-primary" : ""}`,
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
                      curLevel === -1 && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3.5 w-3.5 text-primary" })
                    ]
                  }
                ),
                [...levels].map((l, i) => ({ l, i })).sort((a, b) => (b.l.height ?? b.l.bitrate ?? 0) - (a.l.height ?? a.l.bitrate ?? 0)).map(({ l, i }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    onClick: () => pickQuality(i),
                    className: `flex w-full items-center justify-between px-3 py-2 text-sm hover:bg-secondary/60 ${curLevel === i ? "font-bold text-primary" : ""}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `h-2 w-2 rounded-full ${(l.height ?? 0) >= 1080 ? "bg-gold" : (l.height ?? 0) >= 720 ? "bg-primary" : (l.height ?? 0) >= 480 ? "bg-blue-400" : "bg-muted-foreground"}` }),
                        qualityLabel(l),
                        l.bitrate && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: l.bitrate >= 1e6 ? `${(l.bitrate / 1e6).toFixed(1)}Mbps` : `${Math.round(l.bitrate / 1e3)}k` })
                      ] }),
                      curLevel === i && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3.5 w-3.5 text-primary" })
                    ]
                  },
                  i
                )),
                levels.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-2 text-xs text-muted-foreground", children: "Detecting…" })
              ] })
            ] }),
            typeof document !== "undefined" && "pictureInPictureEnabled" in document && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: (e) => {
                  e.stopPropagation();
                  togglePip();
                },
                className: `flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition ${isPip ? "bg-primary/30 text-primary" : "text-white/80 hover:bg-white/10 hover:text-white"}`,
                title: "Picture-in-Picture",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(PictureInPicture2, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: (e) => {
                  e.stopPropagation();
                  toggleFullscreen();
                },
                className: "flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-white/80 hover:bg-white/10 hover:text-white transition",
                title: isFullscreen ? "Exit fullscreen" : "Fullscreen",
                children: isFullscreen ? /* @__PURE__ */ jsxRuntimeExports.jsx(Minimize2, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Maximize2, { className: "h-4 w-4" })
              }
            )
          ] })
        ] }),
        loading && !error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3 text-white", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-12 w-12", children: [
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
              onClick: retry,
              className: "inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-glow hover:scale-105 transition",
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
function ChannelList({ channels, activeId, onPick }) {
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card", children: [
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
  const playerRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (!active && channels.length > 0) {
      const top = channels.find((c) => c.featured) ?? channels[0];
      setActive(top);
    }
  }, [channels, active]);
  const pickChannel = reactExports.useCallback((c) => {
    setActive(c);
    setTimeout(() => {
      playerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 60);
  }, []);
  const meta = reactExports.useMemo(() => {
    if (!active) return null;
    return {
      name: active.name,
      group: active.group
    };
  }, [active]);
  const playerHeight = "min(calc(100vh - 200px), 74vh)";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "mb-4 flex flex-wrap items-end justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold uppercase tracking-[0.2em] text-primary", children: "Live TV" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-1 font-display text-3xl font-bold sm:text-4xl", children: meta?.name ?? "Select a channel" }),
        meta && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-sm text-muted-foreground", children: [
          meta.group,
          " · BDIX-optimised"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Wifi, { className: "h-3 w-3" }), label: "BDIX Ready", tone: "primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Signal, { className: "h-3 w-3" }), label: "Auto HD", tone: "secondary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Radio, { className: "h-3 w-3 animate-pulse-live text-live" }), label: "LIVE", tone: "live" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: playerRef, className: "grid gap-4 lg:grid-cols-[1fr_340px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative overflow-hidden rounded-xl border border-border bg-black shadow-card", style: {
        height: playerHeight
      }, children: active ? /* @__PURE__ */ jsxRuntimeExports.jsx(HlsPlayer, { src: active.url, fallbackUrl: active.fallbackUrl, poster: active.logo || FALLBACK_LOGO }, active.id) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-full items-center justify-center text-sm text-muted-foreground", children: "Loading channels…" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        height: playerHeight
      }, className: "min-h-[400px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChannelList, { channels, activeId: active?.id, onPick: pickChannel }) })
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
    for (const c of channels) {
      (map[c.group] ||= []).push(c);
    }
    return map;
  }, [channels]);
  const groupsWithChannels = GROUP_ORDER.filter((g) => (byGroup[g]?.length ?? 0) > 0);
  const displayList = reactExports.useMemo(() => {
    if (activeGroup === "All") return channels;
    return byGroup[activeGroup] ?? [];
  }, [channels, byGroup, activeGroup]);
  if (channels.length === 0) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 flex flex-wrap items-center justify-between gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "flex items-center gap-2 font-display text-xl font-bold", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TvMinimal, { className: "h-5 w-5 text-primary" }),
      "All Channels",
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-normal text-muted-foreground", children: [
        "(",
        channels.length,
        ")"
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5 flex flex-wrap gap-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setActiveGroup("All"), className: `rounded-full px-3 py-1 text-xs font-semibold transition ${activeGroup === "All" ? "bg-primary text-primary-foreground" : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"}`, children: [
        "All (",
        channels.length,
        ")"
      ] }),
      groupsWithChannels.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setActiveGroup(g), className: `rounded-full px-3 py-1 text-xs font-semibold transition ${activeGroup === g ? "bg-primary text-primary-foreground" : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"}`, children: [
        g,
        " (",
        byGroup[g]?.length ?? 0,
        ")"
      ] }, g))
    ] }),
    activeGroup === "All" ? (
      // show grouped sections when "All" selected
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-8", children: groupsWithChannels.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-px flex-1 bg-border" }),
          g,
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-px flex-1 bg-border" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChannelGrid, { channels: byGroup[g] ?? [], activeId, onPick })
      ] }, g)) })
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChannelGrid, { channels: displayList, activeId, onPick })
  ] });
}
function ChannelGrid({
  channels,
  activeId,
  onPick
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10", children: channels.map((c) => {
    const isActive = c.id === activeId;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => onPick(c), title: c.name, className: `group relative flex flex-col items-center gap-1.5 rounded-xl border p-2 transition-all hover:-translate-y-0.5 hover:shadow-glow ${isActive ? "border-primary/60 bg-primary/10 shadow-glow" : "border-border bg-card hover:border-primary/40"}`, children: [
      isActive && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "absolute right-1.5 top-1.5 flex h-2 w-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute inline-flex h-full w-full animate-pulse-live rounded-full bg-live opacity-75" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "relative inline-flex h-2 w-2 rounded-full bg-live" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-11 w-11 overflow-hidden rounded-lg bg-background ring-1 ring-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: c.logo || FALLBACK_LOGO, alt: c.name, loading: "lazy", decoding: "async", className: "h-full w-full object-contain p-0.5", onError: (e) => e.currentTarget.src = FALLBACK_LOGO }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `line-clamp-2 w-full text-center text-[10px] font-semibold leading-tight ${isActive ? "text-primary" : "text-foreground/80"}`, children: c.name }),
      c.featured && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-1.5 top-1.5 text-[9px] text-gold", children: "★" })
    ] }, c.id);
  }) });
}
function Badge({
  icon,
  label,
  tone
}) {
  const cls = tone === "primary" ? "bg-primary/15 text-primary ring-1 ring-primary/30" : tone === "live" ? "bg-live/15 text-live ring-1 ring-live/30" : "bg-secondary/60 text-muted-foreground ring-1 ring-border";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-semibold ${cls}`, children: [
    icon,
    label
  ] });
}
export {
  LivePage as component
};
