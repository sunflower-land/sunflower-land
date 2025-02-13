import { ResourceName } from "features/game/types/resources";
import { GameState, InventoryItemName } from "../../types/game";

import { produce } from "immer";
import Decimal from "decimal.js-light";
import { trackFarmActivity } from "features/game/types/farmActivity";
import { getObjectEntries } from "features/game/expansion/lib/utils";
import { IslandType } from "features/game/types/game";
import { hasRequiredIslandExpansion } from "features/game/lib/hasRequiredIslandExpansion";

export type ResourceBoughtAction = {
  type: "resource.bought";
  name: ResourceName;
};

type Options = {
  state: Readonly<GameState>;
  action: ResourceBoughtAction;
  createdAt?: number;
};

type ResourceNode = {
  items: Partial<Record<InventoryItemName, number>>;
  price: number;
  increase: number;
  requiredIsland: IslandType;
};

export const RESOURCE_NODE_PRICES: Partial<Record<ResourceName, ResourceNode>> =
  {
    "Crop Plot": {
      items: { "Crop Plot": 1 },
      price: 3,
      increase: 2,
      requiredIsland: "basic",
    },
    Tree: {
      items: { Tree: 1 },
      price: 4,
      increase: 3,
      requiredIsland: "basic",
    },
    "Stone Rock": {
      items: { "Stone Rock": 1 },
      price: 4,
      increase: 3,
      requiredIsland: "basic",
    },
    "Fruit Patch": {
      items: { "Fruit Patch": 1 },
      price: 5,
      increase: 5,
      requiredIsland: "spring",
    },
    "Iron Rock": {
      items: { "Iron Rock": 1 },
      price: 7,
      increase: 5,
      requiredIsland: "basic",
    },
    "Gold Rock": {
      items: { "Gold Rock": 1 },
      price: 10,
      increase: 6,
      requiredIsland: "basic",
    },
    "Crimstone Rock": {
      items: { "Crimstone Rock": 1 },
      price: 20,
      increase: 20,
      requiredIsland: "spring",
    },
    "Flower Bed": {
      items: { "Flower Bed": 1, Beehive: 1 },
      price: 30,
      increase: 25,
      requiredIsland: "spring",
    },
    "Oil Reserve": {
      items: { "Oil Reserve": 1 },
      price: 40,
      increase: 20,
      requiredIsland: "desert",
    },
    "Lava Pit": {
      items: { "Lava Pit": 1 },
      price: 40,
      increase: 40,
      requiredIsland: "volcano",
    },
  };

export function getResourcePrice({
  gameState,
  resourceName,
}: {
  gameState: GameState;
  resourceName: ResourceName;
}): number {
  const bought = gameState.farmActivity[`${resourceName} Bought`] ?? 0;

  const node = RESOURCE_NODE_PRICES[resourceName];

  // Edge case protection
  if (!node) return 999999;
  const { price, increase } = node;

  return price + bought * increase;
}

export function buyResource({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    const node = RESOURCE_NODE_PRICES[action.name];

    if (!node) {
      throw new Error("Resource not for sale");
    }

    if (!hasRequiredIslandExpansion(game.island.type, node.requiredIsland)) {
      throw new Error("Not in the right island expansion");
    }

    const price = getResourcePrice({
      gameState: state,
      resourceName: action.name,
    });

    const sunstones = game.inventory.Sunstone ?? new Decimal(0);

    if (sunstones.lt(price)) {
      throw new Error("Not enough sunstones");
    }

    game.inventory.Sunstone = sunstones.sub(price);

    getObjectEntries(node.items).forEach(([item, amount]) => {
      game.inventory[item] = (game.inventory[item] ?? new Decimal(0)).add(
        amount ?? 0,
      );
    });

    game.farmActivity = trackFarmActivity(
      `${action.name} Bought`,
      game.farmActivity,
    );

    return game;
  });
}
