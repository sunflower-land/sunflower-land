import { useMemo } from "react";
import { CraftingQueueItem, GameState } from "features/game/types/game";
import { useNow } from "lib/utils/hooks/useNow";

const DEFAULT_QUEUE_ITEM: CraftingQueueItem = {
  id: "",
  name: "Doll",
  readyAt: 0,
  startedAt: 0,
  type: "collectible",
};

export function useCraftingQueue(craftingBox: GameState["craftingBox"]) {
  const { status: craftingStatus, queue: rawQueue } = craftingBox;

  const craftingQueue: CraftingQueueItem[] = useMemo(
    () => rawQueue ?? [],
    [rawQueue],
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

  return {
    craftingQueue,
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
