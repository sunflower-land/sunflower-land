import Decimal from "decimal.js-light";
import { BuildingName } from "features/game/types/buildings";
import { GameState, Inventory } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

// TODO move into new directory Romy and Craig are working on
export type ConsumableName = "Boiled Egg";
export type Consumable = {
  name: ConsumableName;
  ingredients: Inventory;
  cookingSeconds: number;
  building: BuildingName;
};

export const CONSUMABLES: Record<ConsumableName, Consumable> = {
  "Boiled Egg": {
    name: "Boiled Egg",
    building: "Fire Pit",
    cookingSeconds: 60,
    ingredients: {
      Egg: new Decimal(1),
    },
  },
};

export type CookAction = {
  type: "recipe.cooked";
  name: ConsumableName;
};

type Options = {
  state: Readonly<GameState>;
  action: CookAction;
  createdAt?: number;
};

export function cook({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const game = cloneDeep(state);

  return {
    ...game,
  };
}
