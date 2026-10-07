'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';

// Fonts to scramble through, identical to the eclectic typographic clash of Samu Clima
const SCRAMBLE_FONTS = [
  "'Bebas Neue', sans-serif",
  "'Playfair Display', serif",
  "'DM Sans', sans-serif",
  "'Italianno', cursive",
  "'Bodoni Moda', serif",
  "'Panchang', sans-serif",
];

interface LetterDef {
  char: string;
  finalFont: string;
  fontSizeDesktop: string;
  fontSizeMobile: string;
  hasOverline?: boolean;
  isCursive?: boolean;
  marginRight?: string;
  marginLeft?: string;
  yOffset?: string;
  isSeparator?: boolean;
}

export const SamuClimaPreloader: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(0);

  // Define each character of "THIAGO" (Top Row) and "V · S · C" (Bottom Row)
  const topRowLetters: LetterDef[] = useMemo(() => [
    {
      char: 'T',
      finalFont: "'DM Sans', sans-serif",
      fontSizeDesktop: 'clamp(5rem, 11vw, 11rem)',
      fontSizeMobile: '19vw',
      hasOverline: true, // Signature Samu Clima overline bar
      marginRight: '0.04em',
    },
    {
      char: 'H',
      finalFont: "'Bebas Neue', sans-serif",
      fontSizeDesktop: 'clamp(5.5rem, 12vw, 12rem)',
      fontSizeMobile: '20.5vw',
      marginRight: '0.02em',
      marginLeft: '-0.02em',
    },
    {
      char: 'I',
      finalFont: "'Bodoni Moda', serif",
      fontSizeDesktop: 'clamp(5.2rem, 11.5vw, 11.5rem)',
      fontSizeMobile: '20vw',
      marginRight: '0.04em',
    },
    {
      char: 'A',
      finalFont: "'Italianno', cursive",
      fontSizeDesktop: 'clamp(7.5rem, 16vw, 16rem)',
      fontSizeMobile: '27vw',
      isCursive: true,
      marginLeft: '-0.06em',
      marginRight: '0.02em',
      yOffset: '0.05em',
    },
    {
      char: 'G',
      finalFont: "'Playfair Display', serif",
      fontSizeDesktop: 'clamp(5rem, 11vw, 11rem)',
      fontSizeMobile: '19vw',
      marginRight: '0.02em',
    },
    {
      char: 'O',
      finalFont: "'Panchang', sans-serif",
      fontSizeDesktop: 'clamp(4.6rem, 10vw, 10rem)',
      fontSizeMobile: '17.5vw',
    },
  ], []);

  const bottomRowLetters: LetterDef[] = useMemo(() => [
    {
      char: 'V',
      finalFont: "'Playfair Display', serif",
      fontSizeDesktop: 'clamp(5rem, 10.5vw, 10.5rem)',
      fontSizeMobile: '18vw',
      marginRight: '0.04em',
    },
    {
      char: '·',
      finalFont: "'DM Sans', sans-serif",
      fontSizeDesktop: 'clamp(4.5rem, 9.5vw, 9.5rem)',
      fontSizeMobile: '16vw',
      isSeparator: true,
      marginRight: '0.06em',
      marginLeft: '0.02em',
      yOffset: '-0.05em',
    },
    {
      char: 'S',
      finalFont: "'Italianno', cursive",
      fontSizeDesktop: 'clamp(7.5rem, 16vw, 16rem)',
      fontSizeMobile: '27vw',
      isCursive: true,
      marginLeft: '-0.04em',
      marginRight: '0.02em',
      yOffset: '0.04em',
    },
    {
      char: '·',
      finalFont: "'DM Sans', sans-serif",
      fontSizeDesktop: 'clamp(4.5rem, 9.5vw, 9.5rem)',
      fontSizeMobile: '16vw',
      isSeparator: true,
      marginRight: '0.04em',
      marginLeft: '0.04em',
      yOffset: '-0.05em',
    },
    {
      char: 'C',
      finalFont: "'Bebas Neue', sans-serif",
      fontSizeDesktop: 'clamp(5.4rem, 11.5vw, 11.5rem)',
      fontSizeMobile: '20vw',
    },
  ], []);

  const allLetters = useMemo(() => [...topRowLetters, ...bottomRowLetters], [topRowLetters, bottomRowLetters]);

  // Current active font for each character during the scramble
  const [currentFonts, setCurrentFonts] = useState<string[]>(() =>
    allLetters.map((l) => l.finalFont)
  );

  // Which letters have locked into their final form
  const [lockedIndices, setLockedIndices] = useState<boolean[]>(() =>
    new Array(allLetters.length).fill(false)
  );

  useEffect(() => {
    // 1. Progress increment animation (~2.8s total duration)
    const startTime = Date.now();
    const duration = 2800;

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(progressInterval);
      }
    }, 25);

    // 2. Kinetic typography scramble
    // Each letter scrambles rapidly and locks in progressively left-to-right
    const scrambleInterval = setInterval(() => {
      setCurrentFonts((prev) =>
        prev.map((font, idx) => {
          if (lockedIndices[idx]) {
            return allLetters[idx].finalFont;
          }
          const randomFont = SCRAMBLE_FONTS[Math.floor(Math.random() * SCRAMBLE_FONTS.length)];
          return randomFont;
        })
      );
    }, 75);

    // Stagger locking each letter from left to right as progress advances
    const lockTimers: NodeJS.Timeout[] = [];
    allLetters.forEach((_, idx) => {
      // First letter locks at 500ms, last letter locks at 2200ms
      const lockDelay = 500 + (idx / allLetters.length) * 1700;
      const t = setTimeout(() => {
        setLockedIndices((prev) => {
          const updated = [...prev];
          updated[idx] = true;
          return updated;
        });
        setCurrentFonts((prev) => {
          const updated = [...prev];
          updated[idx] = allLetters[idx].finalFont;
          return updated;
        });
      }, lockDelay);
      lockTimers.push(t);
    });

    // 3. Trigger exit sequence at completion
    const exitTimer = setTimeout(() => {
      clearInterval(scrambleInterval);
      // Ensure all letters are locked into final resting form
      setLockedIndices(new Array(allLetters.length).fill(true));
      setCurrentFonts(allLetters.map((l) => l.finalFont));

      // Trigger Samu Clima signature slide up with 40px rounded corners
      setIsExiting(true);

      // After slide up animation finishes (1000ms), unmount & notify
      setTimeout(() => {
        setIsVisible(false);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('preloader-finished'));
        }
        if (onComplete) onComplete();
      }, 1050);
    }, 3100);

    return () => {
      clearInterval(progressInterval);
      clearInterval(scrambleInterval);
      lockTimers.forEach(clearTimeout);
      clearTimeout(exitTimer);
    };
  }, [allLetters, onComplete, lockedIndices]);

  if (!isVisible) return null;

  return (
    <div
      id="samuclima-preloader"
      role="presentation"
      style={{
        transition: 'transform 1s cubic-bezier(0.7, 0, 0.3, 1), border-radius 1s cubic-bezier(0.7, 0, 0.3, 1)',
        transform: isExiting ? 'translateY(-100%)' : 'translateY(0%)',
        borderRadius: isExiting ? '0 0 44px 44px' : '0 0 0 0',
      }}
      className="fixed inset-0 z-[10000] flex flex-col justify-between items-center overflow-hidden select-none pointer-events-auto"
    >
      {/* =========================================================
          BACKGROUND: LUXURY ROSÉ DEGRADÉ (PALETA ROSA DE LA WEB)
          Vibrant rose (#FF6599) -> Signature (#E0457B) -> Velvet Berry (#8A1E4A)
      ========================================================= */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none transition-all duration-1000"
        style={{
          background: 'linear-gradient(145deg, #FF70A6 0%, #E0457B 38%, #A82054 75%, #420C24 100%)',
        }}
      />

      {/* Atmospheric radial glow in champagne for high-end luminosity */}
      <div 
        className="absolute inset-0 z-1 pointer-events-none opacity-45 mix-blend-soft-light"
        style={{
          background: 'radial-gradient(ellipse at 50% 45%, #FFE9D6 0%, rgba(224, 69, 123, 0) 70%)',
        }}
      />

      {/* Subtle fine noise texture */}
      <div 
        className="absolute inset-0 z-1 pointer-events-none opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* =========================================================
          TOP BAR TELEMETRY (Minimalist Haute Horlogerie)
      ========================================================= */}
      <header className="relative z-10 w-full px-6 sm:px-12 pt-7 sm:pt-9 flex items-center justify-between text-[#FFE9D6]/85 font-['DM_Sans'] text-[11px] sm:text-xs tracking-[0.25em] uppercase font-semibold">
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FFE9D6] animate-pulse" />
          <span>THIAGO VSC</span>
        </div>
        <div className="tracking-[0.3em] opacity-80 hidden sm:block">
          MADRID // 2026 EDITION
        </div>
        <div className="font-mono text-[11px]">
          {progress < 10 ? `0${progress}` : progress}%
        </div>
      </header>

      {/* =========================================================
          CENTER STAGE: SAMU CLIMA MULTI-FONT LOGO CLASH
          Two tight rows: "THIAGO" & "V · S · C"
      ========================================================= */}
      <div className="relative z-10 my-auto flex flex-col items-center justify-center px-4 w-full max-w-6xl text-center">
        
        {/* ROW 1: "THIAGO" */}
        <div className="flex items-baseline justify-center leading-none text-[#FFE9D6] drop-shadow-[0_4px_30px_rgba(66,12,36,0.45)]">
          {topRowLetters.map((item, i) => {
            const font = currentFonts[i] || item.finalFont;
            return (
              <div
                key={`top-${i}`}
                style={{
                  marginRight: item.marginRight,
                  marginLeft: item.marginLeft,
                  transform: item.yOffset ? `translateY(${item.yOffset})` : undefined,
                }}
                className="relative inline-flex items-baseline justify-center"
              >
                {/* Samu Clima Signature Overline Bar over the 'T' */}
                {item.hasOverline && (
                  <span
                    className="absolute -top-[0.06em] left-0 w-full h-[8px] sm:h-[13px] md:h-[16px] bg-[#FFE9D6] rounded-sm pointer-events-none shadow-sm"
                  />
                )}

                <span
                  style={{
                    fontFamily: font,
                    fontSize: item.fontSizeDesktop,
                    lineHeight: 0.9,
                  }}
                  className="inline-block transition-all duration-75 select-none"
                >
                  {item.char}
                </span>
              </div>
            );
          })}
        </div>

        {/* ROW 2: "V · S · C" */}
        <div 
          className="flex items-baseline justify-center leading-none text-[#FFE9D6] drop-shadow-[0_4px_30px_rgba(66,12,36,0.45)] -mt-2 sm:-mt-6 md:-mt-10"
        >
          {bottomRowLetters.map((item, i) => {
            const globalIndex = topRowLetters.length + i;
            const font = currentFonts[globalIndex] || item.finalFont;
            return (
              <div
                key={`bottom-${i}`}
                style={{
                  marginRight: item.marginRight,
                  marginLeft: item.marginLeft,
                  transform: item.yOffset ? `translateY(${item.yOffset})` : undefined,
                }}
                className="relative inline-flex items-baseline justify-center"
              >
                <span
                  style={{
                    fontFamily: font,
                    fontSize: item.fontSizeDesktop,
                    lineHeight: 0.9,
                  }}
                  className="inline-block transition-all duration-75 select-none"
                >
                  {item.char}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================
          BOTTOM PROGRESS GAUGE (Identical to Samu Clima #intro-progress)
      ========================================================= */}
      <footer className="relative z-10 w-full pb-8 sm:pb-12 flex flex-col items-center justify-center gap-3">
        {/* Thin 3px Progress Track */}
        <div className="w-[min(260px,65vw)] h-[3px] bg-black/15 dark:bg-white/20 rounded-full overflow-hidden">
          <div
            style={{ width: `${progress}%` }}
            className="h-full bg-[#FFE9D6] rounded-full will-change-[width] transition-all duration-75 shadow-[0_0_8px_rgba(255,233,214,0.8)]"
          />
        </div>

        {/* Percentage Counter in DM Sans bold, tracked out */}
        <div className="text-[#FFE9D6] font-['DM_Sans'] text-[11px] sm:text-xs font-bold tracking-[3px] uppercase">
          {progress}%
        </div>
      </footer>
    </div>
  );
};
