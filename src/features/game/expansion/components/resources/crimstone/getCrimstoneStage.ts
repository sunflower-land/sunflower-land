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
) => {
  // Long after it became ready the rock fully resets to a fresh stage 1. Anchor
  // this off the actual (windowed) readyAt rather than `minedAt + base recovery`,
  // so a boosted rock resets 24h after it truly recovered (legacy:
  // readyAt === minedAt + base recovery, so behaviour is unchanged).
  const timeToReset = readyAt + 24 * 60 * 60 * 1000;
  if (now > timeToReset) {
    return 1;
  }

  if (minesLeft === 5 && now < readyAt) return 6;
  if (minesLeft === 5) return 1;
  if (minesLeft === 4) return 2;
  if (minesLeft === 3) return 3;
  if (minesLeft === 2) return 4;
  return 5;
};
