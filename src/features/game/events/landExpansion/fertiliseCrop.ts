import Decimal from "decimal.js-light";
import cloneDeep from "lodash.clonedeep";
import { GameState } from "../../types/game";
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
  CROP_EXISTS = "There is a crop planted!",
  READY_TO_HARVEST = "Crop is ready to harvest!",
  CROP_ALREADY_FERTILISED = "Crop is already fertilised!",
  NO_FERTILISER_SELECTED = "No fertiliser selected!",
  NOT_A_FERTILISER = "Not a fertiliser!",
  NOT_ENOUGH_FERTILISER = "Not enough fertiliser!",
}

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

  if (crop) {
    throw new Error(FERTILISE_CROP_ERRORS.CROP_EXISTS);
  }

  // const cropDetails = CROPS()[crop.name];
  // if (isReadyToHarvest(createdAt, crop, cropDetails)) {
  //   throw new Error(FERTILISE_CROP_ERRORS.READY_TO_HARVEST);
  // }

  if (plot.fertiliser) {
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
    fertiliser: {
      name: action.fertiliser,
      fertilisedAt: createdAt,
    },
    // crop: {
    //   ...crop,
    //   plantedAt: getPlantedAt(
    //     action.fertiliser,
    //     crop.plantedAt,
    //     createdAt,
    //     cropDetails
    //   ),

    // },
  };

  inventory[action.fertiliser] = fertiliserAmount.minus(1);

  return stateCopy;
}
