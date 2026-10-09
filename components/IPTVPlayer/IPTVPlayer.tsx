'use client';

import React, { useState, useEffect, useRef } from 'react';
import Hls from 'hls.js';
import { X, Play, Square, Loader2, Volume2, VolumeX, Maximize } from 'lucide-react';
import { useMediaStore } from '@/lib/mediaStore';

export interface IPTVChannel {
  id: string;
  name: string;
  group: string;
  logo: string;
  url: string;
}

export const IPTV_CHANNELS: IPTVChannel[] = [
  {
    id: "la_1",
    name: "la 1",
    group: "Generalistas",
    logo: "/images/channels/la1.png",
    url: "https://rtvelivestream.rtve.es/rtvesec/la1/la1_main_dvr.m3u8"
  },
  {
    id: "la_1_hd",
    name: "la 1 hd",
    group: "Generalistas",
    logo: "/images/channels/la1.png",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/414798.m3u8"
  },
  {
    id: "la_2",
    name: "la 2",
    group: "Generalistas",
    logo: "/images/channels/la2.png",
    url: "https://rtvelivestream.rtve.es/rtvesec/la2/la2_main.m3u8"
  },
  {
    id: "antena_3",
    name: "antena 3",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=antena3.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/414792.m3u8"
  },
  {
    id: "antena_3_op_2",
    name: "antena 3 op 2",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=antena3.com",
    url: "http://179.60.224.196:8000/play/a0f2/index.m3u8"
  },
  {
    id: "la_4",
    name: "la 4",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=cuatro.com",
    url: "https://cdn.jsdelivr.net/gh/FreakinGuns/listacanalestdtiptv@main/manifests/cuatro.mpd"
  },
  {
    id: "telecinco",
    name: "Telecinco",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=telecinco.es",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/414787.m3u8"
  },
  {
    id: "la_sexta",
    name: "la sexta",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=lasexta.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/414783.m3u8"
  },
  {
    id: "telemadrid",
    name: "Telemadrid",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=telemadrid.es",
    url: "https://live.telemadrid.cross-media.es/6389770581112/eu-central-1/6416060453001/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJob3N0IjoiajI5YjgyLmVncmVzcy5haGc3NmwiLCJhY2NvdW50X2lkIjoiNjQxNjA2MDQ1MzAwMSIsImVobiI6ImxpdmUudGVsZW1hZHJpZC5jcm9zcy1tZWRpYS5lcyIsImlzcyI6ImJsaXZlLXBsYXliYWNrLXNvdXJjZS1hcGkiLCJzdWIiOiJwYXRobWFwdG9rZW4iLCJhdWQiOlsiNjQxNjA2MDQ1MzAwMSJdLCJqdGkiOiI2Mzg5NzcwNTgxMTEyIn0.kqriAMUkHT6m0V6wkCHJum_EUyL4PAi1zJMKlfmYHEU/playlist-hls.m3u8"
  },
  {
    id: "odisea_4k",
    name: "Odisea 4k",
    group: "Generalistas",
    logo: "/images/channels/odisea.png",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/414730.m3u8"
  },
  {
    id: "discovery",
    name: "Discovery",
    group: "Documentales",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=discovery.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/414734.m3u8"
  },
  {
    id: "national_geographic_wild",
    name: "National Geographic Wild",
    group: "Documentales",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=nationalgeographic.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/414737.m3u8"
  },
  {
    id: "national_geographic",
    name: "National Geographic",
    group: "Documentales",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=nationalgeographic.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/414739.m3u8"
  },
  {
    id: "history_channel",
    name: "History Channel",
    group: "Documentales",
    logo: "/images/channels/history.webp",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/414741.m3u8"
  },
  {
    id: "nickelodeon",
    name: "Nickelodeon",
    group: "Entretenimiento 24/7",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/414712.m3u8"
  },
  {
    id: "sudance_tv",
    name: "Sudance TV",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/414698.m3u8"
  },
  {
    id: "mtv",
    name: "MTV",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/414696.m3u8"
  },
  {
    id: "movistas_plus",
    name: "Movistas Plus",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/414775.m3u8"
  },
  {
    id: "24_horas",
    name: "24 horas",
    group: "Noticias",
    logo: "/images/channels/24h.png",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/414778.m3u8"
  },
  {
    id: "movistar_originales",
    name: "Movistar Originales",
    group: "Cine y Series",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=movistar.es",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/414804.m3u8"
  },
  {
    id: "futbol_es",
    name: "Futbol ES",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/1328682.m3u8"
  },
  {
    id: "dazn",
    name: "DAZN",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/1328692.m3u8"
  },
  {
    id: "veo_7",
    name: "VEO 7",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/1328737.m3u8"
  },
  {
    id: "movistar_baloncesto_2",
    name: "Movistar Baloncesto 2",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=movistar.es",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/750204.m3u8"
  },
  {
    id: "espn_premium_2",
    name: "ESPN PREMIUM 2",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=espn.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/591998.m3u8"
  },
  {
    id: "espn_premium_arg",
    name: "ESPN PREMIUM ARG",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=espn.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/591997.m3u8"
  },
  {
    id: "espn_7",
    name: "ESPN 7",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=espn.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/591996.m3u8"
  },
  {
    id: "espn_6",
    name: "ESPN 6",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=espn.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/591995.m3u8"
  },
  {
    id: "espn_5",
    name: "ESPN 5",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=espn.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/591994.m3u8"
  },
  {
    id: "espn_4",
    name: "ESPN 4",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=espn.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/591991.m3u8"
  },
  {
    id: "espn_4_arg",
    name: "ESPN 4 ARG",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=espn.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/591990.m3u8"
  },
  {
    id: "espn_3",
    name: "ESPN 3",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=espn.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/591989.m3u8"
  },
  {
    id: "espn_2",
    name: "ESPN 2",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=espn.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/591984.m3u8"
  },
  {
    id: "espn_2_espa_a",
    name: "ESPN 2 ESPAÑA",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=espn.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/591980.m3u8"
  },
  {
    id: "espn_mex",
    name: "ESPN MEX",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=espn.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/591978.m3u8"
  },
  {
    id: "espn_espa_a",
    name: "ESPN ESPAÑA",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=espn.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/591977.m3u8"
  },
  {
    id: "sport_center",
    name: "SPORT CENTER",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/591976.m3u8"
  },
  {
    id: "espn_deportes",
    name: "ESPN DEPORTES",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=espn.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/591971.m3u8"
  },
  {
    id: "cinema",
    name: "CINEMA",
    group: "Cine y Series",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46102.m3u8"
  },
  {
    id: "a3s",
    name: "A3S",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46097.m3u8"
  },
  {
    id: "axn",
    name: "AXN",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46093.m3u8"
  },
  {
    id: "amc_fhd",
    name: "AMC FHD",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46092.m3u8"
  },
  {
    id: "amc_hd",
    name: "AMC HD",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46089.m3u8"
  },
  {
    id: "a_e",
    name: "A&E",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46087.m3u8"
  },
  {
    id: "cine_latino",
    name: "CINE LATINO",
    group: "Cine y Series",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46106.m3u8"
  },
  {
    id: "cine_canal_arg",
    name: "CINE CANAL ARG",
    group: "Cine y Series",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46107.m3u8"
  },
  {
    id: "cine_canal_hd_ch",
    name: "CINE CANAL HD CH",
    group: "Cine y Series",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46109.m3u8"
  },
  {
    id: "cinemax_op_1",
    name: "CINEMAX OP 1",
    group: "Cine y Series",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46111.m3u8"
  },
  {
    id: "cinemax_op_2",
    name: "CINEMAX OP 2",
    group: "Cine y Series",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46112.m3u8"
  },
  {
    id: "cinemax_op_3",
    name: "CINEMAX OP 3",
    group: "Cine y Series",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46114.m3u8"
  },
  {
    id: "dhe",
    name: "DHE",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46123.m3u8"
  },
  {
    id: "fx",
    name: "FX",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46130.m3u8"
  },
  {
    id: "golden",
    name: "GOLDEN",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46138.m3u8"
  },
  {
    id: "golden_edge",
    name: "GOLDEN EDGE",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46139.m3u8"
  },
  {
    id: "golden_mex",
    name: "GOLDEN MEX",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46142.m3u8"
  },
  {
    id: "hbo",
    name: "HBO",
    group: "Cine y Series",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=hbo.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46147.m3u8"
  },
  {
    id: "hbo_2",
    name: "HBO 2",
    group: "Cine y Series",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=hbo.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46148.m3u8"
  },
  {
    id: "hbo_2_dtv",
    name: "HBO 2 DTV",
    group: "Cine y Series",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=hbo.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46149.m3u8"
  },
  {
    id: "hbo_xtrem",
    name: "HBO XTREM",
    group: "Cine y Series",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=hbo.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46150.m3u8"
  },
  {
    id: "hbo_family",
    name: "HBO FAMILY",
    group: "Cine y Series",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=hbo.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46154.m3u8"
  },
  {
    id: "hbo_plus",
    name: "HBO PLUS",
    group: "Cine y Series",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=hbo.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46156.m3u8"
  },
  {
    id: "hbo_signature",
    name: "HBO SIGNATURE",
    group: "Cine y Series",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=hbo.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46163.m3u8"
  },
  {
    id: "multi_premier",
    name: "MULTI PREMIER",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46169.m3u8"
  },
  {
    id: "paramount_channel_hd",
    name: "PARAMOUNT CHANNEL HD",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46171.m3u8"
  },
  {
    id: "sonny_movies",
    name: "SONNY MOVIES",
    group: "Cine y Series",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46175.m3u8"
  },
  {
    id: "sony_channel",
    name: "SONY CHANNEL",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46176.m3u8"
  },
  {
    id: "sony_channel_hd",
    name: "SONY CHANNEL HD",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46177.m3u8"
  },
  {
    id: "space",
    name: "SPACE",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46180.m3u8"
  },
  {
    id: "star_channel",
    name: "STAR CHANNEL",
    group: "Cine y Series",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46186.m3u8"
  },
  {
    id: "star_chanel_sd",
    name: "STAR CHANEL SD",
    group: "Cine y Series",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46189.m3u8"
  },
  {
    id: "studio_universal",
    name: "STUDIO UNIVERSAL",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46220.m3u8"
  },
  {
    id: "studio_universal_hd",
    name: "STUDIO UNIVERSAL HD",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46223.m3u8"
  },
  {
    id: "syfy",
    name: "SYFY",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46224.m3u8"
  },
  {
    id: "tnt_novelas",
    name: "TNT NOVELAS",
    group: "Cine y Series",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tnt.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46227.m3u8"
  },
  {
    id: "tcm_hd",
    name: "TCM HD",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46231.m3u8"
  },
  {
    id: "tlc_series",
    name: "TLC SERIES",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46233.m3u8"
  },
  {
    id: "tnt_tv_hd",
    name: "TNT TV HD",
    group: "Cine y Series",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tnt.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46237.m3u8"
  },
  {
    id: "tnt_fhd",
    name: "TNT FHD",
    group: "Cine y Series",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tnt.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46239.m3u8"
  },
  {
    id: "tnt_series",
    name: "TNT SERIES",
    group: "Cine y Series",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tnt.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46240.m3u8"
  },
  {
    id: "universal_tv",
    name: "UNIVERSAL TV",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46245.m3u8"
  },
  {
    id: "warner_tv",
    name: "WARNER TV",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46248.m3u8"
  },
  {
    id: "warner_hd",
    name: "WARNER HD",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46249.m3u8"
  },
  {
    id: "warner_fhd",
    name: "WARNER FHD",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46250.m3u8"
  },
  {
    id: "mlb_network_zone_usa",
    name: "MLB NETWORK ZONE USA",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/1719064.m3u8"
  },
  {
    id: "wapa_deportes_puerto_rico",
    name: "WAPA DEPORTES PUERTO RICO",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/19848.m3u8"
  },
  {
    id: "noticentro",
    name: "NOTICENTRO",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/19847.m3u8"
  },
  {
    id: "mega_tv",
    name: "MEGA TV",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/19849.m3u8"
  },
  {
    id: "telemundo_puerto_rico",
    name: "TELEMUNDO PUERTO RICO",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/19851.m3u8"
  },
  {
    id: "punto_2_puerto_rico",
    name: "PUNTO 2 PUERTO RICO",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/19853.m3u8"
  },
  {
    id: "movistar_baloncesto",
    name: "Movistar Baloncesto",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=movistar.es",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/750197.m3u8"
  },
  {
    id: "directtv_sport_fight",
    name: "Directtv Sport Fight",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/149275.m3u8"
  },
  {
    id: "ufc_fight_pass",
    name: "UFC Fight Pass",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/149276.m3u8"
  },
  {
    id: "tyc_sports",
    name: "TYC Sports",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/712754.m3u8"
  },
  {
    id: "fox_sports_3",
    name: "FOX Sports 3",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=foxsports.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/712750.m3u8"
  },
  {
    id: "fox_sports_2",
    name: "FOX Sports 2",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=foxsports.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/712749.m3u8"
  },
  {
    id: "fox_sports",
    name: "FOX Sports",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=foxsports.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/712748.m3u8"
  },
  {
    id: "espn_premium",
    name: "ESPN Premium",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=espn.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/712747.m3u8"
  },
  {
    id: "espn_4",
    name: "ESPN 4",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=espn.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/712746.m3u8"
  },
  {
    id: "espn_3",
    name: "ESPN 3",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=espn.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/712745.m3u8"
  },
  {
    id: "espn_2",
    name: "ESPN 2",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=espn.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/712744.m3u8"
  },
  {
    id: "espn",
    name: "ESPN",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=espn.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/712743.m3u8"
  },
  {
    id: "depor_tv",
    name: "DEPOR TV",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/712742.m3u8"
  },
  {
    id: "bein_sports",
    name: "BEIN SPORTS",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/592013.m3u8"
  },
  {
    id: "fox_deporte",
    name: "FOX DEPORTE",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=foxsports.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/592015.m3u8"
  },
  {
    id: "tudn",
    name: "TUDN",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/592018.m3u8"
  },
  {
    id: "fox_premium",
    name: "FOX PREMIUM",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=foxsports.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/592012.m3u8"
  },
  {
    id: "fox_sport_3",
    name: "FOX SPORT 3",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=foxsports.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/592011.m3u8"
  },
  {
    id: "fox_3",
    name: "FOX 3",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=foxsports.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/592009.m3u8"
  },
  {
    id: "fox_2",
    name: "FOX 2",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=foxsports.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/592005.m3u8"
  },
  {
    id: "fox_sports_mexico",
    name: "FOX SPORTS MEXICO",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=foxsports.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/592003.m3u8"
  },
  {
    id: "fox_sport_argen",
    name: "FOX SPORT ARGEN",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=foxsports.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/592000.m3u8"
  },
  {
    id: "direct_sports",
    name: "Direct Sports",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/417199.m3u8"
  },
  {
    id: "latina_noticias",
    name: "Latina Noticias",
    group: "Noticias",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/9475.m3u8"
  },
  {
    id: "america_tv",
    name: "America Tv",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/9477.m3u8"
  },
  {
    id: "panamericana_tv",
    name: "Panamericana TV",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/9481.m3u8"
  },
  {
    id: "atv_hd_directo",
    name: "ATV HD Directo",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/9482.m3u8"
  },
  {
    id: "rpp",
    name: "RPP",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/9493.m3u8"
  },
  {
    id: "movistar_deportes",
    name: "Movistar Deportes",
    group: "Cine y Series",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=movistar.es",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/9466.m3u8"
  },
  {
    id: "movistar_plus",
    name: "Movistar Plus",
    group: "Cine y Series",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=movistar.es",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/9468.m3u8"
  },
  {
    id: "g",
    name: "G",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/9499.m3u8"
  },
  {
    id: "el_9_argentina",
    name: "EL 9 Argentina",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/712709.m3u8"
  },
  {
    id: "cr_nica_tv",
    name: "Crónica TV",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/712707.m3u8"
  },
  {
    id: "c5n",
    name: "C5N",
    group: "Noticias",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/712705.m3u8"
  },
  {
    id: "america_tv_arg",
    name: "AMERICA TV ARG",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/712704.m3u8"
  },
  {
    id: "el_trece_arg",
    name: "EL TRECE ARG",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/712711.m3u8"
  },
  {
    id: "telefe",
    name: "Telefe",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/712715.m3u8"
  },
  {
    id: "tn_noticias",
    name: "TN NOTICIAS",
    group: "Noticias",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/712718.m3u8"
  },
  {
    id: "tv_publica_arg",
    name: "TV Publica Arg",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/712719.m3u8"
  },
  {
    id: "canal_26",
    name: "Canal 26",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/712725.m3u8"
  },
  {
    id: "chile_visi_n",
    name: "Chile Visión",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/9827.m3u8"
  },
  {
    id: "mega_noticias",
    name: "Mega Noticias",
    group: "Noticias",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/9824.m3u8"
  },
  {
    id: "tv_chile",
    name: "TV Chile",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/9820.m3u8"
  },
  {
    id: "canal_13_chile",
    name: "Canal 13 Chile",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/33118.m3u8"
  },
  {
    id: "la_red_chile",
    name: "La Red Chile",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/33117.m3u8"
  },
  {
    id: "rcn_noticias_colombia",
    name: "RCN Noticias Colombia",
    group: "Noticias",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/13782.m3u8"
  },
  {
    id: "caracol_internacional",
    name: "Caracol Internacional",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/13778.m3u8"
  },
  {
    id: "rcn_internacional",
    name: "RCN Internacional",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/13783.m3u8"
  },
  {
    id: "rcn",
    name: "RCN",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/1331813.m3u8"
  },
  {
    id: "city_tv",
    name: "City Tv",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/1331820.m3u8"
  },
  {
    id: "capital_colombia",
    name: "Capital Colombia",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/1331822.m3u8"
  },
  {
    id: "la_kalle_colombia_musica",
    name: "La Kalle Colombia Musica",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/1331824.m3u8"
  },
  {
    id: "ntn24",
    name: "NTN24",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/1331825.m3u8"
  },
  {
    id: "red_noticias",
    name: "RED Noticias",
    group: "Noticias",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/1331827.m3u8"
  },
  {
    id: "amc_series",
    name: "AMC Series",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/79064.m3u8"
  },
  {
    id: "gourmet",
    name: "Gourmet",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/79061.m3u8"
  },
  {
    id: "gourmet_latino",
    name: "Gourmet Latino",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/79060.m3u8"
  },
  {
    id: "comedy_central",
    name: "Comedy Central",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/79058.m3u8"
  },
  {
    id: "tlc",
    name: "TLC",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/79071.m3u8"
  },
  {
    id: "todo_novelas",
    name: "Todo Novelas",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/79074.m3u8"
  },
  {
    id: "telenovelas",
    name: "Telenovelas",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/79075.m3u8"
  },
  {
    id: "univisi_n",
    name: "Univisión",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/254506.m3u8"
  },
  {
    id: "unimas",
    name: "UniMas",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/254505.m3u8"
  },
  {
    id: "telemundo_dallas",
    name: "Telemundo Dallas",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/254502.m3u8"
  },
  {
    id: "univisi_n_mex",
    name: "Univisión Mex",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/254501.m3u8"
  },
  {
    id: "gala_visi_n",
    name: "Gala Visión",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/254494.m3u8"
  },
  {
    id: "vix",
    name: "VIX",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/79079.m3u8"
  },
  {
    id: "dw_noticias",
    name: "DW Noticias",
    group: "Noticias",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/79084.m3u8"
  },
  {
    id: "cnn_en_espa_ol",
    name: "CNN en Español",
    group: "Noticias",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=cnn.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/79088.m3u8"
  },
  {
    id: "cnn_chile",
    name: "CNN Chile",
    group: "Noticias",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=cnn.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/79090.m3u8"
  },
  {
    id: "cnn_usa",
    name: "CNN USA",
    group: "Noticias",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=cnn.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/597240.m3u8"
  },
  {
    id: "abc_news_live",
    name: "ABC News Live",
    group: "Noticias",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/597256.m3u8"
  },
  {
    id: "fox_news",
    name: "FOX News",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=foxsports.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/597235.m3u8"
  },
  {
    id: "msnbc",
    name: "MSNBC",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/597233.m3u8"
  },
  {
    id: "new12_new_jersey",
    name: "New12 New Jersey",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/597230.m3u8"
  },
  {
    id: "news_12_the_bronx",
    name: "News 12 The Bronx",
    group: "Noticias",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/597229.m3u8"
  },
  {
    id: "news_max",
    name: "NEWS MAX",
    group: "Noticias",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/597227.m3u8"
  },
  {
    id: "one_america_news_hd",
    name: "One America News HD",
    group: "Noticias",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/597225.m3u8"
  },
  {
    id: "cheddar_news_fhd",
    name: "Cheddar News FHD",
    group: "Noticias",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/597244.m3u8"
  },
  {
    id: "alf_24_7",
    name: "ALF 24/7",
    group: "Entretenimiento 24/7",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/783515.m3u8"
  },
  {
    id: "los_simpson_24_7",
    name: "Los Simpson 24/7",
    group: "Entretenimiento 24/7",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=fox.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/575761.m3u8"
  },
  {
    id: "los_simpson_hd",
    name: "Los Simpson HD",
    group: "Entretenimiento 24/7",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=fox.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/575762.m3u8"
  },
  {
    id: "transformes_24_7",
    name: "Transformes 24/7",
    group: "Entretenimiento 24/7",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/428517.m3u8"
  },
  {
    id: "los_4_fantasticos_24_7",
    name: "Los 4 Fantasticos 24/7",
    group: "Entretenimiento 24/7",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/428519.m3u8"
  },
  {
    id: "caballeros_del_zodiaco_24_7",
    name: "Caballeros del zodiaco 24/7",
    group: "Entretenimiento 24/7",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/428557.m3u8"
  },
  {
    id: "el_pr_ncipe_del_rap",
    name: "El príncipe del Rap",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/575737.m3u8"
  },
  {
    id: "friends_24_7",
    name: "Friends 24/7",
    group: "Entretenimiento 24/7",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/575738.m3u8"
  },
  {
    id: "pablo_escobar_24_7",
    name: "Pablo Escobar 24/7",
    group: "Entretenimiento 24/7",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/575741.m3u8"
  },
  {
    id: "el_origen_extraparanormal",
    name: "El Origen Extraparanormal",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/575742.m3u8"
  },
  {
    id: "hechizada_24_7",
    name: "Hechizada 24/7",
    group: "Entretenimiento 24/7",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/575745.m3u8"
  },
  {
    id: "jhonny_bravo_24_7",
    name: "Jhonny Bravo 24/7",
    group: "Entretenimiento 24/7",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/575747.m3u8"
  },
  {
    id: "la_casa_de_papel",
    name: "La Casa De Papel",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/575750.m3u8"
  },
  {
    id: "la_pantera_rosa",
    name: "La Pantera Rosa",
    group: "Entretenimiento 24/7",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/575754.m3u8"
  },
  {
    id: "los_thubder_cats_24_7",
    name: "Los Thubder Cats 24/7",
    group: "Entretenimiento 24/7",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/575764.m3u8"
  },
  {
    id: "pok_mon_24_7",
    name: "Pokémon 24/7",
    group: "Entretenimiento 24/7",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/575769.m3u8"
  },
  {
    id: "el_chavo_del_8",
    name: "El Chavo del 8",
    group: "Entretenimiento 24/7",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/575793.m3u8"
  },
  {
    id: "la_familia_monster_24_7",
    name: "La Familia Monster 24/7",
    group: "Entretenimiento 24/7",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/575795.m3u8"
  },
  {
    id: "el_chiringuito",
    name: "el chiringuito",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "https://euc13.playlist.ttvnw.net/v1/playlist/CqcFbxAmNmaCD4Pi64HtzFN8ywq9AUYAtRgw1kyAPkOz_qeJN9kN_2zMjGGM7DHiOMHZEJkj9SXu0_DpJMegGBg09bzV9g2kXWnhoiCts4hYbD2ESYPY1x49XGdlLRUm9dLWNMwkySN95EZVESWmpFdypD2alV-Er_LBy5VBhdtggLIC66ZRUxHkdNnJdbgxkQOlkPP5EGxT85nmjHKXrFVYrFV7Sl6dTdYuDJFPf1pRoPEJYvDW_IcTWqpXSKZ4hrHooeN3K7abIQTqVZyXZi_5JohCSck1rF8qKrmrbcOfug3aToRq2w9dr1Ti99kuo8gQTXzUHowgvXgkbdGJkJrjJUoLwW8MCExj3daxuimBC6CbLmN3kgi694Epc_kyEnW9Fy34_7pJn_9cVXH2ZHtsb0BIloRZe3eqcgc95U2TFZGX9ZOrwy4LVvM1B6g076t9twdMm_Eb_JnluurjqLtHpdhT0lkQKQ8Px-X5VjZELI_tLN7DD8JPDXNJ1ebgHY5UQ937K7SZ4pGJjDPXTjrLIVNrEU4910cxT_j7gpRbiRu1NKDhaYWGXnI32nMGO0CWvYVcCrbb-4h2SesYJB3Zy4WlJ1TXdP2PIW9pCmufoxKtVcQpSH6v9oBYgmrEpShzgUR7L0RTeqNVVnIZ85ZMCaVxmnDCIwNI9QYAJp1NhpalLWKxK7MroU0GzVvKzQ1pVg_vIcNW0hlVwiXNpOanzt8o3GcdJyP_d9M6Tud9NGiXEtaIoo5qwDvOCZQmnC7nzoemUK3XQozlLdsc2JqJznVGHNTb__UdmprgtUSgzfHLtNLnR6eo5-pWMQEuuaK0w2FJ4nrswN-qdbAVIBP4nC6we_9czPerbno8Tc19nCB2ZPQX83ZeAfIRa7Q6693CdybVE4OMlxoMsaW-XV-Mlb_jQgdyIAEqCWV1LXdlc3QtMjCjEA.m3u8"
  }
];

interface IPTVPlayerProps {
  onClose: () => void;
}

export const IPTVPlayer: React.FC<IPTVPlayerProps> = ({ onClose }) => {
  const [activeChannel, setActiveChannel] = useState<IPTVChannel>(IPTV_CHANNELS[2]); // Default Antena 3 or Telecinco
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const { setActiveMedia } = useMediaStore();

  useEffect(() => {
    setActiveMedia('iptv');
  }, [setActiveMedia]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const initPlayer = () => {
      setIsLoading(true);
      setHasError(false);
      
      const proxyUrl = `/api/proxy?url=${encodeURIComponent(activeChannel.url)}`;

      if (Hls.isSupported()) {
        if (hlsRef.current) {
          hlsRef.current.destroy();
        }
        
        const hls = new Hls({
          enableWorker: true,
        });
        
        hlsRef.current = hls;
        
        hls.loadSource(proxyUrl);
        hls.attachMedia(video);
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setIsLoading(false);
          video.play().catch(() => setIsPlaying(false));
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            setHasError(true);
            setIsLoading(false);
            console.error("HLS Fatal Error:", data);
            // Optionally, we could show the error type on screen:
            // setErrorMsg(data.type + ' : ' + data.details);
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // For Safari
        video.src = proxyUrl;
        video.addEventListener('loadedmetadata', () => {
          setIsLoading(false);
          video.play().catch(() => setIsPlaying(false));
        });
        video.addEventListener('error', () => {
          setHasError(true);
          setIsLoading(false);
        });
      }
    };

    initPlayer();

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [activeChannel]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
      setActiveMedia('iptv');
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const requestFullscreen = () => {
    if (videoRef.current?.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  // Premium Charcoal/Pink Theme (matching the radio)
  const theme = {
    bgApp: 'bg-[#140A0E]',
    headerBg: 'bg-[#0A0507]/95',
    borderColor: 'border-[#E0457B]/20',
    cardInner: 'bg-[#1E0F15]',
    cardOuter: 'bg-[#0A0507]/90',
    cardCenterOuter: 'bg-[#E0457B]/15',
    btnBg: 'bg-[#211117]',
    btnHover: 'hover:bg-[#E0457B]',
    btnTextHover: 'hover:text-white',
    accent: 'text-[#E0457B]',
  };

  return (
    <div className={`fixed inset-0 z-[10000] flex flex-col ${theme.bgApp} text-white animate-in fade-in duration-300`} data-lenis-prevent>
      {/* HEADER */}
      <header className={`flex items-center justify-between px-6 py-4 ${theme.headerBg} border-b ${theme.borderColor} shadow-lg z-10`}>
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-[36px] h-[36px] rounded-full bg-gradient-to-br from-[#E0457B] to-[#A3285C] shadow-[0_0_15px_rgba(224,69,123,0.4)]">
            <span className="font-bodoni font-bold text-white text-lg">T</span>
          </div>
          <div>
            <h2 className="font-panchang text-sm tracking-[0.2em] uppercase text-white/90">Noticias en Vivo</h2>
            <p className="font-satoshi text-[10px] tracking-[0.1em] text-white/50 uppercase">TV HD Stream</p>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className={`w-10 h-10 rounded-full ${theme.btnBg} border ${theme.borderColor} flex items-center justify-center ${theme.btnHover} ${theme.btnTextHover} transition-all shadow-sm cursor-pointer hover:scale-105 active:scale-95`}
          title="Cerrar IPTV"
        >
          <X size={18} />
        </button>
      </header>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* VIDEO PLAYER AREA */}
        <div className="flex-1 flex flex-col relative bg-black">
          <div className="relative flex-1 w-full flex items-center justify-center group overflow-hidden">
            {isLoading && !hasError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-10">
                <Loader2 className={`w-10 h-10 ${theme.accent} animate-spin mb-4`} />
                <span className="font-satoshi text-xs tracking-widest uppercase text-white/70">Conectando...</span>
              </div>
            )}
            
            {hasError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#140A0E] z-10 px-6 text-center">
                <div className="w-16 h-16 rounded-full bg-red-900/30 flex items-center justify-center mb-4">
                  <Square className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="font-panchang text-sm tracking-widest text-white/90 mb-2">Error de Reproducción</h3>
                <p className="font-satoshi text-xs text-white/50 max-w-md">No se puede decodificar el video de {activeChannel.name}. Formato incompatible o protegido (HEVC/MPEG2).</p>
                {/* <p className="font-mono text-[9px] mt-4 text-red-400 opacity-50 break-all">{errorDetails}</p> */}
              </div>
            )}

            <video
              ref={videoRef}
              className="w-full h-full object-contain bg-black"
              autoPlay
              playsInline
              muted={isMuted}
              onClick={togglePlay}
            />

            {/* OSD (On Screen Display) - Shows on hover */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button onClick={togglePlay} className={`w-12 h-12 rounded-full bg-[#E0457B] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-[0_0_20px_rgba(224,69,123,0.4)]`}>
                    {isPlaying ? <Square size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
                  </button>
                  <div>
                    <h3 className="font-panchang text-base uppercase tracking-wider">{activeChannel.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                      </span>
                      <span className="font-satoshi text-[10px] text-white/70 tracking-widest uppercase">En Directo</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button onClick={toggleMute} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center transition-colors">
                    {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </button>
                  <button onClick={requestFullscreen} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center transition-colors">
                    <Maximize size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CHANNEL LIST SIDEBAR (Desktop) / BOTTOM BAR (Mobile) */}
        <div className={`w-full md:w-80 lg:w-96 flex-shrink-0 ${theme.bgApp} border-t md:border-t-0 md:border-l ${theme.borderColor} flex flex-col h-[40vh] md:h-full`}>
          <div className={`px-6 py-4 border-b ${theme.borderColor} bg-black/20`}>
            <h3 className="font-satoshi text-xs font-bold tracking-[0.2em] uppercase text-white/70">Canales Disponibles</h3>
          </div>
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-2 custom-scrollbar" data-lenis-prevent>
            {IPTV_CHANNELS.map((channel) => {
              const isActive = activeChannel.id === channel.id;
              return (
                <button
                  key={channel.id}
                  onClick={() => setActiveChannel(channel)}
                  className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 border ${
                    isActive 
                      ? 'bg-[#E0457B]/20 border-[#E0457B]/50 shadow-[0_0_15px_rgba(224,69,123,0.15)]' 
                      : `${theme.cardInner} ${theme.borderColor} hover:bg-white/5 hover:border-white/20`
                  }`}
                >
                  <div className="w-14 h-14 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0 p-2">
                    <img src={channel.logo} alt={channel.name} className="max-w-full max-h-full object-contain drop-shadow-md" />
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className={`font-satoshi font-bold text-sm tracking-wide ${isActive ? 'text-white' : 'text-white/80'}`}>{channel.name}</h4>
                    <span className="font-satoshi text-[10px] text-white/40 uppercase tracking-wider">{channel.group}</span>
                  </div>
                  {isActive && (
                    <div className="flex flex-col items-center gap-1 opacity-80">
                      <div className="w-1 h-1 bg-[#E0457B] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1 h-1 bg-[#E0457B] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1 h-1 bg-[#E0457B] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.2);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(224, 69, 123, 0.4);
          border-radius: 4px;
        }
      `}} />
    </div>
  );
};
