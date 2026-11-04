import type {
  BuildingProduct,
  GameState,
  PlacedItem,
} from "features/game/types/game";
import type { CookingBuildingName } from "features/game/types/buildings";
import {
  computeReadyAt,
  getCookingBoostWindows,
  workAccruedAt,
  type BoostWindow,
} from "./boostWindows";
import { hasFeatureAccess } from "lib/flags";

const DAY = 24 * 60 * 60 * 1000;

/**
 * Oil a clock-drain building burns per REAL day of cooking. Each rate is today's
 * per-recipe-day consumption divided by `1 - boost` (the default oil boost), so an
 * unboosted dish costs the same oil it always has; the tank just drains by the
 * clock now, so every other boost makes a dish cheaper in oil too.
 */
export const COOKING_OIL_RATE: Record<CookingBuildingName, number> = {
  "Fire Pit": 1.25,
  Kitchen: 6.75,
  "Smoothie Shack": 11.5,
  Bakery: 15.5,
  Deli: 20,
};

/** A full tank is five real days of cooking in every building. */
export const COOKING_OIL_CAPACITY = Object.fromEntries(
  Object.entries(COOKING_OIL_RATE).map(([name, rate]) => [name, rate * 5]),
) as Record<CookingBuildingName, number>;

/**
 * A clock-drain building's tank ledger: `tank` oil at `settledAt`, burned at
 * `ratePerDay` while a recipe that draws oil is cooking.
 */
export type CookingOil = {
  tank: number;
  settledAt: number;
  ratePerDay: number;
};

/** The building's tank ledger, or undefined while it still deducts per recipe. */
export const getCookingOil = ({
  building,
  buildingName,
}: {
  building: Pick<PlacedItem, "oil" | "oilSettledAt">;
  buildingName: CookingBuildingName;
}): CookingOil | undefined =>
  building.oilSettledAt === undefined
    ? undefined
    : {
        tank: building.oil ?? 0,
        settledAt: building.oilSettledAt,
        ratePerDay: COOKING_OIL_RATE[buildingName],
      };

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
   * When the tank is speeding this recipe up, as a speed window: from when the oil
   * starts flowing to it until the recipe finishes or the tank runs dry.
   */
  oilWindow?: BoostWindow;
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
 * On a clock-drain building (`oil` passed) the tank is resolved in the same pass.
 * Oil is a TIME budget: it lasts `tank / ratePerDay` days of cooking, burns only
 * while a recipe that draws oil (`oilBoost` set) is actually cooking, and speeds
 * that recipe up by `1 / (1 - oilBoost)` — stacking multiplicatively with the boost
 * windows, like any other speed. It flows in queue order from `settledAt`, so a
 * recipe takes whatever the recipes ahead of it left in the tank.
 */
export const resolveCookingQueueTimings = ({
  crafting,
  windows,
  oil,
}: {
  crafting: BuildingProduct[];
  windows: BoostWindow[];
  oil?: CookingOil;
}): CookingTiming[] => {
  let previousReadyAt: number | undefined;
  let fuelMs = oil ? Math.max((oil.tank / oil.ratePerDay) * DAY, 0) : 0;

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
      return { startedAt, readyAt: recipe.readyAt };
    }

    if (!oil || recipe.oilBoost === undefined || fuelMs <= 0) {
      const readyAt = computeReadyAt({ startedAt, baseDurationMs, windows });
      previousReadyAt = readyAt;
      return { startedAt, readyAt };
    }

    const from = Math.max(startedAt, oil.settledAt);
    const fuelled: BoostWindow = {
      from,
      to: from + fuelMs,
      speed: 1 / (1 - recipe.oilBoost),
    };
    const readyAt = computeReadyAt({
      startedAt,
      baseDurationMs,
      windows: [...windows, fuelled],
    });
    previousReadyAt = readyAt;

    const to = Math.min(readyAt, fuelled.to);
    if (to <= from) return { startedAt, readyAt };

    fuelMs -= to - from;
    return { startedAt, readyAt, oilWindow: { ...fuelled, to } };
  });
};

/** The windows a recipe cooks under: the boost windows plus its oil, if any. */
const withOil = (windows: BoostWindow[], timing: CookingTiming) =>
  timing.oilWindow ? [...windows, timing.oilWindow] : windows;

/**
 * The live level of a clock-drain building's tank at `at`: the settled level less
 * whatever the queue has burned since.
 */
export const getCookingOilAt = ({
  crafting,
  windows,
  oil,
  at,
}: {
  crafting: BuildingProduct[];
  windows: BoostWindow[];
  oil: CookingOil;
  at: number;
}): number => {
  const burnedMs = resolveCookingQueueTimings({
    crafting,
    windows,
    oil,
  }).reduce(
    (total, { oilWindow }) =>
      oilWindow && at > oilWindow.from
        ? total + Math.min(at, oilWindow.to) - oilWindow.from
        : total,
    0,
  );

  return Math.max(oil.tank - (burnedMs / DAY) * oil.ratePerDay, 0);
};

/** The derived ready times alone — the common case. */
export const resolveCookingQueue = (args: {
  crafting: BuildingProduct[];
  windows: BoostWindow[];
  oil?: CookingOil;
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
  oil,
}: {
  crafting: BuildingProduct[];
  game: GameState;
  oil?: CookingOil;
}): number[] =>
  resolveCookingQueue({ crafting, windows: getCookingBoostWindows(game), oil });

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

/**
 * Settle a clock-drain building at `at`, in place: everything the queue has done
 * since the last settle is written down, so the ledger can be changed from here.
 *
 * Oil is derived from `settledAt` onwards, so anything that changes the tank or
 * the queue — adding oil, cooking, collecting, cancelling, speeding up, lifting —
 * must settle first. Otherwise oil added now would flow retroactively from the
 * last settle, and a collected recipe's oil would flow back into the tank.
 *
 * Settling changes nothing a player can see: each in-progress recipe banks the
 * work it has done (shrinking `baseDurationMs`) and is re-anchored at `at`, each
 * finished recipe is pinned to its finish as a zero-work recipe, and the tank is
 * burned down to its level at `at`.
 *
 * `resumeAt` pauses the building across a landscaping lift: nothing cooks and no
 * oil burns between `at` (the lift) and `resumeAt` (the placement). Legacy
 * recipes have no work to bank, so they keep the old wall-clock remainder.
 *
 * The anchor only moves forward, so a replayed event stamped before the current
 * anchor cannot rewind the ledger (mirrors `settleCropMachine`).
 */
export const settleCookingBuilding = ({
  building,
  buildingName,
  at: requestedAt,
  resumeAt: requestedResumeAt,
  windows,
}: {
  building: PlacedItem;
  buildingName: CookingBuildingName;
  at: number;
  resumeAt?: number;
  windows: BoostWindow[];
}): void => {
  const oil = getCookingOil({ building, buildingName });
  if (!oil) return;

  const at = Math.max(requestedAt, oil.settledAt);
  const resumeAt = Math.max(requestedResumeAt ?? at, at);
  const crafting = building.crafting ?? [];
  const timings = resolveCookingQueueTimings({ crafting, windows, oil });

  building.oil = getCookingOilAt({ crafting, windows, oil, at });
  building.oilSettledAt = resumeAt;

  crafting.forEach((recipe, index) => {
    const timing = timings[index];
    const { startedAt, readyAt } = timing;

    if (recipe.baseDurationMs === undefined || startedAt === undefined) {
      recipe.readyAt = resumeAt + (recipe.readyAt - at);
      return;
    }

    if (readyAt <= at) {
      recipe.startedAt = readyAt;
      recipe.baseDurationMs = 0;
      return;
    }

    if (startedAt < at) {
      recipe.baseDurationMs -= Math.min(
        workAccruedAt({ startedAt, at, windows: withOil(windows, timing) }),
        recipe.baseDurationMs,
      );
      recipe.startedAt = resumeAt;
      return;
    }

    if (recipe.startedAt !== undefined) {
      recipe.startedAt += resumeAt - at;
    }
  });

  refreshCookingQueue({ building, buildingName, windows });
};

/** Rewrite the cached `readyAt` on every recipe to what the chain derives. */
export const refreshCookingQueue = ({
  building,
  buildingName,
  windows,
}: {
  building: PlacedItem;
  buildingName: CookingBuildingName;
  windows: BoostWindow[];
}): void => {
  const crafting = building.crafting ?? [];
  const readyAts = resolveCookingQueue({
    crafting,
    windows,
    oil: getCookingOil({ building, buildingName }),
  });
  crafting.forEach((recipe, index) => {
    recipe.readyAt = readyAts[index];
    delete recipe.timeRemaining;
  });
};

/**
 * Settle a cooking building's oil at `at` before an event changes its tank or
 * queue (see `settleCookingBuilding`).
 *
 * With `convert`, a building still deducting oil per recipe is CONVERTED here once
 * SPEED_BOOSTS is on: its tank is already net of every recipe that paid up front,
 * and those keep the cut they paid for, so converting is just starting the ledger.
 * Only the events that put oil or recipes INTO the building convert it; until then
 * it has nothing that draws from the tank, so there is nothing to settle. A converted
 * building stays on clock drain whatever the flag says, so a rollback can never
 * deduct from a tank that is draining.
 *
 * A lifted building is settled at the lift: it neither cooks nor burns oil until
 * it is placed again, which settles the downtime away.
 *
 * Returns the settled ledger — undefined while the building still deducts oil per
 * recipe.
 */
export const settleCookingOil = ({
  game,
  building,
  buildingName,
  at,
  convert = false,
}: {
  game: GameState;
  building: PlacedItem;
  buildingName: CookingBuildingName;
  at: number;
  convert?: boolean;
}): CookingOil | undefined => {
  const settleAt =
    !building.coordinates && building.removedAt !== undefined
      ? Math.min(at, building.removedAt)
      : at;

  if (building.oilSettledAt === undefined) {
    if (convert && hasFeatureAccess(game, "SPEED_BOOSTS")) {
      building.oilSettledAt = settleAt;
    }
  } else {
    settleCookingBuilding({
      building,
      buildingName,
      at: settleAt,
      windows: getCookingBoostWindows(game),
    });
  }

  return getCookingOil({ building, buildingName });
};

/**
 * Burn the oil recipe `index` would still have drawn had it cooked to the end, for
 * a recipe completed early (gem speed-up, Instant Gratification). The building
 * must already be settled at `at`.
 *
 * Skipping the wait does not skip the oil: the dish costs what it would have cost
 * cooked out, capped at what is in the tank. Otherwise a full tank would cut the
 * gem price (which is off the oil-boosted time left) without ever being used up.
 *
 * Returns the ledger after the burn.
 */
export const burnRecipeOil = ({
  building,
  buildingName,
  index,
  at,
  windows,
}: {
  building: PlacedItem;
  buildingName: CookingBuildingName;
  index: number;
  at: number;
  windows: BoostWindow[];
}): CookingOil | undefined => {
  const oil = getCookingOil({ building, buildingName });
  if (!oil) return undefined;

  const { oilWindow } =
    resolveCookingQueueTimings({
      crafting: building.crafting ?? [],
      windows,
      oil,
    })[index] ?? {};

  if (oilWindow && oilWindow.to > at) {
    const burnedMs = oilWindow.to - Math.max(oilWindow.from, at);
    building.oil = Math.max(oil.tank - (burnedMs / DAY) * oil.ratePerDay, 0);
  }

  return getCookingOil({ building, buildingName });
};
