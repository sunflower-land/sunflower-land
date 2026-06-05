import Decimal from "decimal.js-light";
import { produce } from "immer";
import type { CraftingQueueItem, GameState } from "features/game/types/game";
import { type Recipe, RECIPES } from "features/game/lib/crafting";
import { trackFarmActivity } from "features/game/types/farmActivity";

export type CancelQueuedCraftingAction = {
  type: "crafting.cancelled";
  queueItemId: string;
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
  firstItemReadyAt,
}: {
  queue: CraftingQueueItem[];
  game: GameState;
  firstItemReadyAt?: number;
}): CraftingQueueItem[] {
  if (queue.length === 0) return [];

  const result = [...queue];

  // The crafting box is free once the latest real (box-occupying) craft has
  // finished. Track that time instead of chaining off the immediately-preceding
  // item: a Fox Shrine instant proc is "ready" out of order (its readyAt can be
  // in the past while a longer craft ahead of it is still going), and it does
  // not occupy the box — so later crafts must wait for the real craft, not
  // inherit the instant's stale readyAt.
  let boxFreeAt: number | null = null;

  for (let i = 0; i < result.length; i++) {
    const item = result[i];
    const recipe = getRecipeByName(item.name, game);
    if (!recipe) continue;

    // Each item's crafting duration is locked in when it is queued — it already
    // reflects any boosts or Fox Shrine instant procs that were active at that
    // moment. Only the chain of start times is recomputed so that removing or
    // speeding up an earlier item shifts the rest, without re-deriving durations
    // from the current (possibly changed) boost state or re-rolling the prng.
    const lockedDuration = item.readyAt - item.startedAt;

    let startedAt: number;
    let readyAt: number;
    if (i === 0 && firstItemReadyAt !== undefined) {
      startedAt = item.startedAt;
      readyAt = firstItemReadyAt;
      boxFreeAt = readyAt;
    } else if (lockedDuration === 0) {
      // Instant craft: stays ready at its original time and does not occupy the
      // box, so it neither moves nor delays the crafts after it.
      startedAt = item.startedAt;
      readyAt = item.readyAt;
    } else {
      // Real craft: starts when the box is next free (after the previous real
      // craft), or keeps its own start if it is the first to occupy the box.
      startedAt = boxFreeAt ?? item.startedAt;
      readyAt = startedAt + lockedDuration;
      boxFreeAt = readyAt;
    }

    result[i] = { ...item, startedAt, readyAt };
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
}: Options): GameState {
  return produce(state, (game) => {
    const { queueItemId } = action;
    const queue = game.craftingBox.queue ?? [];

    if (queue.length === 0) {
      throw new Error("No queue exists");
    }

    const item = queue.find((r) => r.id === queueItemId);

    if (!item) {
      throw new Error("Item does not exist in queue");
    }

    const currentCraftingItem = getCurrentCraftingItem(queue, createdAt);

    if (currentCraftingItem?.id === item.id) {
      throw new Error(
        `Item ${item.name} with readyAt ${item.readyAt} is currently being crafted`,
      );
    }

    if (item.readyAt <= createdAt) {
      throw new Error(
        `Item ${item.name} with readyAt ${item.readyAt} is already ready and cannot be cancelled`,
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

    const updatedQueue = [...queue].filter((q) => q.id !== queueItemId);

    game.farmActivity = trackFarmActivity(
      `${item.name} Crafting Started`,
      game.farmActivity,
      new Decimal(-1),
    );

    game.craftingBox.queue = recalculateCraftingQueue({
      queue: updatedQueue,
      game,
    });

    if (game.craftingBox.queue.length === 0) {
      game.craftingBox.status = "idle";
    }

    game.farmActivity = trackFarmActivity(
      "Crafting Queue Cancelled",
      game.farmActivity,
    );
  });
}
