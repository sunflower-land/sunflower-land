import Decimal from "decimal.js-light";
import { CropName, CROPS } from "../types/crops";
import { GameState, InventoryItemName } from "../types/game";
import { getSellPrice } from "../lib/boosts";

export type SellAction = {
  type: "item.sell";
  item: InventoryItemName;
  amount: number;
};

function isCrop(crop: InventoryItemName): crop is CropName {
  return crop in CROPS();
}

type Options = {
  state: GameState;
  action: SellAction;
};
export function sell({ state, action }: Options): GameState {
  if (!isCrop(action.item)) {
    throw new Error("Not for sale");
  }

  if (action.amount <= 0) {
    throw new Error("Invalid amount");
  }

  const crop = CROPS()[action.item];

  const cropCount = state.inventory[action.item] || new Decimal(0);

  if (cropCount.lessThan(action.amount)) {
    throw new Error("Insufficient crops to sell");
  }

  const price = getSellPrice(crop, state.inventory);

  return {
    ...state,
    balance: state.balance
      .add(price.mul(action.amount))
      .toDecimalPlaces(18, Decimal.ROUND_DOWN),
    inventory: {
      ...state.inventory,
      [crop.name]: cropCount.sub(1 * action.amount),
    },
  };
}
