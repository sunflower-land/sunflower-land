import { NPCName } from "lib/npcs";
import { InventoryItemName, Wardrobe } from "./game";
import { FlowerName } from "./flowers";

type GiftPoints = Partial<Record<FlowerName, number>>;

/**
 * Flowers that Bumpkins particularly desire
 * Otherwise, they will get default flower points
 */
export const BUMPKIN_FLOWER_BONUSES: Partial<Record<NPCName, GiftPoints>> = {
  betty: {
    "Red Pansy": 5,
    "Yellow Pansy": 5,
    "Purple Pansy": 5,
    "White Pansy": 5,
    "Blue Pansy": 5,
  },
  "pumpkin' pete": { "Yellow Cosmos": 6 },
  blacksmith: { "Red Carnation": 5 },
  bert: {
    "Red Lotus": 6,
    "Yellow Lotus": 6,
    "Purple Lotus": 6,
    "White Lotus": 6,
    "Blue Lotus": 6,
  },
  finley: {
    "Red Daffodil": 5,
    "Yellow Daffodil": 5,
    "Purple Daffodil": 5,
    "White Daffodil": 5,
    "Blue Daffodil": 5,
  },
  raven: {
    "Purple Carnation": 6,
    "Purple Lotus": 5,
    "Purple Daffodil": 4,
    "Purple Pansy": 4,
  },
  miranda: {
    "Yellow Carnation": 6,
    "Yellow Lotus": 5,
    "Yellow Daffodil": 4,
    "Yellow Pansy": 4,
  },
  finn: { "White Cosmos": 5, "Blue Cosmos": 5 },
  corale: { "Prism Petal": 6 },
  cornwell: {
    "Red Balloon Flower": 5,
    "Yellow Balloon Flower": 5,
    "Purple Balloon Flower": 5,
    "White Balloon Flower": 5,
    "Blue Balloon Flower": 5,
  },
  tywin: { "Primula Enigma": 7, "Celestial Frostbloom": 6 },
};

export const DEFAULT_FLOWER_POINTS: Record<FlowerName, number> = {
  "Red Pansy": 3,
  "Yellow Pansy": 3,
  "Purple Pansy": 3,
  "White Pansy": 3,
  "Blue Pansy": 3,
  "Red Cosmos": 3,
  "Yellow Cosmos": 3,
  "Purple Cosmos": 3,
  "White Cosmos": 3,
  "Blue Cosmos": 3,
  "Red Balloon Flower": 5,
  "Yellow Balloon Flower": 5,
  "Purple Balloon Flower": 5,
  "White Balloon Flower": 5,
  "Blue Balloon Flower": 5,
  "Red Carnation": 5,
  "Yellow Carnation": 5,
  "Purple Carnation": 5,
  "White Carnation": 5,
  "Blue Carnation": 5,
  "Red Daffodil": 7,
  "Yellow Daffodil": 7,
  "Purple Daffodil": 7,
  "White Daffodil": 7,
  "Blue Daffodil": 7,
  "Red Lotus": 7,
  "Yellow Lotus": 7,
  "Purple Lotus": 7,
  "White Lotus": 7,
  "Blue Lotus": 7,
  "Prism Petal": 12,
  "Celestial Frostbloom": 12,
  "Primula Enigma": 12,
};

export type BumpkinGift = {
  friendshipPoints: number;
  items: Partial<Record<InventoryItemName, number>>;
  coins: number;
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
        coins: 0,
        wearables: {},
      },
      {
        friendshipPoints: 12,
        items: {
          "Treasure Key": 1,
        },
        coins: 0,
        wearables: {},
      },
      {
        friendshipPoints: 50,
        items: {},
        wearables: { "Pumpkin Hat": 1 },
        coins: 0,
      },
      {
        friendshipPoints: 100,
        items: {},
        coins: 640,
        wearables: {},
      },
    ],
    repeats: {
      friendshipPoints: 100,
      items: { "Treasure Key": 1 },
      coins: 640,
      wearables: {},
    },
  },
  betty: {
    planned: [
      {
        friendshipPoints: 10,
        items: { "Treasure Key": 1 },
        coins: 0,
        wearables: {},
      },
      {
        friendshipPoints: 20,
        items: {},
        coins: 960,
        wearables: {},
      },
      {
        friendshipPoints: 40,
        items: { "Block Buck": 1 },
        coins: 0,
        wearables: {},
      },
      {
        friendshipPoints: 110,
        items: { "Radish Cake": 1 },
        coins: 0,
        wearables: {},
      },
    ],
    repeats: {
      friendshipPoints: 100,
      items: { "Treasure Key": 1 },
      coins: 0,
      wearables: {},
    },
  },
  blacksmith: {
    planned: [
      {
        friendshipPoints: 50,
        items: { "Treasure Key": 1 },
        coins: 0,
        wearables: {},
      },
      {
        friendshipPoints: 110,
        items: { "Block Buck": 2 },
        coins: 0,
        wearables: {},
      },
      {
        friendshipPoints: 200,
        items: {},
        coins: 1600,
        wearables: {},
      },
      {
        friendshipPoints: 320,
        items: { Pickaxe: 10 },
        coins: 0,
        wearables: {},
      },
    ],
    repeats: {
      friendshipPoints: 150,
      items: { "Treasure Key": 1 },
      coins: 960,
      wearables: {},
    },
  },
  bert: {
    planned: [
      {
        friendshipPoints: 60,
        items: {},
        coins: 0,
        wearables: {
          "Tattered Jacket": 1,
        },
      },
      {
        friendshipPoints: 100,
        items: { "Block Buck": 2 },
        coins: 0,
        wearables: {},
      },
      {
        friendshipPoints: 210,
        items: { "Pirate Cake": 3 },
        coins: 0,
        wearables: {},
      },
      {
        friendshipPoints: 330,
        items: {},
        coins: 0,
        wearables: {
          "Greyed Glory": 1,
        },
      },
    ],
    repeats: {
      friendshipPoints: 150,
      items: { "Rare Key": 1 },
      coins: 0,
      wearables: {},
    },
  },
  finley: {
    planned: [
      {
        friendshipPoints: 25,
        items: { "Fishing Lure": 3 },
        coins: 0,
        wearables: {},
      },
      {
        friendshipPoints: 95,
        items: {},
        coins: 3200,
        wearables: {},
      },
      {
        friendshipPoints: 150,
        items: { Tuna: 5 },
        coins: 0,
        wearables: {},
      },
    ],
    repeats: {
      friendshipPoints: 100,
      items: { "Fishing Lure": 5 },
      coins: 0,
      wearables: {},
    },
  },
  raven: {
    planned: [
      {
        friendshipPoints: 50,
        items: { "Time Warp Totem": 1 },
        coins: 0,
        wearables: {},
      },
      {
        friendshipPoints: 140,
        items: {},
        coins: 2560,
        wearables: {},
      },
      {
        friendshipPoints: 220,
        items: {},
        coins: 0,
        wearables: { "Victorian Hat": 1 },
      },
      {
        friendshipPoints: 330,
        items: { "Eggplant Seed": 50 },
        coins: 1600,
        wearables: {},
      },
      {
        friendshipPoints: 700,
        items: {},
        coins: 0,
        wearables: {
          "Bat Wings": 1,
        },
      },
    ],
    repeats: {
      friendshipPoints: 160,
      items: { "Rare Key": 1 },
      coins: 0,
      wearables: {},
    },
  },
  miranda: {
    planned: [
      {
        friendshipPoints: 30,
        items: { "Time Warp Totem": 1 },
        coins: 0,
        wearables: {},
      },
      {
        friendshipPoints: 90,
        items: {},
        coins: 960,
        wearables: {
          "Fruit Picker Shirt": 1,
        },
      },
      {
        friendshipPoints: 260,
        items: {},
        coins: 0,
        wearables: { "Fruit Picker Apron": 1 },
      },
      {
        friendshipPoints: 500,
        items: {},
        coins: 6400,
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
      coins: 0,
      wearables: {},
    },
  },
  finn: {
    planned: [
      {
        friendshipPoints: 40,
        items: { Rod: 10 },
        coins: 0,
        wearables: {},
      },
      {
        friendshipPoints: 150,
        items: {},
        coins: 960,
        wearables: {},
      },
    ],
    repeats: {
      friendshipPoints: 130,
      items: { "Rare Key": 1 },
      coins: 0,
      wearables: {},
    },
  },
  corale: {
    planned: [
      {
        friendshipPoints: 45,
        items: {},
        coins: 960,
        wearables: {},
      },
      {
        friendshipPoints: 150,
        items: { "Block Buck": 2 },
        coins: 0,
        wearables: {},
      },
      {
        friendshipPoints: 320,
        items: {},
        coins: 0,
        wearables: { "Pink Ponytail": 1 },
      },
    ],
    repeats: {
      friendshipPoints: 200,
      items: {},
      coins: 3200,
      wearables: {},
    },
  },
  cornwell: {
    planned: [
      {
        friendshipPoints: 65,
        items: { "Rare Key": 1 },
        coins: 0,
        wearables: {},
      },
      {
        friendshipPoints: 175,
        items: { "Block Buck": 1 },
        coins: 0,
        wearables: {},
      },
      {
        friendshipPoints: 340,
        items: {},
        coins: 0,
        wearables: { "Wise Robes": 1 },
      },
      {
        friendshipPoints: 600,
        items: {},
        coins: 0,
        wearables: { "Wise Beard": 1 },
      },
    ],
    repeats: {
      friendshipPoints: 200,
      items: { "Luxury Key": 1 },
      coins: 0,
      wearables: {},
    },
  },

  tywin: {
    planned: [
      {
        friendshipPoints: 35,
        items: { "Rare Key": 1 },
        coins: 0,
        wearables: {},
      },
      {
        friendshipPoints: 175,
        items: {},
        coins: 3200,
        wearables: {},
      },
      {
        friendshipPoints: 330,
        items: { "Pirate Cake": 5 },
        coins: 0,
        wearables: {},
      },
    ],
    repeats: {
      friendshipPoints: 160,
      items: { "Luxury Key": 1 },
      coins: 0,
      wearables: {},
    },
  },
};
