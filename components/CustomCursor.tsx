'use client';

import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [cursorText, setCursorText] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouch(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      const cursorTarget = target?.closest('[data-cursor]') as HTMLElement | null;
      if (cursorTarget) {
        setCursorText(cursorTarget.getAttribute('data-cursor'));
      } else {
        setCursorText(null);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  if (isTouch || !isVisible) return null;

  const isExpanded = !!cursorText;

  return (
    <div
      className="fixed pointer-events-none z-[9999] transition-transform duration-75 ease-out select-none"
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        transform: 'translate(-50%, -50%)',
        mixBlendMode: isExpanded ? 'normal' : 'multiply',
      }}
    >
      <div
        className={`rounded-full flex items-center justify-center transition-all duration-300 font-jost font-medium tracking-[0.2em] text-[12px] text-white ${
          isExpanded
            ? 'w-20 h-20 bg-[#DE4176] shadow-[0_24px_48px_-24px_rgba(176,51,102,0.25)]'
            : 'w-2.5 h-2.5 bg-[#DE4176]'
        }`}
        style={{
          transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        {isExpanded && <span>{cursorText}</span>}
      </div>
    </div>
  );
};
