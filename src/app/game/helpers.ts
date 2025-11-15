import { Card } from "../components/Card";

export function makeDeck(decks = 1): Card[] {
  const ranks = [
    "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K",
  ];
  const suits: Card["suit"][] = ["♠", "♥", "♦", "♣"];
  const deck: Card[] = [];
  for (let n = 0; n < decks; n++) {
    for (const suit of suits) {
      for (const rank of ranks) {
        const value =
          rank === "A" ? 11 : ["J", "Q", "K"].includes(rank) ? 10 : Number(rank);
        deck.push({ id: `${n}-${suit}-${rank}`, rank, suit, value });
      }
    }
  }
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}


export type ChatTranslations = {
  noMessages: string;
  typeMessage: string;
  send: string;
};

