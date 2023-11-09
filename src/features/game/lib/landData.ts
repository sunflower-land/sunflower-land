import Decimal from "decimal.js-light";
import { Bumpkin, GameState, Inventory } from "../types/game";
import { getKeys } from "../types/craftables";

const INITIAL_STOCK: Inventory = {
  "Sunflower Seed": new Decimal(400),
  "Potato Seed": new Decimal(200),
  "Pumpkin Seed": new Decimal(100),
  "Carrot Seed": new Decimal(100),
  "Cabbage Seed": new Decimal(90),
  "Beetroot Seed": new Decimal(80),
  "Cauliflower Seed": new Decimal(80),
  "Parsnip Seed": new Decimal(60),
  "Radish Seed": new Decimal(40),
  "Wheat Seed": new Decimal(40),
  "Kale Seed": new Decimal(30),

  "Apple Seed": new Decimal(10),
  "Orange Seed": new Decimal(10),
  "Blueberry Seed": new Decimal(10),

  Axe: new Decimal(50),
  Pickaxe: new Decimal(30),
  "Stone Pickaxe": new Decimal(10),
  "Iron Pickaxe": new Decimal(5),
  "Rusty Shovel": new Decimal(10),
  "Sand Shovel": new Decimal(30),
  "Sand Drill": new Decimal(5),

  // One off items
  "Pumpkin Soup": new Decimal(1),
  Sauerkraut: new Decimal(1),
  "Roasted Cauliflower": new Decimal(1),

  "Sunflower Cake": new Decimal(1),
  "Potato Cake": new Decimal(1),
  "Pumpkin Cake": new Decimal(1),
  "Carrot Cake": new Decimal(1),
  "Cabbage Cake": new Decimal(1),
  "Beetroot Cake": new Decimal(1),
  "Cauliflower Cake": new Decimal(1),
  "Parsnip Cake": new Decimal(1),
  "Radish Cake": new Decimal(1),
  "Wheat Cake": new Decimal(1),

  "Boiled Eggs": new Decimal(1),
  "Magic Bean": new Decimal(5),

  "Immortal Pear": new Decimal(1),
};
export type ResourceFieldName =
  | "trees"
  | "stones"
  | "iron"
  | "gold"
  | "crops"
  | "fruitPatches";

export const INITIAL_RESOURCES: Pick<
  GameState,
  "crops" | "trees" | "stones" | "iron" | "gold" | "fruitPatches"
> = {
  crops: {
    1: {
      createdAt: Date.now(),
      x: -2,
      y: -1,
      height: 1,
      width: 1,
    },
    2: {
      createdAt: Date.now(),
      x: -1,
      y: -1,
      height: 1,
      width: 1,
    },
    3: {
      createdAt: Date.now(),
      x: 0,
      y: -1,
      height: 1,
      width: 1,
    },
    4: {
      createdAt: Date.now(),
      crop: { name: "Sunflower", plantedAt: 0, amount: 1 },
      x: -2,
      y: 0,
      height: 1,
      width: 1,
    },
    5: {
      createdAt: Date.now(),
      crop: { name: "Sunflower", plantedAt: 0, amount: 1 },
      x: -1,
      y: 0,
      height: 1,
      width: 1,
    },
    6: {
      createdAt: Date.now(),
      crop: { name: "Sunflower", plantedAt: 0, amount: 1 },
      x: 0,
      y: 0,
      height: 1,
      width: 1,
    },
    7: {
      createdAt: Date.now(),
      x: -2,
      y: 1,
      height: 1,
      width: 1,
    },
    8: {
      createdAt: Date.now(),
      x: -1,
      y: 1,
      height: 1,
      width: 1,
    },
    9: {
      createdAt: Date.now(),
      x: 0,
      y: 1,
      height: 1,
      width: 1,
    },
    10: {
      createdAt: Date.now(),
      x: 6,
      y: -2,
      height: 1,
      width: 1,
    },
    11: {
      createdAt: Date.now(),
      x: 6,
      y: -1,
      height: 1,
      width: 1,
    },
    12: {
      createdAt: Date.now(),
      x: 7,
      y: -2,
      height: 1,
      width: 1,
    },
    13: {
      createdAt: Date.now(),
      x: 7,
      y: -1,
      height: 1,
      width: 1,
    },
    14: {
      createdAt: Date.now(),
      x: 0,
      y: -7,
      height: 1,
      width: 1,
    },
    15: {
      createdAt: Date.now(),
      x: 1,
      y: -7,
      height: 1,
      width: 1,
    },
    16: {
      createdAt: Date.now(),
      x: 2,
      y: -7,
      height: 1,
      width: 1,
    },
    17: {
      createdAt: Date.now(),
      x: 3,
      y: -7,
      height: 1,
      width: 1,
    },
    18: {
      createdAt: Date.now(),
      x: 4,
      y: -7,
      height: 1,
      width: 1,
    },
    19: {
      createdAt: Date.now(),
      x: 5,
      y: -7,
      height: 1,
      width: 1,
    },
    20: {
      createdAt: Date.now(),
      x: 6,
      y: -7,
      height: 1,
      width: 1,
    },
    21: {
      createdAt: Date.now(),
      x: 7,
      y: -7,
      height: 1,
      width: 1,
    },
    22: {
      createdAt: Date.now(),
      x: 8,
      y: -7,
      height: 1,
      width: 1,
    },
    23: {
      createdAt: Date.now(),
      x: 9,
      y: -7,
      height: 1,
      width: 1,
    },
    24: {
      createdAt: Date.now(),
      x: 0,
      y: -8,
      height: 1,
      width: 1,
    },
    25: {
      createdAt: Date.now(),
      x: 1,
      y: -8,
      height: 1,
      width: 1,
    },
    26: {
      createdAt: Date.now(),
      x: 2,
      y: -8,
      height: 1,
      width: 1,
    },
    27: {
      createdAt: Date.now(),
      x: 3,
      y: -8,
      height: 1,
      width: 1,
    },
    28: {
      createdAt: Date.now(),
      x: 4,
      y: -8,
      height: 1,
      width: 1,
    },
    29: {
      createdAt: Date.now(),
      x: 5,
      y: -8,
      height: 1,
      width: 1,
    },
    30: {
      createdAt: Date.now(),
      x: 5,
      y: -8,
      height: 1,
      width: 1,
    },
    31: {
      createdAt: Date.now(),
      x: 6,
      y: -8,
      height: 1,
      width: 1,
    },
    32: {
      createdAt: Date.now(),
      x: 7,
      y: -8,
      height: 1,
      width: 1,
    },
    33: {
      createdAt: Date.now(),
      x: 8,
      y: -8,
      height: 1,
      width: 1,
    },
    34: {
      createdAt: Date.now(),
      x: 9,
      y: -8,
      height: 1,
      width: 1,
    },
  },
  trees: {
    1: {
      wood: {
        amount: 1,
        choppedAt: 0,
      },
      x: -3,
      y: 3,
      height: 2,
      width: 2,
    },
    2: {
      wood: {
        amount: 1,
        choppedAt: 0,
      },
      x: 7,
      y: 3,
      height: 2,
      width: 2,
    },
    3: {
      wood: {
        amount: 1,
        choppedAt: 0,
      },
      x: 7,
      y: 9,
      height: 2,
      width: 2,
    },
  },
  stones: {
    1: {
      x: 0,
      y: 3,
      width: 1,
      height: 1,
      stone: {
        amount: 1,
        minedAt: 0,
      },
    },
    2: {
      x: 4,
      y: 5,
      width: 1,
      height: 1,
      stone: {
        amount: 1,
        minedAt: 0,
      },
    },
  },
  fruitPatches: {},
  gold: {},
  iron: {},
};

export const INITIAL_EXPANSIONS = 3;

const INITIAL_BUMPKIN: Bumpkin = {
  id: 1,
  experience: 0,
  tokenUri: "bla",
  equipped: {
    body: "Beige Farmer Potion",
    hair: "Basic Hair",
    shirt: "Red Farmer Shirt",
    pants: "Brown Suspenders",

    shoes: "Black Farmer Boots",
    tool: "Farmer Pitchfork",
    background: "Farm Background",
    onesie: "Eggplant Onesie",
  },
  skills: {},
  achievements: {},
  activity: {
    "Reindeer Carrot Fed": 50,
  },
};

export const OFFLINE_FARM: GameState = {
  mysteryPrizes: {},
  mushrooms: {
    mushrooms: {},
    spawnedAt: 0,
  },
  bumpkin: INITIAL_BUMPKIN,
  balance: new Decimal(0),
  previousBalance: new Decimal(0),
  previousInventory: {},
  inventory: {
    "Town Center": new Decimal(1),
    Market: new Decimal(1),
    "Fire Pit": new Decimal(1),
    Workbench: new Decimal(1),
    "Basic Land": new Decimal(INITIAL_EXPANSIONS),
    "Crop Plot": new Decimal(getKeys(INITIAL_RESOURCES.crops).length),
    "Water Well": new Decimal(4),
    Tree: new Decimal(getKeys(INITIAL_RESOURCES.trees).length),
    "Stone Rock": new Decimal(getKeys(INITIAL_RESOURCES.stones).length),
    Axe: new Decimal(6),
    "Block Buck": new Decimal(3),
  },
  wardrobe: {},

  createdAt: new Date().getTime(),

  ...INITIAL_RESOURCES,

  conversations: ["hank-intro"],

  fishing: {
    dailyAttempts: {},
    weather: "Sunny",
    wharf: {},
  },
  mailbox: {
    read: [],
  },

  stock: INITIAL_STOCK,
  stockExpiry: {},
  expansionRequirements: {
    bumpkinLevel: 1,
    seconds: 10,
    resources: { Wood: 3 },
  },
  chickens: {},
  trades: {},
  buildings: {
    "Town Center": [
      {
        id: "123",
        readyAt: 0,
        coordinates: {
          x: 3,
          y: 3,
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
          y: 9,
        },
        createdAt: 0,
      },
    ],
    "Fire Pit": [
      {
        id: "123",
        readyAt: 0,
        coordinates: {
          x: 2,
          y: -1,
        },
        createdAt: 0,
      },
    ],
    Market: [
      {
        id: "123",
        readyAt: 0,
        coordinates: {
          x: 6,
          y: 6,
        },
        createdAt: 0,
      },
    ],
  },
  collectibles: {},
  pumpkinPlaza: {},
  treasureIsland: {
    holes: {},
  },
  auctioneer: {},
  delivery: {
    fulfilledCount: 0,
    orders: [],
    milestone: {
      goal: 10,
      total: 10,
    },
  },

  farmActivity: {},
  milestones: {},
  catchTheKraken: {
    hunger: "Sunflower",
    weeklyCatches: {},
  },
  airdrops: [],
};
