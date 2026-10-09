import type {
  BuildingProduct,
  GameState,
  PlacedItem,
} from "features/game/types/game";
import {
  computeReadyAt,
  getCookingBoostWindows,
  getEffectiveSpeedAt,
  workAccruedAt,
  type BoostWindow,
} from "./boostWindows";

/**
 * The oil budget a queue resolves against on a building using the retroactive
 * (lazy) oil model — the tank level and the instant it is measured at.
 *
 * `level` is `building.oil` AS OF `settledAt` (`building.oilSettledAt`). Oil is
 * spent as recipes do covered WORK, not reserved at cook time, so the tank is a
 * cache resolved forward from this anchor. Absent on a slice-1 / legacy building
 * (no `oilSettledAt`), where oil was already deducted and baked into durations.
 */
export type CookingOilContext = { level: number; settledAt: number };

/** The oil context for a building, or undefined if it is not on the lazy model. */
export const getCookingOilContext = (
  building: Pick<PlacedItem, "oil" | "oilSettledAt">,
): CookingOilContext | undefined =>
  building.oilSettledAt === undefined
    ? undefined
    : { level: building.oil ?? 0, settledAt: building.oilSettledAt };

/**
 * A recipe's resolved timing. `startedAt` is when it actually begins cooking —
 * either its own anchor or the derived ready time of the recipe ahead of it — and is
 * undefined where neither exists: a legacy recipe, whose start was never recorded,
 * or a windowed recipe that has lost the recipe it was chained to.
 */
export type CookingTiming = {
  startedAt: number | undefined;
  readyAt: number;
  /**
   * Base work (ms of `baseDurationMs`) this recipe's oil covers, front-loaded.
   * Beyond it the recipe cooks at 1× (× any window). 0 on a recipe that draws no
   * oil — legacy, slice-1-baked, or an empty tank by the time it cooks.
   */
  oilCoveredWorkMs: number;
  /** The recipe's snapshotted oil speed boost `p` (0 when it draws none). */
  oilPercent: number;
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
 *
 * ## Oil
 *
 * On a building using the retroactive oil model (`oil` context passed), building
 * oil is a SPEED boost applied live rather than a discount baked in at cook time.
 * The oil TANK is a single budget walked alongside the chain, spent in queue order
 * as each recipe does its covered work. A recipe carrying `oilPerWorkMs` draws
 * `oilPerWorkMs` of oil per ms of BASE work; the tank covers the first
 * `c = min(W, budget / oilPerWorkMs)` ms of its work, over which it runs at
 * `1/(1-p)` (× any window). Because oil is a constant multiplier over a
 * work-defined interval, that front-loaded coverage is exactly equivalent to a
 * recipe whose effective work is `W - c·p` — so the ready time is
 * `computeReadyAt(start, W - c·p, windows)` and the whole thing composes with the
 * boost windows for free (see the module math note). Draining per WORK, not per
 * clock, is what keeps a dish's oil cost identical to the slice-1 model while
 * letting a top-up speed up recipes already in the oven or the queue.
 *
 * Recipes WITHOUT `oilPerWorkMs` (slice-1-baked, or legacy) draw nothing: their
 * oil was already deducted and folded into the duration, so the budget flows past
 * them untouched. An idle gap (an anchored recipe that starts after the one ahead
 * finished) also spends no oil — the budget simply carries across it.
 */
export const resolveCookingQueueTimings = ({
  crafting,
  windows,
  oil,
}: {
  crafting: BuildingProduct[];
  windows: BoostWindow[];
  oil?: CookingOilContext;
}): CookingTiming[] => {
  let previousReadyAt: number | undefined;
  // The tank, spent as we walk the queue. Undefined ⇒ not on the lazy model, so
  // no recipe draws (their oil is baked in already).
  let budget = oil?.level;

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

    if (baseDurationMs === undefined || startedAt === undefined) {
      previousReadyAt = recipe.readyAt;
      return {
        startedAt,
        readyAt: recipe.readyAt,
        oilCoveredWorkMs: 0,
        oilPercent: 0,
      };
    }

    // Draw oil for this recipe: cover the first `c` ms of its base work, front
    // loaded, and spend the matching oil out of the shared budget.
    const oilPercent = recipe.oilPercent ?? 0;
    const oilPerWorkMs = recipe.oilPerWorkMs;
    let oilCoveredWorkMs = 0;
    if (
      oilPerWorkMs !== undefined &&
      oilPerWorkMs > 0 &&
      budget &&
      budget > 0
    ) {
      oilCoveredWorkMs = Math.min(baseDurationMs, budget / oilPerWorkMs);
      budget -= oilCoveredWorkMs * oilPerWorkMs;
    }

    // Front-loaded oil over a work interval ≡ an effective duration `W - c·p`
    // (the module math note proves this holds under any window shape).
    const effectiveDurationMs = baseDurationMs - oilCoveredWorkMs * oilPercent;
    const readyAt = computeReadyAt({
      startedAt,
      baseDurationMs: effectiveDurationMs,
      windows,
    });

    previousReadyAt = readyAt;
    return { startedAt, readyAt, oilCoveredWorkMs, oilPercent };
  });
};

/** The derived ready times alone — the common case. */
export const resolveCookingQueue = (args: {
  crafting: BuildingProduct[];
  windows: BoostWindow[];
  oil?: CookingOilContext;
}): number[] =>
  resolveCookingQueueTimings(args).map((timing) => timing.readyAt);

/**
 * The ready times for every recipe in a building's queue, derived live from the
 * cooking boost windows AND (on the lazy model) the building's oil tank. The
 * persisted `readyAt` on each recipe is a cache of this value, refreshed whenever
 * an event rewrites the queue; this is the source of truth in between.
 *
 * Pass `building` so the oil budget is threaded through; omit it (or pass a
 * building with no `oilSettledAt`) to resolve with windows only, as slice-1 did.
 */
export const getCookingQueueReadyAts = ({
  crafting,
  game,
  building,
}: {
  crafting: BuildingProduct[];
  game: GameState;
  building?: Pick<PlacedItem, "oil" | "oilSettledAt">;
}): number[] =>
  resolveCookingQueue({
    crafting,
    windows: getCookingBoostWindows(game),
    oil: building && getCookingOilContext(building),
  });

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

    // Re-anchor anything that had actually BEGUN by the lift. An explicit
    // `startedAt` says so outright; `banked > 0` catches a chained recipe whose
    // predecessor was a LEGACY one that had already finished - that predecessor
    // keeps its wall-clock remainder, which is a `readyAt` in the PAST, and a
    // successor left chained to it would derive a start before the placement and
    // re-accrue the work it just banked. A recipe that had not begun keeps no
    // anchor, so it goes on tracking the recipe ahead of it.
    if (recipe.startedAt !== undefined || banked > 0) {
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

// ---------------------------------------------------------------------------
// Retroactive (lazy) oil
//
// On the lazy model building oil is a SPEED boost applied live, and the tank
// drains as recipes do covered WORK rather than being deducted at cook time.
// This is what lets a top-up speed up the recipe in the oven and everything
// queued, while keeping a dish's total oil cost identical to the slice-1 model.
// The building carries `oilSettledAt` (the tank's timestamp) and each lazy
// recipe carries `oilPercent`/`oilPerWorkMs`. `settleCookingBuilding` is the
// only mutator; `resolveCookingQueueTimings` derives everything in between.
// ---------------------------------------------------------------------------

/**
 * How far a recipe has cooked by `at`, and how much of its oil that has burned.
 *
 * Oil is front-loaded: the recipe runs at `1/(1-p)` (× any window) over the
 * first `c = oilCoveredWorkMs` ms of its BASE work, then at 1× (× window). So
 * BASE-work done is not simply the windowed work — over the covered phase each
 * ms of windowed progress is `1/(1-p)` ms of base work. Splitting on the
 * windowed work that spans the covered phase (`c·(1-p)`) recovers both:
 *
 * - `baseWorkDone`: ms of `baseDurationMs` completed by `at`.
 * - `oilBurnedWorkMs`: ms of COVERED work done (≤ c) — multiply by
 *   `oilPerWorkMs` for the oil actually burned.
 */
const recipeCookProgressAt = ({
  startedAt,
  baseDurationMs,
  oilCoveredWorkMs,
  oilPercent,
  windows,
  at,
}: {
  startedAt: number;
  baseDurationMs: number;
  oilCoveredWorkMs: number;
  oilPercent: number;
  windows: BoostWindow[];
  at: number;
}): { baseWorkDone: number; oilBurnedWorkMs: number } => {
  if (at <= startedAt) return { baseWorkDone: 0, oilBurnedWorkMs: 0 };

  const windowedWork = workAccruedAt({ startedAt, at, windows });
  const coveredWindowed = oilCoveredWorkMs * (1 - oilPercent);

  let baseWorkDone: number;
  let oilBurnedWorkMs: number;
  if (windowedWork <= coveredWindowed) {
    // Still inside the oil-covered phase.
    baseWorkDone =
      oilPercent < 1 ? windowedWork / (1 - oilPercent) : oilCoveredWorkMs;
    oilBurnedWorkMs = Math.min(baseWorkDone, oilCoveredWorkMs);
  } else {
    // Past it: the covered work is fully done, the rest ran at 1×.
    baseWorkDone = oilCoveredWorkMs + (windowedWork - coveredWindowed);
    oilBurnedWorkMs = oilCoveredWorkMs;
  }

  return {
    baseWorkDone: Math.min(baseWorkDone, baseDurationMs),
    oilBurnedWorkMs,
  };
};

/**
 * The building's oil tank level at `at`: the settled level minus the oil every
 * recipe has burned doing covered work by then. Derived, so the UI can tick it
 * down live between events. Returns the raw `oil` on a non-lazy building.
 */
export const getCookingOilAt = ({
  building,
  windows,
  at,
}: {
  building: Pick<PlacedItem, "crafting" | "oil" | "oilSettledAt">;
  windows: BoostWindow[];
  at: number;
}): number => {
  const oil = getCookingOilContext(building);
  if (oil === undefined) return building.oil ?? 0;

  const crafting = building.crafting ?? [];
  const timings = resolveCookingQueueTimings({ crafting, windows, oil });

  const burned = crafting.reduce((total, recipe, index) => {
    const { startedAt, oilCoveredWorkMs, oilPercent } = timings[index];
    if (
      startedAt === undefined ||
      recipe.baseDurationMs === undefined ||
      recipe.oilPerWorkMs === undefined
    ) {
      return total;
    }
    const { oilBurnedWorkMs } = recipeCookProgressAt({
      startedAt,
      baseDurationMs: recipe.baseDurationMs,
      oilCoveredWorkMs,
      oilPercent,
      windows,
      at,
    });
    return total + oilBurnedWorkMs * recipe.oilPerWorkMs;
  }, 0);

  return Math.max(oil.level - burned, 0);
};

/**
 * The effective cooking speed at `at` — the window product times the oil boost
 * `1/(1-p)` while a recipe is inside its oil-covered phase, 1 while idle. Drives
 * the ⚡ indicator, which drops when the tank empties mid-cook.
 */
export const getCookingSpeedAt = ({
  building,
  windows,
  at,
}: {
  building: Pick<PlacedItem, "crafting" | "oil" | "oilSettledAt">;
  windows: BoostWindow[];
  at: number;
}): number => {
  const oil = getCookingOilContext(building);
  const crafting = building.crafting ?? [];
  const timings = resolveCookingQueueTimings({ crafting, windows, oil });

  let speed = 1;
  crafting.forEach((recipe, index) => {
    const { startedAt, readyAt, oilCoveredWorkMs, oilPercent } = timings[index];
    if (startedAt === undefined || startedAt > at || at >= readyAt) return;

    // A recipe is cooking at `at`. Base window speed always applies.
    speed = Math.max(speed, getEffectiveSpeedAt({ at, windows }));

    if (recipe.baseDurationMs === undefined || oilCoveredWorkMs <= 0) return;
    // Oil accelerates only while inside the covered phase.
    const { baseWorkDone } = recipeCookProgressAt({
      startedAt,
      baseDurationMs: recipe.baseDurationMs,
      oilCoveredWorkMs,
      oilPercent,
      windows,
      at,
    });
    if (baseWorkDone < oilCoveredWorkMs && oilPercent < 1) {
      speed = getEffectiveSpeedAt({ at, windows }) / (1 - oilPercent);
    }
  });

  return speed;
};

/**
 * Refresh the cached `readyAt` on every recipe from a fresh resolution, so the
 * persisted value matches the derived chain. Exported for events that change the
 * queue SHAPE after settling.
 */
export const refreshCookingCaches = ({
  building,
  windows,
}: {
  building: Pick<PlacedItem, "crafting" | "oil" | "oilSettledAt">;
  windows: BoostWindow[];
}): void => {
  const crafting = building.crafting ?? [];
  const readyAts = resolveCookingQueue({
    crafting,
    windows,
    oil: getCookingOilContext(building),
  });
  crafting.forEach((recipe, index) => {
    recipe.readyAt = readyAts[index];
    delete recipe.timeRemaining;
  });
};

/**
 * Freeze a lazy-oil building at `now`, in place — the one mutator of its oil
 * state, called by every cooking event with its `createdAt`:
 *
 *   1. bank each in-flight recipe's accrued BASE work into `baseDurationMs` and
 *      re-anchor it to `now` (its remaining work resumes there);
 *   2. bake a recipe whose work is now done so it stops drawing oil (its oil is
 *      folded into `baseDurationMs` and its `oilPerWorkMs`/`oilPercent` markers
 *      are dropped) — it keeps its true completion `readyAt` as history;
 *   3. burn the oil consumed in `[oilSettledAt, now]` and advance `oilSettledAt`.
 *
 * Idempotent and behaviour-neutral: resolving a settled building gives the same
 * timeline as the unsettled one (the banking is the same arithmetic the resolver
 * uses). Like `settleCropMachine` the anchor is monotonic — a no-op when
 * `now < oilSettledAt` — so a replayed action stamped before the anchor cannot
 * rewind the ledger and re-bank the overlap. No-op on a non-lazy building.
 */
export const settleCookingBuilding = ({
  building,
  windows,
  now,
}: {
  building: PlacedItem;
  windows: BoostWindow[];
  now: number;
}): void => {
  const oil = getCookingOilContext(building);
  if (oil === undefined || now < oil.settledAt) return;

  const crafting = building.crafting ?? [];
  const timings = resolveCookingQueueTimings({ crafting, windows, oil });

  let burned = 0;
  crafting.forEach((recipe, index) => {
    const { startedAt, readyAt, oilCoveredWorkMs, oilPercent } = timings[index];
    if (recipe.baseDurationMs === undefined || startedAt === undefined) return;

    const draws = recipe.oilPerWorkMs !== undefined;
    const { baseWorkDone, oilBurnedWorkMs } = recipeCookProgressAt({
      startedAt,
      baseDurationMs: recipe.baseDurationMs,
      oilCoveredWorkMs,
      oilPercent,
      windows,
      at: now,
    });

    if (draws) burned += oilBurnedWorkMs * (recipe.oilPerWorkMs as number);

    // Completed by now: freeze it. Fold its oil into the duration so it stops
    // drawing, and keep the true completion time as immutable history.
    if (readyAt <= now) {
      if (draws) {
        recipe.baseDurationMs -= oilCoveredWorkMs * oilPercent;
        delete recipe.oilPerWorkMs;
        delete recipe.oilPercent;
      }
      // Anchor the true start if it was chained, so `readyAt` stays fixed.
      if (recipe.startedAt === undefined) recipe.startedAt = startedAt;
      recipe.readyAt = readyAt;
      return;
    }

    // Still cooking: bank the work done and resume the remainder at `now`.
    if (baseWorkDone > 0 || recipe.startedAt !== undefined) {
      recipe.baseDurationMs -= baseWorkDone;
      recipe.startedAt = now;
    }
  });

  building.oil = Math.max(oil.level - burned, 0);
  building.oilSettledAt = now;

  refreshCookingCaches({ building, windows });
};

/**
 * Burn the oil a recipe still would have drawn, in place — used when an event
 * completes a recipe INSTANTLY (Instant Gratification, gem speed-up) instead of
 * letting it cook the rest of its covered work. Without this the un-burned oil
 * would linger in the tank, a small leak; Elias chose to keep the sink exact.
 *
 * Call AFTER `settleCookingBuilding(now)` so the tank and the recipe's remaining
 * `baseDurationMs` are current: the recipe's remaining coverage is
 * `min(remainingWork, tank / oilPerWorkMs)`, and that oil is removed.
 */
export const consumeRemainingRecipeOil = ({
  building,
  recipe,
}: {
  building: PlacedItem;
  recipe: BuildingProduct;
}): void => {
  if (
    building.oilSettledAt === undefined ||
    recipe.baseDurationMs === undefined ||
    recipe.oilPerWorkMs === undefined
  ) {
    return;
  }
  const tank = building.oil ?? 0;
  const covered = Math.min(
    recipe.baseDurationMs,
    recipe.oilPerWorkMs > 0 ? tank / recipe.oilPerWorkMs : 0,
  );
  building.oil = Math.max(tank - covered * recipe.oilPerWorkMs, 0);
};

/**
 * Convert a building to the lazy-oil model, in place — one-shot and idempotent
 * (keys off `oilSettledAt`). Trivial, unlike the crop machine's conversion:
 * slice-1 recipes DEDUCTED their oil from the tank at cook time, so the stored
 * `oil` is already the correct level and their durations already have the oil
 * baked in. Stamping `oilSettledAt` is all that is needed — in-flight recipes
 * carry no `oilPerWorkMs` so they draw nothing further, and only recipes queued
 * after conversion draw lazily. No double count.
 */
export const convertCookingToLazyOil = ({
  building,
  now,
}: {
  building: PlacedItem;
  now: number;
}): void => {
  if (building.oilSettledAt !== undefined) return;
  building.oilSettledAt = now;
  building.oil = building.oil ?? 0;
};

/**
 * Resume a lazy-oil building after a landscaping lift, in place. `removeBuilding`
 * settled it at the lift (banking work and burning oil through `removedAt`, with
 * every started recipe re-anchored there), so resuming is just moving those
 * anchors and the fuel timestamp forward across the downtime — the lifted
 * interval costs neither work nor oil, and window credit earned before the lift
 * stays banked. No timestamp shifting exposes a recipe to a new window slice
 * because no work was pending mid-window; it was all banked.
 */
export const resumeCookingBuilding = ({
  building,
  windows,
  removedAt,
  placedAt,
}: {
  building: PlacedItem;
  windows: BoostWindow[];
  removedAt: number;
  placedAt: number;
}): void => {
  if (building.oilSettledAt === undefined) return;
  const downtime = Math.max(0, placedAt - removedAt);

  (building.crafting ?? []).forEach((recipe) => {
    if (recipe.baseDurationMs === undefined) {
      // Legacy recipe: preserve its wall-clock remainder across the downtime.
      recipe.readyAt = placedAt + (recipe.readyAt - removedAt);
      return;
    }
    if (recipe.startedAt !== undefined) recipe.startedAt += downtime;
  });

  // Monotonic, like settleCropMachine's place handler.
  building.oilSettledAt = Math.max(placedAt, building.oilSettledAt);
  refreshCookingCaches({ building, windows });
};
