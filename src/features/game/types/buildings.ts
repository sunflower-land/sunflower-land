import Decimal from "decimal.js-light";
import { BlacksmithItem, getKeys, BarnItem, MarketItem } from "./craftables";
import { Flag, FLAGS } from "./flags";
import { InventoryItemName } from "./game";

export type BuildingName =
  | "Fire Pit"
  | "Oven"
  | "Bakery"
  | "Anvil"
  | "Workbench";

export type BuildingBluePrint = {
  levelRequired: number;
  ingredients: {
    item: InventoryItemName;
    amount: Decimal;
  }[];
  sfl: Decimal;
  constructionSeconds: number;
};

export type PlaceableName =
  | BlacksmithItem
  | BarnItem
  | MarketItem
  | Flag
  | BuildingName
  | "Wicker Man"
  | "Golden Bonsai";

export const UPGRADABLES: Partial<Record<BuildingName, BuildingName>> = {
  "Fire Pit": "Oven",
  Anvil: "Workbench",
};

export const BUILDINGS: Record<BuildingName, BuildingBluePrint> = {
  "Fire Pit": {
    levelRequired: 1,
    ingredients: [
      {
        item: "Wood",
        amount: new Decimal(3),
      },
      {
        item: "Stone",
        amount: new Decimal(3),
      },
    ],
    sfl: new Decimal(0),
    constructionSeconds: 30,
  },
  Oven: {
    levelRequired: 2,
    ingredients: [
      {
        item: "Wood",
        amount: new Decimal(5),
      },
      {
        item: "Stone",
        amount: new Decimal(5),
      },
      {
        item: "Iron",
        amount: new Decimal(5),
      },
    ],
    sfl: new Decimal(5),
    constructionSeconds: 60 * 5,
  },
  Bakery: {
    levelRequired: 2,
    ingredients: [
      {
        item: "Wood",
        amount: new Decimal(10),
      },
      {
        item: "Stone",
        amount: new Decimal(10),
      },
      {
        item: "Iron",
        amount: new Decimal(10),
      },
    ],
    sfl: new Decimal(10),
    constructionSeconds: 60 * 30,
  },
  Anvil: {
    levelRequired: 1,
    ingredients: [
      {
        item: "Iron",
        amount: new Decimal(1),
      },
    ],
    sfl: new Decimal(1),
    constructionSeconds: 60 * 5,
  },
  Workbench: {
    levelRequired: 2,
    ingredients: [
      {
        item: "Wood",
        amount: new Decimal(5),
      },
      {
        item: "Stone",
        amount: new Decimal(5),
      },
    ],
    sfl: new Decimal(1),
    constructionSeconds: 60 * 5,
  },
};

type Dimensions = { width: number; height: number };

type Placeables = Record<PlaceableName, Dimensions>;

const flagsDimension = getKeys(FLAGS).reduce(
  (previous, flagName) => ({
    ...previous,
    [flagName]: {
      height: 0,
      width: 0,
    },
  }),
  {} as Record<Flag, Dimensions>
);

export const PLACEABLES_DIMENSIONS: Placeables = {
  // Salesman Items
  "Wicker Man": { height: 1, width: 1 },
  "Golden Bonsai": { height: 1, width: 1 },

  // Flags
  ...flagsDimension,

  // Blacksmith Items
  "Sunflower Statue": { width: 2, height: 2 },
  "Potato Statue": { width: 1, height: 1 },
  "Christmas Tree": { width: 2, height: 2 },
  Gnome: { width: 1, height: 1 },
  "Sunflower Tombstone": { width: 1, height: 1 },
  "Sunflower Rock": { width: 4, height: 3 },
  "Goblin Crown": { width: 1, height: 1 },
  Fountain: { width: 2, height: 2 },
  "Woody the Beaver": { width: 1, height: 1 },
  "Apprentice Beaver": { width: 1, height: 1 },
  "Foreman Beaver": { width: 1, height: 1 },
  "Nyon Statue": { width: 2, height: 1 },
  "Homeless Tent": { width: 2, height: 2 },
  "Farmer Bath": { width: 2, height: 3 },
  "Mysterious Head": { width: 2, height: 1 },
  "Rock Golem": { width: 2, height: 3 },
  "Tunnel Mole": { width: 1, height: 1 },
  "Rocky the Mole": { width: 1, height: 1 },
  Nugget: { width: 1, height: 1 },

  // Market Items
  Scarecrow: { height: 2, width: 2 },
  Nancy: { width: 2, height: 2 },
  Kuebiko: { width: 2, height: 2 },
  "Golden Cauliflower": { width: 1, height: 1 },
  "Mysterious Parsnip": { width: 1, height: 1 },
  "Carrot Sword": { width: 1, height: 1 },

  // Barn Items
  "Farm Cat": { width: 1, height: 1 },
  "Farm Dog": { width: 1, height: 1 },
  "Chicken Coop": { width: 2, height: 2 },
  "Gold Egg": { width: 1, height: 1 },
  "Easter Bunny": { width: 2, height: 1 },
  Rooster: { height: 1, width: 1 },
  "Egg Basket": { height: 1, width: 1 },

  // Buildings
  "Fire Pit": { height: 1, width: 1 },
  Oven: { height: 1, width: 1 },
  Bakery: { height: 3, width: 3 },
  Anvil: { height: 1, width: 1 },
  Workbench: { height: 1, width: 1 },
};
