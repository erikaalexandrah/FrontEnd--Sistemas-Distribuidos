"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import CardView, { Card } from "@/app/components/Card";
import CyberpunkRainScene from "@/app/components/CyberpunkRainScene";
import Link from "next/link";
import { getSettings } from "@/app/utils/settings";
import { GAME_TRANSLATIONS } from "@/app/utils/traductions/game";

type Hand = Card[];

function makeDeck(decks = 1): Card[] {
  const ranks = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];
  const suits: Card["suit"][] = ["♠","♥","♦","♣"];
  const deck: Card[] = [];
  for (let n = 0; n < decks; n++) {
    for (const suit of suits) {
      for (const rank of ranks) {
        const value = rank === "A" ? 11 : ["J","Q","K"].includes(rank) ? 10 : Number(rank);
        deck.push({ id: `${n}-${suit}-${rank}`, rank, suit, value });
      }
    }
  }
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function HandView({ hand, hideFirst = false }: { hand: Hand; hideFirst?: boolean }) {
  const suitMap: Record<string, string> = {
    "♠": "spades",
    "♥": "hearts",
    "♦": "diamonds",
    "♣": "clubs",
  };
  return (
    <div className="flex gap-2 items-center flex-wrap justify-center">
      {hand.map((c, i) => {
        const img = `/images/cards/${String(c.rank).toLowerCase()}_of_${suitMap[c.suit]}.png`;
        return <CardView key={c.id} c={c} hidden={hideFirst && i === 0} image={img} />;
      })}
    </div>
  );
}

/* CHAT */
function ChatPanel({ playerName, t }: { playerName: string; t: any }) {
  const [messages, setMessages] = useState<{ user: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const send = () => {
    if (!input.trim()) return;
    setMessages((m) => [...m, { user: playerName, text: input.trim() }]);
    setInput("");
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-[#031827cc] border-l border-[#00eaff33] p-3">
      <div className="flex-1 overflow-y-auto pr-2 space-y-2 scrollbar-thin scrollbar-thumb-cyan-700/40">
        {messages.length === 0 ? (
          <p className="text-xs text-cyan-400/70">{t.noMessages}</p>
        ) : (
          messages.map((m, i) => (
            <div key={i} className="text-xs text-cyan-100 break-words">
              <span className="text-cyan-400">{m.user}:</span> {m.text}
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
      <div className="flex mt-2 gap-2">
        <input
          className="flex-1 text-sm px-3 py-2 rounded-lg bg-[#061e2f] border border-cyan-600/40 text-cyan-100 placeholder:text-cyan-400/40"
          placeholder={t.typeMessage}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <button
          onClick={send}
          className="px-3 py-2 text-xs bg-cyan-500/40 rounded-lg border border-cyan-400/40 text-cyan-100 hover:bg-cyan-400/60 transition"
        >
          {t.send}
        </button>
      </div>
    </div>
  );
}

export default function GameRoom() {
  const router = useRouter();
  const [dealer, setDealer] = useState<Hand>([]);
  const [player, setPlayer] = useState<Hand>([]);
  const [deck, setDeck] = useState<Card[]>([]);
  const [playerName, setPlayerName] = useState("Operador_21");
  const [t, setT] = useState<
    typeof GAME_TRANSLATIONS[keyof typeof GAME_TRANSLATIONS]
  >(GAME_TRANSLATIONS.es);

  useEffect(() => {
    const allowed = sessionStorage.getItem("gameAllowed");
    if (!allowed) {
      router.replace("/home");
      return;
    }

    const settings = getSettings();
    const lang = settings.language || "es";
    setPlayerName(settings.username || "Operador_21");
    setT(GAME_TRANSLATIONS[lang as keyof typeof GAME_TRANSLATIONS]);
  }, [router]);

  function dealInitial() {
    const d = makeDeck(2);
    const draw = () => d.shift()!;
    setDeck(d);
    setPlayer([draw(), draw()]);
    setDealer([draw(), draw()]);
  }

  return (
    <div className="relative min-h-screen w-screen flex items-center justify-center font-body text-[#cfeaff] bg-[#050510]/95 overflow-hidden">
      <CyberpunkRainScene />

      {/* Botón volver */}
      <div className="absolute top-5 left-5 z-30">
        <Link
          href="/home"
          aria-label={t.backHome}
          className="inline-flex items-center gap-2 bg-[#07142880] hover:bg-[#071428aa] text-[#cfeaff] px-3 py-2 rounded-md border border-[#00eaff33] shadow-[0_0_10px_#00eaff22] transition"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M19 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H19v-2z" fill="#cfeaff" />
          </svg>
          <span className="text-xs font-mono">{t.backHome}</span>
        </Link>
      </div>

      {/* Bloqueo mobile */}
      <div className="absolute inset-0 flex md:hidden items-center justify-center bg-[#030b1baa] backdrop-blur-md z-50 text-center px-6">
        <p className="text-cyan-200 text-lg font-semibold leading-relaxed">
          {t.computerOnly}
        </p>
      </div>

      {/* Layout centrado */}
      <main className="relative z-10 flex flex-row items-stretch w-full max-w-6xl h-[80vh] mx-auto bg-[#0b0e1a]/80 border-2 border-[#25b6f8] rounded-3xl overflow-hidden animate-fadein">
        <div className="flex-1 flex flex-col justify-between p-6">
          <header className="flex justify-between mb-6">
            <h2 className="text-cyan-300 font-title text-2xl">Empire of Wagers</h2>
            <span className="text-sm text-cyan-200">{playerName}</span>
          </header>

          <section className="rounded-2xl border border-cyan-700/40 bg-[#021425aa] p-6 flex-1 overflow-hidden">
            <div className="mb-3 text-cyan-300">{t.dealer}</div>
            <HandView hand={dealer} hideFirst />
            <div className="mt-6 mb-3 text-cyan-300">{playerName}</div>
            <HandView hand={player} />
            <div className="mt-4 flex gap-2 justify-center">
              <button
                onClick={dealInitial}
                className="px-6 py-3 bg-cyan-500/70 text-[#021425] font-bold rounded-md hover:brightness-110 active:scale-95 transition"
              >
                {t.deal}
              </button>
            </div>
          </section>
        </div>

        <aside className="hidden md:flex flex-col justify-between items-stretch w-80 h-full bg-gradient-to-t from-[#07264b80] to-[#07264b00] border-l border-[#2adbf555]">
          <ChatPanel playerName={playerName} t={t} />
        </aside>
      </main>
    </div>
  );
}
