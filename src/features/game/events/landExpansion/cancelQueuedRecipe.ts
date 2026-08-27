import type {
  BuildingName,
  CookingBuildingName,
} from "features/game/types/buildings";
import type {
  BuildingProduct,
  GameState,
  PlacedItem,
} from "features/game/types/game";
import {
  BUILDING_OIL_BOOSTS,
  getCookingRequirements,
  getOilConsumption,
} from "./cook";
import { getRecipeDoubleNomLevel } from "./collectRecipe";
import Decimal from "decimal.js-light";
import { produce } from "immer";
import {
  assertCookableName,
  type CookableName,
  COOKABLES,
} from "features/game/types/consumables";
import { getCookingTime } from "features/game/expansion/lib/boosts";
import { getObjectEntries } from "lib/object";
import { hasFeatureAccess } from "lib/flags";
import { getCookingBoostWindows } from "features/game/lib/boostWindows";
import {
  getCookingQueueReadyAts,
  resolveCookingQueue,
} from "features/game/lib/cookingReadiness";

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
 *
 * Under SPEED_BOOSTS this also MIGRATES the recipes it rewrites onto the speed-rate
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
}: {
  queue: BuildingProduct[];
  createdAt: number;
  buildingName: CookingBuildingName;
  isInstantCook?: boolean;
  game: GameState;
}): BuildingProduct[] {
  // Readiness comes from the DERIVED chain, not each recipe's stored `readyAt`. That
  // value is only a cache, and it can only ever be stale-FUTURE (a boost window is
  // added, never removed), so splitting on it puts a recipe that has actually
  // finished in the upcoming half - where an instant cook re-anchors it and restarts
  // a cook the player already paid for. With no `baseDurationMs` the derived value
  // is the stored one, so the legacy paths below are unaffected.
  const readyAts = getCookingQueueReadyAts({ crafting: queue, game });

  // Keep only ready recipes
  const readyRecipes = queue.filter((_, index) => readyAts[index] <= createdAt);

  // Get all other recipes that aren't ready yet
  const upcomingRecipes = queue.filter(
    (_, index) => readyAts[index] > createdAt,
  );

  if (hasFeatureAccess(game, "SPEED_BOOSTS")) {
    const rebuilt = upcomingRecipes.map((recipe, index) => {
      // The recipe already cooking keeps its own timer — it is mid-cook and must not
      // be restarted. An instant cook removed the previous head, so whatever is
      // promoted into its place starts NOW and is anchored there.
      if (index === 0 && !isInstantCook) return recipe;

      // `baseDurationMs` is snapshotted when the recipe is queued, like the Double
      // Nom rank beside it. Only DERIVE one for a legacy recipe being migrated —
      // re-deriving an existing value would re-apply today's permanent boosts, so
      // swapping a wearable and cancelling something unrelated would silently
      // change the duration of everything queued behind it.
      const baseDurationMs =
        recipe.baseDurationMs ??
        getQueueItemCookingSeconds({
          name: assertCookableName(recipe.name),
          appliedOilBoost: recipe.boost?.Oil ?? 0,
          buildingName,
          game,
          createdAt,
        }).seconds * 1000;

      // Everything behind the head is CHAINED: no `startedAt`, so its start tracks
      // the derived ready time of the recipe ahead of it.
      const { startedAt: _discarded, ...chained } = recipe;

      return index === 0
        ? { ...chained, startedAt: createdAt, baseDurationMs }
        : { ...chained, baseDurationMs };
    });

    const nextQueue = [...readyRecipes, ...rebuilt];
    const readyAts = resolveCookingQueue({
      crafting: nextQueue,
      windows: getCookingBoostWindows(game),
    });

    // Refresh the cached `readyAt` on every entry so the persisted value matches
    // what the chain currently derives.
    return nextQueue.map((recipe, index) => ({
      ...recipe,
      readyAt: readyAts[index],
    }));
  }

  if (isInstantCook) {
    const updatedRecipes = upcomingRecipes.reduce((recipes, recipe, index) => {
      const startAt = index === 0 ? createdAt : recipes[index - 1].readyAt;

      const readyAt = getUpdatedReadyAt({
        name: assertCookableName(recipe.name),
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
        name: assertCookableName(recipe.name),
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
}: {
  building: PlacedItem;
  createdAt: number;
  game: GameState;
}): { index: number; recipe: BuildingProduct; readyAt: number } | undefined {
  const queue = building.crafting;

  if (!queue?.length) return;

  const readyAts = getCookingQueueReadyAts({ crafting: queue, game });
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

    const queue = building.crafting;

    if (!queue) {
      throw new Error("No queue exists");
    }

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
    });

    const recipe = queue[recipeIndex];

    if (currentCookingItem?.index === recipeIndex) {
      throw new Error(
        `Recipe ${queueItem.name} with readyAt ${recipe.readyAt} is currently being cooked`,
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
    });

    return game;
  });
}
