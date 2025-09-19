import { GameState } from "features/game/types/game";
import { produce } from "immer";
import Decimal from "decimal.js-light";
import { getInstantGems, makeGemHistory } from "./speedUpRecipe";
import { BuildingName } from "features/game/types/buildings";

export type SpeedUpBuilding = {
  type: "building.spedUp";
  name: BuildingName;
  id: string;
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

    if (!game.inventory["Gem"]?.gte(gems)) {
      throw new Error("Insufficient Gems");
    }

    game.inventory["Gem"] = (game.inventory["Gem"] ?? new Decimal(0)).sub(gems);

    building.readyAt = createdAt;

    game = makeGemHistory({ game, amount: gems });

    return game;
  });
}
