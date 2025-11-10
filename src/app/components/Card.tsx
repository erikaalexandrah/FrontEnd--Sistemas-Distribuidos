"use client";
import React from "react";

export interface Card {
  id: string;
  rank: string;
  suit: "♠" | "♥" | "♦" | "♣";
  value: number;
}

function prettyRank(rank: string) {
  return rank;
}
function cardEmoji(suit: Card["suit"]) {
  return suit;
}

export default function CardView({ c, hidden = false, image }: { c: Card; hidden?: boolean; image?: string }) {
  const [imgError, setImgError] = React.useState(false);

  return (
    <div
      className={`w-32 h-48 rounded-2xl border shadow grid place-items-center text-xl font-bold bg-white ${hidden ? "bg-neutral-200" : ""} overflow-hidden relative`}
      aria-label={`${hidden ? "carta oculta" : `${c.rank} de ${c.suit}`}`}
    >
      {hidden ? (
      <img
        src="/assets/cards/back.png"
        alt="Dorso"
        className="w-full h-full object-cover"
      />
      ) : (
        image && !imgError ? (
          <img
            src={image}
            alt={`${c.rank} de ${c.suit}`}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex items-center gap-1">
            <span>{c.rank}</span>
            <span className={c.suit === "♥" || c.suit === "♦" ? "text-red-600" : ""}>
              {c.suit}
            </span>
          </div>
        )
      )}
    </div>
  );
}
