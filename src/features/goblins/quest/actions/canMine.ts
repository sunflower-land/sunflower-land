import { Context } from "features/game/lib/goblinMachine";

export const canMineAncientRock = (context: Context) => {
  return (
    context.limitedItems["Sunflower Key"]?.ingredients?.every((ingredient) =>
      ingredient.amount.lessThanOrEqualTo(
        context.state.inventory[ingredient.item] || 0
      )
    ) && !!context.state.inventory["Rocky the Mole"]
  );
};

export const getAncientRockIngredients = (context: Context) =>
  context.limitedItems["Sunflower Key"]?.ingredients;
