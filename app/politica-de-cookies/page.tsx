import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Cookie, Info } from 'lucide-react';

export const metadata = {
  title: 'Política de Cookies | Thiago VSC Official',
  description: 'Información detallada sobre el uso de cookies y tecnologías de almacenamiento local.',
};

export default function CookiesPolicyPage() {
  return (
    <main className="min-h-screen bg-[#09070D] text-[#F5F5F7] font-mono py-12 px-4 sm:px-8 md:px-16 selection:bg-[#DE4176] selection:text-white">
      <div className="max-w-4xl mx-auto">
        
        {/* Navigation Back */}
        <div className="mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-[#DE4176] text-white text-xs uppercase tracking-wider transition-all duration-200 border border-white/15"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Inicio</span>
          </Link>
        </div>

        {/* Header */}
        <div className="border-b border-white/10 pb-8 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DE4176]/20 border border-[#DE4176]/40 text-[#DE4176] text-xs font-bold uppercase tracking-widest mb-4">
            <Cookie className="w-3.5 h-3.5" />
            <span>Información sobre Cookies y Almacenamiento Local</span>
          </div>
          <h1 
            className="text-4xl sm:text-5xl md:text-6xl font-black uppercase text-white tracking-tight"
            style={{ fontFamily: 'Arial Black, Impact, sans-serif' }}
          >
            POLÍTICA DE COOKIES
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-white/70 uppercase tracking-widest">
            Directiva ePrivacy 2002/58/CE y Guía de Cookies de la AEPD
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8 text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed">
          
          <section className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
            <h2 className="text-base sm:text-lg font-mono font-bold uppercase text-white mb-3">
              1. ¿Qué son las Cookies?
            </h2>
            <p>
              Una cookie es un pequeño archivo de texto que los sitios web descargan en su ordenador, teléfono inteligente o tableta cuando accede a determinadas páginas. Permiten a una página web, entre otras cosas, almacenar y recuperar información sobre los hábitos de navegación de un usuario o de su equipo y facilitar la entrega de contenido multimedia fluido.
            </p>
          </section>

          <section className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
            <h2 className="text-base sm:text-lg font-mono font-bold uppercase text-white mb-3">
              2. Tipos de Cookies Utilizadas en Este Sitio Web
            </h2>
            <div className="space-y-4 mt-4">
              
              <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                <span className="font-mono font-bold text-emerald-400 uppercase text-xs">
                  A. Cookies Técnicas y Estrictamente Necesarias (Exentas de Consentimiento)
                </span>
                <p className="mt-1 text-xs text-zinc-300">
                  Son aquellas indispensables para la navegación y el buen funcionamiento de la página web. Permiten controlar el tráfico, gestionar la sesión de usuario, reproducir contenido de streaming y guardar sus preferencias de cookies en <code>localStorage</code>.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                <span className="font-mono font-bold text-[#00ADEF] uppercase text-xs">
                  B. Cookies de Rendimiento y Reproductores Multimedia (Terceros)
                </span>
                <p className="mt-1 text-xs text-zinc-300">
                  Utilizadas por los servicios integrados de YouTube LLC y las emisoras de audio en directo para ajustar la tasa de bits, la resolución Ultra HD (4K) y gestionar el búfer de reproducción sin interrupciones.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                <span className="font-mono font-bold text-[#DE4176] uppercase text-xs">
                  C. Cookies Analíticas (Sujetas a Aceptación)
                </span>
                <p className="mt-1 text-xs text-zinc-300">
                  Permiten cuantificar el número de usuarios y realizar la medición y análisis estadístico de la utilización que hacen del portal, ayudando a optimizar el rendimiento y la velocidad de carga.
                </p>
              </div>

            </div>
          </section>

          <section className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
            <h2 className="text-base sm:text-lg font-mono font-bold uppercase text-white mb-3">
              3. ¿Cómo Gestionar o Revocar su Consentimiento?
            </h2>
            <p>
              En cualquier momento puede modificar o revocar su consentimiento pulsando en el botón <strong>"Configurar Cookies"</strong> disponible en el pie de página de este sitio web.
            </p>
            <p className="mt-3">
              Asimismo, puede permitir, bloquear o eliminar las cookies instaladas en su equipo mediante la configuración de las opciones del navegador instalado en su dispositivo:
            </p>
            <ul className="mt-2 space-y-1 list-disc list-inside text-zinc-400 font-mono text-xs">
              <li>Google Chrome: Configuración &gt; Privacidad y seguridad &gt; Cookies.</li>
              <li>Apple Safari: Preferencias &gt; Privacidad &gt; Bloquear cookies.</li>
              <li>Mozilla Firefox: Ajustes &gt; Privacidad & Seguridad &gt; Cookies.</li>
              <li>Microsoft Edge: Configuración &gt; Permisos del sitio &gt; Cookies.</li>
            </ul>
          </section>

        </div>

        {/* Footer info */}
        <div className="mt-12 pt-6 border-t border-white/10 text-center text-xs text-white/50 font-mono">
          Última actualización: Octubre de 2026 • THIAGO VSC OFFICIAL NETWORK
        </div>

      </div>
    </main>
  );
}
