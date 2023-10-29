import cloneDeep from "lodash.clonedeep";

import { GameState } from "../../types/game";

export type MissFishAction = {
  type: "fish.missed";
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

  if (!game.fishing.wharf.castedAt) {
    throw new Error("Nothing has been casted");
  }

  delete game.fishing.wharf.castedAt;
  delete game.fishing.wharf.caught;
  delete game.fishing.wharf.chum;

  return {
    ...game,
  };
}
