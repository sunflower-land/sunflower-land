import Decimal from "decimal.js-light";
import { trackActivity } from "features/game/types/bumpkinActivity";
import { ANIMALS } from "features/game/types/craftables";
import cloneDeep from "lodash.clonedeep";
import { GameState } from "../../types/game";

export type BuyChickenAction = {
  type: "chicken.bought";
  coordinates: {
    x: number;
    y: number;
  };
};

type Options = {
  state: Readonly<GameState>;
  action: BuyChickenAction;
  createdAt?: number;
};

export function buyChicken({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const stateCopy = cloneDeep(state);
  const bumpkin = stateCopy.bumpkin;

  if (bumpkin === undefined) {
    throw new Error("You do not have a Bumpkin");
  }

  const price = ANIMALS().Chicken.tokenAmount || new Decimal(0);

  if (stateCopy.balance.lessThan(price)) {
    throw new Error("Insufficient SFL");
  }

  const previousChickens = stateCopy.inventory.Chicken || new Decimal(0);
  const chickenHouses = stateCopy.buildings["Chicken House"]?.length ?? 0;
  const supportedChickens = chickenHouses * 10;

  if (previousChickens.gte(supportedChickens)) {
    throw new Error("Insufficient space for more chickens");
  }

  const id = Object.keys(stateCopy.chickens).length;

  const chickens: GameState["chickens"] = {
    ...stateCopy.chickens,
    [id]: {
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
