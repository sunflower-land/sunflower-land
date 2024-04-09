import { InventoryItemName } from "./game";
import Decimal from "decimal.js-light";
import { BumpkinItem } from "./bumpkin";

export type StylistWearable = {
  coins: number;
  ingredients: Partial<Record<InventoryItemName, Decimal>>;
  disabled?: boolean;
  hoursPlayed?: number;
  from?: Date;
  to?: Date;
  requiresItem?: InventoryItemName;
};

export type ShopWearables = Partial<Record<BumpkinItem, StylistWearable>>;

export const BASIC_WEARABLES: ShopWearables = {
  "Beige Farmer Potion": {
    coins: 3200,
    ingredients: {},
  },
  "Light Brown Farmer Potion": {
    coins: 3200,
    ingredients: {},
  },
  "Dark Brown Farmer Potion": {
    coins: 3200,
    ingredients: {},
  },
  "Goblin Potion": {
    coins: 16000,
    ingredients: {},
  },
  "Rancher Hair": {
    coins: 3200,
    ingredients: {},
  },
  "Basic Hair": {
    coins: 3200,
    ingredients: {},
  },
  "Buzz Cut": {
    coins: 4800,
    ingredients: {},
  },
  "Explorer Hair": {
    coins: 4800,
    ingredients: {},
  },

  "Red Farmer Shirt": {
    coins: 1600,
    ingredients: {},
  },
  "Blue Farmer Shirt": {
    coins: 1600,
    ingredients: {},
  },
  "Yellow Farmer Shirt": {
    coins: 1600,
    ingredients: {},
  },
  "Farmer Pants": {
    coins: 1600,
    ingredients: {},
  },
  "Farmer Overalls": {
    coins: 1600,
    ingredients: {},
  },
  "Lumberjack Overalls": {
    coins: 3200,
    ingredients: {},
  },
  "Streamer Helmet": {
    coins: 3200,
    ingredients: {
      "Sunflower Supporter": new Decimal(50),
    },
    disabled: true,
  },
  "Birthday Hat": {
    coins: 8000,
    ingredients: {},
    disabled: true,
    hoursPlayed: 24 * 365,
  },
  "Double Harvest Cap": {
    coins: 16000,
    ingredients: {},
    disabled: true,
    hoursPlayed: 2 * 24 * 365,
  },
};

export const STYLIST_WEARABLES: ShopWearables = {
  ...BASIC_WEARABLES,
};
