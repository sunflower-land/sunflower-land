import { Context } from "features/game/lib/goblinMachine";

export const canMineAncientRock = (context: Context) => {
  const hasIngredients = context.limitedItems[
    "Sunflower Key"
  ]?.ingredients?.every((ingredient) =>
    ingredient.amount.lessThanOrEqualTo(
      context.state.inventory[ingredient.item] || 0
    )
  );

  const hasMole =
    !!context.state.inventory["Rocky the Mole"] ||
    !!context.state.inventory["Nugget"];

  return hasIngredients && hasMole;
};

export const getAncientRockIngredients = (context: Context) =>
  context.limitedItems["Sunflower Key"]?.ingredients;
