import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { CollectibleName } from "features/game/types/craftables";
import { GameState } from "features/game/types/game";
import { hasRestriction } from "features/game/types/removeables";
import cloneDeep from "lodash.clonedeep";

export enum MOVE_COLLECTIBLE_ERRORS {
  NO_BUMPKIN = "You do not have a Bumpkin!",
  NO_COLLECTIBLES = "You don't have any collectible of this type placed!",
  COLLECTIBLE_NOT_PLACED = "This collectible is not placed!",
}

export type MoveCollectibleAction = {
  type: "collectible.moved";
  name: CollectibleName;
  coordinates: Coordinates;
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: MoveCollectibleAction;
  createdAt?: number;
};

export function moveCollectible({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  console.log({ action });
  const stateCopy = cloneDeep(state) as GameState;
  const collectibleGroup = stateCopy.collectibles[action.name];

  if (stateCopy.bumpkin === undefined) {
    throw new Error(MOVE_COLLECTIBLE_ERRORS.NO_BUMPKIN);
  }

  if (!collectibleGroup) {
    throw new Error(MOVE_COLLECTIBLE_ERRORS.NO_COLLECTIBLES);
  }

  const collectibleToMoveIndex = collectibleGroup.findIndex(
    (collectible) => collectible.id === action.id
  );

  if (collectibleToMoveIndex < 0) {
    throw new Error(MOVE_COLLECTIBLE_ERRORS.COLLECTIBLE_NOT_PLACED);
  }

  const isAoEItem =
    action.name === "Bale" ||
    action.name === "Basic Scarecrow" ||
    action.name === "Emerald Turtle" ||
    action.name === "Tin Turtle";

  const [isRestricted, restrictionReason] = hasRestriction(
    action.name,
    action.id,
    stateCopy
  );
  if (isAoEItem && isRestricted) {
    throw new Error(restrictionReason);
  }

  collectibleGroup[collectibleToMoveIndex].coordinates = action.coordinates;

  return stateCopy;
}
