import { HourglassType } from "features/island/collectibles/components/Hourglass";
import { CollectibleName, getKeys } from "../types/craftables";
import { GameState } from "../types/game";
import { PET_SHRINES, PetShrineName } from "../types/pets";

export function isCollectibleBuilt({
  name,
  game,
}: {
  name: CollectibleName;
  game: GameState;
}) {
  const placedOnFarm =
    game.collectibles[name] &&
    game.collectibles[name]?.some(
      (placed) => (placed.readyAt ?? 0) <= Date.now() && placed.coordinates,
    );

  const placedInHome =
    game.home.collectibles[name] &&
    game.home.collectibles[name]?.some(
      (placed) => (placed.readyAt ?? 0) <= Date.now() && placed.coordinates,
    );

  return !!placedOnFarm || !!placedInHome;
}

export type TemporaryCollectibleName = Extract<
  CollectibleName,
  | "Time Warp Totem"
  | HourglassType
  | "Super Totem"
  | "Obsidian Shrine"
  | PetShrineName
>;

export const EXPIRY_COOLDOWNS: Record<TemporaryCollectibleName, number> = {
  "Time Warp Totem": 2 * 60 * 60 * 1000,
  "Gourmet Hourglass": 4 * 60 * 60 * 1000,
  "Harvest Hourglass": 6 * 60 * 60 * 1000,
  "Timber Hourglass": 4 * 60 * 60 * 1000,
  "Ore Hourglass": 3 * 60 * 60 * 1000,
  "Orchard Hourglass": 6 * 60 * 60 * 1000,
  "Blossom Hourglass": 4 * 60 * 60 * 1000,
  "Fisher's Hourglass": 4 * 60 * 60 * 1000,
  "Super Totem": 7 * 24 * 60 * 60 * 1000,
  // All pet shrines have 7 day cooldown
  ...getKeys(PET_SHRINES).reduce(
    (acc, key) => {
      acc[key] = 7 * 24 * 60 * 60 * 1000;
      return acc;
    },
    {} as Record<PetShrineName, number>,
  ),

  // The following will replace the times set above for the following shrines
  "Legendary Shrine": 24 * 60 * 60 * 1000,
  "Obsidian Shrine": 14 * 24 * 60 * 60 * 1000,
  "Trading Shrine": 30 * 24 * 60 * 60 * 1000,
};

/**
 * Useful for collectibles which expire after X time
 * Currently we only support Time Warp Totem
 */
export function isTemporaryCollectibleActive({
  name,
  game,
}: {
  name: TemporaryCollectibleName;
  game: GameState;
}) {
  const cooldown = EXPIRY_COOLDOWNS[name];

  const placedOnFarm =
    game.collectibles[name] &&
    game.collectibles[name]?.some(
      (placed) => (placed.createdAt ?? 0) + cooldown > Date.now(),
    );

  const placedInHome =
    game.home.collectibles[name] &&
    game.home.collectibles[name]?.some(
      (placed) => (placed.createdAt ?? 0) + cooldown > Date.now(),
    );

  return !!placedOnFarm || !!placedInHome;
}
