/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
import Decimal from "decimal.js-light";
import { GameState } from "../types/game";

import {
  INITIAL_BUMPKIN,
  INITIAL_CHORE_BOARD,
  INITIAL_RESOURCES,
  INITIAL_STOCK,
} from "./constants";
import { getKeys } from "./crafting";
import { makeAnimalBuilding } from "./animals";
import { getChapterTicket } from "../types/chapters";

export const STATIC_OFFLINE_FARM: GameState = {
  settings: {},
  coins: 100000,
  balance: new Decimal(1000),
  previousBalance: new Decimal(0),
  inventory: {
    "Easter Token 2025": new Decimal(500),
    Marty: new Decimal(2),
    "Paw Prints Raffle Ticket": new Decimal(100),
    "Pet Cookie": new Decimal(100),
    Miffy: new Decimal(2),
    Morty: new Decimal(2),
    Mog: new Decimal(2),
    "Town Center": new Decimal(1),
    Market: new Decimal(1),
    Workbench: new Decimal(1),
    "Basic Land": new Decimal(9),
    "Crop Plot": new Decimal(getKeys(INITIAL_RESOURCES.crops).length),
    Tree: new Decimal(getKeys(INITIAL_RESOURCES.trees).length),
    "Stone Rock": new Decimal(getKeys(INITIAL_RESOURCES.stones).length),
    Axe: new Decimal(10),
    Gem: new Decimal(10000),
    Rug: new Decimal(1),
    Wardrobe: new Decimal(1),
    Shovel: new Decimal(1),
    "Giant Isopod": new Decimal(1),
    Nautilus: new Decimal(1),
    Dollocaris: new Decimal(1),
    "Time Warp Totem": new Decimal(1),
    // "Lifetime Farmer Banner": new Decimal(1),
    Barkley: new Decimal(1),
    Meowchi: new Decimal(1),
    "Pet House": new Decimal(1),
    Rhubarb: new Decimal(50),
    "Pumpkin Soup": new Decimal(50),
    Sunflower: new Decimal(50),
  },
  previousInventory: {},
  wardrobe: {
    "Paw Aura": 1,
  },
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
  bumpkin: {
    ...INITIAL_BUMPKIN,
    experience: 1000000,
    equipped: {
      ...INITIAL_BUMPKIN.equipped,
      aura: "Paw Aura",
    },
  },

  minigames: {
    games: {
      "easter-eggstravaganza": {
        history: {},
        highscore: 0,
      },
    },
    prizes: {},
  },
  raffle: {
    active: {
      "1": {
        entries: 100,
        endAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
        items: {},
      },
    },
  },
  bounties: {
    completed: [],
    requests: [
      {
        id: "21",
        name: "Red Balloon Flower",
        items: { "Pet Cookie": 15 },
      },
      {
        id: "1",
        name: "Cow",
        level: 1,
        items: { [getChapterTicket(Date.now())]: 1 },
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
        items: { [getChapterTicket(Date.now())]: 1 },
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

  dailyRewards: {
    streaks: 1,
    chest: {
      collectedAt: new Date("2026-01-08").getTime(),
      code: 1,
    },
  },

  farmActivity: {
    "Starlight Tuna Map Piece Found": 8,
    "Daily Reward Collected": 1,
    "Pet Cookie Collected": 2250,
    "Paw Prints Points Earned": 930,
    "Paw Prints free Milestone Claimed": 4,
    "welcome Bonus Claimed": 1,
  },

  fishing: {
    dailyAttempts: {},
    wharf: {
      maps: {
        "Starlight Tuna": 1,
      },
      castedAt: 100011000,
      caught: {
        Anchovy: 1,
      },
      chum: "Earthworm",
      multiplier: 1,
      guaranteedCatch: "Anchovy",
    },
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

    Barn: [
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
        from: "tywin",
        reward: {
          items: {
            "Pet Cookie": 1,
          },
          coins: 0,
        },
        id: "3",
        items: {},
      },
    ],
    milestone: {
      goal: 10,
      total: 10,
    },
  },

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
  username: "hero",
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
