import Decimal from "decimal.js-light";
import { Dimensions, CollectibleName } from "./craftables";
import { InventoryItemName } from "./game";

export type BuildingName =
  | "Fire Pit"
  | "Market"
  | "Oven"
  | "Bakery"
  | "Blacksmith"
  | "Workbench"
  | "Tent"
  | "Water Well"
  | "Chicken House";

export type BuildingBluePrint = {
  unlocksAtLevels: number[];
  ingredients: {
    item: InventoryItemName;
    amount: Decimal;
  }[];
  sfl: Decimal;
  constructionSeconds: number;
};

export type PlaceableName = CollectibleName | BuildingName | "Chicken";

export const UPGRADABLES: Partial<Record<BuildingName, BuildingName>> = {
  "Fire Pit": "Oven",
  Blacksmith: "Workbench",
};

export const BUILDINGS: Record<BuildingName, BuildingBluePrint> = {
  Market: {
    unlocksAtLevels: [1],
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
  "Fire Pit": {
    unlocksAtLevels: [1],
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
    unlocksAtLevels: [2],
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
    unlocksAtLevels: [2],
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
  Blacksmith: {
    unlocksAtLevels: [1],
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
    unlocksAtLevels: [2],
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
  Tent: {
    unlocksAtLevels: [2],
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
  "Water Well": {
    unlocksAtLevels: [2, 5, 8, 11, 15, 18, 21, 24],
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
  "Chicken House": {
    unlocksAtLevels: [1],
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
};

export const BUILDINGS_DIMENSIONS: Record<BuildingName, Dimensions> = {
  Market: { height: 2, width: 3 },
  "Fire Pit": { height: 2, width: 3 },
  Blacksmith: { height: 2, width: 3 },
  Oven: { height: 1, width: 1 },
  Bakery: { height: 3, width: 3 },
  Workbench: { height: 1, width: 1 },
  "Water Well": { height: 2, width: 2 },
  Tent: { height: 2, width: 3 },
  "Chicken House": { height: 2, width: 2 },
};
