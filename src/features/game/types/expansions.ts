import { GameState, InventoryItemName } from "../types/game";
import { Coordinates } from "../expansion/components/MapPlacement";

export type ExpandLandAction = {
  type: "land.expanded";
};

type Options = {
  state: Readonly<GameState>;
  action: ExpandLandAction;
  createdAt?: number;
  farmId?: number;
};

/**
 * We split players into 3 groups
 * This decides what order of expansions they will receive
 * We need to use a seed that will always remain the same even if we lose all DB data = Farm ID
 * Formula = Add individual digits of Farm ID, then modular 3
 * 294 = (2 + 9 + 5) % 3 + 1 = Group 2
 */
export function getPlayerGroup(id: string): 0 | 1 | 2 {
  const digits = id.split("").map(Number);
  const total = digits.reduce((total, digit) => total + digit);
  const groupId = total % 3;

  return groupId as 0 | 1 | 2;
}

export function getLand(id: number, expansion: number): Layout | null {
  if (expansion === 4) {
    return LAND_4_LAYOUT;
  }

  if (expansion === 5) {
    return LAND_5_LAYOUT;
  }

  if (expansion === 6) {
    return LAND_6_LAYOUT;
  }

  if (expansion === 7) {
    return LAND_7_LAYOUT;
  }

  if (expansion === 8) {
    return LAND_8_LAYOUT;
  }

  if (expansion >= 9 && expansion <= 11) {
    const group = getPlayerGroup(id.toString());
    const positionInPack = (expansion + group) % 3;

    return LAND_PACK_TWO[positionInPack];
  }

  if (expansion >= 12 && expansion <= 14) {
    const group = getPlayerGroup(id.toString());
    const positionInPack = (expansion + group) % 3;

    return LAND_PACK_THREE[positionInPack];
  }

  if (expansion >= 15 && expansion <= 17) {
    const group = getPlayerGroup(id.toString());
    const positionInPack = (expansion + group) % 3;

    return LAND_PACK_FOUR[positionInPack];
  }

  if (expansion >= 18 && expansion <= 20) {
    const group = getPlayerGroup(id.toString());
    const positionInPack = (expansion + group) % 3;

    return LAND_PACK_FIVE[positionInPack];
  }

  if (expansion >= 21 && expansion <= 23) {
    const group = getPlayerGroup(id.toString());
    const positionInPack = (expansion + group) % 3;

    return LAND_PACK_SIX[positionInPack];
  }

  return null;
}

export const LAND_4_LAYOUT: Layout = {
  id: "4",
  plots: [
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
    {
      x: 1,
      y: 1,
    },
    {
      x: 1,
      y: 0,
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
};

export const LAND_5_LAYOUT: Layout = {
  id: "5",
  plots: [
    {
      x: 0,
      y: -1,
    },
    {
      x: 1,
      y: -1,
    },
    {
      x: 0,
      y: -2,
    },
    {
      x: 1,
      y: -2,
    },
  ],
  fruitPatches: [],
  gold: [
    {
      x: 1,
      y: 2,
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
      x: -2,
      y: -1,
    },
  ],
  trees: [],
} as Layout;

export const LAND_6_LAYOUT: Layout = {
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
      x: 0,
      y: 2,
    },
  ],
} as Layout;

export const LAND_7_LAYOUT: Layout = {
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
} as Layout;

export const LAND_8_LAYOUT: Layout = {
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
} as Layout;

export const LAND_9_LAYOUT: Layout = {
  id: "9",
  plots: [],
  fruitPatches: [
    {
      x: 0,
      y: 3,
    },
  ],
  gold: [],
  iron: [
    {
      x: -2,
      y: 0,
    },
  ],
  stones: [],
  trees: [],
} as Layout;

export const LAND_10_LAYOUT: Layout = {
  id: "10",
  plots: [
    {
      x: 1,
      y: 2,
    },
    {
      x: 0,
      y: 2,
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
  stones: [
    {
      x: 1,
      y: -1,
    },
  ],
  trees: [
    {
      x: -2,
      y: 1,
    },
    {
      x: -2,
      y: -1,
    },
  ],
} as Layout;
export const LAND_11_LAYOUT: Layout = {
  id: "11",
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
  fruitPatches: [],
  gold: [
    {
      x: 1,
      y: 2,
    },
  ],
  iron: [
    {
      x: 0,
      y: 0,
    },
  ],
  stones: [
    {
      x: -2,
      y: 0,
    },
  ],
  trees: [
    {
      x: -2,
      y: 3,
    },
  ],
} as Layout;
export const LAND_12_LAYOUT: Layout = {
  id: "12",
  plots: [],
  fruitPatches: [
    {
      x: -2,
      y: 2,
    },
    {
      x: 0,
      y: 2,
    },
  ],
  gold: [],
  iron: [],
  stones: [
    {
      x: 0,
      y: -1,
    },
  ],
  trees: [],
  boulder: [],
} as Layout;

export const LAND_13_LAYOUT: Layout = {
  id: "13",
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
  fruitPatches: [],
  gold: [],
  iron: [],
  stones: [
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
} as Layout;

export const LAND_14_LAYOUT: Layout = {
  id: "14",
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
      x: 1,
      y: 2,
    },
  ],
  gold: [
    {
      x: 1,
      y: -1,
    },
  ],
  iron: [
    {
      x: -1,
      y: -2,
    },
  ],
  stones: [
    {
      x: -2,
      y: 0,
    },
  ],
  trees: [],
} as Layout;

export const LAND_15_LAYOUT: Layout = {
  id: "15",
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
  trees: [
    {
      x: 0,
      y: 0,
    },
  ],
} as Layout;

export const LAND_16_LAYOUT: Layout = {
  id: "16",
  plots: [],
  fruitPatches: [
    {
      x: -1,
      y: 1,
    },
  ],
  gold: [
    {
      x: 1,
      y: -1,
    },
  ],
  iron: [
    {
      x: -2,
      y: -1,
    },
  ],
  stones: [],
  trees: [],
} as Layout;

export const LAND_17_LAYOUT: Layout = {
  id: "17",
  plots: [
    {
      x: 0,
      y: 2,
    },
    {
      x: 1,
      y: 2,
    },
  ],
  fruitPatches: [
    {
      x: 0,
      y: 0,
    },
  ],
  gold: [],
  iron: [],
  stones: [
    {
      x: -2,
      y: -1,
    },
  ],
  trees: [
    {
      x: -2,
      y: 2,
    },
  ],
} as Layout;

export const LAND_18_LAYOUT: Layout = {
  id: "18",
  plots: [
    {
      x: 1,
      y: 1,
    },
    {
      x: 1,
      y: 0,
    },
  ],
  trees: [],
  stones: [],
  fruitPatches: [],
  gold: [],
  iron: [],
};

export const LAND_19_LAYOUT: Layout = {
  id: "19",
  plots: [],
  fruitPatches: [
    {
      x: -2,
      y: 2,
    },
  ],
  trees: [
    {
      x: -2,
      y: 0,
    },
  ],
  stones: [
    {
      x: 2,
      y: 1,
    },
  ],
  iron: [
    {
      x: 2,
      y: 0,
    },
  ],
  gold: [],
};

export const LAND_20_LAYOUT: Layout = {
  id: "20",
  plots: [
    {
      x: 1,
      y: 1,
    },
    {
      x: 1,
      y: 0,
    },
  ],
  fruitPatches: [
    {
      x: -2,
      y: 2,
    },
  ],
  trees: [],
  stones: [],
  gold: [],
  iron: [],
};

export const LAND_21_LAYOUT: Layout = {
  id: "21",
  plots: [
    {
      x: 1,
      y: 1,
    },
  ],
  fruitPatches: [
    {
      x: -2,
      y: 2,
    },
  ],
  trees: [
    {
      x: -2,
      y: 0,
    },
  ],
  stones: [
    {
      x: 2,
      y: 1,
    },
  ],
  gold: [],
  iron: [
    {
      x: 2,
      y: 0,
    },
  ],
};

export const LAND_22_LAYOUT: Layout = {
  id: "22",
  plots: [
    {
      x: 1,
      y: 1,
    },
  ],
  fruitPatches: [],
  trees: [
    {
      x: -2,
      y: 0,
    },
  ],
  stones: [],
  gold: [
    {
      x: 2,
      y: 0,
    },
  ],
  iron: [],
};

export const LAND_23_LAYOUT: Layout = {
  id: "23",
  plots: [
    {
      x: 1,
      y: 1,
    },
  ],
  fruitPatches: [
    {
      x: -2,
      y: 2,
    },
  ],
  trees: [],
  stones: [
    {
      x: 2,
      y: 1,
    },
  ],
  gold: [],
  iron: [
    {
      x: 2,
      y: 0,
    },
  ],
};

export type Layout = {
  id: string;
  trees: Coordinates[];
  stones: Coordinates[];
  plots: Coordinates[];
  iron?: Coordinates[];
  gold?: Coordinates[];
  fruitPatches?: Coordinates[];
};

/**
 * Once a player gets past the first 8 pieces of land, they enter the land pack stage
 * A land pack provides 3 expansions in a random order for the player
 */
export const LAND_PACK_TWO = [LAND_9_LAYOUT, LAND_10_LAYOUT, LAND_11_LAYOUT];
export const LAND_PACK_THREE = [LAND_12_LAYOUT, LAND_13_LAYOUT, LAND_14_LAYOUT];
export const LAND_PACK_FOUR = [LAND_15_LAYOUT, LAND_16_LAYOUT, LAND_17_LAYOUT];
export const LAND_PACK_FIVE = [LAND_18_LAYOUT, LAND_19_LAYOUT, LAND_20_LAYOUT];
export const LAND_PACK_SIX = [LAND_21_LAYOUT, LAND_22_LAYOUT, LAND_23_LAYOUT];

export interface Requirements {
  resources: Partial<Record<InventoryItemName, number>>;
  seconds: number;
  sfl?: number;
  bumpkinLevel: number;
}

const LAND_4_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 3,
  },
  seconds: 10,
  bumpkinLevel: 2,
};

const LAND_5_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 5,
  },
  seconds: 3,
  bumpkinLevel: 2,
};

const LAND_6_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 5,
    Stone: 3,
  },
  seconds: 60,
  bumpkinLevel: 4,
};

const LAND_7_REQUIREMENTS: Requirements = {
  resources: {
    Stone: 5,
    Iron: 1,
    Gold: 1,
    "Block Buck": 1,
  },
  seconds: 30 * 60,
  bumpkinLevel: 6,
};

const LAND_8_REQUIREMENTS: Requirements = {
  resources: {
    Stone: 10,
    Iron: 3,
    Gold: 1,
    "Block Buck": 1,
  },
  seconds: 4 * 60 * 60,
  bumpkinLevel: 8,
};

const LAND_9_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 100,
    Stone: 40,
    Iron: 5,
    "Block Buck": 1,
  },
  seconds: 12 * 60 * 60,
  bumpkinLevel: 11,
};

const LAND_10_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 100,
    Stone: 50,
    Iron: 5,
    Gold: 2,
    "Block Buck": 1,
  },
  seconds: 24 * 60 * 60,
  bumpkinLevel: 13,
};

const LAND_11_REQUIREMENTS: Requirements = {
  resources: {
    Gold: 10,
    "Block Buck": 1,
  },
  seconds: 24 * 60 * 60,
  bumpkinLevel: 15,
};

const LAND_12_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 500,
    Stone: 20,
    Gold: 2,
    "Block Buck": 1,
  },
  seconds: 24 * 60 * 60,
  bumpkinLevel: 17,
};

const LAND_13_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 100,
    Stone: 150,
    Gold: 5,
    "Block Buck": 1,
  },
  seconds: 24 * 60 * 60,
  bumpkinLevel: 20,
};

const LAND_14_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 40,
    Stone: 30,
    Iron: 10,
    Gold: 10,
    "Block Buck": 1,
  },
  seconds: 36 * 60 * 60,
  bumpkinLevel: 23,
};

const LAND_15_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 200,
    Gold: 15,
    "Block Buck": 1,
  },
  seconds: 36 * 60 * 60,
  bumpkinLevel: 26,
};

const LAND_16_REQUIREMENTS: Requirements = {
  resources: {
    Stone: 150,
    Iron: 30,
    Gold: 10,
    "Block Buck": 1,
  },
  seconds: 36 * 60 * 60,
  bumpkinLevel: 30,
};

const LAND_17_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 200,
    Stone: 50,
    Gold: 25,
    "Block Buck": 1,
  },
  seconds: 36 * 60 * 60,
  bumpkinLevel: 34,
};

const LAND_18_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 300,
    Stone: 200,
    Iron: 30,
    Gold: 10,
    "Block Buck": 1,
  },
  seconds: 36 * 60 * 60,
  bumpkinLevel: 37,
};

const LAND_19_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 100,
    Stone: 250,
    Gold: 30,
    "Block Buck": 1,
  },
  seconds: 48 * 60 * 60,
  bumpkinLevel: 40,
};

const LAND_20_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 1000,
    Stone: 100,
    Iron: 10,
    Gold: 25,
    "Block Buck": 1,
  },
  seconds: 48 * 60 * 60,
  bumpkinLevel: 45,
};

const LAND_21_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 1500,
    Stone: 100,
    Iron: 20,
    Gold: 25,
    "Block Buck": 2,
  },
  seconds: 48 * 60 * 60,
  bumpkinLevel: 50,
};
const LAND_22_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 2000,
    Stone: 200,
    Iron: 20,
    Gold: 40,
    "Block Buck": 2,
  },
  seconds: 48 * 60 * 60,
  bumpkinLevel: 55,
};
const LAND_23_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 2000,
    Stone: 250,
    Iron: 50,
    Gold: 60,
    "Block Buck": 2,
  },
  seconds: 48 * 60 * 60,
  bumpkinLevel: 60,
};
const EXPANSION_REQUIREMENTS: Record<number, Requirements> = {
  4: LAND_4_REQUIREMENTS,
  5: LAND_5_REQUIREMENTS,
  6: LAND_6_REQUIREMENTS,
  7: LAND_7_REQUIREMENTS,
  8: LAND_8_REQUIREMENTS,
  9: LAND_9_REQUIREMENTS,
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
};

export const expansionRequirements = (level: number) => {
  return EXPANSION_REQUIREMENTS[level];
};
