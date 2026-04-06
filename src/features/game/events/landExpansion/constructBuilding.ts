import Decimal from "decimal.js-light";
import { trackFarmActivity } from "features/game/types/farmActivity";
import {
  BuildingName,
  BUILDINGS,
  BUILDINGS_DIMENSIONS,
} from "../../types/buildings";
import { GameState, PlacedItem } from "../../types/game";
import { getBumpkinLevel } from "features/game/lib/level";
import { hasRequiredIslandExpansion } from "features/game/lib/hasRequiredIslandExpansion";
import { produce } from "immer";
import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { detectCollision } from "features/game/expansion/placeable/lib/collisionDetection";

export enum CONSTRUCT_BUILDING_ERRORS {
  NO_BUMPKIN = "You do not have a Bumpkin!",
  NOT_ENOUGH_COINS = "Insufficient Coins",
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
    const { bumpkin, buildings, coins } = stateCopy;

    const building = BUILDINGS[action.name];

    if (bumpkin === undefined) {
      throw new Error(CONSTRUCT_BUILDING_ERRORS.NO_BUMPKIN);
    }

    const requiredIsland = building.requiredIsland;

    if (
      requiredIsland &&
      !hasRequiredIslandExpansion(stateCopy.island.type, requiredIsland)
    ) {
      throw new Error("You do not have the required island expansion");
    }

    const placed = buildings[action.name] || [];

    if (
      building.unlocksAtLevel !== Infinity &&
      getBumpkinLevel(bumpkin.experience) < building.unlocksAtLevel
    ) {
      throw new Error("You do not meet the land requirements");
    }

    const dimensions = BUILDINGS_DIMENSIONS[action.name];
    const collides = detectCollision({
      state: stateCopy,
      position: {
        x: action.coordinates.x,
        y: action.coordinates.y,
        height: dimensions.height,
        width: dimensions.width,
      },
      location: "farm",
      name: action.name,
    });

    if (collides) {
      throw new Error("Building collides");
    }

    if (coins < building.coins) {
      throw new Error(CONSTRUCT_BUILDING_ERRORS.NOT_ENOUGH_COINS);
    }

    const inventoryMinusIngredients = building.ingredients.reduce(
      (inventory, ingredient) => {
        const count = inventory[ingredient.item] || new Decimal(0);

        if (count.lessThan(ingredient.amount)) {
          throw new Error(
            `${CONSTRUCT_BUILDING_ERRORS.NOT_ENOUGH_INGREDIENTS}${ingredient.item}`,
          );
        }

        return {
          ...inventory,
          [ingredient.item]: count.sub(ingredient.amount),
        };
      },
      stateCopy.inventory,
    );

    const buildingInventory =
      stateCopy.inventory[action.name] || new Decimal(0);

    const newBuilding: PlacedItem = {
      id: action.id,
      createdAt: createdAt,
      coordinates: action.coordinates,
      readyAt: createdAt + building.constructionSeconds * 1000,
    };

    stateCopy.farmActivity = trackFarmActivity(
      "Building Constructed",
      stateCopy.farmActivity,
    );

    stateCopy.coins = stateCopy.coins - building.coins;
    stateCopy.farmActivity = trackFarmActivity(
      "Coins Spent",
      stateCopy.farmActivity,
      new Decimal(building.coins),
    );
    stateCopy.inventory = inventoryMinusIngredients;
    stateCopy.inventory[action.name] = buildingInventory.add(1);
    stateCopy.buildings[action.name] = [...placed, newBuilding];

    if (action.name === "Barn" || action.name === "Hen House") {
      stateCopy.inventory["Kernel Blend"] =
        stateCopy.inventory["Kernel Blend"]?.add(5) || new Decimal(5);
    }

    return stateCopy;
  });
}
