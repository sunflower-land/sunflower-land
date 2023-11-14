import { v4 as randomUUID } from "uuid";
import Decimal from "decimal.js-light";
import { EXPANSION_ORIGINS } from "features/game/expansion/lib/constants";
import { expansionRequirements, getLand } from "features/game/types/expansions";
import { GameState } from "features/game/types/game";

import cloneDeep from "lodash.clonedeep";
import { getKeys } from "features/game/types/craftables";

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

  const nextLand = (game.inventory["Basic Land"]?.toNumber() ?? 0) + 1;
  const land = getLand(farmId, nextLand);
  if (!land) {
    throw new Error("Land Does Not Exists");
  }

  const { inventory } = game;

  inventory["Basic Land"] = (inventory["Basic Land"] ?? new Decimal(0)).add(1);

  const landCount = inventory["Basic Land"].toNumber();
  const origin = EXPANSION_ORIGINS[landCount - 1];

  delete game.expansionConstruction;
  // TODO: Update expansion requirements for next expansion
  //   game.expansionRequirements = makeExpansionRequirements(landCount + 1);

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

  if (inventory["Basic Land"].eq(4)) {
    game.airdrops?.push({
      createdAt,
      id: "expansion-four-airdrop",
      items: {
        Shovel: 1,
      },
      sfl: 0,
      wearables: {},
      coordinates: {
        x: -1,
        y: 5,
      },
    });
  }

  if (inventory["Basic Land"].eq(5)) {
    game.airdrops?.push({
      createdAt,
      id: "expansion-fifth-airdrop",
      items: {
        "Time Warp Totem": 1,
      },
      sfl: 0,
      wearables: {},
      coordinates: {
        x: -7,
        y: 7,
      },
    });
  }

  // Refresh all resources
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

  game.expansionRequirements = expansionRequirements(
    inventory["Basic Land"].toNumber() + 1
  );

  return {
    ...game,
    inventory,
  };
}
