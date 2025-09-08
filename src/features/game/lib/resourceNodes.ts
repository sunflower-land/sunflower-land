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
} from "../types/resources";

export const canGatherResource = (resource: ResourceItem) => {
  if ("stone" in resource) return canMine(resource as Rock, "Stone");
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
  ).filter(([_, node]) => {
    const tier = "tier" in node ? node.tier : 1;
    const isPlaced = "x" in node && "y" in node;
    return (
      isPlaced &&
      canGatherResource(node) &&
      tier === advancedResource.preRequires.tier
    );
  });
  return upgradeableNodes.sort();
};

export function canMine(
  rock: Rock,
  rockName: "Stone" | "Iron" | "Gold" | "Sunstone" | "Crimstone",
  now: number = Date.now(),
) {
  // Defining inside the function to avoid circular dependency
  const resourceRecoveryTime: Record<
    "Stone" | "Iron" | "Gold" | "Sunstone" | "Crimstone",
    number
  > = {
    Stone: STONE_RECOVERY_TIME,
    Iron: IRON_RECOVERY_TIME,
    Gold: GOLD_RECOVERY_TIME,
    Sunstone: SUNSTONE_RECOVERY_TIME,
    Crimstone: CRIMSTONE_RECOVERY_TIME,
  };

  const recoveryTime = resourceRecoveryTime[rockName];
  return now - rock.stone.minedAt >= recoveryTime * 1000;
}
