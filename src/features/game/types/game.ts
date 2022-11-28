import { Decimal } from "decimal.js-light";

import { CropName, CropSeedName } from "./crops";
import {
  CollectibleName,
  CraftableName,
  Food,
  GoblinRetreatItemName,
  Ingredient,
} from "./craftables";
import { ResourceName } from "./resources";
import { SkillName } from "./skills";
import { BuildingName } from "./buildings";
import { GameEvent } from "../events";
import { Equipped as BumpkinParts } from "./bumpkin";
import { ConsumableName } from "./consumables";
import { BumpkinSkillName } from "./bumpkinSkills";
import { AchievementName } from "./achievements";
import { BumpkinActivityName } from "./bumpkinActivity";
import { DecorationName } from "./decorations";
import { FruitName } from "features/island/fruit/FruitPatch";
import { BeanName, MutantCropName } from "./beans";
import { FruitSeedName } from "./fruits";

export type Reward = {
  sfl?: Decimal;
  items?: {
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
  reward?: Reward;
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

export type Coupons = "Trading Ticket" | "War Bond" | "Jack-o-lantern";

export const COUPONS: Record<Coupons, { description: string }> = {
  "Trading Ticket": {
    description: "Free Trades! Woohoo!",
  },
  "War Bond": {
    description: "A mark of a true warrior",
  },
  "Jack-o-lantern": {
    description: "A Halloween special event item",
  },
};

type Points = "Human War Point" | "Goblin War Point" | "Player Experience";

type WarBanner = "Human War Banner" | "Goblin War Banner";

export type Bumpkin = {
  id: number;
  equipped: BumpkinParts;
  tokenUri: string;
  experience: number;
  skills: Partial<Record<BumpkinSkillName, number>>;
  achievements?: Partial<Record<AchievementName, number>>;
  activity?: Partial<Record<BumpkinActivityName, number>>;
};

export type SpecialEvent = "Chef Apron" | "Chef Hat";
export type WarItems =
  | "Sunflower Amulet"
  | "Carrot Amulet"
  | "Beetroot Amulet"
  | "Green Amulet"
  | "Warrior Helmet"
  | "Warrior Pants";

export type InventoryItemName =
  | CropName
  | CropSeedName
  | BeanName
  | MutantCropName
  | FruitName
  | FruitSeedName
  | CraftableName
  | ResourceName
  | SkillName
  | EasterEgg
  | EasterBunny
  | Food
  | MOMEventItem
  | MutantChicken
  | Coupons
  | Points
  | WarItems
  | SpecialEvent
  | BuildingName
  | Fertiliser
  | WarBanner
  | ConsumableName
  | DecorationName
  | GoblinRetreatItemName;

export type Inventory = Partial<Record<InventoryItemName, Decimal>>;

export type Fields = Record<number, FieldItem>;

export type Chicken = {
  fedAt?: number;
  multiplier: number;
  reward?: Reward;
  coordinates?: { x: number; y: number };
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

export type GrubShopOrder = {
  id: string;
  name: ConsumableName;
  sfl: Decimal;
};

// TODO - we need to store the opening and closing times for the shop
export type GrubShop = {
  opensAt: number;
  closesAt: number;
  orders: GrubShopOrder[];
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
  reward?: Reward;
};

export type PlantedCrop = {
  name: CropName;
  plantedAt: number;
  amount?: number;
  reward?: Reward;
  fertilisers?: Fertilisers;
};

export type PlantedFruit = {
  name: FruitName;
  plantedAt: number;
  amount: number;
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

export type LandExpansionPlot = {
  crop?: PlantedCrop;
} & Position;

export type FruitPatch = {
  fruit?: PlantedFruit;
} & Position;

export type Mine = Position;

export type BuildingProduct = {
  name: ConsumableName;
  readyAt: number;
};

export type PlacedItem = {
  id: string;
  coordinates: { x: number; y: number };
  readyAt: number;
  createdAt: number;

  crafting?: BuildingProduct;
};

export type Buildings = Partial<Record<BuildingName, PlacedItem[]>>;
export type Collectibles = Partial<Record<CollectibleName, PlacedItem[]>>;

export type LandExpansion = {
  createdAt: number;
  readyAt: number;

  gold?: Record<number, LandExpansionRock>;
  iron?: Record<number, LandExpansionRock>;
  plots?: Record<number, LandExpansionPlot>;
  fruitPatches?: Record<number, FruitPatch>;
  boulders?: Record<number, Mine>;
  trees?: Record<number, LandExpansionTree>;
  stones?: Record<number, LandExpansionRock>;
};

interface ExpansionRequirements {
  sfl: Decimal;
  resources: Ingredient[];
  seconds: number;
  bumpkinLevel: number;
}

export type Airdrop = {
  id: string;
  createdAt: number;
  items: Partial<Record<InventoryItemName, number>>;
  sfl: number;
  message?: string;
};

// Mystery Prize reveals
export type Reveal = {
  revealedAt: number;
  id: string;
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

  plots: Record<number, LandExpansionPlot>;

  tradedAt?: string;
  tradeOffer?: TradeOffer;
  airdrops?: Airdrop[];

  warCollectionOffer?: WarCollectionOffer;

  inventory: Inventory;
  stock: Inventory;
  stockExpiry: StockExpiry;

  // When an item is burnt, what the prize was
  mysteryPrizes: Partial<Record<InventoryItemName, Reveal[]>>;

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
  grubShop?: GrubShop;
  grubOrdersFulfilled?: {
    id: string;
    fulfilledAt: number;
  }[];
  migrated?: boolean;
}

export interface Context {
  state?: GameState;
  actions: PastAction[];
}
