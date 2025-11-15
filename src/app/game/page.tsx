"use client";

import { useState, useEffect, useRef } from "react";
import { ChatPanel } from "./ChatPanel";
import CyberpunkRainScene from "@/app/components/CyberpunkRainScene";

type CardSimple = {
  name: string;
  suit?: string;
};

type Player = {
  id: string;
  name: string;
  hp: number;
};

type RoundResult = {
  player_id: string;
  total: number;
  hp: number;
};

function calcularPuntos(hand: CardSimple[]) {
  let total = 0;
  let aces = 0;

  for (const card of hand) {
    const val = card.name?.toLowerCase() ?? "";

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

const CardBack = ({ keyId }: { keyId: string }) => (
  <div
    key={keyId}
    className="w-[40px] h-[56px] bg-cyan-900 rounded-lg border-2 border-cyan-100/60"
  />
);

export default function GamePage() {
  const [phase, setPhase] = useState<"lobby" | "game">("lobby");
  const [players, setPlayers] = useState(2);
  const [connected, setConnected] = useState(0);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState("Operador_21");
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [playersList, setPlayersList] = useState<Player[]>([]);
  const [roundResults, setRoundResults] = useState<RoundResult[]>([]);
  const [roundFinished, setRoundFinished] = useState(false);
  const [myHp, setMyHp] = useState(60);
  const [hands, setHands] = useState<Record<string, CardSimple[]>>({});
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
    if (wsRef.current) {
      try {
        wsRef.current.close(1000, "reconnect");
      } catch {}
      wsRef.current = null;
    }

    const url = `wss://cards.titranx.com/ws/game?desired_players=${players}`;
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      cleanupPing();

      pingTimerRef.current = window.setInterval(() => {
        if (
          wsRef.current &&
          wsRef.current.readyState === WebSocket.OPEN
        ) {
          wsRef.current.send("ping");
        }
      }, PING_INTERVAL_MS);
    };

    ws.onmessage = (msgEvent) => {
      try {
        if (typeof msgEvent.data === "string") {
          const data = JSON.parse(msgEvent.data);

          switch (data.type) {
            case "waiting":
              setRoomId(data.room_id);
              setConnected(data.players);
              if (data.players_list) setPlayersList(data.players_list);
              setPhase("lobby");
              setRoundFinished(false);
              break;

            case "start":
              setPhase("game");
              setHands({});
              setMyHand([]);
              setRoundResults([]);
              setMyHp(60);
              setRoundFinished(false);
              setPlanted(false);
              if (data.player_id) setPlayerId(data.player_id);
              if (data.players_list) setPlayersList(data.players_list);
              break;

            case "draw_result":
              if (data.card) {
                setMyHand((prev) => [...prev, data.card]);
              }
              break;

            case "update_hand":
              if (data.hand) setMyHand(data.hand);
              break;

            case "round_result":
              setRoundResults(data.results as RoundResult[]);
              setRoundFinished(true);
              setPlanted(false);

              if (data.hands) {
                setHands(data.hands);
                if (playerId && data.hands[playerId]) {
                  setMyHand(data.hands[playerId]);
                }
              }
              break;

            case "players_list":
              setPlayersList(data.players);
              break;
          }
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
    if (
      wsRef.current &&
      wsRef.current.readyState === WebSocket.OPEN &&
      !roundFinished
    ) {
      wsRef.current.send(
        JSON.stringify({
          type: "action",
          action: { decision: "draw" },
        })
      );
    }
  }

  function plantarse() {
    if (
      wsRef.current &&
      wsRef.current.readyState === WebSocket.OPEN &&
      !roundFinished
    ) {
      wsRef.current.send(
        JSON.stringify({
          type: "action",
          action: { decision: "stand" },
        })
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

  function renderHandSimple(
    hand: CardSimple[],
    hidden: boolean,
    pid: string
  ) {
    if (!hand.length) return null;

    if (hidden) {
      return (
        <div className="flex gap-2">
          {hand.map((_, i) => (
            <CardBack key={pid + "_" + i} keyId={`${pid}_${i}`} />
          ))}
        </div>
      );
    }

    return (
      <div className="flex gap-2">
        {hand.map((c, i) => {
          const val = c.name?.toLowerCase() ?? "";
          const suit = c.suit?.toLowerCase() ?? "";
          const imgName = `${val}-${suit}.png`;
          const src = `/assets/cards/${imgName}`;

          return (
            <img
              key={i}
              src={src}
              alt={imgName}
              style={{
                width: 80,
                height: 112,
                background: "#041926",
              }}
            />
          );
        })}
      </div>
    );
  }

  const puntosMano = calcularPuntos(myHand);
  const mostrarPlantadoMsg = planted && !roundFinished;

  if (phase === "lobby") {
    return (
      <div className="relative min-h-screen w-screen flex flex-col items-center justify-center font-body bg-[#050510] overflow-hidden">
        <CyberpunkRainScene />

        <header className="absolute top-5 left-5 z-30 flex items-center gap-4">
          <h1 className="text-3xl font-title text-cyan-300">
            EMPIRE OF WAGERS
          </h1>
        </header>

        <section className="relative z-10 flex flex-col items-center justify-center text-center w-full max-w-md h-[80vh] bg-[#0b0e1a]/80 border-2 border-[#25b6f8] rounded-3xl p-8">
          <p className="mb-4">Selecciona jugadores</p>

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
                {n} Jugadores
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() =>
                wsRef.current ? disconnectWS() : connectWS()
              }
              className="px-6 py-3 bg-cyan-400/80 text-[#021425] font-bold rounded-md hover:brightness-110 active:scale-95 transition"
            >
              {wsRef.current ? "Desconectar" : "Conectar"}
            </button>
          </div>

          <div className="flex flex-col gap-2 text-sm text-cyan-100/80 mt-4">
            {Array.from({ length: connected }).map((_, i) => (
              <span key={i}>
                ✔ {i === 0 ? playerName : "Jugador " + (i + 1)} conectado
              </span>
            ))}

            {connected === 0 && (
              <span className="text-xs text-cyan-400/60">
                No hay jugadores conectados aún
              </span>
            )}
          </div>

          {roomId && (
            <div className="text-xs text-cyan-500 mt-4 opacity-60">
              Room ID: <code>{roomId}</code>
            </div>
          )}
        </section>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-screen flex flex-col items-center justify-center font-body bg-[#050510] text-[#cfeaff] overflow-hidden">
      <CyberpunkRainScene />

      <header className="absolute top-5 left-5 z-30 flex items-center gap-4">
        <span className="text-2xl font-title text-cyan-300">
          Empire of Wagers
        </span>
        <span className="text-cyan-200 ml-auto">{playerName}</span>
      </header>

      <main className="relative z-10 flex flex-row items-stretch w-full max-w-6xl h-[80vh] mx-auto bg-[#0b0e1a]/80 border-2 border-[#25b6f8] rounded-3xl overflow-hidden animate-fadein">
        <div className="flex-1 flex flex-col justify-between p-6">
          <section className="rounded-2xl border border-cyan-700/40 bg-[#021425aa] p-6 flex-1 overflow-hidden">
            <div>
              <strong>Tu mano (debug):</strong>
              {renderHandSimple(myHand, false, "debug-hand")}
            </div>

            <div className="mb-2 text-cyan-300">
              Puntos: {puntosMano}{" "}
              {puntosMano > 21 ? "(Te pasaste!)" : ""}
            </div>

            {mostrarPlantadoMsg && (
              <div className="my-4 text-lg font-bold text-green-400 animate-pulse">
                TE HAS PLANTADO, ESPEREMOS A TU CONTRINCANTE...
              </div>
            )}

            <div className="mb-3 flex flex-col gap-3">
              {playersList.map((p) => (
                <div key={p.id} className="flex items-center gap-3">
                  <span
                    className={
                      p.id === playerId
                        ? "font-bold text-cyan-400"
                        : "text-cyan-200"
                    }
                  >
                    {p.name}
                    {p.id === playerId ? " (yo)" : ""}
                  </span>

                  {renderHandSimple(
                    p.id === playerId
                      ? myHand
                      : hands[p.id] || [],
                    p.id !== playerId,
                    p.id
                  )}

                  <span className="ml-3 text-cyan-300">
                    {p.hp} HP
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex gap-3 justify-center">
              <button
                className="px-6 py-3 bg-cyan-500/70 text-[#021425] font-bold rounded-md hover:brightness-110 active:scale-95 transition"
                onClick={pedirCarta}
                disabled={roundFinished}
              >
                Pedir carta
              </button>

              <button
                className="px-6 py-3 bg-cyan-800/70 text-cyan-100 font-bold rounded-md hover:brightness-110 active:scale-95 transition"
                onClick={plantarse}
                disabled={roundFinished}
              >
                Plantarse
              </button>

              <button
                className="px-6 py-3 bg-green-600 rounded-md text-white hover:brightness-110 active:scale-95 transition"
                onClick={siguienteRonda}
                disabled={!roundFinished}
              >
                Siguiente ronda
              </button>
            </div>

            {roundResults.length > 0 && (
              <div className="mt-6 text-cyan-400 bg-cyan-900/30 p-4 rounded-xl">
                <h3>Resultado de ronda</h3>

                {roundResults.map((r) => (
                  <div key={r.player_id}>
                    {playersList.find((p) => p.id === r.player_id)
                      ?.name || r.player_id}
                    : {r.total} puntos, {r.hp} HP
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="hidden md:flex flex-col justify-between items-stretch w-80 h-full bg-gradient-to-t from-[#07264b80] to-[#07264b00] border-l border-[#2adbf555]">
          <ChatPanel
            playerName={playerName}
            t={{
              noMessages: "No hay mensajes",
              typeMessage: "Escribe un mensaje...",
              send: "Enviar",
            }}
            ws={wsRef.current}
          />
        </aside>
      </main>
    </div>
  );
}
