'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, ShieldCheck, Settings, Check, X } from 'lucide-react';

const STORAGE_KEY = 'thiagovsc_cookie_consent';

export const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [showConfig, setShowConfig] = useState<boolean>(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState<boolean>(true);
  const [marketingEnabled, setMarketingEnabled] = useState<boolean>(true);

  useEffect(() => {
    // Check if user already made a decision
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      // Delay entrance slightly for ultra-smooth page load
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1200);
      return () => clearTimeout(timer);
    }

    // Listen for custom event to reopen settings from footer
    const handleReopen = () => {
      setIsVisible(true);
      setShowConfig(true);
    };
    window.addEventListener('open-cookie-settings', handleReopen);
    return () => window.removeEventListener('open-cookie-settings', handleReopen);
  }, []);

  const handleAcceptAll = () => {
    const consent = {
      essential: true,
      analytics: true,
      marketing: true,
      date: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    setIsVisible(false);
  };

  const handleAcceptNecessary = () => {
    const consent = {
      essential: true,
      analytics: false,
      marketing: false,
      date: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    setIsVisible(false);
  };

  const handleSaveCustom = () => {
    const consent = {
      essential: true,
      analytics: analyticsEnabled,
      marketing: marketingEnabled,
      date: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 80, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 80, opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-[999] max-w-lg w-[calc(100%-2rem)] select-none"
        >
          {/* Subtle Pink Ambient Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[#DE4176]/25 via-pink-200/20 to-[#DE4176]/25 rounded-3xl blur-xl opacity-75 pointer-events-none" />

          {/* Main Card Shell - PURE WHITE AESTHETIC */}
          <div className="relative w-full rounded-2xl sm:rounded-3xl bg-white/98 backdrop-blur-2xl border border-black/10 p-5 sm:p-6 shadow-[0_25px_70px_rgba(0,0,0,0.25)] text-zinc-900 font-mono">
            
            {/* Header: Icon + Title + Close */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#DE4176]/10 border border-[#DE4176]/30 flex items-center justify-center text-[#DE4176] shadow-sm">
                  <Cookie className="w-5 h-5 text-[#DE4176] animate-spin-slow" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#DE4176] animate-ping" />
                    <h4 className="text-xs sm:text-sm font-black tracking-wider uppercase text-zinc-950 font-sans">
                      POLÍTICA DE COOKIES
                    </h4>
                  </div>
                  <p className="text-[10px] text-zinc-500 tracking-widest uppercase">
                    THIAGOVSC OFFICIAL NETWORK
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAcceptNecessary}
                className="text-zinc-400 hover:text-zinc-800 transition-colors p-1 rounded-full hover:bg-zinc-100 cursor-pointer"
                title="Cerrar y continuar con esenciales"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Description */}
            <p className="text-[11px] sm:text-xs text-zinc-600 leading-relaxed mb-2 normal-case font-sans">
              Utilizamos cookies propias y de terceros para optimizar la reproducción de audio y vídeo 4K en directo, recordar tus preferencias de reproducción y analizar el tráfico de forma segura.
            </p>
            <div className="flex items-center gap-3 text-[10px] text-zinc-500 mb-3 font-sans">
              <a href="/politica-de-cookies" target="_blank" className="underline hover:text-[#DE4176] transition-colors">
                Leer política de cookies
              </a>
              <span>•</span>
              <a href="/politica-de-privacidad" target="_blank" className="underline hover:text-[#DE4176] transition-colors">
                Política de privacidad
              </a>
            </div>

            {/* Config Preferences Panel (Collapsible) */}
            {showConfig && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 pt-3 border-t border-zinc-200 space-y-2.5 text-[11px]"
              >
                {/* Essential */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 border border-zinc-200">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="font-bold text-zinc-900 uppercase text-[10px]">Técnicas y Esenciales</span>
                      <p className="text-[9px] text-zinc-500">Necesarias para la navegación y reproductores.</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-emerald-700 px-2 py-0.5 rounded bg-emerald-100 border border-emerald-200">
                    SIEMPRE ACTIVAS
                  </span>
                </div>

                {/* Analytics */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 border border-zinc-200">
                  <div>
                    <span className="font-bold text-zinc-900 uppercase text-[10px]">Analíticas & Rendimiento</span>
                    <p className="text-[9px] text-zinc-500">Medición de audiencia y velocidad de streaming.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAnalyticsEnabled(!analyticsEnabled)}
                    className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                      analyticsEnabled ? 'bg-[#DE4176]' : 'bg-zinc-300'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                        analyticsEnabled ? 'right-0.5' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>

                {/* Marketing */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 border border-zinc-200">
                  <div>
                    <span className="font-bold text-zinc-900 uppercase text-[10px]">Personalización & Media</span>
                    <p className="text-[9px] text-zinc-500">Integración con redes y eventos exclusivos.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMarketingEnabled(!marketingEnabled)}
                    className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                      marketingEnabled ? 'bg-[#DE4176]' : 'bg-zinc-300'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                        marketingEnabled ? 'right-0.5' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Action Buttons Row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-1">
              
              <button
                type="button"
                onClick={() => setShowConfig(!showConfig)}
                className="text-[10px] sm:text-[11px] font-bold text-zinc-500 hover:text-zinc-900 flex items-center justify-center gap-1 py-1.5 px-2 transition-colors cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5 text-[#DE4176]" />
                <span>{showConfig ? 'Ocultar opciones' : 'Configurar'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={showConfig ? handleSaveCustom : handleAcceptNecessary}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-[10px] sm:text-[11px] tracking-wider uppercase transition-all border border-zinc-200 cursor-pointer shadow-sm"
                >
                  {showConfig ? 'Guardar' : 'Solo necesarias'}
                </button>

                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="flex-1 sm:flex-none px-5 py-2 rounded-full bg-[#DE4176] hover:bg-[#c22e61] text-white font-black text-[10px] sm:text-[11px] tracking-wider uppercase transition-all shadow-[0_4px_15px_rgba(222,65,118,0.4)] hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Aceptar todas</span>
                </button>
              </div>

            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
