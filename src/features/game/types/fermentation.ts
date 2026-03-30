import Decimal from "decimal.js-light";

import { getKeys } from "lib/object";
import type { Inventory } from "./game";
import type { AgedFishName, FishName, PrimeAgedFishName } from "./fishing";
import { getFishNamesByTier } from "./fishing";

export type FermentationRecipeDefinition = {
  durationSeconds: number;
  ingredients: Inventory;
  outputs: Inventory;
};

const STATIC_FERMENTATION_RECIPES = {
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
  "Greenhouse Glow: Pickled Radish": {
    durationSeconds: 60 * 60 * 2,
    ingredients: {
      "Refined Salt": new Decimal(2),
      "Pickled Radish": new Decimal(1),
    },
    outputs: {
      "Greenhouse Glow": new Decimal(1),
    },
  },
  "Greenhouse Glow: Pickled Zucchini": {
    durationSeconds: 60 * 60 * 2,
    ingredients: {
      "Refined Salt": new Decimal(2),
      "Pickled Zucchini": new Decimal(1),
    },
    outputs: {
      "Greenhouse Glow": new Decimal(1),
    },
  },
  "Greenhouse Glow: Pickled Pepper": {
    durationSeconds: 60 * 60 * 2,
    ingredients: {
      "Refined Salt": new Decimal(2),
      "Pickled Pepper": new Decimal(1),
    },
    outputs: {
      "Greenhouse Glow": new Decimal(1),
    },
  },
  "Greenhouse Goodie: Pickled Cabbage": {
    durationSeconds: 60 * 60 * 2,
    ingredients: {
      "Refined Salt": new Decimal(2),
      "Pickled Cabbage": new Decimal(1),
    },
    outputs: {
      "Greenhouse Goodie": new Decimal(1),
    },
  },
  "Greenhouse Goodie: Pickled Tomato": {
    durationSeconds: 60 * 60 * 2,
    ingredients: {
      "Refined Salt": new Decimal(2),
      "Pickled Tomato": new Decimal(1),
    },
    outputs: {
      "Greenhouse Goodie": new Decimal(1),
    },
  },
  "Greenhouse Goodie: Pickled Onion": {
    durationSeconds: 60 * 60 * 2,
    ingredients: {
      "Refined Salt": new Decimal(2),
      "Pickled Onion": new Decimal(1),
    },
    outputs: {
      "Greenhouse Goodie": new Decimal(1),
    },
  },
  "Sproutroot Surprise": {
    durationSeconds: 60 * 2,
    ingredients: {
      "Refined Salt": new Decimal(2),
      "Sprout Mix": new Decimal(5),
      "Rapid Root": new Decimal(5),
    },
    outputs: {
      "Sproutroot Surprise": new Decimal(5),
    },
  },
  "Turbofruit Mix": {
    durationSeconds: 60 * 2,
    ingredients: {
      "Refined Salt": new Decimal(2),
      "Rapid Root": new Decimal(5),
      "Fruitful Blend": new Decimal(5),
    },
    outputs: {
      "Turbofruit Mix": new Decimal(5),
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
} as const satisfies Record<string, FermentationRecipeDefinition>;

function buildBaitFermentationRecipes(): Record<
  BaitFermentationRecipeName,
  FermentationRecipeDefinition
> {
  const recipes: Record<string, FermentationRecipeDefinition> = {};
  const fiveMin = 60 * 5;

  for (const fish of getFishNamesByTier("basic")) {
    const aged: AgedFishName = `Aged ${fish}`;
    const primeAged: PrimeAgedFishName = `Prime Aged ${fish}`;

    recipes[`Basic Bait (Aged ${fish}, Pickled Zucchini)`] = {
      durationSeconds: fiveMin,
      ingredients: {
        [aged]: new Decimal(1),
        "Pickled Zucchini": new Decimal(1),
      },
      outputs: {
        "Basic Bait": new Decimal(1),
      },
    };
    recipes[`Basic Bait (Prime Aged ${fish}, Pickled Zucchini)`] = {
      durationSeconds: fiveMin,
      ingredients: {
        [primeAged]: new Decimal(1),
        "Pickled Zucchini": new Decimal(1),
      },
      outputs: {
        "Basic Bait": new Decimal(3),
      },
    };
    recipes[`Basic Bait (Aged ${fish}, Pickled Pepper)`] = {
      durationSeconds: fiveMin,
      ingredients: {
        [aged]: new Decimal(1),
        "Pickled Pepper": new Decimal(1),
      },
      outputs: {
        "Basic Bait": new Decimal(1),
      },
    };
    recipes[`Basic Bait (Prime Aged ${fish}, Pickled Pepper)`] = {
      durationSeconds: fiveMin,
      ingredients: {
        [primeAged]: new Decimal(1),
        "Pickled Pepper": new Decimal(1),
      },
      outputs: {
        "Basic Bait": new Decimal(3),
      },
    };
  }

  for (const fish of getFishNamesByTier("advanced")) {
    const aged: AgedFishName = `Aged ${fish}`;
    const primeAged: PrimeAgedFishName = `Prime Aged ${fish}`;

    recipes[`Advanced Bait (Aged ${fish}, Pickled Cabbage)`] = {
      durationSeconds: fiveMin,
      ingredients: {
        [aged]: new Decimal(1),
        "Pickled Cabbage": new Decimal(1),
      },
      outputs: {
        "Advanced Bait": new Decimal(1),
      },
    };
    recipes[`Advanced Bait (Prime Aged ${fish}, Pickled Cabbage)`] = {
      durationSeconds: fiveMin,
      ingredients: {
        [primeAged]: new Decimal(1),
        "Pickled Cabbage": new Decimal(1),
      },
      outputs: {
        "Advanced Bait": new Decimal(3),
      },
    };
    recipes[`Advanced Bait (Aged ${fish}, Pickled Onion)`] = {
      durationSeconds: fiveMin,
      ingredients: {
        [aged]: new Decimal(1),
        "Pickled Onion": new Decimal(1),
      },
      outputs: {
        "Advanced Bait": new Decimal(1),
      },
    };
    recipes[`Advanced Bait (Prime Aged ${fish}, Pickled Onion)`] = {
      durationSeconds: fiveMin,
      ingredients: {
        [primeAged]: new Decimal(1),
        "Pickled Onion": new Decimal(1),
      },
      outputs: {
        "Advanced Bait": new Decimal(3),
      },
    };
  }

  for (const fish of getFishNamesByTier("expert")) {
    const aged: AgedFishName = `Aged ${fish}`;
    const primeAged: PrimeAgedFishName = `Prime Aged ${fish}`;

    recipes[`Expert Bait (Aged ${fish}, Pickled Tomato)`] = {
      durationSeconds: fiveMin,
      ingredients: {
        [aged]: new Decimal(1),
        "Pickled Tomato": new Decimal(1),
      },
      outputs: {
        "Expert Bait": new Decimal(1),
      },
    };
    recipes[`Expert Bait (Prime Aged ${fish}, Pickled Tomato)`] = {
      durationSeconds: fiveMin,
      ingredients: {
        [primeAged]: new Decimal(1),
        "Pickled Tomato": new Decimal(1),
      },
      outputs: {
        "Expert Bait": new Decimal(3),
      },
    };
  }

  return recipes;
}

const BAIT_FERMENTATION_RECIPES = buildBaitFermentationRecipes();

export const FERMENTATION_RECIPES: Record<
  FermentationRecipeName,
  FermentationRecipeDefinition
> = {
  ...STATIC_FERMENTATION_RECIPES,
  ...BAIT_FERMENTATION_RECIPES,
};

/** Template union keeps `FermentationCollectedActivity` finite (not `${string} Fermented`). */
export type BaitFermentationRecipeName =
  | `Basic Bait (Aged ${FishName}, Pickled Zucchini)`
  | `Basic Bait (Prime Aged ${FishName}, Pickled Zucchini)`
  | `Basic Bait (Aged ${FishName}, Pickled Pepper)`
  | `Basic Bait (Prime Aged ${FishName}, Pickled Pepper)`
  | `Advanced Bait (Aged ${FishName}, Pickled Cabbage)`
  | `Advanced Bait (Prime Aged ${FishName}, Pickled Cabbage)`
  | `Advanced Bait (Aged ${FishName}, Pickled Onion)`
  | `Advanced Bait (Prime Aged ${FishName}, Pickled Onion)`
  | `Expert Bait (Aged ${FishName}, Pickled Tomato)`
  | `Expert Bait (Prime Aged ${FishName}, Pickled Tomato)`;

export type FermentationRecipeName =
  | keyof typeof STATIC_FERMENTATION_RECIPES
  | BaitFermentationRecipeName;

export const FERMENTATION_RECIPE_IDS: FermentationRecipeName[] = [
  ...getKeys(STATIC_FERMENTATION_RECIPES),
  ...(Object.keys(BAIT_FERMENTATION_RECIPES) as FermentationRecipeName[]),
];

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
