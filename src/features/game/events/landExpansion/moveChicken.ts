import { Coordinates } from "features/game/expansion/components/MapPlacement";
import {
  isWithinAOE,
  Position,
} from "features/game/expansion/placeable/lib/collisionDetection";
import { COLLECTIBLES_DIMENSIONS } from "features/game/types/craftables";
import { Chicken, Collectibles, GameState } from "features/game/types/game";
import { eggIsReady } from "./collectEgg";
import { produce } from "immer";

export enum MOVE_CHICKEN_ERRORS {
  NO_BUMPKIN = "You do not have a Bumpkin!",
  CHICKEN_NOT_PLACED = "This chicken is not placed!",
  AOE_LOCKED = "This chicken is within the AOE and fed!",
}

export function isLocked(
  chicken: Chicken,
  collectibles: Collectibles,
  createdAt: number,
  bumpkin: GameState["bumpkin"],
): boolean {
  if (!chicken || !chicken.coordinates || !chicken.fedAt) return false;

  if (eggIsReady(chicken, createdAt)) return false;

  if (collectibles["Bale"]?.[0]) {
    const baleCoordinates = collectibles["Bale"]?.[0].coordinates;
    const baleDimensions = COLLECTIBLES_DIMENSIONS["Bale"];

    const balePosition: Position = {
      x: baleCoordinates.x,
      y: baleCoordinates.y,
      height: baleDimensions.height,
      width: baleDimensions.width,
    };

    const chickenPosition: Position = {
      x: chicken.coordinates.x,
      y: chicken.coordinates?.y,
      height: 1,
      width: 1,
    };

    if (isWithinAOE("Bale", balePosition, chickenPosition, bumpkin.skills)) {
      return true;
    }
  }

  return false;
}

export type MoveChickenAction = {
  type: "chicken.moved";
  coordinates: Coordinates;
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: MoveChickenAction;
  createdAt?: number;
};

export function moveChicken({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (stateCopy) => {
    const chickens = stateCopy.chickens;
    const collectibles = stateCopy.collectibles;

    if (stateCopy.bumpkin === undefined) {
      throw new Error(MOVE_CHICKEN_ERRORS.NO_BUMPKIN);
    }

    if (!chickens[action.id]?.coordinates) {
      throw new Error(MOVE_CHICKEN_ERRORS.CHICKEN_NOT_PLACED);
    }

    const coordinates = chickens[action.id].coordinates;
    if (!coordinates) {
      throw new Error(MOVE_CHICKEN_ERRORS.CHICKEN_NOT_PLACED);
    }

    if (
      isLocked(chickens[action.id], collectibles, createdAt, stateCopy.bumpkin)
    ) {
      throw new Error(MOVE_CHICKEN_ERRORS.AOE_LOCKED);
    }

    coordinates.x = action.coordinates.x;
    coordinates.y = action.coordinates.y;

    return stateCopy;
  });
}
