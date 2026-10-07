'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Volume2, 
  VolumeX, 
  Heart, 
  MessageCircle, 
  Bookmark, 
  Share2, 
  Check
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { ButterflyIcon } from '@/components/ButterflyIcon';

gsap.registerPlugin(ScrollTrigger);

interface TikTokVideoItem {
  user: string;
  src: string;
  poster: string;
  likes: string;
  comments: string;
  bookmarks: string;
}

interface CustomTikTokPlayerProps {
  item: TikTokVideoItem;
  isActive: boolean;
}

const CustomTikTokPlayer: React.FC<CustomTikTokPlayerProps> = ({ item, isActive }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasBookmarked, setHasBookmarked] = useState(false);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    if (!isActive && isPlaying) {
      vid.pause();
      setIsPlaying(false);
    }
  }, [isActive, isPlaying]);

  const togglePlay = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const vid = videoRef.current;
    if (!vid) return;

    if (vid.paused) {
      vid.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      vid.pause();
      setIsPlaying(false);
    }
  }, []);

  const toggleMute = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = !vid.muted;
    setIsMuted(vid.muted);
  }, []);

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

  return (
    <div 
      className="relative w-full h-full bg-[#B03366] select-none overflow-hidden cursor-pointer group"
      onClick={togglePlay}
      data-cursor="Ver"
    >
      <video
        ref={videoRef}
        src={item.src}
        poster={item.poster}
        loop
        playsInline
        muted={isMuted}
        onTimeUpdate={handleTimeUpdate}
        className="w-full h-full object-cover"
      />

      {/* Indicador Play cuando está pausado */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#B03366]/30 pointer-events-none transition-opacity">
          <div className="w-14 h-14 rounded-full bg-[#FFFFFF] text-[#DE4176] flex items-center justify-center shadow-luxury">
            <Play className="w-6 h-6 fill-current translate-x-0.5" />
          </div>
        </div>
      )}

      {/* Top Left Signature Butterfly in white */}
      <div className="absolute top-3.5 left-3.5 z-20 pointer-events-none opacity-85">
        <ButterflyIcon size={16} color="#FFFFFF" strokeWidth={1.5} />
      </div>

      {/* Mute button */}
      <div className="absolute top-3.5 right-3.5 z-20 pointer-events-auto">
        <button
          type="button"
          onClick={toggleMute}
          className="w-9 h-9 rounded-full bg-[#FFFFFF]/90 text-[#B03366] hover:bg-[#FFFFFF] flex items-center justify-center shadow-sm transition-transform active:scale-90"
          title={isMuted ? 'Activar sonido' : 'Silenciar'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-[#DE4176]" /> : <Volume2 className="w-4 h-4 text-[#B03366]" />}
        </button>
      </div>

      {/* Right Social Actions Rail */}
      <div className="absolute right-3 bottom-14 z-20 flex flex-col items-center gap-3 pointer-events-auto">
        <button
          type="button"
          onClick={handleLike}
          className="flex flex-col items-center gap-0.5 cursor-pointer transition-transform active:scale-90"
        >
          <div className={cn(
            "w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-sm",
            hasLiked ? "bg-[#DE4176] text-white" : "bg-[#FFFFFF]/90 text-[#B03366]"
          )}>
            <Heart className={cn("w-4 h-4", hasLiked && "fill-current")} />
          </div>
          <span className="text-[9px] font-jost font-semibold text-white drop-shadow">{item.likes}</span>
        </button>

        <div className="flex flex-col items-center gap-0.5">
          <div className="w-9 h-9 rounded-full bg-[#FFFFFF]/90 text-[#B03366] flex items-center justify-center shadow-sm">
            <MessageCircle className="w-4 h-4" />
          </div>
          <span className="text-[9px] font-jost font-semibold text-white drop-shadow">{item.comments}</span>
        </div>

        <button
          type="button"
          onClick={handleBookmark}
          className="flex flex-col items-center gap-0.5 cursor-pointer transition-transform active:scale-90"
        >
          <div className={cn(
            "w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-sm",
            hasBookmarked ? "bg-[#DE4176] text-white" : "bg-[#FFFFFF]/90 text-[#B03366]"
          )}>
            <Bookmark className={cn("w-4 h-4", hasBookmarked && "fill-current")} />
          </div>
          <span className="text-[9px] font-jost font-semibold text-white drop-shadow">{item.bookmarks}</span>
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="flex flex-col items-center gap-0.5 cursor-pointer transition-transform active:scale-90"
        >
          <div className="w-9 h-9 rounded-full bg-[#FFFFFF]/90 text-[#B03366] flex items-center justify-center shadow-sm">
            <Share2 className="w-4 h-4" />
          </div>
          <span className="text-[9px] font-jost font-semibold text-white drop-shadow">Share</span>
        </button>
      </div>

      {/* Bottom Creator Handle */}
      <div className="absolute bottom-3.5 left-3.5 right-14 z-20 pointer-events-auto">
        <a
          href={`https://www.tiktok.com/@${item.user.replace('@', '')}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1 font-jost font-bold text-sm text-white hover:text-[#FFF6F9] transition-colors drop-shadow"
        >
          <span>@{item.user}</span>
          <span className="w-3.5 h-3.5 rounded-full bg-white flex items-center justify-center text-[#DE4176] text-[8px] font-bold">
            <Check className="w-2 h-2 stroke-[3]" />
          </span>
        </a>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 inset-x-0 h-1 bg-white/25 z-30 pointer-events-none">
        <div 
          className="h-full bg-white transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export const ViralSlider: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const tiktokVideos: TikTokVideoItem[] = [
    { 
      user: '_ariannadiazv', 
      src: '/videos/video1.mp4', 
      poster: '/images/cover1.jpg',
      likes: '1.2M',
      comments: '34.2K',
      bookmarks: '88.1K',
    },
    { 
      user: 'carmenbrads', 
      src: '/videos/video2.mp4', 
      poster: '/images/cover2.jpg',
      likes: '940K',
      comments: '18.9K',
      bookmarks: '45.3K',
    },
    { 
      user: 'ameliolivera', 
      src: '/videos/video3.mp4', 
      poster: '/images/cover3.jpg',
      likes: '1.8M',
      comments: '62.4K',
      bookmarks: '120K',
    },
    { 
      user: 'iriss.vallaranii', 
      src: '/videos/video4.mp4', 
      poster: '/images/cover4.jpg',
      likes: '780K',
      comments: '39.8K',
      bookmarks: '39.8K',
    },
    { 
      user: 'elisa.bernardonii__', 
      src: '/videos/video5.mp4', 
      poster: '/images/cover5.jpg',
      likes: '2.4M',
      comments: '91.8K',
      bookmarks: '184K',
    },
  ];

  // GSAP Horizontal Scroll Pinning on Desktop
  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 1024px)').matches;
    if (isMobile) return;

    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const scrollDistance = track.scrollWidth - track.clientWidth;

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: -scrollDistance,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: () => `+=${scrollDistance}`,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const index = Math.min(
              tiktokVideos.length - 1,
              Math.floor(self.progress * tiktokVideos.length)
            );
            setActiveIndex(index);
          },
        },
      });
    }, section);

    return () => ctx.revert();
  }, [tiktokVideos.length]);

  return (
    <section 
      ref={sectionRef}
      id="tiktok" 
      className="w-full relative bg-[#FBE3EC] text-[#B03366] py-16 sm:py-24 md:py-28 px-[6vw] overflow-hidden select-none border-b border-[rgba(224,69,123,0.14)]"
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start gap-8 lg:gap-14">
        
        {/* Header Fijo a la Izquierda */}
        <div className="w-full lg:w-[320px] shrink-0 flex flex-col justify-between py-2">
          <div>
            <div className="editorial-eyebrow mb-4">
              <ButterflyIcon size={14} color="#DE4176" />
              <span>02  Viral</span>
            </div>

            <h2 className="editorial-title text-[#B03366] mb-5">
              TikTok <span className="italic text-[#DE4176]">Feed</span>
            </h2>

            <p className="editorial-text text-[#B03366] mb-6">
              Los momentos más virales de nuestras transmisiones y colaboraciones exclusivas.
            </p>
          </div>

          <div className="hidden lg:flex flex-col gap-2 font-jost text-xs tracking-wider uppercase text-[#B03366]/70">
            <span>Desplaza para explorar</span>
            <div className="w-12 h-[1px] bg-[#DE4176]" />
          </div>
        </div>

        {/* Track de Tarjetas (Horizontal Pinned / Scroll-snap en móvil) */}
        <div 
          ref={trackRef}
          className="flex-1 w-full flex items-center gap-6 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 snap-x snap-mandatory"
        >
          {tiktokVideos.map((video, idx) => {
            const isActive = activeIndex === idx;

            return (
              <div
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={cn(
                  "shrink-0 w-[270px] sm:w-[300px] h-[480px] sm:h-[530px] rounded-[20px] border-[4px] border-white overflow-hidden shadow-luxury snap-center transition-transform duration-500",
                  isActive ? "scale-[1.05]" : "scale-100 opacity-90 hover:opacity-100"
                )}
              >
                <CustomTikTokPlayer item={video} isActive={isActive} />
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
