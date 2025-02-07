import { useCallback, useLayoutEffect, useState } from "react";
import { BuildingProduct } from "features/game/types/game";
import { useTimeout } from "lib/utils/hooks/useTimeout";

export function useCookingState(building: { crafting?: BuildingProduct[] }) {
  const [cooking, setCooking] = useState<BuildingProduct | undefined>();
  const [queuedRecipes, setQueuedRecipes] = useState<BuildingProduct[]>([]);

  const getRecipeBeingCooked = useCallback(() => {
    const crafting = building?.crafting?.find(
      (recipe) => recipe.readyAt > Date.now(),
    );

    setCooking(crafting);
  }, [building]);

  const getQueue = useCallback(() => {
    const queue = building?.crafting?.filter(
      (recipe) =>
        recipe.readyAt > Date.now() && recipe.readyAt !== cooking?.readyAt,
    );

    setQueuedRecipes(queue ?? []);
  }, [building, cooking]);

  useLayoutEffect(() => {
    getRecipeBeingCooked();
    getQueue();
  }, [building, getRecipeBeingCooked, getQueue]);

  const readyRecipes =
    building?.crafting?.filter((recipe) => recipe.readyAt <= Date.now()) ?? [];

  useTimeout(
    getRecipeBeingCooked,
    cooking?.readyAt ? Math.max(0, cooking.readyAt - Date.now()) : null,
  );

  return {
    cooking,
    queuedRecipes,
    readyRecipes,
  };
}
