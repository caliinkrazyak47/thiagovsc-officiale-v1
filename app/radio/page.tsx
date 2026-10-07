'use client';

import React from 'react';
import { CoverFlowRadio } from '@/components/CoverFlowRadio';

export default function RadioPopupPage() {
  const handleClose = () => {
    if (typeof window !== 'undefined') {
      window.close();
    }
  };

  return (
    <div className="w-screen h-screen bg-[#FFF6F9] overflow-hidden">
      <CoverFlowRadio onClose={handleClose} isStandalone={true} />
    </div>
  );
}
