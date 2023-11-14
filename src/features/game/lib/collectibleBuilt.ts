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

/**
 * Useful for collectibles which expire after X time
 * Currently we only support Time Warp Totem
 */
export function isCollectibleActive(
  name: CollectibleName,
  collectible: Collectibles
) {
  if (!collectible[name]) {
    return false;
  }

  // Expires after 2 hours
  return collectible[name]?.some(
    (placed) => placed.createdAt + 2 * 60 * 60 * 1000 > Date.now()
  );
}
