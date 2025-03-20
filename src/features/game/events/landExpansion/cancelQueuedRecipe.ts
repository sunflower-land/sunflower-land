import { BuildingName } from "features/game/types/buildings";
import {
  BuildingProduct,
  Cancelled,
  GameState,
  InventoryItemName,
  PlacedItem,
} from "features/game/types/game";
import { getCookingRequirements, getReadyAt } from "./cook";
import Decimal from "decimal.js-light";
import { produce } from "immer";
import cloneDeep from "lodash.clonedeep";

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

/**
 * Recalculates the queue after a recipe has been modified (cancelled, sped up, etc.)
 * Returns a new queue with updated readyAt times
 */
export function recalculateQueue({
  queue,
  createdAt,
  buildingId,
  game,
  isInstant,
}: {
  queue: BuildingProduct[];
  createdAt: number;
  buildingId: string;
  game: GameState;
  isInstant?: boolean;
}): BuildingProduct[] {
  // Keep only ready recipes
  const readyRecipes = queue.filter((r) => r.readyAt <= createdAt);

  // Get all other recipes that aren't ready yet
  const upcomingRecipes = queue.filter((r) => r.readyAt > createdAt);

  // Get currently cooking item
  const currentlyCooking = getCurrentCookingItem({
    building: { id: buildingId, crafting: queue } as PlacedItem,
    createdAt,
  });

  // Recalculate readyAt times for upcoming recipes
  const updatedUpcomingRecipes = upcomingRecipes.reduce(
    (recipes, recipe, index) => {
      // Skip recalculation for currently cooking item
      if (
        !isInstant &&
        currentlyCooking &&
        recipe.readyAt === currentlyCooking.readyAt
      ) {
        return [...recipes, recipe];
      }

      const previousRecipeReadyAt =
        index === 0 ? createdAt : recipes[recipes.length - 1].readyAt;

      const readyAt = getReadyAt({
        buildingId,
        item: recipe.name,
        createdAt: previousRecipeReadyAt,
        game,
      });

      return [...recipes, { ...recipe, readyAt }];
    },
    [] as BuildingProduct[],
  );

  return [...readyRecipes, ...updatedUpcomingRecipes];
}

export function getCurrentCookingItem({
  building,
  createdAt,
}: {
  building: PlacedItem;
  createdAt: number;
}) {
  const queue = cloneDeep(building.crafting);
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
    const ingredients = getCookingRequirements({ state, item: recipe.name });
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
      buildingId: building.id,
      game: state,
      isInstant: false,
    });

    const cancelled = building.cancelled || ({} as Cancelled);

    cancelled[recipe.name] = {
      count: (cancelled[recipe.name]?.count || 0) + 1,
      cancelledAt: createdAt,
    };

    building.cancelled = cancelled;

    return game;
  });
}
