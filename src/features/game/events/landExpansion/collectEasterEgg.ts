import cloneDeep from "lodash.clonedeep";

import { GameState } from "../../types/game";
import { trackActivity } from "features/game/types/bumpkinActivity";

export type CollectEasterEggAction = {
  type: "easterEgg.collected";
  eggIndex: number;
};

type Options = {
  state: GameState;
  action: CollectEasterEggAction;
  createdAt?: number;
};

export function collectEasterEgg({
  state,
  action,
  createdAt = Date.now(),
}: Options) {
  const stateCopy = cloneDeep(state);
  const bumpkin = stateCopy.bumpkin;
  const egg = stateCopy.easterHunt.eggs[action.eggIndex];

  if (!bumpkin) {
    throw new Error("You do not have a Bumpkin");
  }

  if (!egg) {
    throw new Error("EasterEgg does not exist");
  }

  stateCopy.easterHunt.eggs[action.eggIndex].collectedAt = Date.now();

  bumpkin.activity = trackActivity(`Easter Egg Collected`, bumpkin?.activity);

  return stateCopy;
}
