'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

export const PremiumHalloween: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate 15 massive blurred orbs to simulate volumetric fog
  const fogLayers = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    size: Math.random() * 50 + 50, // 50vw to 100vw
    top: Math.random() * 100,
    left: Math.random() * 100,
    duration: Math.random() * 20 + 20, // 20s to 40s
    delay: Math.random() * -40,
  }));

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Animate fog drifting
    const fogs = containerRef.current.querySelectorAll('.fog-orb');
    fogs.forEach((el, i) => {
      const fog = fogLayers[i];
      gsap.fromTo(
        el,
        { x: '-20vw' },
        {
          x: '20vw',
          duration: fog.duration,
          delay: fog.delay,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        }
      );
    });

    // Animate the scary apparition (Shadow figure & Red Eyes)
    const ghost = containerRef.current.querySelector('.scary-ghost');
    
    // Ghost appears every 12 to 20 seconds
    const triggerScare = () => {
      if (!ghost) return;
      
      // Randomize position
      const randomTop = Math.random() * 60 + 10; // 10% to 70%
      const randomLeft = Math.random() * 80 + 10; // 10% to 90%
      const randomScale = Math.random() * 0.5 + 0.8; // 0.8 to 1.3
      
      gsap.set(ghost, { 
        top: `${randomTop}%`, 
        left: `${randomLeft}%`, 
        scale: randomScale,
        opacity: 0 
      });

      // Sequence: Fade in, flicker, stay, fade out fast
      const tl = gsap.timeline();
      
      tl.to(ghost, { opacity: 0.15, duration: 2, ease: 'power2.inOut' }) // Slowly appear
        .to(ghost, { opacity: 0.05, duration: 0.1, yoyo: true, repeat: 3 }) // Flicker
        .to(ghost, { opacity: 0.25, duration: 1 }) // Stare
        .to(ghost, { opacity: 0, duration: 0.3, ease: 'power4.in' }); // Vanish quickly
      
      // Schedule next scare
      setTimeout(triggerScare, (Math.random() * 10000) + 12000);
    };

    // Start first scare after 5 seconds
    setTimeout(triggerScare, 5000);

  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[45] overflow-hidden" ref={containerRef}>
      {/* DEEP DARK VIGNETTE TO CREATE A CLAUSTROPHOBIC FEEL */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.6)_100%)] dark:bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.85)_100%)] z-10" />

      {/* VOLUMETRIC FOG (Mist) */}
      <div className="absolute inset-0 z-20 opacity-30 dark:opacity-40 mix-blend-screen">
        {fogLayers.map((fog) => (
          <div
            key={fog.id}
            className="fog-orb absolute rounded-full bg-white/40 dark:bg-gray-400/20 blur-[60px] md:blur-[100px]"
            style={{
              width: `${fog.size}vw`,
              height: `${fog.size}vw`,
              top: `${fog.top}%`,
              left: `${fog.left}%`,
              transform: 'translate(-50%, -50%)',
              willChange: 'transform'
            }}
          />
        ))}
      </div>

      {/* THE APPARITION (Scary Shadow Figure with Glowing Eyes) */}
      <div className="scary-ghost absolute z-30 opacity-0 pointer-events-none" style={{ transform: 'translate(-50%, -50%)' }}>
        <svg width="120" height="250" viewBox="0 0 120 250" fill="none">
          {/* Shadowy tall figure (Slender / Ghost) */}
          <path d="M60 20 C40 20, 30 40, 35 60 C40 80, 45 90, 45 120 C45 160, 30 200, 20 250 L100 250 C90 200, 75 160, 75 120 C75 90, 80 80, 85 60 C90 40, 80 20, 60 20 Z" fill="black" filter="blur(8px)" />
          
          {/* Creepy glowing red eyes */}
          <circle cx="48" cy="45" r="3" fill="#ff0000" filter="blur(1px)" />
          <circle cx="72" cy="45" r="3" fill="#ff0000" filter="blur(1px)" />
          <circle cx="48" cy="45" r="1.5" fill="#ffffff" />
          <circle cx="72" cy="45" r="1.5" fill="#ffffff" />
          
          {/* Faint creepy smile */}
          <path d="M45 65 Q60 80 75 65" stroke="#ff0000" strokeWidth="1" fill="none" filter="blur(2px)" opacity="0.5" />
        </svg>
      </div>
    </div>
  );
};
