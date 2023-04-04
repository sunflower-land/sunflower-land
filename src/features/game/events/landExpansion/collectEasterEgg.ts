import cloneDeep from "lodash.clonedeep";

import { EasterEggPosition, GameState } from "../../types/game";
import { trackActivity } from "features/game/types/bumpkinActivity";

export type CollectEasterEggAction = {
  type: "easterEgg.collected";
  egg: EasterEggPosition;
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

  if (!bumpkin) {
    throw new Error("You do not have a Bumpkin");
  }

  if (!stateCopy.easterHunt) {
    throw new Error("Easter egg does not exist");
  }

  const index = stateCopy.easterHunt.eggs.findIndex(
    (item) =>
      item.name === action.egg.name &&
      item.x === action.egg.x &&
      item.y === action.egg.y &&
      item.island === action.egg.island
  );
  const egg = stateCopy.easterHunt.eggs[index];

  if (!egg) {
    throw new Error("Easter egg does not exist");
  }

  if (egg.collectedAt) {
    throw new Error("Easter egg has already been collected");
  }

  stateCopy.easterHunt.eggs[index].collectedAt = Date.now();

  bumpkin.activity = trackActivity(`Easter Egg Collected`, bumpkin?.activity);

  return stateCopy;
}
