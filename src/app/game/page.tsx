"use client";

import { useState, useEffect, useRef } from "react";
import { ChatPanel } from "./ChatPanel";
import CyberpunkRainScene from "@/app/components/CyberpunkRainScene";
import AnimatedCard from "../components/AnimatedCard";

type CardSimple = { name: string; suit?: string };
type Player = { id: string; name: string; hp: number };

function calcularPuntos(hand: CardSimple[]) {
  let total = 0;
  let aces = 0;
  for (const card of hand) {
    const val = card.name.toLowerCase();
    if (val === "a") {
      aces++;
      total += 11;
    } else if (["k", "q", "j"].includes(val)) {
      total += 10;
    } else {
      total += parseInt(val) || 0;
    }
  }
  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }
  return total;
}

export default function GamePage() {
  const [phase, setPhase] = useState<"lobby" | "game">("lobby");
  const [players, setPlayers] = useState(2);
  const [connected, setConnected] = useState(0);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState("Operador_21");
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [playersList, setPlayersList] = useState<Player[]>([]);
  const [roundResults, setRoundResults] = useState<any[]>([]);
  const [roundFinished, setRoundFinished] = useState(false);
  const [myHp, setMyHp] = useState(60);
  const [hands, setHands] = useState<{ [id: string]: CardSimple[] }>({});
  const [myHand, setMyHand] = useState<CardSimple[]>([]);
  const [planted, setPlanted] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const pingTimerRef = useRef<number | null>(null);
  const PING_INTERVAL_MS = 10000;

  function cleanupPing() {
    if (pingTimerRef.current) {
      window.clearInterval(pingTimerRef.current);
      pingTimerRef.current = null;
    }
  }

  function disconnectWS() {
    if (wsRef.current) {
      try {
        wsRef.current.close(1000, "client disconnect");
      } catch {}
      wsRef.current = null;
    }
    cleanupPing();
    setConnected(0);
    setRoomId(null);
    setPhase("lobby");
    setPlayerId(null);
    setPlayersList([]);
    setMyHand([]);
    setHands({});
    setRoundResults([]);
    setRoundFinished(false);
    setMyHp(60);
    setPlanted(false);
  }

  function connectWS() {
    const url = `wss://cards.titranx.com/ws/game?desired_players=${players}`;
    if (wsRef.current) {
      try {
        wsRef.current.close(1000, "reconnect");
      } catch {}
      wsRef.current = null;
    }

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      cleanupPing();
      pingTimerRef.current = window.setInterval(() => {
        try {
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send("ping");
          }
        } catch {}
      }, PING_INTERVAL_MS);
    };

    ws.onmessage = (msgEvent) => {
      try {
        const data = JSON.parse(msgEvent.data);
        if (!data) return;

        if (data.type === "waiting") {
          setRoomId(data.room_id);
          setConnected(data.players);
          if (data.players_list) setPlayersList(data.players_list);
          setPhase("lobby");
          setRoundFinished(false);
        }

        else if (data.type === "start") {
          setPhase("game");
          setHands({});
          setMyHand([]);
          setRoundResults([]);
          setMyHp(60);
          setRoundFinished(false);
          setPlanted(false);
          if (data.player_id) setPlayerId(data.player_id);
          if (data.players_list) setPlayersList(data.players_list);
        }

        else if (data.type === "draw_result") {
          if (data.card) setMyHand((prev) => [...prev, data.card]);
        }

        else if (data.type === "update_hand") {
          if (data.hand) setMyHand(data.hand);
        }

        else if (data.type === "round_result") {
          setRoundResults(data.results);
          setRoundFinished(true);
          setPlanted(false);
          if (data.hands) {
            setHands(data.hands);
            if (playerId && data.hands[playerId]) setMyHand(data.hands[playerId]);
          }
        }

        else if (data.type === "players_list") {
          setPlayersList(data.players);
        }
      } catch {}
    };

    ws.onclose = () => disconnectWS();
    ws.onerror = () => {};
  }

  useEffect(() => {
    return () => disconnectWS();
  }, []);

  useEffect(() => {
    if (wsRef.current) connectWS();
  }, [players]);

  function pedirCarta() {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && !roundFinished) {
      wsRef.current.send(
        JSON.stringify({ type: "action", action: { decision: "draw" } })
      );
    }
  }

  function plantarse() {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && !roundFinished) {
      wsRef.current.send(
        JSON.stringify({ type: "action", action: { decision: "stand" } })
      );
      setPlanted(true);
    }
  }

  function siguienteRonda() {
    setRoundResults([]);
    setMyHand([]);
    setHands({});
    setRoundFinished(false);
    setPlanted(false);
  }

  const puntosMano = calcularPuntos(myHand);

  function renderHandAnimated(hand: CardSimple[]) {
    return (
      <div className="flex gap-3 mt-3">
        {hand.map((c, i) => (
          <AnimatedCard key={i} card={c} index={i} />
        ))}
      </div>
    );
  }

  // -----------------------------------------------------
  // LOBBY — Futuristic Panel UI
  // -----------------------------------------------------
  if (phase === "lobby") {
    return (
      <div className="relative min-h-screen w-screen flex flex-col items-center justify-center font-body bg-[#050510] overflow-hidden">
        <CyberpunkRainScene />

        <h1 className="absolute top-5 text-4xl font-title text-cyan-300 drop-shadow-[0_0_10px_#21d4fd]">
          EMPIRE OF WAGERS
        </h1>

        <section className="relative z-10 flex flex-col items-center justify-start text-center w-full max-w-lg bg-[#0b0e1ac0] backdrop-blur-xl border border-cyan-400/40 rounded-3xl p-10 shadow-[0_0_25px_#00c8ff55]">
          <h2 className="text-xl mb-4 tracking-widest text-cyan-200">
            CONFIGURAR SALA
          </h2>

          <div className="flex justify-center gap-4 mb-6">
            {[2, 3, 4].map((n) => (
              <button
                key={n}
                onClick={() => setPlayers(n)}
                className={`px-6 py-3 text-lg rounded-xl border transition-all duration-200
                ${
                  n === players
                    ? "border-cyan-400 bg-cyan-500/30 shadow-[0_0_12px_#55eaff]"
                    : "border-cyan-700/40 hover:bg-cyan-500/10"
                }`}
              >
                {n} Jugadores
              </button>
            ))}
          </div>

          <button
            onClick={() => (wsRef.current ? disconnectWS() : connectWS())}
            className="px-8 py-4 rounded-xl font-bold bg-cyan-400/80 text-[#021425]
              hover:brightness-110 transition shadow-[0_0_15px_#21d4fd]"
          >
            {wsRef.current ? "Desconectar" : "Conectar"}
          </button>

          <div className="flex flex-col gap-2 text-sm text-cyan-200/80 mt-5">
            {Array.from({ length: connected }).map((_, i) => (
              <span key={i}>✔ {(i === 0 ? playerName : "Jugador " + (i + 1))}</span>
            ))}
          </div>

          {roomId && (
            <p className="text-xs text-cyan-500 mt-4 opacity-70">
              Room ID: <code>{roomId}</code>
            </p>
          )}
        </section>
      </div>
    );
  }

  // -----------------------------------------------------
  // GAME — Futuristic Table UI
  // -----------------------------------------------------
  return (
    <div className="relative min-h-screen w-screen font-body bg-[#050510] text-[#cfeaff] overflow-hidden flex flex-col items-center">
      <CyberpunkRainScene />

      <header className="absolute top-4 left-6 z-30 flex gap-6 items-center">
        <span className="text-3xl font-title text-cyan-300 drop-shadow-[0_0_12px_#21d4fd]">
          EMPIRE OF WAGERS
        </span>
      </header>

      <main className="relative z-20 w-full max-w-7xl h-[85vh] mt-20 grid grid-cols-12 gap-6 px-4">
        
        {/* LEFT PANEL */}
        <aside className="col-span-3 bg-[#07264b99] border border-cyan-400/30 backdrop-blur-lg rounded-2xl p-6 shadow-[0_0_20px_#009dff55] flex flex-col">
          <h2 className="text-xl text-cyan-200 mb-6 tracking-widest">
            CONTROL
          </h2>

          <button
            className="w-full px-6 py-4 bg-cyan-500/70 text-[#021425] text-lg font-bold rounded-xl 
              hover:brightness-110 active:scale-95 transition mb-3 shadow-[0_0_12px_#21d4fd]"
            onClick={pedirCarta}
            disabled={roundFinished}
          >
            Pedir Carta
          </button>

          <button
            className="w-full px-6 py-4 bg-cyan-800/70 text-cyan-100 text-lg font-bold rounded-xl 
              hover:brightness-110 active:scale-95 transition mb-3"
            onClick={plantarse}
            disabled={roundFinished}
          >
            Plantarse
          </button>

          <button
            className="w-full px-6 py-4 bg-green-600 text-white text-lg font-bold rounded-xl 
              hover:brightness-110 active:scale-95 transition shadow-[0_0_12px_#00ff99]"
            onClick={siguienteRonda}
            disabled={!roundFinished}
          >
            Siguiente Ronda
          </button>

          <div className="flex-1 mt-10 border-t border-cyan-400/20 pt-6">
            <h3 className="text-cyan-300 mb-2">Puntos:</h3>
            <p className="text-3xl font-bold">
              {puntosMano}{" "}
              {puntosMano > 21 && (
                <span className="text-red-400 animate-pulse">(Te pasaste!)</span>
              )}
            </p>
          </div>
        </aside>

        {/* TABLE / ARENA */}
        <section className="col-span-6 bg-[#041925bb] border border-cyan-300/20 backdrop-blur-xl rounded-[40px] shadow-[0_0_35px_#009dff55] relative p-8 flex flex-col items-center justify-between">
          
          <div className="text-center">
            <strong className="text-cyan-300 text-xl tracking-widest">TU MANO</strong>
            {renderHandAnimated(myHand)}
          </div>

          <div className="mt-6 w-full text-cyan-300">
            {playersList.map((p) => (
              <div key={p.id} className="flex items-center gap-3 mb-3">
                <span className={p.id === playerId ? "font-bold text-cyan-400" : ""}>
                  {p.name} {p.id === playerId && "(yo)"}
                </span>
                {renderHandAnimated(p.id === playerId ? myHand : hands[p.id] || [])}
                <span className="ml-auto text-cyan-200">{p.hp} HP</span>
              </div>
            ))}
          </div>

          {roundResults.length > 0 && (
            <div className="w-full bg-cyan-900/40 border border-cyan-500/40 p-4 mt-6 rounded-xl shadow-[0_0_15px_#009dff66]">
              <h3 className="text-cyan-300 text-xl mb-2">Resultado de Ronda</h3>
              {roundResults.map((r) => (
                <p key={r.player_id}>
                  {(playersList.find((p) => p.id === r.player_id)?.name ||
                    r.player_id)}
                  : {r.total} pts — {r.hp} HP
                </p>
              ))}
            </div>
          )}

        </section>

        {/* CHAT */}
        <aside className="col-span-3 bg-[#07264b80] border border-cyan-400/25 rounded-2xl p-4 shadow-[0_0_20px_#0077ff55] flex flex-col">
          <ChatPanel
            playerName={playerName}
            t={{ noMessages: "Sin mensajes", typeMessage: "Escribe...", send: "Enviar" }}
            ws={wsRef.current}
          />
        </aside>
      </main>
    </div>
  );
}
