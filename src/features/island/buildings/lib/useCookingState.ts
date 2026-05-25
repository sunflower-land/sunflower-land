import { useMemo } from "react";

import type { BuildingProduct } from "features/game/types/game";
import { useQueueState } from "./useQueueState";

export function useCookingState(building: { crafting?: BuildingProduct[] }) {
  const crafting = useMemo(() => building.crafting ?? [], [building.crafting]);

  const { active, queued, ready, nextChangeAt } = useQueueState(crafting);

  return {
    cooking: active,
    queuedRecipes: queued,
    readyRecipes: ready,
    nextChangeAt,
  };
}
