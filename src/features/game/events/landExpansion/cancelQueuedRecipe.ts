import {
  BuildingName,
  CookingBuildingName,
} from "features/game/types/buildings";
import {
  BuildingProduct,
  GameState,
  InventoryItemName,
  PlacedItem,
} from "features/game/types/game";
import {
  BUILDING_OIL_BOOSTS,
  getCookingRequirements,
  getOilConsumption,
} from "./cook";
import Decimal from "decimal.js-light";
import { produce } from "immer";
import { CookableName, COOKABLES } from "features/game/types/consumables";
import { getCookingTime } from "features/game/expansion/lib/boosts";

export type CancelQueuedRecipeAction = {
  type: "recipe.cancelled";
  buildingName: BuildingName;
  buildingId: string;
  queueItem: BuildingProduct;
};

type Options = {
  state: Readonly<GameState>;
  action: CancelQueuedRecipeAction;
  createdAt?: number;
};

function getQueueItemCookingSeconds({
  name,
  appliedOilBoost,
  game,
  buildingName,
  createdAt,
}: {
  name: CookableName;
  appliedOilBoost: number;
  game: GameState;
  buildingName: CookingBuildingName;
  createdAt: number;
}) {
  const skills = game.bumpkin.skills;
  const itemOilConsumption = getOilConsumption(buildingName, name);
  const itemCookingSeconds = COOKABLES[name].cookingSeconds;
  const boostValue = BUILDING_OIL_BOOSTS(skills)[buildingName];
  let boostedCookingSeconds = itemCookingSeconds;

  if (appliedOilBoost >= itemOilConsumption) {
    boostedCookingSeconds = itemCookingSeconds * (1 - boostValue);
  } else {
    const effectiveBoostValue =
      (appliedOilBoost / itemOilConsumption) * boostValue;
    boostedCookingSeconds = itemCookingSeconds * (1 - effectiveBoostValue);
  }

  // We don't need to pass in boostUsed as cancelling recipes shouldn't mark boost as being used
  const { reducedSecs: seconds } = getCookingTime({
    seconds: boostedCookingSeconds,
    item: name,
    game,
    cookStartAt: createdAt,
  });

  return { seconds };
}

function getUpdatedReadyAt({
  name,
  startAt,
  appliedOilBoost,
  game,
  buildingName,
  createdAt,
}: {
  name: CookableName;
  startAt: number;
  appliedOilBoost: number;
  game: GameState;
  buildingName: CookingBuildingName;
  createdAt: number;
}) {
  const { seconds } = getQueueItemCookingSeconds({
    name,
    appliedOilBoost,
    game,
    buildingName,
    createdAt,
  });

  return startAt + seconds * 1000;
}

/**
 * Recalculates the queue after a recipe has been modified (cancelled, sped up, etc.)
 * Returns a new queue with updated readyAt times
 */
export function recalculateQueue({
  queue,
  createdAt,
  buildingName,
  game,
  isInstantCook,
}: {
  queue: BuildingProduct[];
  createdAt: number;
  buildingName: CookingBuildingName;
  isInstantCook?: boolean;
  game: GameState;
}): BuildingProduct[] {
  // Keep only ready recipes
  const readyRecipes = queue.filter((r) => r.readyAt <= createdAt);

  // Get all other recipes that aren't ready yet
  const upcomingRecipes = queue.filter((r) => r.readyAt > createdAt);

  if (isInstantCook) {
    const updatedRecipes = upcomingRecipes.reduce((recipes, recipe, index) => {
      const startAt = index === 0 ? createdAt : recipes[index - 1].readyAt;

      const readyAt = getUpdatedReadyAt({
        name: recipe.name,
        startAt,
        appliedOilBoost: recipe.boost?.Oil ?? 0,
        buildingName,
        game,
        createdAt,
      });

      return [...recipes, { ...recipe, readyAt }];
    }, [] as BuildingProduct[]);

    return [...readyRecipes, ...updatedRecipes];
  }

  // Currently cooking
  const currentRecipe = upcomingRecipes[0];
  const remainingRecipes = upcomingRecipes.slice(1);

  // Recalculate readyAt times for remaining recipes
  const updatedRemainingRecipes = remainingRecipes.reduce(
    (recipes, recipe, index) => {
      const startAt =
        index === 0 ? currentRecipe.readyAt : recipes[index - 1].readyAt;

      const readyAt = getUpdatedReadyAt({
        name: recipe.name,
        startAt,
        appliedOilBoost: recipe.boost?.Oil ?? 0,
        buildingName,
        game,
        createdAt,
      });

      return [...recipes, { ...recipe, readyAt }];
    },
    [] as BuildingProduct[],
  );

  return [...readyRecipes, currentRecipe, ...updatedRemainingRecipes];
}

export function getCurrentCookingItem({
  building,
  createdAt,
}: {
  building: PlacedItem;
  createdAt: number;
}) {
  const queue = building.crafting;
  const sortedByReadyAt = queue?.sort(
    (a: BuildingProduct, b: BuildingProduct) => a.readyAt - b.readyAt,
  );

  if (!queue) return;

  const cooking = sortedByReadyAt?.find((recipe) => recipe.readyAt > createdAt);

  return cooking;
}

export function cancelQueuedRecipe({
  state,
  action,
  createdAt = Date.now(),
}: Options) {
  return produce(state, (game) => {
    const { queueItem, buildingName, buildingId } = action;
    const buildings = game.buildings[buildingName];
    const building = buildings?.find((b) => b.id === buildingId);

    if (!building) {
      throw new Error("Building does not exist");
    }

    const queue = building.crafting;

    if (!queue) {
      throw new Error("No queue exists");
    }

    const recipeIndex = queue.findIndex(
      (r) => JSON.stringify(r) === JSON.stringify(queueItem),
    );

    if (recipeIndex === -1) {
      throw new Error("Recipe does not exist");
    }

    const currentCookingItem = getCurrentCookingItem({
      building,
      createdAt,
    });

    const recipe = queue[recipeIndex];

    if (currentCookingItem?.readyAt === recipe.readyAt) {
      throw new Error(
        `Recipe ${queueItem.name} with readyAt ${recipe.readyAt} is currently being cooked`,
      );
    }

    // return resources consumed by the recipe
    const ingredients = getCookingRequirements({
      state,
      item: recipe.name,
      skipDoubleNomBoost: !recipe.skills?.["Double Nom"],
    });

    game.inventory = Object.entries(ingredients).reduce(
      (inventory, [ingredient, amount]) => {
        const count =
          inventory[ingredient as InventoryItemName] ?? new Decimal(0);

        return {
          ...inventory,
          [ingredient]: count.add(amount),
        };
      },
      game.inventory,
    );

    if (recipe.boost?.Oil) {
      building.oil = (building.oil ?? 0) + recipe.boost.Oil;
    }

    building.crafting = recalculateQueue({
      queue: queue.filter((r) => r.readyAt !== recipe.readyAt), // Remove cancelled recipe
      createdAt,
      buildingName: buildingName as CookingBuildingName,
      isInstantCook: false,
      game,
    });

    return game;
  });
}
