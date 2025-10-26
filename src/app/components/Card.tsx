'use client';
import React from 'react';

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
      className={`w-14 h-20 rounded-2xl border shadow grid place-items-center text-lg font-bold bg-white ${hidden ? "bg-neutral-200" : ""} overflow-hidden relative`}
      aria-label={`${hidden ? "carta oculta" : `${c.rank} de ${c.suit}`}`}
    >
      {hidden ? (
        "🂠"
      ) : (
        // if an image url is provided and it loads, show it; otherwise fallback to old render
        image && !imgError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
            src={image}
            alt={`${c.rank} de ${c.suit}`}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex items-center gap-1">
            <span>{prettyRank(c.rank)}</span>
            <span className={c.suit === "♥" || c.suit === "♦" ? "text-red-600" : ""}>
              {cardEmoji(c.suit)}
            </span>
          </div>
        )
      )}
    </div>
  );
}
