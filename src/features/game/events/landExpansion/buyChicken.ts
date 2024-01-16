import Decimal from "decimal.js-light";
import { trackActivity } from "features/game/types/bumpkinActivity";
import { ANIMALS } from "features/game/types/craftables";
import cloneDeep from "lodash.clonedeep";
import { GameState } from "../../types/game";
import { getSupportedChickens } from "./utils";
import { translate } from "lib/i18n/translate";

export type BuyChickenAction = {
  type: "chicken.bought";
  id: string;
  coordinates: {
    x: number;
    y: number;
  };
};

type Options = {
  state: Readonly<GameState>;
  action: BuyChickenAction;
};

export function buyChicken({ state, action }: Options): GameState {
  const stateCopy = cloneDeep(state);
  const { bumpkin, inventory } = stateCopy;

  if (bumpkin === undefined) {
    throw new Error(translate("error.noBumpkin"));
  }

  const price = ANIMALS().Chicken.tokenAmount || new Decimal(0);

  if (stateCopy.balance.lessThan(price)) {
    throw new Error(translate("error.insufficientSFL"));
  }

  const previousChickens = inventory.Chicken || new Decimal(0);

  if (previousChickens.gte(getSupportedChickens(state))) {
    throw new Error(translate("error.insufficientSpaceForChickens"));
  }

  const chickens: GameState["chickens"] = {
    ...stateCopy.chickens,
    [action.id]: {
      multiplier: 1,
      coordinates: action.coordinates,
    },
  };

  bumpkin.activity = trackActivity("Chicken Bought", bumpkin.activity);
  bumpkin.activity = trackActivity("SFL Spent", bumpkin.activity, price);

  return {
    ...stateCopy,
    balance: stateCopy.balance.sub(price),
    inventory: {
      ...stateCopy.inventory,
      Chicken: previousChickens.add(1),
    },
    chickens,
  };
}
