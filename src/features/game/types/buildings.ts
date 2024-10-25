import Decimal from "decimal.js-light";
import { CollectibleName } from "./craftables";
import { InventoryItemName, IslandType } from "./game";
import { ResourceName } from "./resources";

export type Home = "Tent" | "House" | "Manor";

export type CookingBuildingName =
  | "Fire Pit"
  | "Kitchen"
  | "Bakery"
  | "Deli"
  | "Smoothie Shack";

export type BuildingName =
  | CookingBuildingName
  | "Smoothie Shack"
  | "Market"
  | "Town Center"
  | "Workbench"
  | "Water Well"
  | "Hen House"
  | "Toolshed"
  | "Warehouse"
  | "Compost Bin"
  | "Turbo Composter"
  | "Premium Composter"
  | "Greenhouse"
  | Home
  | "Crop Machine"
  | "Barn"
  | "Crafting Box";

export type Ingredient = {
  item: InventoryItemName;
  amount: Decimal;
};

export type BuildingBluePrint = {
  unlocksAtLevel: number;
  ingredients: Ingredient[];
  coins: number;
  constructionSeconds: number;
  requiredIsland?: IslandType;
};

export type PlaceableName =
  | CollectibleName
  | BuildingName
  | "Chicken"
  | "Bud"
  | ResourceName;

export const UPGRADABLES: Partial<Record<BuildingName, BuildingName>> = {};

export const BUILDINGS: Record<BuildingName, BuildingBluePrint[]> = {
  "Town Center": [
    {
      unlocksAtLevel: 99,
      coins: 0,
      constructionSeconds: 30,
      ingredients: [],
    },
  ],
  House: [
    {
      unlocksAtLevel: 99,
      coins: 0,
      constructionSeconds: 30,
      ingredients: [],
    },
  ],
  Manor: [
    {
      unlocksAtLevel: 99,
      coins: 0,
      constructionSeconds: 30,
      ingredients: [],
    },
  ],
  Market: [
    {
      unlocksAtLevel: 99,
      coins: 0,
      constructionSeconds: 30,
      ingredients: [],
    },
  ],
  "Fire Pit": [
    {
      unlocksAtLevel: 99,
      coins: 0,
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
      coins: 5,
      constructionSeconds: 60 * 1,
      ingredients: [],
    },
  ],
  Tent: [
    {
      unlocksAtLevel: 99,
      coins: 20,
      constructionSeconds: 60 * 60,
      ingredients: [
        {
          item: "Wood",
          amount: new Decimal(50),
        },
      ],
    },
  ],

  "Water Well": [
    {
      unlocksAtLevel: 2,
      coins: 320,
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
      unlocksAtLevel: 4,
      coins: 320,
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
      unlocksAtLevel: 11,
      coins: 320,
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
      unlocksAtLevel: 15,
      coins: 320,
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
      coins: 10,
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

  "Hen House": [
    {
      unlocksAtLevel: 6,
      coins: 100,
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
      unlocksAtLevel: 20,
      coins: 800,
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
  Barn: [
    {
      unlocksAtLevel: 12,
      coins: 200,
      constructionSeconds: 60 * 60 * 2,
      ingredients: [
        {
          item: "Wood",
          amount: new Decimal(150),
        },
        {
          item: "Iron",
          amount: new Decimal(10),
        },
        {
          item: "Gold",
          amount: new Decimal(10),
        },
      ],
    },
  ],
  Bakery: [
    {
      unlocksAtLevel: 8,
      coins: 200,
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
      unlocksAtLevel: 16,
      coins: 300,
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
      unlocksAtLevel: 23,
      coins: 0,
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
      unlocksAtLevel: 25,
      coins: 0,
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
      unlocksAtLevel: 20,
      coins: 0,
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
      ],
    },
  ],
  "Compost Bin": [
    {
      unlocksAtLevel: 7,
      coins: 0,
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
      unlocksAtLevel: 12,
      coins: 0,
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
      coins: 0,
      constructionSeconds: 60 * 60 * 4,
      ingredients: [
        {
          item: "Gold",
          amount: new Decimal(50),
        },
      ],
    },
  ],
  Greenhouse: [
    {
      unlocksAtLevel: 46,
      coins: 4800,
      constructionSeconds: 60 * 60 * 4,
      ingredients: [
        {
          item: "Wood",
          amount: new Decimal(500),
        },
        {
          item: "Stone",
          amount: new Decimal(100),
        },
        {
          item: "Crimstone",
          amount: new Decimal(25),
        },
        {
          item: "Oil",
          amount: new Decimal(100),
        },
      ],
      requiredIsland: "desert",
    },
  ],
  "Crop Machine": [
    {
      unlocksAtLevel: 35,
      coins: 8000,
      constructionSeconds: 60 * 60 * 2,
      ingredients: [
        {
          item: "Wood",
          amount: new Decimal(1250),
        },
        {
          item: "Iron",
          amount: new Decimal(125),
        },
        {
          item: "Crimstone",
          amount: new Decimal(50),
        },
      ],
      requiredIsland: "desert",
    },
  ],
  "Crafting Box": [
    {
      unlocksAtLevel: 6,
      coins: 0,
      constructionSeconds: 60 * 60,
      ingredients: [
        {
          item: "Wood",
          amount: new Decimal(100),
        },
        {
          item: "Stone",
          amount: new Decimal(5),
        },
      ],
    },
  ],
};

export type Dimensions = { width: number; height: number };

export const BUILDINGS_DIMENSIONS: Record<BuildingName, Dimensions> = {
  Market: { width: 3, height: 2 },
  "Fire Pit": { width: 3, height: 2 },
  "Town Center": { width: 4, height: 3 },
  House: { width: 4, height: 4 },
  Manor: { width: 5, height: 4 },
  Workbench: { width: 3, height: 2 },
  Kitchen: { width: 4, height: 3 },
  Bakery: { width: 4, height: 3 },
  "Water Well": { width: 2, height: 2 },
  Tent: { width: 3, height: 2 },
  "Hen House": { width: 4, height: 3 },
  Deli: { width: 4, height: 3 },
  "Smoothie Shack": { width: 3, height: 2 },
  Toolshed: { width: 2, height: 3 },
  Warehouse: { width: 3, height: 2 },
  "Compost Bin": { width: 2, height: 2 },
  "Turbo Composter": { width: 2, height: 2 },
  "Premium Composter": { width: 2, height: 2 },
  Greenhouse: { width: 4, height: 4 },
  "Crop Machine": { width: 5, height: 4 },
  Barn: { width: 4, height: 4 },
  "Crafting Box": { width: 3, height: 2 },
};
