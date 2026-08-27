import type { BuildingProduct, GameState } from "features/game/types/game";
import {
  computeReadyAt,
  getCookingBoostWindows,
  workAccruedAt,
  type BoostWindow,
} from "./boostWindows";

/**
 * A recipe's resolved timing. `startedAt` is when it actually begins cooking —
 * either its own anchor or the derived ready time of the recipe ahead of it — and is
 * undefined where neither exists: a legacy recipe, whose start was never recorded,
 * or a windowed recipe that has lost the recipe it was chained to.
 */
export type CookingTiming = {
  startedAt: number | undefined;
  readyAt: number;
};

/**
 * Resolve a cooking queue's ready times against a set of boost windows.
 *
 * Cooking is the only speed-boost activity whose tasks are SEQUENTIAL: a recipe
 * starts when the one ahead of it finishes. So unlike a crop or a rock, a recipe's
 * ready time cannot be derived in isolation — the queue is a chain, and a boost
 * placed mid-cook has to ripple through all of it.
 *
 * A recipe's start is therefore one of two things, and `startedAt` is the flag that
 * says which (see `cook`):
 *
 *   - **Anchored** (`startedAt` set): it began cooking at a wall-clock instant of
 *     its own, because the building was idle when it was queued. It keeps that
 *     start no matter what happens ahead of it.
 *   - **Chained** (`startedAt` absent): it was queued behind another recipe, so its
 *     start IS the previous recipe's DERIVED ready time — whatever that turns out
 *     to be once the windows are applied. This is what lets a boost placed mid-cook
 *     pull the entire queue forward rather than just the head.
 *
 * Writing a projected `startedAt` onto a chained recipe would defeat that: the value
 * computed at cook time assumed the boosts in force back then, and pinning to it
 * would strand the recipe behind a queue that has since sped up. Conversely, chaining
 * an anchored recipe would credit an idle gap as cooking progress — a recipe cooked
 * an hour after the previous one finished would be born part-cooked.
 *
 * Legacy recipes — those with no `baseDurationMs` — keep their stored `readyAt`,
 * keying off the marker's presence rather than the `SPEED_BOOSTS` flag, as every
 * other activity does. They still contribute their ready time to the chain, so a
 * queue part-way through migration (legacy head, windowed tail) resolves correctly.
 */
export const resolveCookingQueueTimings = ({
  crafting,
  windows,
}: {
  crafting: BuildingProduct[];
  windows: BoostWindow[];
}): CookingTiming[] => {
  let previousReadyAt: number | undefined;

  return crafting.map((recipe) => {
    const { baseDurationMs } = recipe;

    // An explicit `startedAt` is an absolute anchor and always wins; otherwise chain
    // off the recipe ahead.
    //
    // A windowed recipe with NEITHER is malformed persisted state, and its start
    // cannot be recovered: reconstructing it as `readyAt - baseDurationMs` mixes
    // units - it takes the UNBOOSTED duration off an ALREADY BOOSTED ready time,
    // inventing a start early enough that the windows get applied a second time on
    // top of themselves. So there is no fallback: such a recipe falls through to the
    // `startedAt === undefined` arm below and keeps its stored `readyAt`, which is
    // the last value the chain derived. `collectRecipe` anchors the recipe it
    // promotes to the head so this state is not produced in the first place.
    const startedAt = recipe.startedAt ?? previousReadyAt;

    const readyAt =
      baseDurationMs === undefined || startedAt === undefined
        ? recipe.readyAt
        : computeReadyAt({ startedAt, baseDurationMs, windows });

    previousReadyAt = readyAt;

    return { startedAt, readyAt };
  });
};

/** The derived ready times alone — the common case. */
export const resolveCookingQueue = (args: {
  crafting: BuildingProduct[];
  windows: BoostWindow[];
}): number[] =>
  resolveCookingQueueTimings(args).map((timing) => timing.readyAt);

/**
 * The ready times for every recipe in a building's queue, derived live from the
 * cooking boost windows. The persisted `readyAt` on each recipe is a cache of this
 * value, refreshed whenever an event rewrites the queue; this is the source of
 * truth in between.
 */
export const getCookingQueueReadyAts = ({
  crafting,
  game,
}: {
  crafting: BuildingProduct[];
  game: GameState;
}): number[] =>
  resolveCookingQueue({ crafting, windows: getCookingBoostWindows(game) });

/**
 * Pause a cooking queue across a landscaping lift, in place.
 *
 * The rule is the same one every other activity follows: time the building spent
 * in the inventory doesn't count. What differs is HOW, and cooking cannot use the
 * legacy trick of shifting each start forward by the downtime. Shifting re-exposes
 * a recipe to a different slice of the boost windows — a cook that banked 30
 * minutes of work under an hourglass which then expired while the building sat
 * unplaced would find that window stranded entirely before its new start, and lose
 * the credit. So the work already done is BANKED (subtracted from
 * `baseDurationMs`) and the recipe resumes, with only the remainder left to cook,
 * from the moment it was placed. This mirrors `pauseWindowedTimer` for resource
 * nodes; cooking needs its own because it pauses a CHAIN rather than one timer.
 *
 * The queue must be resolved BEFORE anything is mutated: a chained recipe carries
 * no `startedAt` of its own, so how much work it had accrued is only knowable from
 * the recipe ahead of it.
 *
 * Only an ANCHORED recipe (one with its own `startedAt`) is re-anchored to
 * `placedAt`; a chained one is deliberately left chained so it keeps tracking
 * whatever the recipe ahead of it derives to. Legacy recipes have no work model to
 * bank into, so they keep the pre-windowed behaviour of preserving their wall-clock
 * remainder — which is exactly what the old `timeRemaining` round-trip computed.
 */
export const pauseCookingQueue = ({
  crafting,
  removedAt,
  placedAt,
  windows,
}: {
  crafting: BuildingProduct[];
  removedAt: number;
  placedAt: number;
  windows: BoostWindow[];
}): void => {
  const timings = resolveCookingQueueTimings({ crafting, windows });

  crafting.forEach((recipe, index) => {
    const { startedAt } = timings[index];

    if (recipe.baseDurationMs === undefined || startedAt === undefined) {
      // Not clamped: a recipe that finished before the lift keeps its negative
      // remainder and stays ready, as it did before.
      recipe.readyAt = placedAt + (recipe.readyAt - removedAt);
      return;
    }

    const banked = Math.min(
      workAccruedAt({ startedAt, at: removedAt, windows }),
      recipe.baseDurationMs,
    );
    recipe.baseDurationMs -= banked;

    if (recipe.startedAt !== undefined) {
      recipe.startedAt = placedAt;
    }
  });

  // Refresh the cache so it agrees with the derived chain again.
  const readyAts = resolveCookingQueue({ crafting, windows });
  crafting.forEach((recipe, index) => {
    recipe.readyAt = readyAts[index];
    delete recipe.timeRemaining;
  });
};
