import type {
  BuildingName,
  CookingBuildingName,
} from "features/game/types/buildings";
import type {
  BuildingProduct,
  GameState,
  PlacedItem,
} from "features/game/types/game";
import { getCookingRequirements } from "./cook";
import { getRecipeDoubleNomLevel } from "./collectRecipe";
import Decimal from "decimal.js-light";
import { produce } from "immer";
import { assertCookableName, COOKABLES } from "features/game/types/consumables";
import { getCookingTime } from "features/game/expansion/lib/boosts";
import { getObjectEntries } from "lib/object";
import { getCookingBoostWindows } from "features/game/lib/boostWindows";
import {
  type CookingOil,
  getCookingQueueReadyAts,
  resolveCookingQueue,
  settleCookingOil,
} from "features/game/lib/cookingReadiness";
import { isCookingBuilding } from "./isCookingBuilding";

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
 *
 * This also MIGRATES the recipes it rewrites onto the speed-rate
 * model. That is load-bearing, not incidental: `getCookingTime` no longer bakes the
 * temporary boosts in, so re-deriving a legacy recipe's duration here without also
 * giving it a `baseDurationMs` would silently strip its Gourmet Hourglass / totem /
 * shrine boost — the recipe would neither keep the baked discount nor gain a window.
 */
export function recalculateQueue({
  queue,
  createdAt,
  buildingName,
  game,
  isInstantCook,
  oil,
}: {
  queue: BuildingProduct[];
  createdAt: number;
  buildingName: CookingBuildingName;
  isInstantCook?: boolean;
  game: GameState;
  /** The building's oil ledger, settled at `createdAt` (see `settleCookingOil`). */
  oil?: CookingOil;
}): BuildingProduct[] {
  // Readiness comes from the DERIVED chain, not each recipe's stored `readyAt`. That
  // value is only a cache, and it can only ever be stale-FUTURE (a boost window is
  // added, never removed), so splitting on it puts a recipe that has actually
  // finished in the upcoming half - where an instant cook re-anchors it and restarts
  // a cook the player already paid for. With no `baseDurationMs` the derived value
  // is the stored one.
  const readyAts = getCookingQueueReadyAts({ crafting: queue, game, oil });

  // Keep only ready recipes
  const readyRecipes = queue.filter((_, index) => readyAts[index] <= createdAt);

  // Get all other recipes that aren't ready yet
  const upcomingRecipes = queue.filter(
    (_, index) => readyAts[index] > createdAt,
  );

  const rebuilt = upcomingRecipes.map((recipe, index) => {
    // The recipe already cooking keeps its own timer — it is mid-cook and must not
    // be restarted. An instant cook removed the previous head, so whatever is
    // promoted into its place starts NOW and is anchored there.
    if (index === 0 && !isInstantCook) return recipe;

    // `baseDurationMs` is snapshotted when the recipe is queued, like the Double
    // Nom rank beside it; re-deriving it would re-apply today's permanent boosts,
    // so swapping a wearable and cancelling something unrelated would silently
    // change the duration of everything queued behind it. A recipe with no
    // marker takes what `cook` would stamp today.
    const name = assertCookableName(recipe.name);
    const baseDurationMs =
      recipe.baseDurationMs ??
      getCookingTime({
        seconds: COOKABLES[name].cookingSeconds,
        item: name,
        game,
      }).reducedSecs * 1000;

    // Everything behind the head is CHAINED: no `startedAt`, so its start tracks
    // the derived ready time of the recipe ahead of it.
    const { startedAt: _discarded, ...chained } = recipe;

    return index === 0
      ? { ...chained, startedAt: createdAt, baseDurationMs }
      : { ...chained, baseDurationMs };
  });

  const nextQueue = [...readyRecipes, ...rebuilt];
  const nextReadyAts = resolveCookingQueue({
    crafting: nextQueue,
    windows: getCookingBoostWindows(game),
    oil,
  });

  // Refresh the cached `readyAt` on every entry so the persisted value matches
  // what the chain currently derives.
  return nextQueue.map((recipe, index) => ({
    ...recipe,
    readyAt: nextReadyAts[index],
  }));
}

/**
 * The recipe currently being cooked — the first one that is not yet ready — with
 * its POSITION in the queue and its derived ready time.
 *
 * Readiness comes from the chain, not each recipe's stored `readyAt`: that value is
 * a cache, so under a live boost a recipe can already be finished while its cache
 * still points into the future. Selecting on the cache let Instant Gratification
 * and the gem speed-up be spent on a recipe that was already done.
 *
 * The index is returned because `readyAt` is not a unique key — two entries can
 * share one — so callers must address the recipe by position rather than by
 * matching on its fields. It also replaces the old sort: the queue chain is
 * resolved in array order, so sorting a copy here would have decoupled the
 * returned recipe from its index.
 */
export function getCurrentCookingItem({
  building,
  createdAt,
  game,
  oil,
}: {
  building: PlacedItem;
  createdAt: number;
  game: GameState;
  oil?: CookingOil;
}): { index: number; recipe: BuildingProduct; readyAt: number } | undefined {
  const queue = building.crafting;

  if (!queue?.length) return;

  const readyAts = getCookingQueueReadyAts({ crafting: queue, game, oil });
  const index = readyAts.findIndex((readyAt) => readyAt > createdAt);

  if (index === -1) return;

  return { index, recipe: queue[index], readyAt: readyAts[index] };
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

    if (!building.crafting) {
      throw new Error("No queue exists");
    }

    // Settle the oil before the queue changes shape: a recipe that has not started
    // has burned nothing, but everything ahead of it may have.
    const oil = isCookingBuilding(buildingName)
      ? settleCookingOil({ game, building, buildingName, at: createdAt })
      : undefined;
    const queue = building.crafting;

    // Address the recipe by its stable `id` where there is one. Deep equality no
    // longer works: the queue is rewritten in place (gaining `baseDurationMs`, a
    // refreshed `readyAt`) whenever anything ahead of it changes, so a client's copy
    // of the entry goes stale the moment another recipe is cancelled. Entries queued
    // before ids existed fall back to matching on name + readyAt.
    const recipeIndex =
      queueItem.id !== undefined
        ? queue.findIndex((r) => r.id === queueItem.id)
        : queue.findIndex(
            (r) =>
              r.id === undefined &&
              r.name === queueItem.name &&
              r.readyAt === queueItem.readyAt,
          );

    if (recipeIndex === -1) {
      throw new Error("Recipe does not exist");
    }

    const currentCookingItem = getCurrentCookingItem({
      building,
      createdAt,
      game,
      oil,
    });

    const recipe = queue[recipeIndex];

    if (currentCookingItem?.index === recipeIndex) {
      throw new Error(
        `Recipe ${queueItem.name} with readyAt ${recipe.readyAt} is currently being cooked`,
      );
    }

    // A recipe that has already finished cooking cannot be cancelled — it is
    // collected, not aborted. Readiness comes from the DERIVED chain, not the
    // stored `readyAt` cache. The `currentCookingItem` guard above only blocks the
    // recipe ACTIVELY cooking (the first not-ready one); a recipe that finished
    // while its follow-ups were still queued sits BEFORE it and slips past. Letting
    // it be cancelled removes the anchored head and promotes a chained recipe with
    // no `startedAt` of its own — a windowed head the resolver can only paper over
    // by freezing its stored `readyAt`, which the cooking modal then renders as
    // "0 secs" with a full bar (the reported stuck-kitchen bug).
    const readyAts = getCookingQueueReadyAts({ crafting: queue, game, oil });
    if (readyAts[recipeIndex] <= createdAt) {
      throw new Error(
        `Recipe ${queueItem.name} has already finished cooking and cannot be cancelled`,
      );
    }

    // return resources consumed by the recipe
    const cookableName = assertCookableName(recipe.name);

    const ingredients = getCookingRequirements({
      state,
      item: cookableName,
      // Refund what was actually paid: the Double Nom rank stored on the recipe.
      doubleNomLevel: getRecipeDoubleNomLevel(recipe),
    });

    getObjectEntries(ingredients).forEach(([ingredient, amount]) => {
      const count = game.inventory[ingredient] ?? new Decimal(0);
      game.inventory[ingredient] = count.add(amount ?? 0);
    });

    // Only a recipe that paid for its oil when it was queued gets any back; one
    // drawing from the tank has burned none of it yet.
    if (recipe.boost?.Oil) {
      building.oil = (building.oil ?? 0) + recipe.boost.Oil;
    }

    building.crafting = recalculateQueue({
      // Remove the cancelled recipe by position — two entries can share a `readyAt`
      // (e.g. a zero-duration recipe), and filtering on it would drop both.
      queue: queue.filter((_, index) => index !== recipeIndex),
      createdAt,
      buildingName: buildingName as CookingBuildingName,
      isInstantCook: false,
      game,
      oil: oil && { ...oil, tank: building.oil ?? 0 },
    });

    return game;
  });
}
