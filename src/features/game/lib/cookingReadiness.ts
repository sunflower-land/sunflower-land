import type { BuildingProduct, GameState } from "features/game/types/game";
import {
  computeReadyAt,
  getCookingBoostWindows,
  type BoostWindow,
} from "./boostWindows";

/**
 * A recipe's resolved timing. `startedAt` is when it actually begins cooking —
 * either its own anchor or the derived ready time of the recipe ahead of it — and is
 * undefined only for a legacy recipe, whose start was never recorded.
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
    // off the recipe ahead. The final fallback only covers malformed persisted state
    // (a windowed head with neither an anchor nor a predecessor).
    const startedAt =
      recipe.startedAt ??
      previousReadyAt ??
      (baseDurationMs === undefined
        ? undefined
        : recipe.readyAt - baseDurationMs);

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
