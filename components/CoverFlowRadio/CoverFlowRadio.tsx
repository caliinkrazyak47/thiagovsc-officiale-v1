'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Hls from 'hls.js';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Radio, 
  X,
  ChevronLeft,
  ChevronRight,
  Activity,
  Disc
} from 'lucide-react';
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

  // Frequency Ruler Progress Percentage
  const tunerPercentage = ((activeIndex) / (RADIO_STATIONS.length - 1)) * 100;

  return (
    <div className="w-full h-full min-h-[640px] flex flex-col justify-between bg-[#FAFAF9] text-[#1A1622] select-none overflow-hidden relative font-jakarta">
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

      {/* Ambient Radial Aura from current station accent color */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[480px] rounded-full blur-[160px] opacity-15 pointer-events-none transition-colors duration-1000"
        style={{ backgroundColor: currentStation.accentColor || '#DE4176' }}
      />

      {/* Micro-grid background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#0000000a_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none opacity-50" />

      {/* ====================================================
          HEADER: STUDIO RECEIVER TOP BAR (Braun / Apple Light)
      ==================================================== */}
      <header className="w-full px-5 sm:px-8 py-3.5 sm:py-4 flex items-center justify-between border-b border-stone-200/80 backdrop-blur-2xl bg-white/85 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center shadow-sm">
            <Radio className="w-4 h-4 text-[#DE4176]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-syne font-black text-sm tracking-tight text-[#1A1622] uppercase">
                THIAGO VSC // TUNER
              </span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#DE4176]/10 border border-[#DE4176]/25 text-[#DE4176] font-extrabold uppercase tracking-widest">
                FM BROADCAST
              </span>
            </div>
            <p className="text-[9px] font-mono text-stone-500 tracking-widest uppercase">
              RECEPTOR ESTUDIO 4K // EMISIÓN GLOBAL 24/7
            </p>
          </div>
        </div>

        {/* Center/Right Status Jewels */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Signal Quality Meter */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 border border-stone-200">
            <span className="text-[9px] font-mono text-stone-600 font-bold uppercase tracking-widest">SEÑAL</span>
            <div className="flex items-end gap-0.5 h-3">
              <span className="w-1 h-1 bg-[#10B981] rounded-full" />
              <span className="w-1 h-1.5 bg-[#10B981] rounded-full" />
              <span className="w-1 h-2 bg-[#10B981] rounded-full" />
              <span className="w-1 h-2.5 bg-[#10B981] rounded-full animate-pulse" />
              <span className="w-1 h-3 bg-[#10B981] rounded-full animate-pulse" />
            </div>
          </div>

          {/* Live Indicator Pill */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#DE4176]/10 border border-[#DE4176]/25 text-[#DE4176] text-[10px] font-mono font-bold tracking-widest uppercase shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#DE4176] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#DE4176]"></span>
            </span>
            <span>EN DIRECTO</span>
          </div>

          {/* Close button */}
          {onClose && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-stone-100 hover:bg-[#DE4176] border border-stone-200 text-stone-700 hover:text-white flex items-center justify-center transition-all cursor-pointer haptic-press shadow-sm"
              title="Cerrar receptor"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>


      {/* ====================================================
          ANALOG / DIGITAL FM FREQUENCY TUNER GAUGE
      ==================================================== */}
      <div className="w-full bg-white/90 border-b border-stone-200/80 px-6 sm:px-12 py-2.5 z-20 flex flex-col items-center">
        <div className="w-full max-w-3xl flex items-center justify-between text-[9px] font-mono text-stone-500 tracking-wider mb-1 uppercase">
          <span>88.0 MHz</span>
          <span>92.0 MHz</span>
          <span className="hidden sm:inline">96.0 MHz</span>
          <span className="text-[#DE4176] font-bold">100.0 MHz</span>
          <span className="hidden sm:inline">104.0 MHz</span>
          <span>108.0 MHz</span>
        </div>

        {/* Ruler Bar with Tick Marks and Live Floating Needle */}
        <div className="w-full max-w-3xl relative h-3 bg-stone-100 rounded-full border border-stone-200 overflow-hidden flex items-center px-1">
          {/* Tick lines */}
          <div className="w-full flex justify-between items-center opacity-40 pointer-events-none">
            {Array.from({ length: 33 }).map((_, i) => (
              <span 
                key={i} 
                className={`w-[1px] bg-stone-400 ${i % 4 === 0 ? 'h-2.5' : 'h-1.5'}`} 
              />
            ))}
          </div>

          {/* Illuminated Tuning Needle */}
          <div 
            className="absolute top-0 bottom-0 w-3 rounded-full bg-[#DE4176] shadow-[0_0_12px_#DE4176] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] -translate-x-1/2 flex items-center justify-center"
            style={{ left: `${Math.max(2, Math.min(98, tunerPercentage))}%` }}
          >
            <span className="w-1 h-full bg-white rounded-full" />
          </div>
        </div>
      </div>


      {/* ====================================================
          3D COVER FLOW STAGE (Braun / Apple White Edition)
      ==================================================== */}
      <main className="flex-1 flex flex-col items-center justify-center relative py-4 sm:py-6 px-4 z-20 overflow-hidden">
        
        {/* Cover Flow Carousel Stage */}
        <div className="relative w-full max-w-4xl h-[330px] sm:h-[370px] flex items-center justify-center" style={{ perspective: '1400px' }}>
          
          {/* Navigation Flank Left Button */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Emisora anterior"
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-40 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white hover:bg-[#DE4176] border border-stone-200 text-[#DE4176] hover:text-white flex items-center justify-center shadow-lg transition-all cursor-pointer haptic-press"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Navigation Flank Right Button */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Siguiente emisora"
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-40 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white hover:bg-[#DE4176] border border-stone-200 text-[#DE4176] hover:text-white flex items-center justify-center shadow-lg transition-all cursor-pointer haptic-press"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* 3D Cards Track */}
          <div className="relative w-full h-full flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
            {RADIO_STATIONS.map((station, idx) => {
              const offset = idx - activeIndex;
              const isCenter = offset === 0;

              // Hide far away cards to optimize performance
              if (Math.abs(offset) > 3) return null;

              // 3D Cover Flow Calculation
              const translateX = offset === 0 ? 0 : offset * 185 + (offset > 0 ? 35 : -35);
              const translateZ = isCenter ? 95 : -95;
              const rotateY = isCenter ? 0 : offset > 0 ? -50 : 50;
              const scale = isCenter ? 1 : 0.82;
              const zIndex = 30 - Math.abs(offset) * 5;
              const opacity = isCenter ? 1 : Math.max(0.35, 0.85 - Math.abs(offset) * 0.22);

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
                  className="absolute w-[210px] xs:w-[230px] sm:w-[265px] md:w-[285px] aspect-square cursor-pointer group"
                >
                  {/* Double-Bezel Card Outer Chassis - Ceramic Edition */}
                  <div
                    className={`w-full h-full p-2 sm:p-2.5 rounded-[2.25rem] transition-all duration-300 relative select-none ${
                      isCenter
                        ? 'bg-gradient-to-b from-white via-[#FAF9F7] to-[#F3F2F0] ring-2 ring-[#DE4176]/50 shadow-[0_25px_60px_rgba(222,65,118,0.2),0_2px_12px_rgba(0,0,0,0.06)]'
                        : 'bg-white ring-1 ring-stone-200 hover:ring-stone-300 shadow-[0_15px_35px_rgba(0,0,0,0.08)]'
                    }`}
                  >
                    {/* Inner Album Core with Concentric Radius */}
                    <div className="w-full h-full rounded-[calc(2.25rem-0.5rem)] overflow-hidden relative bg-white border border-stone-200/80 flex flex-col justify-between shadow-inner">
                      {/* Station Artwork */}
                      <div className="relative w-full h-full flex items-center justify-center p-3 sm:p-4 bg-gradient-to-b from-stone-50 to-stone-100">
                        <img
                          src={station.cover}
                          alt={station.name}
                          className="w-full h-full object-contain pointer-events-none transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>

                      {/* Top Bar on Center Card: Live Badge & ISO Country Tag */}
                      <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10 pointer-events-none">
                        {isCenter && isPlaying ? (
                          <div className="inline-flex items-center gap-1.5 bg-[#DE4176] text-white text-[9px] font-mono font-black px-2.5 py-0.5 rounded-full shadow-md">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            <span>ON AIR</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-md border border-stone-200 text-stone-700 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full shadow-sm">
                            <span>0{idx + 1}</span>
                          </div>
                        )}

                        {/* Country ISO Badge */}
                        <div className="px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-md border border-stone-200 text-[9px] font-mono font-black text-stone-800 uppercase tracking-wider shadow-sm">
                          [{station.countryCode}]
                        </div>
                      </div>

                      {/* Bottom Info Bar on Album */}
                      <div className="absolute bottom-0 inset-x-0 p-3 pt-6 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none">
                        <div className="text-[9px] font-mono text-stone-500 uppercase truncate font-bold">
                          {station.frequency}
                        </div>
                        <h4 className="font-syne font-black text-sm sm:text-base text-stone-900 tracking-tight uppercase truncate">
                          {station.name}
                        </h4>
                      </div>
                    </div>
                  </div>

                  {/* Realistic Mirror Reflection Floor */}
                  <div
                    style={{
                      transform: 'scaleY(-1) translateY(-12px)',
                      opacity: isCenter ? 0.2 : 0.08,
                      maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 65%)',
                      WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 65%)',
                      transition: 'opacity 0.5s ease',
                    }}
                    className="w-full h-[55%] rounded-[2.25rem] overflow-hidden pointer-events-none mt-2"
                  >
                    <img
                      src={station.cover}
                      alt=""
                      className="w-full h-full object-contain p-2 blur-[1px] bg-stone-100"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ====================================================
            STATION TELEMETRY DECK (Centered Typography)
        ==================================================== */}
        <div className="text-center mt-5 sm:mt-7 z-30 max-w-xl mx-auto flex flex-col items-center">
          {/* Country & Genre Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white shadow-sm border border-stone-200 text-stone-800 font-mono text-[11px] font-bold uppercase tracking-wider mb-2">
            <span>[{currentStation.countryCode}] {currentStation.country}</span>
            <span className="text-stone-300">//</span>
            <span className="text-[#DE4176]">{currentStation.genre}</span>
          </div>

          {/* Large Station Headline */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-syne font-black text-stone-900 tracking-[-0.03em] uppercase leading-none drop-shadow-sm">
            {currentStation.name}
          </h2>

          {/* Technical Frequency Slogan */}
          <p className="text-xs sm:text-sm font-mono text-stone-600 font-bold tracking-wider mt-2 uppercase">
            {currentStation.frequency}
          </p>
        </div>
      </main>


      {/* ====================================================
          MASTER TRANSPORT CONTROL DECK (Footer Tray)
      ==================================================== */}
      <footer className="w-full bg-white/95 backdrop-blur-2xl border-t border-stone-200/80 px-4 sm:px-8 py-3.5 sm:py-4 z-40 shadow-[0_-10px_30px_rgba(0,0,0,0.04)]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Left: Station Preview + Live Audio VU Spectrum */}
          <div className="flex items-center gap-3.5 min-w-[220px] w-full sm:w-auto">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-stone-200 shrink-0 shadow-sm bg-stone-50 flex items-center justify-center">
              <img
                src={currentStation.cover}
                alt={currentStation.name}
                className="w-full h-full object-contain p-1"
              />
              {isPlaying && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-[#DE4176] animate-ping" />
                </div>
              )}
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-syne font-black text-xs sm:text-sm text-stone-900 tracking-tight truncate max-w-[150px] uppercase">
                  {currentStation.name}
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-stone-100 border border-stone-200 text-stone-700 font-bold shrink-0">
                  [{currentStation.countryCode}]
                </span>
              </div>
              <span className="text-[10px] font-mono text-stone-500 truncate uppercase font-semibold">
                {isPlaying ? 'EN DIRECTO // LIVE' : 'EN PAUSA'}
              </span>
            </div>

            {/* Dynamic Equalizer Visualizer Spectrum */}
            <div className="flex items-end gap-1 h-5 ml-2 shrink-0">
              {[0.35, 0.85, 0.55, 1.0, 0.75, 0.45, 0.9, 0.6].map((h, i) => (
                <span
                  key={i}
                  style={{
                    height: isPlaying ? `${Math.max(20, (i % 2 === 0 ? 80 : 100) * h)}%` : '15%',
                    animationDuration: `${0.35 + (i % 4) * 0.12}s`,
                  }}
                  className={`w-1 rounded-full bg-[#DE4176] transition-all ${
                    isPlaying ? 'animate-pulse' : 'opacity-30'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Center: Anodized Transport Controls */}
          <div className="flex items-center gap-4">
            {/* Prev Button */}
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Emisora anterior"
              className="w-10 h-10 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 flex items-center justify-center transition-all border border-stone-200 cursor-pointer haptic-press shadow-sm"
              title="Anterior emisora (Flecha Izq)"
            >
              <SkipBack className="w-4 h-4 fill-current" />
            </button>

            {/* Master Play / Pause Button with Pulsing Glow */}
            <button
              type="button"
              onClick={togglePlay}
              disabled={isLoading}
              aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
              className="w-14 h-14 rounded-full bg-[#DE4176] hover:bg-[#c22e61] text-white flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 shadow-[0_0_25px_rgba(222,65,118,0.5)] cursor-pointer haptic-press relative"
              title={isPlaying ? "Pausar emisión" : "Reproducir emisión"}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-6 h-6 fill-current" />
              ) : (
                <Play className="w-6 h-6 fill-current ml-0.5" />
              )}
            </button>

            {/* Next Button */}
            <button
              type="button"
              onClick={handleNext}
              aria-label="Siguiente emisora"
              className="w-10 h-10 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 flex items-center justify-center transition-all border border-stone-200 cursor-pointer haptic-press shadow-sm"
              title="Siguiente emisora (Flecha Der)"
            >
              <SkipForward className="w-4 h-4 fill-current" />
            </button>
          </div>

          {/* Right: Master Volume Stepper & Slider */}
          <div className="flex items-center gap-3 min-w-[220px] justify-end">
            <button
              type="button"
              onClick={handleToggleMute}
              className="text-stone-600 hover:text-[#DE4176] transition-colors cursor-pointer haptic-press p-1"
              title={isMuted ? 'Activar sonido' : 'Silenciar'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-[#EF4444]" />
              ) : (
                <Volume2 className="w-4 h-4 text-[#DE4176]" />
              )}
            </button>

            <div className="w-24 sm:w-28 relative flex items-center">
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#DE4176]"
              />
            </div>

            <span className="text-[10px] font-mono text-stone-700 w-9 text-right font-bold tabular-nums">
              {isMuted ? 'MUT' : `${volume}%`}
            </span>
          </div>

        </div>
      </footer>
    </div>
  );
};
