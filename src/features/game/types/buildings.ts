import Decimal from "decimal.js-light";
import { marketRate } from "../lib/halvening";
import { CollectibleName } from "./craftables";
import { InventoryItemName } from "./game";
import { ResourceName } from "./resources";

export type BuildingName =
  | "Fire Pit"
  | "Market"
  | "Town Center"
  | "Workbench"
  | "Kitchen"
  | "Tent"
  | "Water Well"
  | "Bakery"
  | "Hen House"
  | "Deli"
  | "Smoothie Shack"
  | "Toolshed"
  | "Warehouse"
  | "Compost Bin"
  | "Turbo Composter"
  | "Premium Composter";

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

export type PlaceableName =
  | CollectibleName
  | BuildingName
  | "Chicken"
  | "Bud"
  | ResourceName;

export const UPGRADABLES: Partial<Record<BuildingName, BuildingName>> = {};

export const BUILDINGS: () => Record<
  BuildingName,
  BuildingBluePrint[]
> = () => ({
  "Town Center": [
    {
      unlocksAtLevel: 99,
      sfl: new Decimal(0),
      constructionSeconds: 30,
      ingredients: [],
    },
  ],
  Market: [
    {
      unlocksAtLevel: 99,
      sfl: new Decimal(0),
      constructionSeconds: 30,
      ingredients: [],
    },
  ],
  "Fire Pit": [
    {
      unlocksAtLevel: 99,
      sfl: new Decimal(0),
      constructionSeconds: 0,
      ingredients: [
        { 
          item: "Wood",
          amount: new Decimal(3),
        },
        { 
          item: "Stone", 
        amount: new Decimal(2),
        },
      ],
    },
  ],
  Workbench: [
    {
      unlocksAtLevel: 99,
      sfl: marketRate(5),
      constructionSeconds: 60 * 1,
      ingredients: [],
    },
  ],
  "Water Well": [
    {
      unlocksAtLevel: 4,
      sfl: new Decimal(1),
      constructionSeconds: 60 * 5,
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
    },
    {
      unlocksAtLevel: 6,
      sfl: new Decimal(1),
      constructionSeconds: 60 * 5,
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
    },
    {
      unlocksAtLevel: 10,
      sfl: new Decimal(1),
      constructionSeconds: 60 * 5,
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
    },
    {
      unlocksAtLevel: 12,
      sfl: new Decimal(1),
      constructionSeconds: 60 * 5,
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
    },
  ],
  Kitchen: [
    {
      unlocksAtLevel: 5,
      sfl: marketRate(10),
      constructionSeconds: 60 * 30,      
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
    },
  ],
  Tent: [
    {
      unlocksAtLevel: 9,
      sfl: marketRate(0.06255),
      constructionSeconds: 60 * 60,
      ingredients: [
        { 
          item: "Wood",
          amount: new Decimal(50),
        },
      ],
    },
  ],
  "Hen House": [
    {
      unlocksAtLevel: 7,
      sfl: marketRate(100),
      constructionSeconds: 60 * 60 * 2,
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
    },
    {
      unlocksAtLevel: 13,
      sfl: marketRate(800),
      constructionSeconds: 60 * 60 * 3,
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
    },
  ],
  Bakery: [
    {
      unlocksAtLevel: 8,
      sfl: marketRate(200),
      constructionSeconds: 60 * 60 * 4,
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
    },
  ],
  Deli: [
    {
      unlocksAtLevel: 12,
      sfl: marketRate(300),
      constructionSeconds: 60 * 60 * 12,
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
    },
  ],
  "Smoothie Shack": [
    {
      unlocksAtLevel: 14,
      sfl: new Decimal(0),
      constructionSeconds: 60 * 60 * 12,
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
    },
  ],

  Toolshed: [
    {
      unlocksAtLevel: 15,
      sfl: new Decimal(0),
      constructionSeconds: 60 * 60 * 2,
      ingredients: [
        { 
          item: "Wood",
          amount: new Decimal(500),
        },
        { 
          item: "Iron",
          amount: new Decimal(30),
        },
        {
          item: "Gold",
          amount: new Decimal(25),
        },
        { 
          item: "Axe", 
         amount: new Decimal(100),
        },
        { 
          item: "Pickaxe",
          amount: new Decimal(50),
        },
      ],
    },
  ],
  Warehouse: [
    {
      unlocksAtLevel: 14,
      sfl: new Decimal(0),
      constructionSeconds: 60 * 60 * 2,
      ingredients: [
        {
          item: "Wood",
          amount: new Decimal(250),
        },
        { 
          item: "Stone",
          amount: new Decimal(150),
        },
        { 
          item: "Potato",
          amount: new Decimal(5000),
        },
        { 
          item: "Pumpkin", 
         amount: new Decimal(2000),
        },
        { 
          item: "Wheat",
          amount: new Decimal(500),
        },
        { 
          item: "Kale",
          amount: new Decimal(100),
        },
      ]
    },
  ],
  "Compost Bin": [
    {
      unlocksAtLevel: 6,
      sfl: marketRate(0),
      constructionSeconds: 60 * 60,
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
    },
  ],
  "Turbo Composter": [
    {
      unlocksAtLevel: 10,
      sfl: marketRate(0),
      constructionSeconds: 60 * 60 * 2,
      ingredients: [
        { 
          item: "Wood",
          amount: new Decimal(50),
        },
        { 
          item: "Stone",
          amount: new Decimal(25),
        },
      ],
    },
  ],
  "Premium Composter": [
    {
      unlocksAtLevel: 18,
      sfl: marketRate(0),
      constructionSeconds: 60 * 60 * 4,
      ingredients: [
        { 
          item: "Gold",
          amount: new Decimal(50),
        },
      ],
    },
  ],
});

export type Dimensions = { width: number; height: number };

export const BUILDINGS_DIMENSIONS: Record<BuildingName, Dimensions> = {
  Market: { height: 2, width: 3 },
  "Fire Pit": { height: 2, width: 3 },
  "Town Center": { height: 3, width: 4 },
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
  "Compost Bin": { height: 2, width: 2 },
  "Turbo Composter": { height: 2, width: 2 },
  "Premium Composter": { height: 2, width: 2 },
};
