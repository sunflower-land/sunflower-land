import { Decimal } from "decimal.js-light";

import { CropName, CropSeedName } from "./crops";

import { CollectibleName, CraftableName, Food } from "./craftables";
import { CommodityName, MushroomName, ResourceName } from "./resources";
import { SkillName } from "./skills";
import { BuildingName } from "./buildings";
import { GameEvent } from "../events";
import { Equipped as BumpkinParts } from "./bumpkin";
import { ConsumableName, CookableName } from "./consumables";
import { BumpkinSkillName } from "./bumpkinSkills";
import { AchievementName } from "./achievements";
import { BumpkinActivityName } from "./bumpkinActivity";
import { DecorationName } from "./decorations";
import { BeanName, MutantCropName } from "./beans";
import { FruitName, FruitSeedName } from "./fruits";
import { TreasureName } from "./treasure";
import {
  GoblinBlacksmithItemName,
  GoblinPirateItemName,
  HeliosBlacksmithItem,
  SeasonPassName,
} from "./collectibles";
import { AuctioneerItemName } from "./auctioneer";
import { TreasureToolName } from "./tools";
import { Chore } from "./chores";
import { ConversationName } from "./conversations";

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

export const EASTER_EGG: Record<EasterEgg, { description: string }> = {
  "Red Egg": {
    description: "A red easter egg",
  },
  "Orange Egg": {
    description: "An orange easter egg",
  },
  "Green Egg": {
    description: "A green easter egg",
  },
  "Blue Egg": {
    description: "A blue easter egg",
  },
  "Pink Egg": {
    description: "A pink easter egg",
  },
  "Purple Egg": {
    description: "A purple easter egg",
  },
  "Yellow Egg": {
    description: "A yellow easter egg",
  },
};

export const EASTER_EGGS: EasterEgg[] = [
  "Blue Egg",
  "Green Egg",
  "Orange Egg",
  "Pink Egg",
  "Purple Egg",
  "Red Egg",
  "Yellow Egg",
];

export type EasterEventItemName = "Easter Bunny" | "Pablo The Bunny";

export type MOMEventItem = "Engine Core";

export type MutantChicken =
  | "Speed Chicken"
  | "Rich Chicken"
  | "Fat Chicken"
  | "Ayam Cemani";

export type Coupons =
  | "Trading Ticket"
  | "Solar Flare Ticket"
  | "War Bond"
  | "Jack-o-lantern"
  | "Golden Crop"
  | "Beta Pass"
  | "Red Envelope"
  | "Love Letter"
  | "Block Buck"
  | "Dawn Breaker Ticket"
  | "Sunflower Supporter";

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
  "Golden Crop": {
    description: "A shiny golden crop",
  },
  "Beta Pass": {
    description: "Gain early access to features for testing.",
  },
  "Red Envelope": {
    description: "Someone was lucky!",
  },
  "Love Letter": {
    description: "Convey feelings of love",
  },
  "Block Buck": {
    description:
      "A voucher used for restocking and enhancing your Blockchain experience!",
  },
  "Solar Flare Ticket": {
    description: "A ticket used during the Solar Flare Season",
  },
  "Dawn Breaker Ticket": {
    description: "A ticket used during the Dawn Breaker Season",
  },
  "Sunflower Supporter": {
    description: "A community and social media supporter of the project",
  },
};

type Points = "Human War Point" | "Goblin War Point";

type WarBanner = "Human War Banner" | "Goblin War Banner";

export type GoldenCropEventItem = "Golden Crop";

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
  | CommodityName
  | ResourceName
  | SkillName
  | EasterEgg
  | EasterEventItemName
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
  | AuctioneerItemName
  | GoldenCropEventItem
  | TreasureName
  | HeliosBlacksmithItem
  | GoblinBlacksmithItemName
  | GoblinPirateItemName
  | SeasonPassName
  | TreasureToolName
  | LanternName
  | "Basic Land";

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
  name: CookableName;
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
  id?: string;
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
  harvestsLeft: number;
  harvestedAt: number;
};

export type Tree = {
  wood: Wood;
} & Position;

export type Stone = {
  amount: number;
  // Epoch time in milliseconds
  minedAt: number;
};

export type Rock = {
  stone: Stone;
} & Position;

export type CropPlot = {
  crop?: PlantedCrop;
  createdAt: number;
} & Position;

export type FruitPatch = {
  fruit?: PlantedFruit;
} & Position;

export type Mine = Position;

export type BuildingProduct = {
  name: CookableName;
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

type PlacedManeki = PlacedItem & { shakenAt?: number };

// Support custom types for collectibles
type CustomCollectibles = {
  "Maneki Neko": PlacedManeki[];
};

// Mapping to determine which type should be used for a placed collectible
type PlacedTypes<Name extends CollectibleName> = {
  [key in Name]: key extends keyof CustomCollectibles
    ? CustomCollectibles[key]
    : PlacedItem[];
};

export type Collectibles = Partial<PlacedTypes<CollectibleName>>;

export type ExpansionConstruction = {
  createdAt: number;
  readyAt: number;
};

interface ExpansionRequirements {
  resources: Partial<Record<InventoryItemName, number>>;
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

export type TreasureHole = {
  dugAt: number;
  discovered: InventoryItemName | null;
};

export type Bid = {
  sfl: number;
  ingredients: Partial<Record<InventoryItemName, number>>;
  item: AuctioneerItemName;
  bidAt: number;
  auctionTickets: number;
};

export type HayseedHank = {
  choresCompleted: number;
  chore: Chore;
  progress?: {
    bumpkinId: number;
    startedAt: number;
    startCount: number;
  };
};

export type Mushroom = {
  name: MushroomName;
  amount: number;
  x: number;
  y: number;
};

export type Mushrooms = {
  spawnedAt: number;
  mushrooms: Record<string, Mushroom>;
};

export type NPCDialogue = {
  id: string;
  from: "aunt" | "bumpkin" | "betty" | "bruce";
};

export type LanternName =
  | "Luminous Lantern"
  | "Radiance Lantern"
  | "Aurora Lantern";

export type LanternIngredients = Partial<Record<InventoryItemName, Decimal>>;

export type LanternOffering = {
  name: LanternName;
  startAt: string;
  endAt: string;
  sfl?: Decimal;
  ingredients: LanternIngredients;
};

export type LanternsCraftedByWeek = Record<string, number>;

export type DawnBreaker = {
  currentWeek: number;
  availableLantern?: LanternOffering;
  lanternsCraftedByWeek: LanternsCraftedByWeek;
};

export interface GameState {
  id?: number;
  balance: Decimal;
  airdrops?: Airdrop[];
  farmAddress?: string;

  tradedAt?: string;
  tradeOffer?: TradeOffer;
  warCollectionOffer?: WarCollectionOffer;

  chickens: Record<string, Chicken>;
  inventory: Inventory;
  stock: Inventory;
  stockExpiry: StockExpiry;

  // When an item is burnt, what the prize was
  mysteryPrizes: Partial<Record<InventoryItemName, Reveal[]>>;

  trees: Record<string, Tree>;
  stones: Record<string, Rock>;
  gold: Record<string, Rock>;
  iron: Record<string, Rock>;
  crops: Record<string, CropPlot>;
  fruitPatches: Record<string, FruitPatch>;

  expansionConstruction?: ExpansionConstruction;
  expansionRequirements?: ExpansionRequirements;

  bumpkin?: Bumpkin;
  buildings: Buildings;
  collectibles: Collectibles;
  grubShop?: GrubShop;
  grubOrdersFulfilled?: {
    id: string;
    fulfilledAt: number;
  }[];
  treasureIsland?: {
    holes: Record<number, TreasureHole>;
    rareTreasure?: {
      reward?: InventoryItemName;
      discoveredAt: number;
      holeId: number;
    };
    rewardCollectedAt?: number;
  };

  // TODO remove when old events are deleted
  migrated?: boolean;
  metadata?: any[];
  pumpkinPlaza: {
    rewardCollectedAt?: number;
    kickedAt?: number;
    kickedById?: number;
  };
  conversations: ConversationName[];
  mailbox: {
    read: {
      id: string;
      createdAt: number;
    }[];
  };
  dailyRewards: {
    chest?: {
      collectedAt: number;
      code: number;
    };
  };
  auctioneer: {
    bid?: Bid;
  };
  hayseedHank: HayseedHank;
  mushrooms: Mushrooms;
  dawnBreaker?: DawnBreaker;
}

export interface Context {
  state?: GameState;
  actions: PastAction[];
}
