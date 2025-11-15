import { useState, useEffect, useRef } from "react";
import { ChatTranslations } from "./helpers";

type ChatMessage = {
  user: string;
  text: string;
  system?: boolean;
  private?: boolean;
  to?: string;
};

type ChatPanelProps = {
  playerName: string;
  t: ChatTranslations;
  ws: WebSocket | null;
  roomId?: string;
  chatEnabled?: boolean;
  notificationsEnabled?: boolean;
};

export function ChatPanel({
  playerName,
  t,
  ws,
  roomId,
  chatEnabled = true,
  notificationsEnabled = true,
}: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Mensaje de bienvenida local (no depende del WS)
  useEffect(() => {
    const intro = roomId
      ? `Bienvenido, te has unido a la sala ${roomId}. El juego está por comenzar. Escribe para hablar con tu oponente.`
      : `Bienvenido, el juego está por comenzar. Escribe para hablar con tu oponente.`;

    setMessages((prev) => {
      if (prev.length > 0) return prev;
      return [{ user: "Sistema", text: intro, system: true }];
    });
  }, [roomId]);

  // Escuchar mensajes de chat desde el WebSocket
  useEffect(() => {
    if (!ws) return;

    const handleMessage = (event: MessageEvent) => {
      try {
        if (typeof event.data !== "string") return;
        const data = JSON.parse(event.data);

        if (data.type === "chat" && data.text && data.user) {
          const msg: ChatMessage = {
            user: data.user as string,
            text: data.text as string,
            system: data.user === "Sistema",
            private: !!data.private,
            to: data.to,
          };

          setMessages((msgs) => [...msgs, msg]);

          // Sonido solo si:
          // - notificaciones activas
          // - chat activado
          // - no es mensaje nuestro
          if (
            notificationsEnabled &&
            chatEnabled &&
            audioRef.current &&
            data.user !== playerName
          ) {
            try {
              audioRef.current.currentTime = 0;
              audioRef.current.play().catch(() => {});
            } catch {
              // ignoramos errores de autoplay
            }
          }
        }
      } catch {
        // ignorar mensajes no JSON
      }
    };

    ws.addEventListener("message", handleMessage);
    return () => {
      ws.removeEventListener("message", handleMessage);
    };
  }, [ws, notificationsEnabled, chatEnabled, playerName]);

  // Scroll automático al final cada vez que cambian los mensajes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    if (!chatEnabled) return;
    const trimmed = input.trim();
    if (!trimmed || !ws || ws.readyState !== WebSocket.OPEN) return;

    const payload = {
      type: "chat",
      user: playerName,
      text: trimmed,
    };

    try {
      ws.send(JSON.stringify(payload));
    } catch {
      return;
    }

    // Añadir el mensaje localmente para que se vea instantáneo
    setMessages((msgs) => [
      ...msgs,
      {
        user: playerName,
        text: trimmed,
        system: false,
      },
    ]);

    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="relative flex flex-col h-full bg-[#031827cc] border-l border-[#00eaff33] p-3 overflow-hidden">
      {/* Audio oculto para notificaciones */}
      <audio
        ref={audioRef}
        src="/assets/sounds/hover.mp3"
        preload="auto"
        className="hidden"
      />

      {/* CONTENIDO DEL CHAT */}
      <div
        className={`flex-1 overflow-y-auto pr-2 space-y-2 scrollbar-thin scrollbar-thumb-cyan-700/40 ${
          !chatEnabled ? "blur-[1px] brightness-[0.6]" : ""
        }`}
      >
        {messages.length === 0 ? (
          <p className="text-xs text-cyan-400/70">{t.noMessages}</p>
        ) : (
          messages.map((m, i) => {
            const isMe = m.user === playerName;
            const isSystem = m.system;
            const isPrivate = m.private;

            return (
              <div
                key={i}
                className={`text-xs break-words ${
                  isSystem
                    ? "text-cyan-200/80 italic"
                    : isPrivate
                    ? "text-fuchsia-200"
                    : isMe
                    ? "text-cyan-100"
                    : "text-cyan-200/90"
                }`}
              >
                {!isSystem && (
                  <>
                    <span
                      className={
                        isMe
                          ? "text-emerald-400 font-semibold"
                          : isPrivate
                          ? "text-fuchsia-400 font-semibold"
                          : "text-cyan-400"
                      }
                    >
                      {m.user}
                      {isPrivate && m.to
                        ? ` → ${m.to} (privado)`
                        : isPrivate
                        ? " (privado)"
                        : ""}
                      :
                    </span>{" "}
                  </>
                )}
                {m.text}
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div className={`mt-2 ${!chatEnabled ? "pointer-events-none" : ""}`}>
        <div className="flex gap-2">
          <input
            className="flex-1 text-sm px-3 py-2 rounded-lg bg-[#061e2f] border border-cyan-600/40 text-cyan-100 placeholder:text-cyan-400/40 focus:outline-none focus:border-cyan-300 disabled:opacity-40"
            placeholder={t.typeMessage}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!chatEnabled}
          />
          <button
            onClick={send}
            disabled={!chatEnabled}
            className="px-3 py-2 text-xs bg-cyan-500/40 rounded-lg border border-cyan-400/40 text-cyan-100 hover:bg-cyan-400/60 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {t.send}
          </button>
        </div>
      </div>

      {/* OVERLAY FUTURISTA CUANDO EL CHAT ESTÁ DESHABILITADO */}
      {!chatEnabled && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[radial-gradient(circle_at_top,#1fffff40,#020814_65%,#000000_100%)]">
          <div className="w-[82%] max-w-xs h-40 md:h-48 bg-[#050c1a] border-2 border-cyan-400/60 rounded-2xl shadow-[0_0_40px_#00eaff80] relative overflow-hidden">
            {/* Franjas diagonales */}
            <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(0,255,255,0.08)_0px,rgba(0,255,255,0.08)_8px,rgba(0,0,0,0.7)_8px,rgba(0,0,0,0.7)_16px)]" />

            {/* Contenido */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">
              <span className="text-[11px] uppercase tracking-[0.25em] text-cyan-300/80 mb-2">
                canal cerrado
              </span>
              <span className="text-xs text-cyan-100/90 leading-relaxed">
                El chat está deshabilitado en tus ajustes.
                <br />
                Habilítalo en{" "}
                <span className="font-semibold text-cyan-100">Ajustes</span>{" "}
                para hablar con tu oponente.
              </span>
            </div>

            {/* Luces laterales */}
            <div className="absolute top-3 left-4 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#00eaff] animate-pulse" />
            <div className="absolute top-3 right-4 w-2 h-2 rounded-full bg-cyan-600/80 shadow-[0_0_10px_#00eaff]" />
          </div>
        </div>
      )}
    </div>
  );
}
