import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { isWithinAOE } from "features/game/expansion/placeable/lib/collisionDetection";
import { COLLECTIBLES_DIMENSIONS } from "features/game/types/craftables";
import {
  Collectibles,
  CropPlot,
  GameState,
  Position,
} from "features/game/types/game";
import { isReadyToHarvest } from "./harvest";
import { PLOT_CROPS } from "features/game/types/crops";
import { isBasicCrop, isMediumCrop, isAdvancedCrop } from "./harvest";
import { produce } from "immer";

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
  createdAt: number,
  bumpkin: GameState["bumpkin"],
): boolean {
  const crop = plot.crop;

  const plantedAt = plot.crop?.plantedAt;

  // If the crop is not a basic crop, or if it has not been planted, then it is not locked
  if (!crop || !plantedAt) return false;

  const cropName = crop.name;
  const cropDetails = PLOT_CROPS[cropName];

  if (isReadyToHarvest(createdAt, crop, cropDetails)) return false;

  if (isBasicCrop(cropName) && collectibles["Basic Scarecrow"]?.[0]) {
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
      isWithinAOE(
        "Basic Scarecrow",
        scarecrowPosition,
        plotPosition,
        bumpkin.skills,
      )
    ) {
      return true;
    }
  }

  if (isMediumCrop(cropName) && collectibles["Scary Mike"]?.[0]) {
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
      isWithinAOE("Scary Mike", scarecrowPosition, plotPosition, bumpkin.skills)
    ) {
      return true;
    }
  }

  const gnome = collectibles["Gnome"]?.[0];
  if (gnome) {
    if (gnome.coordinates.x === plot.x && gnome.coordinates.y === plot.y + 1) {
      return true;
    }
  }

  if (collectibles["Sir Goldensnout"]?.[0]) {
    const basicScarecrowCoordinates =
      collectibles["Sir Goldensnout"]?.[0].coordinates;
    const scarecrowDimensions = COLLECTIBLES_DIMENSIONS["Sir Goldensnout"];

    const itemPosition: Position = {
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
      isWithinAOE("Sir Goldensnout", itemPosition, plotPosition, bumpkin.skills)
    ) {
      return true;
    }
  }

  if (
    isAdvancedCrop(cropName) &&
    collectibles["Laurie the Chuckle Crow"]?.[0]
  ) {
    const ScarecrowCoordinates =
      collectibles["Laurie the Chuckle Crow"]?.[0].coordinates;
    const scarecrowDimensions =
      COLLECTIBLES_DIMENSIONS["Laurie the Chuckle Crow"];

    const scarecrowPosition: Position = {
      x: ScarecrowCoordinates.x,
      y: ScarecrowCoordinates.y,
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
      isWithinAOE(
        "Laurie the Chuckle Crow",
        scarecrowPosition,
        plotPosition,
        bumpkin.skills,
      )
    ) {
      return true;
    }
  }

  if (
    (isMediumCrop(cropName) || isAdvancedCrop(cropName)) &&
    collectibles["Gnome"]?.[0]
  ) {
    const gnomeCoordinates = collectibles["Gnome"]?.[0].coordinates;
    const gnomeDimensions = COLLECTIBLES_DIMENSIONS["Gnome"];

    const gnomePosition: Position = {
      x: gnomeCoordinates.x,
      y: gnomeCoordinates.y,
      height: gnomeDimensions.height,
      width: gnomeDimensions.width,
    };

    const plotPosition: Position = {
      x: plot?.x,
      y: plot?.y,
      height: plot.height,
      width: plot.width,
    };

    if (isWithinAOE("Gnome", gnomePosition, plotPosition, bumpkin.skills)) {
      return true;
    }
  }

  if (cropName === "Corn" && collectibles["Queen Cornelia"]?.[0]) {
    const coordinates = collectibles["Queen Cornelia"]?.[0].coordinates;
    const dimensions = COLLECTIBLES_DIMENSIONS["Queen Cornelia"];

    const position: Position = {
      x: coordinates.x,
      y: coordinates.y,
      height: dimensions.height,
      width: dimensions.width,
    };

    const plotPosition: Position = {
      x: plot?.x,
      y: plot?.y,
      height: plot.height,
      width: plot.width,
    };

    if (isWithinAOE("Queen Cornelia", position, plotPosition, bumpkin.skills)) {
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
  return produce(state, (stateCopy) => {
    const { crops, collectibles } = stateCopy;
    const plot = crops[action.id];

    if (stateCopy.bumpkin === undefined) {
      throw new Error(MOVE_CROP_ERRORS.NO_BUMPKIN);
    }

    if (!plot) {
      throw new Error(MOVE_CROP_ERRORS.CROP_NOT_PLACED);
    }

    if (isLocked(plot, collectibles, createdAt, stateCopy.bumpkin)) {
      throw new Error(MOVE_CROP_ERRORS.AOE_LOCKED);
    }

    crops[action.id].x = action.coordinates.x;
    crops[action.id].y = action.coordinates.y;

    return stateCopy;
  });
}
