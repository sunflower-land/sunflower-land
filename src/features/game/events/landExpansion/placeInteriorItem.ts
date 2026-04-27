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
 * Places a collectible into the new `interior` GameState field.
 *
 * This is deliberately an entirely separate event from "collectible.placed" — the
 * interior feature is a fresh placement surface and does not share code paths with
 * the legacy `home` field. Players opt in by placing items via this event.
 *
 * Front-end only for v1. No inventory consumption here beyond the existing
 * "must have ≥1 in inventory" check (placed items sit in `interior.collectibles`
 * and are implicitly accounted for the same way `home.collectibles` is).
 */
export type PlaceInteriorItemAction = {
  type: "interior.itemPlaced";
  name: CollectibleName;
  id: string;
  coordinates: Coordinates;
};

type Options = {
  state: Readonly<GameState>;
  action: PlaceInteriorItemAction;
  createdAt?: number;
};

export function placeInteriorItem({
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

    // For now there's only one interior level ("ground") — future levels
    // (upstairs / basement / etc.) plug in alongside it without changing
    // this code path; we'll thread a level parameter through then.
    const level = stateCopy.interior.ground;
    const collectibleItems = level.collectibles[name] ?? [];

    // If the player has an un-placed entry for this collectible (e.g. just
    // picked up from elsewhere and has it "in hand"), re-anchor it here rather
    // than creating a duplicate row.
    const existing = collectibleItems.find((c) => !c.coordinates);
    if (existing) {
      existing.coordinates = action.coordinates;
      delete existing.removedAt;
      level.collectibles[name] = collectibleItems;
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
    level.collectibles[name] = collectibleItems;
  });
}
