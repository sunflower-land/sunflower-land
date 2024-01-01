import cloneDeep from "lodash.clonedeep";

import { GameState } from "../../types/game";
import { FishingLocation } from "features/game/types/fishing";

export type MissFishAction = {
  type: "fish.missed";
  location: FishingLocation;
};

type Options = {
  state: Readonly<GameState>;
  action: MissFishAction;
  createdAt?: number;
};

export function missFish({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const game = cloneDeep(state) as GameState;
  const location = action.location;
  if (!game.fishing[location].castedAt) {
    throw new Error("Nothing has been casted");
  }

  delete game.fishing[location].castedAt;
  delete game.fishing[location].caught;
  delete game.fishing[location].chum;

  return {
    ...game,
  };
}
