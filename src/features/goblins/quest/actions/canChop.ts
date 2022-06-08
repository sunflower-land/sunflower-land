import { Context } from "features/game/lib/goblinMachine";

export const canChopAncientTree = (context: Context) => {
  const hasIngredients = context.limitedItems["Goblin Key"]?.ingredients?.every(
    (ingredient) =>
      ingredient.amount.lessThanOrEqualTo(
        context.state.inventory[ingredient.item] || 0
      )
  );

  const hasBeaver =
    !!context.state.inventory["Apprentice Beaver"] ||
    !!context.state.inventory["Foreman Beaver"];

  return hasIngredients && hasBeaver;
};

export const getAncientTreeIngredients = (context: Context) =>
  context.limitedItems["Goblin Key"]?.ingredients;
