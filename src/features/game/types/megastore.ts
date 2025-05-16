import { FlowerBox } from "../events/landExpansion/buySeasonalItem";
import { BumpkinItem } from "./bumpkin";
import { InventoryItemName } from "./game";
import { SeasonName } from "./seasons";

export type SeasonalTierItemName =
  | SeasonalCollectibleName
  | SeasonalWearableName
  | MegastoreKeys;

export type SeasonalCollectibleName =
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
  | "Mini Floating Island";

export type SeasonalWearableName = Extract<
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
>;

export type MegastoreKeys = "Treasure Key" | "Rare Key" | "Luxury Key";

type SeasonalStoreBase = {
  cost: {
    items: Partial<Record<InventoryItemName, number>>;
    sfl: number;
  };
  cooldownMs?: number;
};

export type SeasonalStoreWearable = SeasonalStoreBase & {
  wearable: SeasonalWearableName;
};
export type SeasonalStoreCollectible = SeasonalStoreBase & {
  collectible: SeasonalCollectibleName | MegastoreKeys | FlowerBox;
};

export type SeasonalStoreItem =
  | SeasonalStoreWearable
  | SeasonalStoreCollectible;

export type SeasonalStore = {
  basic: {
    items: SeasonalStoreItem[];
  };
  rare: {
    items: SeasonalStoreItem[];
    requirement: number;
  };
  epic: {
    items: SeasonalStoreItem[];
    requirement: number;
  };
  mega: {
    items: SeasonalStoreItem[];
    requirement: number;
  };
};

export type SeasonalStoreTier = keyof SeasonalStore;

const EMPTY_SEASONAL_STORE: SeasonalStore = {
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
const PHARAOH_ITEMS: SeasonalStoreItem[] = [
  {
    wearable: "Red Farmer Shirt" as SeasonalWearableName,
    cost: {
      items: {},
      sfl: 5,
    },
  },
  {
    collectible: "Basic Bear" as SeasonalCollectibleName,
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

const RARE_PHARAOH_ITEMS: SeasonalStoreItem[] = [
  {
    wearable: "Rancher Hair" as SeasonalWearableName,
    cost: {
      items: {
        Wood: 1,
        Stone: 1,
      },
      sfl: 10,
    },
  },
  {
    wearable: "Axe" as SeasonalWearableName,
    cost: {
      items: {
        Wood: 1,
      },
      sfl: 5,
    },
  },
  {
    wearable: "Yellow Farmer Shirt" as SeasonalWearableName,
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
const EPIC_PHARAOH_ITEMS: SeasonalStoreItem[] = [
  {
    wearable: "Blue Farmer Shirt" as SeasonalWearableName,
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

const BULL_RUN_ITEMS: SeasonalStoreItem[] = [
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

const RARE_BULL_RUN_ITEMS: SeasonalStoreItem[] = [
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

const EPIC_BULL_RUN_ITEMS: SeasonalStoreItem[] = [
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

const MEGA_BULL_RUN_ITEMS: SeasonalStoreItem[] = [
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

const WINDS_OF_CHANGE_ITEMS: SeasonalStoreItem[] = [
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

const RARE_WINDS_OF_CHANGE_ITEMS: SeasonalStoreItem[] = [
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

const EPIC_WINDS_OF_CHANGE_ITEMS: SeasonalStoreItem[] = [
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

const MEGA_WINDS_OF_CHANGE_ITEMS: SeasonalStoreItem[] = [
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

const GREAT_BLOOM_ITEMS: SeasonalStore = {
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

export const MEGASTORE: Record<SeasonName, SeasonalStore> = {
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
};
