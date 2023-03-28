import Decimal from "decimal.js-light";
import { CHORES } from "../types/chores";
import { Bumpkin, GameState, Inventory, LandExpansion } from "../types/game";

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

const INITIAL_EXPANSIONS: LandExpansion[] = [
  {
    createdAt: 2,
    readyAt: 0,

    plots: {
      0: {
        x: -2,
        y: -1,
        height: 1,
        width: 1,
      },
      1: {
        x: -1,
        y: -1,
        height: 1,
        width: 1,
      },
      2: {
        x: 0,
        y: -1,
        height: 1,
        width: 1,
      },
      3: {
        crop: { name: "Sunflower", plantedAt: 0 },
        x: -2,
        y: 0,
        height: 1,
        width: 1,
      },
      4: {
        crop: {
          name: "Sunflower",
          plantedAt: 0,
          reward: {
            items: [
              {
                name: "Sunflower Seed",
                amount: 1,
              },
            ],
          },
        },
        x: -1,
        y: 0,
        height: 1,
        width: 1,
      },
      5: {
        crop: { name: "Sunflower", plantedAt: 0 },
        x: 0,
        y: 0,
        height: 1,
        width: 1,
      },
      6: {
        x: -2,
        y: 1,
        height: 1,
        width: 1,
      },
      7: {
        x: -1,
        y: 1,
        height: 1,
        width: 1,
      },
      8: {
        x: 0,
        y: 1,
        height: 1,
        width: 1,
      },
    },

    trees: {
      0: {
        x: -3,
        y: 3,
        height: 2,
        width: 2,
        wood: {
          amount: 0,
          choppedAt: 0,
        },
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
    },
    iron: {
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
  },

  {
    createdAt: 3,
    readyAt: 0,

    plots: {},

    trees: {
      0: {
        wood: {
          amount: 3,
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
  },
  {
    createdAt: 4,
    readyAt: 0,

    plots: {
      0: {
        x: -2,
        y: -1,
        height: 1,
        width: 1,
      },
      1: {
        x: -1,
        y: -1,
        height: 1,
        width: 1,
      },
      2: {
        x: -2,
        y: -2,
        height: 1,
        width: 1,
      },
      3: {
        x: -1,
        y: -2,
        height: 1,
        width: 1,
      },
    },

    trees: {
      0: {
        wood: {
          amount: 3,
          choppedAt: 0,
        },
        x: 1,
        y: 1,
        height: 2,
        width: 2,
      },
    },
  },
];

const INITIAL_BUMPKIN: Bumpkin = {
  id: 1,
  experience: 1220501,
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
    "Fire Pit": new Decimal(1),
    Market: new Decimal(1),
    Artist: new Decimal(1),
    Sunflower: new Decimal(2999),
    Wood: new Decimal(100),
    Stone: new Decimal(50),
    Axe: new Decimal(10),
    "Rusty Shovel": new Decimal(10),
    "Bumpkin Salad": new Decimal(1),
    "Beta Pass": new Decimal(1),
    "Peeled Potato": new Decimal(1),
    "Wood Nymph Wendy": new Decimal(1),
    "Cabbage Boy": new Decimal(1),
    "Cabbage Girl": new Decimal(1),
    "Basic Bear": new Decimal(1),
    "Magic Bean": new Decimal(5),
    "Christmas Snow Globe": new Decimal(1),
    // ...getKeys(KNOWN_IDS).reduce(
    //   (acc, name) => ({
    //     ...acc,
    //     [name]: new Decimal(1),
    //   }),
    //   {}
    // ),
    "Block Buck": new Decimal(1),
    "Maneki Neko": new Decimal(1),
    "Rainbow Artist Bear": new Decimal(1),
    Coder: new Decimal(0),
    "Solar Flare Ticket": new Decimal(10),
    "Discord Mod": new Decimal(0),
    Warrior: new Decimal(0),
    Gold: new Decimal(50),
    "Immortal Pear": new Decimal(1),
    Pipi: new Decimal(1),
    "Heart of Davy Jones": new Decimal(1),
    "Treasure Map": new Decimal(1),
    "Love Letter": new Decimal(1),
    "Blossom Tree": new Decimal(1),
    Flamingo: new Decimal(1),
    "Heart Balloons": new Decimal(1),
    Karkinos: new Decimal(10),
  },
  migrated: true,
  stock: INITIAL_STOCK,
  chickens: {},
  stockExpiry: {},

  expansions: INITIAL_EXPANSIONS,
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
    resources: [
      {
        amount: new Decimal(10),
        item: "Wood",
      },
    ],
    seconds: 60,
    sfl: new Decimal(0),
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
};
