import { GameState } from "features/game/types/game";
import {
  ResourceName,
  RESOURCE_DIMENSIONS,
} from "features/game/types/resources";
import Decimal from "decimal.js-light";
import { produce } from "immer";

export type PlaceTreeAction = {
  type: "tree.placed";
  name: ResourceName;
  id: string;
  coordinates: {
    x: number;
    y: number;
  };
};

type Options = {
  state: Readonly<GameState>;
  action: PlaceTreeAction;
  createdAt?: number;
};

export function placeTree({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    const available = (game.inventory.Tree || new Decimal(0)).minus(
      Object.keys(game.trees).length,
    );

    if (available.lt(1)) {
      throw new Error("No trees available");
    }

    game.trees = {
      ...game.trees,
      [action.id as unknown as number]: {
        createdAt: createdAt,
        x: action.coordinates.x,
        y: action.coordinates.y,
        ...RESOURCE_DIMENSIONS["Tree"],
        wood: {
          amount: 1,
          choppedAt: 0,
        },
      },
    };

    return game;
  });
}
