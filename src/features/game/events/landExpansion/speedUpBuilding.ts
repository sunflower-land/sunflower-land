import type { GameState } from "features/game/types/game";
import { produce } from "immer";
import Decimal from "decimal.js-light";
import { mfCurrencyChange } from "lib/moonforgeAnalytics";
import {
  chargeCoinsForSpeedUp,
  getInstantGems,
  makeGemHistory,
  type SpeedUpPaymentMethod,
} from "features/game/lib/getInstantGems";
import type { BuildingName } from "features/game/types/buildings";

export type SpeedUpBuilding = {
  type: "building.spedUp";
  name: BuildingName;
  id: string;
  paymentMethod?: SpeedUpPaymentMethod;
};

type Options = {
  state: Readonly<GameState>;
  action: SpeedUpBuilding;
  createdAt?: number;
};

export function speedUpBuilding({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    const building = game.buildings[action.name]?.find(
      (item) => item.id === action.id,
    );

    if (!building) {
      throw new Error("Building does not exists");
    }

    if ((building.readyAt ?? 0) < createdAt) {
      throw new Error("Building already finished");
    }

    const gems = getInstantGems({
      readyAt: building.readyAt ?? 0,
      now: createdAt,
      game,
    });

    const coinsBefore = game.coins;
    const gemsBefore = (game.inventory["Gem"] ?? new Decimal(0)).toNumber();

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

    building.readyAt = createdAt;

    mfCurrencyChange("speed_up_building", "spend", {
      coin: { before: coinsBefore, after: game.coins },
      gem: {
        before: gemsBefore,
        after: (game.inventory["Gem"] ?? new Decimal(0)).toNumber(),
      },
    });

    return game;
  });
}
