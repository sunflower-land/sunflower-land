import {
  CollectibleName,
  COLLECTIBLES_DIMENSIONS,
} from "../../types/craftables";
import { GameState, PlacedItem } from "features/game/types/game";
import { produce } from "immer";
import { getCountAndType } from "features/island/hud/components/inventory/utils/inventory";
import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { isCollectibleWithTimestamps } from "./placeCollectible";

/**
 * Places a collectible into the post-volcano `level_one` floor.
 *
 * Mirrors `placeInteriorItem` but writes to `state.interior.level_one`.
 * The level_one floor must already exist (i.e. the player has bought their
 * first upgrade via `interior.upgrade`).
 */
export type PlaceLevelOneItemAction = {
  type: "level_one.itemPlaced";
  name: CollectibleName;
  id: string;
  coordinates: Coordinates;
};

type Options = {
  state: Readonly<GameState>;
  action: PlaceLevelOneItemAction;
  createdAt?: number;
};

export function placeLevelOneItem({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (stateCopy) => {
    const { name } = action;

    if (!(name in COLLECTIBLES_DIMENSIONS)) {
      throw new Error("You cannot place this item");
    }

    const { count: inventoryItemBalance } = getCountAndType(stateCopy, name);
    if (!inventoryItemBalance || inventoryItemBalance.lte(0)) {
      throw new Error("You can't place an item that is not on the inventory");
    }

    const levelOne = stateCopy.interior.level_one;
    if (!levelOne) {
      throw new Error("Level one floor has not been unlocked");
    }

    const collectibleItems = levelOne.collectibles[name] ?? [];

    const existing = collectibleItems.find((c) => !c.coordinates);
    if (existing) {
      existing.coordinates = action.coordinates;
      delete existing.removedAt;
      levelOne.collectibles[name] = collectibleItems;
      return;
    }

    const newPlacement: PlacedItem = {
      id: action.id,
      coordinates: action.coordinates,
    };
    if (isCollectibleWithTimestamps(name)) {
      newPlacement.createdAt = createdAt;
    }

    collectibleItems.push(newPlacement);
    levelOne.collectibles[name] = collectibleItems;
  });
}
