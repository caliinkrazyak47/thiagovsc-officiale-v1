'use client';

import React, { useRef, useEffect } from 'react';
import { useLenis } from '@studio-freight/react-lenis';

interface MarqueeProps {
  id?: string;
  direction?: 'left' | 'right';
  speed?: number; // base speed in pixels per frame, e.g. 1.2
  items?: string[];
  isPress?: boolean;
  className?: string;
  bgClassName?: string;
}

export const Marquee: React.FC<MarqueeProps> = ({
  id,
  direction = 'left',
  speed = 1.0,
  items = [],
  isPress = false,
  className = '',
  bgClassName = 'bg-[#E0457B] text-[#FFE9D6]',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const isHovered = useRef(false);
  const currentSpeedMult = useRef(1);
  const targetSpeedMult = useRef(1);
  const xPos = useRef(0);

  // Lenis scroll velocity reaction (up to 3x, returns to 1 smoothly)
  useLenis((lenis) => {
    const rawVelocity = Math.abs((lenis as any)?.velocity || 0);
    // Multiply speed up to 3x based on velocity
    targetSpeedMult.current = Math.min(3, 1 + rawVelocity * 0.25);
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let animId: number;
    const dirSign = direction === 'left' ? -1 : 1;

    const tick = () => {
      // Ease speed multiplier back towards 1
      currentSpeedMult.current += (targetSpeedMult.current - currentSpeedMult.current) * 0.08;
      targetSpeedMult.current += (1 - targetSpeedMult.current) * 0.04;

      if (!isHovered.current && trackRef.current) {
        const step = speed * currentSpeedMult.current * dirSign;
        xPos.current += step;

        const halfWidth = trackRef.current.scrollWidth / 2;
        if (halfWidth > 0) {
          if (direction === 'left' && xPos.current <= -halfWidth) {
            xPos.current += halfWidth;
          } else if (direction === 'right' && xPos.current >= 0) {
            xPos.current -= halfWidth;
          }
        }

        trackRef.current.style.transform = `translate3d(${xPos.current}px, 0, 0)`;
      }

      animId = requestAnimationFrame(tick);
    };

    // Initialize position for right direction
    if (direction === 'right' && trackRef.current) {
      xPos.current = -(trackRef.current.scrollWidth / 2);
    }

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [direction, speed]);

  // Duplicate items for continuous loop
  const repeatedItems = [...items, ...items, ...items, ...items];

  return (
    <section
      id={id}
      ref={containerRef}
      onMouseEnter={() => (isHovered.current = true)}
      onMouseLeave={() => (isHovered.current = false)}
      className={`w-full h-[56px] min-h-[56px] max-h-[56px] border-y border-[var(--line)] overflow-hidden select-none flex items-center ${bgClassName} ${className}`}
    >
      <div
        ref={trackRef}
        className="flex items-center whitespace-nowrap will-change-transform font-satoshi font-medium uppercase tracking-[0.28em] text-[clamp(0.85rem,1.15vw,1.1rem)] leading-none"
      >
        {repeatedItems.map((item, idx) => (
          <div key={idx} className="flex items-center">
            {isPress ? (
              <span className="font-bodoni text-xl md:text-2xl tracking-wider opacity-60 hover:opacity-100 transition-opacity duration-300 cursor-pointer text-[var(--berry)] font-normal">
                {item}
              </span>
            ) : (
              <span>{item}</span>
            )}

            {/* Separador ✦ en --champagne con 3rem de espacio a cada lado */}
            <span
              className="text-[var(--champagne)] text-xs inline-block select-none"
              style={{ margin: '0 3rem' }}
              aria-hidden="true"
            >
              ✦
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
