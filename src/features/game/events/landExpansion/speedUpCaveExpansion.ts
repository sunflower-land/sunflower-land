import Decimal from "decimal.js-light";
import { produce } from "immer";
import type { GameState } from "features/game/types/game";
import { hasFeatureAccess } from "lib/flags";
import {
  chargeCoinsForSpeedUp,
  getInstantGems,
  makeGemHistory,
  type SpeedUpPaymentMethod,
} from "features/game/lib/getInstantGems";

export type SpeedUpCaveExpansionAction = {
  type: "cave.expansionSpedUp";
  paymentMethod?: SpeedUpPaymentMethod;
};

type Options = {
  state: Readonly<GameState>;
  action: SpeedUpCaveExpansionAction;
  createdAt?: number;
};

export enum SPEED_UP_CAVE_EXPANSION_ERRORS {
  NO_FEATURE_ACCESS = "The Cave is not available for this player",
  NO_CONSTRUCTION = "The Cave is not being expanded",
  ALREADY_READY = "The Cave expansion is already ready",
  INSUFFICIENT_GEMS = "Insufficient Gems",
}

/**
 * Gem-finish the Cave's expansion. Collapses the timer to now; the player
 * still completes it with `cave.expansionCompleted`.
 */
export function speedUpCaveExpansion({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    if (!hasFeatureAccess(game, "CAVE")) {
      throw new Error(SPEED_UP_CAVE_EXPANSION_ERRORS.NO_FEATURE_ACCESS);
    }

    const construction = game.cave?.construction;
    if (!construction) {
      throw new Error(SPEED_UP_CAVE_EXPANSION_ERRORS.NO_CONSTRUCTION);
    }
    if (construction.readyAt <= createdAt) {
      throw new Error(SPEED_UP_CAVE_EXPANSION_ERRORS.ALREADY_READY);
    }

    const gems = getInstantGems({
      readyAt: construction.readyAt,
      now: createdAt,
      game,
    });

    if (action.paymentMethod === "coins") {
      game = chargeCoinsForSpeedUp({ game, gems, createdAt });
    } else {
      if (!game.inventory["Gem"]?.gte(gems)) {
        throw new Error(SPEED_UP_CAVE_EXPANSION_ERRORS.INSUFFICIENT_GEMS);
      }
      game.inventory["Gem"] = (game.inventory["Gem"] ?? new Decimal(0)).sub(
        gems,
      );
      game = makeGemHistory({ game, amount: gems, createdAt });
    }

    game.cave!.construction!.readyAt = createdAt;

    return game;
  });
}
