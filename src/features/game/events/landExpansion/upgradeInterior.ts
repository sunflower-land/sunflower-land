import Decimal from "decimal.js-light";
import { produce } from "immer";
import {
  GameState,
  HomeExpansionTier,
  InventoryItemName,
} from "features/game/types/game";
import { nextHomeExpansionTier } from "features/game/expansion/placeable/lib/interiorLayouts";
import {
  HOME_EXPANSION_UPGRADE_REQUIREMENTS,
  UpgradeCost,
} from "features/interior/lib/upgradeRequirements";
import { getKeys } from "lib/object";
import { hasFeatureAccess } from "lib/flags";

export enum UPGRADE_INTERIOR_ERRORS {
  NO_ACCESS = "Home expansions are not available for this player",
  NOT_ON_VOLCANO = "Interior upgrades are only available on volcano island",
  ALREADY_MAXED = "Interior is already at maximum tier (level-one-full)",
  INSUFFICIENT_COINS = "Not enough coins to perform this upgrade",
  INSUFFICIENT_INVENTORY = "Not enough inventory items to perform this upgrade",
}

export type UpgradeInteriorAction = {
  type: "interior.upgrade";
};

type Options = {
  state: Readonly<GameState>;
  action: UpgradeInteriorAction;
  createdAt?: number;
};

/**
 * Determines which tier the player is upgrading TO.
 *
 *   - No `interior.expansion` yet → first upgrade unlocks "level-one-start".
 *   - Otherwise → the next tier after `interior.expansion`, or null if they
 *     are already at "level-one-full".
 */
function nextTierFor(state: GameState): HomeExpansionTier | null {
  const current = state.interior.expansion;
  if (!current) return "level-one-start";
  return nextHomeExpansionTier(current);
}

function chargeCost(state: GameState, cost: UpgradeCost): void {
  // Coins
  if (state.coins < cost.coins) {
    throw new Error(UPGRADE_INTERIOR_ERRORS.INSUFFICIENT_COINS);
  }
  // Inventory items
  for (const item of getKeys(cost.inventory)) {
    const required = cost.inventory[item] ?? new Decimal(0);
    const owned = state.inventory[item] ?? new Decimal(0);
    if (owned.lt(required)) {
      throw new Error(UPGRADE_INTERIOR_ERRORS.INSUFFICIENT_INVENTORY);
    }
  }
  // All checks passed — deduct.
  state.coins -= cost.coins;
  for (const item of getKeys(cost.inventory)) {
    const required = cost.inventory[item] ?? new Decimal(0);
    const owned = state.inventory[item] ?? new Decimal(0);
    state.inventory[item as InventoryItemName] = owned.minus(required);
  }
}

export function upgradeInterior({
  state,
  action: _action,
}: Options): GameState {
  return produce(state, (game) => {
    if (!hasFeatureAccess(game, "HOME_EXPANSIONS")) {
      throw new Error(UPGRADE_INTERIOR_ERRORS.NO_ACCESS);
    }
    if (game.island.type !== "volcano") {
      throw new Error(UPGRADE_INTERIOR_ERRORS.NOT_ON_VOLCANO);
    }

    const target = nextTierFor(game);
    if (!target) {
      throw new Error(UPGRADE_INTERIOR_ERRORS.ALREADY_MAXED);
    }

    const cost = HOME_EXPANSION_UPGRADE_REQUIREMENTS[target];
    chargeCost(game, cost);

    // Advance the expansion tier (lives on `interior` so it can be reused
    // across future levels).
    game.interior.expansion = target;

    // Bootstrap the level_one floor on first upgrade. Subsequent upgrades
    // just keep the existing collectibles in place.
    if (!game.interior.level_one) {
      game.interior.level_one = { collectibles: {} };
    }
  });
}
