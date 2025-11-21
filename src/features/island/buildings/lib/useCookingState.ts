import { useEffect, useState } from "react";
import { BuildingProduct } from "features/game/types/game";

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
  const [now, setNow] = useState(() => Date.now());

  const { cooking, queuedRecipes, readyRecipes, nextChangeAt } =
    computeCookingState(building.crafting ?? [], now);

  useEffect(() => {
    if (!nextChangeAt) return;

    const timeTillReady = Math.max(nextChangeAt - Date.now(), 0);
    // Schedule a timeout to fire when the current item cooking is ready
    const id = setTimeout(() => {
      setNow(Date.now());
    }, timeTillReady);

    return () => clearTimeout(id);
  }, [nextChangeAt]);

  return {
    cooking,
    queuedRecipes,
    readyRecipes,
  };
}
