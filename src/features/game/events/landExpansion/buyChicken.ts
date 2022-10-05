import Decimal from "decimal.js-light";
import { getBumpkinLevel } from "features/game/lib/level";
import { trackActivity } from "features/game/types/bumpkinActivity";
import { ANIMALS } from "features/game/types/craftables";
import { RandomID } from "lib/images";
import cloneDeep from "lodash.clonedeep";
import { BuildingName, BUILDINGS } from "../../types/buildings";
import { GameState, PlacedItem } from "../../types/game";

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
  console.log("BUY CHICKEN");
  const stateCopy = cloneDeep(state);
  const bumpkin = stateCopy.bumpkin;

  if (bumpkin === undefined) {
    throw new Error("You do not have a Bumpkin");
  }

  const price = ANIMALS().Chicken.tokenAmount || 0;
  if (stateCopy.balance.lessThan(price)) {
    throw new Error("Insufficient SFL");
  }

  // TODO check capacitiy

  bumpkin.activity = trackActivity(`Building Constructed`, bumpkin.activity);

  const id = Object.keys(stateCopy.chickens).length + 1;

  const chickens: GameState["chickens"] = {
    ...stateCopy.chickens,
    [id]: {
      multiplier: 1,
      coordinates: action.coordinates,
    },
  };
  console.log({ chickens });
  const previousChickens = stateCopy.inventory.Chicken || new Decimal(0);
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
