import Decimal from "decimal.js-light";
import { Recipe, RecipeIngredient, Recipes } from "features/game/lib/crafting";
import { CollectibleName } from "features/game/types/craftables";
import { GameState } from "features/game/types/game";
import { produce } from "immer";
import { availableWardrobe } from "./equip";

export type StartCraftingAction = {
  type: "crafting.started";
  ingredients: (RecipeIngredient | null)[];
};

type Options = {
  state: Readonly<GameState>;
  action: StartCraftingAction;
  createdAt?: number;
};

export function startCrafting({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (copy) => {
    const { ingredients } = action;

    if (ingredients.length !== 9) {
      throw new Error("You must provide 9 ingredients");
    }

    // Check if player has the Crafting Box
    const isBuildingBuilt = (copy.buildings["Crafting Box"]?.length ?? 0) > 0;
    if (!isBuildingBuilt) {
      throw new Error("You do not have a Crafting Box");
    }

    // Check if there's an ongoing crafting
    if (
      copy.craftingBox.status === "pending" ||
      copy.craftingBox.status === "crafting"
    ) {
      throw new Error("There's already an ongoing crafting");
    }

    // Find matching recipe
    const recipe = findMatchingRecipe(ingredients, copy.craftingBox.recipes);
    if (!recipe) {
      copy.craftingBox.status = "pending";
      copy.craftingBox.startedAt = createdAt;
      copy.craftingBox.readyAt = createdAt;
      return;
    }

    // Subtract the ingredients from the player's inventory
    ingredients.forEach((ingredient) => {
      if (ingredient) {
        if (ingredient.collectible) {
          const inventoryCount =
            copy.inventory[ingredient.collectible] ?? new Decimal(0);

          const placedCount =
            (copy.collectibles[ingredient.collectible as CollectibleName]
              ?.length ?? 0) +
            (copy.home?.collectibles[ingredient.collectible as CollectibleName]
              ?.length ?? 0);

          if (inventoryCount.sub(placedCount).lt(1)) {
            throw new Error(
              "You do not have the ingredients to craft this item",
            );
          }
          copy.inventory[ingredient.collectible] = inventoryCount.minus(1);
        }

        if (ingredient.wearable) {
          const wardrobeCount = copy.wardrobe[ingredient.wearable] ?? 0;
          const available = availableWardrobe(copy);
          const availableWardrobeCount = available[ingredient.wearable] ?? 0;

          if (availableWardrobeCount < 1) {
            throw new Error(
              "You do not have the ingredients to craft this item",
            );
          }
          copy.wardrobe[ingredient.wearable] = wardrobeCount - 1;
        }
      }
    });

    copy.craftingBox = {
      status: "crafting",
      startedAt: createdAt,
      readyAt: createdAt + recipe.time,
      item:
        recipe.type === "collectible"
          ? { collectible: recipe.name }
          : { wearable: recipe.name },
      recipes: {
        ...copy.craftingBox.recipes,
        [recipe.name]: recipe,
      },
    };

    return copy;
  });
}

export function findMatchingRecipe(
  ingredients: (RecipeIngredient | null)[],
  recipes: Partial<Recipes>,
): Recipe | undefined {
  for (const recipe of Object.values(recipes)) {
    // Check if every ingredient matches
    const ingredientsMatch = recipe.ingredients.every(
      (recipeIngredient, index) => {
        const playerIngredient = ingredients[index];

        if (recipeIngredient === null && playerIngredient === null) {
          return true;
        }

        if (recipeIngredient === null || playerIngredient === null) {
          return false;
        }

        if (
          "collectible" in recipeIngredient &&
          "collectible" in playerIngredient
        ) {
          return recipeIngredient.collectible === playerIngredient.collectible;
        }

        if ("wearable" in recipeIngredient && "wearable" in playerIngredient) {
          return recipeIngredient.wearable === playerIngredient.wearable;
        }

        return false;
      },
    );

    // Check if the recipe is padded with nulls up to 9
    const isPaddedCorrectly = ingredients
      .slice(recipe.ingredients.length)
      .every((item) => item === null);

    if (ingredientsMatch && isPaddedCorrectly) {
      return recipe;
    }
  }

  return undefined;
}
