import { CollectibleName } from "../types/craftables";
import { Collectibles } from "../types/game";

export function isCollectibleBuilt(
  name: CollectibleName,
  collectible: Collectibles
) {
  return (
    collectible[name] &&
    collectible[name]?.some((placed) => placed.readyAt < Date.now())
  );
}
