import { Decimal } from "decimal.js-light";

import { CropName, CropSeedName } from "./crops";

import { CollectibleName, CraftableName, Food } from "./craftables";
import { CommodityName, MushroomName, ResourceName } from "./resources";
import { SkillName } from "./skills";
import { BuildingName } from "./buildings";
import { GameEvent } from "../events";
import { BumpkinItem, Equipped as BumpkinParts } from "./bumpkin";
import { ConsumableName, CookableName } from "./consumables";
import { BumpkinSkillName } from "./bumpkinSkills";
import { AchievementName } from "./achievements";
import { BumpkinActivityName } from "./bumpkinActivity";
import { DecorationName } from "./decorations";
import { BeanName, ExoticCropName, MutantCropName } from "./beans";
import { FruitName, FruitSeedName } from "./fruits";
import { TreasureName } from "./treasure";
import {
  GoblinBlacksmithItemName,
  GoblinPirateItemName,
  HeliosBlacksmithItem,
  PotionHouseItemName,
  PurchasableItems,
  SoldOutCollectibleName,
} from "./collectibles";
import { TreasureToolName } from "./tools";
import { Chore } from "./chores";
import { ConversationName } from "./conversations";
import { NPCName } from "lib/npcs";
import { SeasonalTicket } from "./seasons";
import { Bud } from "./buds";
import { CompostName, CropCompostName, FruitCompostName } from "./composters";
import { FarmActivityName } from "./farmActivity";
import { MilestoneName } from "./milestones";
import {
  FishName,
  FishingBait,
  FishingConditions,
  MarineMarvelName,
} from "./fishing";
import { Coordinates } from "../expansion/components/MapPlacement";
import { PortalName } from "./portals";

export type Reward = {
  sfl?: Decimal;
  items?: {
    name: InventoryItemName;
    amount: number;
  }[];
};

export type FertiliserName = "Rapid Growth";

export const FERTILISERS: Record<FertiliserName, { description: string }> = {
  "Rapid Growth": {
    description: "Apply to a crop to grow twice as fast",
  },
};

export type CropFertiliser = {
  name: CropCompostName;
  fertilisedAt: number;
};

export type FruitFertiliser = {
  name: FruitCompostName;
  fertilisedAt: number;
};

export type FieldItem = {
  name: CropName;
  // Epoch time in milliseconds
  plantedAt: number;
  multiplier?: number;
  reward?: Reward;
  fertiliser?: CropFertiliser;
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
  | "Ayam Cemani"
  | "El Pollo Veloz"
  | "Banana Chicken";

export type Coupons =
  | "Gold Pass"
  | "Trading Ticket"
  | "War Bond"
  | "Jack-o-lantern"
  | "Golden Crop"
  | "Beta Pass"
  | "Red Envelope"
  | "Love Letter"
  | "Block Buck"
  | "Sunflower Supporter"
  | "Potion Ticket"
  | "Bud Ticket"
  | "Bud Seedling"
  | "Community Coin"
  | "Arcade Token"
  | "Farmhand Coupon"
  | "Farmhand"
  | SeasonalTicket;

export const COUPONS: Record<Coupons, { description: string }> = {
  "Gold Pass": {
    description:
      "An exclusive pass that enables the holder to craft rare NFTs, trade, withdraw and access bonus content.",
  },
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
    description: "A valuable token in Sunflower Land!",
  },
  "Solar Flare Ticket": {
    description: "A ticket used during the Solar Flare Season",
  },
  "Dawn Breaker Ticket": {
    description: "A ticket used during the Dawn Breaker Season",
  },
  "Crow Feather": {
    description: "A ticket used during the Witches' Eve Season",
  },
  "Sunflower Supporter": {
    description: "A community and social media supporter of the project",
  },
  "Potion Ticket": {
    description:
      "A reward from the Potion House. Use this to buy items from Garth.",
  },
  "Bud Ticket": {
    description:
      "A guaranteed spot to mint a Bud at the Sunflower Land Buds NFT drop.",
  },
  "Bud Seedling": {
    description: "A seedling to be exchanged for a free Bud NFT",
  },
  "Mermaid Scale": {
    description: "A ticket used during the Catch the Kraken Season",
  },
  "Community Coin": {
    description: "A valued coin that can be exchanged for rewards",
  },
  "Arcade Token": {
    description:
      "A token earned from mini-games and adventures. Can be exchanged for rewards.",
  },
  "Farmhand Coupon": {
    description: "A coupon to exchange for a farm hand of your choice.",
  },
  Farmhand: {
    description: "An adopted Bumpkin on your farm",
  },
};

export type Points = "Human War Point" | "Goblin War Point";

export type WarBanner = "Human War Banner" | "Goblin War Banner";

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
  | FertiliserName
  | WarBanner
  | ConsumableName
  | DecorationName
  | GoldenCropEventItem
  | TreasureName
  | HeliosBlacksmithItem
  | SoldOutCollectibleName
  | GoblinBlacksmithItemName
  | GoblinPirateItemName
  | PurchasableItems
  | TreasureToolName
  | LanternName
  | ExoticCropName
  | PotionHouseItemName
  | "Basic Land"
  | FishingBait
  | CompostName
  | FishName
  | MarineMarvelName;

export type Inventory = Partial<Record<InventoryItemName, Decimal>>;

export type Wardrobe = Partial<Record<BumpkinItem, number>>;

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

export interface CurrentObsession {
  type: "collectible" | "wearable";
  name: InventoryItemName | BumpkinItem;
  startDate: number;
  endDate: number;
  reward: number;
}

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
  fertiliser?: CropFertiliser;
  createdAt: number;
} & Position;

export type FruitPatch = {
  fruit?: PlantedFruit;
  fertiliser?: FruitFertiliser;
} & Position;

export type Mine = Position;

export type BuildingProduct = {
  name: CookableName;
  readyAt: number;
};

export type BuildingProduce = {
  items: Partial<Record<InventoryItemName, number>>;
  startedAt: number;
  readyAt: number;
};

export type PlacedItem = {
  id: string;
  coordinates: { x: number; y: number };
  readyAt: number;
  createdAt: number;

  crafting?: BuildingProduct;
};

type ShakeItem = PlacedItem & { shakenAt?: number };
export type PlacedLamp = PlacedItem & { rubbedCount?: number };

// Support custom types for collectibles
type CustomCollectibles = {
  "Maneki Neko": ShakeItem[];
  "Festive Tree": ShakeItem[];
  "Genie Lamp": PlacedLamp[];
};

// Mapping to determine which type should be used for a placed collectible
type PlacedTypes<Name extends CollectibleName> = {
  [key in Name]: key extends keyof CustomCollectibles
    ? CustomCollectibles[key]
    : PlacedItem[];
};

export type Collectibles = Partial<PlacedTypes<CollectibleName>>;

export type CompostBuilding = PlacedItem & {
  producing?: BuildingProduce;
  requires?: Partial<Record<InventoryItemName, number>>;
  boost?: Partial<Record<InventoryItemName, number>>;
};

type CustomBuildings = {
  "Compost Bin": CompostBuilding[];
  "Turbo Composter": CompostBuilding[];
  "Premium Composter": CompostBuilding[];
};

type PlacedBuildings<Name extends BuildingName> = {
  [key in Name]: key extends keyof CustomBuildings
    ? CustomBuildings[key]
    : PlacedItem[];
};

export type Buildings = Partial<PlacedBuildings<BuildingName>>;

export type ExpansionConstruction = {
  createdAt: number;
  readyAt: number;
};

export interface ExpansionRequirements {
  resources: Partial<Record<InventoryItemName, number>>;
  seconds: number;
  bumpkinLevel: number;
}

export type Airdrop = {
  id: string;
  createdAt: number;
  items: Partial<Record<InventoryItemName, number>>;
  wearables: Partial<Record<BumpkinItem, number>>;
  sfl: number;
  message?: string;
  coordinates?: Coordinates;
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
  auctionId: string;
  sfl: number;
  ingredients: Partial<Record<InventoryItemName, number>>;
  collectible?: InventoryItemName;
  wearable?: BumpkinItem;
  type: "collectible" | "wearable";
  biddedAt: number;
  tickets: number;
};

export type HayseedHank = {
  choresCompleted: number;
  dawnBreakerChoresCompleted?: number;
  dawnBreakerChoresSkipped?: number;
  chore: Chore;
  progress?: {
    bumpkinId: number;
    startedAt: number;
    startCount: number;
  };
};

export type MazeAttempts = Partial<Record<SeasonWeek, MazeMetadata>>;

export type WitchesEve = {
  weeklyLostCrowCount: number;
  maze: MazeAttempts;
};

export type CatchTheKraken = {
  weeklyCatches: Partial<Record<SeasonWeek, number>>;
  hunger: InventoryItemName;
};

export type FarmHand = {
  equipped: BumpkinParts;
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
  | "Aurora Lantern"
  | "Ocean Lantern"
  | "Solar Lantern"
  | "Goblin Lantern"
  | "Betty Lantern"
  | "Bumpkin Lantern";

export type Party = {
  fulfilledAt?: number;
  fulfilledCount?: number;
  requirements?: Partial<Record<InventoryItemName, number>>;
};

export type Order = {
  id: string;
  from: NPCName;
  items: Partial<Record<InventoryItemName | "sfl", number>>;
  reward: {
    tickets?: number;
    sfl?: number;
    items?: Partial<Record<InventoryItemName, number>>;
  };
  createdAt: number;
  readyAt: number;
  completedAt?: number;
};

type QuestNPCName =
  | "pumpkin' pete"
  | "bert"
  | "raven"
  | "timmy"
  | "tywin"
  | "cornwell";

export type Quest = Order & {
  from: QuestNPCName;
};

export type Delivery = {
  orders: (Order | Quest)[];
  fulfilledCount: number;
  skippedCount?: number;
  skippedAt?: number;

  milestone: {
    goal: number;
    total: number;
    claimedAt?: number;
  };
};

export type DailyRewards = {
  streaks?: number;
  chest?: {
    collectedAt: number;
    code: number;
  };
};

export type PotionName =
  | "Bloom Boost"
  | "Happy Hooch"
  | "Earth Essence"
  | "Flower Power"
  | "Organic Oasis"
  | "Dream Drip"
  | "Silver Syrup";

export type PotionStatus =
  | "pending"
  | "incorrect"
  | "correct"
  | "almost"
  | "bomb";

export type PotionSlot = { potion: PotionName; status: PotionStatus };

export type Attempt = [PotionSlot, PotionSlot, PotionSlot, PotionSlot];

export type PotionHouse = {
  game: {
    status: "in_progress" | "finished";
    attempts: Attempt[];
    reward?: number;
  };
  history: {
    [score: number]: number;
  };
};

export type NPCS = Partial<Record<NPCName, NPCData>>;

export type NPCData = {
  deliveryCount: number;
  questCompletedAt?: number;
};

export type ChoreV2 = {
  activity: BumpkinActivityName;
  description: string;
  createdAt: number;
  completedAt?: number;
  requirement: number;
  bumpkinId: number;
  startCount: number;
  tickets: number;
};

export type SeasonWeek = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;

export type MazeAttempt = {
  startedAt: number;
  completedAt?: number;
  crowsFound: number;
  health: number;
  time: number;
  crowIds?: string[];
};

export type MazeMetadata = {
  sflFee: number;
  paidEntryFee: boolean;
  highestScore: number;
  claimedFeathers: number;
  attempts: MazeAttempt[];
};

export enum ChoreV2Name {
  EASY_1 = 1,
  EASY_2,
  MEDIUM_1,
  MEDIUM_2,
  HARD_1,
}

export type ChoresV2 = {
  chores: Record<ChoreV2Name, ChoreV2>;
  choresCompleted: number;
  choresSkipped: number;
};

export type CommunityIsland = {
  metadata: string;
  updatedAt: number;
  mints?: {
    items: Partial<Record<InventoryItemName, number>>;
    wearables: Wardrobe;
  };
  burns?: {
    sfl: number;
    items: Partial<Record<InventoryItemName, number>>;
  };
};

export type Portal = {
  arcadeTokensMinted: number;

  history: Record<
    string,
    {
      arcadeTokensMinted: number;
    }
  >;
};

export type TradeListing = {
  items: Partial<Record<InventoryItemName, number>>;
  sfl: number;
  createdAt: number;
  boughtAt?: number;
  buyerId?: number;
};

type FishingSpot = {
  castedAt?: number;
  bait?: FishingBait;
  chum?: InventoryItemName;
  caught?: Partial<Record<InventoryItemName, number>>;
};

export type Fishing = {
  weather: FishingConditions;
  wharf: FishingSpot;
  beach: FishingSpot;
  dailyAttempts?: {
    [date: string]: number;
  };
};

export type Christmas = {
  day: Record<
    number,
    {
      candy: number;
      collectedAt: number;
    }
  >;
};

export type IslandType = "basic" | "spring";

export type Home = {
  collectibles: Collectibles;
};

export interface GameState {
  home: Home;

  island: {
    type: IslandType;
    upgradedAt?: number;
  };

  username?: string;
  balance: Decimal;
  previousBalance: Decimal;
  airdrops?: Airdrop[];

  createdAt: number;

  tradedAt?: string;
  tradeOffer?: TradeOffer;
  bertObsession?: CurrentObsession;
  bertObsessionCompletedAt?: Date;
  warCollectionOffer?: WarCollectionOffer;

  islands?: Record<string, CommunityIsland>;
  portals?: Partial<Record<PortalName, Portal>>;

  farmHands: {
    bumpkins: Record<string, FarmHand>;
  };

  chickens: Record<string, Chicken>;
  inventory: Inventory;
  previousInventory: Inventory;
  wardrobe: Wardrobe;
  stock: Inventory;
  stockExpiry: StockExpiry;

  // When an item is burnt, what the prize was
  mysteryPrizes: Partial<Record<InventoryItemName, Reveal[]>>;

  trees: Record<string, Tree>;
  stones: Record<string, Rock>;
  gold: Record<string, Rock>;
  iron: Record<string, Rock>;
  rubies: Record<string, Rock>;
  crops: Record<string, CropPlot>;
  fruitPatches: Record<string, FruitPatch>;
  fishing: Fishing;
  farmActivity: Partial<Record<FarmActivityName, number>>;
  milestones: Partial<Record<MilestoneName, number>>;

  expansionConstruction?: ExpansionConstruction;
  expansionRequirements?: ExpansionRequirements;
  expandedAt?: number;

  // TODO - make mandatory
  bumpkin?: Bumpkin;

  buildings: Buildings;
  collectibles: Collectibles;
  delivery: Delivery;
  npcs?: NPCS;
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
  dailyRewards?: DailyRewards;
  auctioneer: {
    bid?: Bid;
  };
  hayseedHank?: HayseedHank;
  chores?: ChoresV2;
  mushrooms: Mushrooms;
  catchTheKraken: CatchTheKraken;
  potionHouse?: PotionHouse;

  trades: {
    listings?: Record<string, TradeListing>;
  };
  buds?: Record<number, Bud>;

  christmas?: Christmas;
}

export interface Context {
  state?: GameState;
  actions: PastAction[];
}
