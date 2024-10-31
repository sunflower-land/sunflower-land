import Decimal from "decimal.js-light";
import { GameState } from "../../types/game";
import { CropCompostName } from "features/game/types/composters";
import { PLOT_CROPS, Crop } from "features/game/types/crops";
import { isReadyToHarvest } from "./harvest";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import { trackActivity } from "features/game/types/bumpkinActivity";
import { produce } from "immer";

export type LandExpansionFertiliseCropAction = {
  type: "plot.fertilised";
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

const getPlantedAt = (
  fertiliser: CropCompostName,
  plantedAt: number,
  fertilisedAt: number,
  cropDetails: Crop,
) => {
  const timeToHarvest = cropDetails.harvestSeconds * 1000;
  const harvestTime = plantedAt + timeToHarvest;
  const timeReduction = (harvestTime - fertilisedAt) / 2;
  if (fertiliser === "Rapid Root") {
    return plantedAt - timeReduction;
  }
  return plantedAt;
};

export function fertilisePlot({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (stateCopy) => {
    const { crops: plots, inventory, collectibles, bumpkin } = stateCopy;

    if (!bumpkin) {
      throw new Error("Bumpkin not found");
    }

    if (!plots[action.plotID]) {
      throw new Error(FERTILISE_CROP_ERRORS.EMPTY_PLOT);
    }

    const plot = plots[action.plotID];

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

    // Apply fertiliser
    plot.fertiliser = {
      name: action.fertiliser,
      fertilisedAt: createdAt,
    };

    // Apply buff if already planted
    const crop = plot.crop;
    if (crop) {
      const cropDetails = crop && PLOT_CROPS[crop.name];
      if (cropDetails && isReadyToHarvest(createdAt, crop, cropDetails)) {
        throw new Error(FERTILISE_CROP_ERRORS.READY_TO_HARVEST);
      }

      if (cropDetails && action.fertiliser === "Rapid Root") {
        crop.plantedAt = getPlantedAt(
          action.fertiliser,
          crop.plantedAt,
          createdAt,
          cropDetails,
        );
      }

      if (!!crop && action.fertiliser === "Sprout Mix") {
        if (isCollectibleBuilt({ name: "Knowledge Crab", game: stateCopy })) {
          crop.amount = (crop.amount ?? 1) + 0.4;
        } else crop.amount = (crop.amount ?? 1) + 0.2;
      }
    }

    inventory[action.fertiliser] = fertiliserAmount.minus(1);

    bumpkin.activity = trackActivity(
      `Crop Fertilised`,
      stateCopy.bumpkin?.activity,
    );

    return stateCopy;
  });
}
