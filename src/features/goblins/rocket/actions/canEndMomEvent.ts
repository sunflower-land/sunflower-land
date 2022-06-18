import { Context } from "features/game/lib/goblinMachine";

export const canEndMomEvent = (context: Context) => {
  const canEndEvent =
    !context.state.inventory["Telescope"] &&
    (!!context.state.inventory["Engine Core"] ||
      !!context.state.inventory["Observatory"]);
  return canEndEvent;
};

export const getTelescopeIngredients = (context: Context) =>
  context.limitedItems["Telescope"]?.ingredients;
