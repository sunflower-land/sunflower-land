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

export type SpeedUpCaveBatchAction = {
  type: "cave.batchSpedUp";
  machineId: string;
  paymentMethod?: SpeedUpPaymentMethod;
};

type Options = {
  state: Readonly<GameState>;
  action: SpeedUpCaveBatchAction;
  createdAt?: number;
};

export enum SPEED_UP_CAVE_BATCH_ERRORS {
  NO_FEATURE_ACCESS = "The Cave is not available for this player",
  NO_BATCH = "That Myco-Composter has no batch to finish",
  ALREADY_READY = "That batch is already ready",
  INSUFFICIENT_GEMS = "Insufficient Gems",
}

/**
 * Gem-finish a growing batch. Collapses the timer to now — no reward is granted
 * (excavation in a later slice produces the buried items). Mirrors the BE.
 */
export function speedUpCaveBatch({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    if (!hasFeatureAccess(game, "CAVE")) {
      throw new Error(SPEED_UP_CAVE_BATCH_ERRORS.NO_FEATURE_ACCESS);
    }

    const batch = game.cave?.machines[action.machineId]?.batch;
    if (!batch) {
      throw new Error(SPEED_UP_CAVE_BATCH_ERRORS.NO_BATCH);
    }
    if (batch.readyAt <= createdAt) {
      throw new Error(SPEED_UP_CAVE_BATCH_ERRORS.ALREADY_READY);
    }

    const gems = getInstantGems({
      readyAt: batch.readyAt,
      now: createdAt,
      game,
    });

    if (action.paymentMethod === "coins") {
      game = chargeCoinsForSpeedUp({ game, gems, createdAt });
    } else {
      if (!game.inventory["Gem"]?.gte(gems)) {
        throw new Error(SPEED_UP_CAVE_BATCH_ERRORS.INSUFFICIENT_GEMS);
      }
      game.inventory["Gem"] = (game.inventory["Gem"] ?? new Decimal(0)).sub(
        gems,
      );
      game = makeGemHistory({ game, amount: gems, createdAt });
    }

    game.cave!.machines[action.machineId].batch!.readyAt = createdAt;

    return game;
  });
}
