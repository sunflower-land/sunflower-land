import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { GameState } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

export enum MOVE_OIL_ERRORS {
  NO_BUMPKIN = "You do not have a Bumpkin!",
  OIL_NOT_PLACED = "This oil reserve is not placed!",
}

export type MoveOilReserveAction = {
  type: "oilReserve.moved";
  coordinates: Coordinates;
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: MoveOilReserveAction;
  createdAt?: number;
};

export function moveOilReserve({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const stateCopy = cloneDeep(state) as GameState;
  const oilReserves = stateCopy.oil;

  if (stateCopy.bumpkin === undefined) {
    throw new Error(MOVE_OIL_ERRORS.NO_BUMPKIN);
  }

  if (!oilReserves[action.id]) {
    throw new Error(MOVE_OIL_ERRORS.OIL_NOT_PLACED);
  }

  oilReserves[action.id].x = action.coordinates.x;
  oilReserves[action.id].y = action.coordinates.y;

  return stateCopy;
}
