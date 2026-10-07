'use client';

import React, { useEffect, useRef, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Maximize, Minimize, Volume2, Volume1, VolumeX, Shuffle, Tv, Play, Pause, Plus, Minus } from 'lucide-react';
import { PLAYLIST_VIDEOS } from './playlistData';
import { TVVideo } from './types';

export const PLAYLIST_ID = 'PLALJOp7e_srk';
export const TV_VIDEOS: TVVideo[] = PLAYLIST_VIDEOS;

export const TVOnlinePlayer: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const screenWrapperRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);
  const [isQualityLocked, setIsQualityLocked] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [volume, setVolumeState] = useState<number>(100);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [clientOrigin, setClientOrigin] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setClientOrigin(window.location.origin);
    }
  }, []);

  // Random Initial Video Selection from Playlist
  const [currentVideoIndex, setCurrentVideoIndex] = useState<number>(() => {
    return Math.floor(Math.random() * PLAYLIST_VIDEOS.length);
  });
  const currentVideoIndexRef = useRef<number>(currentVideoIndex);
  currentVideoIndexRef.current = currentVideoIndex;

  const currentVideo = PLAYLIST_VIDEOS[currentVideoIndex] || PLAYLIST_VIDEOS[0];

  // Helper to post commands to YouTube IFrame API
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

  // Request Maximum Resolution (highres = 4K 2160p / 1440p / 1080p)
  const setMaxResolution = useCallback(() => {
    sendCommand('setPlaybackQuality', ['hd2160']);
    sendCommand('setPlaybackQualityRange', ['hd2160', 'hd2160']);
    sendCommand('setPlaybackQuality', ['highres']);
    setIsQualityLocked(true);
  }, [sendCommand]);

  // Toggle Play / Pause
  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      sendCommand('pauseVideo');
      setIsPlaying(false);
    } else {
      sendCommand('playVideo');
      setIsPlaying(true);
    }
  }, [isPlaying, sendCommand]);

  // Volume Down (-15%)
  const handleVolumeDown = useCallback(() => {
    const newVol = Math.max(0, volume - 15);
    setVolumeState(newVol);
    sendCommand('unMute');
    sendCommand('setVolume', [newVol]);
    setIsMuted(false);
  }, [volume, sendCommand]);

  // Volume Up (+15%)
  const handleVolumeUp = useCallback(() => {
    const newVol = Math.min(100, volume + 15);
    setVolumeState(newVol);
    sendCommand('unMute');
    sendCommand('setVolume', [newVol]);
    setIsMuted(false);
  }, [volume, sendCommand]);

  // Toggle Mute / Unmute
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

  // Unmute & set volume to 100%
  const enableSoundAndPlay = useCallback(() => {
    sendCommand('unMute');
    sendCommand('setVolume', [100]);
    sendCommand('playVideo');
    setVolumeState(100);
    setIsMuted(false);
    setIsPlaying(true);
    setMaxResolution();
  }, [sendCommand, setMaxResolution]);

  // Next Random Video from playlist
  const playNextRandomVideo = useCallback(() => {
    let nextIndex = Math.floor(Math.random() * PLAYLIST_VIDEOS.length);
    if (nextIndex === currentVideoIndexRef.current && PLAYLIST_VIDEOS.length > 1) {
      nextIndex = (nextIndex + 1) % PLAYLIST_VIDEOS.length;
    }
    setCurrentVideoIndex(nextIndex);
    currentVideoIndexRef.current = nextIndex;
    const nextVid = PLAYLIST_VIDEOS[nextIndex];

    // Load new video with highres suggested quality cleanly
    sendCommand('loadVideoById', [{ videoId: nextVid.id, suggestedQuality: 'highres' }]);
    sendCommand('playVideo');
    setIsPlaying(true);
    setTimeout(() => {
      setMaxResolution();
    }, 600);
  }, [sendCommand, setMaxResolution]);

  // On IFrame load: initiate listening, shuffle, maximum quality, unmute and play
  const handleIframeLoad = useCallback(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage(JSON.stringify({ event: 'listening' }), '*');
      } catch {}
    }
    // Enable YouTube native shuffle & loop
    sendCommand('setShuffle', [true]);
    sendCommand('setLoop', [true]);
    setMaxResolution();
    enableSoundAndPlay();
  }, [sendCommand, setMaxResolution, enableSoundAndPlay]);

  // Global user gesture unlock for browser autoplay sound restrictions on mobile & desktop
  useEffect(() => {
    const handleFirstGesture = () => {
      setHasInteracted(true);
      enableSoundAndPlay();
    };

    const events = ['click', 'touchstart', 'scroll', 'pointerdown', 'keydown'];
    events.forEach((ev) => window.addEventListener(ev, handleFirstGesture, { passive: true, once: true }));

    return () => {
      events.forEach((ev) => window.removeEventListener(ev, handleFirstGesture));
    };
  }, [enableSoundAndPlay]);

  // Listen for YouTube API messages: sync state and auto-advance randomly when video ends
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        let data = event.data;
        if (typeof data === 'string') {
          data = JSON.parse(data);
        }
        if (data && data.event === 'infoDelivery' && data.info) {
          const info = data.info;
          // PlayerState: 0 = ENDED, 1 = PLAYING, 2 = PAUSED
          if (info.playerState === 1) {
            setIsPlaying(true);
          } else if (info.playerState === 2) {
            setIsPlaying(false);
          } else if (info.playerState === 0) {
            playNextRandomVideo();
          }
          if (typeof info.volume === 'number') {
            setVolumeState(info.volume);
          }
          if (typeof info.muted === 'boolean') {
            setIsMuted(info.muted);
          }
        }
      } catch {}
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [playNextRandomVideo]);

  // Toggle true native fullscreen on the video screen
  const handleToggleFullscreen = useCallback(() => {
    const target = screenWrapperRef.current;
    if (!target) return;

    if (!document.fullscreenElement) {
      if (target.requestFullscreen) {
        target.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
      } else if ((target as any).webkitRequestFullscreen) {
        (target as any).webkitRequestFullscreen();
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
        setIsFullscreen(false);
      }
    }
  }, []);

  // Sync fullscreen change events
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

  // Clean, official YouTube embed URL with playlist, autoplay, volume, playsinline and Ultra HD params
  const initialVideoId = currentVideo?.id || 'kPa7bsKwL-c';
  const originParam = clientOrigin ? `&origin=${encodeURIComponent(clientOrigin)}` : '';
  const youtubeEmbedUrl = `https://www.youtube.com/embed/${initialVideoId}?list=PLALJOp7e_srk&autoplay=1&mute=0&enablejsapi=1&playsinline=1&vq=hd2160&rel=0&hd=1${originParam}`;


  return (
    <section
      id="tv"
      className="w-full relative bg-white overflow-hidden select-none py-16 sm:py-20 md:py-28 px-4 sm:px-6 md:px-10 lg:px-16 border-t border-b border-zinc-200/80"
    >
      {/* Precision hairline grid accent */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#DE4176]/30 to-transparent pointer-events-none" />

      {/* Main Content Container */}
      <div className="relative max-w-4xl lg:max-w-5xl mx-auto flex flex-col items-center z-10 w-full">
        
        {/* ==========================================
            EDITORIAL HEADER SECTION (Awwwards Swiss Precision)
        ========================================== */}
        <div className="w-full flex flex-col items-center text-center mb-8 sm:mb-10 md:mb-12">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#DE4176]/10 border border-[#DE4176]/25 shadow-sm mb-4">
            <span className="w-2 h-2 rounded-full bg-[#DE4176] animate-pulse"></span>
            <span className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.22em] text-[#DE4176] uppercase">
              24/7 BROADCAST // TRANSMISIÓN EN DIRECTO 4K
            </span>
          </div>

          {/* Main Huge Architectural Typography */}
          <h2 className="text-6xl sm:text-7xl lg:text-[7vw] font-syne font-black tracking-[-0.04em] leading-[0.85] text-[#0D0B12] uppercase text-center mb-3">
            TV<br />
            <span className="text-transparent" style={{ WebkitTextStroke: '2.5px #DE4176' }}>
              ONLINE
            </span>
          </h2>

          <p className="mt-2 text-[10px] sm:text-xs md:text-sm font-jakarta font-bold text-zinc-500 uppercase tracking-[0.22em] max-w-xl px-2">
            THIAGO VSC OFFICIAL CHANNEL // MÁXIMA RESOLUCIÓN 4K ULTRA HD
          </p>
        </div>

        {/* ==========================================
            PREMIUM CINEMA FRAME (MARCO DE ALTA GAMA)
            Apple Studio Display / Titanium Ceramic White Edition
        ========================================== */}
        <div className="w-full relative group">
          
          {/* Ambient Outer Glow */}
          <div className="absolute -inset-1 sm:-inset-1.5 bg-gradient-to-r from-rose-100/60 via-white to-rose-100/60 rounded-3xl sm:rounded-[2.5rem] blur-xl opacity-80 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          {/* Outer Chassis - Pure Titanium Ceramic Light */}
          <div className="relative w-full rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] bg-gradient-to-b from-white via-[#FAF9F7] to-[#F4F3F0] p-2.5 sm:p-5 md:p-6 shadow-[0_25px_65px_rgba(222,65,118,0.08),0_2px_10px_rgba(0,0,0,0.03)] border border-stone-200/90">
            
            {/* Studio Hardware Hex Screws in the 4 Corners */}
            <div className="absolute top-3 left-3 w-2.5 h-2.5 rounded-full border border-stone-300 bg-stone-100 shadow-sm flex items-center justify-center pointer-events-none opacity-80">
              <div className="w-1.5 h-[1px] bg-stone-400 rotate-45" />
            </div>
            <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full border border-stone-300 bg-stone-100 shadow-sm flex items-center justify-center pointer-events-none opacity-80">
              <div className="w-1.5 h-[1px] bg-stone-400 -rotate-45" />
            </div>
            <div className="absolute bottom-3 left-3 w-2.5 h-2.5 rounded-full border border-stone-300 bg-stone-100 shadow-sm flex items-center justify-center pointer-events-none opacity-80">
              <div className="w-1.5 h-[1px] bg-stone-400 -rotate-45" />
            </div>
            <div className="absolute bottom-3 right-3 w-2.5 h-2.5 rounded-full border border-stone-300 bg-stone-100 shadow-sm flex items-center justify-center pointer-events-none opacity-80">
              <div className="w-1.5 h-[1px] bg-stone-400 rotate-45" />
            </div>

            {/* 
              TOP BEZEL HARDWARE BAR
              Studio Monitor Details: Status Jewels, Titanium Badge, Resolution Specs & VU Meter
            */}
            <div className="w-full flex items-center justify-between pb-2.5 sm:pb-3.5 px-1 sm:px-2 border-b border-stone-200/80 text-stone-700 font-mono text-[9px] sm:text-xs">
              
              {/* Left: Hardware Status Jewels */}
              <div className="flex items-center gap-1.5 sm:gap-3">
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#EF4444] shadow-[0_0_8px_rgba(239,68,68,0.6)] animate-pulse" />
                  <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#EAB308] shadow-[0_0_6px_rgba(234,179,8,0.5)]" />
                  <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#10B981] shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
                </div>
                <span className="font-black text-stone-800 tracking-wider sm:tracking-widest text-[8px] sm:text-[11px] uppercase">
                  ALEATORIO // MÁXIMA CALIDAD
                </span>
              </div>

              {/* Center: Live Peak Audio VU-Meter */}
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-stone-200 shadow-sm">
                <span className="text-[8px] font-mono text-stone-500 font-bold uppercase tracking-wider">VU PEAK</span>
                <div className="flex items-center gap-0.5 h-2.5">
                  <span className="w-1 h-full bg-[#10B981] rounded-[1px] animate-pulse" />
                  <span className="w-1 h-full bg-[#10B981] rounded-[1px] animate-pulse" style={{ animationDelay: '0.1s' }} />
                  <span className="w-1 h-full bg-[#10B981] rounded-[1px] animate-pulse" style={{ animationDelay: '0.2s' }} />
                  <span className="w-1 h-full bg-[#10B981] rounded-[1px] animate-pulse" style={{ animationDelay: '0.15s' }} />
                  <span className="w-1 h-full bg-[#EAB308] rounded-[1px] animate-pulse" style={{ animationDelay: '0.25s' }} />
                  <span className="w-1 h-full bg-[#EAB308] rounded-[1px] animate-pulse" style={{ animationDelay: '0.05s' }} />
                  <span className="w-1 h-full bg-[#DE4176] rounded-[1px] animate-pulse" style={{ animationDelay: '0.3s' }} />
                </div>
              </div>

              {/* Right: Technical Badges */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={setMaxResolution}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-[#DE4176]/10 hover:bg-[#DE4176] hover:text-white border border-[#DE4176]/30 text-[#DE4176] font-bold text-[8px] sm:text-[10px] shadow-sm transition-all cursor-pointer haptic-press"
                  title="Asegurar Máxima Calidad 4K"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#DE4176] animate-pulse" />
                  <span>4K MÁXIMA</span>
                </button>
                <button
                  type="button"
                  onClick={handleToggleFullscreen}
                  className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-[9px] sm:text-[10px] transition-colors cursor-pointer border border-stone-200"
                  title="Ampliar Pantalla"
                >
                  <Maximize className="w-2.5 h-2.5" />
                  <span>AMPLIAR</span>
                </button>
              </div>

            </div>

            {/* 
              SCREEN INNER DISPLAY STAGE
              Aspect ratio 16:9 Cinema Widescreen
              Inset Chamfered Bezel with Official YouTube Player
            */}
            <div
              ref={screenWrapperRef}
              className={`reproductor-tv-max mt-2.5 sm:mt-4 rounded-xl sm:rounded-2xl md:rounded-[1.75rem] overflow-hidden bg-black shadow-[inset_0_2px_12px_rgba(0,0,0,0.4)] border border-stone-300/80 ${
                isFullscreen ? '!fixed !inset-0 !w-screen !h-screen !z-[9999] !rounded-none !border-0 !max-w-none' : ''
              }`}
            >
              {/* Original Official YouTube Player Embed */}
              <iframe
                ref={iframeRef}
                id="tv-online-original-yt-iframe"
                src={youtubeEmbedUrl}
                title="YouTube video player"
                frameBorder="0"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                onLoad={handleIframeLoad}
              />

              {/* Floating Exit Fullscreen Button in Native Container Fullscreen */}
              {isFullscreen && (
                <button
                  type="button"
                  onClick={handleToggleFullscreen}
                  className="absolute top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 hover:bg-[#DE4176] text-stone-900 hover:text-white font-mono text-xs font-bold tracking-wider uppercase backdrop-blur-md transition-all shadow-xl cursor-pointer border border-stone-200 haptic-press"
                >
                  <span>SALIR DE PANTALLA COMPLETA</span>
                  <Minimize className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* 
              BOTTOM BEZEL CONTROL & STATUS TRAY
              Precision Finished Titanium Shelf with Sound Stepper, Play/Pause, Shuffle & Fullscreen
            */}
            <div className="w-full flex flex-wrap items-center justify-between pt-3 sm:pt-4 px-1 sm:px-2 text-stone-700 font-mono text-[9px] sm:text-xs gap-2">
              
              {/* Left: Play/Pause + Siguiente Aleatorio + Title */}
              <div className="flex items-center gap-2 sm:gap-2.5">
                {/* Play / Pause Toggle Button */}
                <button
                  type="button"
                  onClick={togglePlayPause}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-black tracking-wider uppercase transition-all shadow-sm hover:scale-105 active:scale-95 cursor-pointer text-[9px] sm:text-[11px] haptic-press ${
                    isPlaying ? 'bg-stone-900 text-white hover:bg-stone-800' : 'bg-[#10B981] text-white hover:bg-[#059669]'
                  }`}
                  title={isPlaying ? "Pausar vídeo" : "Reanudar vídeo"}
                >
                  {isPlaying ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
                  <span>{isPlaying ? 'PAUSA' : 'PLAY'}</span>
                </button>

                {/* Next Random Video Button */}
                <button
                  type="button"
                  onClick={playNextRandomVideo}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#DE4176] hover:bg-[#c22e61] text-white font-black tracking-wider uppercase transition-all shadow-[0_2px_12px_rgba(222,65,118,0.35)] hover:scale-105 active:scale-95 cursor-pointer text-[9px] sm:text-[11px] haptic-press"
                  title="Reproducir Siguiente Vídeo Aleatorio"
                >
                  <Shuffle className="w-3 h-3" />
                  <span>ALEATORIO</span>
                </button>

                <span className="hidden lg:inline-block text-[9px] sm:text-[11px] font-bold text-stone-500 tracking-wider uppercase truncate max-w-xs">
                  {currentVideo?.title}
                </span>
              </div>

              {/* Right: Volume Stepper + Fullscreen */}
              <div className="flex items-center gap-1.5 sm:gap-2.5">
                {/* Interactive Volume Stepper & Mute Control */}
                <div className="flex items-center gap-1 bg-white rounded-full px-2 py-1 border border-stone-200 shadow-sm">
                  <button
                    type="button"
                    onClick={toggleMute}
                    className="p-1 hover:text-[#DE4176] transition-colors cursor-pointer"
                    title={isMuted ? "Activar Sonido" : "Silenciar"}
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-3 h-3 text-[#EF4444]" />
                    ) : (
                      <Volume2 className="w-3 h-3 text-[#DE4176]" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleVolumeDown}
                    className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-stone-100 active:scale-90 transition-all text-stone-700 font-bold text-xs cursor-pointer"
                    title="Bajar Volumen (-15%)"
                  >
                    <Minus className="w-2.5 h-2.5" />
                  </button>

                  <span className="font-mono text-[9px] sm:text-[10px] font-bold text-stone-800 min-w-[28px] text-center">
                    {isMuted ? 'MUT' : `${volume}%`}
                  </span>

                  <button
                    type="button"
                    onClick={handleVolumeUp}
                    className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-stone-100 active:scale-90 transition-all text-stone-700 font-bold text-xs cursor-pointer"
                    title="Subir Volumen (+15%)"
                  >
                    <Plus className="w-2.5 h-2.5" />
                  </button>
                </div>

                {/* 4K Ultra HD Toggle */}
                <button
                  type="button"
                  onClick={setMaxResolution}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#DE4176]/10 hover:bg-[#DE4176] text-[#DE4176] hover:text-white border border-[#DE4176]/30 font-bold tracking-wider transition-all cursor-pointer text-[9px] sm:text-[11px] haptic-press"
                  title="Forzar Calidad 4K / Ultra HD"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#DE4176] animate-pulse" />
                  <span>4K MÁXIMA</span>
                </button>

                {/* Fullscreen Button */}
                <button
                  type="button"
                  onClick={handleToggleFullscreen}
                  className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full bg-[#DE4176] hover:bg-[#c22e61] text-white font-black tracking-wider transition-all duration-200 cursor-pointer shadow-[0_4px_15px_rgba(222,65,118,0.35)] text-[9px] sm:text-[11px] hover:scale-105 active:scale-95 haptic-press"
                  title="Pantalla Completa"
                >
                  <Maximize className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span>PANTALLA COMPLETA</span>
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
