import { Decimal } from "decimal.js-light";

import { CropName, SeedName } from "./crops";
import { CollectibleName, CraftableName, Food, Ingredient } from "./craftables";
import { ResourceName } from "./resources";
import { SkillName } from "./skills";
import { TerrainTypeEnum } from "../lib/getTerrainImageByKey";
import { BuildingName } from "./buildings";
import { GameEvent } from "../events";

export type CropReward = {
  items: {
    name: InventoryItemName;
    amount: number;
  }[];
};

export type Fertiliser = "Rapid Growth";

export const FERTILISERS: Record<Fertiliser, { description: string }> = {
  "Rapid Growth": {
    description: "Apply to a crop to grow twice as fast",
  },
};

export type Fertilisers = {
  name: Fertiliser;
  fertilisedAt: number;
}[];

export type FieldItem = {
  name: CropName;
  // Epoch time in milliseconds
  plantedAt: number;
  multiplier?: number;
  reward?: CropReward;
  fertilisers?: Fertilisers;
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

export type Ticket =
  | "Trading Ticket"
  | "War Bond"
  | "Goblin War Point"
  | "Human War Point";

type WarBanner = "Human War Banner" | "Goblin War Banner";

export interface BumpkinParts {
  body: BumpkinBody;
  hair: BumpkinHair;
  eyes: BumpkinEyes;
  mouth: BumpkinMouth;
  shirt: BumpkinShirt;
  pants: BumpkinPants;
  shoes: BumpkinShoes;
}

export type Bumpkin = {
  id: number;
  level: number;
  equipped: BumpkinParts;
};

export type BumpkinBody =
  | "Beige Farmer Potion"
  | "Light Brown Farmer Potion"
  | "Dark Brown Farmer Potion"
  | "Goblin Potion";

export type BumpkinHair = "Basic Hair" | "Explorer Hair" | "Rancher Hair";

export type BumpkinShirt =
  | "Red Farmer Shirt"
  | "Yellow Farmer Shirt"
  | "Blue Farmer Shirt";
export type BumpkinMouth = "Wide Smile" | "Wide Smile With Teeth";

export type BumpkinPants =
  | "Farmer Overalls"
  | "Lumberjack Overalls"
  | "Farmer Pants";

export type BumpkinEyes =
  | "Rosy Wide Eyes"
  | "Rosy Squinted Eyes"
  | "Rosy Butterfly Eyes";

export type BumpkinShoes = "Black Farmer Boots";

export type BumpkinTools = "Farmer Pitchfork";

export type BumpkinNecklace = "Sunflower Amulet";

export type BumpkinHat = "Farmer Hat";

export type BumpkinSecondaryTool = "Warrior Shield";

export type BumpkinItems =
  | BumpkinBody
  | BumpkinHair
  | BumpkinShirt
  | BumpkinPants
  | BumpkinEyes
  | BumpkinShoes
  | BumpkinMouth
  | BumpkinHat
  | BumpkinNecklace
  | BumpkinTools
  | BumpkinSecondaryTool;

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
  | Ticket
  | BumpkinItems
  | BuildingName
  | Fertiliser
  | WarBanner;

export type Inventory = Partial<Record<InventoryItemName, Decimal>>;

export type Fields = Record<number, FieldItem>;

export type Chicken = {
  fedAt: number;
  multiplier: number;
  reward?: CropReward;
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

export type WarCollectionOffer = {
  warBonds: number;
  startAt: string;
  endAt: string;
  ingredients: {
    name: InventoryItemName;
    amount: number;
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
  reward?: CropReward;
  fertilisers?: Fertilisers;
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

export type PlacedItem = {
  id: string;
  coordinates: { x: number; y: number };
  readyAt: number;
  createdAt: number;
};

export type Buildings = Partial<Record<BuildingName, PlacedItem[]>>;
export type Collectibles = Partial<Record<CollectibleName, PlacedItem[]>>;

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

export type Airdrop = {
  id: string;
  createdAt: number;
  items: Partial<Record<InventoryItemName, number>>;
  sfl: number;
};

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
  airdrops?: Airdrop[];

  warCollectionOffer?: WarCollectionOffer;

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
  bumpkin?: Bumpkin;
  buildings: Buildings;
  collectibles: Collectibles;
}

export interface Context {
  state?: GameState;
  actions: PastAction[];
}
