/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
import Decimal from "decimal.js-light";
import { BB_TO_GEM_RATIO, GameState } from "../types/game";

import {
  INITIAL_CHORE_BOARD,
  INITIAL_EQUIPMENT,
  INITIAL_STOCK,
} from "./constants";
import { INITIAL_REWARDS } from "../types/rewards";
import { Equipped } from "../types/bumpkin";
import { tokenUriBuilder } from "lib/utils/tokenUriBuilder";

export const STATIC_OFFLINE_FARM: GameState = {
  username: "Local Hero",
  coins: 10000,
  balance: new Decimal(0),
  previousBalance: new Decimal(0),
  vip: {
    bundles: [{ name: "1_MONTH", boughtAt: Date.now() }],
    expiresAt: Date.now() + 31 * 24 * 60 * 60 * 1000,
  },
  inventory: {
    Potato: new Decimal(100),
    Rhubarb: new Decimal(100),
    "Sunpetal Seed": new Decimal(1),
    "Bloom Seed": new Decimal(1),
    "Lily Seed": new Decimal(1),
    "Edelweiss Seed": new Decimal(1),
    "Gladiolus Seed": new Decimal(1),
    "Lavender Seed": new Decimal(1),
    "Clover Seed": new Decimal(1),
    "Celestial Frostbloom": new Decimal(1),
    "Royal Ornament": new Decimal(1),
    "Fruit Patch": new Decimal(1),
    "Lunara Seed": new Decimal(1),
    Obsidian: new Decimal(20),
    Jellyfish: new Decimal(1),
    Chamomile: new Decimal(1),
    "Frozen Cow": new Decimal(1),
    "Frozen Sheep": new Decimal(1),
    "Summer Chicken": new Decimal(1),
    "Dirt Path": new Decimal(20),
    Marty: new Decimal(2),
    Miffy: new Decimal(2),
    Morty: new Decimal(2),
    "Town Center": new Decimal(1),
    Market: new Decimal(1),
    Workbench: new Decimal(1),
    "Basic Land": new Decimal(10),
    "Lava Pit": new Decimal(1),
    Bush: new Decimal(3),
    Axe: new Decimal(10),
    Gem: new Decimal(1 * BB_TO_GEM_RATIO),
    Rug: new Decimal(1),
    Wardrobe: new Decimal(1),
    Shovel: new Decimal(1),
    Mansion: new Decimal(1),
    Wood: new Decimal(1000),
    Stone: new Decimal(1000),
    Iron: new Decimal(1000),
    Gold: new Decimal(1000),
    Earthworm: new Decimal(200),
    Sunflower: new Decimal(100),
    "Water Well": new Decimal(1),
    "Hen House": new Decimal(3),
    Greenhouse: new Decimal(1),
    "Protective Pesticide": new Decimal(1),
    "Tornado Pinwheel": new Decimal(1),
    "Basic Bed": new Decimal(1),
    "Fisher Bed": new Decimal(1),
    "Floral Bed": new Decimal(1),
    "Sturdy Bed": new Decimal(1),
    "Desert Bed": new Decimal(1),
    "Cow Bed": new Decimal(1),
    "Pirate Bed": new Decimal(1),
    "Royal Bed": new Decimal(1),
    Mangrove: new Decimal(1),
    "Thermal Stone": new Decimal(1),
  },
  previousInventory: {
    "Dirt Path": new Decimal(20),
    Marty: new Decimal(2),
    Miffy: new Decimal(2),
    Morty: new Decimal(2),
    "Town Center": new Decimal(1),
    Market: new Decimal(1),
    Workbench: new Decimal(1),
    "Basic Land": new Decimal(6),
    Axe: new Decimal(10),
    Gem: new Decimal(1 * BB_TO_GEM_RATIO),
    Rug: new Decimal(1),
    Wardrobe: new Decimal(1),
    Shovel: new Decimal(1),
    Sunstone: new Decimal(20),
    Mansion: new Decimal(1),
    Wood: new Decimal(1000),
    Stone: new Decimal(1000),
    Iron: new Decimal(1000),
    Gold: new Decimal(1000),
  },
  wardrobe: {},
  previousWardrobe: {},
  bank: { taxFreeSFL: 0 },
  beehives: {},
  crimstones: {},
  flowers: {
    discovered: {},
    flowerBeds: {
      "1": {
        createdAt: 0,
        x: -3,
        y: 3,
        width: 3,
        height: 1,
        flower: {
          name: "Red Balloon Flower",
          plantedAt: 0,
          amount: 1,
        },
      },
    },
  },
  lavaPits: {
    "1": { createdAt: 0, x: -4, y: -6, height: 2, width: 2 },
  },

  fruitPatches: {
    "1": {
      x: -2,
      y: 6,
      width: 2,
      height: 2,
    },
  },
  gold: {},
  iron: {},
  stones: {},
  trees: {
    1: {
      wood: {
        amount: 2,
        choppedAt: 0,
      },
      x: 4,
      y: -2,
      height: 2,
      width: 2,
    },
    2: {
      wood: {
        amount: 2,
        choppedAt: 0,
      },
      x: 6,
      y: -2,
      height: 2,
      width: 2,
    },
  },
  sunstones: {},
  oilReserves: {},

  calendar: {
    dates: [
      {
        date: "2025-01-30",
        name: "fullMoon",
      },
      {
        date: "2025-01-31",
        name: "unknown",
        weather: true,
      },
    ],
  },

  choreBoard: INITIAL_CHORE_BOARD,

  competitions: {
    progress: {
      ANIMALS: {
        initialProgress: {
          "Complete chore": 0,
        },
        startedAt: 1000000,
      },
    },
  },

  shipments: {},
  gems: {},

  bumpkin: {
    equipped: INITIAL_EQUIPMENT as Equipped,
    experience: 100000,

    id: 1,
    skills: {
      "Blooming Boost": 1,
      "Flower Power": 1,
      "Instant Gratification": 1,
      "Instant Growth": 1,
      "Barnyard Rouse": 1,
    },
    tokenUri: `1_${tokenUriBuilder(INITIAL_EQUIPMENT)}`,
    achievements: {},
    previousPowerUseAt: {
      "Instant Gratification": Date.now() - 1000 * 60,
      "Instant Growth": Date.now() - 1000 * 60,
    },

    activity: {},
  },

  rewards: INITIAL_REWARDS,

  minigames: {
    games: {},
    prizes: {},
  },

  megastore: {
    available: {
      from: 0,
      to: 0,
    },
    collectibles: [],
    wearables: [],
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
      {
        id: "obsidian-test",
        name: "Obsidian",
        sfl: 5,
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
    type: "volcano",
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

  experiments: ["GEM_BOOSTS"],

  conversations: [],

  fishing: {
    dailyAttempts: {},
    weather: "Sunny",
    wharf: {},
    beach: {},
  },
  mailbox: {
    read: [],
  },

  stock: INITIAL_STOCK(),
  chickens: {},
  trades: {},
  buildings: {
    Mansion: [
      {
        id: "123",
        readyAt: 0,
        coordinates: {
          x: -1,
          y: 8,
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
    Deli: [
      {
        id: "123",
        readyAt: 0,
        coordinates: {
          x: -8,
          y: 1,
        },
        createdAt: 0,
      },
    ],
    "Smoothie Shack": [
      {
        id: "123",
        readyAt: 0,
        coordinates: {
          x: -6,
          y: 6,
        },
        createdAt: 0,
      },
    ],
    "Fire Pit": [
      {
        id: "123",
        readyAt: 0,
        coordinates: {
          x: -3,
          y: -4,
        },
        createdAt: 0,
      },
    ],
    Bakery: [
      {
        id: "123",
        readyAt: 0,
        coordinates: {
          x: 4,
          y: 1,
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
          y: 4,
        },
        createdAt: 0,
      },
    ],
    "Hen House": [
      {
        id: "123",
        readyAt: 0,
        coordinates: {
          x: 9,
          y: -2,
        },
        createdAt: 0,
      },
    ],
    Barn: [
      {
        id: "123",
        readyAt: 0,
        coordinates: {
          x: 5,
          y: -2,
        },
        createdAt: 0,
      },
    ],
  },
  crops: {
    "1": {
      width: 1,
      x: -2,
      createdAt: 1703364823336,
      y: 0,
      height: 1,
      crop: {
        plantedAt: 0,
        name: "Sunflower",
        amount: 1,
      },
    },
    "2": {
      width: 1,
      x: -3,
      createdAt: 1703364823336,
      y: 0,
      height: 1,
      crop: {
        plantedAt: 0,
        name: "Sunflower",
        amount: 1,
      },
    },
  },
  collectibles: {
    Bale: [
      {
        id: "1",
        createdAt: 0,
        coordinates: {
          x: 0,
          y: 0,
        },
        readyAt: 0,
      },
    ],
    "Gold Egg": [
      {
        id: "1",
        createdAt: 0,
        coordinates: {
          x: 0,
          y: 0,
        },
        readyAt: 0,
      },
    ],
  },
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
  henHouse: {
    level: 2,
    animals: {
      "1": {
        id: "1",
        type: "Chicken",
        state: "idle",
        createdAt: 0,
        experience: 120,
        asleepAt: Date.now() - 1000 * 60 * 60 * 12,
        awakeAt: Date.now() + 1000 * 60 * 60 * 12,
        lovedAt: Date.now(),
        item: "Petting Hand",
      },
    },
  },
  barn: {
    level: 2,
    animals: {
      "1": {
        id: "1",
        type: "Sheep",
        state: "idle",
        createdAt: 0,
        experience: 120,
        asleepAt: Date.now() - 1000 * 60 * 60 * 12,
        awakeAt: Date.now() + 1000 * 60 * 60 * 12,
        lovedAt: Date.now(),
        item: "Petting Hand",
      },
      "2": {
        id: "2",
        type: "Cow",
        state: "idle",
        createdAt: 0,
        experience: 120,
        asleepAt: Date.now() - 1000 * 60 * 60 * 12,
        awakeAt: Date.now() + 1000 * 60 * 60 * 12,
        lovedAt: Date.now(),
        item: "Petting Hand",
      },
    },
  },
  craftingBox: {
    status: "idle",
    startedAt: 0,
    readyAt: 0,
    recipes: {},
  },
  season: {
    season: "autumn",
    startedAt: Date.now(),
  },
};
