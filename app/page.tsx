"use client";
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ReactLenis } from '@studio-freight/react-lenis';

import { TVOnlinePlayer } from '../components/TVOnlinePlayer';
import { ViralSlider } from '../components/ViralSlider/ViralSlider';
import { CoverFlowRadio } from '../components/CoverFlowRadio';
import { DigitalClock } from '../components/DigitalClock';
import { CookieConsent } from '../components/CookieConsent';


// ==========================================
// HERO VIDEO COMPONENT (Seamless Zero-Delay Loop & Editorial Overlay)
// ==========================================
interface HeroVideoProps {
  onOpenRadio: () => void;
}

const HeroVideo: React.FC<HeroVideoProps> = ({ onOpenRadio }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    // Force native properties for guaranteed infinite autoplay & looping
    vid.defaultMuted = true;
    vid.muted = true;
    vid.playsInline = true;
    vid.loop = true;

    const playVideo = () => {
      vid.muted = true;
      const promise = vid.play();
      if (promise !== undefined) {
        promise.catch(() => {
          const onInteract = () => {
            vid.muted = true;
            vid.play().catch(() => {});
            ['click', 'touchstart', 'scroll', 'keydown', 'pointerdown'].forEach((ev) => {
              window.removeEventListener(ev, onInteract);
            });
          };
          ['click', 'touchstart', 'scroll', 'keydown', 'pointerdown'].forEach((ev) => {
            window.addEventListener(ev, onInteract, { passive: true, once: true });
          });
        });
      }
    };

    // Failsafe 1: When video reaches end, immediately restart from 0
    const handleEnded = () => {
      vid.currentTime = 0;
      vid.play().catch(() => {});
    };

    // Failsafe 2: When video gets within 0.15s of ending, rewind smoothly so it never freezes on the last frame
    const handleTimeUpdate = () => {
      if (vid.duration && vid.duration > 0 && vid.currentTime >= vid.duration - 0.15) {
        vid.currentTime = 0;
        vid.play().catch(() => {});
      }
    };

    // Failsafe 3: If video pauses while page is visible, resume immediately
    const handlePause = () => {
      if (!document.hidden && vid.paused) {
        vid.play().catch(() => {});
      }
    };

    // Failsafe 4: Resume playback when tab returns to foreground
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        vid.play().catch(() => {});
      }
    };

    vid.addEventListener('ended', handleEnded);
    vid.addEventListener('timeupdate', handleTimeUpdate);
    vid.addEventListener('pause', handlePause);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Watchdog timer: check every 2 seconds to ensure video is running
    const watchdog = setInterval(() => {
      if (!document.hidden && vid.paused) {
        vid.play().catch(() => {});
      }
    }, 2000);

    playVideo();

    return () => {
      vid.removeEventListener('ended', handleEnded);
      vid.removeEventListener('timeupdate', handleTimeUpdate);
      vid.removeEventListener('pause', handlePause);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(watchdog);
    };
  }, []);

  // Open radio in dedicated popup window or trigger modal fallback
  const handleOpenRadioPopup = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      const width = 1040;
      const height = 760;
      const left = Math.max(0, (window.screen.width - width) / 2);
      const top = Math.max(0, (window.screen.height - height) / 2);
      const popup = window.open(
        '/radio',
        'ThiagoRadioLive',
        `width=${width},height=${height},top=${top},left=${left},status=no,menubar=no,toolbar=no,location=no,resizable=yes`
      );
      // If popup was blocked by browser, open the in-page modal fallback
      if (!popup || popup.closed || typeof popup.closed === 'undefined') {
        onOpenRadio();
      }
    }
  };

  return (
    <div className="w-full pt-0 bg-black relative select-none">
      <section className="relative w-full aspect-video min-h-[460px] sm:min-h-0 overflow-hidden bg-black">
        {/* Clean Single Video Player - 100% Opaque, Zero Shadow on Loop */}
        <video
          ref={videoRef}
          src="/videos/hero.mp4"
          autoPlay
          muted
          playsInline
          loop
          preload="auto"
          onEnded={(e) => {
            const v = e.currentTarget;
            v.currentTime = 0;
            v.play().catch(() => {});
          }}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none z-10"
        />

        {/* Hero Content Stage: Left Typography + Right Live Radio Pill */}
        {/* Strictly pinned to upper half so it NEVER covers the 3D chrome logo in the bottom center */}
        <div className="absolute inset-0 z-20 flex flex-col justify-start p-6 sm:p-10 md:p-14 lg:p-20 pointer-events-none">
          
          {/* Top spacer below floating navbar */}
          <div className="w-full h-12 sm:h-14 md:h-16" />

          {/* Upper Row: Left Big Title & Right Radio Pill Button */}
          <div className="w-full flex flex-col md:flex-row items-start justify-between gap-6 pt-1 sm:pt-3 md:pt-4">
            
            {/* Left Typography - Kept strictly in upper 35% of video to leave 3D logo completely clear */}
            <div className="flex flex-col max-w-xl">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.6vw] font-syne font-black tracking-[-0.04em] text-white leading-[0.88] uppercase drop-shadow-2xl">
                EL RITMO
              </h1>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.6vw] font-syne font-black tracking-[-0.04em] bg-gradient-to-r from-[#FF5290] via-[#DE4176] to-[#FF75A9] bg-clip-text text-transparent leading-[0.88] uppercase mt-1 drop-shadow-[0_0_40px_rgba(222,65,118,0.55)]">
                DE TU MUNDO
              </h1>
              <p className="mt-3 sm:mt-4 text-[10px] sm:text-xs md:text-sm font-jakarta font-semibold tracking-[0.22em] text-white/90 uppercase drop-shadow">
                01 // LA EMISORA OFICIAL DE THIAGO VSC • EN DIRECTO 24/7
              </p>
            </div>

            {/* Right: Radio Live Glass Pill Button */}
            <div className="pointer-events-auto self-start md:self-start mt-2 md:mt-4">
              <button
                type="button"
                onClick={handleOpenRadioPopup}
                className="group inline-flex items-center gap-3.5 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/25 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer text-left shadow-[0_12px_40px_rgba(0,0,0,0.6)] haptic-press"
                title="Abrir Radio Live en ventana emergente"
              >
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EF4444] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#EF4444]"></span>
                  </span>
                  <span className="text-xs sm:text-sm font-jakarta font-extrabold tracking-wider uppercase flex items-center gap-1.5">
                    <span className="text-[#EF4444]">EN VIVO</span>
                    <span className="text-white group-hover:text-white transition-colors">RADIO</span>
                  </span>
                </div>
              </button>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

// ==========================================
// MAIN PAGE COMPONENT
// ==========================================
export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [radioModalOpen, setRadioModalOpen] = useState(false);
  const [hoveredGalleryCard, setHoveredGalleryCard] = useState<number | null>(null);
  const [lightboxCard, setLightboxCard] = useState<{ id: number; img: string; title: string; pillColor: string; pillBadge: string; category: string } | null>(null);
  // Close menu, radio modal and lightbox on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightboxCard(null);
        setMenuOpen(false);
        setRadioModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setMenuOpen(false);
    const elem = document.querySelector(targetId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const shokoEvents = [
    {
      title: "PURO PERREO",
      url: "https://shokomadrid.com/es/products/puro-perreo-sunday-30-8-2026",
      img: "https://shokomadrid.com/cdn/shop/files/WEB_--PP-MADRID-04_10--_jpg_0480387b-2930-4563-af6e-2898830c10d7.jpg",
      date: "OCT 04"
    },
    {
      title: "SWAG CITY",
      url: "https://shokomadrid.com/es/products/swag-city-thursday-1-10-2026",
      img: "https://shokomadrid.com/cdn/shop/files/BANNER-WEB-VERTICAL-BCN-BULIN-47_jpg.jpg",
      date: "OCT 01"
    },
    {
      title: "THE ROOM",
      url: "https://shokomadrid.com/es/products/the-room-friday-2-10-2026",
      img: "https://shokomadrid.com/cdn/shop/files/BANNER-WEB-VERTICAL-MAD-v2_1.jpg",
      date: "OCT 02"
    },
    {
      title: "PURE SHOKO",
      url: "https://shokomadrid.com/es/products/pure-shoko-saturday-3-10-2026",
      img: "https://shokomadrid.com/cdn/shop/files/BANNER-WEB-VERTICAL-MAD-LIL-NAAY.jpg",
      date: "OCT 03"
    },
    {
      title: "SWAG CITY",
      url: "https://shokomadrid.com/es/products/swag-city-thursday-8-10-2026",
      img: "https://shokomadrid.com/cdn/shop/files/31_10-PP---WEB-_md__jpg.jpg",
      date: "OCT 08"
    },
    {
      title: "THE ROOM",
      url: "https://shokomadrid.com/es/products/the-room-friday-9-10-2026",
      img: "https://shokomadrid.com/cdn/shop/files/TROPI-_PP-WEB_-_jpg.jpg",
      date: "OCT 09"
    }
  ];

  const navMenuItems = [
    { num: "01", label: "HOME // INICIO", target: "#home" },
    { num: "02", label: "TV ONLINE EN VIVO", target: "#tv" },
    { num: "03", label: "TIKTOK FEED", target: "#tiktok" },
    { num: "04", label: "ZONA INFLUENCER", target: "#zona-influencer" },
    { num: "05", label: "PRÓXIMOS EVENTOS (SHOKO)", target: "#events" },
  ];

  // ==========================================
  // ZONA INFLUENCER CARDS (FRANCESCA CHIRI - 5 FOTOS EXCLUSIVAS)
  // ==========================================
  const influencerCards = [
    {
      id: 0,
      img: "/images/francesca-1.jpg",
      title: "FRANCESCA CHIRI // OUTDOOR VIBES",
      pillColor: "#DE4176",
      pillBadge: "@chiri_francesca",
      category: "LIFESTYLE",
      rotation: -8,
      translateX: -65,
    },
    {
      id: 1,
      img: "/images/francesca-2.jpg",
      title: "PINK BISTRO // EDITORIAL LOOK",
      pillColor: "#F43F5E",
      pillBadge: "BEAUTY & FOOD",
      category: "EDITORIAL",
      rotation: -4,
      translateX: -32,
    },
    {
      id: 2,
      img: "/images/francesca-3.jpg",
      title: "WINTER WONDERLAND // SNOW LOOK",
      pillColor: "#0284C7",
      pillBadge: "WINTER STYLE",
      category: "WINTER",
      rotation: 0,
      translateX: 0,
    },
    {
      id: 3,
      img: "/images/francesca-4.jpg",
      title: "SNOW QUEEN // FUR HAT",
      pillColor: "#8B5CF6",
      pillBadge: "PORTRAIT '26",
      category: "FASHION",
      rotation: 4,
      translateX: 32,
    },
    {
      id: 4,
      img: "/images/francesca-5.jpg",
      title: "MEDITERRANEAN COAST // SUMMER",
      pillColor: "#10B981",
      pillBadge: "TRAVEL VLOG",
      category: "TRAVEL",
      rotation: 8,
      translateX: 65,
    },
  ];

  return (
    <ReactLenis root options={{ lerp: 0.05, smoothWheel: true }}>
      <div id="home" className="min-h-screen bg-[#09070D] text-[#F5F5F7] font-mono uppercase selection:bg-[#DE4176] selection:text-white overflow-hidden relative">

        {/* ==========================================
            BACKGROUND 35MM FILM GRAIN OVERLAY
        ========================================== */}
        <div className="film-grain" />

        {/* ==========================================
            FLOATING GLASS NAVIGATION (Precision VisionOS / High-Fashion Capsule)
        ========================================== */}
        <nav className="fixed top-[18px] left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1.5rem)] sm:w-[calc(100%-2.5rem)] max-w-6xl px-4 sm:px-6 py-2.5 rounded-full glass-capsule-dark shadow-[0_20px_60px_rgba(0,0,0,0.75)] flex items-center justify-between select-none border border-white/[0.14]">
          {/* Left: Logo THIAGO (bold) VSC (light weight) */}
          <div className="flex items-center gap-3">
            <a 
              href="#home" 
              onClick={(e) => handleNavClick(e, '#home')}
              className="flex items-center gap-1.5 tracking-tight text-white hover:text-[#DE4176] transition-colors group cursor-pointer"
            >
              <span className="font-syne font-black text-xl tracking-[-0.03em]">THIAGO</span>
              <span className="font-jakarta font-light text-lg tracking-tight text-white/80 group-hover:text-white transition-colors">VSC</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#DE4176] animate-pulse ml-0.5"></span>
            </a>
          </div>

          {/* Middle: Links uppercase, clean tracking, 75% opacity, 100% on hover */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <a 
              href="#home" 
              onClick={(e) => handleNavClick(e, '#home')}
              className="text-[11px] md:text-xs font-jakarta font-bold uppercase tracking-[0.16em] text-white/75 hover:text-white hover:drop-shadow-[0_0_10px_#DE4176] transition-all"
            >
              INICIO
            </a>
            <a 
              href="#tv" 
              onClick={(e) => handleNavClick(e, '#tv')}
              className="text-[11px] md:text-xs font-jakarta font-bold uppercase tracking-[0.16em] text-white/75 hover:text-white hover:drop-shadow-[0_0_10px_#DE4176] transition-all flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#DE4176] animate-ping"></span>
              <span>TV LIVE</span>
            </a>
            <a 
              href="#tiktok" 
              onClick={(e) => handleNavClick(e, '#tiktok')}
              className="text-[11px] md:text-xs font-jakarta font-bold uppercase tracking-[0.16em] text-white/75 hover:text-white hover:drop-shadow-[0_0_10px_#DE4176] transition-all"
            >
              TIKTOK
            </a>
            <a 
              href="#zona-influencer" 
              onClick={(e) => handleNavClick(e, '#zona-influencer')}
              className="text-[11px] md:text-xs font-jakarta font-bold uppercase tracking-[0.16em] text-white/75 hover:text-white hover:drop-shadow-[0_0_10px_#DE4176] transition-all"
            >
              INFLUENCER
            </a>
            <a 
              href="#events" 
              onClick={(e) => handleNavClick(e, '#events')}
              className="text-[11px] md:text-xs font-jakarta font-bold uppercase tracking-[0.16em] text-white/75 hover:text-white hover:drop-shadow-[0_0_10px_#DE4176] transition-all"
            >
              EVENTOS
            </a>
          </div>

          {/* Right: Digital clock adhered without background + Contact + Menu Trigger */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Live Digital Clock adhered directly to navbar */}
            <DigitalClock className="hidden sm:inline-flex" />

            <a 
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="hidden xs:inline-block bg-white hover:bg-[#DE4176] text-[#DE4176] hover:text-white font-jakarta text-[10px] sm:text-xs font-black tracking-[0.14em] uppercase px-4 py-1.5 rounded-full transition-all duration-300 shadow-md hover:shadow-[0_0_20px_rgba(222,65,118,0.6)] cursor-pointer haptic-press"
            >
              Contacto
            </a>
            <button 
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="text-white hover:text-[#DE4176] bg-white/[0.08] hover:bg-white/20 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all border border-white/15 cursor-pointer haptic-press"
            >
              <span className="font-bold text-xs sm:text-sm">☰</span>
            </button>
          </div>
        </nav>



        {/* ==========================================
            FULLSCREEN / SLIDE-IN EDITORIAL MENU OVERLAY
        ========================================== */}
        {menuOpen && (
          <div 
            className="fixed inset-0 z-[100] bg-[#09070D]/95 backdrop-blur-2xl flex flex-col justify-between p-6 md:p-14 animate-in fade-in duration-200 select-none"
            onClick={() => setMenuOpen(false)}
          >
            {/* Header inside Menu with Digital Clock & Official badge */}
            <div className="flex justify-between items-center w-full max-w-6xl mx-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-3">
                <span className="font-syne font-black text-2xl md:text-3xl text-white tracking-[-0.03em]">
                  THIAGOVSC
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-jakarta font-extrabold bg-[#DE4176] text-white uppercase tracking-widest flex items-center">
                  OFFICIAL
                </span>
                {/* Live Digital Clock in Menu */}
                <DigitalClock className="inline-flex" />
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="px-5 py-2 rounded-full border border-white/20 bg-white/5 hover:bg-[#DE4176] hover:border-[#DE4176] text-white text-xs font-jakarta font-bold tracking-widest uppercase transition-all duration-200 flex items-center gap-2 cursor-pointer haptic-press"
              >
                <span>CERRAR</span>
                <span className="text-sm">✕</span>
              </button>
            </div>

            {/* Menu Links */}
            <div className="w-full max-w-6xl mx-auto my-auto py-8 flex flex-col gap-3 md:gap-5" onClick={(e) => e.stopPropagation()}>
              {navMenuItems.map((item, idx) => (
                <a
                  key={idx}
                  href={item.target}
                  onClick={(e) => handleNavClick(e, item.target)}
                  className="group flex items-center gap-4 md:gap-8 text-[#F5F5F7] hover:text-[#DE4176] transition-all duration-300 py-2 border-b border-white/[0.06]"
                >
                  <span className="font-mono text-sm md:text-lg text-[#8E8E98] group-hover:text-[#DE4176] transition-colors">
                    {item.num}
                  </span>
                  <span className="text-3xl md:text-5xl lg:text-6xl font-syne font-black tracking-[-0.03em] group-hover:translate-x-3 transition-transform duration-300 uppercase">
                    {item.label}
                  </span>
                </a>
              ))}
            </div>

            {/* Menu Footer */}
            <div className="w-full max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-[#8E8E98] pt-6 border-t border-white/[0.08]" onClick={(e) => e.stopPropagation()}>
              <div className="flex gap-6 uppercase tracking-wider">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>
                <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">TikTok</a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">YouTube</a>
                <a href="https://spotify.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Spotify</a>
              </div>
              <div className="tracking-widest uppercase">
                OFFICIAL PLATFORM
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            ANIMATED HERO SECTION (No black top line, video flush to top)
        ========================================== */}
        <HeroVideo onOpenRadio={() => setRadioModalOpen(true)} />

        {/* ==========================================
            HERO MARQUEE (Solid Pink #DE4176)
        ========================================== */}
        <section className="py-4 md:py-5 bg-[#DE4176] overflow-hidden border-t border-b border-white/20 shadow-md">
          <div className="marquee-wrapper">
            <div className="marquee-content text-lg md:text-xl font-syne font-black tracking-wider text-white gap-16 flex uppercase items-center">
              <span>WELCOME TO THE OFFICIAL NETWORK // BROADCASTING LIVE 24/7</span>
              <span className="text-white/60 mx-4 font-bold">//</span>
              <span>TOP CHARTS, VIRAL MOMENTS, AND THE HALL OF FAME</span>
              <span className="text-white/60 mx-4 font-bold">//</span>
              <span>WELCOME TO THE OFFICIAL NETWORK // BROADCASTING LIVE 24/7</span>
              <span className="text-white/60 mx-4 font-bold">//</span>
              <span>TOP CHARTS, VIRAL MOMENTS, AND THE HALL OF FAME</span>
              <span className="text-white/60 mx-4 font-bold">//</span>
            </div>
          </div>
        </section>

        {/* ==========================================
            URBAN TV ONLINE (YOUTUBE PLAYLIST PLALJOp7e_srk)
        ========================================== */}
        <TVOnlinePlayer />

        {/* ==========================================
            TIKTOK VIRAL FEED SLIDER (Skiper54 Carousel_006 Inset Effect)
        ========================================== */}
        <ViralSlider />

        {/* ==========================================
            ZONA INFLUENCER (HALL OF FAME - FRANCESCA CHIRI)
            Solid Pink #DE4176 Background, Bold White Typography, White Link Pill
        ========================================== */}
        {/* ==========================================
            ZONA INFLUENCER (HALL OF FAME - FRANCESCA CHIRI)
            Solid Pink #DE4176 Background, Bold White Typography, White Link Pill
        ========================================== */}
        <section id="zona-influencer" className="w-full flex flex-col md:flex-row bg-[#DE4176] text-white relative overflow-hidden py-12 md:py-20">
          
          {/* Subtle Ambient Background Watermark */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 select-none pointer-events-none opacity-[0.04] text-[28vw] font-black tracking-tighter whitespace-nowrap z-0">
            CHIRI
          </div>

          {/* Left Column */}
          <div className="md:w-1/2 p-6 sm:p-12 md:p-16 lg:p-24 flex flex-col justify-center z-10">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black/25 backdrop-blur-md border border-white/20 mb-5 w-fit shadow-md">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              <h4 className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.28em] text-white uppercase">
                HALL OF FAME // TALENTO EXCLUSIVO
              </h4>
            </div>
            
            <h2 className="text-5xl sm:text-7xl lg:text-[6.5vw] font-syne font-black tracking-[-0.04em] leading-[0.85] mb-6 text-white uppercase">
              ZONA<br/><span className="text-transparent" style={{ WebkitTextStroke: '2px #FFFFFF' }}>INFLUENCER</span>
            </h2>

            {/* Influencer Name & Verified Username */}
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <h3 className="text-2xl sm:text-3xl font-syne font-black text-white tracking-tight uppercase">
                FRANCESCA CHIRI
              </h3>
              <a
                href="https://www.tiktok.com/@chiri_francesca"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs bg-white hover:bg-black text-[#DE4176] hover:text-white font-jakarta px-3.5 py-1.5 rounded-full font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>@chiri_francesca</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#DE4176] group-hover:bg-white animate-pulse" />
              </a>
            </div>

            {/* Key Telemetry Badges */}
            <div className="flex flex-wrap gap-2.5 mb-6 font-jakarta text-xs">
              <span className="px-3.5 py-1 rounded-full bg-black/30 backdrop-blur-md border border-white/20 text-[10px] sm:text-[11px] font-bold tracking-wider uppercase text-white/95">
                1.8M+ AUDIENCIA
              </span>
              <span className="px-3.5 py-1 rounded-full bg-black/30 backdrop-blur-md border border-white/20 text-[10px] sm:text-[11px] font-bold tracking-wider uppercase text-white/95">
                MODA & EDITORIAL
              </span>
              <span className="px-3.5 py-1 rounded-full bg-black/30 backdrop-blur-md border border-white/20 text-[10px] sm:text-[11px] font-bold tracking-wider uppercase text-white/95">
                VERIFICADA OFICIAL
              </span>
            </div>

            {/* Influencer Bio */}
            <p className="text-xs sm:text-sm font-jakarta text-white/95 max-w-lg mb-8 leading-relaxed normal-case font-medium">
              Nacida en Italia en 2006 y con raíces rumanas, Francesca Chiri comenzó su andadura en el contenido digital a los 13 años. Hoy, bajo el usuario @chiri_francesca, inspira a millones de seguidores con sus looks de moda, rutinas de beauty y vlogs de viajes. Es una de las creadoras de contenido curvy y de estilo de vida con mayor proyección en la escena europea.
            </p>

            {/* SÍGUELA AQUÍ (Linktree button) */}
            <div>
              <a 
                href="https://linktr.ee/chirifrancesca"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-white hover:bg-black text-[#DE4176] hover:text-white font-jakarta font-extrabold px-8 py-4 text-sm md:text-base tracking-wider rounded-full transition-all shadow-xl hover:shadow-[0_0_35px_rgba(255,255,255,0.45)] hover:scale-105 active:scale-95 uppercase cursor-pointer haptic-press"
              >
                <span>ACCEDER AL LINKTREE OFICIAL</span>
              </a>
            </div>
          </div>

          
          {/* Right Column: Generous 3D Fan Stage */}
          <div className="md:w-1/2 p-3 sm:p-8 md:p-10 lg:p-12 flex items-center justify-center relative z-10 min-h-[480px] sm:min-h-[600px] md:min-h-[700px] lg:min-h-[780px]" style={{ perspective: '1400px' }}>
            <div className="relative w-full max-w-[560px] lg:max-w-[620px] aspect-[4/5] flex items-center justify-center">
              {influencerCards.map((card, idx) => {
                const isHovered = hoveredGalleryCard === idx;
                const hasAnyHover = hoveredGalleryCard !== null;

                return (
                  <div
                    key={card.id}
                    onMouseEnter={() => setHoveredGalleryCard(idx)}
                    onMouseLeave={() => setHoveredGalleryCard(null)}
                    onClick={() => setLightboxCard(card)}
                    style={{
                      transform: isHovered
                        ? 'translateY(-28px) rotate(0deg) scale(1.06) translateZ(60px)'
                        : hasAnyHover
                        ? `translate(${card.translateX * 1.12}px, 6px) rotate(${card.rotation * 1.15}deg) scale(0.96) translateZ(0)`
                        : `translate(${card.translateX * 0.82}px, 0) rotate(${card.rotation}deg) scale(1) translateZ(0)`,
                      zIndex: isHovered ? 50 : 30 - Math.abs(idx - 2) * 4,
                      transition: 'all 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                    className={`absolute w-[260px] xs:w-[290px] sm:w-[380px] md:w-[420px] lg:w-[460px] aspect-[4/5] rounded-[2.5rem] overflow-visible cursor-pointer select-none ${
                      isHovered
                        ? 'shadow-[0_35px_80px_rgba(0,0,0,0.65)]'
                        : 'shadow-[0_25px_50px_rgba(0,0,0,0.35)]'
                    }`}
                  >
                    {/* Floating Colored Pill with Title */}
                    <div
                      style={{
                        backgroundColor: card.pillColor,
                        opacity: isHovered ? 1 : 0,
                        transform: isHovered ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.85)',
                        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                      className="absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full font-mono text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-white shadow-2xl whitespace-nowrap z-50 flex items-center gap-1.5 border border-white/30 pointer-events-none"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                      <span>{card.title}</span>
                      <span className="text-[9px] bg-black/40 px-1.5 py-0.5 rounded ml-1 font-bold">AMPLIAR</span>
                    </div>

                    {/* Double-Bezel Card Outer Chassis */}
                    <div 
                      className={`w-full h-full p-1.5 sm:p-2 rounded-[2.5rem] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] relative ${
                        isHovered 
                          ? 'bg-gradient-to-b from-white/35 via-white/10 to-white/25 ring-1 ring-white/50 shadow-[0_0_55px_rgba(255,255,255,0.45)]' 
                          : 'bg-white/10 ring-1 ring-white/20'
                      }`}
                    >
                      {/* Inner Core with Concentric Radius */}
                      <div className="w-full h-full rounded-[calc(2.5rem-0.375rem)] sm:rounded-[calc(2.5rem-0.5rem)] overflow-hidden border border-white/20 relative bg-[#120E18]">
                        <img 
                          src={card.img} 
                          alt={card.title} 
                          className={`w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                            isHovered ? 'scale-105' : 'scale-100'
                          }`}
                        />
                        
                        {/* Gradient Vignette Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent opacity-75" />

                        {/* Bottom Meta Badge */}
                        <div className="absolute bottom-5 sm:bottom-6 left-5 sm:left-6 right-5 sm:right-6 flex justify-between items-center z-10">
                          <span 
                            className="px-3.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase text-white border border-white/20 shadow-md"
                            style={{ backgroundColor: card.pillColor }}
                          >
                            {card.pillBadge}
                          </span>
                          <span className="text-[10px] font-mono font-bold text-white/90 tracking-wider bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
                            VER FOTO
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ==========================================
            CLUB EVENTS (SHOKO MADRID - Pure White Background matching Mockup)
            VIP Holographic Passes with Ticket Notches, Barcodes & Live Booking
        ========================================== */}
        <section id="events" className="w-full bg-white flex flex-col py-16 md:py-24 relative overflow-hidden select-none">
          <div className="px-6 md:px-14 flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DE4176]/10 border border-[#DE4176]/30 shadow-sm mb-3">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#DE4176] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#DE4176]"></span>
                </span>
                <span className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.22em] text-[#DE4176] uppercase">
                  05 // PRÓXIMOS EVENTOS • SHÔKO MADRID
                </span>
              </div>
              <h2 className="text-6xl md:text-7xl lg:text-[7vw] font-syne font-black tracking-[-0.04em] leading-[0.85] text-[#DE4176] uppercase">
                PRÓXIMOS<br />
                <span className="text-transparent" style={{ WebkitTextStroke: '2px #DE4176' }}>
                  EVENTOS
                </span>
              </h2>
            </div>
            
            <div className="flex flex-col md:items-end gap-2">
              <a 
                href="https://shokomadrid.com/es/collections/eventos-shoko-madrid" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#DE4176] hover:bg-black text-white border border-[#DE4176] shadow-lg hover:shadow-2xl transition-all duration-300 text-xs font-jakarta font-extrabold tracking-wider uppercase group cursor-pointer hover:scale-105 active:scale-95 haptic-press"
              >
                <span>VER TODOS EN SHÔKO.COM</span>
              </a>
              <span className="text-[10px] font-jakarta font-semibold text-zinc-400 tracking-wider uppercase">
                MADRID // CALLE DE TOLEDO, 86 • ENTRADAS OFICIALES
              </span>
            </div>
          </div>

          
          {/* Holographic VIP Ticket Passes Grid */}
          <div className="px-6 md:px-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 relative z-10">
            {shokoEvents.map((event, i) => (
              <div 
                key={i} 
                className="w-full relative group overflow-hidden bg-[#0D0B12] rounded-3xl border border-zinc-200 hover:border-[#DE4176] shadow-[0_10px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_50px_rgba(222,65,118,0.3)] transition-all duration-500 hover:-translate-y-2 flex flex-col"
              >
                {/* Physical Ticket Notches cutout */}
                <div className="ticket-notch-left" />
                <div className="ticket-notch-right" />
                <div className="ticket-perforation" />

                {/* Top Poster Area */}
                <div className="relative w-full aspect-[4/5] overflow-hidden bg-zinc-950">
                  <img 
                    src={event.img} 
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
                    alt={event.title} 
                  />
                  
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D0B12] via-transparent to-black/40" />

                  {/* Top Bar: Pass Number & Date Pill */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
                    <span className="bg-black/60 backdrop-blur-md text-white/80 font-mono font-bold text-[9px] px-2 py-0.5 rounded-full border border-white/15">
                      0{i + 1} // VIP
                    </span>
                    <div className="bg-[#DE4176] text-white font-jakarta font-black text-[10px] px-2.5 py-1 rounded-full shadow-[0_0_12px_rgba(222,65,118,0.6)] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      <span>{event.date}</span>
                    </div>
                  </div>

                  {/* Subtle holographic foil shine on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 holo-shimmer pointer-events-none transition-opacity duration-500" />
                </div>
                
                {/* Bottom Ticket Stub (Below Perforation) */}
                <div className="p-3.5 pt-4 flex flex-col justify-between flex-grow bg-[#0D0B12] text-white z-10">
                  <div>
                    <span className="text-[9px] font-jakarta font-bold text-[#DE4176] tracking-widest uppercase block mb-1">
                      SHÔKO MADRID
                    </span>
                    <h4 
                      className="font-syne font-black text-sm md:text-base tracking-tight text-white uppercase truncate" 
                      title={event.title}
                    >
                      {event.title}
                    </h4>
                  </div>

                  {/* Barcode Graphic & Buy Button */}
                  <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-col gap-2">
                    {/* Stylized Barcode */}
                    <div className="flex items-center justify-between px-1 opacity-40 group-hover:opacity-80 transition-opacity">
                      <div className="flex gap-[2px] h-3 items-end">
                        <span className="w-[1px] h-3 bg-white" />
                        <span className="w-[2px] h-2 bg-white" />
                        <span className="w-[1px] h-3 bg-white" />
                        <span className="w-[3px] h-3 bg-white" />
                        <span className="w-[1px] h-2 bg-white" />
                        <span className="w-[2px] h-3 bg-white" />
                        <span className="w-[1px] h-3 bg-white" />
                        <span className="w-[2px] h-2 bg-white" />
                        <span className="w-[1px] h-3 bg-white" />
                      </div>
                      <span className="font-mono text-[8px] text-white/60 tracking-wider">#SHK-2026</span>
                    </div>

                    {/* Direct Buy Ticket Button */}
                    <a 
                      href={event.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-full bg-white group-hover:bg-[#DE4176] text-black group-hover:text-white text-[10px] font-jakarta font-black tracking-wider py-2.5 rounded-xl text-center transition-all duration-300 shadow-md group-hover:shadow-[0_0_18px_rgba(222,65,118,0.55)] flex items-center justify-center cursor-pointer uppercase haptic-press"
                    >
                      <span>COMPRAR ENTRADAS</span>
                    </a>
                  </div>
                </div>


              </div>
            ))}
          </div>
        </section>


        {/* ==========================================
            EDITORIAL BRANDS MARQUEE (White Background matching Mockup)
        ========================================== */}
        <section className="py-7 bg-white border-t border-b border-[#DE4176]/20 overflow-hidden">
          <div className="marquee-wrapper">
            <div className="marquee-content text-2xl md:text-3xl font-black tracking-tighter text-[#DE4176] gap-16 flex items-center" style={{ fontFamily: 'Arial Black, Impact, sans-serif' }}>
              <span>FORBES</span><span className="text-[#DE4176]/40">//</span>
              <span>DIELINE</span><span className="text-[#DE4176]/40">//</span>
              <span>FAMOUSE</span><span className="text-[#DE4176]/40">//</span>
              <span>ROLLING STONE</span><span className="text-[#DE4176]/40">//</span>
              <span>VANITY FAIR</span><span className="text-[#DE4176]/40">//</span>
              <span>FORBES</span><span className="text-[#DE4176]/40">//</span>
              <span>DIELINE</span><span className="text-[#DE4176]/40">//</span>
              <span>FAMOUSE</span><span className="text-[#DE4176]/40">//</span>
              <span>ROLLING STONE</span><span className="text-[#DE4176]/40">//</span>
              <span>VANITY FAIR</span><span className="text-[#DE4176]/40">//</span>
            </div>
          </div>
        </section>

        {/* ==========================================
            FOOTER (Solid Pink #DE4176 matching Mockup)
            Editorial Branding, Pure Typography & Legal Access
        ========================================== */}
        <footer id="contact" className="bg-[#DE4176] text-white pt-20 pb-16 flex flex-col items-center relative overflow-hidden select-none">
          {/* Subtle Ambient Radial Highlight */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-white/10 blur-3xl pointer-events-none" />

          <h1 
            className="text-[20vw] leading-[0.7] font-syne font-black uppercase text-center tracking-[-0.05em] text-white drop-shadow-[0_15px_35px_rgba(0,0,0,0.2)]" 
          >
            THIAGO
          </h1>

          {/* Social Links - Pure text, zero icons, zero arrows */}
          <div className="mt-10 flex flex-wrap justify-center items-center gap-6 sm:gap-10 font-jakarta text-xs md:text-sm font-black uppercase tracking-widest text-white">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors border-b-2 border-transparent hover:border-black pb-0.5">Instagram</a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors border-b-2 border-transparent hover:border-black pb-0.5">TikTok</a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors border-b-2 border-transparent hover:border-black pb-0.5">YouTube</a>
            <a href="https://spotify.com" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors border-b-2 border-transparent hover:border-black pb-0.5">Spotify</a>
            <a href="mailto:contacto@thiagovsc.com" className="hover:text-black transition-colors border-b-2 border-transparent hover:border-black pb-0.5">Contacto</a>
          </div>


          {/* Legal Links Bar */}
          <div className="mt-10 flex flex-wrap justify-center items-center gap-4 sm:gap-6 font-mono text-[11px] uppercase tracking-wider text-white/85">
            <a href="/aviso-legal" className="hover:text-white transition-colors underline-offset-4 hover:underline">Aviso Legal</a>
            <span>•</span>
            <a href="/politica-de-privacidad" className="hover:text-white transition-colors underline-offset-4 hover:underline">Política de Privacidad</a>
            <span>•</span>
            <a href="/politica-de-cookies" className="hover:text-white transition-colors underline-offset-4 hover:underline">Política de Cookies</a>
            <span>•</span>
            <button 
              type="button" 
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('open-cookie-settings'));
                }
              }} 
              className="hover:text-white transition-colors underline-offset-4 hover:underline cursor-pointer font-mono uppercase"
            >
              Configurar Cookies
            </button>

          </div>

          <div className="mt-6 text-[11px] font-mono text-white/70 tracking-wider">
            © 2026 THIAGOVSC • ALL RIGHTS RESERVED
          </div>
        </footer>

        {/* ==========================================
            FULL-SIZE LIGHTBOX MODAL (FONDO BORROSO)
        ========================================== */}
        {lightboxCard && (
          <div 
            className="fixed inset-0 z-[200] flex flex-col justify-between p-4 sm:p-8 animate-in fade-in duration-200 select-none overflow-hidden"
            onClick={() => setLightboxCard(null)}
          >
            {/* Ultra-Realistic Blurred Backdrop of the Photo (No black background) */}
            <div 
              className="absolute inset-0 bg-cover bg-center scale-125 blur-3xl opacity-60 pointer-events-none transition-all duration-500"
              style={{ backgroundImage: `url(${lightboxCard.img})` }}
            />
            {/* Translucent Frosted Glass Tint */}
            <div className="absolute inset-0 bg-black/35 backdrop-blur-xl pointer-events-none" />

            {/* Lightbox Header */}
            <div className="w-full max-w-5xl mx-auto flex justify-between items-center z-10 relative" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-3">
                <span 
                  className="px-4 py-1.5 rounded-full text-xs font-mono font-bold uppercase text-white shadow-lg border border-white/30 backdrop-blur-md"
                  style={{ backgroundColor: lightboxCard.pillColor }}
                >
                  {lightboxCard.title}
                </span>
                <span className="hidden sm:inline-block text-xs font-mono text-white/90 font-bold bg-white/20 px-3 py-1 rounded-full border border-white/20 backdrop-blur-md">
                  FRANCESCA CHIRI
                </span>
              </div>

              <button
                onClick={() => setLightboxCard(null)}
                className="px-5 py-2 rounded-full border border-white/30 bg-white/20 hover:bg-[#DE4176] hover:border-[#DE4176] text-white text-xs font-mono font-bold tracking-widest uppercase transition-all duration-200 flex items-center gap-2 shadow-lg backdrop-blur-md cursor-pointer hover:scale-105 active:scale-95"
              >
                <span>CERRAR</span>
                <span className="text-sm">✕</span>
              </button>
            </div>

            {/* Lightbox Full-Size Image Stage */}
            <div className="w-full max-w-5xl mx-auto my-auto flex items-center justify-center relative p-2 z-10" onClick={(e) => e.stopPropagation()}>
              <img 
                src={lightboxCard.img} 
                alt={lightboxCard.title}
                className="max-h-[78vh] max-w-[90vw] object-contain rounded-2xl border-2 border-white/40 shadow-[0_30px_90px_rgba(0,0,0,0.6)] animate-in zoom-in-95 duration-200"
              />
            </div>

            {/* Lightbox Footer / Switcher */}
            <div className="w-full max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 text-xs font-mono text-white/90 z-10 pt-2 relative" onClick={(e) => e.stopPropagation()}>
              <span className="tracking-wider font-bold">FRANCESCA CHIRI // ZONA INFLUENCER</span>
              <div className="flex gap-2">
                {influencerCards.map((c, i) => (
                  <button
                    key={c.id}
                    onClick={() => setLightboxCard(c)}
                    className={`px-3.5 py-1.5 rounded-full transition-all text-[11px] font-bold backdrop-blur-md cursor-pointer ${
                      lightboxCard.id === c.id ? 'bg-white text-[#DE4176] shadow-md scale-105' : 'bg-white/20 text-white hover:bg-white/40'
                    }`}
                  >
                    FOTO 0{i + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            COVER FLOW RADIO POPUP MODAL (In-Page Fallback)
        ========================================== */}
        {radioModalOpen && (
          <div 
            className="fixed inset-0 z-[250] flex items-center justify-center p-3 sm:p-6 md:p-10 animate-in fade-in duration-200 select-none"
            onClick={() => setRadioModalOpen(false)}
          >
            {/* Frosted Glass Backdrop */}
            <div className="absolute inset-0 bg-black/85 backdrop-blur-2xl" />

            {/* Modal Shell Container */}
            <div 
              className="relative w-full max-w-5xl h-[88vh] max-h-[780px] bg-[#08070B] rounded-3xl overflow-hidden border border-white/20 shadow-[0_30px_100px_rgba(0,0,0,0.85)] z-10 animate-in zoom-in-95 duration-200 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <CoverFlowRadio onClose={() => setRadioModalOpen(false)} />
            </div>
          </div>
        )}


        {/* ==========================================
            COOKIE CONSENT BANNER (Aceptar todas las cookies)
        ========================================== */}
        <CookieConsent />

      </div>
    </ReactLenis>
  );
}
