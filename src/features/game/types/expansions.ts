import type {
  BasicIslandType,
  GameState,
  InventoryItemName,
  IslandType,
} from "./game";
import type { Coordinates } from "../expansion/components/MapPlacement";
import type { Nodes } from "../expansion/lib/expansionNodes";
import {
  getAscensionExpansionRequirements,
  getAscensionLayout,
  getAscensionNodes,
  getExpectedAscensionCrystals,
} from "../expansion/lib/ascension";
import { getKeys } from "lib/object";
import { hasFeatureAccess } from "lib/flags";
import type { LevelRequirement } from "features/game/lib/level";
import {
  ADVANCED_RESOURCES,
  REQUIRED_NODES_TO_FORGE,
  RESOURCES,
  RESOURCES_UPGRADES_TO,
  type ResourceName,
  type UpgradedResourceName,
} from "./resources";

export type ExpandLandAction = {
  type: "land.expanded";
};

const LAND_GEM_RATIO = 15;

export function getBasicLand({ expansion }: { expansion: number }) {
  if (expansion === 4) {
    return LAND_4_LAYOUT();
  }

  if (expansion === 5) {
    return LAND_5_LAYOUT();
  }

  if (expansion === 6) {
    return LAND_6_LAYOUT();
  }

  if (expansion === 7) {
    return LAND_7_LAYOUT();
  }

  if (expansion === 8) {
    return LAND_8_LAYOUT();
  }

  if (expansion === 9) {
    return LAND_9_LAYOUT();
  }

  return null;
}

const isAdvancedResource = (
  resource: string,
): resource is UpgradedResourceName => {
  return resource in ADVANCED_RESOURCES;
};

/**
 * Determines expected resource node counts for an expansion, incorporating player purchases and upgrade conversions.
 *
 * @returns A mapping of resource names to expected cumulative node counts at the given expansion
 */
export function getExpectedResources({
  game,
  expansion,
}: {
  game: GameState;
  expansion: number;
}): Record<ResourceName, number> {
  const baseNodes = getExpansionNodes({
    island: game.island.type,
    expansion,
    ascensionLevel: game.island.ascensionLevel,
  });

  const expectedResources: Record<ResourceName, number> = {
    ...baseNodes,
    "Ancient Tree": 0,
    "Sacred Tree": 0,
    "Fused Stone Rock": 0,
    "Reinforced Stone Rock": 0,
    "Refined Iron Rock": 0,
    "Tempered Iron Rock": 0,
    "Pure Gold Rock": 0,
    "Prime Gold Rock": 0,
    Boulder: 0,
  };

  // If they have bought resource nodes, we expect they should have more resources.
  getKeys(RESOURCES).forEach((resource) => {
    const bought =
      resource === "Beehive"
        ? (game.farmActivity[`Flower Bed Bought`] ?? 0)
        : (game.farmActivity[`${resource} Bought`] ?? 0);

    // Subtract the resources that were burned during upgrades
    let burned = 0;
    const upgradeName = RESOURCES_UPGRADES_TO[resource];

    if (upgradeName) {
      const upgradeCount = game.farmActivity[`${upgradeName} Upgrade`] ?? 0;

      burned = upgradeCount * REQUIRED_NODES_TO_FORGE;
    }

    // Add this resource if they upgraded to this
    let upgraded = 0;
    if (isAdvancedResource(resource)) {
      upgraded = game.farmActivity[`${resource} Upgrade`] ?? 0;
    }

    expectedResources[resource] =
      (expectedResources[resource] ?? 0) + bought - burned + upgraded;
  });

  // Ascension Crystals follow a custom grant schedule (outside the drip model)
  // and only when the ascension feature is live. Override the base (0) with the
  // cumulative expected so revealLand's missing-node airdrop can back-pay legacy
  // players who progressed before the feature shipped.
  expectedResources["Ascension Crystal"] = hasFeatureAccess(
    game,
    "SWAMP_ASCENSION",
  )
    ? getExpectedAscensionCrystals({
        islandType: game.island.type,
        ascensionLevel: game.island.ascensionLevel ?? 0,
        basicLand: expansion,
      })
    : 0;

  return expectedResources;
}

/**
 * Mines a full sunstone rock holds before it depletes and is removed from the
 * farm (see mineSunstone). Used when reconciling how many rocks a player has
 * mined to depletion so they are not re-granted.
 */
export const SUNSTONE_MINES = 10;

/**
 * Resource/node counts the player is owed but does not yet have — the shared
 * back-pay reconciliation used by BOTH `revealLand`'s missing-resources airdrop
 * and the ascension reward chest. For each node type it is the expected amount
 * (per-tier, from `getExpectedResources`, which subtracts forged/burned nodes)
 * minus what the player owns in inventory, minus what an un-collected
 * `missing-resources` airdrop already promises. Finite resources are credited
 * for legitimate consumption so they are never resurrected: Sunstone Rocks for
 * rocks mined to depletion, Ascension Crystals for crystals mined (single-use).
 *
 * Counting per-tier (not base-equivalents) is what makes this forging-safe: a
 * player who forges 4 Trees → 1 Ancient Tree has `expected.Tree` reduced by the
 * burn, so the base Trees are not re-granted.
 *
 * @returns Only positive shortfalls, keyed by resource name.
 */
export function getMissingResources({
  game,
  expansion,
}: {
  game: GameState;
  expansion: number;
}): Partial<Record<ResourceName, number>> {
  const expected = getExpectedResources({ game, expansion });

  // Items already promised by an un-collected missing-resources airdrop are not
  // yet in inventory; counting them as still-missing would duplicate the grant
  // if the player reveals/ascends again before collecting the previous airdrop.
  const pendingMissing: Partial<Record<ResourceName, number>> = {};
  (game.airdrops ?? [])
    .filter((airdrop) => airdrop.id.startsWith("missing-resources"))
    .forEach((airdrop) => {
      getKeys(expected).forEach((key) => {
        pendingMissing[key] =
          (pendingMissing[key] ?? 0) + (airdrop.items[key] ?? 0);
      });
    });

  const missing: Partial<Record<ResourceName, number>> = {};
  getKeys(expected).forEach((key) => {
    let shortfall =
      (expected[key] ?? 0) -
      (game.inventory[key]?.toNumber() ?? 0) -
      (pendingMissing[key] ?? 0);

    // Sunstone rocks are finite: once mined to depletion a rock is removed from
    // inventory. Subtract the depletions so they are not re-granted. Each rock
    // holds SUNSTONE_MINES mines; mines spent on rocks the player still owns are
    // not depletions, so exclude them before dividing.
    if (key === "Sunstone Rock") {
      const lifetimeMines = game.farmActivity?.["Sunstone Mined"] ?? 0;
      const minesOnLiveRocks = Object.values(game.sunstones ?? {}).reduce(
        (total, rock) => total + (SUNSTONE_MINES - rock.minesLeft),
        0,
      );
      const depleted = Math.floor(
        Math.max(0, lifetimeMines - minesOnLiveRocks) / SUNSTONE_MINES,
      );
      shortfall -= depleted;
    }

    // Ascension Crystals are single-use: each mine destroys one crystal and
    // decrements inventory. Subtract mined crystals so they are not resurrected.
    if (key === "Ascension Crystal") {
      shortfall -= game.farmActivity?.["Ascension Crystal Mined"] ?? 0;
    }

    if (shortfall > 0) missing[key] = shortfall;
  });

  return missing;
}

/**
 * Computes the layout for the player's next land expansion with resource availability constraints applied.
 *
 * @param game - The current game state
 * @returns The next land expansion layout with resource placements capped by available resources, or `null` if no layout exists for the computed expansion
 */
export function getLand({ game }: { game: GameState }): Layout | null {
  const expansion = (game.inventory["Basic Land"]?.toNumber() ?? 0) + 1;

  let land: Layout | null = null;

  if (game.island.type === "basic") {
    land = getBasicLand({ expansion });
  }

  if (game.island.type === "spring") {
    land = SPRING_LAYOUTS()[expansion];
  }

  if (game.island.type === "desert") {
    land = DESERT_LAYOUTS()[expansion];
  }

  if (game.island.type === "volcano") {
    land = VOLCANO_LAYOUTS()[expansion];
  }

  if ((game.island.ascensionLevel ?? 0) > 0) {
    land = getAscensionLayout({
      expansion,
      ascensionLevel: game.island.ascensionLevel ?? 0,
    });
  }

  if (!land) {
    return null;
  }

  const expectedResources = getExpectedResources({
    game,
    expansion,
  });

  const totalTrees = game.inventory.Tree?.toNumber() ?? 0;
  const availableTrees = expectedResources.Tree - totalTrees;
  land.trees = land.trees.slice(0, Math.max(0, availableTrees));

  const totalStones = game.inventory["Stone Rock"]?.toNumber() ?? 0;
  const availableStones = expectedResources["Stone Rock"] - totalStones;
  land.stones = land.stones.slice(0, Math.max(0, availableStones));

  const totalIron = game.inventory["Iron Rock"]?.toNumber() ?? 0;
  const availableIron = expectedResources["Iron Rock"] - totalIron;
  land.iron = land.iron?.slice(0, Math.max(0, availableIron));

  const totalGold = game.inventory["Gold Rock"]?.toNumber() ?? 0;
  const availableGold = expectedResources["Gold Rock"] - totalGold;
  land.gold = land.gold?.slice(0, Math.max(0, availableGold));

  const availableFruit =
    expectedResources["Fruit Patch"] -
    (game.inventory["Fruit Patch"]?.toNumber() ?? 0);
  land.fruitPatches = land.fruitPatches?.slice(0, Math.max(0, availableFruit));

  const availablePlots =
    expectedResources["Crop Plot"] -
    (game.inventory["Crop Plot"]?.toNumber() ?? 0);
  land.plots = land.plots.slice(0, Math.max(0, availablePlots));

  const availableHives =
    expectedResources["Beehive"] - (game.inventory["Beehive"]?.toNumber() ?? 0);
  land.beehives = land.beehives?.slice(0, Math.max(0, availableHives));

  const availableFlowers =
    expectedResources["Flower Bed"] -
    (game.inventory["Flower Bed"]?.toNumber() ?? 0);
  land.flowerBeds = land.flowerBeds?.slice(0, Math.max(0, availableFlowers));

  const availableCrimstones =
    expectedResources["Crimstone Rock"] -
    (game.inventory["Crimstone Rock"]?.toNumber() ?? 0);
  land.crimstones = land.crimstones?.slice(0, Math.max(0, availableCrimstones));

  // IMPORTANT: We cannot drop extra sunstones
  // We need to consider how many sunstones were dropped on previous lands in `game.island.sunstones`
  const availableSunstones =
    expectedResources["Sunstone Rock"] -
    Math.max(
      game.inventory["Sunstone Rock"]?.toNumber() ?? 0,
      game.island.sunstones ?? 0,
    );
  land.sunstones = land.sunstones?.slice(0, Math.max(0, availableSunstones));

  const availableOilReserves =
    expectedResources["Oil Reserve"] -
    (game.inventory["Oil Reserve"]?.toNumber() ?? 0);
  land.oilReserves = land.oilReserves?.slice(
    0,
    Math.max(0, availableOilReserves),
  );

  // Add Lava
  const availableLavaPit =
    expectedResources["Lava Pit"] -
    (game.inventory["Lava Pit"]?.toNumber() ?? 0);
  land.lavaPits = land.lavaPits?.slice(0, Math.max(0, availableLavaPit));

  return land;
}

export const LAND_4_LAYOUT: () => Layout = () => ({
  id: "4",
  plots: [
    {
      x: -1,
      y: 0,
    },
    {
      x: 0,
      y: 0,
    },
    {
      x: 1,
      y: 0,
    },
    {
      x: -1,
      y: -1,
    },
    {
      x: 0,
      y: -1,
    },
    {
      x: 1,
      y: -1,
    },

    {
      x: -1,
      y: 1,
    },
    {
      x: 0,
      y: 1,
    },
    {
      x: 1,
      y: 1,
    },
  ],
  fruitPatches: [],
  gold: [],
  iron: [
    {
      x: -2,
      y: -2,
    },
  ],
  stones: [
    {
      x: 1,
      y: -2,
    },
  ],
  trees: [
    {
      x: 1,
      y: 3,
    },
    {
      x: -2,
      y: 3,
    },
  ],
});

export const LAND_5_LAYOUT: () => Layout = () => ({
  id: "5",
  plots: [
    {
      x: -2,
      y: -2,
    },
    {
      x: -2,
      y: -1,
    },
    {
      x: -1,
      y: -2,
    },
    {
      x: -1,
      y: -1,
    },
    {
      x: 0,
      y: -2,
    },
    {
      x: 0,
      y: -1,
    },
    {
      x: 1,
      y: -2,
    },
    {
      x: 1,
      y: -1,
    },
  ],
  fruitPatches: [],
  gold: [
    {
      x: -1,
      y: 3,
    },
  ],
  iron: [
    {
      x: -3,
      y: 0,
    },
  ],
  stones: [
    {
      x: -3,
      y: -1,
    },
  ],
  trees: [
    {
      x: -3,
      y: 2,
    },
  ],
});
export const LAND_6_LAYOUT: () => Layout = () => ({
  id: "6",
  plots: [
    {
      x: -3,
      y: 1,
    },
    {
      x: -3,
      y: 0,
    },
    {
      x: -2,
      y: 1,
    },
    {
      x: -2,
      y: 0,
    },
    {
      x: -1,
      y: 1,
    },
    {
      x: -1,
      y: 0,
    },
    {
      x: 0,
      y: 1,
    },
    {
      x: 0,
      y: 0,
    },
  ],
  fruitPatches: [],
  gold: [],
  iron: [],
  stones: [
    {
      x: 0,
      y: -1,
    },
  ],
  trees: [
    {
      x: 1,
      y: 2,
    },
  ],
});

export const LAND_7_LAYOUT: () => Layout = () => ({
  id: "7",
  plots: [
    {
      x: -1,
      y: -1,
    },
    {
      x: 0,
      y: -1,
    },
  ],
  fruitPatches: [],
  gold: [],
  iron: [
    {
      x: 2,
      y: 0,
    },
  ],
  stones: [
    {
      x: -3,
      y: 1,
    },
  ],
  trees: [
    {
      x: -1,
      y: 2,
    },
  ],
});

export const LAND_8_LAYOUT: () => Layout = () => ({
  id: "8",
  plots: [
    {
      x: -2,
      y: 1,
    },
    {
      x: -2,
      y: 0,
    },
  ],
  fruitPatches: [],
  gold: [
    {
      x: 1,
      y: -1,
    },
  ],
  iron: [],
  stones: [
    {
      x: 0,
      y: 0,
    },
  ],
  trees: [
    {
      x: 0,
      y: 3,
    },
  ],
});

export const LAND_9_LAYOUT: () => Layout = () => ({
  id: "9",
  plots: [
    {
      x: 0,
      y: 3,
    },
    {
      x: 1,
      y: 3,
    },
  ],
  fruitPatches: [],
  gold: [],
  iron: [
    {
      x: -2,
      y: 0,
    },
  ],
  stones: [],
  trees: [],
});

export const SPRING_LAND_5_LAYOUT: () => Layout = () => ({
  id: "spring_5",
  plots: [
    {
      x: -2,
      y: 0,
    },
    {
      x: -1,
      y: 0,
    },
  ],
  fruitPatches: [
    {
      x: -1,
      y: 3,
    },
  ],
  gold: [
    {
      x: 1,
      y: -2,
    },
  ],
  iron: [
    {
      x: 0,
      y: -2,
    },
  ],
  stones: [
    {
      x: -2,
      y: -2,
    },
    {
      x: -1,
      y: -2,
    },
  ],
  crimstones: [],
  sunstones: [],
  trees: [
    {
      x: 1,
      y: 3,
    },
    {
      x: 1,
      y: 1,
    },
  ],
  beehives: [],
});

export const SPRING_LAND_6_LAYOUT: () => Layout = () => ({
  id: "spring_6",
  plots: [],
  fruitPatches: [
    {
      x: 0,
      y: 3,
    },
  ],
  gold: [],
  iron: [],
  stones: [
    {
      x: -3,
      y: 2,
    },
  ],
  crimstones: [],
  sunstones: [],
  trees: [
    {
      x: -2,
      y: 3,
    },
  ],
  beehives: [
    {
      x: 0,
      y: 0,
    },
  ],
  flowerBeds: [
    {
      x: -1,
      y: -1,
    },
  ],
});

export const SPRING_LAND_7_LAYOUT: () => Layout = () => ({
  id: "spring_7",
  plots: [
    {
      x: -2,
      y: 1,
    },
    {
      x: -2,
      y: 0,
    },
  ],
  fruitPatches: [],
  gold: [],
  iron: [],
  stones: [
    {
      x: 0,
      y: 2,
    },
  ],
  crimstones: [
    {
      x: -1,
      y: -1,
    },
  ],
  sunstones: [],
  trees: [
    {
      x: 1,
      y: 0,
    },
  ],
  beehives: [],
});

export const SPRING_LAND_8_LAYOUT: () => Layout = () => ({
  id: "spring_8",
  plots: [
    {
      x: -1,
      y: -2,
    },
    {
      x: 0,
      y: -2,
    },
  ],
  fruitPatches: [
    {
      x: -1,
      y: 0,
    },
  ],
  gold: [
    {
      x: -3,
      y: 0,
    },
  ],
  iron: [
    {
      x: 1,
      y: 1,
    },
  ],
  stones: [
    {
      x: -1,
      y: 2,
    },
  ],
  crimstones: [],
  sunstones: [],
  trees: [],
  beehives: [],
});

export const SPRING_LAND_9_LAYOUT: () => Layout = () => ({
  plots: [],
  fruitPatches: [
    {
      x: -2,
      y: 2,
    },
  ],
  gold: [],
  iron: [],
  stones: [],
  crimstones: [],
  sunstones: [
    {
      x: -1,
      y: -1,
    },
  ],
  trees: [
    {
      x: 0,
      y: 2,
    },
  ],
  beehives: [],
  id: "spring_9",
});

export const SPRING_LAND_10_LAYOUT: () => Layout = () => ({
  plots: [],
  fruitPatches: [
    {
      x: -2,
      y: 3,
    },
  ],
  gold: [
    {
      x: 1,
      y: 2,
    },
  ],
  iron: [
    {
      x: 0,
      y: 3,
    },
  ],
  stones: [],
  crimstones: [],
  sunstones: [],
  trees: [],
  beehives: [
    {
      x: 0,
      y: 0,
    },
  ],
  flowerBeds: [
    {
      x: -1,
      y: -1,
    },
  ],
  id: "spring_10",
});

export const SPRING_LAND_11_LAYOUT: () => Layout = () => ({
  plots: [
    {
      x: -2,
      y: 2,
    },
    {
      x: -1,
      y: 2,
    },
  ],
  fruitPatches: [
    {
      x: -2,
      y: -1,
    },
  ],
  gold: [],
  iron: [],
  stones: [
    {
      x: 1,
      y: 2,
    },
  ],

  sunstones: [],
  trees: [
    {
      x: 0,
      y: -1,
    },
  ],
  beehives: [],
  id: "spring_11",
});

export const SPRING_LAND_12_LAYOUT: () => Layout = () => ({
  plots: [
    {
      x: -1,
      y: 1,
    },
    {
      x: 0,
      y: 1,
    },
  ],
  fruitPatches: [],
  gold: [],
  iron: [],
  stones: [],
  crimstones: [],
  sunstones: [],
  trees: [],
  beehives: [],
  id: "spring_12",
});

export const SPRING_LAND_13_LAYOUT: () => Layout = () => ({
  plots: [],
  fruitPatches: [
    {
      x: -1,
      y: 3,
    },
  ],
  gold: [],
  iron: [
    {
      x: 1,
      y: 1,
    },
  ],
  stones: [
    {
      x: -2,
      y: 1,
    },
  ],
  crimstones: [],
  sunstones: [
    {
      x: 0,
      y: -1,
    },
  ],
  trees: [
    {
      x: -2,
      y: -1,
    },
  ],
  beehives: [],
  id: "spring_13",
});

export const SPRING_LAND_14_LAYOUT: () => Layout = () => ({
  plots: [
    {
      x: -2,
      y: 2,
    },
    {
      x: -2,
      y: 1,
    },
  ],
  fruitPatches: [
    {
      x: 1,
      y: 2,
    },
  ],
  gold: [],
  iron: [],
  stones: [],
  crimstones: [],
  sunstones: [],
  trees: [],
  beehives: [],
  id: "spring_14",
});

export const SPRING_LAND_15_LAYOUT: () => Layout = () => ({
  plots: [
    {
      x: -2,
      y: 2,
    },
  ],
  fruitPatches: [
    {
      x: 1,
      y: 1,
    },
  ],
  gold: [],
  iron: [
    {
      x: -1,
      y: -1,
    },
  ],
  stones: [
    {
      x: -2,
      y: 0,
    },
  ],
  crimstones: [
    {
      x: -1,
      y: 1,
    },
  ],
  sunstones: [],
  trees: [
    {
      x: 1,
      y: 3,
    },
  ],
  beehives: [],
  id: "spring_15",
});

export const SPRING_LAND_16_LAYOUT: () => Layout = () => ({
  plots: [
    {
      x: -2,
      y: 2,
    },
  ],
  fruitPatches: [],
  gold: [
    {
      x: -1,
      y: 1,
    },
  ],
  iron: [],
  stones: [],

  sunstones: [],
  trees: [
    {
      x: 0,
      y: 3,
    },
  ],
  beehives: [
    {
      x: 0,
      y: -1,
    },
  ],
  flowerBeds: [
    {
      x: -1,
      y: -2,
    },
  ],
  id: "spring_16",
});

export const SPRING_LAYOUTS: () => Record<number, Layout> = () => ({
  5: SPRING_LAND_5_LAYOUT(),
  6: SPRING_LAND_6_LAYOUT(),
  7: SPRING_LAND_7_LAYOUT(),
  8: SPRING_LAND_8_LAYOUT(),
  9: SPRING_LAND_9_LAYOUT(),

  10: SPRING_LAND_10_LAYOUT(),
  11: SPRING_LAND_11_LAYOUT(),
  12: SPRING_LAND_12_LAYOUT(),
  13: SPRING_LAND_13_LAYOUT(),
  14: SPRING_LAND_14_LAYOUT(),
  15: SPRING_LAND_15_LAYOUT(),
  16: SPRING_LAND_16_LAYOUT(),
});

export const DESERT_LAND_5_LAYOUT: () => Layout = () => ({
  id: "desert_5",
  plots: [{ x: -1, y: 1 }],
  fruitPatches: [],
  gold: [],
  iron: [
    {
      x: 2,
      y: -2,
    },
  ],
  stones: [
    {
      x: 1,
      y: 1,
    },
  ],
  crimstones: [],
  sunstones: [],
  trees: [],
  beehives: [],
  oilReserves: [
    {
      x: -3,
      y: 0,
    },
  ],
});

export const DESERT_LAND_6_LAYOUT: () => Layout = () => ({
  id: "desert_6",
  plots: [],
  fruitPatches: [{ x: -3, y: 0 }],
  gold: [],
  iron: [],
  stones: [],
  crimstones: [],
  sunstones: [{ x: 0, y: 0 }],
  trees: [],
  beehives: [],
});

export const DESERT_LAND_7_LAYOUT: () => Layout = () => ({
  id: "desert_7",
  plots: [
    {
      x: -2,
      y: -1,
    },
    {
      x: -1,
      y: -1,
    },
  ],
  fruitPatches: [],
  gold: [],
  iron: [],
  stones: [],
  crimstones: [{ x: 1, y: 2 }],
  sunstones: [],
  trees: [],
  beehives: [],
});

export const DESERT_LAND_8_LAYOUT: () => Layout = () => ({
  id: "desert_8",
  plots: [
    {
      x: 0,
      y: 0,
    },
    {
      x: 0,
      y: 1,
    },
  ],
  fruitPatches: [],
  gold: [],
  iron: [],
  stones: [],
  crimstones: [],
  sunstones: [
    {
      x: -3,
      y: 0,
    },
  ],
  trees: [],
  beehives: [],
});

export const DESERT_LAND_9_LAYOUT: () => Layout = () => ({
  id: "desert_9",
  plots: [],
  fruitPatches: [],
  gold: [],
  iron: [],
  stones: [
    {
      x: 1,
      y: -1,
    },
  ],
  crimstones: [],
  sunstones: [],
  trees: [
    {
      x: -2,
      y: 2,
    },
  ],
  beehives: [],
});

export const DESERT_LAND_10_LAYOUT: () => Layout = () => ({
  id: "desert_10",
  plots: [
    {
      x: 0,
      y: 0,
    },
  ],
  fruitPatches: [],
  gold: [],
  iron: [
    {
      x: 1,
      y: 0,
    },
  ],
  stones: [],
  crimstones: [],
  sunstones: [],
  trees: [],
  beehives: [],
});

export const DESERT_LAND_11_LAYOUT: () => Layout = () => ({
  id: "desert_11",
  plots: [
    {
      x: 1,
      y: 1,
    },
  ],
  fruitPatches: [
    {
      x: -2,
      y: 3,
    },
  ],
  gold: [],
  iron: [],
  stones: [],
  crimstones: [],
  sunstones: [],
  trees: [],
  beehives: [],
});

export const DESERT_LAND_12_LAYOUT: () => Layout = () => ({
  id: "desert_12",
  plots: [
    {
      x: -2,
      y: 2,
    },
    {
      x: -2,
      y: 3,
    },
  ],
  fruitPatches: [],
  gold: [],
  iron: [],
  stones: [],
  crimstones: [],
  sunstones: [],
  trees: [],
  beehives: [],
});

export const DESERT_LAND_13_LAYOUT: () => Layout = () => ({
  id: "desert_13",
  plots: [],
  fruitPatches: [],
  gold: [],
  iron: [],
  stones: [],
  crimstones: [],
  // No sunstone here — it was a stray vs the desert node cap (always sliced off)
  // and is removed so the desert node table derives cleanly, matching the BE.
  sunstones: [],
  trees: [
    {
      x: 0,
      y: 2,
    },
  ],
  beehives: [],
});

export const DESERT_LAND_14_LAYOUT: () => Layout = () => ({
  id: "desert_14",
  plots: [
    {
      x: -2,
      y: 2,
    },
  ],
  fruitPatches: [],
  gold: [],
  iron: [],
  stones: [
    {
      x: 1,
      y: -1,
    },
  ],
  crimstones: [],
  sunstones: [],
  trees: [],
  beehives: [],
});

export const DESERT_LAND_15_LAYOUT: () => Layout = () => ({
  id: "desert_15",
  plots: [
    {
      x: -2,
      y: -2,
    },
  ],
  fruitPatches: [],
  gold: [],
  iron: [],
  stones: [],
  crimstones: [],
  sunstones: [],
  trees: [],
  beehives: [],
  oilReserves: [
    {
      x: 0,
      y: 0,
    },
  ],
});

export const DESERT_LAND_16_LAYOUT: () => Layout = () => ({
  id: "desert_16",
  plots: [
    {
      x: -2,
      y: 0,
    },
  ],
  fruitPatches: [],
  gold: [],
  iron: [],
  stones: [],
  crimstones: [],
  sunstones: [],
  trees: [
    {
      x: 1,
      y: 2,
    },
  ],
  beehives: [],
});

export const DESERT_LAND_17_LAYOUT: () => Layout = () => ({
  id: "desert_17",
  plots: [
    {
      x: 0,
      y: 0,
    },
    {
      x: -1,
      y: 0,
    },
  ],
  fruitPatches: [],
  gold: [],
  iron: [],
  stones: [],
  crimstones: [],
  sunstones: [],
  trees: [],
  beehives: [],
});

export const DESERT_LAND_18_LAYOUT: () => Layout = () => ({
  id: "desert_18",
  plots: [
    {
      x: 0,
      y: 0,
    },
  ],
  fruitPatches: [],
  gold: [
    {
      x: 1,
      y: 1,
    },
  ],
  iron: [],
  stones: [],
  crimstones: [],
  sunstones: [],
  trees: [],
  beehives: [],
});

export const DESERT_LAND_19_LAYOUT: () => Layout = () => ({
  id: "desert_19",
  plots: [
    {
      x: 2,
      y: -2,
    },
  ],
  fruitPatches: [
    {
      x: -2,
      y: 3,
    },
  ],
  gold: [],
  iron: [],
  stones: [],
  crimstones: [],
  sunstones: [],
  trees: [],
  beehives: [],
});

export const DESERT_LAND_20_LAYOUT: () => Layout = () => ({
  id: "desert_20",
  plots: [],
  fruitPatches: [],
  gold: [],
  iron: [],
  stones: [
    {
      x: -1,
      y: 2,
    },
  ],
  crimstones: [],
  sunstones: [],
  trees: [
    {
      x: 1,
      y: 3,
    },
  ],
  beehives: [],
  oilReserves: [
    {
      x: 0,
      y: 0,
    },
  ],
});

export const DESERT_LAND_21_LAYOUT: () => Layout = () => ({
  id: "desert_21",
  plots: [
    {
      x: -2,
      y: 2,
    },
  ],
  fruitPatches: [],
  gold: [],
  iron: [
    {
      x: -1,
      y: 2,
    },
  ],
  stones: [],
  crimstones: [],
  sunstones: [
    {
      x: 0,
      y: 0,
    },
  ],
  trees: [],
  beehives: [],
});

export const DESERT_LAND_22_LAYOUT: () => Layout = () => ({
  id: "desert_22",
  plots: [],
  fruitPatches: [
    {
      x: 1,
      y: 2,
    },
  ],
  gold: [],
  iron: [],
  stones: [],
  crimstones: [],
  sunstones: [],
  trees: [
    {
      x: -2,
      y: -1,
    },
  ],
  beehives: [],
});

export const DESERT_LAND_23_LAYOUT: () => Layout = () => ({
  id: "desert_23",
  plots: [
    {
      x: -2,
      y: 2,
    },
  ],
  fruitPatches: [],
  gold: [],
  iron: [],
  stones: [],
  crimstones: [
    {
      x: 0,
      y: 0,
    },
  ],
  sunstones: [],
  trees: [],
  beehives: [],
});

export const DESERT_LAND_24_LAYOUT: () => Layout = () => ({
  id: "desert_24",
  plots: [
    {
      x: -1,
      y: 1,
    },
  ],
  fruitPatches: [],
  gold: [],
  iron: [],
  stones: [],
  crimstones: [],
  sunstones: [
    {
      x: 1,
      y: 1,
    },
  ],
  trees: [],
  beehives: [],
});

export const DESERT_LAND_25_LAYOUT: () => Layout = () => ({
  id: "desert_25",
  plots: [
    {
      x: -1,
      y: -1,
    },
  ],
  fruitPatches: [],
  gold: [],
  iron: [],
  stones: [
    {
      x: 1,
      y: 1,
    },
  ],
  crimstones: [],
  sunstones: [],
  trees: [],
  beehives: [],
});

export const DESERT_LAYOUTS: () => Record<number, Layout> = () => ({
  5: DESERT_LAND_5_LAYOUT(),
  6: DESERT_LAND_6_LAYOUT(),
  7: DESERT_LAND_7_LAYOUT(),
  8: DESERT_LAND_8_LAYOUT(),
  9: DESERT_LAND_9_LAYOUT(),
  10: DESERT_LAND_10_LAYOUT(),
  11: DESERT_LAND_11_LAYOUT(),
  12: DESERT_LAND_12_LAYOUT(),
  13: DESERT_LAND_13_LAYOUT(),
  14: DESERT_LAND_14_LAYOUT(),
  15: DESERT_LAND_15_LAYOUT(),
  16: DESERT_LAND_16_LAYOUT(),
  17: DESERT_LAND_17_LAYOUT(),
  18: DESERT_LAND_18_LAYOUT(),
  19: DESERT_LAND_19_LAYOUT(),
  20: DESERT_LAND_20_LAYOUT(),
  21: DESERT_LAND_21_LAYOUT(),
  22: DESERT_LAND_22_LAYOUT(),
  23: DESERT_LAND_23_LAYOUT(),
  24: DESERT_LAND_24_LAYOUT(),
  25: DESERT_LAND_25_LAYOUT(),
});

export const VOLCANO_LAND_6_LAYOUT: () => Layout = () => ({
  id: "volcano_6",
  plots: [],
  fruitPatches: [],
  gold: [],
  iron: [],
  stones: [],
  crimstones: [],
  sunstones: [],
  trees: [],
  beehives: [],
  oilReserves: [],
  lavaPits: [],
});

export const VOLCANO_LAND_7_LAYOUT: () => Layout = () => ({
  id: "volcano_7",
  plots: [],
  fruitPatches: [],
  gold: [],
  iron: [],
  stones: [],
  crimstones: [],
  sunstones: [],
  trees: [],
  beehives: [],
  oilReserves: [],
  lavaPits: [
    {
      x: 0,
      y: 0,
    },
  ],
});

export const VOLCANO_LAND_8_LAYOUT: () => Layout = () => ({
  id: "volcano_8",
  plots: [],
  fruitPatches: [],
  gold: [],
  iron: [],
  stones: [],
  crimstones: [],
  sunstones: [
    {
      x: 1,
      y: 1,
    },
  ],
  trees: [],
  beehives: [],
  oilReserves: [],
  lavaPits: [],
});

export const VOLCANO_LAND_9_LAYOUT: () => Layout = () => ({
  id: "volcano_9",
  plots: [],
  fruitPatches: [],
  gold: [],
  iron: [],
  stones: [],
  crimstones: [],
  sunstones: [],
  trees: [],
  beehives: [],
  oilReserves: [],
  lavaPits: [],
});

export const VOLCANO_LAND_10_LAYOUT: () => Layout = () => ({
  id: "volcano_10",
  plots: [],
  fruitPatches: [],
  gold: [
    {
      x: -1,
      y: 0,
    },
  ],
  iron: [],
  stones: [],
  crimstones: [],
  sunstones: [],
  trees: [],
  beehives: [],
  oilReserves: [],
  lavaPits: [],
});

export const VOLCANO_LAND_11_LAYOUT: () => Layout = () => ({
  id: "volcano_11",
  plots: [],
  fruitPatches: [],
  gold: [],
  iron: [],
  stones: [],
  crimstones: [],
  sunstones: [],
  trees: [],
  beehives: [],
  oilReserves: [],
  lavaPits: [],
});

export const VOLCANO_LAND_12_LAYOUT: () => Layout = () => ({
  id: "volcano_12",
  plots: [],
  fruitPatches: [],
  gold: [],
  iron: [],
  stones: [],
  crimstones: [],
  sunstones: [
    {
      x: 0,
      y: 1,
    },
  ],
  trees: [],
  beehives: [],
  oilReserves: [],
  lavaPits: [],
});

export const VOLCANO_LAND_13_LAYOUT: () => Layout = () => ({
  id: "volcano_13",
  plots: [],
  fruitPatches: [],
  gold: [],
  iron: [],
  stones: [],
  crimstones: [],
  sunstones: [],
  trees: [],
  beehives: [],
  oilReserves: [],
  lavaPits: [],
});

export const VOLCANO_LAND_14_LAYOUT: () => Layout = () => ({
  id: "volcano_14",
  plots: [],
  fruitPatches: [],
  gold: [],
  iron: [],
  stones: [],
  crimstones: [],
  sunstones: [],
  trees: [],
  beehives: [],
  oilReserves: [],
  lavaPits: [],
});

export const VOLCANO_LAND_15_LAYOUT: () => Layout = () => ({
  id: "volcano_15",
  plots: [],
  fruitPatches: [],
  gold: [],
  iron: [],
  stones: [],
  crimstones: [],
  sunstones: [],
  trees: [],
  beehives: [],
  oilReserves: [],
  lavaPits: [
    {
      x: 1,
      y: 0,
    },
  ],
});

export const VOLCANO_LAND_16_LAYOUT: () => Layout = () => ({
  id: "volcano_16",
  plots: [],
  fruitPatches: [],
  gold: [],
  iron: [],
  stones: [],
  crimstones: [],
  sunstones: [],
  trees: [],
  beehives: [],
  oilReserves: [
    {
      x: -1,
      y: 1,
    },
  ],
  lavaPits: [],
});

export const VOLCANO_LAND_17_LAYOUT: () => Layout = () => ({
  id: "volcano_17",
  plots: [],
  fruitPatches: [],
  gold: [],
  iron: [],
  stones: [],
  crimstones: [],
  sunstones: [
    {
      x: 0,
      y: -1,
    },
  ],
  trees: [],
  beehives: [],
  oilReserves: [],
  lavaPits: [],
});

export const VOLCANO_LAND_18_LAYOUT: () => Layout = () => ({
  id: "volcano_18",
  plots: [],
  fruitPatches: [],
  gold: [],
  iron: [],
  stones: [],
  crimstones: [],
  sunstones: [],
  trees: [],
  beehives: [],
  oilReserves: [],
  lavaPits: [],
});

export const VOLCANO_LAND_19_LAYOUT: () => Layout = () => ({
  id: "volcano_19",
  plots: [],
  fruitPatches: [],
  gold: [],
  iron: [],
  stones: [],
  crimstones: [],
  sunstones: [
    {
      x: 1,
      y: -1,
    },
  ],
  trees: [],
  beehives: [],
  oilReserves: [],
  lavaPits: [],
});

export const VOLCANO_LAND_20_LAYOUT: () => Layout = () => ({
  id: "volcano_20",
  plots: [],
  fruitPatches: [],
  gold: [],
  iron: [],
  stones: [],
  crimstones: [],
  sunstones: [],
  trees: [],
  beehives: [],
  oilReserves: [],
  lavaPits: [],
});

export const VOLCANO_LAND_21_LAYOUT: () => Layout = () => ({
  id: "volcano_21",
  plots: [],
  fruitPatches: [],
  gold: [],
  iron: [],
  stones: [],
  crimstones: [],
  sunstones: [
    {
      x: -1,
      y: -1,
    },
  ],
  trees: [],
  beehives: [],
  oilReserves: [],
  lavaPits: [],
});

export const VOLCANO_LAND_22_LAYOUT: () => Layout = () => ({
  id: "volcano_22",
  plots: [],
  fruitPatches: [],
  gold: [],
  iron: [],
  stones: [],
  crimstones: [],
  sunstones: [],
  trees: [],
  beehives: [],
  oilReserves: [],
  lavaPits: [],
});

export const VOLCANO_LAND_23_LAYOUT: () => Layout = () => ({
  id: "volcano_23",
  plots: [],
  fruitPatches: [],
  gold: [],
  iron: [
    {
      x: 0,
      y: 1,
    },
  ],
  stones: [],
  crimstones: [],
  sunstones: [],
  trees: [],
  beehives: [],
  oilReserves: [],
  lavaPits: [],
});

export const VOLCANO_LAND_24_LAYOUT: () => Layout = () => ({
  id: "volcano_24",
  plots: [],
  fruitPatches: [],
  gold: [],
  iron: [],
  stones: [],
  crimstones: [],
  sunstones: [],
  trees: [],
  beehives: [],
  oilReserves: [],
  lavaPits: [
    {
      x: -1,
      y: 0,
    },
  ],
});

export const VOLCANO_LAND_25_LAYOUT: () => Layout = () => ({
  id: "volcano_25",
  plots: [],
  fruitPatches: [],
  gold: [],
  iron: [],
  stones: [],
  crimstones: [
    {
      x: 1,
      y: 1,
    },
  ],
  sunstones: [],
  trees: [],
  beehives: [],
  oilReserves: [],
  lavaPits: [],
});

export const VOLCANO_LAND_26_LAYOUT: () => Layout = () => ({
  id: "volcano_26",
  plots: [],
  fruitPatches: [],
  gold: [],
  iron: [],
  stones: [],
  crimstones: [],
  sunstones: [],
  trees: [],
  beehives: [],
  oilReserves: [],
  lavaPits: [],
});

export const VOLCANO_LAND_27_LAYOUT: () => Layout = () => ({
  id: "volcano_27",
  plots: [],
  fruitPatches: [],
  gold: [],
  iron: [],
  stones: [],
  crimstones: [],
  sunstones: [],
  trees: [],
  beehives: [],
  oilReserves: [],
  lavaPits: [],
});

export const VOLCANO_LAND_28_LAYOUT: () => Layout = () => ({
  id: "volcano_28",
  plots: [],
  fruitPatches: [],
  gold: [],
  iron: [],
  stones: [],
  crimstones: [],
  sunstones: [
    {
      x: 0,
      y: -1,
    },
  ],
  trees: [],
  beehives: [],
  oilReserves: [],
  lavaPits: [],
});

export const VOLCANO_LAND_29_LAYOUT: () => Layout = () => ({
  id: "volcano_29",
  plots: [],
  fruitPatches: [],
  gold: [],
  iron: [],
  stones: [],
  crimstones: [],
  sunstones: [],
  trees: [],
  beehives: [],
  oilReserves: [],
  lavaPits: [],
});

export const VOLCANO_LAND_30_LAYOUT: () => Layout = () => ({
  id: "volcano_30",
  plots: [],
  fruitPatches: [],
  gold: [],
  iron: [],
  stones: [],
  crimstones: [],
  sunstones: [
    {
      x: 1,
      y: 0,
    },
  ],
  trees: [],
  beehives: [],
  oilReserves: [],
  lavaPits: [],
});

export const VOLCANO_LAYOUTS: () => Record<number, Layout> = () => ({
  6: VOLCANO_LAND_6_LAYOUT(),
  7: VOLCANO_LAND_7_LAYOUT(),
  8: VOLCANO_LAND_8_LAYOUT(),
  9: VOLCANO_LAND_9_LAYOUT(),
  10: VOLCANO_LAND_10_LAYOUT(),
  11: VOLCANO_LAND_11_LAYOUT(),
  12: VOLCANO_LAND_12_LAYOUT(),
  13: VOLCANO_LAND_13_LAYOUT(),
  14: VOLCANO_LAND_14_LAYOUT(),
  15: VOLCANO_LAND_15_LAYOUT(),
  16: VOLCANO_LAND_16_LAYOUT(),
  17: VOLCANO_LAND_17_LAYOUT(),
  18: VOLCANO_LAND_18_LAYOUT(),
  19: VOLCANO_LAND_19_LAYOUT(),
  20: VOLCANO_LAND_20_LAYOUT(),
  21: VOLCANO_LAND_21_LAYOUT(),
  22: VOLCANO_LAND_22_LAYOUT(),
  23: VOLCANO_LAND_23_LAYOUT(),
  24: VOLCANO_LAND_24_LAYOUT(),
  25: VOLCANO_LAND_25_LAYOUT(),
  26: VOLCANO_LAND_26_LAYOUT(),
  27: VOLCANO_LAND_27_LAYOUT(),
  28: VOLCANO_LAND_28_LAYOUT(),
  29: VOLCANO_LAND_29_LAYOUT(),
  30: VOLCANO_LAND_30_LAYOUT(),
});

export type Layout = {
  id: string;
  trees: Coordinates[];
  stones: Coordinates[];
  plots: Coordinates[];
  iron?: Coordinates[];
  gold?: Coordinates[];
  crimstones?: Coordinates[];
  sunstones?: Coordinates[];
  beehives?: Coordinates[];
  flowerBeds?: Coordinates[];
  fruitPatches?: Coordinates[];
  oilReserves?: Coordinates[];
  lavaPits?: Coordinates[];
  ascensionCrystals?: Coordinates[];
};

// --- Expansion node counts (derived) -------------------------------------
// How many of each resource node a player should have at each expansion is
// derived from the layouts above (arrival row + cumulative layout counts) so the
// counts can never drift from the actual map. Mirror of the BE.

/** Maps each `Layout` resource array to its `Nodes` (resource-count) key. */
const LAYOUT_FIELD_TO_NODE = {
  plots: "Crop Plot",
  trees: "Tree",
  stones: "Stone Rock",
  iron: "Iron Rock",
  gold: "Gold Rock",
  crimstones: "Crimstone Rock",
  sunstones: "Sunstone Rock",
  fruitPatches: "Fruit Patch",
  flowerBeds: "Flower Bed",
  beehives: "Beehive",
  oilReserves: "Oil Reserve",
  lavaPits: "Lava Pit",
} as const satisfies Partial<Record<keyof Layout, keyof Nodes>>;

/**
 * Counts the resource nodes placed by a single expansion's `Layout`.
 *
 * @returns A record mapping node types to their counts in the layout.
 */
function countLayoutNodes(
  layout: Layout,
): Partial<Record<keyof Nodes, number>> {
  const counts: Partial<Record<keyof Nodes, number>> = {};
  getKeys(LAYOUT_FIELD_TO_NODE).forEach((field) => {
    const arr = layout[field];
    if (arr && arr.length) {
      const key = LAYOUT_FIELD_TO_NODE[field];
      counts[key] = (counts[key] ?? 0) + arr.length;
    }
  });
  return counts;
}

/**
 * Derives cumulative node counts for each expansion level on an island.
 *
 * @param base - Initial node counts when the island is first discovered.
 * @param layouts - Per-expansion layout definitions.
 * @returns A record mapping each expansion level to its cumulative node totals.
 * @throws If `layouts` is empty.
 */
export function deriveExpansionNodes(
  base: Nodes,
  layouts: Record<number, Layout>,
): Record<number, Nodes> {
  const levels = Object.keys(layouts)
    .map(Number)
    .sort((a, b) => a - b);

  if (levels.length === 0) {
    throw new Error("deriveExpansionNodes requires at least one layout");
  }

  const result: Record<number, Nodes> = {};
  let running: Nodes = { ...base };

  // The arrival row sits at the expansion directly below the first layout.
  result[levels[0] - 1] = { ...running };

  levels.forEach((level) => {
    const counts = countLayoutNodes(layouts[level]);
    running = { ...running };
    getKeys(counts).forEach((key) => {
      running[key] = (running[key] ?? 0) + (counts[key] ?? 0);
    });
    result[level] = running;
  });

  return result;
}

// Only the static, hand-authored islands live here. Ascension islands (swamp
// onward) are ascension-dependent and cannot be a static 2-D table — read them
// via `getExpansionNodes` / `getAscensionNodes` instead.
export type ExpansionNode = Record<BasicIslandType, Record<number, Nodes>>;

const BASIC_BASE_NODES: Nodes = {
  "Crop Plot": 0,
  Tree: 3,
  "Stone Rock": 2,
  "Iron Rock": 0,
  "Gold Rock": 0,
  "Crimstone Rock": 0,
  "Sunstone Rock": 0,
  "Fruit Patch": 0,
  "Flower Bed": 0,
  Beehive: 0,
  "Oil Reserve": 0,
  "Lava Pit": 0,
  "Ascension Crystal": 0,
};

const SPRING_BASE_NODES: Nodes = {
  "Crop Plot": 31,
  "Fruit Patch": 2,
  Tree: 9,
  "Stone Rock": 7,
  "Iron Rock": 4,
  "Gold Rock": 2,
  "Crimstone Rock": 0,
  "Sunstone Rock": 0,
  Beehive: 0,
  "Oil Reserve": 0,
  "Flower Bed": 0,
  "Lava Pit": 0,
  "Ascension Crystal": 0,
};

const DESERT_BASE_NODES: Nodes = {
  "Crop Plot": 45,
  "Fruit Patch": 11,
  Tree: 18,
  "Stone Rock": 15,
  "Iron Rock": 9,
  "Gold Rock": 6,
  "Crimstone Rock": 2,
  "Sunstone Rock": 2,
  "Oil Reserve": 0,
  "Lava Pit": 0,
  Beehive: 3,
  "Flower Bed": 3,
  "Ascension Crystal": 0,
};

const VOLCANO_BASE_NODES: Nodes = {
  "Crop Plot": 65,
  Tree: 23,
  "Stone Rock": 20,
  "Iron Rock": 12,
  "Gold Rock": 7,
  "Fruit Patch": 15,
  "Crimstone Rock": 4,
  "Sunstone Rock": 6,
  "Oil Reserve": 3,
  "Lava Pit": 0,
  Beehive: 3,
  "Flower Bed": 3,
  "Ascension Crystal": 0,
};

export const TOTAL_EXPANSION_NODES: ExpansionNode = {
  // Basic only uses expansions 3-9: it's capped at 9 (see ISLAND_MAX_EXPANSION) and
  // the node table is read only when expanding/upgrading. Legacy farms still on the
  // old land-pack expansions (10-23) can't expand, so those rows are never looked up
  // — they're intentionally omitted (and wouldn't derive cleanly anyway, since the
  // land packs are randomized per player group).
  basic: deriveExpansionNodes(BASIC_BASE_NODES, {
    4: LAND_4_LAYOUT(),
    5: LAND_5_LAYOUT(),
    6: LAND_6_LAYOUT(),
    7: LAND_7_LAYOUT(),
    8: LAND_8_LAYOUT(),
    9: LAND_9_LAYOUT(),
  }),
  spring: deriveExpansionNodes(SPRING_BASE_NODES, SPRING_LAYOUTS()),
  desert: deriveExpansionNodes(DESERT_BASE_NODES, DESERT_LAYOUTS()),
  volcano: deriveExpansionNodes(VOLCANO_BASE_NODES, VOLCANO_LAYOUTS()),
};

/**
 * The single source of truth for "expected cumulative resource nodes at a given
 * expansion". Ascension islands (swamp onward) are computed from the drip
 * formula and depend on the ascension level; the static islands use the derived
 * table. Always read node totals through here rather than indexing
 * `TOTAL_EXPANSION_NODES` directly, so the ascension dimension is never dropped.
 */
export const getExpansionNodes = ({
  island,
  expansion,
  ascensionLevel,
}: {
  island: IslandType;
  expansion: number;
  ascensionLevel?: number;
}): Nodes =>
  (ascensionLevel ?? 0) > 0
    ? getAscensionNodes({ expansion, ascensionLevel: ascensionLevel ?? 0 })
    : TOTAL_EXPANSION_NODES[island as BasicIslandType][expansion];

export interface Requirements {
  resources: Partial<Record<InventoryItemName, number>>;
  seconds: number;
  sfl?: number;
  coins?: number;
  bumpkinLevel: LevelRequirement;
}

const LAND_4_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 3,
  },
  seconds: 5,
  bumpkinLevel: { ascension: 0, level: 1 },
};

const LAND_5_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 5,
  },
  seconds: 5,
  bumpkinLevel: { ascension: 0, level: 1 },
  coins: 0.25,
};

const LAND_6_REQUIREMENTS: Requirements = {
  resources: {
    Stone: 1,
  },
  coins: 60,
  seconds: 60,
  bumpkinLevel: { ascension: 0, level: 2 },
};

const LAND_7_REQUIREMENTS: Requirements = {
  resources: {
    Stone: 5,
    Iron: 1,
  },
  coins: 100,
  seconds: 30 * 60,
  bumpkinLevel: { ascension: 0, level: 5 },
};

const LAND_8_REQUIREMENTS: Requirements = {
  resources: {
    Iron: 3,
    Gold: 1,
  },
  coins: 200,
  seconds: 4 * 60 * 60,
  bumpkinLevel: { ascension: 0, level: 8 },
};

const LAND_9_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 100,
    Stone: 40,
    Iron: 5,
  },
  coins: 300,
  seconds: 12 * 60 * 60,
  bumpkinLevel: { ascension: 0, level: 11 },
};

const LAND_10_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 100,
    Stone: 50,
    Iron: 5,
    Gold: 2,
    Gem: 1 * LAND_GEM_RATIO,
  },
  seconds: 24 * 60 * 60,
  bumpkinLevel: { ascension: 0, level: 13 },
};

const LAND_11_REQUIREMENTS: Requirements = {
  resources: {
    Gold: 10,
    Gem: 1 * LAND_GEM_RATIO,
  },
  seconds: 24 * 60 * 60,
  bumpkinLevel: { ascension: 0, level: 15 },
};

const LAND_12_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 500,
    Stone: 20,
    Gold: 2,
    Gem: 1 * LAND_GEM_RATIO,
  },
  seconds: 24 * 60 * 60,
  bumpkinLevel: { ascension: 0, level: 17 },
};

const LAND_13_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 100,
    Stone: 150,
    Gold: 5,
    Gem: 1 * LAND_GEM_RATIO,
  },
  seconds: 24 * 60 * 60,
  bumpkinLevel: { ascension: 0, level: 20 },
};

const LAND_14_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 40,
    Stone: 30,
    Iron: 10,
    Gold: 10,
    Gem: 1 * LAND_GEM_RATIO,
  },
  seconds: 36 * 60 * 60,
  bumpkinLevel: { ascension: 0, level: 23 },
};

const LAND_15_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 200,
    Gold: 15,
    Gem: 1 * LAND_GEM_RATIO,
  },
  seconds: 36 * 60 * 60,
  bumpkinLevel: { ascension: 0, level: 26 },
};

const LAND_16_REQUIREMENTS: Requirements = {
  resources: {
    Stone: 150,
    Iron: 30,
    Gold: 10,
    Gem: 1 * LAND_GEM_RATIO,
  },
  seconds: 36 * 60 * 60,
  bumpkinLevel: { ascension: 0, level: 30 },
};

const LAND_17_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 200,
    Stone: 50,
    Gold: 25,
    Gem: 1 * LAND_GEM_RATIO,
  },
  seconds: 36 * 60 * 60,
  bumpkinLevel: { ascension: 0, level: 34 },
};

const LAND_18_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 300,
    Stone: 200,
    Iron: 30,
    Gold: 10,
    Gem: 1 * LAND_GEM_RATIO,
  },
  seconds: 36 * 60 * 60,
  bumpkinLevel: { ascension: 0, level: 37 },
};

const LAND_19_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 100,
    Stone: 250,
    Gold: 30,
    Gem: 1 * LAND_GEM_RATIO,
  },
  seconds: 48 * 60 * 60,
  bumpkinLevel: { ascension: 0, level: 40 },
};

const LAND_20_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 1000,
    Stone: 100,
    Iron: 10,
    Gold: 25,
    Gem: 1 * LAND_GEM_RATIO,
  },
  seconds: 48 * 60 * 60,
  bumpkinLevel: { ascension: 0, level: 45 },
};

const LAND_21_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 1500,
    Stone: 100,
    Iron: 20,
    Gold: 25,
    Gem: 2 * LAND_GEM_RATIO,
  },
  seconds: 48 * 60 * 60,
  bumpkinLevel: { ascension: 0, level: 50 },
};
const LAND_22_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 2000,
    Stone: 200,
    Iron: 20,
    Gold: 40,
    Gem: 2 * LAND_GEM_RATIO,
  },
  seconds: 48 * 60 * 60,
  bumpkinLevel: { ascension: 0, level: 55 },
};
const LAND_23_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 2000,
    Stone: 250,
    Iron: 50,
    Gold: 60,
    Gem: 2 * LAND_GEM_RATIO,
  },
  seconds: 48 * 60 * 60,
  bumpkinLevel: { ascension: 0, level: 60 },
};

const SPRING_LAND_5_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 20,
  },
  coins: 100,
  seconds: 60,
  bumpkinLevel: { ascension: 0, level: 11 },
};

const SPRING_LAND_6_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 10,
    Stone: 5,
    Gold: 2,
  },
  coins: 200,
  seconds: 5 * 60,
  bumpkinLevel: { ascension: 0, level: 13 },
};

const SPRING_LAND_7_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 30,
    Stone: 20,
    Iron: 5,
    Gem: 1 * LAND_GEM_RATIO,
  },
  coins: 300,
  seconds: 30 * 60,
  bumpkinLevel: { ascension: 0, level: 16 },
};

const SPRING_LAND_8_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 20,
    Crimstone: 1,
    Gem: 1 * LAND_GEM_RATIO,
  },
  coins: 400,
  seconds: 2 * 60 * 60,
  bumpkinLevel: { ascension: 0, level: 20 },
};

const SPRING_LAND_9_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 50,
    Gold: 5,
    Gem: 1 * LAND_GEM_RATIO,
  },
  coins: 500,
  seconds: 2 * 60 * 60,
  bumpkinLevel: { ascension: 0, level: 23 },
};

const SPRING_LAND_10_REQUIREMENTS: Requirements = {
  resources: {
    Stone: 10,
    Crimstone: 3,
    Gem: 1 * LAND_GEM_RATIO,
  },
  coins: 500,
  seconds: 4 * 60 * 60,
  bumpkinLevel: { ascension: 0, level: 25 },
};

const SPRING_LAND_11_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 100,
    Stone: 25,
    Gold: 5,
    Crimstone: 1,
    Gem: 1 * LAND_GEM_RATIO,
  },
  coins: 500,
  seconds: 8 * 60 * 60,
  bumpkinLevel: { ascension: 0, level: 27 },
};

const SPRING_LAND_12_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 50,
    Iron: 5,
    Crimstone: 3,
    Gem: 2 * LAND_GEM_RATIO,
  },
  coins: 500,
  seconds: 12 * 60 * 60,
  bumpkinLevel: { ascension: 0, level: 29 },
};

const SPRING_LAND_13_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 50,
    Stone: 25,
    Iron: 10,
    Gold: 10,
    Gem: 2 * LAND_GEM_RATIO,
  },
  coins: 500,
  seconds: 12 * 60 * 60,
  bumpkinLevel: { ascension: 0, level: 32 },
};

const SPRING_LAND_14_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 100,
    Stone: 10,
    Crimstone: 5,
    Gem: 2 * LAND_GEM_RATIO,
  },
  coins: 500,
  seconds: 24 * 60 * 60,
  bumpkinLevel: { ascension: 0, level: 36 },
};

const SPRING_LAND_15_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 150,
    Stone: 10,
    Iron: 10,
    Gold: 5,
    Crimstone: 5,
    Gem: 2 * LAND_GEM_RATIO,
  },
  coins: 500,
  seconds: 24 * 60 * 60,
  bumpkinLevel: { ascension: 0, level: 40 },
};

const SPRING_LAND_16_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 100,
    Stone: 10,
    Gold: 5,
    Crimstone: 8,
    Gem: 2 * LAND_GEM_RATIO,
  },
  coins: 500,
  seconds: 24 * 60 * 60,
  bumpkinLevel: { ascension: 0, level: 43 },
};

const SPRING_LAND_17_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 100,
    Stone: 20,
    Iron: 10,
    Gold: 5,
    Crimstone: 12,
    Gem: 2 * LAND_GEM_RATIO,
  },
  coins: 500,
  seconds: 36 * 60 * 60,
  bumpkinLevel: { ascension: 0, level: 47 },
};

const SPRING_LAND_18_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 150,
    Stone: 20,
    Iron: 10,
    Gold: 5,
    Crimstone: 16,
    Gem: 2 * LAND_GEM_RATIO,
  },
  coins: 500,
  seconds: 36 * 60 * 60,
  bumpkinLevel: { ascension: 0, level: 51 },
};

const SPRING_LAND_19_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 150,
    Stone: 10,
    Iron: 5,
    Gold: 5,
    Crimstone: 20,
    Gem: 2 * LAND_GEM_RATIO,
  },
  coins: 500,
  seconds: 36 * 60 * 60,
  bumpkinLevel: { ascension: 0, level: 53 },
};

const SPRING_LAND_20_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 50,
    Stone: 5,
    Iron: 5,
    Gold: 5,
    Crimstone: 24,
    Gem: 2 * LAND_GEM_RATIO,
  },
  coins: 500,
  seconds: 48 * 60 * 60,
  bumpkinLevel: { ascension: 0, level: 55 },
};

const DESERT_LAND_5_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 50,
    Stone: 10,
    Iron: 5,
    Gold: 5,
  },
  sfl: 0,
  coins: 500,
  seconds: 60,
  bumpkinLevel: { ascension: 0, level: 40 },
};

const DESERT_LAND_6_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 100,
    Stone: 20,
    Iron: 10,
    Gold: 5,
  },
  sfl: 0,
  coins: 500,
  seconds: 60 * 5,
  bumpkinLevel: { ascension: 0, level: 40 },
};

const DESERT_LAND_7_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 150,
    Stone: 20,
    Iron: 10,
    Gold: 5,
    Gem: 1 * LAND_GEM_RATIO,
  },
  sfl: 0,
  coins: 500,
  seconds: 30 * 60,
  bumpkinLevel: { ascension: 0, level: 41 },
};

const DESERT_LAND_8_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 150,
    Stone: 10,
    Iron: 5,
    Gold: 5,
    Crimstone: 3,
    Oil: 5,
    Gem: 2 * LAND_GEM_RATIO,
  },
  sfl: 0,
  coins: 500,
  seconds: 2 * 60 * 60,
  bumpkinLevel: { ascension: 0, level: 42 },
};

const DESERT_LAND_9_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 50,
    Stone: 5,
    Iron: 5,
    Gold: 5,
    Crimstone: 6,
    Oil: 5,
    Gem: 2 * LAND_GEM_RATIO,
  },
  sfl: 0,
  coins: 500,
  seconds: 2 * 60 * 60,
  bumpkinLevel: { ascension: 0, level: 43 },
};

const DESERT_LAND_10_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 100,
    Stone: 50,
    Iron: 10,
    Gold: 5,
    Crimstone: 12,
    Oil: 10,
    Gem: 3 * LAND_GEM_RATIO,
  },
  sfl: 0,
  coins: 384,
  seconds: 8 * 60 * 60,
  bumpkinLevel: { ascension: 0, level: 44 },
};

const DESERT_LAND_11_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 150,
    Stone: 75,
    Iron: 10,
    Gold: 5,
    Crimstone: 15,
    Oil: 30,
    Gem: 3 * LAND_GEM_RATIO,
  },
  sfl: 0,
  coins: 768,
  seconds: 12 * 60 * 60,
  bumpkinLevel: { ascension: 0, level: 45 },
};

const DESERT_LAND_12_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 100,
    Stone: 100,
    Iron: 5,
    Gold: 10,
    Crimstone: 18,
    Oil: 30,
    Gem: 3 * LAND_GEM_RATIO,
  },
  sfl: 0,
  coins: 1536,
  seconds: 12 * 60 * 60,
  bumpkinLevel: { ascension: 0, level: 47 },
};

const DESERT_LAND_13_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 200,
    Stone: 50,
    Iron: 15,
    Gold: 10,
    Crimstone: 21,
    Oil: 40,
    Gem: 3 * LAND_GEM_RATIO,
  },
  sfl: 0,
  coins: 3072,
  seconds: 24 * 60 * 60,
  bumpkinLevel: { ascension: 0, level: 50 },
};

const DESERT_LAND_14_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 200,
    Stone: 100,
    Iron: 15,
    Gold: 10,
    Crimstone: 24,
    Oil: 50,
    Gem: 3 * LAND_GEM_RATIO,
  },
  sfl: 0,
  coins: 3840,
  seconds: 24 * 60 * 60,
  bumpkinLevel: { ascension: 0, level: 53 },
};

const DESERT_LAND_15_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 300,
    Stone: 50,
    Iron: 20,
    Gold: 10,
    Crimstone: 27,
    Oil: 75,
    Gem: 3 * LAND_GEM_RATIO,
  },
  sfl: 0,
  coins: 3840,
  seconds: 24 * 60 * 60,
  bumpkinLevel: { ascension: 0, level: 56 },
};

const DESERT_LAND_16_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 250,
    Stone: 125,
    Iron: 15,
    Gold: 15,
    Crimstone: 30,
    Oil: 100,
    Gem: 4 * LAND_GEM_RATIO,
  },
  sfl: 0,
  coins: 3840,
  seconds: 36 * 60 * 60,
  bumpkinLevel: { ascension: 0, level: 58 },
};

const DESERT_LAND_17_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 350,
    Stone: 75,
    Iron: 20,
    Gold: 10,
    Crimstone: 33,
    Oil: 125,
    Gem: 4 * LAND_GEM_RATIO,
  },
  sfl: 0,
  coins: 5760,
  seconds: 36 * 60 * 60,
  bumpkinLevel: { ascension: 0, level: 60 },
};

const DESERT_LAND_18_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 400,
    Stone: 125,
    Iron: 25,
    Gold: 15,
    Crimstone: 36,
    Oil: 150,
    Gem: 5 * LAND_GEM_RATIO,
  },
  sfl: 0,
  coins: 5760,
  seconds: 36 * 60 * 60,
  bumpkinLevel: { ascension: 0, level: 63 },
};

const DESERT_LAND_19_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 450,
    Stone: 150,
    Iron: 30,
    Gold: 20,
    Crimstone: 39,
    Oil: 200,
    Gem: 4 * LAND_GEM_RATIO,
  },
  sfl: 0,
  coins: 7680,
  seconds: 36 * 60 * 60,
  bumpkinLevel: { ascension: 0, level: 65 },
};

const DESERT_LAND_20_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 525,
    Stone: 200,
    Iron: 35,
    Gold: 30,
    Crimstone: 42,
    Oil: 250,
    Gem: 4 * LAND_GEM_RATIO,
  },
  sfl: 0,
  coins: 7680,
  seconds: 48 * 60 * 60,
  bumpkinLevel: { ascension: 0, level: 68 },
};

const DESERT_LAND_21_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 550,
    Stone: 150,
    Iron: 30,
    Gold: 25,
    Crimstone: 45,
    Oil: 350,
    Gem: 4 * LAND_GEM_RATIO,
  },
  sfl: 0,
  coins: 9600,
  seconds: 48 * 60 * 60,
  bumpkinLevel: { ascension: 0, level: 70 },
};

const DESERT_LAND_22_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 600,
    Stone: 200,
    Iron: 35,
    Gold: 30,
    Crimstone: 48,
    Oil: 450,
    Gem: 5 * LAND_GEM_RATIO,
  },
  sfl: 0,
  coins: 9600,
  seconds: 48 * 60 * 60,
  bumpkinLevel: { ascension: 0, level: 72 },
};

const DESERT_LAND_23_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 650,
    Stone: 250,
    Iron: 40,
    Gold: 35,
    Crimstone: 51,
    Oil: 500,
    Gem: 5 * LAND_GEM_RATIO,
  },
  sfl: 0,
  coins: 9600,
  seconds: 60 * 60 * 60,
  bumpkinLevel: { ascension: 0, level: 73 },
};

const DESERT_LAND_24_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 700,
    Stone: 300,
    Iron: 50,
    Gold: 45,
    Crimstone: 54,
    Oil: 550,
    Gem: 5 * LAND_GEM_RATIO,
  },
  sfl: 0,
  coins: 11520,
  seconds: 60 * 60 * 60,
  bumpkinLevel: { ascension: 0, level: 74 },
};

const DESERT_LAND_25_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 750,
    Stone: 350,
    Iron: 50,
    Gold: 50,
    Crimstone: 60,
    Oil: 650,
    Gem: 5 * LAND_GEM_RATIO,
  },
  sfl: 0,
  coins: 13440,
  seconds: 60 * 60 * 60,
  bumpkinLevel: { ascension: 0, level: 75 },
};

const VOLCANO_LAND_6_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 100,
    Stone: 50,
    Iron: 30,
    Gold: 10,
  },
  sfl: 0,
  coins: 500,
  seconds: 10, // 10 seconds
  bumpkinLevel: { ascension: 0, level: 70 },
};

const VOLCANO_LAND_7_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 200,
    Stone: 75,
    Iron: 25,
    Gold: 15,
    Crimstone: 4,
    Oil: 30,
    Gem: LAND_GEM_RATIO * 2,
  },
  sfl: 0,
  coins: 384,
  seconds: 5 * 60, // 5 minutes
  bumpkinLevel: { ascension: 0, level: 72 },
};

const VOLCANO_LAND_8_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 300,
    Stone: 100,
    Iron: 40,
    Gold: 20,
    Crimstone: 8,
    Oil: 60,
    Gem: LAND_GEM_RATIO * 2,
  },
  sfl: 0,
  coins: 768,
  seconds: 0.5 * 60 * 60, // 30 minutes
  bumpkinLevel: { ascension: 0, level: 74 },
};

const VOLCANO_LAND_9_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 400,
    Stone: 150,
    Iron: 35,
    Gold: 25,
    Crimstone: 12,
    Oil: 90,
    Gem: LAND_GEM_RATIO * 4,
  },
  sfl: 0,
  coins: 1152,
  seconds: 1 * 60 * 60, // 1 hour
  bumpkinLevel: { ascension: 0, level: 76 },
};

const VOLCANO_LAND_10_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 450,
    Stone: 200,
    Iron: 30,
    Gold: 20,
    Crimstone: 16,
    Oil: 120,
    Obsidian: 1,
    Gem: LAND_GEM_RATIO * 4,
  },
  sfl: 0,
  coins: 1920,
  seconds: 2 * 60 * 60, // 2 hours
  bumpkinLevel: { ascension: 0, level: 78 },
};

const VOLCANO_LAND_11_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 500,
    Stone: 175,
    Iron: 30,
    Gold: 30,
    Crimstone: 20,
    Oil: 100,
    Gem: LAND_GEM_RATIO * 6,
  },
  sfl: 0,
  coins: 3000,
  seconds: 4 * 60 * 60, // 4 hours
  bumpkinLevel: { ascension: 0, level: 80 },
};

const VOLCANO_LAND_12_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 650,
    Stone: 225,
    Iron: 25,
    Gold: 25,
    Crimstone: 24,
    Oil: 100,
    Obsidian: 2,
    Gem: LAND_GEM_RATIO * 10,
  },
  sfl: 0,
  coins: 3840,
  seconds: 8 * 60 * 60, // 8 hours
  bumpkinLevel: { ascension: 0, level: 82 },
};

const VOLCANO_LAND_13_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 550,
    Stone: 200,
    Iron: 40,
    Gold: 30,
    Crimstone: 28,
    Oil: 100,
    Gem: LAND_GEM_RATIO * 10,
  },
  sfl: 0,
  coins: 4800,
  seconds: 12 * 60 * 60, // 12 hours
  bumpkinLevel: { ascension: 0, level: 84 },
};

const VOLCANO_LAND_14_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 700,
    Stone: 250,
    Iron: 35,
    Gold: 35,
    Crimstone: 32,
    Oil: 100,
    Obsidian: 1,
    Gem: LAND_GEM_RATIO * 10,
  },
  sfl: 0,
  coins: 5760,
  seconds: 12 * 60 * 60, // 12 hours
  bumpkinLevel: { ascension: 0, level: 86 },
};

const VOLCANO_LAND_15_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 650,
    Stone: 200,
    Iron: 30,
    Gold: 40,
    Crimstone: 36,
    Oil: 200,
    Obsidian: 2,
    Gem: LAND_GEM_RATIO * 10,
  },
  sfl: 0,
  coins: 6720,
  seconds: 24 * 60 * 60, // 24 hours
  bumpkinLevel: { ascension: 0, level: 88 },
};

const VOLCANO_LAND_16_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 750,
    Stone: 250,
    Iron: 40,
    Gold: 30,
    Crimstone: 40,
    Oil: 200,
    Obsidian: 4,
    Gem: LAND_GEM_RATIO * 10,
  },
  sfl: 0,
  coins: 7680,
  seconds: 24 * 60 * 60, // 24 hours
  bumpkinLevel: { ascension: 0, level: 90 },
};

const VOLCANO_LAND_17_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 700,
    Stone: 200,
    Iron: 35,
    Gold: 35,
    Crimstone: 44,
    Oil: 200,
    Obsidian: 4,
    Gem: LAND_GEM_RATIO * 10,
  },
  sfl: 0,
  coins: 9600,
  seconds: 24 * 60 * 60, // 24 hours
  bumpkinLevel: { ascension: 0, level: 92 },
};

const VOLCANO_LAND_18_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 800,
    Stone: 300,
    Iron: 45,
    Gold: 45,
    Crimstone: 48,
    Oil: 200,
    Obsidian: 6,
    Gem: LAND_GEM_RATIO * 12,
  },
  sfl: 0,
  coins: 12000,
  seconds: 36 * 60 * 60, // 36 hours
  bumpkinLevel: { ascension: 0, level: 94 },
};

const VOLCANO_LAND_19_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 750,
    Stone: 250,
    Iron: 40,
    Gold: 40,
    Crimstone: 52,
    Oil: 200,
    Obsidian: 6,
    Gem: LAND_GEM_RATIO * 12,
  },
  sfl: 0,
  coins: 15360,
  seconds: 36 * 60 * 60, // 36 hours
  bumpkinLevel: { ascension: 0, level: 96 },
};

const VOLCANO_LAND_20_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 850,
    Stone: 300,
    Iron: 45,
    Gold: 30,
    Crimstone: 56,
    Oil: 200,
    Obsidian: 8,
    Gem: LAND_GEM_RATIO * 12,
  },
  sfl: 0,
  coins: 18000,
  seconds: 48 * 60 * 60, // 48 hours
  bumpkinLevel: { ascension: 0, level: 98 },
};

const VOLCANO_LAND_21_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 900,
    Stone: 325,
    Iron: 50,
    Gold: 35,
    Crimstone: 60,
    Oil: 200,
    Obsidian: 8,
    Gem: LAND_GEM_RATIO * 12,
  },
  sfl: 0,
  coins: 21600,
  seconds: 48 * 60 * 60, // 48 hours
  bumpkinLevel: { ascension: 0, level: 100 },
};

const VOLCANO_LAND_22_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 800,
    Stone: 300,
    Iron: 45,
    Gold: 30,
    Crimstone: 64,
    Oil: 200,
    Obsidian: 10,
    Gem: LAND_GEM_RATIO * 12,
  },
  sfl: 0,
  coins: 25200,
  seconds: 48 * 60 * 60, // 48 hours
  bumpkinLevel: { ascension: 0, level: 102 },
};

const VOLCANO_LAND_23_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 950,
    Stone: 350,
    Iron: 50,
    Gold: 35,
    Crimstone: 68,
    Oil: 200,
    Obsidian: 10,
    Gem: LAND_GEM_RATIO * 12,
  },
  sfl: 0,
  coins: 30000,
  seconds: 48 * 60 * 60, // 48 hours
  bumpkinLevel: { ascension: 0, level: 104 },
};

const VOLCANO_LAND_24_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 1000,
    Stone: 400,
    Iron: 55,
    Gold: 40,
    Crimstone: 72,
    Oil: 300,
    Obsidian: 12,
    Gem: LAND_GEM_RATIO * 12,
  },
  sfl: 0,
  coins: 33600,
  seconds: 48 * 60 * 60, // 48 hours
  bumpkinLevel: { ascension: 0, level: 106 },
};

const VOLCANO_LAND_25_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 1100,
    Stone: 450,
    Iron: 60,
    Gold: 35,
    Crimstone: 80,
    Oil: 300,
    Obsidian: 12,
    Gem: LAND_GEM_RATIO * 12,
  },
  sfl: 0,
  coins: 38400,
  seconds: 60 * 60 * 60, // 60 hours
  bumpkinLevel: { ascension: 0, level: 108 },
};

const VOLCANO_LAND_26_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 1200,
    Stone: 350,
    Iron: 65,
    Gold: 30,
    Crimstone: 85,
    Oil: 300,
    Obsidian: 18,
    Gem: LAND_GEM_RATIO * 12,
  },
  sfl: 0,
  coins: 42000,
  seconds: 60 * 60 * 60, // 60 hours
  bumpkinLevel: { ascension: 0, level: 110 },
};

const VOLCANO_LAND_27_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 1250,
    Stone: 450,
    Iron: 70,
    Gold: 40,
    Crimstone: 95,
    Oil: 300,
    Obsidian: 24,
    Gem: LAND_GEM_RATIO * 15,
  },
  sfl: 0,
  coins: 45600,
  seconds: 60 * 60 * 60, // 60 hours
  bumpkinLevel: { ascension: 0, level: 112 },
};

const VOLCANO_LAND_28_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 1150,
    Stone: 500,
    Iron: 60,
    Gold: 45,
    Crimstone: 100,
    Oil: 300,
    Obsidian: 30,
    Gem: LAND_GEM_RATIO * 15,
  },
  sfl: 0,
  coins: 50400,
  seconds: 60 * 60 * 60, // 60 hours
  bumpkinLevel: { ascension: 0, level: 114 },
};

const VOLCANO_LAND_29_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 1350,
    Stone: 550,
    Iron: 65,
    Gold: 40,
    Crimstone: 105,
    Oil: 300,
    Obsidian: 36,
    Gem: LAND_GEM_RATIO * 15,
  },
  sfl: 0,
  coins: 54000,
  seconds: 72 * 60 * 60, // 72 hours
  bumpkinLevel: { ascension: 0, level: 116 },
};

const VOLCANO_LAND_30_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 1500,
    Stone: 600,
    Iron: 70,
    Gold: 50,
    Crimstone: 125,
    Oil: 300,
    Obsidian: 42,
    Gem: LAND_GEM_RATIO * 15,
  },
  sfl: 0,
  coins: 60000,
  seconds: 72 * 60 * 60, // 72 hours
  bumpkinLevel: { ascension: 0, level: 120 },
};

// Only the static, hand-authored islands live here. Ascension islands (swamp
// onward) are formula-driven and ascension-dependent — read them via
// `getExpansionRequirements` / `getAscensionExpansionRequirements` instead.
export const EXPANSION_REQUIREMENTS: Record<
  BasicIslandType,
  Record<number, Requirements>
> = {
  basic: {
    4: LAND_4_REQUIREMENTS,
    5: LAND_5_REQUIREMENTS,
    6: LAND_6_REQUIREMENTS,
    7: LAND_7_REQUIREMENTS,
    8: LAND_8_REQUIREMENTS,
    9: LAND_9_REQUIREMENTS,
    // LEGACY - used for refunding expansions - do not remove
    10: LAND_10_REQUIREMENTS,
    11: LAND_11_REQUIREMENTS,
    12: LAND_12_REQUIREMENTS,
    13: LAND_13_REQUIREMENTS,
    14: LAND_14_REQUIREMENTS,
    15: LAND_15_REQUIREMENTS,
    16: LAND_16_REQUIREMENTS,
    17: LAND_17_REQUIREMENTS,
    18: LAND_18_REQUIREMENTS,
    19: LAND_19_REQUIREMENTS,
    20: LAND_20_REQUIREMENTS,
    21: LAND_21_REQUIREMENTS,
    22: LAND_22_REQUIREMENTS,
    23: LAND_23_REQUIREMENTS,
  },
  spring: {
    5: SPRING_LAND_5_REQUIREMENTS,
    6: SPRING_LAND_6_REQUIREMENTS,
    7: SPRING_LAND_7_REQUIREMENTS,
    8: SPRING_LAND_8_REQUIREMENTS,
    9: SPRING_LAND_9_REQUIREMENTS,
    10: SPRING_LAND_10_REQUIREMENTS,
    11: SPRING_LAND_11_REQUIREMENTS,
    12: SPRING_LAND_12_REQUIREMENTS,
    13: SPRING_LAND_13_REQUIREMENTS,
    14: SPRING_LAND_14_REQUIREMENTS,
    15: SPRING_LAND_15_REQUIREMENTS,
    16: SPRING_LAND_16_REQUIREMENTS,
    17: SPRING_LAND_17_REQUIREMENTS,
    18: SPRING_LAND_18_REQUIREMENTS,
    19: SPRING_LAND_19_REQUIREMENTS,
    20: SPRING_LAND_20_REQUIREMENTS,
  },
  desert: {
    5: DESERT_LAND_5_REQUIREMENTS,
    6: DESERT_LAND_6_REQUIREMENTS,
    7: DESERT_LAND_7_REQUIREMENTS,
    8: DESERT_LAND_8_REQUIREMENTS,
    9: DESERT_LAND_9_REQUIREMENTS,
    10: DESERT_LAND_10_REQUIREMENTS,
    11: DESERT_LAND_11_REQUIREMENTS,
    12: DESERT_LAND_12_REQUIREMENTS,
    13: DESERT_LAND_13_REQUIREMENTS,
    14: DESERT_LAND_14_REQUIREMENTS,
    15: DESERT_LAND_15_REQUIREMENTS,
    16: DESERT_LAND_16_REQUIREMENTS,
    17: DESERT_LAND_17_REQUIREMENTS,
    18: DESERT_LAND_18_REQUIREMENTS,
    19: DESERT_LAND_19_REQUIREMENTS,
    20: DESERT_LAND_20_REQUIREMENTS,
    21: DESERT_LAND_21_REQUIREMENTS,
    22: DESERT_LAND_22_REQUIREMENTS,
    23: DESERT_LAND_23_REQUIREMENTS,
    24: DESERT_LAND_24_REQUIREMENTS,
    25: DESERT_LAND_25_REQUIREMENTS,
  },
  volcano: {
    6: VOLCANO_LAND_6_REQUIREMENTS,
    7: VOLCANO_LAND_7_REQUIREMENTS,
    8: VOLCANO_LAND_8_REQUIREMENTS,
    9: VOLCANO_LAND_9_REQUIREMENTS,
    10: VOLCANO_LAND_10_REQUIREMENTS,
    11: VOLCANO_LAND_11_REQUIREMENTS,
    12: VOLCANO_LAND_12_REQUIREMENTS,
    13: VOLCANO_LAND_13_REQUIREMENTS,
    14: VOLCANO_LAND_14_REQUIREMENTS,
    15: VOLCANO_LAND_15_REQUIREMENTS,
    16: VOLCANO_LAND_16_REQUIREMENTS,
    17: VOLCANO_LAND_17_REQUIREMENTS,
    18: VOLCANO_LAND_18_REQUIREMENTS,
    19: VOLCANO_LAND_19_REQUIREMENTS,
    20: VOLCANO_LAND_20_REQUIREMENTS,
    21: VOLCANO_LAND_21_REQUIREMENTS,
    22: VOLCANO_LAND_22_REQUIREMENTS,
    23: VOLCANO_LAND_23_REQUIREMENTS,
    24: VOLCANO_LAND_24_REQUIREMENTS,
    25: VOLCANO_LAND_25_REQUIREMENTS,
    26: VOLCANO_LAND_26_REQUIREMENTS,
    27: VOLCANO_LAND_27_REQUIREMENTS,
    28: VOLCANO_LAND_28_REQUIREMENTS,
    29: VOLCANO_LAND_29_REQUIREMENTS,
    30: VOLCANO_LAND_30_REQUIREMENTS,
  },
};

/**
 * The single source of truth for a given expansion's requirements. Ascension
 * islands (swamp onward) are computed from the formula and depend on the
 * ascension level; the static islands use the table. Always read through here
 * rather than indexing `EXPANSION_REQUIREMENTS` directly.
 */
export const getExpansionRequirements = ({
  island,
  expansion,
  ascensionLevel,
}: {
  island: IslandType;
  expansion: number;
  ascensionLevel?: number;
}): Requirements | undefined =>
  (ascensionLevel ?? 0) > 0
    ? getAscensionExpansionRequirements({
        expansion,
        ascensionLevel: ascensionLevel ?? 0,
      })
    : EXPANSION_REQUIREMENTS[island as BasicIslandType][expansion];
