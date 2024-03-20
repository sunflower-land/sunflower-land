export type GarbageName =
  | "Solar Flare Ticket"
  | "Dawn Breaker Ticket"
  | "Crow Feather"
  | "Mermaid Scale"
  | "War Bond"
  | "Love Letter"
  | "Red Envelope"
  | "Jack-o-lantern"
  | "Blue Egg"
  | "Green Egg"
  | "Orange Egg"
  | "Pink Egg"
  | "Purple Egg"
  | "Red Egg"
  | "Yellow Egg"
  | "Rapid Growth"
  | "Tent"
  | "Earthworm"
  | "Grub"
  | "Red Wiggler";

export type Garbage = {
  sellPrice: number;
};

export const GARBAGE: Record<GarbageName, Garbage> = {
  // Seasonal Tickets
  "Solar Flare Ticket": {
    sellPrice: 0.1,
  },
  "Dawn Breaker Ticket": {
    sellPrice: 0.1,
  },
  "Crow Feather": {
    sellPrice: 0.1,
  },
  "Mermaid Scale": {
    sellPrice: 0.1,
  },

  // Old event tickets
  "Jack-o-lantern": {
    sellPrice: 1,
  },
  "Love Letter": {
    sellPrice: 1,
  },
  "Red Envelope": {
    sellPrice: 1,
  },
  "War Bond": {
    sellPrice: 0.1,
  },

  // Easter Eggs
  "Blue Egg": {
    sellPrice: 1,
  },
  "Green Egg": {
    sellPrice: 1,
  },
  "Orange Egg": {
    sellPrice: 1,
  },
  "Pink Egg": {
    sellPrice: 1,
  },
  "Purple Egg": {
    sellPrice: 1,
  },
  "Red Egg": {
    sellPrice: 1,
  },
  "Yellow Egg": {
    sellPrice: 1,
  },

  // Others
  "Rapid Growth": {
    sellPrice: 160,
  },
  Tent: {
    sellPrice: 20,
  },

  // Worms
  Earthworm: {
    sellPrice: 0.1,
  },
  Grub: {
    sellPrice: 0.1,
  },
  "Red Wiggler": {
    sellPrice: 0.1,
  },
};
