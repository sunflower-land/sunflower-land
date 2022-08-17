import Decimal from "decimal.js-light";
import { BlacksmithItem, BarnItem, MarketItem, Dimensions } from "./craftables";
import { Flag } from "./flags";
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

export const BUILDINGS_DIMENSIONS: Record<BuildingName, Dimensions> = {
  "Fire Pit": { height: 1, width: 1 },
  Oven: { height: 1, width: 1 },
  Bakery: { height: 3, width: 3 },
  Anvil: { height: 1, width: 1 },
  Workbench: { height: 1, width: 1 },
};
