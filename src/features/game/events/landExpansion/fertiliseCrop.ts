import Decimal from "decimal.js-light";
import cloneDeep from "lodash.clonedeep";
import { CROPS, Crop } from "../../types/crops";
import { GameState } from "../../types/game";
import { isReadyToHarvest } from "./harvest";
import { CropCompostName } from "features/game/types/composters";

export type LandExpansionFertiliseCropAction = {
  type: "crop.fertilised";
  plotID: string;
  expansionIndex: number;
  fertiliser: CropCompostName;
};

type Options = {
  state: Readonly<GameState>;
  action: LandExpansionFertiliseCropAction;
  createdAt?: number;
};

export enum FERTILISE_CROP_ERRORS {
  EMPTY_PLOT = "Plot does not exist!",
  EMPTY_CROP = "There is no crop planted!",
  READY_TO_HARVEST = "Crop is ready to harvest!",
  CROP_ALREADY_FERTILISED = "Crop is already fertilised!",
  NO_FERTILISER_SELECTED = "No fertiliser selected!",
  NOT_A_FERTILISER = "Not a fertiliser!",
  NOT_ENOUGH_FERTILISER = "Not enough fertiliser!",
}

const getPlantedAt = (
  fertiliser: CropCompostName,
  plantedAt: number,
  fertilisedAt: number,
  cropDetails: Crop
) => {
  const timeToHarvest = cropDetails.harvestSeconds * 1000;
  const harvestTime = plantedAt + timeToHarvest;
  const timeReduction = (harvestTime - fertilisedAt) / 2;
  if (fertiliser === "Rapid Root") {
    return plantedAt - timeReduction;
  }
  return plantedAt;
};

export function fertiliseCrop({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const stateCopy = cloneDeep(state);
  const { crops: plots, inventory } = stateCopy;

  if (!action.fertiliser) {
    throw new Error(FERTILISE_CROP_ERRORS.NO_FERTILISER_SELECTED);
  }
  const fertiliserAmount = inventory[action.fertiliser] || new Decimal(0);

  if (fertiliserAmount.lessThan(1)) {
    throw new Error(FERTILISE_CROP_ERRORS.NOT_ENOUGH_FERTILISER);
  }

  const plot = plots[action.plotID];

  if (!plot) {
    throw new Error(FERTILISE_CROP_ERRORS.EMPTY_PLOT);
  }

  const crop = plot.crop;

  if (!crop) {
    throw new Error(FERTILISE_CROP_ERRORS.EMPTY_CROP);
  }

  const cropDetails = CROPS()[crop.name];

  if (isReadyToHarvest(createdAt, crop, cropDetails)) {
    throw new Error(FERTILISE_CROP_ERRORS.READY_TO_HARVEST);
  }

  if (crop.fertiliser) {
    throw new Error(FERTILISE_CROP_ERRORS.CROP_ALREADY_FERTILISED);
  }

  plots[action.plotID] = {
    ...plot,
    crop: {
      ...crop,
      plantedAt: getPlantedAt(
        action.fertiliser,
        crop.plantedAt,
        createdAt,
        cropDetails
      ),
      fertiliser: {
        name: action.fertiliser,
        fertilisedAt: createdAt,
      },
    },
  };

  inventory[action.fertiliser] = fertiliserAmount.minus(1);

  return stateCopy;
}
