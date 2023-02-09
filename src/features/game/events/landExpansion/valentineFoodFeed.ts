import Decimal from "decimal.js-light";
import { GameState } from "features/game/types/game";
import {
  ValentineFoodName,
  VALENTINE_CONSUMABLES,
} from "features/game/types/valentine";
import cloneDeep from "lodash.clonedeep";

export type feedValentineFoodAction = {
  type: "valentineFood.feed";
  food: ValentineFoodName;
};

type Options = {
  state: Readonly<GameState>;
  action: feedValentineFoodAction;
};

export const FEED_VALENTINE_FOOD_ERRORS = {
  NO_BUMPKIN: "You do not have a Bumpkin",
  NOT_A_FOOD: "This is not a valentine food",
  UNKOWN_FOOD: "This food was not requested",
};

export const feedValentineFood = ({ state, action }: Options) => {
  const stateCopy = cloneDeep(state);
  const { bumpkin, inventory } = stateCopy;
  const { food } = action;

  if (!bumpkin) {
    throw new Error(FEED_VALENTINE_FOOD_ERRORS.NO_BUMPKIN);
  }

  if (!VALENTINE_CONSUMABLES.includes(food)) {
    throw new Error(FEED_VALENTINE_FOOD_ERRORS.NOT_A_FOOD);
  }

  if (!inventory[food]) {
    throw new Error(`You do not have ${food}`);
  }

  const loveLetters = inventory["Love Letter"] ?? new Decimal(0);
  const foodRequired =
    VALENTINE_CONSUMABLES[
      loveLetters.toNumber() % VALENTINE_CONSUMABLES.length
    ];

  if (food !== foodRequired) {
    throw new Error(FEED_VALENTINE_FOOD_ERRORS.UNKOWN_FOOD);
  }

  const consumableAmount = inventory[food] ?? new Decimal(0);

  return {
    ...stateCopy,
    inventory: {
      ...inventory,
      [food]: consumableAmount.sub(1),
      "Love Letter": loveLetters.add(1),
    },
  };
};
