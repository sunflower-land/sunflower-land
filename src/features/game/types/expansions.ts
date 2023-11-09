import { GameState } from "../types/game";
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
  ],
  fruitPatches: [],
  gold: [],
  iron: [
    {
      x: 1,
      y: 0,
    },
  ],
  stones: [
    {
      x: 2,
      y: -2,
    },
  ],
  trees: [
    {
      x: 1,
      y: 3,
    },
  ],
};

// TODO
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
  trees: [
    {
      x: -2,
      y: 3,
    },
  ],
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
