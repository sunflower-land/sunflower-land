import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { FRUIT } from "features/game/types/fruits";
import { FruitPatch, GameState } from "features/game/types/game";
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

export function isLocked(patch: FruitPatch, createdAt: number): boolean {
  const fruit = patch.fruit;

  const plantedAt = fruit?.plantedAt;

  // If the fruit has not been planted, then it is not locked
  if (!fruit || !plantedAt) return false;

  const fruitName = fruit.name;
  const cropDetails = FRUIT()[fruitName];

  if (isFruitReadyToHarvest(createdAt, fruit, cropDetails)) return false;

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

  if (isLocked(fruitPatch[action.id], createdAt)) {
    throw new Error(MOVE_FRUIT_PATCH_ERRORS.AOE_LOCKED);
  }

  fruitPatch[action.id].x = action.coordinates.x;
  fruitPatch[action.id].y = action.coordinates.y;

  return stateCopy;
}
