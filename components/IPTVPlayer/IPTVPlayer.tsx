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
    name: "La 1",
    group: "Generalistas",
    logo: "/images/channels/la1.png",
    url: "https://rtvelivestream.rtve.es/rtvesec/la1/la1_main_dvr.m3u8"
  },
  {
    id: "la_1_hd",
    name: "La 1 Hd",
    group: "Generalistas",
    logo: "/images/channels/la1.png",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/414798.m3u8"
  },
  {
    id: "la_2",
    name: "La 2",
    group: "Generalistas",
    logo: "/images/channels/la2.png",
    url: "https://rtvelivestream.rtve.es/rtvesec/la2/la2_main.m3u8"
  },
  {
    id: "antena_3",
    name: "Antena 3",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=antena3.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/414792.m3u8"
  },
  {
    id: "cuatro",
    name: "Cuatro",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=cuatro.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/414791.m3u8"
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
    name: "La Sexta",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=lasexta.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/414783.m3u8"
  },

  {
    id: "odisea_4k",
    name: "Odisea 4K",
    group: "Documentales",
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
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=nationalgeographic.es",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/414737.m3u8"
  },
  {
    id: "national_geographic",
    name: "National Geographic",
    group: "Documentales",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=nationalgeographic.es",
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
    group: "Infantil",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=nickelodeon.es",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/414712.m3u8"
  },
  {
    id: "sudance_tv",
    name: "Sudance Tv",
    group: "Cine",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=sundancetv.es",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/414698.m3u8"
  },
  {
    id: "mtv",
    name: "Mtv",
    group: "Música",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=mtv.es",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/414696.m3u8"
  },
  {
    id: "movistar_plus+",
    name: "Movistar Plus+",
    group: "Premium",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=movistarplus.es",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/414775.m3u8"
  },
  {
    id: "24_horas",
    name: "24 Horas",
    group: "Informativos",
    logo: "/images/channels/24h.png",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/414778.m3u8"
  },
  {
    id: "movistar_originales",
    name: "Movistar Originales",
    group: "Premium",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=movistarplus.es",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/414804.m3u8"
  },
  {
    id: "futbol_es",
    name: "Futbol Es",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=laliga.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/1328682.m3u8"
  },
  {
    id: "dazn",
    name: "Dazn",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=dazn.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/1328692.m3u8"
  },
  {
    id: "veo_7",
    name: "Veo 7",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=marca.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/1328737.m3u8"
  },
  {
    id: "movistar_baloncesto_2",
    name: "Movistar Baloncesto 2",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=movistarplus.es",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/750204.m3u8"
  },
  {
    id: "movistar_baloncesto",
    name: "Movistar Baloncesto",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=movistarplus.es",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/750197.m3u8"
  },
  {
    id: "directtv_sport_fight",
    name: "Directtv Sport Fight",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=directv.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/149275.m3u8"
  },
  {
    id: "ufc_fight_pass",
    name: "Ufc Fight Pass",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=ufc.com",
    url: "http://cloudtvserviceplatinum.site:8080/live/rosalmadabas/6789098710/149276.m3u8"
  },
  {
    id: "a24_ar",
    name: "A24 Argentina",
    group: "Noticias",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=a24.com",
    url: "https://g5.vxral-slo.transport.edge-access.net/a12/ngrp:a24-100056_all/playlist.m3u8?sense=true"
  },
  {
    id: "america_tv_pe",
    name: "América TV (Perú)",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=americatv.com.pe",
    url: "https://live-bd1.tv360.bitel.com.pe/manifest/america/master_clean_source.m3u8"
  },
  {
    id: "canal_1_co",
    name: "Canal 1 (Colombia)",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=canal1.com.co",
    url: "http://138.121.15.230:9002/CANAL-UNO/index.m3u8"
  },
  {
    id: "13c_cl",
    name: "13C (Chile)",
    group: "Generalistas",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=13c.cl",
    url: "https://origin.dpsgo.com/ssai/event/GI-9cp_bT8KcerLpZwkuhw/master.m3u8"
  },
  {
    id: "azteca_deportes_mx",
    name: "Azteca Deportes (MX)",
    group: "Deportes",
    logo: "https://www.google.com/s2/favicons?sz=128&domain_url=tvazteca.com",
    url: "http://38.194.226.190:8000/play/a02r/index.m3u8"
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
