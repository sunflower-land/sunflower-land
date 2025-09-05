import { canChop } from "../events/landExpansion/chop";
import { canMine } from "../events/landExpansion/stoneMine";
import { ResourceItem } from "../expansion/placeable/lib/collisionDetection";
import { Rock, Tree, GameState } from "../types/game";
import {
  UpgradedResourceName,
  ADVANCED_RESOURCES,
  RESOURCE_STATE_ACCESSORS,
} from "../types/resources";

export const canGatherResource = (resource: ResourceItem) => {
  if ("stone" in resource) return canMine(resource as Rock);
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
