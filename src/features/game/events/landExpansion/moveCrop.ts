import { Coordinates } from "features/game/expansion/components/MapPlacement";

import { GameState } from "features/game/types/game";
import { produce } from "immer";

export enum MOVE_CROP_ERRORS {
  NO_BUMPKIN = "You do not have a Bumpkin!",
  CROP_NOT_PLACED = "This crop is not placed!",
}

export type MoveCropAction = {
  type: "crop.moved";
  coordinates: Coordinates;
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: MoveCropAction;
  createdAt?: number;
};

export function moveCrop({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (stateCopy) => {
    const { crops, collectibles } = stateCopy;
    const plot = crops[action.id];

    if (stateCopy.bumpkin === undefined) {
      throw new Error(MOVE_CROP_ERRORS.NO_BUMPKIN);
    }

    if (!plot) {
      throw new Error(MOVE_CROP_ERRORS.CROP_NOT_PLACED);
    }

    crops[action.id].x = action.coordinates.x;
    crops[action.id].y = action.coordinates.y;

    return stateCopy;
  });
}
