import { ResourceName } from "features/game/types/resources";
import { GameState } from "../../types/game";

import { produce } from "immer";
import Decimal from "decimal.js-light";
import { trackFarmActivity } from "features/game/types/farmActivity";
import { hasFeatureAccess } from "lib/flags";

export type ResourceBoughtAction = {
  type: "resource.bought";
  name: ResourceName;
};

type Options = {
  state: Readonly<GameState>;
  action: ResourceBoughtAction;
  createdAt?: number;
};

export const RESOURCE_NODE_PRICES: Partial<
  Record<ResourceName, { price: number; increase: number }>
> = {
  "Crop Plot": { price: 3, increase: 2 },
  Tree: { price: 4, increase: 3 },
  "Stone Rock": { price: 4, increase: 3 },
  "Fruit Patch": { price: 5, increase: 5 },
  "Iron Rock": { price: 7, increase: 5 },
  "Gold Rock": { price: 10, increase: 6 },
  "Crimstone Rock": { price: 20, increase: 20 },
  Beehive: { price: 20, increase: 20 },
  "Flower Bed": { price: 20, increase: 20 },
  "Oil Reserve": { price: 40, increase: 20 },
  "Lava Pit": { price: 40, increase: 40 },
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

  return node.price + bought * node.increase;
}

export function buyResource({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    const node = RESOURCE_NODE_PRICES[action.name];

    if (!hasFeatureAccess(game, "VOLCANO_ISLAND")) {
      throw new Error("Volcano Island not unlocked");
    }

    if (!node) {
      throw new Error("Resource not for sale");
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
    game.inventory[action.name] = (
      game.inventory[action.name] ?? new Decimal(0)
    ).add(1);

    game.farmActivity = trackFarmActivity(
      `${action.name} Bought`,
      game.farmActivity,
    );

    return game;
  });
}
