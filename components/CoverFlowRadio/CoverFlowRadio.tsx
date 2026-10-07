'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Hls from 'hls.js';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Radio, X } from 'lucide-react';
import { RADIO_STATIONS } from './stationsData';

interface CoverFlowRadioProps {
  onClose?: () => void;
  isStandalone?: boolean;
}

export const CoverFlowRadio: React.FC<CoverFlowRadioProps> = ({ onClose, isStandalone = false }) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(85);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const currentStation = RADIO_STATIONS[activeIndex] || RADIO_STATIONS[0];

  // Stream loader with HLS (.m3u8) + standard MP3/AAC audio support
  const loadStream = useCallback((url: string, playNow: boolean) => {
    if (!audioRef.current) return;
    const audio = audioRef.current;

    // Destroy existing HLS instance if any
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const isHls = url.includes('.m3u8');

    if (isHls && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });
      hlsRef.current = hls;
      hls.loadSource(url);
      hls.attachMedia(audio);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false);
        if (playNow) {
          audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
        }
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          setIsLoading(false);
          setIsPlaying(false);
        }
      });
    } else {
      // Standard audio formats (MP3 / AAC / native Safari HLS)
      audio.src = url;
      audio.load();
      if (playNow) {
        audio.play()
          .then(() => {
            setIsLoading(false);
            setIsPlaying(true);
          })
          .catch(() => {
            setIsLoading(false);
            setIsPlaying(false);
          });
      } else {
        setIsLoading(false);
      }
    }
  }, []);

  // When active station changes, load the corresponding stream
  useEffect(() => {
    if (isPlaying) {
      setIsLoading(true);
      loadStream(currentStation.streamUrl, true);
    } else {
      loadStream(currentStation.streamUrl, false);
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [activeIndex]);

  // Toggle Play / Pause
  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setIsLoading(true);
      loadStream(currentStation.streamUrl, true);
    }
  }, [isPlaying, currentStation.streamUrl, loadStream]);

  // Next / Previous Stations
  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : RADIO_STATIONS.length - 1));
  }, []);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev < RADIO_STATIONS.length - 1 ? prev + 1 : 0));
  }, []);

  // Volume change handler
  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol / 100;
      audioRef.current.muted = newVol === 0;
    }
    if (newVol === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  // Toggle Mute
  const handleToggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.muted = false;
      audioRef.current.volume = (volume || 80) / 100;
      setIsMuted(false);
    } else {
      audioRef.current.muted = true;
      setIsMuted(true);
    }
  };

  // Keyboard navigation (ArrowLeft / ArrowRight / Space)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === ' ' && (e.target === document.body || (e.target as HTMLElement)?.tagName === 'DIV')) {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext, togglePlay]);

  return (
    <div className="w-full h-full min-h-[640px] flex flex-col justify-between bg-[#08070B] text-white select-none overflow-hidden relative font-sans">
      {/* Hidden HTML5 Audio Element */}
      <audio
        ref={audioRef}
        preload="none"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={() => {
          setIsLoading(false);
          setIsPlaying(false);
        }}
      />

      {/* Ambient Radial Glow from current station accent color */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-[140px] opacity-25 pointer-events-none transition-colors duration-700"
        style={{ backgroundColor: currentStation.accentColor }}
      />

      {/* Subtle 35mm film grain overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" />

      {/* ====================================================
          TOP BAR (Window Title & Close Button)
      ==================================================== */}
      <header className="w-full px-6 py-4 flex items-center justify-between border-b border-white/[0.08] backdrop-blur-xl bg-black/40 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#DE4176] flex items-center justify-center shadow-[0_0_15px_rgba(222,65,118,0.5)]">
            <Radio className="w-4 h-4 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-sm tracking-tight text-white uppercase" style={{ fontFamily: 'Arial Black, Impact, sans-serif' }}>
                RADIO LIVE
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#DE4176]/20 border border-[#DE4176]/40 text-[#DE4176] font-bold uppercase tracking-wider">
                COVER FLOW
              </span>
            </div>
            <p className="text-[10px] font-mono text-white/50 tracking-wider uppercase">
              SINTONIZADOR DE EMISORAS // EN DIRECTO 24/7
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Live Indicator Pill */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-500 text-[10px] font-mono font-bold tracking-widest uppercase">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span>ON AIR</span>
          </div>

          {/* Close button */}
          {onClose && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
              title="Cerrar reproductor"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* ====================================================
          3D COVER FLOW STAGE (Wensity UI Style)
      ==================================================== */}
      <main className="flex-1 flex flex-col items-center justify-center relative py-6 px-4 z-20 overflow-hidden">
        
        {/* Cover Flow Carousel Stage */}
        <div className="relative w-full max-w-4xl h-[340px] sm:h-[380px] flex items-center justify-center perspective-[1200px]">
          
          {/* Navigation Arrows */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Emisora anterior"
            className="absolute left-4 sm:left-10 top-1/2 -translate-y-1/2 z-40 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-[#DE4176] border border-white/20 text-white flex items-center justify-center shadow-2xl backdrop-blur-md transition-all hover:scale-110 active:scale-95 cursor-pointer text-xl"
          >
            ‹
          </button>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Siguiente emisora"
            className="absolute right-4 sm:right-10 top-1/2 -translate-y-1/2 z-40 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-[#DE4176] border border-white/20 text-white flex items-center justify-center shadow-2xl backdrop-blur-md transition-all hover:scale-110 active:scale-95 cursor-pointer text-xl"
          >
            ›
          </button>

          {/* Cards Track */}
          <div className="relative w-full h-full flex items-center justify-center preserve-3d">
            {RADIO_STATIONS.map((station, idx) => {
              const offset = idx - activeIndex;
              const isCenter = offset === 0;

              // Hide far away cards to optimize performance
              if (Math.abs(offset) > 3) return null;

              // 3D Cover Flow Calculation
              const translateX = offset === 0 ? 0 : offset * 180 + (offset > 0 ? 30 : -30);
              const translateZ = isCenter ? 90 : -90;
              const rotateY = isCenter ? 0 : offset > 0 ? -52 : 52;
              const scale = isCenter ? 1 : 0.82;
              const zIndex = 30 - Math.abs(offset) * 5;
              const opacity = isCenter ? 1 : Math.max(0.35, 0.85 - Math.abs(offset) * 0.2);

              return (
                <div
                  key={station.id}
                  onClick={() => {
                    setActiveIndex(idx);
                    if (!isPlaying) togglePlay();
                  }}
                  style={{
                    transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                    zIndex,
                    opacity,
                    transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  className="absolute w-[220px] sm:w-[260px] md:w-[280px] aspect-square cursor-pointer group"
                >
                  {/* Card Container Frame */}
                  <div
                    className={`w-full h-full rounded-2xl overflow-hidden relative shadow-[0_25px_60px_rgba(0,0,0,0.8)] transition-all duration-300 bg-[#121118] ${
                      isCenter
                        ? 'border-2 border-white shadow-[0_0_40px_rgba(255,255,255,0.25)]'
                        : 'border border-white/20 hover:border-white/50'
                    }`}
                  >
                    <img
                      src={station.cover}
                      alt={station.name}
                      className="w-full h-full object-contain p-2 select-none pointer-events-none transition-transform duration-700 group-hover:scale-105 bg-white/5"
                    />

                    {/* Dark gradient overlay at bottom */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/20 pointer-events-none" />

                    {/* Country Badge on Card Top Right */}
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-[10px] font-mono font-bold text-white shadow-md flex items-center gap-1.5">
                      <span>{station.flag}</span>
                      <span>{station.countryCode}</span>
                    </div>

                    {/* Active Pulsing Wave on Center Card */}
                    {isCenter && isPlaying && (
                      <div className="absolute top-3 left-3 flex items-center gap-1 bg-[#DE4176] text-white text-[9px] font-mono font-bold px-2.5 py-1 rounded-full shadow-lg">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        <span>SONANDO</span>
                      </div>
                    )}

                    {/* Card Bottom Meta */}
                    <div className="absolute bottom-3 left-3 right-3 text-left">
                      <div className="text-[10px] font-mono text-white/70 uppercase truncate font-bold">
                        {station.frequency}
                      </div>
                      <h4
                        className="font-black text-sm sm:text-base text-white tracking-tight uppercase truncate"
                        style={{ fontFamily: 'Arial Black, Impact, sans-serif' }}
                      >
                        {station.name}
                      </h4>
                    </div>
                  </div>

                  {/* Realistic Mirror Reflection Floor */}
                  <div
                    style={{
                      transform: 'scaleY(-1) translateY(-10px)',
                      opacity: isCenter ? 0.28 : 0.12,
                      maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 70%)',
                      WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 70%)',
                      transition: 'opacity 0.5s ease',
                    }}
                    className="w-full h-[60%] rounded-2xl overflow-hidden pointer-events-none mt-2"
                  >
                    <img
                      src={station.cover}
                      alt=""
                      className="w-full h-full object-contain p-2 blur-[1px] bg-white/5"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ====================================================
            STATION INFORMATION (Below Cover Flow as requested)
            - Radio Name
            - Country of Origin
            - Frequency / Slogan
        ==================================================== */}
        <div className="text-center mt-6 z-30 max-w-lg mx-auto flex flex-col items-center animate-in fade-in duration-300">
          {/* Country Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-mono text-xs font-bold uppercase tracking-wider mb-2 shadow-md">
            <span className="text-sm">{currentStation.flag}</span>
            <span>{currentStation.country}</span>
            <span className="text-white/40">•</span>
            <span className="text-[#DE4176]">{currentStation.genre}</span>
          </div>

          {/* Large Station Name */}
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight uppercase leading-tight drop-shadow"
            style={{ fontFamily: 'Arial Black, Impact, sans-serif' }}
          >
            {currentStation.name}
          </h2>

          {/* Frequency & Description */}
          <p className="text-xs sm:text-sm font-mono text-white/75 font-semibold tracking-wider mt-1 uppercase">
            {currentStation.frequency}
          </p>
        </div>
      </main>

      {/* ====================================================
          MINI PLAYER (Following the track - Wensity UI Style)
      ==================================================== */}
      <footer className="w-full bg-[#111114]/95 backdrop-blur-2xl border-t border-white/[0.1] px-4 sm:px-8 py-3.5 sm:py-4 z-40 shadow-[0_-15px_40px_rgba(0,0,0,0.5)]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Left: Station Preview + Equalizer Visualizer */}
          <div className="flex items-center gap-3.5 min-w-[200px] w-full sm:w-auto">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-white/20 shrink-0 shadow-md bg-white/5">
              <img
                src={currentStation.cover}
                alt={currentStation.name}
                className="w-full h-full object-contain p-1"
              />
              {isPlaying && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-[#DE4176] animate-ping" />
                </div>
              )}
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs sm:text-sm text-white tracking-tight truncate max-w-[160px]">
                  {currentStation.name}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-white/80 font-bold shrink-0">
                  {currentStation.flag}
                </span>
              </div>
              <span className="text-[10px] font-mono text-white/50 truncate uppercase">
                {isPlaying ? `${currentStation.country} • EN DIRECTO` : 'EN PAUSA'}
              </span>
            </div>

            {/* Dynamic Equalizer Visualizer Bars */}
            <div className="flex items-end gap-1 h-5 ml-2 shrink-0">
              {[0.4, 0.9, 0.6, 1.0, 0.7, 0.5].map((h, i) => (
                <span
                  key={i}
                  style={{
                    height: isPlaying ? `${Math.max(20, (i % 2 === 0 ? 80 : 100) * h)}%` : '20%',
                    animationDuration: `${0.4 + i * 0.15}s`,
                  }}
                  className={`w-1 rounded-full bg-[#DE4176] transition-all ${
                    isPlaying ? 'animate-pulse' : 'opacity-40'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Center: Transport Controls (Prev, Big Play/Pause, Next) */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Emisora anterior"
              className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 border border-white/10 cursor-pointer"
            >
              <SkipBack className="w-4 h-4 fill-current" />
            </button>

            <button
              type="button"
              onClick={togglePlay}
              disabled={isLoading}
              aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
              className="w-12 h-12 rounded-full bg-[#DE4176] hover:bg-[#c42e61] text-white flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow-[0_0_25px_rgba(222,65,118,0.7)] cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </button>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Siguiente emisora"
              className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 border border-white/10 cursor-pointer"
            >
              <SkipForward className="w-4 h-4 fill-current" />
            </button>
          </div>

          {/* Right: Volume & Indicator */}
          <div className="flex items-center gap-3 min-w-[200px] justify-end">
            <button
              type="button"
              onClick={handleToggleMute}
              className="text-white/70 hover:text-white transition-colors cursor-pointer"
              title={isMuted ? 'Activar sonido' : 'Silenciar'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>

            <div className="w-24 sm:w-28 relative flex items-center">
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#DE4176]"
              />
            </div>

            <span className="text-[11px] font-mono text-white/50 w-8 text-right">
              {isMuted ? '0%' : `${volume}%`}
            </span>
          </div>

        </div>
      </footer>
    </div>
  );
};
