import { CRIMSTONE_RECOVERY_TIME } from "features/game/lib/constants";

/**
 * When an unmined crimstone resets to a fresh stage 1. Mirrors `mineCrimstone`,
 * which resets `minesLeft` once `createdAt - minedAt` passes the base recovery
 * plus 24h, whatever boost shortened the recovery.
 */
export const getCrimstoneResetAt = (minedAt: number) =>
  minedAt + (CRIMSTONE_RECOVERY_TIME + 24 * 60 * 60) * 1000;

/**
 * Visual depletion stage (1-6) for a crimstone, derived from minesLeft + whether
 * it is still recovering. `now` and `readyAt` are passed in (from the component
 * clock / live windowed ready time) so this stays a pure helper — no `Date.now()`
 * in the render path.
 *
 * `readyAt` is the ACTUAL (windowed) ready time, not `minedAt + base recovery`: a
 * boosted rock (e.g. Mole Shrine) recovers early, so keying the freshly-mined
 * stage 6 off `now < readyAt` keeps the Recovered view from ever requesting stage
 * 6 and over-indexing its 5-frame sprite array. For legacy rocks
 * `readyAt === minedAt + base recovery`, so behaviour is unchanged.
 *
 * Kept in its own leaf module (rather than in Crimstone.tsx) to avoid an import
 * cycle: Crimstone.tsx imports its Recovered/Depleting/Depleted children, and each
 * of those imports this helper back.
 */
export const getCrimstoneStage = (
  minesLeft: number,
  now: number,
  readyAt: number,
  resetAt: number,
) => {
  // Left unmined long enough, the rock resets to a fresh stage 1. `resetAt` comes
  // from getCrimstoneResetAt, so the art and the drop preview flip at the same
  // moment the reducer resets minesLeft.
  if (now > resetAt) {
    return 1;
  }

  if (minesLeft === 5 && now < readyAt) return 6;
  if (minesLeft === 5) return 1;
  if (minesLeft === 4) return 2;
  if (minesLeft === 3) return 3;
  if (minesLeft === 2) return 4;
  return 5;
};
