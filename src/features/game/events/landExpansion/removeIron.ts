import { GameState } from "features/game/types/game";
import { produce } from "immer";

export enum REMOVE_IRON_ERRORS {
  IRON_NOT_FOUND = "Iron not found",
  IRON_NOT_PLACED = "Iron not placed",
}

export type RemoveIronAction = {
  type: "iron.removed";
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: RemoveIronAction;
  createdAt?: number;
};

export function removeIron({ state, action, createdAt = Date.now() }: Options) {
  return produce(state, (stateCopy) => {
    const { iron } = stateCopy;
    const ironRock = iron[action.id];
    if (!ironRock) {
      throw new Error(REMOVE_IRON_ERRORS.IRON_NOT_FOUND);
    }

    if (ironRock.x === undefined || ironRock.y === undefined) {
      throw new Error(REMOVE_IRON_ERRORS.IRON_NOT_PLACED);
    }

    delete ironRock.x;
    delete ironRock.y;
    ironRock.removedAt = createdAt;

    return stateCopy;
  });
}
