"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type CardSimple = {
  name: string;
  suit?: string;
  specialtype?: string;
  description?: string;
};

type Props = {
  card: CardSimple;
  index: number;
};

function getCardImage(card: CardSimple): string {
  const key = card.specialtype || card.name;
  const specialKeys = ["SC", "VN", "NR", "EL", "PC", "RT"];
  if (specialKeys.includes(key)) {
    return `/assets/cards/${key}.png`;
  }
  if (!card.name) return "/assets/cards/back.png";
  const name = card.name.toLowerCase();
  const suit = (card.suit || "hearts").toLowerCase();
  return `/assets/cards/${name}-${suit}.png`;
}

export default function AnimatedCard({ card, index }: Props) {
  const src = getCardImage(card);
  return (
    <motion.div
      className="relative w-16 h-24 sm:w-20 sm:h-28 rounded-xl shadow-[0_0_12px_rgba(0,200,255,0.5)] overflow-hidden"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.05 }}
    >
      <Image
        src={src}
        alt={card.specialtype || card.name}
        fill
        className="object-contain"
        sizes="80px"
      />
    </motion.div>
  );
}
