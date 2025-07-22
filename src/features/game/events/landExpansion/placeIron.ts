import { GameState, Rock } from "features/game/types/game";
import { ResourceName } from "features/game/types/resources";
import Decimal from "decimal.js-light";
import { produce } from "immer";

export type PlaceIronAction = {
  type: "iron.placed";
  name: ResourceName;
  id: string;
  coordinates: {
    x: number;
    y: number;
  };
};

type Options = {
  state: Readonly<GameState>;
  action: PlaceIronAction;
  createdAt?: number;
};

export function placeIron({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    const available = (game.inventory["Iron Rock"] || new Decimal(0)).minus(
      Object.keys(game.iron).length,
    );

    if (available.lt(1)) {
      throw new Error("No iron available");
    }

    const iron: Rock = {
      createdAt,
      x: action.coordinates.x,
      y: action.coordinates.y,
      stone: {
        amount: 1,
        minedAt: 0,
      },
    };

    game.iron = {
      ...game.iron,
      [action.id as unknown as number]: iron,
    };

    return game;
  });
}
