import Decimal from "decimal.js-light";
import { produce } from "immer";
import type { GameState } from "features/game/types/game";
import { hasRequiredIslandExpansion } from "features/game/lib/hasRequiredIslandExpansion";
import { hasFeatureAccess } from "lib/flags";
import { getKeys } from "lib/object";
import { CAVE_TIERS, getNextCaveTier } from "features/game/types/caveTiers";

export type ExpandCaveAction = {
  type: "cave.expanded";
};

type Options = {
  state: Readonly<GameState>;
  action: ExpandCaveAction;
  createdAt?: number;
};

export enum EXPAND_CAVE_ERRORS {
  NO_FEATURE_ACCESS = "The Cave is not available for this player",
  NO_CAVE = "The Cave has not been built",
  ALREADY_EXPANDING = "The Cave is already being expanded",
  MAX_TIER = "The Cave is fully expanded",
  ISLAND_TOO_LOW = "The next Cave tier needs a later island",
  INSUFFICIENT_COINS = "Not enough coins to expand the Cave",
  INSUFFICIENT_INVENTORY = "Not enough resources to expand the Cave",
}

/**
 * Start building the Cave's next tier. The cost is paid up front; the tier and
 * its Myco-Composter arrive with `cave.expansionCompleted` once built.
 */
export function expandCave({
  state,
  action: _action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    if (!hasFeatureAccess(game, "CAVE")) {
      throw new Error(EXPAND_CAVE_ERRORS.NO_FEATURE_ACCESS);
    }

    const cave = game.cave;
    if (!cave) {
      throw new Error(EXPAND_CAVE_ERRORS.NO_CAVE);
    }

    if (cave.construction) {
      throw new Error(EXPAND_CAVE_ERRORS.ALREADY_EXPANDING);
    }

    const tier = getNextCaveTier(cave.tier);
    if (!tier) {
      throw new Error(EXPAND_CAVE_ERRORS.MAX_TIER);
    }

    const { island, coins, ingredients, buildMs } = CAVE_TIERS[tier];
    if (!hasRequiredIslandExpansion(game.island.type, island)) {
      throw new Error(EXPAND_CAVE_ERRORS.ISLAND_TOO_LOW);
    }

    if (game.coins < coins) {
      throw new Error(EXPAND_CAVE_ERRORS.INSUFFICIENT_COINS);
    }
    for (const item of getKeys(ingredients)) {
      const owned = game.inventory[item] ?? new Decimal(0);
      if (owned.lt(ingredients[item] ?? 0)) {
        throw new Error(EXPAND_CAVE_ERRORS.INSUFFICIENT_INVENTORY);
      }
    }

    game.coins -= coins;
    for (const item of getKeys(ingredients)) {
      const owned = game.inventory[item] ?? new Decimal(0);
      game.inventory[item] = owned.minus(ingredients[item] ?? 0);
    }

    cave.construction = {
      tier,
      startedAt: createdAt,
      readyAt: createdAt + buildMs,
    };
  });
}
