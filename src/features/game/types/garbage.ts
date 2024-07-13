import { SeasonalTicket } from "./seasons";

export type GarbageName =
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
  | "Red Wiggler"
  | SeasonalTicket;

export type Garbage = {
  sellPrice: number;
  available: boolean;
};
/* Set date of availability */
const garbageStartDate = (availableAt: Date) => {
  const now = new Date();
  return now >= availableAt;
};

export const GARBAGE: Record<GarbageName, Garbage> = {
  // Seasonal Tickets
  "Solar Flare Ticket": {
    sellPrice: 0.1,
    available: true,
  },
  "Dawn Breaker Ticket": {
    sellPrice: 0.1,
    available: true,
  },
  "Crow Feather": {
    sellPrice: 0.1,
    available: true,
  },
  "Mermaid Scale": {
    sellPrice: 0.1,
    available: true,
  },
  "Tulip Bulb": {
    sellPrice: 0.1,
    available: true,
  },
  Scroll: {
    sellPrice: 0.1,
    available: garbageStartDate(new Date("2024-08-01")),
  },

  // Old event tickets
  "Jack-o-lantern": {
    sellPrice: 1,
    available: true,
  },
  "Love Letter": {
    sellPrice: 1,
    available: true,
  },
  "Red Envelope": {
    sellPrice: 1,
    available: true,
  },
  "War Bond": {
    sellPrice: 0.1,
    available: true,
  },

  // Easter Eggs
  "Blue Egg": {
    sellPrice: 1,
    available: true,
  },
  "Green Egg": {
    sellPrice: 1,
    available: true,
  },
  "Orange Egg": {
    sellPrice: 1,
    available: true,
  },
  "Pink Egg": {
    sellPrice: 1,
    available: true,
  },
  "Purple Egg": {
    sellPrice: 1,
    available: true,
  },
  "Red Egg": {
    sellPrice: 1,
    available: true,
  },
  "Yellow Egg": {
    sellPrice: 1,
    available: true,
  },

  // Others
  "Rapid Growth": {
    sellPrice: 160,
    available: true,
  },
  Tent: {
    sellPrice: 20,
    available: true,
  },

  // Worms
  Earthworm: {
    sellPrice: 0.1,
    available: true,
  },
  Grub: {
    sellPrice: 0.1,
    available: true,
  },
  "Red Wiggler": {
    sellPrice: 0.1,
    available: true,
  },
};
