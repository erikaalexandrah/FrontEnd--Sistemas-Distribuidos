"use client";

import { useEffect, useState } from "react";
import CyberpunkRainScene from "../components/CyberpunkRainScene";
import Link from "next/link";
import { getSettings } from "../utils/settings";
import { INSTRUCTIONS_TRANSLATIONS } from "../utils/traductions/instructions";

export default function InstructionsPage() {
  const [t, setT] = useState(INSTRUCTIONS_TRANSLATIONS.es);

  useEffect(() => {
    const s = getSettings();
    const language = s.language || "es";
    setT(INSTRUCTIONS_TRANSLATIONS[language]);
  }, []);

  return (
    <div className="relative min-h-screen w-screen flex items-center justify-center font-body text-[#cfd8ff] bg-[#050510]/95 backdrop-blur overflow-hidden">
      <CyberpunkRainScene />

      {/* Back button */}
      <div className="absolute top-5 left-5 z-30">
        <Link
          href="/home"
          aria-label={t.backHome}
          className="inline-flex items-center gap-2 bg-[#07142880] hover:bg-[#071428aa] text-[#cfeaff] px-3 py-2 rounded-md border border-[#00eaff33] shadow-[0_0_10px_#00eaff22] transition"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M19 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H19v-2z" fill="#cfeaff" />
          </svg>
          <span className="text-xs font-mono">{t.exit}</span>
        </Link>
      </div>

      {/* Panel central */}
      <section
        className="relative z-10 flex flex-row items-stretch
          w-full max-w-5xl h-[80vh] mx-auto
          bg-[#0b0e1a]/80 border-2 border-[#25b6f8]
          shadow-[0_0_80px_#00eaff50,0_0_10px_#03173750_inset]
          rounded-3xl overflow-hidden pointer-events-auto"
      >
        {/* HUD izquierda */}
        <aside className="hidden md:flex flex-col justify-between items-center w-24 bg-gradient-to-b from-[#07264b80] to-[#07264b00] border-r border-[#2adbf555] relative z-20">
          <div className="mt-7 flex flex-col items-center gap-4">
            <span className="px-2 py-1 rounded bg-[#111f3344] text-cyan-300 text-xs font-mono tracking-wider">SISTEMA</span>
            <span className="text-[11px] text-[#38e0ff]">NODE_21</span>
            <span className="w-5 h-5 rounded-full border-[2.5px] border-[#2adbf8] bg-[#151f3250] shadow-[0_0_13px_#0bbfff] animate-pulse"></span>
            <span className="block mt-12 border-b border-[#2adbf555] w-10 opacity-40"></span>
            <span className="text-xs text-[#0deaffaa]">{t.encrypted}</span>
          </div>
          <div className="mb-6 text-cyan-800 text-[10px] font-mono opacity-60">
            <span>●</span> <span className="blink">stream</span>
          </div>
        </aside>

        {/* PANEL CENTRAL CON TODO EL TEXTO ORIGINAL */}
        <div className="flex-1 flex flex-col justify-between h-full px-7 py-7 md:py-10">
          <div className="overflow-y-auto max-h-[57vh] pr-2">
            <h1 className="text-2xl md:text-5xl font-title uppercase font-bold tracking-[0.15em]
              text-transparent bg-clip-text bg-gradient-to-r from-[#25b6f8] via-[#55d9fb] to-[#bbfafe] drop-shadow-[0_0_25px_#00eaffcc] mb-6 text-center">
              {t.title}
            </h1>

            {/* Renderizamos el bloque completo traducido */}
            <div className="space-y-6 text-left text-base leading-relaxed">
              {t.fullText.map((block, i) => (
                <div key={i} dangerouslySetInnerHTML={{ __html: block }} />
              ))}
            </div>
          </div>

          {/* Botón jugar */}
          <div className="flex justify-center items-end gap-4 pt-2">
            <Link
              href="/game"
              className="relative px-8 py-3 font-title uppercase tracking-widest text-base text-[#e8f0ff]
                bg-gradient-to-r from-[#1056c6] via-[#25b6f8] to-[#05eaff]
                rounded-md shadow-[0_0_30px_rgba(0,255,255,0.15)]
                hover:shadow-[0_0_57px_rgba(0,255,255,0.37)] 
                transition-all duration-400 transform hover:-translate-y-1 overflow-hidden flex items-center justify-center"
            >
              <span className="relative z-10">{t.play}</span>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-95">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M5 3v18l15-9L5 3z" fill="#000000" opacity="0.12" />
                  <path d="M7 5v14l11-7L7 5z" fill="#ffffff" />
                </svg>
              </div>
              <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.10)_0%,rgba(255,255,255,0)_40%,rgba(255,255,255,0.13)_100%)] animate-shine"></div>
            </Link>
          </div>
        </div>

        {/* HUD derecha */}
        <aside className="hidden md:flex flex-col justify-between items-center w-24 bg-gradient-to-t from-[#07264b80] to-[#07264b00] border-l border-[#2adbf555] relative z-20">
          <div className="mt-7 flex flex-col items-center gap-3">
            <span className="w-5 h-5 bg-[#00eaff] rounded-full shadow-[0_0_13px_#26e4ff80]"></span>
            <span className="text-xs text-[#55e2ff99] font-mono tracking-tight">energia</span>
            <span className="w-4 h-4 rounded bg-[#14f2d066] mb-6"></span>
            <span className="border-t border-[#2adbf555] w-10 opacity-40"></span>
            <span className="mt-8 text-xs text-[#0deaff88]">Blackjack<br />buffs</span>
          </div>
          <div className="mb-6 text-cyan-800 text-[10px] font-mono opacity-60">
            <span>●</span> <span className="blink">data</span>
          </div>
        </aside>
      </section>

      {/* Barra inferior */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center z-20">
        <span className="px-4 py-1 font-mono text-xs text-cyan-300 bg-[#031737bb] rounded-xl border border-[#00aaff33] backdrop-blur-lg tracking-wider shadow-[0_0_16px_#00d7ff29]">
          {t.secureNode}
        </span>
      </div>
    </div>
  );
}
