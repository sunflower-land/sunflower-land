import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { PlaceableLocation } from "features/game/types/collectibles";
import { GameState } from "features/game/types/game";
import { produce } from "immer";

export type PlaceFarmHandAction = {
  type: "farmHand.placed";
  id: string;
  coordinates: Coordinates;
  location: PlaceableLocation;
};

type Options = {
  state: Readonly<GameState>;
  action: PlaceFarmHandAction;
  createdAt?: number;
};

export function placeFarmHand({ state, action }: Options): GameState {
  return produce(state, (game) => {
    const { bumpkins } = game.farmHands;

    const farmHand = bumpkins[action.id];

    if (!farmHand) {
      throw new Error("Farm hand does not exist");
    }

    if (action.location !== "farm" && action.location !== "home") {
      throw new Error("Invalid farm hand location");
    }

    farmHand.coordinates = action.coordinates;
    farmHand.location = action.location;
  });
}
