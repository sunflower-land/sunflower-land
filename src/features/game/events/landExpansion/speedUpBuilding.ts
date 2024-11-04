import { GameState } from "features/game/types/game";
import { produce } from "immer";
import Decimal from "decimal.js-light";
import { getInstantGems } from "./speedUpRecipe";
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

    if (building.readyAt < createdAt) {
      throw new Error("Building already finished");
    }

    const gems = getInstantGems({
      readyAt: building.readyAt,
      now: createdAt,
      game,
    });

    if (!game.inventory["Gem"]?.gte(gems)) {
      throw new Error("Insufficient Gems");
    }

    game.inventory["Gem"] = (game.inventory["Gem"] ?? new Decimal(0)).sub(gems);

    building.readyAt = createdAt;

    const today = new Date(createdAt).toISOString().substring(0, 10);
    game.gems = {
      ...game.gems,
      history: {
        ...game.gems.history,
        [today]: {
          spent: (game.gems.history?.[today]?.spent ?? 0) + gems,
        },
      },
    };

    return game;
  });
}
