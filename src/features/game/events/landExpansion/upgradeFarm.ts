import Decimal from "decimal.js-light";
import { TOTAL_EXPANSION_NODES } from "features/game/expansion/lib/expansionNodes";
import { EXPIRY_COOLDOWNS } from "features/game/lib/collectibleBuilt";
import { getKeys } from "features/game/types/craftables";
import {
  GameState,
  Inventory,
  InventoryItemName,
  IslandType,
} from "features/game/types/game";

import cloneDeep from "lodash.clonedeep";
import { translate } from "lib/i18n/translate";

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
  | "buildings"
  | "crops"
  | "fruitPatches"
  | "stones"
  | "iron"
  | "gold"
  | "trees"
  | "flowers"
  | "beehives"
  | "crimstones"
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
        amount: 2,
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
        amount: 1,
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
  flowers: {
    discovered: {},
    flowerBeds: {},
  },
  beehives: {},
  crimstones: {},
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
      Gold: new Decimal(9999999999), // TODO
    },
    upgrade: "desert",
  },
  // TODO
  desert: {
    expansions: 99,
    items: {
      Gold: new Decimal(9999999999),
    },
    upgrade: "desert",
  },
};

function springUpgrade(state: GameState) {
  const game = cloneDeep(state) as GameState;
  // Clear the house
  delete game.inventory["Town Center"];

  // Add new resources
  game.inventory.House = new Decimal(1);

  // Ensure they have the minimum resources to start the island with
  const minimum = TOTAL_EXPANSION_NODES.spring[4];

  Object.entries(minimum).forEach(([name, amount]) => {
    const item = game.inventory[name as InventoryItemName] ?? new Decimal(0);
    if (item.lt(amount)) {
      game.inventory[name as InventoryItemName] = new Decimal(amount);
    }
  });

  game.airdrops = [
    ...(game.airdrops ?? []),
    {
      id: "spring-upgrade-reward",
      coordinates: {
        x: -1,
        y: 7,
      },
      createdAt: 0,
      items: {
        Blossombeard: 1,
      },
      sfl: 0,
      coins: 0,
      wearables: {},
      message: translate("islandupgrade.welcomePetalParadise"),
    },
  ];

  return game;
}

/**
 * Any stale items that are still on the island or home
 */
export function expireItems({
  game,
  createdAt,
}: {
  game: GameState;
  createdAt: number;
}) {
  const inActiveTimeWarps = [
    ...(game.collectibles["Time Warp Totem"] ?? []),
    ...(game.home.collectibles["Time Warp Totem"] ?? []),
  ].filter(
    (totem) =>
      totem.createdAt + (EXPIRY_COOLDOWNS["Time Warp Totem"] ?? 0) < createdAt
  ).length;

  if (inActiveTimeWarps > 0) {
    const previous = game.inventory["Time Warp Totem"] ?? new Decimal(0);
    game.inventory["Time Warp Totem"] = previous.sub(inActiveTimeWarps);
  }

  return game;
}

function desertUpgrade(_: GameState) {
  throw new Error("Not implemented");

  return _;
}
export function upgrade({ state, action, createdAt = Date.now() }: Options) {
  let game = cloneDeep(state) as GameState;

  const upcoming = ISLAND_UPGRADE[game.island.type];

  if (game.inventory["Basic Land"]?.lt(upcoming.expansions)) {
    throw new Error("Player has not met the expansion requirements");
  }

  // Check & burnthe requirements
  Object.entries(upcoming.items).forEach(([name, required]) => {
    const amount = game.inventory[name as InventoryItemName] ?? new Decimal(0);
    if (amount.lt(required)) {
      throw new Error(`Insufficient ${name}`);
    }

    // Burn the ingredients
    game.inventory[name as InventoryItemName] = amount.minus(required);
  });

  // Remove any time sensitive items that have expired
  game = expireItems({ game, createdAt });

  // Clear all in progress items
  game.collectibles = {};
  game.buildings = {};
  game.chickens = {};
  game.fishing.wharf = {};
  game.mushrooms = {
    mushrooms: {},
    spawnedAt: game.mushrooms?.spawnedAt ?? 0,
  };
  game.buds = getKeys(game.buds ?? {}).reduce(
    (acc, key) => ({
      ...acc,
      [key]: {
        ...(game.buds ?? {})[key],
        location: undefined,
        coordinates: undefined,
      },
    }),
    game.buds
  );

  // Set the island
  game.island = {
    type: "spring",
    upgradedAt: createdAt,
    previousExpansions: game.inventory["Basic Land"]?.toNumber() ?? 0,
  };

  if (upcoming.upgrade === "spring") {
    game = springUpgrade(game);
  }

  if (upcoming.upgrade === "desert") {
    game = desertUpgrade(game);
  }

  // Reset expansions
  game.inventory["Basic Land"] = new Decimal(4);

  game =
    // Place initial resources
    game = {
      ...game,
      ...INITIAL_LAND,
    };

  return {
    ...game,
  };
}
