import { GameState, Rock } from "features/game/types/game";
import { ResourceName } from "features/game/types/resources";
import Decimal from "decimal.js-light";
import { produce } from "immer";

export type PlaceGoldAction = {
  type: "gold.placed";
  name: ResourceName;
  id: string;
  coordinates: {
    x: number;
    y: number;
  };
};

type Options = {
  state: Readonly<GameState>;
  action: PlaceGoldAction;
  createdAt?: number;
};

export function placeGold({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    const available = (game.inventory["Gold Rock"] || new Decimal(0)).minus(
      Object.keys(game.gold).length,
    );

    if (available.lt(1)) {
      throw new Error("No gold available");
    }

    const gold: Rock = {
      createdAt,
      x: action.coordinates.x,
      y: action.coordinates.y,
      stone: {
        amount: 1,
        minedAt: 0,
      },
    };

    game.gold = {
      ...game.gold,
      [action.id as unknown as number]: gold,
    };

    return game;
  });
}
