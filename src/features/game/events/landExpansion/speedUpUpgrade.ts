import { GameState } from "features/game/types/game";
import {
  makeUpgradableBuildingKey,
  UpgradableBuildingType,
} from "./upgradeBuilding";
import { produce } from "immer";
import {
  chargeCoinsForSpeedUp,
  getInstantGems,
  makeGemHistory,
  SpeedUpPaymentMethod,
} from "features/game/lib/getInstantGems";
import Decimal from "decimal.js-light";

export type SpeedUpUpgradeAction = {
  type: "upgrade.spedUp";
  name: UpgradableBuildingType;
  paymentMethod?: SpeedUpPaymentMethod;
};

type Options = {
  state: Readonly<GameState>;
  action: SpeedUpUpgradeAction;
  createdAt?: number;
};

export function speedUpUpgrade({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    const buildingKey = makeUpgradableBuildingKey(action.name);
    const { upgradeReadyAt } = game[buildingKey];

    if (!upgradeReadyAt) {
      throw new Error("Building is not upgrading");
    }

    if (upgradeReadyAt < createdAt) {
      throw new Error("Building is already upgraded");
    }

    const gems = getInstantGems({
      readyAt: upgradeReadyAt,
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

    game[buildingKey].upgradeReadyAt = createdAt;

    return game;
  });
}
