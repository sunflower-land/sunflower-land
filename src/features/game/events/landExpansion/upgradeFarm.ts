import Decimal from "decimal.js-light";
import type { Coordinates } from "features/game/expansion/components/MapPlacement";
import { getObjectEntries } from "lib/object";
import type { BuildingName } from "features/game/types/buildings";
import type {
  BasicIslandType,
  GameState,
  IslandType,
  Inventory,
  InventoryItemName,
  Season,
  TemperateSeasonName,
} from "features/game/types/game";
import {
  getTotalBaseResourceEquivalents,
  topUpResourceToMinimum,
} from "features/game/types/resources";
import cloneDeep from "lodash.clonedeep";
import { placeBuilding } from "./placeBuilding";
import { placeFruitPatch } from "./placeFruitPatch";
import { placeGold } from "./placeGold";
import { placeIron } from "./placeIron";
import { placeOilReserve } from "./placeOilReserve";
import { placePlot } from "./placePlot";
import { placeStone } from "./placeStone";
import { placeTree } from "./placeTree";
import { removeAll } from "./removeAll";
import { TOTAL_EXPANSION_NODES } from "features/game/types/expansions";
import { ISLAND_MAX_EXPANSION } from "features/game/expansion/lib/expansionRequirements";

export type UpgradeFarmAction = {
  type: "farm.upgraded";
};

type Options = {
  state: Readonly<GameState>;
  action: UpgradeFarmAction;
  createdAt?: number;
  farmId: number;
};

interface InitialLandCoordinates {
  buildings: Partial<Record<BuildingName, Coordinates>>;
  crops: Record<string, Coordinates>;
  fruitPatches: Record<string, Coordinates>;
  trees: Record<string, Coordinates>;
  gold: Record<string, Coordinates>;
  iron: Record<string, Coordinates>;
  stones: Record<string, Coordinates>;
  oilReserves?: Record<string, Coordinates>;
  trapSpots?: Record<string, Coordinates>;
}

const INITIAL_SPRING_LAND_COORDINATES: InitialLandCoordinates = {
  buildings: {
    House: { x: -1, y: 5 },
    Workbench: { x: 6, y: 6 },
    Market: { x: 6, y: 3 },
    "Fire Pit": { x: 6, y: 0 },
  },
  crops: {
    "1": { x: -2, y: 0 },
    "2": { x: -1, y: 0 },
    "3": { x: 0, y: 0 },
    "4": { x: -2, y: -1 },
    "5": { x: -1, y: -1 },
    "6": { x: 0, y: -1 },
    "7": { x: -2, y: 1 },
    "8": { x: -1, y: 1 },
    "9": { x: 0, y: 1 },
    "10": { x: 1, y: 1 },
    "11": { x: 1, y: 0 },
    "12": { x: 1, y: -1 },
    "13": { x: 2, y: 1 },
    "14": { x: 2, y: 0 },
    "15": { x: 2, y: -1 },
    "16": { x: 3, y: 1 },
    "17": { x: 3, y: 0 },
    "18": { x: 3, y: -1 },
  },
  fruitPatches: {
    "1": { x: 0, y: 9 },
    "2": { x: -2, y: 9 },
  },
  trees: {
    "1": { x: 3, y: 6 },
    "2": { x: 3, y: 4 },
    "3": { x: 6, y: 9 },
  },
  gold: {
    "1": { x: 3, y: 9 },
  },
  iron: {
    "1": { x: 5, y: 8 },
  },
  stones: {
    "1": { x: -3, y: 5 },
    "2": { x: -2, y: 3 },
  },
  trapSpots: {
    "1": { x: -3, y: -4 },
    "2": { x: -2, y: -6 },
  },
};

const INITIAL_DESERT_LAND_COORDINATES: InitialLandCoordinates = {
  buildings: {
    Manor: { x: -1, y: 5 },
    Workbench: { x: 6, y: 6 },
    Market: { x: 6, y: 3 },
    "Fire Pit": { x: 6, y: 0 },
  },
  crops: {
    "1": { x: -2, y: 0 },
    "2": { x: -1, y: 0 },
    "3": { x: 0, y: 0 },
    "4": { x: -2, y: -1 },
    "5": { x: -1, y: -1 },
    "6": { x: 0, y: -1 },
    "7": { x: -2, y: 1 },
    "8": { x: -1, y: 1 },
    "9": { x: 0, y: 1 },
    "10": { x: 1, y: 1 },
    "11": { x: 1, y: 0 },
    "12": { x: 1, y: -1 },
    "13": { x: 2, y: 1 },
    "14": { x: 2, y: 0 },
    "15": { x: 2, y: -1 },
    "16": { x: 3, y: 1 },
    "17": { x: 3, y: 0 },
    "18": { x: 3, y: -1 },
  },
  fruitPatches: {
    "1": { x: 0, y: 9 },
    "2": { x: -2, y: 9 },
  },
  trees: {
    "1": { x: 4, y: 6 },
    "2": { x: 4, y: 4 },
    "3": { x: 6, y: 9 },
  },
  gold: {
    "1": { x: 3, y: 9 },
  },
  iron: {
    "1": { x: 5, y: 8 },
  },
  stones: {
    "1": { x: -3, y: 5 },
    "2": { x: -2, y: 3 },
  },
  trapSpots: {
    "1": { x: -3, y: -4 },
    "2": { x: -2, y: -6 },
    "3": { x: -0.5, y: -6 },
  },
};

const INITIAL_VOLCANO_LAND_COORDINATES: InitialLandCoordinates = {
  buildings: {
    Mansion: { x: -1, y: 5 },
    Workbench: { x: 6, y: 6 },
    Market: { x: 6, y: 3 },
    "Fire Pit": { x: 6, y: 0 },
  },
  crops: {
    "1": { x: -1, y: -1 },
    "2": { x: 0, y: -1 },
    "3": { x: 1, y: -1 },
    "4": { x: -1, y: -2 },
    "5": { x: 0, y: -2 },
    "6": { x: 1, y: -2 },
    "7": { x: -1, y: 0 },
    "8": { x: 0, y: 0 },
    "9": { x: 1, y: 0 },
    "10": { x: 2, y: 0 },
    "11": { x: 2, y: -1 },
    "12": { x: 2, y: -2 },
    "13": { x: 3, y: 0 },
    "14": { x: 3, y: -1 },
    "15": { x: 3, y: -2 },
    "16": { x: 4, y: 0 },
    "17": { x: 4, y: -1 },
    "18": { x: 4, y: -2 },
  },
  fruitPatches: {
    "1": { x: 0, y: 9 },
    "2": { x: -2, y: 9 },
  },
  trees: {
    "1": { x: 5, y: 9 },
    "2": { x: 3, y: 9 },
    "3": { x: 3, y: 7 },
  },
  gold: {
    "1": { x: 2, y: 9 },
  },
  iron: {
    "1": { x: 5, y: 7 },
  },
  stones: {
    "1": { x: -3, y: 5 },
    "2": { x: -2, y: 3 },
  },
  oilReserves: {
    "1": { x: -8, y: 8 },
  },
  trapSpots: {
    "1": { x: -3, y: -4 },
    "2": { x: -2, y: -6 },
    "3": { x: -0.5, y: -6 },
    "4": { x: 1, y: -6 },
  },
};

/**
 * Places the initial land on the farm.
 * All functions will place the elements on the farm.
 * If there's existing data it will update coordinates on the existing data, otherwise it will create new ones
 */
function placeInitialLand({
  state,
  createdAt = Date.now(),
  initialLandCoordinates,
  farmId,
}: {
  state: GameState;
  createdAt?: number;
  initialLandCoordinates: InitialLandCoordinates;
  farmId: number;
}) {
  let stateCopy = cloneDeep(state);

  const {
    buildings,
    crops,
    fruitPatches,
    trees,
    gold,
    iron,
    stones,
    oilReserves,
    trapSpots,
  } = initialLandCoordinates;

  getObjectEntries(buildings).forEach(([building, coordinates]) => {
    if (coordinates) {
      try {
        stateCopy = placeBuilding({
          farmId,
          state: stateCopy,
          action: {
            type: "building.placed",
            name: building,
            id: "1",
            coordinates,
          },
          createdAt,
        });
      } catch (error) {
        // Ignore errors
      }
    }
  });

  getObjectEntries(crops).forEach(([id, coordinates]) => {
    try {
      stateCopy = placePlot({
        state: stateCopy,
        action: {
          type: "plot.placed",
          id,
          coordinates,
          name: "Crop Plot",
        },
        createdAt,
      });
    } catch (error) {
      // Ignore errors
    }
  });

  getObjectEntries(fruitPatches).forEach(([id, coordinates]) => {
    try {
      stateCopy = placeFruitPatch({
        state: stateCopy,
        action: {
          type: "fruitPatch.placed",
          id,
          coordinates,
          name: "Fruit Patch",
        },
        createdAt,
      });
    } catch (error) {
      // Ignore errors
    }
  });

  getObjectEntries(trees).forEach(([id, coordinates]) => {
    try {
      stateCopy = placeTree({
        state: stateCopy,
        action: {
          type: "tree.placed",
          id,
          coordinates,
          name: "Tree",
        },
        createdAt,
      });
    } catch (error) {
      // Ignore errors
    }
  });

  getObjectEntries(gold).forEach(([id, coordinates]) => {
    try {
      stateCopy = placeGold({
        state: stateCopy,
        action: {
          type: "gold.placed",
          id,
          coordinates,
          name: "Gold Rock",
        },
        createdAt,
      });
    } catch (error) {
      // Ignore errors
    }
  });

  getObjectEntries(iron).forEach(([id, coordinates]) => {
    try {
      stateCopy = placeIron({
        state: stateCopy,
        action: {
          type: "iron.placed",
          id,
          coordinates,
          name: "Iron Rock",
        },
        createdAt,
      });
    } catch (error) {
      // Ignore errors
    }
  });

  getObjectEntries(stones).forEach(([id, coordinates]) => {
    try {
      stateCopy = placeStone({
        state: stateCopy,
        action: {
          type: "stone.placed",
          id,
          coordinates,
          name: "Stone Rock",
        },
        createdAt,
      });
    } catch (error) {
      // Ignore errors
    }
  });

  if (oilReserves) {
    getObjectEntries(oilReserves).forEach(([id, coordinates]) => {
      try {
        stateCopy = placeOilReserve({
          state: stateCopy,
          action: {
            type: "oilReserve.placed",
            id,
            coordinates,
          },
          createdAt,
        });
      } catch (error) {
        // Ignore errors
      }
    });
  }

  stateCopy = {
    ...stateCopy,
    crabTraps: { trapSpots },
  };

  stateCopy = cloneDeep(stateCopy);

  return stateCopy;
}

/** Islands a player can linearly prestige *into* via `farm.upgraded`. */
type UpgradeTarget = "spring" | "desert" | "volcano";

export const ISLAND_UPGRADE: Record<
  Exclude<BasicIslandType, "volcano">,
  { items: Inventory; expansions: number; upgrade: UpgradeTarget }
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
  desert: {
    expansions: 25,
    items: {
      Oil: new Decimal(200),
    },
    upgrade: "volcano",
  },
};

export const isLandUpgradable = (
  islandType: IslandType,
): islandType is Exclude<BasicIslandType, "volcano"> => {
  return islandType in ISLAND_UPGRADE;
};

function springUpgrade(state: GameState) {
  const game = cloneDeep(state) as GameState;
  // Clear the house
  delete game.inventory["Town Center"];
  delete game.buildings["Town Center"];

  // Add new resources
  game.inventory.House = new Decimal(1);

  // If they do not already have fruit patches
  if (!game.inventory["Fruit Patch"]?.gt(2)) {
    game.inventory["Fruit Patch"] = new Decimal(2);
  }

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
      message: "Welcome to Petal Paradise!",
    },
  ];

  return game;
}

function desertUpgrade(state: GameState) {
  const game = cloneDeep(state) as GameState;
  // Clear the house
  delete game.inventory["Town Center"];
  delete game.inventory["House"];
  delete game.buildings["Town Center"];
  delete game.buildings["House"];

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
      message: "Welcome to the Desert.",
    },
  ];

  return game;
}

function volcanoUpgrade(state: GameState) {
  const game = cloneDeep(state) as GameState;
  // Clear the manor
  delete game.inventory["Town Center"];
  delete game.inventory["House"];
  delete game.buildings["Town Center"];
  delete game.buildings["House"];
  delete game.inventory["Manor"];
  delete game.buildings["Manor"];

  // Add new resources
  game.inventory.Mansion = new Decimal(1);

  // Ensure they have the minimum resources to start the island with
  // Do not give bonus sunstones
  // Account for upgraded resources when checking minimums
  const minimum = { ...TOTAL_EXPANSION_NODES.volcano[5], "Sunstone Rock": 0 };

  getObjectEntries(minimum).forEach(([resource, amount]) => {
    const totalEquivalents = getTotalBaseResourceEquivalents(game, resource);

    // Only set minimum if total equivalents are less than required
    if (totalEquivalents < amount) {
      topUpResourceToMinimum({
        game,
        name: resource,
        amount,
        totalEquivalents,
      });
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

type IslandSetup = {
  /** Expansions (Basic Land) the player starts the new island with. */
  startingExpansions: number;
  /** Buildings, resources & trap spots laid out when the player arrives. */
  initialCoordinates: InitialLandCoordinates;
  /** Island-specific changes: home building swap, resource floor, airdrop. */
  applySetup: (state: GameState) => GameState;
};

const ISLAND_SETUP: Record<UpgradeTarget, IslandSetup> = {
  spring: {
    startingExpansions: 4,
    initialCoordinates: INITIAL_SPRING_LAND_COORDINATES,
    applySetup: springUpgrade,
  },
  desert: {
    startingExpansions: 4,
    initialCoordinates: INITIAL_DESERT_LAND_COORDINATES,
    applySetup: desertUpgrade,
  },
  volcano: {
    startingExpansions: 5,
    initialCoordinates: INITIAL_VOLCANO_LAND_COORDINATES,
    applySetup: volcanoUpgrade,
  },
};

/**
 * The island-agnostic part of moving a farm to a new island: wipe the old
 * farm, carry island history (incl. sunstones) forward, and lay out the fresh
 * starting island. The per-island bits are driven by `ISLAND_SETUP[target]`.
 */
function transitionToIsland({
  state,
  target,
  farmId,
  createdAt,
}: {
  state: GameState;
  target: UpgradeTarget;
  farmId: number;
  createdAt: number;
}): GameState {
  let game = cloneDeep(state);

  // Return every placed item to the inventory
  try {
    game = removeAll({
      state: game,
      action: {
        type: "items.removed",
        location: "farm",
      },
      createdAt,
    });
  } catch (error) {
    // Ignore errors
  }
  game = cloneDeep(game);

  delete game.socialFarming.clutter;

  // Reset transient systems that do not carry across islands
  game.fishing.wharf = {};
  game.mushrooms = {
    mushrooms: {},
    spawnedAt: game.mushrooms?.spawnedAt ?? 0,
  };

  // Carry expansion history forward (read from the *source* island below)
  let previousExpansions = game.inventory["Basic Land"]?.toNumber() ?? 0;

  if (game.expansionConstruction) {
    previousExpansions += 1;
  }

  // Legacy farms may sit above the island cap, and the node rows beyond the cap
  // were retired. Clamp the lookup to the cap row so the carry-forward sunstone
  // count is the island's max (e.g. spring 2) rather than silently 0.
  const expansionForNodeLookup = Math.min(
    previousExpansions,
    ISLAND_MAX_EXPANSION[game.island.type],
  );
  const sunstonesForExpansion =
    TOTAL_EXPANSION_NODES[game.island.type][expansionForNodeLookup]?.[
      "Sunstone Rock"
    ] ?? 0;

  const maxSunstones = Math.max(
    sunstonesForExpansion,
    game.island.sunstones ?? 0,
  );

  // Set the new island
  game.island = {
    type: target,
    upgradedAt: createdAt,
    previousExpansions,
    sunstones: maxSunstones,
  };

  // In basic land the season is always spring. Apply the real season rotation.
  game.season = populateSeason(createdAt);

  // Remove any previous in progress expansions (LEGACY)
  delete game.expansionConstruction;

  // Island-specific setup, then lay out the starting island
  const setup = ISLAND_SETUP[target];
  game = setup.applySetup(game);
  game.inventory["Basic Land"] = new Decimal(setup.startingExpansions);
  game = placeInitialLand({
    state: game,
    farmId,
    createdAt,
    initialLandCoordinates: setup.initialCoordinates,
  });
  game = cloneDeep(game);

  // Reset the biome upon transition
  delete game.island.biome;

  return game;
}

export function upgrade({ state, createdAt = Date.now(), farmId }: Options) {
  const game = cloneDeep(state) as GameState;

  if (!isLandUpgradable(game.island.type)) {
    throw new Error(
      "Island is already at max level, ascend to upgrade further",
    );
  }

  const upcoming = ISLAND_UPGRADE[game.island.type];

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

  return transitionToIsland({
    state: game,
    target: upcoming.upgrade,
    farmId,
    createdAt,
  });
}
