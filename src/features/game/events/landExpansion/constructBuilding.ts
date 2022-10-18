import Decimal from "decimal.js-light";
import { getBumpkinLevel } from "features/game/lib/level";
import { trackActivity } from "features/game/types/bumpkinActivity";
import cloneDeep from "lodash.clonedeep";
import { BuildingName, BUILDINGS } from "../../types/buildings";
import { GameState, PlacedItem } from "../../types/game";

export type ConstructBuildingAction = {
  type: "building.constructed";
  name: BuildingName;
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
    throw new Error("You do not have a Bumpkin");
  }

  const bumpkinLevel = getBumpkinLevel(bumpkin.experience);

  if (bumpkinLevel < building.unlocksAtLevels[0]) {
    throw new Error("Your Bumpkin does not meet the level requirements");
  }

  if (stateCopy.balance.lessThan(building.sfl)) {
    throw new Error("Insufficient SFL");
  }

  const inventoryMinusIngredients = building.ingredients.reduce(
    (inventory, ingredient) => {
      const count = inventory[ingredient.item] || new Decimal(0);

      if (count.lessThan(ingredient.amount)) {
        throw new Error(`Insufficient ingredient: ${ingredient.item}`);
      }

      return {
        ...inventory,
        [ingredient.item]: count.sub(ingredient.amount),
      };
    },
    stateCopy.inventory
  );

  const buildingInventory = stateCopy.inventory[action.name] || new Decimal(0);
  const placed = stateCopy.buildings[action.name] || [];

  const newBuilding: Omit<PlacedItem, "id"> = {
    createdAt: createdAt,
    coordinates: action.coordinates,
    readyAt: createdAt + building.constructionSeconds * 1000,
  };

  bumpkin.activity = trackActivity(`Building Constructed`, bumpkin.activity);

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
