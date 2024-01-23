import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { GameState } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

export enum MOVE_GOLD_ERRORS {
  NO_BUMPKIN = "You do not have a Bumpkin!",
  SUNSTONE_NOT_PLACED = "This sunstone is not placed!",
}

export type MoveSunstoneAction = {
  type: "sunstone.moved";
  coordinates: Coordinates;
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: MoveSunstoneAction;
  createdAt?: number;
};

export function moveSunstone({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const stateCopy = cloneDeep(state) as GameState;
  const sunstones = stateCopy.sunstones;

  if (stateCopy.bumpkin === undefined) {
    throw new Error(MOVE_GOLD_ERRORS.NO_BUMPKIN);
  }

  if (!sunstones[action.id]) {
    throw new Error(MOVE_GOLD_ERRORS.SUNSTONE_NOT_PLACED);
  }

  sunstones[action.id].x = action.coordinates.x;
  sunstones[action.id].y = action.coordinates.y;

  return stateCopy;
}
