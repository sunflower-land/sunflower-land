import cloneDeep from "lodash.clonedeep";
import { Inventory, GameState, AnimalFoodName } from "features/game/types/game";

export type FeedMixedAction = {
  type: "feed.mixed";
  feed: AnimalFoodName;
  amount?: number;
};

export interface Feed {
  name: AnimalFoodName;
  description: string;
  ingredients: Inventory;
  coins: number; // coins
  disabled?: boolean;
}

type Options = {
  state: Readonly<GameState>;
  action: FeedMixedAction;
};

export const ANIMAL_FOODS: Record<AnimalFoodName, Feed> = {
  Hay: {
    name: "Hay",
    description: "",
    coins: 10,
    ingredients: {},
  },
  "Kernel Blend": {
    name: "Kernel Blend",
    description: "",
    coins: 10,
    ingredients: {},
  },
  NutriBarley: {
    name: "NutriBarley",
    description: "",
    coins: 10,
    ingredients: {},
  },
  "Mixed Grain": {
    name: "Mixed Grain",
    description: "",
    coins: 10,
    ingredients: {},
  },
};

export function feedMixed({ state, action }: Options) {
  const stateCopy: GameState = cloneDeep(state);

  return stateCopy;
}
