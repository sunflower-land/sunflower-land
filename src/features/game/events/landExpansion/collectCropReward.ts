import Decimal from "decimal.js-light";

import { PLOT_CROPS } from "../../types/crops";
import { GameState } from "../../types/game";
import { produce } from "immer";

export type CollectCropRewardAction = {
  type: "cropReward.collected";
  plotIndex: string;
};

type Options = {
  state: GameState;
  action: CollectCropRewardAction;
  createdAt?: number;
};

export function collectCropReward({
  state,
  action,
  createdAt = Date.now(),
}: Options) {
  return produce(state, (stateCopy) => {
    const plot = stateCopy.crops[action.plotIndex];

    if (!plot) {
      throw new Error("Plot does not exist");
    }

    const { crop: plantedCrop } = plot;

    if (!plantedCrop) {
      throw new Error("Plot does not have a crop");
    }

    if (!plantedCrop.reward) {
      throw new Error("Crop does not have a reward");
    }

    const crop = PLOT_CROPS[plantedCrop.name];

    if (createdAt - plantedCrop.plantedAt < crop.harvestSeconds * 1000) {
      throw new Error("Not ready");
    }

    const {
      reward: { items, coins },
    } = plantedCrop;

    if (items?.length) {
      items.forEach(({ name, amount }) => {
        const itemBalance = stateCopy.inventory[name] || new Decimal(0);

        stateCopy.inventory[name] = itemBalance.add(new Decimal(amount));
      });
    }

    if (coins) {
      stateCopy.coins = stateCopy.coins + coins;
    }

    delete plantedCrop.reward;

    return stateCopy;
  });
}
