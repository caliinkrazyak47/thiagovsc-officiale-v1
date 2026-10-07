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
  Heart, 
  MessageCircle, 
  Bookmark, 
  Share2, 
  Check,
  Maximize2,
  Minimize2,
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
  likes: string;
  comments: string;
  bookmarks: string;
}

const TIKTOK_VIDEOS: TikTokVideoItem[] = [
  { 
    id: 'tt-1',
    user: '_ariannadiazv', 
    src: '/videos/tiktok/video1.mp4', 
    poster: '/images/cover1.jpg',
    likes: '1.2M',
    comments: '34.2K',
    bookmarks: '88.1K',
  },
  { 
    id: 'tt-2',
    user: 'carmenbrads', 
    src: '/videos/tiktok/video2.mp4', 
    poster: '/images/cover2.jpg',
    likes: '940K',
    comments: '18.9K',
    bookmarks: '45.3K',
  },
  { 
    id: 'tt-3',
    user: 'ameliolivera', 
    src: '/videos/tiktok/video3.mp4', 
    poster: '/images/cover3.jpg',
    likes: '1.8M',
    comments: '62.4K',
    bookmarks: '120K',
  },
  { 
    id: 'tt-4',
    user: 'iriss.vallaranii', 
    src: '/videos/tiktok/video4.mp4', 
    poster: '/images/cover4.jpg',
    likes: '780K',
    comments: '39.8K',
    bookmarks: '39.8K',
  },
  { 
    id: 'tt-5',
    user: 'elisa.bernardonii__', 
    src: '/videos/tiktok/video1.mp4', // Optimized lightweight MP4 for reliable smooth playback
    poster: '/images/cover5.jpg',
    likes: '2.4M',
    comments: '91.8K',
    bookmarks: '184K',
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
  const [progress, setProgress] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasBookmarked, setHasBookmarked] = useState(false);

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

  const handleTimeUpdate = () => {
    const vid = videoRef.current;
    if (!vid || !vid.duration) return;
    setProgress((vid.currentTime / vid.duration) * 100);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHasLiked(!hasLiked);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHasBookmarked(!hasBookmarked);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: `@${item.user} en TikTok`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
    }
  };

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
        onTimeUpdate={handleTimeUpdate}
        className="w-full h-full object-cover pointer-events-none"
      />

      {/* Big Play/Pause Button in Center (glass, --champagne) */}
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

      {/* Top Right Controls: Mute + Fullscreen */}
      <div className="absolute top-3.5 right-3.5 z-20 flex items-center gap-2 pointer-events-auto">
        <button
          type="button"
          onClick={toggleMute}
          className="w-9 h-9 rounded-full bg-[#FFE9D6]/90 text-[#A3285C] hover:bg-[#FFE9D6] flex items-center justify-center shadow-sm transition-transform active:scale-90 cursor-pointer"
          title={isMuted ? 'Activar sonido' : 'Silenciar'}
          aria-label="Silenciar / Activar sonido"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-[#E0457B]" /> : <Volume2 className="w-4 h-4 text-[#A3285C]" />}
        </button>

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

      {/* Right Social Actions Rail */}
      <div className="absolute right-3 bottom-14 z-20 flex flex-col items-center gap-3 pointer-events-auto">
        <button
          type="button"
          onClick={handleLike}
          className="flex flex-col items-center gap-0.5 cursor-pointer transition-transform active:scale-90"
          aria-label="Me gusta"
        >
          <div className={cn(
            "w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-sm",
            hasLiked ? "bg-[#E0457B] text-[#FFE9D6]" : "bg-[#FFE9D6]/90 text-[#A3285C]"
          )}>
            <Heart className={cn("w-4 h-4", hasLiked && "fill-current")} />
          </div>
          <span className="text-[9px] font-jost font-semibold text-[#FFE9D6] drop-shadow">{item.likes}</span>
        </button>

        <div className="flex flex-col items-center gap-0.5">
          <div className="w-9 h-9 rounded-full bg-[#FFE9D6]/90 text-[#A3285C] flex items-center justify-center shadow-sm">
            <MessageCircle className="w-4 h-4" />
          </div>
          <span className="text-[9px] font-jost font-semibold text-[#FFE9D6] drop-shadow">{item.comments}</span>
        </div>

        <button
          type="button"
          onClick={handleBookmark}
          className="flex flex-col items-center gap-0.5 cursor-pointer transition-transform active:scale-90"
          aria-label="Guardar clip"
        >
          <div className={cn(
            "w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-sm",
            hasBookmarked ? "bg-[#E0457B] text-[#FFE9D6]" : "bg-[#FFE9D6]/90 text-[#A3285C]"
          )}>
            <Bookmark className={cn("w-4 h-4", hasBookmarked && "fill-current")} />
          </div>
          <span className="text-[9px] font-jost font-semibold text-[#FFE9D6] drop-shadow">{item.bookmarks}</span>
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="flex flex-col items-center gap-0.5 cursor-pointer transition-transform active:scale-90"
          aria-label="Compartir clip"
        >
          <div className="w-9 h-9 rounded-full bg-[#FFE9D6]/90 text-[#A3285C] flex items-center justify-center shadow-sm">
            <Share2 className="w-4 h-4" />
          </div>
          <span className="text-[9px] font-jost font-semibold text-[#FFE9D6] drop-shadow">Share</span>
        </button>
      </div>

      {/* Bottom Creator Handle */}
      <div className="absolute bottom-3.5 left-3.5 right-14 z-20 pointer-events-auto">
        <a
          href={`https://www.tiktok.com/@${item.user.replace('@', '')}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1 font-jost font-bold text-sm text-[#FFE9D6] hover:underline drop-shadow"
        >
          <span>@{item.user}</span>
          <span className="w-3.5 h-3.5 rounded-full bg-[#FFE9D6] flex items-center justify-center text-[#E0457B] text-[8px] font-bold">
            <Check className="w-2 h-2 stroke-[3]" />
          </span>
        </a>
      </div>

      {/* Fine Progress Bar in --brand */}
      <div className="absolute bottom-0 inset-x-0 h-1 bg-white/20 z-30 pointer-events-none">
        <div 
          className="h-full bg-[#E0457B] transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
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

          // Velocity-based tilt
          const velocity = self.getVelocity();
          const tilt = Math.max(-5, Math.min(5, velocity / 380));
          gsap.to('.tiktok-card', {
            rotation: tilt,
            duration: 0.18,
            ease: 'power1.out',
            overwrite: 'auto',
          });
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
        
        {/* Top Header con título y contador */}
        <div className="w-full flex items-end justify-between border-b border-[rgba(255,233,214,0.18)] pb-4">
          <div>
            <div className="editorial-eyebrow mb-2 text-[#FFE9D6]">
              <ButterflyIcon size={14} color="#FFE9D6" />
              <span className="text-[#FFE9D6]">02  Viral</span>
            </div>
            <BicolorSectionTitle firstWord="TikTok" secondWord="Feed" variant="onBrand" />
          </div>

          <div className="font-jost text-xs uppercase tracking-[0.25em] text-[#FFE9D6] flex items-center gap-2">
            <span>{`0${activeIndex + 1} / 0${TIKTOK_VIDEOS.length}`}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFE9D6] animate-pulse" />
          </div>
        </div>

        {/* Central Track con tarjetas */}
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
                  "tiktok-card relative flex-shrink-0 w-[280px] xl:w-[310px] aspect-[9/16] rounded-[24px] border-[5px] border-white shadow-luxury overflow-hidden transition-all duration-500",
                  isCenter 
                    ? "scale-[1.06] opacity-100 z-20 ring-2 ring-[#FFE9D6]" 
                    : "scale-[0.92] opacity-70 z-10"
                )}
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

        {/* Bottom Track Controls & Progress */}
        <div className="w-full flex items-center justify-between border-t border-[rgba(255,233,214,0.18)] pt-4">
          <div className="w-1/3 h-[2px] bg-[#FFE9D6]/25 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#FFE9D6] transition-all duration-150"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="font-jost text-[11px] tracking-[0.25em] text-[#FFE9D6] uppercase">
            {`0${activeIndex + 1} / 0${TIKTOK_VIDEOS.length}`}
          </div>
        </div>
      </div>

      {/* MOBILE SNAP WRAPPER (< 1024px) */}
      <div className="lg:hidden w-full py-12 px-6">
        <div className="mb-6 border-b border-[rgba(255,233,214,0.18)] pb-4">
          <div className="editorial-eyebrow mb-2 text-[#FFE9D6]">
            <ButterflyIcon size={14} color="#FFE9D6" />
            <span className="text-[#FFE9D6]">02  Viral</span>
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
              className="flex-shrink-0 w-[78vw] max-w-[300px] aspect-[9/16] rounded-[22px] border-[4px] border-white shadow-luxury overflow-hidden snap-center"
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

      {/* PREMIUM FULLSCREEN VERTICAL VIEWER (Flip overlay over --brand at 95% with blur) */}
      {fullscreenIndex !== null && (
        <div 
          className="fixed inset-0 z-[10001] bg-[#E0457B]/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6 animate-in fade-in zoom-in-95 duration-300"
          onClick={closeFullscreen}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={closeFullscreen}
            className="absolute top-6 right-6 z-50 w-12 h-12 rounded-full bg-[#FFE9D6] text-[#A3285C] flex items-center justify-center shadow-luxury hover:scale-105 active:scale-95 transition-transform cursor-pointer"
            aria-label="Cerrar visor a pantalla completa"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation Arrows */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setFullscreenIndex((fullscreenIndex - 1 + TIKTOK_VIDEOS.length) % TIKTOK_VIDEOS.length);
            }}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-[#FFE9D6]/80 text-[#A3285C] hover:bg-[#FFE9D6] flex items-center justify-center shadow-luxury cursor-pointer transition-transform hover:scale-110 active:scale-90"
            aria-label="Video anterior"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setFullscreenIndex((fullscreenIndex + 1) % TIKTOK_VIDEOS.length);
            }}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-[#FFE9D6]/80 text-[#A3285C] hover:bg-[#FFE9D6] flex items-center justify-center shadow-luxury cursor-pointer transition-transform hover:scale-110 active:scale-90"
            aria-label="Siguiente video"
          >
            <ChevronRight className="w-7 h-7" />
          </button>

          {/* Centered Vertical 9:16 Video Stage */}
          <div 
            className="relative h-[85vh] max-h-[820px] aspect-[9/16] rounded-[28px] border-[6px] border-white shadow-luxury overflow-hidden bg-[#2B0F1E]"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              src={TIKTOK_VIDEOS[fullscreenIndex].src}
              poster={TIKTOK_VIDEOS[fullscreenIndex].poster}
              autoPlay
              controls
              loop
              playsInline
              className="w-full h-full object-cover"
            />

            {/* Header info bar */}
            <div className="absolute top-4 inset-x-4 flex items-center justify-between pointer-events-none z-20">
              <span className="font-jost text-xs uppercase tracking-[0.2em] font-semibold text-[#FFE9D6] bg-[#A3285C]/80 px-3 py-1 rounded-full backdrop-blur-md">
                @{TIKTOK_VIDEOS[fullscreenIndex].user}
              </span>
              <span className="font-jost text-xs uppercase tracking-[0.2em] font-medium text-[#FFE9D6] bg-[#2B0F1E]/80 px-3 py-1 rounded-full backdrop-blur-md">
                {`0${fullscreenIndex + 1} / 0${TIKTOK_VIDEOS.length}`}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
