import Decimal from "decimal.js-light";
import { trackFarmActivity } from "features/game/types/farmActivity";
import { type BuildingName, BUILDINGS } from "../../types/buildings";
import type { GameState, PlacedItem } from "../../types/game";
import {
  getAscensionLevel,
  meetsLevelRequirement,
} from "features/game/lib/level";
import { hasRequiredIslandExpansion } from "features/game/lib/hasRequiredIslandExpansion";
import { produce } from "immer";
import type { Coordinates } from "features/game/expansion/components/MapPlacement";
import { getObjectEntries } from "lib/object";
import { hasFeatureAccess, type FeatureName } from "lib/flags";
import { isAnimalBuildingType } from "../../types/animals";
import { makeAnimalBuilding, makeAnimalBuildingKey } from "../../lib/animals";
import { getKeys } from "lib/object";

export enum CONSTRUCT_BUILDING_ERRORS {
  NO_BUMPKIN = "You do not have a Bumpkin!",
  BUILDING_ALREADY_BUILT = "Building already built!",
  BUMPKIN_LEVEL_NOT_MET = "You do not meet the land requirements",
  NOT_ENOUGH_COINS = "Insufficient Coins!",
  NOT_ENOUGH_INGREDIENTS = "Insufficient ingredient: ",
  NO_FEATURE_ACCESS = "You do not have access to this building",
}

/**
 * Buildings still behind a feature flag. Checked here, server-side, because the
 * shop list in `Buildings.tsx` only hides the button - it does not stop a
 * hand-crafted autosave payload from constructing one.
 */
const BUILDING_FEATURE_FLAGS: Partial<Record<BuildingName, FeatureName>> = {
  Pigpen: "PIGPEN",
};

export type ConstructBuildingAction = {
  type: "building.constructed";
  name: BuildingName;
  id: string;
  /**
   * Optional: without coordinates the building is constructed into the chest
   * (the landscaping sandbox buys live and places in its local draft).
   */
  coordinates?: Coordinates;
};

type Options = {
  state: Readonly<GameState>;
  action: ConstructBuildingAction;
  createdAt?: number;
};

export function constructBuilding({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (stateCopy) => {
    const { bumpkin, coins, buildings } = stateCopy;

    const hasBuiltBuilding = (buildings[action.name] || []).length > 0;

    if (hasBuiltBuilding) {
      throw new Error(CONSTRUCT_BUILDING_ERRORS.BUILDING_ALREADY_BUILT);
    }

    const requiredFeature = BUILDING_FEATURE_FLAGS[action.name];
    if (requiredFeature && !hasFeatureAccess(stateCopy, requiredFeature)) {
      throw new Error(CONSTRUCT_BUILDING_ERRORS.NO_FEATURE_ACCESS);
    }

    const buildingToConstruct = BUILDINGS[action.name];

    const hasReachedUnlockRequirement = meetsLevelRequirement(
      getAscensionLevel({
        experience: bumpkin.experience,
        ascensionLevel: stateCopy.island.ascensionLevel ?? 0,
      }),
      buildingToConstruct.unlocksAtLevel,
    );

    if (!hasReachedUnlockRequirement) {
      throw new Error(CONSTRUCT_BUILDING_ERRORS.BUMPKIN_LEVEL_NOT_MET);
    }

    if (coins < buildingToConstruct.coins) {
      throw new Error(CONSTRUCT_BUILDING_ERRORS.NOT_ENOUGH_COINS);
    }

    const requiredIsland = buildingToConstruct.requiredIsland;

    if (
      requiredIsland &&
      !hasRequiredIslandExpansion(stateCopy.island.type, requiredIsland)
    ) {
      throw new Error("You do not have the required island expansion");
    }

    const inventoryMinusIngredients = getObjectEntries(
      buildingToConstruct.ingredients,
    ).reduce(
      (inventory, [ingredient, amount]) => {
        const count = inventory[ingredient] || new Decimal(0);
        const required = new Decimal(amount ?? 0);

        if (count.lessThan(required)) {
          throw new Error(`Insufficient ingredient: ${ingredient}`);
        }
        inventory[ingredient] = count.sub(required);
        return inventory;
      },
      { ...stateCopy.inventory },
    );

    const buildingInventory =
      stateCopy.inventory[action.name] || new Decimal(0);
    const placed = stateCopy.buildings[action.name] || [];

    const newBuilding: PlacedItem = {
      id: action.id,
      createdAt: createdAt,
      ...(action.coordinates ? { coordinates: action.coordinates } : {}),
      readyAt: createdAt + buildingToConstruct.constructionSeconds * 1000,
    };

    stateCopy.farmActivity = trackFarmActivity(
      "Building Constructed",
      stateCopy.farmActivity,
    );

    stateCopy.coins = coins - buildingToConstruct.coins;
    stateCopy.farmActivity = trackFarmActivity(
      "Coins Spent",
      stateCopy.farmActivity,
      new Decimal(buildingToConstruct.coins),
    );
    stateCopy.inventory = { ...inventoryMinusIngredients };
    stateCopy.inventory[action.name] = buildingInventory.add(1);
    stateCopy.buildings[action.name] = [...placed, newBuilding];

    if (isAnimalBuildingType(action.name)) {
      stateCopy.inventory["Kernel Blend"] =
        stateCopy.inventory["Kernel Blend"]?.add(5) || new Decimal(5);

      // Starter animals are seeded HERE rather than in INITIAL_FARM, because a
      // farm with no record for an animal building is hydrated from
      // INITIAL_FARM - so seeding there hands every existing farm free animals
      // the moment the field ships. Guarded on an empty record so a rebuild can
      // never wipe or duplicate a herd.
      const buildingKey = makeAnimalBuildingKey(action.name);
      const animalBuilding = stateCopy[buildingKey];

      if (getKeys(animalBuilding.animals).length === 0) {
        animalBuilding.animals = makeAnimalBuilding(
          action.name,
          createdAt,
        ).animals;
      }
    }

    return stateCopy;
  });
}
