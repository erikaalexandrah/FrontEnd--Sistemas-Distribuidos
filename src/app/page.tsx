"use client";
import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CyberpunkRainScene from "./components/CyberpunkRainScene";
import { getSettings } from "./utils/settings";
import { GAME_TRANSLATIONS } from "./utils/traductions/game";

export default function HomeIntro() {
  const [showVideo, setShowVideo] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [t, setT] = useState<
    typeof GAME_TRANSLATIONS[keyof typeof GAME_TRANSLATIONS]
  >(GAME_TRANSLATIONS.es);
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();

  useEffect(() => {
    const settings = getSettings();
  const lang = settings.language || "es";
  setT(GAME_TRANSLATIONS[lang as keyof typeof GAME_TRANSLATIONS] || GAME_TRANSLATIONS.es);

    // Detectar móvil
    const checkMobile = () => {
      const ua = navigator.userAgent.toLowerCase();
      if (/mobile|android|iphone|ipad|ipod/i.test(ua)) {
        setIsMobile(true);
      }
    };
    checkMobile();
  }, []);

  const handlePlay = () => {
    setShowVideo(true);
  };

  return (
    <main className="relative min-h-screen w-screen flex flex-col items-center justify-center font-body text-[#cfeaff] bg-[#050510]/95 backdrop-blur overflow-hidden select-none">
      {/* Fondo dinámico */}
      <CyberpunkRainScene onReady={() => setIsLoaded(true)} />

      {/* 🔒 Bloqueo para móviles */}
      {isMobile && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#030b1baa] backdrop-blur-md text-center px-8">
          <p className="text-cyan-200 text-lg font-semibold leading-relaxed">
            {t.computerOnly}
          </p>
        </div>
      )}

      {/* Pantalla principal */}
      {!showVideo && isLoaded && !isMobile && (
        <div className="relative z-20 flex flex-col items-center text-center space-y-6 animate-fade-in-slow">
          {/* Logo principal */}
          <h1
            className="text-4xl md:text-6xl font-title uppercase tracking-[0.2em]
            text-transparent bg-clip-text bg-gradient-to-r from-[#24a7f5] via-[#38fff7] to-[#48ffb7]
            drop-shadow-[0_0_25px_#00eaffbb]"
          >
            Empire of Wagers
          </h1>

          {/* Subtítulo */}
          <p className="text-sm md:text-base text-[#a9dfffbb] tracking-widest font-mono animate-fade-in-slower">
            Sistema de juego en espera...{" "}
            <span className="text-[#35f0ff]">NODE_21</span>
          </p>

          {/* Botón Iniciar */}
          <button
            onClick={handlePlay}
            className="relative group px-10 py-3 font-title uppercase tracking-widest text-lg text-[#e8f0ff]
              bg-gradient-to-r from-[#009dff] via-[#12f3c9] to-[#4affac]
              rounded-md shadow-[0_0_35px_rgba(0,255,255,0.25)]
              hover:shadow-[0_0_80px_rgba(0,255,200,0.5)]
              transition-all duration-500 transform hover:-translate-y-1 overflow-hidden flex items-center gap-3
              before:absolute before:inset-0 before:bg-[linear-gradient(120deg,rgba(255,255,255,0.15)_0%,rgba(255,255,255,0)_40%,rgba(255,255,255,0.18)_100%)] before:animate-shine
              animate-pulse-slow"
          >
            <span className="relative z-10 font-semibold">{t.start || "Iniciar"}</span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="relative z-10"
            >
              <path d="M7 5v14l11-7L7 5z" fill="#ffffff" />
            </svg>
          </button>

          {/* Línea decorativa */}
          <div className="h-[1px] w-40 bg-gradient-to-r from-transparent via-[#23c4ff] to-transparent opacity-60 mt-10 animate-scanline" />

          <p className="text-[10px] text-[#6bbcff88] tracking-wider font-mono animate-fade-in-slower">
            nodo seguro activo ∎ canal cifrado
          </p>
        </div>
      )}

      {/* 🎬 Video Intro */}
      {showVideo && !isMobile && (
        <>
          <video
            ref={videoRef}
            src="/videos/intro.mp4"
            autoPlay
            playsInline
            muted
            controls={false}
            onEnded={() => router.push("/home")}
            className="fixed inset-0 w-full h-full object-cover z-40"
          />

          <button
            onClick={() => router.push("/home")}
            className="absolute top-6 right-6 z-50 px-4 py-2 rounded-md bg-[#000000aa] text-white backdrop-blur-sm border border-[#00eaff33] hover:bg-[#000000cc] transition"
          >
            {t.skip || "Saltar"}
          </button>
        </>
      )}
    </main>
  );
}
