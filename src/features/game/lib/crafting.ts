import { BumpkinItem } from "../types/bumpkin";
import { BedName, InventoryItemName, RecipeCraftableName } from "../types/game";
/**
 * getKeys is a ref to Object.keys, but the return is typed literally.
 */
export const getKeys = Object.keys as <T extends object>(
  obj: T,
) => Array<keyof T>;

export type DollName =
  | "Doll"
  | "Buzz Doll"
  | "Lunar Doll"
  | "Juicy Doll"
  | "Crude Doll"
  | "Cluck Doll"
  | "Wooly Doll"
  | "Moo Doll"
  | "Bloom Doll"
  | "Shadow Doll"
  | "Ember Doll"
  | "Gilded Doll"
  | "Lumber Doll"
  | "Harvest Doll"
  | "Sizzle Doll"
  | "Angler Doll"
  | "Dune Doll"
  | "Mouse Doll"
  | "Grubby Doll"
  | "Nefari Doll"
  | "Frosty Doll"
  | "Cosmo Doll"
  | "Bigfin Doll"
  | "Solar Doll";

export const DOLLS: Record<DollName, object> = {
  Doll: {},
  "Buzz Doll": {},
  "Lunar Doll": {},
  "Juicy Doll": {},
  "Crude Doll": {},
  "Cluck Doll": {},
  "Wooly Doll": {},
  "Moo Doll": {},
  "Bloom Doll": {},
  "Shadow Doll": {},
  "Ember Doll": {},
  "Gilded Doll": {},
  "Lumber Doll": {},
  "Harvest Doll": {},
  "Sizzle Doll": {},
  "Angler Doll": {},
  "Dune Doll": {},
  "Mouse Doll": {},
  "Grubby Doll": {},
  "Nefari Doll": {},
  "Frosty Doll": {},
  "Cosmo Doll": {},
  "Bigfin Doll": {},
  "Solar Doll": {},
};

export type RecipeCollectibleName = Extract<
  RecipeCraftableName | Exclude<BedName, "Double Bed" | "Messy Bed"> | DollName,
  InventoryItemName
>;

export type RecipeIngredient =
  | {
      collectible?: never;
      wearable: BumpkinItem;
    }
  | {
      collectible: InventoryItemName;
      wearable?: never;
    };

export type Recipe = {
  ingredients: (RecipeIngredient | null)[];
  time: number;
  seed?: number; // seed to determine prng for crafting time
} & (
  | { name: RecipeCollectibleName; type: "collectible" }
  | { name: BumpkinItem; type: "wearable" }
);

export type Recipes = Record<RecipeCollectibleName, Recipe>;

const DOLL_RECIPES = getKeys(DOLLS).reduce<Record<DollName, Recipe>>(
  (acc, doll) => {
    if (doll === "Doll") {
      acc[doll] = {
        name: doll,
        ingredients: [],
        time: 2 * 60 * 60 * 1000,
        type: "collectible",
      };
      return acc;
    }

    acc[doll] = {
      name: doll,
      ingredients: [],
      time: 8 * 60 * 60 * 1000,
      type: "collectible",
    };

    return acc;
  },
  {} as Record<DollName, Recipe>,
);

export const RECIPES: Recipes = {
  Cushion: {
    name: "Cushion",
    ingredients: [],
    time: 0,
    type: "collectible",
  },
  Timber: {
    name: "Timber",
    ingredients: [],
    time: 0,
    type: "collectible",
  },
  "Bee Box": {
    name: "Bee Box",
    ingredients: [],
    time: 0,
    type: "collectible",
  },
  Crimsteel: {
    name: "Crimsteel",
    ingredients: [],
    time: 0,
    type: "collectible",
  },
  "Merino Cushion": {
    name: "Merino Cushion",
    ingredients: [],
    time: 0,
    type: "collectible",
  },
  "Kelp Fibre": {
    name: "Kelp Fibre",
    ingredients: [],
    time: 0,
    type: "collectible",
  },
  "Hardened Leather": {
    name: "Hardened Leather",
    ingredients: [],
    time: 0,
    type: "collectible",
  },
  "Synthetic Fabric": {
    name: "Synthetic Fabric",
    ingredients: [],
    time: 0,
    type: "collectible",
  },
  "Ocean's Treasure": {
    name: "Ocean's Treasure",
    ingredients: [],
    time: 0,
    type: "collectible",
  },
  "Royal Bedding": {
    name: "Royal Bedding",
    ingredients: [],
    time: 0,
    type: "collectible",
  },
  "Royal Ornament": {
    name: "Royal Ornament",
    ingredients: [],
    time: 0,
    type: "collectible",
  },
  "Basic Bed": {
    name: "Basic Bed",
    ingredients: [],
    time: 8 * 60 * 60 * 1000,
    type: "collectible",
  },
  "Fisher Bed": {
    name: "Fisher Bed",
    ingredients: [],
    time: 8 * 60 * 60 * 1000,
    type: "collectible",
  },
  "Floral Bed": {
    name: "Floral Bed",
    ingredients: [],
    time: 8 * 60 * 60 * 1000,
    type: "collectible",
  },
  "Sturdy Bed": {
    name: "Sturdy Bed",
    ingredients: [],
    time: 8 * 60 * 60 * 1000,
    type: "collectible",
  },
  "Desert Bed": {
    name: "Desert Bed",
    ingredients: [],
    time: 8 * 60 * 60 * 1000,
    type: "collectible",
  },
  "Cow Bed": {
    name: "Cow Bed",
    ingredients: [],
    time: 8 * 60 * 60 * 1000,
    type: "collectible",
  },
  "Pirate Bed": {
    name: "Pirate Bed",
    ingredients: [],
    time: 8 * 60 * 60 * 1000,
    type: "collectible",
  },
  "Royal Bed": {
    name: "Royal Bed",
    ingredients: [],
    time: 8 * 60 * 60 * 1000,
    type: "collectible",
  },

  ...DOLL_RECIPES,
};

export const RECIPE_CRAFTABLES: Record<RecipeCraftableName, null> = {
  Cushion: null,
  Timber: null,
  "Bee Box": null,
  Crimsteel: null,
  "Merino Cushion": null,
  "Kelp Fibre": null,
  "Hardened Leather": null,
  "Synthetic Fabric": null,
  "Ocean's Treasure": null,
  "Royal Bedding": null,
  "Royal Ornament": null,
};
