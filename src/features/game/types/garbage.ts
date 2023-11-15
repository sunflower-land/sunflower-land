import Decimal from "decimal.js-light";

import { marketRate } from "../lib/halvening";

export type GarbageName =
  | "Solar Flare Ticket"
  | "Dawn Breaker Ticket"
  | "Crow Feather"
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
  | "Tent";

export type Garbage = {
  sellPrice: Decimal;
};

export const GARBAGE: Record<GarbageName, Garbage> = {
  "Solar Flare Ticket": {
    sellPrice: marketRate(0.1),
  },
  "Dawn Breaker Ticket": {
    sellPrice: marketRate(0.1),
  },
  "Crow Feather": {
    sellPrice: marketRate(0.1),
  },
  "Jack-o-lantern": {
    sellPrice: marketRate(1),
  },
  "Love Letter": {
    sellPrice: marketRate(1),
  },
  "Red Envelope": {
    sellPrice: marketRate(1),
  },
  "War Bond": {
    sellPrice: marketRate(0.1),
  },

  "Blue Egg": {
    sellPrice: marketRate(1),
  },
  "Green Egg": {
    sellPrice: marketRate(1),
  },
  "Orange Egg": {
    sellPrice: marketRate(1),
  },
  "Pink Egg": {
    sellPrice: marketRate(1),
  },
  "Purple Egg": {
    sellPrice: marketRate(1),
  },
  "Red Egg": {
    sellPrice: marketRate(1),
  },

  "Yellow Egg": {
    sellPrice: marketRate(1),
  },
  "Rapid Growth": {
    sellPrice: marketRate(160),
  },
  Tent: {
    sellPrice: new Decimal(1),
  },
};
