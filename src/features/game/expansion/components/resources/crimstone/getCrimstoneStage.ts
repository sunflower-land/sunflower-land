import { CRIMSTONE_RECOVERY_TIME } from "features/game/lib/constants";

/**
 * Visual depletion stage (1-6) for a crimstone, derived from minesLeft + how long
 * it has been recovering. `now` is passed in (from the component clock) so this
 * stays a pure helper — no `Date.now()` in the render path.
 *
 * Kept in its own leaf module (rather than in Crimstone.tsx) to avoid an import
 * cycle: Crimstone.tsx imports its Recovered/Depleting/Depleted children, and each
 * of those imports this helper back.
 */
export const getCrimstoneStage = (
  minesLeft: number,
  minedAt: number,
  now: number,
) => {
  const timeToReset = (CRIMSTONE_RECOVERY_TIME + 24 * 60 * 60) * 1000;
  if (now - minedAt > timeToReset) {
    return 1;
  }

  if (minesLeft === 5 && now - minedAt < CRIMSTONE_RECOVERY_TIME * 1000)
    return 6;
  if (minesLeft === 5) return 1;
  if (minesLeft === 4) return 2;
  if (minesLeft === 3) return 3;
  if (minesLeft === 2) return 4;
  return 5;
};
