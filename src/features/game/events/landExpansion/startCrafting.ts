import Decimal from "decimal.js-light";
import { RecipeItemName } from "features/game/lib/crafting";
import { getKeys } from "features/game/types/craftables";
import { GameState, InventoryItemName } from "features/game/types/game";
import { produce } from "immer";

export type StartCraftingAction = {
  type: "crafting.started";
  ingredients: (InventoryItemName | null)[];
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
    const craftedItem = findMatchingRecipe(
      ingredients,
      copy.craftingBox.recipes,
    );
    if (!craftedItem) {
      copy.craftingBox.status = "pending";
      copy.craftingBox.startedAt = createdAt;
      copy.craftingBox.readyAt = createdAt;
      return;
    }

    // Subtract the ingredients from the player's inventory
    ingredients.forEach((ingredient) => {
      if (ingredient) {
        const inventoryCount = copy.inventory[ingredient] ?? new Decimal(0);
        if (inventoryCount.lte(1)) {
          throw new Error("You do not have the ingredients to craft this item");
        }
        copy.inventory[ingredient] = inventoryCount.minus(1);
      }
    });

    copy.craftingBox = {
      status: "crafting",
      startedAt: createdAt,
      readyAt: createdAt + copy.craftingBox.recipes[craftedItem]!.time,
      item: craftedItem,
      recipes: {
        ...copy.craftingBox.recipes,
        [craftedItem]: copy.craftingBox.recipes[craftedItem]!,
      },
    };
  });
}

// Updated function to find matching recipe
function findMatchingRecipe(
  ingredients: (InventoryItemName | null)[],
  recipes: GameState["craftingBox"]["recipes"],
): RecipeItemName | undefined {
  return getKeys(recipes).find(
    (item) =>
      recipes[item]?.ingredients.every(
        (ingredient, i) => ingredient === ingredients[i],
      ) &&
      recipes[item]?.ingredients
        .slice(recipes[item]?.ingredients.length)
        .every((item) => item === null),
  );
}
