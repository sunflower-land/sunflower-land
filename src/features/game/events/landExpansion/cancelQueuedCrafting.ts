import Decimal from "decimal.js-light";
import { produce } from "immer";
import type { CraftingQueueItem, GameState } from "features/game/types/game";
import { type Recipe, RECIPES } from "features/game/lib/crafting";
import { trackFarmActivity } from "features/game/types/farmActivity";
import {
  computeReadyAt,
  getCraftingBoostWindows,
} from "features/game/lib/boostWindows";
import { resolveCraftingQueue } from "features/game/lib/craftingReadiness";

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
  now,
  spedUpIndex,
  spedUpAt,
}: {
  queue: CraftingQueueItem[];
  game: GameState;
  /** Anything already finished by this instant is history and is left alone. */
  now?: number;
  /** Index of a craft the player has paid to finish immediately, if any. */
  spedUpIndex?: number;
  /** When that craft completes. */
  spedUpAt?: number;
}): CraftingQueueItem[] {
  if (queue.length === 0) return [];

  const windows = getCraftingBoostWindows(game);
  const result = [...queue];

  // Finished-ness is judged on the DERIVED chain as it stands BEFORE anything is
  // rewritten, so a craft the windows have already completed is recognised even
  // though its cached readyAt still points ahead.
  const priorReadyAts = resolveCraftingQueue({ queue, windows });

  const isSpedUp = spedUpIndex !== undefined && spedUpAt !== undefined;

  if (isSpedUp) {
    const item = result[spedUpIndex];
    result[spedUpIndex] =
      item.baseDurationMs === undefined
        ? { ...item, readyAt: spedUpAt }
        : // Zero work left: it is done, and like a Fox Shrine proc it stops
          // occupying the box.
          {
            ...item,
            baseDurationMs: 0,
            startedAt: spedUpAt,
            readyAt: spedUpAt,
          };
  }

  // A windowed craft that is sped up stops holding the box, so the craft behind
  // it would otherwise chain to whatever occupied it BEFORE - a readyAt in the
  // past - and be back-dated. Anchor the first occupying craft after it instead.
  let needsPromotedAnchor =
    isSpedUp && result[spedUpIndex].baseDurationMs !== undefined;

  // The crafting box is free once the latest real (box-occupying) craft has
  // finished. Track that time instead of chaining off the immediately-preceding
  // item: a Fox Shrine instant proc is "ready" out of order (its readyAt can be
  // in the past while a longer craft ahead of it is still going), and it does
  // not occupy the box — so later crafts must wait for the real craft, not
  // inherit the instant's stale readyAt.
  let boxFreeAt: number | null = null;

  for (let i = 0; i < result.length; i++) {
    const item = result[i];

    // A craft that has already finished is HISTORY: its ready time is when the
    // player's item actually became available, and re-chaining it would restart
    // something they have already paid for and waited out. It still frees the box
    // at that moment, so it goes on anchoring whatever follows.
    if (now !== undefined && i !== spedUpIndex && priorReadyAts[i] <= now) {
      const occupied =
        item.baseDurationMs === undefined
          ? item.startedAt === undefined || item.readyAt > item.startedAt
          : item.baseDurationMs > 0;
      if (occupied) boxFreeAt = priorReadyAts[i];
      continue;
    }

    if (item.baseDurationMs !== undefined) {
      // Windowed craft. Its `baseDurationMs` is a SNAPSHOT taken when it was
      // queued and is never re-derived here: it is un-boosted work, while
      // `readyAt - startedAt` is a boosted wall-clock span, so reusing the latter
      // as a duration would apply the windows a second time. Only the chain of
      // starts is rebuilt; the ready times then follow from the windows.
      if (item.baseDurationMs === 0) {
        // Instant proc (or a craft just sped up): ready at its own anchor, holds
        // nothing, so it neither moves nor delays the crafts after it.
        continue;
      }

      let startedAt: number | undefined;
      if (needsPromotedAnchor && i > (spedUpIndex as number)) {
        startedAt = spedUpAt;
        needsPromotedAnchor = false;
      } else if (boxFreeAt === null) {
        // First craft to occupy the box: it keeps its own anchor, because it is
        // the one actually running.
        startedAt = item.startedAt;
      } else {
        // Chained: its start tracks the box-free time as that moves.
        startedAt = undefined;
      }

      const effectiveStart: number | undefined =
        startedAt ?? boxFreeAt ?? undefined;
      const readyAt: number =
        effectiveStart === undefined
          ? item.readyAt
          : computeReadyAt({
              startedAt: effectiveStart,
              baseDurationMs: item.baseDurationMs,
              windows,
            });

      const next: CraftingQueueItem = { ...item, readyAt };
      if (startedAt === undefined) {
        delete next.startedAt;
      } else {
        next.startedAt = startedAt;
      }

      result[i] = next;
      boxFreeAt = readyAt;
      continue;
    }

    // Legacy craft — unchanged from the discount-at-start model. Note this does
    // NOT migrate it onto the windowed model, unlike cooking's `recalculateQueue`:
    // that has to, because `getCookingTime` stopped baking the temporary boosts in,
    // so re-deriving a legacy recipe's duration would strip its boost. Here nothing
    // is ever re-derived from the recipe, so a legacy craft stays legacy safely and
    // `migrateSpeedBoosts` picks it up on the next load.
    const recipe = getRecipeByName(item.name, game);
    if (!recipe) continue;

    // Each item's crafting duration is locked in when it is queued — it already
    // reflects any boosts or Fox Shrine instant procs that were active at that
    // moment. Only the chain of start times is recomputed so that removing or
    // speeding up an earlier item shifts the rest, without re-deriving durations
    // from the current (possibly changed) boost state or re-rolling the prng.
    const ownStart = item.startedAt ?? item.readyAt;
    const lockedDuration = item.readyAt - ownStart;

    let startedAt: number;
    let readyAt: number;
    if (isSpedUp && i === spedUpIndex) {
      startedAt = ownStart;
      readyAt = spedUpAt;
      boxFreeAt = readyAt;
    } else if (lockedDuration === 0) {
      // Instant craft: stays ready at its original time and does not occupy the
      // box, so it neither moves nor delays the crafts after it.
      startedAt = ownStart;
      readyAt = item.readyAt;
    } else {
      // Real craft: starts when the box is next free (after the previous real
      // craft), or keeps its own start if it is the first to occupy the box.
      startedAt = boxFreeAt ?? ownStart;
      readyAt = startedAt + lockedDuration;
      boxFreeAt = readyAt;
    }

    result[i] = { ...item, startedAt, readyAt };
  }

  return result;
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

    const index = queue.findIndex((r) => r.id === queueItemId);

    if (index === -1) {
      throw new Error("Item does not exist in queue");
    }

    const item = queue[index];

    // Both guards read the DERIVED chain, never the stored `readyAt`. That cache
    // can only ever be stale-FUTURE (windows are added, never removed), so a boost
    // placed since the last write would make `find(q => q.readyAt > createdAt)`
    // name a craft that has already finished as the one in progress - letting the
    // player cancel the craft that is genuinely running and take a full ingredient
    // refund for work already done.
    const readyAts = resolveCraftingQueue({
      queue,
      windows: getCraftingBoostWindows(game),
    });

    const currentCraftingIndex = readyAts.findIndex(
      (readyAt) => readyAt > createdAt,
    );

    if (currentCraftingIndex === index) {
      throw new Error(
        `Item ${item.name} with readyAt ${readyAts[index]} is currently being crafted`,
      );
    }

    if (readyAts[index] <= createdAt) {
      throw new Error(
        `Item ${item.name} with readyAt ${readyAts[index]} is already ready and cannot be cancelled`,
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

    // Address by POSITION, not by id: a duplicate id would otherwise drop both.
    const updatedQueue = queue.filter((_, i) => i !== index);

    game.farmActivity = trackFarmActivity(
      `${item.name} Crafting Started`,
      game.farmActivity,
      new Decimal(-1),
    );

    game.craftingBox.queue = recalculateCraftingQueue({
      queue: updatedQueue,
      game,
      now: createdAt,
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
