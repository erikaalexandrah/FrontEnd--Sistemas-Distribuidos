"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ChatPanel } from "./ChatPanel";
import CyberpunkRainScene from "@/app/components/CyberpunkRainScene";
import AnimatedCard from "../components/AnimatedCard";
import { getSettings, getUsername } from "../utils/settings";

type CardSimple = {
  name: string;
  suit?: string;
  specialtype?: string;
  description?: string;
};

type Player = { id: string; name: string; hp: number };
type RoundResult = { player_id: string; total: number; hp: number };

type ModifierKey = "SC" | "VN" | "NR" | "EL" | "PC" | "RT";

type ModifierInfo = {
  key: ModifierKey;
  label: string;
  short: string;
  img: string;
};

const MODIFIERS: ModifierInfo[] = [
  {
    key: "SC",
    label: "Sello de Coronación",
    short: "Victoria inmediata: ganas la partida al activarse.",
    img: "/assets/cards/SC.png",
  },
  {
    key: "VN",
    label: "Velo Neutralizador",
    short: "Impide que el rival use modificadores la siguiente ronda.",
    img: "/assets/cards/VN.png",
  },
  {
    key: "NR",
    label: "Núcleo de Reposición",
    short: "Si pierdes por ≤ 5 puntos, recuperas 5 HP.",
    img: "/assets/cards/NR.png",
  },
  {
    key: "EL",
    label: "Espejo Letal",
    short: "Duplica el daño al rival; si pierdes tú, también se duplica.",
    img: "/assets/cards/EL.png",
  },
  {
    key: "PC",
    label: "Pulso Crítico",
    short: "Si logras exactamente 21, infliges 8 de daño adicional.",
    img: "/assets/cards/PC.png",
  },
  {
    key: "RT",
    label: "Relé de Tolerancia",
    short: "Si te pasas de 21, tu total se ajusta a 20.",
    img: "/assets/cards/RT.png",
  },
];

const SPECIAL_LABEL: Record<string, string> = {
  SC: "Sello de Coronación",
  VN: "Velo Neutralizador",
  NR: "Núcleo de Reposición",
  EL: "Espejo Letal",
  PC: "Pulso Crítico",
  RT: "Relé de Tolerancia",
};

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
  const [players, setPlayers] = useState<number>(2);
  const [connected, setConnected] = useState<number>(0);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState<string>("Operador_21");
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [playersList, setPlayersList] = useState<Player[]>([]);
  const [roundResults, setRoundResults] = useState<RoundResult[]>([]);
  const [roundFinished, setRoundFinished] = useState<boolean>(false);
  const [myHp, setMyHp] = useState<number>(60);
  const [hands, setHands] = useState<Record<string, CardSimple[]>>({});
  const [myHand, setMyHand] = useState<CardSimple[]>([]);
  const [planted, setPlanted] = useState<boolean>(false);
  const [chatEnabled, setChatEnabled] = useState<boolean>(true);
  const [chatNotifications, setChatNotifications] = useState<boolean>(true);
  const [selectedModifier, setSelectedModifier] = useState<ModifierKey | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [didWin, setDidWin] = useState<boolean | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const pingTimerRef = useRef<number | null>(null);
  const PING_INTERVAL_MS = 10000;

  useEffect(() => {
    try {
      const s = getSettings();
      setPlayerName(getUsername());
      setChatEnabled(s.chatEnabled);
      setChatNotifications(s.chatNotifications);
    } catch {
      setPlayerName(getUsername());
    }
  }, []);

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
    setSelectedModifier(null);
    setStatusMessage(null);
    setGameOver(false);
    setDidWin(null);
  }

  function connectWS() {
    const url = `ws://localhost:8000/ws/game?desired_players=${players}&name=${encodeURIComponent(
      playerName
    )}`;

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

    ws.onmessage = (msgEvent: MessageEvent) => {
      try {
        const data = JSON.parse(msgEvent.data);
        if (!data) return;

        if (data.type === "waiting") {
          setRoomId(data.room_id);
          setConnected(data.players);
          if (data.players_list) setPlayersList(data.players_list);
          setPhase("lobby");
          setRoundFinished(false);
          setStatusMessage(null);
          setGameOver(false);
          setDidWin(null);
        } else if (data.type === "start") {
          setPhase("game");
          setHands({});
          setMyHand([]);
          setRoundResults([]);
          setMyHp(60);
          setRoundFinished(false);
          setPlanted(false);
          setSelectedModifier(null);
          setGameOver(false);
          setDidWin(null);
          setStatusMessage("Nueva ronda. ¡Buena suerte!");
          if (data.player_id) setPlayerId(data.player_id);
          if (data.players_list) setPlayersList(data.players_list);
        } else if (data.type === "draw_result") {
          if (data.card) {
            console.log("Carta recibida del backend:", data.card);
            setMyHand((prev) => [...prev, data.card]);
            // Detecta por specialtype o name
            const key: string = data.card.specialtype || data.card.name;
            const specialName = SPECIAL_LABEL[key];
            if (specialName) {
              setStatusMessage(
                `Te salió la carta especial ${specialName} (${key}).`
              );
            } else {
              setStatusMessage(null);
            }
          }
        } else if (data.type === "update_hand") {
          if (data.hand) setMyHand(data.hand);
        } else if (data.type === "round_result") {
          setRoundResults(data.results);
          setRoundFinished(true);
          setPlanted(false);

          if (data.hands) {
            setHands(data.hands);
            if (playerId && data.hands[playerId]) setMyHand(data.hands[playerId]);
          }

          setPlayersList((prev) =>
            prev.map((p) => {
              const r = data.results?.find(
                (rr: RoundResult) => rr.player_id === p.id
              );
              return r ? { ...p, hp: r.hp } : p;
            })
          );

          if (playerId) {
            const me = data.results?.find(
              (r: RoundResult) => r.player_id === playerId
            );
            if (me) setMyHp(me.hp);
          }

          setStatusMessage("Ronda resuelta.");
        } else if (data.type === "players_list") {
          setPlayersList(data.players);
        } else if (data.type === "game_over") {
          if (data.results) {
            setRoundResults(
              data.results.map((r: RoundResult) => ({
                player_id: r.player_id,
                total: r.total ?? 0,
                hp: r.hp,
              }))
            );
          }

          if (data.winner_ids && playerId) {
            const winners: string[] = data.winner_ids;
            const win = winners.includes(playerId);
            setDidWin(win);
            setStatusMessage(
              win ? "¡Ganaste la partida!" : "Perdiste la partida."
            );
          } else {
            setDidWin(null);
            setStatusMessage("La partida ha terminado.");
          }

          setGameOver(true);
          setRoundFinished(true);

          if (wsRef.current) {
            try {
              wsRef.current.close(1000, "game over");
            } catch {}
            wsRef.current = null;
          }
          cleanupPing();
        }
      } catch {
        // Ignorar errores de parseo
      }
    };

    ws.onclose = () => {
      cleanupPing();
      if (!gameOver) {
        disconnectWS();
      }
    };
    ws.onerror = () => {};
  }

  useEffect(() => {
    return () => disconnectWS();
  }, []);

  useEffect(() => {
    if (wsRef.current) connectWS();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [players]);

  function pedirCarta() {
    if (
      !wsRef.current ||
      wsRef.current.readyState !== WebSocket.OPEN ||
      roundFinished ||
      gameOver
    ) {
      return;
    }

    const puntosActuales = calcularPuntos(myHand);
    if (puntosActuales > 21) {
      setStatusMessage("Ya te pasaste de 21, no puedes pedir más cartas.");
      return;
    }

    wsRef.current.send(
      JSON.stringify({ type: "action", action: { decision: "draw" } })
    );
  }

  function plantarse() {
    if (
      wsRef.current &&
      wsRef.current.readyState === WebSocket.OPEN &&
      !roundFinished &&
      !gameOver
    ) {
      wsRef.current.send(
        JSON.stringify({ type: "action", action: { decision: "stand" } })
      );
      setPlanted(true);
      setStatusMessage("Te plantaste. Esperando a los demás jugadores...");
    }
  }

  function siguienteRonda() {
    if (gameOver) return;

    setRoundResults([]);
    setMyHand([]);
    setHands({});
    setRoundFinished(false);
    setPlanted(false);
    setStatusMessage("Nueva ronda en curso.");
  }

  const puntosMano = calcularPuntos(myHand);

  function renderHandAnimated(hand: CardSimple[]) {
    return (
      <div className="flex flex-wrap gap-3 mt-3">
        {hand.map((c, i) => (
          <AnimatedCard key={i} card={c} index={i} />
        ))}
      </div>
    );
  }

  function renderModifierSelector() {
    const selected =
      selectedModifier != null
        ? MODIFIERS.find((m) => m.key === selectedModifier) || null
        : null;

    return (
      <div className="mt-6">
        <h3 className="text-cyan-300 mb-3 text-sm tracking-widest">
          MODIFICADORES
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {MODIFIERS.map((mod) => {
            const isSelected = selectedModifier === mod.key;
            return (
              <button
                key={mod.key}
                type="button"
                onClick={() =>
                  setSelectedModifier((prev) => (prev === mod.key ? null : mod.key))
                }
                className={`relative flex items-start gap-2 rounded-xl border px-2 py-2 text-left
                  transition hover:brightness-110 w-full
                  ${
                    isSelected
                      ? "border-cyan-400 bg-cyan-500/20 shadow-[0_0_12px_#21d4fd]"
                      : "border-cyan-700/40 bg-[#031021aa]"
                  }`}
              >
                <div className="relative w-10 h-14 shrink-0 overflow-hidden rounded-md">
                  <Image
                    src={mod.img}
                    alt={mod.label}
                    fill
                    className="object-contain"
                  />
                </div>

                <div className="flex flex-col overflow-hidden">
                  <span className="font-semibold text-cyan-100 text-[11px] leading-tight truncate">
                    {mod.label}
                  </span>
                  <span className="text-[10px] text-cyan-300/80 leading-tight overflow-hidden line-clamp-2">
                    {mod.short}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {selected && (
          <div className="mt-3 text-[11px] text-cyan-200/85 bg-[#021024aa] border border-cyan-500/40 rounded-lg p-2">
            <p className="font-semibold text-cyan-100 mb-1">{selected.label}</p>
            <p>{selected.short}</p>
          </div>
        )}
      </div>
    );
  }

  function handleBackToLobby() {
    disconnectWS();
  }

  if (phase === "lobby") {
    const isConnected = !!(wsRef.current && wsRef.current.readyState === WebSocket.OPEN);

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
                onClick={() => !isConnected && setPlayers(n)}
                disabled={isConnected}
                className={`px-6 py-3 text-lg rounded-xl border transition-all duration-200
                ${
                  n === players
                    ? "border-cyan-400 bg-cyan-500/30 shadow-[0_0_12px_#55eaff]"
                    : "border-cyan-700/40 hover:bg-cyan-500/10"
                }
                ${isConnected ? "opacity-50 cursor-not-allowed" : ""}`}
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
            {playersList.length > 0 ? (
              playersList.map((p) => <span key={p.id}>✔ {p.name}</span>)
            ) : (
              Array.from({ length: connected }).map((_, i) => (
                <span key={i}>
                  ✔ {i === 0 ? playerName : "Jugador " + (i + 1)}
                </span>
              ))
            )}
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

  return (
    <div className="relative min-h-screen w-screen font-body bg-[#050510] text-[#cfeaff] overflow-hidden flex flex-col items-center">
      <CyberpunkRainScene />

      <header className="absolute top-4 left-6 z-30 flex gap-6 items-center">
        <span className="text-3xl font-title text-cyan-300 drop-shadow-[0_0_12px_#21d4fd]">
          EMPIRE OF WAGERS
        </span>
      </header>

      {gameOver && (
        <div className="fixed inset-0 z-40 bg-black/80 flex flex-col items-center justify-center">
          <h2 className="text-5xl sm:text-6xl font-title mb-6 drop-shadow-[0_0_25px_#21d4fd]">
            {didWin === null
              ? "PARTIDA TERMINADA"
              : didWin
              ? "¡GANASTE!"
              : "DERROTA"}
          </h2>
          {didWin !== null && (
            <p className="mb-8 text-cyan-100 text-lg sm:text-2xl">
              {didWin ? "Has dominado el Imperio de Apuestas." : "Otra ronda te espera."}
            </p>
          )}
          <button
            onClick={handleBackToLobby}
            className="px-8 py-3 rounded-xl bg-cyan-400 text-[#021425] font-bold text-lg
                       hover:brightness-110 active:scale-95 transition shadow-[0_0_18px_#21d4fd]"
          >
            Volver al lobby
          </button>
        </div>
      )}

      <main className="relative z-20 w-full max-w-7xl h-[85vh] mt-20 grid grid-cols-12 gap-6 px-4">
        <aside className="col-span-3 bg-[#07264b99] border border-cyan-400/30 backdrop-blur-lg rounded-2xl p-6 shadow-[0_0_20px_#009dff55] flex flex-col">
          <h2 className="text-xl text-cyan-200 mb-6 tracking-widest">
            CONTROL
          </h2>
          <button
            className="w-full px-6 py-4 bg-cyan-500/70 text-[#021425] text-lg font-bold rounded-xl 
              hover:brightness-110 active:scale-95 transition mb-3 shadow-[0_0_12px_#21d4fd]"
            onClick={pedirCarta}
            disabled={roundFinished || gameOver || puntosMano > 21}
          >
            Pedir Carta
          </button>
          <button
            className="w-full px-6 py-4 bg-cyan-800/70 text-cyan-100 text-lg font-bold rounded-xl 
              hover:brightness-110 active:scale-95 transition mb-3"
            onClick={plantarse}
            disabled={roundFinished || gameOver}
          >
            Plantarse
          </button>
          <button
            className="w-full px-6 py-4 bg-green-600 text-white text-lg font-bold rounded-xl 
              hover:brightness-110 active:scale-95 transition shadow-[0_0_12px_#00ff99]"
            onClick={siguienteRonda}
            disabled={!roundFinished || gameOver}
          >
            Siguiente Ronda
          </button>
          <div className="flex-1 mt-6 border-t border-cyan-400/20 pt-4">
            <h3 className="text-cyan-300 mb-2">Puntos:</h3>
            <p className="text-3xl font-bold">
              {puntosMano}{" "}
              {puntosMano > 21 && (
                <span className="text-red-400 animate-pulse">
                  (Te pasaste!)
                </span>
              )}
            </p>
            {statusMessage && (
              <div className="mt-4 text-xs text-cyan-200 bg-[#021024aa] border border-cyan-400/40 rounded-lg p-3">
                {statusMessage}
              </div>
            )}
          </div>
          {renderModifierSelector()}
        </aside>
        <section className="col-span-6 bg-[#041925bb] border border-cyan-300/20 backdrop-blur-xl rounded-[40px] shadow-[0_0_35px_#009dff55] relative p-8 flex flex-col items-center justify-between">
          <div className="text-center">
            <strong className="text-cyan-300 text-xl tracking-widest">
              TU MANO
            </strong>
            {renderHandAnimated(myHand)}
          </div>
          <div className="mt-6 w-full text-cyan-300">
            {playersList.map((p) => (
              <div key={p.id} className="flex items-center gap-3 mb-3">
                <span
                  className={
                    p.id === playerId ? "font-bold text-cyan-400" : ""
                  }
                >
                  {p.name} {p.id === playerId && "(yo)"}
                </span>
                <span className="ml-auto text-cyan-200">{p.hp} HP</span>
              </div>
            ))}
          </div>
          {roundResults.length > 0 && (
            <div className="w-full bg-cyan-900/40 border border-cyan-500/40 p-4 mt-6 rounded-xl shadow-[0_0_15px_#009dff66]">
              <h3 className="text-cyan-300 text-xl mb-2">
                Resultado de Ronda
              </h3>
              {roundResults.map((r) => (
                <p key={r.player_id}>
                  {(
                    playersList.find((p) => p.id === r.player_id)?.name ||
                    r.player_id
                  )}{" "}
                  : {r.total} pts — {r.hp} HP
                </p>
              ))}
            </div>
          )}
        </section>
        <aside className="col-span-3 bg-[#07264b80] border border-cyan-400/25 rounded-2xl p-4 shadow-[0_0_20px_#0077ff55] flex flex-col">
          <ChatPanel
            playerName={playerName}
            t={{
              noMessages: "Sin mensajes",
              typeMessage: "Escribe...",
              send: "Enviar",
            }}
            ws={wsRef.current}
            chatEnabled={chatEnabled}
            notificationsEnabled={chatNotifications}
          />
        </aside>
      </main>
    </div>
  );
}
