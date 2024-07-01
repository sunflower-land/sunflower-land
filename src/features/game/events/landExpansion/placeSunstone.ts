import cloneDeep from "lodash.clonedeep";

import { GameState } from "features/game/types/game";
import {
  ResourceName,
  RESOURCE_DIMENSIONS,
} from "features/game/types/resources";
import Decimal from "decimal.js-light";

export type PlaceSunstoneAction = {
  type: "sunstone.placed";
  name: ResourceName;
  id: string;
  coordinates: {
    x: number;
    y: number;
  };
};

type Options = {
  state: Readonly<GameState>;
  action: PlaceSunstoneAction;
  createdAt?: number;
};

export function placeSunstone({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const game = cloneDeep(state) as GameState;

  const available = (game.inventory["Sunstone Rock"] || new Decimal(0)).minus(
    Object.keys(game.sunstones).length,
  );

  if (available.lt(1)) {
    throw new Error("No sunstone available");
  }

  game.sunstones = {
    ...game.sunstones,
    [action.id as unknown as number]: {
      createdAt: createdAt,
      x: action.coordinates.x,
      y: action.coordinates.y,
      ...RESOURCE_DIMENSIONS["Sunstone Rock"],
      stone: {
        amount: 0,
        minedAt: 0,
      },
      minesLeft: 10,
    },
  };

  return game;
}
