import Decimal from "decimal.js-light";
import { CHORES } from "../types/chores";
import { Bumpkin, GameState, Inventory } from "../types/game";
import { getKeys } from "../types/craftables";
import { marketRate } from "./halvening";

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
  Sunflower: new Decimal(2000),
  Wheat: new Decimal(200),
  Egg: new Decimal(200),

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

export const INITIAL_RESOURCES: Pick<
  GameState,
  "crops" | "trees" | "stones" | "iron" | "gold" | "fruitPatches"
> = {
  crops: {
    1: {
      createdAt: Date.now(),
      crop: { name: "Sunflower", plantedAt: 0, amount: 1 },
      x: -8,
      y: -5,
      height: 1,
      width: 1,
    },
    11: {
      createdAt: Date.now(),
      crop: { name: "Sunflower", plantedAt: 0, amount: 1 },
      x: -7,
      y: -5,
      height: 1,
      width: 1,
    },
    111: {
      createdAt: Date.now(),
      crop: { name: "Sunflower", plantedAt: 0, amount: 1 },
      x: -6,
      y: -5,
      height: 1,
      width: 1,
    },
    1111: {
      createdAt: Date.now(),
      crop: { name: "Sunflower", plantedAt: 0, amount: 1 },
      x: -5,
      y: -5,
      height: 1,
      width: 1,
    },
    11111: {
      createdAt: Date.now(),
      crop: { name: "Sunflower", plantedAt: 0, amount: 1 },
      x: -4,
      y: -5,
      height: 1,
      width: 1,
    },
    11112: {
      createdAt: Date.now(),
      crop: { name: "Sunflower", plantedAt: 0, amount: 1 },
      x: -3,
      y: -5,
      height: 1,
      width: 1,
    },
    11113: {
      createdAt: Date.now(),
      crop: { name: "Sunflower", plantedAt: 0, amount: 1 },
      x: -2,
      y: -5,
      height: 1,
      width: 1,
    },
    11114: {
      createdAt: Date.now(),
      crop: { name: "Sunflower", plantedAt: 0, amount: 1 },
      x: -1,
      y: -5,
      height: 1,
      width: 1,
    },
    2: {
      createdAt: Date.now(),
      crop: { name: "Sunflower", plantedAt: 0, amount: 1 },
      x: -1,
      y: -1,
      height: 1,
      width: 1,
    },
    3: {
      createdAt: Date.now(),
      crop: { name: "Sunflower", plantedAt: 0, amount: 1 },
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
      crop: { name: "Sunflower", plantedAt: 0, amount: 1 },
      x: -2,
      y: 1,
      height: 1,
      width: 1,
    },
    8: {
      createdAt: Date.now(),
      crop: { name: "Sunflower", plantedAt: 0, amount: 1 },
      x: -1,
      y: 1,
      height: 1,
      width: 1,
    },
    9: {
      createdAt: Date.now(),
      crop: { name: "Sunflower", plantedAt: 0, amount: 1 },
      x: 0,
      y: 1,
      height: 1,
      width: 1,
    },
    10: {
      createdAt: Date.now(),
      crop: { name: "Sunflower", plantedAt: 0, amount: 1 },
      x: 6,
      y: -2,
      height: 1,
      width: 1,
    },
    114: {
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
      y: 2,
      width: 1,
      height: 1,
      stone: {
        amount: 1,
        minedAt: 0,
      },
    },
    2: {
      x: 0,
      y: 3,
      width: 1,
      height: 1,
      stone: {
        amount: 1,
        minedAt: 0,
      },
    },
    3: {
      x: 0,
      y: 4,
      width: 1,
      height: 1,
      stone: {
        amount: 1,
        minedAt: 0,
      },
    },
    4: {
      x: 0,
      y: 5,
      width: 1,
      height: 1,
      stone: {
        amount: 1,
        minedAt: 0,
      },
    },
    5: {
      x: 0,
      y: 6,
      width: 1,
      height: 1,
      stone: {
        amount: 1,
        minedAt: 0,
      },
    },
    6: {
      x: 0,
      y: 7,
      width: 1,
      height: 1,
      stone: {
        amount: 1,
        minedAt: 0,
      },
    },
    7: {
      x: 0,
      y: 8,
      width: 1,
      height: 1,
      stone: {
        amount: 1,
        minedAt: 0,
      },
    },
    8: {
      x: 0,
      y: 9,
      width: 1,
      height: 1,
      stone: {
        amount: 1,
        minedAt: 0,
      },
    },
    9: {
      x: 0,
      y: 10,
      width: 1,
      height: 1,
      stone: {
        amount: 1,
        minedAt: 0,
      },
    },
  },
  fruitPatches: {},
  gold: {
    1: {
      x: 2,
      y: 2,
      width: 1,
      height: 1,
      stone: {
        amount: 1,
        minedAt: 0,
      },
    },
    2: {
      x: 2,
      y: 3,
      width: 1,
      height: 1,
      stone: {
        amount: 1,
        minedAt: 0,
      },
    },
    3: {
      x: 2,
      y: 4,
      width: 1,
      height: 1,
      stone: {
        amount: 1,
        minedAt: 0,
      },
    },
    4: {
      x: 2,
      y: 5,
      width: 1,
      height: 1,
      stone: {
        amount: 1,
        minedAt: 0,
      },
    },
    5: {
      x: 2,
      y: 6,
      width: 1,
      height: 1,
      stone: {
        amount: 1,
        minedAt: 0,
      },
    },
    6: {
      x: 2,
      y: 7,
      width: 1,
      height: 1,
      stone: {
        amount: 1,
        minedAt: 0,
      },
    },
    7: {
      x: 2,
      y: 8,
      width: 1,
      height: 1,
      stone: {
        amount: 1,
        minedAt: 0,
      },
    },
    8: {
      x: 2,
      y: 9,
      width: 1,
      height: 1,
      stone: {
        amount: 1,
        minedAt: 0,
      },
    },
    9: {
      x: 2,
      y: 10,
      width: 1,
      height: 1,
      stone: {
        amount: 1,
        minedAt: 0,
      },
    },
  },
  iron: {
    1: {
      x: 1,
      y: 2,
      width: 1,
      height: 1,
      stone: {
        amount: 1,
        minedAt: 0,
      },
    },
    2: {
      x: 1,
      y: 3,
      width: 1,
      height: 1,
      stone: {
        amount: 1,
        minedAt: 0,
      },
    },
    3: {
      x: 1,
      y: 4,
      width: 1,
      height: 1,
      stone: {
        amount: 1,
        minedAt: 0,
      },
    },
    4: {
      x: 1,
      y: 5,
      width: 1,
      height: 1,
      stone: {
        amount: 1,
        minedAt: 0,
      },
    },
    5: {
      x: 1,
      y: 6,
      width: 1,
      height: 1,
      stone: {
        amount: 1,
        minedAt: 0,
      },
    },
    6: {
      x: 1,
      y: 7,
      width: 1,
      height: 1,
      stone: {
        amount: 1,
        minedAt: 0,
      },
    },
    7: {
      x: 1,
      y: 8,
      width: 1,
      height: 1,
      stone: {
        amount: 1,
        minedAt: 0,
      },
    },
    8: {
      x: 1,
      y: 9,
      width: 1,
      height: 1,
      stone: {
        amount: 1,
        minedAt: 0,
      },
    },
    9: {
      x: 1,
      y: 10,
      width: 1,
      height: 1,
      stone: {
        amount: 1,
        minedAt: 0,
      },
    },
  },
};

export const INITIAL_EXPANSIONS = 3;

const INITIAL_BUMPKIN: Bumpkin = {
  id: 1,
  experience: 3,
  tokenUri: "bla",
  equipped: {
    body: "Beige Farmer Potion",
    hair: "Basic Hair",
    shirt: "Red Farmer Shirt",
    pants: "Brown Suspenders",

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
  dawnBreaker: {
    currentWeek: 1,
    availableLantern: {
      name: "Luminous Lantern",
      startAt: "2023-04-01T00:00:00.000Z",
      endAt: "2023-05-08T00:00:00.000Z",
      sfl: marketRate(5),
      ingredients: {
        Sunflower: new Decimal(1000),
        Wood: new Decimal(10),
      },
    },
    lanternsCraftedByWeek: {
      1: 5,
    },
  },
  balance: new Decimal(1),
  inventory: {
    "Luminous Lantern": new Decimal(5),
    Market: new Decimal(1),
    "Fire Pit": new Decimal(1),
    "Town Center": new Decimal(1),
    Workbench: new Decimal(1),
    "Basic Land": new Decimal(17),
    "Crop Plot": new Decimal(getKeys(INITIAL_RESOURCES.crops).length),
    Tree: new Decimal(getKeys(INITIAL_RESOURCES.trees).length),
    "Stone Rock": new Decimal(getKeys(INITIAL_RESOURCES.stones).length),
    "Mashed Potato": new Decimal(2),
    Gold: new Decimal(15),
    "Wooden Compass": new Decimal(20),
    "Dirt Path": new Decimal(100),
    Fence: new Decimal(50),
    Bush: new Decimal(50),
    Shrub: new Decimal(50),
    "White Tulips": new Decimal(10),
    Artist: new Decimal(1),
    Wood: new Decimal(100),
    Stone: new Decimal(50),
    Axe: new Decimal(10),
    "Rusty Shovel": new Decimal(5),
    "Maneki Neko": new Decimal(2),
    "Lunar Calendar": new Decimal(1),
    "Pablo The Bunny": new Decimal(1),
    "Easter Bear": new Decimal(1),
    "Cabbage Girl": new Decimal(1),
    "Cabbage Boy": new Decimal(1),
    "Stone Pickaxe": new Decimal(10),
    Pickaxe: new Decimal(10),
    "Iron Pickaxe": new Decimal(10),
    Sunflower: new Decimal(2000),
    Wheat: new Decimal(200),
    Egg: new Decimal(200),
    Blueberry: new Decimal(100),

    Kitchen: new Decimal(1),

    "Iron Rock": new Decimal(3),
    "Fruit Patch": new Decimal(3),
    "Gold Rock": new Decimal(3),
    "Easter Bush": new Decimal(3),
    "Block Buck": new Decimal(1),

    "Human War Banner": new Decimal(1),

    "Wild Mushroom": new Decimal(1),
    Eggplant: new Decimal(1),

    "Bonnie's Tombstone": new Decimal(1),
    "Grubnash's Tombstone": new Decimal(1),
    "Crimson Cap": new Decimal(1),
    "Toadstool Seat": new Decimal(1),
    "Chestnut Fungi Stool": new Decimal(1),
    "Mahogany Cap": new Decimal(1),
    Clementine: new Decimal(1),
    Cobalt: new Decimal(1),
    "Dawn Umbrella Seat": new Decimal(1),
    "Eggplant Grill": new Decimal(1),
    "Giant Dawn Mushroom": new Decimal(1),
    "Shroom Glow": new Decimal(1),

    Chicken: new Decimal(5),
    Apple: new Decimal(50),

    "Purple Trail": new Decimal(1),
    Obie: new Decimal(1),
    Maximus: new Decimal(1),
  },

  ...INITIAL_RESOURCES,

  bumpkin: INITIAL_BUMPKIN,

  chickens: {
    "1": {
      multiplier: 1,
      coordinates: { x: 4, y: 4 },
    },
  },

  airdrops: [],

  stock: INITIAL_STOCK,
  conversations: [],

  mailbox: {
    read: [],
  },

  stockExpiry: {},
  dailyRewards: {},

  buildings: {
    "Town Center": [
      {
        coordinates: { x: 3, y: 4 },
        createdAt: 0,
        id: "123",
        readyAt: 0,
      },
    ],
    "Hen House": [
      {
        coordinates: { x: 9, y: 0 },
        createdAt: 0,
        id: "123",
        readyAt: 0,
      },
    ],
    Market: [
      {
        coordinates: { x: 1, y: 0 },
        createdAt: 0,
        id: "123",
        readyAt: 0,
      },
    ],
    Warehouse: [
      {
        coordinates: { x: 0, y: -3 },
        createdAt: 0,
        id: "123",
        readyAt: 0,
      },
    ],
    Workbench: [
      {
        coordinates: { x: 4, y: -6 },
        createdAt: 0,
        id: "123",
        readyAt: 0,
      },
    ],
    Bakery: [
      {
        coordinates: { x: 7, y: -6 },
        createdAt: 0,
        id: "123",
        readyAt: 0,
      },
    ],
    Deli: [
      {
        coordinates: { x: 10, y: -6 },
        createdAt: 0,
        id: "123",
        readyAt: 0,
      },
    ],
    "Fire Pit": [
      {
        coordinates: { x: 10, y: -3 },
        createdAt: 0,
        id: "123",
        readyAt: 0,
      },
    ],
    Kitchen: [
      {
        coordinates: { x: 7, y: -3 },
        createdAt: 0,
        id: "123",
        readyAt: 0,
      },
    ],
    "Smoothie Shack": [
      {
        coordinates: { x: -8, y: -6 },
        createdAt: 0,
        id: "123",
        readyAt: 0,
      },
    ],
    "Water Well": [
      {
        coordinates: { x: -5, y: -6 },
        createdAt: 0,
        id: "123",
        readyAt: 0,
      },
    ],
    Tent: [
      {
        coordinates: { x: -3, y: -6 },
        createdAt: 0,
        id: "123",
        readyAt: 0,
      },
    ],
    Toolshed: [
      {
        coordinates: { x: -0, y: -5 },
        createdAt: 0,
        id: "123",
        readyAt: 0,
      },
    ],
  },
  collectibles: {},
  mysteryPrizes: {},
  pumpkinPlaza: {},
  treasureIsland: {
    holes: {},
  },
  auctioneer: {},
  hayseedHank: {
    chore: CHORES[0],
    choresCompleted: 0,
  },
  mushrooms: {
    spawnedAt: 0,
    mushrooms: {},
  },
};
