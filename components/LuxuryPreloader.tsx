'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { useMediaStore } from '@/lib/mediaStore';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(CustomEase);
  try {
    CustomEase.create('curtainEase', '0.76, 0, 0.24, 1');
  } catch {}
}

export const LuxuryPreloader: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isQuickSession, setIsQuickSession] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const topCurtainRef = useRef<HTMLDivElement>(null);
  const bottomCurtainRef = useRef<HTMLDivElement>(null);
  const logoWrapperRef = useRef<HTMLDivElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  const { setSoundEnabled } = useMediaStore();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check sessionStorage
    const visited = sessionStorage.getItem('thiago_preloader_seen');
    if (visited) {
      setIsQuickSession(true);
      // Fast path 600ms
      const obj = { val: 0 };
      gsap.to(obj, {
        val: 100,
        duration: 0.5,
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

    // Initial logo reveal animation
    if (logoWrapperRef.current) {
      gsap.fromTo(
        logoWrapperRef.current,
        {
          clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)',
          scale: 0.92,
        },
        {
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          scale: 1,
          duration: 1.2,
          ease: 'power3.out',
        }
      );

      // Subtle float loop (y: ±6px)
      gsap.to(logoWrapperRef.current, {
        y: -6,
        duration: 1.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }

    // Light flash / destello
    if (shineRef.current) {
      gsap.fromTo(
        shineRef.current,
        { x: '-150%' },
        {
          x: '250%',
          duration: 1.6,
          repeat: -1,
          repeatDelay: 1.8,
          ease: 'power2.inOut',
        }
      );
    }

    // Real progress tracking
    let loadedItems = 0;
    const totalItems = 3;

    const tickProgress = () => {
      loadedItems++;
      const targetPercent = Math.min(100, Math.round((loadedItems / totalItems) * 100));
      gsap.to(
        { p: progress },
        {
          p: targetPercent,
          duration: 0.6,
          onUpdate: function () {
            setProgress(Math.round(this.targets()[0].p));
          },
          onComplete: () => {
            if (loadedItems >= totalItems) {
              setProgress(100);
              setIsReady(true);
            }
          },
        }
      );
    };

    // 1. Fonts ready
    if (document.fonts) {
      document.fonts.ready.then(tickProgress).catch(tickProgress);
    } else {
      setTimeout(tickProgress, 200);
    }

    // 2. Hero video or image ready
    const heroVid = document.createElement('video');
    heroVid.src = '/videos/hero.mp4';
    heroVid.onloadedmetadata = () => tickProgress();
    heroVid.onerror = () => tickProgress();

    // 3. Brand logo image load
    const img = new Image();
    img.src = '/brand/logo.png';
    img.onload = () => tickProgress();
    img.onerror = () => tickProgress();

    // Safety timeout: max 2.8s
    const timeout = setTimeout(() => {
      setProgress(100);
      setIsReady(true);
    }, 2800);

    return () => clearTimeout(timeout);
  }, []);

  const handleExit = (withSound: boolean) => {
    setSoundEnabled(withSound);

    const tl = gsap.timeline({
      onComplete: () => {
        setIsVisible(false);
        if (onComplete) onComplete();
      },
    });

    // Fade out logo and buttons
    if (logoWrapperRef.current) {
      tl.to([logoWrapperRef.current, buttonsRef.current], {
        opacity: 0,
        scale: 0.95,
        duration: 0.4,
        ease: 'power2.in',
      });
    }

    // Split curtain exit in 2 panels
    tl.to(
      topCurtainRef.current,
      {
        yPercent: -100,
        duration: 1.1,
        ease: 'curtainEase',
      },
      '-=0.1'
    ).to(
      bottomCurtainRef.current,
      {
        yPercent: 100,
        duration: 1.1,
        ease: 'curtainEase',
      },
      '<'
    );
  };

  if (!isVisible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[10000] pointer-events-auto select-none overflow-hidden flex flex-col items-center justify-center"
      style={{ backgroundColor: 'transparent' }}
    >
      {/* Top Curtain Panel */}
      <div
        ref={topCurtainRef}
        className="absolute top-0 inset-x-0 h-1/2 bg-[#E0457B] z-10 will-change-transform"
      />

      {/* Bottom Curtain Panel */}
      <div
        ref={bottomCurtainRef}
        className="absolute bottom-0 inset-x-0 h-1/2 bg-[#E0457B] z-10 will-change-transform"
      />

      {/* Center Content */}
      <div className="relative z-20 flex flex-col items-center justify-center px-4 w-full max-w-4xl">
        {/* Logo Wrapper */}
        <div
          ref={logoWrapperRef}
          className="relative max-w-[90vw] overflow-hidden will-change-transform flex items-center justify-center py-4"
        >
          <img
            src="/brand/logo.png"
            alt="THIAGO VSC"
            className="w-auto max-h-[140px] sm:max-h-[180px] md:max-h-[220px] object-contain"
          />

          {/* Light sweep destello (banda sólida --champagne al 35%, 20° de inclinación, screen) */}
          <div
            ref={shineRef}
            className="absolute -inset-y-12 w-28 bg-[#FFE9D6]/35 rotate-[20deg] pointer-events-none"
            style={{ mixBlendMode: 'screen' }}
          />
        </div>

        {/* Buttons appearing at 100% */}
        {isReady && !isQuickSession && (
          <div
            ref={buttonsRef}
            className="mt-8 flex flex-col sm:flex-row items-center gap-4 animate-in fade-in zoom-in-95 duration-500"
          >
            <button
              type="button"
              onClick={() => handleExit(true)}
              className="px-7 py-3 rounded-full bg-[#FFE9D6] text-[#A3285C] font-jost text-xs uppercase tracking-[0.2em] font-medium shadow-luxury hover:scale-105 active:scale-95 transition-transform cursor-pointer"
            >
              Entrar con sonido
            </button>
            <button
              type="button"
              onClick={() => handleExit(false)}
              className="px-7 py-3 rounded-full border border-[#FFE9D6] text-[#FFE9D6] font-jost text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#FFE9D6]/15 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              Entrar sin sonido
            </button>
          </div>
        )}
      </div>

      {/* Real Progress Counter in Jost bottom right */}
      <div className="absolute bottom-8 right-8 z-20 font-jost text-sm tracking-[0.25em] text-[#FFE9D6] tabular-nums">
        {progress < 10 ? `0${progress}` : progress} / 100
      </div>
    </div>
  );
};
