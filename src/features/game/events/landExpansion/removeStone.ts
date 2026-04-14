import { GameState } from "features/game/types/game";
import { produce } from "immer";

export enum REMOVE_STONE_ERRORS {
  STONE_NOT_FOUND = "Stone not found",
  STONE_NOT_PLACED = "Stone not placed",
}

export type RemoveStoneAction = {
  type: "stone.removed";
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: RemoveStoneAction;
  createdAt?: number;
};

export function removeStone({
  state,
  action,
  createdAt = Date.now(),
}: Options) {
  return produce(state, (stateCopy) => {
    const { stones } = stateCopy;
    const stone = stones[action.id];
    if (!stone) {
      throw new Error(REMOVE_STONE_ERRORS.STONE_NOT_FOUND);
    }

    if (stone.x === undefined || stone.y === undefined) {
      throw new Error(REMOVE_STONE_ERRORS.STONE_NOT_PLACED);
    }

    delete stone.x;
    delete stone.y;
    stone.removedAt = createdAt;

    return stateCopy;
  });
}
