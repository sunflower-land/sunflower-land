import { CollectibleName } from "features/game/types/craftables";
import { GameState } from "features/game/types/game";
import { produce } from "immer";

export enum REMOVE_INTERIOR_ITEM_ERRORS {
  NO_BUMPKIN = "You do not have a Bumpkin",
  INVALID_COLLECTIBLE = "This collectible is not placed in the interior",
}

export type RemoveInteriorItemAction = {
  type: "interior.itemRemoved";
  name: CollectibleName;
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: RemoveInteriorItemAction;
  createdAt?: number;
};

export function removeInteriorItem({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (stateCopy) => {
    if (!stateCopy.bumpkin) {
      throw new Error(REMOVE_INTERIOR_ITEM_ERRORS.NO_BUMPKIN);
    }

    const group = stateCopy.interior.ground.collectibles[action.name];
    if (!group) {
      throw new Error(REMOVE_INTERIOR_ITEM_ERRORS.INVALID_COLLECTIBLE);
    }

    const item = group.find((c) => c.id === action.id);
    if (!item) {
      throw new Error(REMOVE_INTERIOR_ITEM_ERRORS.INVALID_COLLECTIBLE);
    }

    delete item.coordinates;
    item.removedAt = createdAt;
  });
}
