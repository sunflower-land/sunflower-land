import type { CollectibleName } from "../types/craftables";
import type { Collectibles } from "../types/game";

/**
 * Every instance of a collectible gathered from the four collectible surfaces:
 * farm, home, interior ground and interior level_one. The pet house is excluded
 * (it stores pets, keyed by PetName). Instances are returned as-is — callers
 * filter by `coordinates` / `readyAt` / `createdAt` as needed.
 *
 * Lives in its own module with only type imports so low-level files such as
 * `types/beds` can reuse it without creating an import cycle.
 */
export function getCollectiblesAcrossLocations<N extends CollectibleName>(
  game: {
    collectibles: Collectibles;
    home: { collectibles: Collectibles };
    interior?: {
      ground: { collectibles: Collectibles };
      level_one?: { collectibles: Collectibles };
    };
  },
  name: N,
): NonNullable<Collectibles[N]> {
  return [
    ...(game.collectibles[name] ?? []),
    ...(game.home.collectibles[name] ?? []),
    ...(game.interior?.ground.collectibles[name] ?? []),
    ...(game.interior?.level_one?.collectibles[name] ?? []),
  ] as NonNullable<Collectibles[N]>;
}
