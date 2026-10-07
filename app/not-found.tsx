import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Radio, Tv } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#09070D] text-[#F5F5F7] font-mono flex flex-col items-center justify-center p-6 selection:bg-[#DE4176] selection:text-white relative overflow-hidden select-none">
      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#DE4176]/20 via-transparent to-black pointer-events-none" />

      {/* Decorative Hairline Accents */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="relative z-10 max-w-xl w-full text-center flex flex-col items-center">
        
        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg mb-6">
          <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-ping" />
          <span className="text-xs font-mono font-bold tracking-[0.2em] text-[#EF4444] uppercase">
            ERROR 404 // CANAL FUERA DE EMISIÓN
          </span>
        </div>

        {/* 404 Glitch/Solid Typography */}
        <h1 
          className="text-7xl sm:text-9xl font-black text-transparent tracking-tighter leading-none uppercase mb-4"
          style={{ 
            fontFamily: 'Arial Black, Impact, sans-serif',
            WebkitTextStroke: '2px #FFFFFF'
          }}
        >
          404
        </h1>

        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase mb-4" style={{ fontFamily: 'Arial Black, Impact, sans-serif' }}>
          FRECUENCIA NO ENCONTRADA
        </h2>

        <p className="text-xs sm:text-sm text-zinc-400 font-sans max-w-md mx-auto mb-8 leading-relaxed">
          La transmisión o página que buscas no existe o ha cambiado de sintonía en la red oficial de Thiago VSC.
        </p>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#DE4176] hover:bg-[#c22e61] text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-[0_4px_20px_rgba(222,65,118,0.4)] hover:scale-105 active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a la Transmisión</span>
          </Link>

          <Link
            href="/radio"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white text-white hover:text-black font-bold text-xs uppercase tracking-wider transition-all duration-200 border border-white/20"
          >
            <Radio className="w-4 h-4 text-[#00ADEF]" />
            <span>Abrir Radio Live</span>
          </Link>
        </div>

        <div className="mt-12 text-[10px] text-zinc-600 uppercase tracking-widest font-mono">
          THIAGOVSC NETWORK • 24/7 BROADCAST
        </div>

      </div>
    </main>
  );
}
