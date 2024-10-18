import { InventoryItemName } from "../types/game";

export type RecipeItemName = Extract<
  "Dirt Path" | "Fence" | "Stone Fence",
  InventoryItemName
>;

export type Recipe = {
  ingredients: (InventoryItemName | null)[];
  time: number;
};
export type Recipes = Record<RecipeItemName, Recipe>;
