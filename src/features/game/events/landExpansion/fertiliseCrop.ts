import Decimal from "decimal.js-light";
import cloneDeep from "lodash.clonedeep";
import { CROPS, Crop } from "../../types/crops";
import { GameState } from "../../types/game";
import { isReadyToHarvest } from "./harvest";
import { CompostName } from "features/game/types/composters";

export type LandExpansionFertiliseCropAction = {
  type: "crop.fertilised";
  plotID: string;
  expansionIndex: number;
  fertiliser: CompostName;
};

type Options = {
  state: Readonly<GameState>;
  action: LandExpansionFertiliseCropAction;
  createdAt?: number;
};

export enum FERTILISE_CROP_ERRORS {
  EMPTY_EXPANSION = "Expansion does not exist!",
  EXPANSION_NO_PLOTS = "Expansion does not have any plots!",
  EMPTY_PLOT = "Plot does not exist!",
  EMPTY_CROP = "There is no crop planted!",
  READY_TO_HARVEST = "Crop is ready to harvest!",
  CROP_ALREADY_FERTILISED = "Crop is already fertilised!",
  NO_FERTILISER_SELECTED = "No fertiliser selected!",
  NOT_A_FERTILISER = "Not a fertiliser!",
  NOT_ENOUGH_FERTILISER = "Not enough fertiliser!",
  INVALID_PLANT = "Invalid plant!",
}

const getPlantedAt = (
  fertiliser: CompostName,
  plantedAt: number,
  cropDetails: Crop
) => {
  if (fertiliser === "Rapid Root") {
    return plantedAt - (cropDetails.harvestSeconds * 1000) / 2;
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

  if (!plots[action.plotID]) {
    throw new Error(FERTILISE_CROP_ERRORS.EMPTY_PLOT);
  }

  const plot = plots[action.plotID];
  const crop = plot && plot.crop;

  if (!crop) {
    throw new Error(FERTILISE_CROP_ERRORS.EMPTY_CROP);
  }

  const cropDetails = CROPS()[crop.name];
  if (isReadyToHarvest(createdAt, crop, cropDetails)) {
    throw new Error(FERTILISE_CROP_ERRORS.READY_TO_HARVEST);
  }

  const fertilisers = crop.fertilisers || [];

  const alreadyApplied = fertilisers.find(
    (fertiliser) => fertiliser.name === action.fertiliser
  );

  if (alreadyApplied) {
    throw new Error(FERTILISE_CROP_ERRORS.CROP_ALREADY_FERTILISED);
  }

  if (!action.fertiliser) {
    throw new Error(FERTILISE_CROP_ERRORS.NO_FERTILISER_SELECTED);
  }

  const fertiliserAmount = inventory[action.fertiliser] || new Decimal(0);

  if (fertiliserAmount.lessThan(1)) {
    throw new Error(FERTILISE_CROP_ERRORS.NOT_ENOUGH_FERTILISER);
  }

  plots[action.plotID] = {
    ...plot,
    crop: {
      ...crop,
      plantedAt: getPlantedAt(action.fertiliser, crop.plantedAt, cropDetails),
      fertilisers: [
        ...fertilisers,
        {
          name: action.fertiliser,
          fertilisedAt: createdAt,
        },
      ],
    },
  };

  inventory[action.fertiliser] = fertiliserAmount.minus(1);

  return stateCopy;
}
