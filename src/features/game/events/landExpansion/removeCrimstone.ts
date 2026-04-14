import { produce } from "immer";
import { GameState } from "features/game/types/game";

export enum REMOVE_CRIMSTONE_ERRORS {
  CRIMSTONE_NOT_FOUND = "Crimstone not found",
  CRIMSTONE_NOT_PLACED = "Crimstone not placed",
}

export type RemoveCrimstoneAction = {
  type: "crimstone.removed";
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: RemoveCrimstoneAction;
  createdAt?: number;
};

export function removeCrimstone({
  state,
  action,
  createdAt = Date.now(),
}: Options) {
  return produce(state, (stateCopy) => {
    const { crimstones } = stateCopy;
    const crimstone = crimstones[action.id];
    if (!crimstone) {
      throw new Error(REMOVE_CRIMSTONE_ERRORS.CRIMSTONE_NOT_FOUND);
    }

    if (crimstone.x === undefined || crimstone.y === undefined) {
      throw new Error(REMOVE_CRIMSTONE_ERRORS.CRIMSTONE_NOT_PLACED);
    }

    delete crimstone.x;
    delete crimstone.y;
    crimstone.removedAt = createdAt;

    return stateCopy;
  });
}
