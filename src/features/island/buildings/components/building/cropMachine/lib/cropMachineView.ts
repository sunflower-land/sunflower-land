import { useContext, useMemo } from "react";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import type {
  CropMachineBuilding,
  CropMachineQueueItem,
} from "features/game/types/game";
import {
  areBoostWindowsEqual,
  getCropMachineBoostWindows,
  type BoostWindow,
} from "features/game/lib/boostWindows";
import {
  getCropMachineFuelAt,
  getCropMachinePackProgress,
  getCropMachineSpeedAt,
  resolveCropMachine,
} from "features/game/lib/cropMachineReadiness";

export type CropMachineView = {
  /**
   * The queue the UI should render. On a windowed machine every still-growing
   * pack has its `startTime`/`readyAt`/`growsUntil`/`growTimeRemaining`
   * substituted with the DERIVED values (the stored ones are caches refreshed
   * only on events, so a Tortoise Shrine placed since would leave them stale);
   * a legacy machine's queue passes through untouched. Identity-preserving:
   * a pack whose derived values match its stored ones keeps its object.
   */
  queue: CropMachineQueueItem[];
  /** Whether this machine is on the windowed model (`oilSettledAt` set). */
  windowed: boolean;
  windows: BoostWindow[];
};

/**
 * Substitute a windowed machine's derived timings into its queue for display.
 *
 * The synthesized fields keep the LEGACY semantics every consumer already
 * expects (the xstate stage machine, `isCropPackReady`, the modal's
 * remove-button gate, `calculateCropProgress`):
 *  - `startTime` — the pack's true first start where one was stamped, else the
 *    derived (possibly projected) start; a stamped start is never later than
 *    the derived one, so `min` picks it.
 *  - `readyAt` / `growsUntil` — the derived finish / fuel-out instants. A pack
 *    that has begun but has no fuel left at all gets `growsUntil` pinned to the
 *    fuel anchor so it reads as PAUSED (mirrors a legacy stalled pack keeping
 *    its past `growsUntil`) rather than never-started.
 *  - `growTimeRemaining` — unfunded work, exactly the legacy meaning.
 */
export function getResolvedCropMachineQueue(
  machine: CropMachineBuilding,
  windows: BoostWindow[],
): CropMachineQueueItem[] {
  const queue = machine.queue ?? [];
  if (machine.oilSettledAt === undefined) return queue;

  const { packs } = resolveCropMachine({ machine, windows });

  return queue.map((pack, index) => {
    if (pack.baseDurationMs === undefined) return pack;

    const timing = packs[index];

    const startTime =
      timing.startsAt !== undefined
        ? pack.startTime !== undefined
          ? Math.min(pack.startTime, timing.startsAt)
          : timing.startsAt
        : pack.startTime;

    const hasBegun =
      startTime !== undefined && startTime <= (machine.oilSettledAt ?? 0);
    const growsUntil =
      timing.growsUntil ??
      (timing.readyAt === undefined && hasBegun
        ? machine.oilSettledAt
        : undefined);

    const resolved: CropMachineQueueItem = {
      ...pack,
      startTime,
      readyAt: timing.readyAt,
      growsUntil,
      growTimeRemaining: timing.workRemainingMs,
    };
    if (resolved.startTime === undefined) delete resolved.startTime;
    if (resolved.readyAt === undefined) delete resolved.readyAt;
    if (resolved.growsUntil === undefined) delete resolved.growsUntil;

    const unchanged =
      resolved.startTime === pack.startTime &&
      resolved.readyAt === pack.readyAt &&
      resolved.growsUntil === pack.growsUntil &&
      resolved.growTimeRemaining === pack.growTimeRemaining;

    return unchanged ? pack : resolved;
  });
}

const _windows = (state: MachineState) =>
  getCropMachineBoostWindows(state.context.state);

/**
 * The crop machine's display view: the resolved queue plus the boost windows
 * that shaped it. Legacy machines pass through with empty windows.
 */
export function useCropMachineView(
  machine: CropMachineBuilding | undefined,
): CropMachineView {
  const { gameService } = useContext(Context);
  const windows = useSelector(gameService, _windows, areBoostWindowsEqual);

  return useMemo(() => {
    if (!machine || machine.oilSettledAt === undefined) {
      // Legacy machine: stored queue as-is. The windows still come along —
      // the modal's pre-action preview needs them for a flagged player whose
      // machine converts on its next supply.
      return { queue: machine?.queue ?? [], windowed: false, windows };
    }
    return {
      queue: getResolvedCropMachineQueue(machine, windows),
      windowed: true,
      windows,
    };
  }, [machine, windows]);
}

export {
  getCropMachineFuelAt,
  getCropMachinePackProgress,
  getCropMachineSpeedAt,
};
