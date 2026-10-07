'use client';

import React, { useRef, useEffect } from 'react';
import { useLenis } from '@studio-freight/react-lenis';
import gsap from 'gsap';
import { ButterflyIcon } from '@/components/ButterflyIcon';

interface KineticMarqueeProps {
  id?: string;
}

export const KineticMarquee: React.FC<KineticMarqueeProps> = ({ id = 'marquee-top' }) => {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const xPos = useRef(0);
  const direction = useRef(1); // 1 = left, -1 = right
  const isHovered = useRef(false);

  useLenis((lenis) => {
    if (!marqueeRef.current) return;
    const velocity = (lenis as any)?.velocity || 0;

    // SkewX reacts to scroll velocity (clamp -8deg to 8deg)
    const skew = Math.max(-8, Math.min(8, velocity * 0.4));
    gsap.to(marqueeRef.current, {
      skewX: skew,
      duration: 0.2,
      ease: 'power1.out',
      overwrite: 'auto',
    });

    // Invert direction when scrolling up
    if (velocity < -0.5) {
      direction.current = -1;
    } else if (velocity > 0.5) {
      direction.current = 1;
    }
  });

  useEffect(() => {
    let animId: number;

    const tick = () => {
      if (!isHovered.current && trackRef.current) {
        // Normal speed is 1.2px per frame
        xPos.current -= 1.2 * direction.current;
        const width = trackRef.current.scrollWidth / 2;

        if (xPos.current <= -width) {
          xPos.current = 0;
        } else if (xPos.current >= 0) {
          xPos.current = -width;
        }

        trackRef.current.style.transform = `translate3d(${xPos.current}px, 0, 0)`;
      }
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  const items = [
    { text: 'EMISIÓN CONTINUA 24/7', isKey: false },
    { text: 'LIVE 24/7', isKey: true },
    { text: 'MÚSICA URBANA & VANGUARDIA', isKey: false },
    { text: 'HALL OF FAME', isKey: true },
    { text: 'SESIONES EXCLUSIVAS', isKey: false },
    { text: 'PLATAFORMA OFICIAL THIAGO VSC', isKey: false },
  ];

  const repeatedItems = [...items, ...items, ...items, ...items];

  return (
    <section
      id={id}
      ref={marqueeRef}
      onMouseEnter={() => (isHovered.current = true)}
      onMouseLeave={() => (isHovered.current = false)}
      className="w-full bg-[#E0457B] text-[#FFE9D6] py-5 sm:py-6 overflow-hidden select-none border-y border-[rgba(255,233,214,0.18)] will-change-transform"
    >
      <div ref={trackRef} className="flex items-center whitespace-nowrap will-change-transform">
        {repeatedItems.map((item, idx) => (
          <div key={idx} className="flex items-center gap-6 sm:gap-8 mx-4 sm:mx-6">
            {item.isKey ? (
              <span className="font-panchang font-extrabold text-[clamp(1.75rem,3.5vw,3.25rem)] uppercase leading-none tracking-tight text-white flex items-center gap-3">
                <span className="animate-spin inline-block" style={{ animationDuration: '6s' }}>
                  <ButterflyIcon
                    size={20}
                    color="#FFFFFF"
                    strokeWidth={1.5}
                  />
                </span>
                <span>{item.text}</span>
              </span>
            ) : (
              <span className="font-panchang font-extrabold text-[clamp(1.75rem,3.5vw,3.25rem)] uppercase leading-none tracking-tight text-[#FFE9D6]">
                {item.text}
              </span>
            )}

            {/* Mariposa separadora */}
            <ButterflyIcon size={16} color="#FFE9D6" strokeWidth={1.5} className="opacity-75" />
          </div>
        ))}
      </div>
    </section>
  );
};
