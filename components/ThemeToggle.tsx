'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import gsap from 'gsap';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const sunPathRef = useRef<any>(null);
  const raysRef = useRef<SVGGElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && (resolvedTheme === 'dark' || theme === 'dark');

  useEffect(() => {
    if (!mounted) return;
    // Animate morph / icon transition
    if (isDark) {
      gsap.to(raysRef.current, { scale: 0, opacity: 0, duration: 0.3, transformOrigin: 'center' });
      gsap.to(sunPathRef.current, {
        scale: 1.1,
        duration: 0.35,
        ease: 'power2.out',
        transformOrigin: 'center',
      });
    } else {
      gsap.to(raysRef.current, { scale: 1, opacity: 1, duration: 0.35, transformOrigin: 'center' });
      gsap.to(sunPathRef.current, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
        transformOrigin: 'center',
      });
    }
  }, [isDark, mounted]);

  const handleToggle = () => {
    const nextTheme = isDark ? 'light' : 'dark';

    // View Transitions API circle expansion from button center
    if (
      typeof document === 'undefined' ||
      !(document as any).startViewTransition ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setTheme(nextTheme);
      return;
    }

    const rect = buttonRef.current?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = (document as any).startViewTransition(() => {
      setTheme(nextTheme);
    });

    transition.ready?.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 550,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          pseudoElement: '::view-transition-new(root)',
        }
      );
    });
  };

  if (!mounted) {
    return (
      <div className={`w-9 h-9 rounded-full border border-[var(--line)] bg-[var(--petal)] ${className}`} />
    );
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={handleToggle}
      aria-label="Cambiar a modo oscuro / claro"
      className={`relative w-9 h-9 rounded-full flex items-center justify-center border border-[var(--line)] bg-[var(--petal)] text-[var(--berry)] hover:bg-[var(--blush)] hover:text-[var(--brand)] transition-colors shadow-sm cursor-pointer select-none ${className}`}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-transform duration-300"
      >
        {isDark ? (
          // Moon Icon
          <path
            ref={sunPathRef}
            d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
            fill="currentColor"
            stroke="none"
          />
        ) : (
          // Sun Icon with rays
          <>
            <circle ref={sunPathRef} cx="12" cy="12" r="5" fill="currentColor" stroke="none" />
            <g ref={raysRef}>
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </g>
          </>
        )}
      </svg>
    </button>
  );
};
