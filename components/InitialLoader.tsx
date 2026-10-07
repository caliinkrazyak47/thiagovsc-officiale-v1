'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const InitialLoader: React.FC = () => {
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    // 1.5s total duration before curtain fully exits
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {showLoader && (
        <motion.div
          initial={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[99999] bg-[#FFF6F9] flex flex-col items-center justify-center pointer-events-auto select-none"
        >
          {/* Animated SVG Butterfly Drawing */}
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg
              width="90"
              height="90"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="overflow-visible"
            >
              {/* Left wing upper */}
              <motion.path
                d="M12 12C10.5 7 6 3 2.5 5.5C-0.5 7.5 1.5 14 6 14C8 14 10.5 13.5 12 12Z"
                stroke="#DE4176"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              />
              {/* Left wing lower */}
              <motion.path
                d="M12 12C10 14.5 7 19.5 4 19C1.5 18.5 2 15 6 14"
                stroke="#DE4176"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              />
              {/* Right wing upper */}
              <motion.path
                d="M12 12C13.5 7 18 3 21.5 5.5C24.5 7.5 22.5 14 18 14C16 14 13.5 13.5 12 12Z"
                stroke="#DE4176"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              />
              {/* Right wing lower */}
              <motion.path
                d="M12 12C14 14.5 17 19.5 20 19C22.5 18.5 22 15 18 14"
                stroke="#DE4176"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              />
              {/* Body */}
              <motion.path
                d="M12 9V17M12 9C11 7 9.5 6 9 6.5M12 9C13 7 14.5 6 15 6.5"
                stroke="#DE4176"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              />
            </svg>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 font-jost text-[12px] uppercase tracking-[0.3em] text-[#B03366]"
          >
            THIAGO VSC // 2026
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
