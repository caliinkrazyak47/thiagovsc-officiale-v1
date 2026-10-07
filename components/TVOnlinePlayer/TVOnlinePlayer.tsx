'use client';

import React, { useEffect, useRef, useCallback, useState } from 'react';
import { Maximize, Minimize, Volume2, VolumeX, Shuffle, Play, Pause, Plus, Minus } from 'lucide-react';
import { PLAYLIST_VIDEOS } from './playlistData';
import { TVVideo } from './types';

export const PLAYLIST_ID = 'PLALJOp7e_srk';
export const TV_VIDEOS: TVVideo[] = PLAYLIST_VIDEOS;

export const TVOnlinePlayer: React.FC = () => {
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

  const setMaxResolution = useCallback(() => {
    sendCommand('setPlaybackQuality', ['hd2160']);
    sendCommand('setPlaybackQualityRange', ['hd2160', 'hd2160']);
    sendCommand('setPlaybackQuality', ['highres']);
  }, [sendCommand]);

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

  const handleVolumeChange = useCallback((newVol: number) => {
    const clamped = Math.max(0, Math.min(100, newVol));
    setVolumeState(clamped);
    sendCommand('setVolume', [clamped]);
    if (clamped > 0 && isMuted) {
      sendCommand('unMute');
      setIsMuted(false);
    }
  }, [isMuted, sendCommand]);

  const toggleMute = useCallback(() => {
    if (isMuted) {
      sendCommand('unMute');
      sendCommand('setVolume', [volume || 50]);
      setIsMuted(false);
    } else {
      sendCommand('mute');
      setIsMuted(true);
    }
  }, [isMuted, volume, sendCommand]);

  const handleVolumeUp = useCallback(() => {
    handleVolumeChange(volume + 15);
  }, [handleVolumeChange, volume]);

  const handleVolumeDown = useCallback(() => {
    handleVolumeChange(volume - 15);
  }, [handleVolumeChange, volume]);

  const handleToggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      const target = screenWrapperRef.current;
      if (target?.requestFullscreen) {
        target.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
      } else if ((target as any)?.webkitRequestFullscreen) {
        (target as any).webkitRequestFullscreen();
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
      } else if ((document as any)?.webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
        setIsFullscreen(false);
      }
    }
  }, []);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
    };
  }, []);

  const initialVideoId = currentVideo?.id || 'kPa7bsKwL-c';
  const originParam = clientOrigin ? `&origin=${encodeURIComponent(clientOrigin)}` : '';
  const youtubeEmbedUrl = `https://www.youtube.com/embed/${initialVideoId}?list=PLALJOp7e_srk&autoplay=1&mute=0&enablejsapi=1&playsinline=1&vq=hd2160&rel=0&hd=1${originParam}`;

  return (
    <section
      id="tv"
      className="w-full relative bg-white py-20 sm:py-28 md:py-36 px-4 sm:px-8 md:px-12 select-none"
    >
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        
        {/* EDITORIAL HEADER */}
        <div className="w-full flex flex-col items-center text-center mb-10 sm:mb-14">
          <span className="editorial-pill mb-5">
            01 / TRANSMISIÓN 24/7 EN DIRECTO
          </span>

          <h2 className="editorial-h2 flex flex-col items-center text-center tracking-[-0.04em]">
            <span className="font-display text-[#3B0D22] uppercase">TV</span>
            <span className="font-serif-italic text-[#DE4176] font-normal leading-none -mt-2">Online</span>
          </h2>

          <p className="mt-4 font-sans text-[17px] text-[#3B0D22]/75 max-w-xl text-center">
            Emisión continua en alta definición 4K Ultra HD. Videos oficiales, directos y momentos virales exclusivos.
          </p>
        </div>

        {/* CINEMA FRAME CON BISEL DE 14PX EN --BLUSH, RADIUS 32PX Y BORDE --PINK 25% */}
        <div 
          className="w-full p-[14px] bg-[#FFF4F7] rounded-[32px] border border-[#DE4176]/25 shadow-editorial"
          data-cursor="PLAY"
        >
          {/* Inner Video Screen */}
          <div
            ref={screenWrapperRef}
            className={`relative w-full aspect-video rounded-[20px] overflow-hidden bg-[#3B0D22] ${
              isFullscreen ? '!fixed !inset-0 !w-screen !h-screen !z-[9999] !rounded-none !max-w-none' : ''
            }`}
          >
            <iframe
              ref={iframeRef}
              id="tv-online-original-yt-iframe"
              src={youtubeEmbedUrl}
              title="Thiago VSC TV Online Player"
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />

            {isFullscreen && (
              <button
                type="button"
                onClick={handleToggleFullscreen}
                className="absolute top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white text-[#3B0D22] font-mono text-xs font-bold tracking-wider uppercase shadow-editorial cursor-pointer"
              >
                <span>SALIR</span>
                <Minimize className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* BARRA DE CONTROLES INFERIOR EN --WHITE CON TEXTO --INK */}
          <div className="mt-3.5 bg-white rounded-2xl p-3 sm:p-4 border border-[#3B0D22]/10 flex flex-wrap items-center justify-between text-[#3B0D22] font-mono text-xs gap-3">
            
            {/* Left Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={togglePlayPause}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-bold uppercase transition-all shadow-sm text-[11px] bg-[#DE4176] text-white hover:bg-[#c22e61] cursor-pointer haptic-press"
                title={isPlaying ? "Pausar emisión" : "Reanudar emisión"}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isPlaying ? 'PAUSA' : 'PLAY'}</span>
              </button>

              <button
                type="button"
                onClick={playNextRandomVideo}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#DE4176]/30 text-[#DE4176] hover:bg-[#FFF4F7] font-bold uppercase transition-all text-[11px] cursor-pointer haptic-press"
                title="Siguiente video aleatorio"
              >
                <Shuffle className="w-3 h-3" />
                <span>ALEATORIO</span>
              </button>

              <span className="hidden md:inline-block font-sans text-xs text-[#3B0D22]/70 font-semibold truncate max-w-xs">
                {currentVideo?.title}
              </span>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Volume Slider / Buttons */}
              <div className="flex items-center gap-1.5 bg-[#FFF4F7] px-2.5 py-1.5 rounded-full border border-[#DE4176]/20">
                <button
                  type="button"
                  onClick={toggleMute}
                  className="hover:text-[#DE4176] transition-colors cursor-pointer p-0.5"
                  title={isMuted ? "Activar sonido" : "Silenciar"}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-3.5 h-3.5 text-[#DE4176]" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5 text-[#3B0D22]" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleVolumeDown}
                  className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-white text-[#3B0D22] font-bold text-xs cursor-pointer"
                  title="Bajar volumen"
                >
                  <Minus className="w-2.5 h-2.5" />
                </button>

                <span className="font-mono text-[10px] font-bold text-[#3B0D22] min-w-[28px] text-center">
                  {isMuted ? 'MUT' : `${volume}%`}
                </span>

                <button
                  type="button"
                  onClick={handleVolumeUp}
                  className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-white text-[#3B0D22] font-bold text-xs cursor-pointer"
                  title="Subir volumen"
                >
                  <Plus className="w-2.5 h-2.5" />
                </button>
              </div>

              {/* Botón Pantalla Completa en --pink */}
              <button
                type="button"
                onClick={handleToggleFullscreen}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#DE4176] hover:bg-[#c22e61] text-white font-bold tracking-wider transition-all cursor-pointer shadow-editorial text-[11px] haptic-press"
                title="Ver en pantalla completa"
              >
                <Maximize className="w-3.5 h-3.5" />
                <span>PANTALLA COMPLETA</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
