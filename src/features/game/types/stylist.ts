import { BumpkinItem } from "./bumpkin";
import { InventoryItemName } from "./game";

export type StylistWearable = {
  sfl: number;
  ingredients: Partial<Record<InventoryItemName, number>>;
  disabled?: boolean;
};

export type ShopWearables = Partial<Record<BumpkinItem, StylistWearable>>;

export const BASIC_WEARABLES: ShopWearables = {
  "Beige Farmer Potion": {
    sfl: 10,
    ingredients: {},
  },
  "Dark Brown Farmer Potion": {
    sfl: 10,
    ingredients: {},
  },
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
  "Rancher Hair": {
    sfl: 15,
    ingredients: {},
  },
  "Basic Hair": {
    sfl: 15,
    ingredients: {},
  },
  "Explorer Hair": {
    sfl: 15,
    ingredients: {},
  },
};

export const LIMITED_WEARABLES: ShopWearables = {
  "Birthday Hat": {
    sfl: 25,
    ingredients: {},
    disabled: true,
  },
  "Double Harvest Cap": {
    sfl: 50,
    ingredients: {},
    disabled: true,
  },
  "Streamer Helmet": {
    sfl: 10,
    ingredients: {},
    disabled: true,
  },
};

export const STYLIST_WEARABLES: ShopWearables = {
  ...BASIC_WEARABLES,
  ...LIMITED_WEARABLES,
};
