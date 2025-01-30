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
import { makeAnimalBuilding } from "./animals";
import { Equipped } from "../types/bumpkin";
import { tokenUriBuilder } from "lib/utils/tokenUriBuilder";

export const STATIC_OFFLINE_FARM: GameState = {
  coins: 10000,
  balance: new Decimal(0),
  previousBalance: new Decimal(0),
  inventory: {
    Obsidian: new Decimal(20),
    "Dirt Path": new Decimal(20),
    Marty: new Decimal(2),
    Miffy: new Decimal(2),
    Morty: new Decimal(2),
    "Town Center": new Decimal(1),
    Market: new Decimal(1),
    Workbench: new Decimal(1),
    "Basic Land": new Decimal(10),
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
  lavaPits: {},

  fruitPatches: {
    "1": {
      x: -2,
      y: 6,
      width: 2,
      height: 2,
      fruit: {
        name: "Banana",
        plantedAt: 0,
        amount: 1,
        harvestsLeft: 1,
        harvestedAt: 0,
      },
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
    skills: {},
    tokenUri: `1_${tokenUriBuilder(INITIAL_EQUIPMENT)}`,
    achievements: {},

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
          x: -1,
          y: 0,
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
