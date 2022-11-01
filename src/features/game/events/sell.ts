import Decimal from "decimal.js-light";
import { CropName, CROPS } from "../types/crops";
import { GameState } from "../types/game";
import { getSellPrice } from "../lib/boosts";
import { Cake, CAKES } from "../types/craftables";
import cloneDeep from "lodash.clonedeep";

export type SellAction = {
  type: "item.sell";
  item: SellableName;
  amount: Decimal;
};

export type SellableName = CropName | Cake;

export type SellableItem = {
  name: SellableName;
  sellPrice: Decimal;
};

const SELLABLE = { ...CROPS(), ...CAKES() };

type Options = {
  state: Readonly<GameState>;
  action: SellAction;
};
export function sell({ state, action }: Options): GameState {
  const stateCopy = cloneDeep(state);

  if (!(action.item in SELLABLE)) {
    throw new Error("Not for sale");
  }

  if (action.amount.lessThanOrEqualTo(0)) {
    throw new Error("Invalid amount");
  }

  const sellable = SELLABLE[action.item];

  const itemCount = stateCopy.inventory[action.item] || new Decimal(0);

  if (itemCount.lessThan(action.amount)) {
    throw new Error("Insufficient crops to sell");
  }

  const price = getSellPrice(sellable as SellableItem, stateCopy.inventory);

  return {
    ...stateCopy,
    balance: stateCopy.balance
      .add(price.mul(action.amount))
      .toDecimalPlaces(18, Decimal.ROUND_DOWN),
    inventory: {
      ...stateCopy.inventory,
      [sellable.name]: itemCount.sub(action.amount.mul(1)),
    },
  };
}
