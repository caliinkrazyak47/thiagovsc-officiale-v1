'use client';

import React, { useEffect, useState } from 'react';
import Script from 'next/script';

const STORAGE_KEY = 'thiagovsc_cookie_consent';

export const Analytics: React.FC = () => {
  const [hasConsent, setHasConsent] = useState<boolean>(false);
  const gaId = process.env.NEXT_PUBLIC_GA_ID || 'G-THIAGOVSC01';

  useEffect(() => {
    const checkConsent = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.analytics === true) {
            setHasConsent(true);
            return;
          }
        }
      } catch {}
      setHasConsent(false);
    };

    checkConsent();

    // Listen for storage changes or custom consent updates
    window.addEventListener('storage', checkConsent);
    const interval = setInterval(checkConsent, 2000);
    return () => {
      window.removeEventListener('storage', checkConsent);
      clearInterval(interval);
    };
  }, []);

  if (!hasConsent || !gaId) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', {
            anonymize_ip: true,
            send_page_view: true
          });
        `}
      </Script>
    </>
  );
};
