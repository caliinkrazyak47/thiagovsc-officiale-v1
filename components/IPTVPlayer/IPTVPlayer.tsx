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
    "id": "la_1",
    "name": "La 1 (TVE)",
    "country": "España",
    "group": "Noticias",
    "logo": "/images/channels/la1.png",
    "url": "https://rtvelivestream.rtve.es/rtvesec/la1/la1_main_dvr.m3u8"
  },
  {
    "id": "la_2",
    "name": "La 2 (TVE)",
    "country": "España",
    "group": "Noticias",
    "logo": "/images/channels/la2.png",
    "url": "https://rtvelivestream.rtve.es/rtvesec/la2/la2_main.m3u8"
  },
  {
    "id": "canal_24h",
    "name": "Canal 24 Horas Noticias",
    "country": "España",
    "group": "Noticias",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=rtve.es",
    "url": "https://rtvelivestream.rtve.es/rtvesec/24h/24h_main_dvr.m3u8"
  },
  {
    "id": "antena_3",
    "name": "Antena 3",
    "country": "España",
    "group": "Noticias",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=antena3.com",
    "url": "http://179.60.224.196:8000/play/a0f2/index.m3u8"
  },
  {
    "id": "dw_noticias",
    "name": "DW Noticias Español",
    "country": "Alemania",
    "group": "Noticias",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=dw.com",
    "url": "https://dwamdstream104.akamaized.net/hls/live/2015530/dwstream104/index.m3u8"
  },
  {
    "id": "teledeporte",
    "name": "Teledeporte (TDP)",
    "country": "España",
    "group": "Deportes",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=rtve.es",
    "url": "https://rtvelivestream.rtve.es/rtvesec/tdp/tdp_main_dvr.m3u8"
  },
  {
    "id": "clan_tv",
    "name": "Clan TV",
    "country": "España",
    "group": "Entretenimiento 24/7",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=rtve.es",
    "url": "https://rtvelivestream.rtve.es/rtvesec/clan/clan_main_dvr.m3u8"
  },
  {
    "id": "red_bull_tv",
    "name": "Red Bull TV",
    "country": "Internacional",
    "group": "Deportes",
    "logo": "https://www.google.com/s2/favicons?sz=128&domain_url=redbull.com",
    "url": "https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master_928.m3u8"
  }
];

interface IPTVPlayerProps {
  onClose: () => void;
}

export const IPTVPlayer: React.FC<IPTVPlayerProps> = ({ onClose }) => {
  const [activeChannel, setActiveChannel] = useState<IPTVChannel>(IPTV_CHANNELS[2]); // Default Antena 3 or Telecinco
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  // Hardcoded ordered categories so Spain and main groups are first
  const baseCategories = ['Todos', 'Películas', 'Noticias', 'Generalistas', 'Deportes', 'Entretenimiento 24/7'];
  const otherCountries = ['Estados Unidos', 'Perú', 'Argentina', 'Chile', 'Colombia', 'Puerto Rico', 'España', 'México'];
  
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

  const filteredByCategory = activeCategory === 'Todos' 
    ? IPTV_CHANNELS 
    : IPTV_CHANNELS.filter(c => c.group === activeCategory || c.country === activeCategory);
    
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
            
            {/* Menu Bar: Search and Category Dropdown */}
            <div className="flex flex-col gap-3">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Buscar canal (Ej: La 1)..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-[11px] text-white placeholder-white/40 font-satoshi focus:outline-none focus:border-[#E0457B]/70 focus:bg-white/5 transition-colors shadow-inner"
                />
              </div>
              <div className="relative">
                <select 
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-[11px] text-white font-satoshi appearance-none focus:outline-none focus:border-[#E0457B]/70 focus:bg-white/5 transition-colors cursor-pointer shadow-inner"
                >
                  {categories.map(category => (
                    <option key={category} value={category} className="bg-[#140A0E] text-white">
                      {getFlag(category)} {category}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/50 text-[10px]">
                  ▼
                </div>
              </div>
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
