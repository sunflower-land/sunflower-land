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
import {
  AGED_FISH,
  isAgedFish,
  isPrimeAgedFish,
  PRIME_AGED_FISH,
} from "features/game/types/consumables";

export type FermentationOutputGroup = {
  /** Stable id for selection (output item name). */
  signature: string;
  item: InventoryItemName;
  /** Set when every variant yields the same amount; omitted when yields differ (e.g. aged vs prime bait). */
  amount?: Decimal;
  recipeIds: FermentationRecipeName[];
  /** Primary output amount per variant; same order as `recipeIds`. */
  outputQuantities: Decimal[];
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

  if (item === "Capsule Bait") {
    return 4;
  }

  if (item === "Umbrella Bait") {
    return 5;
  }

  if (item === "Crimson Baitfish") {
    return 6;
  }

  return 10;
}

/**
 * For bait fermentation recipes, the aged / prime-aged fish ingredient determines
 * the aging tier and supplies XP for ordering within a tier.
 */
function getBaitVariantSortMetadata(recipeId: FermentationRecipeName): {
  tier: 0 | 1 | undefined;
  xp: number | undefined;
} {
  const def = getFermentationRecipe(recipeId);

  for (const [ingredientName] of getObjectEntries(def.ingredients)) {
    if (isPrimeAgedFish(ingredientName)) {
      return {
        tier: 1,
        xp: PRIME_AGED_FISH[ingredientName].experience,
      };
    }
    if (isAgedFish(ingredientName)) {
      return {
        tier: 0,
        xp: AGED_FISH[ingredientName].experience,
      };
    }
  }

  return { tier: undefined, xp: undefined };
}

type FermentationRecipeSortMeta = {
  tier: 0 | 1 | undefined;
  xp: number | undefined;
  label: string;
};

function compareFermentationRecipeIds(
  a: FermentationRecipeName,
  b: FermentationRecipeName,
  sortMetaByRecipe: Map<FermentationRecipeName, FermentationRecipeSortMeta>,
): number {
  const aMeta = sortMetaByRecipe.get(a);
  const bMeta = sortMetaByRecipe.get(b);
  const tierA = aMeta?.tier;
  const tierB = bMeta?.tier;

  if (tierA !== undefined && tierB !== undefined && tierA !== tierB) {
    return tierA - tierB;
  }

  const xpA = aMeta?.xp;
  const xpB = bMeta?.xp;

  if (xpA !== undefined && xpB !== undefined && xpA !== xpB) {
    return xpA - xpB;
  }

  const aLabel = aMeta?.label ?? formatRecipeVariantLabel(a);
  const bLabel = bMeta?.label ?? formatRecipeVariantLabel(b);
  return aLabel.localeCompare(bLabel);
}

/**
 * Resolves a persisted output key to the current group. Supports legacy keys of the
 * form `item:amount` from when each yield was a separate dropdown row.
 */
export function findFermentationGroupByStoredSignature(
  groups: FermentationOutputGroup[],
  storedSignature: string,
): FermentationOutputGroup | undefined {
  const exact = groups.find((g) => g.signature === storedSignature);
  if (exact) {
    return exact;
  }

  const colon = storedSignature.lastIndexOf(":");
  if (colon <= 0) {
    return undefined;
  }

  const itemOnly = storedSignature.slice(0, colon);
  return groups.find((g) => g.signature === itemOnly);
}

/**
 * Groups fermentation recipes by output item so all variants (e.g. aged vs prime
 * bait yields) share one dropdown row. Per-variant yields are on {@link FermentationOutputGroup.outputQuantities}.
 */
export function getFermentationOutputGroups(): FermentationOutputGroup[] {
  const byOutputItem = new Map<string, FermentationRecipeName[]>();
  const sortMetaByRecipe = new Map<
    FermentationRecipeName,
    FermentationRecipeSortMeta
  >();

  for (const recipeId of FERMENTATION_RECIPE_IDS) {
    const { tier, xp } = getBaitVariantSortMetadata(recipeId);
    sortMetaByRecipe.set(recipeId, {
      tier,
      xp,
      label: formatRecipeVariantLabel(recipeId),
    });
  }

  for (const recipeId of FERMENTATION_RECIPE_IDS) {
    const def = FERMENTATION_RECIPES[recipeId];
    const [item] = getPrimaryOutput(def.outputs);
    const signature = String(item);

    const list = byOutputItem.get(signature) ?? [];
    list.push(recipeId);
    byOutputItem.set(signature, list);
  }

  const groups: FermentationOutputGroup[] = [];

  for (const [signature, recipeIds] of byOutputItem) {
    const def = getFermentationRecipe(recipeIds[0]);
    const [item] = getPrimaryOutput(def.outputs);

    const sortedIds = [...recipeIds].sort((a, b) =>
      compareFermentationRecipeIds(a, b, sortMetaByRecipe),
    );

    const outputQuantities = sortedIds.map(
      (id) => getPrimaryOutput(getFermentationRecipe(id).outputs)[1],
    );
    const firstAmt = outputQuantities[0];
    const uniformAmount =
      firstAmt !== undefined && outputQuantities.every((q) => q.eq(firstAmt))
        ? firstAmt
        : undefined;

    groups.push({
      signature,
      item,
      amount: uniformAmount,
      recipeIds: sortedIds,
      outputQuantities,
    });
  }

  groups.sort((a, b) => {
    const tier = outputGroupSortKey(a) - outputGroupSortKey(b);
    if (tier !== 0) {
      return tier;
    }

    return String(a.item).localeCompare(String(b.item));
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
