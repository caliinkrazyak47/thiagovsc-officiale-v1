'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { 
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
import { BicolorSectionTitle } from '@/components/BicolorSectionTitle';

gsap.registerPlugin(ScrollTrigger, useGSAP);

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

  // Lazy loading: solo se reproduce el vídeo que está activo/en el centro
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    if (isActive) {
      vid.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      vid.pause();
      setIsPlaying(false);
    }
  }, [isActive]);

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
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);

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

  // GSAP Horizontal Scroll Pinning on Desktop (usando useGSAP con scope y anticipación)
  useGSAP(() => {
    if (window.matchMedia('(max-width: 1024px)').matches) return;

    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    // Distancia exacta con paddingLateral para centrar la última tarjeta
    const paddingLateral = window.innerWidth * 0.5 - 150;
    const getDistance = () => track.scrollWidth - window.innerWidth + paddingLateral;

    const tween = gsap.to(track, {
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

          const total = tiktokVideos.length;
          const idx = Math.min(
            total - 1,
            Math.max(0, Math.round(self.progress * (total - 1)))
          );
          setActiveIndex(idx);

          // Leve inclinación según la velocidad del scroll
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

    // Refrescar ScrollTrigger cuando terminen de cargar las fuentes y media
    document.fonts.ready.then(() => {
      ScrollTrigger.refresh();
    });

    const handleLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', handleLoad);
    return () => window.removeEventListener('load', handleLoad);
  }, { scope: sectionRef, dependencies: [tiktokVideos.length] });

  return (
    <section 
      ref={sectionRef}
      id="tiktok" 
      className="tiktok w-full relative bg-[#FBE3EC] text-[#B03366] select-none border-b border-[rgba(224,69,123,0.14)]"
    >
      {/* DESKTOP PINNED WRAPPER (>= 1024px) */}
      <div className="pin-wrap hidden lg:flex w-full h-screen flex-col justify-between py-10 px-[6vw] overflow-hidden">
        
        {/* Top Header con título y contador dinámico */}
        <div className="w-full flex items-end justify-between border-b border-[rgba(224,69,123,0.14)] pb-4">
          <div>
            <div className="editorial-eyebrow mb-2">
              <ButterflyIcon size={14} color="#DE4176" />
              <span>02  Viral</span>
            </div>
            <BicolorSectionTitle firstWord="TikTok" secondWord="Feed" />
          </div>

          {/* Contador 0X / 05 en Jost */}
          <div className="flex items-center gap-3">
            <span className="font-jost text-sm font-medium tracking-[0.25em] text-[#B03366] uppercase">
              {`0${activeIndex + 1} / 0${tiktokVideos.length}`}
            </span>
            <div className="w-2 h-2 rounded-full bg-[#DE4176] animate-pulse" />
          </div>
        </div>

        {/* Track Horizontal de Tarjetas */}
        <div className="w-full my-auto overflow-visible py-4">
          <div 
            ref={trackRef}
            style={{ paddingRight: 'calc(50vw - 150px)' }}
            className="track flex items-center gap-[24px]"
          >
            {tiktokVideos.map((video, idx) => {
              const isCenter = activeIndex === idx;

              return (
                <div
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  style={{
                    transform: isCenter ? 'scale(1.06)' : 'scale(0.92)',
                    opacity: isCenter ? 1 : 0.7,
                  }}
                  className={cn(
                    "tiktok-card shrink-0 w-[290px] h-[510px] rounded-[20px] border-[4px] border-white overflow-hidden shadow-luxury transition-all duration-500 ease-out",
                    isCenter ? "z-20 shadow-luxury" : "z-10"
                  )}
                >
                  <CustomTikTokPlayer item={video} isActive={isCenter} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Progress Bar en --rosa */}
        <div className="w-full max-w-xl mx-auto flex items-center gap-4">
          <div className="flex-1 h-1 bg-[#DE4176]/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#DE4176] transition-all duration-75"
              style={{ width: `${Math.max(5, Math.min(100, progressPercent))}%` }}
            />
          </div>
          <span className="font-jost text-xs font-medium text-[#B03366] tracking-widest uppercase">
            {`0${activeIndex + 1} / 0${tiktokVideos.length}`}
          </span>
        </div>

      </div>

      {/* MOBILE NATIVE SLIDER (< 1024px) - Sin pin, scroll-snap horizontal */}
      <div className="lg:hidden w-full py-12 px-6">
        <div className="mb-6">
          <div className="editorial-eyebrow mb-2">
            <ButterflyIcon size={14} color="#DE4176" />
            <span>02  Viral</span>
          </div>
          <BicolorSectionTitle firstWord="TikTok" secondWord="Feed" />
          <p className="editorial-text text-sm mt-2 text-[#B03366]/80">
            Desplaza horizontalmente para explorar los directos y momentos virales.
          </p>
        </div>

        <div className="w-full overflow-x-auto snap-x snap-mandatory flex gap-5 pb-6">
          {tiktokVideos.map((video, idx) => (
            <div
              key={idx}
              className="shrink-0 w-[270px] h-[480px] rounded-[20px] border-[4px] border-white overflow-hidden shadow-luxury snap-center"
            >
              <CustomTikTokPlayer item={video} isActive={true} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
