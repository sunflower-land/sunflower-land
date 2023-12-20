import Decimal from "decimal.js-light";
import { GameState, Inventory } from "../types/game";
import { BumpkinLevel } from "features/game/lib/level";
import { getEnabledNodeCount } from "../expansion/lib/expansionNodes";
import { INITIAL_BUMPKIN, INITIAL_BUMPKIN_LEVEL } from "./bumpkinData";
import { makeMegaStoreAvailableDates } from "./constants";
export const INITIAL_RESOURCES: Pick<
  GameState,
  | "crops"
  | "trees"
  | "stones"
  | "iron"
  | "gold"
  | "fruitPatches"
  | "flowers"
  | "crimstones"
  | "fruitPatches"
  | "sunstones"
  | "beehives"
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
      crop: { name: "Pumpkin", plantedAt: 0, amount: 1 },
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
      height: 1,
      width: 1,
    },
    2: {
      stone: {
        amount: 1,
        minedAt: 0,
      },
      x: 3,
      y: 6,
      height: 1,
      width: 1,
    },
  },
  gold: {
    1: {
      stone: {
        amount: 1,
        minedAt: 0,
      },
      x: 7,
      y: 3,
      height: 1,
      width: 1,
    },
  },
  iron: {
    1: {
      stone: {
        amount: 1,
        minedAt: 0,
      },
      x: 7,
      y: 3,
      height: 1,
      width: 1,
    },
  },
  beehives: {},
  flowers: {
    discovered: {},
    flowerBeds: {},
  },
  sunstones: {},
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
  "Gold Pickaxe": new Decimal(5),
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
const OFFLINE_FARM_CRIMSTONE = getEnabledNodeCount(
  INITIAL_BUMPKIN_LEVEL as BumpkinLevel,
  "Crimstone Rock"
);

const OFFLINE_FARM_SUNSTONE = getEnabledNodeCount(
  INITIAL_BUMPKIN_LEVEL as BumpkinLevel,
  "Sunstone Rock"
);
const OFFLINE_FARM_FRUIT = getEnabledNodeCount(
  INITIAL_BUMPKIN_LEVEL as BumpkinLevel,
  "Fruit Patch"
);

export const STATIC_OFFLINE_FARM: GameState = {
  home: {
    collectibles: {
      Wardrobe: [
        {
          id: "a3f26ad7",
          createdAt: 1704754128378,
          coordinates: {
            x: 1,
            y: 3,
          },
          readyAt: 1704754128378,
        },
      ],
      Rug: [
        {
          id: "16930e51",
          createdAt: 1704754143012,
          coordinates: {
            x: 0,
            y: 2,
          },
          readyAt: 1704754143012,
        },
      ],
    },
  },
  island: {
    type: "basic",
  },
  mysteryPrizes: {},
  mushrooms: {
    mushrooms: {
      1: {
        amount: 1,
        name: "Wild Mushroom",
        x: -18,
        y: 5,
      },
      2: {
        amount: 1,
        name: "Wild Mushroom",
        x: -18,
        y: 4,
      },
      3: {
        amount: 1,
        name: "Wild Mushroom",
        x: -19,
        y: 4,
      },
      4: {
        amount: 1,
        name: "Wild Mushroom",
        x: -19,
        y: 5,
      },
      5: {
        amount: 1,
        name: "Wild Mushroom",
        x: -19,
        y: 6,
      },
    },
    spawnedAt: 0,
  },
  farmHands: { bumpkins: {} },
  bumpkin: { ...INITIAL_BUMPKIN, experience: 100 },
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
  balance: new Decimal(100),
  previousBalance: new Decimal(0),
  previousInventory: {},
  npcs: {
    "pumpkin' pete": {
      deliveryCount: 0,
      friendship: {
        points: 0,
        updatedAt: 0,
        giftClaimedAtPoints: 0,
        giftedAt: new Date("2024-02-14T01:00:00").getTime(),
      },
    },
  },
  inventory: {
    "Treasure Key": new Decimal(1),
    "Earn Alliance Banner": new Decimal(1),
    "Farmhand Coupon": new Decimal(1),
    "Sunpetal Seed": new Decimal(100),
    "White Festive Fox": new Decimal(3),
    "Red Pansy": new Decimal(3),
    "White Pansy": new Decimal(3),
    "Yellow Pansy": new Decimal(3),
    "Blue Pansy": new Decimal(3),
    "Blue Daffodil": new Decimal(3),
    "Yellow Daffodil": new Decimal(3),
    "White Daffodil": new Decimal(3),
    "Red Daffodil": new Decimal(3),
    Sunflower: new Decimal(1000),
    Scarecrow: new Decimal(1),
    Shovel: new Decimal(1),
    Carrot: new Decimal(5),
    Rug: new Decimal(1),
    Wardrobe: new Decimal(1),
    "Abandoned Bear": new Decimal(10),
    "Chef Bear": new Decimal(10),
    "Grinx's Hammer": new Decimal(1),
    Rod: new Decimal(20),
    Earthworm: new Decimal(10),
    "Bumpkin Nutcracker": new Decimal(1),
    "Festive Tree": new Decimal(1),
    "Town Center": new Decimal(1),
    Market: new Decimal(1),
    Workbench: new Decimal(1),
    "Basic Land": new Decimal(9),
    Gold: new Decimal(13),
    "Gold Pass": new Decimal(1),
    "Crop Plot": new Decimal(OFFLINE_FARM_CROPS),
    "Water Well": new Decimal(4),
    Tree: new Decimal(3),
    Blossombeard: new Decimal(1),
    "Carrot Cake": new Decimal(1),
    "Stone Rock": new Decimal(2),
    "Iron Rock": new Decimal(OFFLINE_FARM_IRON),
    "Gold Rock": new Decimal(OFFLINE_FARM_GOLD),
    "Crimstone Rock": new Decimal(0),
    "Sunstone Rock": new Decimal(0),
    "Fruit Patch": new Decimal(0),
    Egg: new Decimal(12),
    Beehive: new Decimal(0),
    Banana: new Decimal(12),
    Wood: new Decimal(500),
    Crimstone: new Decimal(20),
    "Block Buck": new Decimal(20),
    Stone: new Decimal(100),
    Iron: new Decimal(100),
    "Mermaid Scale": new Decimal(1000),
    "Humming Bird": new Decimal(1),
    "Queen Bee": new Decimal(1),
    "Flower Fox": new Decimal(1),
    "Hungry Caterpillar": new Decimal(1),
    "Sunrise Bloom Rug": new Decimal(1),
    "Flower Rug": new Decimal(1),
    "Blossom Royale": new Decimal(1),
    Rainbow: new Decimal(1),
    "Enchanted Rose": new Decimal(1),
    "Flower Cart": new Decimal(1),
    Capybara: new Decimal(1),
  },
  wardrobe: {
    "Elf Suit": 1,
    "Banana Onesie": 1,
    "Beige Farmer Potion": 2,
    "Fire Hair": 3,
    "Basic Hair": 1,
    "Red Farmer Shirt": 2,
    "Blue Farmer Shirt": 1,
    "Brown Suspenders": 1,

    "Black Farmer Boots": 1,
    "Farmer Pitchfork": 1,
    "Farm Background": 1,
    "Santa Beard": 1,
    "Sunflower Amulet": 2,
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
  chickens: {},
  trades: {},
  buildings: {
    House: [
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
    fulfilledCount: 10,
    orders: [
      {
        createdAt: Date.now(),
        readyAt: Date.now(),
        from: "pumpkin' pete",
        reward: {
          items: {},
          sfl: 0.12,
        },
        id: "1",
        items: {
          Sunflower: 20,
        },
      },
      // {
      //   createdAt: Date.now(),
      //   readyAt: Date.now(),
      //   from: "grimbly",
      //   reward: {
      //     items: {},
      //     sfl: 0.15,
      //   },
      //   id: "3",
      //   items: {
      //     Potato: 2,
      //   },
      // },
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
      claimedAt: new Date("2024-02-15").getTime(),
    },
  },

  farmActivity: {},
  milestones: {},
  catchTheKraken: {
    hunger: "Iron",
    weeklyCatches: {},
  },
  megastore: {
    available: makeMegaStoreAvailableDates(),
    collectibles: [],
    wearables: [],
  },
  airdrops: [],
  username: "Local Hero",
  springBlossom: {},
  specialEvents: {
    current: {},
    history: {},
  },
};
