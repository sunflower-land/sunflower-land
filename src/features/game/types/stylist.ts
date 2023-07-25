import { BumpkinItem } from "./bumpkin";
import { Inventory } from "./game";

export type StylistWearable = {
  sfl: number;
  ingredients: Inventory;
};

export const STYLIST_WEARABLES: Partial<Record<BumpkinItem, StylistWearable>> =
  {
    "Goblin Potion": {
      sfl: 50,
      ingredients: {},
    },
    "Red Farmer Shirt": {
      sfl: 10,
      ingredients: {},
    },
    "Blue Farmer Shirt": {
      sfl: 10,
      ingredients: {},
    },
    "Yellow Farmer Shirt": {
      sfl: 10,
      ingredients: {},
    },
  };
