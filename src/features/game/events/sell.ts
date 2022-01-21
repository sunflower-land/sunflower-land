import { CropName, CROPS } from "features/crops/lib/crops";
import { GameState, InventoryItemName } from "../GameProvider";

export type SellAction = {
  type: "item.sell";
  item: InventoryItemName;
  amount: number;
};

function isCrop(crop: InventoryItemName): crop is CropName {
  return crop in CROPS;
}

export function sell(state: GameState, action: SellAction): GameState {
  if (!isCrop(action.item)) {
    throw new Error("Not for sale");
  }

  const crop = CROPS[action.item];

  const cropCount = state.inventory[action.item] || 0;

  if (cropCount === 0) {
    throw new Error("No crops to sell");
  }

  return {
    ...state,
    balance: state.balance + crop.sellPrice * action.amount,
    inventory: {
      ...state.inventory,
      [crop.name]: cropCount - 1 * action.amount,
    },
  };
}
