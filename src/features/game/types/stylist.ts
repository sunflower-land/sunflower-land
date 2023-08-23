import { GameState, InventoryItemName } from "./game";
import { SFLDiscount } from "../lib/SFLDiscount";
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

export const LIMITED_WEARABLES: (game: GameState) => ShopWearables = (
  game: GameState
) => ({
  "Witching Wardrobe": {
    sfl: new Decimal(0),
    ingredients: {
      Gold: new Decimal(5),
      "Crow Feather": new Decimal(50),
    },
    from: new Date("2023-08-01"),
    to: new Date("2023-11-01"),
  },
  "Witch's Broom": {
    sfl: new Decimal(0),

    ingredients: {
      Gold: new Decimal(5),
      "Crow Feather": new Decimal(50),
    },
    from: new Date("2023-08-01"),
    to: new Date("2023-11-01"),
  },
  "Infernal Bumpkin Potion": {
    sfl: SFLDiscount(game, new Decimal(250)),
    ingredients: {},
    from: new Date("2023-08-01"),
    to: new Date("2023-09-01"),
    requiresItem: "Witches' Eve Banner",
  },
  "Infernal Goblin Potion": {
    sfl: SFLDiscount(game, new Decimal(300)),
    ingredients: {},
    from: new Date("2023-08-01"),
    to: new Date("2023-09-01"),
    requiresItem: "Witches' Eve Banner",
  },
  "Imp Costume": {
    sfl: new Decimal(0),

    ingredients: {
      "Crow Feather": new Decimal(1000),
    },
    from: new Date("2023-09-01"),
    to: new Date("2023-10-01"),
  },
  "Ox Costume": {
    sfl: SFLDiscount(game, new Decimal(50)),
    ingredients: {
      "Crow Feather": new Decimal(500),
    },
    from: new Date("2023-08-01"),
    to: new Date("2023-11-01"),
  },
  "Crow Wings": {
    sfl: new Decimal(0),
    ingredients: {
      "Crow Feather": new Decimal(3000),
    },
    from: new Date("2023-08-01"),
    to: new Date("2023-11-01"),
  },
});

export const STYLIST_WEARABLES: (game: GameState) => ShopWearables = (
  game
) => ({
  ...BASIC_WEARABLES,
  ...LIMITED_WEARABLES(game),
});
