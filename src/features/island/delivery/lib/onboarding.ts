import type { GameState } from "features/game/types/game";
import {
  getAscensionLevel,
  meetsLevelRequirement,
} from "features/game/lib/level";
import { TUTORIAL_PLOT_COUNT } from "features/island/plots/lib/tutorialPlots";

/**
 * Shared onboarding predicates for the tutorial island's first delivery,
 * kept in one place like the Market and Workbench do
 * (market/lib/onboarding.ts, workBench/lib/onboarding.ts).
 *
 * Deliveries are the primary coin loop and the first one is the new player's
 * first coin task: harvest the 9 preloaded Sunflowers, then take them to
 * Betty at the Pumpkin Plaza.
 */

const hasHarvestedTutorialSunflowers = (game: GameState): boolean =>
  (game.farmActivity?.["Sunflower Harvested"] ?? 0) >= TUTORIAL_PLOT_COUNT;

/**
 * Nudge a new player towards their first delivery: they are on the tutorial
 * island, have harvested the preloaded Sunflowers and have never fulfilled
 * a delivery.
 */
export const needsFirstDelivery = (game: GameState): boolean =>
  game.island.type === "basic" &&
  hasHarvestedTutorialSunflowers(game) &&
  (game.delivery.fulfilledCount ?? 0) === 0;

/** Whether the player has ever fulfilled a delivery, from any NPC. */
export const hasFulfilledFirstDelivery = (game: GameState): boolean =>
  (game.delivery.fulfilledCount ?? 0) >= 1;

/**
 * The Plaza opens at level 2, or early for a tutorial player whose Sunflowers
 * are ready to deliver. Keyed on the harvest rather than the delivery so the
 * Plaza never re-locks once a level-1 player has been.
 */
export const hasPlazaAccess = (game: GameState): boolean =>
  meetsLevelRequirement(
    getAscensionLevel({
      experience: game.bumpkin.experience ?? 0,
      ascensionLevel: game.island.ascensionLevel ?? 0,
    }),
    { ascension: 0, level: 2 },
  ) ||
  (game.island.type === "basic" && hasHarvestedTutorialSunflowers(game));
