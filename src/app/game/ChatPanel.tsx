import { useState, useEffect, useRef } from "react";
import { ChatTranslations } from "./helpers";

type ChatMessage = {
  user: string;
  text: string;
};

export function ChatPanel({
  playerName,
  t,
  ws,
}: {
  playerName: string;
  t: ChatTranslations;
  ws: WebSocket | null;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Escuchar mensajes que vienen del servidor
  useEffect(() => {
    if (!ws) return;

    const handleMessage = (event: MessageEvent) => {
      try {
        if (typeof event.data === "string") {
          // El servidor envía JSON para el chat
          try {
            const data = JSON.parse(event.data);
            if (data.type === "chat" && data.user && data.text) {
              setMessages((msgs) => [
                ...msgs,
                { user: data.user as string, text: data.text as string },
              ]);
            }
          } catch {
            // mensaje no JSON (ej: "ping", "pong", etc.) -> ignorar
          }
        }
      } catch (e) {
        console.error("Error parsing message", e);
      }
    };

    ws.addEventListener("message", handleMessage);
    return () => {
      ws.removeEventListener("message", handleMessage);
    };
  }, [ws]);

  // Enviar mensaje al servidor
  const send = () => {
    const trimmed = input.trim();
    if (!trimmed || !ws || ws.readyState !== WebSocket.OPEN) return;

    const payload = {
      type: "chat",
      user: playerName,
      text: trimmed,
    };

    // Enviar al backend
    ws.send(JSON.stringify(payload));

    // Añadir localmente para que se vea instantáneo
    setMessages((msgs) => [...msgs, { user: playerName, text: trimmed }]);
    setInput("");
  };

  // Scroll automático hacia abajo cuando haya nuevos mensajes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#031827cc] border-l border-[#00eaff33] p-3">
      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-2 scrollbar-thin scrollbar-thumb-cyan-700/40">
        {messages.length === 0 ? (
          <p className="text-xs text-cyan-400/70">{t.noMessages}</p>
        ) : (
          messages.map((m, i) => {
            const isMe = m.user === playerName;
            return (
              <div
                key={i}
                className={`text-xs break-words ${
                  isMe ? "text-cyan-100" : "text-cyan-200/90"
                }`}
              >
                <span
                  className={
                    isMe
                      ? "text-emerald-400 font-semibold"
                      : "text-cyan-400"
                  }
                >
                  {m.user}:
                </span>{" "}
                {m.text}
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex mt-2 gap-2">
        <input
          className="flex-1 text-sm px-3 py-2 rounded-lg bg-[#061e2f] border border-cyan-600/40 text-cyan-100 placeholder:text-cyan-400/40 focus:outline-none focus:border-cyan-300"
          placeholder={t.typeMessage}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
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
