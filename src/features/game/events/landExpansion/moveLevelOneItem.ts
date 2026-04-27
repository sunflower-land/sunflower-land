import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { CollectibleName } from "features/game/types/craftables";
import { GameState } from "features/game/types/game";
import { produce } from "immer";

export enum MOVE_LEVEL_ONE_ITEM_ERRORS {
  NO_BUMPKIN = "You do not have a Bumpkin!",
  NO_LEVEL_ONE = "Level one floor has not been unlocked",
  NO_COLLECTIBLES = "You don't have any collectible of this type placed in level_one!",
  COLLECTIBLE_NOT_PLACED = "This collectible is not placed in level_one!",
}

export type MoveLevelOneItemAction = {
  type: "level_one.itemMoved";
  name: CollectibleName;
  coordinates: Coordinates;
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: MoveLevelOneItemAction;
};

export function moveLevelOneItem({ state, action }: Options): GameState {
  return produce(state, (stateCopy) => {
    if (stateCopy.bumpkin === undefined) {
      throw new Error(MOVE_LEVEL_ONE_ITEM_ERRORS.NO_BUMPKIN);
    }

    const levelOne = stateCopy.interior.level_one;
    if (!levelOne) {
      throw new Error(MOVE_LEVEL_ONE_ITEM_ERRORS.NO_LEVEL_ONE);
    }

    const group = levelOne.collectibles[action.name];
    if (!group) {
      throw new Error(MOVE_LEVEL_ONE_ITEM_ERRORS.NO_COLLECTIBLES);
    }

    const idx = group.findIndex((c) => c.id === action.id);
    if (idx < 0) {
      throw new Error(MOVE_LEVEL_ONE_ITEM_ERRORS.COLLECTIBLE_NOT_PLACED);
    }

    group[idx].coordinates = action.coordinates;
  });
}
