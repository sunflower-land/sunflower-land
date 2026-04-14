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
import { AGED_FISH, PRIME_AGED_FISH } from "features/game/types/consumables";
import { AgedFishName, PrimeAgedFishName } from "../types/fishing";

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

/** `0` = Aged fish bait, `1` = Prime Aged fish bait; `undefined` if not a fish-age variant. */
function getBaitVariantAgingTier(
  recipeId: FermentationRecipeName,
): 0 | 1 | undefined {
  const def = getFermentationRecipe(recipeId);

  for (const [ingredientName] of getObjectEntries(def.ingredients)) {
    if (ingredientName in PRIME_AGED_FISH) {
      return 1;
    }
    if (ingredientName in AGED_FISH) {
      return 0;
    }
  }

  return undefined;
}

/**
 * For bait fermentation recipes, the aged / prime-aged fish ingredient supplies XP
 * (`AGED_FISH` / `PRIME_AGED_FISH` `.experience`) for ordering within an aging tier.
 */
function getBaitVariantFishXp(
  recipeId: FermentationRecipeName,
): number | undefined {
  const def = getFermentationRecipe(recipeId);

  for (const [ingredientName] of getObjectEntries(def.ingredients)) {
    if (ingredientName in AGED_FISH) {
      return AGED_FISH[ingredientName as AgedFishName].experience;
    }
    if (ingredientName in PRIME_AGED_FISH) {
      return PRIME_AGED_FISH[ingredientName as PrimeAgedFishName].experience;
    }
  }

  return undefined;
}

function compareFermentationRecipeIds(
  a: FermentationRecipeName,
  b: FermentationRecipeName,
): number {
  const tierA = getBaitVariantAgingTier(a);
  const tierB = getBaitVariantAgingTier(b);

  if (tierA !== undefined && tierB !== undefined && tierA !== tierB) {
    return tierA - tierB;
  }

  const xpA = getBaitVariantFishXp(a);
  const xpB = getBaitVariantFishXp(b);

  if (xpA !== undefined && xpB !== undefined && xpA !== xpB) {
    return xpA - xpB;
  }

  return formatRecipeVariantLabel(a).localeCompare(formatRecipeVariantLabel(b));
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

    const sortedIds = [...recipeIds].sort(compareFermentationRecipeIds);

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
