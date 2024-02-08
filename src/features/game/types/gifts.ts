import { NPCName } from "lib/npcs";
import { InventoryItemName, Wardrobe } from "./game";
import { FlowerName } from "./flowers";

type GiftPoints = Partial<Record<FlowerName, number>>;

/**
 * Flowers that Bumpkins particularly desire
 * Otherwise, they will get default flower points
 */
export const BUMPKIN_DESIRES: Partial<Record<NPCName, GiftPoints>> = {
  betty: {
    "White Cosmos": 3,
    "Blue Daffodil": 15,
  },
  "pumpkin' pete": {
    "Red Pansy": 10,
    "White Cosmos": 3,
    "Blue Daffodil": 15,
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
  bonus: BumpkinGift;
};

export const BUMPKIN_GIFTS: Partial<Record<NPCName, BumpkinGifts>> = {
  "pumpkin' pete": {
    planned: [
      {
        friendshipPoints: 10,
        items: {
          "Block Buck": 1,
        },
        sfl: 0,
        wearables: {},
      },
      {
        friendshipPoints: 25,
        items: {},
        sfl: 0,
        wearables: {
          "Pumpkin Hat": 1,
        },
      },
      {
        friendshipPoints: 50,
        items: {},
        sfl: 5,
        wearables: {},
      },
    ],
    bonus: {
      friendshipPoints: 50, // Every 50 points
      items: { "Block Buck": 1 },
      sfl: 0,
      wearables: {},
    },
  },
};
