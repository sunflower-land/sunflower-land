import { GameState, InventoryItemName } from "./game";
import Decimal from "decimal.js-light";
import { BumpkinItem } from "./bumpkin";

export type StylistWearable = {
  sfl: Decimal;
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
    sfl: new Decimal(10),
    ingredients: {},
  },
  "Light Brown Farmer Potion": {
    sfl: new Decimal(10),
    ingredients: {},
  },
  "Dark Brown Farmer Potion": {
    sfl: new Decimal(10),
    ingredients: {},
  },
  "Goblin Potion": {
    sfl: new Decimal(50),
    ingredients: {},
  },
  "Rancher Hair": {
    sfl: new Decimal(10),
    ingredients: {},
  },
  "Basic Hair": {
    sfl: new Decimal(10),
    ingredients: {},
  },
  "Buzz Cut": {
    sfl: new Decimal(15),
    ingredients: {},
  },
  "Explorer Hair": {
    sfl: new Decimal(15),
    ingredients: {},
  },

  "Red Farmer Shirt": {
    sfl: new Decimal(5),
    ingredients: {},
  },
  "Blue Farmer Shirt": {
    sfl: new Decimal(5),
    ingredients: {},
  },
  "Yellow Farmer Shirt": {
    sfl: new Decimal(5),
    ingredients: {},
  },
  "Farmer Pants": {
    sfl: new Decimal(5),
    ingredients: {},
  },
  "Farmer Overalls": {
    sfl: new Decimal(5),
    ingredients: {},
  },
  "Lumberjack Overalls": {
    sfl: new Decimal(10),
    ingredients: {},
  },
  "Streamer Helmet": {
    sfl: new Decimal(10),
    ingredients: {
      "Sunflower Supporter": new Decimal(50),
    },
    disabled: true,
  },
  "Birthday Hat": {
    sfl: new Decimal(25),
    ingredients: {},
    disabled: true,
    hoursPlayed: 24 * 365,
  },
  "Double Harvest Cap": {
    sfl: new Decimal(50),
    ingredients: {},
    disabled: true,
    hoursPlayed: 2 * 24 * 365,
  },
};

export const STYLIST_WEARABLES: (game: GameState) => ShopWearables = (
  game
) => ({
  ...BASIC_WEARABLES,
});
