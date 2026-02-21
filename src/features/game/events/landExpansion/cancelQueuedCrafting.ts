import Decimal from "decimal.js-light";
import { produce } from "immer";
import {
  CraftingQueueItem,
  GameState,
  InventoryItemName,
} from "features/game/types/game";
import {
  Recipe,
  RecipeCollectibleName,
  RECIPES,
} from "features/game/lib/crafting";
import { BumpkinItem, ITEM_IDS } from "features/game/types/bumpkin";
import { KNOWN_IDS } from "features/game/types";
import { getBoostedCraftingTime } from "./startCrafting";
import { trackFarmActivity } from "features/game/types/farmActivity";

export type CancelQueuedCraftingAction = {
  type: "crafting.cancelled";
  queueItem: CraftingQueueItem;
};

type Options = {
  state: Readonly<GameState>;
  action: CancelQueuedCraftingAction;
  createdAt?: number;
  farmId?: number;
};

function getRecipeByName(name: string, game: GameState): Recipe | undefined {
  const discoveredRecipe =
    game.craftingBox.recipes?.[name as keyof typeof game.craftingBox.recipes];
  if (discoveredRecipe?.ingredients?.length) {
    return discoveredRecipe;
  }
  if (name in RECIPES) {
    return RECIPES[name as keyof typeof RECIPES];
  }
  return discoveredRecipe;
}

export function recalculateCraftingQueue({
  queue,
  game,
  farmId = 0,
  firstItemReadyAt,
}: {
  queue: CraftingQueueItem[];
  game: GameState;
  farmId?: number;
  firstItemReadyAt?: number;
}): CraftingQueueItem[] {
  if (queue.length === 0) return [];

  const result = [...queue];

  for (let i = 0; i < result.length; i++) {
    const item = result[i];
    const recipe = getRecipeByName(item.name, game);
    if (!recipe) continue;

    let readyAt: number;
    const startAt = i === 0 ? item.startedAt : result[i - 1].readyAt;

    if (i === 0 && firstItemReadyAt !== undefined) {
      readyAt = firstItemReadyAt;
    } else {
      const { seconds: recipeTime } = getBoostedCraftingTime({
        game,
        time: recipe.time,
        farmId,
        itemId:
          recipe.type === "collectible"
            ? KNOWN_IDS[recipe.name as InventoryItemName]
            : ITEM_IDS[recipe.name as BumpkinItem],
        counter: game.farmActivity[`${recipe.name} Crafted`] ?? 0,
      });
      readyAt = startAt + recipeTime;
    }

    result[i] = { ...item, startedAt: startAt, readyAt };
  }

  return result;
}

function getCurrentCraftingItem(
  queue: CraftingQueueItem[],
  createdAt: number,
): CraftingQueueItem | undefined {
  return queue.find((item) => item.readyAt > createdAt);
}

export function cancelQueuedCrafting({
  state,
  action,
  createdAt = Date.now(),
  farmId = 0,
}: Options): GameState {
  return produce(state, (game) => {
    const { queueItem } = action;
    const queue = game.craftingBox.queue ?? [];

    if (queue.length === 0) {
      throw new Error("No queue exists");
    }

    const recipeIndex = queue.findIndex(
      (r) =>
        r.name === queueItem.name &&
        r.readyAt === queueItem.readyAt &&
        r.type === queueItem.type,
    );

    if (recipeIndex === -1) {
      throw new Error("Item does not exist in queue");
    }

    const currentCraftingItem = getCurrentCraftingItem(queue, createdAt);
    const item = queue[recipeIndex];

    if (currentCraftingItem?.readyAt === item.readyAt) {
      throw new Error(
        `Item ${queueItem.name} with readyAt ${item.readyAt} is currently being crafted`,
      );
    }

    const recipe = getRecipeByName(item.name, game);
    if (!recipe) {
      throw new Error(`Recipe not found for ${item.name}`);
    }

    recipe.ingredients.forEach((ingredient) => {
      if (ingredient) {
        if (ingredient.collectible) {
          const count =
            game.inventory[ingredient.collectible] ?? new Decimal(0);
          game.inventory[ingredient.collectible] = count.add(1);
        }
        if (ingredient.wearable) {
          game.wardrobe[ingredient.wearable] =
            (game.wardrobe[ingredient.wearable] ?? 0) + 1;
        }
      }
    });

    const updatedQueue = queue.filter(
      (r) =>
        !(
          r.name === queueItem.name &&
          r.readyAt === queueItem.readyAt &&
          r.type === queueItem.type
        ),
    );

    game.craftingBox.queue = recalculateCraftingQueue({
      queue: updatedQueue,
      game,
      farmId,
    });

    if (game.craftingBox.queue.length > 0) {
      const current = game.craftingBox.queue[0];
      game.craftingBox.item =
        current.type === "collectible"
          ? { collectible: current.name as RecipeCollectibleName }
          : { wearable: current.name as BumpkinItem };
      game.craftingBox.startedAt = current.startedAt;
      game.craftingBox.readyAt = current.readyAt;
    } else {
      game.craftingBox.status = "idle";
      game.craftingBox.item = undefined;
      game.craftingBox.startedAt = 0;
      game.craftingBox.readyAt = 0;
    }

    game.farmActivity = trackFarmActivity(
      "Crafting Queue Cancelled",
      game.farmActivity,
    );
  });
}
