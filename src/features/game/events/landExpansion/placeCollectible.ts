import {
  type CollectibleName,
  COLLECTIBLES_DIMENSIONS,
} from "../../types/craftables";
import type { GameState, PlacedItem } from "features/game/types/game";
import { trackFarmActivity } from "features/game/types/farmActivity";
import {
  PLACEABLE_LOCATIONS,
  type PlaceableLocation,
} from "features/game/types/collectibles";
import { produce } from "immer";
import { getCountAndType } from "features/island/hud/components/inventory/utils/inventory";
import {
  type MonumentName,
  REQUIRED_CHEERS,
} from "features/game/types/monuments";
import {
  getPlacedCommonPetTypesInPetHouse,
  isPet,
  type PetName,
  PET_HOUSE_CAPACITY,
  PET_TYPES,
} from "features/game/types/pets";
import { EXPIRY_COOLDOWNS } from "features/game/lib/collectibleBuilt";
import type { Coordinates } from "features/game/expansion/components/MapPlacement";
import { COMPETITION_POINTS } from "features/game/types/competitions";
import { populateSaltFarm } from "features/game/types/salt";
import { refreshBasicScarecrowTimeAOE } from "features/game/lib/aoe";
import { getCollectiblesAcrossLocations } from "features/game/lib/getCollectiblesAcrossLocations";
import { detectCollision } from "features/game/expansion/placeable/lib/collisionDetection";

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
    name in EXPIRY_COOLDOWNS || name === "Maneki Neko" || name === "Magic Bean"
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

    // Monuments obtained outside of `buyMonument` (rewards, trades) have no
    // village project, so seed one the first time they are placed. Only ever on
    // a first placement — otherwise removing and re-placing a monument whose
    // project has already been consumed would restart it for free, skipping the
    // `project.started` cost.
    const hasBeenPlacedBefore =
      getCollectiblesAcrossLocations(stateCopy, action.name).length > 0;

    if (
      isMonument &&
      !hasBeenPlacedBefore &&
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
    // first interior.upgrade) before any placement is allowed. Run this before
    // collision detection so the user gets a meaningful error instead of a
    // generic "collides" message (collision returns true when level_one is
    // missing because it can't validate a floor that doesn't exist).
    if (action.location === "level_one" && !stateCopy.interior.level_one) {
      throw new Error("Level one floor has not been unlocked");
    }

    // Mirrors the same check in the API's placeCollectible reducer. The UI
    // placement flows already block a colliding drop before dispatching, so
    // this is a no-op for them — it exists so that callers which reduce
    // speculatively (the home import's `tryApplyImportStep`) find out here
    // rather than having the server reject the whole save batch. Keep the two
    // implementations in lockstep: anything accepted here and rejected there
    // fails at save time with "Building collides".
    const dimensions = COLLECTIBLES_DIMENSIONS[collectible];
    const collides = detectCollision({
      state,
      position: {
        x: action.coordinates.x,
        y: action.coordinates.y,
        height: dimensions.height,
        width: dimensions.width,
      },
      name: collectible,
      location: action.location,
    });

    if (collides) {
      throw new Error("Building collides");
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

    // If no existing collectible is found, search for it in other locations, and move it to the new location.
    // Every other location must be searched: missing one creates a duplicate
    // placement instead of moving the existing one, which silently drops the
    // instance's state (e.g. a weather item's `used` flag would be lost, renewing
    // it for free).
    const otherLocations: PlaceableLocation[] = PLACEABLE_LOCATIONS.filter(
      (location) => location !== action.location,
    );

    const getCollectiblesForLocation = (
      loc: PlaceableLocation,
    ): PlacedItem[] => {
      switch (loc) {
        case "home":
          return stateCopy.home.collectibles[action.name] ?? [];
        case "petHouse":
          return isPetCollectible(action.name)
            ? (stateCopy.petHouse?.pets[action.name] ?? [])
            : [];
        case "interior":
          return stateCopy.interior?.ground.collectibles[action.name] ?? [];
        case "level_one":
          return stateCopy.interior?.level_one?.collectibles[action.name] ?? [];
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
          if (stateCopy.interior) {
            stateCopy.interior.ground.collectibles[action.name] = items;
          }
          break;
        case "level_one":
          if (stateCopy.interior?.level_one) {
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

    populateSaltFarm({
      gameBefore: state,
      gameAfter: stateCopy,
      now: createdAt,
    });

    // A boost collectible (shrine/totem/hourglass) placed mid-grow shortens
    // windowed crops' ready time — keep each cell's Basic Scarecrow time-AOE in
    // sync so a replant in the gap isn't wrongly denied the boost. Idempotent
    // for non-boost placements (windows unchanged).
    refreshBasicScarecrowTimeAOE(stateCopy);

    return stateCopy;
  });
}
