'use client';

import React from 'react';

interface CountryFlagProps {
  countryCode: string;
  className?: string;
  title?: string;
}

export const CountryFlag: React.FC<CountryFlagProps> = ({ 
  countryCode, 
  className = 'w-6 h-6',
  title 
}) => {
  const code = (countryCode || '').toUpperCase().trim();

  const renderFlag = () => {
    switch (code) {
      case 'ES':
        return (
          <svg viewBox="0 0 750 500" className="w-full h-full object-cover shrink-0">
            <rect width="750" height="500" fill="#AA151B" />
            <rect width="750" height="250" y="125" fill="#F1BF00" />
            <g transform="translate(200, 250) scale(1.15)">
              <path d="M-26 -40 h52 v40 a26 26 0 0 1 -52 0 z" fill="#AA151B" stroke="#F1BF00" strokeWidth="3" />
              <path d="M-26 -40 h26 v20 h-26 z" fill="#AA151B" />
              <path d="M0 -40 h26 v20 h-26 z" fill="#F1BF00" />
              <path d="M-26 -20 h26 v20 h-26 z" fill="#F1BF00" />
              <path d="M0 -20 h26 v20 h-26 z" fill="#AA151B" />
              <circle cx="0" cy="-20" r="6" fill="#003893" stroke="#F1BF00" strokeWidth="2" />
              <path d="M-20 -40 l4 -12 l16 6 l16 -6 l4 12 z" fill="#F1BF00" stroke="#AA151B" strokeWidth="2" />
              <rect x="-38" y="-30" width="5" height="55" fill="#F1BF00" rx="2" />
              <rect x="33" y="-30" width="5" height="55" fill="#F1BF00" rx="2" />
            </g>
          </svg>
        );

      case 'US':
        return (
          <svg viewBox="0 0 741 390" className="w-full h-full object-cover shrink-0">
            <rect width="741" height="390" fill="#B22234" />
            {[30, 90, 150, 210, 270, 330].map((y) => (
              <rect key={y} width="741" height="30" y={y} fill="#FFFFFF" />
            ))}
            <rect width="296" height="210" fill="#3C3B6E" />
            <g fill="#FFFFFF">
              {[25, 62, 99, 136, 173, 210, 247, 278].map((x) =>
                [20, 55, 90, 125, 160, 192].map((y) => (
                  <circle key={`${x}-${y}`} cx={x} cy={y} r="5.5" />
                ))
              )}
            </g>
          </svg>
        );

      case 'BE':
        return (
          <svg viewBox="0 0 450 300" className="w-full h-full object-cover shrink-0">
            <rect width="150" height="300" fill="#000000" />
            <rect x="150" width="150" height="300" fill="#FDDA24" />
            <rect x="300" width="150" height="300" fill="#EF3340" />
          </svg>
        );

      case 'PR':
        return (
          <svg viewBox="0 0 600 400" className="w-full h-full object-cover shrink-0">
            <rect width="600" height="400" fill="#ED0000" />
            <rect width="600" height="80" y="80" fill="#FFFFFF" />
            <rect width="600" height="80" y="240" fill="#FFFFFF" />
            <polygon points="0,0 280,200 0,400" fill="#00205B" />
            <polygon
              points="95,145 107,185 147,185 115,208 127,248 95,225 63,248 75,208 43,185 83,185"
              fill="#FFFFFF"
            />
          </svg>
        );

      case 'CO':
        return (
          <svg viewBox="0 0 600 400" className="w-full h-full object-cover shrink-0">
            <rect width="600" height="200" fill="#FCD116" />
            <rect width="600" height="100" y="200" fill="#003893" />
            <rect width="600" height="100" y="300" fill="#CE1126" />
          </svg>
        );

      case 'PE':
        return (
          <svg viewBox="0 0 600 400" className="w-full h-full object-cover shrink-0">
            <rect width="200" height="400" fill="#D91023" />
            <rect x="200" width="200" height="400" fill="#FFFFFF" />
            <rect x="400" width="200" height="400" fill="#D91023" />
          </svg>
        );

      case 'GLOBAL':
      default:
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full object-cover shrink-0 bg-[#004B87]">
            <circle cx="50" cy="50" r="48" fill="#005B94" stroke="#00A3E0" strokeWidth="2" />
            <ellipse cx="50" cy="50" rx="44" ry="20" fill="none" stroke="#68D391" strokeWidth="3" opacity="0.85" />
            <ellipse cx="50" cy="50" rx="20" ry="44" fill="none" stroke="#68D391" strokeWidth="3" opacity="0.85" />
            <line x1="6" y1="50" x2="94" y2="50" stroke="#68D391" strokeWidth="3" opacity="0.85" />
            <line x1="50" y1="6" x2="50" y2="94" stroke="#68D391" strokeWidth="3" opacity="0.85" />
          </svg>
        );
    }
  };

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full overflow-hidden shadow-sm ring-1 ring-black/10 shrink-0 select-none ${className}`}
      title={title || code}
      aria-label={title || `Bandera de ${code}`}
    >
      {renderFlag()}
    </span>
  );
};
