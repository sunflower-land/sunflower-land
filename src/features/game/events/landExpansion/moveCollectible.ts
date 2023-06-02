import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { CollectibleName } from "features/game/types/craftables";
import { GameState } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";
import { COLLECTIBLE_PLACE_SECONDS } from "./placeCollectible";

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

  collectibleGroup[collectibleToMoveIndex].coordinates = action.coordinates;

  if (action.name === "Basic Scarecrow") {
    const basicScarecrowCooldown =
      COLLECTIBLE_PLACE_SECONDS["Basic Scarecrow"]! * 1000;

    collectibleGroup[collectibleToMoveIndex].readyAt =
      createdAt + basicScarecrowCooldown;
  }

  if (action.name === "Emerald Turtle") {
    const emeraldTurtleCooldown =
      COLLECTIBLE_PLACE_SECONDS["Emerald Turtle"]! * 1000;

    collectibleGroup[collectibleToMoveIndex].readyAt =
      createdAt + emeraldTurtleCooldown;
  }

  if (action.name === "Tin Turtle") {
    const tinTurtleCooldown = COLLECTIBLE_PLACE_SECONDS["Tin Turtle"]! * 1000;

    collectibleGroup[collectibleToMoveIndex].readyAt =
      createdAt + tinTurtleCooldown;
  }

  return stateCopy;
}
