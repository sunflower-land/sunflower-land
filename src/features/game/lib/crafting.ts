import { hasFeatureAccess } from "lib/flags";
import { BumpkinItem } from "../types/bumpkin";
import {
  BedName,
  GameState,
  InventoryItemName,
  RecipeCraftableName,
} from "../types/game";

export type RecipeCollectibleName = Extract<
  | "Dirt Path"
  | "Fence"
  | "Stone Fence"
  | "Toadstool Seat"
  | "White Tulips"
  | "Potted Sunflower"
  | "Potted Potato"
  | "Potted Pumpkin"
  | "Basic Bear"
  | "Bonnie's Tombstone"
  | "Grubnash's Tombstone"
  | "Town Sign"
  | "Field Maple"
  | "Red Maple"
  | "Crimson Cap"
  | "Chestnut Fungi Stool"
  | "Mahogany Cap"
  | "Golden Maple"
  | RecipeCraftableName
  | BedName,
  InventoryItemName
>;

export type RecipeWearableName = Extract<
  | "Basic Hair"
  | "Rancher Hair"
  | "Red Farmer Shirt"
  | "Farmer Pants"
  | "Farmer Overalls"
  | "Lumberjack Overalls",
  BumpkinItem
>;

export type RecipeItemName = RecipeCollectibleName | RecipeWearableName;

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
} & (
  | { name: RecipeCollectibleName; type: "collectible" }
  | { name: RecipeWearableName; type: "wearable" }
);

export type Recipes = Record<RecipeItemName, Recipe>;

export const RECIPES_OLD: Recipes = {
  "Dirt Path": {
    name: "Dirt Path",
    ingredients: [],
    time: 0,
    type: "collectible",
  },
  Fence: {
    name: "Fence",
    ingredients: [],
    time: 0,
    type: "collectible",
  },
  "Stone Fence": {
    name: "Stone Fence",
    ingredients: [],
    time: 0,
    type: "collectible",
  },
  "Toadstool Seat": {
    name: "Toadstool Seat",
    ingredients: [],
    time: 0,
    type: "collectible",
  },
  "White Tulips": {
    name: "White Tulips",
    ingredients: [],
    time: 0,
    type: "collectible",
  },
  "Potted Sunflower": {
    name: "Potted Sunflower",
    ingredients: [],
    time: 0,
    type: "collectible",
  },
  "Potted Potato": {
    name: "Potted Potato",
    ingredients: [],
    time: 0,
    type: "collectible",
  },
  "Potted Pumpkin": {
    name: "Potted Pumpkin",
    ingredients: [],
    time: 0,
    type: "collectible",
  },
  "Basic Bear": {
    name: "Basic Bear",
    ingredients: [],
    time: 0,
    type: "collectible",
  },
  "Bonnie's Tombstone": {
    name: "Bonnie's Tombstone",
    ingredients: [],
    time: 0,
    type: "collectible",
  },
  "Grubnash's Tombstone": {
    name: "Grubnash's Tombstone",
    ingredients: [],
    time: 0,
    type: "collectible",
  },
  "Town Sign": {
    name: "Town Sign",
    ingredients: [],
    time: 0,
    type: "collectible",
  },
  "Basic Hair": {
    name: "Basic Hair",
    ingredients: [],
    time: 0,
    type: "wearable",
  },
  "Rancher Hair": {
    name: "Rancher Hair",
    ingredients: [],
    time: 0,
    type: "wearable",
  },
  "Red Farmer Shirt": {
    name: "Red Farmer Shirt",
    ingredients: [],
    time: 0,
    type: "wearable",
  },
  "Farmer Pants": {
    name: "Farmer Pants",
    ingredients: [],
    time: 0,
    type: "wearable",
  },
  "Farmer Overalls": {
    name: "Farmer Overalls",
    ingredients: [],
    time: 0,
    type: "wearable",
  },
  "Lumberjack Overalls": {
    name: "Lumberjack Overalls",
    ingredients: [],
    time: 0,
    type: "wearable",
  },
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
    time: 0,
    type: "collectible",
  },
  "Fisher Bed": {
    name: "Fisher Bed",
    ingredients: [],
    time: 0,
    type: "collectible",
  },
  "Floral Bed": {
    name: "Floral Bed",
    ingredients: [],
    time: 0,
    type: "collectible",
  },
  "Sturdy Bed": {
    name: "Sturdy Bed",
    ingredients: [],
    time: 0,
    type: "collectible",
  },
  "Desert Bed": {
    name: "Desert Bed",
    ingredients: [],
    time: 0,
    type: "collectible",
  },
  "Cow Bed": {
    name: "Cow Bed",
    ingredients: [],
    time: 0,
    type: "collectible",
  },
  "Pirate Bed": {
    name: "Pirate Bed",
    ingredients: [],
    time: 0,
    type: "collectible",
  },
  "Royal Bed": {
    name: "Royal Bed",
    ingredients: [],
    time: 0,
    type: "collectible",
  },
  "Golden Maple": {
    name: "Golden Maple",
    ingredients: [],
    time: 0,
    type: "collectible",
  },
  "Crimson Cap": {
    name: "Crimson Cap",
    ingredients: [],
    time: 30 * 60 * 1000,
    type: "collectible",
  },
  "Chestnut Fungi Stool": {
    name: "Chestnut Fungi Stool",
    ingredients: [],
    time: 30 * 60 * 1000,
    type: "collectible",
  },
  "Mahogany Cap": {
    name: "Mahogany Cap",
    ingredients: [],
    time: 30 * 60 * 1000,
    type: "collectible",
  },
  "Field Maple": {
    name: "Field Maple",
    ingredients: [],
    time: 30 * 60 * 1000,
    type: "collectible",
  },
  "Red Maple": {
    name: "Red Maple",
    ingredients: [],
    time: 30 * 60 * 1000,
    type: "collectible",
  },
};

export const RECIPES_REVISED: Record<
  Exclude<RecipeCollectibleName, "Dirt Path" | "Fence" | "Stone Fence">,
  Recipe
> = {
  "Toadstool Seat": {
    name: "Toadstool Seat",
    ingredients: [],
    time: 0,
    type: "collectible",
  },
  "White Tulips": {
    name: "White Tulips",
    ingredients: [],
    time: 0,
    type: "collectible",
  },
  "Potted Sunflower": {
    name: "Potted Sunflower",
    ingredients: [],
    time: 0,
    type: "collectible",
  },
  "Potted Potato": {
    name: "Potted Potato",
    ingredients: [],
    time: 0,
    type: "collectible",
  },
  "Potted Pumpkin": {
    name: "Potted Pumpkin",
    ingredients: [],
    time: 0,
    type: "collectible",
  },
  "Basic Bear": {
    name: "Basic Bear",
    ingredients: [],
    time: 0,
    type: "collectible",
  },
  "Bonnie's Tombstone": {
    name: "Bonnie's Tombstone",
    ingredients: [],
    time: 0,
    type: "collectible",
  },
  "Grubnash's Tombstone": {
    name: "Grubnash's Tombstone",
    ingredients: [],
    time: 0,
    type: "collectible",
  },
  "Town Sign": {
    name: "Town Sign",
    ingredients: [],
    time: 0,
    type: "collectible",
  },
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
    time: 0,
    type: "collectible",
  },
  "Fisher Bed": {
    name: "Fisher Bed",
    ingredients: [],
    time: 0,
    type: "collectible",
  },
  "Floral Bed": {
    name: "Floral Bed",
    ingredients: [],
    time: 0,
    type: "collectible",
  },
  "Sturdy Bed": {
    name: "Sturdy Bed",
    ingredients: [],
    time: 0,
    type: "collectible",
  },
  "Desert Bed": {
    name: "Desert Bed",
    ingredients: [],
    time: 0,
    type: "collectible",
  },
  "Cow Bed": {
    name: "Cow Bed",
    ingredients: [],
    time: 0,
    type: "collectible",
  },
  "Pirate Bed": {
    name: "Pirate Bed",
    ingredients: [],
    time: 0,
    type: "collectible",
  },
  "Royal Bed": {
    name: "Royal Bed",
    ingredients: [],
    time: 0,
    type: "collectible",
  },
  "Golden Maple": {
    name: "Golden Maple",
    ingredients: [],
    time: 0,
    type: "collectible",
  },
  "Crimson Cap": {
    name: "Crimson Cap",
    ingredients: [],
    time: 30 * 60 * 1000,
    type: "collectible",
  },
  "Chestnut Fungi Stool": {
    name: "Chestnut Fungi Stool",
    ingredients: [],
    time: 30 * 60 * 1000,
    type: "collectible",
  },
  "Mahogany Cap": {
    name: "Mahogany Cap",
    ingredients: [],
    time: 30 * 60 * 1000,
    type: "collectible",
  },
  "Field Maple": {
    name: "Field Maple",
    ingredients: [],
    time: 30 * 60 * 1000,
    type: "collectible",
  },
  "Red Maple": {
    name: "Red Maple",
    ingredients: [],
    time: 30 * 60 * 1000,
    type: "collectible",
  },
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

export const RECIPES = (game: GameState): Partial<Recipes> => {
  if (hasFeatureAccess(game, "CRAFTING")) {
    return RECIPES_REVISED;
  }
  return RECIPES_OLD;
};
