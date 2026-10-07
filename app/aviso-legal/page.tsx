import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, FileText } from 'lucide-react';

export const metadata = {
  title: 'Aviso Legal | Thiago VSC Official',
  description: 'Información legal y condiciones generales de uso del sitio web oficial de Thiago VSC.',
};

export default function LegalNoticePage() {
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
            <FileText className="w-3.5 h-3.5" />
            <span>Documento Legal Oficial</span>
          </div>
          <h1 
            className="text-4xl sm:text-5xl md:text-6xl font-black uppercase text-white tracking-tight"
            style={{ fontFamily: 'Arial Black, Impact, sans-serif' }}
          >
            AVISO LEGAL
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-white/70 uppercase tracking-widest">
            En cumplimiento de la Ley 34/2002 de Servicios de la Sociedad de la Información (LSSI-CE)
          </p>
        </div>

        {/* Legal Content */}
        <div className="space-y-8 text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed">
          
          <section className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
            <h2 className="text-base sm:text-lg font-mono font-bold uppercase text-white mb-3">
              1. Datos Identificativos del Titular
            </h2>
            <p>
              En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se informa a los usuarios de los datos identificativos del titular de este sitio web:
            </p>
            <ul className="mt-3 space-y-1 list-disc list-inside text-zinc-400 font-mono text-xs">
              <li><strong>Denominación comercial:</strong> THIAGO VSC MEDIA NETWORK</li>
              <li><strong>Titular:</strong> Thiago VSC Entertainment & Digital Media S.L.</li>
              <li><strong>NIF/CIF:</strong> B-88741259</li>
              <li><strong>Domicilio Social:</strong> Calle Gran Vía 28, 28013 Madrid, España</li>
              <li><strong>Correo electrónico de contacto:</strong> contacto@thiagovsc.com</li>
              <li><strong>Actividad principal:</strong> Entretenimiento multimedia, transmisiones de radio online y streaming audiovisual.</li>
            </ul>
          </section>

          <section className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
            <h2 className="text-base sm:text-lg font-mono font-bold uppercase text-white mb-3">
              2. Objeto y Condiciones Generales de Uso
            </h2>
            <p>
              El presente sitio web tiene por objeto facilitar al público en general información sobre las actividades, contenidos multimedia, reproductor de televisión online 4K, emisiones de radio en directo y galería de eventos de THIAGO VSC.
            </p>
            <p className="mt-3">
              El acceso y navegación por este sitio web atribuye la condición de Usuario, implicando la aceptación plena y sin reservas de todas y cada una de las disposiciones incluidas en este Aviso Legal. El usuario se compromete a hacer un uso lícito y adecuado de los servicios y contenidos disponibles.
            </p>
          </section>

          <section className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
            <h2 className="text-base sm:text-lg font-mono font-bold uppercase text-white mb-3">
              3. Propiedad Intelectual e Industrial
            </h2>
            <p>
              Todos los elementos que integran este sitio web (incluyendo textos, marcas, logotipos, combinaciones cromáticas, código fuente, interfaz gráfica de usuario y producción audiovisual propia) son titularidad de THIAGO VSC o de terceros licenciantes y están protegidos por la legislación española e internacional sobre propiedad intelectual e industrial.
            </p>
            <p className="mt-3">
              Los reproductores de video y audio en streaming integran APIs públicas y contenidos de terceros (YouTube LLC y proveedores oficiales de radio). Queda expresamente prohibida la reproducción total o parcial con fines comerciales sin previa autorización escrita.
            </p>
          </section>

          <section className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
            <h2 className="text-base sm:text-lg font-mono font-bold uppercase text-white mb-3">
              4. Exclusión de Responsabilidad
            </h2>
            <p>
              El titular no se hace responsable de los daños y perjuicios de cualquier naturaleza que pudieran ocasionar la falta de disponibilidad temporal del portal, caídas imprevistas de los servidores de streaming externos o la transmisión de virus informáticos a pesar de haber adoptado todas las medidas tecnológicas de seguridad.
            </p>
          </section>

          <section className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
            <h2 className="text-base sm:text-lg font-mono font-bold uppercase text-white mb-3">
              5. Legislación Aplicable y Jurisdicción
            </h2>
            <p>
              Para la resolución de todas las controversias o cuestiones relacionadas con el presente sitio web o de las actividades en él desarrolladas, será de aplicación la legislación española vigente, sometiéndose expresamente las partes a la competencia de los Juzgados y Tribunales de la ciudad de Madrid (España).
            </p>
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
