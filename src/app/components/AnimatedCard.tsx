"use client";

import Image from "next/image";

type CardSimple = { name: string; suit?: string };

type Props = {
  card: CardSimple;
  index: number;
};

function getCardImage(card: CardSimple): string {
  // Cartas especiales (SC, VN, NR, EL, PC, RT)
  const specialKeys = ["SC", "VN", "NR", "EL", "PC", "RT"];
  if (specialKeys.includes(card.name)) {
    return `/assets/cards/${card.name}.png`;
  }

  // Cartas normales
  if (!card.name) return "/assets/cards/back.png";

  const name = card.name.toLowerCase(); // "a", "2", "j", etc.
  const suit = (card.suit || "hearts").toLowerCase(); // "hearts", "spades", ...

  // Tus archivos se llaman así: "a-hearts.png", "10-spades.png", etc.
  return `/assets/cards/${name}-${suit}.png`;
}

export default function AnimatedCard({ card, index }: Props) {
  const src = getCardImage(card);

  return (
    <div
      className="relative w-16 h-24 sm:w-20 sm:h-28 rounded-xl shadow-[0_0_12px_rgba(0,200,255,0.5)] overflow-hidden
                 transition-transform duration-200"
      style={{
        transform: `translateY(${index * 0}px)`, // fácil de tunear si quieres solaparlas
      }}
    >
      <Image
        src={src}
        alt={card.name}
        fill
        className="object-contain"
        sizes="80px"
      />
    </div>
  );
}
