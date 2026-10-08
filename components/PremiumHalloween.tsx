'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

export const PremiumHalloween: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const moonRef = useRef<HTMLDivElement>(null);

  // Generate 50 random embers (larger and brighter)
  const embers = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    size: Math.random() * 4 + 2, // 2px to 6px
    left: Math.random() * 100, // 0% to 100%
    duration: Math.random() * 15 + 10, // 10s to 25s
    delay: Math.random() * -30, // Start at different times
    opacity: Math.random() * 0.6 + 0.4, // 0.4 to 1.0
  }));

  // Generate a few slow bats
  const bats = Array.from({ length: 5 }).map((_, i) => ({
    id: `bat-${i}`,
    top: Math.random() * 40 + 10, // 10% to 50% from top
    duration: Math.random() * 20 + 30, // 30s to 50s crossing
    delay: Math.random() * -40,
    scale: Math.random() * 0.4 + 0.3, // 0.3 to 0.7
  }));

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Animate embers
    const emberEls = containerRef.current.querySelectorAll('.ember');
    emberEls.forEach((el, i) => {
      const ember = embers[i];
      gsap.fromTo(
        el,
        { y: '110vh', x: 0 },
        {
          y: '-10vh',
          x: () => (Math.random() - 0.5) * 200, 
          duration: ember.duration,
          delay: ember.delay,
          ease: 'none',
          repeat: -1,
        }
      );
      
      gsap.to(el, {
        opacity: ember.opacity * 0.3, // Dim slightly
        duration: Math.random() * 1.5 + 1.5,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        delay: Math.random() * 2,
      });
    });

    // Animate bats
    const batEls = containerRef.current.querySelectorAll('.bat-anim');
    batEls.forEach((el, i) => {
      const bat = bats[i];
      gsap.fromTo(
        el,
        { x: '-20vw', y: 0 },
        {
          x: '120vw',
          y: () => (Math.random() - 0.5) * 100, // Float up/down
          duration: bat.duration,
          delay: bat.delay,
          ease: 'none',
          repeat: -1,
        }
      );
    });

    // Breathing Blood Moon
    if (moonRef.current) {
      gsap.to(moonRef.current, {
        scale: 1.1,
        opacity: 0.8,
        duration: 6,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut'
      });
    }
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[45] overflow-hidden">
      {/* VIGNETTE EFFECT FOR CINEMATIC HORROR */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.15)_100%)] dark:bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.6)_100%)]" />

      {/* GIANT BLOOD MOON GLOW */}
      <div 
        ref={moonRef}
        className="absolute top-[-10%] right-[-10%] w-[70vw] h-[70vw] min-w-[500px] min-h-[500px] rounded-full opacity-60 blur-[60px] dark:opacity-80"
        style={{
          background: 'radial-gradient(circle, rgba(224, 69, 123, 0.6) 0%, rgba(163, 40, 92, 0.2) 50%, rgba(0,0,0,0) 80%)'
        }}
      />

      {/* ELEGANT COBWEBS (Top Left & Top Right) */}
      <svg className="absolute top-0 left-0 w-32 h-32 md:w-48 md:h-48 text-[var(--brand)] opacity-30 dark:opacity-40" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
        <path d="M0 0 L100 0 M0 0 L0 100 M0 0 L70 70 M0 0 L90 30 M0 0 L30 90" />
        <path d="M0 20 Q 15 15 20 0 M0 40 Q 25 30 40 0 M0 60 Q 40 45 60 0 M0 80 Q 55 60 80 0 M0 100 Q 70 75 100 0" />
      </svg>
      <svg className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 text-[var(--brand)] opacity-30 dark:opacity-40" style={{ transform: 'scaleX(-1)' }} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
        <path d="M0 0 L100 0 M0 0 L0 100 M0 0 L70 70 M0 0 L90 30 M0 0 L30 90" />
        <path d="M0 20 Q 15 15 20 0 M0 40 Q 25 30 40 0 M0 60 Q 40 45 60 0 M0 80 Q 55 60 80 0 M0 100 Q 70 75 100 0" />
      </svg>

      <div ref={containerRef} className="absolute inset-0">
        {/* RISING EMBERS */}
        {embers.map((ember) => (
          <div
            key={ember.id}
            className="ember absolute rounded-full bg-[var(--brand)] shadow-[0_0_12px_var(--brand)]"
            style={{
              left: `${ember.left}%`,
              width: `${ember.size}px`,
              height: `${ember.size}px`,
              opacity: ember.opacity,
              willChange: 'transform, opacity'
            }}
          />
        ))}

        {/* SLOW BATS */}
        {bats.map((bat) => (
          <div
            key={bat.id}
            className="bat-anim absolute left-0"
            style={{ top: `${bat.top}%`, transform: `scale(${bat.scale})`, opacity: 0.25 }}
          >
            <svg width="40" height="20" viewBox="0 0 40 20" fill="var(--brand)">
              <path d="M20 10 Q15 0 5 2 Q10 8 0 10 Q10 12 5 18 Q15 20 20 15 Q25 20 35 18 Q30 12 40 10 Q30 8 35 2 Q25 0 20 10 Z" />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
};
