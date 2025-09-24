import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { GameState } from "features/game/types/game";
import { produce } from "immer";

export enum MOVE_BUD_ERRORS {
  NO_BUMPKIN = "You do not have a Bumpkin!",
  NO_BUD = "You don't have this bud",
  NFT_NOT_PLACED = "This bud is not placed!",
}

export type MoveBudAction = {
  type: "bud.moved";
  coordinates: Coordinates;
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: MoveBudAction;
  createdAt?: number;
};

export function moveBud({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (stateCopy) => {
    const bud = stateCopy.buds?.[Number(action.id)];

    if (!bud) {
      throw new Error(MOVE_BUD_ERRORS.NO_BUD);
    }

    if (!bud.coordinates) {
      throw new Error(MOVE_BUD_ERRORS.NFT_NOT_PLACED);
    }

    bud.coordinates = action.coordinates;

    return stateCopy;
  });
}
