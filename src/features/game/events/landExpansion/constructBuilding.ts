import Decimal from "decimal.js-light";
import { getBumpkinLevel } from "features/game/lib/level";
import { trackActivity } from "features/game/types/bumpkinActivity";
import cloneDeep from "lodash.clonedeep";
import { BuildingName, BUILDINGS } from "../../types/buildings";
import { GameState, PlacedItem } from "../../types/game";

export enum CONSTRUCT_BUILDING_ERRORS {
  NO_BUMPKIN = "You do not have a Bumpkin!",
  MAX_BUILDINGS_REACHED = "Building limit reached for your bumpkin level!",
  NOT_ENOUGH_SFL = "Insufficient SFL!",
  NOT_ENOUGH_INGREDIENTS = "Insufficient ingredient! Missing: ",
}

export type ConstructBuildingAction = {
  type: "building.constructed";
  name: BuildingName;
  id: string;
  coordinates: {
    x: number;
    y: number;
  };
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
  const stateCopy = cloneDeep(state);
  const building = BUILDINGS()[action.name];
  const bumpkin = stateCopy.bumpkin;

  if (bumpkin === undefined) {
    throw new Error(CONSTRUCT_BUILDING_ERRORS.NO_BUMPKIN);
  }

  const bumpkinLevel = getBumpkinLevel(bumpkin.experience);
  const buildingsPlaced = stateCopy.buildings[action.name]?.length || 0;
  const allowedBuildings = building.unlocksAtLevels.filter(
    (level) => bumpkinLevel >= level
  ).length;

  if (buildingsPlaced >= allowedBuildings) {
    throw new Error(CONSTRUCT_BUILDING_ERRORS.MAX_BUILDINGS_REACHED);
  }

  if (stateCopy.balance.lessThan(building.sfl)) {
    throw new Error(CONSTRUCT_BUILDING_ERRORS.NOT_ENOUGH_SFL);
  }

  let missingIngredients: string[] = [];
  const inventoryMinusIngredients = building.ingredients.reduce(
    (inventory, ingredient) => {
      const count = inventory[ingredient.item] || new Decimal(0);

      if (count.lessThan(ingredient.amount)) {
        missingIngredients = [...missingIngredients, ingredient.item];
      }

      return {
        ...inventory,
        [ingredient.item]: count.sub(ingredient.amount),
      };
    },
    stateCopy.inventory
  );

  if (missingIngredients.length > 0) {
    throw new Error(
      `${
        CONSTRUCT_BUILDING_ERRORS.NOT_ENOUGH_INGREDIENTS
      }${missingIngredients.join(", ")}`
    );
  }

  const buildingInventory = stateCopy.inventory[action.name] || new Decimal(0);
  const placed = stateCopy.buildings[action.name] || [];

  const newBuilding: PlacedItem = {
    id: action.id,
    createdAt: createdAt,
    coordinates: action.coordinates,
    readyAt: createdAt + building.constructionSeconds * 1000,
  };

  bumpkin.activity = trackActivity("Building Constructed", bumpkin.activity);

  return {
    ...stateCopy,
    balance: stateCopy.balance.sub(building.sfl),
    inventory: {
      ...inventoryMinusIngredients,
      [action.name]: buildingInventory.add(1),
    },
    buildings: {
      ...stateCopy.buildings,
      [action.name]: [...placed, newBuilding],
    },
  };
}
