import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { GameState } from "features/game/types/game";
import { produce } from "immer";

export enum MOVE_STONE_ERRORS {
  NO_BUMPKIN = "You do not have a Bumpkin!",
  STONE_NOT_PLACED = "This stone is not placed!",
}

export type MoveStoneAction = {
  type: "stone.moved";
  coordinates: Coordinates;
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: MoveStoneAction;
  createdAt?: number;
};

export function moveStone({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (stateCopy) => {
    const stones = stateCopy.stones;

    if (stateCopy.bumpkin === undefined) {
      throw new Error(MOVE_STONE_ERRORS.NO_BUMPKIN);
    }

    if (!stones[action.id]) {
      throw new Error(MOVE_STONE_ERRORS.STONE_NOT_PLACED);
    }

    stones[action.id].x = action.coordinates.x;
    stones[action.id].y = action.coordinates.y;

    return stateCopy;
  });
}
