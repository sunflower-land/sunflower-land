import Decimal from "decimal.js-light";
import { fromWei } from "web3-utils";
import { GameState } from "../types/game";

export const GRID_WIDTH_PX = 42;

export const INITIAL_FARM: GameState = {
  id: 1,
  balance: new Decimal(fromWei("2999999999999999990")),
  fields: {
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
  },
  inventory: {
    "Sunflower Seed": 3,
    "Pumpkin Soup": 1,
    "Roasted Cauliflower": 1,
    Sauerkraut: 1,
  },
};
