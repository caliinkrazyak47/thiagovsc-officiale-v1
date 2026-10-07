'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ReactLenis, useLenis } from '@studio-freight/react-lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Play, X } from 'lucide-react';
import { TVOnlinePlayer } from '@/components/TVOnlinePlayer/TVOnlinePlayer';
import { ViralSlider } from '@/components/ViralSlider/ViralSlider';
import { CoverFlowRadio } from '@/components/CoverFlowRadio/CoverFlowRadio';
import { CookieConsent } from '@/components/CookieConsent';
import { CustomCursor } from '@/components/CustomCursor';
import { SamuClimaPreloader } from '@/components/SamuClimaPreloader';
import { ButterflyIcon } from '@/components/ButterflyIcon';
import { BicolorSectionTitle } from '@/components/BicolorSectionTitle';
import { Marquee } from '@/components/Marquee';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SoundToggle } from '@/components/SoundToggle';
import { SectionColorMorph } from '@/components/SectionColorMorph';
import { useMediaStore } from '@/lib/mediaStore';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const LenisScrollTriggerSync: React.FC = () => {
  useLenis(() => {
    ScrollTrigger.update();
  });

  useEffect(() => {
    gsap.ticker.lagSmoothing(0);
    document.fonts.ready.then(() => {
      ScrollTrigger.refresh();
    });
  }, []);

  return null;
};

// ==========================================
// 1. HERO VIDEO COMPONENT (Motionsites Level)
// ==========================================
interface HeroVideoProps {
  onOpenRadio: () => void;
}

const HeroVideo: React.FC<HeroVideoProps> = ({ onOpenRadio }) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  const { isSoundEnabled, activeMediaId, setActiveMedia } = useMediaStore();

  // Autoplay management
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.play().catch(() => {});
  }, []);

  // Sync sound: only mute hero when another media plays or sound is disabled; NEVER pause hero
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isSoundEnabled && activeMediaId === 'hero') {
      video.muted = false;
      gsap.to(video, { volume: 0.6, duration: 1.2, ease: 'power2.out' });
    } else {
      video.muted = true;
    }
  }, [isSoundEnabled, activeMediaId]);

  // Pause video only when out of viewport via IntersectionObserver
  useEffect(() => {
    const video = videoRef.current;
    const hero = heroRef.current;
    if (!video || !hero) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  // GSAP ScrollTrigger: Video scale from 1 to 1.12 + Title parallax (transform only)
  useGSAP(
    () => {
      if (!heroRef.current || !videoRef.current) return;

      gsap.to(videoRef.current, {
        scale: 1.12,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      if (titleRef.current) {
        gsap.to(titleRef.current, {
          y: -40,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }
    },
    { scope: heroRef }
  );

  const heroHeadline = "El ritmo de tu mundo";

  return (
    <div ref={heroRef} className="relative w-full overflow-hidden select-none">
      {/* 16:9 Responsive Video Viewport SIN NINGÚN FILTRO NI TINTES NI OVERLAYS */}
      <section className="relative w-full aspect-video min-h-[520px] sm:min-h-[600px] md:min-h-[700px] lg:min-h-[820px] max-h-[1080px] overflow-hidden bg-[#E0457B]">
        {/* Background Fallback Poster */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
          style={{
            backgroundImage: "url('/hero-poster.jpg')",
            opacity: isVideoLoaded ? 0 : 1,
          }}
        />

        {/* Hero Background Video - Sin filtros, sin overlays, bucle puro continuo */}
        <video
          ref={videoRef}
          src="https://res.cloudinary.com/v47hsuhi/video/upload/v1791278204/Requesting_video_edit_without_re__20261006111622.mp4"
          poster="/hero-poster.jpg"
          autoPlay
          loop
          muted={!isSoundEnabled || (activeMediaId !== null && activeMediaId !== 'hero')}
          playsInline
          preload="auto"
          onLoadedData={() => setIsVideoLoaded(true)}
          onEnded={() => {
            if (videoRef.current) {
              videoRef.current.currentTime = 0;
              videoRef.current.play().catch(() => {});
            }
          }}
          className={`absolute inset-0 w-full h-full object-cover will-change-transform ${
            isVideoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ objectPosition: 'center 35%' }}
        >
          <source 
            src="https://res.cloudinary.com/v47hsuhi/video/upload/v1791278204/Requesting_video_edit_without_re__20261006111622.mp4" 
            type="video/mp4" 
          />
          <source 
            src="/videos/hero_cloudinary.mp4" 
            type="video/mp4" 
          />
        </video>

        {/* 
          DESKTOP HERO STAGE (>= 768px):
          left: 5vw, top: calc(56px + 6vh), max-width: 22vw
          tamaño clamp(1.4rem, 2.2vw, 2.2rem)
          text-shadow: 0 2px 18px rgba(163,40,92,.35)
          Verificado: nunca toca la cara ni el gorro.
        */}
        <div
          ref={titleRef}
          className="hidden md:flex absolute z-20 flex-col items-start pointer-events-none"
          style={{
            left: '5vw',
            top: 'calc(56px + 6vh)',
            maxWidth: '22vw',
          }}
        >
          {/* Eyebrow con mariposa */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 mb-3 font-satoshi text-xs tracking-[0.28em] uppercase text-[#FFE9D6]"
            style={{ textShadow: '0 2px 18px rgba(163,40,92,0.35)' }}
          >
            <ButterflyIcon size={14} color="#FFE9D6" strokeWidth={1.5} />
            <span>00 · PLATAFORMA OFICIAL</span>
          </motion.div>

          {/* Título en Panchang 700 color --champagne */}
          <h1 
            className="font-panchang font-bold text-[#FFE9D6] text-[clamp(1.4rem,2.2vw,2.2rem)] leading-[1.12] tracking-tight"
            style={{ textShadow: '0 2px 18px rgba(163,40,92,0.35)' }}
          >
            {heroHeadline.split('').map((char, i) => (
              <span key={i} className="inline-block overflow-hidden py-0.5">
                <motion.span
                  initial={{ y: '100%' }}
                  animate={{ y: '0%' }}
                  transition={{
                    duration: 0.75,
                    delay: 0.2 + i * 0.02,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="inline-block"
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              </span>
            ))}
          </h1>

          {/* Subtítulo max-width 22vw */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="mt-3 font-satoshi text-xs tracking-[0.14em] text-[#FFE9D6]/90 uppercase font-normal"
            style={{ textShadow: '0 2px 18px rgba(163,40,92,0.35)' }}
          >
            Emisión ininterrumpida 24/7 // Sonido de vanguardia
          </motion.p>
        </div>

        {/* Desktop Top Right: Botón ULTRA-PREMIUM RADIO EN VIVO (sin botón de puntitos) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="hidden md:flex items-center absolute z-20 pointer-events-auto"
          style={{ right: '5vw', top: 'calc(56px + 6vh)' }}
        >
          <motion.button
            type="button"
            onClick={onOpenRadio}
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="group relative inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-[#E0457B]/85 hover:bg-[#E0457B] text-[#FFE9D6] border border-[#FFE9D6]/40 shadow-[0_10px_30px_-5px_rgba(163,40,92,0.5),inset_0_1px_1px_rgba(255,233,214,0.35)] backdrop-blur-md transition-all duration-300 cursor-pointer overflow-hidden"
            title="Sintonizar Radio Live"
            data-cursor="Play"
          >
            {/* Sheen sweep on hover */}
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
            
            <ButterflyIcon size={14} color="#FFE9D6" strokeWidth={1.5} className="transition-transform duration-300 group-hover:scale-110" />
            
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFE9D6] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FFE9D6]" />
            </span>

            <span className="font-satoshi text-xs font-semibold tracking-[0.22em] uppercase">
              RADIO EN VIVO
            </span>

            <span className="font-satoshi text-[10px] tracking-widest text-[#FFE9D6]/80 uppercase pl-1 border-l border-[#FFE9D6]/30">
              24/7
            </span>
          </motion.button>
        </motion.div>
      </section>

      {/* MOBILE HERO TYPOGRAPHY (< 768px): Rostro 100% libre */}
      <div className="md:hidden w-full bg-[#E0457B] text-[#FFE9D6] px-6 py-8 border-b border-[rgba(255,233,214,0.18)] select-none">
        <div className="inline-flex items-center gap-2 mb-2 font-satoshi text-xs tracking-[0.28em] uppercase text-[#FFE9D6]">
          <ButterflyIcon size={14} color="#FFE9D6" strokeWidth={1.5} />
          <span>00 · PLATAFORMA OFICIAL</span>
        </div>

        <h1 className="font-panchang font-bold text-white text-2xl sm:text-3xl leading-tight tracking-tight">
          El ritmo de tu <span className="text-[#FFE9D6]">mundo</span>
        </h1>

        <p className="mt-2 font-satoshi text-xs tracking-wider text-[#FFE9D6]/85 uppercase">
          Emisión ininterrumpida 24/7 // Sonido de vanguardia
        </p>

        <div className="mt-5 flex items-center">
          <motion.button
            type="button"
            onClick={onOpenRadio}
            whileTap={{ scale: 0.97 }}
            className="group relative inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-[#FFE9D6] text-[#A3285C] font-satoshi text-xs font-bold tracking-[0.18em] uppercase shadow-[0_8px_20px_rgba(163,40,92,0.35)] cursor-pointer"
          >
            <ButterflyIcon size={13} color="#A3285C" strokeWidth={1.5} />
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A3285C] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#A3285C]" />
            </span>
            <span>RADIO EN VIVO</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// MAIN PAGE COMPONENT
// ==========================================
export default function Home() {
  const [activeSection, setActiveSection] = useState('home');
  const [lightboxCard, setLightboxCard] = useState<any>(null);
  const [radioModalOpen, setRadioModalOpen] = useState(false);
  const [hoveredGalleryCard, setHoveredGalleryCard] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [navVisible, setNavVisible] = useState(true);

  const lastScrollY = useRef(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Hide navbar on scroll down, show on scroll up
  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      if (currentY > 100 && currentY > lastScrollY.current) {
        setNavVisible(false);
      } else {
        setNavVisible(true);
      }
      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdown menu on Escape key
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  // Section Observer for active links
  useEffect(() => {
    const sections = ['home', 'tv', 'tiktok', 'zona-influencer', 'events', 'press'];
    const handleScroll = () => {
      const scrollY = window.scrollY + 200;
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollY >= top && scrollY < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setMenuOpen(false);
    const targetEl = document.querySelector(targetId);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navMenuItems = [
    { num: '01', label: 'Inicio', target: '#home' },
    { num: '02', label: 'En Vivo', target: '#tv' },
    { num: '03', label: 'TikTok', target: '#tiktok' },
    { num: '04', label: 'Influencer', target: '#zona-influencer' },
    { num: '05', label: 'Eventos', target: '#events' },
  ];

  const influencerCards = [
    {
      id: 1,
      title: 'Alta Definición',
      subtitle: 'Sesión Beauty',
      category: 'Moda & Curvy',
      desc: 'Rutinas de belleza exclusiva y estilismos contemporáneos en Madrid y Milán.',
      img: '/images/francesca-1.jpg',
    },
    {
      id: 2,
      title: 'Vanguardia Urbana',
      subtitle: 'Editorial Exclusivo',
      category: 'Lifestyle',
      desc: 'Tendencias urbanas europeas presentadas con elegancia natural y fuerza visual.',
      img: '/images/francesca-2.jpg',
    },
    {
      id: 3,
      title: 'Colección Exclusiva',
      subtitle: 'Gorro Ruso & Cromo',
      category: 'Haute Couture',
      desc: 'Iconografía visual de Francesca Chiri para la campaña oficial Thiago VSC.',
      img: '/images/francesca-3.jpg',
    },
  ];

  const shokoEvents = [
    { 
      date: '12 Oct', 
      title: 'Shakira · Despedida', 
      venue: 'Estadio Iberdrola Music', 
      badge: 'Gira Mundial',
      url: 'https://www.ticketmaster.es/event/shakira-las-mujeres-ya-no-lloran-gran-despedida-con-amigos-entradas/2065667696', 
      img: '/images/events/shakira.webp' 
    },
    { 
      date: '31 Oct', 
      title: 'PerreoLab x Halloween', 
      venue: 'Las Ventas Bullring', 
      badge: 'Halloween',
      url: 'https://perreolab.lema.club/#events/perreolab-x-halloween-las-ventas-31-10-2026-QDH0', 
      img: '/images/events/perreolab.webp' 
    },
    { 
      date: '13 Dic', 
      title: 'Jay Wheeler · LVF Tour', 
      venue: 'Movistar Arena', 
      badge: 'World Tour',
      url: 'https://www.movistararena.es/programacion/evento/jay-wheeler-la-voz-favorita-world-tour/13-12-2026/20:30', 
      img: '/images/events/jay-wheeler.png' 
    },
    { 
      date: '10 Dic', 
      title: 'Jowell & Randy · 3D', 
      venue: 'Movistar Arena', 
      badge: '3D Experience',
      url: 'https://www.movistararena.es/programacion/evento/jowell-y-randy-3d', 
      img: '/images/events/jowell-randy.png' 
    },
    { 
      date: '31 Oct', 
      title: 'Halloween en VG', 
      venue: 'Teatro Eslava // Madrid', 
      badge: 'Fever Special',
      url: 'https://feverup.com/m/787357', 
      img: '/images/events/halloween-vg.jpg' 
    },
    { 
      date: '31 Oct', 
      title: 'Hallowfest 2026', 
      venue: 'FABRIK // Madrid', 
      badge: 'Macro Festival',
      url: 'https://feverup.com/m/664041', 
      img: '/images/events/hallowfest-fabrik.png' 
    },
  ];

  return (
    <ReactLenis root options={{ lerp: 0.08, smoothWheel: true }}>
      <LenisScrollTriggerSync />
      
      {/* Morphing color plano dinámico de fondo del body */}
      <SectionColorMorph />

      <div className="relative min-h-screen bg-[var(--bg-current)] text-[var(--berry)] antialiased transition-colors duration-400">
        
        {/* PRELOADER ESTILO SAMU CLIMA (FONTS SCRAMBLE + ROSA DEGRADÉ) */}
        <SamuClimaPreloader />

        {/* EDITORIAL MAGNET CURSOR */}
        <CustomCursor />

        {/* ==========================================
            2. NAVBAR (CSS Grid auto 1fr auto, cristal Apple, sin MUTE ni RADIO)
        ========================================== */}
        <nav 
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl px-6 py-2.5 rounded-full border-b border-[var(--line)] shadow-luxury transition-transform duration-300 select-none ${
            navVisible ? 'translate-y-0' : '-translate-y-[150%]'
          } grid grid-cols-[auto_1fr_auto] items-center`}
          style={{
            background: 'color-mix(in srgb, var(--petal) 65%, transparent)',
            backdropFilter: 'saturate(180%) blur(20px)',
            WebkitBackdropFilter: 'saturate(180%) blur(20px)',
          }}
        >
          {/* Columna 1: El logo con altura de 22px sin solaparse */}
          <div className="flex items-center">
            <a
              href="#home"
              onClick={(e) => handleNavClick(e, '#home')}
              className="h-[22px] flex items-center gap-2 text-[var(--berry)] hover:text-[var(--brand)] transition-colors cursor-pointer group"
            >
              <span className="font-bodoni font-normal text-xl leading-none tracking-tight">THIAGO</span>
              <ButterflyIcon size={12} color="#E0457B" strokeWidth={1.5} className="group-hover:rotate-12 transition-transform duration-300" />
              <span className="font-bodoni italic text-xl leading-none text-[var(--brand)]">Vsc</span>
            </a>
          </div>

          {/* Columna 2: Los links centrados (Inicio, En Vivo, TikTok, Influencer, Eventos) con gap de 32px */}
          <div className="justify-self-center hidden min-[1100px]:flex items-center gap-8 font-satoshi font-medium text-[13px] tracking-[0.04em] text-[var(--berry)] whitespace-nowrap">
            <a
              href="#home"
              onClick={(e) => handleNavClick(e, '#home')}
              className={`relative py-1 transition-colors cursor-pointer ${
                activeSection === 'home' ? 'text-[var(--brand)] after:absolute after:bottom-0 after:inset-x-0 after:h-[1.5px] after:bg-[var(--brand)]' : 'hover:text-[var(--brand)]'
              }`}
            >
              Inicio
            </a>
            <a
              href="#tv"
              onClick={(e) => handleNavClick(e, '#tv')}
              className={`relative py-1 transition-colors cursor-pointer ${
                activeSection === 'tv' ? 'text-[var(--brand)] after:absolute after:bottom-0 after:inset-x-0 after:h-[1.5px] after:bg-[var(--brand)]' : 'hover:text-[var(--brand)]'
              }`}
            >
              En Vivo
            </a>
            <a
              href="#tiktok"
              onClick={(e) => handleNavClick(e, '#tiktok')}
              className={`relative py-1 transition-colors cursor-pointer ${
                activeSection === 'tiktok' ? 'text-[var(--brand)] after:absolute after:bottom-0 after:inset-x-0 after:h-[1.5px] after:bg-[var(--brand)]' : 'hover:text-[var(--brand)]'
              }`}
            >
              TikTok
            </a>
            <a
              href="#zona-influencer"
              onClick={(e) => handleNavClick(e, '#zona-influencer')}
              className={`relative py-1 transition-colors cursor-pointer ${
                activeSection === 'zona-influencer' ? 'text-[var(--brand)] after:absolute after:bottom-0 after:inset-x-0 after:h-[1.5px] after:bg-[var(--brand)]' : 'hover:text-[var(--brand)]'
              }`}
            >
              Influencer
            </a>
            <a
              href="#events"
              onClick={(e) => handleNavClick(e, '#events')}
              className={`relative py-1 transition-colors cursor-pointer ${
                activeSection === 'events' ? 'text-[var(--brand)] after:absolute after:bottom-0 after:inset-x-0 after:h-[1.5px] after:bg-[var(--brand)]' : 'hover:text-[var(--brand)]'
              }`}
            >
              Eventos
            </a>
          </div>

          {/* Columna 3: El botón de modo oscuro (círculo 32px) y el botón 'Menú' (píldora 32px) */}
          <div className="justify-self-end flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full flex items-center justify-center">
              <ThemeToggle />
            </div>

            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-label="Abrir menú de navegación"
              className="h-8 px-4 rounded-full border border-[var(--line)] bg-[var(--surface)] text-[var(--berry)] hover:text-[var(--brand)] font-satoshi text-xs tracking-[0.04em] font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <span>Menú</span>
            </button>
          </div>
        </nav>

        {/* Dropdown Menu estilo Apple (baja desde arriba, cierra con Esc o clic fuera) */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-20 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-md p-6 rounded-3xl border border-[var(--line)] shadow-2xl select-none"
              style={{
                background: 'color-mix(in srgb, var(--surface) 92%, transparent)',
                backdropFilter: 'saturate(180%) blur(24px)',
                WebkitBackdropFilter: 'saturate(180%) blur(24px)',
              }}
            >
              <div className="flex justify-between items-center pb-4 border-b border-[var(--line)] mb-4">
                <span className="font-satoshi text-xs uppercase tracking-[0.2em] text-[var(--berry)]/70">
                  Navegación
                </span>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[var(--berry)] hover:text-[var(--brand)] transition-colors"
                  aria-label="Cerrar menú"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-col gap-3.5">
                {navMenuItems.map((item) => (
                  <a
                    key={item.num}
                    href={item.target}
                    onClick={(e) => handleNavClick(e, item.target)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[var(--petal)] text-[var(--berry)] hover:text-[var(--brand)] transition-colors font-satoshi text-base font-medium"
                  >
                    <span>{item.label}</span>
                    <span className="text-xs font-mono text-[var(--brand)] opacity-80">
                      {item.num}
                    </span>
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ==========================================
            1. HERO VIDEO (Sin filtros, sin tintes, color original)
        ========================================== */}
        <div id="home">
          <HeroVideo onOpenRadio={() => setRadioModalOpen(true)} />
        </div>

        {/* ==========================================
            3. MARQUEE DE ARRIBA (Satoshi 500 mayúsculas, 56px de alto, hacia la izquierda)
        ========================================== */}
        <Marquee
          id="marquee-top"
          direction="left"
          speed={1.1}
          items={[
            'EMISIÓN CONTINUA 24/7',
            'LIVE 24/7',
            'MÚSICA URBANA & VANGUARDIA',
            'HALL OF FAME',
            'SESIONES EXCLUSIVAS',
            'PLATAFORMA OFICIAL THIAGO VSC',
          ]}
          bgClassName="bg-[#E0457B] text-[#FFE9D6]"
        />

        {/* ==========================================
            5. TV ONLINE (Fondo --blush #F8C8D8, un solo bloque alineado)
        ========================================== */}
        <TVOnlinePlayer />

        {/* ==========================================
            6. TIKTOK FEED (Fondo --brand #E0457B, tarjetas rectas con borde champán)
        ========================================== */}
        <ViralSlider />

        {/* ==========================================
            8. ZONA INFLUENCER (Fondo --petal #FDE4EC, centrado vertical)
        ========================================== */}
        <section
          id="zona-influencer"
          className="w-full bg-[var(--petal)] text-[var(--berry)] relative overflow-hidden py-20 sm:py-28 md:py-36 px-6 sm:px-10 md:px-14 select-none border-b border-[var(--line)]"
        >
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">
            {/* Columnas 1-6: Texto Editorial alineado verticalmente al centro */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 font-satoshi text-[12px] font-medium tracking-[0.28em] uppercase text-[var(--berry)] mb-3">
                <ButterflyIcon size={14} color="#E0457B" strokeWidth={1.5} />
                <span>03 · TALENTO</span>
              </div>

              <BicolorSectionTitle firstWord="Zona" secondWord="Influencer" className="mb-3" />

              {/* Subtítulo Nombre en Bodoni Moda + TikTok badge */}
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <h3 className="text-2xl sm:text-[28px] font-bodoni text-[var(--berry)] font-normal tracking-tight">
                  FRANCESCA CHIRI
                </h3>
                <a
                  href="https://www.tiktok.com/@chiri_francesca"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-satoshi text-xs bg-[var(--brand)] hover:opacity-90 text-[var(--champagne)] px-3.5 py-1.5 rounded-full font-medium shadow-sm transition-all inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>@chiri_francesca</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--champagne)] animate-pulse" />
                </a>
              </div>

              {/* 3 Métricas en fila */}
              <div className="grid grid-cols-3 gap-4 py-5 my-2 border-y border-[var(--line)]">
                <div>
                  <div className="font-bodoni text-2xl sm:text-3xl text-[var(--berry)] font-normal leading-tight">
                    1.8M+
                  </div>
                  <div className="font-satoshi text-[11px] text-[var(--berry)]/70 uppercase tracking-wider mt-1">
                    Audiencia activa
                  </div>
                </div>
                <div>
                  <div className="font-bodoni text-2xl sm:text-3xl text-[var(--berry)] font-normal leading-tight">
                    94%
                  </div>
                  <div className="font-satoshi text-[11px] text-[var(--berry)]/70 uppercase tracking-wider mt-1">
                    Engagement femenino
                  </div>
                </div>
                <div>
                  <div className="font-bodoni text-xl sm:text-2xl text-[var(--berry)] font-normal leading-tight">
                    Europa & Latam
                  </div>
                  <div className="font-satoshi text-[11px] text-[var(--berry)]/70 uppercase tracking-wider mt-1">
                    Alcance global
                  </div>
                </div>
              </div>

              {/* Biografía concisa */}
              <p className="font-jost text-sm sm:text-base leading-relaxed text-[var(--berry)]/85 max-w-lg my-6">
                Referente indiscutible del lifestyle y la moda curvy europea, Francesca Chiri conecta con millones de seguidores a través de rutinas de belleza, estilo vanguardista y una autenticidad magnética.
              </p>

              {/* Botón Descubrir a Francesca */}
              <div>
                <a
                  href="https://linktr.ee/chirifrancesca"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 bg-[var(--brand)] hover:opacity-90 text-[var(--champagne)] font-satoshi font-medium px-8 py-3.5 text-xs tracking-[0.2em] rounded-full transition-all shadow-luxury cursor-pointer uppercase"
                >
                  <span>Descubrir a Francesca</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
                </a>
              </div>
            </div>

            {/* Columnas 7-12: Montaje editorial - Las cartas no pueden salirse del contenedor */}
            <div className="lg:col-span-6 flex items-center justify-center relative min-h-[460px] sm:min-h-[520px] overflow-visible" data-cursor="Ver">
              <div className="relative w-full max-w-[380px] sm:max-w-[420px] aspect-[4/5] flex items-center justify-center">
                {influencerCards.map((card, idx) => {
                  const isHovered = hoveredGalleryCard === idx;
                  const isAnotherHovered = hoveredGalleryCard !== null && !isHovered;

                  const baseRotations = [-4, 2, 6];
                  const baseRotation = baseRotations[idx] || 0;
                  const baseTranslateX = (idx - 1) * 20;

                  return (
                    <div
                      key={card.id}
                      onMouseEnter={() => setHoveredGalleryCard(idx)}
                      onMouseLeave={() => setHoveredGalleryCard(null)}
                      onClick={() => setLightboxCard(card)}
                      style={{
                        transform: isHovered
                          ? 'translateY(-14px) rotate(0deg) scale(1.04)'
                          : `translateX(${baseTranslateX}px) rotate(${baseRotation}deg)`,
                        zIndex: isHovered ? 40 : 10 + idx,
                        opacity: isAnotherHovered ? 0.65 : 1,
                        transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
                      }}
                      className="absolute w-[240px] sm:w-[290px] md:w-[320px] aspect-[4/5] rounded-[20px] border-[5px] border-white shadow-luxury overflow-hidden cursor-pointer select-none bg-[var(--surface)]"
                    >
                      <img
                        src={card.img}
                        alt={card.title}
                        className="w-full h-full object-cover"
                      />

                      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center z-10">
                        <span className="px-3 py-1 rounded-full text-[10px] font-satoshi font-medium uppercase text-[var(--champagne)] bg-[var(--brand)] shadow-sm">
                          {card.category}
                        </span>
                        <span className="text-[10px] font-satoshi font-medium text-[var(--berry)] bg-[var(--surface)]/95 px-2.5 py-1 rounded-full shadow-sm">
                          Ver detalle
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================
            7. PRÓXIMOS EVENTOS (Fondo --rose #F29BB8, grid repeat(6, 1fr) sin hueco)
        ========================================== */}
        <section
          id="events"
          className="w-full bg-[var(--rose)] text-[var(--berry)] py-20 sm:py-28 md:py-36 px-6 sm:px-10 relative overflow-hidden select-none border-b border-[var(--line)]"
        >
          <div className="w-full max-w-7xl mx-auto">
            {/* Header con título y 'Ver todos' alineado a la derecha en la misma línea base */}
            <div className="w-full flex items-baseline justify-between mb-10 sm:mb-14">
              <div>
                <div className="inline-flex items-center gap-2 font-satoshi text-[12px] font-medium tracking-[0.28em] uppercase text-[var(--berry)] mb-3">
                  <ButterflyIcon size={14} color="#E0457B" strokeWidth={1.5} />
                  <span>04 · AGENDA</span>
                </div>
                <BicolorSectionTitle firstWord="Próximos" secondWord="Eventos" />
              </div>

              <div className="flex flex-col items-end gap-1">
                <a
                  href="https://shokomadrid.com/es/collections/eventos-shoko-madrid"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-satoshi font-medium text-[var(--brand)] hover:underline underline-offset-4 tracking-[0.15em] uppercase transition-all cursor-pointer whitespace-nowrap"
                >
                  <span>Ver cartelera oficial →</span>
                </a>
                <span className="text-[11px] font-satoshi text-[var(--berry)]/70 uppercase tracking-wider hidden sm:inline">
                  Madrid // Entradas oficiales
                </span>
              </div>
            </div>

            {/* Grid 6 columnas completas en desktop, 3 en tablet */}
            <div className="w-full hidden md:grid md:grid-cols-3 lg:grid-cols-6 gap-4">
              {shokoEvents.map((event, i) => (
                <div
                  key={i}
                  className="bg-[var(--surface)] p-2.5 rounded-[22px] border border-[var(--line)] shadow-luxury transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between group cursor-pointer"
                  data-cursor="Ver"
                >
                  {/* Poster Container con duotone rosa */}
                  <div className="relative w-full aspect-[4/5] rounded-[16px] overflow-hidden bg-[var(--petal)]">
                    <img
                      src={event.img}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      alt={event.title}
                    />
                    <div className="absolute inset-0 bg-[#E0457B]/20 mix-blend-multiply opacity-100 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none" />
                    <div className="absolute top-2.5 right-2.5 z-10">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-satoshi font-medium bg-[var(--brand)] text-[var(--champagne)] shadow-sm">
                        {event.badge}
                      </span>
                    </div>
                  </div>

                  {/* Info Deck */}
                  <div className="pt-3 pb-1 flex flex-col flex-grow justify-between">
                    <div>
                      <div className="font-bodoni text-[20px] text-[var(--berry)] font-normal leading-tight">
                        {event.date}
                      </div>
                      <h4 className="font-satoshi text-[13px] font-medium text-[var(--berry)] uppercase tracking-wider truncate mt-1">
                        {event.title}
                      </h4>
                      <span className="font-satoshi text-[11px] text-[var(--berry)]/65 block mt-0.5 uppercase tracking-wide truncate">
                        {event.venue}
                      </span>
                    </div>

                    <a
                      href={event.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3.5 w-full py-2.5 rounded-full border border-[var(--brand)] text-[var(--brand)] hover:bg-[var(--brand)] hover:text-[var(--champagne)] font-satoshi text-[11px] font-medium tracking-[0.18em] text-center block transition-all shadow-sm uppercase"
                    >
                      Comprar entradas
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Snap Slider */}
            <div className="w-full md:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4">
              {shokoEvents.map((event, i) => (
                <div
                  key={i}
                  className="min-w-[260px] snap-center bg-[var(--surface)] p-2.5 rounded-[22px] border border-[var(--line)] shadow-luxury flex flex-col justify-between"
                >
                  <div className="relative w-full aspect-[4/5] rounded-[16px] overflow-hidden bg-[var(--petal)]">
                    <img
                      src={event.img}
                      className="w-full h-full object-cover"
                      alt={event.title}
                    />
                    <div className="absolute top-2.5 right-2.5 z-10">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-satoshi font-medium bg-[var(--brand)] text-[var(--champagne)] shadow-sm">
                        {event.badge}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 pb-1 flex flex-col flex-grow justify-between">
                    <div>
                      <div className="font-bodoni text-[20px] text-[var(--berry)] font-normal leading-tight">
                        {event.date}
                      </div>
                      <h4 className="font-satoshi text-[13px] font-medium text-[var(--berry)] uppercase tracking-wider truncate mt-1">
                        {event.title}
                      </h4>
                      <span className="font-satoshi text-[11px] text-[var(--berry)]/65 block mt-0.5 uppercase tracking-wide truncate">
                        {event.venue}
                      </span>
                    </div>

                    <a
                      href={event.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3.5 w-full py-2.5 rounded-full border border-[var(--brand)] text-[var(--brand)] bg-transparent font-satoshi text-[11px] font-medium tracking-[0.18em] text-center block shadow-sm uppercase"
                    >
                      Comprar entradas
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==========================================
            3. MARQUEE DE PRENSA (Hacia la derecha, logos al 60% -> 100% hover)
        ========================================== */}
        <Marquee
          id="press"
          direction="right"
          speed={0.9}
          isPress
          items={[
            'VOGUE',
            'VANITY FAIR',
            'ROLLING STONE',
            'GLAMOUR',
            'FORBES',
            'BILLBOARD',
          ]}
          bgClassName="bg-[var(--blush)] text-[var(--berry)]"
        />

        {/* ==========================================
            8. FOOTER (Fondo --brand #E0457B, THIAGO gigante en Bodoni blanco)
        ========================================== */}
        <footer
          id="footer"
          className="bg-[#E0457B] text-[#FFE9D6] pt-20 pb-16 flex flex-col items-center relative overflow-hidden select-none"
        >
          <div className="w-full flex justify-center items-center overflow-hidden px-4">
            <h2 className="font-bodoni font-normal tracking-tight text-[clamp(4.5rem,15vw,14rem)] leading-none text-white select-none whitespace-nowrap text-center">
              {'THIAGO'.split('').map((letter, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  className="inline-block"
                >
                  {letter}
                </motion.span>
              ))}
            </h2>
          </div>

          {/* Social Links */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-8 sm:gap-12 font-satoshi text-xs sm:text-[13px] font-medium uppercase tracking-[0.2em] text-[#FFE9D6]">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="relative group py-1">
              <span>Instagram</span>
              <span className="absolute bottom-0 left-0 w-0 group-hover:w-full h-[1px] bg-[#FFE9D6] transition-all duration-300" />
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="relative group py-1">
              <span>TikTok</span>
              <span className="absolute bottom-0 left-0 w-0 group-hover:w-full h-[1px] bg-[#FFE9D6] transition-all duration-300" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="relative group py-1">
              <span>YouTube</span>
              <span className="absolute bottom-0 left-0 w-0 group-hover:w-full h-[1px] bg-[#FFE9D6] transition-all duration-300" />
            </a>
            <a href="https://spotify.com" target="_blank" rel="noopener noreferrer" className="relative group py-1">
              <span>Spotify</span>
              <span className="absolute bottom-0 left-0 w-0 group-hover:w-full h-[1px] bg-[#FFE9D6] transition-all duration-300" />
            </a>
            <a href="mailto:contacto@thiagovsc.com" className="relative group py-1">
              <span>Contacto</span>
              <span className="absolute bottom-0 left-0 w-0 group-hover:w-full h-[1px] bg-[#FFE9D6] transition-all duration-300" />
            </a>
          </div>

          {/* Sello de la firma */}
          <div className="mt-12 mb-3">
            <ButterflyIcon size={22} color="#FFE9D6" strokeWidth={1.5} />
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 font-satoshi text-[11px] uppercase tracking-wider text-[#FFE9D6]/80">
            <a href="/aviso-legal" className="hover:text-white transition-colors underline-offset-4 hover:underline">
              Aviso Legal
            </a>
            <span>•</span>
            <a href="/politica-de-privacidad" className="hover:text-white transition-colors underline-offset-4 hover:underline">
              Política de Privacidad
            </a>
            <span>•</span>
            <a href="/politica-de-cookies" className="hover:text-white transition-colors underline-offset-4 hover:underline">
              Política de Cookies
            </a>
            <span>•</span>
            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('open-cookie-settings'));
                }
              }}
              className="hover:text-white transition-colors underline-offset-4 hover:underline cursor-pointer font-satoshi uppercase"
            >
              Cookies
            </button>
          </div>

          <div className="mt-4 text-[11px] font-satoshi text-[#FFE9D6]/60 tracking-widest uppercase">
            © 2026 THIAGO VSC • ALL RIGHTS RESERVED
          </div>
        </footer>

        {/* Full-size Lightbox Modal */}
        {lightboxCard && (
          <div
            className="fixed inset-0 z-[200] flex flex-col justify-between p-4 sm:p-8 animate-in fade-in duration-200 select-none overflow-hidden"
            onClick={() => setLightboxCard(null)}
          >
            <div
              className="absolute inset-0 bg-cover bg-center scale-125 blur-3xl opacity-40 pointer-events-none"
              style={{ backgroundImage: `url(${lightboxCard.img})` }}
            />
            <div className="absolute inset-0 bg-[#2B0F1E]/80 backdrop-blur-xl pointer-events-none" />

            <div className="w-full max-w-5xl mx-auto flex justify-between items-center z-10 relative" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-3">
                <span className="px-4 py-1.5 rounded-full text-xs font-satoshi font-medium uppercase text-[var(--champagne)] bg-[var(--brand)] shadow-sm">
                  {lightboxCard.title}
                </span>
                <span className="hidden sm:inline-block text-xs font-satoshi text-[var(--champagne)] font-medium bg-[#3A1528]/60 px-3 py-1 rounded-full border border-[var(--line)]">
                  Francesca Chiri
                </span>
              </div>

              <button
                onClick={() => setLightboxCard(null)}
                className="px-5 py-2 rounded-full border border-[var(--line)] bg-[var(--surface)] hover:bg-[var(--brand)] hover:text-white text-[var(--berry)] text-xs font-satoshi font-medium tracking-widest uppercase transition-all flex items-center gap-2 shadow-luxury cursor-pointer"
              >
                <span>Cerrar</span>
                <span className="text-sm">✕</span>
              </button>
            </div>

            <div className="w-full max-w-5xl mx-auto my-auto flex items-center justify-center relative p-2 z-10" onClick={(e) => e.stopPropagation()}>
              <img
                src={lightboxCard.img}
                alt={lightboxCard.title}
                className="max-h-[78vh] max-w-[90vw] object-contain rounded-2xl border-[6px] border-white shadow-luxury animate-in zoom-in-95 duration-200"
              />
            </div>

            <div className="w-full max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 text-xs font-satoshi text-[#FFE9D6] z-10 pt-2 relative" onClick={(e) => e.stopPropagation()}>
              <span className="tracking-wider font-medium">FRANCESCA CHIRI // ZONA INFLUENCER</span>
              <div className="flex gap-2">
                {influencerCards.map((c, i) => (
                  <button
                    key={c.id}
                    onClick={() => setLightboxCard(c)}
                    className={`px-3.5 py-1.5 rounded-full transition-all text-[11px] font-medium cursor-pointer ${
                      lightboxCard.id === c.id
                        ? 'bg-[var(--brand)] text-[var(--champagne)] shadow-sm'
                        : 'bg-[#3A1528]/60 text-[var(--champagne)] hover:bg-[#3A1528]/80 border border-[var(--line)]'
                    }`}
                  >
                    Foto 0{i + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Standalone Tuner FM Radio Modal */}
        {radioModalOpen && (
          <div
            className="fixed inset-0 z-[250] flex items-center justify-center p-3 sm:p-6 md:p-10 animate-in fade-in duration-200 select-none"
            onClick={() => setRadioModalOpen(false)}
          >
            <div className="absolute inset-0 bg-[#2B0F1E]/80 backdrop-blur-2xl" />

            <div
              className="relative w-full max-w-5xl h-[88vh] max-h-[780px] bg-[#FFF4F7] rounded-3xl overflow-hidden border border-[#E0457B]/35 shadow-[0_30px_90px_rgba(224,69,123,0.35)] z-10 animate-in zoom-in-95 duration-200 flex flex-col ring-1 ring-[#E0457B]/20"
              onClick={(e) => e.stopPropagation()}
            >
              <CoverFlowRadio onClose={() => setRadioModalOpen(false)} />
            </div>
          </div>
        )}

        {/* Cookie Consent Banner */}
        <CookieConsent />
      </div>
    </ReactLenis>
  );
}
