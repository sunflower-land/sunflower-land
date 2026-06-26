import type { GameState } from "features/game/types/game";
import { INITIAL_SUPPORTED_PLOTS } from "features/game/events/landExpansion/plant";
import { getKeys } from "lib/object";

/**
 * Shared onboarding predicates for the Workbench. Kept in one place so the
 * helper arrow on the Workbench building, the default Workbench modal tab, and
 * the Craft-button helper all stay in sync.
 */

/**
 * Nudge the player towards building a Water Well only once they have outgrown
 * the no-well plot limit, i.e. one or more crop plots have become infertile.
 * This avoids showing the helper at the very start of the tutorial.
 */
export const needsWaterWell = (game: GameState): boolean => {
  const { buildings, crops, island } = game;

  const hasWell =
    buildings["Water Well"]?.some((w) => !!w.coordinates) ?? false;
  if (hasWell) return false;

  const placedPlots = getKeys(crops).filter(
    (id) => crops[id].x !== undefined && crops[id].y !== undefined,
  ).length;

  return placedPlots > INITIAL_SUPPORTED_PLOTS(island.type);
};

/**
 * Nudge the player towards crafting their first Basic Scarecrow once they have
 * planted enough sunflowers to need one.
 */
export const needsBasicScarecrow = (game: GameState): boolean => {
  const hasBasicScarecrow =
    game.inventory["Basic Scarecrow"]?.greaterThanOrEqualTo(1) ?? false;

  return (
    !hasBasicScarecrow && (game.farmActivity?.["Sunflower Planted"] ?? 0) >= 6
  );
};
