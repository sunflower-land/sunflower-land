import type { GameState } from "../types/game";
import type { RecipeCollectibleName } from "./crafting";
import type { BumpkinItem } from "../types/bumpkin";

export function getCraftingBoxCurrent(box: GameState["craftingBox"]) {
  const first = box?.queue?.[0];
  if (!first) return { item: undefined } as const;
  return {
    item:
      first.type === "collectible"
        ? { collectible: first.name as RecipeCollectibleName }
        : { wearable: first.name as BumpkinItem },
  };
}
