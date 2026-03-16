import { GameState } from "../types/game";
import { RecipeCollectibleName } from "./crafting";
import { BumpkinItem } from "../types/bumpkin";

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
