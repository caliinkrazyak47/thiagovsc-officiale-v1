'use client';

import React, { useEffect, useRef, useCallback, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Maximize, Minimize, Volume2, VolumeX, Shuffle, Play, Pause, Plus, Minus, Tv } from 'lucide-react';
import { PLAYLIST_VIDEOS } from './playlistData';
import { TVVideo } from './types';
import { BicolorSectionTitle } from '@/components/BicolorSectionTitle';
import { useMediaStore } from '@/lib/mediaStore';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export const TV_VIDEOS: TVVideo[] = PLAYLIST_VIDEOS;

export const TVOnlinePlayer: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const chassisRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const screenWrapperRef = useRef<HTMLDivElement>(null);

  const { activeMediaId, setActiveMedia } = useMediaStore();
  
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [volume, setVolumeState] = useState<number>(85);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [clientOrigin, setClientOrigin] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setClientOrigin(window.location.origin);
    }
  }, []);

  // Pause TV if another media starts playing
  useEffect(() => {
    if (activeMediaId && activeMediaId !== 'tv' && isPlaying) {
      sendCommand('pauseVideo');
      setIsPlaying(false);
    }
  }, [activeMediaId, isPlaying]);

  const [currentVideoIndex, setCurrentVideoIndex] = useState<number>(0);
  const currentVideoIndexRef = useRef<number>(currentVideoIndex);
  currentVideoIndexRef.current = currentVideoIndex;

  const currentVideo = PLAYLIST_VIDEOS[currentVideoIndex] || PLAYLIST_VIDEOS[0];

  const sendCommand = useCallback((func: string, args: any[] = []) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func, args }),
          '*'
        );
      } catch {}
    }
  }, []);

  const handleIframeLoaded = useCallback(() => {
    // Force maximum 1080p HD quality and smooth playback
    setTimeout(() => {
      sendCommand('setPlaybackQuality', ['hd1080']);
      sendCommand('setSuggestedQuality', ['hd1080']);
      if (isPlaying) {
        sendCommand('playVideo');
      }
    }, 500);
  }, [isPlaying, sendCommand]);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      sendCommand('pauseVideo');
      setIsPlaying(false);
    } else {
      setActiveMedia('tv');
      sendCommand('playVideo');
      sendCommand('setPlaybackQuality', ['hd1080']);
      setIsPlaying(true);
    }
  }, [isPlaying, sendCommand, setActiveMedia]);

  const playNextRandomVideo = useCallback(() => {
    const total = PLAYLIST_VIDEOS.length;
    let nextIndex = Math.floor(Math.random() * total);
    if (nextIndex === currentVideoIndexRef.current && total > 1) {
      nextIndex = (nextIndex + 1) % total;
    }
    setCurrentVideoIndex(nextIndex);
    currentVideoIndexRef.current = nextIndex;

    const nextVideo = PLAYLIST_VIDEOS[nextIndex];
    if (nextVideo && iframeRef.current) {
      const nextOriginParam = clientOrigin ? `&origin=${encodeURIComponent(clientOrigin)}` : '';
      const muteParam = isMuted ? '1' : '0';
      iframeRef.current.src = `https://www.youtube.com/embed/${nextVideo.id}?autoplay=1&mute=${muteParam}&enablejsapi=1&playsinline=1&rel=0&modestbranding=1&hd=1${nextOriginParam}`;
      setIsPlaying(true);
      setActiveMedia('tv');
    }
  }, [clientOrigin, isMuted, setActiveMedia]);

  const toggleMute = useCallback(() => {
    if (isMuted) {
      setActiveMedia('tv');
      sendCommand('unMute');
      sendCommand('setVolume', [volume || 85]);
      sendCommand('playVideo');
      setIsMuted(false);
    } else {
      sendCommand('mute');
      setIsMuted(true);
    }
  }, [isMuted, volume, sendCommand, setActiveMedia]);

  const handleVolumeUp = useCallback(() => {
    const newVol = Math.min(100, volume + 10);
    setVolumeState(newVol);
    if (isMuted) {
      sendCommand('unMute');
      setIsMuted(false);
    }
    sendCommand('setVolume', [newVol]);
  }, [volume, isMuted, sendCommand]);

  const handleVolumeDown = useCallback(() => {
    const newVol = Math.max(0, volume - 10);
    setVolumeState(newVol);
    if (newVol === 0) {
      sendCommand('mute');
      setIsMuted(true);
    } else {
      if (isMuted) {
        sendCommand('unMute');
        setIsMuted(false);
      }
      sendCommand('setVolume', [newVol]);
    }
  }, [volume, isMuted, sendCommand]);

  const handleToggleFullscreen = useCallback(() => {
    if (!screenWrapperRef.current) return;
    if (!isFullscreen) {
      if (screenWrapperRef.current.requestFullscreen) {
        screenWrapperRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  }, [isFullscreen]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Performance-optimized reveal: fade in once without continuously scaling chassis during scroll
  useGSAP(() => {
    if (!sectionRef.current || !chassisRef.current) return;

    gsap.fromTo(
      chassisRef.current,
      { opacity: 0.85, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          once: true,
        },
      }
    );
  }, { scope: sectionRef });

  const originParam = clientOrigin ? `&origin=${encodeURIComponent(clientOrigin)}` : '';
  const initialVideoId = currentVideo?.id || 'kPa7bsKwL-c';
  // Autoplay=1 with mute=1 ensures zero browser autoplay blocking; enablejsapi=1 allows HD commands; no broken playlist ID
  const youtubeEmbedUrl = `https://www.youtube.com/embed/${initialVideoId}?autoplay=1&mute=1&enablejsapi=1&playsinline=1&rel=0&modestbranding=1&hd=1${originParam}`;

  return (
    <section
      ref={sectionRef}
      id="tv"
      className="w-full min-h-screen flex flex-col justify-center items-center relative bg-[var(--blush)] border-b border-[var(--line)] overflow-hidden select-none"
      style={{
        paddingTop: 'clamp(4rem, 9vh, 7rem)',
        paddingBottom: 'clamp(4rem, 9vh, 7rem)',
      }}
    >
      <div 
        className="w-full flex flex-col items-center justify-center my-auto px-4 sm:px-6"
        style={{ gap: 'clamp(2rem, 4vh, 3.5rem)' }}
      >
        {/* En la sección solo va el título "TV Online", sin más texto */}
        <BicolorSectionTitle 
          firstWord="TV" 
          secondWord="Online" 
          align="center" 
        />

        {/* UN solo contenedor: width min(1100px, 88vw), con bisel de 12px en --petal y radius 24px */}
        <div 
          ref={chassisRef}
          style={{ width: 'min(1100px, 88vw)' }}
          className="p-[12px] bg-[var(--petal)] rounded-[24px] border border-[var(--line)] shadow-luxury flex flex-col gap-3 mx-auto"
        >
          {/* Pantalla 16:9 con radius 16px */}
          <div
            ref={screenWrapperRef}
            className={`relative w-full aspect-video rounded-[16px] overflow-hidden bg-black ${
              isFullscreen ? '!fixed !inset-0 !w-screen !h-screen !z-[9999] !rounded-none !max-w-none' : ''
            }`}
          >
            <iframe
              ref={iframeRef}
              id="tv-online-yt-iframe"
              src={youtubeEmbedUrl}
              title="Thiago VSC TV Online"
              className="w-full h-full border-0 transform-gpu"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              loading="eager"
              onLoad={handleIframeLoaded}
            />

            {/* Quick Unmute Pill Overlay if muted */}
            {isMuted && !isFullscreen && (
              <button
                type="button"
                onClick={toggleMute}
                className="absolute bottom-4 left-4 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--surface)]/90 backdrop-blur-md text-[var(--berry)] font-satoshi text-xs tracking-wider uppercase shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer border border-[var(--line)]"
                title="Activar audio de la emisión"
              >
                <VolumeX className="w-3.5 h-3.5 text-[var(--brand)] animate-pulse" />
                <span>Activar sonido</span>
              </button>
            )}

            {/* Live Indicator Badge on top left of screen */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white font-satoshi text-[11px] tracking-widest uppercase pointer-events-none">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span>EMISIÓN HD</span>
            </div>

            {isFullscreen && (
              <button
                type="button"
                onClick={handleToggleFullscreen}
                className="absolute top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--surface)] text-[var(--berry)] font-satoshi text-xs tracking-[0.2em] uppercase shadow-luxury cursor-pointer"
              >
                <span>Salir</span>
                <Minimize className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Barra de controles con EXACTAMENTE el mismo ancho (w-full dentro del mismo padding de 12px) */}
          <div className="w-full bg-[var(--surface)] rounded-[16px] p-3 sm:p-3.5 border border-[var(--line)] flex flex-wrap items-center justify-between text-[var(--berry)] font-satoshi text-xs gap-3">
            
            {/* Controles Izquierda */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={togglePlayPause}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-medium tracking-[0.15em] uppercase text-[11px] bg-[var(--brand)] text-[var(--champagne)] hover:opacity-90 cursor-pointer shadow-sm transition-all"
                title={isPlaying ? "Pausar emisión" : "Reanudar emisión"}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isPlaying ? 'Pausa' : 'Play'}</span>
              </button>

              <button
                type="button"
                onClick={playNextRandomVideo}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--line)] text-[var(--brand)] hover:bg-[var(--blush)] font-medium tracking-[0.15em] uppercase text-[11px] cursor-pointer transition-all"
                title="Reproducir siguiente video aleatorio"
              >
                <Shuffle className="w-3 h-3" />
                <span>Aleatorio</span>
              </button>

              <div className="hidden md:flex items-center gap-1.5 text-[11px] text-[var(--berry)]/70 pl-2 border-l border-[var(--line)] font-medium truncate max-w-[280px]">
                <Tv className="w-3.5 h-3.5 text-[var(--brand)] shrink-0" />
                <span className="truncate">{currentVideo?.title}</span>
              </div>
            </div>

            {/* Controles Derecha */}
            <div className="flex items-center gap-3">
              {/* Control de Volumen */}
              <div className="flex items-center gap-1.5 bg-[var(--petal)] px-2.5 py-1 rounded-full border border-[var(--line)]">
                <button
                  type="button"
                  onClick={toggleMute}
                  className="p-1 hover:text-[var(--brand)] transition-colors cursor-pointer"
                  title={isMuted ? 'Activar sonido' : 'Silenciar'}
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5 text-[var(--brand)]" /> : <Volume2 className="w-3.5 h-3.5 text-[var(--berry)]" />}
                </button>
                <button
                  type="button"
                  onClick={handleVolumeDown}
                  className="p-0.5 hover:text-[var(--brand)] transition-colors cursor-pointer"
                  title="Bajar volumen"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="text-[10px] font-mono w-7 text-center">
                  {isMuted ? '0%' : `${volume}%`}
                </span>
                <button
                  type="button"
                  onClick={handleVolumeUp}
                  className="p-0.5 hover:text-[var(--brand)] transition-colors cursor-pointer"
                  title="Subir volumen"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              {/* Pantalla Completa */}
              <button
                type="button"
                onClick={handleToggleFullscreen}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--line)] text-[var(--brand)] hover:bg-[var(--blush)] font-medium tracking-[0.15em] uppercase text-[11px] cursor-pointer transition-all"
                title="Pantalla completa"
              >
                <Maximize className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Pantalla completa</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
