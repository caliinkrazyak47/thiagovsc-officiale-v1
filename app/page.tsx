'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ReactLenis } from '@studio-freight/react-lenis';
import { DigitalClock } from '@/components/DigitalClock';
import { TVOnlinePlayer } from '@/components/TVOnlinePlayer/TVOnlinePlayer';
import { ViralSlider } from '@/components/ViralSlider/ViralSlider';
import { CoverFlowRadio } from '@/components/CoverFlowRadio/CoverFlowRadio';
import { CookieConsent } from '@/components/CookieConsent';
import { CustomCursor } from '@/components/CustomCursor';

// ==========================================
// HERO VIDEO COMPONENT (Imagen + Logo Cromado Intactos)
// ==========================================
interface HeroVideoProps {
  onOpenRadio: () => void;
}

const HeroVideo: React.FC<HeroVideoProps> = ({ onOpenRadio }) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.play().catch(() => {
      // Autoplay fallback
    });
  }, []);

  return (
    <div className="relative w-full overflow-hidden select-none">
      {/* 16:9 Responsive Video Viewport */}
      <section className="relative w-full aspect-video min-h-[560px] sm:min-h-[640px] md:min-h-[720px] lg:min-h-[820px] max-h-[1080px] overflow-hidden bg-[#3B0D22]">
        
        {/* Background Fallback Poster */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
          style={{ 
            backgroundImage: "url('/images/francesca-1.jpg')",
            opacity: isVideoLoaded ? 0 : 1 
          }}
        />

        {/* Hero Background Video */}
        <video
          ref={videoRef}
          src="/videos/hero.mp4"
          poster="/images/francesca-1.jpg"
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={() => setIsVideoLoaded(true)}
          onError={() => setVideoError(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            isVideoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* 
          CENTRAL 3D METALLIC CHROME "THIAGOVSC" LOGO
          Conservado exactamente en su posición y forma original
        */}
        <div className="absolute inset-x-0 bottom-[10%] sm:bottom-[12%] md:bottom-[14%] flex items-center justify-center pointer-events-none z-20 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="relative pointer-events-auto cursor-pointer group"
            onClick={onOpenRadio}
            data-cursor="PLAY"
          >
            <img
              src="/logo-new.png"
              alt="Thiago VSC 3D Chrome Official Emblem"
              className="w-[88vw] sm:w-[78vw] md:w-[68vw] lg:w-[58vw] max-w-[940px] object-contain drop-shadow-[0_20px_45px_rgba(59,13,34,0.4)] group-hover:scale-[1.02] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            />
          </motion.div>
        </div>

        {/* Upper Hero Stage: Typography + Live Radio Trigger */}
        <div className="absolute inset-0 z-20 flex flex-col justify-start p-6 sm:p-10 md:p-14 lg:p-20 pointer-events-none">
          {/* Top spacer below floating navbar */}
          <div className="w-full h-12 sm:h-16" />

          <div className="w-full flex flex-col md:flex-row items-start justify-between gap-6 pt-2 sm:pt-4">
            
            {/* Left Typography: "EL RITMO DE TU MUNDO" en blanco sólido sin contorno, última palabra en serif itálica */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col max-w-2xl"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.6vw] font-display text-white leading-[0.9] tracking-[-0.04em] uppercase drop-shadow-md">
                EL RITMO DE TU <span className="font-serif-italic font-normal lowercase first-letter:uppercase text-white">Mundo</span>
              </h1>
              <p className="mt-3 sm:mt-4 font-mono text-[11px] sm:text-xs tracking-[0.2em] text-white uppercase drop-shadow">
                00 / PLATAFORMA OFICIAL // EN DIRECTO 24/7
              </p>
            </motion.div>

            {/* Right: Botón "EN VIVO RADIO" en --pink sólido con punto blanco parpadeante */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-auto self-start mt-2 md:mt-4"
            >
              <button
                type="button"
                onClick={onOpenRadio}
                className="inline-flex items-center gap-2.5 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[#DE4176] hover:bg-[#c22e61] text-white transition-all shadow-editorial cursor-pointer haptic-press"
                title="Abrir Emisora de Radio en directo"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                <span className="font-mono text-xs font-bold tracking-widest uppercase">EN VIVO RADIO</span>
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
  const [lightboxCard, setLightboxCard] = useState<{ id: number; img: string; title: string; pillColor: string; pillBadge: string; category: string } | null>(null);

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
      date: "04 OCT"
    },
    {
      title: "SWAG CITY",
      url: "https://shokomadrid.com/es/products/swag-city-thursday-1-10-2026",
      img: "/images/cover2.jpg",
      date: "01 OCT"
    },
    {
      title: "RESIDENCIA",
      url: "https://shokomadrid.com/es/products/residencia-de-los-domingos-sunday-4-10-2026",
      img: "/images/cover3.jpg",
      date: "02 OCT"
    },
    {
      title: "PURE SHOKO",
      url: "https://shokomadrid.com/es/products/pure-shoko-friday-2-10-2026",
      img: "/images/cover4.jpg",
      date: "03 OCT"
    },
    {
      title: "HALLOWEEN",
      url: "https://shokomadrid.com/es/products/halloween-edition-friday-30-10-2026",
      img: "/images/cover5.jpg",
      date: "08 OCT"
    },
    {
      title: "TARDEO",
      url: "https://shokomadrid.com/es/products/tardeo-tropical-saturday-3-10-2026",
      img: "/images/francesca-4.jpg",
      date: "09 OCT"
    }
  ];

  const influencerCards = [
    {
      id: 0,
      img: "/images/francesca-1.jpg",
      title: "FRANCESCA CHIRI // STREET CHIC",
      pillColor: "#DE4176",
      pillBadge: "ICONIC '26",
      category: "STREETWEAR",
      rotation: -6,
      translateX: -35,
    },
    {
      id: 1,
      img: "/images/francesca-2.jpg",
      title: "PINK BISTRO // EDITORIAL LOOK",
      pillColor: "#DE4176",
      pillBadge: "BEAUTY & FOOD",
      category: "EDITORIAL",
      rotation: 3,
      translateX: 0,
    },
    {
      id: 2,
      img: "/images/francesca-3.jpg",
      title: "WINTER WONDERLAND // SNOW LOOK",
      pillColor: "#DE4176",
      pillBadge: "WINTER STYLE",
      category: "WINTER",
      rotation: 8,
      translateX: 35,
    },
  ];

  const navMenuItems = [
    { num: "01", label: "INICIO", target: "#home" },
    { num: "02", label: "TV ONLINE", target: "#tv" },
    { num: "03", label: "TIKTOK FEED", target: "#tiktok" },
    { num: "04", label: "ZONA INFLUENCER", target: "#zona-influencer" },
    { num: "05", label: "PRÓXIMOS EVENTOS", target: "#events" },
    { num: "06", label: "CONTACTO", target: "#contact" },
  ];

  return (
    <ReactLenis root options={{ lerp: 0.08, smoothWheel: true }}>
      <div id="home" className="min-h-screen bg-white text-[#3B0D22] font-sans overflow-hidden relative selection:bg-[#DE4176] selection:text-white">

        {/* CUSTOM EDITORIAL CURSOR */}
        <CustomCursor />

        {/* ==========================================
            FLOATING NAVBAR (Píldora en --white al 80% con backdrop-blur, borde 1px --ink al 10%)
        ========================================== */}
        <nav className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl px-5 sm:px-7 py-3 rounded-full bg-white/80 backdrop-blur-xl border border-[#3B0D22]/10 shadow-editorial flex items-center justify-between select-none">
          
          {/* Logo THIAGO VSC */}
          <div className="flex items-center gap-3">
            <a 
              href="#home" 
              onClick={(e) => handleNavClick(e, '#home')}
              className="flex items-center gap-1.5 tracking-tight text-[#3B0D22] hover:text-[#DE4176] transition-colors cursor-pointer"
            >
              <span className="font-display text-xl tracking-[-0.03em]">THIAGO</span>
              <span className="font-serif-italic text-2xl leading-none text-[#DE4176]">Vsc</span>
            </a>
          </div>

          {/* Nav Links: text --ink, active in --pink */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 font-mono text-xs font-semibold uppercase tracking-wider">
            <a 
              href="#home" 
              onClick={(e) => handleNavClick(e, '#home')}
              className={`transition-colors cursor-pointer ${
                activeSection === 'home' ? 'text-[#DE4176] font-bold' : 'text-[#3B0D22]/75 hover:text-[#3B0D22]'
              }`}
            >
              INICIO
            </a>
            <a 
              href="#tv" 
              onClick={(e) => handleNavClick(e, '#tv')}
              className={`transition-colors cursor-pointer ${
                activeSection === 'tv' ? 'text-[#DE4176] font-bold' : 'text-[#3B0D22]/75 hover:text-[#3B0D22]'
              }`}
            >
              TV ONLINE
            </a>
            <a 
              href="#tiktok" 
              onClick={(e) => handleNavClick(e, '#tiktok')}
              className={`transition-colors cursor-pointer ${
                activeSection === 'tiktok' ? 'text-[#DE4176] font-bold' : 'text-[#3B0D22]/75 hover:text-[#3B0D22]'
              }`}
            >
              TIKTOK
            </a>
            <a 
              href="#zona-influencer" 
              onClick={(e) => handleNavClick(e, '#zona-influencer')}
              className={`transition-colors cursor-pointer ${
                activeSection === 'zona-influencer' ? 'text-[#DE4176] font-bold' : 'text-[#3B0D22]/75 hover:text-[#3B0D22]'
              }`}
            >
              INFLUENCER
            </a>
            <a 
              href="#events" 
              onClick={(e) => handleNavClick(e, '#events')}
              className={`transition-colors cursor-pointer ${
                activeSection === 'events' ? 'text-[#DE4176] font-bold' : 'text-[#3B0D22]/75 hover:text-[#3B0D22]'
              }`}
            >
              EVENTOS
            </a>
          </div>

          {/* Right: Digital clock + Radio Pill Button + Hamburger */}
          <div className="flex items-center gap-3 sm:gap-4">
            <DigitalClock className="hidden sm:inline-flex text-[#3B0D22]" />

            {/* Botón EN VIVO RADIO en --pink sólido con punto blanco parpadeante */}
            <button 
              type="button"
              onClick={() => setRadioModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DE4176] hover:bg-[#c22e61] text-white font-mono text-[11px] font-bold tracking-wider uppercase transition-all shadow-sm cursor-pointer haptic-press"
              title="Sintonizar Radio Live"
            >
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span>RADIO</span>
            </button>

            <button 
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menú"
              className="text-[#3B0D22] hover:text-[#DE4176] bg-[#FFF4F7] hover:bg-white w-9 h-9 rounded-full flex items-center justify-center transition-all border border-[#3B0D22]/10 cursor-pointer haptic-press"
            >
              <span className="font-bold text-sm">☰</span>
            </button>
          </div>
        </nav>

        {/* ==========================================
            FULLSCREEN EDITORIAL MENU OVERLAY
        ========================================== */}
        {menuOpen && (
          <div 
            className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-2xl flex flex-col justify-between p-6 md:p-14 animate-in fade-in duration-200 select-none"
            onClick={() => setMenuOpen(false)}
          >
            {/* Header inside Menu */}
            <div className="flex justify-between items-center w-full max-w-5xl mx-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-2">
                <span className="font-display text-2xl text-[#3B0D22]">THIAGO</span>
                <span className="font-serif-italic text-3xl text-[#DE4176]">Vsc</span>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="px-5 py-2 rounded-full border border-[#3B0D22]/15 bg-[#FFF4F7] hover:bg-[#DE4176] hover:text-white text-[#3B0D22] text-xs font-mono font-bold tracking-widest uppercase transition-all flex items-center gap-2 cursor-pointer haptic-press"
              >
                <span>CERRAR</span>
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
                  className="group flex items-center gap-6 text-[#3B0D22] hover:text-[#DE4176] transition-all duration-300 py-3 border-b border-[#3B0D22]/10"
                >
                  <span className="font-mono text-sm text-[#3B0D22]/40 group-hover:text-[#DE4176]">
                    {item.num} /
                  </span>
                  <span className="text-3xl md:text-5xl lg:text-6xl font-display uppercase tracking-[-0.03em] group-hover:translate-x-3 transition-transform duration-300">
                    {item.label}
                  </span>
                </a>
              ))}
            </div>

            {/* Menu Footer */}
            <div className="w-full max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-[#3B0D22]/60 pt-6 border-t border-[#3B0D22]/10" onClick={(e) => e.stopPropagation()}>
              <div className="flex gap-6 uppercase tracking-wider">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#DE4176] transition-colors">Instagram</a>
                <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#DE4176] transition-colors">TikTok</a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#DE4176] transition-colors">YouTube</a>
                <a href="https://spotify.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#DE4176] transition-colors">Spotify</a>
              </div>
              <div className="tracking-widest uppercase">
                EDICIÓN EDITORIAL // 2026
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            1. HERO SECTION (Imagen + Logo Cromado Intactos)
        ========================================== */}
        <HeroVideo onOpenRadio={() => setRadioModalOpen(true)} />

        {/* ==========================================
            2. MARQUEE 1 (Fondo --pink, texto --white en serif itálica grande, separadores "✦")
        ========================================== */}
        <section className="py-6 sm:py-8 bg-[#DE4176] overflow-hidden select-none">
          <div className="marquee-wrapper">
            <div className="marquee-content font-serif-italic text-white text-[clamp(1.5rem,3.2vw,3rem)] tracking-wide flex items-center gap-12 whitespace-nowrap">
              <span>Bienvenido a la plataforma oficial de Thiago VSC</span>
              <span className="text-white text-xl">✦</span>
              <span>Emisión continua en alta definición 24/7</span>
              <span className="text-white text-xl">✦</span>
              <span>Música urbana, directos y momentos virales</span>
              <span className="text-white text-xl">✦</span>
              <span>Bienvenido a la plataforma oficial de Thiago VSC</span>
              <span className="text-white text-xl">✦</span>
              <span>Emisión continua en alta definición 24/7</span>
              <span className="text-white text-xl">✦</span>
            </div>
          </div>
        </section>

        {/* ==========================================
            3. TV ONLINE (Fondo --white)
        ========================================== */}
        <TVOnlinePlayer />

        {/* ==========================================
            4. TIKTOK FEED (Fondo --pink sólido)
        ========================================== */}
        <ViralSlider />

        {/* ==========================================
            5. ZONA INFLUENCER (Fondo --blush)
            Layout asimétrico cols 1-6 y cols 7-12, texto CHIRI con parallax, cartas apiladas con borde 8px white
        ========================================== */}
        <section id="zona-influencer" className="w-full bg-[#FFF4F7] text-[#3B0D22] relative overflow-hidden py-20 sm:py-28 md:py-36 px-4 sm:px-8 md:px-12 select-none">
          
          {/* Texto gigante CHIRI de fondo en --pink al 6% con parallax suave */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 select-none pointer-events-none opacity-[0.06] text-[28vw] font-display text-[#DE4176] tracking-tighter whitespace-nowrap z-0 leading-none">
            CHIRI
          </div>

          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            
            {/* Columnas 1-6: Texto Editorial */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              <span className="editorial-pill mb-5">
                03 / TALENTO EXCLUSIVO
              </span>
              
              <h2 className="editorial-h2 flex flex-col tracking-[-0.04em] mb-6">
                <span className="font-display text-[#3B0D22] uppercase">Zona</span>
                <span className="font-serif-italic text-[#DE4176] font-normal leading-none -mt-2">Influencer</span>
              </h2>

              {/* Influencer Name */}
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <h3 className="text-2xl sm:text-3xl font-display text-[#3B0D22] uppercase">
                  FRANCESCA CHIRI
                </h3>
                <a
                  href="https://www.tiktok.com/@chiri_francesca"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs bg-[#DE4176] hover:bg-[#c22e61] text-white px-3.5 py-1.5 rounded-full font-bold shadow-sm transition-all inline-flex items-center gap-1.5 cursor-pointer haptic-press"
                >
                  <span>@chiri_francesca</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                </a>
              </div>

              {/* Tags como píldoras con borde --ink al 15% */}
              <div className="flex flex-wrap gap-2.5 mb-6 font-mono text-xs">
                <span className="px-3.5 py-1 rounded-full border border-[#3B0D22]/15 text-[#3B0D22] text-[11px] font-bold tracking-wider uppercase">
                  1.8M+ AUDIENCIA
                </span>
                <span className="px-3.5 py-1 rounded-full border border-[#3B0D22]/15 text-[#3B0D22] text-[11px] font-bold tracking-wider uppercase">
                  MODA & EDITORIAL
                </span>
                <span className="px-3.5 py-1 rounded-full border border-[#3B0D22]/15 text-[#3B0D22] text-[11px] font-bold tracking-wider uppercase">
                  VERIFICADA OFICIAL
                </span>
              </div>

              {/* Bio */}
              <p className="editorial-body max-w-lg mb-8">
                Nacida en Italia en 2006 y con raíces rumanas, Francesca Chiri comenzó su andadura en el contenido digital a los 13 años. Hoy, bajo el usuario @chiri_francesca, inspira a millones de seguidores con sus looks de moda, rutinas de beauty y vlogs de viajes. Es una de las creadoras de contenido curvy y de estilo de vida con mayor proyección en la escena europea.
              </p>

              {/* Botón ACCEDER AL LINKTREE en píldora --pink con flecha desplazable en hover */}
              <div>
                <a 
                  href="https://linktr.ee/chirifrancesca"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 bg-[#DE4176] hover:bg-[#c22e61] text-white font-sans font-bold px-8 py-4 text-sm tracking-wider rounded-full transition-all shadow-editorial cursor-pointer haptic-press uppercase"
                >
                  <span>ACCEDER AL LINKTREE</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
                </a>
              </div>
            </div>

            {/* Columnas 7-12: Cartas Apiladas con borde 8px --white, rotaciones -6°, 3° y 8°, abanico en hover */}
            <div className="lg:col-span-6 flex items-center justify-center relative min-h-[460px] sm:min-h-[540px] group/stage" data-cursor="VER">
              <div className="relative w-full max-w-[420px] aspect-[4/5] flex items-center justify-center">
                {influencerCards.map((card, idx) => {
                  const isHovered = hoveredGalleryCard === idx;

                  // Rotaciones requeridas: -6°, 3° y 8°
                  const baseRotations = [-6, 3, 8];
                  const baseRotation = baseRotations[idx] || 0;
                  const baseTranslateX = (idx - 1) * 30;

                  return (
                    <div
                      key={card.id}
                      onMouseEnter={() => setHoveredGalleryCard(idx)}
                      onMouseLeave={() => setHoveredGalleryCard(null)}
                      onClick={() => setLightboxCard(card)}
                      style={{
                        transform: isHovered
                          ? 'translateY(-24px) rotate(0deg) scale(1.06)'
                          : `translateX(${baseTranslateX}px) rotate(${baseRotation}deg)`,
                        zIndex: isHovered ? 40 : 10 + idx,
                        transition: 'all 0.45s cubic-bezier(0.22, 1, 0.36, 1)',
                      }}
                      className="absolute w-[260px] sm:w-[320px] md:w-[350px] aspect-[4/5] rounded-2xl border-[8px] border-white shadow-editorial overflow-hidden cursor-pointer select-none bg-white"
                    >
                      <img 
                        src={card.img} 
                        alt={card.title} 
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Bottom Tag */}
                      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center z-10">
                        <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase text-white bg-[#DE4176] shadow-sm">
                          {card.pillBadge}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-[#3B0D22] bg-white/90 px-2.5 py-1 rounded-full shadow-sm">
                          VER FOTO
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
            6. PRÓXIMOS EVENTOS (Fondo --white)
            Card white con padding 10px, radius 24px, borde 1px --ink 10%, fecha grande serif, sans bold, ciudad mono, badge + HOY pink
        ========================================== */}
        <section id="events" className="w-full bg-white text-[#3B0D22] py-20 sm:py-28 md:py-36 px-4 sm:px-8 md:px-12 relative overflow-hidden select-none">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end mb-12 sm:mb-16 gap-6">
            <div>
              <span className="editorial-pill mb-5">
                04 / EXPERIENCIAS EXCLUSIVAS // SHÔKO MADRID
              </span>
              <h2 className="editorial-h2 flex flex-col tracking-[-0.04em]">
                <span className="font-display text-[#3B0D22] uppercase">Próximos</span>
                <span className="font-serif-italic text-[#DE4176] font-normal leading-none -mt-2">Eventos</span>
              </h2>
            </div>
            
            <div className="flex flex-col md:items-end gap-2">
              <a 
                href="https://shokomadrid.com/es/collections/eventos-shoko-madrid" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-[#DE4176] text-[#DE4176] hover:bg-[#DE4176] hover:text-white font-mono text-xs font-bold tracking-wider uppercase transition-all shadow-sm cursor-pointer haptic-press"
              >
                <span>VER TODOS EN SHÔKO.COM</span>
              </a>
              <span className="text-[11px] font-mono text-[#3B0D22]/60 uppercase tracking-wide">
                MADRID // CALLE DE TOLEDO, 86
              </span>
            </div>
          </div>

          {/* Cards Grid / Mobile Horizontal Scroll-snap */}
          <div className="max-w-6xl mx-auto overflow-x-auto snap-x snap-mandatory flex md:grid md:grid-cols-6 gap-5 pb-4">
            {shokoEvents.map((event, i) => (
              <div 
                key={i} 
                className="min-w-[240px] md:min-w-0 snap-center bg-white p-[10px] rounded-[24px] border border-[#3B0D22]/10 shadow-editorial transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between group cursor-pointer"
                data-cursor="VER"
              >
                {/* Poster Container */}
                <div className="relative w-full aspect-[4/5] rounded-[16px] overflow-hidden bg-[#FFF4F7]">
                  <img 
                    src={event.img} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    alt={event.title} 
                  />
                  {/* Badge + HOY en --pink */}
                  <div className="absolute top-2.5 right-2.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#DE4176] text-white shadow-sm">
                      + HOY
                    </span>
                  </div>
                </div>

                {/* Info Deck en --ink */}
                <div className="pt-3 pb-1 flex flex-col flex-grow justify-between">
                  <div>
                    {/* Fecha grande en serif */}
                    <div className="font-serif-italic text-2xl text-[#3B0D22] font-normal leading-tight">
                      {event.date}
                    </div>
                    {/* Nombre del evento en sans bold */}
                    <h4 className="font-display text-sm text-[#3B0D22] uppercase tracking-tight truncate mt-1">
                      {event.title}
                    </h4>
                    {/* Ciudad en mono */}
                    <span className="font-mono text-[11px] text-[#3B0D22]/70 block mt-0.5 uppercase">
                      MADRID // SHÔKO
                    </span>
                  </div>

                  {/* Botón COMPRAR ENTRADAS en --pink sólido con texto --white */}
                  <a 
                    href={event.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="mt-3.5 w-full py-2.5 rounded-xl bg-[#DE4176] hover:bg-[#c22e61] text-white font-mono text-[11px] font-bold tracking-wider text-center block transition-all shadow-sm uppercase haptic-press"
                  >
                    COMPRAR ENTRADAS
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ==========================================
            7. MARQUEE DE PRENSA (Fondo --white, líneas finas --ink 10% arriba/abajo, logos en --ink 35% que pasan a --pink en hover, separador "✦")
        ========================================== */}
        <section className="py-8 bg-white border-y border-[#3B0D22]/10 overflow-hidden select-none">
          <div className="marquee-wrapper">
            <div className="marquee-content font-display text-2xl md:text-3xl text-[#3B0D22]/35 gap-16 flex items-center whitespace-nowrap">
              <span className="hover:text-[#DE4176] transition-colors cursor-pointer">FORBES</span>
              <span className="text-[#DE4176] font-normal text-lg">✦</span>
              <span className="hover:text-[#DE4176] transition-colors cursor-pointer">DIELINE</span>
              <span className="text-[#DE4176] font-normal text-lg">✦</span>
              <span className="hover:text-[#DE4176] transition-colors cursor-pointer">FAMOUSE</span>
              <span className="text-[#DE4176] font-normal text-lg">✦</span>
              <span className="hover:text-[#DE4176] transition-colors cursor-pointer">ROLLING STONE</span>
              <span className="text-[#DE4176] font-normal text-lg">✦</span>
              <span className="hover:text-[#DE4176] transition-colors cursor-pointer">VANITY FAIR</span>
              <span className="text-[#DE4176] font-normal text-lg">✦</span>
              <span className="hover:text-[#DE4176] transition-colors cursor-pointer">FORBES</span>
              <span className="text-[#DE4176] font-normal text-lg">✦</span>
              <span className="hover:text-[#DE4176] transition-colors cursor-pointer">DIELINE</span>
              <span className="text-[#DE4176] font-normal text-lg">✦</span>
              <span className="hover:text-[#DE4176] transition-colors cursor-pointer">FAMOUSE</span>
              <span className="text-[#DE4176] font-normal text-lg">✦</span>
              <span className="hover:text-[#DE4176] transition-colors cursor-pointer">ROLLING STONE</span>
              <span className="text-[#DE4176] font-normal text-lg">✦</span>
              <span className="hover:text-[#DE4176] transition-colors cursor-pointer">VANITY FAIR</span>
              <span className="text-[#DE4176] font-normal text-lg">✦</span>
            </div>
          </div>
        </section>

        {/* ==========================================
            8. FOOTER (Fondo --pink, THIAGO gigante en --white, links en --white con subrayado animado en hover, textos legales en --white 70%)
        ========================================== */}
        <footer id="contact" className="bg-[#DE4176] text-white pt-20 pb-16 flex flex-col items-center relative overflow-hidden select-none">
          <h1 className="w-full text-center text-[19vw] leading-[0.72] font-display uppercase tracking-[-0.05em] text-white">
            THIAGO
          </h1>

          {/* Social Links en --white con subrayado animado en hover */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-8 sm:gap-12 font-mono text-xs md:text-sm font-bold uppercase tracking-widest text-white">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-8 transition-all">Instagram</a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-8 transition-all">TikTok</a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-8 transition-all">YouTube</a>
            <a href="https://spotify.com" target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-8 transition-all">Spotify</a>
            <a href="mailto:contacto@thiagovsc.com" className="hover:underline underline-offset-8 transition-all">Contacto</a>
          </div>

          {/* Legal Links en --white al 70% */}
          <div className="mt-10 flex flex-wrap justify-center items-center gap-4 sm:gap-6 font-mono text-[11px] uppercase tracking-wider text-white/70">
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

          <div className="mt-6 text-[11px] font-mono text-white/60 tracking-wider">
            © 2026 THIAGOVSC • ALL RIGHTS RESERVED
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
              className="absolute inset-0 bg-cover bg-center scale-125 blur-3xl opacity-50 pointer-events-none"
              style={{ backgroundImage: `url(${lightboxCard.img})` }}
            />
            <div className="absolute inset-0 bg-white/80 backdrop-blur-xl pointer-events-none" />

            {/* Lightbox Header */}
            <div className="w-full max-w-5xl mx-auto flex justify-between items-center z-10 relative" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-3">
                <span className="px-4 py-1.5 rounded-full text-xs font-mono font-bold uppercase text-white bg-[#DE4176] shadow-sm">
                  {lightboxCard.title}
                </span>
                <span className="hidden sm:inline-block text-xs font-mono text-[#3B0D22] font-bold bg-[#FFF4F7] px-3 py-1 rounded-full border border-[#3B0D22]/15">
                  FRANCESCA CHIRI
                </span>
              </div>

              <button
                onClick={() => setLightboxCard(null)}
                className="px-5 py-2 rounded-full border border-[#3B0D22]/20 bg-white hover:bg-[#DE4176] hover:text-white text-[#3B0D22] text-xs font-mono font-bold tracking-widest uppercase transition-all flex items-center gap-2 shadow-editorial cursor-pointer haptic-press"
              >
                <span>CERRAR</span>
                <span className="text-sm">✕</span>
              </button>
            </div>

            {/* Photo in Center */}
            <div className="w-full max-w-5xl mx-auto my-auto flex items-center justify-center relative p-2 z-10" onClick={(e) => e.stopPropagation()}>
              <img 
                src={lightboxCard.img} 
                alt={lightboxCard.title} 
                className="max-h-[78vh] max-w-[90vw] object-contain rounded-2xl border-[6px] border-white shadow-editorial animate-in zoom-in-95 duration-200"
              />
            </div>

            {/* Lightbox Footer */}
            <div className="w-full max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 text-xs font-mono text-[#3B0D22] z-10 pt-2 relative" onClick={(e) => e.stopPropagation()}>
              <span className="tracking-wider font-bold">FRANCESCA CHIRI // ZONA INFLUENCER</span>
              <div className="flex gap-2">
                {influencerCards.map((c, i) => (
                  <button
                    key={c.id}
                    onClick={() => setLightboxCard(c)}
                    className={`px-3.5 py-1.5 rounded-full transition-all text-[11px] font-bold cursor-pointer ${
                      lightboxCard.id === c.id ? 'bg-[#DE4176] text-white shadow-sm' : 'bg-[#FFF4F7] text-[#3B0D22] hover:bg-white border border-[#3B0D22]/15'
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
            STANDALONE TUNER FM RADIO MODAL
        ========================================== */}
        {radioModalOpen && (
          <div 
            className="fixed inset-0 z-[250] flex items-center justify-center p-3 sm:p-6 md:p-10 animate-in fade-in duration-200 select-none"
            onClick={() => setRadioModalOpen(false)}
          >
            <div className="absolute inset-0 bg-[#3B0D22]/60 backdrop-blur-2xl" />

            <div 
              className="relative w-full max-w-5xl h-[88vh] max-h-[780px] bg-white rounded-3xl overflow-hidden border border-[#3B0D22]/15 shadow-editorial z-10 animate-in zoom-in-95 duration-200 flex flex-col"
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
