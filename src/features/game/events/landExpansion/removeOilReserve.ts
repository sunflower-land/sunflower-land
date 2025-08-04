import { produce } from "immer";
import { GameState } from "features/game/types/game";

export enum REMOVE_OIL_RESERVE_ERRORS {
  OIL_RESERVE_NOT_FOUND = "Oil reserve not found",
  OIL_RESERVE_NOT_PLACED = "Oil reserve not placed",
}

export type RemoveOilReserveAction = {
  type: "oilReserve.removed";
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: RemoveOilReserveAction;
  createdAt?: number;
};

export function removeOilReserve({
  state,
  action,
  createdAt = Date.now(),
}: Options) {
  return produce(state, (stateCopy) => {
    const { oilReserves } = stateCopy;
    const oilReserve = oilReserves[action.id];
    if (!oilReserve) {
      throw new Error(REMOVE_OIL_RESERVE_ERRORS.OIL_RESERVE_NOT_FOUND);
    }

    if (oilReserve.x === undefined || oilReserve.y === undefined) {
      throw new Error(REMOVE_OIL_RESERVE_ERRORS.OIL_RESERVE_NOT_PLACED);
    }

    delete oilReserve.x;
    delete oilReserve.y;
    oilReserve.removedAt = createdAt;

    return stateCopy;
  });
}
