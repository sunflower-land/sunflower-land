import { v4 as randomUUID } from "uuid";
import Decimal from "decimal.js-light";
import {
  EXPANSION_ORIGINS,
  LAND_SIZE,
} from "features/game/expansion/lib/constants";
import {
  EXPANSION_REQUIREMENTS,
  getLand,
} from "features/game/types/expansions";
import { Airdrop, GameState } from "features/game/types/game";

import cloneDeep from "lodash.clonedeep";
import { getKeys } from "features/game/types/craftables";
import { pickEmptyPosition } from "features/game/expansion/placeable/lib/collisionDetection";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import { CRIMSTONE_RECOVERY_TIME } from "features/game/lib/constants";

export type RevealLandAction = {
  type: "land.revealed";
};

type Options = {
  state: Readonly<GameState>;
  action: RevealLandAction;
  createdAt?: number;
  farmId?: number;
  promo?: string;
};

export function revealLand({
  state,
  action,
  createdAt = Date.now(),
  farmId = 0,
  promo,
}: Options) {
  const game = cloneDeep(state) as GameState;

  if (!game.expansionConstruction) {
    throw new Error("Land is not in construction");
  }

  const land = getLand({ id: farmId, game });
  if (!land) {
    throw new Error("Land Does Not Exists");
  }

  const { inventory } = game;

  inventory["Basic Land"] = (inventory["Basic Land"] ?? new Decimal(0)).add(1);

  const landCount = inventory["Basic Land"].toNumber();
  const origin = EXPANSION_ORIGINS[landCount - 1];

  delete game.expansionConstruction;

  // Add Trees
  land.trees?.forEach((coords) => {
    game.trees[randomUUID().slice(0, 8)] = {
      height: 2,
      width: 2,
      x: coords.x + origin.x,
      y: coords.y + origin.y,
      wood: { amount: 1, choppedAt: 0 },
    };
  });
  inventory.Tree = (inventory.Tree || new Decimal(0)).add(land.trees.length);

  // Add Stones
  land.stones?.forEach((coords) => {
    game.stones[randomUUID().slice(0, 8)] = {
      height: 1,
      width: 1,
      x: coords.x + origin.x,
      y: coords.y + origin.y,
      stone: { amount: 1, minedAt: 0 },
    };
  });
  inventory["Stone Rock"] = (inventory["Stone Rock"] || new Decimal(0)).add(
    land.stones.length
  );

  // Add Iron
  land.iron?.forEach((coords) => {
    game.iron[randomUUID().slice(0, 8)] = {
      height: 1,
      width: 1,
      x: coords.x + origin.x,
      y: coords.y + origin.y,
      stone: { amount: 1, minedAt: 0 },
    };
  });
  inventory["Iron Rock"] = (inventory["Iron Rock"] || new Decimal(0)).add(
    land.iron?.length ?? 0
  );

  // Add Gold
  land.gold?.forEach((coords) => {
    game.gold[randomUUID().slice(0, 8)] = {
      height: 1,
      width: 1,
      x: coords.x + origin.x,
      y: coords.y + origin.y,
      stone: { amount: 1, minedAt: 0 },
    };
  });
  inventory["Gold Rock"] = (inventory["Gold Rock"] || new Decimal(0)).add(
    land.gold?.length ?? 0
  );

  // Add Crimstone
  land.crimstones?.forEach((coords) => {
    game.crimstones[randomUUID().slice(0, 8)] = {
      height: 2,
      width: 2,
      x: coords.x + origin.x,
      y: coords.y + origin.y,
      stone: { amount: 1, minedAt: 0 },
      minesLeft: 5,
    };
  });
  inventory["Crimstone Rock"] = (
    inventory["Crimstone Rock"] || new Decimal(0)
  ).add(land.crimstones?.length ?? 0);

  // Add Plots
  land.plots?.forEach((coords) => {
    game.crops[randomUUID().slice(0, 8)] = {
      createdAt: Date.now(),
      height: 1,
      width: 1,
      x: coords.x + origin.x,
      y: coords.y + origin.y,
    };
  });
  inventory["Crop Plot"] = (inventory["Crop Plot"] || new Decimal(0)).add(
    land.plots?.length ?? 0
  );

  // Add Fruit patches
  land.fruitPatches?.forEach((coords) => {
    game.fruitPatches[randomUUID().slice(0, 8)] = {
      height: 2,
      width: 2,
      x: coords.x + origin.x,
      y: coords.y + origin.y,
      fruit: {
        amount: 1,
        harvestedAt: 0,
        harvestsLeft: 3,
        name: "Apple",
        plantedAt: 0,
      },
    };
  });
  inventory["Fruit Patch"] = (inventory["Fruit Patch"] || new Decimal(0)).add(
    land.fruitPatches?.length ?? 0
  );

  // Add sun stones
  land.sunstones?.forEach((coords) => {
    const id = randomUUID();
    game.sunstones[id] = {
      height: 2,
      width: 2,
      x: coords.x + origin.x,
      y: coords.y + origin.y,
      stone: { amount: 1, minedAt: 0 },
      minesLeft: 10,
    };
  });
  inventory["Sunstone Rock"] = (
    inventory["Sunstone Rock"] || new Decimal(0)
  ).add(land.sunstones?.length ?? 0);

  // Add bee hives
  land.beehives?.forEach((coords) => {
    const id = randomUUID();
    game.beehives[id] = {
      height: 1,
      width: 1,
      x: coords.x + origin.x,
      y: coords.y + origin.y,
      honey: { produced: 0, updatedAt: Date.now() },
      flowers: [],
      swarm: false,
    };
  });
  inventory.Beehive = (inventory.Beehive || new Decimal(0)).add(
    land.beehives?.length ?? 0
  );

  // Add flower beds
  land.flowerBeds?.forEach((coords) => {
    const id = randomUUID();
    game.flowers.flowerBeds[id] = {
      height: 1,
      width: 3,
      x: coords.x + origin.x,
      y: coords.y + origin.y,
      createdAt,
    };
  });
  inventory["Flower Bed"] = (inventory["Flower Bed"] || new Decimal(0)).add(
    land.flowerBeds?.length ?? 0
  );

  land.oilReserves?.forEach((coords) => {
    const id = randomUUID();
    game.oilReserves[id] = {
      height: 2,
      width: 2,
      x: coords.x + origin.x,
      y: coords.y + origin.y,
      createdAt,
      drilled: 0,
      oil: {
        amount: 10,
        drilledAt: 0,
      },
    };
  });
  inventory["Oil Reserve"] = (inventory["Oil Reserve"] || new Decimal(0)).add(
    land.oilReserves?.length ?? 0
  );

  // Refresh all basic resources
  game.trees = getKeys(game.trees).reduce((acc, id) => {
    return {
      ...acc,
      [id]: {
        ...game.trees[id],
        wood: {
          ...game.trees[id].wood,
          choppedAt: createdAt - 4 * 60 * 60 * 1000,
        },
      },
    };
  }, {} as GameState["trees"]);

  game.stones = getKeys(game.stones).reduce((acc, id) => {
    return {
      ...acc,
      [id]: {
        ...game.stones[id],
        stone: {
          ...game.stones[id].stone,
          minedAt: createdAt - 12 * 60 * 60 * 1000,
        },
      },
    };
  }, {} as GameState["stones"]);

  game.iron = getKeys(game.iron).reduce((acc, id) => {
    return {
      ...acc,
      [id]: {
        ...game.iron[id],
        stone: {
          ...game.iron[id].stone,
          minedAt: createdAt - 24 * 60 * 60 * 1000,
        },
      },
    };
  }, {} as GameState["iron"]);

  game.gold = getKeys(game.gold).reduce((acc, id) => {
    return {
      ...acc,
      [id]: {
        ...game.gold[id],
        stone: {
          ...game.gold[id].stone,
          minedAt: createdAt - 48 * 60 * 60 * 1000,
        },
      },
    };
  }, {} as GameState["gold"]);

  game.crimstones = getKeys(game.crimstones).reduce((acc, id) => {
    return {
      ...acc,
      [id]: {
        ...game.crimstones[id],
        stone: {
          ...game.crimstones[id].stone,
          minedAt: createdAt - CRIMSTONE_RECOVERY_TIME * 1000,
        },
      },
    };
  }, {} as GameState["crimstones"]);

  // Add any rewards
  const rewards = getRewards({ game, createdAt });
  const previous = game.airdrops ?? [];
  game.airdrops = [...previous, ...rewards];

  return {
    ...game,
    inventory,
  };
}

export const expansionRequirements = ({ game }: { game: GameState }) => {
  const level = (game.inventory["Basic Land"]?.toNumber() ?? 3) + 1;

  const requirements = EXPANSION_REQUIREMENTS[game.island.type][level];

  if (!requirements) {
    return undefined;
  }

  let resources = requirements.resources;

  // Half resource costs
  if (isCollectibleBuilt({ name: "Grinx's Hammer", game })) {
    resources = getKeys(resources).reduce(
      (acc, key) => ({
        ...acc,
        [key]:
          key === "Block Buck" ? resources[key] : (resources[key] ?? 0) / 2,
      }),
      {}
    );
  }

  return {
    ...requirements,
    resources,
  };
};

export function getRewards({
  game,
  createdAt,
}: {
  game: GameState;
  createdAt: number;
}): Airdrop[] {
  const { inventory } = game;

  const expansions = inventory["Basic Land"] ?? new Decimal(0);

  let airdrops: Airdrop[] = [];

  // Tutorial Reward
  if (expansions.eq(4) && game.island.type === "basic") {
    airdrops = [
      ...airdrops,
      {
        createdAt,
        id: "expansion-four-airdrop",
        items: {
          Shovel: 1,
          "Block Buck": 1,
        },
        sfl: 0,
        coins: 0,
        wearables: {},
        coordinates: {
          x: 0,
          y: 8,
        },
      },
    ];
  }

  // Tutorial Reward
  if (expansions.eq(5) && game.island.type === "basic") {
    airdrops = [
      ...airdrops,
      {
        createdAt,
        id: "expansion-fifth-airdrop",
        items: {
          "Time Warp Totem": 1,
          "Block Buck": 1,
        },
        sfl: 0,
        coins: 0,
        wearables: {},
        coordinates: {
          x: -7,
          y: 7,
        },
      },
    ];
  }

  const blockBuckAirdrop = {
    createdAt,
    items: {
      "Block Buck": 1,
    },
    sfl: 0,
    coins: 0,
    wearables: {},
  };

  if (expansions.eq(6) && game.island.type === "basic") {
    airdrops = [
      ...airdrops,
      {
        ...blockBuckAirdrop,
        coordinates: { x: -7, y: 0 },
        id: "expansion-six-airdrop",
      },
    ];
  }

  if (expansions.eq(7) && game.island.type === "basic") {
    airdrops = [
      ...airdrops,
      {
        ...blockBuckAirdrop,
        coordinates: { x: -7, y: -3 },
        id: "expansion-seven-airdrop",
      },
    ];
  }

  if (expansions.eq(8) && game.island.type === "basic") {
    airdrops = [
      ...airdrops,
      {
        ...blockBuckAirdrop,
        coordinates: { x: -1, y: -3 },
        id: "expansion-eight-airdrop",
      },
    ];
  }
  if (expansions.eq(9) && game.island.type === "basic") {
    airdrops = [
      ...airdrops,
      {
        ...blockBuckAirdrop,
        coordinates: { x: 6, y: -5 },
        id: "expansion-nine-airdrop",
      },
    ];
  }

  // Expansion Refunds
  if (game.island.type === "spring") {
    const expectedLand = expansions.add(5);

    if (expectedLand.lte(game.island.previousExpansions ?? 0)) {
      const refund = EXPANSION_REQUIREMENTS.basic[expectedLand.toNumber()];

      const expansionBoundaries = {
        x: EXPANSION_ORIGINS[expansions.toNumber() - 1].x - LAND_SIZE / 2,
        y: EXPANSION_ORIGINS[expansions.toNumber() - 1].y + LAND_SIZE / 2,
        width: LAND_SIZE,
        height: LAND_SIZE,
      };

      const position = pickEmptyPosition({
        gameState: game,
        bounding: expansionBoundaries,
      });

      airdrops = [
        ...airdrops,
        {
          createdAt,
          id: `expansion-refund-${expectedLand.toNumber()}`,
          items: refund.resources,
          sfl: 0,
          coins: 0,
          wearables: {},
          message: "You are on OG expander, here's a reward!",
          coordinates: position && {
            x: position.x,
            y: position.y,
          },
        },
      ];
    }
  }

  // Expansion Desert Refunds
  if (game.island.type === "desert") {
    // Expansion 5 on desert should refund expansion 17 of spring island
    const expectedLand = expansions.add(12);

    if (expectedLand.lte(game.island.previousExpansions ?? 0)) {
      const refund = EXPANSION_REQUIREMENTS.spring[expectedLand.toNumber()];

      const expansionBoundaries = {
        x: EXPANSION_ORIGINS[expansions.toNumber() - 1].x - LAND_SIZE / 2,
        y: EXPANSION_ORIGINS[expansions.toNumber() - 1].y + LAND_SIZE / 2,
        width: LAND_SIZE,
        height: LAND_SIZE,
      };

      const position = pickEmptyPosition({
        gameState: game,
        bounding: expansionBoundaries,
      });

      airdrops = [
        ...airdrops,
        {
          createdAt,
          id: `desert-expansion-refund-${expectedLand.toNumber()}`,
          items: refund.resources,
          sfl: 0,
          coins: 0,
          wearables: {},
          message: "You are a Petal Paradise expander, here's a reward!",
          coordinates: position && {
            x: position.x,
            y: position.y,
          },
        },
      ];
    }
  }

  return airdrops;
}
