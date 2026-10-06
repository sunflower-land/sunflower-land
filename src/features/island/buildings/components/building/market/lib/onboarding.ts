import type { GameState } from "features/game/types/game";
import { CROPS } from "features/game/types/crops";
import { getKeys } from "lib/object";
import {
  getAscensionLevel,
  meetsLevelRequirement,
} from "features/game/lib/level";
import { hasFulfilledFirstDelivery } from "features/island/delivery/lib/onboarding";

/**
 * Shared onboarding predicates for Betty's market, kept in one place so the
 * default market tab and the Sell button helper stay in sync (the Workbench
 * does the same in workBench/lib/onboarding.ts).
 */

/** Whether the player has ever sold a crop to Betty. */
const hasSoldAnyCrop = (game: GameState): boolean =>
  getKeys(CROPS).some((crop) => (game.farmActivity?.[`${crop} Sold`] ?? 0) > 0);

const hasLevelTwo = (game: GameState): boolean =>
  meetsLevelRequirement(
    getAscensionLevel({
      experience: game.bumpkin.experience ?? 0,
      ascensionLevel: game.island.ascensionLevel ?? 0,
    }),
    { ascension: 0, level: 2 },
  );

/**
 * The one-off sell lesson: a small side income shown once deliveries - the
 * primary coin loop - have been learned. The delivery term also stops a new
 * player selling the 9 tutorial Sunflowers their first order asks for; the
 * never-sold term makes the lesson one-shot.
 */
export const needsFirstCropSale = (game: GameState): boolean => {
  if (game.island.type !== "basic") return false;
  if (!hasFulfilledFirstDelivery(game)) return false;
  if (!hasLevelTwo(game)) return false;
  // Deliveries own the level-2 guidance until the Stone expansion is done -
  // Pete points at them and the mining instead (see TravelTeaser)
  if ((game.inventory["Basic Land"]?.toNumber() ?? 3) < 6) return false;

  const hasCrops = getKeys(CROPS).some((crop) =>
    game.inventory[crop]?.greaterThan(0),
  );
  if (!hasCrops) return false;

  return !hasSoldAnyCrop(game);
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
 * have fulfilled their first delivery (or, for farms from before deliveries
 * led the tutorial, sold a crop) and have never bought a crop seed.
 */
export const needsFirstSeedPurchase = (game: GameState): boolean => {
  if (!isFirstSeedPurchase(game)) return false;

  return hasFulfilledFirstDelivery(game) || hasSoldAnyCrop(game);
};
