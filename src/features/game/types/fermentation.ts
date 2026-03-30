import Decimal from "decimal.js-light";

import { getKeys } from "lib/object";
import type { Inventory } from "./game";

export type FermentationRecipeDefinition = {
  durationSeconds: number;
  ingredients: Inventory;
  outputs: Inventory;
};

export const FERMENTATION_RECIPES = {
  "Pickled Radish": {
    durationSeconds: 60 * 60,
    ingredients: {
      Radish: new Decimal(10),
      Salt: new Decimal(5),
    },
    outputs: {
      "Pickled Radish": new Decimal(1),
    },
  },
  "Pickled Zucchini": {
    durationSeconds: 60 * 60,
    ingredients: {
      Zucchini: new Decimal(10),
      Salt: new Decimal(5),
    },
    outputs: {
      "Pickled Zucchini": new Decimal(1),
    },
  },
  "Pickled Tomato": {
    durationSeconds: 60 * 60,
    ingredients: {
      Tomato: new Decimal(10),
      "Refined Salt": new Decimal(2),
    },
    outputs: {
      "Pickled Tomato": new Decimal(1),
    },
  },
  "Pickled Cabbage": {
    durationSeconds: 60 * 60,
    ingredients: {
      Cabbage: new Decimal(10),
      Salt: new Decimal(5),
    },
    outputs: {
      "Pickled Cabbage": new Decimal(1),
    },
  },
  "Pickled Onion": {
    durationSeconds: 60 * 60,
    ingredients: {
      Onion: new Decimal(10),
      Salt: new Decimal(5),
    },
    outputs: {
      "Pickled Onion": new Decimal(1),
    },
  },
  "Pickled Pepper": {
    durationSeconds: 60 * 60,
    ingredients: {
      Pepper: new Decimal(10),
      Salt: new Decimal(5),
    },
    outputs: {
      "Pickled Pepper": new Decimal(1),
    },
  },
  "Salt from Seaweed": {
    durationSeconds: 0,
    ingredients: {
      Seaweed: new Decimal(1),
    },
    outputs: {
      Salt: new Decimal(8),
    },
  },
  "Salt from Old Bottle": {
    durationSeconds: 0,
    ingredients: {
      "Old Bottle": new Decimal(1),
    },
    outputs: {
      Salt: new Decimal(8),
    },
  },
};

export type FermentationRecipeName = keyof typeof FERMENTATION_RECIPES;

export const FERMENTATION_RECIPE_IDS: FermentationRecipeName[] =
  getKeys(FERMENTATION_RECIPES);

export type FermentationCollectedActivity =
  `${FermentationRecipeName} Fermented`;

export function fermentationCollectedActivity(
  recipe: FermentationRecipeName,
): FermentationCollectedActivity {
  return `${recipe} Fermented`;
}

export function isFermentationRecipeName(
  id: string,
): id is FermentationRecipeName {
  return id in FERMENTATION_RECIPES;
}

export function getFermentationRecipe(
  name: FermentationRecipeName,
): FermentationRecipeDefinition {
  return FERMENTATION_RECIPES[name];
}

/** Fermentation rack slots: one per Aging Shed level, max 6. */
export function getMaxFermentationSlots(level: number): number {
  if (level < 1) {
    return 1;
  }

  return Math.min(level, 6);
}
