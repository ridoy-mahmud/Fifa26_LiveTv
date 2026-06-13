import { r as reactExports } from "../_libs/react.mjs";
const _raw = [
  // ── FIFA+ ──────────────────────────────────────────────────────────────
  { name: "FIFA+ English", group: "Football", featured: true, logo: "https://i.ibb.co.com/vnbkF0r/fifa-world-cup-2026-logo-png-seeklogo-665644.png", url: "https://a62dad94.wurl.com/master/f36d25e7e52f1ba8d7e56eb859c636563214f541/UmFrdXRlblRWLWV1X0ZJRkFQbHVzRW5nbGlzaF9ITFM/playlist.m3u8" },
  { name: "FIFA+ Spain", group: "Football", featured: true, logo: "https://api.thextribune.com/files/FIFA_plus_1781171192455_ffc541836205c97d.webp", url: "https://d63fabad.wurl.com/master/f36d25e7e52f1ba8d7e56eb859c636563214f541/UmFrdXRlblRWLWVzX0ZJRkFQbHVzU3BhbmlzaF9ITFM/playlist.m3u8" },
  { name: "FIFA+ France", group: "Football", logo: "https://api.thextribune.com/files/FIFA_plus_1781171192455_ffc541836205c97d.webp", url: "https://37b4c228.wurl.com/master/f36d25e7e52f1ba8d7e56eb859c636563214f541/UmFrdXRlblRWLWZyX0ZJRkFQbHVzRnJlbmNoX0hMUw/playlist.m3u8" },
  { name: "FIFA+ Germany", group: "Football", logo: "https://api.thextribune.com/files/FIFA_plus_1781171192455_ffc541836205c97d.webp", url: "https://4397879b.wurl.com/master/f36d25e7e52f1ba8d7e56eb859c636563214f541/UmFrdXRlblRWLWRlX0ZJRkFQbHVzR2VybWFuX0hMUw/playlist.m3u8" },
  { name: "FIFA+ Italy", group: "Football", logo: "https://api.thextribune.com/files/FIFA_plus_1781171192455_ffc541836205c97d.webp", url: "https://5d95f7d7.wurl.com/master/f36d25e7e52f1ba8d7e56eb859c636563214f541/UmFrdXRlblRWLWl0X0ZJRkFQbHVzSXRhbGlhbl9ITFM/playlist.m3u8" },
  { name: "FIFA+ Brazil", group: "Football", logo: "https://api.thextribune.com/files/FIFA_plus_1781171192455_ffc541836205c97d.webp", url: "https://e3be9ac5.wurl.com/master/f36d25e7e52f1ba8d7e56eb859c636563214f541/TEctYnJfRklGQVBsdXNQb3J0dWd1ZXNlX0hMUw/playlist.m3u8" },
  { name: "FIFA+ Argentina", group: "Football", logo: "https://api.thextribune.com/files/FIFA_plus_1781171192455_ffc541836205c97d.webp", url: "https://6c849fb3.wurl.com/master/f36d25e7e52f1ba8d7e56eb859c636563214f541/TEctbXhfRklGQVBsdXNTcGFuaXNoLTFfSExT/playlist.m3u8" },
  { name: "FIFA+ B", group: "Football", logo: "https://i.ibb.co.com/vnbkF0r/fifa-world-cup-2026-logo-png-seeklogo-665644.png", url: "https://37b4c228.wurl.com/manifest/f36d25e7e52f1ba8d7e56eb859c636563214f541/UmFrdXRlblRWLWZyX0ZJRkFQbHVzRnJlbmNoX0hMUw/6f5437c5-e015-4754-8476-c8c6d27d3a55/1.m3u8" },
  // ── T SPORTS ───────────────────────────────────────────────────────────
  // 27.124.71.27 replaced with live.tsports.com primary; fallback kept
  { name: "T Sports HD", group: "Sports", featured: true, logo: "https://i.ibb.co.com/mrvT7b6G/T-Sports-HD.png", url: "https://live.tsports.com/mobile_hls/tsports_live_1/playlist.m3u8", fallbackUrl: "https://tvsen7.aynaott.com/tsports-hd/tracks-v1a1/mono.ts.m3u8" },
  { name: "T Sports", group: "Sports", logo: "https://api.thextribune.com/files/T_Sports_logo_svg_1780981631148_7d475dcd9fd1eb18.webp", url: "https://tvsen7.aynaott.com/tsports-hd/tracks-v1a1/mono.ts.m3u8", fallbackUrl: "https://amitomar.bdixbd.net/hoichoi.pro1/tracks-v1a1/index.m3u8" },
  { name: "T Sports HD (Ayna)", group: "Sports", logo: "https://i.ibb.co.com/mrvT7b6G/T-Sports-HD.png", url: "https://tvsen7.aynaott.com/tsports-hd/tracks-v1a1/mono.ts.m3u8" },
  { name: "T Sports Live 1", group: "Sports", logo: "https://i.ibb.co.com/mrvT7b6G/T-Sports-HD.png", url: "https://live.tsports.com/mobile_hls/tsports_live_1/playlist.m3u8" },
  { name: "T Sports Live 3", group: "Sports", logo: "https://i.ibb.co.com/mrvT7b6G/T-Sports-HD.png", url: "https://live.tsports.com/mobile_hls/tsports_live_3/playlist.m3u8" },
  // ── beIN SPORTS ────────────────────────────────────────────────────────
  { name: "beIN Sports", group: "Sports", featured: true, logo: "https://vignette.wikia.nocookie.net/logopedia/images/9/94/BE_IN_SPORT_1_HD_2013.jpg", url: "https://bein-esp-xumo.amagi.tv/playlistR1080p.m3u8" },
  { name: "beIN Sports 1", group: "Sports", featured: true, logo: "https://api.thextribune.com/files/BeIN_Sports_1_1781028191206_2026f1108f3141a1.webp", url: "https://andro.226503.xyz/checklist/androstreamlivebs1.m3u8" },
  // 27.124.71.27 BDIX replaced with andro.226503.xyz
  { name: "beIN Sports 1 (BDIX)", group: "Sports", logo: "https://imglink.cc/cdn/kIiut6WBq0.jpg", url: "https://andro.226503.xyz/checklist/androstreamlivebs1.m3u8" },
  // ua.online24.pm Serbia stream removed (no routable HTTPS alternative)
  { name: "beIN Sports 2", group: "Sports", logo: "https://api.thextribune.com/files/Bein_sports_2_1781028321193_1f1e2e27a5bfa6bc.webp", url: "https://andro.226503.xyz/checklist/androstreamlivebs2.m3u8" },
  // 27.124.71.27 BDIX replaced with andro.226503.xyz
  { name: "beIN Sports 2 (BDIX)", group: "Sports", logo: "https://imglink.cc/cdn/kIiut6WBq0.jpg", url: "https://andro.226503.xyz/checklist/androstreamlivebs2.m3u8" },
  // 145.239.5.177 France stream removed (no routable HTTPS alternative)
  { name: "beIN Sports 3", group: "Sports", logo: "https://api.thextribune.com/files/BeIN_Sports_3_1781028446814_0ae3761519da73f7.webp", url: "https://andro.226503.xyz/checklist/androstreamlivebs3.m3u8" },
  // 27.124.71.27 BDIX replaced with andro.226503.xyz
  { name: "beIN Sports 3 (BDIX)", group: "Sports", logo: "https://imglink.cc/cdn/kIiut6WBq0.jpg", url: "https://andro.226503.xyz/checklist/androstreamlivebs3.m3u8" },
  { name: "beIN Sports 4", group: "Sports", logo: "https://api.thextribune.com/files/Logo_bein_sports_4_1781170602208_5653e44e6b0fe44a.webp", url: "https://andro.226503.xyz/checklist/androstreamlivebs4.m3u8" },
  { name: "beIN Sports Xtra", group: "Sports", logo: "https://imglink.cc/cdn/kIiut6WBq0.jpg", url: "https://bein-esp-xumo.amagi.tv/playlistR720P.m3u8" },
  { name: "beIN Xtra", group: "Sports", logo: "https://vignette.wikia.nocookie.net/logopedia/images/9/94/BE_IN_SPORT_1_HD_2013.jpg", url: "https://bein-xtra-bein.amagi.tv/playlist.m3u8" },
  // ── FOX SPORTS ─────────────────────────────────────────────────────────
  { name: "Fox Sports", group: "Sports", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/FOX_Sports_logo.svg/960px-FOX_Sports_logo.svg.png", url: "https://d1jzu95oc8fgt3.cloudfront.net/FOX_Sports.m3u8" },
  { name: "Fox Sports 1", group: "Sports", featured: true, logo: "https://api.thextribune.com/files/fox_sports_1_1780987908653_f17a9d39b6b9eeb7.webp", url: "https://tvsen7.aynaott.com/foxsports1/index.m3u8" },
  { name: "Fox Sports 2", group: "Sports", logo: "https://api.thextribune.com/files/FS2_logo_2015_svg_1780987972372_295285b9aa884df5.webp", url: "https://tvsen7.aynaott.com/foxsports2/index.m3u8" },
  { name: "Fox Sports 2 (FIFA)", group: "Sports", logo: "https://imglink.cc/cdn/o5BoWU_BEz.png", url: "https://tvsen7.aynaott.com/foxsports2/index.m3u8?e=1779283790&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=cbb7f40b4af7be51a91e0629a5ac7238" },
  // ── SONY SPORTS ────────────────────────────────────────────────────────
  { name: "Sony Sports 1", group: "Cricket", featured: true, logo: "https://api.thextribune.com/files/Sony_Sports_Ten_1_1780983387786_75e5b2a97aef622a.webp", url: "https://mflixott.com/tv/toffee-by-maruf/live.php?id=sony_sports_1_hd&e=.m3u8" },
  { name: "Sony Sports 1 (ASH)", group: "Cricket", logo: "https://api.thextribune.com/files/Sony_Sports_Ten_1_1780983387786_75e5b2a97aef622a.webp", url: "https://ashtv.com.bd/server/channels/sony_ten_sports_1_hd.m3u8" },
  { name: "Sony Sports 2", group: "Cricket", logo: "https://api.thextribune.com/files/Sony_Sports_Ten_2_1780982817063_eb8902a0fb8b5938.webp", url: "https://mflixott.com/tv/toffee-by-maruf/live.php?id=sony_sports_2_hd&e=.m3u8" },
  { name: "Sony Sports 2 (ASH)", group: "Cricket", logo: "https://api.thextribune.com/files/Sony_Sports_Ten_2_1780982817063_eb8902a0fb8b5938.webp", url: "https://ashtv.com.bd/server/channels/sony_ten_sports_2_hd.m3u8" },
  { name: "Sony Sports Ten 2 HD", group: "Cricket", logo: "https://raw.githubusercontent.com/subirkumarpaul/Logo/56e54462053b1b278b80b532c89c01f17e360fd5/Sony%20Sports%20Ten%203.png", url: "https://mflixott.com/tv/toffee-by-maruf/live.php?cid=sony_sports_2_hd&chunks=4776e8f8b535f4b0b1c814a38eeaa1fcadc7880caad34f0b9987d64c8c5df58f08ffa781b3c87f5cdeb84d822bcbbdc7cc6e8bb38903c35f27fe11e456450ef1d3d62a2b64f28a9aba71503d33e44de39b9f070d946f196792126a25392582df5a68d91aea81bae91ce9840a2e2ae430" },
  { name: "Sony Sports 5", group: "Cricket", logo: "https://api.thextribune.com/files/Sony_Sports_Ten_5_1780983706846_e4fd1bb25635458a.webp", url: "https://mflixott.com/tv/toffee-by-maruf/live.php?id=sony_sports_5_hd&e=.m3u8" },
  // Sony TV 198 replaced with tvsen6.aynaott.com
  { name: "Sony TV", group: "Entertainment", logo: "https://imglink.cc/cdn/WC3hEjixvp.jpg", url: "https://tvsen6.aynaott.com/sonytv/index.m3u8" },
  { name: "Sony Aath", group: "Entertainment", logo: "https://imglink.cc/cdn/5tDvvUEpWx.png", url: "https://edge2.roarzone.net:8447/roarzone/edge3/sonyaath/index.m3u8?token=571cbfa1fa2e6d2ce7d53975a8ae77afb5189d20-eb13b2ccb090084878804fb0e801091a-1780020920-1780010120" },
  // Sony Aath 198 replaced with edge2.roarzone version
  { name: "Sony Aath (Alt)", group: "Entertainment", logo: "https://imglink.cc/cdn/5tDvvUEpWx.png", url: "https://edge2.roarzone.net:8447/roarzone/edge3/sonyaath/index.m3u8" },
  { name: "Sony Pal", group: "Movies", logo: "https://imglink.cc/cdn/859KM3TbQb.jpg", url: "http://maxotts.maxdigitaltv.com/x-media/C64/master.m3u8" },
  // ── STAR SPORTS ────────────────────────────────────────────────────────
  { name: "Star Sports 1", group: "Cricket", featured: true, logo: "https://api.thextribune.com/files/Star_Sports_1_1780987723561_36a255721f2052c6.webp", url: "https://tvsen7.aynaott.com/sspts1/index.m3u8", fallbackUrl: "https://tvsen7.aynaott.com/sspts1/tracks-v1a1/mono.ts.m3u8" },
  { name: "Star Sports 2", group: "Cricket", logo: "https://api.thextribune.com/files/Star_Sports_2_1780987631594_6360914903e9a0b4.webp", url: "https://tvsen7.aynaott.com/sspts1/tracks-v1a1/mono.ts.m3u8" },
  { name: "Star Sports Select 1", group: "Cricket", logo: "https://api.thextribune.com/files/Star_Sports_1_1780987723561_36a255721f2052c6.webp", url: "https://tvsen7.aynaott.com/sspts1/index.m3u8" },
  { name: "Star Sports Select 2", group: "Cricket", logo: "https://api.thextribune.com/files/Star_Sports_2_1780987631594_6360914903e9a0b4.webp", url: "https://tvsen7.aynaott.com/sspts1/tracks-v1a1/mono.ts.m3u8" },
  { name: "Star Movies", group: "Movies", logo: "https://imglink.cc/cdn/Nkj7hqlPz-.jpg", url: "https://edge2.roarzone.net:8447/roarzone/edge3/sony_max/index.m3u8" },
  // Star Gold 103.99.249.139 replaced with edge2.roarzone
  { name: "Star Gold", group: "Movies", logo: "https://imglink.cc/cdn/Nkj7hqlPz-.jpg", url: "https://edge2.roarzone.net:8447/roarzone/edge3/sony_max/index.m3u8" },
  { name: "Star Gold HD", group: "Movies", logo: "https://imglink.cc/cdn/Nkj7hqlPz-.jpg", url: "https://edge2.roarzone.net:8447/roarzone/edge3/sony_max/index.m3u8" },
  { name: "Star Jalsha", group: "Entertainment", logo: "https://imglink.cc/cdn/3TXPVSGzx5.png", url: "https://tyr.zibobdixserver.top/hls/StarJalshaHD.m3u8" },
  // ── TNT / TUDN / TYC ───────────────────────────────────────────────────
  // TNT Sports 27.124.71.27 replaced with tvsen7.aynaott.com
  { name: "TNT Sports 1", group: "Sports", logo: "https://imglink.cc/cdn/VHUi569tAW.jpg", url: "https://tvsen7.aynaott.com/tntsports1/index.m3u8" },
  { name: "TNT Sports 2", group: "Sports", logo: "https://imglink.cc/cdn/VHUi569tAW.jpg", url: "https://tvsen7.aynaott.com/tsn2/index.m3u8" },
  { name: "TNT Sports 3", group: "Sports", logo: "https://imglink.cc/cdn/VHUi569tAW.jpg", url: "https://tvsen7.aynaott.com/tsn3/index.m3u8" },
  // TUDN kept as-is (CDN IPs may be valid); note added
  {
    name: "TUDN HD",
    group: "Football",
    logo: "https://imglink.cc/cdn/Tf3GP8uGY_.jpg",
    url: "http://74.208.30.121/a192/mono.m3u8"
    /* CDN IP — handled by server proxy */
  },
  {
    name: "TUDN 1080",
    group: "Football",
    logo: "https://imglink.cc/cdn/Tf3GP8uGY_.jpg",
    url: "http://162.19.255.233:8080/play/UNbAl57p9hXZClOu56FCTVL9TbgOeYnXUEC2UjoDBYk/m3u8"
    /* CDN IP — handled by server proxy */
  },
  { name: "Tyc Sports", group: "Football", logo: "https://imglink.cc/cdn/1oSRQnyUqK.jpg", url: "https://amg26268-amg26268c14-freelivesports-emea-10267.playouts.now.amagi.tv/ts-us-e2-n2/playlist/amg26268-sportsstudio-tycsports-freelivesportsemea/playlist.m3u8" },
  // ── ESPN / NBC / NFL ───────────────────────────────────────────────────
  { name: "ESPN", group: "Sports", logo: "https://api.thextribune.com/files/ESPN_logos_1780983802775_8df77dbad110dd78.webp", url: "https://tvsen5.aynaott.com/espn/index.m3u8" },
  { name: "ESPN 2", group: "Sports", logo: "https://api.thextribune.com/files/ESPN2_1781171007642_4be7fc1161ab2c9a.webp", url: "https://tv.topmediatv.net:25463/live/TopMediaWeb/bOteTR8ED1/108.m3u8" },
  { name: "NBC Sports", group: "Sports", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjWabO2nlHWoAxSn9_uPyaQ645ZBmkPOojlw&s", url: "https://d1m1xk35ma8qfl.cloudfront.net/master.m3u8" },
  { name: "NFL Network", group: "Sports", logo: "https://upload.wikimedia.org/wikipedia/en/8/8f/NFL_Network_logo.svg", url: "https://tvsen6.aynaott.com/nfl/index.m3u" },
  // ── CRICKET ────────────────────────────────────────────────────────────
  { name: "Willow TV", group: "Cricket", logo: "https://api.thextribune.com/files/willow_tv_1780988155079_6b7fc6d2873b6d40.webp", url: "https://tvsen5.aynaott.com/willowhd/index.m3u8" },
  { name: "Willow HD (KB)", group: "Cricket", logo: "https://imglink.cc/cdn/GGm9H9tLHP.png", url: "https://tvsen5.aynaott.com/willowhd/index.m3u8?e=1779283803&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=2fe7bf4f892cf09f80087b8146545bad" },
  // Willow Cricket 198 replaced with tvsen5.aynaott.com
  { name: "Willow Cricket HD", group: "Cricket", logo: "https://api.thextribune.com/files/willow_tv_1780988155079_6b7fc6d2873b6d40.webp", url: "https://tvsen5.aynaott.com/willowhd/index.m3u8" },
  { name: "Cricket Gold", group: "Cricket", logo: "https://resources.cricket-australia.pulselive.com/cricket-australia/photo/2025/07/25/836eddae-4329-4542-ad17-dcd37e9d951a/Cricket-Gold-1920x1080_noBG.png", url: "https://streams2.sofast.tv/ptnr-yupptv/title-cricketgold/v1/master/611d79b11b77e2f571934fd80ca1413453772ac7/b2048bb8-1686-4432-aa50-647245383e0c/manifest.m3u8" },
  { name: "Cricket Gold (Sofast)", group: "Cricket", logo: "https://resources.cricket-australia.pulselive.com/cricket-australia/photo/2025/07/25/836eddae-4329-4542-ad17-dcd37e9d951a/Cricket-Gold-1920x1080_noBG.png", url: "https://streams2.sofast.tv/ptnr-yupptv/title-cricketgold/v1/manifest/611d79b11b77e2f571934fd80ca1413453772ac7/b2048bb8-1686-4432-aa50-647245383e0c/bfc6a36e-c250-4afe-b6c9-2bc57855bb7d/4.m3u8" },
  { name: "Ten Cricket", group: "Cricket", logo: "https://imglink.cc/cdn/mryDCeXT4-.png", url: "https://edge2.roarzone.net:8447/roarzone/edge3/ten_cricket/tracks-v1a1/mono.m3u8" },
  // Cricbuzz HD (4kgood.org) removed — no reliable public alternative; Ten Cricket used instead
  { name: "DD Sports", group: "Sports", logo: "https://api.thextribune.com/files/Dd_sports_1780988414484_fed130f6f12159fa.webp", url: "https://cdn-6.pishow.tv/live/13/master.m3u8" },
  { name: "PTV Sports", group: "Sports", logo: "https://api.thextribune.com/files/PTV_Sports_1780982355020_753501f76da1c629.webp", url: "https://tvsen5.aynaott.com/PtvSports/tracks-v1a1/mono.ts.m3u8" },
  { name: "PTV Sports (FIFA)", group: "Sports", logo: "https://imglink.cc/cdn/wHhztDDZrU.png", url: "https://tvsen5.aynaott.com/PtvSports/index.m3u8" },
  // PTV 198 replaced with tvsen5.aynaott.com
  { name: "PTV Sports (Alt)", group: "Sports", logo: "https://imglink.cc/cdn/wHhztDDZrU.png", url: "https://tvsen5.aynaott.com/PtvSports/index.m3u8" },
  { name: "A Sports", group: "Cricket", logo: "https://api.thextribune.com/files/A_Sports_1780982491872_aaa48bed5dbfba39.webp", url: "https://tvsen6.aynaott.com/asports/tracks-v1a1/mono.ts.m3u8" },
  { name: "A Sports (Idx)", group: "Cricket", logo: "https://imglink.cc/cdn/d4W6mvjalX.png", url: "https://tvsen6.aynaott.com/asports/index.m3u8" },
  // ── OTHER SPORTS ───────────────────────────────────────────────────────
  { name: "Goal TV", group: "Football", logo: "https://goaltv.ca/static/media/goal-logo-color-1-rgb.84577cb6.png", url: "https://streams2.sofast.tv/sofastplayout/WiseM3U8_1/master.m3u8" },
  { name: "Bahrain Sports", group: "Sports", logo: "https://api.thextribune.com/files/bahrain_1780982042215_7c4691f6ae0f7538.webp", url: "https://5c7b683162943.streamlock.net/live/ngrp:sportsone_all/playlist.m3u8" },
  { name: "Oman Sports", group: "Sports", logo: "https://api.thextribune.com/files/Oman_Sports_1780988321577_4cb1aee2f1a64c69.webp", url: "https://partneta.cdn.mgmlcdn.com/omsport/smil:omsport.stream.smil/chunklist.m3u8" },
  { name: "Eurosport HD", group: "Sports", logo: "https://api.thextribune.com/files/Eurosport_Logo_2015_1780982633700_d9226b548f5d9710.webp", url: "https://stream.ottplus.bd/live/euro_sports_hd_abr/live/euro_sports_hd/chunks.m3u8" },
  // EuroSport 198 replaced with ottplus.bd HTTPS stream
  { name: "EuroSport HD (Alt)", group: "Sports", logo: "https://api.thextribune.com/files/Eurosport_Logo_2015_1780982633700_d9226b548f5d9710.webp", url: "https://stream.ottplus.bd/live/euro_sports_hd_abr/live/euro_sports_hd/chunks.m3u8" },
  { name: "Eurosport HD (mflix)", group: "Sports", logo: "https://api.thextribune.com/files/Eurosport_Logo_2015_1780982633700_d9226b548f5d9710.webp", url: "https://mflixott.com/tv/toffee-by-maruf/live.php?cid=euro_sports_hd&chunks=c80806f436c1995953fd456a97305fa2fe265c1753e879f2f3cb5d5af21175811499f82c1b17d9625643c31f12f76c7cf62bbaa518890be0385214ce665a65f293b18750387d17d31bf12f703fd7ca902112a86c2db3b9dfe09f0d86596d4b0400ac2847ab135be76f8e037e68f9bc7f" },
  { name: "Sports Grid", group: "Sports", logo: "https://mma.prnewswire.com/media/1201691/SportsGrid_Logo.jpg", url: "https://tvsen6.aynaott.com/SportsGrid/index.m3u8" },
  { name: "Talk Sports", group: "Sports", logo: "https://cached.imagescaler.hbpl.co.uk/resize/scaleWidth/743/cached.offlinehbpl.hbpl.co.uk/news/OMC/0AFEAC5D-C49C-2C2D-5C69CB5EA4AEBB0F.jpg", url: "https://tvsen6.aynaott.com/talkSPORT/index.m3u8" },
  // ── TSN ────────────────────────────────────────────────────────────────
  { name: "TSN 1", group: "Sports", logo: "https://images.seeklogo.com/logo-png/31/1/tsn-1-logo-png_seeklogo-314693.png", url: "https://tvsen7.aynaott.com/tsn1/index.m3u8" },
  { name: "TSN 2", group: "Sports", logo: "https://www.start.ca/wp-content/uploads/2022/09/StartTV_ChannelLogos_TheSportsNetwork2.png", url: "https://tvsen7.aynaott.com/tsn2/index.m3u8" },
  { name: "TSN 3", group: "Sports", logo: "https://images.seeklogo.com/logo-png/31/1/tsn-3-logo-png_seeklogo-314924.png", url: "https://tvsen7.aynaott.com/tsn3/index.m3u8" },
  // ── ENTERTAINMENT ──────────────────────────────────────────────────────
  { name: "Zee Bangla", group: "Entertainment", logo: "https://imglink.cc/cdn/qonZADSZua.png", url: "https://tvsen6.aynaott.com/ZeeBangla/index.m3u8" },
  { name: "Colors Bangla", group: "Entertainment", logo: "https://imglink.cc/cdn/oDQ4LN8zlN.png", url: "https://tvsen6.aynaott.com/ColorsBangla/index.m3u8" },
  // Sun Bangla 27.124.71.27 — no known HTTPS public alternative; removed
  { name: "G Series Drama", group: "Entertainment", logo: "https://imglink.cc/cdn/1_dUKmt1Oe.png", url: "https://vods2.aynaott.com/gseriesDrama/tracks-v1a1/mono.ts.m3u8" },
  { name: "SRK TV", group: "Entertainment", logo: "https://imglink.cc/cdn/uZtiXpPz29.png", url: "https://srknowapp.ncare.live/srktvhlswodrm/srktv.stream/playlist.m3u8" },
  // ── MOVIES ─────────────────────────────────────────────────────────────
  // Colors Bangla Cinema 198 replaced with pishow fallback as primary; pishow also in fallbackUrl
  { name: "Colors Bangla Cinema", group: "Movies", logo: "https://imglink.cc/cdn/cScI5tEUjV.png", url: "https://cdn-2.pishow.tv/live/1459/master.m3u8", fallbackUrl: "https://cdn-2.pishow.tv/live/1459/master.m3u8" },
  // Colors Cineplex 198 replaced with pishow
  { name: "Colors Cineplex", group: "Movies", logo: "https://imglink.cc/cdn/cScI5tEUjV.png", url: "https://cdn-2.pishow.tv/live/1461/master.m3u8" },
  { name: "Toffee Movies", group: "Movies", logo: "https://imglink.cc/cdn/r4swBHkSoj.jpg", url: "https://edge2.roarzone.net:8447/roarzone/edge3/toffee_movie/index.m3u8" },
  { name: "Goldmines", group: "Movies", logo: "https://imglink.cc/cdn/E86bN6IAxl.jpg", url: "https://cdn-2.pishow.tv/live/1459/master.m3u8" },
  { name: "Goldmines Movies", group: "Movies", logo: "https://imglink.cc/cdn/E86bN6IAxl.jpg", url: "https://cdn-2.pishow.tv/live/1461/master.m3u8" },
  { name: "Goldmines Bollywood", group: "Movies", logo: "https://imglink.cc/cdn/E86bN6IAxl.jpg", url: "https://tvsen6.aynaott.com/GoldminesBollywood/index.m3u8" },
  { name: "Zee Bangla Cinema", group: "Movies", logo: "https://imglink.cc/cdn/1hT6Uioz_j.jpg", url: "https://edge2.roarzone.net:8447/roarzone/edge3/zee_bangla_cinema/index.m3u8?token=33eb90cb5993505e7adebcdc9fe5a680f5ff40b4-89433e784e249e183a59446474d0fff1-1780020920-1780010120" },
  // Jalsha Movies 198 replaced with edge2.roarzone
  { name: "Jalsha Movies", group: "Movies", logo: "https://imglink.cc/cdn/hEzUhoTW3x.jpg", url: "https://edge2.roarzone.net:8447/roarzone/edge3/sony_max/index.m3u8" },
  { name: "Hindi Classic 24", group: "Movies", logo: "https://imglink.cc/cdn/cScI5tEUjV.png", url: "https://vods2.aynaott.com/hindimovies/index.m3u8" },
  { name: "Action Hollywood", group: "Movies", logo: "https://imglink.cc/cdn/cScI5tEUjV.png", url: "https://cdn-apse1-prod.tsv2.amagi.tv/linear/amg01076-lightningintern-actionhollywood-samsungnz/playlist.m3u8" },
  { name: "Sony Max", group: "Movies", logo: "https://imglink.cc/cdn/4mRBs1A-x_.png", url: "https://edge2.roarzone.net:8447/roarzone/edge3/sony_max/index.m3u8" },
  { name: "Sony Max HD", group: "Movies", logo: "https://imglink.cc/cdn/4mRBs1A-x_.png", url: "https://edge2.roarzone.net:8447/roarzone/edge3/sony_max_hd/index.m3u8" },
  { name: "Sony Max 2", group: "Movies", logo: "https://imglink.cc/cdn/4mRBs1A-x_.png", url: "https://edge2.roarzone.net:8447/roarzone/edge3/sonymax_2/index.m3u8" },
  // Zee Cinema 103.99.249.139 replaced with edge2.roarzone HD (already in file)
  { name: "Zee Cinema", group: "Movies", logo: "https://imglink.cc/cdn/OgzGIdBpSz.png", url: "https://edge2.roarzone.net:8447/roarzone/edge3/zee_cinema_hd/index.m3u8" },
  { name: "Zee Cinema HD", group: "Movies", logo: "https://imglink.cc/cdn/OgzGIdBpSz.png", url: "https://edge2.roarzone.net:8447/roarzone/edge3/zee_cinema_hd/index.m3u8" },
  { name: "& Picture HD", group: "Movies", logo: "https://imglink.cc/cdn/cScI5tEUjV.png", url: "https://edge2.roarzone.net:8447/roarzone/edge3/andpicture_hd/index.m3u8" },
  // ── MUSIC ──────────────────────────────────────────────────────────────
  { name: "Sangeet Bangla", group: "Music", logo: "https://imglink.cc/cdn/LmVOSdl3ku.png", url: "https://cdn-4.pishow.tv/live/1143/master.m3u8" },
  { name: "Party Universe", group: "Music", logo: "https://imglink.cc/cdn/IYDn_LwwiV.png", url: "https://nomawnoijl.gpcdn.net/akash/partyuniverse/chunks.m3u8" },
  // ── CARTOON ────────────────────────────────────────────────────────────
  { name: "Motu Patlu", group: "Cartoon", logo: "https://imglink.cc/cdn/TxPUulKGQh.jpg", url: "https://live20.bozztv.com/giatvplayout7/giatv-209622/tracks-v1a1/mono.ts.m3u8" },
  { name: "Tom & Jerry TV", group: "Cartoon", logo: "https://imglink.cc/cdn/YkXRQgC4-.jpg", url: "https://live20.bozztv.com/giatvplayout7/giatv-208314/tracks-v1a1/mono.ts.m3u8" },
  { name: "Bantul The Great", group: "Cartoon", logo: "https://imglink.cc/cdn/_OIh6UYTpa.jpg", url: "https://live20.bozztv.com/giatvplayout7/giatv-209869/tracks-v1a1/mono.ts.m3u8" },
  { name: "Doraemon TV", group: "Cartoon", logo: "https://imglink.cc/cdn/rmNeL8f6NR.png", url: "https://live20.bozztv.com/giatvplayout7/giatv-209902/tracks-v1a1/mono.ts.m3u8" },
  { name: "Oggy and the Cockroaches", group: "Cartoon", logo: "https://imglink.cc/cdn/cZxNWhHkaZ.jpg", url: "https://live20.bozztv.com/giatvplayout7/giatv-210728/tracks-v1a1/mono.ts.m3u8" },
  { name: "Mr Bean Animated", group: "Cartoon", logo: "https://i.ibb.co.com/XfqV4B56/png-transparent-mr-bean-illustration-youtube-coloring-book-character-cartoon-mr-bean-television-chil.png", url: "https://amg00627-amg00627c29-rakuten-it-3989.playouts.now.amagi.tv/playlist/amg00627-banijayfast-mrbeanitcc-rakutenit/playlist.m3u8" },
  { name: "Cartoon Network", group: "Cartoon", logo: "https://imglink.cc/cdn/48br-Lpr61.png", url: "https://tvsen5.aynaott.com/cartoonnetwork/tracks-v1a1/mono.ts.m3u8" },
  { name: "Gopal Bhar TV", group: "Cartoon", logo: "https://i.ibb.co.com/5xSF5mzh/Gopal-Bhar-animated-TV-series-title-card.jpg", url: "https://live20.bozztv.com/giatvplayout7/giatv-209611/tracks-v1a1/mono.ts.m3u8" },
  { name: "Duronto Live", group: "Cartoon", logo: "https://i.ibb.co.com/Ld3Yw0PH/Duronto-TV.png", url: "https://tvsen6.aynaott.com/durontotv-live/index.m3u8?e=1779283757&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=3da514e08a15c80daed60a18b3f423fa" },
  // ── BANGLADESH ─────────────────────────────────────────────────────────
  { name: "Asian TV", group: "Bangladesh", logo: "https://i.ibb.co.com/mCwss66N/Asian-TV.png", url: "https://mtlivestream.com/hls/asian/ytlive/index.m3u8" },
  { name: "ATN News HD", group: "Bangladesh", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/ATN_News_logo.svg/1280px-ATN_News_logo.svg.png", url: "https://tvsen5.aynaott.com/atnbangla/index.m3u8?e=1779283752&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=e20058ae495a80a83ec09cb9d82b9253" },
  { name: "Ayna TV", group: "Bangladesh", logo: "https://i.ibb.co.com/5hy7S3wB/Ayna-TV.png", url: "https://app24.jagobd.com.bd/c3VydmVyX8RpbEU9Mi8xNy8yMFDEEHGcfRgzQ6NTAgdEoaeFzbF92YWxIZTO0U0ezN1IzMyfvcEdsEfeDeKiNkVN3PTOmdFseWRtaW51aiPhnPTI2/ayna.stream/tracks-v1a1/mono.m3u8" },
  { name: "Ananda TV", group: "Bangladesh", logo: "https://imglink.cc/cdn/ofOLQDCLwk.png", url: "https://tvsen6.aynaott.com/anandatv/index.m3u8?e=1779283759&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=504b9350b4703116ca4ab20e4013288e" },
  { name: "Bangla Vision", group: "Bangladesh", logo: "https://i.ibb.co.com/5X1JmFbF/Bangla-Vision.png", url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1715/output/1715-audio_113452_eng=113200-video=1181200.m3u8" },
  { name: "BTV", group: "Bangladesh", logo: "https://i.ibb.co.com/TXNCpCP/Btv-National.png", url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1709/output/index.m3u8" },
  { name: "Bijoy TV", group: "Bangladesh", logo: "https://i.ibb.co.com/DP1GSwB3/Bijoy-TV.png", url: "https://stream.ottplus.live/live/bijoy_tv_abr/live/bijoy_tv_480/chunks.m3u8" },
  { name: "Boishakhi TV", group: "Bangladesh", logo: "https://i.ibb.co.com/sptqqqj9/Boishakhi-TV.png", url: "https://tvsen6.aynaott.com/boishakhitv/index.m3u8?e=1779283755&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=f3f4ec98ffbd9567c21e8b2ee98e32d5" },
  { name: "Bangla TV", group: "Bangladesh", logo: "https://imglink.cc/cdn/YQ8D9Wf0IT.png", url: "https://tvsen6.aynaott.com/banglatv/index.m3u8?e=1779283758&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=f3e9e2737e35147900c0f4add619ead6" },
  { name: "Channel I", group: "Bangladesh", logo: "https://imglink.cc/cdn/H038J5LwdN.png", url: "https://tvsen6.aynaott.com/channeli/index.m3u8?e=1779283749&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=1d2782c406bc6c9f853716c3dc41a439" },
  { name: "Channel 1 TV", group: "Bangladesh", logo: "https://i.ibb.co.com/N6HbH5rH/Channel-One-TV.png", url: "https://app24.jagobd.com.bd/c3VydmVyX8RpbEU9Mi8xNy8yMFDEEHGcfRgzQ6NTAgdEoaeFzbF92YWxIZTO0U0ezN1IzMyfvcEdsEfeDeKiNkVN3PTOmdFseWRtaW51aiPhnPTI2/channel1bd.stream/tracks-v1a1/mono.m3u8" },
  { name: "Channel 24", group: "Bangladesh", logo: "https://i.ibb.co.com/v65cfQ96/Channel-24.png", url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1703/output/1703-audio_113332_eng=113200-video=2202800.m3u8" },
  { name: "Channel 9 HD", group: "Bangladesh", logo: "https://i.ibb.co.com/Xxrdnxkp/Channel9-HD.png", url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1729/output/1729-audio_113592_eng=113200-video=1181200.m3u8" },
  { name: "Channel S TV", group: "Bangladesh", logo: "https://i.ibb.co.com/Vp2HKT0s/Channel-S-TV.png", url: "https://app.ncare.live/live-orgin/channels.stream/live-orgin/channels.stream/chunks.m3u8" },
  { name: "DBC News", group: "Bangladesh", logo: "https://i.ibb.co.com/TMKLMXs9/DBC-News.png", url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1728/output/index.m3u8" },
  { name: "Deepto TV", group: "Bangladesh", logo: "https://imglink.cc/cdn/2ODX-FAGY4.png", url: "https://byphdgllyk.gpcdn.net/hls/deeptotv/0_1/index.m3u8" },
  { name: "Desh TV", group: "Bangladesh", logo: "https://i.ibb.co.com/fVH9h8Tk/Desh-TV.png", url: "https://tvsen6.aynaott.com/deshtv/tracks-v1a1/mono.ts.m3u8" },
  { name: "Ekhon TV", group: "Bangladesh", logo: "https://i.ibb.co.com/YrDVpDt/Ekhon-Tv.png", url: "https://tvsen6.aynaott.com/ekhontv/tracks-v1a1/mono.ts.m3u8" },
  { name: "Ekattor TV HD", group: "Bangladesh", logo: "https://i.ibb.co.com/DPZrfqzr/Ekattor-TV-HD.png", url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1705/output/1705.m3u8" },
  { name: "Ekushe TV", group: "Bangladesh", logo: "https://i.ibb.co.com/Myscx0rx/Ekushe-TV.png", url: "https://tvsen6.aynaott.com/etv/tracks-v1a1/mono.ts.m3u8" },
  { name: "Global TV", group: "Bangladesh", logo: "https://i.ibb.co.com/Q7Q7X64N/Global-TV.png", url: "https://app24.jagobd.com.bd/c3VydmVyX8RpbEU9Mi8xNy8yMFDEEHGcfRgzQ6NTAgdEoaeFzbF92YWxIZTO0U0ezN1IzMyfvcEdsEfeDeKiNkVN3PTOmdFseWRtaW51aiPhnPTI2/Global-tv.stream/tracks-v1a1/mono.m3u8" },
  { name: "GTV", group: "Bangladesh", logo: "https://i.ibb.co.com/cc5rftrN/Gazi-TV.png", url: "https://app24.jagobd.com.bd/c3VydmVyX8RpbEU9Mi8xNy8yMFDEEHGcfRgzQ6NTAgdEoaeFzbF92YWxIZTO0U0ezN1IzMyfvcEdsEfeDeKiNkVN3PTOmdFseWRtaW51aiPhnPTI2/gazibdz.stream/tracks-v1a1/mono.m3u8" },
  { name: "Independent TV", group: "Bangladesh", logo: "https://e7.pngegg.com/pngimages/500/179/png-clipart-bangladesh-logo-independent-television-television-channel-bd-logo-television-text-thumbnail.png", url: "https://tvsen6.aynaott.com/independenttv/tracks-v1a1/mono.ts.m3u8" },
  { name: "Jago News 24", group: "Bangladesh", logo: "https://i.ibb.co.com/KpRt3cT5/Jago-News-24.png", url: "https://app.ncare.live/live-orgin/jagonews24.stream/live-orgin/jagonews24.stream/chunks.m3u8" },
  { name: "Jamuna TV", group: "Bangladesh", logo: "https://www.jamuna.tv/uploads/settings/default_img_1.jpg", url: "https://tvsen6.aynaott.com/jamunatv/index.m3u8?e=1779283771&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=2592d440f00d65738bd7f6c5158ce486" },
  { name: "Maasranga TV", group: "Bangladesh", logo: "https://i.ibb.co.com/S7c6STRZ/Maasranga-TV.png", url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1722/output/1722.m3u8" },
  { name: "Mohona TV", group: "Bangladesh", logo: "https://i.ibb.co.com/Ndvm37Vr/Mohona-TV.png", url: "https://app24.jagobd.com.bd/c3VydmVyX8RpbEU9Mi8xNy8yMFDEEHGcfRgzQ6NTAgdEoaeFzbF92YWxIZTO0U0ezN1IzMyfvcEdsEfeDeKiNkVN3PTOmdFseWRtaW51aiPhnPTI2/mohonatv.stream/tracks-v1a1/mono.m3u8" },
  { name: "My TV", group: "Bangladesh", logo: "https://imglink.cc/cdn/7T2-k2SePa.png", url: "https://tvsen6.aynaott.com/mytv/index.m3u8?e=1779283760&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=0a2ae0189a44e789d3fecffe5a474ec3" },
  { name: "Movie Bangla", group: "Bangladesh", logo: "https://imglink.cc/cdn/B1Dn0E5UKs.png", url: "https://edge2.roarzone.net:8447/roarzone/edge3/movie_bangla/index.m3u8?token=f1153ce106f107a9c3e37bd2b551e3d0184519c3-cfc48222db91c2002e7fae0d54efda6b-1780020920-1780010118" },
  // Nagorik TV 198 removed — no public alternative available
  { name: "Nexus TV", group: "Bangladesh", logo: "https://i.ibb.co.com/d0hw38JN/Nexus-TV.png", url: "https://tvsen6.aynaott.com/nexustv/tracks-v1a1/mono.ts.m3u8" },
  { name: "News 24", group: "Bangladesh", logo: "https://i.ibb.co.com/gLx9fX5N/News-24.png", url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1708/output/index.m3u8" },
  // News 24 (198) duplicate removed — gpcdn version above is the canonical one
  { name: "NTV", group: "Bangladesh", logo: "https://imglink.cc/cdn/D8KxMc9soN.png", url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1716/output/1716-audio_113462_eng=113200-video=1181200.m3u8" },
  { name: "RTV Live", group: "Bangladesh", logo: "https://imglink.cc/cdn/JZnibxXLfK.png", url: "https://tvsen6.aynaott.com/rtv/tracks-v1a1/mono.ts.m3u8" },
  { name: "Somoy TV", group: "Bangladesh", logo: "https://imglink.cc/cdn/r7W0ZbQHU9.png", url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1702/output/index.m3u8" },
  { name: "Star News", group: "Bangladesh", logo: "https://i.ibb.co.com/cXTjmmtP/Star-News.png", url: "https://owrcovcrpy.gpcdn.net/bpk-tv/1710/output/1710-audio_113402_eng=113200-video=1181200.m3u8" },
  { name: "SA TV", group: "Bangladesh", logo: "https://imglink.cc/cdn/qx2W3uKGsz.png", url: "https://tvsen6.aynaott.com/satv/index.m3u8?e=1779283757&u=78be6644-0a65-48ec-81a4-089ac65a2619&token=336f19de5e4aacae753d7524d86d1a89" },
  { name: "Thikana", group: "Bangladesh", logo: "https://imglink.cc/cdn/rw8iAU9ZcB.jpg", url: "https://5dd3981940faa.streamlock.net:443/thikanatv/thikanatv/playlist.m3u8" },
  // ── NEWS ───────────────────────────────────────────────────────────────
  { name: "Republic Bangla", group: "News", logo: "https://imglink.cc/cdn/ndYg8AR85Y.jpg", url: "https://vg-republictvlive.akamaized.net/v1/manifest/611d79b11b77e2f571934fd80ca1413453772ac7/vglive-sk-456368/06e5afc2-a022-4e51-9131-4e33a6207c5c/1.m3u8" },
  // ── DOCUMENTARY ────────────────────────────────────────────────────────
  // Discovery/Geography/Animal Planet: http private IPs kept — server proxy handles these
  {
    name: "Discovery Bangla",
    group: "Documentary",
    logo: "https://imglink.cc/cdn/mv5xd7yy0d.png",
    url: "http://103.180.212.191:3500/live/573.m3u8"
    /* proxy-handled */
  },
  {
    name: "Discovery Hindi",
    group: "Documentary",
    logo: "https://imglink.cc/cdn/mv5xd7yy0d.png",
    url: "http://103.180.212.191:3500/live/3428.m3u8"
    /* proxy-handled */
  },
  {
    name: "Geography HD",
    group: "Documentary",
    logo: "https://imglink.cc/cdn/eEZmseF3Tb.jpg",
    url: "http://202.70.146.135:8000/play/a05o/index.m3u8"
    /* proxy-handled */
  },
  { name: "Adventure Earth", group: "Documentary", logo: "https://imglink.cc/cdn/eEZmseF3Tb.jpg", url: "https://autentic-adventure-earth-1-eu.rakuten.wurl.tv/playlist.m3u8" },
  { name: "Animal Planet", group: "Documentary", logo: "https://imglink.cc/cdn/ebC033LNf2.png", url: "https://tiger-hub.vercel.app@vodzong.mjunoon.tv:8087/streamtest/Animal-Planet-158-3/playlist.m3u8" },
  // ── FROM brhex_iptv_links.json (verified live streams) ────────────────
  // Sports
  { name: "Somoy TV (Live)", group: "Bangladesh", logo: "https://s3.aynaott.com/storage/ece71c1163a377fbe2d93f9d28c34f60", url: "https://live.thebosstv.com:30443/dwlive/Somoy-TV/playlist.m3u8" },
  { name: "FIFA+ (Samsung)", group: "Football", logo: "https://cdn.plus.fifa.com/images/web/logoFIFA.png", url: "https://c822c659.wurl.com/manifest/f36d25e7e52f1ba8d7e56eb859c636563214f541/U2Ftc3VuZy1pbl9GSUZBUGx1c0VuZ2xpc2hfSExT/a4288c44-0852-418a-874a-6068c1f660a7/2.m3u8" },
  { name: "Telemundo FHD", group: "Football", logo: "https://logosandtypes.com/wp-content/uploads/2020/08/Telemundo.png", url: "https://nbculocallive.akamaized.net/hls/live/2037499/puertorico/stream1/master.m3u8" },
  { name: "T Sports (brhex)", group: "Sports", logo: "https://i.ibb.co.com/mrvT7b6G/T-Sports-HD.png", url: "https://tvsen7.aynaott.com/tsports-hd/index.m3u8" },
  { name: "PTV Sports (brhex)", group: "Sports", logo: "https://api.thextribune.com/files/PTV_Sports_1780982355020_753501f76da1c629.webp", url: "https://tvsen5.aynaott.com/PtvSports/index.m3u8" },
  { name: "beIN Sports 1 (streamhost)", group: "Sports", logo: "https://images.seeklogo.com/logo-png/48/1/bein-sports-1-logo-png_seeklogo-481583.png", url: "https://1nyaler.streamhostingcdn.top/stream/23/index.m3u8" },
  { name: "Win Sports", group: "Sports", logo: "https://diem369.com/cdn/shop/files/win-sports-1698354.png", url: "https://1nyaler.streamhostingcdn.top/stream/32/index.m3u8" },
  { name: "TNT Sports Premium", group: "Sports", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d3/TNT_Sports_logo_2021.png", url: "https://1nyaler.streamhostingcdn.top/stream/30/index.m3u8" },
  { name: "TyC Sports (Amagi)", group: "Football", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/TyC_Sports_logo.svg/960px-TyC_Sports_logo.svg.png", url: "https://amg26268-amg26268c14-freelivesports-emea-10267.playouts.now.amagi.tv/ts-us-e2-n2/playlist/amg26268-sportsstudio-tycsports-freelivesportsemea/playlist.m3u8" },
  { name: "beIN SPORTS XTRA", group: "Sports", logo: "https://i.ibb.co/HT49GPmB/XTRA-2.png", url: "https://bein-xtra-bein.amagi.tv/playlist.m3u8" },
  { name: "beIN XTRA Español", group: "Sports", logo: "https://i.imgur.com/V562tpO.png", url: "https://dc1644a9jazgj.cloudfront.net/beIN_Sports_Xtra_Espanol.m3u8" },
  { name: "ESPN8 The Ocho", group: "Sports", logo: "https://images.fubo.tv/channel-config-ui/station-logos/on-dark/espn_8_the_ocho_bw.png", url: "https://d3b6q2ou5kp8ke.cloudfront.net/ESPNTheOcho.m3u8" },
  { name: "ESPN (brhex)", group: "Sports", logo: "https://s3.aynaott.com/storage/b46df1959322aa48d270a6b163234c76", url: "https://tvsen5.aynaott.com/espn/index.m3u8" },
  { name: "Fox Sports 2 (brhex)", group: "Sports", logo: "https://s3.aynaott.com/storage/da4282cd107cc3d40efadae488b187e5", url: "https://tvsen7.aynaott.com/foxsports2/index.m3u8" },
  { name: "FOX Sports (1080p)", group: "Sports", logo: "", url: "https://d1jzu95oc8fgt3.cloudfront.net/FOX_Sports.m3u8" },
  { name: "DAZN Combat", group: "Sports", logo: "https://i.postimg.cc/VsW3Jsrz/logo-DAZN-Combat.png", url: "https://dazn-combat-rakuten.amagi.tv/hls/amagi_hls_data_rakutenAA-dazn-combat-rakuten/CDN/master.m3u8" },
  { name: "Fox Sports (720p)", group: "Sports", logo: "", url: "https://live-manifest.production-public.tubi.io/live/6035c7fd-efff-4ec7-93dc-aa0c7a58ba47/playlist.m3u8" },
  { name: "CAZE TV Brazil", group: "Football", logo: "https://images.seeklogo.com/logo-png/61/1/cazetv-logo-png_seeklogo-619708.png", url: "https://dfr80qz435crc.cloudfront.net/MNOP/Amagi/Caze/Caze_TV_BR/Caze_TV.m3u8" },
  // News
  { name: "TRT World", group: "News", logo: "https://s3.aynaott.com/storage/f63d4aad95532175f7f44be439f74111", url: "https://tv-trtworld.medya.trt.com.tr/master.m3u8" },
  { name: "NHK World Japan", group: "News", logo: "https://i.imgur.com/Mhw1Ihk.png", url: "https://master.nhkworld.jp/nhkworld-tv/playlist/live.m3u8" },
  { name: "NHK World", group: "News", logo: "https://s3.aynaott.com/storage/d969a37a7e1bbd49449ae092d34f0549", url: "https://tvsen6.aynaott.com/nhkworld/index.m3u8" },
  { name: "SABC News", group: "News", logo: "https://i.imgur.com/H9q3Q9d.png", url: "https://sabconetanw.cdn.mangomolo.com/news/smil:news.stream.smil/chunklist_b250000_t64MjQwcA==.m3u8" },
  { name: "RTVE 24H", group: "News", logo: "https://i.imgur.com/WTDKOoM.png", url: "https://ztnr.rtve.es/ztnr/1694255.m3u8" },
  { name: "ERT News HD", group: "News", logo: "https://i.imgur.com/HXbsPfB.png", url: "https://ert-ucdn.broadpeak-aas.com/bpk-tv/ERTNews/default/index.m3u8" },
  // Bangladesh
  { name: "BTV CTG", group: "Bangladesh", logo: "https://s3.aynaott.com/storage/00da8a07fb26b2fb79359ee535e4c7bc", url: "https://tvsen6.aynaott.com/btvctg/index.m3u8" },
  { name: "BTV Chattogram", group: "Bangladesh", logo: "https://i.imgur.com/hvpyuek.png", url: "https://bozztv.com/rongo/rongo-BTVChattagram/index.m3u8" },
  // Turkey (TRT)
  { name: "TRT 1", group: "News", logo: "https://i.imgur.com/j786OLG.png", url: "https://tv-trt1.medya.trt.com.tr/master.m3u8" },
  { name: "TRT Haber", group: "News", logo: "https://i.imgur.com/OVfo8Ab.png", url: "https://tv-trthaber.medya.trt.com.tr/master.m3u8" },
  // MBC (Middle East)
  { name: "MBC 1", group: "Entertainment", logo: "https://i.imgur.com/CiA3plN.png", url: "https://shd-gcp-live.edgenextcdn.net/live/bitmovin-mbc-1/15cf99af5de54063fdabfefe66adc075/index.m3u8" },
  { name: "MBC 4", group: "Entertainment", logo: "https://i.imgur.com/BcXASJp.png", url: "https://shd-gcp-live.edgenextcdn.net/live/bitmovin-mbc-4/24f134f1cd63db9346439e96b86ca6ed/index.m3u8" },
  { name: "MBC Bollywood", group: "Entertainment", logo: "https://i.imgur.com/TTAGFHG.png", url: "https://shls-mbcbollywood-prod-dub.shahid.net/out/v1/a79c9d7ef2a64a54a64d5c4567b3462a/index.m3u8" },
  { name: "MBC America", group: "Entertainment", logo: "https://i.imgur.com/RRc23ra.png", url: "https://cdn-us-east-prod-ingest-infra-dacast-com.akamaized.net/624ff8f9-db18-da92-4d42-896fa2ff3eb3/source/index.m3u8" },
  // Portugal / RTP
  { name: "RTP 1", group: "Entertainment", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/RTP1_-_Logo_2016.svg/640px-RTP1_-_Logo_2016.svg.png", url: "https://streaming-live.rtp.pt/liverepeater/smil:rtp1HD.smil/playlist.m3u8" },
  { name: "RTP 2", group: "Entertainment", logo: "https://upload.wikimedia.org/wikipedia/en/4/4d/Rtp2_2016_logo.png", url: "https://streaming-live.rtp.pt/liverepeater/rtp2HD.smil/playlist.m3u8" },
  { name: "RTP 3", group: "News", logo: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Rtp3.png", url: "https://streaming-live.rtp.pt/livetvhlsDVR/rtpnHDdvr.smil/playlist.m3u8?DVR=" },
  // SIC Portugal
  { name: "SIC", group: "Entertainment", logo: "https://i.imgur.com/SPMqiDG.png", url: "https://d1zx6l1dn8vaj5.cloudfront.net/out/v1/b89cc37caa6d418eb423cf092a2ef970/index.m3u8" }
];
function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
const DEFAULT_CHANNELS = _raw.map((c, i) => ({
  id: slugify(c.name) + "-" + i.toString(36),
  order: i,
  ...c
}));
const FALLBACK_LOGO = "https://i.ibb.co.com/vnbkF0r/fifa-world-cup-2026-logo-png-seeklogo-665644.png";
const ALL_GROUPS = [
  "Football",
  "Sports",
  "Cricket",
  "Entertainment",
  "Movies",
  "Music",
  "Cartoon",
  "Bangladesh",
  "Documentary",
  "News"
];
const KEY = "wc2026.channels.v4";
function load() {
  if (typeof window === "undefined") return DEFAULT_CHANNELS;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_CHANNELS;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_CHANNELS;
    const savedUrls = new Set(parsed.map((c) => c.url));
    const newDefaults = DEFAULT_CHANNELS.filter((d) => !savedUrls.has(d.url));
    if (newDefaults.length > 0) {
      const merged = [...parsed, ...newDefaults].map((c, i) => ({ ...c, order: i }));
      try {
        localStorage.setItem(KEY, JSON.stringify(merged));
      } catch {
      }
      return merged;
    }
    return parsed;
  } catch {
    return DEFAULT_CHANNELS;
  }
}
function save(channels) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(channels));
    window.dispatchEvent(new CustomEvent("channels:updated"));
  } catch {
  }
}
function useChannels() {
  const [channels, setChannels] = reactExports.useState(() => load());
  reactExports.useEffect(() => {
    const handler = () => setChannels(load());
    window.addEventListener("channels:updated", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("channels:updated", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);
  const update = reactExports.useCallback((next) => {
    const ordered = next.map((c, i) => ({ ...c, order: i }));
    save(ordered);
    setChannels(ordered);
  }, []);
  const upsert = reactExports.useCallback((c) => {
    setChannels((cur) => {
      const idx = cur.findIndex((x) => x.id === c.id);
      const next = idx >= 0 ? cur.map((x) => x.id === c.id ? c : x) : [...cur, c];
      save(next);
      return next;
    });
  }, []);
  const remove = reactExports.useCallback((id) => {
    setChannels((cur) => {
      const next = cur.filter((c) => c.id !== id);
      save(next);
      return next;
    });
  }, []);
  const toggleFeatured = reactExports.useCallback((id) => {
    setChannels((cur) => {
      const next = cur.map((c) => c.id === id ? { ...c, featured: !c.featured } : c);
      save(next);
      return next;
    });
  }, []);
  const reset = reactExports.useCallback(() => {
    save(DEFAULT_CHANNELS);
    setChannels(DEFAULT_CHANNELS);
  }, []);
  const importMany = reactExports.useCallback((incoming) => {
    setChannels((cur) => {
      const byUrl = new Map(cur.map((c) => [c.url, c]));
      for (const inc of incoming) {
        if (!inc.url || !inc.name) continue;
        const id = inc.id || inc.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40) + "-" + Math.random().toString(36).slice(2, 6);
        const group = inc.group || "Sports";
        const logo = inc.logo || "";
        byUrl.set(inc.url, {
          id,
          name: inc.name,
          group,
          logo,
          url: inc.url,
          featured: !!inc.featured,
          order: byUrl.size
        });
      }
      const next = Array.from(byUrl.values()).map((c, i) => ({ ...c, order: i }));
      save(next);
      return next;
    });
  }, []);
  return { channels, update, upsert, remove, toggleFeatured, reset, importMany };
}
function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length === 0) return [];
  const header = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const cells = splitCsvLine(lines[i]);
    const row = {};
    header.forEach((h, idx) => row[h] = (cells[idx] ?? "").trim());
    rows.push({
      name: row["name"],
      group: row["group"] || "Sports",
      logo: row["logo"] || "",
      url: row["url"] || row["m3u8"] || "",
      featured: ["1", "true", "yes"].includes((row["featured"] || "").toLowerCase())
    });
  }
  return rows;
}
function splitCsvLine(line) {
  const out = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQ && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else inQ = !inQ;
    } else if (ch === "," && !inQ) {
      out.push(cur);
      cur = "";
    } else cur += ch;
  }
  out.push(cur);
  return out;
}
export {
  ALL_GROUPS as A,
  FALLBACK_LOGO as F,
  parseCsv as p,
  useChannels as u
};
