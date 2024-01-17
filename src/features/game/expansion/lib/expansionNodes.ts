import {
  EXPANSION_REQUIREMENTS,
  Land,
} from "features/game/expansion/lib/expansionRequirements";
import { BumpkinLevel } from "features/game/lib/level";

export interface Nodes {
  "Crop Plot": number;
  Tree: number;
  "Stone Rock": number;
  "Iron Rock": number;
  "Gold Rock": number;
  "Crimstone Rock": number;
  "Sunstone Rock": number;
  "Fruit Patch": number;
}

// These represent the nodes received after the pack is complete.
// For simplicity (and generosity), only the expansion level at
// the beginning of the pack is required for the enforcement that
// uses this data structure.
const LAND_3_NODES: Nodes = {
  "Crop Plot": 29,
  Tree: 8,
  "Stone Rock": 7,
  "Iron Rock": 3,
  "Gold Rock": 2,
  "Fruit Patch": 0,
  "Crimstone Rock": 0,
  "Sunstone Rock": 0,
};
const LAND_9_NODES: Nodes = {
  "Crop Plot": 4,
  Tree: 3,
  "Stone Rock": 2,
  "Iron Rock": 2,
  "Gold Rock": 1,
  "Fruit Patch": 2,
  "Crimstone Rock": 0,
  "Sunstone Rock": 0,
};
const LAND_12_NODES: Nodes = {
  "Crop Plot": 4,
  Tree: 1,
  "Stone Rock": 3,
  "Iron Rock": 1,
  "Gold Rock": 1,
  "Fruit Patch": 3,
  "Crimstone Rock": 5,
  "Sunstone Rock": 0,
};
const LAND_15_NODES: Nodes = {
  "Crop Plot": 2,
  Tree: 2,
  "Stone Rock": 1,
  "Iron Rock": 1,
  "Gold Rock": 1,
  "Fruit Patch": 3,
  "Crimstone Rock": 0,
  "Sunstone Rock": 0,
};
const LAND_18_NODES: Nodes = {
  "Crop Plot": 4,
  Tree: 1,
  "Stone Rock": 1,
  "Iron Rock": 1,
  "Gold Rock": 0,
  "Fruit Patch": 2,
  "Crimstone Rock": 0,
  "Sunstone Rock": 0,
};
const LAND_21_NODES: Nodes = {
  "Crop Plot": 3,
  Tree: 2,
  "Stone Rock": 2,
  "Iron Rock": 2,
  "Gold Rock": 1,
  "Fruit Patch": 2,
  "Crimstone Rock": 0,
  "Sunstone Rock": 0,
};

const NO_ADDITIONAL_NODES: Nodes = {
  "Crop Plot": 0,
  Tree: 0,
  "Stone Rock": 0,
  "Iron Rock": 0,
  "Gold Rock": 0,
  "Fruit Patch": 0,
  "Crimstone Rock": 0,
  "Sunstone Rock": 0,
};

export const EXPANSION_NODES: Record<Land, Nodes> = {
  3: LAND_3_NODES,
  4: NO_ADDITIONAL_NODES,
  5: NO_ADDITIONAL_NODES,
  6: NO_ADDITIONAL_NODES,
  7: NO_ADDITIONAL_NODES,
  8: NO_ADDITIONAL_NODES,
  9: LAND_9_NODES,
  10: NO_ADDITIONAL_NODES,
  11: NO_ADDITIONAL_NODES,
  12: LAND_12_NODES,
  13: NO_ADDITIONAL_NODES,
  14: NO_ADDITIONAL_NODES,
  15: LAND_15_NODES,
  16: NO_ADDITIONAL_NODES,
  17: NO_ADDITIONAL_NODES,
  18: LAND_18_NODES,
  19: NO_ADDITIONAL_NODES,
  20: NO_ADDITIONAL_NODES,
  21: LAND_21_NODES,
  22: NO_ADDITIONAL_NODES,
  23: NO_ADDITIONAL_NODES,
};

export function getBumpkinLevelRequiredForNode(
  index: number,
  nodeType: string
): BumpkinLevel {
  const key = nodeType as keyof Nodes;

  let count = LAND_3_NODES[key];
  for (let expansions = 4; expansions <= 23; ++expansions) {
    if (count > index)
      return EXPANSION_REQUIREMENTS[(expansions - 1) as Land]
        .bumpkinLevel as BumpkinLevel;
    count += EXPANSION_NODES[expansions as Land][key];
  }

  return 65 as BumpkinLevel;
}

export function getEnabledNodeCount(
  bumpkinLevel: BumpkinLevel,
  nodeType: string
): number {
  const key = nodeType as keyof Nodes;

  let count = LAND_3_NODES[key];
  for (let expansions = 4; expansions <= 23; ++expansions) {
    if (EXPANSION_REQUIREMENTS[expansions as Land].bumpkinLevel > bumpkinLevel)
      break;
    count += EXPANSION_NODES[expansions as Land][key];
  }

  return count;
}
