import Decimal from "decimal.js-light";
import { screenTracker } from "lib/utils/screen";
import cloneDeep from "lodash.clonedeep";
import { CROPS } from "../../types/crops";
import { Fertiliser, GameState, InventoryItemName } from "../../types/game";
import { isReadyToHarvest } from "../harvest";

export type LandExpansionFertiliseCropAction = {
  type: "crop.fertilised";
  plotIndex: number;
  expansionIndex: number;
  fertiliser: Fertiliser;
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

// Seeds which are implemented
const VALID_FERTILISERS: InventoryItemName[] = ["Rapid Growth"];

const isFertiliser = (
  fertiliser: InventoryItemName
): fertiliser is Fertiliser => {
  return VALID_FERTILISERS.includes(fertiliser);
};

export function fertiliseCrop({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const stateCopy = cloneDeep(state);
  const { expansions, inventory } = stateCopy;
  const expansion = expansions[action.expansionIndex];

  if (!expansion) {
    throw new Error(FERTILISE_CROP_ERRORS.EMPTY_EXPANSION);
  }

  if (!expansion.plots) {
    throw new Error(FERTILISE_CROP_ERRORS.EXPANSION_NO_PLOTS);
  }

  const { plots } = expansion;

  if (action.plotIndex < 0) {
    throw new Error(FERTILISE_CROP_ERRORS.EMPTY_PLOT);
  }

  if (!Number.isInteger(action.plotIndex)) {
    throw new Error(FERTILISE_CROP_ERRORS.EMPTY_PLOT);
  }

  if (action.plotIndex >= Object.keys(plots).length) {
    throw new Error(FERTILISE_CROP_ERRORS.EMPTY_PLOT);
  }

  const plot = plots[action.plotIndex];
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

  if (!isFertiliser(action.fertiliser)) {
    throw new Error(FERTILISE_CROP_ERRORS.NOT_A_FERTILISER);
  }

  const fertiliserAmount = inventory[action.fertiliser] || new Decimal(0);

  if (fertiliserAmount.lessThan(1)) {
    throw new Error(FERTILISE_CROP_ERRORS.NOT_ENOUGH_FERTILISER);
  }

  if (!screenTracker.calculate()) {
    throw new Error(FERTILISE_CROP_ERRORS.INVALID_PLANT);
  }

  plots[action.plotIndex] = {
    ...plot,
    crop: {
      ...crop,
      plantedAt: crop.plantedAt - (cropDetails.harvestSeconds * 1000) / 2,
      // Rapid Growth is the only available fertiliser right now
      fertilisers: [
        ...fertilisers,
        {
          name: action.fertiliser,
          fertilisedAt: createdAt,
        },
      ],
    },
  };

  expansion.plots = plots;

  inventory[action.fertiliser] = fertiliserAmount.minus(1);

  return stateCopy;
}
