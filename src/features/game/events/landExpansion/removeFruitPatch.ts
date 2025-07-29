import { produce } from "immer";
import { GameState } from "features/game/types/game";

export enum REMOVE_FRUIT_PATCH_ERRORS {
  FRUIT_PATCH_NOT_FOUND = "Fruit patch not found",
  FRUIT_PATCH_NOT_PLACED = "Fruit patch not placed",
}

export type RemoveFruitPatchAction = {
  type: "fruitPatch.removed";
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: RemoveFruitPatchAction;
  createdAt?: number;
};

export function removeFruitPatch({
  state,
  action,
  createdAt = Date.now(),
}: Options) {
  return produce(state, (copy) => {
    const { fruitPatches } = copy;
    const fruitPatch = fruitPatches[action.id];
    if (!fruitPatch) {
      throw new Error(REMOVE_FRUIT_PATCH_ERRORS.FRUIT_PATCH_NOT_FOUND);
    }

    if (fruitPatch.x === undefined || fruitPatch.y === undefined) {
      throw new Error(REMOVE_FRUIT_PATCH_ERRORS.FRUIT_PATCH_NOT_PLACED);
    }

    delete fruitPatch.x;
    delete fruitPatch.y;
    fruitPatch.removedAt = createdAt;

    return copy;
  });
}
