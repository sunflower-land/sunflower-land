import { NPCName } from "lib/npcs";
import { InventoryItemName, Wardrobe } from "./game";
import { FlowerName } from "./flowers";

type GiftPoints = Partial<Record<FlowerName, number>>;

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
