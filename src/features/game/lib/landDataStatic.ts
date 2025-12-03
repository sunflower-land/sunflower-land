/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
import Decimal from "decimal.js-light";
import { GameState } from "../types/game";

import {
  INITIAL_CHORE_BOARD,
  INITIAL_EQUIPMENT,
  INITIAL_STOCK,
} from "./constants";
import { Equipped } from "../types/bumpkin";
import { tokenUriBuilder } from "lib/utils/tokenUriBuilder";
import { EXPIRY_COOLDOWNS } from "./collectibleBuilt";
import { DEFAULT_HONEY_PRODUCTION_TIME } from "./updateBeehives";

export const STATIC_OFFLINE_FARM: GameState = {
  settings: {},
  username: "Local Hero",
  coins: 10000,
  balance: new Decimal(1000),
  previousBalance: new Decimal(0),
  vip: {
    bundles: [{ name: "1_MONTH", boughtAt: Date.now() }],
    expiresAt: Date.now() + 31 * 24 * 60 * 60 * 1000,
  },
  inventory: {
    "Fish Burger": new Decimal(5),
    Ruffroot: new Decimal(100),
    "Chewed Bone": new Decimal(100),
    "Heart leaf": new Decimal(100),
    Acorn: new Decimal(100),
    "Pumpkin Soup": new Decimal(100),
    Barkley: new Decimal(1),
    "Black Magic": new Decimal(1),
    "Farmer's Monument": new Decimal(1),
    "Giant Orange": new Decimal(1),
    "Giant Apple": new Decimal(1),
    "Giant Banana": new Decimal(1),
    "Giant Carrot": new Decimal(1),
    "Basic Cooking Pot": new Decimal(1),
    "Teamwork Monument": new Decimal(1),
    "Gold Cooking Trophy": new Decimal(1),
    Doll: new Decimal(10),
    "Petting Hand": new Decimal(1),
    "Cluck Doll": new Decimal(1),
    "Lumber Doll": new Decimal(1),
    "Silver Cooking Trophy": new Decimal(1),
    "Bronze Cooking Trophy": new Decimal(1),
    "Better Together Banner": new Decimal(1),
    "Bronze Friends Trophy": new Decimal(1),
    "Silver Friends Trophy": new Decimal(1),
    "Gold Friends Trophy": new Decimal(1),
    Geniseed: new Decimal(400),
    Wheat: new Decimal(400),
    "Blue Tile": new Decimal(1000),
    "Beta Pass": new Decimal(1),
    "Colors Token 2025": new Decimal(10000),
    "Magic Bean": new Decimal(1),
    "Festive Tree": new Decimal(1),
    Fountain: new Decimal(1),
    "Genie Lamp": new Decimal(1),
    "Maneki Neko": new Decimal(1),
    "Nyon Statue": new Decimal(1),
    Observatory: new Decimal(1),
    "Super Totem": new Decimal(5),
    "Time Warp Totem": new Decimal(5),
    "Harvest Hourglass": new Decimal(5),
    "Gourmet Hourglass": new Decimal(5),
    Wardrobe: new Decimal(1),
    "Wicker Man": new Decimal(1),
    Manor: new Decimal(1),
    "Town Center": new Decimal(1),
    House: new Decimal(1),
    Mansion: new Decimal(1),
    "Crop Plot": new Decimal(66),
    "Love Charm": new Decimal(1000),
    "Great Bloom Banner": new Decimal(1),
    "Winds of Change Banner": new Decimal(1),
    Beetroot: new Decimal(100),
    Timeshard: new Decimal(1000),
    Jin: new Decimal(1),
    Egg: new Decimal(100),
    Oil: new Decimal(50),
    "Golden Sheep": new Decimal(1),
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
    Market: new Decimal(1),
    Workbench: new Decimal(1),
    "Basic Land": new Decimal(25),
    "Basic Biome": new Decimal(1),
    "Spring Biome": new Decimal(1),
    "Desert Biome": new Decimal(1),
    "Volcano Biome": new Decimal(1),
    "Lava Pit": new Decimal(1),
    Bush: new Decimal(3),
    Gem: new Decimal(4000),
    Rug: new Decimal(1),
    Shovel: new Decimal(1),
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
    Hay: new Decimal(100),
    "Dr Cow": new Decimal(1),
    "Cow Scratcher": new Decimal(1),
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
  wardrobe: {
    "Cowboy Hat": 1,
  },
  previousWardrobe: {},
  bank: { taxFreeSFL: 0, withdrawnAmount: 0 },
  beehives: {
    "123": {
      swarm: true,
      honey: { updatedAt: 0, produced: DEFAULT_HONEY_PRODUCTION_TIME },
      flowers: [],
      x: 0,
      y: 0,
    },
  },
  crimstones: {
    0: {
      stone: {
        // minedAt: Date.now() - 1000 * 60 * 60 * 24,
        minedAt: 0,
        criticalHit: { Native: 1 },
      },
      createdAt: 0,
      x: 8,
      y: -4,
      minesLeft: 1,
    },
  },
  flowers: {
    discovered: {
      "Red Balloon Flower": ["Beetroot"],
    },
    flowerBeds: {
      "1": {
        createdAt: 0,
        x: -3,
        y: 3,

        flower: {
          name: "Red Balloon Flower",
          plantedAt: 0,
          reward: {
            items: [{ name: "Lunalist", amount: 1 }],
          },
        },
      },
    },
  },
  lavaPits: {
    "1": {
      createdAt: 0,
      startedAt: Date.now() - 1000 * (60 * 60 * 48),
      x: -4,
      y: -6,
    },
  },

  fruitPatches: {
    "1": {
      createdAt: 0,
      x: -2,
      y: 6,
    },
  },
  gold: {
    0: {
      stone: {
        minedAt: 0,
        criticalHit: { Native: 1 },
      },
      createdAt: 0,
      x: -12,
      y: -5,
    },
    1: {
      stone: {
        minedAt: 0,
        criticalHit: { Native: 1 },
      },
      createdAt: 0,
      x: -12,
      y: -6,
    },
    2: {
      stone: {
        minedAt: 0,
        criticalHit: { Native: 1 },
      },
      createdAt: 0,
      x: -12,
      y: -7,
    },
    3: {
      stone: {
        minedAt: 0,
        criticalHit: { Native: 1 },
      },
      createdAt: 0,
      x: -12,
      y: -8,
    },
    4: {
      stone: {
        minedAt: 0,
        criticalHit: { Native: 1 },
      },
      createdAt: 0,
      x: -13,
      y: -5,
    },
    5: {
      stone: {
        minedAt: 0,
        criticalHit: { Native: 1 },
      },
      createdAt: 0,
      x: -13,
      y: -6,
    },
    6: {
      stone: {
        minedAt: 0,
        criticalHit: { Native: 1 },
      },
      createdAt: 0,
      x: -13,
      y: -7,
    },
    7: {
      stone: {
        minedAt: 0,
        criticalHit: { Native: 1 },
      },
      createdAt: 0,
      x: -13,
      y: -8,
    },
    8: {
      stone: {
        minedAt: 0,
        criticalHit: { Native: 1 },
      },
      createdAt: 0,
      x: -14,
      y: -5,
    },
    9: {
      stone: {
        minedAt: 0,
        criticalHit: { Native: 1 },
      },
      createdAt: 0,
      x: -14,
      y: -6,
    },
  },
  iron: {
    0: {
      stone: {
        minedAt: 0,
        criticalHit: { Native: 1 },
      },
      createdAt: 0,
      x: -8,
      y: -5,
    },
    1: {
      stone: {
        minedAt: 0,
        criticalHit: { Native: 1 },
      },
      createdAt: 0,
      x: -8,
      y: -6,
    },
    2: {
      stone: {
        minedAt: 0,
        criticalHit: { Native: 1 },
      },
      createdAt: 0,
      x: -8,
      y: -7,
    },
    3: {
      stone: {
        minedAt: 0,
        criticalHit: { Native: 1 },
      },
      createdAt: 0,
      x: -8,
      y: -8,
    },
    4: {
      stone: {
        minedAt: 0,
        criticalHit: { Native: 1 },
      },
      createdAt: 0,
      x: -7,
      y: -5,
    },
    5: {
      stone: {
        minedAt: 0,
        criticalHit: { Native: 1 },
      },
      createdAt: 0,
      x: -7,
      y: -6,
    },
    6: {
      stone: {
        minedAt: 0,
        criticalHit: { Native: 1 },
      },
      createdAt: 0,
      x: -7,
      y: -7,
    },
    7: {
      stone: {
        minedAt: 0,
        criticalHit: { Native: 1 },
      },
      createdAt: 0,
      x: -7,
      y: -8,
    },
    8: {
      stone: {
        minedAt: 0,
        criticalHit: { Native: 1 },
      },
      createdAt: 0,
      x: -6,
      y: -5,
    },
    9: {
      stone: {
        minedAt: 0,
        criticalHit: { Native: 1 },
      },
      createdAt: 0,
      x: -6,
      y: -6,
    },
  },
  stones: {
    0: {
      stone: {
        minedAt: 0,
        criticalHit: { Native: 1 },
      },
      createdAt: 0,
      x: -8,
      y: -10,
    },
    1: {
      stone: {
        minedAt: 0,
        criticalHit: { Native: 1 },
      },
      createdAt: 0,
      x: -8,
      y: -11,
    },
    2: {
      stone: {
        minedAt: 0,
        criticalHit: { Native: 1 },
      },
      createdAt: 0,
      x: -8,
      y: -12,
    },
    3: {
      stone: {
        minedAt: 0,
        criticalHit: { Native: 1 },
      },
      createdAt: 0,
      x: -8,
      y: -13,
    },
    4: {
      stone: {
        minedAt: 0,
        criticalHit: { Native: 1 },
      },
      createdAt: 0,
      x: -7,
      y: -10,
    },
    5: {
      stone: {
        minedAt: 0,
        criticalHit: { Native: 1 },
      },
      createdAt: 0,
      x: -7,
      y: -11,
    },
    6: {
      stone: {
        minedAt: 0,
        criticalHit: { Native: 1 },
      },
      createdAt: 0,
      x: -7,
      y: -12,
    },
    7: {
      stone: {
        minedAt: 0,
        criticalHit: { Native: 1 },
      },
      createdAt: 0,
      x: -7,
      y: -13,
    },
    8: {
      stone: {
        minedAt: 0,
        criticalHit: { Native: 1 },
      },
      createdAt: 0,
      x: -6,
      y: -10,
    },
    9: {
      stone: {
        minedAt: 0,
        criticalHit: { Native: 1 },
      },
      createdAt: 0,
      x: -6,
      y: -11,
    },
  },
  trees: {
    1: {
      wood: {
        choppedAt: 0,
        criticalHit: { Native: 1 },
        reward: {
          coins: 200,
        },
      },
      x: -12,
      y: 10,
    },
    2: {
      wood: {
        choppedAt: 0,
        criticalHit: { Native: 1 },
      },
      x: -12,
      y: 12,
    },
    3: {
      wood: {
        choppedAt: 0,
        criticalHit: { Native: 1 },
      },
      x: -14,
      y: 10,
    },
    4: {
      wood: {
        choppedAt: 0,
        criticalHit: { Native: 1 },
      },
      x: -14,
      y: 12,
    },
    5: {
      wood: {
        choppedAt: 0,
        criticalHit: { Native: 1 },
      },
      x: -8,
      y: 10,
    },
    6: {
      wood: {
        choppedAt: 0,
        criticalHit: { Native: 1 },
      },
      x: -8,
      y: 12,
    },
    7: {
      wood: {
        choppedAt: 0,
        criticalHit: { Native: 1 },
      },
      x: -10,
      y: 10,
    },
    8: {
      wood: {
        choppedAt: 0,
        criticalHit: { Native: 1 },
      },
      x: -10,
      y: 12,
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
      PEGGYS_COOKOFF: {
        points: 0,
        currentProgress: {
          "Complete chore": 0,
        },
        startedAt: 1000000,
      },
    },
  },

  shipments: {},
  gems: {},
  flower: {},
  prototypes: {
    leagues: {
      id: "Sunflower 1-2025-01-01",
      currentLeague: "Sunflower 1",
      points: 0,
      currentLeagueStartDate: new Date().toISOString().split("T")[0],
    },
  },
  bumpkin: {
    equipped: INITIAL_EQUIPMENT as Equipped,
    experience: 1000,

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
  },

  minigames: {
    games: {},
    prizes: {},
  },

  bounties: {
    completed: [
      {
        id: "1",
        soldAt: 100000,
      },
    ],
    requests: [],
  },

  mysteryPrizes: {},
  stockExpiry: {},
  mushrooms: {
    mushrooms: {},
    spawnedAt: 0,
  },

  island: {
    type: "desert",
  },

  home: {
    collectibles: {
      "Big Apple": [
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
      "Festive Tree": [
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
      Fountain: [
        {
          id: "3",
          createdAt: Date.now(),
          coordinates: {
            x: 2,
            y: 2,
          },
          readyAt: Date.now(),
        },
      ],
      "Genie Lamp": [
        {
          id: "3",
          createdAt: Date.now(),
          coordinates: {
            x: 4,
            y: 2,
          },
          readyAt: Date.now(),
        },
      ],
      "Harvest Hourglass": [
        {
          id: "4",
          createdAt: Date.now(),
          coordinates: {
            x: 6,
            y: 2,
          },
          readyAt: Date.now(),
        },
      ],
      "Maneki Neko": [
        {
          id: "3",
          createdAt: Date.now(),
          coordinates: {
            x: 8,
            y: 2,
          },
          readyAt: Date.now(),
        },
      ],
      "Nyon Statue": [
        {
          id: "2",
          createdAt: Date.now(),
          coordinates: {
            x: 10,
            y: 2,
          },
          readyAt: Date.now(),
        },
      ],
      Observatory: [
        {
          id: "1",
          createdAt: Date.now(),
          coordinates: {
            x: 12,
            y: 2,
          },
          readyAt: Date.now(),
        },
      ],
      "Super Totem": [
        {
          id: "1",
          createdAt: Date.now() - 1 * 60 * 60 * 1000,
          coordinates: { x: 14, y: 2 },
          readyAt: Date.now() - 1 * 60 * 60 * 1000,
        },
      ],
      "Time Warp Totem": [
        {
          id: "1",
          createdAt: Date.now(),
          coordinates: { x: 16, y: 2 },
          readyAt: Date.now(),
        },
      ],
      "Tomato Bombard": [
        {
          id: "1",
          createdAt: Date.now(),
          coordinates: { x: 0, y: 0 },
          readyAt: Date.now(),
        },
      ],
      "Wicker Man": [
        {
          id: "1",
          createdAt: Date.now(),
          coordinates: { x: 18, y: 2 },
          readyAt: Date.now(),
        },
      ],
    },
  },
  farmHands: { bumpkins: {} },
  buds: {
    1: {
      coordinates: { x: 0, y: -6 },

      type: "Beach",
      colour: "Beige",
      stem: "3 Leaf Clover",
      aura: "Basic",
      ears: "Ears",

      location: "farm",
    },
  },
  greenhouse: {
    oil: 100,
    pots: {},
  },
  twitter: {
    username: "test",
    linkedAt: Date.now(),
    followedAt: Date.now(),
    isAuthorised: true,
    // verifiedPostsAt: Date.now(),
    tweets: {
      FARM: {
        completedAt: Date.now() - 11 * 24 * 60 * 60 * 1000,
        tweetIds: ["123", "1907659583642059200"],
      },
    },
  },
  createdAt: new Date().getTime(),

  experiments: ["GEM_BOOSTS"],

  faceRecognition: {
    session: {
      createdAt: Date.now() + 1000 * 60 * 60 * 24,
      token: "asdjasdjasdas",
      id: "4baec90a-016b-45ba-84e7-18821e60bcd6",
    },
    history: [
      {
        event: "succeeded",
        createdAt: 1741485282607,
        confidence: 92.26244354248047,
      },
      {
        event: "succeeded",
        createdAt: 1741486992907,
        confidence: 99.609130859375,
      },
      {
        event: "succeeded",
        createdAt: 1741487086973,
        confidence: 28.28019905090332,
      },
      {
        event: "succeeded",
        createdAt: 1741487320584,
        confidence: 78.07962799072266,
      },
      {
        event: "duplicate",
        createdAt: 1741487714959,
        duplicates: [
          {
            similarity: 99.9999008178711,
            faceId: "7c2aff5d-db75-479e-90a2-dd3aaec12d38",
            farmId: 8942600769118096,
          },
          {
            similarity: 99.99977111816406,
            faceId: "cde37bb8-6662-434f-9e6c-d2ef1aa3c5ba",
            farmId: 8942600769118096,
          },
          {
            similarity: 99.9993896484375,
            faceId: "039dd677-dac7-4fd7-9d2e-94dc83bfaa4b",
            farmId: 8942600769118096,
          },
        ],
      },
      {
        event: "succeeded",
        createdAt: 1741487804321,
        confidence: 99.48734283447266,
      },
      {
        event: "failed",
        createdAt: 1741487865726,
        confidence: 0.030025603249669075,
      },
      {
        event: "succeeded",
        createdAt: 1741489478737,
        confidence: 99.84993743896484,
      },
      {
        event: "succeeded",
        createdAt: 1741490701868,
        confidence: 67.58869171142578,
      },
    ],
  },

  conversations: [],

  fishing: {
    dailyAttempts: {},
    wharf: {
      castedAt: 0,
      bait: "Fishing Lure",
      chum: "Carrot",
      caught: {
        "Pink Dolphin": 1,
      },
    },
  },
  mailbox: {
    read: [],
  },

  stock: INITIAL_STOCK(),
  trades: {},
  buildings: {
    Barn: [
      {
        id: "123",
        readyAt: 0,
        coordinates: {
          x: -1,
          y: -8,
        },
        createdAt: 0,
      },
    ],
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
    "Crafting Box": [
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
  },
  crops: {
    "1": {
      x: -2,
      createdAt: 1703364823336,
      y: 0,
      crop: {
        plantedAt: 0,
        name: "Sunflower",
      },
    },
    "2": {
      x: -3,
      createdAt: 1703364823336,
      y: 0,
      crop: {
        plantedAt: 0,
        name: "Sunflower",
        reward: { items: [{ name: "Sunflower Seed", amount: 3 }] },
      },
    },
  },
  collectibles: {
    "Big Orange": [
      {
        id: "123",
        readyAt: 0,
        coordinates: {
          x: 7,
          y: -11,
        },
        createdAt: 0,
      },
    ],
    "Big Apple": [
      {
        id: "123",
        readyAt: 0,
        coordinates: {
          x: 7,
          y: -9,
        },
        createdAt: 0,
      },
    ],
    "Big Banana": [
      {
        id: "123",
        readyAt: 0,
        coordinates: {
          x: 7,
          y: -7,
        },
        createdAt: 0,
      },
    ],
    "Advanced Cooking Pot": [
      {
        id: "123",
        readyAt: 0,
        coordinates: {
          x: 4,
          y: -11,
        },
        createdAt: 0,
      },
    ],
    "Expert Cooking Pot": [
      {
        id: "123",
        readyAt: 0,
        coordinates: {
          x: 4,
          y: -9,
        },
        createdAt: 0,
      },
    ],
    "Basic Cooking Pot": [
      {
        id: "123",
        readyAt: 0,
        coordinates: {
          x: 4,
          y: -7,
        },
        createdAt: 0,
      },
    ],
    Barkley: [
      {
        id: "1",
        createdAt: Date.now(),
        coordinates: { x: 8, y: 3 },
        readyAt: Date.now(),
      },
    ],
    Meowchi: [
      {
        id: "1",
        createdAt: Date.now(),
        coordinates: { x: 9, y: 3 },
        readyAt: Date.now(),
      },
    ],
    "Magic Bean": [
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
    "Festive Tree": [
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
    Fountain: [
      {
        id: "3",
        createdAt: Date.now(),
        coordinates: {
          x: 2,
          y: 2,
        },
        readyAt: Date.now(),
      },
    ],
    "Genie Lamp": [
      {
        id: "3",
        createdAt: Date.now(),
        coordinates: {
          x: 4,
          y: 2,
        },
        readyAt: Date.now(),
      },
    ],
    "Harvest Hourglass": [
      {
        id: "4",
        createdAt: Date.now(),
        coordinates: {
          x: 6,
          y: 2,
        },
        readyAt: Date.now(),
      },
    ],
    "Maneki Neko": [
      {
        id: "3",
        createdAt: Date.now(),
        coordinates: {
          x: 8,
          y: 2,
        },
        readyAt: Date.now(),
      },
    ],
    "Nyon Statue": [
      {
        id: "2",
        createdAt: Date.now(),
        coordinates: {
          x: 10,
          y: 2,
        },
        readyAt: Date.now(),
      },
      {
        id: "1",
        createdAt: 0,
        coordinates: { x: 13, y: 0 },
        readyAt: 0,
      },
    ],
    Observatory: [
      {
        id: "1",
        createdAt: Date.now(),
        coordinates: {
          x: 12,
          y: 2,
        },
        readyAt: Date.now(),
      },
    ],
    "Super Totem": [
      {
        id: "1",
        createdAt: Date.now() - 1 * 60 * 60 * 1000,
        coordinates: { x: 14, y: 2 },
        readyAt: Date.now() - 1 * 60 * 60 * 1000,
      },
    ],
    "Time Warp Totem": [
      {
        id: "1",
        createdAt: Date.now(),
        coordinates: { x: 16, y: 2 },
        readyAt: Date.now(),
      },
    ],
    "Tomato Bombard": [
      {
        id: "1",
        createdAt: Date.now(),
        coordinates: { x: 0, y: 0 },
        readyAt: Date.now(),
      },
    ],
    "Wicker Man": [
      {
        id: "1",
        createdAt: Date.now(),
        coordinates: { x: 18, y: 2 },
        readyAt: Date.now(),
      },
    ],
    "Dr Cow": [
      {
        id: "1",
        createdAt: 0,
        coordinates: { x: 13, y: -5 },
        readyAt: 0,
      },
    ],
    "Nurse Sheep": [
      {
        id: "1",
        createdAt: 0,
        coordinates: { x: 12, y: -5 },
        readyAt: 0,
      },
    ],
    "Pink Dolphin": [
      {
        id: "1",
        createdAt: 0,
        coordinates: { x: 13, y: -5 },
        readyAt: 0,
      },
    ],
    Lunalist: [
      {
        id: "1",
        createdAt: 0,
        coordinates: { x: 13, y: -5 },
        readyAt: 0,
      },
    ],
    "Gourmet Hourglass": [
      {
        id: "1",
        createdAt:
          Date.now() -
          (EXPIRY_COOLDOWNS["Gourmet Hourglass"] as number) +
          30 * 60 * 1000,
        coordinates: {
          x: 3,
          y: -5,
        },
        readyAt: 0,
      },
    ],
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
  pumpkinPlaza: {
    blockchainBox: {
      openedAt: Date.now(),
      tier: "gold",
      items: {},
      vipDays: 1,
    },
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
  npcs: {
    bert: {
      deliveryCount: 0,
      friendship: {
        updatedAt: 0,
        points: 480,
        giftClaimedAtPoints: 330,
      },
    },
    betty: {
      deliveryCount: 0,
      friendship: {
        updatedAt: 0,
        points: 100000,
        giftClaimedAtPoints: 150,
      },
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
      streak: {
        count: 0,
        collectedAt: Date.now() - 1000 * 60 * 60 * 1,
        totalClaimed: 0,
      },
      grid: [
        [
          {
            x: 0,
            y: 0,
            dugAt: 0,
            items: { Coprolite: 1 },
            tool: "Sand Shovel",
          },
        ],
        [
          {
            x: 1,
            y: 0,
            dugAt: 0,
            items: { Coprolite: 1 },
            tool: "Sand Shovel",
          },

          {
            x: 2,
            y: 0,
            dugAt: 0,
            items: { Coprolite: 1 },
            tool: "Sand Shovel",
          },
        ],
      ],
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
        awakeAt: Date.now(),
        lovedAt: Date.now(),
        item: "Petting Hand",
        reward: {
          items: [{ name: "Love Chicken", amount: 1 }],
        },
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
        asleepAt: 0,
        awakeAt: 0,
        lovedAt: 0,
        item: "Petting Hand",
      },
      "3": {
        id: "4",
        type: "Sheep",
        state: "idle",
        createdAt: 0,
        experience: 120,
        asleepAt: Date.now() - 1000 * 60 * 60 * 12,
        awakeAt: Date.now() + 1000 * 60 * 60 * 12,
        lovedAt: 0,
        item: "Petting Hand",
      },
      "4": {
        id: "4",
        type: "Sheep",
        state: "idle",
        createdAt: 0,
        experience: 120,
        asleepAt: Date.now(),
        awakeAt: Date.now() + 1000 * 60 * 60 * 12,
        lovedAt: 0,
        item: "Petting Hand",
      },
      "2": {
        id: "2",
        type: "Cow",
        state: "idle",
        createdAt: 0,
        experience: 800,
        asleepAt: Date.now() - 1000 * 60 * 60 * 12,
        awakeAt: Date.now(),
        lovedAt: Date.now(),
        item: "Petting Hand",
      },
    },
  },
  waterWell: {
    level: 1,
  },
  craftingBox: {
    status: "idle",
    startedAt: 0,
    readyAt: 0,
    recipes: {},
  },
  season: {
    season: "spring",
    startedAt: new Date("2025-04-22").getTime(),
  },
  ban: {
    status: "ok",
  },
  floatingIsland: {
    boughtAt: {},
    schedule: [
      {
        startAt: Date.now(),
        endAt: Date.now() + 1000 * 60 * 30,
      },
      {
        startAt: Date.now() + 24 * 60 * 60 * 1000,
        endAt: Date.now() + 24 * 60 * 60 * 1000 + 1000 * 60 * 30,
      },
    ],
    shop: {
      "Bronze Love Box": {
        name: "Bronze Love Box",
        cost: {
          items: {
            "Love Charm": 100,
          },
        },
        type: "collectible",
      },
    },
  },
  roninRewards: {
    onchain: {
      openedAt: Date.now(),
      pack: "Bronze Pack",
    },
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
    villageProjects: {
      "Basic Cooking Pot": { cheers: 10 },
      "Expert Cooking Pot": { cheers: 50 },
      "Advanced Cooking Pot": { cheers: 100 },
      "Big Orange": { cheers: 25 },
      "Big Apple": { cheers: 50 },
      "Big Banana": { cheers: 200 },
    },
    cheersGiven: {
      date: new Date().toISOString().split("T")[0],
      projects: {},
      farms: [],
    },
    cheers: {
      freeCheersClaimedAt: Date.now(),
    },
    clutter: {
      spawnedAt: 0,
      locations: {
        "1": {
          x: 1,
          y: 1,
          type: "Trash",
        },
      },
    },
  },
  pets: {
    common: {},
    nfts: {
      5: {
        id: 5,
        traits: {
          type: "Dragon",
          fur: "Blue",
          accessory: "Crown",
          bib: "Baby Bib",
          aura: "No Aura",
        },
        experience: 120,
        energy: 0,
        name: "Pet #1",
        pettedAt: 0,
        requests: {
          food: [],
          fedAt: 0,
        },
      },
    },
  },
};
