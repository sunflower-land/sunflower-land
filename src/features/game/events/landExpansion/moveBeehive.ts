import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { GameState } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

export enum MOVE_BEEHIVE_ERRORS {
  NO_BEEHIVE = "This beehive does not exist.",
  BEEHIVE_NOT_PLACED = "This beehive is not placed.",
}

export type MoveBeehiveAction = {
  type: "beehive.moved";
  coordinates: Coordinates;
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: MoveBeehiveAction;
  createdAt?: number;
};

export function moveBeehive({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const stateCopy = cloneDeep(state) as GameState;

  if (
    !stateCopy.beehives?.[Number(action.id)] ||
    !stateCopy.beehives?.[Number(action.id)].coordinates
  ) {
    throw new Error(MOVE_BEEHIVE_ERRORS.BEEHIVE_NOT_PLACED);
  }

  stateCopy.beehives[action.id].coordinates = action.coordinates;

  return stateCopy;
}
