import Decimal from "decimal.js-light";
import { GameState } from "../../types/game";
import { CropCompostName } from "features/game/types/composters";
import { CROPS, Crop, isBasicCrop } from "features/game/types/crops";
import { isReadyToHarvest } from "./harvest";
import { trackFarmActivity } from "features/game/types/farmActivity";
import { produce } from "immer";
import {
  Position,
  isWithinAOE,
} from "features/game/expansion/placeable/lib/collisionDetection";
import { isCollectibleOnFarm, setAOEAvailableAt } from "features/game/lib/aoe";
import { COLLECTIBLES_DIMENSIONS } from "features/game/types/craftables";
import { RESOURCE_DIMENSIONS } from "features/game/types/resources";
import { gameAnalytics } from "lib/gameAnalytics";

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

type ApplyFertiliserArgs = {
  game: GameState;
  plotId: string;
  fertiliser: CropCompostName;
  createdAt: number;
};

export function applyFertiliserToPlot({
  game,
  plotId,
  fertiliser,
  createdAt,
}: ApplyFertiliserArgs) {
  const plot = game.crops[plotId];

  plot.fertiliser = {
    name: fertiliser,
    fertilisedAt: createdAt,
  };

  const crop = plot.crop;
  if (!crop) return plot;

  const cropDetails = CROPS[crop.name];

  if (fertiliser === "Rapid Root" && cropDetails) {
    const { newPlantedAt, timeReduction } = getPlantedAt(
      fertiliser,
      crop.plantedAt,
      createdAt,
      cropDetails,
    );

    crop.plantedAt = newPlantedAt;
    crop.boostedTime = (crop.boostedTime ?? 0) + timeReduction;

    if (
      isCollectibleOnFarm({ name: "Basic Scarecrow", game }) &&
      isBasicCrop(crop.name)
    ) {
      const scarecrow = game.collectibles["Basic Scarecrow"]?.[0];
      const coordinates = scarecrow?.coordinates;
      if (
        !coordinates ||
        plot.x === undefined ||
        plot.y === undefined ||
        !game.bumpkin
      ) {
        return plot;
      }

      const dimensions = COLLECTIBLES_DIMENSIONS["Basic Scarecrow"];
      const px = plot.x as number;
      const py = plot.y as number;
      const plotPosition: Position = {
        x: px,
        y: py,
        ...RESOURCE_DIMENSIONS["Crop Plot"],
      };
      const scarecrowPosition: Position = {
        ...dimensions,
        ...coordinates,
      };

      if (
        isWithinAOE(
          "Basic Scarecrow",
          scarecrowPosition,
          plotPosition,
          game.bumpkin.skills,
        )
      ) {
        const dx = px - coordinates.x;
        const dy = py - coordinates.y;
        setAOEAvailableAt(
          game.aoe,
          "Basic Scarecrow",
          { dx, dy },
          createdAt,
          crop.plantedAt + cropDetails.harvestSeconds * 1000 - createdAt,
        );
      }
    }
  }

  return plot;
}

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

    if (plot.x === undefined || plot.y === undefined) {
      throw new Error(FERTILISE_CROP_ERRORS.PLOT_NOT_PLACED);
    }

    const crop = plot.crop;
    if (crop) {
      const cropDetails = crop && CROPS[crop.name];
      if (cropDetails && isReadyToHarvest(createdAt, crop, cropDetails)) {
        throw new Error(FERTILISE_CROP_ERRORS.READY_TO_HARVEST);
      }
    }

    applyFertiliserToPlot({
      game: stateCopy,
      plotId: action.plotID,
      fertiliser: action.fertiliser,
      createdAt,
    });

    inventory[action.fertiliser] = fertiliserAmount.minus(1);

    const previousFertilised = stateCopy.farmActivity?.["Crop Fertilised"] ?? 0;
    stateCopy.farmActivity = trackFarmActivity(
      `Crop Fertilised`,
      stateCopy.farmActivity,
    );

    const fertilised = stateCopy.farmActivity?.["Crop Fertilised"] ?? 0;
    if (previousFertilised === 0 && fertilised > 0) {
      gameAnalytics.trackMilestone({
        event: "Tutorial:Fertilised:Completed",
      });
    }

    return stateCopy;
  });
}
