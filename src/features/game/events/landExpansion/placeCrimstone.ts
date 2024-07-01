import cloneDeep from "lodash.clonedeep";

import { GameState } from "features/game/types/game";
import {
  ResourceName,
  RESOURCE_DIMENSIONS,
} from "features/game/types/resources";
import Decimal from "decimal.js-light";

export type PlaceCrimstoneAction = {
  type: "crimstone.placed";
  name: ResourceName;
  id: string;
  coordinates: {
    x: number;
    y: number;
  };
};

type Options = {
  state: Readonly<GameState>;
  action: PlaceCrimstoneAction;
  createdAt?: number;
};

export function placeCrimstone({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const game = cloneDeep(state) as GameState;

  const available = (game.inventory["Crimstone Rock"] || new Decimal(0)).minus(
    Object.keys(game.crimstones).length,
  );

  if (available.lt(1)) {
    throw new Error("No crimstones available");
  }

  game.crimstones = {
    ...game.crimstones,
    [action.id as unknown as number]: {
      createdAt: createdAt,
      x: action.coordinates.x,
      y: action.coordinates.y,
      ...RESOURCE_DIMENSIONS["Crimstone Rock"],
      stone: {
        amount: 0,
        minedAt: 0,
      },
      minesLeft: 5,
    },
  };

  return game;
}
