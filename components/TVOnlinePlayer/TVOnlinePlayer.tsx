'use client';

import React, { useEffect, useRef, useCallback, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Maximize, Minimize, Volume2, VolumeX, Shuffle, Play, Pause, Plus, Minus } from 'lucide-react';
import { PLAYLIST_VIDEOS } from './playlistData';
import { TVVideo } from './types';
import { BicolorSectionTitle } from '@/components/BicolorSectionTitle';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export const PLAYLIST_ID = 'PLALJOp7e_srk';
export const TV_VIDEOS: TVVideo[] = PLAYLIST_VIDEOS;

export const TVOnlinePlayer: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const chassisRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const screenWrapperRef = useRef<HTMLDivElement>(null);
  
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [volume, setVolumeState] = useState<number>(100);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [clientOrigin, setClientOrigin] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setClientOrigin(window.location.origin);
    }
  }, []);

  const [currentVideoIndex, setCurrentVideoIndex] = useState<number>(() => {
    return Math.floor(Math.random() * PLAYLIST_VIDEOS.length);
  });
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

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      sendCommand('pauseVideo');
      setIsPlaying(false);
    } else {
      sendCommand('playVideo');
      setIsPlaying(true);
    }
  }, [isPlaying, sendCommand]);

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
      iframeRef.current.src = `https://www.youtube.com/embed/${nextVideo.id}?list=PLALJOp7e_srk&autoplay=1&mute=0&enablejsapi=1&playsinline=1&vq=hd2160&rel=0&hd=1${nextOriginParam}`;
      setIsPlaying(true);
    }
  }, [clientOrigin]);

  const toggleMute = useCallback(() => {
    if (isMuted) {
      sendCommand('unMute');
      sendCommand('setVolume', [volume || 80]);
      setIsMuted(false);
    } else {
      sendCommand('mute');
      setIsMuted(true);
    }
  }, [isMuted, volume, sendCommand]);

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

  // GSAP ScrollTrigger Scrub: entra desde scale 0.85 y radius 48px hasta scale 1 y radius 24px
  useGSAP(() => {
    if (!sectionRef.current || !chassisRef.current) return;

    gsap.fromTo(
      chassisRef.current,
      { scale: 0.85, borderRadius: '48px' },
      {
        scale: 1,
        borderRadius: '24px',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          end: 'center center',
          scrub: 1,
        },
      }
    );
  }, { scope: sectionRef });

  const originParam = clientOrigin ? `&origin=${encodeURIComponent(clientOrigin)}` : '';
  const initialVideoId = currentVideo?.id || '2Vv-BfVoq4g';
  const youtubeEmbedUrl = `https://www.youtube.com/embed/${initialVideoId}?list=PLALJOp7e_srk&autoplay=1&mute=0&enablejsapi=1&playsinline=1&vq=hd2160&rel=0&hd=1${originParam}`;

  return (
    <section
      ref={sectionRef}
      id="tv"
      className="w-full min-h-screen lg:h-screen flex flex-col justify-center items-center relative bg-white py-12 lg:py-16 px-4 sm:px-6 select-none border-b border-[rgba(224,69,123,0.14)] overflow-hidden"
    >
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center justify-center my-auto">
        
        {/* Título minimalista centrado: TV frambuesa + Online rosa */}
        <BicolorSectionTitle 
          firstWord="TV" 
          secondWord="Online" 
          align="center" 
          className="mb-6 lg:mb-8"
        />

        {/* Reproductor centrado con bisel de 12px en --polvo y radius 24px */}
        <div 
          ref={chassisRef}
          style={{ width: 'min(1100px, 88vw)' }}
          className="p-[12px] bg-[#FBE3EC] rounded-[24px] border border-[rgba(224,69,123,0.14)] shadow-luxury mx-auto transition-transform"
          data-cursor="Play"
        >
          {/* Pantalla 16:9 con radius 16px */}
          <div
            ref={screenWrapperRef}
            className={`relative w-full aspect-video rounded-[16px] overflow-hidden bg-[#B03366] ${
              isFullscreen ? '!fixed !inset-0 !w-screen !h-screen !z-[9999] !rounded-none !max-w-none' : ''
            }`}
          >
            <iframe
              ref={iframeRef}
              id="tv-online-yt-iframe"
              src={youtubeEmbedUrl}
              title="Thiago VSC TV Online"
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />

            {isFullscreen && (
              <button
                type="button"
                onClick={handleToggleFullscreen}
                className="absolute top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFFFFF] text-[#B03366] font-jost text-xs tracking-[0.2em] uppercase shadow-luxury cursor-pointer"
              >
                <span>Salir</span>
                <Minimize className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Controles de abajo en --perla (#FFFFFF) con texto --frambuesa y botones en --rosa */}
          <div className="mt-3 bg-[#FFFFFF] rounded-[16px] p-3 sm:p-3.5 border border-[rgba(224,69,123,0.14)] flex flex-wrap items-center justify-between text-[#B03366] font-jost text-xs gap-3">
            
            {/* Controles Izquierda */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={togglePlayPause}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-medium tracking-[0.15em] uppercase text-[11px] bg-[#DE4176] text-white hover:bg-[#c22e61] cursor-pointer btn-luxury shadow-sm"
                title={isPlaying ? "Pausar emisión" : "Reanudar emisión"}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isPlaying ? 'Pausa' : 'Play'}</span>
              </button>

              <button
                type="button"
                onClick={playNextRandomVideo}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[rgba(224,69,123,0.3)] text-[#DE4176] hover:bg-[#FFF6F9] font-medium tracking-[0.15em] uppercase text-[11px] cursor-pointer btn-luxury"
                title="Reproducir siguiente video aleatorio"
              >
                <Shuffle className="w-3 h-3" />
                <span>Aleatorio</span>
              </button>
            </div>

            {/* Controles Derecha */}
            <div className="flex items-center gap-3">
              {/* Control de Volumen */}
              <div className="flex items-center gap-1.5 bg-[#FFF6F9] px-2.5 py-1 rounded-full border border-[rgba(224,69,123,0.2)]">
                <button
                  type="button"
                  onClick={toggleMute}
                  className="hover:text-[#DE4176] transition-colors cursor-pointer p-0.5"
                  title={isMuted ? "Activar sonido" : "Silenciar"}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-3.5 h-3.5 text-[#DE4176]" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5 text-[#B03366]" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleVolumeDown}
                  className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-white text-[#B03366] text-xs cursor-pointer"
                  title="Bajar volumen"
                >
                  <Minus className="w-2.5 h-2.5" />
                </button>

                <span className="font-jost text-[11px] text-[#B03366] min-w-[26px] text-center font-medium">
                  {isMuted ? '0%' : `${volume}%`}
                </span>

                <button
                  type="button"
                  onClick={handleVolumeUp}
                  className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-white text-[#B03366] text-xs cursor-pointer"
                  title="Subir volumen"
                >
                  <Plus className="w-2.5 h-2.5" />
                </button>
              </div>

              {/* Botón Pantalla Completa en --rosa */}
              <button
                type="button"
                onClick={handleToggleFullscreen}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#DE4176] hover:bg-[#c22e61] text-white font-medium tracking-[0.15em] uppercase text-[11px] cursor-pointer shadow-luxury btn-luxury"
                title="Pantalla completa"
              >
                <Maximize className="w-3.5 h-3.5" />
                <span>Pantalla Completa</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
