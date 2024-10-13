import cloneDeep from "lodash.clonedeep";
import Decimal from "decimal.js-light";
import { trackActivity } from "features/game/types/bumpkinActivity";
import { getKeys } from "features/game/types/decorations";
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
  const bumpkin = stateCopy.bumpkin;

  const feed = ANIMAL_FOODS[action.feed];
  const amount = action.amount ?? 1;

  if (!feed) {
    throw new Error("Feed does not exist");
  }

  if (!bumpkin) {
    throw new Error("You do not have a bumpkin!");
  }

  const { coins } = feed;

  if (stateCopy.coins < coins) {
    throw new Error("Insufficient Coins");
  }

  const subtractedInventory = getKeys(feed.ingredients).reduce(
    (inventory, ingredientName) => {
      const count = inventory[ingredientName] || new Decimal(0);
      const totalAmount =
        feed.ingredients[ingredientName]?.mul(amount) || new Decimal(0);

      if (count.lessThan(totalAmount)) {
        throw new Error(`Insufficient ingredient: ${ingredientName}`);
      }

      return {
        ...inventory,
        [ingredientName]: count.sub(totalAmount),
      };
    },
    stateCopy.inventory,
  );

  const oldAmount = stateCopy.inventory[action.feed] || new Decimal(0);

  bumpkin.activity = trackActivity(
    `${action.feed} Mixed`,
    bumpkin.activity,
    new Decimal(amount),
  );
  bumpkin.activity = trackActivity(
    "Coins Spent",
    bumpkin.activity,
    new Decimal(coins),
  );
  stateCopy.coins -= coins;
  stateCopy.inventory = {
    ...subtractedInventory,
    [action.feed]: oldAmount.add(amount) as Decimal,
  };

  return stateCopy;
}
