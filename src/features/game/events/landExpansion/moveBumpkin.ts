import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { PlaceableLocation } from "features/game/types/collectibles";
import { GameState } from "features/game/types/game";
import { produce } from "immer";

export type MoveBumpkinAction = {
  type: "bumpkin.moved";
  coordinates: Coordinates;
  location: PlaceableLocation;
};

type Options = {
  state: Readonly<GameState>;
  action: MoveBumpkinAction;
  createdAt?: number;
};

export function moveBumpkin({ state, action }: Options): GameState {
  return produce(state, (game) => {
    if (!game.bumpkin) {
      throw new Error("No bumpkin");
    }

    if (!game.bumpkin.coordinates || !game.bumpkin.location) {
      throw new Error("Bumpkin is not placed");
    }

    if (
      action.location !== "farm" &&
      action.location !== "home" &&
      action.location !== "interior" &&
      action.location !== "level_one"
    ) {
      throw new Error("Invalid bumpkin location");
    }

    if (action.location === "level_one" && !game.interior.level_one) {
      throw new Error("Level one floor has not been unlocked");
    }

    game.bumpkin.coordinates = action.coordinates;
    game.bumpkin.location = action.location;
  });
}
