import Decimal from "decimal.js-light";

import { getKeys } from "lib/object";
import type { Inventory } from "./game";

export type SpiceRackRecipeDefinition = {
  durationSeconds: number;
  ingredients: Inventory;
  outputs: Inventory;
};

const SPICE_RACK_RECIPES_STATIC = {
  "Refined Salt": {
    durationSeconds: 60 * 60,
    ingredients: {
      Salt: new Decimal(10),
    },
    outputs: {
      "Refined Salt": new Decimal(1),
    },
  },
  "Salt Lick": {
    durationSeconds: 60 * 60,
    ingredients: {
      "Refined Salt": new Decimal(5),
    },
    outputs: {
      "Salt Lick": new Decimal(5),
    },
  },
  "Honey Treat": {
    durationSeconds: 60 * 60,
    ingredients: {
      "Refined Salt": new Decimal(5),
      Honey: new Decimal(5),
    },
    outputs: {
      "Honey Treat": new Decimal(5),
    },
  },
  "Spice Base": {
    durationSeconds: 60 * 60,
    ingredients: {
      "Refined Salt": new Decimal(5),
      Pepper: new Decimal(100),
    },
    outputs: {
      "Spice Base": new Decimal(5),
    },
  },
} as const satisfies Record<string, SpiceRackRecipeDefinition>;

export const SPICE_RACK_RECIPES: Record<
  SpiceRackRecipeName,
  SpiceRackRecipeDefinition
> = SPICE_RACK_RECIPES_STATIC;

export type SpiceRackRecipeName = keyof typeof SPICE_RACK_RECIPES_STATIC;

export const SPICE_RACK_RECIPE_IDS: SpiceRackRecipeName[] = getKeys(
  SPICE_RACK_RECIPES_STATIC,
);

export type SpiceRackCollectedActivity = `${SpiceRackRecipeName} Spiced`;

export function spiceRackCollectedActivity(
  recipe: SpiceRackRecipeName,
): SpiceRackCollectedActivity {
  return `${recipe} Spiced`;
}

export function isSpiceRackRecipeName(id: string): id is SpiceRackRecipeName {
  return Object.prototype.hasOwnProperty.call(SPICE_RACK_RECIPES, id);
}
export function getSpiceRackRecipe(
  name: SpiceRackRecipeName,
): SpiceRackRecipeDefinition {
  return SPICE_RACK_RECIPES[name];
}

/** Spice rack slots: one per Aging Shed level, max 4. */
export function getMaxSpiceRackSlots(level: number): number {
  if (level < 1) {
    return 1;
  }

  return Math.min(level, 4);
}
