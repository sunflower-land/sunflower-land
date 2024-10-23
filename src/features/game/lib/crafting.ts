import { BumpkinItem } from "../types/bumpkin";
import { BedName, InventoryItemName } from "../types/game";

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
