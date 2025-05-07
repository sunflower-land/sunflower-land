import Decimal from "decimal.js-light";
import { TOTAL_EXPANSION_NODES } from "features/game/expansion/lib/expansionNodes";
import { EXPIRY_COOLDOWNS } from "features/game/lib/collectibleBuilt";
import { CollectibleName, getKeys } from "features/game/types/craftables";
import {
  GameState,
  Inventory,
  InventoryItemName,
  IslandType,
  Season,
  TemperateSeasonName,
} from "features/game/types/game";

import { translate } from "lib/i18n/translate";
import { Coordinates } from "features/game/expansion/components/MapPlacement";
import cloneDeep from "lodash.clonedeep";

export type UpgradeFarmAction = {
  type: "farm.upgraded";
};

type Options = {
  state: Readonly<GameState>;
  action: UpgradeFarmAction;
  createdAt?: number;
};

const INITIAL_SPRING_LAND: Pick<
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
    },
    "4": {
      createdAt: 1703364823336,
      x: -2,
      y: -1,
    },
    "5": {
      createdAt: 1703364823336,
      x: -1,
      y: -1,
    },
    "6": {
      createdAt: 1703364823336,
      x: 0,
      y: -1,
    },
    "7": {
      createdAt: 1703364823336,
      x: -2,
      y: 1,
    },
    "8": {
      createdAt: 1703364823336,
      x: -1,
      y: 1,
    },
    "9": {
      createdAt: 1703364823336,
      x: 0,
      y: 1,
    },
    "10": {
      createdAt: 1703365405829,
      x: 1,
      y: 1,
    },
    "11": {
      createdAt: 1703365405976,
      x: 1,
      y: 0,
    },
    12: {
      createdAt: 1703365406093,
      x: 1,
      y: -1,
    },
    13: {
      createdAt: 1703365409614,
      x: 2,
      y: 1,
    },
    "14": {
      createdAt: 1703365409776,
      x: 2,
      y: 0,
    },
    "15": {
      createdAt: 1703365409926,
      x: 2,
      y: -1,
    },
    "16": {
      createdAt: 1703365428830,
      x: 3,
      y: 1,
    },
    "17": {
      createdAt: 1703365429062,
      x: 3,
      y: 0,
    },
    18: {
      createdAt: 1703365429630,
      x: 3,
      y: -1,
    },
  },
  fruitPatches: {
    "1": {
      createdAt: 0,
      fruit: {
        amount: 2,
        name: "Apple",
        harvestedAt: 0,
        harvestsLeft: 3,
        plantedAt: 0,
      },
      x: 0,
      y: 9,
    },
    "2": {
      createdAt: 0,
      fruit: {
        amount: 1,
        name: "Apple",
        harvestedAt: 0,
        harvestsLeft: 3,
        plantedAt: 0,
      },
      x: -2,
      y: 9,
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
    },
    "2": {
      wood: {
        amount: 1,
        choppedAt: 0,
      },
      x: 3,
      y: 4,
    },
    "3": {
      wood: {
        amount: 2,
        choppedAt: 0,
      },
      x: 7,
      y: 9,
    },
  },
  gold: {
    1: {
      x: 3,
      y: 9,
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
    },
    "2": {
      stone: {
        amount: 1,
        minedAt: 0,
      },
      x: -2,
      y: 3,
    },
  },
};

const INITIAL_DESERT_LAND: Pick<
  GameState,
  "buildings" | "crops" | "fruitPatches" | "stones" | "iron" | "gold" | "trees"
> = {
  buildings: {
    Manor: [
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
    },
    "4": {
      createdAt: 1703364823336,
      x: -2,
      y: -1,
    },
    "5": {
      createdAt: 1703364823336,
      x: -1,
      y: -1,
    },
    "6": {
      createdAt: 1703364823336,
      x: 0,
      y: -1,
    },
    "7": {
      createdAt: 1703364823336,
      x: -2,
      y: 1,
    },
    "8": {
      createdAt: 1703364823336,
      x: -1,
      y: 1,
    },
    "9": {
      createdAt: 1703364823336,
      x: 0,
      y: 1,
    },
    "10": {
      createdAt: 1703365405829,
      x: 1,
      y: 1,
    },
    "11": {
      createdAt: 1703365405976,
      x: 1,
      y: 0,
    },
    12: {
      createdAt: 1703365406093,
      x: 1,
      y: -1,
    },
    13: {
      createdAt: 1703365409614,
      x: 2,
      y: 1,
    },
    "14": {
      createdAt: 1703365409776,
      x: 2,
      y: 0,
    },
    "15": {
      createdAt: 1703365409926,
      x: 2,
      y: -1,
    },
    "16": {
      createdAt: 1703365428830,
      x: 3,
      y: 1,
    },
    "17": {
      createdAt: 1703365429062,
      x: 3,
      y: 0,
    },
    18: {
      createdAt: 1703365429630,
      x: 3,
      y: -1,
    },
  },
  fruitPatches: {
    "1": {
      createdAt: 0,
      fruit: {
        amount: 2,
        name: "Apple",
        harvestedAt: 0,
        harvestsLeft: 3,
        plantedAt: 0,
      },
      x: 0,
      y: 9,
    },
    "2": {
      createdAt: 0,
      fruit: {
        amount: 1,
        name: "Apple",
        harvestedAt: 0,
        harvestsLeft: 3,
        plantedAt: 0,
      },
      x: -2,
      y: 9,
    },
  },
  trees: {
    "1": {
      wood: {
        amount: 2,
        choppedAt: 0,
      },
      x: 4,
      y: 6,
    },
    "2": {
      wood: {
        amount: 1,
        choppedAt: 0,
      },
      x: 4,
      y: 4,
    },
    "3": {
      wood: {
        amount: 2,
        choppedAt: 0,
      },
      x: 7,
      y: 9,
    },
  },
  gold: {
    1: {
      x: 3,
      y: 9,
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
    },
    "2": {
      stone: {
        amount: 1,
        minedAt: 0,
      },
      x: -2,
      y: 3,
    },
  },
};

const INITIAL_VOLCANO_LAND: Pick<
  GameState,
  | "buildings"
  | "crops"
  | "fruitPatches"
  | "stones"
  | "iron"
  | "gold"
  | "trees"
  | "oilReserves"
> = {
  buildings: {
    Mansion: [
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
  oilReserves: {
    "1": {
      x: -8,
      y: 8,
      oil: {
        amount: 10,
        drilledAt: 0,
      },
      drilled: 0,
      createdAt: 0,
    },
  },
  crops: {
    "1": {
      createdAt: 1703364823336,
      crop: {
        name: "Sunflower",
        plantedAt: 0,
        amount: 1,
      },
      x: -1,
      y: -1,
    },
    "2": {
      createdAt: 1703364823336,
      crop: {
        name: "Sunflower",
        plantedAt: 0,
        amount: 1,
      },
      x: 0,
      y: -1,
    },
    "3": {
      createdAt: 1703364823336,
      crop: {
        name: "Sunflower",
        plantedAt: 0,
        amount: 1,
      },
      x: 1,
      y: -1,
    },
    "4": {
      createdAt: 1703364823336,
      x: -1,
      y: -2,
    },
    "5": {
      createdAt: 1703364823336,
      x: 0,
      y: -2,
    },
    "6": {
      createdAt: 1703364823336,
      x: 1,
      y: -2,
    },
    "7": {
      createdAt: 1703364823336,
      x: -1,
      y: 0,
    },
    "8": {
      createdAt: 1703364823336,
      x: 0,
      y: 0,
    },
    "9": {
      createdAt: 1703364823336,
      x: 1,
      y: 0,
    },
    "10": {
      createdAt: 1703365405829,
      x: 2,
      y: 0,
    },
    "11": {
      createdAt: 1703365405976,
      x: 2,
      y: -1,
    },
    12: {
      createdAt: 1703365406093,
      x: 2,
      y: -2,
    },
    13: {
      createdAt: 1703365409614,
      x: 3,
      y: 0,
    },
    "14": {
      createdAt: 1703365409776,
      x: 3,
      y: -1,
    },
    "15": {
      createdAt: 1703365409926,
      x: 3,
      y: -2,
    },
    "16": {
      createdAt: 1703365428830,
      x: 4,
      y: 0,
    },
    "17": {
      createdAt: 1703365429062,
      x: 4,
      y: -1,
    },
    18: {
      createdAt: 1703365429630,
      x: 4,
      y: -2,
    },
  },
  fruitPatches: {
    "1": {
      createdAt: 0,
      fruit: {
        amount: 2,
        name: "Apple",
        harvestedAt: 0,
        harvestsLeft: 3,
        plantedAt: 0,
      },
      x: 0,
      y: 9,
    },
    "2": {
      createdAt: 0,
      fruit: {
        amount: 1,
        name: "Apple",
        harvestedAt: 0,
        harvestsLeft: 3,
        plantedAt: 0,
      },
      x: -2,
      y: 9,
    },
  },
  trees: {
    "1": {
      wood: {
        amount: 2,
        choppedAt: 0,
      },
      x: 5,
      y: 9,
      createdAt: Date.now(),
    },
    "2": {
      wood: {
        amount: 1,
        choppedAt: 0,
      },
      x: 3,
      y: 9,
      createdAt: Date.now(),
    },
    "3": {
      wood: {
        amount: 2,
        choppedAt: 0,
      },
      x: 7,
      y: 9,
      createdAt: Date.now(),
    },
  },
  gold: {
    1: {
      x: 2,
      y: 9,
      stone: {
        amount: 2,
        minedAt: 0,
      },
      createdAt: Date.now(),
    },
  },
  iron: {
    "1": {
      x: 5,
      y: 7,
      stone: {
        amount: 1,
        minedAt: 0,
      },
      createdAt: Date.now(),
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
      createdAt: Date.now(),
    },
    "2": {
      stone: {
        amount: 1,
        minedAt: 0,
      },
      x: -2,
      y: 3,
      createdAt: Date.now(),
    },
  },
};

const SUNSTONE_RELOCATION: Coordinates[] = [
  { x: -5, y: 5 },
  { x: -5, y: 9 },
  { x: -5, y: 7 },
  { x: -3, y: 7 },
  { x: -1, y: 7 },
  { x: 1, y: 7 },
  { x: 3, y: 7 },
];

export const ISLAND_UPGRADE: Record<
  IslandType,
  { items: Inventory; expansions: number; upgrade: IslandType | null }
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
      Crimstone: new Decimal(20),
    },
    upgrade: "desert",
  },
  // TODO
  desert: {
    expansions: 25,
    items: {
      Oil: new Decimal(200),
    },
    upgrade: "volcano",
  },
  volcano: {
    expansions: 99,
    items: {
      Gold: new Decimal(9999999999),
    },
    upgrade: null,
  },
};

function springUpgrade(state: GameState) {
  const game = cloneDeep(state) as GameState;
  // Clear the house
  delete game.inventory["Town Center"];

  // Add new resources
  game.inventory.House = new Decimal(1);

  // Ensure they have the minimum resources to start the island with
  // Do not give bonus sunstones
  const minimum = { ...TOTAL_EXPANSION_NODES.spring[4], "Sunstone Rock": 0 };

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

export function expireItems({ game }: { game: GameState }) {
  const temporaryCollectibles = getKeys(EXPIRY_COOLDOWNS).reduce(
    (acc, name) => {
      const items = game.collectibles[name as CollectibleName] ?? [];
      const homeItems = game.home.collectibles[name as CollectibleName] ?? [];

      const count = [...items, ...homeItems].length;

      if (count > 0) {
        return {
          ...acc,
          [name]: count,
        };
      }

      return acc;
    },
    {} as Record<string, number>,
  );

  if (getKeys(temporaryCollectibles).length > 0) {
    getKeys(temporaryCollectibles).forEach((name) => {
      const previous =
        game.inventory[name as InventoryItemName] ?? new Decimal(0);
      game.inventory[name as InventoryItemName] = previous.sub(
        temporaryCollectibles[name],
      );
    });
  }

  return game;
}

function desertUpgrade(state: GameState) {
  const game = cloneDeep(state) as GameState;
  // Clear the house
  delete game.inventory["Town Center"];
  delete game.inventory["House"];

  // Add new resources
  game.inventory.Manor = new Decimal(1);

  // Ensure they have the minimum resources to start the island with
  // Do not give bonus sunstones
  const minimum = { ...TOTAL_EXPANSION_NODES.desert[4], "Sunstone Rock": 0 };

  Object.entries(minimum).forEach(([name, amount]) => {
    const item = game.inventory[name as InventoryItemName] ?? new Decimal(0);
    if (item.lt(amount)) {
      game.inventory[name as InventoryItemName] = new Decimal(amount);
    }
  });

  game.airdrops = [
    ...(game.airdrops ?? []),
    {
      id: "desert-island-upgrade-reward",
      coordinates: {
        x: -1,
        y: 7,
      },
      createdAt: 0,
      items: {
        "Desert Gnome": 1,
      },
      sfl: 0,
      coins: 0,
      wearables: {},
      message: translate("islandupgrade.welcomeDesertIsland"),
    },
  ];

  return game;
}

function volcanoUpgrade(state: GameState) {
  const game = cloneDeep(state) as GameState;
  // Clear the manor
  delete game.inventory["Manor"];

  // Add new resources
  game.inventory.Mansion = new Decimal(1);

  // Ensure they have the minimum resources to start the island with
  // Do not give bonus sunstones
  const minimum = { ...TOTAL_EXPANSION_NODES.volcano[4], "Sunstone Rock": 0 };

  Object.entries(minimum).forEach(([name, amount]) => {
    const item = game.inventory[name as InventoryItemName] ?? new Decimal(0);
    if (item.lt(amount)) {
      game.inventory[name as InventoryItemName] = new Decimal(amount);
    }
  });

  game.airdrops = [
    ...(game.airdrops ?? []),
    {
      id: "volcano-island-upgrade-reward",
      coordinates: {
        x: -6,
        y: 5,
      },
      createdAt: 0,
      items: {
        "Volcano Gnome": 1,
      },
      sfl: 0,
      coins: 0,
      wearables: {},
      message: "Welcome to Volcano Island.",
    },
  ];

  return game;
}

export const SEASON_ROTATION: TemperateSeasonName[] = [
  "spring",
  "summer",
  "autumn",
  "winter",
];

const FIRST_WEEK_START_AT = new Date("2024-12-16T00:00:00Z").getTime();
export const populateSeason = (createdAt: number): Season => {
  // Get days since first week start
  const daysSinceStart = Math.floor(
    (createdAt - FIRST_WEEK_START_AT) / (24 * 60 * 60 * 1000),
  );

  // Round down to nearest week by getting number of complete weeks
  const weeksSinceStart = Math.max(Math.floor(daysSinceStart / 7), 0);

  // Calculate start timestamp of current week by adding complete weeks to first week
  const startAt =
    FIRST_WEEK_START_AT + weeksSinceStart * 7 * 24 * 60 * 60 * 1000;

  // Get season index (0-3) by taking modulo 4 of weeks passed
  const seasonIndex = weeksSinceStart % 4;

  const season = SEASON_ROTATION[seasonIndex];

  return { startedAt: startAt, season };
};

export function upgrade({ state, createdAt = Date.now() }: Options) {
  let game = cloneDeep(state) as GameState;

  const upcoming = ISLAND_UPGRADE[game.island.type];

  if (upcoming.upgrade === null) {
    throw new Error("Not implemented");
  }

  if (game.inventory["Basic Land"]?.lt(upcoming.expansions)) {
    throw new Error("Player has not met the expansion requirements");
  }

  // Check & burn the requirements
  Object.entries(upcoming.items).forEach(([name, required]) => {
    const amount = game.inventory[name as InventoryItemName] ?? new Decimal(0);
    if (amount.lt(required)) {
      throw new Error(`Insufficient ${name}`);
    }

    // Burn the ingredients
    game.inventory[name as InventoryItemName] = amount.minus(required);
  });

  // Remove any time sensitive items that have expired
  game = expireItems({ game });

  // Clear all in progress items
  game.collectibles = {};
  game.buildings = {};
  game.chickens = {};
  game.fishing.wharf = {};
  game.mushrooms = {
    mushrooms: {},
    spawnedAt: game.mushrooms?.spawnedAt ?? 0,
  };
  game.buds = Object.fromEntries(
    Object.entries(game.buds ?? {}).map(([budId, bud]) => [
      budId,
      {
        ...bud,
        location: bud.location === "home" ? "home" : undefined,
        coordinates: bud.location === "home" ? bud.coordinates : undefined,
      },
    ]),
  );
  game.crimstones = {};
  game.beehives = {};
  game.flowers.flowerBeds = {};
  game.oilReserves = {};

  Object.keys(game.sunstones).forEach((key, i) => {
    game.sunstones[key].x = SUNSTONE_RELOCATION[i].x;
    game.sunstones[key].y = SUNSTONE_RELOCATION[i].y;
  });

  const previousExpansions = game.inventory["Basic Land"]?.toNumber() ?? 0;
  const sunstonesForExpansion =
    TOTAL_EXPANSION_NODES[game.island.type][previousExpansions][
      "Sunstone Rock"
    ] ?? 0;

  const maxSunstones = Math.max(
    sunstonesForExpansion,
    game.island.sunstones ?? 0,
  );

  // Set the island
  game.island = {
    type: upcoming.upgrade,
    upgradedAt: createdAt,
    previousExpansions,
    sunstones: maxSunstones,
  };
  game.season = populateSeason(createdAt);

  if (upcoming.upgrade === "spring") {
    game = springUpgrade(game);
  }

  if (upcoming.upgrade === "desert") {
    game = desertUpgrade(game);
  }

  if (upcoming.upgrade === "volcano") {
    game = volcanoUpgrade(game);
  }

  // Reset expansions
  if (upcoming.upgrade === "spring") {
    game.inventory["Basic Land"] = new Decimal(4);
    game = {
      ...game,
      ...INITIAL_SPRING_LAND,
    };
  }

  if (upcoming.upgrade === "desert") {
    game.inventory["Basic Land"] = new Decimal(4);
    game = {
      ...game,
      ...INITIAL_DESERT_LAND,
    };
  }

  if (upcoming.upgrade === "volcano") {
    game.inventory["Basic Land"] = new Decimal(5);
    game = {
      ...game,
      ...INITIAL_VOLCANO_LAND,
    };
  }

  return {
    ...game,
  };
}
