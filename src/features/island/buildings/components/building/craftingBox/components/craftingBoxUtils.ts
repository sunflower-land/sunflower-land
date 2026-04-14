import {
  Recipe,
  RecipeCollectibleName,
  RecipeIngredient,
  Recipes,
  RECIPES,
} from "features/game/lib/crafting";
import { BumpkinItem } from "features/game/types/bumpkin";

const EMPTY_INGREDIENTS = Array(9).fill(null) as (RecipeIngredient | null)[];

export type RecipeName = RecipeCollectibleName | BumpkinItem;

/**
 * Pads recipe ingredients to exactly 9 slots for the crafting grid.
 */
export function padRecipeIngredients(
  recipe: Recipe | null | undefined,
): (RecipeIngredient | null)[] {
  if (!recipe?.ingredients) return EMPTY_INGREDIENTS;
  return [...recipe.ingredients, ...EMPTY_INGREDIENTS].slice(0, 9);
}

/**
 * Looks up a recipe by name and returns padded ingredients for the crafting grid.
 */
export function getRecipeIngredientsForName(
  recipeName: RecipeName,
  recipes: Partial<Recipes>,
  fallbackRecipes: Recipes = RECIPES,
): (RecipeIngredient | null)[] {
  const recipe =
    recipes[recipeName as RecipeCollectibleName] ??
    fallbackRecipes[recipeName as RecipeCollectibleName];
  return padRecipeIngredients(recipe);
}
