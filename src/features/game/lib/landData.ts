import Decimal from "decimal.js-light";
import { CHORES } from "../types/chores";
import {
  Bumpkin,
  ChoreV2Name,
  ChoresV2,
  GameState,
  Inventory,
} from "../types/game";
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
      crop: { name: "Sunflower", plantedAt: 0, amount: 1 },
      x: -2,
      y: -1,
      height: 1,
      width: 1,
      fertiliser: {
        fertilisedAt: 0,
        name: "Rapid Root",
      },
    },
    2: {
      createdAt: Date.now(),
      crop: { name: "Sunflower", plantedAt: 0, amount: 1 },
      x: -1,
      y: -1,
      height: 1,
      width: 1,
      fertiliser: {
        fertilisedAt: 0,
        name: "Sprout Mix",
      },
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
    11: {
      createdAt: Date.now(),
      x: 6,
      y: -1,
      height: 1,
      width: 1,
      fertiliser: {
        fertilisedAt: 0,
        name: "Rapid Root",
      },
    },
    12: {
      createdAt: Date.now(),
      x: 7,
      y: -2,
      height: 1,
      width: 1,
      fertiliser: {
        fertilisedAt: 0,
        name: "Rapid Root",
      },
    },
    13: {
      createdAt: Date.now(),
      x: 7,
      y: -1,
      height: 1,
      width: 1,
      fertiliser: {
        fertilisedAt: 0,
        name: "Sprout Mix",
      },
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
  fruitPatches: {
    1: {
      height: 2,
      width: 2,
      x: 1,
      y: 3,
    },
    2: {
      height: 2,
      width: 2,
      x: 1,
      y: 1,
      fruit: {
        amount: 1,
        harvestedAt: 3,
        harvestsLeft: 3,
        name: "Apple",
        plantedAt: 0,
      },
      fertiliser: {
        fertilisedAt: 0,
        name: "Fruitful Blend",
      },
    },
  },
  gold: {},
  iron: {},
};

export const INITIAL_EXPANSIONS = 3;

const INITIAL_BUMPKIN: Bumpkin = {
  id: 1,
  experience: 10000,
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
  skills: {
    "Michelin Stars": 1,
  },
  achievements: {
    "Busy Bumpkin": 1,
  },
  activity: {
    "Reindeer Carrot Fed": 50,
  },
};

export const OFFLINE_FARM: GameState = {
  id: 4,
  witchesEve: {
    weeklyLostCrowCount: 25,
    maze: {
      7: {
        claimedFeathers: 0,
        sflFee: 5,
        paidEntryFee: true,
        highestScore: 0,
        attempts: [
          {
            startedAt: 0,
            crowsFound: 0,
            health: 3,
            time: 2,
          },
        ],
      },
    },
  },
  balance: new Decimal(100),
  milestones: {
    "Fish Encyclopedia": 1,
    "Expert Angler": 1,
  },
  farmActivity: {
    "Anchovy Caught": 5,
    "Clownfish Caught": 5,
    "Red Snapper Caught": 1,
    "Butterflyfish Caught": 5,
    "Blowfish Caught": 5,
    "Sea Bass Caught": 5,
    "Sea Horse Caught": 5,
    "Horse Mackerel Caught": 5,
    "Squid Caught": 5,
  },
  wardrobe: {
    "Eggplant Onesie": 1,
    "Golden Spatula": 1,
    "Fruit Picker Apron": 1,
    "Red Farmer Shirt": 3,
    "Ancient Goblin Sword": 2,
    "Ancient War Hammer": 2,
    "Artist Scarf": 1,
    "Basic Hair": 1,
    "Blue Farmer Shirt": 2,
    "Beige Farmer Potion": 1,
    "Brown Suspenders": 1,
    "Black Farmer Boots": 1,
    "Farmer Pitchfork": 1,
    "Farm Background": 1,
    "Snowman Onesie": 68,
    "Reindeer Suit": 69,
    "Shark Onesie": 70,
    "Christmas Background": 71,
    "Devil Wings": 72,
    "Angel Wings": 73,
    "Fire Hair": 74,
    "Luscious Hair": 75,
    "Mountain View Background": 78,
    "Skull Hat": 79,
    "Reindeer Antlers": 80,
    "Santa Hat": 81,
    "Pineapple Shirt": 82,
    "China Town Background": 83,
    "Lion Dance Mask": 84,
    "Fruit Picker Shirt": 85,
    "Cupid Dress": 1,
    "Fruit Bowl": 87,
    "Striped Blue Shirt": 88,
    "Peg Leg": 89,
    "Pirate Potion": 90,
    "Pirate Hat": 91,
    "Pirate General Coat": 92,
    "Pirate Pants": 93,
    "Pirate Leather Polo": 94,
    "Crab Claw": 95,
  },
  expansionRequirements: {
    resources: {
      Wood: 3,
      "Block Buck": 1,
    },
    seconds: 10,
    bumpkinLevel: 1,
  },
  inventory: {
    Rod: new Decimal(1),
    Earthworm: new Decimal(10),
    "Sprout Mix": new Decimal(10),
    "Rapid Root": new Decimal(10),
    "Fruitful Blend": new Decimal(10),
    "El Pollo Veloz": new Decimal(1),
    "Bud Seedling": new Decimal(1),
    Gnome: new Decimal(1),
    "Sunflower Cake": new Decimal(15),
    Carrot: new Decimal(80),
    "Sunflower Seed": new Decimal(80),
    "Blueberry Seed": new Decimal(80),
    Cauliflower: new Decimal(70),
    Beetroot: new Decimal(10),
    Cabbage: new Decimal(100),
    Pumpkin: new Decimal(100),
    Parsnip: new Decimal(10),
    Radish: new Decimal(10),
    Potato: new Decimal(10),
    Sunflower: new Decimal(10),
    Iron: new Decimal(10),
    Egg: new Decimal(10),
    Kale: new Decimal(10),
    Wood: new Decimal(30),
    "Luminous Lantern": new Decimal(5),
    "Radiance Lantern": new Decimal(3),
    Market: new Decimal(1),
    "Fire Pit": new Decimal(1),
    "Town Center": new Decimal(1),
    Workbench: new Decimal(1),
    "Basic Land": new Decimal(3),
    "Crop Plot": new Decimal(getKeys(INITIAL_RESOURCES.crops).length),
    Tree: new Decimal(getKeys(INITIAL_RESOURCES.trees).length),
    "Stone Rock": new Decimal(getKeys(INITIAL_RESOURCES.stones).length),
    "Mashed Potato": new Decimal(2),
    Gold: new Decimal(50),
    "Wooden Compass": new Decimal(20),
    "Dirt Path": new Decimal(100),
    Fence: new Decimal(50),
    Bush: new Decimal(50),
    Shrub: new Decimal(50),
    "White Tulips": new Decimal(10),
    Artist: new Decimal(1),
    "Solar Lantern": new Decimal(1),
    Stone: new Decimal(500),
    Bale: new Decimal(1),
    Wheat: new Decimal(100),
    Axe: new Decimal(10),
    "Rusty Shovel": new Decimal(5),
    "Maneki Neko": new Decimal(2),
    "Lunar Calendar": new Decimal(1),
    "Pablo The Bunny": new Decimal(1),
    "Easter Bear": new Decimal(1),
    "Cabbage Girl": new Decimal(1),
    "Cabbage Boy": new Decimal(1),

    // "Beta Pass": new Decimal(1),
    "Witches' Eve Banner": new Decimal(1),

    Kitchen: new Decimal(1),

    "Iron Rock": new Decimal(3),
    "Fruit Patch": new Decimal(3),
    "Gold Rock": new Decimal(3),
    "Easter Bush": new Decimal(3),
    "Block Buck": new Decimal(10),

    "Human War Banner": new Decimal(1),

    "Wild Mushroom": new Decimal(1),
    Eggplant: new Decimal(1),

    "Betty Lantern": new Decimal(1),
    "Bumpkin Lantern": new Decimal(1),
    "Goblin Lantern": new Decimal(1),
    "Eggplant Bear": new Decimal(1),
    "Dawn Flower": new Decimal(1),

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
    Candles: new Decimal(1),
    "Haunted Stump": new Decimal(1),
    "Spooky Tree": new Decimal(1),
    "Town Sign": new Decimal(1),

    Chicken: new Decimal(5),

    "Purple Trail": new Decimal(1),
    Obie: new Decimal(1),
    Maximus: new Decimal(1),
    Hoot: new Decimal(1),
    "Sir Goldensnout": new Decimal(1),
    "Freya Fox": new Decimal(1),
    "Fat Chicken": new Decimal(1),
    "Queen Cornelia": new Decimal(1),
    "Scary Mike": new Decimal(1),
    "Ayam Cemani": new Decimal(1),
  },

  createdAt: new Date("2022-03-04").getTime(),
  ...INITIAL_RESOURCES,

  bumpkin: INITIAL_BUMPKIN,

  trades: {
    listings: {
      "123": {
        createdAt: 0,
        items: {
          Apple: 2,
          Wheat: 3,
        },
        sfl: 2,
        boughtAt: 1,
        buyerId: 1,
      },
    },
  },
  chickens: {},
  fishing: { weather: "Sunny", wharf: {} },

  airdrops: [],

  stock: INITIAL_STOCK,
  conversations: [],

  mailbox: {
    read: [],
  },

  stockExpiry: {},
  dailyRewards: { streaks: 0 },

  grubShop: {
    closesAt: Date.now() + 500000,
    opensAt: Date.now(),
    orders: [
      {
        id: "1",
        name: "Apple Juice",
        sfl: new Decimal(1),
      },
    ],
  },

  chores: {
    choresCompleted: 0,
    choresSkipped: 2,
    chores: {
      [ChoreV2Name.EASY_1]: {
        activity: "Corn Harvested",
        bumpkinId: 1,
        createdAt: 0,
        description: "Harvest 2 Corn",
        requirement: 5,
        tickets: 2,
        completedAt: 100,
        startCount: -200,
      },
      [ChoreV2Name.EASY_2]: {
        activity: "Sunflower Harvested",
        bumpkinId: 1,
        createdAt: Date.now() - 25 * 60 * 60 * 1000,
        description: "Harvest 3 Sunflowers in long text",
        requirement: 5,
        tickets: 2,

        startCount: -50,
      },
      [ChoreV2Name.MEDIUM_1]: {
        activity: "Sunflower Harvested",
        bumpkinId: 1,
        createdAt: Date.now() - 100,
        description: "Harvest 3 Sunflowers in long text",
        requirement: 5,
        tickets: 2,

        startCount: 0,
      },
      [ChoreV2Name.MEDIUM_2]: {
        activity: "Sunflower Harvested",
        bumpkinId: 1,
        createdAt: 0,
        description: "Harvest 3 Sunflowers in long text",
        requirement: 5,
        tickets: 2,

        startCount: 0,
      },
    } as ChoresV2["chores"],
  },

  buildings: {
    "Town Center": [
      {
        coordinates: { x: 3, y: 4 },
        createdAt: 0,
        id: "123",
        readyAt: 0,
      },
    ],
    Workbench: [
      {
        coordinates: { x: 3, y: 0 },
        createdAt: 0,
        id: "123",
        readyAt: 0,
      },
    ],
    "Compost Bin": [
      {
        coordinates: { x: 3, y: 8 },
        createdAt: 0,
        id: "123",
        readyAt: 0,
        requires: {
          Sunflower: 5,
        },
      },
    ],
    "Turbo Composter": [
      {
        coordinates: { x: 5, y: 8 },
        createdAt: 0,
        id: "123",
        readyAt: 0,
        requires: { Apple: 1 },
        producing: {
          items: { "Fruitful Blend": 10, "Red Wiggler": 3 },

          readyAt: Date.now() + 3000,
          startedAt: Date.now() - 50000 - 8 * 60 * 60 * 1000,
        },
      },
    ],
    "Premium Composter": [
      {
        coordinates: { x: 7, y: 8 },
        createdAt: 0,
        id: "123",
        readyAt: 0,
        producing: {
          items: { "Rapid Root": 10, Grub: 3 },

          readyAt: Date.now() - 50000,
          startedAt: Date.now() - 50000 - 12 * 60 * 60 * 1000,
        },
      },
    ],
  },
  collectibles: {},
  delivery: {
    orders: [
      {
        id: "123",
        createdAt: Date.now() - 23 * 60 * 60 * 1000,
        completedAt: Date.now(),
        readyAt: 1690855045072,
        from: "pumpkin' pete",
        items: {
          Sunflower: 5,
          Pumpkin: 5,
        },
        reward: {
          tickets: 2,
        },
      },
      {
        id: "124",
        createdAt: Date.now() - 25 * 60 * 60 * 1000,
        readyAt: Date.now(),
        from: "blacksmith",
        items: {
          "Sunflower Cake": 15,
        },
        reward: {
          sfl: 2.225,
        },
      },
      {
        id: "122",
        createdAt: Date.now(),
        readyAt: Date.now(),
        from: "grubnuk",
        items: {
          Potato: 5,
        },
        reward: {
          sfl: 2.225,
          items: {
            "Dawn Breaker Ticket": 1,
          },
        },
      },
      {
        id: "125",
        createdAt: Date.now(),
        readyAt: Date.now(),
        from: "grimtooth",
        items: {
          Potato: 5,
        },
        reward: {
          sfl: 2.225,
        },
      },
      {
        id: "126",
        createdAt: Date.now(),
        from: "grimtooth",
        items: {
          Potato: 5,
        },
        reward: {
          sfl: 2.225,
        },
        readyAt: Date.now() + 5000,
      },
    ],
    fulfilledCount: 23,
    milestone: {
      goal: 12,
      total: 25,
    },
  },
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
  buds: {
    1: {
      aura: "Basic",
      colour: "Beige",
      ears: "Ears",
      stem: "3 Leaf Clover",
      type: "Beach",
    },
    5: {
      aura: "Basic",
      colour: "Beige",
      ears: "Ears",
      stem: "3 Leaf Clover",
      type: "Beach",
    },
    7: {
      aura: "Basic",
      colour: "Beige",
      ears: "Ears",
      stem: "3 Leaf Clover",
      type: "Beach",
    },
    9: {
      aura: "Basic",
      colour: "Beige",
      ears: "Ears",
      stem: "3 Leaf Clover",
      type: "Beach",
    },
  },
};
