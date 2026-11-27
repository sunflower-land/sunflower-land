import type { GameState } from "features/game/types/game";
import { CROPS } from "features/game/types/crops";
import { getKeys } from "lib/object";
import {
  getTotalCropsPlanted,
  hasEmptyPlot,
  holdsCropSeeds,
  TUTORIAL_PLOT_COUNT,
} from "features/island/plots/lib/tutorialPlots";

/**
 * Shared onboarding predicates for Betty's market, kept in one place so the
 * default market tab and the buy helpers stay in sync (the Workbench does
 * the same in workBench/lib/onboarding.ts).
 *
 * The market's tutorial job is the free first Sunflower Seeds. There is
 * deliberately no sell lesson: deliveries are the coin loop the tutorial
 * teaches, and the market sell tab is left for players to discover on their
 * own.
 */

/** Whether the player has ever sold a crop to Betty. */
export const hasSoldAnyCrop = (game: GameState): boolean =>
  getKeys(CROPS).some((crop) => (game.farmActivity?.[`${crop} Sold`] ?? 0) > 0);

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
 * Nudge a tutorial player to Betty for Sunflower Seeds (the first batch is
 * free, see getFreeSunflowerSeedsLeft): their first plots are revealed and
 * empty, they hold no crop seeds and they have not yet grown the Sunflowers
 * for Peggy's first delivery. Also covers a player who runs out part-way.
 *
 * Farms whose first plots came preloaded with Sunflowers (before the plots
 * arrived empty) never match: their plots are full until they harvest, and
 * by then they have harvested the Sunflowers.
 */
export const needsFirstSeedPurchase = (game: GameState): boolean => {
  if (game.island.type !== "basic") return false;
  if (
    (game.farmActivity?.["Sunflower Harvested"] ?? 0) >= TUTORIAL_PLOT_COUNT
  ) {
    return false;
  }
  if (getTotalCropsPlanted(game) >= TUTORIAL_PLOT_COUNT) return false;
  if (holdsCropSeeds(game)) return false;
  if (!hasEmptyPlot(game)) return false;

  return Object.values(game.crops).every((plot) => !plot.crop);
};
