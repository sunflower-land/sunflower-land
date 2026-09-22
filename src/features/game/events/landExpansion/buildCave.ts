import Decimal from "decimal.js-light";
import { produce } from "immer";
import type { GameState, InventoryItemName } from "features/game/types/game";
import { hasRequiredIslandExpansion } from "features/game/lib/hasRequiredIslandExpansion";
import { hasFeatureAccess } from "lib/flags";
import { getKeys } from "lib/object";

export enum BUILD_CAVE_ERRORS {
  NO_FEATURE_ACCESS = "The Cave is not available for this player",
  NOT_ON_SPRING = "The Cave is only available from Spring island onwards",
  ALREADY_BUILT = "The Cave has already been built",
  INSUFFICIENT_COINS = "Not enough coins to build the Cave",
  INSUFFICIENT_INVENTORY = "Not enough resources to build the Cave",
}

type BuildCost = {
  coins: number;
  inventory: Partial<Record<InventoryItemName, Decimal>>;
};

/**
 * Placeholder entrance cost — the real values come from balance ticket 415.
 */
export const CAVE_BUILD_REQUIREMENTS: BuildCost = {
  coins: 5000,
  inventory: {
    Wood: new Decimal(100),
    Stone: new Decimal(50),
  },
};

export type CaveBuiltAction = {
  type: "cave.built";
};

type Options = {
  state: Readonly<GameState>;
  action: CaveBuiltAction;
  createdAt?: number;
};

function chargeCost(state: GameState, cost: BuildCost): void {
  if (state.coins < cost.coins) {
    throw new Error(BUILD_CAVE_ERRORS.INSUFFICIENT_COINS);
  }
  for (const item of getKeys(cost.inventory)) {
    const required = cost.inventory[item] ?? new Decimal(0);
    const owned = state.inventory[item] ?? new Decimal(0);
    if (owned.lt(required)) {
      throw new Error(BUILD_CAVE_ERRORS.INSUFFICIENT_INVENTORY);
    }
  }
  // All checks passed — deduct.
  state.coins -= cost.coins;
  for (const item of getKeys(cost.inventory)) {
    const required = cost.inventory[item] ?? new Decimal(0);
    const owned = state.inventory[item] ?? new Decimal(0);
    state.inventory[item] = owned.minus(required);
  }
}

export function buildCave({
  state,
  action: _action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    if (!hasFeatureAccess(game, "CAVE")) {
      throw new Error(BUILD_CAVE_ERRORS.NO_FEATURE_ACCESS);
    }
    if (!hasRequiredIslandExpansion(game.island.type, "spring")) {
      throw new Error(BUILD_CAVE_ERRORS.NOT_ON_SPRING);
    }
    if (game.cave) {
      throw new Error(BUILD_CAVE_ERRORS.ALREADY_BUILT);
    }

    chargeCost(game, CAVE_BUILD_REQUIREMENTS);

    game.cave = {
      builtAt: createdAt,
      tier: 1,
      machines: { "1": {} },
    };
  });
}
