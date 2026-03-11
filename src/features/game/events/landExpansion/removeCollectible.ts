import { trackFarmActivity } from "features/game/types/farmActivity";
import { CollectibleName } from "features/game/types/craftables";
import { GameState, PlacedItem, PlacedLamp } from "features/game/types/game";

import { PlaceableLocation } from "features/game/types/collectibles";
import { produce } from "immer";
import { LIMITED_ITEMS } from "./burnCollectible";
import {
  EXPIRY_COOLDOWNS,
  TemporaryCollectibleName,
} from "features/game/lib/collectibleBuilt";
import { PET_SHRINES } from "features/game/types/pets";
import { isPetCollectible } from "./placeCollectible";

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

    const getCollectibleGroup = (
      location: PlaceableLocation,
      name: CollectibleName,
    ) => {
      if (location === "home") {
        return stateCopy.home.collectibles[name];
      } else if (location === "petHouse") {
        if (!isPetCollectible(name)) {
          throw new Error(
            "Only pet collectibles can be removed from the pet house",
          );
        }
        return stateCopy.petHouse.pets[name];
      } else {
        return stateCopy.collectibles[name];
      }
    };

    const collectibleGroup = getCollectibleGroup(action.location, action.name);

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

    if (action.name === "Genie Lamp") {
      const collectible: PlacedLamp = collectibleToRemove;
      const rubbedCount = collectible.rubbedCount ?? 0;
      if (rubbedCount > 0) {
        throw new Error(REMOVE_COLLECTIBLE_ERRORS.GENIE_IN_USE);
      }
    }

    if (LIMITED_ITEMS.includes(action.name)) {
      const collectible: PlacedItem = collectibleToRemove;
      const cooldown =
        EXPIRY_COOLDOWNS[action.name as TemporaryCollectibleName];
      const isShrine =
        action.name in PET_SHRINES || action.name === "Obsidian Shrine";

      // Only expired pet shrines can be removed. Other limited items must be handled
      // via the burn flow (and should remain non-removable from the map).
      if (!isShrine) {
        throw new Error(REMOVE_COLLECTIBLE_ERRORS.LIMITED_ITEM_IN_USE);
      }

      if (!cooldown || (collectible.createdAt ?? 0) + cooldown > createdAt) {
        throw new Error(REMOVE_COLLECTIBLE_ERRORS.LIMITED_ITEM_IN_USE);
      }
    }

    delete collectibleToRemove.coordinates;
    collectibleToRemove.removedAt = createdAt;

    stateCopy.farmActivity = trackFarmActivity(
      "Collectible Removed",
      stateCopy.farmActivity,
    );

    return stateCopy;
  });
}
