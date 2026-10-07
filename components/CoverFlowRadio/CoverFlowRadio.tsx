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
  Disc
} from 'lucide-react';
import { RADIO_STATIONS } from './stationsData';
import { ButterflyIcon } from '@/components/ButterflyIcon';

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
    <div className="w-full h-full min-h-[640px] flex flex-col justify-between bg-[#FFF6F9] text-[#B03366] select-none overflow-hidden relative font-jost">
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

      {/* ====================================================
          HEADER: STUDIO RECEIVER TOP BAR
      ==================================================== */}
      <header className="w-full px-5 sm:px-8 py-3.5 sm:py-4 flex items-center justify-between border-b border-[rgba(224,69,123,0.14)] bg-white/90 backdrop-blur-xl z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#FFF6F9] border border-[rgba(224,69,123,0.2)] flex items-center justify-center shadow-sm">
            <ButterflyIcon size={16} color="#DE4176" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bodoni font-normal text-base tracking-tight text-[#B03366]">
                Thiago VSC <span className="italic text-[#DE4176]">Studio</span>
              </span>
              <span className="text-[10px] font-jost px-2.5 py-0.5 rounded-full bg-[#DE4176]/10 border border-[#DE4176]/30 text-[#DE4176] font-medium uppercase tracking-widest">
                FM Broadcast
              </span>
            </div>
            <p className="text-[10px] font-jost text-[#B03366]/60 tracking-wider uppercase">
              Receptor sintonizador 24/7 // Audio de alta fidelidad
            </p>
          </div>
        </div>

        {/* Center/Right Status Indicators */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Signal Quality Meter */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF6F9] border border-[rgba(224,69,123,0.18)]">
            <span className="text-[10px] font-jost text-[#B03366]/70 uppercase tracking-widest">Señal</span>
            <div className="flex items-end gap-1 h-3">
              <span className="w-1 h-1 bg-[#DE4176] rounded-full" />
              <span className="w-1 h-1.5 bg-[#DE4176] rounded-full" />
              <span className="w-1 h-2 bg-[#DE4176] rounded-full" />
              <span className="w-1 h-2.5 bg-[#DE4176] rounded-full animate-pulse" />
              <span className="w-1 h-3 bg-[#DE4176] rounded-full animate-pulse" />
            </div>
          </div>

          {/* Live Indicator Pill */}
          <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#DE4176] text-white text-[10px] font-jost font-medium tracking-widest uppercase shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span>En directo</span>
          </div>

          {/* Close button */}
          {onClose && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#FFF6F9] hover:bg-[#DE4176] hover:text-white border border-[rgba(224,69,123,0.2)] text-[#B03366] flex items-center justify-center transition-all cursor-pointer btn-luxury"
              title="Cerrar sintonizador"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* ====================================================
          ANALOG / DIGITAL FM FREQUENCY TUNER GAUGE
      ==================================================== */}
      <div className="w-full bg-[#FFF6F9] border-b border-[rgba(224,69,123,0.14)] px-6 sm:px-12 py-3 z-20 flex flex-col items-center">
        <div className="w-full max-w-3xl flex items-center justify-between text-[10px] font-jost text-[#B03366]/60 tracking-wider mb-1.5 uppercase">
          <span>88.0 MHz</span>
          <span>92.0 MHz</span>
          <span className="hidden sm:inline">96.0 MHz</span>
          <span className="text-[#DE4176] font-semibold">100.0 MHz</span>
          <span className="hidden sm:inline">104.0 MHz</span>
          <span>108.0 MHz</span>
        </div>

        {/* Ruler Bar with Tick Marks and Live Floating Needle */}
        <div className="w-full max-w-3xl relative h-3.5 bg-white rounded-full border border-[rgba(224,69,123,0.18)] overflow-hidden flex items-center px-1">
          {/* Tick lines */}
          <div className="w-full flex justify-between items-center opacity-30 pointer-events-none">
            {Array.from({ length: 33 }).map((_, i) => (
              <span 
                key={i} 
                className={`w-[1px] bg-[#B03366] ${i % 4 === 0 ? 'h-2.5' : 'h-1.5'}`} 
              />
            ))}
          </div>

          {/* Illuminated Tuning Needle */}
          <div 
            className="absolute top-0 bottom-0 w-3 rounded-full bg-[#DE4176] shadow-sm transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] -translate-x-1/2 flex items-center justify-center"
            style={{ left: `${Math.max(2, Math.min(98, tunerPercentage))}%` }}
          >
            <span className="w-1 h-full bg-white rounded-full" />
          </div>
        </div>
      </div>

      {/* ====================================================
          3D COVER FLOW STAGE (Editorial Luxury Style)
      ==================================================== */}
      <main className="flex-1 flex flex-col items-center justify-center relative py-4 sm:py-6 px-4 z-20 overflow-hidden">
        
        {/* Cover Flow Carousel Stage */}
        <div className="relative w-full max-w-4xl h-[330px] sm:h-[370px] flex items-center justify-center" style={{ perspective: '1400px' }}>
          
          {/* Navigation Flank Left Button */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Emisora anterior"
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-40 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white hover:bg-[#DE4176] hover:text-white border border-[rgba(224,69,123,0.2)] text-[#B03366] flex items-center justify-center shadow-luxury transition-all cursor-pointer btn-luxury"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Navigation Flank Right Button */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Siguiente emisora"
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-40 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white hover:bg-[#DE4176] hover:text-white border border-[rgba(224,69,123,0.2)] text-[#B03366] flex items-center justify-center shadow-luxury transition-all cursor-pointer btn-luxury"
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
              const opacity = isCenter ? 1 : Math.max(0.3, 0.85 - Math.abs(offset) * 0.22);

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
                  {/* Luxury Double-Bezel Card Outer Chassis */}
                  <div
                    className={`w-full h-full p-2.5 sm:p-3 rounded-[2.25rem] transition-all duration-300 relative select-none ${
                      isCenter
                        ? 'bg-white border-2 border-white shadow-luxury ring-1 ring-[rgba(224,69,123,0.2)]'
                        : 'bg-white/80 border border-[rgba(224,69,123,0.14)] hover:bg-white shadow-sm'
                    }`}
                  >
                    {/* Inner Album Core */}
                    <div className="w-full h-full rounded-[calc(2.25rem-0.6rem)] overflow-hidden relative bg-[#FFF6F9] border border-[rgba(224,69,123,0.14)] flex flex-col justify-between">
                      {/* Station Artwork */}
                      <div className="relative w-full h-full flex items-center justify-center p-4 bg-[#FFFFFF]">
                        <img
                          src={station.cover}
                          alt={station.name}
                          className="w-full h-full object-contain pointer-events-none transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>

                      {/* Top Bar on Center Card: Live Badge & ISO Country Tag */}
                      <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10 pointer-events-none">
                        {isCenter && isPlaying ? (
                          <div className="inline-flex items-center gap-1.5 bg-[#DE4176] text-white text-[9px] font-jost font-medium px-2.5 py-0.5 rounded-full shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            <span>ON AIR</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1 bg-white/90 border border-[rgba(224,69,123,0.2)] text-[#B03366] text-[9px] font-jost font-medium px-2 py-0.5 rounded-full shadow-sm">
                            <span>0{idx + 1}</span>
                          </div>
                        )}

                        {/* Country ISO Badge */}
                        <div className="px-2 py-0.5 rounded-full bg-white/90 border border-[rgba(224,69,123,0.2)] text-[9px] font-jost font-medium text-[#B03366] uppercase tracking-wider shadow-sm">
                          [{station.countryCode}]
                        </div>
                      </div>

                      {/* Bottom Info Bar on Album */}
                      <div className="absolute bottom-0 inset-x-0 p-3 pt-6 bg-white/95 border-t border-[rgba(224,69,123,0.12)] pointer-events-none">
                        <div className="text-[10px] font-jost text-[#DE4176] uppercase truncate font-medium">
                          {station.frequency}
                        </div>
                        <h4 className="font-bodoni text-sm sm:text-base text-[#B03366] tracking-tight uppercase truncate font-normal">
                          {station.name}
                        </h4>
                      </div>
                    </div>
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
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white border border-[rgba(224,69,123,0.2)] text-[#B03366] font-jost text-[11px] font-medium uppercase tracking-wider mb-2 shadow-sm">
            <span>[{currentStation.countryCode}] {currentStation.country}</span>
            <span className="text-[#DE4176]">•</span>
            <span className="text-[#DE4176]">{currentStation.genre}</span>
          </div>

          {/* Large Station Headline in Bodoni Moda */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bodoni text-[#B03366] tracking-tight uppercase leading-none font-normal">
            {currentStation.name}
          </h2>

          {/* Technical Frequency Slogan */}
          <p className="text-xs sm:text-sm font-jost text-[#DE4176] font-medium tracking-widest mt-2 uppercase">
            {currentStation.frequency}
          </p>
        </div>
      </main>

      {/* ====================================================
          MASTER TRANSPORT CONTROL DECK (Footer Tray)
      ==================================================== */}
      <footer className="w-full bg-white border-t border-[rgba(224,69,123,0.14)] px-4 sm:px-8 py-3.5 sm:py-4 z-40 shadow-sm">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Left: Station Preview + Live Audio VU Spectrum */}
          <div className="flex items-center gap-3.5 min-w-[220px] w-full sm:w-auto">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-[rgba(224,69,123,0.2)] shrink-0 shadow-sm bg-[#FFF6F9] flex items-center justify-center">
              <img
                src={currentStation.cover}
                alt={currentStation.name}
                className="w-full h-full object-contain p-1"
              />
              {isPlaying && (
                <div className="absolute inset-0 bg-[#DE4176]/20 flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-[#DE4176] animate-ping" />
                </div>
              )}
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bodoni font-normal text-sm text-[#B03366] tracking-tight truncate max-w-[150px]">
                  {currentStation.name}
                </span>
                <span className="text-[9px] font-jost px-1.5 py-0.5 rounded bg-[#FFF6F9] text-[#DE4176] font-medium shrink-0 border border-[rgba(224,69,123,0.2)]">
                  [{currentStation.countryCode}]
                </span>
              </div>
              <span className="text-[10px] font-jost text-[#B03366]/60 truncate uppercase font-medium">
                {isPlaying ? 'Emisión en directo' : 'En pausa'}
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
              className="w-10 h-10 rounded-full bg-[#FFF6F9] hover:bg-[#DE4176] hover:text-white text-[#B03366] flex items-center justify-center transition-all border border-[rgba(224,69,123,0.2)] cursor-pointer btn-luxury"
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
              className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#DE4176] hover:bg-[#c22e61] text-white flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 shadow-luxury cursor-pointer btn-luxury relative"
              title={isPlaying ? "Pausar emisión" : "Reproducir emisión"}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </button>

            {/* Next Button */}
            <button
              type="button"
              onClick={handleNext}
              aria-label="Siguiente emisora"
              className="w-10 h-10 rounded-full bg-[#FFF6F9] hover:bg-[#DE4176] hover:text-white text-[#B03366] flex items-center justify-center transition-all border border-[rgba(224,69,123,0.2)] cursor-pointer btn-luxury"
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
              className="text-[#B03366] hover:text-[#DE4176] transition-colors cursor-pointer btn-luxury p-1"
              title={isMuted ? 'Activar sonido' : 'Silenciar'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-[#DE4176]" />
              ) : (
                <Volume2 className="w-4 h-4 text-[#B03366]" />
              )}
            </button>

            <div className="w-24 sm:w-28 relative flex items-center">
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                className="w-full h-1.5 bg-[#FFF6F9] border border-[rgba(224,69,123,0.2)] rounded-lg appearance-none cursor-pointer accent-[#DE4176]"
              />
            </div>

            <span className="text-[11px] font-jost text-[#B03366] w-9 text-right font-medium tabular-nums">
              {isMuted ? 'MUT' : `${volume}%`}
            </span>
          </div>

        </div>
      </footer>
    </div>
  );
};
