import {
  EXPANSION_REQUIREMENTS,
  Land,
} from "features/game/expansion/lib/expansionRequirements";
import { BumpkinLevel } from "features/game/lib/level";
import { IslandType } from "features/game/types/game";

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
}

export function getBumpkinLevelRequiredForNode(
  index: number,
  nodeType: string
): BumpkinLevel {
  const key = nodeType as keyof Nodes;

  for (let expansions = 4; expansions <= 23; ++expansions) {
    if (TOTAL_EXPANSION_NODES.basic[expansions as Land][key] > index)
      return EXPANSION_REQUIREMENTS[(expansions - 1) as Land]
        .bumpkinLevel as BumpkinLevel;
  }

  return 50 as BumpkinLevel;
}

export function getEnabledNodeCount(
  bumpkinLevel: BumpkinLevel,
  nodeType: string
): number {
  const key = nodeType as keyof Nodes;

  for (let expansions = 4; expansions <= 23; ++expansions) {
    if (EXPANSION_REQUIREMENTS[expansions as Land].bumpkinLevel > bumpkinLevel)
      return TOTAL_EXPANSION_NODES.basic[expansions as Land][key];
  }

  return 0;
}

type ExpansionNode = Record<IslandType, Record<number, Nodes>>;

export const TOTAL_EXPANSION_NODES: ExpansionNode = {
  basic: {
    3: {
      "Crop Plot": 13,
      Tree: 3,
      "Stone Rock": 2,
      "Iron Rock": 2,
      "Gold Rock": 1,
      "Crimstone Rock": 0,
      "Sunstone Rock": 0,
      "Fruit Patch": 0,
      "Flower Bed": 0,
      Beehive: 0,
    },
    4: {
      "Crop Plot": 17,
      Tree: 4,
      "Stone Rock": 3,
      "Iron Rock": 3,
      "Gold Rock": 1,
      "Crimstone Rock": 0,
      "Sunstone Rock": 0,
      "Fruit Patch": 0,
      "Flower Bed": 0,
      Beehive: 0,
    },
    5: {
      "Crop Plot": 21,
      Tree: 5,
      "Stone Rock": 4,
      "Iron Rock": 4,
      "Gold Rock": 2,
      "Crimstone Rock": 0,
      "Sunstone Rock": 0,
      "Fruit Patch": 0,
      "Flower Bed": 0,
      Beehive: 0,
    },
    6: {
      "Crop Plot": 25,
      Tree: 6,
      "Stone Rock": 5,
      "Iron Rock": 4,
      "Gold Rock": 2,
      "Crimstone Rock": 0,
      "Sunstone Rock": 0,
      "Fruit Patch": 0,
      "Flower Bed": 0,
      Beehive: 0,
    },
    7: {
      "Crop Plot": 27,
      Tree: 7,
      "Stone Rock": 6,
      "Iron Rock": 4,
      "Gold Rock": 2,
      "Crimstone Rock": 0,
      "Sunstone Rock": 0,
      "Fruit Patch": 0,
      "Flower Bed": 0,
      Beehive: 0,
    },
    8: {
      "Crop Plot": 29,
      Tree: 8,
      "Stone Rock": 7,
      "Iron Rock": 3,
      "Gold Rock": 2,
      "Crimstone Rock": 0,
      "Sunstone Rock": 0,
      "Fruit Patch": 0,
      "Flower Bed": 0,
      Beehive: 0,
    },
    9: {
      "Crop Plot": 29,
      Tree: 8,
      "Stone Rock": 7,
      "Iron Rock": 4,
      "Gold Rock": 2,
      "Crimstone Rock": 0,
      "Sunstone Rock": 0,
      "Fruit Patch": 0,
      "Flower Bed": 0,
      Beehive: 0,
    },
  },
  spring: {
    4: {
      "Crop Plot": 31,
      "Fruit Patch": 2,
      Tree: 10,
      "Stone Rock": 8,
      "Iron Rock": 4,
      "Gold Rock": 2,
      "Crimstone Rock": 0,
      "Sunstone Rock": 0,
      Beehive: 0,
      "Flower Bed": 0,
    },
    5: {
      "Crop Plot": 33,
      "Fruit Patch": 3,
      Tree: 11,
      "Stone Rock": 9,
      "Iron Rock": 5,
      "Gold Rock": 3,
      "Crimstone Rock": 0,
      "Sunstone Rock": 0,
      Beehive: 0,
      "Flower Bed": 0,
    },
    6: {
      "Crop Plot": 33,
      "Fruit Patch": 4,
      Tree: 11,
      "Stone Rock": 10,
      "Iron Rock": 5,
      "Gold Rock": 3,
      "Crimstone Rock": 0,
      "Sunstone Rock": 0,
      Beehive: 1,
      "Flower Bed": 1,
    },
    7: {
      "Crop Plot": 35,
      "Fruit Patch": 4,
      Tree: 12,
      "Stone Rock": 11,
      "Iron Rock": 5,
      "Gold Rock": 3,
      "Crimstone Rock": 0,
      "Sunstone Rock": 0,
      Beehive: 1,
      "Flower Bed": 1,
    },
    8: {
      "Crop Plot": 37,
      "Fruit Patch": 5,
      Tree: 12,
      "Stone Rock": 12,
      "Iron Rock": 6,
      "Gold Rock": 4,
      "Crimstone Rock": 0,
      "Sunstone Rock": 0,
      Beehive: 1,
      "Flower Bed": 1,
    },
    9: {
      "Crop Plot": 37,
      "Fruit Patch": 6,
      Tree: 13,
      "Stone Rock": 12,
      "Iron Rock": 6,
      "Gold Rock": 4,
      "Crimstone Rock": 0,
      "Sunstone Rock": 0,
      Beehive: 1,
      "Flower Bed": 1,
    },
    10: {
      "Crop Plot": 37,
      "Fruit Patch": 7,
      Tree: 13,
      "Stone Rock": 12,
      "Iron Rock": 7,
      "Gold Rock": 5,
      "Crimstone Rock": 0,
      "Sunstone Rock": 0,
      Beehive: 2,
      "Flower Bed": 2,
    },
    11: {
      "Crop Plot": 39,
      "Fruit Patch": 8,
      Tree: 14,
      "Stone Rock": 13,
      "Iron Rock": 7,
      "Gold Rock": 5,
      "Crimstone Rock": 0,
      "Sunstone Rock": 0,
      Beehive: 2,
      "Flower Bed": 2,
    },
    12: {
      "Crop Plot": 41,
      "Fruit Patch": 8,
      Tree: 14,
      "Stone Rock": 13,
      "Iron Rock": 7,
      "Gold Rock": 5,
      "Crimstone Rock": 0,
      "Sunstone Rock": 0,
      Beehive: 2,
      "Flower Bed": 2,
    },
    13: {
      "Crop Plot": 41,
      "Fruit Patch": 9,
      Tree: 15,
      "Stone Rock": 14,
      "Iron Rock": 8,
      "Gold Rock": 5,
      "Crimstone Rock": 0,
      "Sunstone Rock": 0,
      Beehive: 2,
      "Flower Bed": 2,
    },
    14: {
      "Crop Plot": 43,
      "Fruit Patch": 10,
      Tree: 15,
      "Stone Rock": 14,
      "Iron Rock": 8,
      "Gold Rock": 5,
      "Crimstone Rock": 0,
      "Sunstone Rock": 0,
      Beehive: 2,
      "Flower Bed": 2,
    },
    15: {
      "Crop Plot": 44,
      "Fruit Patch": 11,
      Tree: 16,
      "Stone Rock": 15,
      "Iron Rock": 9,
      "Gold Rock": 5,
      "Crimstone Rock": 0,
      "Sunstone Rock": 0,
      Beehive: 2,
      "Flower Bed": 2,
    },
    16: {
      "Crop Plot": 45,
      "Fruit Patch": 11,
      Tree: 17,
      "Stone Rock": 15,
      "Iron Rock": 9,
      "Gold Rock": 6,
      "Crimstone Rock": 0,
      "Sunstone Rock": 0,
      Beehive: 3,
      "Flower Bed": 3,
    },
  },
  desert: {},
};
