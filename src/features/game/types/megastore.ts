import { FlowerBox } from "../events/landExpansion/buyChapterItem";
import { BumpkinItem } from "./bumpkin";
import { InventoryItemName } from "./game";
import { ChapterName, CHAPTERS } from "./chapters";

export type ChapterTierItemName =
  | ChapterCollectibleName
  | ChapterWearableName
  | MegastoreKeys;

export type ChapterCollectibleName =
  // Bull Run
  | "Cow Scratcher"
  | "Spinning Wheel"
  | "Sleepy Rug"
  | "Meteorite"
  | "Sheaf of Plenty"
  | "Mechanical Bull"
  | "Crop Circle"
  // Winds of Change
  | "Kite"
  | "Acorn House"
  | "Spring Duckling"
  | "Igloo"
  | "Ugly Duckling"
  | "Lake Rug"
  | "Hammock"
  | "Mammoth"
  | "Cup of Chocolate"
  // Great Bloom
  | "Flower-Scribed Statue"
  | "Balloon Rug"
  | "Giant Yam"
  | "Heart Air Balloon"
  | "Giant Zucchini"
  | "Giant Kale"
  | "Mini Floating Island"
  // Better Together
  | "Floor Mirror"
  | "Long Rug"
  | "Garbage Bin"
  | "Wheelbarrow"
  | "Snail King"
  | "Reelmaster's Chair"
  | "Rat King"
  | "Fruit Tune Box"
  | "Double Bed"
  | "Giant Artichoke"
  | "Teamwork Monument"

  // Paw Prints
  | "Petnip Plant"
  | "Pet Kennel"
  | "Pet Toys"
  | "Pet Playground"
  | "Fish Bowl"
  | "Giant Acorn"
  | "Giant Gold Bone"
  | "Lunar Temple"
  | "Magma Stone"
  | "Cornucopia"
  | "Messy Bed";

export type ChapterWearableName = Extract<
  BumpkinItem,
  | "Cowboy Hat"
  | "Cowgirl Skirt"
  | "Cowboy Shirt"
  | "Dream Scarf"
  | "Milk Apron"
  | "Cowboy Trouser"

  // Winds of Change
  | "Acorn Hat"
  | "Ladybug Suit"
  | "Crab Hat"
  | "Sickle"

  // Great Bloom
  | "Bloomwarden Suit"
  | "Embersteel Suit"
  | "Amberfall Suit"
  | "Glacierguard Suit"
  | "Flower Mask"
  | "Love Charm Shirt"
  | "Frost Sword"
  | "Oracle Syringe"

  // Better Together
  | "Garbage Bin Hat"
  | "Architect Ruler"
  | "Raccoon Onesie"
  | "Recycle Shirt"
  | "Pickaxe Shark"

  // Paw Prints
  | "Pet Specialist Hat"
  | "Pet Specialist Pants"
  | "Pet Specialist Shirt"
  | "Saw Fish"
>;

export type MegastoreKeys = "Treasure Key" | "Rare Key" | "Luxury Key";

type SeasonalStoreBase = {
  cost: {
    items: Partial<Record<InventoryItemName, number>>;
    sfl: number;
  };
  cooldownMs?: number;
};

export type ChapterStoreWearable = SeasonalStoreBase & {
  wearable: ChapterWearableName;
};
export type ChapterStoreCollectible = SeasonalStoreBase & {
  collectible: ChapterCollectibleName | MegastoreKeys | FlowerBox | "Pet Egg";
};

export type ChapterStoreItem = ChapterStoreWearable | ChapterStoreCollectible;

export type ChapterStore = {
  basic: {
    items: ChapterStoreItem[];
  };
  rare: {
    items: ChapterStoreItem[];
    requirement: number;
  };
  epic: {
    items: ChapterStoreItem[];
    requirement: number;
  };
  mega: {
    items: ChapterStoreItem[];
    requirement: number;
  };
};

export type ChapterStoreTier = keyof ChapterStore;

const EMPTY_SEASONAL_STORE: ChapterStore = {
  basic: {
    items: [],
  },
  rare: {
    items: [],
    requirement: 0,
  },
  epic: {
    items: [],
    requirement: 0,
  },
  mega: {
    items: [],
    requirement: 0,
  },
};

// Test only
const PHARAOH_ITEMS: ChapterStoreItem[] = [
  {
    wearable: "Red Farmer Shirt" as ChapterWearableName,
    cost: {
      items: {},
      sfl: 5,
    },
  },
  {
    collectible: "Basic Bear" as ChapterCollectibleName,
    cost: {
      items: {
        Wood: 1,
      },
      sfl: 10,
    },
  },
  {
    collectible: "Treasure Key" as MegastoreKeys,
    cooldownMs: 24 * 60 * 60 * 1000,
    cost: {
      items: {
        Wood: 100,
      },
      sfl: 10,
    },
  },
];

const RARE_PHARAOH_ITEMS: ChapterStoreItem[] = [
  {
    wearable: "Rancher Hair" as ChapterWearableName,
    cost: {
      items: {
        Wood: 1,
        Stone: 1,
      },
      sfl: 10,
    },
  },
  {
    wearable: "Axe" as ChapterWearableName,
    cost: {
      items: {
        Wood: 1,
      },
      sfl: 5,
    },
  },
  {
    wearable: "Yellow Farmer Shirt" as ChapterWearableName,
    cost: {
      items: {
        Wood: 1,
      },
      sfl: 10,
    },
  },
  {
    collectible: "Rare Key",
    cooldownMs: 24 * 60 * 60 * 1000,
    cost: {
      items: {
        Wood: 250,
      },
      sfl: 20,
    },
  },
];
const EPIC_PHARAOH_ITEMS: ChapterStoreItem[] = [
  {
    wearable: "Blue Farmer Shirt" as ChapterWearableName,
    cost: {
      items: {
        Wood: 1,
      },
      sfl: 2,
    },
  },
  {
    collectible: "Luxury Key" as MegastoreKeys,
    cooldownMs: 24 * 60 * 60 * 1000,
    cost: {
      items: {
        Wood: 500,
      },
      sfl: 50,
    },
  },
];

const BULL_RUN_ITEMS: ChapterStoreItem[] = [
  {
    wearable: "Cowboy Hat",
    cost: {
      items: {
        Horseshoe: 300,
      },
      sfl: 0,
    },
  },
  {
    wearable: "Cowgirl Skirt",
    cost: {
      items: {
        Horseshoe: 50,
      },
      sfl: 0,
    },
  },
  {
    collectible: "Cow Scratcher",
    cost: {
      items: {
        "Cow Skull": 20,
      },
      sfl: 0,
    },
  },
  {
    collectible: "Spinning Wheel",
    cost: {
      items: {
        Horseshoe: 250,
      },
      sfl: 0,
    },
  },
  {
    collectible: "Treasure Key",
    cooldownMs: 24 * 60 * 60 * 1000,
    cost: {
      items: {
        Horseshoe: 200,
      },
      sfl: 0,
    },
  },
];

const RARE_BULL_RUN_ITEMS: ChapterStoreItem[] = [
  {
    wearable: "Cowboy Shirt",
    cost: {
      items: {
        Horseshoe: 600,
      },
      sfl: 0,
    },
  },
  {
    wearable: "Dream Scarf",
    cost: {
      items: {
        Horseshoe: 1250,
      },
      sfl: 0,
    },
  },
  {
    collectible: "Sleepy Rug",
    cost: {
      items: {},
      sfl: 50,
    },
  },
  {
    collectible: "Meteorite",
    cost: {
      items: {
        "Cow Skull": 60,
      },
      sfl: 0,
    },
  },
  {
    collectible: "Rare Key",
    cooldownMs: 24 * 60 * 60 * 1000,
    cost: {
      items: {
        Horseshoe: 500,
      },
      sfl: 0,
    },
  },
];

const EPIC_BULL_RUN_ITEMS: ChapterStoreItem[] = [
  {
    wearable: "Cowboy Trouser",
    cost: {
      items: {
        Horseshoe: 750,
      },
      sfl: 0,
    },
  },
  {
    wearable: "Milk Apron",
    cost: {
      items: {
        "Cow Skull": 225,
      },
      sfl: 0,
    },
  },
  {
    collectible: "Mechanical Bull",
    cost: {
      items: {},
      sfl: 500,
    },
  },
  {
    collectible: "Luxury Key",
    cooldownMs: 24 * 60 * 60 * 1000,
    cost: {
      items: {
        Horseshoe: 1000,
      },
      sfl: 0,
    },
  },
  {
    collectible: "Crop Circle",
    cost: {
      items: {
        Horseshoe: 1250,
      },
      sfl: 0,
    },
  },
];

const MEGA_BULL_RUN_ITEMS: ChapterStoreItem[] = [
  {
    collectible: "Sheaf of Plenty",
    cost: {
      items: {
        Horseshoe: 2500,
      },
      sfl: 0,
    },
  },
];

const WINDS_OF_CHANGE_ITEMS: ChapterStoreItem[] = [
  {
    wearable: "Acorn Hat",
    cost: {
      items: {
        Timeshard: 250,
      },
      sfl: 0,
    },
  },
  {
    collectible: "Kite",
    cost: {
      items: {
        "Ancient Clock": 20,
      },
      sfl: 0,
    },
  },
  {
    collectible: "Acorn House",
    cost: {
      items: {},
      sfl: 5,
    },
  },
  {
    collectible: "Spring Duckling",
    cost: {
      items: {
        Timeshard: 50,
      },
      sfl: 0,
    },
  },
  {
    collectible: "Treasure Key",
    cooldownMs: 24 * 60 * 60 * 1000,
    cost: {
      items: {
        Timeshard: 200,
      },
      sfl: 0,
    },
  },
  {
    collectible: "Bronze Flower Box",
    cooldownMs: 7 * 24 * 60 * 60 * 1000,
    cost: {
      items: {
        Timeshard: 250,
      },
      sfl: 0,
    },
  },
];

const RARE_WINDS_OF_CHANGE_ITEMS: ChapterStoreItem[] = [
  {
    wearable: "Ladybug Suit",
    cost: {
      items: {
        Timeshard: 1250,
      },
      sfl: 0,
    },
  },
  {
    collectible: "Igloo",
    cost: {
      items: {
        Timeshard: 600,
      },
      sfl: 0,
    },
  },
  {
    collectible: "Ugly Duckling",
    cost: {
      items: {},
      sfl: 50,
    },
  },
  {
    collectible: "Lake Rug",
    cost: {
      items: {
        "Ancient Clock": 80,
      },
      sfl: 0,
    },
  },
  {
    collectible: "Rare Key",
    cooldownMs: 24 * 60 * 60 * 1000,
    cost: {
      items: {
        Timeshard: 500,
      },
      sfl: 0,
    },
  },
  {
    collectible: "Silver Flower Box",
    cooldownMs: 7 * 24 * 60 * 60 * 1000,

    cost: {
      items: {
        Timeshard: 750,
      },
      sfl: 0,
    },
  },
];

const EPIC_WINDS_OF_CHANGE_ITEMS: ChapterStoreItem[] = [
  {
    wearable: "Crab Hat",
    cost: {
      items: {
        "Ancient Clock": 200,
      },
      sfl: 0,
    },
  },
  {
    collectible: "Hammock",
    cost: {
      items: {
        Timeshard: 1500,
      },
      sfl: 0,
    },
  },
  {
    collectible: "Cup of Chocolate",
    cost: {
      items: {},
      sfl: 500,
    },
  },
  {
    collectible: "Mammoth",
    cost: {
      items: {
        Timeshard: 2000,
      },
      sfl: 0,
    },
  },
  {
    collectible: "Luxury Key",
    cooldownMs: 24 * 60 * 60 * 1000,
    cost: {
      items: {
        Timeshard: 1000,
      },
      sfl: 0,
    },
  },
  {
    collectible: "Gold Flower Box",
    cooldownMs: 30 * 24 * 60 * 60 * 1000,

    cost: {
      items: {
        Timeshard: 1500,
      },
      sfl: 0,
    },
  },
];

const MEGA_WINDS_OF_CHANGE_ITEMS: ChapterStoreItem[] = [
  {
    wearable: "Sickle",
    cost: {
      items: {
        Timeshard: 4500,
      },
      sfl: 0,
    },
  },
];

const GREAT_BLOOM_ITEMS: ChapterStore = {
  basic: {
    items: [
      {
        collectible: "Balloon Rug",
        cost: { sfl: 5, items: {} },
      },
      {
        wearable: "Amberfall Suit",
        cost: { sfl: 0, items: { "Broken Pillar": 20 } },
      },
      {
        wearable: "Embersteel Suit",
        cost: { sfl: 0, items: { Geniseed: 50 } },
      },
      {
        wearable: "Flower Mask",
        cost: { sfl: 0, items: { Geniseed: 300 } },
      },
      {
        collectible: "Treasure Key",
        cooldownMs: 24 * 60 * 60 * 1000,
        cost: { sfl: 0, items: { Geniseed: 200 } },
      },
      {
        collectible: "Bronze Flower Box",
        cooldownMs: 7 * 24 * 60 * 60 * 1000,
        cost: {
          items: {
            Geniseed: 250,
          },
          sfl: 0,
        },
      },
    ],
  },
  rare: {
    items: [
      {
        wearable: "Glacierguard Suit",
        cost: { sfl: 60, items: {} },
      },
      {
        wearable: "Bloomwarden Suit",
        cost: { sfl: 0, items: { "Broken Pillar": 80 } },
      },
      {
        collectible: "Giant Yam",
        cost: { sfl: 0, items: { Geniseed: 2000 } },
      },
      {
        collectible: "Rare Key",
        cooldownMs: 24 * 60 * 60 * 1000,
        cost: { sfl: 0, items: { Geniseed: 500 } },
      },
      {
        wearable: "Love Charm Shirt",
        cost: { sfl: 0, items: { Geniseed: 650 } },
      },
      {
        collectible: "Silver Flower Box",
        cooldownMs: 7 * 24 * 60 * 60 * 1000,
        cost: {
          items: {
            Geniseed: 750,
          },
          sfl: 0,
        },
      },
    ],
    requirement: 4,
  },
  epic: {
    items: [
      {
        collectible: "Flower-Scribed Statue",
        cost: { sfl: 0, items: { Geniseed: 1500 } },
      },
      {
        collectible: "Luxury Key",
        cooldownMs: 24 * 60 * 60 * 1000,
        cost: { sfl: 0, items: { Geniseed: 1000 } },
      },
      {
        wearable: "Frost Sword",
        cost: { sfl: 0, items: { "Broken Pillar": 180 } },
      },
      {
        collectible: "Heart Air Balloon",
        cost: { sfl: 400, items: {} },
      },
      {
        collectible: "Giant Zucchini",
        cost: { sfl: 0, items: { Geniseed: 3000 } },
      },
      {
        collectible: "Gold Flower Box",
        cooldownMs: 30 * 24 * 60 * 60 * 1000,
        cost: {
          items: {
            Geniseed: 1500,
          },
          sfl: 0,
        },
      },
    ],
    requirement: 4,
  },
  mega: {
    items: [
      {
        wearable: "Oracle Syringe",
        cost: { sfl: 0, items: { Geniseed: 8500 } },
      },
      {
        collectible: "Giant Kale",
        cost: { sfl: 0, items: { Geniseed: 6000 } },
      },
    ],
    requirement: 4,
  },
};

const BETTER_TOGETHER_ITEMS: ChapterStore = {
  basic: {
    items: [
      {
        collectible: "Floor Mirror",
        cost: { sfl: 5, items: {} },
      },
      {
        collectible: "Long Rug",
        cost: { sfl: 0, items: { Bracelet: 50 } },
      },
      {
        collectible: "Garbage Bin",
        cost: { sfl: 0, items: { Coprolite: 25 } },
      },
      {
        collectible: "Bronze Flower Box",
        cost: { sfl: 0, items: { Bracelet: 450 } },
        cooldownMs: 7 * 24 * 60 * 60 * 1000,
      },
      {
        collectible: "Treasure Key",
        cost: { sfl: 0, items: { Bracelet: 250 } },
        cooldownMs: 24 * 60 * 60 * 1000,
      },
      {
        wearable: "Garbage Bin Hat",
        cost: { sfl: 0, items: { Bracelet: 300 } },
      },
    ],
  },
  rare: {
    items: [
      {
        collectible: "Wheelbarrow",
        cost: { sfl: 60, items: {} },
      },
      {
        collectible: "Snail King",
        cost: { sfl: 0, items: { Coprolite: 85 } },
      },
      {
        collectible: "Silver Flower Box",
        cost: { sfl: 0, items: { Bracelet: 1000 } },
        cooldownMs: 7 * 24 * 60 * 60 * 1000,
      },
      {
        collectible: "Rare Key",
        cost: { sfl: 0, items: { Bracelet: 500 } },
        cooldownMs: 24 * 60 * 60 * 1000,
      },
      {
        wearable: "Architect Ruler",
        cost: { sfl: 0, items: { Bracelet: 2500 } },
      },
      {
        wearable: "Raccoon Onesie",
        cost: { sfl: 0, items: { Bracelet: 700 } },
      },
    ],
    requirement: 4,
  },
  epic: {
    items: [
      {
        collectible: "Reelmaster's Chair",
        cost: { sfl: 0, items: { Coprolite: 160 } },
      },
      {
        collectible: "Rat King",
        cost: { sfl: 0, items: { Bracelet: 1250 } },
      },
      {
        collectible: "Fruit Tune Box",
        cost: { sfl: 0, items: { Bracelet: 3500 } },
      },
      {
        collectible: "Gold Flower Box",
        cost: { sfl: 0, items: { Bracelet: 2000 } },
        cooldownMs: 30 * 24 * 60 * 60 * 1000,
      },
      {
        collectible: "Luxury Key",
        cost: { sfl: 0, items: { Bracelet: 1000 } },
        cooldownMs: 24 * 60 * 60 * 1000,
      },
      {
        collectible: "Double Bed",
        cost: { sfl: 0, items: { Wool: 5000, Gem: 2500, Bracelet: 1250 } },
      },
      {
        wearable: "Recycle Shirt",
        cost: { sfl: 400, items: {} },
      },
    ],
    requirement: 4,
  },
  mega: {
    items: [
      {
        collectible: "Giant Artichoke",
        cost: { sfl: 0, items: { Bracelet: 5500 } },
      },
      {
        wearable: "Pickaxe Shark",
        cost: { sfl: 0, items: { Bracelet: 8000 } },
      },
      {
        collectible: "Teamwork Monument",
        cost: { sfl: 0, items: { Bracelet: 1000 } },
      },
    ],
    requirement: 4,
  },
};

const PAW_PRINTS_ITEMS: ChapterStore = {
  basic: {
    items: [
      {
        collectible: "Petnip Plant",
        cost: { sfl: 10, items: {} },
      },
      {
        collectible: "Pet Kennel",
        cost: { sfl: 0, items: { "Pet Cookie": 50 } },
      },
      {
        collectible: "Pet Toys",
        cost: { sfl: 0, items: { "Moon Crystal": 44 } },
      },
      {
        collectible: "Bronze Flower Box",
        cooldownMs: 7 * 24 * 60 * 60 * 1000,
        cost: { sfl: 0, items: { "Pet Cookie": 500 } },
      },
      {
        collectible: "Treasure Key",
        cooldownMs: 24 * 60 * 60 * 1000,
        cost: { sfl: 0, items: { "Pet Cookie": 250 } },
      },
      {
        wearable: "Pet Specialist Hat",
        cost: { sfl: 0, items: { "Pet Cookie": 350 } },
      },
    ],
  },
  rare: {
    items: [
      {
        collectible: "Pet Playground",
        cost: { sfl: 70, items: {} },
      },
      {
        collectible: "Fish Bowl",
        cost: { sfl: 0, items: { "Moon Crystal": 88 } },
      },
      {
        collectible: "Silver Flower Box",
        cooldownMs: 7 * 24 * 60 * 60 * 1000,
        cost: { sfl: 0, items: { "Pet Cookie": 1250 } },
      },
      {
        collectible: "Rare Key",
        cooldownMs: 24 * 60 * 60 * 1000,
        cost: { sfl: 0, items: { "Pet Cookie": 500 } },
      },
      {
        collectible: "Giant Gold Bone",
        cost: { sfl: 0, items: { "Pet Cookie": 2500 } },
      },
      {
        wearable: "Pet Specialist Pants",
        cost: { sfl: 0, items: { "Pet Cookie": 700 } },
      },
      {
        collectible: "Giant Acorn",
        cost: { sfl: 0, items: { "Pet Cookie": 1500 } },
      },
    ],
    requirement: 4,
  },
  epic: {
    items: [
      {
        wearable: "Saw Fish",
        cost: { sfl: 0, items: { "Moon Crystal": 160 } },
      },
      {
        collectible: "Lunar Temple",
        cost: { sfl: 0, items: { "Pet Cookie": 3500 } },
      },
      {
        collectible: "Gold Flower Box",
        cooldownMs: 30 * 24 * 60 * 60 * 1000,
        cost: { sfl: 0, items: { "Pet Cookie": 2500 } },
      },
      {
        collectible: "Luxury Key",
        cooldownMs: 24 * 60 * 60 * 1000,
        cost: { sfl: 0, items: { "Pet Cookie": 1000 } },
      },
      {
        collectible: "Messy Bed",
        cost: {
          sfl: 0,
          items: { "Merino Wool": 6000, Crimstone: 300, "Pet Cookie": 2000 },
        },
      },
      {
        wearable: "Pet Specialist Shirt",
        cost: { sfl: 400, items: {} },
      },
      {
        collectible: "Pet Egg",
        cost: { sfl: 0, items: { "Pet Cookie": 2000 } },
        cooldownMs: CHAPTERS["Paw Prints"].endDate.getTime() - Date.now(),
      },
    ],
    requirement: 4,
  },
  mega: {
    items: [
      {
        collectible: "Magma Stone",
        cost: { sfl: 0, items: { "Pet Cookie": 8500 } },
      },
      {
        collectible: "Cornucopia",
        cost: { sfl: 0, items: { "Pet Cookie": 1000 } },
      },
    ],
    requirement: 4,
  },
};

export const MEGASTORE: Record<ChapterName, ChapterStore> = {
  "Catch the Kraken": EMPTY_SEASONAL_STORE,
  "Clash of Factions": EMPTY_SEASONAL_STORE,
  "Dawn Breaker": EMPTY_SEASONAL_STORE,
  "Solar Flare": EMPTY_SEASONAL_STORE,
  "Spring Blossom": EMPTY_SEASONAL_STORE,
  "Witches' Eve": EMPTY_SEASONAL_STORE,
  "Pharaoh's Treasure": {
    basic: {
      items: PHARAOH_ITEMS,
    },
    rare: {
      items: RARE_PHARAOH_ITEMS,
      requirement: 3,
    },
    epic: {
      items: EPIC_PHARAOH_ITEMS,
      requirement: 3,
    },
    mega: {
      items: EPIC_PHARAOH_ITEMS,
      requirement: 3,
    },
  },
  "Bull Run": {
    basic: {
      items: BULL_RUN_ITEMS,
    },
    rare: {
      items: RARE_BULL_RUN_ITEMS,
      requirement: 4,
    },
    epic: {
      items: EPIC_BULL_RUN_ITEMS,
      requirement: 4,
    },
    mega: {
      items: MEGA_BULL_RUN_ITEMS,
      requirement: 4,
    },
  },
  "Winds of Change": {
    basic: {
      items: WINDS_OF_CHANGE_ITEMS,
    },
    rare: {
      items: RARE_WINDS_OF_CHANGE_ITEMS,
      requirement: 4,
    },
    epic: {
      items: EPIC_WINDS_OF_CHANGE_ITEMS,
      requirement: 4,
    },
    mega: {
      items: MEGA_WINDS_OF_CHANGE_ITEMS,
      requirement: 4,
    },
  },
  "Great Bloom": GREAT_BLOOM_ITEMS,
  "Better Together": BETTER_TOGETHER_ITEMS,
  "Paw Prints": PAW_PRINTS_ITEMS,
};
