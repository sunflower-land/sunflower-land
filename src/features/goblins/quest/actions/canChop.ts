import { Context } from "features/game/lib/goblinMachine";

export const canChopAncientTree = (context: Context) => {
  return (
    context.limitedItems["Goblin Key"]?.ingredients?.every((ingredient) =>
      ingredient.amount.lessThanOrEqualTo(
        context.state.inventory[ingredient.item] || 0
      )
    ) && !!context.state.inventory["Apprentice Beaver"]
  );
};

export const getAncientTreeIngredients = (context: Context) =>
  context.limitedItems["Goblin Key"]?.ingredients;
