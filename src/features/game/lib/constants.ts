import Decimal from "decimal.js-light";
import { fromWei } from "web3-utils";
import { ChickenPosition, GameState, Inventory } from "../types/game";
import { TerrainTypeEnum } from "./getTerrainImageByKey";

export const GRID_WIDTH_PX = 42;
export const CHICKEN_TIME_TO_EGG = 1000 * 60 * 60 * 24 * 2; // 48 hours
export const MUTANT_CHICKEN_BOOST_AMOUNT = 0.1;

export const POPOVER_TIME_MS = 1000;

export const CHICKEN_POSITIONS: ChickenPosition[] = [
  { top: GRID_WIDTH_PX * 1.2, right: GRID_WIDTH_PX * 1.9 },
  { top: GRID_WIDTH_PX * 1.4, right: GRID_WIDTH_PX * 3.3 },
  { top: GRID_WIDTH_PX * 1.7, right: GRID_WIDTH_PX * 0.88 },
  { top: GRID_WIDTH_PX * 2.47, right: GRID_WIDTH_PX * 3 },
  { top: GRID_WIDTH_PX * 2.66, right: GRID_WIDTH_PX * 1.9 },
  { top: GRID_WIDTH_PX * 1.6, right: GRID_WIDTH_PX * 4.6 },
  { top: GRID_WIDTH_PX * 1.72, right: GRID_WIDTH_PX * 5.7 },
  { top: GRID_WIDTH_PX * 1.28, right: GRID_WIDTH_PX * 6.7 },
  { top: GRID_WIDTH_PX * 1.8, right: GRID_WIDTH_PX * 7.7 },
  { top: GRID_WIDTH_PX * 1.44, right: GRID_WIDTH_PX * 8.7 },
  { top: GRID_WIDTH_PX * 1.95, right: GRID_WIDTH_PX * 9.8 },
  { top: GRID_WIDTH_PX * 1.17, right: GRID_WIDTH_PX * 10.6 },
  { top: GRID_WIDTH_PX * 1.78, right: GRID_WIDTH_PX * 11.5 },
  { top: GRID_WIDTH_PX * 1.85, right: GRID_WIDTH_PX * 12.8 },
  { top: GRID_WIDTH_PX * 1.59, right: GRID_WIDTH_PX * 14.12 },
];

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

export const INITIAL_SHRUBS: GameState["shrubs"] = {
  0: {
    wood: "0.1",
    choppedAt: 0,
    x: -3,
    y: 3,
    height: 2,
    width: 2,
  },
};

export const INITIAL_PEBBLES: GameState["pebbles"] = {
  0: {
    amount: "0.1",
    minedAt: 0,
    x: 1,
    y: -1,
    height: 1,
    width: 1,
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

export const INITIAL_TERRAIN: GameState["terrains"] = {
  0: {
    name: TerrainTypeEnum.terrain1,
    height: 3,
    width: 3,
    x: -2,
    y: 1,
  },
};

export const INITIAL_PLOTS: GameState["plots"] = {
  0: {
    crop: { name: "Sunflower", plantedAt: 0 },
    x: -1,
    y: 1,
    height: 1,
    width: 1,
  },
  1: {
    crop: { name: "Sunflower", plantedAt: 0 },
    x: 0,
    y: 0,
    height: 1,
    width: 1,
  },
  2: {
    crop: { name: "Sunflower", plantedAt: 0 },
    x: -1,
    y: 0,
    height: 1,
    width: 1,
  },
  3: {
    x: -1,
    y: -1,
    height: 1,
    width: 1,
  },
  4: {
    x: -2,
    y: 0,
    height: 1,
    width: 1,
  },
};

export const INITIAL_FARM: GameState = {
  balance: new Decimal(fromWei("0")),
  fields: INITIAL_FIELDS,
  inventory: {
    Sunflower: new Decimal(5),
    Potato: new Decimal(12),
    "Roasted Cauliflower": new Decimal(1),
    "Carrot Cake": new Decimal(1),
    Radish: new Decimal(100),
    Wheat: new Decimal(100),
    Egg: new Decimal(15),
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
  stockExpiry: {
    "Sunflower Cake": "1970-06-06",
    "Potato Cake": "1970-01-01T00:00:00.000Z",
    "Pumpkin Cake": "1970-01-01T00:00:00.000Z",
    "Carrot Cake": "1970-01-01T00:00:00.000Z",
    "Cabbage Cake": "1970-01-01T00:00:00.000Z",
    "Beetroot Cake": "1970-01-01T00:00:00.000Z",
    "Cauliflower Cake": "1970-01-01T00:00:00.000Z",
    "Parsnip Cake": "1970-01-01T00:00:00.000Z",
    "Radish Cake": "2025-01-01T00:00:00.000Z",
    "Wheat Cake": "1970-01-01T00:00:00.000Z",
  },
  shrubs: INITIAL_SHRUBS,
  pebbles: INITIAL_PEBBLES,
  terrains: INITIAL_TERRAIN,
  plots: INITIAL_PLOTS,
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
  stockExpiry: {},
  shrubs: INITIAL_SHRUBS,
  pebbles: INITIAL_PEBBLES,
  terrains: INITIAL_TERRAIN,
  plots: INITIAL_PLOTS,
};
