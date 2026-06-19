import type { GameState } from "features/game/types/game";
import { produce } from "immer";
import {
  chargeCoinsForSpeedUp,
  getInstantGems,
  makeGemHistory,
  type SpeedUpPaymentMethod,
} from "features/game/lib/getInstantGems";
import Decimal from "decimal.js-light";
import { hasRequiredIslandExpansion } from "features/game/lib/hasRequiredIslandExpansion";
import { hasFeatureAccess } from "lib/flags";

export type InstantExpand = {
  type: "expansion.spedUp";
  paymentMethod?: SpeedUpPaymentMethod;
};

type Options = {
  state: Readonly<GameState>;
  action: InstantExpand;
  createdAt?: number;
};

/**
 * Completes an in-progress expansion instantly by paying with gems or coins.
 *
 * @param action - Determines the payment method: "coins" to charge coins, or gems by default
 * @returns The updated game state with the expansion completed
 * @throws "Expansion not in progress" if no expansion is currently being constructed
 * @throws "You can't speed up the expansion on this island" if the current island type doesn't support expansion speedup
 * @throws "Expansion already complete" if the expansion is already done
 * @throws "Insufficient Gems" if paying with gems and the player doesn't have enough
 */
export function speedUpExpansion({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    const expansion = game.expansionConstruction;

    if (!expansion) {
      throw new Error("Expansion not in progress");
    }

    if (
      hasRequiredIslandExpansion(
        game.island.type,
        hasFeatureAccess(game, "SWAMP_ASCENSION") ? "swamp" : "desert",
      )
    ) {
      throw new Error("You can't speed up the expansion on this island");
    }

    if (expansion.readyAt <= createdAt) {
      throw new Error("Expansion already complete");
    }

    const gems = getInstantGems({
      readyAt: expansion.readyAt,
      now: createdAt,
      game,
    });

    if (action.paymentMethod === "coins") {
      game = chargeCoinsForSpeedUp({ game, gems, createdAt });
    } else {
      if (!game.inventory["Gem"]?.gte(gems)) {
        throw new Error("Insufficient Gems");
      }

      game.inventory["Gem"] = (game.inventory["Gem"] ?? new Decimal(0)).sub(
        gems,
      );

      game = makeGemHistory({ game, amount: gems, createdAt });
    }

    expansion.readyAt = createdAt;

    return game;
  });
}
