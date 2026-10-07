'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { 
  Play, 
  Maximize2,
  ChevronLeft,
  ChevronRight,
  X,
  ExternalLink
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { ButterflyIcon } from '@/components/ButterflyIcon';
import { BicolorSectionTitle } from '@/components/BicolorSectionTitle';
import { useMediaStore } from '@/lib/mediaStore';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface TikTokVideoItem {
  id: string;
  user: string;
  authorName: string;
  profileUrl: string;
  videoUrl: string;
  videoId: string;
  embedUrl: string;
  poster: string;
  title: string;
}

const TIKTOK_VIDEOS: TikTokVideoItem[] = [
  {
    id: 'tt-1',
    user: 'jacklyn_roper5',
    authorName: 'thisisnotjropes',
    profileUrl: 'https://www.tiktok.com/@jacklyn_roper5',
    videoUrl: 'https://www.tiktok.com/@jacklyn_roper5/video/7689201868798446862',
    videoId: '7689201868798446862',
    embedUrl: '/videos/tiktok/tt-1.mp4',
    poster: '/images/tiktok/cover-jacklyn_roper5.jpg',
    title: 'TikTok de @jacklyn_roper5',
  },
  {
    id: 'tt-2',
    user: 'pampeee_spam',
    authorName: 'pampee.spamm',
    profileUrl: 'https://www.tiktok.com/@pampeee_spam',
    videoUrl: 'https://www.tiktok.com/@pampeee_spam/video/7686615139176533270',
    videoId: '7686615139176533270',
    embedUrl: '/videos/tiktok/tt-2.mp4',
    poster: '/images/tiktok/cover-pampeee_spam.jpg',
    title: 'da repostare..',
  },
  {
    id: 'tt-3',
    user: 'kaitlynkrems',
    authorName: 'Kaitlyn Krems',
    profileUrl: 'https://www.tiktok.com/@kaitlynkrems',
    videoUrl: 'https://www.tiktok.com/@kaitlynkrems/video/7693923368629751053',
    videoId: '7693923368629751053',
    embedUrl: '/videos/tiktok/tt-3.mp4',
    poster: '/images/tiktok/cover-kaitlynkrems.jpg',
    title: 'New settt',
  },
  {
    id: 'tt-4',
    user: 'iamjumo',
    authorName: 'Jumo',
    profileUrl: 'https://www.tiktok.com/@iamjumo',
    videoUrl: 'https://www.tiktok.com/@iamjumo/video/7673605900023762207',
    videoId: '7673605900023762207',
    embedUrl: '/videos/tiktok/tt-4.mp4',
    poster: '/images/tiktok/cover-iamjumo.jpg',
    title: 'Gorgeous Pizza by @iamjumo',
  },
  {
    id: 'tt-5',
    user: 'lauraalguaciiil',
    authorName: 'lauraalguaciiil',
    profileUrl: 'https://www.tiktok.com/@lauraalguaciiil',
    videoUrl: 'https://www.tiktok.com/@lauraalguaciiil/video/7594202399435214102',
    videoId: '7594202399435214102',
    embedUrl: '/videos/tiktok/tt-5.mp4',
    poster: '/images/tiktok/cover-lauraalguaciiil.jpg',
    title: 'Ig: lauraalguaciil',
  },
  {
    id: 'tt-6',
    user: 'rainbowglittergelpen6769',
    authorName: 'Maya',
    profileUrl: 'https://www.tiktok.com/@rainbowglittergelpen6769',
    videoUrl: 'https://www.tiktok.com/@rainbowglittergelpen6769/video/7691804958206774550',
    videoId: '7691804958206774550',
    embedUrl: '/videos/tiktok/tt-6.mp4',
    poster: '/images/tiktok/cover-rainbowglittergelpen6769.jpg',
    title: 'Trending spam by @rainbowglittergelpen6769',
  },
  {
    id: 'tt-7',
    user: 'iriss.vallaranii',
    authorName: 'iris🌺',
    profileUrl: 'https://www.tiktok.com/@iriss.vallaranii',
    videoUrl: 'https://www.tiktok.com/@iriss.vallaranii/video/7404517500723023137',
    videoId: '7404517500723023137',
    embedUrl: '/videos/tiktok/tt-7.mp4',
    poster: '/images/tiktok/cover-iriss.vallaranii.jpg',
    title: 'TikTok de @iriss.vallaranii',
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
  const [isPlayingInline, setIsPlayingInline] = useState(false);
  const { activeMediaId, setActiveMedia } = useMediaStore();
  const mediaKey = `tiktok-${index}`;

  // Reset if another media starts playing
  useEffect(() => {
    if (activeMediaId && activeMediaId !== mediaKey && isPlayingInline) {
      setIsPlayingInline(false);
    }
  }, [activeMediaId, mediaKey, isPlayingInline]);

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenFullscreen(index);
  };

  const handlePlayInline = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMedia(mediaKey);
    setIsPlayingInline(true);
  };

  const handleFullscreenClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenFullscreen(index);
  };

  return (
    <div 
      className="relative w-full h-full bg-[#3A1528] select-none overflow-hidden cursor-pointer group"
      onClick={handleCardClick}
      data-cursor="Ver"
    >
      {/* Either display interactive embed when playing or high-res poster */}
      {isPlayingInline ? (
        <video
          src={item.embedUrl}
          autoPlay
          controls
          controlsList="nodownload"
          className="w-full h-full object-cover border-0 pointer-events-auto"
          playsInline
        />
      ) : (
        <div className="relative w-full h-full">
          <img
            src={item.poster}
            alt={`TikTok de @${item.user}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Gentle dark gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/25 pointer-events-none" />

          {/* Center Play Button in Glass Champagne */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity">
            <button
              type="button"
              onClick={handlePlayInline}
              className="w-16 h-16 rounded-full bg-[#FFE9D6]/90 hover:bg-white text-[#A3285C] flex items-center justify-center shadow-luxury hover:scale-110 active:scale-95 transition-all pointer-events-auto cursor-pointer"
              aria-label="Reproducir video de TikTok"
            >
              <Play className="w-7 h-7 fill-current translate-x-0.5" />
            </button>
          </div>
        </div>
      )}

      {/* Top Left Signature Butterfly in champagne */}
      <div className="absolute top-3.5 left-3.5 z-20 pointer-events-none opacity-85">
        <ButterflyIcon size={16} color="#FFE9D6" strokeWidth={1.5} />
      </div>

      {/* Top Right: Fullscreen Expand Button */}
      <div className="absolute top-3.5 right-3.5 z-20 pointer-events-auto">
        <button
          type="button"
          onClick={handleFullscreenClick}
          className="w-9 h-9 rounded-full bg-[#FFE9D6]/90 text-[#A3285C] hover:bg-white flex items-center justify-center shadow-sm transition-transform active:scale-90 cursor-pointer"
          title="Ver a pantalla completa"
          aria-label="Ver a pantalla completa"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom: Creator Profile Badge Link (Clickeable a su perfil de TikTok) */}
      <div className="absolute bottom-3.5 left-3.5 right-3.5 z-30 pointer-events-auto flex items-center justify-between gap-2">
        <a
          href={item.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="group/user inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2B0F1E]/80 hover:bg-[#E0457B] text-[#FFE9D6] hover:text-white backdrop-blur-md transition-all font-satoshi text-xs font-semibold shadow-md border border-[#FFE9D6]/20 cursor-pointer truncate max-w-[85%]"
          title={`Abrir perfil de TikTok de @${item.user}`}
        >
          <span className="truncate">@{item.user}</span>
          <ExternalLink className="w-3 h-3 opacity-75 group-hover/user:opacity-100 group-hover/user:translate-x-0.5 transition-transform shrink-0" />
        </a>
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

      {/* Fullscreen Modal Viewer con reproductor oficial de TikTok */}
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
            className="relative w-[95vw] md:w-auto h-[80vh] md:h-[90vh] aspect-[9/16] rounded-[24px] overflow-hidden border-[4px] border-[#FFE9D6] shadow-2xl flex flex-col bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              src={TIKTOK_VIDEOS[fullscreenIndex].embedUrl}
              autoPlay
              controls
              controlsList="nodownload"
              className="w-full h-full object-contain md:object-cover border-0"
              playsInline
            />

            {/* Profile Bar in Fullscreen */}
            <div className="absolute bottom-3 left-3 right-3 z-30 pointer-events-auto flex items-center justify-between bg-black/60 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/20">
              <a
                href={TIKTOK_VIDEOS[fullscreenIndex].profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-satoshi font-semibold text-[#FFE9D6] hover:text-white hover:underline transition-colors"
              >
                <span>@{TIKTOK_VIDEOS[fullscreenIndex].user}</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <a
                href={TIKTOK_VIDEOS[fullscreenIndex].videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-satoshi text-[#FFE9D6]/80 hover:text-white uppercase tracking-wider underline-offset-2 hover:underline"
              >
                Ver en TikTok
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
