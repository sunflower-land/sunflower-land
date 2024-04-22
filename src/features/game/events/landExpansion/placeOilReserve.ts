import cloneDeep from "lodash.clonedeep";

import { GameState } from "features/game/types/game";
import {
  ResourceName,
  RESOURCE_DIMENSIONS,
} from "features/game/types/resources";
import Decimal from "decimal.js-light";

export type PlaceOilReserveAction = {
  type: "oilReserve.placed";
  name: ResourceName;
  id: string;
  coordinates: {
    x: number;
    y: number;
  };
};

type Options = {
  state: Readonly<GameState>;
  action: PlaceOilReserveAction;
  createdAt?: number;
};

export function placeOilReserve({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const game = cloneDeep(state) as GameState;

  const available = (game.inventory["Oil Reserve"] || new Decimal(0)).minus(
    Object.keys(game.oil).length
  );

  if (available.lt(1)) {
    throw new Error("No oil reserve available");
  }

  game.oil = {
    ...game.oil,
    [action.id as unknown as number]: {
      createdAt: createdAt,
      x: action.coordinates.x,
      y: action.coordinates.y,
      ...RESOURCE_DIMENSIONS["Oil Reserve"],
      stone: {
        amount: 0,
        minedAt: 0,
      },
      minesLeft: 5,
    },
  };

  return game;
}
