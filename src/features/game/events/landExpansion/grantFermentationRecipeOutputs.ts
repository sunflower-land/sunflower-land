import Decimal from "decimal.js-light";
import {
  FermentationCollectedActivity,
  getFermentationRecipe,
  type FermentationRecipeName,
} from "features/game/types/fermentation";
import { getObjectEntries } from "lib/object";
import { KNOWN_IDS } from "features/game/types";
import { GameState } from "features/game/types/game";
import { getAgingOutput } from "features/game/types/agingFormulas";
import { trackFarmActivity } from "features/game/types/farmActivity";

/**
 * Mutates game state: adds fermentation recipe outputs and farm activity
 * (same rules as {@link collectFermentation}).
 */
export function grantFermentationRecipeOutputs(
  game: GameState,
  recipe: FermentationRecipeName,
  farmId: number,
  agerApplied: boolean,
): void {
  const recipeDef = getFermentationRecipe(recipe);

  for (const [item, amount] of getObjectEntries(recipeDef.outputs)) {
    const prev = game.inventory[item] ?? new Decimal(0);
    const add = getAgingOutput(
      game,
      amount ?? new Decimal(0),
      item,
      agerApplied,
      {
        farmId,
        itemId: KNOWN_IDS[item],
        counter: game.farmActivity[`${item} Fermented`] ?? 0,
      },
    );
    game.inventory[item] = prev.add(add);

    const activityName: FermentationCollectedActivity = `${item} Fermented`;

    game.farmActivity = trackFarmActivity(
      activityName,
      game.farmActivity,
      new Decimal(add),
    );
  }
}
