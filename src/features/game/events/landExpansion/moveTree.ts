import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { GameState } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

export enum MOVE_COLLECTIBLE_ERRORS {
  NO_BUMPKIN = "You do not have a Bumpkin!",
  NO_COLLECTIBLES = "You don't have any collectible of this type placed!",
  COLLECTIBLE_NOT_PLACED = "This collectible is not placed!",
}

export type MoveTreeAction = {
  type: "tree.moved";
  coordinates: Coordinates;
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: MoveTreeAction;
  createdAt?: number;
};

export function moveTree({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  console.log({ moveTree: action });
  const stateCopy = cloneDeep(state) as GameState;
  const trees = stateCopy.trees;

  if (stateCopy.bumpkin === undefined) {
    throw new Error(MOVE_COLLECTIBLE_ERRORS.NO_BUMPKIN);
  }

  if (!trees[action.id]) {
    throw new Error(MOVE_COLLECTIBLE_ERRORS.COLLECTIBLE_NOT_PLACED);
  }

  trees[action.id].x = action.coordinates.x;
  trees[action.id].y = action.coordinates.y;

  return stateCopy;
}
