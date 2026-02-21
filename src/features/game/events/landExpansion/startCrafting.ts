import Decimal from "decimal.js-light";
import {
  Recipe,
  RecipeCollectibleName,
  RecipeIngredient,
  Recipes,
} from "features/game/lib/crafting";
import {
  BoostName,
  CraftingQueueItem,
  GameState,
  InventoryItemName,
} from "features/game/types/game";
import { hasVipAccess } from "features/game/lib/vipAccess";
import { produce } from "immer";
import { isWearableActive } from "features/game/lib/wearables";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";
import { getCountAndType } from "features/island/hud/components/inventory/utils/inventory";
import { isTemporaryCollectibleActive } from "features/game/lib/collectibleBuilt";
import { KNOWN_IDS } from "features/game/types";
import { ITEM_IDS, BumpkinItem } from "features/game/types/bumpkin";
import { prngChance } from "lib/prng";

export type StartCraftingAction = {
  type: "crafting.started";
  ingredients: (RecipeIngredient | null)[];
};

type Options = {
  state: Readonly<GameState>;
  action: StartCraftingAction;
  farmId: number;
  createdAt?: number;
};

export function getBoostedCraftingTime({
  game,
  time,
  prngArgs,
}: {
  game: GameState;
  time: number;
  prngArgs?: { farmId: number; itemId: number; counter: number };
}) {
  let seconds = time;
  const boostsUsed: { name: BoostName; value: string }[] = [];

  if (isTemporaryCollectibleActive({ name: "Fox Shrine", game })) {
    if (
      prngArgs &&
      prngChance({
        ...prngArgs,
        chance: 10,
        criticalHitName: "Fox Shrine",
      })
    ) {
      seconds *= 0;
      boostsUsed.push({ name: "Fox Shrine", value: "x0" });
      return { seconds, boostsUsed };
    } else {
      seconds *= 0.75;
      boostsUsed.push({ name: "Fox Shrine", value: "x0.75" });
    }
  }

  // Sol & Luna 50% Crafting Speed
  if (isWearableActive({ name: "Sol & Luna", game })) {
    seconds *= 0.5;
    boostsUsed.push({ name: "Sol & Luna", value: "x0.5" });
  }

  if (isWearableActive({ name: "Architect Ruler", game })) {
    seconds *= 0.75;
    boostsUsed.push({ name: "Architect Ruler", value: "x0.75" });
  }

  if (
    isTemporaryCollectibleActive({ name: "Time Warp Totem", game }) ||
    isTemporaryCollectibleActive({ name: "Super Totem", game })
  ) {
    seconds *= 0.5;
    if (isTemporaryCollectibleActive({ name: "Time Warp Totem", game })) {
      boostsUsed.push({ name: "Time Warp Totem", value: "x0.5" });
    } else if (isTemporaryCollectibleActive({ name: "Super Totem", game })) {
      boostsUsed.push({ name: "Super Totem", value: "x0.5" });
    }
  }

  return { seconds, boostsUsed };
}

export function startCrafting({
  state,
  action,
  farmId,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (copy) => {
    const { ingredients } = action;

    if (ingredients.length !== 9) {
      throw new Error("You must provide 9 ingredients");
    }

    // Check if player has the Crafting Box
    const isBuildingBuilt = copy.buildings["Crafting Box"]?.some(
      (building) => !!building.coordinates,
    );
    if (!isBuildingBuilt) {
      throw new Error("You do not have a Crafting Box");
    }

    const queue = copy.craftingBox.queue ?? [];
    const availableSlots = hasVipAccess({ game: copy }) ? 4 : 1;

    if (queue.length >= availableSlots) {
      throw new Error("No available slots");
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

    const recipeStartAt =
      queue.length > 0 ? queue[queue.length - 1].readyAt : createdAt;

    const { seconds: recipeTime, boostsUsed } = getBoostedCraftingTime({
      game: state,
      time: recipe.time,
      prngArgs: {
        farmId,
        itemId:
          recipe.type === "collectible"
            ? KNOWN_IDS[recipe.name as InventoryItemName]
            : ITEM_IDS[recipe.name as BumpkinItem],
        counter: state.farmActivity[`${recipe.name} Crafted`] ?? 0,
      },
    });

    const readyAt = recipeStartAt + recipeTime;

    const newQueueItem: CraftingQueueItem = {
      name: recipe.name,
      readyAt,
      startedAt: recipeStartAt,
      type: recipe.type,
    };

    const updatedQueue = [...queue, newQueueItem];
    const currentItem = updatedQueue[0];

    copy.craftingBox = {
      status: "crafting",
      queue: updatedQueue,
      startedAt: currentItem.startedAt,
      readyAt: currentItem.readyAt,
      item:
        currentItem.type === "collectible"
          ? { collectible: currentItem.name as RecipeCollectibleName }
          : { wearable: currentItem.name as BumpkinItem },
      recipes: {
        ...copy.craftingBox.recipes,
        [recipe.name]: { ...recipe },
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
