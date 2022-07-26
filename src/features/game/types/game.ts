import { Decimal } from "decimal.js-light";
import { GameEvent } from "../events";

import { CropName, SeedName } from "./crops";
import { CraftableName, Food, Ingredient } from "./craftables";
import { ResourceName } from "./resources";
import { SkillName } from "./skills";
import { TerrainTypeEnum } from "../lib/getTerrainImageByKey";

export type Reward = {
  items: {
    name: InventoryItemName;
    amount: number;
  }[];
};

export type FieldItem = {
  name: CropName;
  // Epoch time in milliseconds
  plantedAt: number;
  multiplier?: number;
  reward?: Reward;
};

export type Tree = {
  wood: Decimal;
  // Epoch time in milliseconds
  choppedAt: number;
} & Position;

export type Rock = {
  amount: Decimal;
  // Epoch time in milliseconds
  minedAt: number;
};

export type ChickenPosition = {
  top: number;
  right: number;
};

export type EasterEgg =
  | "Red Egg"
  | "Orange Egg"
  | "Green Egg"
  | "Blue Egg"
  | "Pink Egg"
  | "Purple Egg"
  | "Yellow Egg";

export const EASTER_EGGS: EasterEgg[] = [
  "Blue Egg",
  "Green Egg",
  "Orange Egg",
  "Pink Egg",
  "Purple Egg",
  "Red Egg",
  "Yellow Egg",
];

export type EasterBunny = "Easter Bunny";

export type MOMEventItem = "Engine Core";

export type MutantChicken = "Speed Chicken" | "Rich Chicken" | "Fat Chicken";

export type TradingTicket = "Trading Ticket";
export type BumpkinBodies =
  | "Farmer Potion"
  | "Farmer Potion 2"
  | "Goblin Potion";

export type BumpkinWigs = "Basic Wig" | "Rancher Wig" | "Explorer Wig";

export type BumpkinShirts = "Farmer Shirt" | "Lumberjack Shirt";

export type BumpkinPants =
  | "Farmer Overalls"
  | "Lumberjack Overalls"
  | "Farmer Pants";

export type BumpkinItems =
  | BumpkinBodies
  | BumpkinWigs
  | BumpkinShirts
  | BumpkinPants;

export type InventoryItemName =
  | CropName
  | SeedName
  | CraftableName
  | ResourceName
  | SkillName
  | EasterEgg
  | EasterBunny
  | Food
  | MOMEventItem
  | MutantChicken
  | TradingTicket
  | BumpkinItems;

export type Inventory = Partial<Record<InventoryItemName, Decimal>>;

export type Fields = Record<number, FieldItem>;

export type Chicken = {
  fedAt: number;
  multiplier: number;
  reward?: Reward;
};

export type StockExpiry = Partial<Record<InventoryItemName, string>>;

type PastAction = GameEvent & {
  createdAt: Date;
};

export type TradeOffer = {
  name: InventoryItemName;
  amount: number;
  startAt: string;
  endAt: string;
  ingredients: {
    name: InventoryItemName;
    amount: Decimal;
  }[];
};

export type Position = {
  x: number;
  y: number;
  height: number;
  width: number;
};
export type Wood = {
  amount: number;
  choppedAt: number;
};

export type PlantedCrop = {
  name: CropName;
  plantedAt: number;
  amount?: number;
  reward?: Reward;
};

export type LandExpansionTree = {
  wood: Wood;
} & Position;

export type Stone = {
  amount: number;
  // Epoch time in milliseconds
  minedAt: number;
};

export type LandExpansionRock = {
  stone: Stone;
} & Position;

export type LandExpansionTerrain = {
  name: TerrainTypeEnum;
} & Position;

export type LandExpansionPlot = {
  crop?: PlantedCrop;
} & Position;

export type LandExpansion = {
  createdAt: number;
  readyAt: number;

  shrubs?: Record<number, LandExpansionTree>;
  pebbles?: Record<number, LandExpansionRock>;
  terrains?: Record<number, LandExpansionTerrain>;
  plots?: Record<number, LandExpansionPlot>;
  trees?: Record<number, LandExpansionTree>;
  stones?: Record<number, LandExpansionRock>;
};

interface ExpansionRequirements {
  sfl: Decimal;
  resources: Ingredient[];
  seconds: Decimal;
}
export interface GameState {
  id?: number;
  balance: Decimal;
  fields: Fields;

  trees: Record<number, Tree>;
  stones: Record<number, Rock>;
  iron: Record<number, Rock>;
  gold: Record<number, Rock>;
  chickens: Record<number, Chicken>;

  shrubs: Record<number, LandExpansionTree>;
  pebbles: Record<number, LandExpansionRock>;
  terrains: Record<number, LandExpansionTerrain>;
  plots: Record<number, LandExpansionPlot>;

  tradedAt?: string;
  tradeOffer?: TradeOffer;

  inventory: Inventory;
  stock: Inventory;
  stockExpiry: StockExpiry;

  farmAddress?: string;

  skills: {
    farming: Decimal;
    gathering: Decimal;
  };

  expansions: LandExpansion[];
  expansionRequirements?: ExpansionRequirements;
}

export interface Context {
  state?: GameState;
  actions: PastAction[];
}
