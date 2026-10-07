'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { useMediaStore } from '@/lib/mediaStore';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(CustomEase);
  try {
    CustomEase.create('curtainEase', '0.76, 0, 0.24, 1');
  } catch {}
}

const ButterflyIcon = ({ size = 16, color = '#FFE9D6', className = '' }: { size?: number; color?: string; className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block ${className}`}
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
  const [statusText, setStatusText] = useState('INICIALIZANDO SISTEMA 4K');
  const [isQuickSession, setIsQuickSession] = useState(false);

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
        if (onComplete) onComplete();
      },
    });

    if (centerStageRef.current) {
      tl.to(centerStageRef.current, {
        opacity: 0,
        scale: 1.04,
        y: -15,
        duration: 0.45,
        ease: 'power2.in',
      });
    }

    tl.to(
      topCurtainRef.current,
      {
        yPercent: -100,
        duration: 1.0,
        ease: 'curtainEase',
      },
      '-=0.15'
    ).to(
      bottomCurtainRef.current,
      {
        yPercent: 100,
        duration: 1.0,
        ease: 'curtainEase',
      },
      '<'
    );
  }, [onComplete, setSoundEnabled]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const visited = sessionStorage.getItem('thiago_preloader_seen');
    if (visited) {
      setIsQuickSession(true);
      const obj = { val: 0 };
      gsap.to(obj, {
        val: 100,
        duration: 0.3,
        ease: 'power1.out',
        onUpdate: () => setProgress(Math.round(obj.val)),
        onComplete: () => {
          setIsReady(true);
          handleExit(false);
        },
      });
      return;
    }

    sessionStorage.setItem('thiago_preloader_seen', 'true');

    // 1. Reveal letters with GSAP stagger
    const letters = containerRef.current?.querySelectorAll('.preloader-letter');
    if (letters && letters.length > 0) {
      gsap.fromTo(
        letters,
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          stagger: 0.045,
          duration: 0.85,
          ease: 'power3.out',
          delay: 0.1,
        }
      );
    }

    // 2. Progress timeline
    const progressObj = { val: 0 };
    let autoExitTimer: NodeJS.Timeout | null = null;

    const progressTween = gsap.to(progressObj, {
      val: 100,
      duration: 2.2,
      ease: 'power2.inOut',
      onUpdate: () => {
        const p = Math.round(progressObj.val);
        setProgress(p);
        if (p < 25) {
          setStatusText('SINTONIZANDO SEÑAL 4K');
        } else if (p < 60) {
          setStatusText('CALIBRANDO AUDIO DE ALTA DEFINICIÓN');
        } else if (p < 95) {
          setStatusText('SINCRONIZANDO EXPERIENCIA');
        } else {
          setStatusText('SISTEMA LISTO');
        }
      },
      onComplete: () => {
        setIsReady(true);
        if (buttonsRef.current) {
          gsap.fromTo(
            buttonsRef.current,
            { opacity: 0, y: 15, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power2.out' }
          );
        }
        autoExitTimer = setTimeout(() => {
          handleExit(false);
        }, 2200);
      },
    });

    return () => {
      progressTween.kill();
      if (autoExitTimer) clearTimeout(autoExitTimer);
    };
  }, [handleExit]);

  if (!isVisible) return null;

  const brandLetters = ['T', 'H', 'I', 'A', 'G', 'O', 'V', 'S', 'C'];

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[10000] pointer-events-auto select-none overflow-hidden flex flex-col items-center justify-center bg-[#E0457B]"
    >
      {/* Top Curtain Panel */}
      <div
        ref={topCurtainRef}
        className="absolute top-0 inset-x-0 h-1/2 bg-[#E0457B] z-10 will-change-transform shadow-[0_4px_30px_rgba(0,0,0,0.12)]"
      />

      {/* Bottom Curtain Panel */}
      <div
        ref={bottomCurtainRef}
        className="absolute bottom-0 inset-x-0 h-1/2 bg-[#E0457B] z-10 will-change-transform shadow-[0_-4px_30px_rgba(0,0,0,0.12)]"
      />

      {/* Center Content Stage */}
      <div
        ref={centerStageRef}
        className="relative z-20 flex flex-col items-center justify-center px-4 sm:px-8 w-full max-w-5xl my-auto text-center"
      >
        {/* Eyebrow Label */}
        <div 
          className="inline-flex items-center gap-2.5 mb-5 sm:mb-7 font-satoshi text-xs sm:text-sm tracking-[0.32em] uppercase text-[#FFE9D6]/90 font-medium"
          style={{ textShadow: '0 2px 14px rgba(163,40,92,0.4)' }}
        >
          <ButterflyIcon size={16} color="#FFE9D6" />
          <span>PLATAFORMA OFICIAL // EMISIÓN EXCLUSIVA</span>
        </div>

        {/* GRAND EDITORIAL TITLE: "THIAGOVSC" */}
        <div className="overflow-hidden py-1 px-2">
          <h1 
            className="flex items-center justify-center font-panchang font-black uppercase text-[clamp(2.4rem,8.2vw,7.5rem)] leading-none tracking-tight sm:tracking-normal text-[#FFE9D6] drop-shadow-[0_4px_30px_rgba(163,40,92,0.45)]"
            aria-label="THIAGOVSC"
          >
            {brandLetters.map((char, index) => (
              <span key={index} className="inline-block overflow-hidden py-0.5">
                <span className="preloader-letter inline-block transform-gpu will-change-transform">
                  {char}
                </span>
              </span>
            ))}
          </h1>
        </div>

        {/* Sub-headline slogan */}
        <p className="mt-3 sm:mt-5 font-satoshi text-xs sm:text-sm tracking-[0.24em] text-[#FFE9D6]/85 uppercase font-medium">
          EL RITMO DE TU MUNDO · 24/7 EN VIVO
        </p>

        {/* Sleek Minimalist Progress Track */}
        <div className="mt-8 sm:mt-10 w-full max-w-md flex flex-col items-center">
          <div className="w-full h-[2.5px] bg-[#FFE9D6]/20 rounded-full overflow-hidden relative shadow-inner">
            <div
              className="h-full bg-[#FFE9D6] rounded-full will-change-[width] shadow-[0_0_12px_rgba(255,233,214,0.8)] transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Status Label and Percentage Counter */}
          <div className="w-full mt-3 flex items-center justify-between text-[#FFE9D6] font-satoshi text-xs tracking-[0.22em] uppercase font-semibold tabular-nums">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FFE9D6] animate-pulse" />
              <span className="text-[#FFE9D6]/90">{statusText}</span>
            </div>
            <div className="text-sm font-bold tracking-widest">
              {progress < 10 ? `0${progress}` : progress}%
            </div>
          </div>
        </div>

        {/* Luxury Enter CTA on Ready */}
        <div
          ref={buttonsRef}
          className={`mt-8 flex flex-col sm:flex-row items-center gap-4 transition-all duration-300 ${
            isReady && !isQuickSession ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          <button
            type="button"
            onClick={() => handleExit(true)}
            className="group relative inline-flex items-center gap-3 px-8 py-3 rounded-full bg-[#FFE9D6] text-[#A3285C] font-satoshi text-xs uppercase tracking-[0.22em] font-bold shadow-[0_10px_30px_rgba(163,40,92,0.4)] hover:bg-white hover:scale-105 active:scale-95 transition-all cursor-pointer overflow-hidden"
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
            className="px-8 py-3 rounded-full border border-[#FFE9D6]/40 text-[#FFE9D6] font-satoshi text-xs uppercase tracking-[0.22em] font-medium hover:bg-[#FFE9D6]/15 hover:border-[#FFE9D6] hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            ENTRAR DIRECTO
          </button>
        </div>
      </div>

      {/* Footer Minimal Edition mark */}
      <div className="absolute bottom-6 inset-x-0 z-20 flex justify-between px-8 text-[#FFE9D6]/60 font-satoshi text-[11px] tracking-[0.25em] uppercase font-medium">
        <span>EST. 2026 // BARCELONA</span>
        <span className="hidden sm:inline">ALTA FIDELIDAD AUDIBLE Y VISUAL</span>
        <span>{progress < 10 ? `0${progress}` : progress} / 100</span>
      </div>
    </div>
  );
};
