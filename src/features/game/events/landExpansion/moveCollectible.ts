import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { PlaceableLocation } from "features/game/types/collectibles";
import { CollectibleName } from "features/game/types/craftables";
import { GameState } from "features/game/types/game";
import { produce } from "immer";

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
  location: PlaceableLocation;
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
  return produce(state, (stateCopy) => {
    const collectibleGroup =
      action.location === "home"
        ? stateCopy.home.collectibles[action.name]
        : stateCopy.collectibles[action.name];

    if (stateCopy.bumpkin === undefined) {
      throw new Error(MOVE_COLLECTIBLE_ERRORS.NO_BUMPKIN);
    }

    if (!collectibleGroup) {
      throw new Error(MOVE_COLLECTIBLE_ERRORS.NO_COLLECTIBLES);
    }

    const collectibleToMoveIndex = collectibleGroup.findIndex(
      (collectible) => collectible.id === action.id,
    );

    if (collectibleToMoveIndex < 0) {
      throw new Error(MOVE_COLLECTIBLE_ERRORS.COLLECTIBLE_NOT_PLACED);
    }

    collectibleGroup[collectibleToMoveIndex].coordinates = action.coordinates;

    return stateCopy;
  });
}
