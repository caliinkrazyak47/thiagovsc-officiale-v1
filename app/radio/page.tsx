'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CoverFlowRadio } from '@/components/CoverFlowRadio';

export default function RadioPopupPage() {
  const router = useRouter();

  const handleClose = () => {
    if (typeof window !== 'undefined') {
      window.close();
      setTimeout(() => {
        router.push('/');
      }, 150);
    }
  };

  return (
    <div className="w-screen h-screen bg-[#FFF6F9] overflow-hidden">
      <CoverFlowRadio onClose={handleClose} isStandalone={true} />
    </div>
  );
}
