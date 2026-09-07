import type { CraftingQueueItem, GameState } from "features/game/types/game";
import {
  computeReadyAt,
  getCraftingBoostWindows,
  workAccruedAt,
  type BoostWindow,
} from "./boostWindows";

/**
 * A craft's resolved timing. `startedAt` is when it actually begins — either its
 * own anchor or the derived time the Crafting Box next freed up — and is undefined
 * where neither exists: a legacy craft whose start was never recorded, or a
 * windowed craft that has lost the craft it was chained to.
 *
 * `occupiesBox` says whether this craft HOLDS the box. A Fox Shrine instant proc
 * does no work, is ready at its own anchor, and never occupies it, so a craft
 * queued behind a proc must follow the last REAL craft instead.
 */
export type CraftingTiming = {
  startedAt: number | undefined;
  readyAt: number;
  occupiesBox: boolean;
};

/**
 * Resolve a crafting queue's ready times against a set of boost windows.
 *
 * Like cooking, crafting is SEQUENTIAL: a craft starts when the box frees up, so a
 * craft's ready time cannot be derived in isolation — the queue is a chain, and a
 * boost placed mid-craft has to ripple through all of it. `startedAt` is the flag
 * that says which kind of start a craft has (see `startCrafting`):
 *
 *   - **Anchored** (`startedAt` set): it began at a wall-clock instant of its own,
 *     because the box was free when it was queued. It keeps that start no matter
 *     what happens ahead of it.
 *   - **Chained** (`startedAt` absent): it was queued behind another craft, so its
 *     start IS the derived time the box next frees up — whatever that turns out to
 *     be once the windows are applied. This is what lets a boost placed mid-queue
 *     pull the entire queue forward rather than just the head.
 *
 * Writing a projected `startedAt` onto a chained craft would defeat that: the value
 * computed at queue time assumed the boosts in force back then, and pinning to it
 * would strand the craft behind a queue that has since sped up. Conversely, chaining
 * an anchored craft would credit an idle gap as progress — a craft queued an hour
 * after the previous one finished would be born part-done.
 *
 * WHERE THIS DIFFERS FROM COOKING: the cursor a chained craft follows is not "the
 * previous entry's ready time" but "when the box next frees up". A Fox Shrine
 * instant proc sits in the queue with zero work and a `readyAt` at its own anchor,
 * and it never occupied the box — so the crafts behind it must chain off the last
 * REAL craft. That is the same rule `recalculateCraftingQueue` has always applied
 * through its `boxFreeAt` cursor; this just derives it.
 *
 * Legacy crafts — those with no `baseDurationMs` — keep their stored `readyAt`,
 * keying off the marker's presence rather than the `SPEED_BOOSTS` flag, as every
 * other activity does. They still advance the cursor, so a queue part-way through
 * migration (legacy head, windowed tail) resolves correctly.
 */
export const resolveCraftingQueueTimings = ({
  queue,
  windows,
}: {
  queue: CraftingQueueItem[];
  windows: BoostWindow[];
}): CraftingTiming[] => {
  let boxFreeAt: number | undefined;

  return queue.map((craft) => {
    const { baseDurationMs } = craft;

    // An explicit `startedAt` is an absolute anchor and always wins; otherwise
    // chain off when the box next frees up.
    //
    // A windowed craft with NEITHER is malformed persisted state, and its start
    // cannot be recovered: reconstructing it as `readyAt - baseDurationMs` mixes
    // units - it takes the UNBOOSTED duration off an ALREADY BOOSTED ready time,
    // inventing a start early enough that the windows get applied a second time on
    // top of themselves. So there is no fallback: such a craft falls through to the
    // `startedAt === undefined` arm below and keeps its stored `readyAt`, which is
    // the last value the chain derived. `collectCrafting` anchors the craft it
    // promotes so this state is not produced in the first place.
    const startedAt = craft.startedAt ?? boxFreeAt;

    const readyAt =
      baseDurationMs === undefined || startedAt === undefined
        ? craft.readyAt
        : computeReadyAt({ startedAt, baseDurationMs, windows });

    // Windowed: zero WORK is a proc. Legacy: a zero locked wall-clock span is a
    // proc, which is exactly how `recalculateCraftingQueue` has always detected
    // one. A malformed windowed craft with no recoverable start counts as
    // occupying - that delays the crafts behind it rather than inventing free box
    // time for them.
    const occupiesBox =
      baseDurationMs === undefined
        ? craft.startedAt === undefined || craft.readyAt > craft.startedAt
        : baseDurationMs > 0;

    if (occupiesBox) boxFreeAt = readyAt;

    return { startedAt, readyAt, occupiesBox };
  });
};

/** The derived ready times alone — the common case. */
export const resolveCraftingQueue = (args: {
  queue: CraftingQueueItem[];
  windows: BoostWindow[];
}): number[] =>
  resolveCraftingQueueTimings(args).map((timing) => timing.readyAt);

/**
 * The ready times for every craft in the queue, derived live from the crafting
 * boost windows. The persisted `readyAt` on each craft is a cache of this value,
 * refreshed whenever an event rewrites the queue; this is the source of truth in
 * between.
 */
export const getCraftingQueueReadyAts = ({
  queue,
  game,
}: {
  queue: CraftingQueueItem[];
  game: GameState;
}): number[] =>
  resolveCraftingQueue({ queue, windows: getCraftingBoostWindows(game) });

/**
 * When the Crafting Box next becomes free, or undefined if nothing is holding it.
 *
 * This replaces `queue.reduce((latest, q) => Math.max(latest, q.readyAt), createdAt)`
 * in `startCrafting`. It gives the same answer on a legacy queue — a proc's
 * `readyAt` is its own anchor, always in the past, so it never won that max — but
 * it is derived rather than read off the caches, and it is explicit about which
 * crafts actually hold the box. Callers clamp to `createdAt` themselves, since
 * "the box is free now" and "the box frees up later" are different decisions.
 */
export const getCraftingBoxFreeAt = (args: {
  queue: CraftingQueueItem[];
  windows: BoostWindow[];
}): number | undefined =>
  resolveCraftingQueueTimings(args).reduce<number | undefined>(
    (freeAt, timing) => (timing.occupiesBox ? timing.readyAt : freeAt),
    undefined,
  );

/**
 * Pause a crafting queue across a landscaping lift, in place.
 *
 * The rule is the one every other activity follows: time the box spent in the
 * inventory doesn't count. What differs is HOW. The legacy path shifts each
 * timestamp forward by the downtime, which cannot work once boosts are windows —
 * shifting re-exposes a craft to a different slice of them, so a craft that banked
 * half an hour of work under a totem which then expired while the box sat unplaced
 * would find that window stranded entirely before its new start, and lose the
 * credit. So work already done is BANKED (subtracted from `baseDurationMs`) and the
 * craft resumes, with only the remainder left, from the moment it was placed. This
 * mirrors `pauseCookingQueue`.
 *
 * The queue must be resolved BEFORE anything is mutated: a chained craft carries no
 * `startedAt` of its own, so how much work it had accrued is only knowable from the
 * craft ahead of it.
 *
 * Two crafting-only carve-outs:
 *   - An instant proc (`baseDurationMs === 0`) is left completely alone. It has no
 *     work to bank and never held the box, so re-anchoring it would pointlessly
 *     move a ready item and break the "instants keep their own readyAt" invariant.
 *   - The legacy arm shifts BOTH timestamps, not just `readyAt` as cooking does,
 *     because the crafting progress bar reads the pair. That keeps the no-marker
 *     path byte-identical to the shift this replaced.
 */
export const pauseCraftingQueue = ({
  queue,
  removedAt,
  placedAt,
  windows,
}: {
  queue: CraftingQueueItem[];
  removedAt: number;
  placedAt: number;
  windows: BoostWindow[];
}): void => {
  const timings = resolveCraftingQueueTimings({ queue, windows });
  const downtimeDelta = Math.max(0, placedAt - removedAt);

  queue.forEach((craft, index) => {
    const { startedAt } = timings[index];

    if (craft.baseDurationMs === undefined || startedAt === undefined) {
      // Legacy arm - the shift this replaced, unchanged. Not clamped: a craft that
      // finished before the lift keeps its remainder and stays ready.
      if (craft.startedAt !== undefined) craft.startedAt += downtimeDelta;
      craft.readyAt += downtimeDelta;
      return;
    }

    // An instant proc has nothing to bank and holds nothing.
    if (craft.baseDurationMs === 0) return;

    const banked = Math.min(
      workAccruedAt({ startedAt, at: removedAt, windows }),
      craft.baseDurationMs,
    );
    craft.baseDurationMs -= banked;

    // Re-anchor anything that had actually BEGUN by the lift. An explicit
    // `startedAt` says so outright; `banked > 0` catches a chained craft whose
    // predecessor was a LEGACY one that had already finished - that predecessor
    // keeps its wall-clock remainder, which is a `readyAt` in the PAST, and a
    // successor left chained to it would derive a start before the placement and
    // re-accrue the work it just banked. A craft that had not begun keeps no
    // anchor, so it goes on tracking the craft ahead of it.
    if (craft.startedAt !== undefined || banked > 0) {
      craft.startedAt = placedAt;
    }
  });

  // Refresh the cache so it agrees with the derived chain again.
  const readyAts = resolveCraftingQueue({ queue, windows });
  queue.forEach((craft, index) => {
    craft.readyAt = readyAts[index];
  });
};
