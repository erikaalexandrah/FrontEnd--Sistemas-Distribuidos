"use client";

import { useState, useEffect, useMemo } from "react";
import CyberpunkRainScene from "../components/CyberpunkRainScene";
import { getSettings } from "../utils/settings";
import { GAME_TRANSLATIONS } from "../utils/traductions/game";
import { useRouter } from "next/navigation";

export default function GamePage() {
  const router = useRouter();
  const [phase, setPhase] = useState<"lobby" | "connecting">("lobby");
  const [players, setPlayers] = useState(2);
  const [connected, setConnected] = useState(0);
  const [connectingNames, setConnectingNames] = useState<string[]>([]);
  const [playerName, setPlayerName] = useState("Operador_21");
  const [t, setT] = useState<
    typeof GAME_TRANSLATIONS[keyof typeof GAME_TRANSLATIONS]
  >(GAME_TRANSLATIONS.es);

  useEffect(() => {
    const settings = getSettings();
    const lang = settings.language || "es";
    setPlayerName(settings.username || "Operador_21");
    // TS: narrow the index so keyof typeof GAME_TRANSLATIONS is used
    setT(GAME_TRANSLATIONS[lang as keyof typeof GAME_TRANSLATIONS]);
  }, []);

  const allNames = useMemo(
    () => [playerName, "NPC_01", "NPC_02", "NPC_03"].slice(0, players),
    [playerName, players]
  );

  useEffect(() => {
    if (phase === "connecting") {
      setConnectingNames([]);
      setConnected(0);

      const interval = setInterval(() => {
        setConnected((c) => {
          const next = c + 1;
          if (next <= players) setConnectingNames(allNames.slice(0, next));

          // cuando termina, redirige al room
          if (next === players) {
            clearInterval(interval);
            sessionStorage.setItem("gameAllowed", "true");
            setTimeout(() => router.push("/room"), 1000);
          }
          return next;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [phase, players, allNames, router]);

  return (
    <div className="relative flex flex-col items-center justify-center h-screen w-screen bg-[#050510]/95 text-cyan-200 font-body overflow-hidden">
      <CyberpunkRainScene />

      {phase === "lobby" && (
        <section className="relative z-10 flex flex-col items-center justify-center text-center w-full max-w-md h-[80vh] bg-[#0b0e1a]/80 border-2 border-[#25b6f8] rounded-3xl p-8">
          <h1 className="text-3xl font-title text-cyan-300 mb-6">EMPIRE OF WAGERS</h1>
          <p className="text-sm text-cyan-100/80 mb-4">{t.selectPlayers}</p>
          <div className="flex justify-center gap-4 mb-6">
            {[2, 3, 4].map((n) => (
              <button
                key={n}
                onClick={() => setPlayers(n)}
                className={`px-4 py-2 rounded-lg border ${
                  n === players
                    ? "border-cyan-400 bg-cyan-500/30"
                    : "border-cyan-700/40"
                } hover:bg-cyan-500/20 transition`}
              >
                {n} Players
              </button>
            ))}
          </div>
          <button
            onClick={() => setPhase("connecting")}
            className="px-6 py-3 bg-cyan-400/80 text-[#021425] font-bold rounded-md hover:brightness-110 active:scale-95 transition"
          >
            {t.connect}
          </button>
        </section>
      )}

      {phase === "connecting" && (
        <section className="relative z-10 flex flex-col items-center justify-center text-center w-full max-w-md h-[80vh] bg-[#0b0e1a]/80 border-2 border-[#25b6f8] rounded-3xl p-8">
          <h2 className="text-cyan-300 mb-3 text-xl font-title">{t.connecting}</h2>
          <div className="flex flex-col gap-2 text-sm text-cyan-100/80 mb-4">
            {connectingNames.map((name, i) => (
              <span key={i}>✔ {name} {t.connected}</span>
            ))}
          </div>
          <div className="w-full bg-cyan-900/30 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-400 transition-all duration-700"
              style={{ width: `${(connected / players) * 100}%` }}
            ></div>
          </div>
        </section>
      )}
    </div>
  );
}
