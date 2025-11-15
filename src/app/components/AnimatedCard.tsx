import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function AnimatedCard({ card, index }: { card: any; index: number }) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 450 + index * 150);
    return () => clearTimeout(timer);
  }, [index]);

  const val = card?.name?.toLowerCase() || "";
  const suit = card?.suit?.toLowerCase() || "";
  const imgName = `${val}-${suit}.png`;
  const realSrc = `/assets/cards/${imgName}`;

  return (
    <div className="relative w-[80px] h-[112px] [perspective:900px]">
      <AnimatePresence>
        {!revealed && (
          <motion.img
            key="back"
            initial={{ x: -140, rotateY: 0, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ rotateY: 90, opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            src="/assets/cards/back.png"
            className="absolute top-0 left-0 w-full h-full rounded-lg shadow-xl"
          />
        )}

        {revealed && (
          <motion.img
            key="front"
            initial={{ rotateY: -90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            src={realSrc}
            className="absolute top-0 left-0 w-full h-full rounded-lg shadow-xl bg-[#041926]"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
