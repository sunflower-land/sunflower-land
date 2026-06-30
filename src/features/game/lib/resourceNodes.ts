import Decimal from "decimal.js-light";
import { canChop } from "../events/landExpansion/chop";
import {
  GOLD_RECOVERY_TIME,
  IRON_RECOVERY_TIME,
  CRIMSTONE_RECOVERY_TIME,
  STONE_RECOVERY_TIME,
  SUNSTONE_RECOVERY_TIME,
} from "features/game/lib/constants";
import { computeReadyAt, getMineBoostWindows } from "./boostWindows";
import type { ResourceItem } from "../expansion/placeable/lib/collisionDetection";
import type { Rock, Tree, GameState } from "../types/game";
import {
  type UpgradedResourceName,
  ADVANCED_RESOURCES,
  RESOURCE_STATE_ACCESSORS,
  type RockName,
  RESOURCES,
  type UpgradeableResource,
  type TreeName,
  BASIC_RESOURCES,
  type BasicResourceName,
} from "../types/resources";

export const canGatherResource = (
  resource: ResourceItem,
  game: GameState,
  rockType?: RockName,
) => {
  if ("name" in resource && resource?.name && !(resource.name in RESOURCES)) {
    throw new Error(`Invalid resource name: ${resource.name}`);
  }

  if ("stone" in resource) {
    // Prefer an explicit rockType when the node has no name — it covers the rocks
    // the Stone/Iron/Gold substring inference can't (Crimstone, Sunstone) as well
    // as tier-2/3 names. Fall back to inference only when neither is set.
    let rockName = (resource.name ?? rockType) as RockName;
    if (!rockName) {
      if (resource.name?.includes("Stone") || rockType?.includes("Stone")) {
        rockName = "Stone Rock";
      } else if (
        resource.name?.includes("Iron") ||
        rockType?.includes("Iron")
      ) {
        rockName = "Iron Rock";
      } else if (
        resource.name?.includes("Gold") ||
        rockType?.includes("Gold")
      ) {
        rockName = "Gold Rock";
      } else {
        throw new Error(`Invalid rock name: ${resource.name}`);
      }
    }

    return canMine(resource as Rock, rockName, game);
  }

  if ("wood" in resource) return canChop(resource as Tree, game);

  throw new Error("Invalid resource");
};

export const canUpgrade = (
  game: GameState,
  upgradeTo: UpgradedResourceName,
) => {
  const advancedResource = ADVANCED_RESOURCES[upgradeTo];
  const preRequires = advancedResource.preRequires;
  const upgradeableNodes = getUpgradeableNodes(game, upgradeTo);

  return upgradeableNodes.length >= preRequires.count;
};

export const getUpgradeableNodes = (
  game: GameState,
  upgradeTo: UpgradedResourceName,
) => {
  const advancedResource = ADVANCED_RESOURCES[upgradeTo];
  const upgradeableNodes = Object.entries(
    RESOURCE_STATE_ACCESSORS[upgradeTo](game),
  ).filter(([, node]) => {
    const tier = "tier" in node ? node.tier : 1;
    const isPlaced = node.x !== undefined && node.y !== undefined;
    return (
      isPlaced &&
      canGatherResource(node, game, upgradeTo as RockName) &&
      tier === advancedResource.preRequires.tier
    );
  });
  return upgradeableNodes.sort();
};

export const RESOURCE_RECOVERY_TIME: Record<RockName, number> = {
  "Stone Rock": STONE_RECOVERY_TIME,
  "Iron Rock": IRON_RECOVERY_TIME,
  "Gold Rock": GOLD_RECOVERY_TIME,
  "Sunstone Rock": SUNSTONE_RECOVERY_TIME,
  "Crimstone Rock": CRIMSTONE_RECOVERY_TIME,
  "Fused Stone Rock": STONE_RECOVERY_TIME,
  "Reinforced Stone Rock": STONE_RECOVERY_TIME,
  "Refined Iron Rock": IRON_RECOVERY_TIME,
  "Tempered Iron Rock": IRON_RECOVERY_TIME,
  "Pure Gold Rock": GOLD_RECOVERY_TIME,
  "Prime Gold Rock": GOLD_RECOVERY_TIME,
  "Ascension Crystal": 0,
};

/**
 * When a mined rock is ready to mine again, across both boost models. Rocks mined
 * under the speed-rate model (with `stone.baseDurationMs`) derive their ready time
 * live from the mine boost windows; legacy rocks use their back-dated `minedAt` +
 * base recovery time.
 *
 * `baseDurationMs` is a PERMANENT per-rock migration marker: the read path keys off
 * its presence, NOT the `SPEED_BOOSTS` flag (matching `getTreeReadyAt`). A rock
 * mined while the flag was on therefore keeps windowed timing even if the flag is
 * later disabled — windowed rocks store the real `minedAt` + a permanent-boost-only
 * `baseDurationMs`, so falling back to `minedAt + base recovery` would drop their
 * baked permanent-boost credit and wrongly lengthen recovery on rollback.
 */
export function getMineReadyAt(
  rock: Rock,
  rockName: RockName,
  game: GameState,
): number {
  const { baseDurationMs, minedAt } = rock.stone;

  if (baseDurationMs !== undefined) {
    return computeReadyAt({
      startedAt: minedAt,
      baseDurationMs,
      windows: getMineBoostWindows(game, rockName),
    });
  }

  return minedAt + RESOURCE_RECOVERY_TIME[rockName] * 1000;
}

export function canMine(
  rock: Rock,
  rockName: RockName,
  game: GameState,
  now: number = Date.now(),
) {
  return now > getMineReadyAt(rock, rockName, game);
}
export function getAvailableNodes(
  game: GameState,
  resourceFamily: "stones" | "iron" | "gold" | "trees",
) {
  const RESOURCE_FAMILIES: {
    stones: RockName[];
    iron: RockName[];
    gold: RockName[];
    trees: TreeName[];
  } = {
    stones: ["Stone Rock", "Fused Stone Rock", "Reinforced Stone Rock"],
    iron: ["Iron Rock", "Refined Iron Rock", "Tempered Iron Rock"],
    gold: ["Gold Rock", "Pure Gold Rock", "Prime Gold Rock"],
    trees: ["Tree", "Ancient Tree", "Sacred Tree"],
  };
  const resourceFamilyResources = RESOURCE_FAMILIES[resourceFamily];

  const placedNodes = Object.values(game[resourceFamily]).filter(
    (node) => node.x !== undefined && node.y !== undefined,
  ).length;

  let inventoryNodes = new Decimal(0);
  resourceFamilyResources.forEach((resource) => {
    const inventory = game.inventory[resource] || new Decimal(0);
    inventoryNodes = inventoryNodes.add(inventory);
  });

  return inventoryNodes.minus(placedNodes);
}

export const findExistingUnplacedNode = <T extends ResourceItem>({
  nodeToFind,
  nodeStateAccessor,
}: {
  nodeToFind: UpgradeableResource;
  nodeStateAccessor: Record<string, T>;
}): [string, T] | undefined => {
  const existingNode = Object.entries(nodeStateAccessor).find(([id, node]) => {
    const isPlaced = node.x !== undefined && node.y !== undefined;

    if (isPlaced) {
      return false;
    }

    const hasName = "name" in node;
    if (hasName) {
      return node.name === nodeToFind;
    }

    const isBaseResource =
      !hasName && BASIC_RESOURCES.includes(nodeToFind as BasicResourceName);

    return isBaseResource;
  });

  return existingNode;
};
