import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { GameState } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

export enum MOVE_GOLD_ERRORS {
  NO_BUMPKIN = "You do not have a Bumpkin!",
  GOLD_NOT_PLACED = "This gold is not placed!",
}

export type MoveGoldAction = {
  type: "gold.moved";
  coordinates: Coordinates;
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: MoveGoldAction;
  createdAt?: number;
};

export function moveGold({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const stateCopy = cloneDeep(state) as GameState;
  const gold = stateCopy.gold;

  if (stateCopy.bumpkin === undefined) {
    throw new Error(MOVE_GOLD_ERRORS.NO_BUMPKIN);
  }

  if (!gold[action.id]) {
    throw new Error(MOVE_GOLD_ERRORS.GOLD_NOT_PLACED);
  }

  gold[action.id].x = action.coordinates.x;
  gold[action.id].y = action.coordinates.y;

  return stateCopy;
}
