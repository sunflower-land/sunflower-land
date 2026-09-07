import { useContext, useMemo } from "react";
import { useSelector } from "@xstate/react";
import type { CraftingQueueItem, GameState } from "features/game/types/game";
import { useNow } from "lib/utils/hooks/useNow";
import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import {
  areBoostWindowsEqual,
  getCraftingBoostWindows,
} from "features/game/lib/boostWindows";
import {
  getCraftingBoxFreeAt,
  resolveCraftingQueueTimings,
} from "features/game/lib/craftingReadiness";

const DEFAULT_QUEUE_ITEM: CraftingQueueItem = {
  id: "",
  name: "Doll",
  readyAt: 0,
  type: "collectible",
};

const _craftingBoostWindows = (state: MachineState) =>
  getCraftingBoostWindows(state.context.state);

/**
 * The single place crafting timings are derived. Every consumer — the island
 * building, the modal, the queue slots — goes through this, so they cannot
 * disagree about when a craft is ready.
 *
 * Each craft's stored `readyAt` is only a cache of the boost windows; the derived
 * value is substituted here so nothing downstream has to know that.
 */
export function useCraftingQueue(craftingBox: GameState["craftingBox"]) {
  const { gameService } = useContext(Context);
  const { status: craftingStatus, queue: rawQueue } = craftingBox;

  // Recomputed from full state but only re-rendering when the windows actually
  // change, so an unrelated game update doesn't re-render the crafting box.
  const windows = useSelector(
    gameService,
    _craftingBoostWindows,
    areBoostWindowsEqual,
  );

  const queueItems: CraftingQueueItem[] = useMemo(
    () => rawQueue ?? [],
    [rawQueue],
  );

  const timings = useMemo(
    () => resolveCraftingQueueTimings({ queue: queueItems, windows }),
    [queueItems, windows],
  );

  const craftingQueue = useMemo(
    () =>
      // Preserve object identity where the derived time matches the cache, so
      // downstream memos only invalidate for crafts that actually moved.
      queueItems.map((item, index) =>
        timings[index].readyAt === item.readyAt
          ? item
          : { ...item, readyAt: timings[index].readyAt },
      ),
    [queueItems, timings],
  );

  const effectiveReadyAt =
    craftingQueue.length > 0
      ? Math.max(...craftingQueue.map((i) => i.readyAt))
      : 0;

  const needsLiveTime =
    craftingStatus === "crafting" &&
    effectiveReadyAt != null &&
    Number.isFinite(effectiveReadyAt);
  const now = useNow({
    live: needsLiveTime,
    autoEndAt: needsLiveTime ? effectiveReadyAt : undefined,
  });

  const inProgress = useMemo(
    () => craftingQueue.filter((item) => item.readyAt > now),
    [craftingQueue, now],
  );
  const cooking = inProgress[0];
  const queue = inProgress.slice(1);
  const readyProducts = useMemo(
    () => craftingQueue.filter((item) => item.readyAt <= now),
    [craftingQueue, now],
  );

  const liveDisplayItems = useMemo(
    () => [cooking, ...queue, ...readyProducts].filter(Boolean),
    [cooking, queue, readyProducts],
  );

  const defaultQueueItem: CraftingQueueItem =
    cooking ?? craftingQueue[0] ?? DEFAULT_QUEUE_ITEM;

  /** When a newly queued craft would start — the box-free time, or now. */
  const boxFreeAt = getCraftingBoxFreeAt({ queue: queueItems, windows });

  return {
    craftingQueue,
    timings,
    windows,
    boxFreeAt,
    inProgress,
    cooking,
    queue,
    readyProducts,
    liveDisplayItems,
    defaultQueueItem,
    effectiveReadyAt,
    craftingReadyAt: effectiveReadyAt,
    craftingStatus,
    now,
  };
}
