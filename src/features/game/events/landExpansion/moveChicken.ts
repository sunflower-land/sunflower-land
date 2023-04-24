import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { GameState } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

export enum MOVE_CHICKEN_ERRORS {
  NO_BUMPKIN = "You do not have a Bumpkin!",
  CHICKEN_NOT_PLACED = "This chicken is not placed!",
}

export type MoveChickenAction = {
  type: "chicken.moved";
  coordinates: Coordinates;
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: MoveChickenAction;
  createdAt?: number;
};

export function moveChicken({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const stateCopy = cloneDeep(state) as GameState;
  const chickens = stateCopy.chickens;

  if (stateCopy.bumpkin === undefined) {
    throw new Error(MOVE_CHICKEN_ERRORS.NO_BUMPKIN);
  }

  if (!chickens[action.id]?.coordinates) {
    throw new Error(MOVE_CHICKEN_ERRORS.CHICKEN_NOT_PLACED);
  }

  const coordinates = chickens[action.id].coordinates;
  if (!coordinates) {
    throw new Error(MOVE_CHICKEN_ERRORS.CHICKEN_NOT_PLACED);
  }

  coordinates.x = action.coordinates.x;
  coordinates.y = action.coordinates.y;

  return stateCopy;
}
