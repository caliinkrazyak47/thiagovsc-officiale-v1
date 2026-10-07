'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ReactLenis } from '@studio-freight/react-lenis';
import { DigitalClock } from '@/components/DigitalClock';
import { TVOnlinePlayer } from '@/components/TVOnlinePlayer/TVOnlinePlayer';
import { ViralSlider } from '@/components/ViralSlider/ViralSlider';
import { CoverFlowRadio } from '@/components/CoverFlowRadio/CoverFlowRadio';
import { CookieConsent } from '@/components/CookieConsent';
import { CustomCursor } from '@/components/CustomCursor';
import { InitialLoader } from '@/components/InitialLoader';
import { ButterflyIcon } from '@/components/ButterflyIcon';

// ==========================================
// HERO VIDEO COMPONENT (Sin logo duplicado sobre el vídeo)
// ==========================================
interface HeroVideoProps {
  onOpenRadio: () => void;
}

const HeroVideo: React.FC<HeroVideoProps> = ({ onOpenRadio }) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.play().catch(() => {
      // Autoplay fallback
    });
  }, []);

  // Split title animation words
  const titleWords = [
    { text: "El", italic: false },
    { text: "ritmo", italic: false },
    { text: "de", italic: false },
    { text: "tu", italic: false },
    { text: "mundo", italic: true },
  ];

  return (
    <div className="relative w-full overflow-hidden select-none">
      {/* 16:9 Responsive Video Viewport */}
      <section className="relative w-full aspect-video min-h-[560px] sm:min-h-[640px] md:min-h-[720px] lg:min-h-[820px] max-h-[1080px] overflow-hidden bg-[#FFF6F9]">
        
        {/* Background Fallback Poster */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
          style={{ 
            backgroundImage: "url('/images/francesca-1.jpg')",
            opacity: isVideoLoaded ? 0 : 1 
          }}
        />

        {/* Hero Background Video (El propio metraje ya contiene el logotipo original) */}
        <video
          ref={videoRef}
          src="/videos/hero.mp4"
          poster="/images/francesca-1.jpg"
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={() => setIsVideoLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            isVideoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Hero Vignette / Ambient tint */}
        <div className="absolute inset-0 bg-[rgba(176,51,102,0.18)] mix-blend-multiply pointer-events-none" />

        {/* Upper Hero Stage: Typography + Live Radio Trigger */}
        <div className="absolute inset-0 z-20 flex flex-col justify-start p-6 sm:p-10 md:p-14 lg:p-20 pointer-events-none">
          {/* Top spacer below floating navbar */}
          <div className="w-full h-14 sm:h-20" />

          <div className="w-full flex flex-col md:flex-row items-start justify-between gap-6 pt-2 sm:pt-4">
            
            {/* Left Typography: "El ritmo de tu mundo" en Bodoni Moda blanco, 'mundo' en itálica, revelado desde abajo */}
            <div className="flex flex-col max-w-2xl overflow-hidden">
              {/* Eyebrow con mariposa */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="inline-flex items-center gap-2 mb-3 font-jost text-xs tracking-[0.3em] uppercase text-white drop-shadow-sm"
              >
                <ButterflyIcon size={14} color="#FFFFFF" strokeWidth={1.5} />
                <span>00  Plataforma oficial</span>
              </motion.div>

              <h1 className="font-bodoni text-white text-[clamp(2.5rem,5.2vw,4.75rem)] font-normal leading-[1.02] tracking-[-0.02em] drop-shadow-md flex flex-wrap gap-x-3.5">
                {titleWords.map((word, i) => (
                  <span key={i} className="inline-block overflow-hidden py-1">
                    <motion.span
                      initial={{ y: "115%", opacity: 0 }}
                      animate={{ y: "0%", opacity: 1 }}
                      transition={{ 
                        duration: 1.1, 
                        delay: 0.15 + i * 0.08, 
                        ease: [0.22, 1, 0.36, 1] 
                      }}
                      className={`inline-block ${word.italic ? 'italic font-normal' : ''}`}
                    >
                      {word.text}
                    </motion.span>
                  </span>
                ))}
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="mt-3 font-jost text-xs sm:text-sm tracking-[0.18em] text-white/90 uppercase drop-shadow-sm font-normal"
              >
                Emisión ininterrumpida 24/7 // Sonido de vanguardia
              </motion.p>
            </div>

            {/* Right: Botón "EN VIVO RADIO" en --rosa sólido con mariposa y punto blanco parpadeante */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-auto self-start mt-2 md:mt-4"
            >
              <button
                type="button"
                onClick={onOpenRadio}
                className="inline-flex items-center gap-3 px-6 sm:px-7 py-3 rounded-full bg-[#DE4176] hover:bg-[#c22e61] text-white transition-all shadow-luxury cursor-pointer btn-luxury"
                title="Sintonizar Radio Live"
                data-cursor="Play"
              >
                <ButterflyIcon size={14} color="#FFFFFF" strokeWidth={1.5} />
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span className="font-jost text-xs font-medium tracking-[0.2em] uppercase">EN VIVO RADIO</span>
              </button>
            </motion.div>

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
  const [activeSection, setActiveSection] = useState('home');
  const [lightboxCard, setLightboxCard] = useState<{ id: number; img: string; title: string; category: string } | null>(null);

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
    setActiveSection(targetId.replace('#', ''));
    const elem = document.querySelector(targetId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const shokoEvents = [
    {
      title: "PURO PERREO",
      url: "https://shokomadrid.com/es/products/puro-perreo-sunday-30-8-2026",
      img: "/images/cover1.jpg",
      date: "04 Oct"
    },
    {
      title: "SWAG CITY",
      url: "https://shokomadrid.com/es/products/swag-city-thursday-1-10-2026",
      img: "/images/cover2.jpg",
      date: "01 Oct"
    },
    {
      title: "RESIDENCIA",
      url: "https://shokomadrid.com/es/products/residencia-de-los-domingos-sunday-4-10-2026",
      img: "/images/cover3.jpg",
      date: "02 Oct"
    },
    {
      title: "PURE SHOKO",
      url: "https://shokomadrid.com/es/products/pure-shoko-friday-2-10-2026",
      img: "/images/cover4.jpg",
      date: "03 Oct"
    },
    {
      title: "HALLOWEEN",
      url: "https://shokomadrid.com/es/products/halloween-edition-friday-30-10-2026",
      img: "/images/cover5.jpg",
      date: "08 Oct"
    },
    {
      title: "TARDEO",
      url: "https://shokomadrid.com/es/products/tardeo-tropical-saturday-3-10-2026",
      img: "/images/francesca-4.jpg",
      date: "09 Oct"
    }
  ];

  const influencerCards = [
    {
      id: 0,
      img: "/images/francesca-1.jpg",
      title: "Street Chic // Editorial",
      category: "Moda & Estilo",
      rotation: -6,
      translateX: -30,
    },
    {
      id: 1,
      img: "/images/francesca-2.jpg",
      title: "Pink Bistro // Lookbook",
      category: "Beauty & Lifestyle",
      rotation: 3,
      translateX: 0,
    },
    {
      id: 2,
      img: "/images/francesca-3.jpg",
      title: "Winter Glam // Alta Montaña",
      category: "Colección Exclusiva",
      rotation: 8,
      translateX: 30,
    },
  ];

  const navMenuItems = [
    { num: "01", label: "Inicio", target: "#home" },
    { num: "02", label: "TV Online", target: "#tv" },
    { num: "03", label: "TikTok Feed", target: "#tiktok" },
    { num: "04", label: "Zona Influencer", target: "#zona-influencer" },
    { num: "05", label: "Próximos Eventos", target: "#events" },
    { num: "06", label: "Contacto", target: "#contact" },
  ];

  // Press logos for press marquee
  const pressLogos = [
    "VOGUE",
    "VANITY FAIR",
    "ROLLING STONE",
    "GLAMOUR",
    "FORBES",
    "BILLBOARD",
    "VOGUE",
    "VANITY FAIR",
    "ROLLING STONE",
    "GLAMOUR",
    "FORBES",
    "BILLBOARD",
  ];

  return (
    <ReactLenis root options={{ lerp: 0.08, smoothWheel: true }}>
      <div id="home" className="min-h-screen bg-white text-[#B03366] font-jost overflow-hidden relative selection:bg-[#DE4176] selection:text-white">

        {/* 1.5S LUXURY CURTAIN INTRO LOADER */}
        <InitialLoader />

        {/* EDITORIAL MAGNET CURSOR */}
        <CustomCursor />

        {/* ==========================================
            FLOATING NAVBAR (Píldora en --perla al 85% con backdrop-blur-xl, borde 1px en --nacar)
        ========================================== */}
        <nav className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl px-5 sm:px-7 py-3 rounded-full bg-white/85 backdrop-blur-xl border border-[rgba(224,69,123,0.14)] shadow-luxury flex items-center justify-between select-none">
          
          {/* Logo THIAGO VSC con Mariposa de Línea */}
          <div className="flex items-center gap-3">
            <a 
              href="#home" 
              onClick={(e) => handleNavClick(e, '#home')}
              className="flex items-center gap-2 tracking-tight text-[#B03366] hover:text-[#DE4176] transition-colors cursor-pointer group"
            >
              <span className="font-bodoni font-normal text-xl tracking-tight">THIAGO</span>
              <ButterflyIcon size={14} color="#DE4176" strokeWidth={1.5} className="group-hover:rotate-12 transition-transform duration-300" />
              <span className="font-bodoni italic text-xl leading-none text-[#DE4176]">Vsc</span>
            </a>
          </div>

          {/* Nav Links: text --frambuesa, activo con subrayado en --rosa */}
          <div className="hidden md:flex items-center gap-7 lg:gap-8 font-jost text-xs uppercase tracking-[0.18em] font-medium text-[#B03366]">
            <a 
              href="#home" 
              onClick={(e) => handleNavClick(e, '#home')}
              className={`relative transition-colors py-1 cursor-pointer ${
                activeSection === 'home' ? 'text-[#DE4176] after:absolute after:bottom-0 after:inset-x-0 after:h-[1.5px] after:bg-[#DE4176]' : 'hover:text-[#DE4176]'
              }`}
            >
              Inicio
            </a>
            <a 
              href="#tv" 
              onClick={(e) => handleNavClick(e, '#tv')}
              className={`relative transition-colors py-1 cursor-pointer ${
                activeSection === 'tv' ? 'text-[#DE4176] after:absolute after:bottom-0 after:inset-x-0 after:h-[1.5px] after:bg-[#DE4176]' : 'hover:text-[#DE4176]'
              }`}
            >
              TV Online
            </a>
            <a 
              href="#tiktok" 
              onClick={(e) => handleNavClick(e, '#tiktok')}
              className={`relative transition-colors py-1 cursor-pointer ${
                activeSection === 'tiktok' ? 'text-[#DE4176] after:absolute after:bottom-0 after:inset-x-0 after:h-[1.5px] after:bg-[#DE4176]' : 'hover:text-[#DE4176]'
              }`}
            >
              TikTok
            </a>
            <a 
              href="#zona-influencer" 
              onClick={(e) => handleNavClick(e, '#zona-influencer')}
              className={`relative transition-colors py-1 cursor-pointer ${
                activeSection === 'zona-influencer' ? 'text-[#DE4176] after:absolute after:bottom-0 after:inset-x-0 after:h-[1.5px] after:bg-[#DE4176]' : 'hover:text-[#DE4176]'
              }`}
            >
              Influencer
            </a>
            <a 
              href="#events" 
              onClick={(e) => handleNavClick(e, '#events')}
              className={`relative transition-colors py-1 cursor-pointer ${
                activeSection === 'events' ? 'text-[#DE4176] after:absolute after:bottom-0 after:inset-x-0 after:h-[1.5px] after:bg-[#DE4176]' : 'hover:text-[#DE4176]'
              }`}
            >
              Eventos
            </a>
          </div>

          {/* Right: Reloj Digital + Botón EN VIVO RADIO + Menú Móvil */}
          <div className="flex items-center gap-3 sm:gap-4">
            <DigitalClock className="hidden sm:inline-flex" />

            {/* Botón EN VIVO RADIO en --rosa sólido con mariposa y punto parpadeante */}
            <button 
              type="button"
              onClick={() => setRadioModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#DE4176] hover:bg-[#c22e61] text-white font-jost text-[11px] font-medium tracking-[0.18em] uppercase transition-all shadow-sm cursor-pointer btn-luxury"
              title="Sintonizar Radio Live"
              data-cursor="Play"
            >
              <ButterflyIcon size={12} color="#FFFFFF" strokeWidth={1.5} />
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span>Radio</span>
            </button>

            <button 
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menú"
              className="text-[#B03366] hover:text-[#DE4176] bg-[#FFF6F9] hover:bg-white w-9 h-9 rounded-full flex items-center justify-center transition-all border border-[rgba(224,69,123,0.18)] cursor-pointer btn-luxury"
            >
              <span className="font-medium text-sm">☰</span>
            </button>
          </div>
        </nav>

        {/* ==========================================
            FULLSCREEN EDITORIAL LUXURY MENU OVERLAY
        ========================================== */}
        {menuOpen && (
          <div 
            className="fixed inset-0 z-[100] bg-[#FFF6F9]/95 backdrop-blur-2xl flex flex-col justify-between p-6 md:p-14 animate-in fade-in duration-200 select-none text-[#B03366]"
            onClick={() => setMenuOpen(false)}
          >
            {/* Header inside Menu */}
            <div className="flex justify-between items-center w-full max-w-5xl mx-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-2">
                <span className="font-bodoni text-2xl text-[#B03366]">THIAGO</span>
                <ButterflyIcon size={16} color="#DE4176" />
                <span className="font-bodoni italic text-2xl text-[#DE4176]">Vsc</span>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="px-5 py-2 rounded-full border border-[rgba(224,69,123,0.2)] bg-white hover:bg-[#DE4176] hover:text-white text-[#B03366] text-xs font-jost font-medium tracking-widest uppercase transition-all flex items-center gap-2 cursor-pointer btn-luxury shadow-sm"
              >
                <span>Cerrar</span>
                <span className="text-sm">✕</span>
              </button>
            </div>

            {/* Menu Links */}
            <div className="w-full max-w-5xl mx-auto my-auto py-8 flex flex-col gap-3 md:gap-5" onClick={(e) => e.stopPropagation()}>
              {navMenuItems.map((item, idx) => (
                <a
                  key={idx}
                  href={item.target}
                  onClick={(e) => handleNavClick(e, item.target)}
                  className="group flex items-center gap-6 text-[#B03366] hover:text-[#DE4176] transition-all duration-300 py-3 border-b border-[rgba(224,69,123,0.12)]"
                >
                  <span className="font-jost text-sm text-[#B03366]/40 group-hover:text-[#DE4176]">
                    {item.num} /
                  </span>
                  <span className="text-3xl md:text-5xl lg:text-6xl font-bodoni font-normal tracking-tight group-hover:translate-x-3 transition-transform duration-300">
                    {item.label}
                  </span>
                </a>
              ))}
            </div>

            {/* Menu Footer */}
            <div className="w-full max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-jost text-[#B03366]/70 pt-6 border-t border-[rgba(224,69,123,0.12)]" onClick={(e) => e.stopPropagation()}>
              <div className="flex gap-6 uppercase tracking-wider">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#DE4176] transition-colors">Instagram</a>
                <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#DE4176] transition-colors">TikTok</a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#DE4176] transition-colors">YouTube</a>
                <a href="https://spotify.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#DE4176] transition-colors">Spotify</a>
              </div>
              <div className="tracking-widest uppercase">
                Edición Editorial // 2026
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            1. HERO SECTION (Imagen + Vídeo intactos, sin logo superpuesto)
        ========================================== */}
        <HeroVideo onOpenRadio={() => setRadioModalOpen(true)} />

        {/* ==========================================
            2. MARQUEE 1 (Fondo --rosa, texto blanco en Bodoni Moda itálica 26px, mariposa de línea como separador)
        ========================================== */}
        <section className="py-6 sm:py-7 bg-[#DE4176] overflow-hidden select-none">
          <div className="marquee-wrapper">
            <div className="marquee-content font-bodoni italic text-white text-[24px] sm:text-[26px] tracking-normal flex items-center gap-12 whitespace-nowrap">
              <span>Bienvenido a la plataforma oficial de Thiago VSC</span>
              <ButterflyIcon size={16} color="#FFFFFF" strokeWidth={1.5} />
              <span>Emisión continua en alta definición 24/7</span>
              <ButterflyIcon size={16} color="#FFFFFF" strokeWidth={1.5} />
              <span>Música urbana, sesiones exclusivas y momentos virales</span>
              <ButterflyIcon size={16} color="#FFFFFF" strokeWidth={1.5} />
              <span>Bienvenido a la plataforma oficial de Thiago VSC</span>
              <ButterflyIcon size={16} color="#FFFFFF" strokeWidth={1.5} />
              <span>Emisión continua en alta definición 24/7</span>
              <ButterflyIcon size={16} color="#FFFFFF" strokeWidth={1.5} />
            </div>
          </div>
        </section>

        {/* ==========================================
            3. TV ONLINE (Fondo --perla #FFFFFF)
        ========================================== */}
        <TVOnlinePlayer />

        {/* ==========================================
            4. TIKTOK FEED (Fondo --polvo #FBE3EC, pausa suave de color)
        ========================================== */}
        <ViralSlider />

        {/* ==========================================
            5. ZONA INFLUENCER (Fondo --porcelana #FFF6F9, sin texto CHIRI gigante)
        ========================================== */}
        <section id="zona-influencer" className="w-full bg-[#FFF6F9] text-[#B03366] relative overflow-hidden py-20 sm:py-28 md:py-36 px-6 sm:px-10 md:px-14 select-none border-b border-[rgba(224,69,123,0.14)]">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            
            {/* Columnas 1-6: Texto Editorial */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              <div className="editorial-eyebrow mb-4">
                <ButterflyIcon size={14} color="#DE4176" />
                <span>03  Talento</span>
              </div>
              
              <h2 className="editorial-title text-[#B03366] mb-2">
                Zona <span className="italic text-[#DE4176]">Influencer</span>
              </h2>

              {/* Subtítulo Nombre en Bodoni Moda 28px + TikTok badge */}
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <h3 className="text-2xl sm:text-[28px] font-bodoni text-[#B03366] font-normal tracking-tight">
                  FRANCESCA CHIRI
                </h3>
                <a
                  href="https://www.tiktok.com/@chiri_francesca"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-jost text-xs bg-[#DE4176] hover:bg-[#c22e61] text-white px-3.5 py-1.5 rounded-full font-medium shadow-sm transition-all inline-flex items-center gap-1.5 cursor-pointer btn-luxury"
                >
                  <span>@chiri_francesca</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                </a>
              </div>

              {/* 3 Métricas en fila con números grandes en Bodoni y etiquetas en Jost */}
              <div className="grid grid-cols-3 gap-4 py-5 my-2 border-y border-[rgba(224,69,123,0.14)]">
                <div>
                  <div className="font-bodoni text-2xl sm:text-3xl text-[#B03366] font-normal leading-tight">
                    1.8M+
                  </div>
                  <div className="font-jost text-[11px] text-[#B03366]/70 uppercase tracking-wider mt-1">
                    Audiencia activa
                  </div>
                </div>
                <div>
                  <div className="font-bodoni text-2xl sm:text-3xl text-[#B03366] font-normal leading-tight">
                    94%
                  </div>
                  <div className="font-jost text-[11px] text-[#B03366]/70 uppercase tracking-wider mt-1">
                    Engagement femenino
                  </div>
                </div>
                <div>
                  <div className="font-bodoni text-xl sm:text-2xl text-[#B03366] font-normal leading-tight">
                    Europa & Latam
                  </div>
                  <div className="font-jost text-[11px] text-[#B03366]/70 uppercase tracking-wider mt-1">
                    Alcance global
                  </div>
                </div>
              </div>

              {/* Biografía concisa de 3 líneas */}
              <p className="editorial-text text-[#B03366] max-w-lg my-6">
                Referente indiscutible del lifestyle y la moda curvy europea, Francesca Chiri conecta con millones de seguidores a través de rutinas de belleza, estilo vanguardista y una autenticidad magnética.
              </p>

              {/* Botón Descubrir a Francesca en --rosa con flecha fina */}
              <div>
                <a 
                  href="https://linktr.ee/chirifrancesca"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 bg-[#DE4176] hover:bg-[#c22e61] text-white font-jost font-medium px-8 py-3.5 text-xs tracking-[0.2em] rounded-full transition-all shadow-luxury cursor-pointer btn-luxury uppercase"
                >
                  <span>Descubrir a Francesca</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
                </a>
              </div>
            </div>

            {/* Columnas 7-12: Montaje editorial tipo revista con fotos superpuestas y 3D tilt */}
            <div className="lg:col-span-6 flex items-center justify-center relative min-h-[460px] sm:min-h-[520px]" data-cursor="Ver">
              <div className="relative w-full max-w-[420px] aspect-[4/5] flex items-center justify-center">
                {influencerCards.map((card, idx) => {
                  const isHovered = hoveredGalleryCard === idx;
                  const isAnotherHovered = hoveredGalleryCard !== null && !isHovered;

                  const baseRotations = [-6, 3, 8];
                  const baseRotation = baseRotations[idx] || 0;
                  const baseTranslateX = (idx - 1) * 32;

                  return (
                    <div
                      key={card.id}
                      onMouseEnter={() => setHoveredGalleryCard(idx)}
                      onMouseLeave={() => setHoveredGalleryCard(null)}
                      onClick={() => setLightboxCard(card)}
                      style={{
                        transform: isHovered
                          ? 'translateY(-20px) rotate(0deg) scale(1.06)'
                          : `translateX(${baseTranslateX}px) rotate(${baseRotation}deg)`,
                        zIndex: isHovered ? 40 : 10 + idx,
                        opacity: isAnotherHovered ? 0.65 : 1,
                        transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
                      }}
                      className="absolute w-[260px] sm:w-[310px] md:w-[340px] aspect-[4/5] rounded-[20px] border-[6px] border-white shadow-luxury overflow-hidden cursor-pointer select-none bg-white"
                    >
                      <img 
                        src={card.img} 
                        alt={card.title} 
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Subtle Bottom Plate */}
                      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center z-10">
                        <span className="px-3 py-1 rounded-full text-[10px] font-jost font-medium uppercase text-white bg-[#DE4176] shadow-sm">
                          {card.category}
                        </span>
                        <span className="text-[10px] font-jost font-medium text-[#B03366] bg-white/95 px-2.5 py-1 rounded-full shadow-sm">
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
            6. PRÓXIMOS EVENTOS (Fondo --perla #FFFFFF)
            Grid de carteles de moda con duotone muy suave en multiply que pasa a color completo en hover
        ========================================== */}
        <section id="events" className="w-full bg-white text-[#B03366] py-20 sm:py-28 md:py-36 px-6 sm:px-10 md:px-14 relative overflow-hidden select-none">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end mb-12 sm:mb-16 gap-6">
            <div>
              <div className="editorial-eyebrow mb-4">
                <ButterflyIcon size={14} color="#DE4176" />
                <span>04  Agenda</span>
              </div>
              <h2 className="editorial-title text-[#B03366]">
                Próximos <span className="italic text-[#DE4176]">Eventos</span>
              </h2>
            </div>
            
            <div className="flex flex-col md:items-end gap-1.5">
              <a 
                href="https://shokomadrid.com/es/collections/eventos-shoko-madrid" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-2 text-xs font-jost font-medium text-[#DE4176] hover:underline underline-offset-4 tracking-[0.15em] uppercase transition-all cursor-pointer"
              >
                <span>Ver todos en Shôko →</span>
              </a>
              <span className="text-[11px] font-jost text-[#B03366]/60 uppercase tracking-wider">
                Madrid // Calle de Toledo, 86
              </span>
            </div>
          </div>

          {/* Cards Grid 3x2 en desktop / Snap en móvil */}
          <div className="max-w-6xl mx-auto overflow-x-auto snap-x snap-mandatory flex md:grid md:grid-cols-3 lg:grid-cols-6 gap-5 pb-4">
            {shokoEvents.map((event, i) => (
              <div 
                key={i} 
                className="min-w-[240px] md:min-w-0 snap-center bg-white p-2.5 rounded-[22px] border border-[rgba(224,69,123,0.14)] shadow-luxury transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between group cursor-pointer"
                data-cursor="Ver"
              >
                {/* Poster Container (70% superior con duotone rosa en multiply) */}
                <div className="relative w-full aspect-[4/5] rounded-[16px] overflow-hidden bg-[#FFF6F9]">
                  <img 
                    src={event.img} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    alt={event.title} 
                  />

                  {/* Duotone Overlay en multiply suave que desaparece en hover */}
                  <div className="absolute inset-0 bg-[#DE4176]/20 mix-blend-multiply opacity-100 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none" />

                  {/* Badge + HOY en --rosa */}
                  <div className="absolute top-2.5 right-2.5 z-10">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-jost font-medium bg-[#DE4176] text-white shadow-sm">
                      + Hoy
                    </span>
                  </div>
                </div>

                {/* Info Deck en --frambuesa */}
                <div className="pt-3 pb-1 flex flex-col flex-grow justify-between">
                  <div>
                    {/* Fecha grande en Bodoni Moda 22px */}
                    <div className="font-bodoni text-[22px] text-[#B03366] font-normal leading-tight">
                      {event.date}
                    </div>
                    {/* Nombre en Jost 15px mayúsculas */}
                    <h4 className="font-jost text-[14px] font-medium text-[#B03366] uppercase tracking-wider truncate mt-1">
                      {event.title}
                    </h4>
                    {/* Ciudad en Jost */}
                    <span className="font-jost text-[11px] text-[#B03366]/65 block mt-0.5 uppercase tracking-wide">
                      Madrid // Shôko
                    </span>
                  </div>

                  {/* Botón Comprar Entradas: borde fino en --rosa que se rellena al hover */}
                  <a 
                    href={event.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="mt-3.5 w-full py-2.5 rounded-full border border-[#DE4176] text-[#DE4176] hover:bg-[#DE4176] hover:text-white font-jost text-[11px] font-medium tracking-[0.18em] text-center block transition-all shadow-sm uppercase btn-luxury"
                  >
                    Comprar entradas
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ==========================================
            7. MARQUEE DE PRENSA (Fondo --porcelana #FFF6F9, bordes nacarados 1px, logos en --rosa al 45% -> 100% hover, mariposa de separador)
        ========================================== */}
        <section className="py-7 bg-[#FFF6F9] border-y border-[rgba(224,69,123,0.14)] overflow-hidden select-none">
          <div className="marquee-wrapper">
            <div className="marquee-content font-bodoni text-xl md:text-2xl text-[#DE4176]/45 gap-14 flex items-center whitespace-nowrap">
              {pressLogos.map((logo, idx) => (
                <React.Fragment key={idx}>
                  <span className="hover:text-[#DE4176] transition-colors cursor-pointer tracking-wider font-normal">
                    {logo}
                  </span>
                  <ButterflyIcon size={14} color="#DE4176" strokeWidth={1.5} />
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>

        {/* ==========================================
            8. FOOTER (Fondo --rosa #DE4176, THIAGO gigante en Bodoni blanco con reveal, enlaces con subrayado de izq a der, mariposa centrada encima de copyright)
        ========================================== */}
        <footer id="contact" className="bg-[#DE4176] text-white pt-20 pb-16 flex flex-col items-center relative overflow-hidden select-none">
          
          {/* Giant THIAGO in Bodoni Moda white with letter-by-letter reveal */}
          <div className="w-full text-center overflow-hidden py-2">
            <h2 className="w-full font-bodoni text-white text-[19vw] leading-[0.72] tracking-[-0.04em] font-normal flex justify-center items-center select-none">
              {"THIAGO".split("").map((letter, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 1, y: 0 }}
                  whileInView={{ y: [20, 0] }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  className="inline-block"
                >
                  {letter}
                </motion.span>
              ))}
            </h2>
          </div>

          {/* Social Links en blanco Jost 13px mayúsculas con subrayado animado de izq a der */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-8 sm:gap-12 font-jost text-xs sm:text-[13px] font-medium uppercase tracking-[0.2em] text-white">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="relative group py-1">
              <span>Instagram</span>
              <span className="absolute bottom-0 left-0 w-0 group-hover:w-full h-[1px] bg-white transition-all duration-300" />
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="relative group py-1">
              <span>TikTok</span>
              <span className="absolute bottom-0 left-0 w-0 group-hover:w-full h-[1px] bg-white transition-all duration-300" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="relative group py-1">
              <span>YouTube</span>
              <span className="absolute bottom-0 left-0 w-0 group-hover:w-full h-[1px] bg-white transition-all duration-300" />
            </a>
            <a href="https://spotify.com" target="_blank" rel="noopener noreferrer" className="relative group py-1">
              <span>Spotify</span>
              <span className="absolute bottom-0 left-0 w-0 group-hover:w-full h-[1px] bg-white transition-all duration-300" />
            </a>
            <a href="mailto:contacto@thiagovsc.com" className="relative group py-1">
              <span>Contacto</span>
              <span className="absolute bottom-0 left-0 w-0 group-hover:w-full h-[1px] bg-white transition-all duration-300" />
            </a>
          </div>

          {/* Sello de la firma: Mariposa centrada encima de copyright */}
          <div className="mt-12 mb-3">
            <ButterflyIcon size={22} color="#FFFFFF" strokeWidth={1.5} />
          </div>

          {/* Legal Links en blanco al 70% */}
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 font-jost text-[11px] uppercase tracking-wider text-white/70">
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
              className="hover:text-white transition-colors underline-offset-4 hover:underline cursor-pointer font-jost uppercase"
            >
              Configurar Cookies
            </button>
          </div>

          <div className="mt-4 text-[11px] font-jost text-white/60 tracking-widest uppercase">
            © 2026 THIAGO VSC • ALL RIGHTS RESERVED
          </div>
        </footer>

        {/* ==========================================
            FULL-SIZE LIGHTBOX MODAL (Editorial Frosted Backdrop)
        ========================================== */}
        {lightboxCard && (
          <div 
            className="fixed inset-0 z-[200] flex flex-col justify-between p-4 sm:p-8 animate-in fade-in duration-200 select-none overflow-hidden"
            onClick={() => setLightboxCard(null)}
          >
            {/* Blurred Backdrop */}
            <div 
              className="absolute inset-0 bg-cover bg-center scale-125 blur-3xl opacity-40 pointer-events-none"
              style={{ backgroundImage: `url(${lightboxCard.img})` }}
            />
            <div className="absolute inset-0 bg-white/85 backdrop-blur-xl pointer-events-none" />

            {/* Lightbox Header */}
            <div className="w-full max-w-5xl mx-auto flex justify-between items-center z-10 relative" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-3">
                <span className="px-4 py-1.5 rounded-full text-xs font-jost font-medium uppercase text-white bg-[#DE4176] shadow-sm">
                  {lightboxCard.title}
                </span>
                <span className="hidden sm:inline-block text-xs font-jost text-[#B03366] font-medium bg-[#FFF6F9] px-3 py-1 rounded-full border border-[rgba(224,69,123,0.18)]">
                  Francesca Chiri
                </span>
              </div>

              <button
                onClick={() => setLightboxCard(null)}
                className="px-5 py-2 rounded-full border border-[rgba(224,69,123,0.2)] bg-white hover:bg-[#DE4176] hover:text-white text-[#B03366] text-xs font-jost font-medium tracking-widest uppercase transition-all flex items-center gap-2 shadow-luxury cursor-pointer btn-luxury"
              >
                <span>Cerrar</span>
                <span className="text-sm">✕</span>
              </button>
            </div>

            {/* Photo in Center */}
            <div className="w-full max-w-5xl mx-auto my-auto flex items-center justify-center relative p-2 z-10" onClick={(e) => e.stopPropagation()}>
              <img 
                src={lightboxCard.img} 
                alt={lightboxCard.title} 
                className="max-h-[78vh] max-w-[90vw] object-contain rounded-2xl border-[6px] border-white shadow-luxury animate-in zoom-in-95 duration-200"
              />
            </div>

            {/* Lightbox Footer */}
            <div className="w-full max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 text-xs font-jost text-[#B03366] z-10 pt-2 relative" onClick={(e) => e.stopPropagation()}>
              <span className="tracking-wider font-medium">FRANCESCA CHIRI // ZONA INFLUENCER</span>
              <div className="flex gap-2">
                {influencerCards.map((c, i) => (
                  <button
                    key={c.id}
                    onClick={() => setLightboxCard(c)}
                    className={`px-3.5 py-1.5 rounded-full transition-all text-[11px] font-medium cursor-pointer ${
                      lightboxCard.id === c.id ? 'bg-[#DE4176] text-white shadow-sm' : 'bg-[#FFF6F9] text-[#B03366] hover:bg-white border border-[rgba(224,69,123,0.18)]'
                    }`}
                  >
                    Foto 0{i + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            STANDALONE TUNER FM RADIO MODAL
        ========================================== */}
        {radioModalOpen && (
          <div 
            className="fixed inset-0 z-[250] flex items-center justify-center p-3 sm:p-6 md:p-10 animate-in fade-in duration-200 select-none"
            onClick={() => setRadioModalOpen(false)}
          >
            <div className="absolute inset-0 bg-white/80 backdrop-blur-2xl" />

            <div 
              className="relative w-full max-w-5xl h-[88vh] max-h-[780px] bg-[#FFF6F9] rounded-3xl overflow-hidden border border-[rgba(224,69,123,0.18)] shadow-luxury z-10 animate-in zoom-in-95 duration-200 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <CoverFlowRadio onClose={() => setRadioModalOpen(false)} />
            </div>
          </div>
        )}

        {/* COOKIE CONSENT BANNER */}
        <CookieConsent />

      </div>
    </ReactLenis>
  );
}
