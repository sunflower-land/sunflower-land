import type { Coordinates } from "features/game/expansion/components/MapPlacement";
import type { GameState } from "features/game/types/game";
import { produce } from "immer";

export enum MOVE_ASCENSION_CRYSTAL_ERRORS {
  NO_BUMPKIN = "You do not have a Bumpkin!",
  ASCENSION_CRYSTAL_NOT_PLACED = "This ascension crystal is not placed!",
}

export type MoveAscensionCrystalAction = {
  type: "ascensionCrystal.moved";
  coordinates: Coordinates;
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: MoveAscensionCrystalAction;
  createdAt?: number;
};

export function moveAscensionCrystal({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (stateCopy) => {
    const { ascensionCrystals } = stateCopy;

    if (stateCopy.bumpkin === undefined) {
      throw new Error(MOVE_ASCENSION_CRYSTAL_ERRORS.NO_BUMPKIN);
    }

    if (!ascensionCrystals[action.id]) {
      throw new Error(
        MOVE_ASCENSION_CRYSTAL_ERRORS.ASCENSION_CRYSTAL_NOT_PLACED,
      );
    }

    ascensionCrystals[action.id].x = action.coordinates.x;
    ascensionCrystals[action.id].y = action.coordinates.y;

    return stateCopy;
  });
}
