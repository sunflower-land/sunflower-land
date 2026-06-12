import {
  EXPANSION_REQUIREMENTS,
  type Land,
  BASIC_MAX_EXPANSION,
} from "features/game/expansion/lib/expansionRequirements";
import type { BumpkinLevel } from "features/game/lib/level";
import { TOTAL_EXPANSION_NODES } from "features/game/types/expansions";

export interface Nodes {
  "Crop Plot": number;
  Tree: number;
  "Stone Rock": number;
  "Iron Rock": number;
  "Gold Rock": number;
  "Crimstone Rock": number;
  "Sunstone Rock": number;
  "Fruit Patch": number;
  "Flower Bed": number;
  Beehive: number;
  "Oil Reserve": number;
  "Lava Pit": number;
}

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
): number {
  const key = nodeType as keyof Nodes;

  for (let expansions = 4; expansions <= BASIC_MAX_EXPANSION; ++expansions) {
    if (EXPANSION_REQUIREMENTS[expansions as Land].bumpkinLevel > bumpkinLevel)
      return TOTAL_EXPANSION_NODES.basic[expansions as Land][key];
  }

  return 0;
}
