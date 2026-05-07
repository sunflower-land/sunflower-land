import { BoostName, CropPlot, GameState } from "features/game/types/game";
import { CropName } from "features/game/types/crops";
import { getCropYieldAmount } from "features/game/events/landExpansion/harvest";

// Boost sources that only apply on a probabilistic critical-drop trigger.
// They are filtered out of the hover preview because their inclusion in any
// given harvest is non-deterministic.
const CHANCE_BASED_YIELD_BOOSTS: ReadonlySet<BoostName> = new Set([
  "Green Amulet",
  "Peeled Potato",
  "Potent Potato",
  "Stellar Sunflower",
  "Radical Radish",
]);

/**
 * Returns the yield boosts applied to a specific plot's growing crop.
 * Time boosts are intentionally excluded — they are already reflected
 * in the visible countdown.
 */
export function getPlotBoosts({
  game,
  plot,
  cropName,
  createdAt,
  farmId,
  counter,
}: {
  game: GameState;
  plot: CropPlot;
  cropName: CropName;
  createdAt: number;
  farmId: number;
  counter: number;
}): { name: BoostName; value: string }[] {
  return getCropYieldAmount({
    crop: cropName,
    game,
    plot,
    createdAt,
    prngArgs: { farmId, counter },
  }).boostsUsed.filter((boost) => !CHANCE_BASED_YIELD_BOOSTS.has(boost.name));
}
