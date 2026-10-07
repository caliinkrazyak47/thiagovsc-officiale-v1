'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import Autoplay from 'embla-carousel-autoplay';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Heart, 
  MessageCircle, 
  Bookmark, 
  Share2, 
  Check
} from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';

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
      className="relative w-full h-full bg-[#3B0D22] select-none overflow-hidden cursor-pointer group"
      onClick={togglePlay}
      data-cursor="VER"
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

      {/* Play/Pause Overlay indicator */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#3B0D22]/40 pointer-events-none transition-opacity">
          <div className="w-16 h-16 rounded-full bg-white text-[#DE4176] flex items-center justify-center shadow-editorial">
            <Play className="w-7 h-7 fill-current translate-x-0.5" />
          </div>
        </div>
      )}

      {/* Top Controls: Sound toggle */}
      <div className="absolute top-4 right-4 z-20 pointer-events-auto">
        <button
          type="button"
          onClick={toggleMute}
          className="w-10 h-10 rounded-full bg-white/90 text-[#3B0D22] hover:bg-white flex items-center justify-center shadow-sm transition-transform active:scale-90"
          title={isMuted ? 'Activar sonido' : 'Silenciar'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-[#DE4176]" /> : <Volume2 className="w-4 h-4 text-[#3B0D22]" />}
        </button>
      </div>

      {/* Right Social Actions Rail */}
      <div className="absolute right-3.5 bottom-16 z-20 flex flex-col items-center gap-3.5 pointer-events-auto">
        {/* Like */}
        <button
          type="button"
          onClick={handleLike}
          className="flex flex-col items-center gap-1 cursor-pointer transition-transform active:scale-90"
        >
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm",
            hasLiked ? "bg-[#DE4176] text-white" : "bg-white/90 text-[#3B0D22]"
          )}>
            <Heart className={cn("w-5 h-5", hasLiked && "fill-current")} />
          </div>
          <span className="text-[10px] font-mono font-bold text-white drop-shadow">{item.likes}</span>
        </button>

        {/* Comments */}
        <div className="flex flex-col items-center gap-1">
          <div className="w-10 h-10 rounded-full bg-white/90 text-[#3B0D22] flex items-center justify-center shadow-sm">
            <MessageCircle className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-mono font-bold text-white drop-shadow">{item.comments}</span>
        </div>

        {/* Bookmark */}
        <button
          type="button"
          onClick={handleBookmark}
          className="flex flex-col items-center gap-1 cursor-pointer transition-transform active:scale-90"
        >
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm",
            hasBookmarked ? "bg-[#DE4176] text-white" : "bg-white/90 text-[#3B0D22]"
          )}>
            <Bookmark className={cn("w-5 h-5", hasBookmarked && "fill-current")} />
          </div>
          <span className="text-[10px] font-mono font-bold text-white drop-shadow">{item.bookmarks}</span>
        </button>

        {/* Share */}
        <button
          type="button"
          onClick={handleShare}
          className="flex flex-col items-center gap-1 cursor-pointer transition-transform active:scale-90"
        >
          <div className="w-10 h-10 rounded-full bg-white/90 text-[#3B0D22] flex items-center justify-center shadow-sm">
            <Share2 className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-mono font-bold text-white drop-shadow">Share</span>
        </button>
      </div>

      {/* Bottom Creator Handle */}
      <div className="absolute bottom-4 left-4 right-16 z-20 pointer-events-auto">
        <a
          href={`https://www.tiktok.com/@${item.user.replace('@', '')}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1.5 font-display text-base text-white hover:text-[#FFF4F7] transition-colors drop-shadow"
        >
          <span>@{item.user}</span>
          <span className="w-4 h-4 rounded-full bg-white flex items-center justify-center text-[#DE4176] text-[9px] font-bold">
            <Check className="w-2.5 h-2.5 stroke-[3]" />
          </span>
        </a>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 inset-x-0 h-1 bg-white/20 z-30 pointer-events-none">
        <div 
          className="h-full bg-white transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export const ViralSlider: React.FC = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

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

  useEffect(() => {
    if (!api) return;

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <section 
      id="tiktok" 
      className="w-full relative bg-[#DE4176] text-white py-20 sm:py-28 md:py-36 overflow-hidden select-none"
    >
      {/* Editorial Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 md:px-12 flex flex-col md:flex-row items-start md:items-end justify-between mb-12 sm:mb-16 z-10 relative">
        <div>
          {/* Pill 02 / CONTENIDO VIRAL 24/7 */}
          <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-white border border-white bg-transparent px-3.5 py-1.5 rounded-full inline-flex items-center mb-5">
            02 / CONTENIDO VIRAL 24/7
          </span>
          
          {/* H2 Title: TikTok in white, Feed in serif-italic blush */}
          <h2 className="editorial-h2 flex flex-col tracking-[-0.04em]">
            <span className="font-display text-white uppercase">TikTok</span>
            <span className="font-serif-italic text-[#FFF4F7] font-normal leading-none -mt-2">Feed</span>
          </h2>
        </div>

        {/* Counter Info */}
        <div className="flex flex-col md:items-end gap-1 mt-6 md:mt-0 font-mono">
          <span className="text-xs font-bold tracking-widest text-[#FFF4F7] uppercase">
            VIDEO 0{current + 1} / 0{tiktokVideos.length}
          </span>
          <span className="text-[11px] text-white/75 font-sans tracking-wide">
            HAZ CLIC EN CUALQUIER VIDEO PARA REPRODUCIR
          </span>
        </div>
      </div>

      {/* Carousel Track with Left & Right Circular White Arrows */}
      <div className="w-full relative px-2 sm:px-6 md:px-12 z-20">
        
        {/* Left Arrow Button in White Circle with Pink Icon */}
        <button
          type="button"
          onClick={() => api?.scrollPrev()}
          aria-label="Video anterior"
          className="absolute left-2 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 z-40 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white text-[#DE4176] flex items-center justify-center shadow-editorial hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer haptic-press"
        >
          <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" />
        </button>

        {/* Right Arrow Button in White Circle with Pink Icon */}
        <button
          type="button"
          onClick={() => api?.scrollNext()}
          aria-label="Video siguiente"
          className="absolute right-2 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 z-40 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white text-[#DE4176] flex items-center justify-center shadow-editorial hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer haptic-press"
        >
          <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" />
        </button>

        {/* Embla Carousel Container */}
        <div className="w-full overflow-hidden px-4 sm:px-14">
          <Carousel
            setApi={setApi}
            className="w-full"
            opts={{
              loop: true,
              align: 'center',
              slidesToScroll: 1,
            }}
            plugins={[
              Autoplay({
                delay: 4500,
                stopOnInteraction: true,
                stopOnMouseEnter: true,
              }),
            ]}
          >
            <CarouselContent className="flex h-[560px] sm:h-[600px] md:h-[640px] w-full items-center -ml-4 sm:-ml-6">
              {tiktokVideos.map((video, index) => {
                const isActive = current === index;
                return (
                  <CarouselItem
                    key={index}
                    className="relative flex flex-col items-center justify-center shrink-0 pl-4 sm:pl-6 basis-auto"
                  >
                    {/* Tarjetas de videos con radius 28px y borde 6px --white */}
                    <div
                      className={cn(
                        'relative w-[85vw] sm:w-[320px] md:w-[340px] lg:w-[350px] h-[520px] sm:h-[560px] md:h-[600px] rounded-[28px] border-[6px] border-white overflow-hidden shadow-editorial transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] select-none',
                        isActive
                          ? 'scale-[1.08] opacity-100 z-20'
                          : 'scale-95 opacity-60 z-10'
                      )}
                    >
                      <CustomTikTokPlayer item={video} isActive={isActive} />
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>
        </div>
      </div>

      {/* Paginación en barras finas blancas */}
      <div className="flex justify-center items-center gap-2 mt-12 z-20 relative">
        {tiktokVideos.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => api?.scrollTo(idx)}
            aria-label={`Ir al video ${idx + 1}`}
            className={cn(
              'h-1 rounded-full transition-all duration-300 cursor-pointer',
              current === idx ? 'w-10 bg-white' : 'w-4 bg-white/40 hover:bg-white/80'
            )}
          />
        ))}
      </div>
    </section>
  );
};
