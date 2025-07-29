import Decimal from "decimal.js-light";
import { GameState } from "../../types/game";
import { CropCompostName } from "features/game/types/composters";
import { CROPS, Crop, isBasicCrop } from "features/game/types/crops";
import { isReadyToHarvest } from "./harvest";
import { trackActivity } from "features/game/types/bumpkinActivity";
import { produce } from "immer";
import {
  Position,
  isWithinAOE,
} from "features/game/expansion/placeable/lib/collisionDetection";
import { setAOEAvailableAt } from "features/game/lib/aoe";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import { COLLECTIBLES_DIMENSIONS } from "features/game/types/craftables";
import { RESOURCE_DIMENSIONS } from "features/game/types/resources";

export type LandExpansionFertiliseCropAction = {
  type: "plot.fertilised";
  plotID: string;
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
  PLOT_NOT_PLACED = "Plot not placed!",
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
    return { newPlantedAt: plantedAt - timeReduction, timeReduction };
  }

  return { newPlantedAt: plantedAt, timeReduction: 0 };
};

export function fertilisePlot({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (stateCopy) => {
    const { crops: plots, inventory, bumpkin } = stateCopy;
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

    if (plot.x === undefined || plot.y === undefined) {
      throw new Error(FERTILISE_CROP_ERRORS.PLOT_NOT_PLACED);
    }

    if (crop) {
      const cropDetails = crop && CROPS[crop.name];
      if (cropDetails && isReadyToHarvest(createdAt, crop, cropDetails)) {
        throw new Error(FERTILISE_CROP_ERRORS.READY_TO_HARVEST);
      }

      if (cropDetails && action.fertiliser === "Rapid Root") {
        const { newPlantedAt, timeReduction } = getPlantedAt(
          action.fertiliser,
          crop.plantedAt,
          createdAt,
          cropDetails,
        );
        crop.plantedAt = newPlantedAt;

        crop.boostedTime = (crop.boostedTime ?? 0) + timeReduction;
        if (
          stateCopy.collectibles["Basic Scarecrow"]?.[0] &&
          isBasicCrop(crop.name)
        ) {
          const basicScarecrowCoordinates =
            stateCopy.collectibles["Basic Scarecrow"]?.[0].coordinates;
          const scarecrowDimensions =
            COLLECTIBLES_DIMENSIONS["Basic Scarecrow"];

          const scarecrowPosition: Position = {
            x: basicScarecrowCoordinates.x,
            y: basicScarecrowCoordinates.y,
            height: scarecrowDimensions.height,
            width: scarecrowDimensions.width,
          };

          const plotPosition: Position = {
            x: plot?.x,
            y: plot?.y,
            ...RESOURCE_DIMENSIONS["Crop Plot"],
          };

          if (
            isCollectibleBuilt({
              name: "Basic Scarecrow",
              game: stateCopy,
            }) &&
            isWithinAOE(
              "Basic Scarecrow",
              scarecrowPosition,
              plotPosition,
              stateCopy.bumpkin.skills,
            )
          ) {
            if (basicScarecrowCoordinates) {
              const dx = plot.x - basicScarecrowCoordinates.x;
              const dy = plot.y - basicScarecrowCoordinates.y;
              setAOEAvailableAt(
                stateCopy.aoe,
                "Basic Scarecrow",
                { dx, dy },
                createdAt,
                crop.plantedAt + cropDetails.harvestSeconds * 1000 - createdAt,
              );
            }
          }
        }
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
