import { InventoryItemName, GameState } from "./game";

type DailyReward = {
  id: string;
  weighting: number;
  coins?: number;
  items?: Partial<Record<InventoryItemName, number>>;
};

// The ID's have been generated using "openssl rand -hex 8"
// if you need to add a new treasure, generate its ID using that command.

// Players on the first 5 expansions
export const BASIC_DAILY_REWARDS: DailyReward[] = [
  {
    id: "0434c1784b5f6d81",
    coins: 100,
    weighting: 100,
  },
  {
    id: "b063229e7232c433",
    items: {
      "Bumpkin Salad": 1,
    },
    weighting: 150,
  },
  {
    id: "3a94221a9fb629bf",
    items: {
      Pickaxe: 2,
    },
    weighting: 200,
  },
  {
    id: "9c0cb17cd259878e",
    items: {
      "Roast Veggies": 1,
    },
    weighting: 500,
  },
  {
    id: "eaa5b80912336367",
    coins: 50,
    weighting: 600,
  },

  {
    id: "7121043ba100868c",
    items: {
      Wood: 10,
    },
    weighting: 700,
  },
  {
    id: "236b280263dee2ed",
    items: {
      "Carrot Seed": 50,
    },
    weighting: 800,
  },
  {
    id: "7ea8c0ccf7c823b0",
    items: {
      "Boiled Eggs": 1,
    },
    weighting: 900,
  },

  {
    id: "7ec5e239c9aaec16",
    items: {
      Axe: 5,
    },
    weighting: 1000,
  },

  {
    id: "c4881eba898f8837",
    items: {
      "Bumpkin Broth": 1,
    },
    weighting: 1500,
  },
  {
    id: "742105c65236a0a8",
    items: {
      "Pumpkin Seed": 50,
    },
    weighting: 1500,
  },
  {
    id: "2c7812eaa471caf9",
    items: {
      "Potato Seed": 50,
    },
    weighting: 1500,
  },
];

export const ADVANCED_DAILY_REWARDS: DailyReward[] = [
  {
    id: "5e3c0541ec4f8c5a",
    weighting: 50,
    items: {
      Gold: 1,
    },
  },
  {
    id: "f7b79fb0bf64ee4d",
    coins: 120,
    weighting: 100,
  },
  {
    id: "de8239925339e147",
    weighting: 150,
    items: {
      Iron: 2,
    },
  },

  {
    id: "6e8028fe04f0e169",
    weighting: 200,
    items: {
      Stone: 15,
    },
  },
  {
    id: "c413dabde3aee06b",
    weighting: 250,
    items: {
      "Kale Seed": 20,
    },
  },
  {
    id: "c0097c107e49c4cd",
    weighting: 300,
    items: {
      Wheat: 25,
    },
  },

  {
    id: "a55cb9bb9dbc7e09",
    coins: 100,
    weighting: 350,
  },
  {
    id: "f43cb9bb9dbc7e10",
    items: {
      Earthworm: 5,
    },
    weighting: 700,
  },
  {
    id: "a44a9a779598354c",
    weighting: 400,
    items: {
      "Beetroot Cake": 1,
    },
  },
  {
    id: "cfd43f602f7aac8a",
    coins: 80,
    weighting: 500,
  },
  {
    id: "22c145668adf2052",
    weighting: 500,
    items: {
      "Cabbage Cake": 1,
    },
  },
  {
    id: "9b85001f473f582d",
    weighting: 600,
    items: {
      "Carrot Cake": 1,
    },
  },
  {
    id: "d6db662566c30304",
    weighting: 700,
    items: {
      Sauerkraut: 1,
    },
  },
  {
    id: "c62d3ccf8c1f4be7",
    weighting: 800,
    items: {
      "Pumpkin Cake": 1,
    },
  },
  {
    id: "4264d72104b1607a",
    weighting: 900,
    items: {
      "Potato Cake": 1,
    },
  },
  {
    id: "761ecc7368b416be",
    weighting: 1000,
    items: {
      "Apple Juice": 1,
    },
  },
  {
    id: "ad3208dcc051cc96",
    weighting: 1100,
    items: {
      "Sunflower Cake": 1,
    },
  },
  {
    id: "01a7ec9da78a1dda",
    weighting: 1200,
    items: {
      Axe: 20,
    },
  },
  {
    id: "7fd5e1c125eaee8d",
    weighting: 1300,
    items: {
      Egg: 10,
    },
  },
  {
    id: "8594ab28d098bd7d",
    weighting: 1400,
    items: {
      "Goblin's Treat": 1,
    },
  },
];

export const EXPERT_DAILY_REWARDS: DailyReward[] = [
  {
    id: "46ab8396f67a7f3c",
    weighting: 5,
    items: {
      Gold: 5,
    },
  },
  {
    id: "004a376ede940077",
    weighting: 10,
    coins: 500,
  },
  {
    id: "79924a10066fdfaf",
    weighting: 20,
    coins: 400,
  },
  {
    id: "ba816188dbedebe6",
    weighting: 40,
    items: {
      "Iron Pickaxe": 3,
    },
  },
  {
    id: "1e39fd5dd1006fe5",
    weighting: 300,
    items: {
      Iron: 5,
    },
  },

  {
    id: "7de13aff283e1405",
    weighting: 500,
    coins: 350,
  },
  {
    id: "407864c3700b2b25",
    weighting: 600,
    items: {
      Stone: 10,
    },
  },
  {
    id: "f90de9bb9dbc7g12",
    items: {
      "Red Wiggler": 3,
    },
    weighting: 700,
  },
  {
    id: "b15692ea3964312c",
    weighting: 800,
    items: {
      "Beetroot Cake": 1,
    },
  },
  {
    id: "5b55581fdb488ff5",
    weighting: 900,
    items: {
      "Cauliflower Cake": 1,
    },
  },
  {
    id: "5109540c5a9fa03d",
    weighting: 1000,
    items: {
      "Parsnip Cake": 1,
    },
  },
  {
    id: "b755e0b64ba670a4",
    weighting: 500,
    coins: 300,
  },

  {
    id: "fb8c1d3f7827dc61",
    weighting: 1100,
    items: {
      "Radish Cake": 1,
    },
  },
  {
    id: "2073099a8507ed35",
    weighting: 1200,
    items: {
      Egg: 20,
    },
  },
  {
    id: "6e8047c08cfa2f52",
    weighting: 1400,
    items: {
      "Wheat Cake": 1,
    },
  },
  {
    id: "a030d86bb5308d0b",
    weighting: 1600,
    items: {
      "Power Smoothie": 1,
    },
  },
  {
    id: "cdde2fb6824a09d4",
    weighting: 1700,
    coins: 250,
  },
  {
    id: "5c6f0a652aabd699",
    weighting: 1800,
    items: {
      "Bumpkin Detox": 1,
    },
  },
  {
    id: "bd1162611476912d",
    weighting: 2000,
    items: {
      "Banana Plant": 5,
    },
  },
  {
    id: "e1997ce52816d560",
    weighting: 2200,
    items: {
      "Stone Pickaxe": 3,
    },
  },
  {
    id: "e26f1863a33588c9",
    weighting: 2400,
    items: {
      Pickaxe: 5,
    },
  },
  {
    id: "0f048d1cdaf65816",
    weighting: 2600,
    items: {
      Wheat: 25,
    },
  },
  {
    id: "2ff77f6935459c91",
    weighting: 3000,
    items: {
      Axe: 20,
    },
  },
];

export const DAILY_REWARDS: DailyReward[] = [
  ...BASIC_DAILY_REWARDS,
  ...ADVANCED_DAILY_REWARDS,
  ...EXPERT_DAILY_REWARDS,
];

// Based on their progress, determine which rewards they are eligible for
export function possibleRewards(game: GameState) {
  if (game.inventory["Basic Land"]?.gte(9)) {
    return EXPERT_DAILY_REWARDS;
  }

  if (game.inventory["Basic Land"]?.gte(5)) {
    return ADVANCED_DAILY_REWARDS;
  }

  return BASIC_DAILY_REWARDS;
}
