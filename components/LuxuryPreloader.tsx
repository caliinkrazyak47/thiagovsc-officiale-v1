'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { useMediaStore } from '@/lib/mediaStore';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(CustomEase);
  try {
    CustomEase.create('luxuryCurtain', '0.76, 0, 0.24, 1');
  } catch {}
}

const LuxuryButterfly = ({ size = 20, color = '#FFE9D6' }: { size?: number; color?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className="inline-block shrink-0"
  >
    <path 
      d="M12 4C10.5 2 7 2 5 4.5C3 7 4 11 6 12C4 13 2.5 17 5 19.5C7.5 22 10.5 19.5 12 17C13.5 19.5 16.5 22 19 19.5C21.5 17 20 13 18 12C20 11 21 7 19 4.5C17 2 13.5 2 12 4Z" 
      stroke={color} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M12 4V17" 
      stroke={color} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
    />
    <path 
      d="M9.5 8C8.5 7.5 7 8 7 9.5" 
      stroke={color} 
      strokeWidth="1.2" 
      strokeLinecap="round" 
    />
    <path 
      d="M14.5 8C15.5 7.5 17 8 17 9.5" 
      stroke={color} 
      strokeWidth="1.2" 
      strokeLinecap="round" 
    />
  </svg>
);

export const LuxuryPreloader: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [statusText, setStatusText] = useState('01/03 · SINTONIZANDO SEÑAL 4K');

  const containerRef = useRef<HTMLDivElement>(null);
  const topCurtainRef = useRef<HTMLDivElement>(null);
  const bottomCurtainRef = useRef<HTMLDivElement>(null);
  const centerStageRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  const { setSoundEnabled } = useMediaStore();

  const handleExit = useCallback((withSound: boolean) => {
    setSoundEnabled(withSound);

    const tl = gsap.timeline({
      onComplete: () => {
        setIsVisible(false);
        if (typeof window !== 'undefined') {
          // Dispatch event so cookie consent appears exactly 800ms later
          window.dispatchEvent(new CustomEvent('preloader-finished'));
        }
        if (onComplete) onComplete();
      },
    });

    if (centerStageRef.current) {
      tl.to(centerStageRef.current, {
        opacity: 0,
        scale: 1.04,
        y: -16,
        duration: 0.45,
        ease: 'power2.in',
      });
    }

    tl.to(
      topCurtainRef.current,
      {
        yPercent: -100,
        duration: 1.05,
        ease: 'luxuryCurtain',
      },
      '-=0.1'
    ).to(
      bottomCurtainRef.current,
      {
        yPercent: 100,
        duration: 1.05,
        ease: 'luxuryCurtain',
      },
      '<'
    );
  }, [onComplete, setSoundEnabled]);

  useEffect(() => {
    // 1. Kinetic typography entrance: Stagger reveal of brand characters
    const letters = containerRef.current?.querySelectorAll('.preloader-char');
    if (letters && letters.length > 0) {
      gsap.fromTo(
        letters,
        { yPercent: 120, opacity: 0, rotateX: 20 },
        {
          yPercent: 0,
          opacity: 1,
          rotateX: 0,
          stagger: 0.04,
          duration: 0.9,
          ease: 'power3.out',
          delay: 0.1,
        }
      );
    }

    // 2. Linear progress counter with calibrated telemetry messages
    const progressObj = { val: 0 };
    let autoExitTimer: NodeJS.Timeout | null = null;

    const tween = gsap.to(progressObj, {
      val: 100,
      duration: 2.2,
      ease: 'power2.inOut',
      onUpdate: () => {
        const p = Math.round(progressObj.val);
        setProgress(p);
        if (p < 35) {
          setStatusText('01/03 · SINTONIZANDO SEÑAL 4K');
        } else if (p < 75) {
          setStatusText('02/03 · CALIBRANDO AUDIO DE ALTA DEFINICIÓN');
        } else if (p < 99) {
          setStatusText('03/03 · SINCRONIZANDO EXPERIENCIA EDITORIAL');
        } else {
          setStatusText('SISTEMA LISTO · 100%');
        }
      },
      onComplete: () => {
        setIsReady(true);
        if (buttonsRef.current) {
          gsap.fromTo(
            buttonsRef.current,
            { opacity: 0, y: 14, scale: 0.96 },
            { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'power2.out' }
          );
        }
        autoExitTimer = setTimeout(() => {
          handleExit(false);
        }, 2400);
      },
    });

    return () => {
      tween.kill();
      if (autoExitTimer) clearTimeout(autoExitTimer);
    };
  }, [handleExit]);

  if (!isVisible) return null;

  const brandChars = ['T', 'H', 'I', 'A', 'G', 'O', 'V', 'S', 'C'];

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[10000] pointer-events-auto select-none overflow-hidden flex flex-col items-center justify-between bg-[#E0457B]"
    >
      {/* Top Split Shutter Curtain */}
      <div
        ref={topCurtainRef}
        className="absolute top-0 inset-x-0 h-1/2 bg-[#E0457B] z-10 will-change-transform shadow-[0_6px_40px_rgba(43,15,30,0.2)]"
      />

      {/* Bottom Split Shutter Curtain */}
      <div
        ref={bottomCurtainRef}
        className="absolute bottom-0 inset-x-0 h-1/2 bg-[#E0457B] z-10 will-change-transform shadow-[0_-6px_40px_rgba(43,15,30,0.2)]"
      />

      {/* Atmospheric Haute Couture Radial Ambient Lighting */}
      <div 
        className="absolute inset-0 z-15 pointer-events-none opacity-60"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(255, 233, 214, 0.3) 0%, rgba(163, 40, 92, 0.65) 75%, rgba(43, 15, 30, 0.95) 100%)',
        }}
      />

      {/* Subtle Grain Overlay for Editorial Depth */}
      <div 
        className="absolute inset-0 z-15 pointer-events-none opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ====================================================
          HEADER TELEMETRY (Haute Studio Edition)
      ==================================================== */}
      <header className="relative z-20 w-full px-6 sm:px-12 py-6 flex items-center justify-between text-[#FFE9D6] font-satoshi text-[11px] sm:text-xs tracking-[0.28em] uppercase font-medium">
        <div className="flex items-center gap-3">
          <LuxuryButterfly size={18} color="#FFE9D6" />
          <span className="font-semibold">THIAGO VSC // PLATAFORMA OFICIAL</span>
        </div>

        <div className="hidden sm:flex items-center gap-6 text-[#FFE9D6]/85">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FFE9D6] animate-pulse" />
            <span>EMISIÓN CONTINUA 24/7</span>
          </div>
          <span className="opacity-30">|</span>
          <span>MADRID // 4K UHD</span>
        </div>
      </header>

      {/* ====================================================
          CENTER STAGE (Monumental Kinetic Typography)
      ==================================================== */}
      <div
        ref={centerStageRef}
        className="relative z-20 flex flex-col items-center justify-center px-4 sm:px-8 w-full max-w-5xl my-auto text-center"
      >
        {/* Sinusoidal Audio Equalizer Array */}
        <div className="flex items-end justify-center gap-1.5 h-6 mb-6 pointer-events-none">
          {[0.35, 0.75, 0.5, 0.95, 0.65, 1.0, 0.7, 0.85, 0.4].map((heightRatio, i) => (
            <span
              key={i}
              style={{
                height: `${Math.max(20, heightRatio * 100)}%`,
                animationDuration: `${0.38 + (i % 3) * 0.12}s`,
              }}
              className="w-1 rounded-full bg-[#FFE9D6] animate-pulse opacity-90 shadow-[0_0_10px_rgba(255,233,214,0.7)]"
            />
          ))}
        </div>

        {/* MONUMENTAL EDITORIAL TITLE: "THIAGOVSC" */}
        <div className="overflow-hidden py-2 px-4">
          <h1 
            className="flex items-center justify-center font-panchang font-black uppercase text-[clamp(2.6rem,8.5vw,7.8rem)] leading-none tracking-tight sm:tracking-normal text-[#FFE9D6] drop-shadow-[0_4px_35px_rgba(43,15,30,0.5)]"
            aria-label="THIAGOVSC"
          >
            {brandChars.map((char, idx) => (
              <span key={idx} className="inline-block overflow-hidden py-1">
                <span 
                  className="preloader-char inline-block transform-gpu will-change-transform bg-gradient-to-b from-white via-[#FFE9D6] to-[#FFE9D6] bg-clip-text text-transparent"
                  style={{
                    filter: 'drop-shadow(0 2px 24px rgba(255, 233, 214, 0.4))',
                  }}
                >
                  {char}
                </span>
              </span>
            ))}
          </h1>
        </div>

        {/* Slogan with Couture Ornament */}
        <div className="mt-4 flex items-center justify-center gap-3 text-[#FFE9D6]/90 font-satoshi text-xs sm:text-sm tracking-[0.3em] uppercase font-medium">
          <span>EL RITMO DE TU MUNDO</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#FFE9D6]" />
          <span>HAUTE CULTURE</span>
        </div>

        {/* Precision Progress Track & Glowing Needle */}
        <div className="mt-8 sm:mt-11 w-full max-w-md flex flex-col items-center">
          <div className="w-full h-[2.5px] bg-[#FFE9D6]/25 rounded-full overflow-hidden relative shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-[#FFE9D6]/70 via-[#FFE9D6] to-white rounded-full will-change-[width] shadow-[0_0_14px_rgba(255,233,214,0.95)] transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Telemetry Status Bar */}
          <div className="w-full mt-3.5 flex items-center justify-between text-[#FFE9D6] font-satoshi text-xs tracking-[0.22em] uppercase font-semibold tabular-nums">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FFE9D6] animate-pulse" />
              <span className="text-[#FFE9D6]/90">{statusText}</span>
            </div>
            <div className="text-sm font-bold tracking-widest text-white">
              {progress < 10 ? `0${progress}` : progress}%
            </div>
          </div>
        </div>

        {/* Interactive Decision Gate */}
        <div
          ref={buttonsRef}
          className={`mt-8 sm:mt-10 flex flex-col sm:flex-row items-center gap-4 transition-all duration-300 ${
            isReady ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          <button
            type="button"
            onClick={() => handleExit(true)}
            className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-[#FFE9D6] text-[#A3285C] font-satoshi text-xs uppercase tracking-[0.22em] font-bold shadow-[0_12px_36px_rgba(43,15,30,0.35)] hover:bg-white hover:scale-105 active:scale-95 transition-all cursor-pointer overflow-hidden"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A3285C] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#A3285C]" />
            </span>
            <span>ENTRAR CON AUDIO</span>
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
          </button>

          <button
            type="button"
            onClick={() => handleExit(false)}
            className="px-8 py-3.5 rounded-full border border-[#FFE9D6]/40 text-[#FFE9D6] font-satoshi text-xs uppercase tracking-[0.22em] font-medium hover:bg-[#FFE9D6]/15 hover:border-[#FFE9D6] hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            ENTRAR DIRECTO
          </button>
        </div>
      </div>

      {/* ====================================================
          FOOTER TELEMETRY (Couture Signature)
      ==================================================== */}
      <footer className="relative z-20 w-full px-6 sm:px-12 py-6 flex justify-between items-center text-[#FFE9D6]/75 font-satoshi text-[11px] tracking-[0.26em] uppercase font-medium">
        <span>EST. 2026 // MADRID · BARCELONA</span>
        <span className="hidden sm:inline">ALTA DEFINICIÓN AUDIBLE Y VISUAL</span>
        <span>{progress < 10 ? `0${progress}` : progress} / 100</span>
      </footer>
    </div>
  );
};
