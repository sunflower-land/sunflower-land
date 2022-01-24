import Decimal from "decimal.js-light";
import { fromWei } from "web3-utils";
import { GameState } from "../types/game";

export const GRID_WIDTH_PX = 42;

export const INITIAL_FARM: GameState = {
  id: 1,
  balance: new Decimal(fromWei("2999999999999999990")),
  fields: [
    {
      fieldIndex: 0,
      crop: {
        name: "Sunflower",
        plantedAt: 0,
      },
    },
    {
      fieldIndex: 1,
      crop: {
        name: "Sunflower",
        plantedAt: 0,
      },
    },
    {
      fieldIndex: 2,
      crop: {
        name: "Sunflower",
        plantedAt: 0,
      },
    },
    {
      fieldIndex: 3,
    },
    {
      fieldIndex: 4,
    },
    {
      fieldIndex: 5,
      crop: {
        name: "Carrot",
        plantedAt: 0,
      },
    },
    {
      fieldIndex: 6,
      crop: {
        name: "Cabbage",
        plantedAt: 0,
      },
    },
    {
      fieldIndex: 7,
    },
    {
      fieldIndex: 8,
    },
    {
      fieldIndex: 9,
    },
    {
      fieldIndex: 10,
      crop: {
        name: "Cauliflower",
        plantedAt: 0,
      },
    },
    {
      fieldIndex: 11,
      crop: {
        name: "Beetroot",
        plantedAt: 0,
      },
    },
    {
      fieldIndex: 12,
    },
    {
      fieldIndex: 13,
    },
    {
      fieldIndex: 14,
    },
    {
      fieldIndex: 15,
    },
    {
      fieldIndex: 16,
      crop: {
        name: "Parsnip",
        plantedAt: 0,
      },
    },
    {
      fieldIndex: 17,
      crop: {
        name: "Radish",
        plantedAt: 0,
      },
    },
    {
      fieldIndex: 18,
    },
    {
      fieldIndex: 19,
    },
    {
      fieldIndex: 20,
    },
    {
      fieldIndex: 21,
    },
  ],
  inventory: {
    "Sunflower Seed": 3,
    "Pumpkin Soup": 1,
  },
};
