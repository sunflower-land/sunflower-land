import Decimal from "decimal.js-light";
import { produce } from "immer";

import { CropName, CROPS } from "../../types/crops";
import { CropPlot, GameState } from "../../types/game";
import { harvestCropFromPlot, isReadyToHarvest } from "./harvest";
import { updateBoostUsed } from "../../types/updateBoostUsed";
import { BoostName } from "../../types/game";

export type BulkHarvestAction = {
  type: "crops.bulkHarvested";
};

type Options = {
  state: Readonly<GameState>;
  action: BulkHarvestAction;
  createdAt?: number;
};

export const getCropsToHarvest = (state: GameState, now = Date.now()) => {
  const readyPlots = {} as Record<string, CropPlot>;
  // CropName -> amount of crops ready to harvest
  const readyCrops = {} as Record<CropName, number>;

  Object.entries(state.crops).forEach(([plotId, plot]) => {
    if (!plot.crop) return;

    if (isReadyToHarvest(now, plot.crop, CROPS[plot.crop.name])) {
      readyPlots[plotId] = plot;
      readyCrops[plot.crop.name] = (readyCrops[plot.crop.name] || 0) + 1;
    }
  });

  return { readyPlots, readyCrops };
};

export function bulkHarvest({
  state,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (stateCopy) => {
    const { crops: plots, bumpkin } = stateCopy;

    if (!bumpkin) {
      throw new Error("You do not have a Bumpkin");
    }

    const { readyPlots } = getCropsToHarvest(stateCopy, createdAt);

    if (Object.keys(readyPlots).length === 0) {
      throw new Error("No crops ready to harvest");
    }

    const allBoostsUsed: BoostName[] = [];
    const cropAmounts: Partial<Record<CropName, number>> = {};

    // Harvest all ready crops
    for (const [plotId] of Object.entries(readyPlots)) {
      try {
        const { updatedPlot, amount, aoe, boostsUsed, cropName } =
          harvestCropFromPlot({
            plotId,
            game: stateCopy,
            createdAt,
          });

        allBoostsUsed.push(...boostsUsed);

        stateCopy.aoe = aoe;

        plots[plotId] = updatedPlot;
        cropAmounts[cropName] = (cropAmounts[cropName] || 0) + amount;
      } catch (error) {
        // ignore error
        continue;
      }
    }

    Object.entries(cropAmounts).forEach(([cropName, amount]) => {
      const currentCount =
        stateCopy.inventory[cropName as CropName] || new Decimal(0);
      stateCopy.inventory[cropName as CropName] = currentCount.add(amount);
    });

    if (allBoostsUsed.length > 0) {
      stateCopy.boostsUsedAt = updateBoostUsed({
        game: stateCopy,
        boostNames: allBoostsUsed,
        createdAt,
      });
    }
  });
}
