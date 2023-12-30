import { CollectibleName } from "../types/craftables";
import { Collectibles, GameState } from "../types/game";

export function isCollectibleBuilt({
  name,
  game,
}: {
  name: CollectibleName;
  game: GameState;
}) {
  const placedOnFarm =
    game.collectibles[name] &&
    game.collectibles[name]?.some((placed) => placed.readyAt < Date.now());

  const placedInHome =
    game.home.collectibles[name] &&
    game.home.collectibles[name]?.some((placed) => placed.readyAt < Date.now());

  return placedOnFarm || placedInHome;
}

/**
 * Useful for collectibles which expire after X time
 * Currently we only support Time Warp Totem
 */
export function isCollectibleActive({
  name,
  game,
}: {
  name: CollectibleName;
  game: GameState;
}) {
  if (!game.collectibles[name]) {
    return false;
  }

  // Expires after 2 hours
  return game.collectibles[name]?.some(
    (placed) => placed.createdAt + 2 * 60 * 60 * 1000 > Date.now()
  );
}
