import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { isWithinAOE } from "features/game/expansion/placeable/lib/collisionDetection";
import { BUILDINGS_DIMENSIONS } from "features/game/types/buildings";
import { FRUIT } from "features/game/types/fruits";
import {
  Buildings,
  FruitPatch,
  GameState,
  Position,
} from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";
import { isFruitReadyToHarvest } from "./fruitHarvested";

export enum MOVE_FRUIT_PATCH_ERRORS {
  NO_BUMPKIN = "You do not have a Bumpkin!",
  FRUIT_PATCH_NOT_PLACED = "This fruit patch is not placed!",
  AOE_LOCKED = "This fruit patch is within the AOE",
}

export type MoveFruitPatchAction = {
  type: "fruitPatch.moved";
  coordinates: Coordinates;
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: MoveFruitPatchAction;
  createdAt?: number;
};

export function isLocked(
  patch: FruitPatch,
  buildings: Buildings,
  createdAt: number
): boolean {
  const fruit = patch.fruit;

  const plantedAt = fruit?.plantedAt;

  // If the fruit has not been planted, then it is not locked
  if (!fruit || !plantedAt) return false;

  const fruitName = fruit.name;
  const cropDetails = FRUIT()[fruitName];

  if (isFruitReadyToHarvest(createdAt, fruit, cropDetails)) return false;

  if (buildings["Advanced Composter"]?.[0]) {
    const composter = buildings["Advanced Composter"]?.[0];

    if (!composter.producing) return false;

    const isComposting = composter.producing?.readyAt > Date.now();

    if (!isComposting) return false;

    const composterCoordinates = composter.coordinates;
    const scarecrowDimensions = BUILDINGS_DIMENSIONS["Advanced Composter"];

    const scarecrowPosition: Position = {
      x: composterCoordinates.x,
      y: composterCoordinates.y,
      height: scarecrowDimensions.height,
      width: scarecrowDimensions.width,
    };

    const patchPosition: Position = {
      x: patch?.x,
      y: patch?.y,
      height: patch.height,
      width: patch.width,
    };

    if (isWithinAOE("Advanced Composter", scarecrowPosition, patchPosition)) {
      return true;
    }
  }

  return false;
}

export function moveFruitPatch({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const stateCopy = cloneDeep(state) as GameState;
  const fruitPatch = stateCopy.fruitPatches;

  if (stateCopy.bumpkin === undefined) {
    throw new Error(MOVE_FRUIT_PATCH_ERRORS.NO_BUMPKIN);
  }

  if (!fruitPatch[action.id]) {
    throw new Error(MOVE_FRUIT_PATCH_ERRORS.FRUIT_PATCH_NOT_PLACED);
  }

  if (isLocked(fruitPatch[action.id], stateCopy.buildings, createdAt)) {
    throw new Error(MOVE_FRUIT_PATCH_ERRORS.AOE_LOCKED);
  }

  fruitPatch[action.id].x = action.coordinates.x;
  fruitPatch[action.id].y = action.coordinates.y;

  return stateCopy;
}
