import Decimal from "decimal.js-light";
import type { Coordinates } from "features/game/expansion/components/MapPlacement";
import { getObjectEntries } from "lib/object";
import type { BuildingName } from "features/game/types/buildings";
import type {
  AscensionIslandType,
  BasicIslandType,
  GameState,
  IslandType,
  Inventory,
  InventoryItemName,
  Season,
  TemperateSeasonName,
} from "features/game/types/game";
import { ASCENSION_ISLANDS } from "features/game/types/game";
import { hasFeatureAccess } from "lib/flags";
import { getAscensionLevel } from "features/game/lib/level";
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
import { placeCrimstone } from "./placeCrimstone";
import { placeBeehive } from "./placeBeehive";
import { placeFlowerBed } from "./placeFlowerBed";
import { placeLavaPit } from "./placeLavaPit";
import { removeAll } from "./removeAll";
import {
  TOTAL_EXPANSION_NODES,
  getExpansionNodes,
} from "features/game/types/expansions";
import { SWAMP_BASE_EXPANSION } from "features/game/expansion/lib/ascension";
import { ISLAND_MAX_EXPANSION } from "features/game/expansion/lib/expansionRequirements";
import { reAnchorToIsland } from "features/game/expansion/lib/island";

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
  crimstones?: Record<string, Coordinates>;
  beehives?: Record<string, Coordinates>;
  flowerBeds?: Record<string, Coordinates>;
  lavaPits?: Record<string, Coordinates>;
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

const INITIAL_SWAMP_LAND_COORDINATES: InitialLandCoordinates = {
  buildings: {
    Workbench: { x: 17, y: -10 },
    Market: { x: -4, y: 13 },
    "Fire Pit": { x: -14, y: -9 },
    Mansion: { x: 0, y: 15 },
    Barn: { x: -9, y: 13 },
    "Hen House": { x: 11, y: 13 },
    Warehouse: { x: 7, y: 13 },
    Bakery: { x: -9, y: -6 },
    Toolshed: { x: 17, y: 5 },
    Deli: { x: -9, y: -2 },
    Greenhouse: { x: -9, y: 8 },
    "Crafting Box": { x: 17, y: -12 },
    "Water Well": { x: 2, y: -8 },
    Kitchen: { x: -14, y: -2 },
    "Premium Composter": { x: -6, y: -10 },
    "Crop Machine": { x: 10, y: 8 },
    "Compost Bin": { x: -10, y: -10 },
    "Smoothie Shack": { x: -13, y: -6 },
    "Turbo Composter": { x: -8, y: -10 },
    "Fish Market": { x: -14, y: -12 },
    "Pet House": { x: -12, y: 2 },
    "Aging Shed": { x: -10, y: -13 },
  },
  crops: {
    "1": { x: 0, y: 9 },
    "2": { x: 1, y: 9 },
    "3": { x: 2, y: 9 },
    "4": { x: 3, y: 9 },
    "5": { x: 4, y: 9 },
    "6": { x: 5, y: 9 },
    "7": { x: 6, y: 9 },
    "8": { x: -1, y: 9 },
    "9": { x: 6, y: 8 },
    "10": { x: 5, y: 8 },
    "11": { x: 4, y: 8 },
    "12": { x: 3, y: 8 },
    "13": { x: 2, y: 8 },
    "14": { x: 1, y: 8 },
    "15": { x: 2, y: 3 },
    "16": { x: 1, y: 3 },
    "17": { x: 0, y: 3 },
    "18": { x: 3, y: 3 },
    "19": { x: 1, y: 7 },
    "20": { x: 2, y: 7 },
    "21": { x: 3, y: 7 },
    "22": { x: 4, y: 7 },
    "23": { x: 5, y: 7 },
    "24": { x: 6, y: 7 },
    "25": { x: 6, y: 6 },
    "26": { x: 5, y: 6 },
    "27": { x: 4, y: 6 },
    "28": { x: 3, y: 6 },
    "29": { x: 2, y: 6 },
    "30": { x: 1, y: 6 },
    "31": { x: 0, y: 6 },
    "32": { x: -1, y: 6 },
    "33": { x: -2, y: 3 },
    "34": { x: 0, y: 5 },
    "35": { x: 1, y: 5 },
    "36": { x: 2, y: 5 },
    "37": { x: 3, y: 5 },
    "38": { x: 4, y: 5 },
    "39": { x: 5, y: 5 },
    "40": { x: 6, y: 5 },
    "41": { x: 7, y: 9 },
    "42": { x: 7, y: 8 },
    "43": { x: 7, y: 7 },
    "44": { x: 7, y: 6 },
    "45": { x: 7, y: 5 },
    "46": { x: -2, y: 10 },
    "47": { x: -2, y: 9 },
    "48": { x: -2, y: 8 },
    "49": { x: -2, y: 7 },
    "50": { x: -2, y: 6 },
    "51": { x: -2, y: 5 },
    "52": { x: -2, y: 4 },
    "53": { x: -1, y: 3 },
    "54": { x: 0, y: 4 },
    "55": { x: 1, y: 4 },
    "56": { x: 2, y: 4 },
    "57": { x: 3, y: 4 },
    "58": { x: 4, y: 4 },
    "59": { x: 5, y: 4 },
    "60": { x: 6, y: 4 },
    "61": { x: 7, y: 4 },
    "62": { x: 7, y: 3 },
    "63": { x: 6, y: 3 },
    "64": { x: 5, y: 3 },
    "65": { x: 4, y: 3 },
  },
  fruitPatches: {
    "1": { x: 0, y: -6 },
    "2": { x: 0, y: -2 },
    "3": { x: 2, y: -6 },
    "4": { x: 2, y: -4 },
    "5": { x: -2, y: -4 },
    "6": { x: 4, y: -2 },
    "7": { x: 4, y: -6 },
    "8": { x: -2, y: -6 },
    "9": { x: 6, y: -6 },
    "10": { x: 6, y: -4 },
    "11": { x: 6, y: -2 },
    "12": { x: 2, y: -2 },
    "13": { x: -2, y: -2 },
    "14": { x: 0, y: -4 },
    "15": { x: 4, y: -4 },
  },
  trees: {
    "1": { x: 10, y: 2 },
    "2": { x: 12, y: 2 },
    "3": { x: 12, y: 0 },
    "4": { x: 10, y: 0 },
  },
  gold: {
    "1": { x: 17, y: -3 },
    "2": { x: 18, y: -3 },
    "3": { x: 19, y: -3 },
    "4": { x: 19, y: -5 },
    "5": { x: 19, y: -6 },
    "6": { x: 17, y: -4 },
    "7": { x: 17, y: -6 },
    "8": { x: 19, y: -4 },
  },
  iron: {
    "4d8d840d": { x: 18, y: -6 },
    "5cb431c4": { x: 17, y: -7 },
    "6c5e7d40": { x: 18, y: -7 },
    "815c6bb5": { x: 19, y: -7 },
    "9954c056": { x: 19, y: -8 },
    b378d8d3: { x: 18, y: -8 },
    b60c7935: { x: 17, y: -8 },
    f8c09a39: { x: 19, y: -9 },
    a280fb4c: { x: 17, y: -9 },
    e6f8d990: { x: 18, y: -9 },
    e79b3e44: { x: 18, y: -5 },
  },
  stones: {
    c1b64ee3: { x: 17, y: 0 },
    d56eda85: { x: 17, y: -1 },
    d92d4d04: { x: 18, y: -2 },
    e11b578f: { x: 17, y: -2 },
    ffbc02d4: { x: 19, y: -2 },
    ecc257f7: { x: 19, y: -1 },
    "987beac6": { x: 18, y: 0 },
    "9e17f622": { x: 19, y: 0 },
  },
  oilReserves: {
    "1": { x: 10, y: -6 },
    "4a19070c": { x: 10, y: -8 },
    e38b77e6: { x: 12, y: -6 },
    "6308b565": { x: 12, y: -8 },
  },
  crimstones: {
    "4eeefbf2": { x: 14, y: -4 },
    "592f837f": { x: 14, y: 0 },
    "608f3f7b": { x: 14, y: -6 },
    "69a1b94d": { x: 14, y: 2 },
    "44bc0169": { x: 14, y: -2 },
  },
  beehives: {
    "36088790": { x: -15, y: 14 },
    "7f87f68b": { x: -15, y: 13 },
    "8724fce7": { x: -15, y: 15 },
  },
  flowerBeds: {
    "97a62df9": { x: -14, y: 14 },
    a3cb4712: { x: -14, y: 13 },
    be869296: { x: -14, y: 15 },
  },
  lavaPits: {
    "1571085d": { x: 10, y: -2 },
    "06fcbfea": { x: 12, y: -2 },
    f569e8ea: { x: 12, y: -4 },
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
    crimstones,
    beehives,
    flowerBeds,
    lavaPits,
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

  if (crimstones) {
    getObjectEntries(crimstones).forEach(([id, coordinates]) => {
      try {
        stateCopy = placeCrimstone({
          state: stateCopy,
          action: {
            type: "crimstone.placed",
            id,
            coordinates,
            name: "Crimstone Rock",
          },
          createdAt,
        });
      } catch (error) {
        // Ignore errors
      }
    });
  }

  if (beehives) {
    getObjectEntries(beehives).forEach(([id, coordinates]) => {
      try {
        stateCopy = placeBeehive({
          state: stateCopy,
          action: {
            type: "beehive.placed",
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

  if (flowerBeds) {
    getObjectEntries(flowerBeds).forEach(([id, coordinates]) => {
      try {
        stateCopy = placeFlowerBed({
          state: stateCopy,
          action: {
            type: "flowerBed.placed",
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

  if (lavaPits) {
    getObjectEntries(lavaPits).forEach(([id, coordinates]) => {
      try {
        stateCopy = placeLavaPit({
          state: stateCopy,
          action: {
            type: "lavaPit.placed",
            id,
            coordinates,
            name: "Lava Pit",
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
type UpgradeTarget = Exclude<IslandType, "basic">;

export const ISLAND_UPGRADE: Record<
  IslandType,
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
  volcano: {
    expansions: 30,
    // Cost scales with ascension level — see getAscensionUpgradeCost
    items: {},
    upgrade: "swamp",
  },
  swamp: {
    items: {},
    expansions: 42,
    upgrade: "spooky",
  },
  spooky: {
    items: {},
    expansions: 42,
    upgrade: "crystal",
  },
  crystal: {
    items: {},
    expansions: 42,
    upgrade: "moon",
  },
  moon: {
    items: {},
    expansions: 42,
    upgrade: "marble",
  },
  marble: {
    items: {},
    expansions: 42,
    upgrade: "marble",
  },
};

/**
 * Row 0 ascension upgrade cost. Every upgrade into (and, later, within) an
 * ascension island scales with the level being reached:
 *   cost(r, a) = floor(base_r × 1.4^(a - 1))
 * So the first ascension (a = 1) costs the base, and each repeat costs 1.4×
 * more. Coins are charged separately from the inventory items.
 */
const ASCENSION_UPGRADE_BASE_ITEMS: Partial<Record<InventoryItemName, number>> =
  {
    Crimstone: 30,
    Oil: 50,
    Obsidian: 3,
  };
const ASCENSION_UPGRADE_BASE_COINS = 5000;

/** Minimum Bumpkin level required to ascend into an ascension island (swamp onward). */
export const ASCENSION_BUMPKIN_LEVEL = 150;

export function getAscensionUpgradeCost(ascensionLevel: number): {
  items: Inventory;
  coins: number;
} {
  // 1.4^(a-1) computed in Decimal — exact, no binary-float error — then floored.
  const multiplier = new Decimal(1.4).pow(ascensionLevel - 1);
  const scaled = (base: number) =>
    new Decimal(base).mul(multiplier).toDecimalPlaces(0, Decimal.ROUND_DOWN);
  const items: Inventory = {};
  getObjectEntries(ASCENSION_UPGRADE_BASE_ITEMS).forEach(([name, base]) => {
    items[name] = scaled(base ?? 0);
  });
  return {
    items,
    coins: scaled(ASCENSION_UPGRADE_BASE_COINS).toNumber(),
  };
}

export const isLandUpgradable = (
  islandType: IslandType,
): islandType is BasicIslandType => {
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

/**
 * Upgrades the game state for the volcano island tier.
 *
 * Establishes the Mansion as the home structure, ensures minimum starting resources (excluding sunstone bonuses),
 * and provides a welcome reward airdrop.
 *
 * @param state - The game state to upgrade
 * @returns The updated game state configured for the volcano island
 */
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

const isTargetAscension = (
  target: UpgradeTarget,
): target is AscensionIslandType =>
  ASCENSION_ISLANDS.includes(target as AscensionIslandType);

/**
 * Prepares the game state for an ascension island (swamp onward) by clearing
 * previous home structures, adding a mansion, and ensuring minimum starting
 * resources.
 *
 * @returns The updated game state for the ascension island.
 */
function ascensionUpgrade(state: GameState, target: UpgradeTarget) {
  if (!isTargetAscension(target)) {
    throw new Error("Target is not Ascension");
  }
  const game = cloneDeep(state) as GameState;
  // Swamp keeps the Mansion from Volcano — clear any older homes defensively
  delete game.inventory["Town Center"];
  delete game.inventory["House"];
  delete game.inventory["Manor"];
  delete game.buildings["Town Center"];
  delete game.buildings["House"];
  delete game.buildings["Manor"];

  // Add new resources
  game.inventory.Mansion = new Decimal(1);

  // Ensure they have the minimum resources to start the island with
  // Do not give bonus sunstones
  // Account for upgraded resources when checking minimums
  // Carry-forward floor: base + every prior ascension's grants (ascensionLevel
  // is already bumped to the level being entered by the time this runs).
  const minimum = {
    ...getExpansionNodes({
      island: target,
      expansion: SWAMP_BASE_EXPANSION,
      ascensionLevel: game.island.ascensionLevel,
    }),
    "Sunstone Rock": 0,
  };

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

  // No welcome airdrop for now

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
  applySetup:
    | ((state: GameState) => GameState)
    | ((state: GameState, target: UpgradeTarget) => GameState);
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
  swamp: {
    startingExpansions: 30,
    initialCoordinates: INITIAL_SWAMP_LAND_COORDINATES,
    applySetup: ascensionUpgrade,
  },
  spooky: {
    startingExpansions: 30,
    initialCoordinates: INITIAL_SWAMP_LAND_COORDINATES,
    applySetup: ascensionUpgrade,
  },
  crystal: {
    startingExpansions: 30,
    initialCoordinates: INITIAL_SWAMP_LAND_COORDINATES,
    applySetup: ascensionUpgrade,
  },
  moon: {
    startingExpansions: 30,
    initialCoordinates: INITIAL_SWAMP_LAND_COORDINATES,
    applySetup: ascensionUpgrade,
  },
  marble: {
    startingExpansions: 30,
    initialCoordinates: INITIAL_SWAMP_LAND_COORDINATES,
    applySetup: ascensionUpgrade,
  },
};

/**
 * Transitions a farm to a new island, establishing a fresh starting configuration.
 *
 * Clears the previous farm state, carries forward expansion history and sunstone counts, relocates mushrooms and social farming clutter to the new island's side island, applies target-island-specific setup (home adjustments, resource flooring, airdrops), and initializes all starting land, buildings, and resources. Per-island configurations are determined by `ISLAND_SETUP[target]`.
 *
 * @returns The transitioned game state with the new island fully initialized
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

  // Reset transient systems that do not carry across islands
  game.fishing.wharf = {};

  // Mushrooms aren't tied to a specific island, so carry them across the
  // upgrade: relocate every existing mushroom onto the new island's small side
  // island (the old land — and the mushroom positions on it — is wiped). With
  // `keepLandItems: false` even mushrooms that spawned on the main land are
  // pulled back onto the island rather than left on the old layout.
  game.mushrooms = {
    spawnedAt: game.mushrooms?.spawnedAt ?? 0,
    mushrooms: game.mushrooms
      ? reAnchorToIsland(
          game.mushrooms.mushrooms,
          ISLAND_SETUP[target].startingExpansions,
          { keepLandItems: false },
        )
      : {},
  };

  // Clutter lives on the small island too, so carry it across the same way as
  // mushrooms: relocate it onto the new island rather than wiping it.
  if (game.socialFarming.clutter) {
    game.socialFarming.clutter = {
      ...game.socialFarming.clutter,
      locations: reAnchorToIsland(
        game.socialFarming.clutter.locations,
        ISLAND_SETUP[target].startingExpansions,
        { keepLandItems: false },
      ),
    };
  }

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
    getExpansionNodes({
      island: game.island.type,
      expansion: expansionForNodeLookup,
      ascensionLevel: game.island.ascensionLevel,
    })["Sunstone Rock"] ?? 0;

  const maxSunstones = Math.max(
    sunstonesForExpansion,
    game.island.sunstones ?? 0,
  );

  // Every upgrade into an ascension island (swamp onward) bumps the ascension
  // counter by one — continuous from swamp. Basic islands leave it unset.
  const isAscensionTarget = (ASCENSION_ISLANDS as readonly string[]).includes(
    target,
  );

  // Set the new island
  game.island = {
    type: target,
    upgradedAt: createdAt,
    previousExpansions,
    sunstones: maxSunstones,
    ...(isAscensionTarget
      ? { ascensionLevel: (game.island.ascensionLevel ?? 0) + 1 }
      : {}),
  };

  // In basic land the season is always spring. Apply the real season rotation.
  game.season = populateSeason(createdAt);

  // Remove any previous in progress expansions (LEGACY)
  delete game.expansionConstruction;

  // Island-specific setup, then lay out the starting island
  const setup = ISLAND_SETUP[target];
  game = setup.applySetup(game, target);
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

  // Ascension-island upgrades (swamp onward) scale their cost with the level
  // being reached; basic-island upgrades use their static `items`.
  const targetIsAscension = (ASCENSION_ISLANDS as readonly string[]).includes(
    upcoming.upgrade,
  );

  if (targetIsAscension && !hasFeatureAccess(game, "SWAMP_ASCENSION")) {
    throw new Error("Swamp ascension is not yet available");
  }

  // Ascension islands require the player to have maxed their current ascension band
  // before ascending again (pre-swamp: Bumpkin level 150; ascension >= 1: level 50 of
  // the current band). `isReadyToAscend` is band-aware, so this single check covers
  // the first ascension (volcano→swamp) and every re-ascension — including marble's
  // infinite marble→marble loop, which keeps gating on the ever-increasing band.
  if (
    targetIsAscension &&
    !getAscensionLevel({
      experience: game.bumpkin.experience ?? 0,
      ascensionLevel: game.island.ascensionLevel ?? 0,
    }).isReadyToAscend
  ) {
    throw new Error("Player has not met the level requirements");
  }

  const { items, coins } = targetIsAscension
    ? getAscensionUpgradeCost((game.island.ascensionLevel ?? 0) + 1)
    : { items: upcoming.items, coins: 0 };

  // Check & burn the item requirements
  Object.entries(items).forEach(([name, required]) => {
    const amount = game.inventory[name as InventoryItemName] ?? new Decimal(0);
    if (amount.lt(required)) {
      throw new Error(`Insufficient ${name}`);
    }

    game.inventory[name as InventoryItemName] = amount.minus(required);
  });

  // Check & burn the coin requirement (coins are not an inventory item)
  if (coins > 0) {
    if (game.coins < coins) {
      throw new Error("Insufficient coins");
    }
    game.coins -= coins;
  }

  return transitionToIsland({
    state: game,
    target: upcoming.upgrade,
    farmId,
    createdAt,
  });
}
