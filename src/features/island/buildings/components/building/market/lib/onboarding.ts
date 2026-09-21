import type { GameState } from "features/game/types/game";
import { CROPS } from "features/game/types/crops";
import { getKeys } from "lib/object";

/**
 * Shared onboarding predicates for Betty's market, kept in one place so the
 * default market tab and the Sell button helper stay in sync (the Workbench
 * does the same in workBench/lib/onboarding.ts).
 */

/**
 * Nudge a new player to sell their first Sunflowers: they are on the tutorial
 * island, are holding Sunflowers and have never sold a crop.
 */
export const needsFirstCropSale = (game: GameState): boolean => {
  if (game.island.type !== "basic") return false;

  const hasSunflowers = game.inventory.Sunflower?.greaterThan(0) ?? false;
  if (!hasSunflowers) return false;

  const hasSoldCrops = getKeys(CROPS).some(
    (crop) => (game.farmActivity?.[`${crop} Sold`] ?? 0) > 0,
  );

  return !hasSoldCrops;
};

/** Whether the player has ever bought a crop seed from Betty. */
export const hasBoughtCropSeeds = (game: GameState): boolean =>
  getKeys(CROPS).some(
    (crop) => (game.farmActivity?.[`${crop} Seed Bought`] ?? 0) > 0,
  );

/**
 * The tutorial island's first seed purchase, which is Betty's cue to send the
 * player back to their plots.
 */
export const isFirstSeedPurchase = (game: GameState): boolean =>
  game.island.type === "basic" && !hasBoughtCropSeeds(game);

/**
 * Nudge a new player to buy their first seeds: they are on the tutorial island,
 * have sold a crop and have never bought a crop seed.
 */
export const needsFirstSeedPurchase = (game: GameState): boolean => {
  if (!isFirstSeedPurchase(game)) return false;

  return getKeys(CROPS).some(
    (crop) => (game.farmActivity?.[`${crop} Sold`] ?? 0) > 0,
  );
};
