'use client';

import React, { useState, useEffect, useRef } from 'react';
import Hls from 'hls.js';

import { X, Play, Square, Loader2, Volume2, VolumeX, Maximize, Search, ChevronDown, Tv } from 'lucide-react';
import { useMediaStore } from '@/lib/mediaStore';

export interface IPTVChannel {
  id: string;
  name: string;
  group: string;
  logo: string;
  country?: string;
  url: string;
  categories?: string[];
}

export const IPTV_CHANNELS: IPTVChannel[] = [
  {
    "id": "la_1",
    "name": "la 1",
    "country": "España",
    "group": "Noticias",
    "logo": "/images/channels/la1.png",
    "url": "https://rtvelivestream.rtve.es/rtvesec/la1/la1_main_dvr.m3u8",
    "categories": [
      "NOTICIAS",
      "ESPAÑA"
    ]
  },
  {
    "id": "la_2",
    "name": "la 2",
    "country": "España",
    "group": "Noticias",
    "logo": "/images/channels/la2.png",
    "url": "https://rtvelivestream.rtve.es/rtvesec/la2/la2_main.m3u8",
    "categories": [
      "NOTICIAS",
      "ESPAÑA"
    ]
  },
  {
    "id": "antena_3",
    "name": "antena 3",
    "country": "España",
    "group": "Noticias",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=antena3.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/414792.m3u8",
    "categories": [
      "NOTICIAS",
      "ESPAÑA"
    ]
  },
  {
    "id": "la_4",
    "name": "la 4",
    "country": "España",
    "group": "Noticias",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=cuatro.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/414791.m3u8",
    "categories": [
      "NOTICIAS",
      "ESPAÑA"
    ]
  },
  {
    "id": "telecinco",
    "name": "Telecinco",
    "country": "España",
    "group": "Noticias",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=telecinco.es",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/414787.m3u8",
    "categories": [
      "NOTICIAS",
      "ESPAÑA"
    ]
  },
  {
    "id": "la_sexta",
    "name": "la sexta",
    "country": "España",
    "group": "Noticias",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=lasexta.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/414783.m3u8",
    "categories": [
      "NOTICIAS",
      "ESPAÑA"
    ]
  },
  {
    "id": "telemadrid",
    "name": "Telemadrid",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=telemadrid.es",
    "url": "http://cloudtvserviceplatinum.site:8080/live/alex_elvir/elvir123/505147.m3u8",
    "categories": [
      "GENERAL",
      "ESPAÑA"
    ]
  },
  {
    "id": "nova_fhd",
    "name": "NOVA FHD",
    "country": "España",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/miatorres7/Stream2025/414766.m3u8",
    "categories": [
      "GENERAL",
      "ESPAÑA"
    ]
  },
  {
    "id": "fdf_fhd",
    "name": "FDF FHD",
    "country": "España",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/miatorres7/Stream2025/414760.m3u8",
    "categories": [
      "GENERAL",
      "ESPAÑA"
    ]
  },
  {
    "id": "energy_fhd",
    "name": "ENERGY FHD",
    "country": "España",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/miatorres7/Stream2025/414765.m3u8",
    "categories": [
      "GENERAL",
      "ESPAÑA"
    ]
  },
  {
    "id": "bmad",
    "name": "BMAD",
    "country": "España",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/miatorres7/Stream2025/414770.m3u8",
    "categories": [
      "GENERAL",
      "ESPAÑA"
    ]
  },
  {
    "id": "ten_sd",
    "name": "TEN SD",
    "country": "España",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/miatorres7/Stream2025/414774.m3u8",
    "categories": [
      "GENERAL",
      "ESPAÑA"
    ]
  },
  {
    "id": "dkiss_sd",
    "name": "DKISS SD",
    "country": "España",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/miatorres7/Stream2025/414773.m3u8",
    "categories": [
      "GENERAL",
      "ESPAÑA"
    ]
  },
  {
    "id": "m_plus_series_fhd",
    "name": "M+ Series FHD",
    "country": "España",
    "group": "Películas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=movistarplus.es",
    "url": "http://latinostream.xyz/live/felixpenatv/L20260730/1013148.m3u8",
    "categories": [
      "PELICULAS",
      "ESPAÑA"
    ]
  },
  {
    "id": "axn_fhd_espain",
    "name": "AXN FHD ESPAIN",
    "country": "España",
    "group": "Películas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=axn.es",
    "url": "http://latinostream.xyz/live/felixpenatv/L20260730/1013151.m3u8",
    "categories": [
      "PELICULAS",
      "ESPAÑA"
    ]
  },
  {
    "id": "calle_13_fhd",
    "name": "Calle 13 FHD",
    "country": "España",
    "group": "Películas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=calle13.es",
    "url": "http://latinostream.xyz/live/felixpenatv/L20260730/1013159.m3u8",
    "categories": [
      "PELICULAS",
      "ESPAÑA"
    ]
  },
  {
    "id": "cosmo_fhd",
    "name": "COSMO FHD",
    "country": "España",
    "group": "Películas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=canalcosmo.es",
    "url": "http://latinostream.xyz/live/felixpenatv/L20260730/1013162.m3u8",
    "categories": [
      "PELICULAS",
      "ESPAÑA"
    ]
  },
  {
    "id": "es_amc_fhd",
    "name": "ES AMC FHD",
    "country": "España",
    "group": "Películas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=amctv.es",
    "url": "http://latinostream.xyz/live/felixpenatv/L20260730/1013165.m3u8",
    "categories": [
      "PELICULAS",
      "ESPAÑA"
    ]
  },
  {
    "id": "axn_movies_fhd",
    "name": "AXN Movies FHD",
    "country": "España",
    "group": "Películas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=axn.es",
    "url": "http://latinostream.xyz/live/felixpenatv/L20260730/1013166.m3u8",
    "categories": [
      "PELICULAS",
      "ESPAÑA"
    ]
  },
  {
    "id": "la_1_hd",
    "name": "la 1 hd",
    "country": "España",
    "group": "Noticias",
    "logo": "/images/channels/la1.png",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/414798.m3u8",
    "categories": [
      "NOTICIAS",
      "ESPAÑA"
    ]
  },
  {
    "id": "antena_3_op_2",
    "name": "antena 3 op 2",
    "country": "España",
    "group": "Noticias",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=antena3.com",
    "url": "http://179.60.224.196:8000/play/a0f2/index.m3u8",
    "categories": [
      "NOTICIAS",
      "ESPAÑA"
    ]
  },
  {
    "id": "odisea_4k",
    "name": "Odisea 4k",
    "group": "Documentales",
    "logo": "/images/channels/odisea.png",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/414730.m3u8",
    "categories": [
      "GENERAL",
      "ESPAÑA"
    ]
  },
  {
    "id": "discovery",
    "name": "Discovery",
    "group": "Documentales",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=discovery.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/414734.m3u8",
    "categories": [
      "GENERAL",
      "ESPAÑA"
    ]
  },
  {
    "id": "national_geographic_wild",
    "name": "National Geographic Wild",
    "group": "Documentales",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=nationalgeographic.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/414737.m3u8",
    "categories": [
      "GENERAL"
    ]
  },
  {
    "id": "national_geographic",
    "name": "National Geographic",
    "group": "Documentales",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=nationalgeographic.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/414739.m3u8",
    "categories": [
      "GENERAL"
    ]
  },
  {
    "id": "history_channel",
    "name": "History Channel",
    "country": "Chile",
    "group": "Documentales",
    "logo": "/images/channels/history.webp",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/414741.m3u8",
    "categories": [
      "GENERAL"
    ]
  },
  {
    "id": "nickelodeon",
    "name": "Nickelodeon",
    "group": "Entretenimiento 24/7",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/414712.m3u8",
    "categories": [
      "GENERAL"
    ]
  },
  {
    "id": "sudance_tv",
    "name": "Sudance TV",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/414698.m3u8",
    "categories": [
      "GENERAL",
      "ESPAÑA"
    ]
  },
  {
    "id": "mtv",
    "name": "MTV",
    "group": "Entretenimiento 24/7",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/414696.m3u8",
    "categories": [
      "GENERAL",
      "ESPAÑA"
    ]
  },
  {
    "id": "movistas_plus",
    "name": "Movistas Plus",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/414775.m3u8",
    "categories": [
      "GENERAL",
      "ESPAÑA"
    ]
  },
  {
    "id": "24_horas",
    "name": "24 horas",
    "group": "Generalistas",
    "logo": "/images/channels/24h.png",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/414778.m3u8",
    "categories": [
      "NOTICIAS"
    ]
  },
  {
    "id": "movistar_originales",
    "name": "Movistar Originales",
    "country": "España",
    "group": "Pel├¡culas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=movistar.es",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/414804.m3u8",
    "categories": [
      "GENERAL"
    ]
  },
  {
    "id": "futbol_es",
    "name": "Futbol ES",
    "country": "España",
    "group": "Deportes",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/1328682.m3u8",
    "categories": [
      "DEPORTES",
      "ESPAÑA"
    ]
  },
  {
    "id": "dazn",
    "name": "DAZN",
    "group": "Deportes",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/1328692.m3u8",
    "categories": [
      "DEPORTES",
      "ESPAÑA"
    ]
  },
  {
    "id": "veo_7",
    "name": "VEO 7",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/1328737.m3u8",
    "categories": [
      "GENERAL",
      "ESPAÑA"
    ]
  },
  {
    "id": "movistar_baloncesto_2",
    "name": "Movistar Baloncesto 2",
    "country": "España",
    "group": "Deportes",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=movistar.es",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/750204.m3u8",
    "categories": [
      "DEPORTES",
      "ESPAÑA"
    ]
  },
  {
    "id": "espn_premium_2",
    "name": "ESPN PREMIUM 2",
    "group": "Deportes",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=espn.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/591998.m3u8",
    "categories": [
      "DEPORTES"
    ]
  },
  {
    "id": "espn_premium_arg",
    "name": "ESPN PREMIUM ARG",
    "group": "Deportes",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=espn.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/591997.m3u8",
    "categories": [
      "DEPORTES"
    ]
  },
  {
    "id": "espn_7",
    "name": "ESPN 7",
    "group": "Deportes",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=espn.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/591996.m3u8",
    "categories": [
      "DEPORTES"
    ]
  },
  {
    "id": "espn_6",
    "name": "ESPN 6",
    "group": "Deportes",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=espn.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/591995.m3u8",
    "categories": [
      "DEPORTES"
    ]
  },
  {
    "id": "espn_5",
    "name": "ESPN 5",
    "group": "Deportes",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=espn.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/591994.m3u8",
    "categories": [
      "DEPORTES"
    ]
  },
  {
    "id": "espn_4",
    "name": "ESPN 4",
    "group": "Deportes",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=espn.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/591991.m3u8",
    "categories": [
      "DEPORTES"
    ]
  },
  {
    "id": "espn_4_arg",
    "name": "ESPN 4 ARG",
    "group": "Deportes",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=espn.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/591990.m3u8",
    "categories": [
      "DEPORTES"
    ]
  },
  {
    "id": "espn_3",
    "name": "ESPN 3",
    "group": "Deportes",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=espn.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/591989.m3u8",
    "categories": [
      "DEPORTES"
    ]
  },
  {
    "id": "espn_2",
    "name": "ESPN 2",
    "group": "Deportes",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=espn.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/591984.m3u8",
    "categories": [
      "DEPORTES"
    ]
  },
  {
    "id": "espn_2_espa_a",
    "name": "ESPN 2 ESPAÑA",
    "group": "Deportes",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=espn.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/591980.m3u8",
    "categories": [
      "DEPORTES"
    ]
  },
  {
    "id": "espn_mex",
    "name": "ESPN MEX",
    "group": "Deportes",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=espn.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/591978.m3u8",
    "categories": [
      "DEPORTES"
    ]
  },
  {
    "id": "espn_espa_a",
    "name": "ESPN ESPAÑA",
    "group": "Deportes",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=espn.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/591977.m3u8",
    "categories": [
      "DEPORTES"
    ]
  },
  {
    "id": "sport_center",
    "name": "SPORT CENTER",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/591976.m3u8",
    "categories": [
      "GENERAL"
    ]
  },
  {
    "id": "espn_deportes",
    "name": "ESPN DEPORTES",
    "group": "Deportes",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=espn.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/591971.m3u8",
    "categories": [
      "DEPORTES"
    ]
  },
  {
    "id": "cinema",
    "name": "CINEMA",
    "group": "Pel├¡culas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46102.m3u8",
    "categories": [
      "PELICULAS"
    ]
  },
  {
    "id": "a3s",
    "name": "A3S",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46097.m3u8",
    "categories": [
      "GENERAL"
    ]
  },
  {
    "id": "axn",
    "name": "AXN",
    "group": "Pel├¡culas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46093.m3u8",
    "categories": [
      "PELICULAS"
    ]
  },
  {
    "id": "amc_fhd",
    "name": "AMC FHD",
    "group": "Pel├¡culas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46092.m3u8",
    "categories": [
      "PELICULAS"
    ]
  },
  {
    "id": "amc_hd",
    "name": "AMC HD",
    "group": "Pel├¡culas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46089.m3u8",
    "categories": [
      "PELICULAS"
    ]
  },
  {
    "id": "a_e",
    "name": "A&E",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46087.m3u8",
    "categories": [
      "GENERAL"
    ]
  },
  {
    "id": "cine_latino",
    "name": "CINE LATINO",
    "group": "Pel├¡culas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46106.m3u8",
    "categories": [
      "PELICULAS"
    ]
  },
  {
    "id": "cine_canal_arg",
    "name": "CINE CANAL ARG",
    "country": "Argentina",
    "group": "Pel├¡culas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46107.m3u8",
    "categories": [
      "PELICULAS",
      "GENERAL"
    ]
  },
  {
    "id": "cine_canal_hd_ch",
    "name": "CINE CANAL HD CH",
    "country": "Chile",
    "group": "Pel├¡culas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46109.m3u8",
    "categories": [
      "PELICULAS"
    ]
  },
  {
    "id": "cinemax_op_1",
    "name": "CINEMAX OP 1",
    "group": "Pel├¡culas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46111.m3u8",
    "categories": [
      "PELICULAS"
    ]
  },
  {
    "id": "cinemax_op_2",
    "name": "CINEMAX OP 2",
    "group": "Pel├¡culas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46112.m3u8",
    "categories": [
      "PELICULAS"
    ]
  },
  {
    "id": "cinemax_op_3",
    "name": "CINEMAX OP 3",
    "group": "Pel├¡culas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46114.m3u8",
    "categories": [
      "PELICULAS"
    ]
  },
  {
    "id": "dhe",
    "name": "DHE",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46123.m3u8",
    "categories": [
      "PELICULAS"
    ]
  },
  {
    "id": "fx",
    "name": "FX",
    "group": "Pel├¡culas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46130.m3u8",
    "categories": [
      "PELICULAS"
    ]
  },
  {
    "id": "golden",
    "name": "GOLDEN",
    "group": "Pel├¡culas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46138.m3u8",
    "categories": [
      "PELICULAS",
      "GENERAL"
    ]
  },
  {
    "id": "golden_edge",
    "name": "GOLDEN EDGE",
    "group": "Pel├¡culas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46139.m3u8",
    "categories": [
      "PELICULAS",
      "GENERAL"
    ]
  },
  {
    "id": "golden_mex",
    "name": "GOLDEN MEX",
    "country": "México",
    "group": "Pel├¡culas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46142.m3u8",
    "categories": [
      "PELICULAS",
      "GENERAL"
    ]
  },
  {
    "id": "hbo",
    "name": "HBO",
    "group": "Pel├¡culas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=hbo.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46147.m3u8",
    "categories": [
      "PELICULAS"
    ]
  },
  {
    "id": "hbo_2",
    "name": "HBO 2",
    "group": "Pel├¡culas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=hbo.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46148.m3u8",
    "categories": [
      "PELICULAS"
    ]
  },
  {
    "id": "hbo_2_dtv",
    "name": "HBO 2 DTV",
    "group": "Pel├¡culas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=hbo.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46149.m3u8",
    "categories": [
      "PELICULAS"
    ]
  },
  {
    "id": "hbo_xtrem",
    "name": "HBO XTREM",
    "group": "Pel├¡culas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=hbo.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46150.m3u8",
    "categories": [
      "PELICULAS"
    ]
  },
  {
    "id": "hbo_family",
    "name": "HBO FAMILY",
    "group": "Pel├¡culas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=hbo.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46154.m3u8",
    "categories": [
      "PELICULAS"
    ]
  },
  {
    "id": "hbo_plus",
    "name": "HBO PLUS",
    "group": "Pel├¡culas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=hbo.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46156.m3u8",
    "categories": [
      "PELICULAS"
    ]
  },
  {
    "id": "hbo_signature",
    "name": "HBO SIGNATURE",
    "group": "Pel├¡culas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=hbo.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46163.m3u8",
    "categories": [
      "PELICULAS",
      "GENERAL"
    ]
  },
  {
    "id": "multi_premier",
    "name": "MULTI PREMIER",
    "group": "Pel├¡culas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46169.m3u8",
    "categories": [
      "PELICULAS"
    ]
  },
  {
    "id": "paramount_channel_hd",
    "name": "PARAMOUNT CHANNEL HD",
    "country": "Chile",
    "group": "Pel├¡culas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46171.m3u8",
    "categories": [
      "PELICULAS"
    ]
  },
  {
    "id": "sonny_movies",
    "name": "SONNY MOVIES",
    "country": "España",
    "group": "Pel├¡culas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46175.m3u8",
    "categories": [
      "PELICULAS"
    ]
  },
  {
    "id": "sony_channel",
    "name": "SONY CHANNEL",
    "country": "Chile",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46176.m3u8",
    "categories": [
      "PELICULAS"
    ]
  },
  {
    "id": "sony_channel_hd",
    "name": "SONY CHANNEL HD",
    "country": "Chile",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46177.m3u8",
    "categories": [
      "GENERAL"
    ]
  },
  {
    "id": "space",
    "name": "SPACE",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46180.m3u8",
    "categories": [
      "PELICULAS",
      "GENERAL"
    ]
  },
  {
    "id": "star_channel",
    "name": "STAR CHANNEL",
    "country": "Chile",
    "group": "Pel├¡culas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46186.m3u8",
    "categories": [
      "PELICULAS"
    ]
  },
  {
    "id": "star_chanel_sd",
    "name": "STAR CHANEL SD",
    "country": "Chile",
    "group": "Pel├¡culas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46189.m3u8",
    "categories": [
      "GENERAL"
    ]
  },
  {
    "id": "studio_universal",
    "name": "STUDIO UNIVERSAL",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46220.m3u8",
    "categories": [
      "GENERAL"
    ]
  },
  {
    "id": "studio_universal_hd",
    "name": "STUDIO UNIVERSAL HD",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46223.m3u8",
    "categories": [
      "GENERAL"
    ]
  },
  {
    "id": "syfy",
    "name": "SYFY",
    "group": "Pel├¡culas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46224.m3u8",
    "categories": [
      "PELICULAS",
      "GENERAL"
    ]
  },
  {
    "id": "tnt_novelas",
    "name": "TNT NOVELAS",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tnt.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46227.m3u8",
    "categories": [
      "GENERAL"
    ]
  },
  {
    "id": "tcm_hd",
    "name": "TCM HD",
    "group": "Pel├¡culas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46231.m3u8",
    "categories": [
      "PELICULAS",
      "GENERAL"
    ]
  },
  {
    "id": "tlc_series",
    "name": "TLC SERIES",
    "country": "España",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46233.m3u8",
    "categories": [
      "GENERAL"
    ]
  },
  {
    "id": "tnt_tv_hd",
    "name": "TNT TV HD",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tnt.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46237.m3u8",
    "categories": [
      "GENERAL"
    ]
  },
  {
    "id": "tnt_fhd",
    "name": "TNT FHD",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tnt.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46239.m3u8",
    "categories": [
      "GENERAL"
    ]
  },
  {
    "id": "tnt_series",
    "name": "TNT SERIES",
    "country": "España",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tnt.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46240.m3u8",
    "categories": [
      "GENERAL"
    ]
  },
  {
    "id": "universal_tv",
    "name": "UNIVERSAL TV",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46245.m3u8",
    "categories": [
      "GENERAL"
    ]
  },
  {
    "id": "warner_tv",
    "name": "WARNER TV",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46248.m3u8",
    "categories": [
      "GENERAL"
    ]
  },
  {
    "id": "warner_hd",
    "name": "WARNER HD",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46249.m3u8",
    "categories": [
      "GENERAL"
    ]
  },
  {
    "id": "warner_fhd",
    "name": "WARNER FHD",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/46250.m3u8",
    "categories": [
      "GENERAL"
    ]
  },
  {
    "id": "mlb_network_zone_usa",
    "name": "MLB NETWORK ZONE USA",
    "country": "Estados Unidos",
    "group": "Deportes",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/1719064.m3u8",
    "categories": [
      "DEPORTES",
      "ESTADOS UNIDOS"
    ]
  },
  {
    "id": "wapa_deportes_puerto_rico",
    "name": "WAPA DEPORTES PUERTO RICO",
    "country": "Puerto Rico",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/19848.m3u8",
    "categories": [
      "PUERTO RICO"
    ]
  },
  {
    "id": "noticentro",
    "name": "NOTICENTRO",
    "country": "Puerto Rico",
    "group": "Noticias",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/19847.m3u8",
    "categories": [
      "PUERTO RICO"
    ]
  },
  {
    "id": "mega_tv",
    "name": "MEGA TV",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/19849.m3u8",
    "categories": [
      "GENERAL"
    ]
  },
  {
    "id": "telemundo_puerto_rico",
    "name": "TELEMUNDO PUERTO RICO",
    "country": "Puerto Rico",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/19851.m3u8",
    "categories": [
      "PUERTO RICO"
    ]
  },
  {
    "id": "punto_2_puerto_rico",
    "name": "PUNTO 2 PUERTO RICO",
    "country": "Puerto Rico",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/19853.m3u8",
    "categories": [
      "GENERAL"
    ]
  },
  {
    "id": "movistar_baloncesto",
    "name": "Movistar Baloncesto",
    "country": "España",
    "group": "Deportes",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=movistar.es",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/750197.m3u8",
    "categories": [
      "DEPORTES"
    ]
  },
  {
    "id": "directtv_sport_fight",
    "name": "Directtv Sport Fight",
    "group": "Deportes",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/149275.m3u8",
    "categories": [
      "GENERAL",
      "DEPORTES"
    ]
  },
  {
    "id": "ufc_fight_pass",
    "name": "UFC Fight Pass",
    "group": "Deportes",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/149276.m3u8",
    "categories": [
      "GENERAL",
      "DEPORTES"
    ]
  },
  {
    "id": "tyc_sports",
    "name": "TYC Sports",
    "group": "Deportes",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/712754.m3u8",
    "categories": [
      "DEPORTES"
    ]
  },
  {
    "id": "fox_sports_3",
    "name": "FOX Sports 3",
    "group": "Deportes",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=foxsports.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/712750.m3u8",
    "categories": [
      "DEPORTES"
    ]
  },
  {
    "id": "fox_sports_2",
    "name": "FOX Sports 2",
    "group": "Deportes",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=foxsports.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/712749.m3u8",
    "categories": [
      "DEPORTES"
    ]
  },
  {
    "id": "fox_sports",
    "name": "FOX Sports",
    "group": "Deportes",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=foxsports.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/712748.m3u8",
    "categories": [
      "DEPORTES"
    ]
  },
  {
    "id": "espn_premium",
    "name": "ESPN Premium",
    "group": "Deportes",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=espn.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/712747.m3u8",
    "categories": [
      "DEPORTES"
    ]
  },
  {
    "id": "espn_4_op2",
    "name": "ESPN 4 (Opción 2)",
    "group": "Deportes",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=espn.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/712746.m3u8",
    "categories": [
      "DEPORTES"
    ]
  },
  {
    "id": "espn_3_op2",
    "name": "ESPN 3 (Opción 2)",
    "group": "Deportes",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=espn.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/712745.m3u8",
    "categories": [
      "DEPORTES"
    ]
  },
  {
    "id": "espn_2_op2",
    "name": "ESPN 2 (Opción 2)",
    "group": "Deportes",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=espn.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/712744.m3u8",
    "categories": [
      "DEPORTES"
    ]
  },
  {
    "id": "espn",
    "name": "ESPN",
    "group": "Deportes",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=espn.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/712743.m3u8",
    "categories": [
      "DEPORTES"
    ]
  },
  {
    "id": "depor_tv",
    "name": "DEPOR TV",
    "group": "Deportes",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/712742.m3u8",
    "categories": [
      "DEPORTES"
    ]
  },
  {
    "id": "bein_sports",
    "name": "BEIN SPORTS",
    "group": "Deportes",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/592013.m3u8",
    "categories": [
      "DEPORTES"
    ]
  },
  {
    "id": "fox_deporte",
    "name": "FOX DEPORTE",
    "group": "Deportes",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=foxsports.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/592015.m3u8",
    "categories": [
      "DEPORTES"
    ]
  },
  {
    "id": "tudn",
    "name": "TUDN",
    "group": "Deportes",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/592018.m3u8",
    "categories": [
      "DEPORTES"
    ]
  },
  {
    "id": "fox_premium",
    "name": "FOX PREMIUM",
    "group": "Deportes",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=foxsports.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/592012.m3u8",
    "categories": [
      "DEPORTES"
    ]
  },
  {
    "id": "fox_sport_3",
    "name": "FOX SPORT 3",
    "group": "Deportes",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=foxsports.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/592011.m3u8",
    "categories": [
      "DEPORTES"
    ]
  },
  {
    "id": "fox_3",
    "name": "FOX 3",
    "group": "Deportes",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=foxsports.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/592009.m3u8",
    "categories": [
      "DEPORTES"
    ]
  },
  {
    "id": "fox_2",
    "name": "FOX 2",
    "group": "Deportes",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=foxsports.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/592005.m3u8",
    "categories": [
      "DEPORTES"
    ]
  },
  {
    "id": "fox_sports_mexico",
    "name": "FOX SPORTS MEXICO",
    "country": "México",
    "group": "Deportes",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=foxsports.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/592003.m3u8",
    "categories": [
      "DEPORTES"
    ]
  },
  {
    "id": "fox_sport_argen",
    "name": "FOX SPORT ARGEN",
    "country": "Argentina",
    "group": "Deportes",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=foxsports.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/592000.m3u8",
    "categories": [
      "GENERAL",
      "DEPORTES"
    ]
  },
  {
    "id": "direct_sports",
    "name": "Direct Sports",
    "group": "Deportes",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/417199.m3u8",
    "categories": [
      "DEPORTES"
    ]
  },
  {
    "id": "latina_noticias",
    "name": "Latina Noticias",
    "country": "Perú",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/9475.m3u8",
    "categories": [
      "PERU"
    ]
  },
  {
    "id": "america_tv",
    "name": "America Tv",
    "country": "Perú",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/9477.m3u8",
    "categories": [
      "PERU"
    ]
  },
  {
    "id": "panamericana_tv",
    "name": "Panamericana TV",
    "country": "Perú",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/9481.m3u8",
    "categories": [
      "PERU"
    ]
  },
  {
    "id": "atv_hd_directo",
    "name": "ATV HD Directo",
    "country": "Perú",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/9482.m3u8",
    "categories": [
      "PERU"
    ]
  },
  {
    "id": "rpp",
    "name": "RPP",
    "country": "Perú",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/9493.m3u8",
    "categories": [
      "PERU"
    ]
  },
  {
    "id": "movistar_deportes",
    "name": "Movistar Deportes",
    "country": "Perú",
    "group": "Pel├¡culas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=movistar.es",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/9466.m3u8",
    "categories": [
      "PERU"
    ]
  },
  {
    "id": "movistar_plus",
    "name": "Movistar Plus",
    "country": "Perú",
    "group": "Pel├¡culas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=movistar.es",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/9468.m3u8",
    "categories": [
      "PERU",
      "ESPAÑA"
    ]
  },
  {
    "id": "g",
    "name": "G",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/9499.m3u8",
    "categories": [
      "GENERAL"
    ]
  },
  {
    "id": "el_9_argentina",
    "name": "EL 9 Argentina",
    "country": "Argentina",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/712709.m3u8",
    "categories": [
      "GENERAL",
      "ARGENTINA"
    ]
  },
  {
    "id": "cr_nica_tv",
    "name": "Cr├│nica TV",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/712707.m3u8",
    "categories": [
      "GENERAL"
    ]
  },
  {
    "id": "c5n",
    "name": "C5N",
    "country": "Argentina",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/712705.m3u8",
    "categories": [
      "ARGENTINA"
    ]
  },
  {
    "id": "america_tv_arg",
    "name": "AMERICA TV ARG",
    "country": "Argentina",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/712704.m3u8",
    "categories": [
      "GENERAL",
      "ARGENTINA"
    ]
  },
  {
    "id": "el_trece_arg",
    "name": "EL TRECE ARG",
    "country": "Argentina",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/712711.m3u8",
    "categories": [
      "GENERAL",
      "ARGENTINA"
    ]
  },
  {
    "id": "telefe",
    "name": "Telefe",
    "country": "Argentina",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/712715.m3u8",
    "categories": [
      "ARGENTINA"
    ]
  },
  {
    "id": "tn_noticias",
    "name": "TN NOTICIAS",
    "country": "Argentina",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/712718.m3u8",
    "categories": [
      "ARGENTINA"
    ]
  },
  {
    "id": "tv_publica_arg",
    "name": "TV Publica Arg",
    "country": "Argentina",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/712719.m3u8",
    "categories": [
      "GENERAL",
      "ARGENTINA"
    ]
  },
  {
    "id": "canal_26",
    "name": "Canal 26",
    "country": "Argentina",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/712725.m3u8",
    "categories": [
      "ARGENTINA"
    ]
  },
  {
    "id": "chile_visi_n",
    "name": "Chile Visi├│n",
    "country": "Chile",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/9827.m3u8",
    "categories": [
      "GENERAL"
    ]
  },
  {
    "id": "mega_noticias",
    "name": "Mega Noticias",
    "country": "Chile",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/9824.m3u8",
    "categories": [
      "GENERAL",
      "CHILE"
    ]
  },
  {
    "id": "tv_chile",
    "name": "TV Chile",
    "country": "Chile",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/9820.m3u8",
    "categories": [
      "CHILE"
    ]
  },
  {
    "id": "canal_13_chile",
    "name": "Canal 13 Chile",
    "country": "Chile",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/33118.m3u8",
    "categories": [
      "CHILE"
    ]
  },
  {
    "id": "la_red_chile",
    "name": "La Red Chile",
    "country": "Chile",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/33117.m3u8",
    "categories": [
      "CHILE"
    ]
  },
  {
    "id": "rcn_noticias_colombia",
    "name": "RCN Noticias Colombia",
    "country": "Colombia",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/13782.m3u8",
    "categories": [
      "COLOMBIA"
    ]
  },
  {
    "id": "caracol_internacional",
    "name": "Caracol Internacional",
    "country": "Colombia",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/13778.m3u8",
    "categories": [
      "COLOMBIA"
    ]
  },
  {
    "id": "rcn_internacional",
    "name": "RCN Internacional",
    "country": "Colombia",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/13783.m3u8",
    "categories": [
      "COLOMBIA"
    ]
  },
  {
    "id": "rcn",
    "name": "RCN",
    "country": "Colombia",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/1331813.m3u8",
    "categories": [
      "COLOMBIA"
    ]
  },
  {
    "id": "city_tv",
    "name": "City Tv",
    "country": "Colombia",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/1331820.m3u8",
    "categories": [
      "COLOMBIA"
    ]
  },
  {
    "id": "capital_colombia",
    "name": "Capital Colombia",
    "country": "Colombia",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/1331822.m3u8",
    "categories": [
      "COLOMBIA"
    ]
  },
  {
    "id": "la_kalle_colombia_musica",
    "name": "La Kalle Colombia Musica",
    "country": "Colombia",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/1331824.m3u8",
    "categories": [
      "COLOMBIA"
    ]
  },
  {
    "id": "ntn24",
    "name": "NTN24",
    "country": "Colombia",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/1331825.m3u8",
    "categories": [
      "COLOMBIA"
    ]
  },
  {
    "id": "red_noticias",
    "name": "RED Noticias",
    "country": "Colombia",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/1331827.m3u8",
    "categories": [
      "COLOMBIA"
    ]
  },
  {
    "id": "amc_series",
    "name": "AMC Series",
    "country": "España",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/79064.m3u8",
    "categories": [
      "GENERAL"
    ]
  },
  {
    "id": "gourmet",
    "name": "Gourmet",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/79061.m3u8",
    "categories": [
      "GENERAL"
    ]
  },
  {
    "id": "gourmet_latino",
    "name": "Gourmet Latino",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/79060.m3u8",
    "categories": [
      "GENERAL"
    ]
  },
  {
    "id": "comedy_central",
    "name": "Comedy Central",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/79058.m3u8",
    "categories": [
      "GENERAL"
    ]
  },
  {
    "id": "tlc",
    "name": "TLC",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/79071.m3u8",
    "categories": [
      "GENERAL"
    ]
  },
  {
    "id": "todo_novelas",
    "name": "Todo Novelas",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/79074.m3u8",
    "categories": [
      "GENERAL"
    ]
  },
  {
    "id": "telenovelas",
    "name": "Telenovelas",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/79075.m3u8",
    "categories": [
      "GENERAL"
    ]
  },
  {
    "id": "univisi_n",
    "name": "Univisi├│n",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/254506.m3u8",
    "categories": [
      "GENERAL"
    ]
  },
  {
    "id": "unimas",
    "name": "UniMas",
    "group": "Deportes",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/254505.m3u8",
    "categories": [
      "DEPORTES"
    ]
  },
  {
    "id": "telemundo_dallas",
    "name": "Telemundo Dallas",
    "group": "Noticias",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/254502.m3u8",
    "categories": [
      "NOTICIAS"
    ]
  },
  {
    "id": "univisi_n_mex",
    "name": "Univisi├│n Mex",
    "country": "México",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/254501.m3u8",
    "categories": [
      "GENERAL"
    ]
  },
  {
    "id": "gala_visi_n",
    "name": "Gala Visi├│n",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/254494.m3u8",
    "categories": [
      "GENERAL"
    ]
  },
  {
    "id": "vix",
    "name": "VIX",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/79079.m3u8",
    "categories": [
      "GENERAL"
    ]
  },
  {
    "id": "dw_noticias",
    "name": "DW Noticias",
    "group": "Noticias",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/79084.m3u8",
    "categories": [
      "NOTICIAS"
    ]
  },
  {
    "id": "cnn_en_espa_ol",
    "name": "CNN en Espa├▒ol",
    "country": "España",
    "group": "Noticias",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=cnn.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/79088.m3u8",
    "categories": [
      "NOTICIAS"
    ]
  },
  {
    "id": "cnn_chile",
    "name": "CNN Chile",
    "country": "Chile",
    "group": "Noticias",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=cnn.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/79090.m3u8",
    "categories": [
      "NOTICIAS",
      "CHILE"
    ]
  },
  {
    "id": "cnn_usa",
    "name": "CNN USA",
    "country": "Estados Unidos",
    "group": "Noticias",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=cnn.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/597240.m3u8",
    "categories": [
      "ESTADOS UNIDOS"
    ]
  },
  {
    "id": "abc_news_live",
    "name": "ABC News Live",
    "country": "Estados Unidos",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/597256.m3u8",
    "categories": [
      "ESTADOS UNIDOS"
    ]
  },
  {
    "id": "fox_news",
    "name": "FOX News",
    "country": "Estados Unidos",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=foxsports.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/597235.m3u8",
    "categories": [
      "ESTADOS UNIDOS"
    ]
  },
  {
    "id": "msnbc",
    "name": "MSNBC",
    "country": "Estados Unidos",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/597233.m3u8",
    "categories": [
      "ESTADOS UNIDOS"
    ]
  },
  {
    "id": "new12_new_jersey",
    "name": "New12 New Jersey",
    "country": "Estados Unidos",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/597230.m3u8",
    "categories": [
      "ESTADOS UNIDOS"
    ]
  },
  {
    "id": "news_12_the_bronx",
    "name": "News 12 The Bronx",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/597229.m3u8",
    "categories": [
      "GENERAL"
    ]
  },
  {
    "id": "news_max",
    "name": "NEWS MAX",
    "country": "Estados Unidos",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/597227.m3u8",
    "categories": [
      "ESTADOS UNIDOS"
    ]
  },
  {
    "id": "one_america_news_hd",
    "name": "One America News HD",
    "country": "Estados Unidos",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/597225.m3u8",
    "categories": [
      "ESTADOS UNIDOS"
    ]
  },
  {
    "id": "cheddar_news_fhd",
    "name": "Cheddar News FHD",
    "country": "Chile",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/597244.m3u8",
    "categories": [
      "ESTADOS UNIDOS"
    ]
  },
  {
    "id": "alf_24_7",
    "name": "ALF 24/7",
    "group": "Entretenimiento 24/7",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/783515.m3u8",
    "categories": [
      "24/7"
    ]
  },
  {
    "id": "los_simpson_24_7",
    "name": "Los Simpson 24/7",
    "group": "Entretenimiento 24/7",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=fox.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/575761.m3u8",
    "categories": [
      "24/7"
    ]
  },
  {
    "id": "los_simpson_hd",
    "name": "Los Simpson HD",
    "group": "Entretenimiento 24/7",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=fox.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/575762.m3u8",
    "categories": [
      "24/7"
    ]
  },
  {
    "id": "transformes_24_7",
    "name": "Transformes 24/7",
    "country": "España",
    "group": "Entretenimiento 24/7",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/428517.m3u8",
    "categories": [
      "24/7"
    ]
  },
  {
    "id": "los_4_fantasticos_24_7",
    "name": "Los 4 Fantasticos 24/7",
    "group": "Entretenimiento 24/7",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/428519.m3u8",
    "categories": [
      "24/7"
    ]
  },
  {
    "id": "caballeros_del_zodiaco_24_7",
    "name": "Caballeros del zodiaco 24/7",
    "group": "Entretenimiento 24/7",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/428557.m3u8",
    "categories": [
      "24/7"
    ]
  },
  {
    "id": "el_pr_ncipe_del_rap",
    "name": "El pr├¡ncipe del Rap",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/575737.m3u8",
    "categories": [
      "GENERAL"
    ]
  },
  {
    "id": "friends_24_7",
    "name": "Friends 24/7",
    "group": "Entretenimiento 24/7",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/575738.m3u8",
    "categories": [
      "24/7"
    ]
  },
  {
    "id": "pablo_escobar_24_7",
    "name": "Pablo Escobar 24/7",
    "country": "España",
    "group": "Entretenimiento 24/7",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/575741.m3u8",
    "categories": [
      "24/7"
    ]
  },
  {
    "id": "el_origen_extraparanormal",
    "name": "El Origen Extraparanormal",
    "group": "Entretenimiento 24/7",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/575742.m3u8",
    "categories": [
      "GENERAL",
      "24/7"
    ]
  },
  {
    "id": "hechizada_24_7",
    "name": "Hechizada 24/7",
    "country": "Chile",
    "group": "Entretenimiento 24/7",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/575745.m3u8",
    "categories": [
      "24/7"
    ]
  },
  {
    "id": "jhonny_bravo_24_7",
    "name": "Jhonny Bravo 24/7",
    "group": "Entretenimiento 24/7",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/575747.m3u8",
    "categories": [
      "24/7"
    ]
  },
  {
    "id": "la_casa_de_papel",
    "name": "La Casa De Papel",
    "group": "Entretenimiento 24/7",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/575750.m3u8",
    "categories": [
      "24/7"
    ]
  },
  {
    "id": "la_pantera_rosa",
    "name": "La Pantera Rosa",
    "group": "Entretenimiento 24/7",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/575754.m3u8",
    "categories": [
      "24/7"
    ]
  },
  {
    "id": "los_thubder_cats_24_7",
    "name": "Los Thubder Cats 24/7",
    "group": "Entretenimiento 24/7",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/575764.m3u8",
    "categories": [
      "24/7"
    ]
  },
  {
    "id": "pok_mon_24_7",
    "name": "Pok├®mon 24/7",
    "group": "Entretenimiento 24/7",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/miatorres7/Stream2025/575769.m3u8",
    "categories": [
      "24/7"
    ]
  },
  {
    "id": "el_chavo_del_8",
    "name": "El Chavo del 8",
    "country": "Chile",
    "group": "Entretenimiento 24/7",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/575793.m3u8",
    "categories": [
      "24/7"
    ]
  },
  {
    "id": "los_locos_addams",
    "name": "Los Locos Adams",
    "group": "Entretenimiento 24/7",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/575795.m3u8",
    "categories": [
      "24/7"
    ]
  },
  {
    "id": "el_coche_del_futuro_24_7",
    "name": "El Coche del Futuro 24/7",
    "group": "Entretenimiento 24/7",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/miatorres7/Stream2025/575631.m3u8",
    "categories": [
      "24/7"
    ]
  },
  {
    "id": "dragon_ball_z_24_7",
    "name": "Dragon Ball Z 24/7",
    "group": "Entretenimiento 24/7",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/miatorres7/Stream2025/575725.m3u8",
    "categories": [
      "GENERAL",
      "24/7"
    ]
  },
  {
    "id": "futurama_24_7",
    "name": "Futurama 24/7",
    "group": "Entretenimiento 24/7",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=fox.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/miatorres7/Stream2025/575744.m3u8",
    "categories": [
      "24/7"
    ]
  },
  {
    "id": "los_simpson_news_24_7",
    "name": "Los Simpson News 24/7",
    "group": "Entretenimiento 24/7",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=fox.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/miatorres7/Stream2025/575762.m3u8",
    "categories": [
      "24/7"
    ]
  },
  {
    "id": "cine_terror_24_7",
    "name": "Cine Terror 24/7",
    "group": "Entretenimiento 24/7",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/miatorres7/Stream2025/575790.m3u8",
    "categories": [
      "PELICULAS",
      "24/7"
    ]
  },
  {
    "id": "malcolm_24_7",
    "name": "Malcolm 24/7",
    "group": "Entretenimiento 24/7",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=fox.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/miatorres7/Stream2025/575795.m3u8",
    "categories": [
      "24/7"
    ]
  },
  {
    "id": "naruto_24_7",
    "name": "Naruto 24/7",
    "group": "Entretenimiento 24/7",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/miatorres7/Stream2025/575798.m3u8",
    "categories": [
      "24/7"
    ]
  },
  {
    "id": "super_campeones_24_7",
    "name": "Super Campeones 24/7",
    "group": "Entretenimiento 24/7",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/miatorres7/Stream2025/575807.m3u8",
    "categories": [
      "24/7"
    ]
  },
  {
    "id": "los_tres_chiflados_24_7",
    "name": "Los Tres Chiflados 24/7",
    "group": "Entretenimiento 24/7",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "http://cloudtvserviceplatinum.site:8080/live/miatorres7/Stream2025/737501.m3u8",
    "categories": [
      "24/7"
    ]
  },
  {
    "id": "el_chiringuito",
    "name": "el chiringuito",
    "country": "Chile",
    "group": "Generalistas",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=tv.com",
    "url": "https://euc13.playlist.ttvnw.net/v1/playlist/CqcFbxAmNmaCD4Pi64HtzFN8ywq9AUYAtRgw1kyAPkOz_qeJN9kN_2zMjGGM7DHiOMHZEJkj9SXu0_DpJMegGBg09bzV9g2kXWnhoiCts4hYbD2ESYPY1x49XGdlLRUm9dLWNMwkySN95EZVESWmpFdypD2alV-Er_LBy5VBhdtggLIC66ZRUxHkdNnJdbgxkQOlkPP5EGxT85nmjHKXrFVYrFV7Sl6dTdYuDJFPf1pRoPEJYvDW_IcTWqpXSKZ4hrHooeN3K7abIQTqVZyXZi_5JohCSck1rF8qKrmrbcOfug3aToRq2w9dr1Ti99kuo8gQTXzUHowgvXgkbdGJkJrjJUoLwW8MCExj3daxuimBC6CbLmN3kgi694Epc_kyEnW9Fy34_7pJn_9cVXH2ZHtsb0BIloRZe3eqcgc95U2TFZGX9ZOrwy4LVvM1B6g076t9twdMm_Eb_JnluurjqLtHpdhT0lkQKQ8Px-X5VjZELI_tLN7DD8JPDXNJ1ebgHY5UQ937K7SZ4pGJjDPXTjrLIVNrEU4910cxT_j7gpRbiRu1NKDhaYWGXnI32nMGO0CWvYVcCrbb-4h2SesYJB3Zy4WlJ1TXdP2PIW9pCmufoxKtVcQpSH6v9oBYgmrEpShzgUR7L0RTeqNVVnIZ85ZMCaVxmnDCIwNI9QYAJp1NhpalLWKxK7MroU0GzVvKzQ1pVg_vIcNW0hlVwiXNpOanzt8o3GcdJyP_d9M6Tud9NGiXEtaIoo5qwDvOCZQmnC7nzoemUK3XQozlLdsc2JqJznVGHNTb__UdmprgtUSgzfHLtNLnR6eo5-pWMQEuuaK0w2FJ4nrswN-qdbAVIBP4nC6we_9czPerbno8Tc19nCB2ZPQX83ZeAfIRa7Q6693CdybVE4OMlxoMsaW-XV-Mlb_jQgdyIAEqCWV1LXdlc3QtMjCjEA.m3u8",
    "categories": [
      "GENERAL"
    ]
  }
];

interface IPTVPlayerProps {
  onClose: () => void;
}

export const IPTVPlayer: React.FC<IPTVPlayerProps> = ({ onClose }) => {
  const [activeChannel, setActiveChannel] = useState<IPTVChannel>(IPTV_CHANNELS[2]); // Default Antena 3 or Telecinco
  const [activeCategory, setActiveCategory] = useState<string>('TODOS');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  // Ordered categories exactly as requested by user
  const categories = [
    'TODOS',
    'ESPAÑA',
    'PELICULAS',
    'NOTICIAS',
    'GENERAL',
    'DEPORTES',
    'ESTADOS UNIDOS',
    'PERU',
    'ARGENTINA',
    'CHILE',
    'COLOMBIA',
    'PUERTO RICO',
    '24/7'
  ];

  const getFlag = (name: string) => {
    if (name === 'TODOS') return '📺 ';
    if (name === 'ESPAÑA') return '🇪🇸 ';
    if (name === 'PELICULAS') return '🎬 ';
    if (name === 'NOTICIAS') return '📰 ';
    if (name === 'GENERAL') return '📡 ';
    if (name === 'DEPORTES') return '⚽ ';
    if (name === 'ESTADOS UNIDOS') return '🇺🇸 ';
    if (name === 'PERU') return '🇵🇪 ';
    if (name === 'ARGENTINA') return '🇦🇷 ';
    if (name === 'CHILE') return '🇨🇱 ';
    if (name === 'COLOMBIA') return '🇨🇴 ';
    if (name === 'PUERTO RICO') return '🇵🇷 ';
    if (name === '24/7') return '🍿 ';
    return '';
  };

  const handleCategoryChange = (newCategory: string) => {
    setActiveCategory(newCategory);
    // If switching away from DEPORTES/TODOS and current channel is ESPN, auto-switch to first channel of that category
    if (newCategory !== 'TODOS' && newCategory !== 'DEPORTES') {
      const available = IPTV_CHANNELS.filter(c => {
        if (c.name.toLowerCase().includes('espn') || c.id.toLowerCase().includes('espn')) {
          return false;
        }
        return c.categories?.includes(newCategory) || c.group === newCategory || c.country === newCategory;
      });
      if (available.length > 0 && (activeChannel.name.toLowerCase().includes('espn') || !available.some(c => c.id === activeChannel.id))) {
        setActiveChannel(available[0]);
      }
    }
  };

  const filteredByCategory = activeCategory === 'TODOS' 
    ? IPTV_CHANNELS 
    : IPTV_CHANNELS.filter(c => {
        // STRICT RULE: ESPN channels can ONLY exist inside DEPORTES
        if (c.name.toLowerCase().includes('espn') || c.id.toLowerCase().includes('espn')) {
          return activeCategory === 'DEPORTES';
        }
        return c.categories?.includes(activeCategory) || c.group === activeCategory || c.country === activeCategory;
      });
    
  const filteredChannels = searchQuery.trim() === '' 
    ? filteredByCategory 
    : filteredByCategory.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
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
  };  // Premium Dark Glow Theme
  const theme = {
    bgApp: 'bg-[#0E060A]',
    headerBg: 'bg-[#080306]/95',
    borderColor: 'border-[#E0457B]/20',
    cardInner: 'bg-white/[0.03]',
    cardBorder: 'border-white/[0.08]',
    cardActive: 'bg-gradient-to-r from-[#E0457B]/25 via-[#E0457B]/10 to-transparent border-[#E0457B]/80 shadow-[0_0_20px_rgba(224,69,123,0.2)]',
    accent: 'text-[#E0457B]',
    accentBg: 'bg-[#E0457B]',
  };

  return (
    <div className={`fixed inset-0 z-[10000] flex flex-col ${theme.bgApp} text-white animate-in fade-in duration-300 font-satoshi`} data-lenis-prevent>
      {/* HEADER */}
      <header className={`flex items-center justify-between px-4 sm:px-6 py-3.5 ${theme.headerBg} border-b ${theme.borderColor} backdrop-blur-2xl shadow-xl z-20 flex-shrink-0`}>
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#E0457B] to-[#7B173D] shadow-[0_0_20px_rgba(224,69,123,0.45)] border border-white/20">
            <Tv size={20} className="text-white drop-shadow" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border border-black"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-panchang text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-white">Noticias en Vivo</h2>
              <span className="hidden xs:inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">EN DIRECTO</span>
            </div>
            <p className="font-satoshi text-[10px] sm:text-[11px] tracking-wider text-white/50 uppercase">Canales en Alta Definición</p>
          </div>
        </div>

        {/* CURRENTLY PLAYING BADGE (Desktop) */}
        <div className="hidden lg:flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-xl shadow-inner">
          <span className="w-2 h-2 rounded-full bg-[#E0457B] animate-pulse"></span>
          <span className="font-satoshi text-xs text-white/50">Reproduciendo:</span>
          <span className="font-panchang text-xs text-white font-bold tracking-wide truncate max-w-xs">{activeChannel.name}</span>
        </div>
        
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#E0457B] border border-white/15 flex items-center justify-center text-white transition-all duration-200 shadow-md cursor-pointer hover:scale-105 active:scale-95"
          title="Cerrar reproductor"
        >
          <X size={18} />
        </button>
      </header>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* VIDEO PLAYER AREA */}
        <div className="w-full h-[34vh] sm:h-[40vh] md:h-full md:flex-1 flex flex-col relative bg-black flex-shrink-0">
          <div className="relative flex-1 w-full flex items-center justify-center group overflow-hidden bg-black">
            {/* Ambient Background Aura */}
            <div className="absolute inset-0 bg-radial from-[#E0457B]/10 via-transparent to-transparent pointer-events-none opacity-40 blur-2xl" />

            {/* Top-Left Live Stream Status Chip */}
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/15 shadow-xl pointer-events-none">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="font-panchang text-[9px] sm:text-[10px] font-bold text-white tracking-widest uppercase">EN VIVO</span>
              <span className="w-px h-3 bg-white/20"></span>
              <span className="font-satoshi text-xs text-white font-bold truncate max-w-[150px] sm:max-w-xs">{activeChannel.name}</span>
            </div>

            {isLoading && !hasError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/75 z-10 backdrop-blur-sm">
                <Loader2 className="w-10 h-10 text-[#E0457B] animate-spin mb-3 drop-shadow-[0_0_15px_rgba(224,69,123,0.8)]" />
                <span className="font-satoshi text-xs tracking-widest uppercase text-white/80 font-bold">Conectando señal...</span>
              </div>
            )}
            
            {hasError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#140A0E] z-10 px-6 text-center">
                <div className="w-14 h-14 rounded-full bg-red-900/30 border border-red-500/30 flex items-center justify-center mb-3">
                  <Square className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="font-panchang text-sm tracking-widest text-white/90 mb-1.5">Error de Reproducción</h3>
                <p className="font-satoshi text-xs text-white/50 max-w-md">No se puede reproducir la señal de {activeChannel.name}. Podría estar temporalmente desconectada.</p>
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

            {/* OSD (On Screen Display Controls) */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 sm:p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex items-center justify-between max-w-5xl mx-auto bg-black/70 backdrop-blur-2xl border border-white/15 rounded-2xl p-3 sm:p-4 shadow-2xl">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <button 
                    onClick={togglePlay} 
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-[#E0457B] to-[#C92C62] text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(224,69,123,0.6)] cursor-pointer flex-shrink-0"
                    title={isPlaying ? "Pausar" : "Reproducir"}
                  >
                    {isPlaying ? <Square size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
                  </button>
                  <div className="min-w-0">
                    <h3 className="font-panchang text-xs sm:text-sm font-bold uppercase tracking-wider text-white truncate">{activeChannel.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                      <span className="font-satoshi text-[10px] text-white/60 tracking-wider uppercase">Directo HD</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                  <button onClick={toggleMute} className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center transition-colors text-white" title={isMuted ? "Activar sonido" : "Silenciar"}>
                    {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </button>
                  <button onClick={requestFullscreen} className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center transition-colors text-white" title="Pantalla completa">
                    <Maximize size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CHANNEL LIST SIDEBAR (Desktop) / BOTTOM SECTION (Mobile) */}
        <div className="w-full flex-1 md:flex-initial md:w-[380px] lg:w-[430px] flex-shrink-0 border-t md:border-t-0 md:border-l border-white/10 flex flex-col h-full bg-[#0B0408]/95 backdrop-blur-3xl shadow-2xl relative z-10">
          
          {/* STICKY CONTROL BAR: TITLE, DROPDOWN, PILLS & SEARCH */}
          <div className="p-3.5 sm:p-5 border-b border-white/10 bg-gradient-to-b from-[#12070D] to-[#0B0408]/90 backdrop-blur-2xl space-y-3">
            
            {/* Header: Title + Channel Count Badge */}
            <div className="flex items-center justify-between">
              <h3 className="font-panchang text-xs sm:text-xs font-bold tracking-[0.25em] uppercase text-white/80 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#E0457B] animate-pulse shadow-[0_0_10px_rgba(224,69,123,0.8)]"></span>
                Directorio de Canales
              </h3>
              <span className="font-satoshi text-[11px] font-bold text-[#E0457B] bg-[#E0457B]/15 border border-[#E0457B]/30 px-2.5 py-0.5 rounded-full">
                {filteredChannels.length} canales
              </span>
            </div>
            
            {/* 1. Large Touch-Friendly Category Dropdown (Mobile-Optimized) */}
            <div className="relative">
              <select 
                value={activeCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full h-12 sm:h-12 bg-black/60 hover:bg-black/80 border border-white/15 focus:border-[#E0457B] rounded-xl px-4 pr-11 text-sm sm:text-base font-bold text-white tracking-wide appearance-none focus:outline-none transition-all cursor-pointer shadow-lg"
              >
                {categories.map(category => (
                  <option key={category} value={category} className="bg-[#140A0E] text-white py-2 text-sm font-bold">
                    {getFlag(category)} {category}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#E0457B]">
                <ChevronDown size={18} />
              </div>
            </div>

            {/* 3. Sleek Search Input */}
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
              <input 
                type="text" 
                placeholder="Buscar canal por nombre..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 bg-white/[0.04] border border-white/10 focus:border-[#E0457B]/70 rounded-xl pl-10 pr-9 text-xs sm:text-sm text-white placeholder-white/35 font-satoshi focus:outline-none focus:bg-white/[0.07] transition-all shadow-inner"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white p-1"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
          
          {/* CHANNEL LIST */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5 custom-scrollbar" data-lenis-prevent>
            {filteredChannels.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                <Tv size={36} className="text-white/20 mb-3" />
                <p className="font-satoshi text-sm text-white/60 font-medium">No se encontraron canales en esta categoría</p>
                <button 
                  onClick={() => { setActiveCategory('TODOS'); setSearchQuery(''); }}
                  className="mt-3 px-4 py-2 rounded-xl bg-white/10 hover:bg-[#E0457B] text-xs font-bold uppercase tracking-wider text-white transition-colors"
                >
                  Ver todos los canales
                </button>
              </div>
            ) : (
              filteredChannels.map((channel, idx) => {
                const isActive = activeChannel.id === channel.id;
                return (
                  <button
                    key={`${channel.id}-${idx}`}
                    onClick={() => setActiveChannel(channel)}
                    className={`w-full flex items-center gap-3.5 p-3 sm:p-3.5 rounded-2xl transition-all duration-200 border cursor-pointer text-left group active:scale-[0.99] ${
                      isActive 
                        ? theme.cardActive 
                        : '${theme.cardInner} ${theme.cardBorder} hover:bg-white/[0.08] hover:border-white/20'
                    }`}
                  >
                    {/* Channel Logo Frame */}
                    <div className={`w-[52px] h-[52px] sm:w-[56px] sm:h-[56px] rounded-xl flex items-center justify-center flex-shrink-0 p-2 transition-all shadow-inner ${
                      isActive 
                        ? 'bg-black/80 border border-[#E0457B]/60 shadow-[0_0_15px_rgba(224,69,123,0.3)]' 
                        : 'bg-black/50 border border-white/10 group-hover:border-white/20'
                    }`}>
                      <img 
                        src={channel.logo} 
                        alt={channel.name} 
                        className="max-w-full max-h-full object-contain drop-shadow" 
                        loading="lazy"
                      />
                    </div>

                    {/* Channel Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-satoshi font-bold text-sm sm:text-base tracking-wide truncate transition-colors ${
                        isActive ? 'text-white' : 'text-white/90 group-hover:text-white'
                      }`}>
                        {channel.name}
                      </h4>
                      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                        {channel.categories && channel.categories.length > 0 ? (
                          <span className="text-[10px] font-bold tracking-wider text-[#E0457B] bg-[#E0457B]/15 border border-[#E0457B]/30 px-2 py-0.5 rounded-md uppercase">
                            {channel.categories[0]}
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold tracking-wider text-[#E0457B] bg-[#E0457B]/15 border border-[#E0457B]/30 px-2 py-0.5 rounded-md uppercase">
                            {channel.group}
                          </span>
                        )}
                        {channel.country && (
                          <span className="text-[10px] font-medium tracking-wider text-white/60 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md">
                            {channel.country}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Active Live Equalizer Bars */}
                    {isActive && (
                      <div className="flex items-end gap-1 px-2 py-1 flex-shrink-0">
                        <span className="w-1 bg-[#E0457B] rounded-full animate-bounce h-4" style={{ animationDelay: '0ms' }} />
                        <span className="w-1 bg-[#E0457B] rounded-full animate-bounce h-6" style={{ animationDelay: '150ms' }} />
                        <span className="w-1 bg-[#E0457B] rounded-full animate-bounce h-3" style={{ animationDelay: '300ms' }} />
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.2);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(224, 69, 123, 0.4);
          border-radius: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(224, 69, 123, 0.8);
        }
        .custom-scrollbar-horizontal::-webkit-scrollbar {
          height: 3px;
        }
        .custom-scrollbar-horizontal::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar-horizontal::-webkit-scrollbar-thumb {
          background: rgba(224, 69, 123, 0.3);
          border-radius: 3px;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
};
