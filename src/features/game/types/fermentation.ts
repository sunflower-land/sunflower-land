import Decimal from "decimal.js-light";

import { getKeys } from "lib/object";
import type { Inventory, InventoryItemName } from "./game";
import type { AgedFishName, FishName, PrimeAgedFishName } from "./fishing";
import { getFishNamesByTier } from "./fishing";

export type FermentationRecipeDefinition = {
  durationSeconds: number;
  ingredients: Inventory;
  outputs: Inventory;
};

const GREENHOUSE_FERMENT_DURATION_SEC = 60 * 60 * 2;

/**
 * Bait fermentation output per (Aged | Prime Aged) fish. Shared across
 * Capsule Bait, Umbrella Bait and Crimson Baitfish recipe families so
 * balance changes stay one-touch.
 */
export const BAIT_OUTPUT_AGED = new Decimal(5);
export const BAIT_OUTPUT_PRIME = new Decimal(10);

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
      Zucchini: new Decimal(75),
      Salt: new Decimal(5),
    },
    outputs: {
      "Pickled Zucchini": new Decimal(1),
    },
  },
  "Pickled Tomato": {
    durationSeconds: 60 * 60,
    ingredients: {
      Tomato: new Decimal(15),
      Salt: new Decimal(5),
    },
    outputs: {
      "Pickled Tomato": new Decimal(1),
    },
  },
  "Pickled Cabbage": {
    durationSeconds: 60 * 60,
    ingredients: {
      Cabbage: new Decimal(20),
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
      Pepper: new Decimal(30),
      Salt: new Decimal(5),
    },
    outputs: {
      "Pickled Pepper": new Decimal(1),
    },
  },
  "Greenhouse Glow: Pickled Tomato": {
    durationSeconds: GREENHOUSE_FERMENT_DURATION_SEC,
    ingredients: {
      "Pickled Tomato": new Decimal(1),
      "Refined Salt": new Decimal(1),
    },
    outputs: {
      "Greenhouse Glow": new Decimal(1),
    },
  },
  "Greenhouse Glow: Pickled Zucchini": {
    durationSeconds: GREENHOUSE_FERMENT_DURATION_SEC,
    ingredients: {
      "Pickled Zucchini": new Decimal(1),
      "Refined Salt": new Decimal(1),
    },
    outputs: {
      "Greenhouse Glow": new Decimal(1),
    },
  },
  "Greenhouse Glow: Pickled Cabbage": {
    durationSeconds: GREENHOUSE_FERMENT_DURATION_SEC,
    ingredients: {
      "Pickled Cabbage": new Decimal(1),
      "Refined Salt": new Decimal(1),
    },
    outputs: {
      "Greenhouse Glow": new Decimal(1),
    },
  },
  "Greenhouse Goodie: Pickled Radish": {
    durationSeconds: GREENHOUSE_FERMENT_DURATION_SEC,
    ingredients: {
      "Pickled Radish": new Decimal(1),
      "Refined Salt": new Decimal(1),
    },
    outputs: {
      "Greenhouse Goodie": new Decimal(1),
    },
  },
  "Greenhouse Goodie: Pickled Pepper": {
    durationSeconds: GREENHOUSE_FERMENT_DURATION_SEC,
    ingredients: {
      "Pickled Pepper": new Decimal(1),
      "Refined Salt": new Decimal(1),
    },
    outputs: {
      "Greenhouse Goodie": new Decimal(1),
    },
  },
  "Greenhouse Goodie: Pickled Onion": {
    durationSeconds: GREENHOUSE_FERMENT_DURATION_SEC,
    ingredients: {
      "Pickled Onion": new Decimal(1),
      "Refined Salt": new Decimal(1),
    },
    outputs: {
      "Greenhouse Goodie": new Decimal(1),
    },
  },
  "Sproutroot Surprise": {
    durationSeconds: 60 * 2,
    ingredients: {
      "Sprout Mix": new Decimal(5),
      "Rapid Root": new Decimal(5),
      "Refined Salt": new Decimal(2),
    },
    outputs: {
      "Sproutroot Surprise": new Decimal(5),
    },
  },
  "Turbofruit Mix": {
    durationSeconds: 60 * 2,
    ingredients: {
      "Rapid Root": new Decimal(5),
      "Fruitful Blend": new Decimal(5),
      "Refined Salt": new Decimal(2),
    },
    outputs: {
      "Turbofruit Mix": new Decimal(5),
    },
  },
  "Salt from Seaweed": {
    durationSeconds: 0,
    ingredients: {
      Seaweed: new Decimal(4),
    },
    outputs: {
      Salt: new Decimal(15),
    },
  },
  "Salt from Old Bottle": {
    durationSeconds: 0,
    ingredients: {
      "Old Bottle": new Decimal(8),
    },
    outputs: {
      Salt: new Decimal(9),
    },
  },
  "Salt from Crab": {
    durationSeconds: 0,
    ingredients: {
      Crab: new Decimal(4),
    },
    outputs: {
      Salt: new Decimal(3),
    },
  },
  "Salt from Bones": {
    durationSeconds: 0,
    ingredients: {
      "Camel Bone": new Decimal(2),
    },
    outputs: {
      Salt: new Decimal(1),
    },
  },
} as const satisfies Record<string, FermentationRecipeDefinition>;

/**
 * Removed from the aging shed UI and from {@link FERMENTATION_RECIPE_IDS} so they
 * cannot be started, but kept in the full fermentation registry so in-progress jobs
 * can still be collected ({@link getFermentationRecipe}).
 */
const LEGACY_FERMENTATION_RECIPES = {
  "Greenhouse Glow: Pickled Radish": {
    durationSeconds: GREENHOUSE_FERMENT_DURATION_SEC,
    ingredients: {
      "Pickled Radish": new Decimal(1),
      Salt: new Decimal(2),
    },
    outputs: {
      "Greenhouse Glow": new Decimal(1),
    },
  },
  "Greenhouse Glow: Pickled Pepper": {
    durationSeconds: GREENHOUSE_FERMENT_DURATION_SEC,
    ingredients: {
      "Pickled Pepper": new Decimal(1),
      Salt: new Decimal(2),
    },
    outputs: {
      "Greenhouse Glow": new Decimal(1),
    },
  },
  "Greenhouse Goodie: Pickled Cabbage": {
    durationSeconds: GREENHOUSE_FERMENT_DURATION_SEC,
    ingredients: {
      "Pickled Cabbage": new Decimal(1),
      Salt: new Decimal(2),
    },
    outputs: {
      "Greenhouse Goodie": new Decimal(1),
    },
  },
  "Greenhouse Goodie: Pickled Tomato": {
    durationSeconds: GREENHOUSE_FERMENT_DURATION_SEC,
    ingredients: {
      "Pickled Tomato": new Decimal(1),
      Salt: new Decimal(2),
    },
    outputs: {
      "Greenhouse Goodie": new Decimal(1),
    },
  },
} as const satisfies Record<string, FermentationRecipeDefinition>;

/** Template union keeps `FermentationCollectedActivity` finite (not `${string} Fermented`). */
export type BaitFermentationRecipeName =
  | `Capsule Bait (Aged ${FishName}, Pickled Zucchini)`
  | `Capsule Bait (Prime Aged ${FishName}, Pickled Zucchini)`
  | `Capsule Bait (Aged ${FishName}, Pickled Tomato)`
  | `Capsule Bait (Prime Aged ${FishName}, Pickled Tomato)`
  | `Umbrella Bait (Aged ${FishName}, Pickled Cabbage)`
  | `Umbrella Bait (Prime Aged ${FishName}, Pickled Cabbage)`
  | `Umbrella Bait (Aged ${FishName}, Pickled Pepper)`
  | `Umbrella Bait (Prime Aged ${FishName}, Pickled Pepper)`
  | `Crimson Baitfish (Aged ${FishName}, Pickled Radish)`
  | `Crimson Baitfish (Prime Aged ${FishName}, Pickled Radish)`
  | `Crimson Baitfish (Aged ${FishName}, Pickled Onion)`
  | `Crimson Baitfish (Prime Aged ${FishName}, Pickled Onion)`;

/** Former bait recipe ids kept for in-progress fermentation collection only. */
export type RetiredBaitFermentationRecipeName =
  | `Capsule Bait (Aged ${FishName}, Pickled Pepper)`
  | `Capsule Bait (Prime Aged ${FishName}, Pickled Pepper)`
  | `Umbrella Bait (Aged ${FishName}, Pickled Onion)`
  | `Umbrella Bait (Prime Aged ${FishName}, Pickled Onion)`
  | `Crimson Baitfish (Aged ${FishName}, Pickled Tomato)`
  | `Crimson Baitfish (Prime Aged ${FishName}, Pickled Tomato)`;

function buildBaitFermentationRecipes(): Record<
  BaitFermentationRecipeName,
  FermentationRecipeDefinition
> {
  const recipes: Record<string, FermentationRecipeDefinition> = {};
  const fiveMin = 60 * 5;

  for (const fish of getFishNamesByTier("basic")) {
    const aged: AgedFishName = `Aged ${fish}`;
    const primeAged: PrimeAgedFishName = `Prime Aged ${fish}`;

    recipes[`Capsule Bait (Aged ${fish}, Pickled Zucchini)`] = {
      durationSeconds: fiveMin,
      ingredients: {
        [aged]: new Decimal(1),
        "Pickled Zucchini": new Decimal(1),
      },
      outputs: {
        "Capsule Bait": BAIT_OUTPUT_AGED,
      },
    };
    recipes[`Capsule Bait (Prime Aged ${fish}, Pickled Zucchini)`] = {
      durationSeconds: fiveMin,
      ingredients: {
        [primeAged]: new Decimal(1),
        "Pickled Zucchini": new Decimal(1),
      },
      outputs: {
        "Capsule Bait": BAIT_OUTPUT_PRIME,
      },
    };
    recipes[`Capsule Bait (Aged ${fish}, Pickled Tomato)`] = {
      durationSeconds: fiveMin,
      ingredients: {
        [aged]: new Decimal(1),
        "Pickled Tomato": new Decimal(1),
      },
      outputs: {
        "Capsule Bait": BAIT_OUTPUT_AGED,
      },
    };
    recipes[`Capsule Bait (Prime Aged ${fish}, Pickled Tomato)`] = {
      durationSeconds: fiveMin,
      ingredients: {
        [primeAged]: new Decimal(1),
        "Pickled Tomato": new Decimal(1),
      },
      outputs: {
        "Capsule Bait": BAIT_OUTPUT_PRIME,
      },
    };
  }

  for (const fish of getFishNamesByTier("advanced")) {
    const aged: AgedFishName = `Aged ${fish}`;
    const primeAged: PrimeAgedFishName = `Prime Aged ${fish}`;

    recipes[`Umbrella Bait (Aged ${fish}, Pickled Cabbage)`] = {
      durationSeconds: fiveMin,
      ingredients: {
        [aged]: new Decimal(1),
        "Pickled Cabbage": new Decimal(1),
      },
      outputs: {
        "Umbrella Bait": BAIT_OUTPUT_AGED,
      },
    };
    recipes[`Umbrella Bait (Prime Aged ${fish}, Pickled Cabbage)`] = {
      durationSeconds: fiveMin,
      ingredients: {
        [primeAged]: new Decimal(1),
        "Pickled Cabbage": new Decimal(1),
      },
      outputs: {
        "Umbrella Bait": BAIT_OUTPUT_PRIME,
      },
    };
    recipes[`Umbrella Bait (Aged ${fish}, Pickled Pepper)`] = {
      durationSeconds: fiveMin,
      ingredients: {
        [aged]: new Decimal(1),
        "Pickled Pepper": new Decimal(1),
      },
      outputs: {
        "Umbrella Bait": BAIT_OUTPUT_AGED,
      },
    };
    recipes[`Umbrella Bait (Prime Aged ${fish}, Pickled Pepper)`] = {
      durationSeconds: fiveMin,
      ingredients: {
        [primeAged]: new Decimal(1),
        "Pickled Pepper": new Decimal(1),
      },
      outputs: {
        "Umbrella Bait": BAIT_OUTPUT_PRIME,
      },
    };
  }

  for (const fish of getFishNamesByTier("expert")) {
    const aged: AgedFishName = `Aged ${fish}`;
    const primeAged: PrimeAgedFishName = `Prime Aged ${fish}`;

    recipes[`Crimson Baitfish (Aged ${fish}, Pickled Radish)`] = {
      durationSeconds: fiveMin,
      ingredients: {
        [aged]: new Decimal(1),
        "Pickled Radish": new Decimal(1),
      },
      outputs: {
        "Crimson Baitfish": BAIT_OUTPUT_AGED,
      },
    };
    recipes[`Crimson Baitfish (Prime Aged ${fish}, Pickled Radish)`] = {
      durationSeconds: fiveMin,
      ingredients: {
        [primeAged]: new Decimal(1),
        "Pickled Radish": new Decimal(1),
      },
      outputs: {
        "Crimson Baitfish": BAIT_OUTPUT_PRIME,
      },
    };
    recipes[`Crimson Baitfish (Aged ${fish}, Pickled Onion)`] = {
      durationSeconds: fiveMin,
      ingredients: {
        [aged]: new Decimal(1),
        "Pickled Onion": new Decimal(1),
      },
      outputs: {
        "Crimson Baitfish": BAIT_OUTPUT_AGED,
      },
    };
    recipes[`Crimson Baitfish (Prime Aged ${fish}, Pickled Onion)`] = {
      durationSeconds: fiveMin,
      ingredients: {
        [primeAged]: new Decimal(1),
        "Pickled Onion": new Decimal(1),
      },
      outputs: {
        "Crimson Baitfish": BAIT_OUTPUT_PRIME,
      },
    };
  }

  return recipes as Record<
    BaitFermentationRecipeName,
    FermentationRecipeDefinition
  >;
}

function buildRetiredBaitFermentationRecipes(): Record<
  RetiredBaitFermentationRecipeName,
  FermentationRecipeDefinition
> {
  const recipes: Record<string, FermentationRecipeDefinition> = {};
  const fiveMin = 60 * 5;

  for (const fish of getFishNamesByTier("basic")) {
    const aged: AgedFishName = `Aged ${fish}`;
    const primeAged: PrimeAgedFishName = `Prime Aged ${fish}`;

    recipes[`Capsule Bait (Aged ${fish}, Pickled Pepper)`] = {
      durationSeconds: fiveMin,
      ingredients: {
        [aged]: new Decimal(1),
        "Pickled Pepper": new Decimal(1),
      },
      outputs: {
        "Capsule Bait": BAIT_OUTPUT_AGED,
      },
    };
    recipes[`Capsule Bait (Prime Aged ${fish}, Pickled Pepper)`] = {
      durationSeconds: fiveMin,
      ingredients: {
        [primeAged]: new Decimal(1),
        "Pickled Pepper": new Decimal(1),
      },
      outputs: {
        "Capsule Bait": BAIT_OUTPUT_PRIME,
      },
    };
  }

  for (const fish of getFishNamesByTier("advanced")) {
    const aged: AgedFishName = `Aged ${fish}`;
    const primeAged: PrimeAgedFishName = `Prime Aged ${fish}`;

    recipes[`Umbrella Bait (Aged ${fish}, Pickled Onion)`] = {
      durationSeconds: fiveMin,
      ingredients: {
        [aged]: new Decimal(1),
        "Pickled Onion": new Decimal(1),
      },
      outputs: {
        "Umbrella Bait": BAIT_OUTPUT_AGED,
      },
    };
    recipes[`Umbrella Bait (Prime Aged ${fish}, Pickled Onion)`] = {
      durationSeconds: fiveMin,
      ingredients: {
        [primeAged]: new Decimal(1),
        "Pickled Onion": new Decimal(1),
      },
      outputs: {
        "Umbrella Bait": BAIT_OUTPUT_PRIME,
      },
    };
  }

  for (const fish of getFishNamesByTier("expert")) {
    const aged: AgedFishName = `Aged ${fish}`;
    const primeAged: PrimeAgedFishName = `Prime Aged ${fish}`;

    recipes[`Crimson Baitfish (Aged ${fish}, Pickled Tomato)`] = {
      durationSeconds: fiveMin,
      ingredients: {
        [aged]: new Decimal(1),
        "Pickled Tomato": new Decimal(1),
      },
      outputs: {
        "Crimson Baitfish": BAIT_OUTPUT_AGED,
      },
    };
    recipes[`Crimson Baitfish (Prime Aged ${fish}, Pickled Tomato)`] = {
      durationSeconds: fiveMin,
      ingredients: {
        [primeAged]: new Decimal(1),
        "Pickled Tomato": new Decimal(1),
      },
      outputs: {
        "Crimson Baitfish": BAIT_OUTPUT_PRIME,
      },
    };
  }

  return recipes as Record<
    RetiredBaitFermentationRecipeName,
    FermentationRecipeDefinition
  >;
}

const BAIT_FERMENTATION_RECIPES = buildBaitFermentationRecipes();
const RETIRED_BAIT_FERMENTATION_RECIPES = buildRetiredBaitFermentationRecipes();

export const RETIRED_BAIT_FERMENTATION_RECIPE_IDS: RetiredBaitFermentationRecipeName[] =
  getKeys(RETIRED_BAIT_FERMENTATION_RECIPES);

export type StaticFermentationRecipeName =
  keyof typeof STATIC_FERMENTATION_RECIPES;

export type LegacyFermentationRecipeName =
  keyof typeof LEGACY_FERMENTATION_RECIPES;

export const LEGACY_FERMENTATION_RECIPE_IDS: LegacyFermentationRecipeName[] =
  getKeys(LEGACY_FERMENTATION_RECIPES);

/** Recipes that may be chosen when starting a new fermentation job. */
export type StartableFermentationRecipeName =
  | StaticFermentationRecipeName
  | BaitFermentationRecipeName;

/** Startable greenhouse glow / goodie variants (locked by tests). */
export const GREENHOUSE_FERMENTATION_STARTABLE_IDS = [
  "Greenhouse Glow: Pickled Tomato",
  "Greenhouse Glow: Pickled Zucchini",
  "Greenhouse Glow: Pickled Cabbage",
  "Greenhouse Goodie: Pickled Radish",
  "Greenhouse Goodie: Pickled Pepper",
  "Greenhouse Goodie: Pickled Onion",
] as const satisfies readonly StartableFermentationRecipeName[];

export type FermentationRecipeName =
  | StartableFermentationRecipeName
  | LegacyFermentationRecipeName
  | RetiredBaitFermentationRecipeName;

/**
 * Recipes that may be started from the aging shed UI. Do not add legacy or retired
 * bait entries here — use {@link getFermentationRecipe} for any known recipe id.
 */
export const STARTABLE_FERMENTATION_RECIPES: Record<
  StartableFermentationRecipeName,
  FermentationRecipeDefinition
> = {
  ...STATIC_FERMENTATION_RECIPES,
  ...BAIT_FERMENTATION_RECIPES,
};

/**
 * Full registry including legacy greenhouse and retired bait (collect-only).
 * Do **not** iterate this map for UI or new starts — use {@link FERMENTATION_RECIPE_IDS}
 * and {@link STARTABLE_FERMENTATION_RECIPES}.
 */
const ALL_FERMENTATION_RECIPES: Record<
  FermentationRecipeName,
  FermentationRecipeDefinition
> = {
  ...STARTABLE_FERMENTATION_RECIPES,
  ...RETIRED_BAIT_FERMENTATION_RECIPES,
  ...LEGACY_FERMENTATION_RECIPES,
};

export const FERMENTATION_RECIPE_IDS: StartableFermentationRecipeName[] = [
  ...getKeys(STATIC_FERMENTATION_RECIPES),
  ...getKeys(BAIT_FERMENTATION_RECIPES),
];

export const BAIT_FERMENTATION_RECIPE_IDS: BaitFermentationRecipeName[] =
  getKeys(BAIT_FERMENTATION_RECIPES);

const STARTABLE_FERMENTATION_RECIPE_ID_SET = new Set<string>(
  FERMENTATION_RECIPE_IDS,
);

export type FermentationCollectedActivity = `${InventoryItemName} Fermented`;

export function isFermentationRecipeName(
  id: string,
): id is FermentationRecipeName {
  return id in ALL_FERMENTATION_RECIPES;
}

export function isStartableFermentationRecipeName(
  id: string,
): id is StartableFermentationRecipeName {
  return STARTABLE_FERMENTATION_RECIPE_ID_SET.has(id);
}

export function getFermentationRecipe(
  name: FermentationRecipeName,
): FermentationRecipeDefinition {
  return ALL_FERMENTATION_RECIPES[name];
}

/** Fermentation rack slots: one per Aging Shed level, max 6. */
export function getMaxFermentationSlots(level: number): number {
  if (level < 1) {
    return 1;
  }

  return Math.min(level, 6);
}
