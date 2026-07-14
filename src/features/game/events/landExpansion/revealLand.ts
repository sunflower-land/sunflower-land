import { v4 as randomUUID } from "uuid";
import Decimal from "decimal.js-light";
import {
  EXPANSION_ORIGINS,
  LAND_SIZE,
} from "features/game/expansion/lib/constants";
import {
  EXPANSION_REQUIREMENTS,
  getLand,
  getMissingResources,
  SUNSTONE_MINES,
} from "features/game/types/expansions";
import type { Airdrop, GameState } from "features/game/types/game";
import { hasFeatureAccess } from "lib/flags";

import { getKeys } from "lib/object";
import { pickEmptyPosition } from "features/game/expansion/placeable/lib/collisionDetection";
import { reAnchorToIsland } from "features/game/expansion/lib/island";
import type { CropName } from "features/game/types/crops";
import { produce } from "immer";
import {
  CRIMSTONE_RECOVERY_TIME,
  GOLD_RECOVERY_TIME,
  IRON_RECOVERY_TIME,
  STONE_RECOVERY_TIME,
  TREE_RECOVERY_TIME,
} from "features/game/lib/constants";
import { OIL_RESERVE_RECOVERY_TIME } from "./drillOilReserve";

// Preloaded crops that will appear on plots when they reveal
const EXPANSION_CROPS: Record<number, CropName> = {
  4: "Sunflower",
  5: "Rhubarb", // Spring-available crop for early cooking tutorial
  6: "Pumpkin",
  7: "Carrot",
  8: "Cabbage",
  9: "Cauliflower",
  10: "Kale",
  11: "Radish",
  12: "Eggplant",
  13: "Parsnip",
};

export type RevealLandAction = {
  type: "land.revealed";
};

type Options = {
  state: Readonly<GameState>;
  action: RevealLandAction;
  createdAt?: number;
};

/**
 * Completes a pending land expansion by populating the game board with entities and computing rewards.
 *
 * Establishes all entities from the revealed land layout, updates inventory counts, resets resource recovery timers, and calculates expansion rewards. Repositions the mushroom island if present and adds a Fire Pit building upon the 5th expansion.
 *
 * @param state - The current game state
 * @param createdAt - Timestamp for entity and structure creation; defaults to `Date.now()`
 * @returns The updated game state with new entities and calculated rewards
 * @throws When expansion construction is not active
 * @throws When the land layout cannot be found
 */
export function revealLand({ state, createdAt = Date.now() }: Options) {
  return produce(state, (game) => {
    if (!game.expansionConstruction) {
      throw new Error("Land is not in construction");
    }

    // getLand returns null for layouts retired by the cap refactor (basic
    // 10-23, spring 17-20). A pending construction for one of those rows would
    // surface here — not expected, as those were UI-capped (basic 9 / spring 16)
    // long ago and constructions are short-lived.
    const land = getLand({ game });
    if (!land) {
      throw new Error("Land Does Not Exists");
    }

    const { inventory } = game;

    inventory["Basic Land"] = (inventory["Basic Land"] ?? new Decimal(0)).add(
      1,
    );

    const landCount = inventory["Basic Land"].toNumber();
    const origin = EXPANSION_ORIGINS[landCount - 1];

    delete game.expansionConstruction;

    // The mushroom island shifts left with the new land edge — pull island
    // mushrooms onto its current tiles so they aren't left stranded in the
    // water. Mushrooms on the main land stay where they are.
    if (game.mushrooms) {
      game.mushrooms.mushrooms = reAnchorToIsland(
        game.mushrooms.mushrooms,
        landCount,
      );
    }

    // Add Trees
    land.trees?.forEach((coords) => {
      game.trees[randomUUID().slice(0, 8)] = {
        x: coords.x + origin.x,
        y: coords.y + origin.y,
        wood: { choppedAt: 0 },
      };
    });
    inventory.Tree = (inventory.Tree || new Decimal(0)).add(land.trees.length);

    // Add Stones
    land.stones?.forEach((coords) => {
      game.stones[randomUUID().slice(0, 8)] = {
        x: coords.x + origin.x,
        y: coords.y + origin.y,
        stone: { minedAt: 0 },
      };
    });
    inventory["Stone Rock"] = (inventory["Stone Rock"] || new Decimal(0)).add(
      land.stones.length,
    );

    // Add Iron
    land.iron?.forEach((coords) => {
      game.iron[randomUUID().slice(0, 8)] = {
        x: coords.x + origin.x,
        y: coords.y + origin.y,
        stone: { minedAt: 0 },
      };
    });
    inventory["Iron Rock"] = (inventory["Iron Rock"] || new Decimal(0)).add(
      land.iron?.length ?? 0,
    );

    // Add Gold
    land.gold?.forEach((coords) => {
      game.gold[randomUUID().slice(0, 8)] = {
        x: coords.x + origin.x,
        y: coords.y + origin.y,
        stone: { minedAt: 0 },
      };
    });
    inventory["Gold Rock"] = (inventory["Gold Rock"] || new Decimal(0)).add(
      land.gold?.length ?? 0,
    );

    // Add Crimstone
    land.crimstones?.forEach((coords) => {
      game.crimstones[randomUUID().slice(0, 8)] = {
        x: coords.x + origin.x,
        y: coords.y + origin.y,
        stone: { minedAt: 0 },
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
        x: coords.x + origin.x,
        y: coords.y + origin.y,
        crop: {
          name: EXPANSION_CROPS[landCount] ?? "Sunflower",
          plantedAt: 0,
        },
      };
    });

    inventory["Crop Plot"] = (inventory["Crop Plot"] || new Decimal(0)).add(
      land.plots?.length ?? 0,
    );

    // Add Fruit patches
    land.fruitPatches?.forEach((coords) => {
      game.fruitPatches[randomUUID().slice(0, 8)] = {
        createdAt: Date.now(),
        x: coords.x + origin.x,
        y: coords.y + origin.y,
        fruit: {
          harvestedAt: 0,
          harvestsLeft: 3,
          name: "Apple",
          plantedAt: 0,
        },
      };
    });
    inventory["Fruit Patch"] = (inventory["Fruit Patch"] || new Decimal(0)).add(
      land.fruitPatches?.length ?? 0,
    );

    // Add sun stones
    land.sunstones?.forEach((coords) => {
      const id = randomUUID();
      game.sunstones[id] = {
        x: coords.x + origin.x,
        y: coords.y + origin.y,
        stone: { minedAt: 0 },
        minesLeft: SUNSTONE_MINES,
      };
    });
    inventory["Sunstone Rock"] = (
      inventory["Sunstone Rock"] || new Decimal(0)
    ).add(land.sunstones?.length ?? 0);

    // Add Ascension Crystals (single-use nodes; placed by getAscensionLayout on
    // the first N expansions of an ascension band — see getExpansionCrystalCount).
    // Gated by the feature flag so the forward grant can never run while the
    // ascension system is disabled (the back-pay reconciliation is gated too).
    if (
      hasFeatureAccess(game, "SWAMP_ASCENSION") &&
      land.ascensionCrystals?.length
    ) {
      game.ascensionCrystals = game.ascensionCrystals ?? {};
      land.ascensionCrystals.forEach((coords) => {
        game.ascensionCrystals[randomUUID()] = {
          x: coords.x + origin.x,
          y: coords.y + origin.y,
          stone: { minedAt: 0 },
          minesLeft: 1,
        };
      });
      inventory["Ascension Crystal"] = (
        inventory["Ascension Crystal"] || new Decimal(0)
      ).add(land.ascensionCrystals.length);
    }

    // Add bee hives
    land.beehives?.forEach((coords) => {
      const id = randomUUID();
      game.beehives[id] = {
        x: coords.x + origin.x,
        y: coords.y + origin.y,
        honey: { produced: 0, updatedAt: Date.now() },
        flowers: [],
        swarm: false,
      };
    });
    inventory.Beehive = (inventory.Beehive || new Decimal(0)).add(
      land.beehives?.length ?? 0,
    );

    // Add flower beds
    land.flowerBeds?.forEach((coords) => {
      const id = randomUUID();
      game.flowers.flowerBeds[id] = {
        x: coords.x + origin.x,
        y: coords.y + origin.y,
        createdAt,
      };
    });
    inventory["Flower Bed"] = (inventory["Flower Bed"] || new Decimal(0)).add(
      land.flowerBeds?.length ?? 0,
    );

    land.oilReserves?.forEach((coords) => {
      const id = randomUUID();
      game.oilReserves[id] = {
        x: coords.x + origin.x,
        y: coords.y + origin.y,
        createdAt,
        drilled: 0,
        oil: {
          drilledAt: 0,
        },
      };
    });
    inventory["Oil Reserve"] = (inventory["Oil Reserve"] || new Decimal(0)).add(
      land.oilReserves?.length ?? 0,
    );

    // Add lava pits
    land.lavaPits?.forEach((coords) => {
      const id = randomUUID();
      game.lavaPits[id] = {
        x: coords.x + origin.x,
        y: coords.y + origin.y,
        createdAt,
      };
    });
    inventory["Lava Pit"] = (inventory["Lava Pit"] || new Decimal(0)).add(
      land.lavaPits?.length ?? 0,
    );

    // Replenish all trees
    game.trees = getKeys(game.trees).reduce<GameState["trees"]>((acc, id) => {
      return {
        ...acc,
        [id]: {
          ...game.trees[id],
          wood: {
            ...game.trees[id].wood,
            choppedAt:
              (game.trees[id].removedAt ?? createdAt) -
              TREE_RECOVERY_TIME * 1000,
          },
        },
      };
    }, {});

    game.stones = getKeys(game.stones).reduce<GameState["stones"]>(
      (acc, id) => {
        return {
          ...acc,
          [id]: {
            ...game.stones[id],
            stone: {
              ...game.stones[id].stone,
              minedAt:
                (game.stones[id].removedAt ?? createdAt) -
                STONE_RECOVERY_TIME * 1000,
            },
          },
        };
      },
      {},
    );

    game.iron = getKeys(game.iron).reduce<GameState["iron"]>((acc, id) => {
      return {
        ...acc,
        [id]: {
          ...game.iron[id],
          stone: {
            ...game.iron[id].stone,
            minedAt:
              (game.iron[id].removedAt ?? createdAt) -
              IRON_RECOVERY_TIME * 1000,
          },
        },
      };
    }, {});

    game.gold = getKeys(game.gold).reduce<GameState["gold"]>((acc, id) => {
      return {
        ...acc,
        [id]: {
          ...game.gold[id],
          stone: {
            ...game.gold[id].stone,
            minedAt:
              (game.gold[id].removedAt ?? createdAt) -
              GOLD_RECOVERY_TIME * 1000,
          },
        },
      };
    }, {});

    game.crimstones = getKeys(game.crimstones).reduce<GameState["crimstones"]>(
      (acc, id) => {
        return {
          ...acc,
          [id]: {
            ...game.crimstones[id],
            stone: {
              ...game.crimstones[id].stone,
              minedAt:
                (game.crimstones[id].removedAt ?? createdAt) -
                CRIMSTONE_RECOVERY_TIME * 1000,
            },
          },
        };
      },
      {},
    );

    game.oilReserves = getKeys(game.oilReserves).reduce<
      GameState["oilReserves"]
    >((acc, id) => {
      return {
        ...acc,
        [id]: {
          ...game.oilReserves[id],
          oil: {
            ...game.oilReserves[id].oil,
            drilledAt:
              (game.oilReserves[id].removedAt ?? createdAt) -
              OIL_RESERVE_RECOVERY_TIME * 1000,
          },
        },
      };
    }, {});

    // Add fire pit on expansion 5
    if (landCount >= 5 && !game.inventory["Fire Pit"]) {
      game.inventory["Fire Pit"] = new Decimal(1);
      game.buildings["Fire Pit"] = [
        {
          coordinates: { x: -6, y: 8 },
          createdAt,
          id: "123",
          readyAt: createdAt,
        },
      ];
    }

    // Add any rewards
    const rewards = getRewards({ game, createdAt });
    const previous = game.airdrops ?? [];
    game.airdrops = [...previous, ...rewards];

    game.inventory = inventory;
    return game;
  });
}

/**
 * Generates airdrops for expansion milestones, refunds for returning players, and missing resource compensation.
 *
 * Grants milestone rewards at specific expansion counts on basic islands. On spring and desert islands,
 * provides refunds if the player previously expanded further on a different island. Computes and grants
 * any resources the player is missing based on the current expansion level, accounting for resources
 * already promised but not yet collected.
 *
 * @param game - The game state to evaluate
 * @param createdAt - The timestamp for created airdrops
 * @returns An array of airdrops granted by this expansion
 */
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

  if (expansions.eq(6) && game.island.type === "basic") {
    airdrops = [
      ...airdrops,
      {
        createdAt,
        id: "expansion-sixth-airdrop",
        items: {
          "Time Warp Totem": 1,
          Gem: 20,
        },
        message: "Woohoo, you discovered a gift!",
        sfl: 0,
        coins: 0,
        wearables: {},
        coordinates: {
          x: -7,
          y: -2,
        },
      },
    ];
  }

  const blockBuckAirdrop = {
    createdAt,
    items: {
      Gem: 20,
    },
    sfl: 0,
    coins: 0,
    wearables: {},
  };

  if (expansions.eq(7) && game.island.type === "basic") {
    airdrops = [
      ...airdrops,
      {
        createdAt,
        items: {},
        sfl: 0.1,
        coins: 0,
        wearables: {},
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

  // Shared back-pay reconciliation (also used by the ascension reward chest):
  // expected-vs-owned per-tier, minus what an un-collected missing-resources
  // airdrop already promises, crediting depleted sunstones / mined crystals.
  const missingNodes = getMissingResources({
    game,
    expansion: expansions.toNumber(),
  });

  const hasMissing = getKeys(missingNodes).some(
    (key) => (missingNodes[key] ?? 0) > 0,
  );
  if (hasMissing) {
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
        id: `missing-resources-${expansions.toNumber()}`,
        // getMissingResources already returns only positive shortfalls.
        items: { ...missingNodes },
        sfl: 0,
        coins: 0,
        wearables: {},
        message: "Congratulations, you found some bonus resources!",
        coordinates: position && {
          x: position.x,
          y: position.y,
        },
      },
    ];
  }

  return airdrops;
}
