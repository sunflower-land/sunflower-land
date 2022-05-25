import Decimal from "decimal.js-light";
import { fromWei } from "web3-utils";
import { GameState, Inventory } from "../types/game";

export const GRID_WIDTH_PX = 42;

export const INITIAL_STOCK: Inventory = {
  "Sunflower Seed": new Decimal(400),
  "Potato Seed": new Decimal(200),
  "Pumpkin Seed": new Decimal(100),
  "Carrot Seed": new Decimal(100),
  "Cabbage Seed": new Decimal(90),
  "Beetroot Seed": new Decimal(80),
  "Cauliflower Seed": new Decimal(80),
  "Parsnip Seed": new Decimal(40),
  "Radish Seed": new Decimal(40),
  "Wheat Seed": new Decimal(40),

  Axe: new Decimal(50),
  Pickaxe: new Decimal(30),
  "Stone Pickaxe": new Decimal(10),
  "Iron Pickaxe": new Decimal(5),

  // One off items
  "Pumpkin Soup": new Decimal(1),
  Sauerkraut: new Decimal(1),
  "Roasted Cauliflower": new Decimal(1),
};

export const INITIAL_FIELDS: GameState["fields"] = {
  0: {
    name: "Sunflower",
    plantedAt: 0,
  },
  1: {
    name: "Sunflower",
    plantedAt: 0,
  },
  2: {
    name: "Sunflower",
    plantedAt: 0,
  },
  5: {
    name: "Carrot",
    plantedAt: 0,
  },
  6: {
    name: "Cabbage",
    plantedAt: 0,
  },
  10: {
    name: "Cauliflower",
    plantedAt: 0,
  },
  11: {
    name: "Beetroot",
    plantedAt: 0,
  },
  16: {
    name: "Parsnip",
    plantedAt: 0,
  },
  17: {
    name: "Radish",
    plantedAt: 0,
  },
};

export const INITIAL_TREES: GameState["trees"] = {
  0: {
    wood: new Decimal(3),
    choppedAt: 0,
  },
  1: {
    wood: new Decimal(4),
    choppedAt: 0,
  },
  2: {
    wood: new Decimal(5),
    choppedAt: 0,
  },
  3: {
    wood: new Decimal(5),
    choppedAt: 0,
  },
  4: {
    wood: new Decimal(3),
    choppedAt: 0,
  },
};

export const INITIAL_STONE: GameState["stones"] = {
  0: {
    amount: new Decimal(2),
    minedAt: 0,
  },
  1: {
    amount: new Decimal(3),
    minedAt: 0,
  },
  2: {
    amount: new Decimal(4),
    minedAt: 0,
  },
};

export const INITIAL_IRON: GameState["iron"] = {
  0: {
    amount: new Decimal(2),
    minedAt: 0,
  },
  1: {
    amount: new Decimal(3),
    minedAt: 0,
  },
};

export const INITIAL_GOLD: GameState["gold"] = {
  0: {
    amount: new Decimal(2),
    minedAt: 0,
  },
};

export const INITIAL_FARM: GameState = {
  balance: new Decimal(fromWei("0")),
  fields: INITIAL_FIELDS,
  inventory: {
    Sunflower: new Decimal(5),
    Potato: new Decimal(12),
    "Roasted Cauliflower": new Decimal(1),
    Sauerkraut: new Decimal(1),
    Wheat: new Decimal(3),
  },
  stock: INITIAL_STOCK,
  trees: INITIAL_TREES,
  stones: INITIAL_STONE,
  iron: INITIAL_IRON,
  gold: INITIAL_GOLD,
  chickens: {},
  skills: {
    farming: new Decimal(0),
    gathering: new Decimal(0),
  },
};

export const EMPTY: GameState = {
  balance: new Decimal(fromWei("0")),
  fields: {},
  inventory: {
    "Chicken Coop": new Decimal(1),
  },
  chickens: {},
  stock: {},
  trees: INITIAL_TREES,
  stones: INITIAL_STONE,
  iron: INITIAL_IRON,
  gold: INITIAL_GOLD,
  skills: {
    farming: new Decimal(0),
    gathering: new Decimal(0),
  },
};
