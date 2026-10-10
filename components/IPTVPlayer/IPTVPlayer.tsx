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
  country?: string;
  url: string;
}

export const IPTV_CHANNELS: IPTVChannel[] = [
  {
    id: "la_1",
    name: "la 1",
    country: "España",
    group: "Generalistas",
    logo: "/images/channels/la1.png",
    url: "https://rtvelivestream.rtve.es/rtvesec/la1/la1_main_dvr.m3u8"
  },
  {
    id: "la_1_hd",
    name: "la 1 hd",
    country: "España",
    group: "Generalistas",
    logo: "/images/channels/la1.png",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/414798.m3u8"
  },
  {
    id: "la_2",
    name: "la 2",
    country: "España",
    group: "Generalistas",
    logo: "/images/channels/la2.png",
    url: "https://rtvelivestream.rtve.es/rtvesec/la2/la2_main.m3u8"
  },
  {
    id: "antena_3",
    name: "antena 3",
    country: "España",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=antena3.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/414792.m3u8"
  },
  {
    id: "antena_3_op_2",
    name: "antena 3 op 2",
    country: "España",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=antena3.com",
    url: "http://179.60.224.196:8000/play/a0f2/index.m3u8"
  },
  {
    id: "la_4",
    name: "la 4",
    country: "España",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=cuatro.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/414791.m3u8"
  },
  {
    id: "telecinco",
    name: "Telecinco",
    country: "España",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=telecinco.es",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/414787.m3u8"
  },
  {
    id: "la_sexta",
    name: "la sexta",
    country: "España",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=lasexta.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/414783.m3u8"
  },
  {
    id: "telemadrid",
    name: "Telemadrid",
    country: "España",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=telemadrid.es",
    url: "https://live.telemadrid.cross-media.es/6389770581112/eu-central-1/6416060453001/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJob3N0IjoiajI5YjgyLmVncmVzcy5haGc3NmwiLCJhY2NvdW50X2lkIjoiNjQxNjA2MDQ1MzAwMSIsImVobiI6ImxpdmUudGVsZW1hZHJpZC5jcm9zcy1tZWRpYS5lcyIsImlzcyI6ImJsaXZlLXBsYXliYWNrLXNvdXJjZS1hcGkiLCJzdWIiOiJwYXRobWFwdG9rZW4iLCJhdWQiOlsiNjQxNjA2MDQ1MzAwMSJdLCJqdGkiOiI2Mzg5NzcwNTgxMTEyIn0.kqriAMUkHT6m0V6wkCHJum_EUyL4PAi1zJMKlfmYHEU/playlist-hls.m3u8"
  },
  {
    id: "odisea_4k",
    name: "Odisea 4k",
    country: "España",
    group: "Generalistas",
    logo: "/images/channels/odisea.png",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/414730.m3u8"
  },
  {
    id: "discovery",
    name: "Discovery",
    country: "España",
    group: "Documentales",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=discovery.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/414734.m3u8"
  },
  {
    id: "national_geographic_wild",
    name: "National Geographic Wild",
    country: "España",
    group: "Documentales",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=nationalgeographic.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/414737.m3u8"
  },
  {
    id: "national_geographic",
    name: "National Geographic",
    country: "España",
    group: "Documentales",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=nationalgeographic.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/414739.m3u8"
  },
  {
    id: "history_channel",
    name: "History Channel",
    country: "España",
    group: "Documentales",
    logo: "/images/channels/history.webp",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/414741.m3u8"
  },
  {
    id: "nickelodeon",
    name: "Nickelodeon",
    country: "España",
    group: "Entretenimiento 24/7",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/414712.m3u8"
  },
  {
    id: "sudance_tv",
    name: "Sudance TV",
    country: "España",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/414698.m3u8"
  },
  {
    id: "mtv",
    name: "MTV",
    country: "España",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/414696.m3u8"
  },
  {
    id: "movistas_plus",
    name: "Movistas Plus",
    country: "España",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/414775.m3u8"
  },
  {
    id: "24_horas",
    name: "24 horas",
    country: "España",
    group: "Noticias",
    logo: "/images/channels/24h.png",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/414778.m3u8"
  },
  {
    id: "movistar_originales",
    name: "Movistar Originales",
    country: "España",
    group: "Cine y Series",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=movistar.es",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/414804.m3u8"
  },
  {
    id: "futbol_es",
    name: "Futbol ES",
    country: "España",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/1328682.m3u8"
  },
  {
    id: "dazn",
    name: "DAZN",
    country: "España",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/1328692.m3u8"
  },
  {
    id: "veo_7",
    name: "VEO 7",
    country: "España",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/1328737.m3u8"
  },
  {
    id: "movistar_baloncesto_2",
    name: "Movistar Baloncesto 2",
    country: "España",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=movistar.es",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/750204.m3u8"
  },
  {
    id: "espn_premium_2",
    name: "ESPN PREMIUM 2",
    country: "España",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=espn.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/591998.m3u8"
  },
  {
    id: "espn_premium_arg",
    name: "ESPN PREMIUM ARG",
    country: "Argentina",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=espn.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/591997.m3u8"
  },
  {
    id: "espn_7",
    name: "ESPN 7",
    country: "España",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=espn.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/591996.m3u8"
  },
  {
    id: "espn_6",
    name: "ESPN 6",
    country: "España",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=espn.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/591995.m3u8"
  },
  {
    id: "espn_5",
    name: "ESPN 5",
    country: "España",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=espn.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/591994.m3u8"
  },
  {
    id: "espn_4",
    name: "ESPN 4",
    country: "España",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=espn.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/591991.m3u8"
  },
  {
    id: "espn_4_arg",
    name: "ESPN 4 ARG",
    country: "Argentina",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=espn.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/591990.m3u8"
  },
  {
    id: "espn_3",
    name: "ESPN 3",
    country: "España",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=espn.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/591989.m3u8"
  },
  {
    id: "espn_2",
    name: "ESPN 2",
    country: "España",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=espn.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/591984.m3u8"
  },
  {
    id: "espn_2_espa_a",
    name: "ESPN 2 ESPAÑA",
    country: "España",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=espn.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/591980.m3u8"
  },
  {
    id: "espn_mex",
    name: "ESPN MEX",
    country: "México",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=espn.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/591978.m3u8"
  },
  {
    id: "espn_espa_a",
    name: "ESPN ESPAÑA",
    country: "España",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=espn.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/591977.m3u8"
  },
  {
    id: "sport_center",
    name: "SPORT CENTER",
    country: "España",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/591976.m3u8"
  },
  {
    id: "espn_deportes",
    name: "ESPN DEPORTES",
    country: "España",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=espn.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/591971.m3u8"
  },
  {
    id: "cinema",
    name: "CINEMA",
    country: "España",
    group: "Cine y Series",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46102.m3u8"
  },
  {
    id: "a3s",
    name: "A3S",
    country: "España",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46097.m3u8"
  },
  {
    id: "axn",
    name: "AXN",
    country: "España",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46093.m3u8"
  },
  {
    id: "amc_fhd",
    name: "AMC FHD",
    country: "España",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46092.m3u8"
  },
  {
    id: "amc_hd",
    name: "AMC HD",
    country: "España",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46089.m3u8"
  },
  {
    id: "a_e",
    name: "A&E",
    country: "España",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46087.m3u8"
  },
  {
    id: "cine_latino",
    name: "CINE LATINO",
    country: "España",
    group: "Cine y Series",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46106.m3u8"
  },
  {
    id: "cine_canal_arg",
    name: "CINE CANAL ARG",
    country: "Argentina",
    group: "Cine y Series",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46107.m3u8"
  },
  {
    id: "cine_canal_hd_ch",
    name: "CINE CANAL HD CH",
    country: "Chile",
    group: "Cine y Series",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46109.m3u8"
  },
  {
    id: "cinemax_op_1",
    name: "CINEMAX OP 1",
    country: "España",
    group: "Cine y Series",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46111.m3u8"
  },
  {
    id: "cinemax_op_2",
    name: "CINEMAX OP 2",
    country: "España",
    group: "Cine y Series",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46112.m3u8"
  },
  {
    id: "cinemax_op_3",
    name: "CINEMAX OP 3",
    country: "España",
    group: "Cine y Series",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46114.m3u8"
  },
  {
    id: "dhe",
    name: "DHE",
    country: "España",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46123.m3u8"
  },
  {
    id: "fx",
    name: "FX",
    country: "España",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46130.m3u8"
  },
  {
    id: "golden",
    name: "GOLDEN",
    country: "España",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46138.m3u8"
  },
  {
    id: "golden_edge",
    name: "GOLDEN EDGE",
    country: "España",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46139.m3u8"
  },
  {
    id: "golden_mex",
    name: "GOLDEN MEX",
    country: "México",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46142.m3u8"
  },
  {
    id: "hbo",
    name: "HBO",
    country: "España",
    group: "Cine y Series",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=hbo.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46147.m3u8"
  },
  {
    id: "hbo_2",
    name: "HBO 2",
    country: "España",
    group: "Cine y Series",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=hbo.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46148.m3u8"
  },
  {
    id: "hbo_2_dtv",
    name: "HBO 2 DTV",
    country: "España",
    group: "Cine y Series",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=hbo.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46149.m3u8"
  },
  {
    id: "hbo_xtrem",
    name: "HBO XTREM",
    country: "España",
    group: "Cine y Series",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=hbo.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46150.m3u8"
  },
  {
    id: "hbo_family",
    name: "HBO FAMILY",
    country: "España",
    group: "Cine y Series",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=hbo.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46154.m3u8"
  },
  {
    id: "hbo_plus",
    name: "HBO PLUS",
    country: "España",
    group: "Cine y Series",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=hbo.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46156.m3u8"
  },
  {
    id: "hbo_signature",
    name: "HBO SIGNATURE",
    country: "España",
    group: "Cine y Series",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=hbo.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46163.m3u8"
  },
  {
    id: "multi_premier",
    name: "MULTI PREMIER",
    country: "España",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46169.m3u8"
  },
  {
    id: "paramount_channel_hd",
    name: "PARAMOUNT CHANNEL HD",
    country: "España",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46171.m3u8"
  },
  {
    id: "sonny_movies",
    name: "SONNY MOVIES",
    country: "España",
    group: "Cine y Series",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46175.m3u8"
  },
  {
    id: "sony_channel",
    name: "SONY CHANNEL",
    country: "España",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46176.m3u8"
  },
  {
    id: "sony_channel_hd",
    name: "SONY CHANNEL HD",
    country: "España",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46177.m3u8"
  },
  {
    id: "space",
    name: "SPACE",
    country: "España",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46180.m3u8"
  },
  {
    id: "star_channel",
    name: "STAR CHANNEL",
    country: "España",
    group: "Cine y Series",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46186.m3u8"
  },
  {
    id: "star_chanel_sd",
    name: "STAR CHANEL SD",
    country: "España",
    group: "Cine y Series",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46189.m3u8"
  },
  {
    id: "studio_universal",
    name: "STUDIO UNIVERSAL",
    country: "España",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46220.m3u8"
  },
  {
    id: "studio_universal_hd",
    name: "STUDIO UNIVERSAL HD",
    country: "España",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46223.m3u8"
  },
  {
    id: "syfy",
    name: "SYFY",
    country: "España",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46224.m3u8"
  },
  {
    id: "tnt_novelas",
    name: "TNT NOVELAS",
    country: "España",
    group: "Cine y Series",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tnt.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46227.m3u8"
  },
  {
    id: "tcm_hd",
    name: "TCM HD",
    country: "España",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46231.m3u8"
  },
  {
    id: "tlc_series",
    name: "TLC SERIES",
    country: "España",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46233.m3u8"
  },
  {
    id: "tnt_tv_hd",
    name: "TNT TV HD",
    country: "España",
    group: "Cine y Series",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tnt.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46237.m3u8"
  },
  {
    id: "tnt_fhd",
    name: "TNT FHD",
    country: "España",
    group: "Cine y Series",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tnt.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46239.m3u8"
  },
  {
    id: "tnt_series",
    name: "TNT SERIES",
    country: "España",
    group: "Cine y Series",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tnt.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46240.m3u8"
  },
  {
    id: "universal_tv",
    name: "UNIVERSAL TV",
    country: "España",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46245.m3u8"
  },
  {
    id: "warner_tv",
    name: "WARNER TV",
    country: "España",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46248.m3u8"
  },
  {
    id: "warner_hd",
    name: "WARNER HD",
    country: "España",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46249.m3u8"
  },
  {
    id: "warner_fhd",
    name: "WARNER FHD",
    country: "España",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46250.m3u8"
  },
  {
    id: "mlb_network_zone_usa",
    name: "MLB NETWORK ZONE USA",
    country: "Estados Unidos",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/1719064.m3u8"
  },
  {
    id: "wapa_deportes_puerto_rico",
    name: "WAPA DEPORTES PUERTO RICO",
    country: "Puerto Rico",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/19848.m3u8"
  },
  {
    id: "noticentro",
    name: "NOTICENTRO",
    country: "España",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/19847.m3u8"
  },
  {
    id: "mega_tv",
    name: "MEGA TV",
    country: "España",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/19849.m3u8"
  },
  {
    id: "telemundo_puerto_rico",
    name: "TELEMUNDO PUERTO RICO",
    country: "Puerto Rico",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/19851.m3u8"
  },
  {
    id: "punto_2_puerto_rico",
    name: "PUNTO 2 PUERTO RICO",
    country: "Puerto Rico",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/19853.m3u8"
  },
  {
    id: "movistar_baloncesto",
    name: "Movistar Baloncesto",
    country: "España",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=movistar.es",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/750197.m3u8"
  },
  {
    id: "directtv_sport_fight",
    name: "Directtv Sport Fight",
    country: "España",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/149275.m3u8"
  },
  {
    id: "ufc_fight_pass",
    name: "UFC Fight Pass",
    country: "España",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/149276.m3u8"
  },
  {
    id: "tyc_sports",
    name: "TYC Sports",
    country: "España",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/712754.m3u8"
  },
  {
    id: "fox_sports_3",
    name: "FOX Sports 3",
    country: "España",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=foxsports.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/712750.m3u8"
  },
  {
    id: "fox_sports_2",
    name: "FOX Sports 2",
    country: "España",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=foxsports.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/712749.m3u8"
  },
  {
    id: "fox_sports",
    name: "FOX Sports",
    country: "España",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=foxsports.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/712748.m3u8"
  },
  {
    id: "espn_premium",
    name: "ESPN Premium",
    country: "España",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=espn.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/712747.m3u8"
  },
  {
    id: "espn_4",
    name: "ESPN 4",
    country: "España",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=espn.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/712746.m3u8"
  },
  {
    id: "espn_3",
    name: "ESPN 3",
    country: "España",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=espn.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/712745.m3u8"
  },
  {
    id: "espn_2",
    name: "ESPN 2",
    country: "España",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=espn.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/712744.m3u8"
  },
  {
    id: "espn",
    name: "ESPN",
    country: "España",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=espn.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/712743.m3u8"
  },
  {
    id: "depor_tv",
    name: "DEPOR TV",
    country: "España",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/712742.m3u8"
  },
  {
    id: "bein_sports",
    name: "BEIN SPORTS",
    country: "España",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/592013.m3u8"
  },
  {
    id: "fox_deporte",
    name: "FOX DEPORTE",
    country: "España",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=foxsports.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/592015.m3u8"
  },
  {
    id: "tudn",
    name: "TUDN",
    country: "España",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/592018.m3u8"
  },
  {
    id: "fox_premium",
    name: "FOX PREMIUM",
    country: "España",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=foxsports.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/592012.m3u8"
  },
  {
    id: "fox_sport_3",
    name: "FOX SPORT 3",
    country: "España",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=foxsports.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/592011.m3u8"
  },
  {
    id: "fox_3",
    name: "FOX 3",
    country: "España",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=foxsports.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/592009.m3u8"
  },
  {
    id: "fox_2",
    name: "FOX 2",
    country: "España",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=foxsports.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/592005.m3u8"
  },
  {
    id: "fox_sports_mexico",
    name: "FOX SPORTS MEXICO",
    country: "México",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=foxsports.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/592003.m3u8"
  },
  {
    id: "fox_sport_argen",
    name: "FOX SPORT ARGEN",
    country: "Argentina",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=foxsports.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/592000.m3u8"
  },
  {
    id: "direct_sports",
    name: "Direct Sports",
    country: "España",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/417199.m3u8"
  },
  {
    id: "latina_noticias",
    name: "Latina Noticias",
    country: "Perú",
    group: "Noticias",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/9475.m3u8"
  },
  {
    id: "america_tv",
    name: "America Tv",
    country: "Argentina",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/9477.m3u8"
  },
  {
    id: "panamericana_tv",
    name: "Panamericana TV",
    country: "España",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/9481.m3u8"
  },
  {
    id: "atv_hd_directo",
    name: "ATV HD Directo",
    country: "España",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/9482.m3u8"
  },
  {
    id: "rpp",
    name: "RPP",
    country: "España",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/9493.m3u8"
  },
  {
    id: "movistar_deportes",
    name: "Movistar Deportes",
    country: "España",
    group: "Cine y Series",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=movistar.es",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/9466.m3u8"
  },
  {
    id: "movistar_plus",
    name: "Movistar Plus",
    country: "España",
    group: "Cine y Series",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=movistar.es",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/9468.m3u8"
  },
  {
    id: "g",
    name: "G",
    country: "España",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/9499.m3u8"
  },
  {
    id: "el_9_argentina",
    name: "EL 9 Argentina",
    country: "Argentina",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/712709.m3u8"
  },
  {
    id: "cr_nica_tv",
    name: "Crónica TV",
    country: "España",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/712707.m3u8"
  },
  {
    id: "c5n",
    name: "C5N",
    country: "España",
    group: "Noticias",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/712705.m3u8"
  },
  {
    id: "america_tv_arg",
    name: "AMERICA TV ARG",
    country: "Argentina",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/712704.m3u8"
  },
  {
    id: "el_trece_arg",
    name: "EL TRECE ARG",
    country: "Argentina",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/712711.m3u8"
  },
  {
    id: "telefe",
    name: "Telefe",
    country: "España",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/712715.m3u8"
  },
  {
    id: "tn_noticias",
    name: "TN NOTICIAS",
    country: "España",
    group: "Noticias",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/712718.m3u8"
  },
  {
    id: "tv_publica_arg",
    name: "TV Publica Arg",
    country: "Argentina",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/712719.m3u8"
  },
  {
    id: "canal_26",
    name: "Canal 26",
    country: "España",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/712725.m3u8"
  },
  {
    id: "chile_visi_n",
    name: "Chile Visión",
    country: "España",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/9827.m3u8"
  },
  {
    id: "mega_noticias",
    name: "Mega Noticias",
    country: "España",
    group: "Noticias",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/9824.m3u8"
  },
  {
    id: "tv_chile",
    name: "TV Chile",
    country: "España",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/9820.m3u8"
  },
  {
    id: "canal_13_chile",
    name: "Canal 13 Chile",
    country: "España",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/33118.m3u8"
  },
  {
    id: "la_red_chile",
    name: "La Red Chile",
    country: "España",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/33117.m3u8"
  },
  {
    id: "rcn_noticias_colombia",
    name: "RCN Noticias Colombia",
    country: "Colombia",
    group: "Noticias",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/13782.m3u8"
  },
  {
    id: "caracol_internacional",
    name: "Caracol Internacional",
    country: "Colombia",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/13778.m3u8"
  },
  {
    id: "rcn_internacional",
    name: "RCN Internacional",
    country: "Colombia",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/13783.m3u8"
  },
  {
    id: "rcn",
    name: "RCN",
    country: "Colombia",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/1331813.m3u8"
  },
  {
    id: "city_tv",
    name: "City Tv",
    country: "España",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/1331820.m3u8"
  },
  {
    id: "capital_colombia",
    name: "Capital Colombia",
    country: "Colombia",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/1331822.m3u8"
  },
  {
    id: "la_kalle_colombia_musica",
    name: "La Kalle Colombia Musica",
    country: "Colombia",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/1331824.m3u8"
  },
  {
    id: "ntn24",
    name: "NTN24",
    country: "España",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/1331825.m3u8"
  },
  {
    id: "red_noticias",
    name: "RED Noticias",
    country: "España",
    group: "Noticias",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/1331827.m3u8"
  },
  {
    id: "amc_series",
    name: "AMC Series",
    country: "España",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/79064.m3u8"
  },
  {
    id: "gourmet",
    name: "Gourmet",
    country: "España",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/79061.m3u8"
  },
  {
    id: "gourmet_latino",
    name: "Gourmet Latino",
    country: "España",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/79060.m3u8"
  },
  {
    id: "comedy_central",
    name: "Comedy Central",
    country: "España",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/79058.m3u8"
  },
  {
    id: "tlc",
    name: "TLC",
    country: "España",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/79071.m3u8"
  },
  {
    id: "todo_novelas",
    name: "Todo Novelas",
    country: "España",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/79074.m3u8"
  },
  {
    id: "telenovelas",
    name: "Telenovelas",
    country: "España",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/79075.m3u8"
  },
  {
    id: "univisi_n",
    name: "Univisión",
    country: "España",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/254506.m3u8"
  },
  {
    id: "unimas",
    name: "UniMas",
    country: "España",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/254505.m3u8"
  },
  {
    id: "telemundo_dallas",
    name: "Telemundo Dallas",
    country: "Estados Unidos",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/254502.m3u8"
  },
  {
    id: "univisi_n_mex",
    name: "Univisión Mex",
    country: "México",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/254501.m3u8"
  },
  {
    id: "gala_visi_n",
    name: "Gala Visión",
    country: "España",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/254494.m3u8"
  },
  {
    id: "vix",
    name: "VIX",
    country: "España",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/79079.m3u8"
  },
  {
    id: "dw_noticias",
    name: "DW Noticias",
    country: "España",
    group: "Noticias",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/79084.m3u8"
  },
  {
    id: "cnn_en_espa_ol",
    name: "CNN en Español",
    country: "España",
    group: "Noticias",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=cnn.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/79088.m3u8"
  },
  {
    id: "cnn_chile",
    name: "CNN Chile",
    country: "España",
    group: "Noticias",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=cnn.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/79090.m3u8"
  },
  {
    id: "cnn_usa",
    name: "CNN USA",
    country: "Estados Unidos",
    group: "Noticias",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=cnn.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/597240.m3u8"
  },
  {
    id: "abc_news_live",
    name: "ABC News Live",
    country: "España",
    group: "Noticias",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/597256.m3u8"
  },
  {
    id: "fox_news",
    name: "FOX News",
    country: "España",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=foxsports.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/597235.m3u8"
  },
  {
    id: "msnbc",
    name: "MSNBC",
    country: "España",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/597233.m3u8"
  },
  {
    id: "new12_new_jersey",
    name: "New12 New Jersey",
    country: "España",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/597230.m3u8"
  },
  {
    id: "news_12_the_bronx",
    name: "News 12 The Bronx",
    country: "España",
    group: "Noticias",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/597229.m3u8"
  },
  {
    id: "news_max",
    name: "NEWS MAX",
    country: "España",
    group: "Noticias",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/597227.m3u8"
  },
  {
    id: "one_america_news_hd",
    name: "One America News HD",
    country: "España",
    group: "Noticias",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/597225.m3u8"
  },
  {
    id: "cheddar_news_fhd",
    name: "Cheddar News FHD",
    country: "España",
    group: "Noticias",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/597244.m3u8"
  },
  {
    id: "alf_24_7",
    name: "ALF 24/7",
    country: "España",
    group: "Entretenimiento 24/7",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/783515.m3u8"
  },
  {
    id: "los_simpson_24_7",
    name: "Los Simpson 24/7",
    country: "España",
    group: "Entretenimiento 24/7",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=fox.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/575761.m3u8"
  },
  {
    id: "los_simpson_hd",
    name: "Los Simpson HD",
    country: "España",
    group: "Entretenimiento 24/7",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=fox.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/575762.m3u8"
  },
  {
    id: "transformes_24_7",
    name: "Transformes 24/7",
    country: "España",
    group: "Entretenimiento 24/7",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/428517.m3u8"
  },
  {
    id: "los_4_fantasticos_24_7",
    name: "Los 4 Fantasticos 24/7",
    country: "España",
    group: "Entretenimiento 24/7",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/428519.m3u8"
  },
  {
    id: "caballeros_del_zodiaco_24_7",
    name: "Caballeros del zodiaco 24/7",
    country: "España",
    group: "Entretenimiento 24/7",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/428557.m3u8"
  },
  {
    id: "el_pr_ncipe_del_rap",
    name: "El príncipe del Rap",
    country: "España",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/575737.m3u8"
  },
  {
    id: "friends_24_7",
    name: "Friends 24/7",
    country: "España",
    group: "Entretenimiento 24/7",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/575738.m3u8"
  },
  {
    id: "pablo_escobar_24_7",
    name: "Pablo Escobar 24/7",
    country: "España",
    group: "Entretenimiento 24/7",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/575741.m3u8"
  },
  {
    id: "el_origen_extraparanormal",
    name: "El Origen Extraparanormal",
    country: "España",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/575742.m3u8"
  },
  {
    id: "hechizada_24_7",
    name: "Hechizada 24/7",
    country: "España",
    group: "Entretenimiento 24/7",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/575745.m3u8"
  },
  {
    id: "jhonny_bravo_24_7",
    name: "Jhonny Bravo 24/7",
    country: "España",
    group: "Entretenimiento 24/7",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/575747.m3u8"
  },
  {
    id: "la_casa_de_papel",
    name: "La Casa De Papel",
    country: "España",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/575750.m3u8"
  },
  {
    id: "la_pantera_rosa",
    name: "La Pantera Rosa",
    country: "España",
    group: "Entretenimiento 24/7",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/575754.m3u8"
  },
  {
    id: "los_thubder_cats_24_7",
    name: "Los Thubder Cats 24/7",
    country: "España",
    group: "Entretenimiento 24/7",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/575764.m3u8"
  },
  {
    id: "pok_mon_24_7",
    name: "Pokémon 24/7",
    country: "España",
    group: "Entretenimiento 24/7",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/575769.m3u8"
  },
  {
    id: "el_chavo_del_8",
    name: "El Chavo del 8",
    country: "España",
    group: "Entretenimiento 24/7",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/575793.m3u8"
  },
  {
    id: "la_familia_monster_24_7",
    name: "La Familia Monster 24/7",
    country: "España",
    group: "Entretenimiento 24/7",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/575795.m3u8"
  },
  {
    id: "el_chiringuito",
    name: "el chiringuito",
    country: "España",
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
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  // Hardcoded ordered categories so Spain and main groups are first
  const baseCategories = ['Todos', 'España', 'Películas', 'Deportes', 'Noticias', 'Documentales', 'Generalistas', 'Entretenimiento 24/7'];
  const otherCountries = ['México', 'Argentina', 'Colombia', 'Perú', 'Chile', 'Puerto Rico', 'Estados Unidos'];
  
  // Combine ensuring uniqueness
  const categories = Array.from(new Set([...baseCategories, ...otherCountries]));

  const getFlag = (name: string) => {
    if (name === 'España') return '🇪🇸 ';
    if (name === 'Argentina') return '🇦🇷 ';
    if (name === 'México') return '🇲🇽 ';
    if (name === 'Colombia') return '🇨🇴 ';
    if (name === 'Perú') return '🇵🇪 ';
    if (name === 'Estados Unidos') return '🇺🇸 ';
    if (name === 'Puerto Rico') return '🇵🇷 ';
    if (name === 'Chile') return '🇨🇱 ';
    if (name === 'Deportes') return '⚽ ';
    if (name === 'Películas') return '🎬 ';
    if (name === 'Noticias') return '📰 ';
    if (name === 'Documentales') return '🌍 ';
    return '';
  };

  const filteredChannels = activeCategory === 'Todos' 
    ? IPTV_CHANNELS 
    : IPTV_CHANNELS.filter(c => c.group === activeCategory || c.country === activeCategory);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const dashRef = useRef<dashjs.MediaPlayerClass | null>(null);
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
      
      let proxyUrl = `/api/proxy?url=${encodeURIComponent(activeChannel.url)}`;
      if (activeChannel.url.includes('cdn.jsdelivr.net') || activeChannel.url.includes('rtvelivestream.rtve.es')) {
        proxyUrl = activeChannel.url;
      }

      // Clean up previous instances
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      if (dashRef.current) {
        dashRef.current.destroy();
        dashRef.current = null;
      }

      const isMpd = activeChannel.url.includes('.mpd');

      if (isMpd) {
        import('dashjs').then((dashjsModule) => {
          const dashjs = (dashjsModule as any).default || dashjsModule;
          const player = dashjs.MediaPlayer().create();
          dashRef.current = player;
          player.initialize(video, proxyUrl, true);
          
          player.on(dashjs.MediaPlayer.events.PLAYBACK_STARTED, () => {
            setIsLoading(false);
          });
          
          player.on(dashjs.MediaPlayer.events.ERROR, (e: any) => {
            console.error("DASH Error:", e);
            setHasError(true);
            setIsLoading(false);
          });
        }).catch(err => {
          console.error("Failed to load dashjs", err);
          setHasError(true);
        });
      } else if (Hls.isSupported()) {
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
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.log("fatal network error encountered, try to recover");
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.log("fatal media error encountered, try to recover");
                hls.recoverMediaError();
                break;
              default:
                console.error("HLS Fatal Error cannot be recovered:", data);
                hls.destroy();
                setHasError(true);
                setIsLoading(false);
                break;
            }
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
      if (dashRef.current) {
        dashRef.current.destroy();
        dashRef.current = null;
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
                <p className="font-satoshi text-xs text-white/50 max-w-md">No se puede decodificar el video de {activeChannel.name}. La señal se ha cortado o el formato es incompatible.</p>
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
        <div className={`w-full md:w-80 lg:w-[400px] flex-shrink-0 border-t md:border-t-0 md:border-l border-white/10 flex flex-col h-[40vh] md:h-full bg-black/80 backdrop-blur-3xl shadow-[-10px_0_30px_rgba(224,69,123,0.1)]`}>
          <div className={`px-6 py-5 border-b border-white/5 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-xl sticky top-0 z-10`}>
            <h3 className="font-panchang text-[10px] font-bold tracking-[0.3em] uppercase text-white/50 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#E0457B] animate-pulse"></span>
              Directorio de Canales
            </h3>
            
            {/* Category Pills */}
            <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar-horizontal" data-lenis-prevent>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`whitespace-nowrap px-4 py-1.5 rounded-full font-satoshi text-[10px] tracking-widest uppercase transition-all duration-300 ${
                    activeCategory === category 
                      ? 'bg-[#E0457B] text-white shadow-[0_0_15px_rgba(224,69,123,0.5)] font-bold' 
                      : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {getFlag(category)}{category}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-3 custom-scrollbar" data-lenis-prevent>
            {filteredChannels.map((channel) => {
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
        .custom-scrollbar-horizontal::-webkit-scrollbar {
          height: 3px;
        }
        .custom-scrollbar-horizontal::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar-horizontal::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 3px;
        }
        .custom-scrollbar-horizontal::-webkit-scrollbar {
          height: 3px;
        }
        .custom-scrollbar-horizontal::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar-horizontal::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 3px;
        }
      `}} />
    </div>
  );
};
