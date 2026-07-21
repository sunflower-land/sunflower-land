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
  SavedLayout,
  Season,
  TemperateSeasonName,
} from "features/game/types/game";
import { ASCENSION_ISLANDS } from "features/game/types/game";
import { hasFeatureAccess, hasTimeBasedFeatureAccess } from "lib/flags";
import { getAscensionLevel, getMaxBumpkinLevel } from "features/game/lib/level";
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
import { applyFarmLayout, snapshotFarm } from "./lib/layouts";
import {
  TOTAL_EXPANSION_NODES,
  getExpansionNodes,
  getMissingResources,
} from "features/game/types/expansions";
import { ISLAND_MAX_EXPANSION } from "features/game/expansion/lib/expansionRequirements";
import {
  getIslandAnchorX,
  reAnchorToIsland,
} from "features/game/expansion/lib/island";

export type UpgradeFarmAction = {
  type: "farm.upgraded";
};

type Options = {
  state: Readonly<GameState>;
  action: UpgradeFarmAction;
  createdAt?: number;
  farmId: number;
};

export interface InitialLandCoordinates {
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

export const INITIAL_SWAMP_LAND_COORDINATES: InitialLandCoordinates = {
  buildings: {
    Mansion: { x: -3, y: 15 },
    Greenhouse: { x: -15, y: 15 },
    "Crop Machine": { x: 3, y: 15 },
    "Water Well": { x: 8, y: 15 },
    Workbench: { x: 11, y: 15 },
    "Crafting Box": { x: 14, y: 15 },
    Toolshed: { x: 17, y: 15 },
    Warehouse: { x: 11, y: 12 },
    Market: { x: 14, y: 12 },
    Kitchen: { x: -9, y: 9 },
    Bakery: { x: -9, y: 6 },
    Deli: { x: -9, y: 3 },
    "Fire Pit": { x: -9, y: 0 },
    "Smoothie Shack": { x: -9, y: -2 },
    Barn: { x: -4, y: 3 },
    "Hen House": { x: 1, y: 3 },
    "Pet House": { x: 6, y: 3 },
    "Aging Shed": { x: -4, y: -2 },
    "Fish Market": { x: 1, y: -2 },
    "Compost Bin": { x: -15, y: 0 },
    "Turbo Composter": { x: -12, y: 0 },
    "Premium Composter": { x: -15, y: -3 },
  },
  crops: {
    "1": { x: -4, y: 9 },
    "2": { x: -3, y: 9 },
    "3": { x: -2, y: 9 },
    "4": { x: -1, y: 9 },
    "5": { x: 0, y: 9 },
    "6": { x: 1, y: 9 },
    "7": { x: 2, y: 9 },
    "8": { x: 3, y: 9 },
    "9": { x: 4, y: 9 },
    "10": { x: 5, y: 9 },
    "11": { x: 6, y: 9 },
    "12": { x: 7, y: 9 },
    "13": { x: 8, y: 9 },
    "14": { x: -4, y: 8 },
    "15": { x: -3, y: 8 },
    "16": { x: -2, y: 8 },
    "17": { x: -1, y: 8 },
    "18": { x: 0, y: 8 },
    "19": { x: 1, y: 8 },
    "20": { x: 2, y: 8 },
    "21": { x: 3, y: 8 },
    "22": { x: 4, y: 8 },
    "23": { x: 5, y: 8 },
    "24": { x: 6, y: 8 },
    "25": { x: 7, y: 8 },
    "26": { x: 8, y: 8 },
    "27": { x: -4, y: 7 },
    "28": { x: -3, y: 7 },
    "29": { x: -2, y: 7 },
    "30": { x: -1, y: 7 },
    "31": { x: 0, y: 7 },
    "32": { x: 1, y: 7 },
    "33": { x: 2, y: 7 },
    "34": { x: 3, y: 7 },
    "35": { x: 4, y: 7 },
    "36": { x: 5, y: 7 },
    "37": { x: 6, y: 7 },
    "38": { x: 7, y: 7 },
    "39": { x: 8, y: 7 },
    "40": { x: -4, y: 6 },
    "41": { x: -3, y: 6 },
    "42": { x: -2, y: 6 },
    "43": { x: -1, y: 6 },
    "44": { x: 0, y: 6 },
    "45": { x: 1, y: 6 },
    "46": { x: 2, y: 6 },
    "47": { x: 3, y: 6 },
    "48": { x: 4, y: 6 },
    "49": { x: 5, y: 6 },
    "50": { x: 6, y: 6 },
    "51": { x: 7, y: 6 },
    "52": { x: 8, y: 6 },
    "53": { x: -4, y: 5 },
    "54": { x: -3, y: 5 },
    "55": { x: -2, y: 5 },
    "56": { x: -1, y: 5 },
    "57": { x: 0, y: 5 },
    "58": { x: 1, y: 5 },
    "59": { x: 2, y: 5 },
    "60": { x: 3, y: 5 },
    "61": { x: 4, y: 5 },
    "62": { x: 5, y: 5 },
    "63": { x: 6, y: 5 },
    "64": { x: 7, y: 5 },
    "65": { x: 8, y: 5 },
  },
  fruitPatches: {
    "1": { x: -15, y: 11 },
    "2": { x: -13, y: 11 },
    "3": { x: -11, y: 11 },
    "4": { x: -15, y: 9 },
    "5": { x: -13, y: 9 },
    "6": { x: -11, y: 9 },
    "7": { x: -15, y: 7 },
    "8": { x: -13, y: 7 },
    "9": { x: -11, y: 7 },
    "10": { x: -15, y: 5 },
    "11": { x: -13, y: 5 },
    "12": { x: -11, y: 5 },
    "13": { x: -15, y: 3 },
    "14": { x: -13, y: 3 },
    "15": { x: -11, y: 3 },
  },
  trees: {
    "1": { x: -9, y: -5 },
    "2": { x: -7, y: -5 },
    "3": { x: -5, y: -5 },
    "4": { x: -3, y: -5 },
    "5": { x: -1, y: -5 },
    "6": { x: 1, y: -5 },
    "7": { x: -9, y: -7 },
    "8": { x: -7, y: -7 },
    "9": { x: -5, y: -7 },
    "10": { x: -3, y: -7 },
    "11": { x: -1, y: -7 },
    "12": { x: 1, y: -7 },
    "13": { x: -9, y: -9 },
    "14": { x: -7, y: -9 },
    "15": { x: -5, y: -9 },
    "16": { x: -3, y: -9 },
    "17": { x: -1, y: -9 },
    "18": { x: 1, y: -9 },
    "19": { x: -9, y: -11 },
    "20": { x: -7, y: -11 },
    "21": { x: -5, y: -11 },
    "22": { x: -3, y: -11 },
    "23": { x: -1, y: -11 },
  },
  gold: {
    "1": { x: 18, y: -8 },
    "2": { x: 19, y: -8 },
    "3": { x: 20, y: -8 },
    "4": { x: 18, y: -9 },
    "5": { x: 19, y: -9 },
    "6": { x: 20, y: -9 },
    "7": { x: 18, y: -10 },
    "8": { x: 19, y: -10 },
  },
  iron: {
    "1": { x: 18, y: -3 },
    "2": { x: 19, y: -3 },
    "3": { x: 20, y: -3 },
    "4": { x: 18, y: -4 },
    "5": { x: 19, y: -4 },
    "6": { x: 20, y: -4 },
    "7": { x: 18, y: -5 },
    "8": { x: 19, y: -5 },
    "9": { x: 20, y: -5 },
    "10": { x: 18, y: -6 },
    "11": { x: 19, y: -6 },
    "12": { x: 20, y: -6 },
    "13": { x: 18, y: -7 },
  },
  stones: {
    "1": { x: 13, y: -3 },
    "2": { x: 14, y: -3 },
    "3": { x: 15, y: -3 },
    "4": { x: 16, y: -3 },
    "5": { x: 17, y: -3 },
    "6": { x: 13, y: -4 },
    "7": { x: 14, y: -4 },
    "8": { x: 15, y: -4 },
    "9": { x: 16, y: -4 },
    "10": { x: 17, y: -4 },
    "11": { x: 13, y: -5 },
    "12": { x: 14, y: -5 },
    "13": { x: 15, y: -5 },
    "14": { x: 16, y: -5 },
    "15": { x: 17, y: -5 },
    "16": { x: 13, y: -6 },
    "17": { x: 14, y: -6 },
    "18": { x: 15, y: -6 },
    "19": { x: 16, y: -6 },
    "20": { x: 17, y: -6 },
  },
  oilReserves: {
    "1": { x: 9, y: 9 },
    "2": { x: 11, y: 9 },
    "3": { x: 9, y: 7 },
    "4": { x: 11, y: 7 },
  },
  crimstones: {
    "1": { x: 13, y: 9 },
    "2": { x: 15, y: 9 },
    "3": { x: 17, y: 9 },
    "4": { x: 19, y: 9 },
    "5": { x: 13, y: 7 },
  },
  beehives: {
    "1": { x: -12, y: -6 },
    "2": { x: -12, y: -7 },
    "3": { x: -12, y: -8 },
  },
  flowerBeds: {
    "1": { x: -15, y: -6 },
    "2": { x: -15, y: -7 },
    "3": { x: -15, y: -8 },
  },
  lavaPits: {
    "1": { x: 9, y: 5 },
    "2": { x: 11, y: 5 },
    "3": { x: 9, y: 3 },
  },
};
/**
 * Places the initial land on the farm.
 * All functions will place the elements on the farm.
 * If there's existing data it will update coordinates on the existing data, otherwise it will create new ones
 */
export function placeInitialLand({
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
    upgrade: "galaxy",
  },
  galaxy: {
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

  // Ensure they have the minimum resources to place the starting island layout
  // (excluding bonus sunstones). Any shortfall beyond this — sunstones, per-tier
  // gaps, and the upgrade's Ascension Crystals — is reconciled after the layout
  // by the shared missing-resources chest in transitionToIsland.
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

  // Ensure they have the minimum resources to place the starting island layout
  // (excluding bonus sunstones, accounting for upgraded resources). Any shortfall
  // beyond this — sunstones, per-tier gaps, and the upgrade's Ascension Crystals —
  // is reconciled after the layout by the shared missing-resources chest in
  // transitionToIsland.
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
 * previous home structures and adding a mansion. Unlike the basic-island
 * upgrades, this does NOT top the starting-node floor up into inventory — see
 * the note in the body.
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

  // The starting-node floor is NOT topped up into inventory here — any shortfall
  // vs the swamp floor is delivered to the player through the ascension reward
  // chest instead (the shared `getMissingResources` back-pay in
  // `transitionToIsland`). A maxed volcano already exceeds the floor, so this
  // only matters for under-provisioned/legacy farms.

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
  applySetup: (state: GameState, target: UpgradeTarget) => GameState;
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
  galaxy: {
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
 * A free side-island tile for the ascension reward chest. The side island sits
 * off the main land, so `pickEmptyPosition`/`detectCollision` (which treats
 * off-land tiles as water) can't be used — instead scan tiles just below the
 * mushroom spawn rows and return the first not already holding an airdrop. The
 * scan walks down unbounded rows so a genuinely free tile is always found, no
 * matter how many un-collected chests have piled up (e.g. marble→marble).
 */
function pickAscensionChestPosition(
  game: GameState,
  setup: IslandSetup,
): Coordinates {
  const anchorX = getIslandAnchorX(setup.startingExpansions);
  const taken = new Set(
    (game.airdrops ?? [])
      .filter((airdrop) => airdrop.coordinates)
      .map((airdrop) => `${airdrop.coordinates!.x},${airdrop.coordinates!.y}`),
  );
  for (let y = 7; ; y++) {
    for (const dx of [1, 0, 2]) {
      const position = { x: anchorX + dx, y };
      if (!taken.has(`${position.x},${position.y}`)) return position;
    }
  }
}

/**
 * Transitions a farm to a new island, establishing a fresh starting configuration.
 *
 * Clears the previous farm state, carries forward expansion history and sunstone counts, relocates mushrooms and social farming clutter to the new island's side island, applies target-island-specific setup (home adjustments, resource flooring, airdrops), and initializes all starting land, buildings, and resources. Per-island configurations are determined by `ISLAND_SETUP[target]`.
 *
 * On ascension (swamp onward) the wipe is skipped: the first ascension
 * (volcano→swamp) keeps the player's arrangement in place and saves it as the
 * protected "Ascension Layout"; later ascensions re-apply that saved layout.
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

  // Ascension (swamp onward) preserves the player's arrangement instead of wiping:
  // - the first ascension (volcano→swamp) keeps every item exactly where it is
  //   (identical 30-expansion land; a maxed volcano already meets the swamp floor);
  // - later ascensions re-apply the layout saved at that first ascension.
  const isAscensionTarget = (ASCENSION_ISLANDS as readonly string[]).includes(
    target,
  );
  const isFirstAscension = isAscensionTarget && game.island.type === "volcano";
  const storedAscensionLayout = game.layouts?.find((layout) => layout.auto);
  const keepArrangement = isFirstAscension;
  const reuseSavedLayout =
    isAscensionTarget && !isFirstAscension && !!storedAscensionLayout;

  // Return every placed item to the inventory (skipped when we preserve the
  // arrangement — `applyFarmLayout` does its own lifting on the reuse path).
  if (!keepArrangement && !reuseSavedLayout) {
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
  }

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
  // (`isAscensionTarget` is computed at the top of the transition.)

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

  // Island-specific setup (home swap + resource floor), then lay out the island.
  const setup = ISLAND_SETUP[target];
  game = setup.applySetup(game, target);
  game.inventory["Basic Land"] = new Decimal(setup.startingExpansions);

  if (keepArrangement) {
    // Volcano→Swamp: leave every placed item exactly where it is (no wipe, no
    // re-place) — the land is identical and the arrangement is already correct.
  } else if (reuseSavedLayout && storedAscensionLayout) {
    // Later ascensions reset the farm to the layout saved at volcano→swamp
    // (best-effort; items that no longer fit the land drop back to the chest).
    applyFarmLayout(game, storedAscensionLayout, createdAt);
  } else {
    game = placeInitialLand({
      state: game,
      farmId,
      createdAt,
      initialLandCoordinates: setup.initialCoordinates,
    });
  }

  // Capture the arrangement as the protected, auto-managed "Ascension Layout" the
  // first time the player ascends (volcano→swamp); it is reused on every later
  // ascension. Appended once (idempotent guard) and exempt from the manual cap.
  if (isFirstAscension && !game.layouts?.some((layout) => layout.auto)) {
    const ascensionLayout: SavedLayout = {
      ...snapshotFarm(game),
      name: "Ascension Layout",
      auto: true,
      createdAt,
      updatedAt: createdAt,
    };
    // Crystals are single-use and delivered per-upgrade via the reward chest, so
    // they are never part of the reusable layout.
    ascensionLayout.resources.ascensionCrystals = {};
    game.layouts = [...(game.layouts ?? []), ascensionLayout];
  }

  if (hasFeatureAccess(game, "SWAMP_ASCENSION")) {
    // Every island upgrade (basic + ascension) reconciles the player's resources
    // against the new island's floor via the shared `getMissingResources`
    // back-pay (same as revealLand's: per-tier/forging-safe, depletion-aware) and
    // delivers any shortfall — nodes, sunstones, and the upgrade's Ascension
    // Crystals — through a side-island reward chest rather than topping up
    // inventory. The `missing-resources` id prefix lets revealLand's back-pay
    // dedup so the same items are never granted twice.
    const bundle = getMissingResources({
      game,
      expansion: game.inventory["Basic Land"]?.toNumber() ?? 0,
    });
    if (getObjectEntries(bundle).length > 0) {
      game.airdrops = [
        ...(game.airdrops ?? []),
        {
          // Unique per upgrade so `claimAirdrop` (which removes every airdrop
          // matching the claimed id) never drops a pending chest: ascension
          // islands key on the strictly-increasing ascension level (incl. the
          // infinite marble→marble loop); basic islands key on the target island
          // (each is reached once in the linear progression).
          id: isAscensionTarget
            ? `missing-resources-ascension-${game.island.ascensionLevel}`
            : `missing-resources-upgrade-${target}`,
          createdAt,
          coordinates: pickAscensionChestPosition(game, setup),
          items: bundle,
          wearables: {},
          sfl: 0,
          coins: 0,
          message: isAscensionTarget
            ? "Ascension rewards! Collect them and place them on your island."
            : "Upgrade rewards! Collect them and place them on your island.",
        },
      ];
    }
  }

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

  // Temporary: ascending from Swamp (A1) into the next island (A2) is gated behind
  // the SPOOKY_ASCENSION window (testnet bypasses). The first ascension (A0 → A1)
  // is unaffected.
  if (
    (game.island.ascensionLevel ?? 0) + 1 === 2 &&
    !hasTimeBasedFeatureAccess({
      featureName: "SPOOKY_ASCENSION",
      now: createdAt,
      game,
    })
  ) {
    throw new Error("Ascension to the next island is not yet available");
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
      maxLevel: getMaxBumpkinLevel(game),
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
