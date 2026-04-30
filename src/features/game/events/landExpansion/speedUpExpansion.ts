import { GameState } from "features/game/types/game";
import { produce } from "immer";
import {
  chargeCoinsForSpeedUp,
  getInstantGems,
  makeGemHistory,
  SpeedUpPaymentMethod,
} from "features/game/lib/getInstantGems";
import Decimal from "decimal.js-light";
import { hasRequiredIslandExpansion } from "features/game/lib/hasRequiredIslandExpansion";

export type InstantExpand = {
  type: "expansion.spedUp";
  paymentMethod?: SpeedUpPaymentMethod;
};

type Options = {
  state: Readonly<GameState>;
  action: InstantExpand;
  createdAt?: number;
};

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

    if (hasRequiredIslandExpansion(game.island.type, "desert")) {
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
