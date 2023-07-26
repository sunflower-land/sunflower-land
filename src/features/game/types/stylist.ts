import { BumpkinItem } from "./bumpkin";
import { InventoryItemName } from "./game";

export type StylistWearable = {
  sfl: number;
  ingredients: Partial<Record<InventoryItemName, number>>;
  disabled?: boolean;
  hoursPlayed?: number;
  from?: Date;
  to?: Date;
  requiresItem?: InventoryItemName;
};

export type ShopWearables = Partial<Record<BumpkinItem, StylistWearable>>;

export const BASIC_WEARABLES: ShopWearables = {
  "Beige Farmer Potion": {
    sfl: 10,
    ingredients: {},
  },
  "Light Brown Farmer Potion": {
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

  "Rancher Hair": {
    sfl: 10,
    ingredients: {},
  },
  "Basic Hair": {
    sfl: 10,
    ingredients: {},
  },
  "Buzz Cut": {
    sfl: 15,
    ingredients: {},
  },
  "Explorer Hair": {
    sfl: 15,
    ingredients: {},
  },

  "Red Farmer Shirt": {
    sfl: 5,
    ingredients: {},
  },
  "Blue Farmer Shirt": {
    sfl: 5,
    ingredients: {},
  },
  "Yellow Farmer Shirt": {
    sfl: 5,
    ingredients: {},
  },

  "Farmer Pants": {
    sfl: 5,
    ingredients: {},
  },
  "Farmer Overalls": {
    sfl: 5,
    ingredients: {},
  },
  "Lumberjack Overalls": {
    sfl: 10,
    ingredients: {},
  },
  "Streamer Helmet": {
    sfl: 10,
    ingredients: {
      "Sunflower Supporter": 50,
    },
    disabled: true,
  },
  "Birthday Hat": {
    sfl: 25,
    ingredients: {},
    disabled: true,
    hoursPlayed: 24 * 365,
  },
  "Double Harvest Cap": {
    sfl: 50,
    ingredients: {},
    disabled: true,
    hoursPlayed: 2 * 24 * 365,
  },
};

export const LIMITED_WEARABLES: ShopWearables = {
  "Witching Wardrobe": {
    sfl: 0,
    ingredients: {
      Gold: 5,
      "Crow Feather": 50,
    },
    from: new Date("2023-08-01"),
    to: new Date("2023-11-01"),
  },
  "Witch's Broom": {
    sfl: 0,
    ingredients: {
      Gold: 5,
      "Crow Feather": 50,
    },
    from: new Date("2023-08-01"),
    to: new Date("2023-11-01"),
  },
  "Infernal Bumpkin Potion": {
    sfl: 250,
    ingredients: {},
    from: new Date("2023-08-01"),
    to: new Date("2023-09-01"),
    requiresItem: "Witches' Eve Banner",
  },
  "Infernal Goblin Potion": {
    sfl: 300,
    ingredients: {},
    from: new Date("2023-08-01"),
    to: new Date("2023-09-01"),
    requiresItem: "Witches' Eve Banner",
  },
  "Imp Costume": {
    sfl: 0,
    ingredients: {
      "Crow Feather": 1000,
    },
    from: new Date("2023-09-01"),
    to: new Date("2023-10-01"),
  },
  "Ox Costume": {
    sfl: 50,
    ingredients: {
      "Crow Feather": 500,
    },
    from: new Date("2023-08-01"),
    to: new Date("2023-11-01"),
  },
};

export const STYLIST_WEARABLES: ShopWearables = {
  ...BASIC_WEARABLES,
  ...LIMITED_WEARABLES,
};
