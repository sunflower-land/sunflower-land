import { trackFarmActivity } from "features/game/types/farmActivity";
import { CollectibleName } from "features/game/types/craftables";
import { GameState, PlacedItem, PlacedLamp } from "features/game/types/game";

import { PlaceableLocation } from "features/game/types/collectibles";
import { produce } from "immer";
import { LIMITED_ITEMS } from "./burnCollectible";

export enum REMOVE_COLLECTIBLE_ERRORS {
  INVALID_COLLECTIBLE = "This collectible does not exist",
  NO_BUMPKIN = "You do not have a Bumpkin",
  GENIE_IN_USE = "Genie Lamp is in use",
  COLLECTIBLE_IN_USE = "This item is in use",
  LIMITED_ITEM_IN_USE = "This limited time item is in use",
}

export type RemoveCollectibleAction = {
  type: "collectible.removed";
  name: CollectibleName;
  id: string;
  location: PlaceableLocation;
};

type Options = {
  state: Readonly<GameState>;
  action: RemoveCollectibleAction;
  createdAt?: number;
};

export function removeCollectible({
  state,
  action,
  createdAt = Date.now(),
}: Options) {
  return produce(state, (stateCopy) => {
    const { bumpkin } = stateCopy;
    const collectibleGroup =
      action.location === "home"
        ? stateCopy.home.collectibles[action.name]
        : stateCopy.collectibles[action.name];

    if (bumpkin === undefined) {
      throw new Error(REMOVE_COLLECTIBLE_ERRORS.NO_BUMPKIN);
    }

    if (!collectibleGroup) {
      throw new Error(REMOVE_COLLECTIBLE_ERRORS.INVALID_COLLECTIBLE);
    }

    const collectibleToRemove = collectibleGroup.find(
      (collectible) => collectible.id === action.id,
    );

    if (!collectibleToRemove) {
      throw new Error(REMOVE_COLLECTIBLE_ERRORS.INVALID_COLLECTIBLE);
    }

    delete collectibleToRemove.coordinates;
    collectibleToRemove.removedAt = createdAt;

    // Remove collectible key if there are none placed
    if (collectibleGroup.length === 0) {
      if (action.location === "home") {
        delete stateCopy.home.collectibles[action.name];
      }

      if (action.location === "farm") {
        delete stateCopy.collectibles[action.name];
      }
    } else {
      if (action.location === "home") {
        stateCopy.home.collectibles[action.name] = collectibleGroup;
      }

      if (action.location === "farm") {
        stateCopy.collectibles[action.name] = collectibleGroup;
      }
    }

    if (action.name === "Genie Lamp") {
      const collectible: PlacedLamp = collectibleToRemove;
      const rubbedCount = collectible.rubbedCount ?? 0;
      if (rubbedCount > 0) {
        throw new Error(REMOVE_COLLECTIBLE_ERRORS.GENIE_IN_USE);
      }
    }

    if (LIMITED_ITEMS.includes(action.name)) {
      const collectible: PlacedItem = collectibleToRemove;
      if (collectible) {
        throw new Error(REMOVE_COLLECTIBLE_ERRORS.LIMITED_ITEM_IN_USE);
      }
    }

    stateCopy.farmActivity = trackFarmActivity(
      "Collectible Removed",
      stateCopy.farmActivity,
    );

    return stateCopy;
  });
}
