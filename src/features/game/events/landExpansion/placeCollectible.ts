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
import {
  getPlacedCommonPetTypesInPetHouse,
  isPet,
  PetName,
  PET_HOUSE_CAPACITY,
  PET_TYPES,
} from "features/game/types/pets";
import {
  EXPIRY_COOLDOWNS,
  TemporaryCollectibleName,
} from "features/game/lib/collectibleBuilt";
import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { COMPETITION_POINTS } from "features/game/types/competitions";
import { populateSaltFarm } from "features/game/types/salt";
import { hasFeatureAccess } from "lib/flags";

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

export const isPetCollectible = (name: CollectibleName): name is PetName =>
  name in PET_TYPES;

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

    // Only pet collectibles can be placed in the pet house
    if (action.location === "petHouse" && !isPetCollectible(action.name)) {
      throw new Error("Only pet collectibles can be placed in the pet house");
    }

    const isMonument = action.name in REQUIRED_CHEERS;
    const isInCompletedProjects =
      stateCopy.socialFarming.completedProjects?.includes(
        action.name as MonumentName,
      ) ?? false;

    if (
      isMonument &&
      !stateCopy.socialFarming.villageProjects[action.name as MonumentName] &&
      !isInCompletedProjects
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

    // Check pet house breed limit for common pets
    if (action.location === "petHouse" && isPetCollectible(action.name)) {
      const level = stateCopy.petHouse?.level ?? 1;
      const capacity = PET_HOUSE_CAPACITY[level]?.commonPets ?? 0;
      const placedTypes = getPlacedCommonPetTypesInPetHouse(stateCopy.petHouse);
      const petType = PET_TYPES[action.name];

      if (
        petType &&
        !placedTypes.includes(petType) &&
        placedTypes.length >= capacity
      ) {
        throw new Error("Pet house breed limit reached");
      }
    }

    // For level_one, the floor must already be unlocked (player has bought the
    // first interior.upgrade) before any placement is allowed.
    if (action.location === "level_one" && !stateCopy.interior.level_one) {
      throw new Error("Level one floor has not been unlocked");
    }

    // Search for existing collectible in current location
    const collectibleItems =
      action.location === "home"
        ? (stateCopy.home.collectibles[action.name] ?? [])
        : action.location === "petHouse" && isPetCollectible(action.name)
          ? (stateCopy.petHouse.pets[action.name] ?? [])
          : action.location === "interior"
            ? (stateCopy.interior.ground.collectibles[action.name] ?? [])
            : action.location === "level_one"
              ? (stateCopy.interior.level_one!.collectibles[action.name] ?? [])
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

    // If no existing collectible is found, search for it in other locations, and move it to the new location
    // Define which locations to search based on target location
    const otherLocations: PlaceableLocation[] =
      action.location === "home"
        ? ["farm", "petHouse"]
        : action.location === "petHouse"
          ? ["farm", "home"]
          : action.location === "interior"
            ? ["farm", "home", "level_one"]
            : action.location === "level_one"
              ? ["farm", "home", "interior"]
              : ["home", "petHouse"]; // farm

    const getCollectiblesForLocation = (
      loc: PlaceableLocation,
    ): PlacedItem[] => {
      switch (loc) {
        case "home":
          return stateCopy.home.collectibles[action.name] ?? [];
        case "petHouse":
          return isPetCollectible(action.name)
            ? (stateCopy.petHouse.pets[action.name] ?? [])
            : [];
        case "interior":
          return stateCopy.interior.ground.collectibles[action.name] ?? [];
        case "level_one":
          return stateCopy.interior.level_one?.collectibles[action.name] ?? [];
        case "farm":
        default:
          return stateCopy.collectibles[action.name] ?? [];
      }
    };

    const setCollectiblesForLocation = (
      loc: PlaceableLocation,
      items: PlacedItem[],
    ) => {
      switch (loc) {
        case "home":
          stateCopy.home.collectibles[action.name] = items;
          break;
        case "petHouse":
          if (isPetCollectible(action.name)) {
            stateCopy.petHouse.pets[action.name] = items;
          }
          break;
        case "interior":
          stateCopy.interior.ground.collectibles[action.name] = items;
          break;
        case "level_one":
          if (stateCopy.interior.level_one) {
            stateCopy.interior.level_one.collectibles[action.name] = items;
          }
          break;
        case "farm":
        default:
          stateCopy.collectibles[action.name] = items;
          break;
      }
    };

    // Search other locations for collectible without coordinates
    for (const otherLocation of otherLocations) {
      const otherCollectibleItems = getCollectiblesForLocation(otherLocation);
      const existingCollectibleIndex = otherCollectibleItems.findIndex(
        (collectible) => !collectible.coordinates,
      );

      if (existingCollectibleIndex !== -1) {
        existingCollectible = otherCollectibleItems[existingCollectibleIndex];
        existingCollectible.coordinates = action.coordinates;
        delete existingCollectible.removedAt;

        // Add to target location
        collectibleItems.push(existingCollectible);
        setCollectiblesForLocation(action.location, collectibleItems);

        // Remove from source location
        otherCollectibleItems.splice(existingCollectibleIndex, 1);
        setCollectiblesForLocation(otherLocation, otherCollectibleItems);

        return stateCopy;
      }
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
    } else if (
      action.location === "petHouse" &&
      isPetCollectible(action.name)
    ) {
      stateCopy.petHouse.pets[action.name] = collectibleItems;
    } else if (action.location === "interior") {
      stateCopy.interior.ground.collectibles[action.name] = collectibleItems;
    } else if (action.location === "level_one") {
      // The not-unlocked check at the top of this reducer guarantees level_one
      // exists by this point.
      stateCopy.interior.level_one!.collectibles[action.name] =
        collectibleItems;
    } else {
      stateCopy.collectibles[action.name] = collectibleItems;
    }

    stateCopy.farmActivity = trackFarmActivity(
      "Collectible Placed",
      stateCopy.farmActivity,
    );

    if (hasFeatureAccess(stateCopy, "SALT_FARM")) {
      populateSaltFarm({
        gameBefore: state,
        gameAfter: stateCopy,
        now: createdAt,
      });
    }

    return stateCopy;
  });
}
