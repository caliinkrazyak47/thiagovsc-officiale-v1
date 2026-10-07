'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, Settings, X, ShieldCheck } from 'lucide-react';

const STORAGE_KEY = 'thiago_cookie_consent_rgpd';

export const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [showConfig, setShowConfig] = useState<boolean>(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState<boolean>(false);
  const [marketingEnabled, setMarketingEnabled] = useState<boolean>(false);

  useEffect(() => {
    // Check if consent was already recorded
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAnalyticsEnabled(!!parsed.analytics);
        setMarketingEnabled(!!parsed.marketing);
      } catch {}
    }

    // Trigger exactly 800ms after preloader finishes
    const handlePreloaderDone = () => {
      setTimeout(() => {
        const existing = localStorage.getItem(STORAGE_KEY);
        if (!existing) {
          setIsVisible(true);
        }
      }, 800);
    };

    window.addEventListener('preloader-finished', handlePreloaderDone);

    // Fallback timer if preloader already exited or quick visit
    const fallbackTimer = setTimeout(() => {
      const existing = localStorage.getItem(STORAGE_KEY);
      if (!existing) {
        setIsVisible(true);
      }
    }, 3800);

    // Reopen listener from footer "Cookies" link
    const handleReopen = () => {
      setIsVisible(true);
      setShowConfig(true);
    };
    window.addEventListener('open-cookie-settings', handleReopen);

    return () => {
      window.removeEventListener('preloader-finished', handlePreloaderDone);
      window.removeEventListener('open-cookie-settings', handleReopen);
      clearTimeout(fallbackTimer);
    };
  }, []);

  const saveConsent = (analytics: boolean, marketing: boolean) => {
    const consent = {
      necessary: true,
      analytics,
      marketing,
      date: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));

    if (analytics) {
      window.dispatchEvent(new CustomEvent('analytics-consent-granted'));
    }

    setIsVisible(false);
    setShowConfig(false);
  };

  const handleAcceptAll = () => saveConsent(true, true);
  const handleRejectAll = () => saveConsent(false, false);
  const handleSaveConfig = () => saveConsent(analyticsEnabled, marketingEnabled);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.aside
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          aria-label="Consentimiento de cookies RGPD"
          className="fixed bottom-4 sm:bottom-6 left-4 sm:left-6 z-[999] max-w-[420px] w-[calc(100%-2rem)] select-none pointer-events-auto"
        >
          {/* Tarjeta de cristal: fondo --petal al 85% con backdrop-blur 16px, borde --line y radius 20px */}
          <div 
            className="relative p-5 sm:p-6 text-[var(--berry)] font-jost rounded-[20px] border border-[var(--line)] shadow-luxury"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--petal) 85%, transparent)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
            }}
          >
            {!showConfig ? (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Cookie className="w-4 h-4 text-[var(--brand)]" />
                  <span className="font-satoshi text-xs font-semibold uppercase tracking-[0.2em] text-[var(--brand)]">
                    Privacidad & Cookies
                  </span>
                </div>

                {/* Texto corto en Jost con enlace a /cookies */}
                <p className="font-jost text-xs leading-relaxed text-[var(--berry)]/85 mb-4">
                  Utilizamos cookies técnicas y analíticas para optimizar tu experiencia y calibrar la señal de emisión.{' '}
                  <a
                    href="/cookies"
                    className="underline text-[var(--brand)] hover:opacity-80 transition-opacity font-medium"
                  >
                    Política de cookies
                  </a>.
                </p>

                {/* 3 botones con el mismo peso visual: "Aceptar", "Rechazar" y "Configurar" */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={handleAcceptAll}
                    className="py-2.5 px-2 rounded-full border border-[var(--brand)]/35 bg-[var(--surface)] hover:bg-[var(--brand)] hover:text-[var(--champagne)] hover:border-[var(--brand)] text-[var(--berry)] font-jost text-[11px] uppercase tracking-[0.12em] font-semibold text-center transition-all duration-200 active:scale-95 shadow-sm cursor-pointer"
                  >
                    Aceptar
                  </button>

                  <button
                    type="button"
                    onClick={handleRejectAll}
                    className="py-2.5 px-2 rounded-full border border-[var(--brand)]/35 bg-[var(--surface)] hover:bg-[var(--brand)] hover:text-[var(--champagne)] hover:border-[var(--brand)] text-[var(--berry)] font-jost text-[11px] uppercase tracking-[0.12em] font-semibold text-center transition-all duration-200 active:scale-95 shadow-sm cursor-pointer"
                  >
                    Rechazar
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowConfig(true)}
                    className="py-2.5 px-2 rounded-full border border-[var(--brand)]/35 bg-[var(--surface)] hover:bg-[var(--brand)] hover:text-[var(--champagne)] hover:border-[var(--brand)] text-[var(--berry)] font-jost text-[11px] uppercase tracking-[0.12em] font-semibold text-center transition-all duration-200 active:scale-95 shadow-sm cursor-pointer"
                  >
                    Configurar
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {/* Panel de Configuración */}
                <div className="flex items-center justify-between mb-3 border-b border-[var(--line)] pb-2.5">
                  <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4 text-[var(--brand)]" />
                    <span className="font-satoshi text-xs font-semibold uppercase tracking-[0.2em] text-[var(--brand)]">
                      Preferencias RGPD
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowConfig(false)}
                    className="p-1 rounded-full text-[var(--berry)] hover:text-[var(--brand)] transition-colors cursor-pointer"
                    aria-label="Cerrar configuración"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2.5 mb-4 text-xs font-jost">
                  {/* Necesarias (Bloqueada) */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--blush)]/60 border border-[var(--line)]">
                    <div>
                      <div className="font-medium text-[var(--berry)] flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-[var(--brand)]" />
                        <span>Necesarias</span>
                      </div>
                      <div className="text-[10px] text-[var(--berry)]/70">Imprescindibles para reproducción y sesión</div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-[var(--brand)] text-[var(--champagne)] font-mono font-medium">
                      Bloqueada
                    </span>
                  </div>

                  {/* Analíticas */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--blush)]/60 border border-[var(--line)]">
                    <div>
                      <div className="font-medium text-[var(--berry)]">Analíticas</div>
                      <div className="text-[10px] text-[var(--berry)]/70">Métricas anónimas de rendimiento y uso</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAnalyticsEnabled(!analyticsEnabled)}
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                        analyticsEnabled ? 'bg-[var(--brand)]' : 'bg-[var(--line)]'
                      }`}
                      aria-label="Alternar cookies analíticas"
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          analyticsEnabled ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Marketing */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--blush)]/60 border border-[var(--line)]">
                    <div>
                      <div className="font-medium text-[var(--berry)]">Marketing</div>
                      <div className="text-[10px] text-[var(--berry)]/70">Personalización de agenda y eventos</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setMarketingEnabled(!marketingEnabled)}
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                        marketingEnabled ? 'bg-[var(--brand)]' : 'bg-[var(--line)]'
                      }`}
                      aria-label="Alternar cookies de marketing"
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          marketingEnabled ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleSaveConfig}
                    className="py-2.5 rounded-full bg-[var(--brand)] text-[var(--champagne)] font-jost text-[11px] uppercase tracking-[0.14em] font-semibold text-center hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-sm"
                  >
                    Guardar
                  </button>

                  <button
                    type="button"
                    onClick={handleAcceptAll}
                    className="py-2.5 rounded-full border border-[var(--brand)]/35 bg-[var(--surface)] hover:bg-[var(--brand)] hover:text-[var(--champagne)] text-[var(--berry)] font-jost text-[11px] uppercase tracking-[0.14em] font-semibold text-center active:scale-95 transition-all cursor-pointer"
                  >
                    Aceptar Todo
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
