"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import CyberpunkRainScene from "../components/CyberpunkRainScene";
import { getSettings } from "../utils/settings";
import { HOME_TRANSLATIONS } from "../utils/traductions/home";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Helper para reproducir sonido
function playSound(ref: React.RefObject<HTMLAudioElement>) {
  if (ref.current) {
    ref.current.currentTime = 0;
    ref.current.play().catch(() => {});
  }
}

export default function HomePage() {
  const [serverStatus, setServerStatus] = useState("Conectando...");
  const [playerName, setPlayerName] = useState<string>("Cargando...");
  const [onlineCount, setOnlineCount] = useState(0);
  const [lang, setLang] = useState<"es" | "en" | "pt">("es");

  // Audio refs
  const mainThemeRef = useRef<HTMLAudioElement | null>(null);
  const hoverRef = useRef<HTMLAudioElement | null>(null);
  const exitRef = useRef<HTMLAudioElement | null>(null);

  const router = useRouter();

  // Server simulation
  useEffect(() => {
    const timeout = setTimeout(() => {
      setServerStatus("Online");
      setOnlineCount(300);
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  // Load lang/settings
  useEffect(() => {
    const settings = getSettings();
    setPlayerName(settings.username || "Operador_21");
    setLang(settings.language || "es");
  }, []);

  const t = HOME_TRANSLATIONS[lang] || HOME_TRANSLATIONS.es;

  // Música principal al montar, volumen bajo
  useEffect(() => {
    if (mainThemeRef.current) {
      mainThemeRef.current.volume = 0.35;
      mainThemeRef.current.play().catch(() => {});
    }
  }, []);

  // HANDLERS
  const handleHover = () => {
    playSound(hoverRef);
  };

  // Salida: sonido + navegación tras delay
  const handleExitAndNavigate = useCallback(
    (to: string) => (e: React.MouseEvent) => {
      e.preventDefault();
      if (exitRef.current) {
        playSound(exitRef);
        setTimeout(() => {
          router.push(to);
        }, 600); // Match mp3 duration!
      } else {
        router.push(to);
      }
    },
    [router]
  );

  return (
    <div className="relative min-h-screen w-screen flex items-center justify-center font-body text-[#cfeaff] bg-[#050510]/95 backdrop-blur overflow-hidden">
      <CyberpunkRainScene />
      {/* AUDIO elements */}
      <audio ref={mainThemeRef} src="/assets/sounds/background-main-theme.mp3" loop autoPlay preload="auto" />
      <audio ref={hoverRef} src="/assets/sounds/hover.mp3" preload="auto" />
      <audio ref={exitRef} src="/assets/sounds/exit-scene.mp3" preload="auto" />

      <section className="relative z-10 w-full max-w-6xl mx-auto h-[82vh] rounded-3xl bg-[#071427]/60 border border-[#07b7ff33] shadow-[0_0_80px_#00eaff22] overflow-hidden flex">
        {/* HUD izquierdo */}
        <aside className="hidden md:flex flex-col w-28 items-center justify-between bg-gradient-to-b from-[#03182766] to-transparent border-r border-[#00eaff22] p-4">
            <div className="mt-4 text-xs text-[#9fe9ff] font-mono text-center">
                {t.hudSystem}
                <br />
                {t.hudNode}
            </div>
            <div className="text-[10px] text-[#00eaffaa] font-mono opacity-70">
                ● {serverStatus}
            </div>
            <div className="mb-6 text-xs text-[#9fe9ff] font-mono opacity-60">
                {t.hudStream}
            </div>
        </aside>

        {/* CONTENIDO PRINCIPAL */}
        <div className="flex-1 flex flex-col justify-between px-10 py-8 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl md:text-6xl font-title uppercase tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-[#ff2d95] via-[#7c3aed] to-[#00eaff] drop-shadow-[0_0_30px_#00eaff66] select-none">
              EMPIRE OF WAGERS
            </h1>
            <a
              onClick={handleExitAndNavigate("/settings")}
              onMouseEnter={handleHover}
              href="/settings"
              className="flex items-center justify-center w-10 h-10 rounded-md bg-[#021425bb] border border-[#00eaff33] shadow-[0_0_12px_#00eaff22] hover:scale-105 transition cursor-pointer"
              aria-label={t.settings}
              tabIndex={0}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path
                  d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7z"
                  fill="#cfeaff"
                />
                <path
                  d="M19.4 15a1 1 0 0 0 .2 1.09l.04.04a1 1 0 0 1-1.41 1.41l-.04-.04a1 1 0 0 0-1.09-.2 7.01 7.01 0 0 1-1.6.92 1 1 0 0 0-.64 1V20a1 1 0 0 1-2 0v-.01a1 1 0 0 0-.64-1 7.01 7.01 0 0 1-1.6-.92 1 1 0 0 0-1.09.2l-.04.04a1 1 0 1 1-1.41-1.41l.04-.04a1 1 0 0 0 .2-1.09 7.01 7.01 0 0 1-.92-1.6 1 1 0 0 0-1-.64H4a1 1 0 0 1 0-2h.01a1 1 0 0 0 1-.64c.18-.56.43-1.1.73-1.6a1 1 0 0 0-.2-1.09l-.04-.04a1 1 0 1 1 1.41-1.41l.04.04c.31.31.65.58 1.02.8.5.3 1.04.54 1.6.73a1 1 0 0 0 .64-1V4a1 1 0 0 1 2 0v.01c.2.39.46.74.77 1.06.3.5.54 1.04.73 1.6a1 1 0 0 0 1 .64H20a1 1 0 0 1 0 2h-.01a1 1 0 0 0-1 .64c-.18.56-.42 1.1-.73 1.6.31.31.58.65.8 1.02.31.31.54.66.7 1.03z"
                  fill="#9feaff"
                  opacity="0.9"
                />
              </svg>
            </a>
          </div>

          {/* Descripción */}
          <div className="flex flex-col items-center text-center mb-10">
            <p className="max-w-2xl text-[#cfeaffcc] leading-relaxed mb-4 select-none">
              {t.description}
            </p>
            <p className="text-[#68eaffaa] font-mono text-xs uppercase tracking-wider">
              {t.secureSystem}
            </p>
          </div>

          {/* Info central */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <InfoCard
              title={t.player}
              content={playerName}
              sub={t.alias}
              color="from-[#00eaff66] to-[#007bff55]"
              onHover={handleHover}
            />
            <InfoCard
              title={t.serverStatus}
              content={serverStatus}
              sub={`${onlineCount} ${t.playersOnline}`}
              color="from-[#49ff9a77] to-[#00ffc377]"
              onHover={handleHover}
            />
            <InfoCard
              title={t.mode}
              content={t.activeChannel}
              sub={t.pvpMode}
              color="from-[#b86cff77] to-[#ff66aa66]"
              onHover={handleHover}
            />
          </div>

          {/* Botones */}
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <a
              href="/game"
              onMouseEnter={handleHover}
              onClick={handleExitAndNavigate("/game")}
              className="relative px-10 py-3 font-title uppercase tracking-widest text-base text-[#e8f0ff]
                bg-gradient-to-r from-[#1056c6] via-[#25b6f8] to-[#05eaff]
                rounded-md shadow-[0_0_30px_rgba(0,255,255,0.15)]
                hover:shadow-[0_0_57px_rgba(0,255,255,0.37)] 
                transition-all duration-400 transform hover:-translate-y-1 overflow-hidden flex items-center justify-center cursor-pointer"
            >
              <span className="relative z-10">{t.startGame}</span>
              <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.10)_0%,rgba(255,255,255,0)_40%,rgba(255,255,255,0.13)_100%)] animate-shine" />
            </a>

            <a
              href="/instructions"
              onMouseEnter={handleHover}
              onClick={handleExitAndNavigate("/instructions")}
              className="text-sm text-[#9fe9ff] font-mono underline-offset-4 hover:underline cursor-pointer"
            >
              {t.howToPlay}
            </a>

            <a
              href="/settings"
              onMouseEnter={handleHover}
              onClick={handleExitAndNavigate("/settings")}
              className="text-sm text-[#9fe9ff] font-mono underline-offset-4 hover:underline cursor-pointer"
            >
              {t.settings}
            </a>
          </div>
        </div>

        {/* HUD derecho */}
        <aside className="hidden md:flex flex-col w-28 items-center justify-between bg-gradient-to-t from-[#03182766] to-transparent border-l border-[#00eaff22] p-4">
            <div className="mt-4 text-xs text-[#9fe9ff] font-mono text-center">
                {t.hudEnergy}
            </div>
            <div className="text-[10px] text-[#00eaffaa] font-mono">Ping: 42ms</div>
            <div className="mb-6 text-xs text-[#9fe9ff] font-mono opacity-60">
                {t.hudData}
            </div>
        </aside>
      </section>

      {/* Badge inferior */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center z-20">
        <span className="px-4 py-2 font-mono text-xs text-[#cfeaff] bg-[#031737bb] rounded-xl border border-[#00aaff33] backdrop-blur-lg tracking-wider shadow-[0_0_16px_#00d7ff29]">
          {t.secureNode}
        </span>
      </div>
    </div>
  );
}

/* InfoCard permite hover/click con sonido */
function InfoCard({
  title,
  content,
  sub,
  color,
  onHover,
}: {
  title: string;
  content: string;
  sub?: string;
  color?: string;
  onHover?: () => void;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl border border-[#00eaff33] bg-gradient-to-br ${color} p-4 md:p-6 text-center shadow-[inset_0_0_25px_rgba(0,200,255,0.08)]`}
      tabIndex={0}
      onMouseEnter={onHover}
      style={{ cursor: onHover ? "pointer" : "default" }}
    >
      <h3 className="text-sm uppercase text-[#b8eaffcc] tracking-wider mb-1">{title}</h3>
      <div className="text-xl md:text-2xl font-title text-[#e6faff] mb-1 drop-shadow-[0_0_10px_#00eaff66]">
        {content}
      </div>
      {sub && <p className="text-xs text-[#88cfff99]">{sub}</p>}
    </div>
  );
}
