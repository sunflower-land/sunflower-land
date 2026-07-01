/**
 * Visual depletion stage (1-10) for a sunstone, derived from its remaining mines.
 *
 * Kept in its own leaf module (rather than in Sunstone.tsx) to avoid an import
 * cycle: Sunstone.tsx imports its Recovered/Depleting/Depleted children, and the
 * children import this helper back.
 */
export const getSunstoneStage = (minesLeft: number) => {
  if (minesLeft === 10) return 1;
  if (minesLeft === 9) return 2;
  if (minesLeft === 8) return 3;
  if (minesLeft === 7) return 4;
  if (minesLeft === 6) return 5;
  if (minesLeft === 5) return 6;
  if (minesLeft === 4) return 7;
  if (minesLeft === 3) return 8;
  if (minesLeft === 2) return 9;
  return 10;
};
