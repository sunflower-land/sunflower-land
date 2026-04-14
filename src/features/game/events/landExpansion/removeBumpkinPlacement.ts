import { GameState } from "features/game/types/game";
import { produce } from "immer";
import { PlaceableLocation } from "features/game/types/collectibles";

export type RemoveBumpkinPlacementAction = {
  type: "bumpkin.removedPlacement";
  location: PlaceableLocation;
};

type Options = {
  state: Readonly<GameState>;
  action: RemoveBumpkinPlacementAction;
  createdAt?: number;
};

export function removeBumpkinPlacement({ state }: Options): GameState {
  return produce(state, (game) => {
    if (!game.bumpkin) {
      throw new Error("No bumpkin");
    }

    if (!game.bumpkin.coordinates) {
      throw new Error("Bumpkin is not placed");
    }

    delete game.bumpkin.coordinates;
    delete game.bumpkin.location;
  });
}
