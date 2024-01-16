import Decimal from "decimal.js-light";
import { GameState, Inventory, IslandType } from "features/game/types/game";

import cloneDeep from "lodash.clonedeep";

export type UpgradeFarmAction = {
  type: "farm.upgraded";
};

type Options = {
  state: Readonly<GameState>;
  action: UpgradeFarmAction;
  createdAt?: number;
};

const INITIAL_LAND: Pick<
  GameState,
  "buildings" | "crops" | "fruitPatches" | "stones" | "iron" | "gold" | "trees"
> = {
  buildings: {
    House: [
      {
        id: "1",
        readyAt: 0,
        coordinates: {
          x: -1,
          y: 5,
        },
        createdAt: 0,
      },
    ],
    Workbench: [
      {
        id: "1",
        readyAt: 0,
        coordinates: {
          x: 6,
          y: 6,
        },
        createdAt: 0,
      },
    ],
    Market: [
      {
        id: "1",
        readyAt: 0,
        coordinates: {
          x: 6,
          y: 3,
        },
        createdAt: 0,
      },
    ],
    "Fire Pit": [
      {
        id: "1123",
        readyAt: 0,
        coordinates: {
          x: 6,
          y: 0,
        },
        createdAt: 0,
      },
    ],
  },
  crops: {
    "1": {
      createdAt: 1703364823336,
      crop: {
        name: "Sunflower",
        plantedAt: 0,
        amount: 1,
      },
      x: -2,
      y: 0,
      height: 1,
      width: 1,
    },
    "2": {
      createdAt: 1703364823336,
      crop: {
        name: "Sunflower",
        plantedAt: 0,
        amount: 1,
      },
      x: -1,
      y: 0,
      height: 1,
      width: 1,
    },
    "3": {
      createdAt: 1703364823336,
      crop: {
        name: "Sunflower",
        plantedAt: 0,
        amount: 1,
      },
      x: 0,
      y: 0,
      height: 1,
      width: 1,
    },
    "4": {
      createdAt: 1703364823336,
      x: -2,
      y: -1,
      height: 1,
      width: 1,
    },
    "5": {
      createdAt: 1703364823336,
      x: -1,
      y: -1,
      height: 1,
      width: 1,
    },
    "6": {
      createdAt: 1703364823336,
      x: 0,
      y: -1,
      height: 1,
      width: 1,
    },
    "7": {
      createdAt: 1703364823336,
      x: -2,
      y: 1,
      height: 1,
      width: 1,
    },
    "8": {
      createdAt: 1703364823336,
      x: -1,
      y: 1,
      height: 1,
      width: 1,
    },
    "9": {
      createdAt: 1703364823336,
      x: 0,
      y: 1,
      height: 1,
      width: 1,
    },
    "10": {
      createdAt: 1703365405829,
      x: 1,
      y: 1,
      width: 1,
      height: 1,
    },
    "11": {
      createdAt: 1703365405976,
      x: 1,
      y: 0,
      width: 1,
      height: 1,
    },
    12: {
      createdAt: 1703365406093,
      x: 1,
      y: -1,
      width: 1,
      height: 1,
    },
    13: {
      createdAt: 1703365409614,
      x: 2,
      y: 1,
      width: 1,
      height: 1,
    },
    "14": {
      createdAt: 1703365409776,
      x: 2,
      y: 0,
      width: 1,
      height: 1,
    },
    "15": {
      createdAt: 1703365409926,
      x: 2,
      y: -1,
      width: 1,
      height: 1,
    },
    "16": {
      createdAt: 1703365428830,
      x: 3,
      y: 1,
      width: 1,
      height: 1,
    },
    "17": {
      createdAt: 1703365429062,
      x: 3,
      y: 0,
      width: 1,
      height: 1,
    },
    18: {
      createdAt: 1703365429630,
      x: 3,
      y: -1,
      width: 1,
      height: 1,
    },
  },
  fruitPatches: {
    "1": {
      fruit: {
        amount: 2,
        name: "Apple",
        harvestedAt: 0,
        harvestsLeft: 3,
        plantedAt: 0,
      },
      x: 0,
      y: 9,
      height: 2,
      width: 2,
    },
    "2": {
      fruit: {
        amount: 1,
        name: "Apple",
        harvestedAt: 0,
        harvestsLeft: 3,
        plantedAt: 0,
      },
      x: -2,
      y: 9,
      height: 2,
      width: 2,
    },
  },
  trees: {
    "1": {
      wood: {
        amount: 2,
        choppedAt: 0,
      },
      x: 3,
      y: 6,
      height: 2,
      width: 2,
    },
    "2": {
      wood: {
        amount: 1,
        choppedAt: 0,
      },
      x: 3,
      y: 4,
      height: 2,
      width: 2,
    },
    "3": {
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
  gold: {
    1: {
      x: 3,
      y: 9,
      width: 1,
      height: 1,
      stone: {
        amount: 0,
        minedAt: 0,
      },
    },
  },
  iron: {
    "1": {
      x: 5,
      y: 8,
      width: 1,
      height: 1,
      stone: {
        amount: 0,
        minedAt: 0,
      },
    },
  },
  stones: {
    "1": {
      stone: {
        amount: 1,
        minedAt: 0,
      },
      x: -3,
      y: 5,
      height: 1,
      width: 1,
    },
    "2": {
      stone: {
        amount: 1,
        minedAt: 0,
      },
      x: -2,
      y: 3,
      height: 1,
      width: 1,
    },
  },
};

export const ISLAND_UPGRADE: Record<
  IslandType,
  { items: Inventory; expansions: number; upgrade: IslandType }
> = {
  basic: {
    expansions: 9,
    items: {
      Gold: new Decimal(10),
    },
    upgrade: "spring",
  },
  spring: {
    expansions: 16,
    items: {
      Gold: new Decimal(9999999999),
    },
    upgrade: "spring", // TODO
  },
};
export function updgrade({ state, action, createdAt = Date.now() }: Options) {
  let game = cloneDeep(state) as GameState;

  // Check the requirements

  // Burn the requirements

  // Clear all placed items
  game.collectibles = {};
  game.buildings = {};
  game.fishing.wharf = {};

  // Set the island
  game.island = {
    type: "spring",
    upgradedAt: createdAt,
  };

  // Reset expansions
  game.inventory["Basic Land"] = new Decimal(4);

  // Clear the house
  delete game.inventory["Town Center"];

  // Add new resources
  game.inventory.House = new Decimal(1);
  game.inventory["Fruit Patch"] = new Decimal(2);

  // Place initial resources
  game = {
    ...game,
    ...INITIAL_LAND,
  };

  return {
    ...game,
  };
}
