import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { GameState } from "features/game/types/game";
import { produce } from "immer";

export enum MOVE_TREE_ERRORS {
  NO_BUMPKIN = "You do not have a Bumpkin!",
  TREE_NOT_PLACED = "This tree is not placed!",
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
  return produce(state, (stateCopy) => {
    const trees = stateCopy.trees;

    if (stateCopy.bumpkin === undefined) {
      throw new Error(MOVE_TREE_ERRORS.NO_BUMPKIN);
    }

    if (!trees[action.id]) {
      throw new Error(MOVE_TREE_ERRORS.TREE_NOT_PLACED);
    }

    trees[action.id].x = action.coordinates.x;
    trees[action.id].y = action.coordinates.y;

    return stateCopy;
  });
}
