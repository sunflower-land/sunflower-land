import Decimal from "decimal.js-light";
import type {
  Recipe,
  RecipeIngredient,
  Recipes,
} from "features/game/lib/crafting";
import type {
  BoostName,
  CraftingQueueItem,
  GameState,
  InventoryItemName,
} from "features/game/types/game";
import { hasVipAccess } from "features/game/lib/vipAccess";
import { trackFarmActivity } from "features/game/types/farmActivity";
import { produce } from "immer";
import { isWearableActive } from "features/game/lib/wearables";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";
import { getCountAndType } from "features/island/hud/components/inventory/utils/inventory";
import { isTemporaryCollectibleActive } from "features/game/lib/collectibleBuilt";
import { hasFeatureAccess } from "lib/flags";
import {
  computeReadyAt,
  getCraftingBoostWindows,
} from "features/game/lib/boostWindows";
import { getCraftingBoxFreeAt } from "features/game/lib/craftingReadiness";
import { KNOWN_IDS } from "features/game/types";
import { ITEM_IDS, type BumpkinItem } from "features/game/types/bumpkin";
import { prngChance } from "lib/prng";
import { grantCraftedItem } from "./collectCrafting";

export type StartCraftingAction = {
  type: "crafting.started";
  ingredients: (RecipeIngredient | null)[];
  queueItemId: string;
};

type Options = {
  state: Readonly<GameState>;
  action: StartCraftingAction;
  farmId: number;
  createdAt?: number;
};

export function getBoostedCraftingTime({
  game,
  time,
  prngArgs,
  now,
}: {
  game: GameState;
  time: number;
  prngArgs?: { farmId: number; itemId: number; counter: number };
  now: number;
}) {
  // Under SPEED_BOOSTS the temporary craft-time boosts (Fox Shrine's x0.75 half and
  // the two totems) are windowed speeds applied live by `getCraftingQueueReadyAts`,
  // so they must NOT be baked in here - what this returns becomes the craft's
  // `baseDurationMs` (permanent boosts only). They are likewise excluded from
  // `boostsUsed`, matching every other slice.
  const boostsWindowed = hasFeatureAccess(game, "SPEED_BOOSTS");

  let seconds = time;
  const boostsUsed: { name: BoostName; value: string }[] = [];

  if (isTemporaryCollectibleActive({ name: "Fox Shrine", game, now })) {
    // The roll happens under BOTH models, and deliberately so: it consumes the
    // same `<Name> Crafting Started` counter either way, so the sequence of
    // outcomes a farm sees cannot change with the flag. The proc is a discrete
    // outcome rather than a rate, so it can never be a window - it stays a
    // start-time roll that zeroes the work and keeps its `boostsUsed` entry.
    if (
      prngArgs &&
      prngChance({
        ...prngArgs,
        chance: 10,
        criticalHitName: "Fox Shrine",
      })
    ) {
      seconds = 0;
      boostsUsed.push({ name: "Fox Shrine", value: "x0" });
      return {
        seconds,
        baseDurationMs: boostsWindowed ? 0 : undefined,
        boostsUsed,
      };
    }

    if (!boostsWindowed) {
      seconds *= 0.75;
      boostsUsed.push({ name: "Fox Shrine", value: "x0.75" });
    }
  }

  // Sol & Luna 50% Crafting Speed
  if (isWearableActive({ name: "Sol & Luna", game })) {
    seconds *= 0.5;
    boostsUsed.push({ name: "Sol & Luna", value: "x0.5" });
  }

  if (isWearableActive({ name: "Architect Ruler", game })) {
    seconds *= 0.75;
    boostsUsed.push({ name: "Architect Ruler", value: "x0.75" });
  }

  if (
    !boostsWindowed &&
    (isTemporaryCollectibleActive({ name: "Time Warp Totem", game, now }) ||
      isTemporaryCollectibleActive({ name: "Super Totem", game, now }))
  ) {
    seconds *= 0.5;
    if (isTemporaryCollectibleActive({ name: "Time Warp Totem", game, now })) {
      boostsUsed.push({ name: "Time Warp Totem", value: "x0.5" });
    } else if (
      isTemporaryCollectibleActive({ name: "Super Totem", game, now })
    ) {
      boostsUsed.push({ name: "Super Totem", value: "x0.5" });
    }
  }

  return {
    seconds,
    baseDurationMs: boostsWindowed ? seconds : undefined,
    boostsUsed,
  };
}

export function startCrafting({
  state,
  action,
  farmId,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (copy) => {
    const { ingredients } = action;

    if (ingredients.length !== 9) {
      throw new Error("You must provide 9 ingredients");
    }

    // Check if player has the Crafting Box
    const isBuildingBuilt = copy.buildings["Crafting Box"]?.some(
      (building) => !!building.coordinates,
    );
    if (!isBuildingBuilt) {
      throw new Error("You do not have a Crafting Box");
    }

    const effectiveQueue: CraftingQueueItem[] = copy.craftingBox.queue ?? [];
    if (effectiveQueue.find((q) => q.id === action.queueItemId)) {
      throw new Error("Invalid queue item id");
    }

    // Discovered recipes carry the ingredient layout in game state. The static
    // RECIPES on the FE only holds time/type metadata (ingredients are []), so
    // matching against it would never succeed.
    const recipe = findMatchingRecipe(ingredients, copy.craftingBox.recipes);
    const isBaseInstantRecipe = recipe?.time === 0;
    const availableSlots = hasVipAccess({ game: copy, now: createdAt }) ? 4 : 1;

    if (effectiveQueue.length >= availableSlots && !isBaseInstantRecipe) {
      throw new Error("No available slots");
    }

    if (!recipe) {
      if (effectiveQueue.length === 0) {
        copy.craftingBox.status = "pending";
      }
      return;
    }

    // Subtract the ingredients from the player's inventory
    ingredients.forEach((ingredient) => {
      if (ingredient) {
        if (ingredient.collectible) {
          const inventoryCount =
            copy.inventory[ingredient.collectible] ?? new Decimal(0);

          const { count: availableCollectibleCount } = getCountAndType(
            copy,
            ingredient.collectible,
          );

          if (availableCollectibleCount.lt(1)) {
            throw new Error(
              "You do not have the ingredients to craft this item",
            );
          }
          copy.inventory[ingredient.collectible] = inventoryCount.minus(1);
        }

        if (ingredient.wearable) {
          const wardrobeCount = copy.wardrobe[ingredient.wearable] ?? 0;
          const { count: availableWardrobeCount } = getCountAndType(
            copy,
            ingredient.wearable,
          );

          if (availableWardrobeCount.lt(1)) {
            throw new Error(
              "You do not have the ingredients to craft this item",
            );
          }
          copy.wardrobe[ingredient.wearable] = wardrobeCount - 1;
        }
      }
    });

    copy.farmActivity = trackFarmActivity(
      `${recipe.name} Crafting Started`,
      copy.farmActivity ?? {},
    );

    if (isBaseInstantRecipe) {
      grantCraftedItem({ type: recipe.type, name: recipe.name }, copy);

      copy.craftingBox = {
        status: effectiveQueue.length > 0 ? "crafting" : "idle",
        queue: effectiveQueue,
        recipes: {
          ...copy.craftingBox.recipes,
          [recipe.name]: { ...recipe },
        },
      };

      return copy;
    }

    // Start when the crafting box next becomes free, but never before now. This
    // is derived from the boost windows rather than read off the stored readyAts:
    // under the speed-rate model those are a cache, and a boost placed since the
    // last write may already have pulled the queue forward. Instant procs are
    // skipped - they never occupied the box (see `getCraftingBoxFreeAt`).
    const windows = getCraftingBoostWindows(state);
    const boxFreeAt = getCraftingBoxFreeAt({
      queue: effectiveQueue,
      windows,
    });

    // Queued behind a craft still running, or starting fresh on a free box? That
    // decides whether the craft gets an absolute `startedAt` anchor or chains off
    // the box-free time - see `resolveCraftingQueueTimings`. Anchoring when the
    // box is already free is what stops a craft queued after an idle gap being
    // born part-done: finished-but-uncollected items keep a readyAt in the past,
    // and chaining to it would discount the elapsed wait from the new craft.
    const isChained = boxFreeAt !== undefined && boxFreeAt > createdAt;
    const recipeStartAt = isChained ? boxFreeAt : createdAt;

    const {
      seconds: recipeTime,
      baseDurationMs,
      boostsUsed,
    } = getBoostedCraftingTime({
      game: state,
      time: recipe.time,
      prngArgs: {
        farmId,
        itemId:
          recipe.type === "collectible"
            ? KNOWN_IDS[recipe.name as InventoryItemName]
            : ITEM_IDS[recipe.name as BumpkinItem],
        counter: state.farmActivity[`${recipe.name} Crafting Started`] ?? 0,
      },
      now: createdAt,
    });

    const isInstant = recipeTime === 0;

    // The stored `readyAt` is a CACHE of the derived chain, so it must be written
    // through the windows - otherwise a craft queued under an active booster would
    // persist an unboosted time and only snap forward on the next rewrite.
    const readyAt = isInstant
      ? createdAt
      : baseDurationMs === undefined
        ? recipeStartAt + recipeTime
        : computeReadyAt({
            startedAt: recipeStartAt,
            baseDurationMs,
            windows,
          });

    // A windowed craft queued behind another carries NO `startedAt` so its start
    // tracks the box-free time as that moves. Everything else is anchored: legacy
    // crafts (which have always stored one), a craft starting on a free box, and
    // an instant proc - which is anchored at its own creation, does zero work and
    // so never holds the box.
    const startedAt =
      baseDurationMs === undefined || isInstant || !isChained
        ? isInstant
          ? createdAt
          : recipeStartAt
        : undefined;

    const newQueueItem: CraftingQueueItem = {
      id: action.queueItemId,
      readyAt,
      startedAt,
      baseDurationMs,
      ...recipe,
    };

    const updatedQueue = [...effectiveQueue, newQueueItem];

    if (effectiveQueue.length > 0) {
      copy.farmActivity = trackFarmActivity("Recipe Queued", copy.farmActivity);
    }

    copy.craftingBox = {
      status: "crafting",
      queue: updatedQueue,
      recipes: {
        ...copy.craftingBox.recipes,
        [recipe.name]: { ...recipe },
      },
    };

    copy.boostsUsedAt = updateBoostUsed({
      game: copy,
      boostNames: boostsUsed,
      createdAt,
    });

    return copy;
  });
}

export function findMatchingRecipe(
  ingredients: (RecipeIngredient | null)[],
  recipes: Partial<Recipes>,
): Recipe | undefined {
  // Empty grid should not match any recipe (avoids showing Cushion etc. when nothing is placed)
  const hasAnyIngredient = ingredients.some((i) => i != null);
  if (!hasAnyIngredient) return undefined;

  for (const recipe of Object.values(recipes)) {
    // Check if every ingredient matches
    const ingredientsMatch = recipe.ingredients.every(
      (recipeIngredient, index) => {
        const playerIngredient = ingredients[index];

        if (recipeIngredient === null && playerIngredient === null) {
          return true;
        }

        if (recipeIngredient === null || playerIngredient === null) {
          return false;
        }

        if (
          "collectible" in recipeIngredient &&
          "collectible" in playerIngredient
        ) {
          return recipeIngredient.collectible === playerIngredient.collectible;
        }

        if ("wearable" in recipeIngredient && "wearable" in playerIngredient) {
          return recipeIngredient.wearable === playerIngredient.wearable;
        }

        return false;
      },
    );

    // Check if the recipe is padded with nulls up to 9
    const isPaddedCorrectly = ingredients
      .slice(recipe.ingredients.length)
      .every((item) => item === null);

    if (ingredientsMatch && isPaddedCorrectly) {
      return recipe;
    }
  }

  return undefined;
}
