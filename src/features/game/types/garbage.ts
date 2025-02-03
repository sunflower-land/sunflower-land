import { BB_TO_GEM_RATIO, Inventory, InventoryItemName } from "./game";
import { SeasonalTicket, SEASONS } from "./seasons";
import Decimal from "decimal.js-light";
import { BumpkinItem } from "./bumpkin";

export type GarbageName =
  | Extract<
      InventoryItemName,
      | "Block Buck"
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
      | SeasonalTicket
      | "Chicken"
      | "Hen House"
      | "Basic Bear"
    >
  | Extract<BumpkinItem, "Basic Hair">;

export type Garbage = {
  sellPrice: number;
  gems: number;
  items?: Inventory;
  // The limit is the number that are useful in game, you can't sell more than this
  limit?: number;
};

export const GARBAGE: Record<GarbageName, Garbage> = {
  "Block Buck": {
    sellPrice: 0,
    gems: BB_TO_GEM_RATIO,
  },
  "Solar Flare Ticket": {
    sellPrice: 0.1,
    gems: 0,
  },
  "Dawn Breaker Ticket": {
    sellPrice: 0.1,
    gems: 0,
  },
  "Crow Feather": {
    sellPrice: 0.1,
    gems: 0,
  },
  "Mermaid Scale": {
    sellPrice: 0.1,
    gems: 0,
  },
  "Tulip Bulb": {
    sellPrice: 0.1,
    gems: 0,
  },
  "Jack-o-lantern": {
    sellPrice: 1,
    gems: 0,
  },
  "Love Letter": {
    sellPrice: 1,
    gems: 0,
  },
  "Red Envelope": {
    sellPrice: 1,
    gems: 0,
  },
  "War Bond": {
    sellPrice: 0.1,
    gems: 0,
  },

  "Blue Egg": {
    sellPrice: 1,
    gems: 0,
  },
  "Green Egg": {
    sellPrice: 1,
    gems: 0,
  },
  "Orange Egg": {
    sellPrice: 1,
    gems: 0,
  },
  "Pink Egg": {
    sellPrice: 1,
    gems: 0,
  },
  "Purple Egg": {
    sellPrice: 1,
    gems: 0,
  },
  "Red Egg": {
    sellPrice: 1,
    gems: 0,
  },
  "Yellow Egg": {
    sellPrice: 1,
    gems: 0,
  },
  "Rapid Growth": {
    sellPrice: 160,
    gems: 0,
  },
  Tent: {
    sellPrice: 20,
    gems: 0,
  },
  Earthworm: {
    sellPrice: 0.1,
    gems: 0,
  },
  Grub: {
    sellPrice: 0.1,
    gems: 0,
  },
  "Red Wiggler": {
    sellPrice: 0.1,
    gems: 0,
  },
  ...(SEASONS["Clash of Factions"].endDate.getTime() < Date.now()
    ? {
        Scroll: {
          sellPrice: 0.1,
          gems: 0,
        },
      }
    : ({} as { Scroll: { sellPrice: number; gems: number } })),
  ...(SEASONS["Pharaoh's Treasure"].endDate.getTime() < Date.now()
    ? {
        "Amber Fossil": {
          sellPrice: 0.1,
          gems: 0,
        },
      }
    : ({} as { "Amber Fossil": { sellPrice: number; gems: number } })),
  ...(SEASONS["Bull Run"].endDate.getTime() < Date.now()
    ? {
        Horseshoe: {
          sellPrice: 0.1,
          gems: 0,
        },
      }
    : ({} as { Horseshoe: { sellPrice: number; gems: number } })),

  ...(SEASONS["Winds of Change"].endDate.getTime() < Date.now()
    ? {
        Timeshard: {
          sellPrice: 0.1,
          gems: 0,
        },
      }
    : ({} as { Timeshard: { sellPrice: number; gems: number } })),

  Chicken: {
    sellPrice: 200,
    gems: 0,
  },
  "Hen House": {
    sellPrice: 800,
    gems: 0,
    limit: 1,
    items: {
      Wood: new Decimal(200),
      Iron: new Decimal(15),
      Gold: new Decimal(15),
      Egg: new Decimal(300),
    },
  },
  "Basic Bear": {
    sellPrice: 1,
    gems: 0,
  },
  "Basic Hair": {
    sellPrice: 1,
    gems: 0,
  },
};
