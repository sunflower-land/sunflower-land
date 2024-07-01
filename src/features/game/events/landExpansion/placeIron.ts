import cloneDeep from "lodash.clonedeep";

import { GameState } from "features/game/types/game";
import {
  ResourceName,
  RESOURCE_DIMENSIONS,
} from "features/game/types/resources";
import Decimal from "decimal.js-light";

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
  const game = cloneDeep(state) as GameState;

  const available = (game.inventory["Iron Rock"] || new Decimal(0)).minus(
    Object.keys(game.iron).length,
  );

  if (available.lt(1)) {
    throw new Error("No iron available");
  }

  game.iron = {
    ...game.iron,
    [action.id as unknown as number]: {
      createdAt: createdAt,
      x: action.coordinates.x,
      y: action.coordinates.y,
      ...RESOURCE_DIMENSIONS["Iron Rock"],
      stone: {
        amount: 0,
        minedAt: 0,
      },
    },
  };

  return game;
}
