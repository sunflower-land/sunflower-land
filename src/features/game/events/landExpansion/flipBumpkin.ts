import { produce } from "immer";
import type { GameState } from "features/game/types/game";
import type { PlaceableLocation } from "features/game/types/collectibles";

export interface FlipBumpkinAction {
  type: "bumpkin.flipped";
  location: PlaceableLocation;
}

type Options = {
  state: Readonly<GameState>;
  action: FlipBumpkinAction;
};

export function flipBumpkin({ state, action }: Options) {
  return produce(state, (game) => {
    if (!game.bumpkin) {
      throw new Error("No bumpkin");
    }

    if (
      !game.bumpkin.coordinates ||
      game.bumpkin.location !== action.location
    ) {
      throw new Error("Bumpkin is not placed");
    }

    game.bumpkin.flipped = !game.bumpkin.flipped;

    return game;
  });
}
