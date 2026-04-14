import { useMemo } from "react";

import { BuildingProduct } from "features/game/types/game";
import { useNow } from "lib/utils/hooks/useNow";

export type QueueState = {
  active?: BuildingProduct;
  queued: BuildingProduct[];
  ready: BuildingProduct[];
  nextChangeAt: number | null;
};

export function computeQueueState(
  queue: BuildingProduct[],
  now: number,
): QueueState {
  const active = queue.find((item) => item.readyAt > now);

  const queued = queue.filter(
    (item) => item.readyAt > now && item.readyAt !== active?.readyAt,
  );

  const ready = queue.filter((item) => item.readyAt <= now);

  const futureReadyTimes = queue
    .map((item) => item.readyAt)
    .filter((time) => time > now);

  const nextChangeAt =
    futureReadyTimes.length > 0 ? Math.min(...futureReadyTimes) : null;

  return {
    active,
    queued,
    ready,
    nextChangeAt,
  };
}

export function useQueueState(queue: BuildingProduct[] = []): QueueState {
  const items = useMemo(() => queue, [queue]);

  const lastReadyAt = useMemo(
    () =>
      items.length > 0
        ? Math.max(...items.map((item) => item.readyAt))
        : undefined,
    [items],
  );

  const now = useNow({
    live: lastReadyAt !== undefined,
    autoEndAt: lastReadyAt,
    intervalMs: 1000,
  });

  return useMemo(() => computeQueueState(items, now), [items, now]);
}
