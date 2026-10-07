'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from 'next-themes';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const SECTION_COLORS: { id: string; light: string; dark: string }[] = [
  { id: 'home', light: '#FDE4EC', dark: '#2B0F1E' },
  { id: 'marquee-top', light: '#E0457B', dark: '#E0457B' },
  { id: 'tv', light: '#F8C8D8', dark: '#341224' },
  { id: 'tiktok', light: '#E0457B', dark: '#E0457B' },
  { id: 'zona-influencer', light: '#FDE4EC', dark: '#2B0F1E' },
  { id: 'events', light: '#F29BB8', dark: '#42162E' },
  { id: 'press', light: '#F8C8D8', dark: '#341224' },
  { id: 'footer', light: '#E0457B', dark: '#E0457B' },
];

export const SectionColorMorph: React.FC = () => {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isDark = resolvedTheme === 'dark';
    const ctx = gsap.context(() => {
      SECTION_COLORS.forEach(({ id, light, dark }) => {
        const el = document.getElementById(id);
        if (!el) return;

        const targetColor = isDark ? dark : light;

        ScrollTrigger.create({
          trigger: el,
          start: 'top 55%',
          end: 'bottom 55%',
          onEnter: () => {
            gsap.to(document.body, {
              backgroundColor: targetColor,
              duration: 0.6,
              ease: 'power2.out',
              overwrite: 'auto',
            });
            document.documentElement.style.setProperty('--bg-current', targetColor);
          },
          onEnterBack: () => {
            gsap.to(document.body, {
              backgroundColor: targetColor,
              duration: 0.6,
              ease: 'power2.out',
              overwrite: 'auto',
            });
            document.documentElement.style.setProperty('--bg-current', targetColor);
          },
        });
      });
    });

    return () => ctx.revert();
  }, [resolvedTheme]);

  return null;
};
