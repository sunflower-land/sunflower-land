import Decimal from "decimal.js-light";
import { CollectibleName } from "./craftables";
import { Inventory, InventoryItemName, IslandType } from "./game";
import { ResourceName } from "./resources";
import { getKeys } from "lib/object";

export type Home = "Tent" | "House" | "Manor" | "Mansion";

export type CookingBuildingName =
  | "Fire Pit"
  | "Kitchen"
  | "Bakery"
  | "Deli"
  | "Smoothie Shack";

export type ProcessingBuildingName = "Fish Market";

export type BuildingName =
  | CookingBuildingName
  | "Town Center"
  | "Market"
  | "Workbench"
  | "Water Well"
  | "Hen House"
  | "Smoothie Shack"
  | "Toolshed"
  | "Warehouse"
  | "Compost Bin"
  | "Turbo Composter"
  | "Premium Composter"
  | "Greenhouse"
  | Home
  | "Crop Machine"
  | "Barn"
  | "Fish Market"
  | "Crafting Box"
  | "Pet House"
  | "Aging Shed";

export type Ingredient = {
  item: InventoryItemName;
  amount: Decimal;
};

export type BuildingBluePrint = {
  unlocksAtLevel: number;
  ingredients: Inventory;
  coins: number;
  constructionSeconds: number;
  requiredIsland?: IslandType;
};

export type PlaceableName =
  | CollectibleName
  | BuildingName
  | "Bud"
  | ResourceName;

export const UPGRADABLES: Partial<Record<BuildingName, BuildingName>> = {};

export const BUILDINGS: Record<BuildingName, BuildingBluePrint> = {
  "Town Center": {
    unlocksAtLevel: Infinity,
    coins: 0,
    constructionSeconds: 30,
    ingredients: {},
  },
  Mansion: {
    unlocksAtLevel: Infinity,
    coins: 0,
    constructionSeconds: 30,
    ingredients: {},
  },
  House: {
    unlocksAtLevel: Infinity,
    coins: 0,
    constructionSeconds: 30,
    ingredients: {},
  },
  Manor: {
    unlocksAtLevel: Infinity,
    coins: 0,
    constructionSeconds: 30,
    ingredients: {},
  },
  Market: {
    unlocksAtLevel: Infinity,
    coins: 0,
    constructionSeconds: 30,
    ingredients: {},
  },
  "Fire Pit": {
    unlocksAtLevel: Infinity,
    coins: 0,
    constructionSeconds: 0,
    ingredients: {
      Wood: new Decimal(3),
      Stone: new Decimal(2),
    },
  },
  Workbench: {
    unlocksAtLevel: Infinity,
    coins: 5,
    constructionSeconds: 60 * 1,
    ingredients: {},
  },
  Tent: {
    unlocksAtLevel: Infinity,
    coins: 20,
    constructionSeconds: 60 * 60,
    ingredients: {
      Wood: new Decimal(50),
    },
  },
  "Water Well": {
    unlocksAtLevel: 2,
    coins: 100,
    constructionSeconds: 60 * 5,
    ingredients: {
      Wood: new Decimal(5),
    },
  },
  Kitchen: {
    unlocksAtLevel: 5,
    coins: 10,
    constructionSeconds: 60 * 30,
    ingredients: {
      Wood: new Decimal(30),
      Stone: new Decimal(5),
    },
  },
  Barn: {
    unlocksAtLevel: 30,
    coins: 200,
    constructionSeconds: 60 * 60 * 2,
    ingredients: {
      Wood: new Decimal(150),
      Iron: new Decimal(10),
      Gold: new Decimal(10),
    },
  },
  "Fish Market": {
    unlocksAtLevel: 10,
    coins: 0,
    constructionSeconds: 60 * 60,
    ingredients: {
      Wood: new Decimal(50),
      Iron: new Decimal(10),
      Gold: new Decimal(5),
    },
  },
  "Hen House": {
    unlocksAtLevel: 6,
    coins: 100,
    constructionSeconds: 60 * 60 * 2,
    ingredients: {
      Wood: new Decimal(30),
      Iron: new Decimal(5),
      Gold: new Decimal(5),
    },
  },
  Bakery: {
    unlocksAtLevel: 8,
    coins: 200,
    constructionSeconds: 60 * 60 * 4,
    ingredients: {
      Wood: new Decimal(50),
      Stone: new Decimal(20),
      Gold: new Decimal(5),
    },
  },
  Deli: {
    unlocksAtLevel: 16,
    coins: 300,
    constructionSeconds: 60 * 60 * 12,
    ingredients: {
      Wood: new Decimal(50),
      Stone: new Decimal(50),
      Gold: new Decimal(10),
    },
  },
  "Smoothie Shack": {
    unlocksAtLevel: 23,
    coins: 0,
    constructionSeconds: 60 * 60 * 12,
    ingredients: {
      Wood: new Decimal(25),
      Stone: new Decimal(25),
      Iron: new Decimal(10),
    },
  },
  Toolshed: {
    unlocksAtLevel: 25,
    coins: 0,
    constructionSeconds: 60 * 60 * 2,
    ingredients: {
      Wood: new Decimal(500),
      Iron: new Decimal(30),
      Gold: new Decimal(25),
      Axe: new Decimal(100),
      Pickaxe: new Decimal(50),
    },
  },
  Warehouse: {
    unlocksAtLevel: 20,
    coins: 0,
    constructionSeconds: 60 * 60 * 2,
    ingredients: {
      Wood: new Decimal(250),
      Stone: new Decimal(150),
      Potato: new Decimal(5000),
      Pumpkin: new Decimal(2000),
      Wheat: new Decimal(500),
      Kale: new Decimal(100),
    },
  },
  "Compost Bin": {
    unlocksAtLevel: 7,
    coins: 0,
    constructionSeconds: 60 * 60,
    ingredients: {
      Wood: new Decimal(5),
      Stone: new Decimal(5),
    },
  },
  "Turbo Composter": {
    unlocksAtLevel: 12,
    coins: 0,
    constructionSeconds: 60 * 60 * 2,
    ingredients: {
      Wood: new Decimal(50),
      Stone: new Decimal(25),
    },
  },
  "Premium Composter": {
    unlocksAtLevel: 18,
    coins: 0,
    constructionSeconds: 60 * 60 * 4,
    ingredients: {
      Gold: new Decimal(50),
    },
  },
  Greenhouse: {
    unlocksAtLevel: 46,
    coins: 4800,
    constructionSeconds: 60 * 60 * 4,
    ingredients: {
      Wood: new Decimal(500),
      Stone: new Decimal(100),
      Crimstone: new Decimal(25),
      Oil: new Decimal(100),
    },
    requiredIsland: "desert",
  },
  "Crop Machine": {
    unlocksAtLevel: 35,
    coins: 8000,
    constructionSeconds: 60 * 60 * 2,
    ingredients: {
      Wood: new Decimal(1250),
      Iron: new Decimal(125),
      Crimstone: new Decimal(50),
    },
    requiredIsland: "desert",
  },
  "Crafting Box": {
    unlocksAtLevel: 6,
    coins: 0,
    constructionSeconds: 60 * 60,
    ingredients: {
      Wood: new Decimal(100),
      Stone: new Decimal(5),
    },
  },
  "Pet House": {
    unlocksAtLevel: 0,
    ingredients: {
      Wood: new Decimal(200),
      Stone: new Decimal(100),
    },
    coins: 5000,
    constructionSeconds: 2 * 60 * 60,
  },
  "Aging Shed": {
    unlocksAtLevel: 0,
    coins: 200,
    constructionSeconds: 0,
    ingredients: {
      Wood: new Decimal(30),
    },
  },
};

export type Dimensions = { width: number; height: number };

export const BUILDINGS_DIMENSIONS: Record<BuildingName, Dimensions> = {
  "Town Center": { width: 4, height: 3 },
  Market: { width: 3, height: 2 },
  "Fire Pit": { width: 3, height: 2 },
  House: { width: 4, height: 4 },
  Manor: { width: 5, height: 4 },
  Mansion: { width: 6, height: 5 },
  Workbench: { width: 3, height: 2 },
  Kitchen: { width: 4, height: 3 },
  Bakery: { width: 4, height: 3 },
  "Water Well": { width: 2, height: 2 },
  Tent: { width: 3, height: 2 },
  "Hen House": { width: 4, height: 3 },
  Deli: { width: 4, height: 3 },
  "Smoothie Shack": { width: 3, height: 2 },
  Toolshed: { width: 2, height: 2 },
  Warehouse: { width: 3, height: 2 },
  "Compost Bin": { width: 2, height: 2 },
  "Turbo Composter": { width: 2, height: 2 },
  "Premium Composter": { width: 2, height: 2 },
  Greenhouse: { width: 4, height: 4 },
  "Crop Machine": { width: 5, height: 4 },
  Barn: { width: 4, height: 4 },
  "Fish Market": { width: 3, height: 3 },
  "Crafting Box": { width: 3, height: 2 },
  "Pet House": { width: 3, height: 3 },
  "Aging Shed": { width: 3, height: 2 },
};

export function getUnlockedBuildings(level: number): BuildingName[] {
  return getKeys(BUILDINGS).filter((building) => {
    const buildingBluePrint = BUILDINGS[building];

    return (
      buildingBluePrint.unlocksAtLevel === Infinity ||
      buildingBluePrint.unlocksAtLevel <= level
    );
  });
}

export const FOOD_PROCESSING_BUILDINGS: ProcessingBuildingName[] = [
  "Fish Market",
];

export const isProcessingBuilding = (
  buildingName: BuildingName,
): buildingName is ProcessingBuildingName => {
  return FOOD_PROCESSING_BUILDINGS.includes(
    buildingName as ProcessingBuildingName,
  );
};
