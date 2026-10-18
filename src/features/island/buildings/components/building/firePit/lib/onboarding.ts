import type { GameState } from "features/game/types/game";
import { isHarvestingFirstRhubarb } from "features/island/plots/lib/tutorialPlots";

/** The tutorial's first meal. */
export const TUTORIAL_RECIPE = "Rhubarb Tart";

/**
 * Nudge a new player to cook their first Rhubarb Tart. Kept in one place so the
 * arrow on the Fire Pit, the recipe the Fire Pit opens on and the Cook button
 * helper stay in sync (the Workbench and Betty's market do the same).
 *
 * Waits for the Rhubarb harvest walk to finish so the farm never shows two
 * arrows at once.
 */
export const needsFirstCook = (game: GameState): boolean => {
  if (game.island.type !== "basic") return false;
  if ((game.bumpkin.experience ?? 0) > 0) return false;
  if (game.farmActivity?.["Rhubarb Tart Cooked"]) return false;
  if (isHarvestingFirstRhubarb(game)) return false;

  return game.inventory.Rhubarb?.greaterThanOrEqualTo(3) ?? false;
};

/**
 * Whether the recipe on the fire is a new player's very first Rhubarb Tart,
 * which is when Bruce mentions that a Gem can finish it early. Never eaten
 * anything, exactly one tart ever started, tutorial island only.
 */
export const isCookingFirstTart = (
  game: GameState,
  productName: string,
): boolean =>
  productName === TUTORIAL_RECIPE &&
  game.island.type === "basic" &&
  (game.bumpkin.experience ?? 0) === 0 &&
  game.farmActivity?.["Rhubarb Tart Cooked"] === 1;

/**
 * Whether a collect just put a new player's first Rhubarb Tart in their hands,
 * which is Bruce's cue to tell them to eat it. Compares the farm before and
 * after, so it fires once and only when a tart actually arrived.
 */
export const hasCollectedFirstTart = (
  before: GameState,
  after: GameState,
): boolean =>
  before.island.type === "basic" &&
  (before.bumpkin.experience ?? 0) === 0 &&
  !before.inventory[TUTORIAL_RECIPE]?.greaterThan(0) &&
  (after.inventory[TUTORIAL_RECIPE]?.greaterThan(0) ?? false);
