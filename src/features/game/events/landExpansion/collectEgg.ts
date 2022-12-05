import Decimal from "decimal.js-light";
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

  if (!chicken) {
    throw new Error("This chicken does not exist");
  }

  if (!eggIsReady(chicken, createdAt)) {
    throw new Error("This chicken hasn't layed an egg");
  }

  const mutantChicken = chicken.reward?.items?.[0];

  delete chickens[action.id].fedAt;

  return {
    ...stateCopy,
    inventory: {
      ...stateCopy.inventory,
      Egg: (stateCopy.inventory.Egg || new Decimal(0))?.add(
        1 * chicken.multiplier
      ),
      ...(mutantChicken && {
        [mutantChicken.name]: (
          stateCopy.inventory[mutantChicken.name] || new Decimal(0)
        )?.add(mutantChicken.amount),
      }),
    },
    chickens,
  };
}
