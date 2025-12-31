import { useMemo } from "react";

import { BuildingProduct } from "features/game/types/game";
import { useNow } from "lib/utils/hooks/useNow";

function computeProcessingState(processing: BuildingProduct[], now: number) {
  const active = processing.find((item) => item.readyAt > now);

  const queued = processing.filter(
    (item) => item.readyAt > now && item.readyAt !== active?.readyAt,
  );

  const ready = processing.filter((item) => item.readyAt <= now);

  const futureReadyTimes = processing
    .map((item) => item.readyAt)
    .filter((t) => t > now);

  const nextChangeAt =
    futureReadyTimes.length > 0 ? Math.min(...futureReadyTimes) : null;

  return {
    active,
    queued,
    ready,
    nextChangeAt,
  };
}

export function useProcessingState(building: {
  processing?: BuildingProduct[];
}) {
  const processing = useMemo(
    () => building.processing ?? [],
    [building.processing],
  );

  const lastReadyAt = useMemo(
    () =>
      processing.length > 0
        ? Math.max(...processing.map((item) => item.readyAt))
        : undefined,
    [processing],
  );

  const now = useNow({
    live: lastReadyAt !== undefined,
    autoEndAt: lastReadyAt,
    intervalMs: 1000,
  });

  const { active, queued, ready } = useMemo(
    () => computeProcessingState(processing, now),
    [processing, now],
  );

  return {
    processing: active,
    queued,
    ready,
  };
}
