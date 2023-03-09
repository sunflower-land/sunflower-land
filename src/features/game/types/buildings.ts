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
  | "Deli"
  | "Smoothie Shack"
  | "Toolshed"
  | "Warehouse";

export type Ingredient = {
  item: InventoryItemName;
  amount: Decimal;
};

export type BuildingBluePrint = {
  unlocksAtLevel: number;
  ingredients: Ingredient[];
  sfl: Decimal;
  constructionSeconds: number;
};

export type PlaceableName = CollectibleName | BuildingName | "Chicken";

export const UPGRADABLES: Partial<Record<BuildingName, BuildingName>> = {};

export const BUILDINGS: () => Record<
  BuildingName,
  BuildingBluePrint[]
> = () => ({
  Market: [
    {
      unlocksAtLevel: 1,
      ingredients: [],
      sfl: new Decimal(0),
      constructionSeconds: 30,
    },
  ],
  "Fire Pit": [
    {
      unlocksAtLevel: 1,
      ingredients: [],
      sfl: new Decimal(0),
      constructionSeconds: 30,
    },
  ],
  Workbench: [
    {
      unlocksAtLevel: 3,
      ingredients: [],
      sfl: marketRate(5),
      constructionSeconds: 60 * 1,
    },
  ],
  "Water Well": [
    {
      unlocksAtLevel: 4,
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
    {
      unlocksAtLevel: 8,
      ingredients: [
        { item: "Wood", amount: new Decimal(5) },
        {
          item: "Stone",
          amount: new Decimal(5),
        },
      ],
      sfl: new Decimal(1),
      constructionSeconds: 60 * 5,
    },
    {
      unlocksAtLevel: 13,
      ingredients: [
        { item: "Wood", amount: new Decimal(5) },
        {
          item: "Stone",
          amount: new Decimal(5),
        },
      ],
      sfl: new Decimal(1),
      constructionSeconds: 60 * 5,
    },
    {
      unlocksAtLevel: 18,
      ingredients: [
        { item: "Wood", amount: new Decimal(5) },
        {
          item: "Stone",
          amount: new Decimal(5),
        },
      ],
      sfl: new Decimal(1),
      constructionSeconds: 60 * 5,
    },
  ],
  Kitchen: [
    {
      unlocksAtLevel: 5,
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
  ],
  Tent: [
    {
      unlocksAtLevel: 7,
      ingredients: [
        {
          item: "Wood",
          amount: new Decimal(50),
        },
      ],
      sfl: marketRate(50),
      constructionSeconds: 60 * 60,
    },
  ],
  "Hen House": [
    {
      unlocksAtLevel: 9,
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
    {
      unlocksAtLevel: 21,
      ingredients: [
        {
          item: "Wood",
          amount: new Decimal(200),
        },
        {
          item: "Iron",
          amount: new Decimal(15),
        },
        {
          item: "Gold",
          amount: new Decimal(15),
        },
        {
          item: "Egg",
          amount: new Decimal(300),
        },
      ],
      sfl: marketRate(800),
      constructionSeconds: 60 * 60 * 3,
    },
  ],
  Bakery: [
    {
      unlocksAtLevel: 11,
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
  ],
  Deli: [
    {
      unlocksAtLevel: 13,
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
  ],
  "Smoothie Shack": [
    {
      unlocksAtLevel: 15,
      ingredients: [
        {
          item: "Wood",
          amount: new Decimal(25),
        },
        {
          item: "Stone",
          amount: new Decimal(25),
        },
        {
          item: "Iron",
          amount: new Decimal(10),
        },
      ],
      sfl: new Decimal(0),
      constructionSeconds: 60 * 60 * 12,
    },
  ],
  Toolshed: [
    {
      unlocksAtLevel: 12,
      ingredients: [
        {
          item: "Wood",
          amount: new Decimal(25),
        },
        {
          item: "Stone",
          amount: new Decimal(25),
        },
        {
          item: "Iron",
          amount: new Decimal(10),
        },
      ],
      sfl: new Decimal(0),
      constructionSeconds: 60 * 60 * 12,
    },
  ],
  Warehouse: [
    {
      unlocksAtLevel: 15,
      ingredients: [
        {
          item: "Wood",
          amount: new Decimal(25),
        },
        {
          item: "Stone",
          amount: new Decimal(25),
        },
        {
          item: "Iron",
          amount: new Decimal(10),
        },
      ],
      sfl: new Decimal(0),
      constructionSeconds: 60 * 60 * 12,
    },
  ],
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
  "Smoothie Shack": { height: 2, width: 3 },
  Toolshed: { height: 3, width: 2 },
  Warehouse: { height: 2, width: 3 },
};
