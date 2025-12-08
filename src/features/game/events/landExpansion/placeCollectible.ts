import {
  CollectibleName,
  COLLECTIBLES_DIMENSIONS,
} from "../../types/craftables";
import { GameState, PlacedItem } from "features/game/types/game";
import { trackFarmActivity } from "features/game/types/farmActivity";
import { PlaceableLocation } from "features/game/types/collectibles";
import { produce } from "immer";
import { getCountAndType } from "features/island/hud/components/inventory/utils/inventory";
import { MonumentName, REQUIRED_CHEERS } from "features/game/types/monuments";
import { isPet } from "features/game/types/pets";
import {
  EXPIRY_COOLDOWNS,
  TemporaryCollectibleName,
} from "features/game/lib/collectibleBuilt";
import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { COMPETITION_POINTS } from "features/game/types/competitions";

export type PlaceCollectibleAction = {
  type: "collectible.placed";
  name: CollectibleName;
  id: string;
  coordinates: Coordinates;
  location: PlaceableLocation;
};

type Options = {
  state: Readonly<GameState>;
  action: PlaceCollectibleAction;
  createdAt?: number;
};

/**
 * We only need to store createdAt and readyAt for certain collectibles
 * This helps store on space since most items don't need these timestamps
 */
export function isCollectibleWithTimestamps(name: CollectibleName) {
  return (
    EXPIRY_COOLDOWNS[name as TemporaryCollectibleName] ||
    name === "Maneki Neko" ||
    name === "Magic Bean"
  );
}

export function placeCollectible({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (stateCopy) => {
    const collectible = action.name;

    const { count: inventoryItemBalance } = getCountAndType(
      stateCopy,
      collectible,
    );

    if (
      action.name === "Fox Shrine" &&
      createdAt < COMPETITION_POINTS.BUILDING_FRIENDSHIPS.endAt
    ) {
      throw new Error("You cannot place this item");
    }

    if (!inventoryItemBalance || inventoryItemBalance.lte(0)) {
      throw new Error("You can't place an item that is not on the inventory");
    }

    if (!(collectible in COLLECTIBLES_DIMENSIONS)) {
      throw new Error("You cannot place this item");
    }

    const isMonument = action.name in REQUIRED_CHEERS;

    if (
      isMonument &&
      !stateCopy.socialFarming.villageProjects[action.name as MonumentName]
    ) {
      stateCopy.socialFarming.villageProjects[action.name as MonumentName] = {
        cheers: 0,
      };
    }

    if (isPet(action.name)) {
      if (!stateCopy.pets) {
        stateCopy.pets = {};
      }
      if (!stateCopy.pets.common) {
        stateCopy.pets.common = {};
      }
      if (!stateCopy.pets.common[action.name]) {
        stateCopy.pets.common[action.name] = {
          name: action.name,
          experience: 0,
          energy: 0,
          requests: {
            food: [], // Pet Requests are populated on the server
            fedAt: createdAt,
          },
          pettedAt: createdAt,
        };
      }
    }

    // Search for existing collectible in current location
    const collectibleItems =
      action.location === "home"
        ? (stateCopy.home.collectibles[action.name] ?? [])
        : (stateCopy.collectibles[action.name] ?? []);

    let existingCollectible = collectibleItems.find(
      (collectible) => !collectible.coordinates,
    );

    // Updates that collectible in current location if it exists
    if (existingCollectible) {
      existingCollectible.coordinates = action.coordinates;
      delete existingCollectible.removedAt;

      return stateCopy;
    }

    // If no existing collectible is found, search for it in the other location, and move it to the new location

    const otherCollectibleItems =
      action.location === "home"
        ? (stateCopy.collectibles[action.name] ?? [])
        : (stateCopy.home.collectibles[action.name] ?? []);

    const existingCollectibleIndex = otherCollectibleItems.findIndex(
      (collectible) => !collectible.coordinates,
    );
    existingCollectible = otherCollectibleItems[existingCollectibleIndex];

    // Move it to new location
    if (existingCollectible) {
      existingCollectible.coordinates = action.coordinates;
      delete existingCollectible.removedAt;
      if (action.location === "home") {
        // Add to home
        collectibleItems.push(existingCollectible);
        stateCopy.home.collectibles[action.name] = collectibleItems;

        // Remove from farm
        otherCollectibleItems.splice(existingCollectibleIndex, 1);
        stateCopy.collectibles[action.name] = otherCollectibleItems;
      } else {
        // Add to farm
        collectibleItems.push(existingCollectible);
        stateCopy.collectibles[action.name] = collectibleItems;

        // Remove from home
        otherCollectibleItems.splice(existingCollectibleIndex, 1);
        stateCopy.home.collectibles[action.name] = otherCollectibleItems;
      }

      return stateCopy;
    }

    // If no existing collectible is found, create a new one
    const newCollectiblePlacement: PlacedItem = {
      id: action.id,
      coordinates: action.coordinates,
    };

    // There are some rare cases where we need to set the createdAt
    if (isCollectibleWithTimestamps(action.name)) {
      newCollectiblePlacement.createdAt = createdAt;
    }

    collectibleItems.push(newCollectiblePlacement);

    // Update stateCopy with the new collectibleItems
    if (action.location === "home") {
      stateCopy.home.collectibles[action.name] = collectibleItems;
    } else {
      stateCopy.collectibles[action.name] = collectibleItems;
    }

    stateCopy.farmActivity = trackFarmActivity(
      "Collectible Placed",
      stateCopy.farmActivity,
    );

    return stateCopy;
  });
}
