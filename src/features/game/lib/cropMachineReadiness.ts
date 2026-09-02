import type {
  CropMachineBuilding,
  CropMachineQueueItem,
} from "features/game/types/game";
import {
  computeReadyAt,
  getEffectiveSpeedAt,
  workAccruedAt,
  type BoostWindow,
} from "./boostWindows";

/**
 * A pack's resolved timing on a WINDOWED crop machine.
 *
 * - `readyAt` set: the pack completes (or completed) at that instant. For a
 *   pack that has already been finalised (no `baseDurationMs`) this is its
 *   stored, immutable history; otherwise it is derived.
 * - `growsUntil` set: the tank runs dry mid-pack at that instant and the pack
 *   stalls with `workRemainingMs` still owed. At most one pack in a queue
 *   carries it — the one active when the fuel runs out.
 * - Neither set with `startsAt` unset: the pack never starts (no fuel reaches
 *   it, or the machine is lifted).
 */
export type CropMachinePackTiming = {
  readyAt?: number;
  startsAt?: number;
  growsUntil?: number;
  workRemainingMs: number;
};

export type CropMachineTimings = {
  packs: CropMachinePackTiming[];
  /** The instant the tank runs dry, if the queue outruns the fuel. */
  fuelRunsOutAt?: number;
  /** Fuel left once every pack that can complete has completed (ms). */
  fuelRemainingMs: number;
};

type ResolvableMachine = Pick<
  CropMachineBuilding,
  "queue" | "unallocatedOilTime" | "oilSettledAt" | "removedAt"
>;

/**
 * Resolve a windowed crop machine's pack timings AND fuel in one forward pass.
 *
 * The crop machine is the one activity where speed windows and fuel are
 * entangled: packs grow SEQUENTIALLY, the tank drains 1:1 with the wall clock
 * while a pack is actively growing, and a boost window changes how much WORK
 * each wall-clock hour does. So a boosted pack finishes sooner AND burns less
 * fuel — "boosts stretch fuel" — and the saved fuel flows to the next pack in
 * the same pass. That entanglement is why fuel carries no per-pack earmarks on
 * a windowed machine (a pack's fuel cost is derived, not reserved) and why
 * ready times and the tank level must be resolved together rather than stamped
 * at allocation time the way the legacy `updateCropMachine` does.
 *
 * Everything derives from three authoritative anchors — `oilSettledAt` (the
 * simulation's start), each pack's `baseDurationMs` (work remaining at that
 * instant) and `unallocatedOilTime` (the whole tank at that instant) — plus
 * the windows. The stored `startTime`/`growsUntil`/`readyAt`/
 * `growTimeRemaining` on a windowed pack are caches of this resolution and are
 * never read back here: reconstructing a start from a cached `readyAt` mixes
 * units (an unboosted duration off an already-boosted instant) and re-applies
 * the windows on top of themselves — the exploit the cooking slice hit. The
 * one exception is a FINALISED pack (no `baseDurationMs`): its `readyAt` is
 * immutable completed history and passes straight through.
 *
 * The whole timeline is a projection independent of `now`; callers classify
 * packs (ready / growing / stalled) by comparing against their own clock.
 *
 * A lifted machine (`removedAt` set) accrues nothing past the lift. Events
 * settle AT the lift so in practice the simulation starts there; the clamp is
 * defensive for un-settled state.
 */
export function resolveCropMachine({
  machine,
  windows,
}: {
  machine: ResolvableMachine;
  windows: BoostWindow[];
}): CropMachineTimings {
  const queue = machine.queue ?? [];

  let t = machine.oilSettledAt ?? 0;
  let fuel = machine.unallocatedOilTime ?? 0;
  const pauseAt = machine.removedAt;

  let fuelRunsOutAt: number | undefined;

  const packs: CropMachinePackTiming[] = queue.map((pack) => {
    // Finalised (or pre-conversion legacy) pack: immutable completed history.
    if (pack.baseDurationMs === undefined) {
      return { readyAt: pack.readyAt, workRemainingMs: 0 };
    }

    const work = pack.baseDurationMs;

    // Out of fuel, or the machine is lifted: the pack never starts. Later
    // packs can't start either, but fall through here naturally.
    if (fuel <= 0 || (pauseAt !== undefined && t >= pauseAt)) {
      return { workRemainingMs: work };
    }

    const startsAt = t;
    const finishAt = computeReadyAt({
      startedAt: t,
      baseDurationMs: work,
      windows,
    });
    const fuelOutAt = t + fuel;
    const runsUntil = Math.min(
      finishAt,
      fuelOutAt,
      pauseAt ?? Number.POSITIVE_INFINITY,
    );

    // Fuel (and the machine's placement) covers the whole remainder — the
    // pack completes. A tie with fuel-out still completes.
    if (finishAt === runsUntil) {
      fuel -= finishAt - t;
      t = finishAt;
      return { startsAt, readyAt: finishAt, workRemainingMs: 0 };
    }

    // The tank empties (or the machine was lifted) mid-pack: bank what accrued
    // and stall. Only a genuine fuel-out gets a `growsUntil` stamp.
    const done = workAccruedAt({ startedAt: t, at: runsUntil, windows });
    fuel -= runsUntil - t;
    const stalled = runsUntil === fuelOutAt;
    if (stalled) fuelRunsOutAt = fuelOutAt;
    t = runsUntil;
    return {
      startsAt,
      ...(stalled ? { growsUntil: fuelOutAt } : {}),
      workRemainingMs: Math.max(work - done, 0),
    };
  });

  return { packs, fuelRunsOutAt, fuelRemainingMs: Math.max(fuel, 0) };
}

/**
 * The tank level at `at`: the settled fuel minus the wall-clock time the
 * machine spends actively growing in `[oilSettledAt, at]`.
 */
export function getCropMachineFuelAt({
  machine,
  windows,
  at,
}: {
  machine: ResolvableMachine;
  windows: BoostWindow[];
  at: number;
}): number {
  const { packs } = resolveCropMachine({ machine, windows });

  const burned = packs.reduce((total, pack) => {
    if (pack.startsAt === undefined) return total;
    const end = pack.readyAt ?? pack.growsUntil;
    if (end === undefined) return total;
    return total + Math.max(0, Math.min(end, at) - pack.startsAt);
  }, 0);

  return Math.max((machine.unallocatedOilTime ?? 0) - burned, 0);
}

/**
 * A windowed pack's growth progress (0–100) at `at`, measured in WORK against
 * `totalGrowTime`. Work done = what was banked into the anchors before the
 * settlement (`totalGrowTime - baseDurationMs`) plus what has accrued since,
 * fuel-gated by the resolved timeline. A finalised pack is simply done.
 */
export function getCropMachinePackProgress({
  machine,
  index,
  windows,
  at,
}: {
  machine: ResolvableMachine;
  index: number;
  windows: BoostWindow[];
  at: number;
}): number {
  const pack: CropMachineQueueItem | undefined = machine.queue?.[index];
  if (!pack || !pack.totalGrowTime) return 0;
  if (pack.baseDurationMs === undefined) return 100;

  const timing = resolveCropMachine({ machine, windows }).packs[index];

  let accruedSinceSettle = 0;
  if (timing.startsAt !== undefined) {
    const end = Math.min(at, timing.readyAt ?? at, timing.growsUntil ?? at);
    accruedSinceSettle = Math.min(
      workAccruedAt({ startedAt: timing.startsAt, at: end, windows }),
      pack.baseDurationMs,
    );
  }

  const workDone =
    pack.totalGrowTime - pack.baseDurationMs + accruedSinceSettle;
  return Math.max(0, Math.min(100, (workDone / pack.totalGrowTime) * 100));
}

/**
 * The machine's effective speed at `at`: the window product while a pack is
 * actively growing, 1 otherwise (idle, stalled or lifted). Drives the UI's
 * lightning indicator (countdowns show ACTUAL wall-clock time, so there is no
 * accelerated tick to size).
 */
export function getCropMachineSpeedAt({
  machine,
  windows,
  at,
}: {
  machine: ResolvableMachine;
  windows: BoostWindow[];
  at: number;
}): number {
  const { packs } = resolveCropMachine({ machine, windows });

  const growing = packs.some((pack) => {
    if (pack.startsAt === undefined || pack.startsAt > at) return false;
    const end = pack.readyAt ?? pack.growsUntil;
    return end === undefined || at < end;
  });

  return growing ? getEffectiveSpeedAt({ at, windows }) : 1;
}

/**
 * Refresh the legacy cache fields on every still-windowed pack from a fresh
 * resolution, so persistence/analytics/legacy readers keep seeing sensible
 * values. `growTimeRemaining` keeps its legacy meaning of UNFUNDED work (zero
 * while fuel covers the pack, the shortfall when it stalls), which is exactly
 * `workRemainingMs`. No logic may read these back — see `resolveCropMachine`.
 *
 * Exported for events that change the queue's SHAPE after settling (pushing a
 * new pack, filtering one out); pure timing changes are already refreshed by
 * `settleCropMachine` itself.
 */
export function refreshCropMachineCaches({
  machine,
  windows,
  now,
}: {
  machine: CropMachineBuilding;
  windows: BoostWindow[];
  now: number;
}): void {
  const { packs } = resolveCropMachine({ machine, windows });

  (machine.queue ?? []).forEach((pack, index) => {
    if (pack.baseDurationMs === undefined) return;

    const timing = packs[index];
    pack.growTimeRemaining = timing.workRemainingMs;

    if (timing.readyAt !== undefined) pack.readyAt = timing.readyAt;
    else delete pack.readyAt;

    if (timing.growsUntil !== undefined) pack.growsUntil = timing.growsUntil;
    else delete pack.growsUntil;

    // A stamped PAST start is history and is kept; anything else (unset, or a
    // projection that hasn't happened yet) tracks the derived value.
    if (timing.startsAt !== undefined) {
      if (pack.startTime === undefined || pack.startTime > now) {
        pack.startTime = timing.startsAt;
      }
    } else if (pack.startTime !== undefined && pack.startTime > now) {
      delete pack.startTime;
    }

    delete pack.pausedTimeRemaining;
  });
}

/**
 * Freeze the machine at `now`, in place — the ONLY mutator of a windowed
 * machine's timing state, called by every crop-machine event with its
 * `createdAt` (and by the lift/place handlers):
 *
 *   1. finalise every pack whose derived ready time has passed (its `readyAt`
 *      becomes immutable history and its `baseDurationMs` marker is dropped);
 *   2. bank each in-flight pack's accrued work into `baseDurationMs`;
 *   3. burn the fuel the machine actually consumed and advance `oilSettledAt`;
 *   4. refresh the legacy caches from a fresh resolution.
 *
 * Settlement is behaviour-neutral and idempotent: resolving a settled machine
 * gives the same timeline as resolving the unsettled one, because banking
 * converts elapsed window coverage to work with `workAccruedAt` (the same
 * arithmetic the resolver uses) and no window's coverage of the PAST ever
 * changes — live windows start at their placement's `createdAt`,
 * `appendBoostHistory` records exactly the interval the live record already
 * showed, and extensions only push a window's end outward. Settling on every
 * event also defends the 7-day `boostHistory` prune: past credit is baked into
 * the stored work before the window that earned it can be forgotten.
 *
 * No-op on a legacy machine (no `oilSettledAt`) — convert it first.
 */
export function settleCropMachine({
  machine,
  windows,
  now,
}: {
  machine: CropMachineBuilding;
  windows: BoostWindow[];
  now: number;
}): void {
  if (machine.oilSettledAt === undefined) return;

  const { packs } = resolveCropMachine({ machine, windows });
  const queue = machine.queue ?? [];

  // Fuel burned in [oilSettledAt, now]: the wall-clock the machine spent
  // actively growing. Computed BEFORE the packs are mutated. A pack cut short
  // by the lift clamp (`removedAt`) carries neither end stamp — it ran until
  // the lift (which is `now` in the removeBuilding flow).
  const pauseAt = machine.removedAt ?? Number.POSITIVE_INFINITY;
  const burned = packs.reduce((total, pack) => {
    if (pack.startsAt === undefined) return total;
    const end = pack.readyAt ?? pack.growsUntil ?? pauseAt;
    return total + Math.max(0, Math.min(end, now, pauseAt) - pack.startsAt);
  }, 0);

  queue.forEach((pack, index) => {
    if (pack.baseDurationMs === undefined) return;

    const timing = packs[index];

    // Completed by now: finalise. The derived ready time becomes immutable
    // history — a window placed later must never move it.
    if (timing.readyAt !== undefined && timing.readyAt <= now) {
      pack.readyAt = timing.readyAt;
      // A stamped PAST start is history and wins; an unset or still-future
      // (projected) one takes the derived value — same rule as refreshCropMachineCaches.
      if (
        timing.startsAt !== undefined &&
        (pack.startTime === undefined || pack.startTime > now)
      ) {
        pack.startTime = timing.startsAt;
      }
      pack.growTimeRemaining = 0;
      delete pack.growsUntil;
      delete pack.baseDurationMs;
      delete pack.pausedTimeRemaining;
      return;
    }

    // Still in flight: bank what accrued before `now` (capped by a stall or
    // the lift), and stamp the TRUE first start while this resolution still
    // knows it — after the anchor advances, a later resolve only sees the
    // anchor.
    if (timing.startsAt !== undefined && timing.startsAt < now) {
      if (pack.startTime === undefined || pack.startTime > now) {
        pack.startTime = timing.startsAt;
      }
      const end = Math.min(now, timing.growsUntil ?? pauseAt, pauseAt);
      const banked = Math.min(
        workAccruedAt({ startedAt: timing.startsAt, at: end, windows }),
        pack.baseDurationMs,
      );
      pack.baseDurationMs -= banked;
    }
  });

  machine.unallocatedOilTime = Math.max(
    (machine.unallocatedOilTime ?? 0) - burned,
    0,
  );
  machine.oilSettledAt = now;

  refreshCropMachineCaches({ machine, windows, now });
}

/**
 * Convert a LEGACY machine to the windowed model, in place — one-shot and
 * idempotent (keys off `oilSettledAt`). Freeze-and-forward at 1×: each
 * non-ready pack's remaining schedule becomes `baseDurationMs` work, and the
 * oil the legacy allocator had EARMARKED for its future growth is reclaimed
 * into the tank (on a windowed machine fuel carries no earmarks). With no
 * active windows the resolved 1× timeline reproduces the legacy
 * `readyAt`/`growsUntil` schedule exactly — the reclamation is what makes that
 * identity hold, and it is the guard against minting or burning oil.
 *
 * Runs on load for flagged players (BE `migrateSpeedBoosts`) and defensively
 * at the top of every crop-machine event (a mid-session flag flip would
 * otherwise hit an unconverted machine); events replay on the BE with the same
 * `createdAt`, so both sides convert identically. Ready packs are skipped and
 * kept as legacy completed history — they gain nothing from windowing and
 * freezing them would move a past `readyAt` forward.
 */
export function convertCropMachineToWindowed({
  machine,
  windows,
  now,
}: {
  machine: CropMachineBuilding;
  /**
   * The CURRENT crop-machine boost windows — used only to refresh the caches
   * so they reflect the derived timeline (an active shrine speeds the frozen
   * remainders from `now` onward). The conversion arithmetic itself is pure 1×
   * legacy bookkeeping and never reads them.
   */
  windows: BoostWindow[];
  now: number;
}): void {
  if (machine.oilSettledAt !== undefined) return;

  const queue = machine.queue ?? [];
  let reclaimed = 0;

  for (const pack of queue) {
    // Ready: completed legacy history, skip.
    if (pack.readyAt !== undefined && pack.readyAt <= now) continue;

    // A pack scheduled to start in the future anchors its remaining schedule
    // at that start; one already growing anchors at `now`.
    const from = Math.max(now, pack.startTime ?? now);

    if (pack.readyAt !== undefined) {
      // Fully allocated: the legacy allocator earmarked its whole remaining
      // growth. Reclaim it; the resolver re-projects the same finish at 1×.
      const remaining = pack.readyAt - from;
      pack.baseDurationMs = remaining;
      reclaimed += remaining;
      delete pack.readyAt;
    } else if (pack.growsUntil !== undefined && pack.growsUntil > now) {
      // Partially allocated: earmarked up to `growsUntil`, with
      // `growTimeRemaining` unfunded beyond it.
      const earmark = pack.growsUntil - from;
      pack.baseDurationMs = pack.growTimeRemaining + earmark;
      reclaimed += earmark;
      delete pack.growsUntil;
    } else {
      // Stalled (its allocation already burned away) or never started:
      // nothing to reclaim, the unfunded work is the work.
      pack.baseDurationMs = pack.growTimeRemaining;
      delete pack.growsUntil;
    }

    delete pack.pausedTimeRemaining;
  }

  machine.unallocatedOilTime = (machine.unallocatedOilTime ?? 0) + reclaimed;
  machine.oilSettledAt = now;

  refreshCropMachineCaches({ machine, windows, now });
}
