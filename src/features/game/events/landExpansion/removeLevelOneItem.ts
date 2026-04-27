import { CollectibleName } from "features/game/types/craftables";
import { GameState } from "features/game/types/game";
import { produce } from "immer";

export enum REMOVE_LEVEL_ONE_ITEM_ERRORS {
  NO_BUMPKIN = "You do not have a Bumpkin",
  NO_LEVEL_ONE = "Level one floor has not been unlocked",
  INVALID_COLLECTIBLE = "This collectible is not placed in level_one",
}

export type RemoveLevelOneItemAction = {
  type: "level_one.itemRemoved";
  name: CollectibleName;
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: RemoveLevelOneItemAction;
  createdAt?: number;
};

export function removeLevelOneItem({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (stateCopy) => {
    if (!stateCopy.bumpkin) {
      throw new Error(REMOVE_LEVEL_ONE_ITEM_ERRORS.NO_BUMPKIN);
    }

    const levelOne = stateCopy.interior.level_one;
    if (!levelOne) {
      throw new Error(REMOVE_LEVEL_ONE_ITEM_ERRORS.NO_LEVEL_ONE);
    }

    const group = levelOne.collectibles[action.name];
    if (!group) {
      throw new Error(REMOVE_LEVEL_ONE_ITEM_ERRORS.INVALID_COLLECTIBLE);
    }

    const item = group.find((c) => c.id === action.id);
    if (!item) {
      throw new Error(REMOVE_LEVEL_ONE_ITEM_ERRORS.INVALID_COLLECTIBLE);
    }

    delete item.coordinates;
    item.removedAt = createdAt;
  });
}
