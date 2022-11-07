import { GameState, PlantedCrop } from "../../types/game";
import { Crop, CROPS } from "../../types/crops";
import Decimal from "decimal.js-light";
import cloneDeep from "lodash.clonedeep";
import {
  BumpkinActivityName,
  trackActivity,
} from "features/game/types/bumpkinActivity";

export type LandExpansionHarvestAction = {
  type: "crop.harvested";
  expansionIndex: number;
  index: number;
};

type Options = {
  state: GameState;
  action: LandExpansionHarvestAction;
  createdAt?: number;
};

export const isReadyToHarvest = (
  createdAt: number,
  plantedCrop: PlantedCrop,
  cropDetails: Crop
) => {
  return createdAt - plantedCrop.plantedAt >= cropDetails.harvestSeconds * 1000;
};

export function harvest({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const stateCopy = cloneDeep(state);
  const { expansions, bumpkin } = stateCopy;
  const expansion = expansions[action.expansionIndex];

  if (!bumpkin) {
    throw new Error("You do not have a Bumpkin");
  }

  if (!expansion) {
    throw new Error("Expansion does not exist");
  }

  if (!expansion.plots) {
    throw new Error("Expansion does not have any plots");
  }

  const { plots } = expansion;

  if (action.index < 0) {
    throw new Error("Plot does not exist");
  }

  if (!Number.isInteger(action.index)) {
    throw new Error("Plot does not exist");
  }

  if (action.index > Object.keys(plots).length) {
    throw new Error("Plot does not exist");
  }

  const plot = plots[action.index];

  if (!plot.crop) {
    throw new Error("Nothing was planted");
  }

  const { name: cropName, plantedAt, amount = 1, reward } = plot.crop;

  const { harvestSeconds } = CROPS()[cropName];

  if (createdAt - plantedAt < harvestSeconds * 1000) {
    throw new Error("Not ready");
  }

  // Collect any rewards
  if (reward) {
    if (reward.sfl) {
      stateCopy.balance = stateCopy.balance.add(reward.sfl);
    }

    if (reward.items) {
      stateCopy.inventory = reward.items.reduce((acc, item) => {
        const amount = acc[item.name] || new Decimal(0);

        return {
          ...acc,
          [item.name]: amount.add(item.amount),
        };
      }, stateCopy.inventory);
    }
  }

  const activityName: BumpkinActivityName = `${cropName} Harvested`;

  bumpkin.activity = trackActivity(activityName, bumpkin.activity);

  // Remove crop data for plot
  delete plot.crop;

  const cropCount = stateCopy.inventory[cropName] || new Decimal(0);

  stateCopy.inventory = {
    ...stateCopy.inventory,
    [cropName]: cropCount.add(amount),
  };

  return stateCopy;
}
