import Decimal from "decimal.js-light";
import cloneDeep from "lodash.clonedeep";

import { CHICKEN_TIME_TO_EGG } from "features/game/lib/constants";
import { Chicken, GameState } from "features/game/types/game";

export type LandExpansionCollectEggAction = {
  type: "chicken.eggCollected";
  index: number;
};

type Options = {
  state: Readonly<GameState>;
  action: LandExpansionCollectEggAction;
  createdAt?: number;
};

export function eggIsReady(chicken: Chicken, createdAt: number) {
  return chicken.fedAt && createdAt - chicken.fedAt >= CHICKEN_TIME_TO_EGG;
}

export function collectEgg({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const stateCopy = cloneDeep(state);
  const { bumpkin, inventory } = stateCopy;

  if (!bumpkin) {
    throw new Error("You do not have a Bumpkin");
  }

  const chickens = stateCopy.chickens || {};
  const chicken = chickens[action.index];

  if (
    !chicken &&
    (!inventory?.Chicken || inventory.Chicken?.lt(action.index))
  ) {
    throw new Error("This chicken does not exist");
  }

  if (!eggIsReady(chicken, createdAt)) {
    throw new Error("This chicken hasn't layed an egg");
  }

  const mutantChicken = chicken.reward?.items?.[0];
  if (mutantChicken) {
    const currentMutantChicken =
      inventory[mutantChicken.name] || new Decimal(0);
    inventory[mutantChicken.name] = currentMutantChicken.add(
      mutantChicken.amount
    );
  }

  const currentEgg = inventory.Egg || new Decimal(0);
  inventory.Egg = currentEgg.add(1 * chicken.multiplier);

  delete chickens[action.index].fedAt;

  return stateCopy;
}
