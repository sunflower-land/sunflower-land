import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { isWithinAOE } from "features/game/expansion/placeable/lib/collisionDetection";
import { COLLECTIBLES_DIMENSIONS } from "features/game/types/craftables";
import {
  Collectibles,
  CropPlot,
  GameState,
  Position,
} from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";
import { isReadyToHarvest } from "./harvest";
import { CROPS } from "features/game/types/crops";

export enum MOVE_CROP_ERRORS {
  NO_BUMPKIN = "You do not have a Bumpkin!",
  CROP_NOT_PLACED = "This crop is not placed!",
  AOE_LOCKED = "This crop is within the AOE",
}

export type MoveCropAction = {
  type: "crop.moved";
  coordinates: Coordinates;
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: MoveCropAction;
  createdAt?: number;
};

export function isLocked(
  plot: CropPlot,
  collectibles: Collectibles,
  createdAt: number
): boolean {
  const cropName = plot.crop?.name;
  const crop = plot.crop;
  const isBasicCrop =
    cropName === "Sunflower" || cropName === "Potato" || cropName === "Pumpkin";

  const plantedAt = plot.crop?.plantedAt;

  // If the crop is not a basic crop, or if it has not been planted, then it is not locked
  if (!crop || !isBasicCrop || !plantedAt) return false;

  const cropDetails = CROPS()[cropName];

  if (isReadyToHarvest(createdAt, crop, cropDetails)) return false;

  if (plot.crop && collectibles["Basic Scarecrow"]?.[0]) {
    const basicScarecrowCoordinates =
      collectibles["Basic Scarecrow"]?.[0].coordinates;
    const scarecrowDimensions = COLLECTIBLES_DIMENSIONS["Basic Scarecrow"];

    const scarecrowPosition: Position = {
      x: basicScarecrowCoordinates.x,
      y: basicScarecrowCoordinates.y,
      height: scarecrowDimensions.height,
      width: scarecrowDimensions.width,
    };

    const plotPosition: Position = {
      x: plot?.x,
      y: plot?.y,
      height: plot.height,
      width: plot.width,
    };

    if (
      isBasicCrop &&
      isWithinAOE("Basic Scarecrow", scarecrowPosition, plotPosition)
    ) {
      return true;
    }
  }

  if (plot.crop && collectibles["Scary Mike"]?.[0]) {
    const basicScarecrowCoordinates =
      collectibles["Scary Mike"]?.[0].coordinates;
    const scarecrowDimensions = COLLECTIBLES_DIMENSIONS["Scary Mike"];

    const scarecrowPosition: Position = {
      x: basicScarecrowCoordinates.x,
      y: basicScarecrowCoordinates.y,
      height: scarecrowDimensions.height,
      width: scarecrowDimensions.width,
    };

    const plotPosition: Position = {
      x: plot?.x,
      y: plot?.y,
      height: plot.height,
      width: plot.width,
    };

    if (
      isBasicCrop &&
      isWithinAOE("Scary Mike", scarecrowPosition, plotPosition)
    ) {
      return true;
    }
  }

  return false;
}

export function moveCrop({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const stateCopy = cloneDeep(state) as GameState;
  const crops = stateCopy.crops;
  const collectibles = stateCopy.collectibles;
  const plot = crops[action.id];

  if (stateCopy.bumpkin === undefined) {
    throw new Error(MOVE_CROP_ERRORS.NO_BUMPKIN);
  }

  if (!plot) {
    throw new Error(MOVE_CROP_ERRORS.CROP_NOT_PLACED);
  }

  if (isLocked(plot, collectibles, createdAt)) {
    throw new Error(MOVE_CROP_ERRORS.AOE_LOCKED);
  }

  crops[action.id].x = action.coordinates.x;
  crops[action.id].y = action.coordinates.y;

  return stateCopy;
}
