import { GameState } from "features/game/types/game";
import { produce } from "immer";

export enum REMOVE_TREE_ERRORS {
  TREE_NOT_FOUND = "Tree not found",
  TREE_NOT_PLACED = "Tree not placed",
}

export type RemoveTreeAction = {
  type: "tree.removed";
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: RemoveTreeAction;
  createdAt?: number;
};

export function removeTree({ state, action, createdAt = Date.now() }: Options) {
  return produce(state, (stateCopy) => {
    const { trees } = stateCopy;
    const tree = trees[action.id];
    if (!tree) {
      throw new Error(REMOVE_TREE_ERRORS.TREE_NOT_FOUND);
    }

    if (tree.x === undefined || tree.y === undefined) {
      throw new Error(REMOVE_TREE_ERRORS.TREE_NOT_PLACED);
    }

    delete tree.x;
    delete tree.y;
    tree.removedAt = createdAt;

    return stateCopy;
  });
}
