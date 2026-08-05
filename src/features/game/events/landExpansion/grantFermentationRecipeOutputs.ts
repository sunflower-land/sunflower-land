import Decimal from "decimal.js-light";
import {
  type FermentationCollectedActivity,
  getFermentationRecipe,
  type FermentationRecipeName,
} from "features/game/types/fermentation";
import { getObjectEntries } from "lib/object";
import { KNOWN_IDS } from "features/game/types";
import type { BoostName, GameState } from "features/game/types/game";
import { getAgingOutput } from "features/game/types/agingFormulas";
import { trackFarmActivity } from "features/game/types/farmActivity";

/**
 * Mutates game state: adds fermentation recipe outputs and farm activity
 * (same rules as {@link collectFermentation}). Returns the boosts that
 * applied so the calling event can record them via updateBoostUsed.
 */
export function grantFermentationRecipeOutputs(
  game: GameState,
  recipe: FermentationRecipeName,
  farmId: number,
  agerLevel: number,
): { name: BoostName; value: string }[] {
  const recipeDef = getFermentationRecipe(recipe);
  const boostsUsed: { name: BoostName; value: string }[] = [];

  for (const [item, amount] of getObjectEntries(recipeDef.outputs)) {
    const prev = game.inventory[item] ?? new Decimal(0);
    const { output: add, boostsUsed: outputBoostsUsed } = getAgingOutput(
      game,
      amount ?? new Decimal(0),
      item,
      agerLevel,
      {
        farmId,
        itemId: KNOWN_IDS[item],
        counter: game.farmActivity[`${item} Fermented`] ?? 0,
      },
    );
    boostsUsed.push(...outputBoostsUsed);
    game.inventory[item] = prev.add(add);

    const activityName: FermentationCollectedActivity = `${item} Fermented`;

    game.farmActivity = trackFarmActivity(
      activityName,
      game.farmActivity,
      new Decimal(add),
    );
  }

  return boostsUsed;
}
