import Decimal from "decimal.js-light";
import { fromWei } from "web3-utils";
import {
  Bumpkin,
  GameState,
  Inventory,
  ExpansionConstruction,
  PlacedItem,
} from "../types/game";

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

export const makeMegaStoreAvailableDates = () => {
  const now = new Date();

  const currentMonthStart = new Date(now);
  const nextMonthStart = new Date(now);

  // Set "from" as the first day of the current month
  currentMonthStart.setUTCDate(1);
  currentMonthStart.setUTCHours(0, 0, 0, 0);

  // Set "to" as the first day of the next month
  nextMonthStart.setUTCMonth(nextMonthStart.getMonth() + 1);
  nextMonthStart.setUTCDate(1);
  nextMonthStart.setUTCHours(0, 0, 0, 0);

  return {
    from: currentMonthStart.getTime(),
    to: nextMonthStart.getTime(),
  };
};

export function isBuildingReady(building: PlacedItem[]) {
  return building.some((b) => b.readyAt <= Date.now());
}
export const INITIAL_STOCK = (state?: GameState): Inventory => {
  let tools = {
    Axe: new Decimal(200),
    Pickaxe: new Decimal(60),
    "Stone Pickaxe": new Decimal(20),
    "Iron Pickaxe": new Decimal(5),
    "Gold Pickaxe": new Decimal(5),
    "Oil Drill": new Decimal(5),
    Rod: new Decimal(50),
  };

  // increase in 50% tool stock if you have a toolshed
  if (
    state?.buildings["Toolshed"] &&
    isBuildingReady(state.buildings["Toolshed"])
  ) {
    tools = {
      Axe: new Decimal(300),
      Pickaxe: new Decimal(90),
      "Stone Pickaxe": new Decimal(30),
      "Iron Pickaxe": new Decimal(8),
      "Gold Pickaxe": new Decimal(8),
      "Oil Drill": new Decimal(8),
      Rod: new Decimal(75),
    };
  }

  let seeds = {
    "Sunflower Seed": new Decimal(400),
    "Potato Seed": new Decimal(200),
    "Pumpkin Seed": new Decimal(150),
    "Carrot Seed": new Decimal(100),
    "Cabbage Seed": new Decimal(90),
    "Beetroot Seed": new Decimal(80),
    "Cauliflower Seed": new Decimal(80),
    "Parsnip Seed": new Decimal(60),
    "Eggplant Seed": new Decimal(50),
    "Corn Seed": new Decimal(50),
    "Radish Seed": new Decimal(40),
    "Wheat Seed": new Decimal(40),
    "Kale Seed": new Decimal(30),

    "Apple Seed": new Decimal(10),
    "Orange Seed": new Decimal(10),
    "Blueberry Seed": new Decimal(10),
    "Banana Plant": new Decimal(10),

    "Sunpetal Seed": new Decimal(16),
    "Bloom Seed": new Decimal(8),
    "Lily Seed": new Decimal(4),
  };

  if (
    state?.buildings["Warehouse"] &&
    isBuildingReady(state.buildings["Warehouse"])
  ) {
    seeds = {
      "Sunflower Seed": new Decimal(480),
      "Potato Seed": new Decimal(240),
      "Pumpkin Seed": new Decimal(180),
      "Carrot Seed": new Decimal(120),
      "Cabbage Seed": new Decimal(108),
      "Beetroot Seed": new Decimal(96),
      "Cauliflower Seed": new Decimal(96),
      "Parsnip Seed": new Decimal(72),
      "Eggplant Seed": new Decimal(60),
      "Corn Seed": new Decimal(60),
      "Radish Seed": new Decimal(48),
      "Wheat Seed": new Decimal(48),
      "Kale Seed": new Decimal(36),
      "Apple Seed": new Decimal(12),
      "Orange Seed": new Decimal(12),
      "Blueberry Seed": new Decimal(12),
      "Banana Plant": new Decimal(12),

      "Sunpetal Seed": new Decimal(20),
      "Bloom Seed": new Decimal(10),
      "Lily Seed": new Decimal(5),
    };
  }

  return {
    // Tools
    ...tools,
    // Seeds
    ...seeds,

    Shovel: new Decimal(1),
    "Rusty Shovel": new Decimal(100),
    "Sand Shovel": new Decimal(25),
    "Sand Drill": new Decimal(5),
    Chicken: new Decimal(5),

    "Magic Bean": new Decimal(5),
    "Immortal Pear": new Decimal(1),
  };
};

export const INVENTORY_LIMIT = (state?: GameState): Inventory => {
  let seeds = {
    "Sunflower Seed": new Decimal(1000),
    "Potato Seed": new Decimal(500),
    "Pumpkin Seed": new Decimal(400),
    "Carrot Seed": new Decimal(250),
    "Cabbage Seed": new Decimal(240),
    "Beetroot Seed": new Decimal(220),
    "Cauliflower Seed": new Decimal(200),
    "Parsnip Seed": new Decimal(150),
    "Eggplant Seed": new Decimal(120),
    "Corn Seed": new Decimal(120),
    "Radish Seed": new Decimal(100),
    "Wheat Seed": new Decimal(100),
    "Kale Seed": new Decimal(80),

    "Apple Seed": new Decimal(25),
    "Orange Seed": new Decimal(33),
    "Blueberry Seed": new Decimal(40),
    "Banana Plant": new Decimal(25),

    "Sunpetal Seed": new Decimal(40),
    "Bloom Seed": new Decimal(20),
    "Lily Seed": new Decimal(10),
  };

  if (
    state?.buildings["Warehouse"] &&
    isBuildingReady(state.buildings["Warehouse"])
  ) {
    seeds = {
      "Sunflower Seed": new Decimal(1200),
      "Potato Seed": new Decimal(600),
      "Pumpkin Seed": new Decimal(480),
      "Carrot Seed": new Decimal(300),
      "Cabbage Seed": new Decimal(288),
      "Beetroot Seed": new Decimal(264),
      "Cauliflower Seed": new Decimal(240),
      "Parsnip Seed": new Decimal(180),
      "Eggplant Seed": new Decimal(144),
      "Corn Seed": new Decimal(144),
      "Radish Seed": new Decimal(120),
      "Wheat Seed": new Decimal(120),
      "Kale Seed": new Decimal(96),

      "Apple Seed": new Decimal(30),
      "Orange Seed": new Decimal(40),
      "Blueberry Seed": new Decimal(50),
      "Banana Plant": new Decimal(30),

      "Sunpetal Seed": new Decimal(48),
      "Bloom Seed": new Decimal(24),
      "Lily Seed": new Decimal(12),
    };
  }

  return seeds;
};

export const INITIAL_GOLD_MINES: GameState["gold"] = {
  0: {
    stone: {
      amount: 0.1,
      minedAt: 0,
    },
    x: -4,
    y: 2,
    height: 1,
    width: 1,
  },
};

export const INITIAL_EXPANSION_IRON: GameState["iron"] = {
  0: {
    stone: {
      amount: 0.1,
      minedAt: 0,
    },
    x: 2,
    y: -1,
    height: 1,
    width: 1,
  },
};

export const GENESIS_LAND_EXPANSION: ExpansionConstruction = {
  createdAt: 1,
  readyAt: 0,
};

export const INITIAL_EXPANSIONS: ExpansionConstruction[] = [
  {
    createdAt: 2,
    readyAt: 0,
  },

  {
    createdAt: 3,
    readyAt: 0,
  },
  {
    createdAt: 4,
    readyAt: 0,
  },
];

export const INITIAL_BUMPKIN: Bumpkin = {
  id: 1,
  experience: 0,
  tokenUri: "bla",
  equipped: {
    body: "Light Brown Farmer Potion",
    hair: "Basic Hair",
    shirt: "Red Farmer Shirt",
    pants: "Farmer Pants",
    shoes: "Black Farmer Boots",
    tool: "Farmer Pitchfork",
    background: "Farm Background",
  },
  skills: {},
  achievements: {
    "Busy Bumpkin": 1,
  },
  activity: {},
};

export const TEST_FARM: GameState = {
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
  previousInventory: {},
  stock: INITIAL_STOCK(),
  chickens: {},
  farmActivity: {},
  milestones: {},
  home: { collectibles: {} },
  island: { type: "basic" },
  farmHands: { bumpkins: {} },
  fishing: {
    weather: "Sunny",
    wharf: {},
    beach: {},
    dailyAttempts: {},
  },
  catchTheKraken: {
    hunger: "Sunflower",
    weeklyCatches: {},
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
      height: 1,
      width: 1,
      x: 1,
      y: 1,
      createdAt: Date.now(),
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
  airdrops: [
    {
      createdAt: Date.now(),
      id: "123",
      items: {
        "Rapid Growth": 5,
      },
      wearables: {},
      sfl: 3,
      coins: 0,
      message: "You are a legend!",
    },
  ],
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
  stones: {},
  crimstones: {},
  oilReserves: {},
  trees: {},
  sunstones: {},
  mushrooms: {
    spawnedAt: 0,
    mushrooms: {},
  },
  beehives: {},
  megastore: {
    available: makeMegaStoreAvailableDates(),
    collectibles: [],
    wearables: [],
  },
  specialEvents: {
    current: {},
    history: {},
  },
  goblinMarket: {
    resources: {},
  },
};

export const EMPTY: GameState = {
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
  previousInventory: {},
  chickens: {},
  stock: {},
  stockExpiry: {},
  wardrobe: {},
  previousWardrobe: {},
  conversations: [],
  farmHands: {
    bumpkins: {},
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
    weather: "Sunny",
    wharf: {},
    beach: {},
    dailyAttempts: {},
  },
  mushrooms: {
    spawnedAt: 0,
    mushrooms: {},
  },
  catchTheKraken: {
    hunger: "Sunflower",
    weeklyCatches: {},
  },
  megastore: {
    available: makeMegaStoreAvailableDates(),
    collectibles: [],
    wearables: [],
  },
  specialEvents: {
    current: {},
    history: {},
  },
  goblinMarket: {
    resources: {},
  },
};

export const TREE_RECOVERY_TIME = 2 * 60 * 60;
export const STONE_RECOVERY_TIME = 4 * 60 * 60;
export const IRON_RECOVERY_TIME = 8 * 60 * 60;
export const GOLD_RECOVERY_TIME = 24 * 60 * 60;
export const CRIMSTONE_RECOVERY_TIME = 24 * 60 * 60;
export const SUNSTONE_RECOVERY_TIME = 3 * 24 * 60 * 60;
