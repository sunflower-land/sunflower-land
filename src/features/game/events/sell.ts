import { CropName, CROPS } from "features/crops/lib/crops";
import { GameState } from "../GameProvider";

export type SellAction = {
  type: "crop.sell";
  // Currently only crops are supported to sell
  crop: CropName;
};

export function sell(state: GameState, action: SellAction): GameState {
  const crop = CROPS[action.crop];

  const cropCount = state.inventory[action.crop] || 0;

  if (cropCount === 0) {
    throw new Error("No crops to sell");
  }

  return {
    ...state,
    balance: state.balance + crop.sellPrice,
    inventory: {
      ...state.inventory,
      [crop.name]: cropCount - 1,
    },
  };
}
