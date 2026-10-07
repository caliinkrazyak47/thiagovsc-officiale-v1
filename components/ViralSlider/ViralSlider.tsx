'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { 
  Play, 
  Pause,
  Volume2, 
  VolumeX, 
  Maximize2,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { ButterflyIcon } from '@/components/ButterflyIcon';
import { BicolorSectionTitle } from '@/components/BicolorSectionTitle';
import { useMediaStore } from '@/lib/mediaStore';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface TikTokVideoItem {
  id: string;
  user: string;
  src: string;
  poster: string;
}

const TIKTOK_VIDEOS: TikTokVideoItem[] = [
  { 
    id: 'tt-1',
    user: '_ariannadiazv', 
    src: '/videos/tiktok/video1.mp4', 
    poster: '/images/cover1.jpg',
  },
  { 
    id: 'tt-2',
    user: 'carmenbrads', 
    src: '/videos/tiktok/video2.mp4', 
    poster: '/images/cover2.jpg',
  },
  { 
    id: 'tt-3',
    user: 'ameliolivera', 
    src: '/videos/tiktok/video3.mp4', 
    poster: '/images/cover3.jpg',
  },
  { 
    id: 'tt-4',
    user: 'iriss.vallaranii', 
    src: '/videos/tiktok/video4.mp4', 
    poster: '/images/cover4.jpg',
  },
  { 
    id: 'tt-5',
    user: 'elisa.bernardonii__', 
    src: '/videos/tiktok/video5.mp4', 
    poster: '/images/cover5.jpg',
  },
];

interface CustomTikTokPlayerProps {
  item: TikTokVideoItem;
  isActive: boolean;
  index: number;
  onOpenFullscreen: (index: number) => void;
}

const CustomTikTokPlayer: React.FC<CustomTikTokPlayerProps> = ({ 
  item, 
  isActive, 
  index, 
  onOpenFullscreen 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const { activeMediaId, setActiveMedia } = useMediaStore();
  const mediaKey = `tiktok-${index}`;

  // Pause if another media starts playing
  useEffect(() => {
    if (activeMediaId && activeMediaId !== mediaKey && isPlaying) {
      const vid = videoRef.current;
      if (vid) {
        vid.pause();
        setIsPlaying(false);
      }
    }
  }, [activeMediaId, mediaKey, isPlaying]);

  // Autoplay in muted when active/center, pause when out of center
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    if (isActive) {
      vid.muted = isMuted;
      vid.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      vid.pause();
      setIsPlaying(false);
    }
  }, [isActive, isMuted]);

  const togglePlay = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const vid = videoRef.current;
    if (!vid) return;

    if (vid.paused) {
      setActiveMedia(mediaKey);
      vid.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      vid.pause();
      setIsPlaying(false);
    }
  }, [mediaKey, setActiveMedia]);

  const toggleMute = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = !vid.muted;
    setIsMuted(vid.muted);
    if (!vid.muted) {
      setActiveMedia(mediaKey);
    }
  }, [mediaKey, setActiveMedia]);

  const handleFullscreenClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenFullscreen(index);
  };

  return (
    <div 
      className="relative w-full h-full bg-[#3A1528] select-none overflow-hidden cursor-pointer group"
      onClick={togglePlay}
      data-cursor="Ver"
    >
      <video
        ref={videoRef}
        src={item.src}
        poster={item.poster}
        loop
        playsInline
        preload="metadata"
        muted={isMuted}
        className="w-full h-full object-cover pointer-events-none"
      />

      {/* 1. Play/Pause Button in Center (glass, --champagne) */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#2B0F1E]/30 pointer-events-none transition-opacity">
          <div className="w-16 h-16 rounded-full bg-[#FFE9D6]/90 backdrop-blur-md text-[#A3285C] flex items-center justify-center shadow-luxury">
            <Play className="w-7 h-7 fill-current translate-x-0.5" />
          </div>
        </div>
      )}

      {/* Top Left Signature Butterfly in champagne */}
      <div className="absolute top-3.5 left-3.5 z-20 pointer-events-none opacity-85">
        <ButterflyIcon size={16} color="#FFE9D6" strokeWidth={1.5} />
      </div>

      {/* 2. Pantalla Completa Button: Top Right */}
      <div className="absolute top-3.5 right-3.5 z-20 pointer-events-auto">
        <button
          type="button"
          onClick={handleFullscreenClick}
          className="w-9 h-9 rounded-full bg-[#FFE9D6]/90 text-[#A3285C] hover:bg-[#FFE9D6] flex items-center justify-center shadow-sm transition-transform active:scale-90 cursor-pointer"
          title="Pantalla completa"
          aria-label="Ver a pantalla completa"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* 3. Mute Button: Bottom Left */}
      <div className="absolute bottom-3.5 left-3.5 z-20 pointer-events-auto">
        <button
          type="button"
          onClick={toggleMute}
          className="w-9 h-9 rounded-full bg-[#FFE9D6]/90 text-[#A3285C] hover:bg-[#FFE9D6] flex items-center justify-center shadow-sm transition-transform active:scale-90 cursor-pointer"
          title={isMuted ? 'Activar sonido' : 'Silenciar'}
          aria-label="Silenciar / Activar sonido"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-[#E0457B]" /> : <Volume2 className="w-4 h-4 text-[#A3285C]" />}
        </button>
      </div>

      {/* Creator Handle at bottom (next to mute button) */}
      <div className="absolute bottom-4 left-14 z-20 pointer-events-none font-satoshi text-xs font-medium text-[#FFE9D6] drop-shadow">
        @{item.user}
      </div>
    </div>
  );
};

export const ViralSlider: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);

  const { setActiveMedia } = useMediaStore();

  // GSAP Horizontal Scroll Pinning on Desktop
  useGSAP(() => {
    if (window.matchMedia('(max-width: 1024px)').matches) return;

    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const paddingLateral = window.innerWidth * 0.5 - 150;
    const getDistance = () => track.scrollWidth - window.innerWidth + paddingLateral;

    gsap.to(track, {
      x: () => -getDistance(),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        pin: true,
        scrub: 1,
        start: 'top top',
        end: () => '+=' + getDistance(),
        invalidateOnRefresh: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          setProgressPercent(self.progress * 100);

          const total = TIKTOK_VIDEOS.length;
          const idx = Math.min(
            total - 1,
            Math.max(0, Math.round(self.progress * (total - 1)))
          );
          setActiveIndex(idx);
        },
      },
    });

    document.fonts.ready.then(() => {
      ScrollTrigger.refresh();
    });

    const handleLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', handleLoad);
    return () => window.removeEventListener('load', handleLoad);
  }, { scope: sectionRef, dependencies: [TIKTOK_VIDEOS.length] });

  // Fullscreen Modal keyboard navigation
  useEffect(() => {
    if (fullscreenIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setFullscreenIndex(null);
      } else if (e.key === 'ArrowRight') {
        setFullscreenIndex((prev) => (prev !== null ? (prev + 1) % TIKTOK_VIDEOS.length : 0));
      } else if (e.key === 'ArrowLeft') {
        setFullscreenIndex((prev) =>
          prev !== null ? (prev - 1 + TIKTOK_VIDEOS.length) % TIKTOK_VIDEOS.length : 0
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fullscreenIndex]);

  const openFullscreen = (index: number) => {
    setFullscreenIndex(index);
    setActiveMedia(`tiktok-modal-${index}`);
  };

  const closeFullscreen = () => {
    setFullscreenIndex(null);
  };

  return (
    <section 
      ref={sectionRef}
      id="tiktok" 
      className="tiktok w-full relative bg-[#E0457B] text-[#FFE9D6] select-none border-b border-[rgba(255,233,214,0.18)]"
    >
      {/* DESKTOP PINNED WRAPPER (>= 1024px) */}
      <div className="pin-wrap hidden lg:flex w-full h-screen flex-col justify-between py-10 px-[6vw] overflow-hidden">
        
        {/* Top Header con título y etiqueta mariposa */}
        <div className="w-full flex items-end justify-between border-b border-[rgba(255,233,214,0.18)] pb-4">
          <div>
            <div className="inline-flex items-center gap-2 font-satoshi text-[12px] font-medium tracking-[0.28em] uppercase text-[#FFE9D6] mb-2">
              <ButterflyIcon size={14} color="#FFE9D6" strokeWidth={1.5} />
              <span>02 · VIRAL</span>
            </div>
            <BicolorSectionTitle firstWord="TikTok" secondWord="Feed" variant="onBrand" />
          </div>

          <div className="font-satoshi text-xs uppercase tracking-[0.28em] text-[#FFE9D6] flex items-center gap-2 tabular-nums">
            <span>{`0${activeIndex + 1} / 0${TIKTOK_VIDEOS.length}`}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFE9D6] animate-pulse" />
          </div>
        </div>

        {/* Central Track con tarjetas rectas */}
        <div 
          ref={trackRef} 
          className="track flex items-center gap-8 py-6 will-change-transform"
          style={{ paddingRight: 'calc(50vw - 140px)' }}
        >
          {TIKTOK_VIDEOS.map((item, idx) => {
            const isCenter = idx === activeIndex;
            return (
              <div
                key={item.id}
                className={cn(
                  "tiktok-card relative flex-shrink-0 w-[clamp(220px,20vw,300px)] aspect-[9/16] rounded-[20px] border-[4px] border-[#FFE9D6] shadow-luxury overflow-hidden transition-all duration-300 ease-out",
                  isCenter 
                    ? "scale-[1.04] opacity-100 z-20" 
                    : "scale-[0.94] opacity-75 z-10"
                )}
                style={{ transformOrigin: 'center center' }}
              >
                <CustomTikTokPlayer 
                  item={item} 
                  isActive={isCenter} 
                  index={idx}
                  onOpenFullscreen={openFullscreen}
                />
              </div>
            );
          })}
        </div>

        {/* Bottom Track Controls: Barra de progreso y contador alineados abajo a la derecha */}
        <div className="w-full flex items-center justify-end gap-6 border-t border-[rgba(255,233,214,0.18)] pt-4">
          <div className="w-48 h-[2px] bg-[#FFE9D6]/25 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#FFE9D6] transition-all duration-150"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="font-satoshi text-xs tracking-[0.28em] text-[#FFE9D6] uppercase font-medium tabular-nums">
            {`0${activeIndex + 1} / 0${TIKTOK_VIDEOS.length}`}
          </div>
        </div>
      </div>

      {/* MOBILE SNAP WRAPPER (< 1024px) */}
      <div className="lg:hidden w-full py-12 px-6">
        <div className="mb-6 border-b border-[rgba(255,233,214,0.18)] pb-4">
          <div className="inline-flex items-center gap-2 font-satoshi text-[12px] font-medium tracking-[0.28em] uppercase text-[#FFE9D6] mb-2">
            <ButterflyIcon size={14} color="#FFE9D6" strokeWidth={1.5} />
            <span>02 · VIRAL</span>
          </div>
          <BicolorSectionTitle firstWord="TikTok" secondWord="Feed" variant="onBrand" />
        </div>

        {/* Native Horizontal Snap Slider */}
        <div 
          className="flex items-center gap-4 overflow-x-auto pb-4 snap-x snap-mandatory"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {TIKTOK_VIDEOS.map((item, idx) => (
            <div
              key={item.id}
              className="flex-shrink-0 w-[78vw] max-w-[300px] aspect-[9/16] rounded-[20px] border-[4px] border-[#FFE9D6] shadow-luxury overflow-hidden snap-center"
            >
              <CustomTikTokPlayer 
                item={item} 
                isActive={true} 
                index={idx}
                onOpenFullscreen={openFullscreen}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Flip Modal Viewer */}
      {fullscreenIndex !== null && (
        <div 
          className="fixed inset-0 z-[9999] bg-[#2B0F1E]/95 backdrop-blur-2xl flex items-center justify-center p-4 select-none animate-in fade-in duration-300"
          onClick={closeFullscreen}
        >
          <button
            type="button"
            onClick={closeFullscreen}
            className="absolute top-6 right-6 z-50 w-11 h-11 rounded-full bg-[#FFE9D6]/90 text-[#A3285C] flex items-center justify-center shadow-luxury cursor-pointer hover:scale-105 active:scale-95 transition-transform"
            aria-label="Cerrar visor"
          >
            <X className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setFullscreenIndex((prev) => (prev !== null ? (prev - 1 + TIKTOK_VIDEOS.length) % TIKTOK_VIDEOS.length : 0));
            }}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-[#FFE9D6]/90 text-[#A3285C] hidden md:flex items-center justify-center shadow-luxury cursor-pointer hover:scale-105 active:scale-95 transition-transform"
            aria-label="Video anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setFullscreenIndex((prev) => (prev !== null ? (prev + 1) % TIKTOK_VIDEOS.length : 0));
            }}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-[#FFE9D6]/90 text-[#A3285C] hidden md:flex items-center justify-center shadow-luxury cursor-pointer hover:scale-105 active:scale-95 transition-transform"
            aria-label="Siguiente video"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div 
            className="relative w-full max-w-[420px] aspect-[9/16] max-h-[85vh] rounded-[24px] overflow-hidden border-[4px] border-[#FFE9D6] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              src={TIKTOK_VIDEOS[fullscreenIndex].src}
              autoPlay
              loop
              playsInline
              controls
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
    </section>
  );
};
