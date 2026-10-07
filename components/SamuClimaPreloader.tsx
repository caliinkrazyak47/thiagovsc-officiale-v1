'use client';

import React, { useEffect, useState, useMemo } from 'react';

// The 4 font classes of Samu Clima
const FONT_STYLES = [
  { className: 'font-clarika', family: "'DM Sans', 'Montserrat', sans-serif", weight: '800' },
  { className: 'font-bebas', family: "'Bebas Neue', sans-serif", weight: '400' },
  { className: 'font-bernard', family: "'Playfair Display', 'Bodoni Moda', 'Impact', serif", weight: '900' },
  { className: 'font-corsiva', family: "'Italianno', 'Playfair Display', cursive", weight: '400', isItalic: true },
];

interface LetterConfig {
  char: string;
  restingStyleIndex: number; // Index in FONT_STYLES for the final form
  fontSize: string;
  hasOverline?: boolean;
  marginRight?: string;
  marginLeft?: string;
  yOffset?: string;
}

export const SamuClimaPreloader: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(0);

  // Exact letter setup for THIAGO (Row 1) and V · S · C (Row 2) mimicking Samu Clima's eclectic mix
  const topRow: LetterConfig[] = useMemo(() => [
    {
      char: 'T',
      restingStyleIndex: 0, // Clarika (Geometric Sans) with overline bar
      fontSize: 'clamp(4.8rem, 11.5vw, 11.5rem)',
      hasOverline: true,
      marginRight: '0.04em',
    },
    {
      char: 'H',
      restingStyleIndex: 1, // Bebas Neue (Tall Condensed Sans)
      fontSize: 'clamp(5.4rem, 12.8vw, 12.8rem)',
      marginRight: '0.02em',
      marginLeft: '-0.02em',
    },
    {
      char: 'i',
      restingStyleIndex: 3, // Corsiva (Calligraphic Cursive lowercase with high flourish)
      fontSize: 'clamp(7.6rem, 17.5vw, 17.5rem)',
      marginRight: '0.02em',
      marginLeft: '-0.06em',
      yOffset: '0.04em',
    },
    {
      char: 'a',
      restingStyleIndex: 2, // Bernard (Chunky Vintage Serif lowercase)
      fontSize: 'clamp(4.5rem, 10.5vw, 10.5rem)',
      marginRight: '0.02em',
      marginLeft: '-0.02em',
    },
    {
      char: 'g',
      restingStyleIndex: 3, // Corsiva (Cursive lowercase g with elegant hanging loop)
      fontSize: 'clamp(7.2rem, 16.5vw, 16.5rem)',
      marginRight: '0.02em',
      marginLeft: '-0.04em',
      yOffset: '0.03em',
    },
    {
      char: 'o',
      restingStyleIndex: 0, // Clarika (Bold Geometric Circle)
      fontSize: 'clamp(4.5rem, 10.5vw, 10.5rem)',
    },
  ], []);

  const bottomRow: LetterConfig[] = useMemo(() => [
    {
      char: 'V',
      restingStyleIndex: 2, // Bernard (Heavy Serif Uppercase)
      fontSize: 'clamp(4.8rem, 11vw, 11rem)',
      marginRight: '0.03em',
    },
    {
      char: '·',
      restingStyleIndex: 2, // Graphic Dot Bullet
      fontSize: 'clamp(3.8rem, 8.5vw, 8.5rem)',
      marginRight: '0.05em',
      marginLeft: '0.03em',
      yOffset: '-0.06em',
    },
    {
      char: 's',
      restingStyleIndex: 3, // Corsiva (Calligraphic Script lowercase s)
      fontSize: 'clamp(7.5rem, 17vw, 17rem)',
      marginRight: '0.02em',
      marginLeft: '-0.04em',
      yOffset: '0.03em',
    },
    {
      char: '·',
      restingStyleIndex: 2, // Graphic Dot Bullet
      fontSize: 'clamp(3.8rem, 8.5vw, 8.5rem)',
      marginRight: '0.04em',
      marginLeft: '0.04em',
      yOffset: '-0.06em',
    },
    {
      char: 'C',
      restingStyleIndex: 1, // Bebas Neue (Tall Condensed Uppercase C)
      fontSize: 'clamp(5.4rem, 12.8vw, 12.8rem)',
    },
  ], []);

  const allLetters = useMemo(() => [...topRow, ...bottomRow], [topRow, bottomRow]);

  // Current font style index for each letter during the scramble
  const [activeStyles, setActiveStyles] = useState<number[]>(() =>
    allLetters.map((l) => l.restingStyleIndex)
  );

  useEffect(() => {
    // Total time for 0% to 100%: exactly 2.4 seconds
    const TOTAL_DURATION = 2400;
    const startTime = Date.now();

    // 1. Progress counter (0 to 100%)
    const progressTimer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentPct = Math.min(100, Math.round((elapsed / TOTAL_DURATION) * 100));
      setProgress(currentPct);

      if (currentPct >= 100) {
        clearInterval(progressTimer);
      }
    }, 20);

    // 2. Font Scramble: while running, letters scramble between the 4 font families
    const scrambleTimer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const fraction = Math.min(1, elapsed / TOTAL_DURATION);

      setActiveStyles((prev) =>
        prev.map((currentIdx, letterIdx) => {
          // Progressively lock letters from left to right as fraction increases
          const lockThreshold = 0.2 + (letterIdx / allLetters.length) * 0.75;
          if (fraction >= lockThreshold) {
            return allLetters[letterIdx].restingStyleIndex;
          }
          // Random scramble between the 4 font styles
          return Math.floor(Math.random() * FONT_STYLES.length);
        })
      );
    }, 60);

    // 3. Exactly when it hits 100% (TOTAL_DURATION), exit immediately!
    const exitTimer = setTimeout(() => {
      clearInterval(scrambleTimer);
      // Lock all letters to their final resting styles
      setActiveStyles(allLetters.map((l) => l.restingStyleIndex));

      // Trigger Samu Clima signature slide up with 44px rounded corners
      setIsExiting(true);

      // Complete unmount after slide-up duration
      setTimeout(() => {
        setIsVisible(false);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('preloader-finished'));
        }
        if (onComplete) onComplete();
      }, 950);
    }, TOTAL_DURATION + 100);

    return () => {
      clearInterval(progressTimer);
      clearInterval(scrambleTimer);
      clearTimeout(exitTimer);
    };
  }, [allLetters, onComplete]);

  if (!isVisible) return null;

  return (
    <div
      id="samuclima-preloader"
      role="presentation"
      style={{
        transition: 'transform 0.9s cubic-bezier(0.7, 0, 0.3, 1), border-radius 0.9s cubic-bezier(0.7, 0, 0.3, 1)',
        transform: isExiting ? 'translateY(-100%)' : 'translateY(0%)',
        borderRadius: isExiting ? '0 0 44px 44px' : '0 0 0 0',
      }}
      className="fixed inset-0 z-[10000] flex flex-col justify-between items-center overflow-hidden select-none pointer-events-auto"
    >
      {/* =========================================================
          BACKGROUND: 100% PURE ROSA DEGRADÉ (SIN SOMBRAS NI COLORES OSCUROS)
          Rosa pétalo radiante -> Rosa fucsia couture -> Rosa marca
      ========================================================= */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, #FFB2CE 0%, #FF7DA8 32%, #FF508D 68%, #E0457B 100%)',
        }}
      />

      {/* Resplandor suave blanco/champagne luminoso sin oscuridad */}
      <div 
        className="absolute inset-0 z-1 pointer-events-none opacity-30 mix-blend-overlay"
        style={{
          background: 'radial-gradient(circle at 50% 45%, #FFFFFF 0%, rgba(255, 178, 206, 0) 75%)',
        }}
      />

      {/* =========================================================
          HEADER: TELEMETRY (Minimalist studio stamp)
      ========================================================= */}
      <header className="relative z-10 w-full px-6 sm:px-12 pt-7 sm:pt-9 flex items-center justify-between text-[#FFE9D6] font-['DM_Sans'] text-[11px] sm:text-xs tracking-[0.25em] uppercase font-semibold">
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span>THIAGO VSC</span>
        </div>
        <div className="tracking-[0.28em] text-white/90 hidden sm:block">
          MADRID // OFFICIAL BROADCAST
        </div>
        <div className="font-mono text-[11px] tabular-nums text-white">
          {progress < 10 ? `0${progress}` : progress}%
        </div>
      </header>

      {/* =========================================================
          CENTER STAGE: SAMU CLIMA LOGOTYPE REPLICATION
          Two tight rows: "THIAGO" & "V · S · C"
      ========================================================= */}
      <div className="relative z-10 my-auto flex flex-col items-center justify-center px-4 w-full max-w-5xl text-center">
        
        {/* ROW 1: "THIAGO" (Sin sombras oscuras, resplandor limpio blanco/champagne) */}
        <div className="flex items-baseline justify-center leading-none text-white drop-shadow-[0_2px_18px_rgba(255,255,255,0.45)]">
          {topRow.map((item, i) => {
            const style = FONT_STYLES[activeStyles[i]] || FONT_STYLES[item.restingStyleIndex];
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
                {/* Samu Clima Signature Overline Bar over the T */}
                {item.hasOverline && (
                  <span
                    className="absolute -top-[0.06em] left-0 w-full h-[7px] sm:h-[12px] md:h-[15px] bg-[#FFE9D6] rounded-sm pointer-events-none shadow-sm"
                  />
                )}

                <span
                  style={{
                    fontFamily: style.family,
                    fontWeight: style.weight,
                    fontStyle: style.isItalic ? 'italic' : 'normal',
                    fontSize: item.fontSize,
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

        {/* ROW 2: "V · S · C" (Tightly nested under Row 1, matching Samu Clima's -85px negative margin) */}
        <div 
          className="flex items-baseline justify-center leading-none text-white drop-shadow-[0_2px_18px_rgba(255,255,255,0.45)] -mt-3 sm:-mt-8 md:-mt-12"
        >
          {bottomRow.map((item, i) => {
            const globalIndex = topRow.length + i;
            const style = FONT_STYLES[activeStyles[globalIndex]] || FONT_STYLES[item.restingStyleIndex];
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
                    fontFamily: style.family,
                    fontWeight: style.weight,
                    fontStyle: style.isItalic ? 'italic' : 'normal',
                    fontSize: item.fontSize,
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
      <footer className="relative z-10 w-full pb-8 sm:pb-12 flex flex-col items-center justify-center gap-2.5">
        {/* Minimalist 3px Progress Track (blanco translúcido sobre fondo rosa) */}
        <div className="w-[min(260px,65vw)] h-[3px] bg-white/30 rounded-full overflow-hidden">
          <div
            style={{ width: `${progress}%` }}
            className="h-full bg-white rounded-full will-change-[width] transition-all duration-75 shadow-[0_0_10px_rgba(255,255,255,0.9)]"
          />
        </div>

        {/* Percentage Counter in DM Sans bold, tracked out */}
        <div className="text-white font-['DM_Sans'] text-[11px] sm:text-xs font-bold tracking-[3px] uppercase">
          {progress}%
        </div>
      </footer>
    </div>
  );
};
