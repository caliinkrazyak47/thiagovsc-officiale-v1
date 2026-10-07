'use client';

import React from 'react';
import { useMediaStore } from '@/lib/mediaStore';

export const SoundToggle: React.FC<{ className?: string; compact?: boolean }> = ({ 
  className = '',
  compact = false 
}) => {
  const { isSoundEnabled, toggleSound } = useMediaStore();

  return (
    <button
      type="button"
      onClick={toggleSound}
      aria-label={isSoundEnabled ? 'Silenciar sonido' : 'Activar sonido'}
      title={isSoundEnabled ? 'Sonido activado' : 'Sonido silenciado'}
      className={`relative h-9 px-3 rounded-full flex items-center gap-1.5 border border-[rgba(255,233,214,0.3)] bg-[#E0457B] text-[#FFE9D6] hover:bg-[#A3285C] transition-colors shadow-sm cursor-pointer select-none ${className}`}
    >
      <div className="flex items-end gap-[2.5px] h-3.5 w-4 justify-center">
        <span
          className={`w-[2px] bg-current rounded-full transition-all duration-300 ${
            isSoundEnabled ? 'h-3 animate-pulse' : 'h-1 opacity-50'
          }`}
          style={{ animationDuration: '600ms', animationDelay: '0ms' }}
        />
        <span
          className={`w-[2px] bg-current rounded-full transition-all duration-300 ${
            isSoundEnabled ? 'h-4 animate-pulse' : 'h-1 opacity-50'
          }`}
          style={{ animationDuration: '450ms', animationDelay: '150ms' }}
        />
        <span
          className={`w-[2px] bg-current rounded-full transition-all duration-300 ${
            isSoundEnabled ? 'h-2.5 animate-pulse' : 'h-1 opacity-50'
          }`}
          style={{ animationDuration: '700ms', animationDelay: '300ms' }}
        />
        <span
          className={`w-[2px] bg-current rounded-full transition-all duration-300 ${
            isSoundEnabled ? 'h-3.5 animate-pulse' : 'h-1 opacity-50'
          }`}
          style={{ animationDuration: '500ms', animationDelay: '200ms' }}
        />
      </div>
      {!compact && (
        <span className="font-satoshi text-[10px] uppercase tracking-[0.2em] font-medium hidden sm:inline">
          {isSoundEnabled ? 'ON' : 'MUTE'}
        </span>
      )}
    </button>
  );
};
