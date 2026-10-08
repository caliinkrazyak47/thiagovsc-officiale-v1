'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export const ThiagoPreloader: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const signaturePathRef = useRef<SVGPathElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setIsVisible(false);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('preloader-finished'));
        }
        if (onComplete) onComplete();
      }
    });
    
    tlRef.current = tl;

    // 1. Draw the signature T elegantly
    if (signaturePathRef.current) {
      const length = signaturePathRef.current.getTotalLength();
      gsap.set(signaturePathRef.current, { strokeDasharray: length, strokeDashoffset: length });
      tl.to(signaturePathRef.current, {
        strokeDashoffset: 0,
        duration: 1.5,
        ease: 'power2.inOut'
      }, 0);
    }

    // 2. Animate percentage 0 to 100
    const progress = { value: 0 };
    tl.to(progress, {
      value: 100,
      duration: 2,
      ease: 'power1.inOut',
      onUpdate: () => {
        if (percentRef.current) {
          percentRef.current.innerText = `${Math.round(progress.value)}%`;
        }
      }
    }, 0);

    // 3. Reveal Name and Subtitle
    tl.fromTo(nameRef.current, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 1, ease: 'power3.out' }, 0.2);
    tl.fromTo(subtitleRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.5);

    // 4. Wait a bit at 100% so the user can see the signature
    tl.to({}, { duration: 1.0 });

    // 5. Premium Reveal Exit (Split screen or Curtain up)
    tl.to(containerRef.current, {
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)', // Wipes UP
      duration: 1,
      ease: 'power4.inOut'
    });

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[10000] flex flex-col justify-center items-center pointer-events-auto"
      style={{ 
        backgroundColor: '#E0457B',
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'
      }}
    >
      <div className="relative z-10 flex flex-col items-center justify-center w-full px-4">
        
        {/* MAIN TITLE */}
        <div ref={nameRef} className="flex flex-row items-center justify-center font-['Anton'] tracking-normal select-none uppercase leading-[0.85]" style={{ fontSize: 'clamp(4rem, 16vw, 12rem)' }}>
          <span className="text-white">THIAGO</span>
          <span className="text-[#E4003E] ml-2 md:ml-4">VSC</span>
        </div>

        {/* SUBTITLE */}
        <div ref={subtitleRef} className="mt-4 md:mt-6 font-['Jost'] font-bold text-white tracking-[0.2em] md:tracking-[0.3em] uppercase text-[10px] md:text-sm drop-shadow-sm z-20">
          PAGE OFFICIELLE
        </div>

        {/* ELEGANT SIGNATURE (T) */}
        <div className="absolute top-[100%] left-1/2 -translate-x-1/2 mt-4 md:mt-8 w-[200px] md:w-[300px] pointer-events-none opacity-90 mix-blend-overlay">
          <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              ref={signaturePathRef}
              d="M80 120 C120 70, 200 40, 320 60 C350 65, 360 80, 340 95 C300 120, 260 140, 240 180 C210 240, 220 280, 250 270 C280 260, 320 200, 360 160 M250 90 C220 150, 180 220, 140 250 C110 270, 80 260, 100 230 C130 180, 190 140, 260 120"
              stroke="#FFFFFF"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.15))' }}
            />
          </svg>
        </div>
      </div>

      {/* Loading Percentage */}
      <div ref={percentRef} className="absolute bottom-8 right-8 text-white font-['Anton'] text-4xl sm:text-6xl opacity-40 mix-blend-overlay tracking-widest">
        0%
      </div>
    </div>
  );
};
