import Decimal from "decimal.js-light";
import { CropName, CROPS } from "../types/crops";
import { GameState } from "../types/game";
import { getSellPrice } from "../lib/boosts";
import { Cake, CAKES } from "../types/craftables";

export type SellAction = {
  type: "item.sell";
  item: SellableName;
  amount: number;
};

export type SellableName = CropName | Cake;

export type SellableItem = {
  sellPrice: Decimal;
};

const SELLABLE = { ...CROPS(), ...CAKES() };

type Options = {
  state: GameState;
  action: SellAction;
};
export function sell({ state, action }: Options): GameState {
  if (!(action.item in SELLABLE)) {
    throw new Error("Not for sale");
  }

  if (action.amount <= 0) {
    throw new Error("Invalid amount");
  }

  const sellable = SELLABLE[action.item];

  const cropCount = state.inventory[action.item] || new Decimal(0);

  if (cropCount.lessThan(action.amount)) {
    throw new Error("Insufficient crops to sell");
  }

  const price = getSellPrice(sellable as SellableItem, state.inventory);

  return {
    ...state,
    balance: state.balance
      .add(price.mul(action.amount))
      .toDecimalPlaces(18, Decimal.ROUND_DOWN),
    inventory: {
      ...state.inventory,
      [sellable.name]: cropCount.sub(1 * action.amount),
    },
  };
}
