'use client';

import React, { useState, useEffect } from 'react';

interface DigitalClockProps {
  className?: string;
  showSeconds?: boolean;
  showTimezone?: boolean;
}

export const DigitalClock: React.FC<DigitalClockProps> = ({
  className = '',
  showSeconds = true,
  showTimezone = true,
}) => {
  const [timeStr, setTimeStr] = useState<string>('');
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');

      if (showSeconds) {
        setTimeStr(`${hours}:${minutes}:${seconds}`);
      } else {
        setTimeStr(`${hours}:${minutes}`);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [showSeconds]);

  if (!mounted || !timeStr) {
    return (
      <div className={`inline-flex items-center gap-1.5 font-mono text-[11px] text-white/70 ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-[#DE4176] animate-pulse" />
        <span>--:--:--</span>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 font-jost text-[11px] md:text-xs select-none ${className}`}
      title="Hora Local / Local Time"
    >
      {/* Live Pulsing Dot */}
      <span className="relative flex h-1.5 w-1.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#DE4176] opacity-75"></span>
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#DE4176]"></span>
      </span>

      {/* Clock Time */}
      <span className="font-medium tracking-widest text-[#B03366] tabular-nums">
        {timeStr}
      </span>

      {/* Timezone / Live Badge */}
      {showTimezone && (
        <span className="text-[10px] font-medium tracking-wider text-[#B03366]/60 border-l border-[#DE4176]/20 pl-1.5 uppercase hidden xs:inline">
          MADRID
        </span>
      )}
    </div>
  );
};

