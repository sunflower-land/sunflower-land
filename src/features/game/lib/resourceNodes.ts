import Decimal from "decimal.js-light";
import { canChop } from "../events/landExpansion/chop";
import {
  GOLD_RECOVERY_TIME,
  IRON_RECOVERY_TIME,
  CRIMSTONE_RECOVERY_TIME,
  STONE_RECOVERY_TIME,
  SUNSTONE_RECOVERY_TIME,
} from "features/game/lib/constants";
import { ResourceItem } from "../expansion/placeable/lib/collisionDetection";
import { Rock, Tree, GameState } from "../types/game";
import {
  UpgradedResourceName,
  ADVANCED_RESOURCES,
  RESOURCE_STATE_ACCESSORS,
  RockName,
  RESOURCES,
  UpgradeableResource,
  TreeName,
  BASIC_RESOURCES,
  BasicResourceName,
} from "../types/resources";

export const canGatherResource = (
  resource: ResourceItem,
  rockType?: RockName,
) => {
  if ("name" in resource && resource?.name && !(resource.name in RESOURCES)) {
    throw new Error(`Invalid resource name: ${resource.name}`);
  }

  if ("stone" in resource) {
    let rockName = resource.name as RockName;
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

    return canMine(resource as Rock, rockName);
  }

  if ("wood" in resource) return canChop(resource as Tree);

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
      canGatherResource(node, upgradeTo as RockName) &&
      tier === advancedResource.preRequires.tier
    );
  });
  return upgradeableNodes.sort();
};

export function canMine(
  rock: Rock,
  rockName: RockName,
  now: number = Date.now(),
) {
  // Defining inside the function to avoid circular dependency
  const resourceRecoveryTime: Record<RockName, number> = {
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
  };

  const recoveryTime = resourceRecoveryTime[rockName];
  return now - rock.stone.minedAt >= recoveryTime * 1000;
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
