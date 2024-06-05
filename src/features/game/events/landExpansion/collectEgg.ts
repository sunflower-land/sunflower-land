import Decimal from "decimal.js-light";
import { trackActivity } from "features/game/types/bumpkinActivity";
import cloneDeep from "lodash.clonedeep";
import { CHICKEN_TIME_TO_EGG } from "../../lib/constants";
import { Chicken, GameState } from "../../types/game";

export type LandExpansionCollectEggAction = {
  type: "chicken.collectEgg";
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: LandExpansionCollectEggAction;
  createdAt?: number;
};

export function eggIsReady(chicken: Chicken, createdAt: number) {
  return chicken.fedAt && createdAt - chicken.fedAt >= CHICKEN_TIME_TO_EGG;
}

export function collectEggs({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const stateCopy = cloneDeep(state);
  const chickens = stateCopy.chickens || {};
  const chicken = chickens[action.id];

  if (stateCopy.bumpkin === undefined) {
    throw new Error("You do not have a Bumpkin!");
  }

  if (!chicken) {
    throw new Error("This chicken does not exist");
  }

  if (!eggIsReady(chicken, createdAt)) {
    throw new Error("This chicken hasn't layed an egg");
  }

  const mutantChicken = chicken.reward?.items?.[0];

  delete chickens[action.id].fedAt;

  stateCopy.bumpkin.activity = trackActivity(
    "Egg Collected",
    stateCopy.bumpkin.activity
  );

  const currentEggs = stateCopy.inventory.Egg || new Decimal(0);

  stateCopy.inventory.Egg = currentEggs.add(1 * chicken.multiplier);

  if (mutantChicken) {
    const mutantInInventory =
      stateCopy.inventory[mutantChicken.name] || new Decimal(0);

    stateCopy.inventory[mutantChicken.name] = mutantInInventory.add(
      mutantChicken.amount
    );
  }

  return stateCopy;
}
