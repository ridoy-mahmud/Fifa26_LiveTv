# WC 2026 Live 🏆

An independent, real-time companion for the **FIFA World Cup 2026** (USA · Canada · Mexico).

Live scores · Full schedule with countdown timers · HLS video streaming · BDIX-optimised playback

---

## Features

- **Live scores & schedule** — all 104 matches from the group stage through the final, with live countdowns per match
- **Scrolling match strip** — persistent ticker at the top of every page showing upcoming and live matches
- **HLS video player** — quality selector (Auto / 1080p / 720p / 480p / …), mute toggle, fullscreen, progress bar, and auto-retry on stream failure
- **130+ live channels** — FIFA+, beIN Sports 1–4, T Sports, Fox Sports, Sony Sports, Star Sports, ESPN, TSN, TNT Sports, Bangladesh channels, entertainment, movies, cartoons, documentaries and more
- **BDIX-optimised streams** — prioritised local ISP CDN links for users in Bangladesh
- **Admin panel** (`/admin`) — add, edit, delete, reorder channels; sort by name/group; group filter tabs; import JSON or CSV
- **Fully responsive** — works on mobile, tablet and desktop
- **Dark stadium theme** — football green primary, gold accents, live red

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | [TanStack Start](https://tanstack.com/start) (SSR, file-based routing) |
| UI | React 19 + Tailwind CSS v4 + shadcn/ui (Radix) |
| Streaming | [hls.js](https://github.com/video-dev/hls.js) |
| State | TanStack Query + localStorage (channels) |
| Deployment | Cloudflare Workers (Nitro adapter) |

---

## Getting started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

### Environment variables

Copy `.env.example` to `.env` and fill in:

```
MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/?appName=Cluster0
MONGODB_DB=wc2026
```

**Admin Authentication:**
- The admin panel uses Firebase Google Authentication
- Only the configured email (`mahamulhasan38@gmail.com`) can access the admin panel
- Firebase configuration is already included in the project

> Stream URLs are **not committed** to this repo (see `.gitignore`). Add channels via the admin panel at `/admin` after signing in with Google.

---

## Project structure

```
src/
  components/
    layout/        Navbar, Footer
    match/         MatchCard, MatchStrip, LiveTicker
    player/        HlsPlayer, ChannelList
    admin/         AdminButton
  lib/
    worldcup-data.ts   Match & team data (real WC 2026 schedule)
    channels-store.ts  localStorage channel management
  routes/
    index.tsx      Home / hero
    schedule.tsx   Full 104-match schedule
    live.tsx       Live TV player
    admin.tsx      Admin dashboard
```

---

## Contributing

This project was built by [**Ridoy**](https://github.com/ridoy-mahmud).  
Pull requests and issues are welcome.

---

## Disclaimer

This is an **independent fan project** and is not affiliated with, endorsed by, or connected to FIFA or any official broadcaster. All broadcast rights belong to their respective licensed holders. Stream URLs are provided for personal use only.
