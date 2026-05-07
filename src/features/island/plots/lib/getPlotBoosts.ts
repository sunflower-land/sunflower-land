import { BoostName, CropPlot, GameState } from "features/game/types/game";
import { CropName } from "features/game/types/crops";
import { getCropYieldAmount } from "features/game/events/landExpansion/harvest";

/**
 * Returns the deterministic yield boosts applied to a plot's growing crop.
 * Time boosts are excluded (already reflected in the visible countdown);
 * `prngArgs` is omitted so chance-based crit drops don't appear.
 */
export function getPlotBoosts({
  game,
  plot,
  cropName,
  createdAt,
}: {
  game: GameState;
  plot: CropPlot;
  cropName: CropName;
  createdAt: number;
}): { name: BoostName; value: string }[] {
  return getCropYieldAmount({
    crop: cropName,
    game,
    plot,
    createdAt,
  }).boostsUsed;
}
