'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import Autoplay from 'embla-carousel-autoplay';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
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
  const [showHeartAnim, setShowHeartAnim] = useState(false);

  // Sync play/pause with carousel active state
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    if (!isActive && isPlaying) {
      vid.pause();
      setIsPlaying(false);
    }
  }, [isActive, isPlaying]);

  // Video event listeners for playback state, progress & seamless looping
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    vid.loop = true;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
      vid.currentTime = 0;
      vid.play().catch(() => {});
    };
    const onTimeUpdate = () => {
      if (vid.duration) {
        setProgress((vid.currentTime / vid.duration) * 100);
        // Loop rewind failsafe near end
        if (vid.currentTime >= vid.duration - 0.1) {
          vid.currentTime = 0;
          vid.play().catch(() => {});
        }
      }
    };

    vid.addEventListener('play', onPlay);
    vid.addEventListener('pause', onPause);
    vid.addEventListener('ended', onEnded);
    vid.addEventListener('timeupdate', onTimeUpdate);

    return () => {
      vid.removeEventListener('play', onPlay);
      vid.removeEventListener('pause', onPause);
      vid.removeEventListener('ended', onEnded);
      vid.removeEventListener('timeupdate', onTimeUpdate);
    };
  }, []);

  const togglePlay = () => {
    const vid = videoRef.current;
    if (!vid) return;

    if (vid.paused) {
      // Pause all other videos on the page
      document.querySelectorAll('video').forEach((v) => {
        if (v !== vid) {
          v.pause();
        }
      });
      vid.play().catch(() => {});
    } else {
      vid.pause();
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const vid = videoRef.current;
    if (!vid) return;

    vid.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const openFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    const vid = videoRef.current;
    if (vid) {
      if (vid.requestFullscreen) {
        vid.requestFullscreen();
      } else if ((vid as any).webkitRequestFullscreen) {
        (vid as any).webkitRequestFullscreen();
      }
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHasLiked(!hasLiked);
    if (!hasLiked) {
      setShowHeartAnim(true);
      setTimeout(() => setShowHeartAnim(false), 900);
    }
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHasBookmarked(!hasBookmarked);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: `TikTok de @${item.user}`,
        url: `https://www.tiktok.com/@${item.user.replace('@', '')}`,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(`https://www.tiktok.com/@${item.user.replace('@', '')}`);
    }
  };

  return (
    <div 
      className="relative w-full h-full bg-black group select-none overflow-hidden cursor-pointer" 
      onClick={togglePlay}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={item.src}
        poster={item.poster}
        preload="metadata"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
        loop
        playsInline
        muted={isMuted}
        onEnded={(e) => {
          const v = e.currentTarget;
          v.currentTime = 0;
          v.play().catch(() => {});
        }}
      />

      {/* Subtle bottom shadow only for username legibility - zero top or center overlays so video stays 100% natural, crisp and bright */}
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

      {/* Top Action Bar (Live Pill + Sound + Fullscreen) */}
      <div className="absolute top-4 inset-x-4 flex items-center justify-between z-20 pointer-events-auto">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-[10px] font-mono font-bold tracking-wider text-white shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#DE4176] animate-pulse" />
          <span>VIRAL</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Mute / Unmute Button */}
          <button
            type="button"
            onClick={toggleMute}
            aria-label={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
            className="w-8 h-8 rounded-full bg-black/60 hover:bg-[#DE4176] text-white backdrop-blur-md border border-white/20 hover:border-white/40 flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md hover:scale-105"
            title={isMuted ? 'Activar Sonido' : 'Silenciar'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={openFullscreen}
            aria-label="Pantalla completa"
            className="w-8 h-8 rounded-full bg-black/60 hover:bg-[#DE4176] text-white backdrop-blur-md border border-white/20 hover:border-white/40 flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md hover:scale-105"
            title="Pantalla Completa"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Play / Pause Animated Center Feedback */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-black/55 backdrop-blur-md border border-white/30 text-white flex items-center justify-center shadow-[0_0_30px_rgba(222,65,118,0.5)] transform scale-100 group-hover:scale-110 transition-transform">
            <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-white translate-x-0.5 text-white" />
          </div>
        </div>
      )}

      {/* Double-tap / Heart Pop Animation */}
      <AnimatePresence>
        {showHeartAnim && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.4, 1.1], opacity: [0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
          >
            <Heart className="w-24 h-24 text-[#DE4176] fill-[#DE4176] drop-shadow-[0_0_25px_rgba(222,65,118,0.8)]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Right Social Action Rail */}
      <div className="absolute right-3.5 bottom-20 flex flex-col gap-3.5 items-center z-20 pointer-events-auto">
        {/* Like Button */}
        <button
          type="button"
          onClick={handleLike}
          className="flex flex-col items-center gap-1 group/btn cursor-pointer transition-transform active:scale-90"
          title="Me gusta"
        >
          <div className={cn(
            "w-10 h-10 rounded-full backdrop-blur-md border flex items-center justify-center transition-all duration-200 shadow-md",
            hasLiked 
              ? "bg-[#DE4176] border-[#DE4176] text-white shadow-[0_0_15px_rgba(222,65,118,0.6)]" 
              : "bg-black/60 border-white/20 text-white hover:border-[#DE4176] hover:bg-[#DE4176]/30"
          )}>
            <Heart className={cn("w-5 h-5 transition-transform", hasLiked ? "fill-white text-white scale-110" : "text-white")} />
          </div>
          <span className="text-[10px] font-mono font-bold text-white drop-shadow">
            {hasLiked ? '1.4M+' : item.likes}
          </span>
        </button>

        {/* Comment Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            window.open(`https://www.tiktok.com/@${item.user.replace('@', '')}`, '_blank');
          }}
          className="flex flex-col items-center gap-1 group/btn cursor-pointer transition-transform active:scale-90"
          title="Comentarios"
        >
          <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 hover:border-[#DE4176] hover:bg-[#DE4176]/30 flex items-center justify-center text-white transition-all shadow-md">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <span className="text-[10px] font-mono font-bold text-white drop-shadow">{item.comments}</span>
        </button>

        {/* Bookmark Button */}
        <button
          type="button"
          onClick={handleBookmark}
          className="flex flex-col items-center gap-1 group/btn cursor-pointer transition-transform active:scale-90"
          title="Guardar"
        >
          <div className={cn(
            "w-10 h-10 rounded-full backdrop-blur-md border flex items-center justify-center transition-all duration-200 shadow-md",
            hasBookmarked 
              ? "bg-[#F59E0B] border-[#F59E0B] text-white shadow-[0_0_15px_rgba(245,158,11,0.6)]" 
              : "bg-black/60 border-white/20 text-white hover:border-[#F59E0B] hover:bg-[#F59E0B]/30"
          )}>
            <Bookmark className={cn("w-5 h-5", hasBookmarked ? "fill-white text-white" : "text-white")} />
          </div>
          <span className="text-[10px] font-mono font-bold text-white drop-shadow">{item.bookmarks}</span>
        </button>

        {/* Share Button */}
        <button
          type="button"
          onClick={handleShare}
          className="flex flex-col items-center gap-1 group/btn cursor-pointer transition-transform active:scale-90"
          title="Compartir"
        >
          <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 hover:border-[#DE4176] hover:bg-[#DE4176]/30 flex items-center justify-center text-white transition-all shadow-md">
            <Share2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-[10px] font-mono font-bold text-white drop-shadow">Share</span>
        </button>

        {/* Spinning Vinyl Record Disc */}
        <div 
          className="w-10 h-10 rounded-full bg-gradient-to-tr from-zinc-950 via-zinc-800 to-zinc-950 p-1 border border-white/25 shadow-lg mt-1 animate-spin"
          style={{ animationDuration: '4.5s' }}
        >
          <img 
            src={item.poster} 
            alt={item.user} 
            className="w-full h-full rounded-full object-cover" 
          />
        </div>
      </div>

      {/* Bottom Info Deck: Creator Handle with Verified Badge */}
      <div className="absolute bottom-4 left-4 right-18 z-20 pointer-events-auto">
        <a
          href={`https://www.tiktok.com/@${item.user.replace('@', '')}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1.5 font-black text-lg sm:text-xl text-white hover:text-[#DE4176] transition-colors drop-shadow cursor-pointer"
          style={{ fontFamily: 'Arial Black, Impact, sans-serif' }}
        >
          <span>@{item.user}</span>
          <span className="w-4 h-4 rounded-full bg-[#00ADEF] flex items-center justify-center text-black text-[9px] font-bold">
            <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
          </span>
        </a>
      </div>

      {/* Bottom Progress Bar */}
      <div className="absolute bottom-0 inset-x-0 h-1 bg-white/15 z-30 pointer-events-none">
        <div 
          className="h-full bg-[#DE4176] transition-all duration-100 shadow-[0_0_8px_#DE4176]"
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
      comments: '14.1K',
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
      className="w-full relative bg-white pt-14 md:pt-20 pb-16 md:pb-24 overflow-hidden select-none"
    >
      {/* Bottom half background in #DE4176 to seamlessly transition into Zona Influencer */}
      <div className="absolute bottom-0 left-0 right-0 h-[48%] md:h-[46%] bg-[#DE4176] pointer-events-none" />

      {/* Section Header */}
      <div className="px-6 md:px-14 flex flex-col md:flex-row items-start md:items-end justify-between mb-8 md:mb-12 z-10 relative">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DE4176]/10 border border-[#DE4176]/30 shadow-sm mb-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#DE4176] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#DE4176]"></span>
            </span>
            <span className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.22em] text-[#DE4176] uppercase">
              03 // TIKTOK FEED • CONTENIDO VIRAL 24/7
            </span>
          </div>
          <h2 className="text-6xl md:text-7xl lg:text-[7vw] font-syne font-black tracking-[-0.04em] leading-[0.85] text-[#DE4176] uppercase">
            TIKTOK<br />
            <span className="text-transparent" style={{ WebkitTextStroke: '2px #DE4176' }}>
              FEED
            </span>
          </h2>
        </div>

        {/* Right Info: Live Counter & Interactive Hint */}
        <div className="flex flex-col md:items-end gap-1 mt-4 md:mt-0">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white shadow-md border border-[#DE4176]/25 text-[#DE4176] text-xs font-jakarta font-bold tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-[#DE4176] animate-pulse" />
            <span>VIDEO 0{current + 1} DE 0{tiktokVideos.length}</span>
          </div>
          <span className="text-[10px] font-jakarta font-semibold text-zinc-500 tracking-wider uppercase mt-1">
            HAZ CLIC EN CUALQUIER VIDEO PARA REPRODUCIR / PAUSAR
          </span>
        </div>
      </div>


      {/* Carousel Track with Left & Right Visible Circle Arrows */}
      <div className="w-full relative px-2 sm:px-6 md:px-12 z-20">
        
        {/* Left Screen Flank Arrow Button */}
        <button
          type="button"
          onClick={() => api?.scrollPrev()}
          aria-label="Video anterior"
          className="absolute left-2 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 z-40 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#DE4176] hover:bg-[#c42e61] border-2 border-white text-white flex items-center justify-center shadow-[0_10px_35px_rgba(0,0,0,0.4)] hover:scale-110 active:scale-95 transition-all cursor-pointer group"
        >
          <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7 text-white group-hover:-translate-x-0.5 transition-transform" />
        </button>

        {/* Right Screen Flank Arrow Button */}
        <button
          type="button"
          onClick={() => api?.scrollNext()}
          aria-label="Video siguiente"
          className="absolute right-2 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 z-40 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#DE4176] hover:bg-[#c42e61] border-2 border-white text-white flex items-center justify-center shadow-[0_10px_35px_rgba(0,0,0,0.4)] hover:scale-110 active:scale-95 transition-all cursor-pointer group"
        >
          <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7 text-white group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Embla Carousel Container */}
        <div className="w-full overflow-hidden px-6 sm:px-14">
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
            <CarouselContent className="flex h-[560px] sm:h-[600px] md:h-[640px] w-full items-center -ml-3 sm:-ml-5">
              {tiktokVideos.map((video, index) => {
                const isActive = current === index;
                return (
                  <CarouselItem
                    key={index}
                    className="relative flex flex-col items-center justify-center shrink-0 pl-3 sm:pl-5 basis-auto"
                  >
                    {/* Smartphone Mockup Card Container */}
                    <div
                      className={cn(
                        'relative w-[85vw] sm:w-[320px] md:w-[345px] lg:w-[355px] h-[530px] sm:h-[570px] md:h-[610px] bg-black rounded-[2rem] sm:rounded-[2.25rem] overflow-hidden transition-all duration-300 ease-out shadow-[0_25px_60px_rgba(0,0,0,0.45)] border-2 opacity-100',
                        isActive
                          ? 'border-white scale-[1.01] shadow-[0_30px_70px_rgba(0,0,0,0.6)]'
                          : 'border-white/30 hover:border-white/60 scale-95'
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

      {/* Slider Pagination Dots (White on the pink bottom half) */}
      <div className="flex justify-center items-center gap-2 mt-10 z-20 relative">
        {tiktokVideos.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => api?.scrollTo(idx)}
            aria-label={`Ir al video ${idx + 1}`}
            className={cn(
              'h-2 rounded-full transition-all duration-300 cursor-pointer',
              current === idx ? 'w-8 bg-white shadow-md' : 'w-2 bg-white/40 hover:bg-white/80'
            )}
          />
        ))}
      </div>
    </section>
  );
};
