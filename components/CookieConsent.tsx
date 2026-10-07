'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, ShieldCheck, Settings, X, Check } from 'lucide-react';

const STORAGE_KEY = 'thiago_cookie_consent_rgpd';

export const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [showConfig, setShowConfig] = useState<boolean>(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState<boolean>(false);
  const [marketingEnabled, setMarketingEnabled] = useState<boolean>(false);

  useEffect(() => {
    // Listen for preloader completion or check after delay
    const handlePreloaderDone = () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        setTimeout(() => setIsVisible(true), 800);
      }
    };

    window.addEventListener('preloader-finished', handlePreloaderDone);

    // Initial check in case preloader was fast or already seen
    const timer = setTimeout(() => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        setIsVisible(true);
      }
    }, 2000);

    // Reopen listener from footer
    const handleReopen = () => {
      setIsVisible(true);
      setShowConfig(true);
    };
    window.addEventListener('open-cookie-settings', handleReopen);

    return () => {
      window.removeEventListener('preloader-finished', handlePreloaderDone);
      window.removeEventListener('open-cookie-settings', handleReopen);
      clearTimeout(timer);
    };
  }, []);

  const handleAcceptAll = () => {
    const consent = {
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    setIsVisible(false);
    setShowConfig(false);
  };

  const handleRejectAll = () => {
    const consent = {
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    setIsVisible(false);
    setShowConfig(false);
  };

  const handleSaveCustom = () => {
    const consent = {
      necessary: true,
      analytics: analyticsEnabled,
      marketing: marketingEnabled,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    setIsVisible(false);
    setShowConfig(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.aside
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          aria-label="Consentimiento de cookies RGPD"
          className="fixed bottom-4 sm:bottom-6 left-4 sm:left-6 z-[999] max-w-md w-[calc(100%-2rem)] select-none"
        >
          <div className="relative bg-[var(--petal)]/90 backdrop-blur-[16px] border border-[var(--line)] rounded-[20px] shadow-luxury p-5 sm:p-6 text-[var(--berry)] font-jost">
            {!showConfig ? (
              <div>
                <div className="flex items-center gap-2.5 mb-2.5">
                  <Cookie className="w-4 h-4 text-[var(--brand)]" />
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--brand)]">
                    Privacidad & Cookies
                  </span>
                </div>

                <p className="text-xs leading-relaxed text-[var(--berry)]/85 mb-4">
                  Utilizamos cookies necesarias para operar el portal de streaming y opcionales para analítica y personalización.{' '}
                  <a
                    href="#cookies"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowConfig(true);
                    }}
                    className="underline text-[var(--brand)] hover:opacity-80 transition-opacity"
                  >
                    Más información sobre cookies
                  </a>.
                </p>

                {/* 3 botones con el mismo peso visual */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={handleAcceptAll}
                    className="py-2.5 px-3 rounded-full bg-[var(--brand)] text-[var(--champagne)] font-jost text-[11px] uppercase tracking-[0.15em] font-medium text-center hover:opacity-90 active:scale-95 transition-all shadow-sm cursor-pointer"
                  >
                    Aceptar
                  </button>
                  <button
                    type="button"
                    onClick={handleRejectAll}
                    className="py-2.5 px-3 rounded-full border border-[var(--brand)] text-[var(--brand)] font-jost text-[11px] uppercase tracking-[0.15em] font-medium text-center hover:bg-[var(--brand)]/10 active:scale-95 transition-all cursor-pointer"
                  >
                    Rechazar
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowConfig(true)}
                    className="py-2.5 px-3 rounded-full border border-[var(--line)] bg-[var(--blush)]/70 text-[var(--berry)] font-jost text-[11px] uppercase tracking-[0.15em] font-medium text-center hover:bg-[var(--blush)] active:scale-95 transition-all cursor-pointer"
                  >
                    Configurar
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-3 border-b border-[var(--line)] pb-2.5">
                  <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4 text-[var(--brand)]" />
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--brand)]">
                      Preferencias de Privacidad
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

                <div className="space-y-3 mb-4 text-xs">
                  {/* Necesarias */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--blush)]/40 border border-[var(--line)]">
                    <div>
                      <div className="font-medium text-[var(--berry)]">Técnicas y Necesarias</div>
                      <div className="text-[10px] text-[var(--berry)]/70">Imprescindibles para el reproductor y streaming</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-[var(--brand)] text-[var(--champagne)] font-mono">
                      Bloqueada
                    </span>
                  </div>

                  {/* Analíticas */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--blush)]/40 border border-[var(--line)]">
                    <div>
                      <div className="font-medium text-[var(--berry)]">Analíticas de Rendimiento</div>
                      <div className="text-[10px] text-[var(--berry)]/70">Métricas anónimas de reproducción y tráfico</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAnalyticsEnabled(!analyticsEnabled)}
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                        analyticsEnabled ? 'bg-[var(--brand)]' : 'bg-[var(--line)]'
                      }`}
                      aria-label="Activar analíticas"
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          analyticsEnabled ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Marketing */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--blush)]/40 border border-[var(--line)]">
                    <div>
                      <div className="font-medium text-[var(--berry)]">Marketing y Redes</div>
                      <div className="text-[10px] text-[var(--berry)]/70">Interacción con feeds sociales y eventos</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setMarketingEnabled(!marketingEnabled)}
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                        marketingEnabled ? 'bg-[var(--brand)]' : 'bg-[var(--line)]'
                      }`}
                      aria-label="Activar marketing"
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          marketingEnabled ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSaveCustom}
                    className="flex-1 py-2.5 rounded-full bg-[var(--brand)] text-[var(--champagne)] font-jost text-[11px] uppercase tracking-[0.15em] font-medium text-center hover:opacity-90 transition-all cursor-pointer shadow-sm"
                  >
                    Guardar Selección
                  </button>
                  <button
                    type="button"
                    onClick={handleAcceptAll}
                    className="py-2.5 px-4 rounded-full border border-[var(--brand)] text-[var(--brand)] font-jost text-[11px] uppercase tracking-[0.15em] font-medium text-center hover:bg-[var(--brand)]/10 transition-all cursor-pointer"
                  >
                    Aceptar Todas
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
