import { produce } from "immer";
import { GameState } from "features/game/types/game";

export enum REMOVE_LAVA_PIT_ERRORS {
  LAVA_PIT_NOT_FOUND = "Lava pit not found",
  LAVA_PIT_NOT_PLACED = "Lava pit not placed",
}

export type RemoveLavaPitAction = {
  type: "lavaPit.removed";
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: RemoveLavaPitAction;
  createdAt?: number;
};

export function removeLavaPit({
  state,
  action,
  createdAt = Date.now(),
}: Options) {
  return produce(state, (stateCopy) => {
    const { lavaPits } = stateCopy;
    const lavaPit = lavaPits[action.id];
    if (!lavaPit) {
      throw new Error(REMOVE_LAVA_PIT_ERRORS.LAVA_PIT_NOT_FOUND);
    }

    if (lavaPit.x === undefined || lavaPit.y === undefined) {
      throw new Error(REMOVE_LAVA_PIT_ERRORS.LAVA_PIT_NOT_PLACED);
    }

    delete lavaPit.x;
    delete lavaPit.y;
    lavaPit.removedAt = createdAt;

    return stateCopy;
  });
}
