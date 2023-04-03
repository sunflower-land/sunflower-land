import Decimal from "decimal.js-light";
import { CHORES } from "../types/chores";
import {
  Bumpkin,
  GameState,
  Inventory,
  ExpansionConstruction,
} from "../types/game";

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
  "Shiny Bean": new Decimal(5),
  "Golden Bean": new Decimal(5),

  "Immortal Pear": new Decimal(1),
};
export type ResourceFieldName =
  | "trees"
  | "stones"
  | "iron"
  | "gold"
  | "crops"
  | "fruitPatches";

export const INITIAL_RESOURCES: Pick<GameState, ResourceFieldName> = {
  crops: {
    0: {
      createdAt: Date.now(),
      x: -2,
      y: -1,
      height: 1,
      width: 1,
    },
    1: {
      createdAt: Date.now(),
      x: -1,
      y: -1,
      height: 1,
      width: 1,
    },
    2: {
      createdAt: Date.now(),
      x: 0,
      y: -1,
      height: 1,
      width: 1,
    },
    3: {
      createdAt: Date.now(),
      crop: { name: "Sunflower", plantedAt: 0, amount: 1 },
      x: -2,
      y: 0,
      height: 1,
      width: 1,
    },
    4: {
      createdAt: Date.now(),
      crop: { name: "Sunflower", plantedAt: 0, amount: 1 },
      x: -1,
      y: 0,
      height: 1,
      width: 1,
    },
    5: {
      createdAt: Date.now(),
      crop: { name: "Sunflower", plantedAt: 0, amount: 1 },
      x: 0,
      y: 0,
      height: 1,
      width: 1,
    },
    6: {
      createdAt: Date.now(),
      x: -2,
      y: 1,
      height: 1,
      width: 1,
    },
    7: {
      createdAt: Date.now(),
      x: -1,
      y: 1,
      height: 1,
      width: 1,
    },
    8: {
      createdAt: Date.now(),
      x: 0,
      y: 1,
      height: 1,
      width: 1,
    },
    9: {
      createdAt: Date.now(),
      x: -2,
      y: -1,
      height: 1,
      width: 1,
    },
    10: {
      createdAt: Date.now(),
      x: -1,
      y: -1,
      height: 1,
      width: 1,
    },
    11: {
      createdAt: Date.now(),
      x: -2,
      y: -2,
      height: 1,
      width: 1,
    },
    12: {
      createdAt: Date.now(),
      x: -1,
      y: -2,
      height: 1,
      width: 1,
    },
  },
  trees: {
    0: {
      wood: {
        amount: 1,
        choppedAt: 0,
      },
      x: -3,
      y: 3,
      height: 2,
      width: 2,
    },
    1: {
      wood: {
        amount: 1,
        choppedAt: 0,
      },
      x: 1,
      y: 1,
      height: 2,
      width: 2,
    },
    2: {
      wood: {
        amount: 1,
        choppedAt: 0,
      },
      x: 1,
      y: 1,
      height: 2,
      width: 2,
    },
  },
  stones: {
    0: {
      x: 0,
      y: 3,
      width: 1,
      height: 1,
      stone: {
        amount: 1,
        minedAt: 0,
      },
    },
    1: {
      x: 1,
      y: -2,
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

const INITIAL_EXPANSIONS: ExpansionConstruction[] = [
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
  {
    createdAt: 4,
    readyAt: Date.now() + 5000,
  },
];

const INITIAL_BUMPKIN: Bumpkin = {
  id: 1,
  experience: 2000,
  tokenUri: "bla",
  equipped: {
    body: "Beige Farmer Potion",
    hair: "Basic Hair",
    // shirt: "Lifeguard Shirt",
    // pants: "Lifeguard Pants",
    dress: "Tropical Sarong",
    hat: "Sleeping Otter",
    shoes: "Black Farmer Boots",
    tool: "Farmer Pitchfork",
    background: "Farm Background",
  },
  skills: {},
  achievements: {
    "Busy Bumpkin": 1,
  },
  activity: {
    "Reindeer Carrot Fed": 50,
  },
};

export const OFFLINE_FARM: GameState = {
  balance: new Decimal(10),
  inventory: {
    "White Tulips": new Decimal(10),
    Artist: new Decimal(1),
    Sunflower: new Decimal(2999),
    Wood: new Decimal(100),
    Stone: new Decimal(50),
    Axe: new Decimal(10),
    "Maneki Neko": new Decimal(2),
    "Lunar Calendar": new Decimal(1),
    "Pablo The Bunny": new Decimal(1),
    "Easter Bear": new Decimal(1),

    Tree: new Decimal(5),
    "Stone Rock": new Decimal(3),
    "Iron Rock": new Decimal(3),
    "Fruit Patch": new Decimal(3),
    "Gold Rock": new Decimal(3),
    "Crop Plot": new Decimal(23),
    "Basic Land": new Decimal(17),
    "Easter Bush": new Decimal(3),
    // ...getKeys(KNOWN_IDS).reduce(
    //   (acc, name) => ({
    //     ...acc,
    //     [name]: new Decimal(1),
    //   }),
    //   {}
    // ),
    "Block Buck": new Decimal(1),
  },
  migrated: true,
  stock: INITIAL_STOCK,
  chickens: {},
  stockExpiry: {},

  expansionConstruction: {
    createdAt: Date.now(),
    readyAt: Date.now() + 5000,
  },

  buildings: {
    "Fire Pit": [
      {
        id: "123",
        readyAt: 0,
        crafting: {
          name: "Reindeer Carrot",
          readyAt: 1671116097193,
        },
        coordinates: {
          x: 4,
          y: 8,
        },
        createdAt: 0,
      },
    ],
    "Hen House": [
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
  },
  airdrops: [],
  collectibles: {
    "Maneki Neko": [
      {
        coordinates: {
          x: 4,
          y: -1,
        },
        createdAt: Date.now() - 12 * 60 * 60 * 1000,
        id: "0",
        readyAt: 0,
        shakenAt: Date.now() - 24 * 60 * 60 * 1000 + 60 * 1000,
      },
    ],
  },
  mysteryPrizes: {},
  bumpkin: {
    ...INITIAL_BUMPKIN,
    activity: {
      "Sunflower Harvested": 24,
    },
  },
  pumpkinPlaza: {},
  tradeOffer: {
    amount: 1,
    endAt: new Date(Date.now() + 100000000000000).toISOString(),
    startAt: new Date().toISOString(),
    name: "Algerian Flag",
    ingredients: [],
  },
  dailyRewards: {},
  treasureIsland: {
    holes: {},
    rareTreasure: {
      discoveredAt: 0,
      holeId: 1,
      reward: "Sunflower Cake",
    },
  },
  hayseedHank: {
    choresCompleted: 0,
    chore: CHORES[0],
  },
  easterHunt: {
    generatedAt: Date.now() - 1000,
    eggs: [
      {
        name: "Blue Egg",
        x: -2,
        y: 3,
        island: "Bunny Trove",
      },
      {
        name: "Blue Egg",
        x: 6.8,
        y: -0.69,
        island: "Bunny Trove",
      },
      {
        name: "Blue Egg",
        x: 4.5,
        y: 2.5,
        island: "Bunny Trove",
      },
      {
        name: "Blue Egg",
        x: 1.0,
        y: 8.5,
        island: "Bunny Trove",
      },
      {
        name: "Blue Egg",
        x: -13,
        y: 3.8,
        island: "Bunny Trove",
      },
      {
        name: "Blue Egg",
        x: 4,
        y: 4,
        island: "Bunny Trove",
      },
      {
        name: "Blue Egg",
        x: -8,
        y: 2,
        island: "Bunny Trove",
      },
      {
        name: "Blue Egg",
        x: -1,
        y: 6,
        island: "Bunny Trove",
      },
      {
        name: "Blue Egg",
        x: -4.3,
        y: 6,
        island: "Bunny Trove",
      },
      {
        name: "Blue Egg",
        x: -0.5,
        y: 6,
        island: "Helios",
      },
      {
        name: "Pink Egg",
        x: 4.1,
        y: -2,
        island: "Helios",
      },
      {
        name: "Pink Egg",
        x: 3,
        y: -8,
        island: "Helios",
      },
      {
        name: "Pink Egg",
        x: -8,
        y: -4,
        island: "Helios",
      },
      {
        name: "Pink Egg",
        x: 0,
        y: 0,
        island: "Helios",
      },
      {
        name: "Pink Egg",
        x: -10,
        y: -10,
        island: "Main",
      },
    ],
  },
  grubShop: {
    opensAt: new Date("2022-10-05").getTime(),
    closesAt: new Date("2023-10-08").getTime(),
    orders: [
      {
        id: "asdj123",
        name: "Boiled Eggs",
        sfl: new Decimal(10),
      },
      {
        id: "asdasd",
        name: "Beetroot Cake",
        sfl: new Decimal(20),
      },
      {
        id: "3",
        name: "Sunflower Cake",
        sfl: new Decimal(20),
      },
      {
        id: "4",
        name: "Bumpkin Broth",
        sfl: new Decimal(20),
      },
      {
        id: "5",
        name: "Mashed Potato",
        sfl: new Decimal(20),
      },
      {
        id: "6",
        name: "Wheat Cake",
        sfl: new Decimal(20),
      },
      {
        id: "7",
        name: "Pumpkin Soup",
        sfl: new Decimal(20),
      },
      {
        id: "8",
        name: "Mashed Potato",
        sfl: new Decimal(20),
      },
      {
        id: "asdj123",
        name: "Boiled Eggs",
        sfl: new Decimal(10),
      },
      {
        id: "asdasd",
        name: "Beetroot Cake",
        sfl: new Decimal(20),
      },
      {
        id: "3",
        name: "Sunflower Cake",
        sfl: new Decimal(20),
      },
      {
        id: "4",
        name: "Bumpkin Broth",
        sfl: new Decimal(20),
      },
      {
        id: "5",
        name: "Mashed Potato",
        sfl: new Decimal(20),
      },
      {
        id: "6",
        name: "Wheat Cake",
        sfl: new Decimal(20),
      },
      {
        id: "7",
        name: "Pumpkin Soup",
        sfl: new Decimal(20),
      },
      {
        id: "8",
        name: "Mashed Potato",
        sfl: new Decimal(20),
      },
    ],
  },
  expansionRequirements: {
    bumpkinLevel: 20,
    resources: { Wood: 30 },
    seconds: 60,
  },
  auctioneer: {
    bid: {
      bidAt: Date.now(),
      ingredients: {
        Gold: 5,
      },
      item: "Peeled Potato",
      sfl: 10,
      auctionTickets: 10,
    },
  },
  gold: {
    "0": {
      height: 1,
      width: 1,
      stone: {
        amount: 1,
        minedAt: 0,
      },
      x: -3,
      y: 2,
    },
  },
  fruitPatches: {
    0: {
      x: 6,
      y: 3,
      width: 2,
      height: 2,
      fruit: {
        amount: 1,
        harvestedAt: 0,
        harvestsLeft: 3,
        name: "Apple",
        plantedAt: 0,
      },
    },
  },
  iron: {
    0: {
      x: 4,
      y: 0,
      width: 1,
      height: 1,
      stone: {
        amount: 1,
        minedAt: 0,
      },
    },
  },
  crops: {
    0: {
      createdAt: Date.now(),
      x: -2,
      y: -1,
      height: 1,
      width: 1,
    },
    1: {
      createdAt: Date.now(),
      x: -1,
      y: -1,
      height: 1,
      width: 1,
    },
    2: {
      createdAt: Date.now(),
      x: -2,
      y: -2,
      height: 1,
      width: 1,
    },
    3: {
      createdAt: Date.now(),
      x: -1,
      y: -2,
      height: 1,
      width: 1,
    },
  },
  trees: {
    0: {
      x: -1,
      y: 1,
      width: 2,
      height: 2,
      wood: {
        amount: 1,
        choppedAt: 0,
      },
    },
  },
  stones: {
    0: {
      x: 1,
      y: 3,
      width: 1,
      height: 1,
      stone: {
        amount: 1,
        minedAt: 0,
      },
    },
  },
};
