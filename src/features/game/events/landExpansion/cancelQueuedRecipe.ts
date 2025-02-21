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

    // When a recipe is cancelled, we need to recalculate the readyAt times for all recipes that come after it.
    // Each recipe's start time should be the readyAt time of the recipe before it in the queue.

    const filteredQueue = queue.filter((_, index) => index !== recipeIndex);
    const newQueue = filteredQueue.map((r, index) => {
      if (index === 0) return r;

      const previousRecipeReadyAt = filteredQueue[recipeIndex - 1]?.readyAt;

      const readyAt = getReadyAt({
        buildingId: buildingId,
        item: r.name,
        createdAt: previousRecipeReadyAt,
        game: state,
      });

      return {
        ...r,
        readyAt,
      };
    });

    if (recipe.boost?.Oil) {
      building.oil = (building.oil ?? 0) + recipe.boost.Oil;
    }

    building.crafting = newQueue;

    const cancelled = building.cancelled || ({} as Cancelled);

    cancelled[recipe.name] = {
      count: (cancelled[recipe.name]?.count || 0) + 1,
      cancelledAt: createdAt,
    };

    building.cancelled = cancelled;

    return game;
  });
}
