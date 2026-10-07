'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  const [cursorText, setCursorText] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouch(true);
      return;
    }

    const cursor = cursorRef.current;
    if (!cursor) return;

    // Use gsap.quickTo for 120fps stutter-free tracking
    const xTo = gsap.quickTo(cursor, 'x', { duration: 0.12, ease: 'power3' });
    const yTo = gsap.quickTo(cursor, 'y', { duration: 0.12, ease: 'power3' });

    gsap.set(cursor, { xPercent: -50, yPercent: -50 });

    const handleMouseMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);

      const target = e.target as HTMLElement | null;
      const cursorTarget = target?.closest('[data-cursor]') as HTMLElement | null;
      if (cursorTarget) {
        const text = cursorTarget.getAttribute('data-cursor') || '';
        setCursorText(text);
        setIsExpanded(true);
      } else {
        setIsExpanded(false);
      }
    };

    const handleMouseLeave = () => {
      gsap.to(cursor, { opacity: 0, duration: 0.2 });
    };

    const handleMouseEnter = () => {
      gsap.to(cursor, { opacity: 1, duration: 0.2 });
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  useEffect(() => {
    if (!dotRef.current) return;
    if (isExpanded) {
      gsap.to(dotRef.current, {
        width: 90,
        height: 90,
        backgroundColor: '#E0457B',
        mixBlendMode: 'normal',
        duration: 0.35,
        ease: 'power3.out',
      });
    } else {
      gsap.to(dotRef.current, {
        width: 10,
        height: 10,
        backgroundColor: '#E0457B',
        mixBlendMode: 'difference',
        duration: 0.3,
        ease: 'power3.out',
      });
    }
  }, [isExpanded]);

  if (isTouch) return null;

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] will-change-transform select-none"
    >
      <div
        ref={dotRef}
        className="w-[10px] h-[10px] rounded-full bg-[#E0457B] flex items-center justify-center text-center font-jost text-[11px] uppercase tracking-[0.2em] font-medium text-[#FFE9D6] shadow-luxury"
        style={{ mixBlendMode: 'difference' }}
      >
        {isExpanded && (
          <span ref={textRef} className="animate-in fade-in zoom-in-75 duration-200">
            {cursorText}
          </span>
        )}
      </div>
    </div>
  );
};
