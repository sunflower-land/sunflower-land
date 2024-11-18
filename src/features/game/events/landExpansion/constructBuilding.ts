import Decimal from "decimal.js-light";
import { trackActivity } from "features/game/types/bumpkinActivity";
import { BuildingName, BUILDINGS } from "../../types/buildings";
import { GameState, PlacedItem } from "../../types/game";
import { getBumpkinLevel } from "features/game/lib/level";
import { hasRequiredIslandExpansion } from "features/game/lib/hasRequiredIslandExpansion";
import { produce } from "immer";

export enum CONSTRUCT_BUILDING_ERRORS {
  NO_BUMPKIN = "You do not have a Bumpkin!",
  MAX_BUILDINGS_REACHED = "Building limit reached for your bumpkin level!",
  NOT_ENOUGH_COINS = "Insufficient Coins!",
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
  return produce(state, (stateCopy) => {
    const { bumpkin, inventory, coins } = stateCopy;

    const buildingNumber = inventory[action.name]?.toNumber() ?? 0;
    const building = BUILDINGS[action.name];

    if (bumpkin === undefined) {
      throw new Error(CONSTRUCT_BUILDING_ERRORS.NO_BUMPKIN);
    }

    const allowedBuildings = building.filter(
      ({ unlocksAtLevel }) =>
        getBumpkinLevel(bumpkin.experience) >= unlocksAtLevel,
    ).length;

    const buildingToConstruct = building[buildingNumber];

    const built = stateCopy.inventory[action.name] || new Decimal(0);
    if (built.gte(allowedBuildings)) {
      throw new Error(CONSTRUCT_BUILDING_ERRORS.MAX_BUILDINGS_REACHED);
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

    let missingIngredients: string[] = [];

    const inventoryMinusIngredients = buildingToConstruct.ingredients.reduce(
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
      stateCopy.inventory,
    );

    if (missingIngredients.length > 0) {
      throw new Error(
        `${
          CONSTRUCT_BUILDING_ERRORS.NOT_ENOUGH_INGREDIENTS
        }${missingIngredients.join(", ")}`,
      );
    }

    const buildingInventory =
      stateCopy.inventory[action.name] || new Decimal(0);
    const placed = stateCopy.buildings[action.name] || [];

    const newBuilding: PlacedItem = {
      id: action.id,
      createdAt: createdAt,
      coordinates: action.coordinates,
      readyAt: createdAt + buildingToConstruct.constructionSeconds * 1000,
    };

    bumpkin.activity = trackActivity("Building Constructed", bumpkin.activity);

    stateCopy.coins = coins - buildingToConstruct.coins;
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
