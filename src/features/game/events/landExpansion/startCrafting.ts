import Decimal from "decimal.js-light";
import { Recipe, RecipeIngredient, Recipes } from "features/game/lib/crafting";
import { BoostName, GameState } from "features/game/types/game";
import { produce } from "immer";
import { isWearableActive } from "features/game/lib/wearables";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";
import { getCountAndType } from "features/island/hud/components/inventory/utils/inventory";

export type StartCraftingAction = {
  type: "crafting.started";
  ingredients: (RecipeIngredient | null)[];
};

type Options = {
  state: Readonly<GameState>;
  action: StartCraftingAction;
  createdAt?: number;
};

export function getBoostedCraftingTime({
  game,
  time,
}: {
  game: GameState;
  time: number;
}) {
  let seconds = time;
  const boostsUsed: BoostName[] = [];

  // Sol & Luna 50% Crafting Speed
  if (isWearableActive({ name: "Sol & Luna", game })) {
    seconds *= 0.5;
    boostsUsed.push("Sol & Luna");
  }

  if (isWearableActive({ name: "Architect Ruler", game })) {
    seconds *= 0.75;
    boostsUsed.push("Architect Ruler");
  }

  return { seconds, boostsUsed };
}

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

          const { count: availableCollectibleCount } = getCountAndType(
            copy,
            ingredient.collectible,
          );

          if (availableCollectibleCount.lt(1)) {
            throw new Error(
              "You do not have the ingredients to craft this item",
            );
          }
          copy.inventory[ingredient.collectible] = inventoryCount.minus(1);
        }

        if (ingredient.wearable) {
          const wardrobeCount = copy.wardrobe[ingredient.wearable] ?? 0;
          const { count: availableWardrobeCount } = getCountAndType(
            copy,
            ingredient.wearable,
          );

          if (availableWardrobeCount.lt(1)) {
            throw new Error(
              "You do not have the ingredients to craft this item",
            );
          }
          copy.wardrobe[ingredient.wearable] = wardrobeCount - 1;
        }
      }
    });

    const { seconds: recipeTime, boostsUsed } = getBoostedCraftingTime({
      game: state,
      time: recipe.time,
    });

    copy.craftingBox = {
      status: "crafting",
      startedAt: createdAt,
      readyAt: createdAt + recipeTime,
      item:
        recipe.type === "collectible"
          ? { collectible: recipe.name }
          : { wearable: recipe.name },
      recipes: {
        ...copy.craftingBox.recipes,
        [recipe.name]: recipe,
      },
    };

    copy.boostsUsedAt = updateBoostUsed({
      game: copy,
      boostNames: boostsUsed,
      createdAt,
    });

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
