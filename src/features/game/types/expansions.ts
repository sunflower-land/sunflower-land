import { GameState, InventoryItemName, IslandType } from "./game";
import { Coordinates } from "../expansion/components/MapPlacement";
import { TOTAL_EXPANSION_NODES } from "../expansion/lib/expansionNodes";

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

export function getBasicLand({
  id,
  expansion,
}: {
  id: number;
  expansion: number;
}) {
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

  if (expansion === 9) {
    return LAND_9_LAYOUT;
  }

  if (expansion === 10) {
    return LAND_10_LAYOUT;
  }

  if (expansion === 11) {
    return LAND_11_LAYOUT;
  }

  // LEGACY - can remove from Feb 1st
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

export function getLand({
  id,
  game,
}: {
  id: number;
  game: GameState;
}): Layout | null {
  const expansion = (game.inventory["Basic Land"]?.toNumber() ?? 0) + 1;

  let land: Layout | null = null;

  if (game.island.type === "basic") {
    land = getBasicLand({ id, expansion });
  }

  if (game.island.type === "spring") {
    land = SPRING_LAYOUTS[expansion];
  }

  if (!land) {
    return null;
  }

  const expectedResources = TOTAL_EXPANSION_NODES[game.island.type][expansion];

  // Remove any resources if they are past the limit already
  const availableTrees =
    expectedResources.Tree - (game.inventory.Tree?.toNumber() ?? 0);
  land.trees = land.trees.slice(0, availableTrees);

  const availableStones =
    expectedResources["Stone Rock"] -
    (game.inventory["Stone Rock"]?.toNumber() ?? 0);
  land.stones = land.stones.slice(0, availableStones);

  const availableIron =
    expectedResources["Iron Rock"] -
    (game.inventory["Iron Rock"]?.toNumber() ?? 0);
  land.iron = land.iron?.slice(0, availableIron);

  const availableGold =
    expectedResources["Gold Rock"] -
    (game.inventory["Gold Rock"]?.toNumber() ?? 0);
  land.gold = land.gold?.slice(0, availableGold);

  const availableFruit =
    expectedResources["Fruit Patch"] -
    (game.inventory["Fruit Patch"]?.toNumber() ?? 0);
  land.fruitPatches = land.fruitPatches?.slice(0, availableFruit);

  const availablePlots =
    expectedResources["Crop Plot"] -
    (game.inventory["Crop Plot"]?.toNumber() ?? 0);
  land.plots = land.plots.slice(0, availablePlots);

  const availableHives =
    expectedResources["Beehive"] - (game.inventory["Beehive"]?.toNumber() ?? 0);
  land.beehives = land.beehives?.slice(0, availableHives);

  const availableFlowers =
    expectedResources["Flower Bed"] -
    (game.inventory["Flower Bed"]?.toNumber() ?? 0);
  land.flowerBeds = land.flowerBeds?.slice(0, availableFlowers);

  const availableCrimstones =
    expectedResources["Crimstone Rock"] -
    (game.inventory["Crimstone Rock"]?.toNumber() ?? 0);
  land.crimstones = land.crimstones?.slice(0, availableCrimstones);

  // Sun Stones
  const availableSunstones =
    expectedResources["Sunstone Rock"] -
    (game.inventory["Sunstone Rock"]?.toNumber() ?? 0);
  land.sunstones = land.sunstones?.slice(0, availableSunstones);

  return land;
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
  trees: [
    {
      x: -3,
      y: 2,
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
  plots: [
    {
      x: 0,
      y: 3,
    },
    {
      x: 1,
      y: 3,
    },
  ],
  fruitPatches: [],
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

export const SPRING_LAND_5_LAYOUT: Layout = {
  id: "spring_5",
  plots: [
    {
      x: -2,
      y: 0,
    },
    {
      x: -1,
      y: 0,
    },
  ],
  fruitPatches: [
    {
      x: -1,
      y: 3,
    },
  ],
  gold: [
    {
      x: 1,
      y: -2,
    },
  ],
  iron: [
    {
      x: 0,
      y: -2,
    },
  ],
  stones: [
    {
      x: -2,
      y: -2,
    },
    {
      x: -1,
      y: -2,
    },
  ],
  crimstones: [],
  sunstones: [],
  trees: [
    {
      x: 1,
      y: 3,
    },
    {
      x: 1,
      y: 1,
    },
  ],
  beehives: [],
};

export const SPRING_LAND_6_LAYOUT: Layout = {
  id: "spring_6",
  plots: [],
  fruitPatches: [
    {
      x: 0,
      y: 3,
    },
  ],
  gold: [],
  iron: [],
  stones: [
    {
      x: -3,
      y: 2,
    },
  ],
  crimstones: [],
  sunstones: [],
  trees: [
    {
      x: -2,
      y: 3,
    },
  ],
  beehives: [
    {
      x: 0,
      y: 0,
    },
  ],
  flowerBeds: [
    {
      x: -1,
      y: -1,
    },
  ],
};

export const SPRING_LAND_7_LAYOUT: Layout = {
  id: "spring_7",
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
  gold: [],
  iron: [],
  stones: [
    {
      x: 0,
      y: 2,
    },
  ],
  crimstones: [
    {
      x: -1,
      y: -1,
    },
  ],
  sunstones: [],
  trees: [
    {
      x: 1,
      y: 0,
    },
  ],
  beehives: [],
};

export const SPRING_LAND_8_LAYOUT: Layout = {
  id: "spring_8",
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
  fruitPatches: [
    {
      x: -1,
      y: 0,
    },
  ],
  gold: [
    {
      x: -3,
      y: 0,
    },
  ],
  iron: [
    {
      x: 1,
      y: 1,
    },
  ],
  stones: [
    {
      x: -1,
      y: 2,
    },
  ],
  crimstones: [],
  sunstones: [],
  trees: [],
  beehives: [],
};

export const SPRING_LAND_9_LAYOUT: Layout = {
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
  crimstones: [],
  sunstones: [
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
  beehives: [],
  id: "spring_9",
};

export const SPRING_LAND_10_LAYOUT: Layout = {
  plots: [],
  fruitPatches: [
    {
      x: -2,
      y: 3,
    },
  ],
  gold: [
    {
      x: 1,
      y: 2,
    },
  ],
  iron: [
    {
      x: 0,
      y: 3,
    },
  ],
  stones: [],
  crimstones: [],
  sunstones: [],
  trees: [],
  beehives: [
    {
      x: 0,
      y: 0,
    },
  ],
  flowerBeds: [
    {
      x: -1,
      y: -1,
    },
  ],
  id: "spring_10",
};

export const SPRING_LAND_11_LAYOUT: Layout = {
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
      x: -2,
      y: -1,
    },
  ],
  gold: [],
  iron: [],
  stones: [
    {
      x: 1,
      y: 2,
    },
  ],

  sunstones: [],
  trees: [
    {
      x: 0,
      y: -1,
    },
  ],
  beehives: [],
  id: "spring_11",
};

export const SPRING_LAND_12_LAYOUT: Layout = {
  plots: [
    {
      x: -1,
      y: 1,
    },
    {
      x: 0,
      y: 1,
    },
  ],
  fruitPatches: [],
  gold: [],
  iron: [],
  stones: [],
  crimstones: [],
  sunstones: [],
  trees: [],
  beehives: [],
  id: "spring_12",
};

export const SPRING_LAND_13_LAYOUT: Layout = {
  plots: [],
  fruitPatches: [
    {
      x: -1,
      y: 3,
    },
  ],
  gold: [],
  iron: [
    {
      x: 1,
      y: 1,
    },
  ],
  stones: [
    {
      x: -2,
      y: 1,
    },
  ],
  crimstones: [],
  sunstones: [
    {
      x: 0,
      y: -1,
    },
  ],
  trees: [
    {
      x: -2,
      y: -1,
    },
  ],
  beehives: [],
  id: "spring_13",
};

export const SPRING_LAND_14_LAYOUT: Layout = {
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
  fruitPatches: [
    {
      x: 1,
      y: 2,
    },
  ],
  gold: [],
  iron: [],
  stones: [],
  crimstones: [],
  sunstones: [],
  trees: [],
  beehives: [],
  id: "spring_14",
};

export const SPRING_LAND_15_LAYOUT: Layout = {
  plots: [
    {
      x: -2,
      y: 2,
    },
  ],
  fruitPatches: [
    {
      x: 1,
      y: 1,
    },
  ],
  gold: [],
  iron: [
    {
      x: -1,
      y: -1,
    },
  ],
  stones: [
    {
      x: -2,
      y: 0,
    },
  ],
  crimstones: [
    {
      x: -1,
      y: 1,
    },
  ],
  sunstones: [],
  trees: [
    {
      x: 1,
      y: 3,
    },
  ],
  beehives: [],
  id: "spring_15",
};

export const SPRING_LAND_16_LAYOUT: Layout = {
  plots: [
    {
      x: -2,
      y: 2,
    },
  ],
  fruitPatches: [],
  gold: [
    {
      x: -1,
      y: 1,
    },
  ],
  iron: [],
  stones: [],

  sunstones: [],
  trees: [
    {
      x: 0,
      y: 3,
    },
  ],
  beehives: [
    {
      x: 0,
      y: -1,
    },
  ],
  flowerBeds: [
    {
      x: -1,
      y: -2,
    },
  ],
  id: "spring_16",
};
export const SPRING_LAND_17_LAYOUT: Layout = {
  plots: [
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
  iron: [
    {
      x: 0,
      y: -1,
    },
  ],
  stones: [
    {
      x: -2,
      y: 0,
    },
  ],
  crimstones: [],
  sunstones: [],
  trees: [],
  beehives: [],
  id: "spring_17",
};
export const SPRING_LAND_18_LAYOUT: Layout = {
  plots: [],
  fruitPatches: [],
  gold: [],
  iron: [],
  stones: [],
  crimstones: [],
  sunstones: [
    {
      x: -1,
      y: 1,
    },
  ],
  trees: [],
  beehives: [],
  id: "spring_18",
};

export const SPRING_LAND_19_LAYOUT: Layout = {
  plots: [
    {
      x: -1,
      y: 1,
    },
    {
      x: 0,
      y: 1,
    },
  ],
  fruitPatches: [],
  gold: [],
  iron: [],
  stones: [],
  crimstones: [
    {
      x: -3,
      y: 0,
    },
  ],
  sunstones: [],
  trees: [],
  beehives: [],
  id: "spring_19",
};

export const SPRING_LAND_20_LAYOUT: Layout = {
  plots: [
    {
      x: -1,
      y: 2,
    },
    {
      x: 0,
      y: 2,
    },
  ],
  fruitPatches: [],
  gold: [],
  iron: [],
  stones: [],
  crimstones: [],
  sunstones: [
    {
      x: -1,
      y: 0,
    },
  ],
  trees: [],
  beehives: [],
  id: "spring_20",
};

export const SPRING_LAYOUTS: Record<number, Layout> = {
  5: SPRING_LAND_5_LAYOUT,
  6: SPRING_LAND_6_LAYOUT,
  7: SPRING_LAND_7_LAYOUT,
  8: SPRING_LAND_8_LAYOUT,
  9: SPRING_LAND_9_LAYOUT,

  10: SPRING_LAND_10_LAYOUT,
  11: SPRING_LAND_11_LAYOUT,
  12: SPRING_LAND_12_LAYOUT,
  13: SPRING_LAND_13_LAYOUT,
  14: SPRING_LAND_14_LAYOUT,
  15: SPRING_LAND_15_LAYOUT,
  16: SPRING_LAND_16_LAYOUT,
  17: SPRING_LAND_17_LAYOUT,
  18: SPRING_LAND_18_LAYOUT,
  19: SPRING_LAND_19_LAYOUT,
  20: SPRING_LAND_20_LAYOUT,
};

export type Layout = {
  id: string;
  trees: Coordinates[];
  stones: Coordinates[];
  plots: Coordinates[];
  iron?: Coordinates[];
  gold?: Coordinates[];
  crimstones?: Coordinates[];
  sunstones?: Coordinates[];
  beehives?: Coordinates[];
  flowerBeds?: Coordinates[];
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
  seconds: 5,
  bumpkinLevel: 1,
};

const LAND_5_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 5,
  },
  seconds: 5,
  bumpkinLevel: 2,
};

const LAND_6_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 5,
    Stone: 1,
  },
  seconds: 60,
  bumpkinLevel: 4,
};

const LAND_7_REQUIREMENTS: Requirements = {
  resources: {
    Stone: 5,
    Iron: 1,
  },
  seconds: 30 * 60,
  bumpkinLevel: 6,
};

const LAND_8_REQUIREMENTS: Requirements = {
  resources: {
    Iron: 3,
    Gold: 1,
  },
  seconds: 4 * 60 * 60,
  bumpkinLevel: 8,
};

const LAND_9_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 100,
    Stone: 40,
    Iron: 5,
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

const SPRING_LAND_5_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 20,
  },
  seconds: 60,
  bumpkinLevel: 11,
};

const SPRING_LAND_6_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 10,
    Stone: 5,
    Gold: 2,
  },
  seconds: 5 * 60,
  bumpkinLevel: 13,
};

const SPRING_LAND_7_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 30,
    Stone: 20,
    Iron: 5,
    "Block Buck": 1,
  },
  seconds: 30 * 60,
  bumpkinLevel: 16,
};

const SPRING_LAND_8_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 20,
    Crimstone: 1,
    "Block Buck": 1,
  },
  seconds: 2 * 60 * 60,
  bumpkinLevel: 20,
};

const SPRING_LAND_9_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 50,
    Gold: 5,
    "Block Buck": 1,
  },
  seconds: 2 * 60 * 60,
  bumpkinLevel: 23,
};

const SPRING_LAND_10_REQUIREMENTS: Requirements = {
  resources: {
    Stone: 10,
    Crimstone: 3,
    "Block Buck": 1,
  },
  seconds: 4 * 60 * 60,
  bumpkinLevel: 25,
};

const SPRING_LAND_11_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 100,
    Stone: 25,
    Gold: 5,
    Crimstone: 1,
    "Block Buck": 1,
  },
  seconds: 8 * 60 * 60,
  bumpkinLevel: 27,
};

const SPRING_LAND_12_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 50,
    Iron: 5,
    Crimstone: 3,
    "Block Buck": 2,
  },
  seconds: 12 * 60 * 60,
  bumpkinLevel: 29,
};

const SPRING_LAND_13_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 50,
    Stone: 25,
    Iron: 10,
    Gold: 10,
    "Block Buck": 2,
  },
  seconds: 12 * 60 * 60,

  bumpkinLevel: 32,
};

const SPRING_LAND_14_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 100,
    Stone: 10,
    Crimstone: 5,
    "Block Buck": 2,
  },
  seconds: 24 * 60 * 60,

  bumpkinLevel: 36,
};

const SPRING_LAND_15_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 150,
    Stone: 10,
    Iron: 10,
    Gold: 5,
    Crimstone: 5,
    "Block Buck": 2,
  },
  seconds: 24 * 60 * 60,

  bumpkinLevel: 40,
};

const SPRING_LAND_16_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 100,
    Stone: 10,
    Gold: 5,
    Crimstone: 8,
    "Block Buck": 2,
  },
  seconds: 24 * 60 * 60,

  bumpkinLevel: 43,
};

const SPRING_LAND_17_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 100,
    Stone: 20,
    Iron: 10,
    Gold: 5,
    Crimstone: 12,
    "Block Buck": 2,
  },
  seconds: 36 * 60 * 60,

  bumpkinLevel: 47,
};

const SPRING_LAND_18_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 150,
    Stone: 20,
    Iron: 10,
    Gold: 5,
    Crimstone: 16,
    "Block Buck": 2,
  },
  seconds: 36 * 60 * 60,

  bumpkinLevel: 51,
};

const SPRING_LAND_19_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 150,
    Stone: 10,
    Iron: 5,
    Gold: 5,
    Crimstone: 20,
    "Block Buck": 2,
  },
  seconds: 36 * 60 * 60,

  bumpkinLevel: 53,
};

const SPRING_LAND_20_REQUIREMENTS: Requirements = {
  resources: {
    Wood: 50,
    Stone: 5,
    Iron: 5,
    Gold: 5,
    Crimstone: 24,
    "Block Buck": 2,
  },
  seconds: 48 * 60 * 60,

  bumpkinLevel: 55,
};

export const EXPANSION_REQUIREMENTS: Record<
  IslandType,
  Record<number, Requirements>
> = {
  basic: {
    4: LAND_4_REQUIREMENTS,
    5: LAND_5_REQUIREMENTS,
    6: LAND_6_REQUIREMENTS,
    7: LAND_7_REQUIREMENTS,
    8: LAND_8_REQUIREMENTS,
    9: LAND_9_REQUIREMENTS,
    // LEGACY - used for refunding expansions - do not remove
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
  },
  spring: {
    5: SPRING_LAND_5_REQUIREMENTS,
    6: SPRING_LAND_6_REQUIREMENTS,
    7: SPRING_LAND_7_REQUIREMENTS,
    8: SPRING_LAND_8_REQUIREMENTS,
    9: SPRING_LAND_9_REQUIREMENTS,
    10: SPRING_LAND_10_REQUIREMENTS,
    11: SPRING_LAND_11_REQUIREMENTS,
    12: SPRING_LAND_12_REQUIREMENTS,
    13: SPRING_LAND_13_REQUIREMENTS,
    14: SPRING_LAND_14_REQUIREMENTS,
    15: SPRING_LAND_15_REQUIREMENTS,
    16: SPRING_LAND_16_REQUIREMENTS,
    17: SPRING_LAND_17_REQUIREMENTS,
    18: SPRING_LAND_18_REQUIREMENTS,
    19: SPRING_LAND_19_REQUIREMENTS,
    20: SPRING_LAND_20_REQUIREMENTS,
  },
  desert: {
    // TODO
  },
};

/**
 * Minimum Bumpkin level to work on a land.
 * Prevents abuse of bumpkin swapping and reuse
 */
export const BUMPKIN_EXPANSIONS_LEVEL: Record<
  IslandType,
  Record<number, number>
> = {
  basic: {
    3: 1,
    4: 1,
    5: 1,
    6: 1,
    7: 1,
    8: 3,
    9: 3,
    10: 5,
    11: 12,
    12: 17,
    13: 20,
    14: 23,
    15: 25,
    16: 30,
    17: 30,
    18: 30,
    19: 40,
    20: 40,
    21: 45,
    22: 45,
    23: 50,
  },
  spring: {
    4: 10,
    5: 10,
    6: 10,
    7: 15,
    8: 17,
    9: 20,
    10: 23,
    11: 25,
    12: 25,
    13: 30,
    14: 30,
    15: 35,
    16: 35,
    17: 40,
    18: 40,
    19: 45,
    20: 50,
  },
  desert: {},
};
