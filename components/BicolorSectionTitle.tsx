'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface BicolorSectionTitleProps {
  firstWord: string;
  secondWord: string;
  className?: string;
  align?: 'left' | 'center';
}

export const BicolorSectionTitle: React.FC<BicolorSectionTitleProps> = ({
  firstWord,
  secondWord,
  className = '',
  align = 'left',
}) => {
  const containerRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const el = containerRef.current;
      if (!el) return;

      const word1Chars = el.querySelectorAll('.word-1 .bicolor-char');
      const word2Chars = el.querySelectorAll('.word-2 .bicolor-char');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top 95%',
          once: true,
        },
      });

      tl.fromTo(
        word1Chars,
        { y: '110%' },
        {
          y: '0%',
          duration: 0.7,
          stagger: 0.025,
          ease: 'power3.out',
        }
      ).fromTo(
        word2Chars,
        { y: '110%' },
        {
          y: '0%',
          duration: 0.7,
          stagger: 0.025,
          ease: 'power3.out',
        },
        0.15
      );
    },
    { scope: containerRef }
  );

  return (
    <h2
      ref={containerRef}
      className={`font-clash font-medium text-[clamp(2.25rem,4.2vw,4rem)] leading-none tracking-[-0.035em] flex flex-wrap gap-x-[0.25em] items-baseline select-none ${
        align === 'center' ? 'justify-center text-center' : 'justify-start text-left'
      } ${className}`}
    >
      {/* Primera palabra: --frambuesa */}
      <span className="word-1 inline-flex text-[#B03366] overflow-hidden py-1">
        {firstWord.split('').map((char, i) => (
          <span key={`w1-${i}`} className="inline-block overflow-hidden">
            <span className="bicolor-char inline-block">
              {char === ' ' ? '\u00A0' : char}
            </span>
          </span>
        ))}
      </span>

      {/* Segunda palabra: --rosa */}
      <span className="word-2 inline-flex text-[#DE4176] overflow-hidden py-1">
        {secondWord.split('').map((char, i) => (
          <span key={`w2-${i}`} className="inline-block overflow-hidden">
            <span className="bicolor-char inline-block">
              {char === ' ' ? '\u00A0' : char}
            </span>
          </span>
        ))}
      </span>
    </h2>
  );
};

