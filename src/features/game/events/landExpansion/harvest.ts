import { GameState, PlantedCrop } from "../../types/game";
import {
  GREENHOUSE_CROPS,
  GreenHouseCropName,
  PLOT_CROPS,
  PlotCrop,
  PlotCropName,
} from "../../types/crops";
import Decimal from "decimal.js-light";
import {
  BumpkinActivityName,
  trackActivity,
} from "features/game/types/bumpkinActivity";
import { CropPlot } from "features/game/types/game";
import { produce } from "immer";

export type LandExpansionHarvestAction = {
  type: "crop.harvested";
  index: string;
};

type Options = {
  state: GameState;
  action: LandExpansionHarvestAction;
  createdAt?: number;
};

export const isBasicCrop = (cropName: PlotCropName | GreenHouseCropName) => {
  if (!isCrop(cropName)) return false;
  const cropDetails = PLOT_CROPS[cropName];
  return cropDetails.harvestSeconds <= PLOT_CROPS["Pumpkin"].harvestSeconds;
};

export const isMediumCrop = (cropName: PlotCropName | GreenHouseCropName) => {
  if (!isCrop(cropName)) return false;
  return !(isBasicCrop(cropName) || isAdvancedCrop(cropName));
};

export const isAdvancedCrop = (cropName: PlotCropName | GreenHouseCropName) => {
  if (!isCrop(cropName)) return false;
  const cropDetails = PLOT_CROPS[cropName];
  return cropDetails.harvestSeconds >= PLOT_CROPS["Eggplant"].harvestSeconds;
};

function isCrop(plant: GreenHouseCropName | PlotCropName): plant is PlotCropName {
  return (plant as PlotCropName) in PLOT_CROPS;
}

export const isOvernightCrop = (cropName: PlotCropName | GreenHouseCropName) => {
  if (isCrop(cropName)) {
    const cropDetails = PLOT_CROPS[cropName];
    return cropDetails.harvestSeconds >= PLOT_CROPS["Radish"].harvestSeconds;
  }

  const details = GREENHOUSE_CROPS[cropName];
  return (
    details.harvestSeconds >= 24 * 60 * 60 &&
    details.harvestSeconds <= 36 * 60 * 60
  );
};

export const isReadyToHarvest = (
  createdAt: number,
  plantedCrop: PlantedCrop,
  cropDetails: PlotCrop,
) => {
  return createdAt - plantedCrop.plantedAt >= cropDetails.harvestSeconds * 1000;
};

export function isCropGrowing(plot: CropPlot) {
  const crop = plot.crop;
  if (!crop) return false;

  const cropDetails = PLOT_CROPS[crop.name];
  return !isReadyToHarvest(Date.now(), crop, cropDetails);
}

export function harvest({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (stateCopy) => {
    const { bumpkin, crops: plots } = stateCopy;

    if (!bumpkin) {
      throw new Error("You do not have a Bumpkin!");
    }

    const plot = plots[action.index];

    if (!plot) {
      throw new Error("Plot does not exist");
    }

    if (!plot.crop) {
      throw new Error("Nothing was planted");
    }

    const { name: cropName, plantedAt, amount = 1, reward } = plot.crop;

    const { harvestSeconds } = PLOT_CROPS[cropName];

    if (createdAt - plantedAt < harvestSeconds * 1000) {
      throw new Error("Not ready");
    }

    const activityName: BumpkinActivityName = `${cropName} Harvested`;

    bumpkin.activity = trackActivity(activityName, bumpkin.activity);

    // Remove crop data for plot
    delete plot.crop;

    delete plot.fertiliser;

    const cropCount = stateCopy.inventory[cropName] || new Decimal(0);

    stateCopy.inventory = {
      ...stateCopy.inventory,
      [cropName]: cropCount.add(amount),
    };

    return stateCopy;
  });
}
