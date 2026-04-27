import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { PlaceableLocation } from "features/game/types/collectibles";
import { GameState } from "features/game/types/game";
import { produce } from "immer";

export type PlaceBumpkinAction = {
  type: "bumpkin.placed";
  coordinates: Coordinates;
  location: PlaceableLocation;
};

type Options = {
  state: Readonly<GameState>;
  action: PlaceBumpkinAction;
  createdAt?: number;
};

export function placeBumpkin({ state, action }: Options): GameState {
  return produce(state, (game) => {
    if (!game.bumpkin) {
      throw new Error("No bumpkin");
    }

    if (
      action.location !== "farm" &&
      action.location !== "home" &&
      action.location !== "interior" &&
      action.location !== "level_one"
    ) {
      throw new Error("Invalid bumpkin location");
    }

    game.bumpkin.coordinates = action.coordinates;
    game.bumpkin.location = action.location;
  });
}
