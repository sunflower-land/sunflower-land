import { BASIC_MAX_EXPANSION } from "features/game/expansion/lib/expansionRequirements";
import type { BumpkinLevel } from "features/game/lib/level";
import {
  EXPANSION_REQUIREMENTS,
  TOTAL_EXPANSION_NODES,
} from "features/game/types/expansions";
import type { IslandType } from "features/game/types/game";
import type { ResourceName } from "features/game/types/resources";

export type Nodes = Record<
  Exclude<
    ResourceName,
    | "Ancient Tree"
    | "Sacred Tree"
    | "Refined Iron Rock"
    | "Tempered Iron Rock"
    | "Pure Gold Rock"
    | "Prime Gold Rock"
    | "Fused Stone Rock"
    | "Reinforced Stone Rock"
  >,
  number
>;

export function isNode(value: string): value is keyof Nodes {
  const nodeTypes: Array<keyof Nodes> = [
    "Crop Plot",
    "Tree",
    "Stone Rock",
    "Iron Rock",
    "Gold Rock",
    "Crimstone Rock",
    "Sunstone Rock",
    "Fruit Patch",
    "Flower Bed",
    "Beehive",
    "Oil Reserve",
    "Lava Pit",
  ];

  return nodeTypes.includes(value as keyof Nodes);
}

export function getEnabledNodeCount(
  bumpkinLevel: BumpkinLevel,
  nodeType: string,
  islandType: IslandType,
): number {
  const key = nodeType as keyof Nodes;

  for (let expansions = 4; expansions <= BASIC_MAX_EXPANSION; ++expansions) {
    if (
      EXPANSION_REQUIREMENTS[islandType][expansions].bumpkinLevel > bumpkinLevel
    )
      return TOTAL_EXPANSION_NODES.basic[expansions][key];
  }

  return 0;
}
