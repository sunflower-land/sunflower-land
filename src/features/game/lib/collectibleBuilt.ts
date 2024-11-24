import { CollectibleName } from "../types/craftables";
import { GameState } from "../types/game";

export function isCollectibleBuilt({
  name,
  game,
}: {
  name: CollectibleName;
  game: GameState;
}) {
  const placedOnFarm =
    game.collectibles[name] &&
    game.collectibles[name]?.some((placed) => placed.readyAt <= Date.now());

  const placedInHome =
    game.home.collectibles[name] &&
    game.home.collectibles[name]?.some(
      (placed) => placed.readyAt <= Date.now(),
    );

  return !!placedOnFarm || !!placedInHome;
}

export const EXPIRY_COOLDOWNS: Partial<Record<CollectibleName, number>> = {
  "Time Warp Totem": 2 * 60 * 60 * 1000,
  "Gourmet Hourglass": 4 * 60 * 60 * 1000,
  "Harvest Hourglass": 6 * 60 * 60 * 1000,
  "Timber Hourglass": 4 * 60 * 60 * 1000,
  "Ore Hourglass": 3 * 60 * 60 * 1000,
  "Orchard Hourglass": 6 * 60 * 60 * 1000,
  "Blossom Hourglass": 4 * 60 * 60 * 1000,
  "Fisher's Hourglass": 4 * 60 * 60 * 1000,
  "Super Totem": 7 * 24 * 60 * 60 * 1000,
};

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
  const cooldown = EXPIRY_COOLDOWNS[name] ?? 0;

  const placedOnFarm =
    game.collectibles[name] &&
    game.collectibles[name]?.some(
      (placed) => placed.createdAt + cooldown > Date.now(),
    );

  const placedInHome =
    game.home.collectibles[name] &&
    game.home.collectibles[name]?.some(
      (placed) => placed.createdAt + cooldown > Date.now(),
    );

  return !!placedOnFarm || !!placedInHome;
}
