import { GameState } from "features/game/types/game";
import { hasBudRemoveRestriction } from "features/game/types/removeables";
import cloneDeep from "lodash.clonedeep";

export enum REMOVE_BUD_ERRORS {
  INVALID_BUD = "This bud does not exist",
  BUD_NOT_PLACED = "This bud is not placed",
}

export type RemoveBudAction = {
  type: "bud.removed";
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: RemoveBudAction;
  createdAt?: number;
};

export function removeBud({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const stateCopy = cloneDeep(state) as GameState;

  const bud = stateCopy.buds?.[Number(action.id)];

  if (!bud) {
    throw new Error(REMOVE_BUD_ERRORS.INVALID_BUD);
  }

  if (!bud.coordinates) {
    throw new Error(REMOVE_BUD_ERRORS.BUD_NOT_PLACED);
  }

  const [isRestricted, restrictionReason] = hasBudRemoveRestriction(
    stateCopy,
    bud,
  );

  if (isRestricted) {
    throw new Error(restrictionReason);
  }

  delete bud.coordinates;
  delete bud.location;

  return stateCopy;
}
