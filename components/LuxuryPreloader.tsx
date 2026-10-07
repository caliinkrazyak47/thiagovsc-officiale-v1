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

export const LuxuryPreloader: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isQuickSession, setIsQuickSession] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const topCurtainRef = useRef<HTMLDivElement>(null);
  const bottomCurtainRef = useRef<HTMLDivElement>(null);
  const fillImgRef = useRef<HTMLImageElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const centerStageRef = useRef<HTMLDivElement>(null);

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
        scale: 0.96,
        duration: 0.4,
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
      '-=0.1'
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
        duration: 0.4,
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

    let animId: number;
    let currentP = 0;
    let targetP = 0;

    function getWaveClip(p: number, time: number) {
      const amplitude = 4 * Math.sin((Math.PI * Math.min(p, 100)) / 100) + (p > 0 && p < 100 ? 1.5 : 0);
      const yLevel = 100 - p;
      const points = ['0% 100%'];
      for (let x = 0; x <= 100; x += 4) {
        const waveY = yLevel + amplitude * Math.sin((x / 100) * Math.PI * 4 + time / 260);
        points.push(`${x}% ${Math.max(0, Math.min(100, waveY)).toFixed(2)}%`);
      }
      points.push('100% 100%');
      return `polygon(${points.join(', ')})`;
    }

    let loadedItems = 0;
    const totalItems = 3;

    const onAssetLoaded = () => {
      loadedItems++;
      targetP = Math.min(100, Math.round((loadedItems / totalItems) * 100));
    };

    if (document.fonts) {
      document.fonts.ready.then(onAssetLoaded).catch(onAssetLoaded);
    } else {
      setTimeout(onAssetLoaded, 200);
    }

    const heroVid = document.createElement('video');
    heroVid.src = '/videos/hero.mp4';
    heroVid.onloadedmetadata = onAssetLoaded;
    heroVid.onerror = onAssetLoaded;

    const img = new Image();
    img.src = '/brand/thiagovsc-script-transparent.png';
    img.onload = onAssetLoaded;
    img.onerror = onAssetLoaded;

    // Smooth increment
    const interval = setInterval(() => {
      targetP = Math.min(100, targetP + 10);
    }, 150);

    let autoEnterTimer: NodeJS.Timeout | null = null;

    const tick = (now: number) => {
      currentP += (targetP - currentP) * 0.1;

      if (fillImgRef.current) {
        fillImgRef.current.style.clipPath = getWaveClip(currentP, now);
      }

      const displayInt = Math.min(100, Math.round(currentP));
      setProgress(displayInt);

      if (displayInt >= 100 && targetP >= 100) {
        clearInterval(interval);
        setIsReady(true);
        // Auto exit after 2.2s if no button clicked
        if (!autoEnterTimer) {
          autoEnterTimer = setTimeout(() => {
            handleExit(false);
          }, 2200);
        }
        return;
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    return () => {
      clearInterval(interval);
      if (autoEnterTimer) clearTimeout(autoEnterTimer);
      cancelAnimationFrame(animId);
    };
  }, [handleExit]);

  if (!isVisible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[10000] pointer-events-auto select-none overflow-hidden flex flex-col items-center justify-center bg-[#E0457B]"
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
      <div
        ref={centerStageRef}
        className="relative z-20 flex flex-col items-center justify-center px-6 w-full max-w-2xl my-auto"
      >
        {/* Liquid script logo stage */}
        <div className="relative w-full max-w-[min(460px,80vw)] aspect-[1024/434] flex items-center justify-center">
          {/* Ghost / Outline Layer */}
          <img
            src="/brand/thiagovsc-script-transparent.png"
            alt="Thiagovsc"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none opacity-20"
          />

          {/* Liquid Fill Layer */}
          <img
            ref={fillImgRef}
            src="/brand/thiagovsc-script-transparent.png"
            alt="Thiagovsc Liquid Fill"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none will-change-[clip-path]"
            style={{
              clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
              filter: 'drop-shadow(0 0 16px rgba(255, 233, 214, 0.6))',
            }}
          />
        </div>

        {/* Status / Percentage Counter */}
        <div className="mt-8 font-satoshi text-xs uppercase tracking-[0.28em] text-[#FFE9D6] tabular-nums font-medium flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FFE9D6] animate-pulse" />
          <span>{isReady ? 'LISTO · 100%' : `CARGANDO · ${progress < 10 ? `0${progress}` : progress}%`}</span>
        </div>

        {/* Audio Unlock Buttons */}
        <div
          ref={buttonsRef}
          className={`mt-6 flex flex-col sm:flex-row items-center gap-3.5 transition-all duration-300 ${
            isReady && !isQuickSession ? 'opacity-100 pointer-events-auto scale-100' : 'opacity-0 pointer-events-none scale-95'
          }`}
        >
          <button
            type="button"
            onClick={() => handleExit(true)}
            className="px-6 py-2.5 rounded-full bg-[#FFE9D6] text-[#A3285C] font-satoshi text-xs uppercase tracking-[0.2em] font-medium shadow-luxury hover:scale-105 active:scale-95 transition-transform cursor-pointer"
          >
            Entrar con sonido
          </button>
          <button
            type="button"
            onClick={() => handleExit(false)}
            className="px-6 py-2.5 rounded-full border border-[#FFE9D6] text-[#FFE9D6] font-satoshi text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#FFE9D6]/15 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            Entrar sin sonido
          </button>
        </div>
      </div>

      {/* Corner Minimal Indicator */}
      <div className="absolute bottom-6 right-8 z-20 font-satoshi text-xs tracking-[0.25em] text-[#FFE9D6]/80 tabular-nums uppercase">
        {progress < 10 ? `0${progress}` : progress} / 100
      </div>
    </div>
  );
};
