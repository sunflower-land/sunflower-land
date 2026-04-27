import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { CollectibleName } from "features/game/types/craftables";
import { GameState } from "features/game/types/game";
import { produce } from "immer";

export enum MOVE_INTERIOR_ITEM_ERRORS {
  NO_BUMPKIN = "You do not have a Bumpkin!",
  NO_COLLECTIBLES = "You don't have any collectible of this type placed in the interior!",
  COLLECTIBLE_NOT_PLACED = "This collectible is not placed in the interior!",
}

export type MoveInteriorItemAction = {
  type: "interior.itemMoved";
  name: CollectibleName;
  coordinates: Coordinates;
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: MoveInteriorItemAction;
};

export function moveInteriorItem({ state, action }: Options): GameState {
  return produce(state, (stateCopy) => {
    if (stateCopy.bumpkin === undefined) {
      throw new Error(MOVE_INTERIOR_ITEM_ERRORS.NO_BUMPKIN);
    }

    const group = stateCopy.interior.ground.collectibles[action.name];

    if (!group) {
      throw new Error(MOVE_INTERIOR_ITEM_ERRORS.NO_COLLECTIBLES);
    }

    const index = group.findIndex((c) => c.id === action.id);
    if (index < 0) {
      throw new Error(MOVE_INTERIOR_ITEM_ERRORS.COLLECTIBLE_NOT_PLACED);
    }

    group[index].coordinates = action.coordinates;
  });
}
