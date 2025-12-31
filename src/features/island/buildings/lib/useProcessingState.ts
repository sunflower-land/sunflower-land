import { useMemo } from "react";

import { BuildingProduct } from "features/game/types/game";
import { useQueueState } from "./useQueueState";

export function useProcessingState(building: {
  processing?: BuildingProduct[];
}) {
  const processing = useMemo(
    () => building.processing ?? [],
    [building.processing],
  );

  const { active, queued, ready, nextChangeAt } = useQueueState(processing);

  return {
    processing: active,
    queued,
    ready,
    nextChangeAt,
  };
}
