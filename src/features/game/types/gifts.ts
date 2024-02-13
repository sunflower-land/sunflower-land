import { NPCName } from "lib/npcs";
import { InventoryItemName, Wardrobe } from "./game";
import { FlowerName } from "./flowers";

type GiftPoints = Partial<Record<FlowerName, number>>;

/**
 * Flowers that Bumpkins particularly desire
 * Gives bonus points
 */
export const BUMPKIN_FLOWER_BONUSES: Partial<Record<NPCName, GiftPoints>> = {
  // All Pansies
  betty: {
    "Red Pansy": 3,
    "Yellow Pansy": 3,
    "Purple Pansy": 3,
    "White Pansy": 3,
    "Blue Pansy": 3,
  },

  "pumpkin' pete": {
    "Yellow Cosmos": 4,
  },

  blacksmith: {
    "Red Carnation": 3,
  },

  // All Lotus
  bert: {
    "Red Lotus": 4,
    "Yellow Lotus": 4,
    "Purple Lotus": 4,
    "White Lotus": 4,
    "Blue Lotus": 4,
  },

  // All Daffodils
  finley: {
    "Red Daffodil": 3,
    "Yellow Daffodil": 3,
    "Purple Daffodil": 3,
    "White Daffodil": 3,
    "Blue Daffodil": 3,
  },

  // All Purple
  raven: {
    "Purple Carnation": 4,
    "Purple Lotus": 3,
    "Purple Daffodil": 2,
    "Purple Pansy": 2,
  },

  // All yellow
  miranda: {
    "Yellow Carnation": 4,
    "Yellow Lotus": 3,
    "Yellow Daffodil": 2,
    "Yellow Pansy": 2,
  },

  // White and Blue Cosmos
  finn: {
    "White Cosmos": 3,
    "Blue Cosmos": 3,
  },

  corale: {
    "Prism Petal": 4,
  },

  // All Balloon
  cornwell: {
    "Red Balloon Flower": 3,
    "Yellow Balloon Flower": 3,
    "Purple Balloon Flower": 3,
    "White Balloon Flower": 3,
    "Blue Balloon Flower": 3,
  },

  tywin: {
    "Primula Enigma": 5,
    "Celestial Frostbloom": 4,
  },
};

export const DEFAULT_FLOWER_POINTS: Record<FlowerName, number> = {
  "Red Pansy": 1,
  "Yellow Pansy": 1,
  "Purple Pansy": 1,
  "White Pansy": 1,
  "Blue Pansy": 1,
  "Red Cosmos": 1,
  "Yellow Cosmos": 1,
  "Purple Cosmos": 1,
  "White Cosmos": 1,
  "Blue Cosmos": 1,
  "Red Balloon Flower": 3,
  "Yellow Balloon Flower": 3,
  "Purple Balloon Flower": 3,
  "White Balloon Flower": 3,
  "Blue Balloon Flower": 3,
  "Red Carnation": 3,
  "Yellow Carnation": 3,
  "Purple Carnation": 3,
  "White Carnation": 3,
  "Blue Carnation": 3,

  "Red Daffodil": 5,
  "Yellow Daffodil": 5,
  "Purple Daffodil": 5,
  "White Daffodil": 5,
  "Blue Daffodil": 5,
  "Red Lotus": 5,
  "Yellow Lotus": 5,
  "Purple Lotus": 5,
  "White Lotus": 5,
  "Blue Lotus": 5,

  "Prism Petal": 10,
  "Celestial Frostbloom": 10,
  "Primula Enigma": 10,
};

export type BumpkinGift = {
  friendshipPoints: number;
  items: Partial<Record<InventoryItemName, number>>;
  sfl: number;
  wearables: Wardrobe;
};

type BumpkinGifts = {
  planned: BumpkinGift[];
  repeats: BumpkinGift;
};

export const BUMPKIN_GIFTS: Partial<Record<NPCName, BumpkinGifts>> = {
  "pumpkin' pete": {
    planned: [
      {
        friendshipPoints: 5,
        items: { "Block Buck": 1 },
        sfl: 0,
        wearables: {},
      },
      {
        friendshipPoints: 12,
        items: {
          "Treasure Key": 1,
        },
        sfl: 0,
        wearables: {},
      },
      {
        friendshipPoints: 50,
        items: {},
        wearables: { "Pumpkin Hat": 1 },
        sfl: 0,
      },
      {
        friendshipPoints: 100,
        items: {},
        sfl: 2,
        wearables: {},
      },
    ],
    repeats: {
      friendshipPoints: 100,
      items: { "Treasure Key": 1 },
      sfl: 2,
      wearables: {},
    },
  },
  betty: {
    planned: [
      {
        friendshipPoints: 10,
        items: { "Treasure Key": 1 },
        sfl: 0,
        wearables: {},
      },
      {
        friendshipPoints: 20,
        items: {},
        sfl: 3,
        wearables: {},
      },
      {
        friendshipPoints: 40,
        items: { "Block Buck": 1 },
        sfl: 0,
        wearables: {},
      },
      {
        friendshipPoints: 110,
        items: { "Radish Cake": 1 },
        sfl: 0,
        wearables: {},
      },
    ],
    repeats: {
      friendshipPoints: 100,
      items: { "Treasure Key": 1 },
      sfl: 0,
      wearables: {},
    },
  },
  blacksmith: {
    planned: [
      {
        friendshipPoints: 50,
        items: { "Treasure Key": 1 },
        sfl: 0,
        wearables: {},
      },
      {
        friendshipPoints: 110,
        items: { "Block Buck": 2 },
        sfl: 0,
        wearables: {},
      },
      {
        friendshipPoints: 200,
        items: {},
        sfl: 5,
        wearables: {},
      },
      {
        friendshipPoints: 320,
        items: { Pickaxe: 10 },
        sfl: 0,
        wearables: {},
      },
    ],
    repeats: {
      friendshipPoints: 150,
      items: { "Treasure Key": 1 },
      sfl: 50,
      wearables: {},
    },
  },
  bert: {
    planned: [
      {
        friendshipPoints: 60,
        items: {},
        sfl: 0,
        wearables: {
          "Tattered Jacket": 1,
        },
      },
      {
        friendshipPoints: 100,
        items: { "Block Buck": 2 },
        sfl: 0,
        wearables: {},
      },
      {
        friendshipPoints: 210,
        items: { "Pirate Cake": 3 },
        sfl: 0,
        wearables: {},
      },
      {
        friendshipPoints: 330,
        items: {},
        sfl: 0,
        wearables: {
          "Greyed Glory": 1,
        },
      },
    ],
    repeats: {
      friendshipPoints: 150,
      items: { "Rare Key": 1 },
      sfl: 0,
      wearables: {},
    },
  },
  finley: {
    planned: [
      {
        friendshipPoints: 70,
        items: { "Fishing Lure": 5 },
        sfl: 0,
        wearables: {},
      },
      {
        friendshipPoints: 140,
        items: {},
        sfl: 3,
        wearables: {},
      },
      {
        friendshipPoints: 220,
        items: { Tuna: 5 },
        sfl: 0,
        wearables: {},
      },
    ],
    repeats: {
      friendshipPoints: 100,
      items: { "Rare Key": 1 },
      sfl: 0,
      wearables: {},
    },
  },
  raven: {
    planned: [
      {
        friendshipPoints: 80,
        items: { "Time Warp Totem": 1 },
        sfl: 0,
        wearables: {},
      },
      {
        friendshipPoints: 140,
        items: {},
        sfl: 3,
        wearables: {},
      },
      {
        friendshipPoints: 220,
        items: {},
        sfl: 0,
        wearables: { "Victorian Hat": 1 },
      },
      {
        friendshipPoints: 330,
        items: { "Eggplant Seed": 50 },
        sfl: 5,
        wearables: {},
      },
      {
        friendshipPoints: 700,
        items: {},
        sfl: 0,
        wearables: {
          "Bat Wings": 1,
        },
      },
    ],
    repeats: {
      friendshipPoints: 160,
      items: { "Rare Key": 1 },
      sfl: 0,
      wearables: {},
    },
  },
  miranda: {
    planned: [
      {
        friendshipPoints: 120,
        items: { "Time Warp Totem": 1 },
        sfl: 0,
        wearables: {},
      },
      {
        friendshipPoints: 240,
        items: {},
        sfl: 3,
        wearables: {},
      },
      {
        friendshipPoints: 400,
        items: {},
        sfl: 5,
        wearables: {},
      },
      {
        friendshipPoints: 700,
        items: {},
        sfl: 0,
        wearables: { "Fruit Picker Apron": 1 },
      },
      {
        friendshipPoints: 1000,
        items: {},
        sfl: 100,
        wearables: { "Fruit Bowl": 1 },
      },
    ],
    repeats: {
      friendshipPoints: 100,
      items: {
        "Blueberry Seed": 5,
        "Apple Seed": 5,
        "Banana Plant": 5,
        "Orange Seed": 5,
      },
      sfl: 0,
      wearables: {},
    },
  },
  finn: {
    planned: [
      {
        friendshipPoints: 90,
        items: { Rod: 10 },
        sfl: 0,
        wearables: {},
      },
      {
        friendshipPoints: 200,
        items: {},
        sfl: 3,
        wearables: {},
      },
    ],
    repeats: {
      friendshipPoints: 110,
      items: { "Fishing Lure": 5 },
      sfl: 0,
      wearables: {},
    },
  },
  corale: {
    planned: [
      {
        friendshipPoints: 85,
        items: {},
        sfl: 3,
        wearables: {},
      },
      {
        friendshipPoints: 190,
        items: { "Block Buck": 2 },
        sfl: 0,
        wearables: {},
      },
      {
        friendshipPoints: 370,
        items: {},
        sfl: 0,
        wearables: { "Pink Ponytail": 1 },
      },
    ],
    repeats: {
      friendshipPoints: 260,
      items: {},
      sfl: 10,
      wearables: {},
    },
  },
  cornwell: {
    planned: [
      {
        friendshipPoints: 65,
        items: { "Rare Key": 1 },
        sfl: 0,
        wearables: {},
      },
      {
        friendshipPoints: 175,
        items: { "Block Buck": 1 },
        sfl: 0,
        wearables: {},
      },
      {
        friendshipPoints: 340,
        items: {},
        sfl: 0,
        wearables: { "Wise Robes": 1 },
      },
      {
        friendshipPoints: 600,
        items: {},
        sfl: 0,
        wearables: { "Wise Beard": 1 },
      },
    ],
    repeats: {
      friendshipPoints: 200,
      items: { "Rare Key": 1 },
      sfl: 0,
      wearables: {},
    },
  },

  tywin: {
    planned: [
      {
        friendshipPoints: 35,
        items: { "Rare Key": 1 },
        sfl: 0,
        wearables: {},
      },
      {
        friendshipPoints: 175,
        items: {},
        sfl: 10,
        wearables: {},
      },
      {
        friendshipPoints: 330,
        items: { "Pirate Cake": 5 },
        sfl: 0,
        wearables: {},
      },
    ],
    repeats: {
      friendshipPoints: 160,
      items: { "Rare Key": 1 },
      sfl: 0,
      wearables: {},
    },
  },
};
