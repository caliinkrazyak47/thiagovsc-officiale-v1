'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

export const PremiumHalloween: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const moonRef = useRef<HTMLDivElement>(null);

  // Generate 40 random embers
  const embers = Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    size: Math.random() * 3 + 1, // 1px to 4px
    left: Math.random() * 100, // 0% to 100%
    duration: Math.random() * 15 + 15, // 15s to 30s
    delay: Math.random() * -30, // Start at different times
    opacity: Math.random() * 0.5 + 0.3, // 0.3 to 0.8
  }));

  useEffect(() => {
    if (!containerRef.current) return;
    
    const elements = containerRef.current.querySelectorAll('.ember');
    
    elements.forEach((el, i) => {
      const ember = embers[i];
      // Animate from bottom to top with a slight wobble
      gsap.fromTo(
        el,
        {
          y: '110vh',
          x: 0,
        },
        {
          y: '-10vh',
          x: () => (Math.random() - 0.5) * 150, // Wobble left/right
          duration: ember.duration,
          delay: ember.delay,
          ease: 'none',
          repeat: -1,
        }
      );
      
      // Pulse opacity
      gsap.to(el, {
        opacity: ember.opacity * 0.2, // Dim
        duration: Math.random() * 2 + 2,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        delay: Math.random() * 2,
      });
    });

    // Subtle breathing animation for the blood moon
    if (moonRef.current) {
      gsap.to(moonRef.current, {
        scale: 1.05,
        opacity: 0.5,
        duration: 8,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut'
      });
    }

  }, []); // Run once on mount

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* GIANT FAINT BLOOD MOON */}
      <div 
        ref={moonRef}
        className="absolute top-[-20%] right-[-10%] w-[80vw] h-[80vw] min-w-[600px] min-h-[600px] rounded-full opacity-40 blur-[100px] dark:opacity-60"
        style={{
          background: 'radial-gradient(circle, rgba(224, 69, 123, 0.25) 0%, rgba(163, 40, 92, 0.05) 50%, rgba(0,0,0,0) 80%)'
        }}
      />

      {/* RISING EMBERS */}
      <div ref={containerRef} className="absolute inset-0">
        {embers.map((ember) => (
          <div
            key={ember.id}
            className="ember absolute rounded-full bg-[var(--brand)] shadow-[0_0_8px_var(--brand)]"
            style={{
              left: `${ember.left}%`,
              width: `${ember.size}px`,
              height: `${ember.size}px`,
              opacity: ember.opacity,
              willChange: 'transform, opacity'
            }}
          />
        ))}
      </div>
      
      {/* VIGNETTE EFFECT FOR EXTRA CINEMATIC FEEL */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.05)_100%)] dark:bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.4)_100%)]" />
    </div>
  );
};
