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
  const stateCopy: GameState = cloneDeep(state);
  const { bumpkin, inventory, coins } = stateCopy;

  if (bumpkin === undefined) {
    throw new Error(translate("no.have.bumpkin"));
  }

  const price = ANIMALS.Chicken.price ?? 0;

  if (coins < price) {
    throw new Error(translate("error.insufficientCoins"));
  }

  const previousChickens = inventory.Chicken || new Decimal(0);

  if (previousChickens.gte(getSupportedChickens(state))) {
    throw new Error(translate("error.insufficientSpaceForChickens"));
  }

  bumpkin.activity = trackActivity("Chicken Bought", bumpkin.activity);
  bumpkin.activity = trackActivity(
    "Coins Spent",
    bumpkin.activity,
    new Decimal(price)
  );

  stateCopy.chickens[action.id] = {
    multiplier: 1,
    coordinates: action.coordinates,
  };
  stateCopy.coins = coins - price;
  stateCopy.inventory.Chicken = previousChickens.add(1);

  return stateCopy;
}
