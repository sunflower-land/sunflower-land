import Decimal from "decimal.js-light";
import { trackFarmActivity } from "features/game/types/farmActivity";
import { BuildingName, BUILDINGS } from "../../types/buildings";
import { GameState, PlacedItem } from "../../types/game";
import { getBumpkinLevel } from "features/game/lib/level";
import { hasRequiredIslandExpansion } from "features/game/lib/hasRequiredIslandExpansion";
import { produce } from "immer";
import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { getObjectEntries } from "lib/object";

export enum CONSTRUCT_BUILDING_ERRORS {
  NO_BUMPKIN = "You do not have a Bumpkin!",
  BUILDING_ALREADY_BUILT = "Building already built!",
  BUMPKIN_LEVEL_NOT_MET = "You do not meet the land requirements",
  NOT_ENOUGH_COINS = "Insufficient Coins!",
  NOT_ENOUGH_INGREDIENTS = "Insufficient ingredient: ",
}

export type ConstructBuildingAction = {
  type: "building.constructed";
  name: BuildingName;
  id: string;
  coordinates: Coordinates;
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

    const buildingToConstruct = BUILDINGS[action.name];

    const hasReachedUnlockRequirement =
      getBumpkinLevel(bumpkin.experience) >= buildingToConstruct.unlocksAtLevel;

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
      coordinates: action.coordinates,
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

    if (action.name === "Barn" || action.name === "Hen House") {
      stateCopy.inventory["Kernel Blend"] =
        stateCopy.inventory["Kernel Blend"]?.add(5) || new Decimal(5);
    }

    return stateCopy;
  });
}
