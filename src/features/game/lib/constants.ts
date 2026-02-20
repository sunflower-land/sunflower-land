import Decimal from "decimal.js-light";
import { fromWei } from "web3-utils";
import {
  Bumpkin,
  GameState,
  ExpansionConstruction,
  PlacedItem,
  BB_TO_GEM_RATIO,
  InventoryItemName,
} from "../types/game";
import { getKeys } from "../types/craftables";
import { BumpkinParts, tokenUriBuilder } from "lib/utils/tokenUriBuilder";
import { Equipped } from "../types/bumpkin";
import { isSeed, SeedName } from "../types/seeds";
import { makeAnimalBuilding } from "./animals";
import { ChoreBoard } from "../types/choreBoard";
import { getChapterTicket } from "../types/chapters";
import { getObjectEntries } from "../expansion/lib/utils";
import {
  isFullMoonBerry,
  isGreenhouseCropSeed,
  isGreenhouseFruitSeed,
} from "../events/landExpansion/seedBought";
import {
  isAdvancedFruitSeed,
  isBasicFruitSeed,
} from "../events/landExpansion/fruitPlanted";
import { PatchFruitSeedName } from "../types/fruits";
import { WORKBENCH_TOOLS, WorkbenchToolName } from "../types/tools";

// Our "zoom" factor
export const PIXEL_SCALE = 2.625;

// How many pixels a raw green square is
export const SQUARE_WIDTH = 16;

export const GRID_WIDTH_PX = PIXEL_SCALE * SQUARE_WIDTH;

export const CHICKEN_TIME_TO_EGG = 1000 * 60 * 60 * 24 * 2; // 48 hours
export const MUTANT_CHICKEN_BOOST_AMOUNT = 0.1;
export const HEN_HOUSE_CAPACITY = 10;
export const CHICKEN_COOP_MULTIPLIER = 1.5;

export const POPOVER_TIME_MS = 1000;

export function isBuildingReady(building: PlacedItem[]) {
  return building.some((b) => (b.readyAt ?? 0) <= Date.now() && b.coordinates);
}

export type StockableName = Extract<
  InventoryItemName,
  | "Axe"
  | "Pickaxe"
  | "Stone Pickaxe"
  | "Iron Pickaxe"
  | "Gold Pickaxe"
  | "Oil Drill"
  | "Rod"
  | "Sand Shovel"
  | "Sand Drill"
  | SeedName
>;

export const INITIAL_STOCK = (
  state?: GameState,
): Record<StockableName, Decimal> => {
  const tools = Object.entries(WORKBENCH_TOOLS).reduce(
    (acc, [toolName, tool]) => {
      if (tool.disabled) return acc;

      return {
        ...acc,
        [toolName]: tool.stock,
      };
    },
    {} as Record<WorkbenchToolName, Decimal>,
  );

  // increase in 50% tool stock if you have a toolshed
  if (state?.buildings.Toolshed && isBuildingReady(state.buildings.Toolshed)) {
    getKeys(tools).forEach(
      (tool) =>
        (tools[tool] = new Decimal(Math.ceil(tools[tool].mul(1.5).toNumber()))),
    );
  }

  // increase Axe stock by 50 if player has More Axes skill
  if (state?.bumpkin?.skills["More Axes"]) {
    tools.Axe = new Decimal(Math.ceil(tools.Axe.toNumber() + 50));
  }

  if (state?.bumpkin?.skills["More Picks"]) {
    tools.Pickaxe = tools.Pickaxe.add(new Decimal(70));
    tools["Stone Pickaxe"] = tools["Stone Pickaxe"].add(new Decimal(20));
    tools["Iron Pickaxe"] = tools["Iron Pickaxe"].add(new Decimal(7));
    tools["Gold Pickaxe"] = tools["Gold Pickaxe"].add(new Decimal(2));
  }

  const seeds: Record<SeedName, Decimal> = {
    "Sunflower Seed": new Decimal(800),
    "Potato Seed": new Decimal(400),
    "Rhubarb Seed": new Decimal(400),
    "Zucchini Seed": new Decimal(400),
    "Pumpkin Seed": new Decimal(300),
    "Carrot Seed": new Decimal(200),
    "Cabbage Seed": new Decimal(180),
    "Yam Seed": new Decimal(180),
    "Soybean Seed": new Decimal(180),
    "Broccoli Seed": new Decimal(180),
    "Beetroot Seed": new Decimal(160),
    "Pepper Seed": new Decimal(160),
    "Cauliflower Seed": new Decimal(160),
    "Parsnip Seed": new Decimal(120),
    "Eggplant Seed": new Decimal(100),
    "Corn Seed": new Decimal(100),
    "Onion Seed": new Decimal(100),
    "Turnip Seed": new Decimal(80),
    "Radish Seed": new Decimal(80),
    "Wheat Seed": new Decimal(80),
    "Kale Seed": new Decimal(60),
    "Artichoke Seed": new Decimal(60),
    "Barley Seed": new Decimal(60),

    "Grape Seed": new Decimal(10),
    "Olive Seed": new Decimal(10),
    "Rice Seed": new Decimal(10),

    "Tomato Seed": new Decimal(20),
    "Lemon Seed": new Decimal(20),
    "Blueberry Seed": new Decimal(20),
    "Orange Seed": new Decimal(20),
    "Apple Seed": new Decimal(20),
    "Banana Plant": new Decimal(20),

    "Sunpetal Seed": new Decimal(16),
    "Bloom Seed": new Decimal(8),
    "Lily Seed": new Decimal(4),
    "Edelweiss Seed": new Decimal(4),
    "Gladiolus Seed": new Decimal(4),
    "Lavender Seed": new Decimal(4),
    "Clover Seed": new Decimal(4),

    "Duskberry Seed": new Decimal(0),
    "Lunara Seed": new Decimal(0),
    "Celestine Seed": new Decimal(0),
  };

  if (
    state?.buildings.Warehouse &&
    isBuildingReady(state.buildings.Warehouse)
  ) {
    // Multiply each seed quantity by 1.2 and round up
    getKeys(seeds).forEach(
      (seed) =>
        (seeds[seed] = new Decimal(Math.ceil(seeds[seed].mul(1.2).toNumber()))),
    );
  }

  if (state?.bumpkin.skills["Crime Fruit"]) {
    seeds["Tomato Seed"] = seeds["Tomato Seed"].add(10);
    seeds["Lemon Seed"] = seeds["Lemon Seed"].add(10);
  }

  return {
    // Tools
    ...tools,

    "Sand Shovel": new Decimal(50),
    "Sand Drill": new Decimal(10),
    // Seeds
    ...seeds,
  };
};

type InventoryLimit = Partial<Record<SeedName, Decimal>>;

// Inventory limit is 2.5x the initial stock for seeds
export const INVENTORY_LIMIT = (state: GameState): InventoryLimit => {
  return {
    ...getObjectEntries(INITIAL_STOCK(state)).reduce<InventoryLimit>(
      (acc, [key, value]) => {
        if (!isSeed(key)) return acc;
        if (isGreenhouseCropSeed(key) || isGreenhouseFruitSeed(key)) {
          acc[key] = new Decimal(
            Math.ceil((value ?? new Decimal(0)).mul(5).toNumber()),
          );
          return acc;
        }

        if (isFullMoonBerry(key)) {
          acc[key] = new Decimal(10);
          return acc;
        }

        if (isBasicFruitSeed(key as PatchFruitSeedName)) {
          acc[key] = new Decimal(
            Math.ceil((value ?? new Decimal(0)).mul(2).toNumber()),
          );
          return acc;
        }

        if (isAdvancedFruitSeed(key as PatchFruitSeedName)) {
          acc[key] = new Decimal(
            Math.ceil((value ?? new Decimal(0)).mul(1.5).toNumber()),
          );
          return acc;
        }

        acc[key] = new Decimal(
          Math.ceil((value ?? new Decimal(0)).mul(2.5).toNumber()),
        );
        return acc;
      },
      {},
    ),
  };
};
export const INITIAL_GOLD_MINES: GameState["gold"] = {
  0: {
    stone: {
      minedAt: 0,
    },
    x: -4,
    y: 2,
  },
};

export const INITIAL_EXPANSION_IRON: GameState["iron"] = {
  0: {
    stone: {
      minedAt: 0,
    },
    x: 2,
    y: -1,
  },
};

export const GENESIS_LAND_EXPANSION: ExpansionConstruction = {
  createdAt: 1,
  readyAt: 0,
};

export const TREE_RECOVERY_TIME = 2 * 60 * 60;
export const STONE_RECOVERY_TIME = 4 * 60 * 60;
export const IRON_RECOVERY_TIME = 8 * 60 * 60;
export const GOLD_RECOVERY_TIME = 24 * 60 * 60;
export const CRIMSTONE_RECOVERY_TIME = 24 * 60 * 60;
export const SUNSTONE_RECOVERY_TIME = 3 * 24 * 60 * 60;

export const INITIAL_RESOURCES: Pick<
  GameState,
  | "crops"
  | "trees"
  | "stones"
  | "iron"
  | "gold"
  | "fruitPatches"
  | "flowers"
  | "crimstones"
  | "sunstones"
  | "beehives"
  | "oilReserves"
> = {
  crops: {},
  trees: {
    1: {
      createdAt: Date.now(),
      wood: {
        choppedAt: 0,
        criticalHit: { Native: 1 },
      },
      x: -3,
      y: 3,
    },
    2: {
      createdAt: Date.now(),
      wood: {
        choppedAt: 0,
      },
      x: 5,
      y: 0,
    },

    3: {
      createdAt: Date.now(),
      wood: {
        criticalHit: { Native: 1 },
        choppedAt: 0,
      },
      x: 7,
      y: 9,
    },
  },
  stones: {
    1: {
      createdAt: Date.now(),
      stone: {
        minedAt: 0,
      },
      x: 7,
      y: 5,
    },
    2: {
      createdAt: Date.now(),
      stone: {
        minedAt: 0,
      },
      x: 3,
      y: 6,
    },
  },
  fruitPatches: {},
  gold: {},
  iron: {},
  crimstones: {},
  flowers: {
    discovered: {},
    flowerBeds: {},
  },
  sunstones: {},
  beehives: {},
  oilReserves: {},
};

export const INITIAL_EXPANSIONS = 3;

export const INITIAL_EQUIPMENT: BumpkinParts = {
  background: "Farm Background",
  body: "Beige Farmer Potion",
  hair: "Basic Hair",
  shoes: "Black Farmer Boots",
  pants: "Farmer Overalls",
  tool: "Farmer Pitchfork",
  shirt: "Red Farmer Shirt",
};

export const INITIAL_BUMPKIN: Bumpkin = {
  equipped: INITIAL_EQUIPMENT as Equipped,
  experience: 0,

  id: 1,
  skills: {},
  tokenUri: `1_${tokenUriBuilder(INITIAL_EQUIPMENT)}`,
  achievements: {},
};

export const INITIAL_CHORE_BOARD: ChoreBoard = {
  chores: {
    "pumpkin' pete": {
      name: "CHOP_1_TREE",
      reward: { items: { [getChapterTicket(Date.now())]: 1 } },
      initialProgress: 0,
      startedAt: Date.now(),
    },
    betty: {
      name: "CHOP_2_TREE",
      reward: { items: { [getChapterTicket(Date.now())]: 2 } },
      initialProgress: 0,
      startedAt: Date.now(),
    },
    finley: {
      name: "CHOP_1_TREE",
      reward: { items: { [getChapterTicket(Date.now())]: 2 } },
      initialProgress: 0,
      startedAt: Date.now(),
    },
  },
};

export const INITIAL_FARM: GameState = {
  settings: {},
  coins: 0,
  balance: new Decimal(0),
  previousBalance: new Decimal(0),
  inventory: {
    "Easter Token 2025": new Decimal(500),
    Marty: new Decimal(2),
    Miffy: new Decimal(2),
    Morty: new Decimal(2),
    Mog: new Decimal(2),
    "Town Center": new Decimal(1),
    Market: new Decimal(1),
    Workbench: new Decimal(1),
    "Basic Land": new Decimal(INITIAL_EXPANSIONS),
    "Crop Plot": new Decimal(getKeys(INITIAL_RESOURCES.crops).length),
    Tree: new Decimal(getKeys(INITIAL_RESOURCES.trees).length),
    "Stone Rock": new Decimal(getKeys(INITIAL_RESOURCES.stones).length),
    Axe: new Decimal(10),
    Gem: new Decimal(1 * BB_TO_GEM_RATIO),
    Rug: new Decimal(1),
    Wardrobe: new Decimal(1),
    Shovel: new Decimal(1),
  },
  previousInventory: {},
  wardrobe: {},
  previousWardrobe: {},
  bank: { taxFreeSFL: 0, withdrawnAmount: 0 },

  calendar: {
    dates: [],
  },

  choreBoard: INITIAL_CHORE_BOARD,

  competitions: {
    progress: {},
  },

  shipments: {},
  gems: {},
  flower: {},
  bumpkin: INITIAL_BUMPKIN,

  minigames: {
    games: {
      "easter-eggstravaganza": {
        history: {},
        highscore: 0,
      },
    },
    prizes: {},
  },

  bounties: {
    completed: [
      {
        id: "1",
        soldAt: 100000,
      },
    ],
    requests: [
      {
        id: "1",
        name: "Cow",
        level: 1,
        coins: 100,
      },
      {
        id: "3",
        name: "Chicken",
        level: 1,
        coins: 100,
      },
      {
        id: "2",
        name: "Chicken",
        level: 5,
        items: { Scroll: 1 },
      },
      {
        id: "2",
        name: "Chicken",
        level: 5,
        items: { Scroll: 1 },
      },
      {
        id: "2",
        name: "Chicken",
        level: 5,
        items: { Scroll: 1 },
      },
      {
        id: "2",
        name: "Chicken",
        level: 5,
        items: { Scroll: 1 },
      },
      {
        id: "22",
        name: "Chicken",
        level: 1,
        items: { Scroll: 1 },
      },
    ],
  },

  mysteryPrizes: {},
  stockExpiry: {},
  mushrooms: {
    mushrooms: {},
    spawnedAt: 0,
  },

  island: {
    type: "basic",
  },

  home: {
    collectibles: {
      Wardrobe: [
        {
          id: "1",
          createdAt: Date.now(),
          coordinates: {
            x: 1,
            y: 3,
          },
          readyAt: Date.now(),
        },
      ],
      Rug: [
        {
          id: "2",
          createdAt: Date.now(),
          coordinates: {
            x: 0,
            y: 2,
          },
          readyAt: Date.now(),
        },
      ],
    },
  },
  farmHands: { bumpkins: {} },
  greenhouse: {
    oil: 100,
    pots: {},
  },

  createdAt: new Date().getTime(),

  ...INITIAL_RESOURCES,

  conversations: ["hank-intro"],

  fishing: {
    dailyAttempts: {},
    wharf: {},
  },
  crabTraps: {
    trapSpots: {},
  },
  mailbox: {
    read: [],
  },

  stock: INITIAL_STOCK(),
  trades: {},
  floatingIsland: {
    schedule: [],
    shop: {},
  },
  buildings: {
    "Town Center": [
      {
        id: "123",
        readyAt: 0,
        coordinates: {
          x: -1,
          y: 1,
        },
        createdAt: 0,
      },
    ],
    Workbench: [
      {
        id: "123",
        readyAt: 0,
        coordinates: {
          x: 4,
          y: 8,
        },
        createdAt: 0,
      },
    ],

    Market: [
      {
        id: "123",
        readyAt: 0,
        coordinates: {
          x: 5,
          y: 3,
        },
        createdAt: 0,
      },
    ],
  },
  collectibles: {},
  pumpkinPlaza: {},
  auctioneer: {},
  delivery: {
    fulfilledCount: 0,
    orders: [
      {
        createdAt: Date.now(),
        readyAt: Date.now(),
        from: "betty",
        reward: {
          items: {},
          coins: 64,
        },
        id: "1",
        items: {
          Sunflower: 30,
        },
      },
      {
        createdAt: Date.now(),
        readyAt: Date.now(),
        from: "grubnuk",
        reward: {
          items: {},
          coins: 64,
        },
        id: "2",
        items: {
          "Pumpkin Soup": 1,
        },
      },
      {
        createdAt: Date.now(),
        readyAt: Date.now(),
        from: "grimbly",
        reward: {
          items: {},
          coins: 48,
        },
        id: "3",
        items: {
          "Mashed Potato": 2,
        },
      },
    ],
    milestone: {
      goal: 10,
      total: 10,
    },
  },
  farmActivity: {},
  milestones: {},
  specialEvents: {
    history: {},
    current: {},
  },
  goblinMarket: {
    resources: {},
  },
  kingdomChores: {
    chores: [],
    choresCompleted: 0,
    choresSkipped: 0,
  },
  desert: {
    digging: {
      grid: [],
      patterns: [],
    },
  },
  henHouse: makeAnimalBuilding("Hen House"),
  barn: makeAnimalBuilding("Barn"),
  waterWell: {
    level: 1,
  },
  petHouse: {
    level: 1,
    pets: {},
  },
  craftingBox: {
    status: "idle",
    startedAt: 0,
    readyAt: 0,
    recipes: {},
  },
  season: {
    season: "spring",
    startedAt: 0,
  },
  lavaPits: {},
  ban: {
    status: "ok",
    isSocialVerified: false,
  },
  blessing: {
    offering: {
      item: "Potato",
      prize: "Potato",
    },
  },
  aoe: {},
  socialFarming: {
    weeklyPoints: {
      points: 0,
      week: "2025-08-04",
    },
    points: 0,
    villageProjects: {},
    cheersGiven: {
      date: "",
      farms: [],
      projects: {},
    },
    cheers: {
      freeCheersClaimedAt: 0,
    },
    waves: {
      date: "",
      farms: [],
    },
  },
  pets: {
    common: {},
  },
};

export const TEST_FARM: GameState = {
  settings: {},
  coins: 0,
  balance: new Decimal(0),
  previousBalance: new Decimal(0),
  inventory: {
    Sunflower: new Decimal(5),
    Potato: new Decimal(12),
    Carrot: new Decimal("502.079999999999991"),
    "Roasted Cauliflower": new Decimal(1),
    "Carrot Cake": new Decimal(1),
    Radish: new Decimal(100),
    Wheat: new Decimal(100),
    Egg: new Decimal(30),
    "Rusty Shovel": new Decimal(1),
    Axe: new Decimal(3),
    Pickaxe: new Decimal(3),
    "Stone Pickaxe": new Decimal(3),
    "Iron Pickaxe": new Decimal(5),
    "Trading Ticket": new Decimal(50),
    "Chef Hat": new Decimal(1),
    "Boiled Eggs": new Decimal(3),
    "Sunflower Cake": new Decimal(1),
    "Basic Land": new Decimal(3),
  },
  calendar: {
    dates: [],
  },
  previousInventory: {},
  bounties: {
    completed: [],
    requests: [],
  },
  choreBoard: INITIAL_CHORE_BOARD,

  minigames: {
    games: {},
    prizes: {},
  },
  shipments: {},
  gems: {},
  floatingIsland: {
    schedule: [],
    shop: {},
  },
  flower: {},
  competitions: {
    progress: {},
  },
  kingdomChores: {
    chores: [],
    choresCompleted: 0,
    choresSkipped: 0,
  },
  stock: INITIAL_STOCK(),
  bank: { taxFreeSFL: 0, withdrawnAmount: 0 },
  farmActivity: {},
  milestones: {},
  home: { collectibles: {} },
  island: { type: "basic" },
  farmHands: { bumpkins: {} },
  fishing: {
    wharf: {},
    dailyAttempts: {},
  },
  crabTraps: {
    trapSpots: {},
  },
  greenhouse: {
    pots: {},
    oil: 0,
  },
  wardrobe: {},
  previousWardrobe: {},
  createdAt: new Date().getTime(),
  conversations: [],
  mailbox: {
    read: [],
  },
  trades: {},
  crops: {
    1: {
      createdAt: Date.now(),
      crop: { name: "Sunflower", plantedAt: 0 },
      x: -2,
      y: 0,
    },
    2: {
      createdAt: Date.now(),
      crop: { name: "Sunflower", plantedAt: 0 },
      x: -1,
      y: 0,
    },
    3: {
      createdAt: Date.now(),
      crop: { name: "Sunflower", plantedAt: 0 },
      x: 0,
      y: 0,
    },
    4: {
      createdAt: Date.now(),
      x: -2,
      y: -1,
    },
    5: {
      createdAt: Date.now(),
      x: -1,
      y: -1,
    },
    6: {
      createdAt: Date.now(),
      x: 0,
      y: -1,
    },

    7: {
      createdAt: Date.now(),
      x: -2,
      y: 1,
    },
    8: {
      createdAt: Date.now(),
      x: -1,
      y: 1,
    },
    9: {
      createdAt: Date.now(),
      x: 0,
      y: 1,
    },
  },
  mysteryPrizes: {},
  stockExpiry: {
    "Sunflower Cake": "1970-06-06",
    "Potato Cake": "1970-01-01T00:00:00.000Z",
    "Pumpkin Cake": "1970-01-01T00:00:00.000Z",
    "Carrot Cake": "2022-08-30T00:00:00.000Z",
    "Cabbage Cake": "1970-01-01T00:00:00.000Z",
    "Beetroot Cake": "1970-01-01T00:00:00.000Z",
    "Cauliflower Cake": "1970-01-01T00:00:00.000Z",
    "Parsnip Cake": "1970-01-01T00:00:00.000Z",
    "Radish Cake": "2025-01-01T00:00:00.000Z",
    "Wheat Cake": "1970-01-01T00:00:00.000Z",
  },
  pumpkinPlaza: {},
  delivery: {
    fulfilledCount: 0,
    orders: [],
    milestone: {
      goal: 10,
      total: 10,
    },
  },
  auctioneer: {},
  buildings: {
    "Fire Pit": [
      {
        id: "123",
        readyAt: 0,
        coordinates: {
          x: 4,
          y: 8,
        },
        createdAt: 0,
      },
    ],
    Market: [
      {
        id: "123",
        readyAt: 0,
        coordinates: {
          x: 2,
          y: 2,
        },
        createdAt: 0,
      },
    ],
    Workbench: [
      {
        id: "123",
        readyAt: 0,
        coordinates: {
          x: -2,
          y: 8,
        },
        createdAt: 0,
      },
    ],
  },
  airdrops: [],
  collectibles: {},
  warCollectionOffer: {
    warBonds: 10,
    startAt: new Date().toISOString(),
    endAt: new Date(Date.now() + 10000).toISOString(),
    ingredients: [
      {
        amount: 50,
        name: "Wood",
      },
    ],
  },
  bumpkin: INITIAL_BUMPKIN,

  dailyRewards: { streaks: 0 },

  fruitPatches: {},
  flowers: {
    discovered: {},
    flowerBeds: {},
  },
  gold: {},
  iron: {},
  stones: {
    1: {
      stone: {
        minedAt: 0,
      },
      x: 7,
      y: 3,
    },
    2: {
      stone: {
        minedAt: 0,
      },
      x: 3,
      y: 6,
    },
  },
  crimstones: {},
  oilReserves: {},
  trees: {
    1: {
      wood: {
        criticalHit: { Native: 1 },
        choppedAt: 0,
      },
      x: -3,
      y: 3,
    },
    2: {
      wood: {
        choppedAt: 0,
      },
      x: 7,
      y: 0,
    },

    3: {
      wood: {
        criticalHit: { Native: 1 },
        choppedAt: 0,
      },
      x: 7,
      y: 9,
    },
  },
  sunstones: {},
  mushrooms: {
    spawnedAt: 0,
    mushrooms: {},
  },
  beehives: {},

  specialEvents: {
    current: {},
    history: {},
  },
  goblinMarket: {
    resources: {},
  },
  desert: {
    digging: {
      patterns: [],

      grid: [],
    },
  },
  henHouse: makeAnimalBuilding("Hen House"),
  barn: makeAnimalBuilding("Barn"),
  waterWell: {
    level: 1,
  },
  petHouse: {
    level: 1,
    pets: {},
  },
  craftingBox: {
    status: "idle",
    startedAt: 0,
    readyAt: 0,
    recipes: {},
  },
  season: {
    season: "spring",
    startedAt: 0,
  },
  lavaPits: {},
  ban: {
    isSocialVerified: false,
    status: "ok",
  },
  blessing: {
    offering: {
      item: "Potato",
      prize: "Potato",
    },
  },
  aoe: {},
  socialFarming: {
    weeklyPoints: {
      points: 0,
      week: "2025-08-04",
    },
    points: 0,
    villageProjects: {},
    cheersGiven: {
      date: "",
      farms: [],
      projects: {},
    },
    cheers: {
      freeCheersClaimedAt: 0,
    },
    waves: {
      date: "",
      farms: [],
    },
  },
  pets: {
    common: {},
  },
};

export const INITIAL_EQUIPPED: Equipped = {
  background: "Farm Background",
  hair: "Basic Hair",
  body: "Beige Farmer Potion",
  shirt: "Blue Farmer Shirt",
  pants: "Farmer Overalls",
  shoes: "Black Farmer Boots",
  tool: "Farmer Pitchfork",
};

export const EMPTY: GameState = {
  settings: {},
  coins: 0,
  balance: new Decimal(fromWei("0")),
  previousBalance: new Decimal(fromWei("0")),
  createdAt: new Date().getTime(),
  inventory: {
    "Chicken Coop": new Decimal(1),
    Wood: new Decimal(50),
    Gold: new Decimal(10),
    Stone: new Decimal(10),
  },
  bumpkin: INITIAL_BUMPKIN,
  bounties: {
    completed: [],
    requests: [],
  },
  calendar: {
    dates: [],
  },
  bank: { taxFreeSFL: 0, withdrawnAmount: 0 },
  minigames: {
    games: {},
    prizes: {},
  },
  shipments: {},
  gems: {},
  flower: {},
  previousInventory: {},
  choreBoard: INITIAL_CHORE_BOARD,

  stock: {},
  floatingIsland: {
    schedule: [],
    shop: {},
  },
  stockExpiry: {},
  wardrobe: {},
  previousWardrobe: {},
  conversations: [],
  farmHands: {
    bumpkins: {},
  },
  competitions: {
    progress: {},
  },
  kingdomChores: {
    chores: [],
    choresCompleted: 0,
    choresSkipped: 0,
  },
  greenhouse: {
    pots: {},
    oil: 0,
  },
  mailbox: {
    read: [],
  },
  delivery: {
    fulfilledCount: 0,
    orders: [],
    milestone: {
      goal: 10,
      total: 10,
    },
  },
  home: { collectibles: {} },
  island: { type: "basic" },
  buildings: {},
  collectibles: {},
  mysteryPrizes: {},
  pumpkinPlaza: {},
  dailyRewards: { streaks: 0 },
  auctioneer: {},

  trades: {},
  fruitPatches: {},
  beehives: {},
  flowers: {
    discovered: {},
    flowerBeds: {},
  },
  gold: {},
  iron: {},
  crops: {},
  stones: {},
  crimstones: {},
  oilReserves: {},
  trees: {},
  sunstones: {},
  farmActivity: {},
  milestones: {},
  fishing: {
    wharf: {},
    dailyAttempts: {},
  },
  crabTraps: {
    trapSpots: {},
  },
  mushrooms: {
    spawnedAt: 0,
    mushrooms: {},
  },

  specialEvents: {
    current: {},
    history: {},
  },
  goblinMarket: {
    resources: {},
  },
  desert: {
    digging: {
      patterns: [],
      grid: [],
    },
  },
  henHouse: makeAnimalBuilding("Hen House"),
  barn: makeAnimalBuilding("Barn"),
  waterWell: {
    level: 1,
  },
  petHouse: {
    level: 1,
    pets: {},
  },
  craftingBox: {
    status: "idle",
    startedAt: 0,
    readyAt: 0,
    recipes: {},
  },
  season: {
    season: "spring",
    startedAt: 0,
  },
  lavaPits: {},
  ban: {
    isSocialVerified: false,
    status: "ok",
  },
  blessing: {
    offering: {
      item: "Potato",
      prize: "Potato",
    },
  },
  aoe: {},
  socialFarming: {
    points: 0,
    weeklyPoints: {
      points: 0,
      week: "2025-08-04",
    },
    villageProjects: {},
    cheersGiven: {
      date: "",
      farms: [],
      projects: {},
    },
    cheers: {
      freeCheersClaimedAt: 0,
    },
    waves: {
      date: "",
      farms: [],
    },
  },
  pets: {
    common: {},
  },
};
