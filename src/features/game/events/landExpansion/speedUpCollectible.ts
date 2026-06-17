import type { GameState } from "features/game/types/game";
import { produce } from "immer";
import type { CollectibleName } from "features/game/types/craftables";
import Decimal from "decimal.js-light";
import { getCollectiblesAcrossLocations } from "features/game/lib/collectibleBuilt";
import {
  chargeCoinsForSpeedUp,
  getInstantGems,
  makeGemHistory,
  type SpeedUpPaymentMethod,
} from "features/game/lib/getInstantGems";

export type SpeedUpCollectible = {
  type: "collectible.spedUp";
  name: CollectibleName;
  id: string;
  paymentMethod?: SpeedUpPaymentMethod;
};

type Options = {
  state: Readonly<GameState>;
  action: SpeedUpCollectible;
  createdAt?: number;
};

export function speedUpCollectible({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    // A collectible can live on any placement surface — search them all by id.
    const collectible = getCollectiblesAcrossLocations(game, action.name).find(
      (item) => item.id === action.id,
    );

    if (!collectible) {
      throw new Error("Collectible does not exists");
    }

    if ((collectible.readyAt ?? 0) < createdAt) {
      throw new Error("Collectible already finished");
    }

    const gems = getInstantGems({
      readyAt: collectible.readyAt ?? 0,
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

    collectible.readyAt = createdAt;

    return game;
  });
}
