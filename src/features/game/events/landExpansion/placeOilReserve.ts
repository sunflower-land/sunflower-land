import cloneDeep from "lodash.clonedeep";

import { GameState } from "features/game/types/game";
import { RESOURCE_DIMENSIONS } from "features/game/types/resources";
import Decimal from "decimal.js-light";

export type PlaceOilReserveAction = {
  type: "oilReserve.placed";
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
    Object.keys(game.oilReserves).length
  );

  if (available.lt(1)) {
    throw new Error("No oil reserve available");
  }

  game.oilReserves[action.id as unknown as number] = {
    createdAt: createdAt,
    x: action.coordinates.x,
    y: action.coordinates.y,
    ...RESOURCE_DIMENSIONS["Oil Reserve"],
    oil: {
      amount: 0,
      drilledAt: 0,
    },
    drilled: 5,
  };

  return game;
}
