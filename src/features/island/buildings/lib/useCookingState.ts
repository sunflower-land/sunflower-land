import { useMemo } from "react";
import { BuildingProduct } from "features/game/types/game";
import { useNow } from "lib/utils/hooks/useNow";

function computeCookingState(crafting: BuildingProduct[], now: number) {
  const cooking = crafting.find((recipe) => recipe.readyAt > now);

  const queuedRecipes = crafting.filter(
    (recipe) => recipe.readyAt > now && recipe.readyAt !== cooking?.readyAt,
  );

  const readyRecipes = crafting.filter((recipe) => recipe.readyAt <= now);

  const futureReadyTimes = crafting
    .map((recipe) => recipe.readyAt)
    .filter((t) => t > now);

  const nextChangeAt =
    futureReadyTimes.length > 0 ? Math.min(...futureReadyTimes) : null;

  return {
    cooking,
    queuedRecipes,
    readyRecipes,
    nextChangeAt,
  };
}

export function useCookingState(building: { crafting?: BuildingProduct[] }) {
  const crafting = useMemo(() => building.crafting ?? [], [building.crafting]);

  // Find the last time anything in this building will change readiness
  const lastReadyAt = useMemo(
    () =>
      crafting.length > 0
        ? Math.max(...crafting.map((recipe) => recipe.readyAt))
        : undefined,
    [crafting],
  );

  // `useNow` gives us a monotonic clock as React state.
  // We keep it "live" only while there is something in the queue.
  const now = useNow({
    live: lastReadyAt !== undefined,
    autoEndAt: lastReadyAt,
    intervalMs: 1000, // tweak if you want snappier updates
  });

  const { cooking, queuedRecipes, readyRecipes } = useMemo(
    () => computeCookingState(crafting, now),
    [crafting, now],
  );

  return {
    cooking,
    queuedRecipes,
    readyRecipes,
  };
}
