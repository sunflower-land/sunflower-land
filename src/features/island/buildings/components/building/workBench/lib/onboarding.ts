import type { GameState } from "features/game/types/game";
import { INITIAL_SUPPORTED_PLOTS } from "features/game/events/landExpansion/plant";
import { getKeys } from "lib/object";
import {
  getFreeAxesLeft,
  TUTORIAL_FREE_AXES,
} from "features/game/events/landExpansion/craftTool";
import {
  getTotalCropsPlanted,
  TUTORIAL_PLOT_COUNT,
} from "features/island/plots/lib/tutorialPlots";

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
 * replanted their first field - the same moment the blacksmith's popup fires,
 * so the hand on the Workbench never appears before anyone has mentioned it.
 */
export const needsBasicScarecrow = (game: GameState): boolean => {
  const hasBasicScarecrow =
    game.inventory["Basic Scarecrow"]?.greaterThanOrEqualTo(1) ?? false;

  return (
    !hasBasicScarecrow && getTotalCropsPlanted(game) >= TUTORIAL_PLOT_COUNT
  );
};

/** A new player's first task: claim their free Axes before chopping a tree. */
export const TUTORIAL_AXE_COUNT = TUTORIAL_FREE_AXES;

/**
 * Nudge a brand new player to pick up their free Axes: they are on the
 * tutorial island, still have free Axes to claim, do not yet hold a full batch
 * and have not chopped a tree.
 */
export const needsFirstAxes = (game: GameState): boolean => {
  if ((game.farmActivity?.["Tree Chopped"] ?? 0) > 0) return false;
  if (game.inventory.Axe?.greaterThanOrEqualTo(TUTORIAL_AXE_COUNT)) {
    return false;
  }

  return getFreeAxesLeft(game) > 0;
};

/**
 * Whether placing this item is the tutorial's first Basic Scarecrow going down,
 * which is Pete's cue to send the player off to expand again. Read from the
 * state before the placement. Limited to players who have not expanded past
 * their first crops, so the advice is never stale.
 */
export const isPlacingFirstScarecrow = (
  game: GameState,
  placeableName: string,
): boolean => {
  if (placeableName !== "Basic Scarecrow") return false;
  if (game.island.type !== "basic") return false;
  if (game.collectibles["Basic Scarecrow"]?.length) return false;

  return game.inventory["Basic Land"]?.lessThanOrEqualTo(4) ?? false;
};
