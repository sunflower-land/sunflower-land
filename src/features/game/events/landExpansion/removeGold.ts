import { produce } from "immer";
import { GameState } from "features/game/types/game";

export enum REMOVE_GOLD_ERRORS {
  GOLD_NOT_FOUND = "Gold not found",
  GOLD_NOT_PLACED = "Gold not placed",
}

export type RemoveGoldAction = {
  type: "gold.removed";
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: RemoveGoldAction;
  createdAt?: number;
};

export function removeGold({ state, action, createdAt = Date.now() }: Options) {
  return produce(state, (stateCopy) => {
    const { gold } = stateCopy;
    const goldRock = gold[action.id];
    if (!goldRock) {
      throw new Error(REMOVE_GOLD_ERRORS.GOLD_NOT_FOUND);
    }

    if (goldRock.x === undefined || goldRock.y === undefined) {
      throw new Error(REMOVE_GOLD_ERRORS.GOLD_NOT_PLACED);
    }

    delete goldRock.x;
    delete goldRock.y;
    goldRock.removedAt = createdAt;

    return stateCopy;
  });
}
