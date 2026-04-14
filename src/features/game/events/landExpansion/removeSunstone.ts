import { produce } from "immer";
import { GameState } from "features/game/types/game";

export enum REMOVE_SUNSTONE_ERRORS {
  SUNSTONE_NOT_FOUND = "Sunstone not found",
  SUNSTONE_NOT_PLACED = "Sunstone not placed",
}

export type RemoveSunstoneAction = {
  type: "sunstone.removed";
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: RemoveSunstoneAction;
  createdAt?: number;
};

export function removeSunstone({
  state,
  action,
  createdAt = Date.now(),
}: Options) {
  return produce(state, (stateCopy) => {
    const { sunstones } = stateCopy;
    const sunstone = sunstones[action.id];
    if (!sunstone) {
      throw new Error(REMOVE_SUNSTONE_ERRORS.SUNSTONE_NOT_FOUND);
    }

    if (sunstone.x === undefined || sunstone.y === undefined) {
      throw new Error(REMOVE_SUNSTONE_ERRORS.SUNSTONE_NOT_PLACED);
    }

    delete sunstone.x;
    delete sunstone.y;
    sunstone.removedAt = createdAt;

    return stateCopy;
  });
}
