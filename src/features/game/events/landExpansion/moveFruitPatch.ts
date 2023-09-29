import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { GameState } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

export enum MOVE_FRUIT_PATCH_ERRORS {
  NO_BUMPKIN = "You do not have a Bumpkin!",
  FRUIT_PATCH_NOT_PLACED = "This fruit patch is not placed!",
}

export type MoveFruitPatchAction = {
  type: "fruitPatch.moved";
  coordinates: Coordinates;
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: MoveFruitPatchAction;
  createdAt?: number;
};

export function moveFruitPatch({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const stateCopy = cloneDeep(state) as GameState;
  const fruitPatch = stateCopy.fruitPatches;

  if (stateCopy.bumpkin === undefined) {
    throw new Error(MOVE_FRUIT_PATCH_ERRORS.NO_BUMPKIN);
  }

  if (!fruitPatch[action.id]) {
    throw new Error(MOVE_FRUIT_PATCH_ERRORS.FRUIT_PATCH_NOT_PLACED);
  }

  fruitPatch[action.id].x = action.coordinates.x;
  fruitPatch[action.id].y = action.coordinates.y;

  return stateCopy;
}
