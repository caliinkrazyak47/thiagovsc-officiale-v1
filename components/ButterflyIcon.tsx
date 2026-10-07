import React from 'react';

interface ButterflyIconProps {
  className?: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export const ButterflyIcon: React.FC<ButterflyIconProps> = ({
  className = "inline-block",
  size = 14,
  color = "#DE4176",
  strokeWidth = 1.5,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Delicate line art butterfly */}
      {/* Left wing upper */}
      <path
        d="M12 12C10.5 7 6 3 2.5 5.5C-0.5 7.5 1.5 14 6 14C8 14 10.5 13.5 12 12Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Left wing lower */}
      <path
        d="M12 12C10 14.5 7 19.5 4 19C1.5 18.5 2 15 6 14"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right wing upper */}
      <path
        d="M12 12C13.5 7 18 3 21.5 5.5C24.5 7.5 22.5 14 18 14C16 14 13.5 13.5 12 12Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right wing lower */}
      <path
        d="M12 12C14 14.5 17 19.5 20 19C22.5 18.5 22 15 18 14"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Center body & antennas */}
      <path
        d="M12 9V17M12 9C11 7 9.5 6 9 6.5M12 9C13 7 14.5 6 15 6.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
