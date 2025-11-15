import { useState, useEffect, useRef } from "react";
import { ChatTranslations } from "./helpers";

export function ChatPanel({ playerName, t, ws, }: { playerName: string; t: ChatTranslations; ws: WebSocket | null;}) {
  const [messages, setMessages] = useState<{ user: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ws) return;
    const handleMessage = (event: MessageEvent) => {
      try {
        // El servidor puede enviar texto (ping/pong) o JSON; intentamos parsear
        if (typeof event.data === "string") {
          try {
            const data = JSON.parse(event.data);
            if (data.type === "chat") {
              setMessages((msgs) => [...msgs, { user: data.user, text: data.text }]);
            }
          } catch {
            // mensaje no JSON (ej: "pong" o "ping") -> ignorar
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

  const send = () => {
    if (!input.trim() || !ws || ws.readyState !== WebSocket.OPEN) return;
    const payload = JSON.stringify({ type: "chat", user: playerName, text: input.trim() });
    ws.send(payload);
    setInput("");
    // opcional: añadir mensaje localmente para menor latencia
    setMessages((m) => [...m, { user: playerName, text: input.trim() }]);
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

