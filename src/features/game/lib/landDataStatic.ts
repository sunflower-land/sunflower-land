/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
import Decimal from "decimal.js-light";
import { ChoreV2, ChoreV2Name, GameState, Inventory } from "../types/game";

import { BumpkinLevel } from "features/game/lib/level";
import { getEnabledNodeCount } from "../expansion/lib/expansionNodes";
import { TEST_BUMPKIN, INITIAL_BUMPKIN_LEVEL } from "./bumpkinData";
import { EMPTY, makeMegaStoreAvailableDates } from "./constants";
import { getSeasonalTicket } from "../types/seasons";
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
  | "oilReserves"
> = {
  crops: {
    1: {
      createdAt: Date.now(),
      x: -2,
      y: 0,
      height: 1,
      width: 1,
      crop: {
        amount: 1,
        name: "Cabbage",
        plantedAt: 100,
      },
    },
    2: {
      createdAt: Date.now(),
      x: -1,
      y: 0,
      height: 1,
      width: 1,
      crop: {
        amount: 1,
        name: "Cabbage",
        plantedAt: 100,
      },
    },
    3: {
      createdAt: Date.now(),
      x: -3,
      y: 0,
      height: 1,
      width: 1,
      crop: {
        amount: 1,
        name: "Cabbage",
        plantedAt: 100,
      },
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
  crimstones: {},
  oilReserves: {},
  fruitPatches: {
    1: {
      x: 7,
      y: 3,
      height: 2,
      width: 2,
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
  "Sunflower Seed": new Decimal(0),
  "Potato Seed": new Decimal(200),
  "Pumpkin Seed": new Decimal(100),
  "Carrot Seed": new Decimal(100),
  "Cabbage Seed": new Decimal(90),
  "Soybean Seed": new Decimal(80),
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
  "Oil Drill": new Decimal(5),
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
  "Crop Plot",
);
const OFFLINE_FARM_TREES = getEnabledNodeCount(
  INITIAL_BUMPKIN_LEVEL as BumpkinLevel,
  "Tree",
);
const OFFLINE_FARM_STONES = getEnabledNodeCount(
  INITIAL_BUMPKIN_LEVEL as BumpkinLevel,
  "Stone Rock",
);
const OFFLINE_FARM_IRON = getEnabledNodeCount(
  INITIAL_BUMPKIN_LEVEL as BumpkinLevel,
  "Iron Rock",
);
const OFFLINE_FARM_GOLD = getEnabledNodeCount(
  INITIAL_BUMPKIN_LEVEL as BumpkinLevel,
  "Gold Rock",
);
const OFFLINE_FARM_CRIMSTONE = getEnabledNodeCount(
  INITIAL_BUMPKIN_LEVEL as BumpkinLevel,
  "Crimstone Rock",
);

const OFFLINE_FARM_SUNSTONE = getEnabledNodeCount(
  INITIAL_BUMPKIN_LEVEL as BumpkinLevel,
  "Sunstone Rock",
);
const OFFLINE_FARM_FRUIT = getEnabledNodeCount(
  INITIAL_BUMPKIN_LEVEL as BumpkinLevel,
  "Fruit Patch",
);

export const STATIC_OFFLINE_FARM: GameState = {
  ...EMPTY,
  bertObsession: {
    type: "collectible",
    name: "Fairy Circle",
    startDate: 1732147200000,
    endDate: 1732406400000,
    reward: 3,
  },
  experiments: ["GEM_BOOSTS"],
  greenhouse: {
    pots: {},
    oil: 50,
  },
  calendar: {
    dates: [
      {
        name: "tornado",
        date: new Date().toISOString().substring(0, 10),
      },
    ],
  },
  faction: {
    name: "goblins",
    history: {},
    pledgedAt: 100,
  },
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
    type: "desert",
  },
  competitions: {
    progress: {
      ANIMALS: {
        initialProgress: {},
        startedAt: 100,
      },
    },
  },
  mysteryPrizes: {},
  minigames: {
    games: {},
    prizes: {
      "chicken-rescue": {
        coins: 0,
        startAt: new Date("2023-01-01").getTime(),
        endAt: new Date("2025-01-01").getTime(),
        score: 2,
        items: {},
        wearables: {},
      },
      "festival-of-colors": {
        coins: 0,
        startAt: new Date().getTime() - 500,
        endAt: new Date().getTime() + 5000000,
        score: 5,
        items: {},
        wearables: {
          "Red Farmer Shirt": 1,
        },
      },
    },
  },
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
  bumpkin: {
    ...TEST_BUMPKIN,
    skills: {
      "Double Nom": 1,
      "Cow-Smart Nutrition": 1,
    },
  },
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
  coins: 1000000,
  balance: new Decimal(100.1023810291823),
  previousBalance: new Decimal(0),
  previousInventory: {
    Wood: new Decimal(10),
    Egg: new Decimal(10),
    Iron: new Decimal(10),
    "Golden Cauliflower": new Decimal(1),
  },
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
  competitions: {
    progress: {
      ANIMALS: {
        initialProgress: {},
        startedAt: 100000,
      },
    },
  },
  chores: {
    choresCompleted: 0,
    choresSkipped: 0,
    chores: {
      2: {
        activity: "Sunflower Planted",
        bumpkinId: TEST_BUMPKIN.id,
        createdAt: Date.now(),
        description: "Plant a sunflower",
        requirement: 1,
        startCount: 0,
      },
    } as Record<ChoreV2Name, ChoreV2>,
  },
  choreBoard: {
    chores: {
      "boneyard betty": {
        name: "CHOP_1_TREE",
        reward: {
          coins: 100,
          items: {},
        },
        initialProgress: 0,
        startedAt: Date.now(),
      },
      "chef ebon": {
        name: "CHOP_1_TREE",
        reward: {
          items: {
            Gem: 100,
          },
        },
        initialProgress: 0,
        startedAt: Date.now(),
      },
      barlow: {
        name: "CHOP_1_TREE",
        reward: {
          items: {
            "Amber Fossil": 100,
          },
        },
        initialProgress: 0,
        startedAt: Date.now(),
      },
    },
  },
  desert: {
    digging: {
      grid: [
        {
          x: 5,
          y: 5,
          dugAt: Date.now(),
          items: {
            Starfish: 1,
          },
          tool: "Sand Shovel",
        },
      ],
      patterns: [
        "MONDAY_ARTEFACT_FORMATION",
        "SEAWEED",
        "MONDAY_ARTEFACT_FORMATION",
        "SEA_CUCUMBERS",
        "MONDAY_ARTEFACT_FORMATION",
        "COCKLE",
        "CORAL",
        "CORAL",
        "CORAL",
      ],
    },
  },
  inventory: {
    "Orange Seed": new Decimal(10),
    "Lemon Seed": new Decimal(10),
    "Tomato Seed": new Decimal(10),
    "Blueberry Seed": new Decimal(10),
    "Banana Plant": new Decimal(10),
    "Golden Cow": new Decimal(1),
    "Trade Point": new Decimal(500),
    "Fairy Circle": new Decimal(1),
    "Red Balloon Flower": new Decimal(1),
    Tomato: new Decimal(100),
    Cheese: new Decimal(100),
    "Barn Delight": new Decimal(1),
    Brush: new Decimal(1),
    "Alien Chicken": new Decimal(1),
    "Toxic Tuft": new Decimal(1),
    Mootant: new Decimal(1),
    Barn: new Decimal(1),
    "Hen House": new Decimal(1),
    Hay: new Decimal(100),
    "Mixed Grain": new Decimal(100),
    NutriBarley: new Decimal(100),
    Bale: new Decimal(1),
    "Kernel Blend": new Decimal(100),
    "Rich Chicken": new Decimal(1),
    Wrangler: new Decimal(1),
    "Bull Run Banner": new Decimal(1),
    "Basic Scarecrow": new Decimal(1),
    "Lemon Shark": new Decimal(1),
    "Longhorn Cowfish": new Decimal(1),
    "Beta Pass": new Decimal(1),
    "Paint Can": new Decimal(1),
    "Jelly Lamp": new Decimal(1),
    "Splendor Flag": new Decimal(5),
    "Benevolence Flag": new Decimal(1),
    "Generosity Flag": new Decimal(1),
    "Devotion Flag": new Decimal(1),
    "Camel Bone": new Decimal(1000),
    Sand: new Decimal(1000),
    Crab: new Decimal(1000),
    Crimsteel: new Decimal(1000),
    "Old Bottle": new Decimal(1000),
    "Sea Cucumber": new Decimal(1000),
    Vase: new Decimal(1000),
    Seaweed: new Decimal(1000),
    "Cockle Shell": new Decimal(1000),
    Starfish: new Decimal(1000),
    "Iron Compass": new Decimal(1000),
    "Wooden Compass": new Decimal(1000),
    "Emerald Compass": new Decimal(1000),
    Pipi: new Decimal(1000),
    Hieroglyph: new Decimal(1000),
    "Clam Shell": new Decimal(1000),
    Coral: new Decimal(50),
    Pearl: new Decimal(50),
    Rug: new Decimal(1),
    "Sunflorian Throne": new Decimal(1),
    "Nightshade Throne": new Decimal(1),
    "Goblin Throne": new Decimal(1),
    "Bumpkin Throne": new Decimal(1),
    "Golden Sunflorian Egg": new Decimal(1),
    "Goblin Mischief Egg": new Decimal(1),
    "Bumpkin Charm Egg": new Decimal(1),
    "Nightshade Veil Egg": new Decimal(1),
    "Emerald Goblin Goblet": new Decimal(1),
    "Opal Sunflorian Goblet": new Decimal(1),
    "Sapphire Bumpkin Goblet": new Decimal(1),
    "Amethyst Nightshade Goblet": new Decimal(1),
    "Golden Faction Goblet": new Decimal(1),
    "Ruby Faction Goblet": new Decimal(1),
    "Sunflorian Bunting": new Decimal(1),
    "Nightshade Bunting": new Decimal(1),
    "Goblin Bunting": new Decimal(1),
    "Bumpkin Bunting": new Decimal(1),
    "Sunflorian Candles": new Decimal(1),
    "Nightshade Candles": new Decimal(1),
    "Goblin Candles": new Decimal(1),
    "Bumpkin Candles": new Decimal(1),
    "Sunflorian Left Wall Sconce": new Decimal(1),
    "Nightshade Left Wall Sconce": new Decimal(1),
    "Goblin Left Wall Sconce": new Decimal(1),
    "Bumpkin Left Wall Sconce": new Decimal(1),
    "Sunflorian Right Wall Sconce": new Decimal(1),
    "Nightshade Right Wall Sconce": new Decimal(1),
    "Goblin Right Wall Sconce": new Decimal(1),
    "Bumpkin Right Wall Sconce": new Decimal(1),
    "Gourmet Hourglass": new Decimal(1),
    "Harvest Hourglass": new Decimal(1),
    "Timber Hourglass": new Decimal(1),
    "Ore Hourglass": new Decimal(1),
    "Orchard Hourglass": new Decimal(1),
    "Blossom Hourglass": new Decimal(1),
    "Fisher's Hourglass": new Decimal(1),
    "Sunflorian Faction Rug": new Decimal(1),
    "Nightshade Faction Rug": new Decimal(1),
    "Goblin Faction Rug": new Decimal(1),
    "Bumpkin Faction Rug": new Decimal(1),
    Mark: new Decimal(200),
    Axe: new Decimal(100),
    Pickaxe: new Decimal(100),
    Warehouse: new Decimal(1),
    Wheat: new Decimal(100),
    Oil: new Decimal(250),
    "Sand Shovel": new Decimal(1),
    "Sand Drill": new Decimal(1),
    Manor: new Decimal(1),
    House: new Decimal(1),
    "Sunflower Seed": new Decimal(100),
    "Pumpkin Seed": new Decimal(100),
    "Potato Seed": new Decimal(100),
    "Kale Seed": new Decimal(100),
    "Parsnip Seed": new Decimal(100),
    "Radish Seed": new Decimal(100),
    "Soybean Seed": new Decimal(100),
    "Wheat Seed": new Decimal(100),
    "Corn Seed": new Decimal(100),
    "Rice Seed": new Decimal(10),
    "Grape Seed": new Decimal(10),
    "Olive Seed": new Decimal(10),
    "Apple Seed": new Decimal(10),
    "Crop Machine": new Decimal(1),
    Bakery: new Decimal(1),
    Deli: new Decimal(1),
    Greenhouse: new Decimal(1),
    "Desert Gnome": new Decimal(1),
    Chicory: new Decimal(1),
    Blossombeard: new Decimal(1),
    Gnome: new Decimal(1),
    Cobalt: new Decimal(1),
    Potato: new Decimal(200),
    Pumpkin: new Decimal(200),
    "Oil Reserve": new Decimal(0),
    "Oil Drill": new Decimal(5),
    "Battle Fish": new Decimal(1),
    "Knight Chicken": new Decimal(1),
    Baozi: new Decimal(10),
    Goblet: new Decimal(1),
    "Prize Ticket": new Decimal(10),
    "Fat Chicken": new Decimal(2),
    "Speed Chicken": new Decimal(2),
    "Mashed Potato": new Decimal(1),
    "Treasure Key": new Decimal(1),
    "Hungry Hare": new Decimal(1),
    "White Festive Fox": new Decimal(3),
    "Red Pansy": new Decimal(3),
    "White Pansy": new Decimal(3),
    "Yellow Pansy": new Decimal(3),
    "Blue Pansy": new Decimal(3),
    "Blue Daffodil": new Decimal(3),
    "Yellow Daffodil": new Decimal(3),
    "White Daffodil": new Decimal(3),
    "Red Daffodil": new Decimal(3),
    Sunflower: new Decimal(7),
    Scarecrow: new Decimal(1),
    Shovel: new Decimal(1),
    Carrot: new Decimal(500),
    Wardrobe: new Decimal(1),
    "Abandoned Bear": new Decimal(10),
    "Chef Bear": new Decimal(10),
    "Community Egg": new Decimal(10),
    "Grinx's Hammer": new Decimal(1),
    Rod: new Decimal(20),
    Earthworm: new Decimal(10),
    "Bumpkin Nutcracker": new Decimal(1),
    "Festive Tree": new Decimal(1),
    "Town Center": new Decimal(1),
    "Gold Egg": new Decimal(1),
    Market: new Decimal(1),
    Workbench: new Decimal(1),
    "Basic Land": new Decimal(3),
    "Gold Pass": new Decimal(1),
    "Crop Plot": new Decimal(OFFLINE_FARM_CROPS),
    "Water Well": new Decimal(4),
    Tree: new Decimal(3),
    "Stone Rock": new Decimal(2),
    "Iron Rock": new Decimal(OFFLINE_FARM_IRON),
    "Gold Rock": new Decimal(OFFLINE_FARM_GOLD),
    "Crimstone Rock": new Decimal(0),
    "Gaucho Rug": new Decimal(1),
    "Sunstone Rock": new Decimal(0),
    "Fruit Patch": new Decimal(0),
    "Flower Bed": new Decimal(1),
    "Battlecry Drum": new Decimal(5),
    "Bullseye Board": new Decimal(5),
    "Chess Rug": new Decimal(5),
    Cluckapult: new Decimal(5),
    "Golden Gallant": new Decimal(5),
    "Golden Garrison": new Decimal(5),
    "Golden Guardian": new Decimal(5),
    "Novice Knight": new Decimal(5),
    "Regular Pawn": new Decimal(5),
    "Rookie Rook": new Decimal(5),
    "Silver Sentinel": new Decimal(5),
    "Silver Squire": new Decimal(5),
    "Silver Stallion": new Decimal(5),
    "Trainee Target": new Decimal(5),
    "Twister Rug": new Decimal(5),
    Egg: new Decimal(12),
    Beehive: new Decimal(1),
    Banana: new Decimal(12),
    Crimstone: new Decimal(70),
    Gem: new Decimal(200),
    Gold: new Decimal("400"),
    Iron: new Decimal("800"),
    Stone: new Decimal("1600"),
    Wood: new Decimal("8000"),
    "Mermaid Scale": new Decimal(1000),
    "Basic Bed": new Decimal(1),
    "Fisher Bed": new Decimal(1),
    "Sturdy Bed": new Decimal(1),
    "Humming Bird": new Decimal(1),
    "Queen Bee": new Decimal(1),
    "Flower Fox": new Decimal(1),
    "Hungry Caterpillar": new Decimal(1),
    "Sunrise Bloom Rug": new Decimal(1),
    "Flower Rug": new Decimal(1),
    "Tea Rug": new Decimal(1),
    "Green Field Rug": new Decimal(1),
    "Blossom Royale": new Decimal(1),
    Rainbow: new Decimal(1),
    "Enchanted Rose": new Decimal(1),
    "Flower Cart": new Decimal(1),
    Capybara: new Decimal(1),
    "Golden Cauliflower": new Decimal(1),
    "Petting Hand": new Decimal(1),
    "Music Box": new Decimal(1),

    "Sunpetal Seed": new Decimal(20),
    "Bloom Seed": new Decimal(10),
    "Lily Seed": new Decimal(5),
    // "Sunflower Seed": new Decimal(992),

    // Foods
    "Pumpkin Soup": new Decimal(1),
    "Reindeer Carrot": new Decimal(1),
    "Mushroom Soup": new Decimal(1),
    Popcorn: new Decimal(1),
    "Bumpkin Broth": new Decimal(1),
    "Cabbers n Mash": new Decimal(1),
    "Boiled Eggs": new Decimal(1),
    "Kale Stew": new Decimal(1),
    "Kale Omelette": new Decimal(1),
    Gumbo: new Decimal(1),

    "Sunflower Crunch": new Decimal(1),
    "Mushroom Jacket Potatoes": new Decimal(1),
    "Fruit Salad": new Decimal(1),
    Pancakes: new Decimal(1),
    "Roast Veggies": new Decimal(1),
    "Cauliflower Burger": new Decimal(1),
    "Club Sandwich": new Decimal(1),
    "Bumpkin Salad": new Decimal(1),
    "Bumpkin ganoush": new Decimal(1),
    "Goblin's Treat": new Decimal(1),
    Chowder: new Decimal(1),
    "Bumpkin Roast": new Decimal(1),
    "Goblin Brunch": new Decimal(1),

    "Apple Pie": new Decimal(1),
    "Orange Cake": new Decimal(1),
    "Kale & Mushroom Pie": new Decimal(1),
    "Sunflower Cake": new Decimal(1),
    "Honey Cake": new Decimal(1),
    "Potato Cake": new Decimal(1),
    "Pumpkin Cake": new Decimal(1),
    Cornbread: new Decimal(1),
    "Carrot Cake": new Decimal(1),
    "Cabbage Cake": new Decimal(1),
    "Beetroot Cake": new Decimal(1),
    "Cauliflower Cake": new Decimal(1),
    "Parsnip Cake": new Decimal(1),
    "Eggplant Cake": new Decimal(1),
    "Radish Cake": new Decimal(1),
    "Wheat Cake": new Decimal(1),
    "Pirate Cake": new Decimal(1),

    "Blueberry Jam": new Decimal(1),
    "Fermented Carrots": new Decimal(1),
    Sauerkraut: new Decimal(1),
    "Fancy Fries": new Decimal(1),
    "Fermented Fish": new Decimal(1),

    "Purple Smoothie": new Decimal(1),
    "Orange Juice": new Decimal(1),
    "Apple Juice": new Decimal(1),
    "Power Smoothie": new Decimal(1),
    "Bumpkin Detox": new Decimal(1),
    "Banana Blast": new Decimal(1),

    // Fish
    Anchovy: new Decimal(1),
    Butterflyfish: new Decimal(1),
    Blowfish: new Decimal(1),
    Clownfish: new Decimal(1),
    "Sea Bass": new Decimal(1),
    "Sea Horse": new Decimal(1),
    "Horse Mackerel": new Decimal(1),
    Halibut: new Decimal(1),
    Squid: new Decimal(1),

    "Red Snapper": new Decimal(1),
    "Moray Eel": new Decimal(1),
    "Olive Flounder": new Decimal(1),
    Napoleanfish: new Decimal(1),
    Surgeonfish: new Decimal(1),
    Angelfish: new Decimal(1),
    "Zebra Turkeyfish": new Decimal(1),
    Ray: new Decimal(1),
    "Hammerhead shark": new Decimal(1),
    "Barred Knifejaw": new Decimal(1),

    Tuna: new Decimal(1),
    "Mahi Mahi": new Decimal(1),
    "Blue Marlin": new Decimal(1),
    Oarfish: new Decimal(1),
    "Football fish": new Decimal(1),
    Sunfish: new Decimal(1),
    Coelacanth: new Decimal(1),
    Parrotfish: new Decimal(1),
    "Whale Shark": new Decimal(1),
    "Saw Shark": new Decimal(1),
    "White Shark": new Decimal(1),

    // Banners
    "Human War Banner": new Decimal(1),
    "Goblin War Banner": new Decimal(1),
    // "Lifetime Farmer Banner": new Decimal(1),
    "Solar Flare Banner": new Decimal(1),
    "Dawn Breaker Banner": new Decimal(1),
    "Witches' Eve Banner": new Decimal(1),
    "Catch the Kraken Banner": new Decimal(1),
    "Spring Blossom Banner": new Decimal(1),
    "Clash of Factions Banner": new Decimal(1),
    "Bumpkin Faction Banner": new Decimal(1),
    "Goblin Faction Banner": new Decimal(1),
    "Sunflorian Faction Banner": new Decimal(1),
    "Nightshade Faction Banner": new Decimal(1),
    "Earn Alliance Banner": new Decimal(1),
    "Goblin Gold Champion": new Decimal(1),
    "Goblin Silver Champion": new Decimal(1),
    // "Pharaoh's Treasure Banner": new Decimal(1),

    "Pirate Bounty": new Decimal(50),
    Scarab: new Decimal(50),
    "Reveling Lemon": new Decimal(1),
    "Cactus King": new Decimal(1),
    "Clay Tablet": new Decimal(1),

    "Lemon Frog": new Decimal(1),
    "Sand Golem": new Decimal(1),
    "Scarab Beetle": new Decimal(1),
    Sundial: new Decimal(1),
    Wagon: new Decimal(1),
  },
  wardrobe: {
    "Tofu Mask": 1,
    "Royal Scepter": 1,
    "Olive Royalty Shirt": 2,
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
    "Beekeeper Hat": 1,
    "Honeycomb Shield": 1,
    "Bee Suit": 1,
    "Coin Aura": 1,
    "Gift Giver": 1,
    "Desert Merchant Turban": 1,
    Halo: 1,
  },
  previousWardrobe: {
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

  conversations: ["hank-intro"],

  bounties: {
    completed: [],
    requests: [
      {
        id: "1",
        name: "Cow",
        level: 3,
        items: {
          Horseshoe: 1,
        },
      },
      {
        id: "1",
        name: "Sheep",
        level: 3,
        coins: 100,
      },
      {
        id: "1c",
        name: "Cow",
        level: 1,
        coins: 100,
      },
      {
        id: "1e",
        name: "Chicken",
        level: 1,
        items: {
          Horseshoe: 7,
        },
      },
      {
        id: "1ef",
        name: "Chicken",
        level: 1,
        coins: 150,
      },
      {
        id: "2",
        name: "Red Balloon Flower",
        items: { [getSeasonalTicket()]: 1 },
      },
      {
        id: "3",
        name: "White Pansy",
        items: { [getSeasonalTicket()]: 1 },
      },
    ],
  },

  fishing: {
    dailyAttempts: {},
    weather: "Full Moon",
    wharf: {},
    beach: {},
  },
  mailbox: {
    read: [],
  },

  stock: INITIAL_STOCK,
  stockExpiry: {},
  chickens: {
    "1": {
      multiplier: 1,
      coordinates: {
        x: 10,
        y: 0,
      },
      fedAt: 1,
    },
    "2": {
      multiplier: 1,
      coordinates: {
        x: 10,
        y: 1,
      },
      fedAt: 1,
    },
    "3": {
      multiplier: 1,
      coordinates: {
        x: 10,
        y: 2,
      },
      fedAt: 1,
    },
    "4": {
      multiplier: 1,
      coordinates: {
        x: 11,
        y: 0,
      },
      fedAt: 1,
    },
    "5": {
      multiplier: 1,
      coordinates: {
        x: 11,
        y: 1,
      },
      fedAt: 1,
    },
    "6": {
      multiplier: 1,
      coordinates: {
        x: 11,
        y: 2,
      },
      fedAt: 1,
    },
  },
  trades: {
    listings: {
      "1": {
        collection: "collectibles",
        createdAt: 0,
        items: { Sunflower: 10 },
        sfl: 10,
        boughtAt: 100,
        buyerId: 1,
      },
    },
    offers: {
      "2": {
        collection: "collectibles",
        createdAt: 0,
        items: { "Gold Egg": 10 },
        sfl: 5,
        fulfilledById: 1,
      },
    },
  },
  buildings: {
    Manor: [
      {
        coordinates: {
          x: 2,
          y: -2,
        },
        createdAt: 0,
        id: "1",
        readyAt: 0,
      },
    ],
    Kitchen: [
      {
        coordinates: {
          x: 8,
          y: -2,
        },
        createdAt: 0,
        id: "1",
        readyAt: 0,
      },
    ],
    Greenhouse: [
      {
        coordinates: {
          x: -5,
          y: 7,
        },
        createdAt: 0,
        id: "1",
        readyAt: 0,
      },
    ],
    "Hen House": [
      {
        coordinates: {
          x: 4,
          y: 6,
        },
        createdAt: 0,
        id: "1",
        readyAt: 0,
      },
    ],
    Barn: [
      {
        coordinates: {
          x: 9,
          y: 10,
        },
        createdAt: 0,
        id: "1",
        readyAt: 0,
      },
    ],
    Market: [
      {
        coordinates: {
          x: -5,
          y: -4,
        },
        id: "1",
        readyAt: 0,
        createdAt: 0,
      },
    ],
    "Fire Pit": [
      {
        coordinates: {
          x: -5,
          y: -6,
        },
        id: "1",
        readyAt: 0,
        createdAt: 0,
        // crafting: {
        //   name: "Pumpkin Soup",
        //   readyAt: Date.now() + 25 * 60 * 1000,
        // },
      },
    ],
    Workbench: [
      {
        coordinates: { x: -2, y: -6 },
        id: "1",
        readyAt: 0,
        createdAt: 0,
      },
    ],
    "Crafting Box": [
      {
        coordinates: { x: 1, y: -6 },
        id: "1",
        readyAt: 0,
        createdAt: 0,
      },
    ],
  },
  collectibles: {
    "Gold Egg": [
      {
        id: "1",
        coordinates: { x: 0, y: 0 },
        readyAt: 0,
        createdAt: 0,
      },
    ],
  },
  pumpkinPlaza: {
    raffle: {
      entries: {
        "2024-03": 12,
      },
    },
  },
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
        from: "betty",
        reward: {
          items: {},
          coins: 100,
        },
        id: `betty-delivery`,
        items: {
          Sunflower: 20,
        },
      },
      {
        createdAt: Date.now(),
        readyAt: Date.now(),
        from: "pumpkin' pete",
        reward: {
          items: {},
          coins: 0,
        },
        id: `pete-delivery`,
        items: {
          Sunflower: 20,
        },
      },
      {
        createdAt: Date.now(),
        readyAt: Date.now(),
        from: "cornwell",
        reward: {
          items: {},
          coins: 300,
        },
        id: `cornwell-delivery`,
        items: {
          "Basic Hair": 1,
        },
      },
    ],

    milestone: {
      goal: 10,
      total: 10,
      claimedAt: new Date("2024-02-15").getTime(),
    },
  },

  ...INITIAL_RESOURCES,
  flowers: {
    discovered: {},
    flowerBeds: {
      "123": {
        createdAt: 0,
        height: 1,
        width: 3,
        x: 2,
        y: 0,
        flower: {
          amount: 1,
          plantedAt: 0,
          name: "Red Pansy",
          reward: {
            items: [
              {
                name: "Chicory",
                amount: 1,
              },
            ],
          },
        },
      },
    },
  },
  farmActivity: {
    "Anchovy Caught": 1000,
  },
  milestones: {
    "Advanced Angler": 1,
  },
  megastore: {
    available: makeMegaStoreAvailableDates(),
    collectibles: [],
    wearables: [],
  },
  airdrops: [],
  username: "Local Hero",
  specialEvents: {
    current: {
      "Lunar New Year": {
        isEligible: true,
        text: "The Lunar New Year is here! Celebrate with us and earn rewards!",
        endAt: 1708041600000,
        startAt: 1707436800000,
        tasks: [
          {
            reward: {
              sfl: 0,
              items: {},
              wearables: {
                "Lucky Red Hat": 1,
              },
            },
            requirements: {
              sfl: 0,
              items: {
                Sunflower: 100,
              },
            },
          },
          {
            reward: {
              sfl: 5,
              items: {},
              wearables: {},
            },
            requirements: {
              sfl: 0,
              items: {
                Cauliflower: 30,
              },
            },
          },
          {
            reward: {
              sfl: 0,
              items: {
                "Time Warp Totem": 1,
              },
              wearables: {},
            },
            requirements: {
              sfl: 0,
              items: {
                Wood: 30,
              },
            },
          },
          {
            reward: {
              sfl: 0,
              items: {
                Gem: 3,
              },
              wearables: {},
            },
            requirements: {
              sfl: 0,
              items: {
                Gold: 3,
              },
            },
          },
          {
            reward: {
              sfl: 0,
              items: {
                "Treasure Key": 1,
              },
              wearables: {},
            },
            requirements: {
              sfl: 0,
              items: {
                Sunstone: 1,
              },
            },
          },
        ],
        requiresWallet: false,
      },
      Easter: {
        isEligible: true,
        text: "Yippee, you found my rabbits! Hmmm, they are awfully hungry - can you help me feed them?",
        endAt: 1712275200000,
        startAt: 1711497600000,
        tasks: [
          {
            reward: {
              wearables: {
                "Striped Red Shirt": 1,
              },
              items: {},
              sfl: 0,
            },
            requirements: {
              items: {
                Carrot: 10,
              },
              sfl: 1,
            },
          },
          {
            reward: {
              wearables: {},
              items: {
                "Treasure Key": 1,
              },
              sfl: 0,
            },
            requirements: {
              items: {
                Carrot: 100,
              },
              sfl: 0,
            },
          },
          {
            reward: {
              wearables: {},
              items: {
                "Time Warp Totem": 1,
              },
              sfl: 0,
            },
            requirements: {
              items: {
                Carrot: 500,
              },
              sfl: 0,
            },
          },
          {
            reward: {
              wearables: {
                "Striped Yellow Shirt": 1,
              },
              items: {},
              sfl: 0,
            },
            requirements: {
              items: {
                Carrot: 50000,
              },
              sfl: 0,
            },
          },
        ],
        requiresWallet: false,
      },
      "Earn Alliance Banner": {
        isEligible: true,
        text: "Complete Day 1 for an exclusive airdrop of an Earn Alliance Banner!",
        endAt: 1709164800000,
        startAt: 1708473600000,
        tasks: [
          {
            reward: {
              sfl: 1,
              items: {},
              wearables: {},
            },
            requirements: {
              sfl: 0,
              items: {
                Sunflower: 50,
                Pumpkin: 10,
              },
            },
            completedAt: 1708474004845,
            isAirdrop: true,
          },
          {
            reward: {
              sfl: 0,
              items: {
                Gem: 1,
              },
              wearables: {},
            },
            requirements: {
              sfl: 0,
              items: {
                Wood: 10,
              },
            },
          },
          {
            reward: {
              sfl: 0,
              items: {
                "Pirate Cake": 1,
              },
              wearables: {},
            },
            requirements: {
              sfl: 0,
              items: {
                Radish: 20,
              },
            },
          },
          {
            reward: {
              sfl: 0,
              items: {
                "Time Warp Totem": 1,
              },
              wearables: {},
            },
            requirements: {
              sfl: 0,
              items: {
                Iron: 2,
              },
            },
          },
          {
            reward: {
              sfl: 0,
              items: {
                "Treasure Key": 1,
              },
              wearables: {},
            },
            requirements: {
              sfl: 0,
              items: {
                Gold: 3,
              },
            },
          },
        ],
        requiresWallet: true,
      },
      "One Planet Popper": {
        isEligible: true,
        text: "Congratulations, you found Bob! Complete the Day 1 challenge to enter the One Planet giveaway.",
        endAt: 1709164800000,
        startAt: 1708473600000,
        tasks: [
          {
            reward: {
              sfl: 1,
              items: {},
              wearables: {},
            },
            requirements: {
              sfl: 0,
              items: {
                Sunflower: 50,
              },
            },
            isAirdrop: true,
          },
          {
            reward: {
              sfl: 0,
              items: {
                "Pumpkin Cake": 1,
              },
              wearables: {},
            },
            requirements: {
              sfl: 0,
              items: {
                Wood: 5,
              },
            },
          },
          {
            reward: {
              sfl: 0,
              items: {
                Gem: 1,
              },
              wearables: {},
            },
            requirements: {
              sfl: 0,
              items: {
                Beetroot: 5,
              },
            },
          },
          {
            reward: {
              sfl: 0,
              items: {
                "Time Warp Totem": 1,
              },
              wearables: {},
            },
            requirements: {
              sfl: 0,
              items: {
                Iron: 1,
              },
            },
          },
          {
            reward: {
              sfl: 5,
              items: {},
              wearables: {},
            },
            requirements: {
              sfl: 0,
              items: {
                Gold: 1,
              },
            },
          },
        ],
        requiresWallet: true,
      },
      "Gas Hero": {
        isEligible: true,
        text: "Howdy Bumpkin, welcome to the Gas Hero event! Complete the tasks to earn rewards.",
        endAt: 1711152000000,
        startAt: 1710288000000,
        tasks: [
          {
            reward: {
              sfl: 1,
              items: {},
              wearables: {},
            },
            requirements: {
              sfl: 0,
              items: {
                Pumpkin: 10,
              },
            },
            completedAt: 1710288436525,
            airdropUrl: "https://forms.gle/mBdEULPFmi6K6jpx7",
            isAirdrop: true,
          },
          {
            reward: {
              sfl: 0,
              items: {
                "Baby Panda": 1,
              },
              wearables: {},
            },
            requirements: {
              sfl: 0,
              items: {
                Cauliflower: 30,
              },
            },
          },
          {
            reward: {
              sfl: 0,
              items: {
                "Time Warp Totem": 1,
              },
              wearables: {},
            },
            requirements: {
              sfl: 0,
              items: {
                Wood: 20,
              },
            },
          },
          {
            reward: {
              sfl: 0,
              items: {
                Gem: 1,
              },
              wearables: {},
            },
            requirements: {
              sfl: 0,
              items: {
                Gold: 1,
              },
            },
          },
          {
            reward: {
              sfl: 0,
              items: {
                "Treasure Key": 1,
              },
              wearables: {},
            },
            requirements: {
              sfl: 0,
              items: {
                Radish: 50,
              },
            },
          },
        ],
        requiresWallet: true,
      },
    },
    history: {
      "2024": {
        "Earn Alliance Banner": 20,
        "Gas Hero": 20,
      },
    },
  },
  goblinMarket: {
    resources: {},
  },
  dailyFactionDonationRequest: {
    resource: "Sunflower",
    amount: new Decimal(1000),
  },
  craftingBox: {
    status: "idle",
    item: undefined,
    startedAt: 0,
    readyAt: 0,
    recipes: {
      "White Tulips": {
        name: "White Tulips",
        ingredients: [
          null,
          null,
          null,
          null,
          { collectible: "White Pansy" },
          null,
          null,
          { collectible: "Stone" },
        ],
        time: 5 * 60 * 1000,
        type: "collectible",
      },
      "Red Farmer Shirt": {
        name: "Red Farmer Shirt",
        ingredients: [
          { collectible: "Radish" },
          { collectible: "Wool" },
          { collectible: "Radish" },
          { collectible: "Wool" },
          { collectible: "Radish" },
          { collectible: "Wool" },
          { collectible: "Wool" },
          { collectible: "Radish" },
          { collectible: "Wool" },
        ],
        time: 15 * 60 * 1000,
        type: "wearable",
      },
      "Rancher Hair": {
        name: "Rancher Hair",
        ingredients: [
          { collectible: "Carrot" },
          { collectible: "Carrot" },
          { collectible: "Carrot" },
          { collectible: "Carrot" },
          { wearable: "Basic Hair" },
          { collectible: "Carrot" },
        ],
        time: 15 * 60 * 1000,
        type: "wearable",
      },
    },
  },
  henHouse: {
    level: 1,
    animals: {
      abc: {
        asleepAt: 0,
        awakeAt: 0,
        experience: 2720,
        id: "abc",
        type: "Chicken",
        createdAt: 0,
        lovedAt: 0,
        state: "idle",
        item: "Brush",
      },
      c: {
        asleepAt: 0,
        awakeAt: 0,
        experience: 2020,
        id: "c",
        type: "Chicken",
        createdAt: 0,
        lovedAt: 0,
        state: "idle",
        item: "Brush",
      },
      blah: {
        asleepAt: 0,
        awakeAt: 0,
        experience: 1120,
        id: "blah",
        type: "Chicken",
        createdAt: 0,
        lovedAt: 0,
        state: "idle",
        item: "Brush",
      },
      "123": {
        asleepAt: 0,
        awakeAt: 0,
        experience: 20,
        id: "123",
        type: "Chicken",
        createdAt: 0,
        lovedAt: 0,
        state: "idle",
        item: "Brush",
      },
    },
  },
  barn: {
    level: 1,
    animals: {
      abc: {
        asleepAt: 0,
        awakeAt: 0,
        experience: 8310,
        id: "abc",
        type: "Cow",
        createdAt: 0,
        lovedAt: 0,
        state: "idle",
        item: "Brush",
        reward: {
          items: [
            {
              name: "Mootant",
              amount: 1,
            },
          ],
        },
      },
      def: {
        asleepAt: 0,
        awakeAt: 0,
        experience: 5400,
        id: "def",
        type: "Sheep",
        createdAt: 0,
        lovedAt: 0,
        state: "idle",
        item: "Brush",
      },
    },
  },
};
