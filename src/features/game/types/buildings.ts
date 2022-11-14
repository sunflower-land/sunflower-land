import Decimal from "decimal.js-light";
import { marketRate } from "../lib/halvening";
import { Dimensions, CollectibleName } from "./craftables";
import { InventoryItemName } from "./game";

export type BuildingName =
  | "Fire Pit"
  | "Market"
  | "Workbench"
  | "Kitchen"
  | "Tent"
  | "Water Well"
  | "Bakery"
  | "Hen House"
  | "Deli";

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

export const UPGRADABLES: Partial<Record<BuildingName, BuildingName>> = {};

export const BUILDINGS: () => Record<BuildingName, BuildingBluePrint> = () => ({
  Market: {
    unlocksAtLevels: [1],
    ingredients: [],
    sfl: new Decimal(0),
    constructionSeconds: 30,
  },
  "Fire Pit": {
    unlocksAtLevels: [1],
    ingredients: [],
    sfl: new Decimal(0),
    constructionSeconds: 30,
  },

  Workbench: {
    unlocksAtLevels: [3],
    ingredients: [],
    sfl: marketRate(5),
    constructionSeconds: 60 * 1,
  },

  "Water Well": {
    unlocksAtLevels: [4, 8, 13, 18],
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
  Kitchen: {
    unlocksAtLevels: [5],
    ingredients: [
      {
        item: "Wood",
        amount: new Decimal(30),
      },
      {
        item: "Stone",
        amount: new Decimal(5),
      },
    ],
    sfl: marketRate(10),
    constructionSeconds: 60 * 30,
  },
  Tent: {
    unlocksAtLevels: [7],
    ingredients: [
      {
        item: "Wood",
        amount: new Decimal(50),
      },
    ],
    sfl: marketRate(50),
    constructionSeconds: 60 * 60,
  },
  "Hen House": {
    unlocksAtLevels: [9],
    ingredients: [
      {
        item: "Wood",
        amount: new Decimal(30),
      },
      {
        item: "Iron",
        amount: new Decimal(5),
      },
      {
        item: "Gold",
        amount: new Decimal(5),
      },
    ],
    sfl: marketRate(100),
    constructionSeconds: 60 * 60 * 2,
  },

  Bakery: {
    unlocksAtLevels: [11],
    ingredients: [
      {
        item: "Wood",
        amount: new Decimal(50),
      },
      {
        item: "Stone",
        amount: new Decimal(20),
      },
      {
        item: "Gold",
        amount: new Decimal(5),
      },
    ],
    sfl: marketRate(200),
    constructionSeconds: 60 * 60 * 4,
  },

  Deli: {
    unlocksAtLevels: [13],
    ingredients: [
      {
        item: "Wood",
        amount: new Decimal(50),
      },
      {
        item: "Stone",
        amount: new Decimal(50),
      },
      {
        item: "Gold",
        amount: new Decimal(10),
      },
    ],
    sfl: marketRate(300),
    constructionSeconds: 60 * 60 * 12,
  },
});

export const BUILDINGS_DIMENSIONS: Record<BuildingName, Dimensions> = {
  Market: { height: 2, width: 3 },
  "Fire Pit": { height: 2, width: 3 },
  Workbench: { height: 2, width: 3 },
  Kitchen: { height: 3, width: 4 },
  Bakery: { height: 3, width: 4 },
  "Water Well": { height: 2, width: 2 },
  Tent: { height: 2, width: 3 },
  "Hen House": { height: 3, width: 4 },
  Deli: { height: 3, width: 4 },
};
