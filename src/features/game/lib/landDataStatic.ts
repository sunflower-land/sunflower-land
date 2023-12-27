import Decimal from "decimal.js-light";
import { GameState, Inventory } from "../types/game";
import { BumpkinLevel } from "features/game/lib/level";
import { getEnabledNodeCount } from "../expansion/lib/expansionNodes";
import {
  INITIAL_BUMPKIN,
  INITIAL_BUMPKIN_LEVEL,
  INITIAL_EXPANSIONS,
} from "./bumpkinData";

export const INITIAL_RESOURCES: Pick<
  GameState,
  "crops" | "trees" | "stones" | "iron" | "gold" | "fruitPatches"
> = {
  crops: {
    1: {
      createdAt: Date.now(),
      crop: { name: "Sunflower", plantedAt: 0, amount: 1 },
      x: -2,
      y: 0,
      height: 1,
      width: 1,
    },
    2: {
      createdAt: Date.now(),
      crop: { name: "Sunflower", plantedAt: 0, amount: 1 },
      x: -1,
      y: 0,
      height: 1,
      width: 1,
    },
    3: {
      createdAt: Date.now(),
      crop: { name: "Sunflower", plantedAt: 0, amount: 1 },
      x: 0,
      y: 0,
      height: 1,
      width: 1,
    },
    4: {
      createdAt: Date.now(),
      x: -2,
      y: -1,
      height: 1,
      width: 1,
    },
    5: {
      createdAt: Date.now(),
      x: -1,
      y: -1,
      height: 1,
      width: 1,
    },
    6: {
      createdAt: Date.now(),
      x: 0,
      y: -1,
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
  },
  trees: {
    1: {
      wood: {
        amount: 2,
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
      y: 0,
      height: 2,
      width: 2,
    },

    3: {
      wood: {
        amount: 2,
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
      stone: {
        amount: 1,
        minedAt: 0,
      },
      x: 7,
      y: 3,
      height: 2,
      width: 2,
    },
    2: {
      stone: {
        amount: 1,
        minedAt: 0,
      },
      x: 3,
      y: 6,
      height: 2,
      width: 2,
    },
  },
  fruitPatches: {},
  gold: {},
  iron: {},
};

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

const OFFLINE_FARM_CROPS = getEnabledNodeCount(
  INITIAL_BUMPKIN_LEVEL as BumpkinLevel,
  "Crop Plot"
);
const OFFLINE_FARM_TREES = getEnabledNodeCount(
  INITIAL_BUMPKIN_LEVEL as BumpkinLevel,
  "Tree"
);
const OFFLINE_FARM_STONES = getEnabledNodeCount(
  INITIAL_BUMPKIN_LEVEL as BumpkinLevel,
  "Stone Rock"
);
const OFFLINE_FARM_IRON = getEnabledNodeCount(
  INITIAL_BUMPKIN_LEVEL as BumpkinLevel,
  "Iron Rock"
);
const OFFLINE_FARM_GOLD = getEnabledNodeCount(
  INITIAL_BUMPKIN_LEVEL as BumpkinLevel,
  "Gold Rock"
);
const OFFLINE_FARM_FRUIT = getEnabledNodeCount(
  INITIAL_BUMPKIN_LEVEL as BumpkinLevel,
  "Fruit Patch"
);

export const STATIC_OFFLINE_FARM: GameState = {
  home: {
    collectibles: {
      Anchor: [
        {
          id: "123",
          readyAt: 0,
          coordinates: {
            x: 0,
            y: 0,
          },
          createdAt: 0,
        },
      ],
      "Abandoned Bear": [
        {
          id: "123",
          readyAt: 0,
          coordinates: {
            x: 2,
            y: 3,
          },
          createdAt: 0,
        },
      ],
      "Chef Bear": [
        {
          id: "123",
          readyAt: 0,
          coordinates: {
            x: 4,
            y: 5,
          },
          createdAt: 0,
        },
      ],
    },
  },
  island: {
    type: "basic",
  },
  mysteryPrizes: {},
  mushrooms: {
    mushrooms: {},
    spawnedAt: 0,
  },
  bumpkin: INITIAL_BUMPKIN,
  buds: {
    1: {
      aura: "Basic",
      colour: "Beige",
      ears: "Ears",
      stem: "3 Leaf Clover",
      type: "Beach",
    },
    2: {
      aura: "Basic",
      colour: "Beige",
      ears: "Ears",
      stem: "3 Leaf Clover",
      type: "Woodlands",
    },
  },
  balance: new Decimal(0),
  previousBalance: new Decimal(0),
  previousInventory: {},
  inventory: {
    "White Festive Fox": new Decimal(3),
    "Grinx's Hammer": new Decimal(1),
    Rod: new Decimal(20),
    Earthworm: new Decimal(10),
    "Bumpkin Nutcracker": new Decimal(1),
    "Festive Tree": new Decimal(1),
    "Town Center": new Decimal(1),
    Market: new Decimal(1),
    Workbench: new Decimal(1),
    "Basic Land": new Decimal(INITIAL_EXPANSIONS),
    "Crop Plot": new Decimal(OFFLINE_FARM_CROPS),
    "Water Well": new Decimal(4),
    Tree: new Decimal(OFFLINE_FARM_TREES),
    "Stone Rock": new Decimal(OFFLINE_FARM_STONES),
    "Iron Rock": new Decimal(OFFLINE_FARM_IRON),
    "Gold Rock": new Decimal(OFFLINE_FARM_GOLD),
    "Fruit Patch": new Decimal(OFFLINE_FARM_FRUIT),
    Axe: new Decimal(10),
    "Block Buck": new Decimal(1),
    Egg: new Decimal(12),
  },
  wardrobe: {
    "Elf Suit": 1,
    "Banana Onesie": 1,
  },

  createdAt: new Date().getTime(),

  ...INITIAL_RESOURCES,

  conversations: ["hank-intro"],

  fishing: {
    dailyAttempts: {},
    weather: "Sunny",
    wharf: {},
    beach: {},
  },
  mailbox: {
    read: [],
  },

  stock: INITIAL_STOCK,
  stockExpiry: {},
  expansionRequirements: {
    bumpkinLevel: 1,
    seconds: 3,
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
          x: 2,
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
          x: 6,
          y: 5,
        },
        createdAt: 0,
      },
    ],
    "Fire Pit": [
      {
        id: "123",
        readyAt: 0,
        coordinates: {
          x: 3,
          y: -1,
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
    orders: [
      {
        createdAt: Date.now(),
        readyAt: Date.now(),
        from: "betty",
        reward: {
          items: {},
          sfl: 0.12,
        },
        id: "1",
        items: {
          Sunflower: 20,
        },
      },
      {
        createdAt: Date.now(),
        readyAt: Date.now(),
        from: "grimbly",
        reward: {
          items: {},
          sfl: 0.15,
        },
        id: "3",
        items: {
          Potato: 2,
        },
      },
      {
        createdAt: Date.now(),
        readyAt: Date.now(),
        from: "grubnuk",
        reward: {
          items: {},
          sfl: 0.2,
        },
        id: "2",
        items: {
          "Pumpkin Soup": 1,
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
  catchTheKraken: {
    hunger: "Iron",
    weeklyCatches: {},
  },
  airdrops: [],
  username: "Local Hero",
};
