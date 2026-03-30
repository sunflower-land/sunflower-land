import Decimal from "decimal.js-light";

import {
  FERMENTATION_RECIPES,
  FERMENTATION_RECIPE_IDS,
  getFermentationRecipe,
  type FermentationRecipeName,
} from "features/game/types/fermentation";
import type { InventoryItemName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { getObjectEntries } from "lib/object";
import { secondsToString } from "lib/utils/time";

export type FermentationOutputGroup = {
  signature: string;
  item: InventoryItemName;
  amount: Decimal;
  recipeIds: FermentationRecipeName[];
};

function getPrimaryOutput(
  outputs: (typeof FERMENTATION_RECIPES)[FermentationRecipeName]["outputs"],
): [InventoryItemName, Decimal] {
  const entries = getObjectEntries(outputs);
  const first = entries[0];
  if (!first) {
    throw new Error("Fermentation recipe has no outputs");
  }

  const [item, amount] = first;
  return [item, amount ?? new Decimal(0)];
}

function outputGroupSortKey(group: FermentationOutputGroup): number {
  const { item } = group;
  const name = String(item);

  if (name.startsWith("Pickled ")) {
    return 0;
  }

  if (item === "Salt") {
    return 1;
  }

  if (item === "Greenhouse Glow" || item === "Greenhouse Goodie") {
    return 2;
  }

  if (item === "Sproutroot Surprise" || item === "Turbofruit Mix") {
    return 3;
  }

  if (item === "Basic Bait") {
    return 4;
  }

  if (item === "Advanced Bait") {
    return 5;
  }

  if (item === "Expert Bait") {
    return 6;
  }

  return 10;
}

/**
 * Groups fermentation recipes by output signature `${item}:${amount}` so
 * Basic Bait ×1 and ×3 (Prime Aged) stay separate groups.
 */
export function getFermentationOutputGroups(): FermentationOutputGroup[] {
  const bySignature = new Map<string, FermentationRecipeName[]>();

  for (const recipeId of FERMENTATION_RECIPE_IDS) {
    const def = FERMENTATION_RECIPES[recipeId];
    const [item, amount] = getPrimaryOutput(def.outputs);
    const signature = `${item}:${amount.toString()}`;

    const list = bySignature.get(signature) ?? [];
    list.push(recipeId);
    bySignature.set(signature, list);
  }

  const groups: FermentationOutputGroup[] = [];

  for (const [signature, recipeIds] of bySignature) {
    const def = getFermentationRecipe(recipeIds[0]);
    const [item, amount] = getPrimaryOutput(def.outputs);

    const sortedIds = [...recipeIds].sort((a, b) =>
      formatRecipeVariantLabel(a).localeCompare(formatRecipeVariantLabel(b)),
    );

    groups.push({
      signature,
      item,
      amount,
      recipeIds: sortedIds,
    });
  }

  groups.sort((a, b) => {
    const tier = outputGroupSortKey(a) - outputGroupSortKey(b);
    if (tier !== 0) {
      return tier;
    }

    const nameCmp = String(a.item).localeCompare(String(b.item));
    if (nameCmp !== 0) {
      return nameCmp;
    }

    return a.amount.comparedTo(b.amount);
  });

  return groups;
}

function ingredientDisplayName(name: InventoryItemName): string {
  return ITEM_DETAILS[name]?.translatedName ?? String(name);
}

/** Human-readable ingredients + duration for a fermentation recipe variant. */
export function formatRecipeVariantLabel(
  recipeId: FermentationRecipeName,
): string {
  const def = getFermentationRecipe(recipeId);
  const parts = getObjectEntries(def.ingredients).map(([name, qty]) => {
    const label = ingredientDisplayName(name);
    const n = qty ?? new Decimal(0);
    return `${label} x${n.toString()}`;
  });

  const time = secondsToString(def.durationSeconds, { length: "short" });

  return `${parts.join(" + ")} — ${time}`;
}
