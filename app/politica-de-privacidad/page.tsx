import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Lock, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Política de Privacidad | Thiago VSC Official',
  description: 'Tratamiento y protección de datos personales conforme al RGPD de la Unión Europea.',
};

export default function PrivacyPolicyPage() {
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
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Protección de Datos RGPD & LOPDGDD</span>
          </div>
          <h1 
            className="text-4xl sm:text-5xl md:text-6xl font-black uppercase text-white tracking-tight"
            style={{ fontFamily: 'Arial Black, Impact, sans-serif' }}
          >
            POLÍTICA DE PRIVACIDAD
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-white/70 uppercase tracking-widest">
            Reglamento General de Protección de Datos (UE 2016/679) y Ley Orgánica 3/2018
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8 text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed">
          
          <section className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
            <h2 className="text-base sm:text-lg font-mono font-bold uppercase text-white mb-3">
              1. Responsable del Tratamiento
            </h2>
            <p>
              El responsable del tratamiento de los datos personales recopilados a través de este portal es:
            </p>
            <ul className="mt-3 space-y-1 list-disc list-inside text-zinc-400 font-mono text-xs">
              <li><strong>Identidad:</strong> Thiago VSC Entertainment & Digital Media S.L.</li>
              <li><strong>NIF:</strong> B-88741259</li>
              <li><strong>Dirección:</strong> Calle Gran Vía 28, 28013 Madrid, España</li>
              <li><strong>Delegado de Protección de Datos (DPO):</strong> dpo@thiagovsc.com</li>
            </ul>
          </section>

          <section className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
            <h2 className="text-base sm:text-lg font-mono font-bold uppercase text-white mb-3">
              2. Finalidad y Base Jurídica del Tratamiento
            </h2>
            <p>
              Tratamos los datos que nos facilitan los usuarios con las siguientes finalidades legítimas:
            </p>
            <ul className="mt-3 space-y-2 list-disc list-inside text-zinc-300">
              <li><strong>Gestión de consultas y contacto:</strong> Atender las solicitudes de información, contratación o colaboraciones remitidas a través de los canales de correo electrónico (Base legal: consentimiento del interesado, Art. 6.1.a RGPD).</li>
              <li><strong>Optimización de streaming y rendimiento:</strong> Monitorización técnica de la entrega de streams de audio y video en alta definición (Base legal: interés legítimo, Art. 6.1.f RGPD).</li>
              <li><strong>Cumplimiento normativo:</strong> Cumplir con obligaciones legales aplicables en materia de comercio electrónico y telecomunicaciones (Art. 6.1.c RGPD).</li>
            </ul>
          </section>

          <section className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
            <h2 className="text-base sm:text-lg font-mono font-bold uppercase text-white mb-3">
              3. Plazo de Conservación de los Datos
            </h2>
            <p>
              Los datos personales proporcionados se conservarán durante el tiempo estrictamente necesario para cumplir con la finalidad para la que se recabaron y para determinar las posibles responsabilidades que se pudieran derivar de dicha finalidad y del tratamiento de los datos, o hasta que el usuario solicite su supresión.
            </p>
          </section>

          <section className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
            <h2 className="text-base sm:text-lg font-mono font-bold uppercase text-white mb-3">
              4. Destinatarios y Transferencias Internacionales
            </h2>
            <p>
              No se cederán datos a terceros salvo obligación legal expresa. Para la prestación técnica de servicios multimedia se utilizan proveedores tecnológicos de primer nivel (como plataformas de CDN y streaming) bajo acuerdos de encargo de tratamiento con garantías adecuadas (Cláusulas Contractuales Tipo de la Comisión Europea).
            </p>
          </section>

          <section className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
            <h2 className="text-base sm:text-lg font-mono font-bold uppercase text-white mb-3">
              5. Derechos de los Usuarios (ARCO-POL)
            </h2>
            <p>
              Cualquier usuario tiene derecho a obtener confirmación sobre si en THIAGO VSC estamos tratando sus datos personales. Puede ejercer sus derechos de:
            </p>
            <ul className="mt-3 space-y-1 list-disc list-inside text-zinc-400 font-mono text-xs">
              <li><strong>Acceso:</strong> Saber qué datos tenemos almacenados.</li>
              <li><strong>Rectificación:</strong> Modificar datos inexactos o incompletos.</li>
              <li><strong>Supresión:</strong> Solicitar el borrado de sus datos cuando ya no sean necesarios.</li>
              <li><strong>Limitación del tratamiento y Oposición:</strong> Restringir oponerse a tratamientos concretos.</li>
              <li><strong>Portabilidad:</strong> Recibir los datos en formato estructurado.</li>
            </ul>
            <p className="mt-4">
              Para ejercer estos derechos, puede remitir un correo electrónico acreditando su identidad a <strong>privacidad@thiagovsc.com</strong> o presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD, www.aepd.es).
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
