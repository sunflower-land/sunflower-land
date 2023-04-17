import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { GameState } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

export enum MOVE_IRON_ERRORS {
  NO_BUMPKIN = "You do not have a Bumpkin!",
  NO_IRON = "You don't have any iron placed!",
  IRON_NOT_PLACED = "This rock is not placed!",
}

export type MoveIronAction = {
  type: "iron.moved";
  coordinates: Coordinates;
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: MoveIronAction;
  createdAt?: number;
};

export function moveIron({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const stateCopy = cloneDeep(state) as GameState;
  const iron = stateCopy.iron;

  if (stateCopy.bumpkin === undefined) {
    throw new Error(MOVE_IRON_ERRORS.NO_BUMPKIN);
  }

  if (!iron[action.id]) {
    throw new Error(MOVE_IRON_ERRORS.IRON_NOT_PLACED);
  }

  iron[action.id].x = action.coordinates.x;
  iron[action.id].y = action.coordinates.y;

  return stateCopy;
}
