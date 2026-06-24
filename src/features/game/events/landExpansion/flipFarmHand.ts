import { produce } from "immer";
import type { GameState } from "features/game/types/game";
import type { PlaceableLocation } from "features/game/types/collectibles";

export interface FlipFarmHandAction {
  type: "farmHand.flipped";
  id: string;
  location: PlaceableLocation;
}

type Options = {
  state: Readonly<GameState>;
  action: FlipFarmHandAction;
};

export function flipFarmHand({ state, action }: Options) {
  return produce(state, (game) => {
    const farmHand = game.farmHands.bumpkins[action.id];

    if (!farmHand) {
      throw new Error("Farm hand does not exist");
    }

    if (!farmHand.coordinates || farmHand.location !== action.location) {
      throw new Error("Farm hand is not placed");
    }

    farmHand.flipped = !farmHand.flipped;

    return game;
  });
}
