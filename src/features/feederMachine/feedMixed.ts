import cloneDeep from "lodash.clonedeep";
import { GameState, AnimalFoodName } from "features/game/types/game";
import Decimal from "decimal.js-light";
import { trackActivity } from "features/game/types/bumpkinActivity";
import { getKeys } from "features/game/types/decorations";
import { ANIMAL_FOODS } from "features/game/types/animals";

export type FeedMixedAction = {
  type: "feed.mixed";
  feed: AnimalFoodName;
  amount?: number;
};

type Options = {
  state: Readonly<GameState>;
  action: FeedMixedAction;
};

export function feedMixed({ state, action }: Options) {
  const stateCopy: GameState = cloneDeep(state);
  const { bumpkin } = stateCopy;

  if (!bumpkin) {
    throw new Error("Bumpkin not found");
  }

  const { feed, amount } = action;

  const selectedItem = ANIMAL_FOODS[feed];

  if (!selectedItem) {
    throw new Error("Item is not a feed!");
  }

  const price = selectedItem.coins ?? 0;

  if (price && stateCopy.coins < price) {
    throw new Error("Insufficient Coins");
  }

  const subtractedInventory = getKeys(selectedItem.ingredients)?.reduce(
    (inventory, ingredient) => {
      const count = inventory[ingredient] ?? new Decimal(0);
      const requiredIngredients =
        selectedItem.ingredients[ingredient] ?? new Decimal(0);

      if (count.lessThan(requiredIngredients)) {
        throw new Error(`Insufficient Ingredient: ${ingredient}`);
      }
      return {
        ...inventory,
        [ingredient]: count.sub(requiredIngredients),
      };
    },
    stateCopy.inventory,
  );

  const oldAmount = stateCopy.inventory[feed] ?? new Decimal(0);

  bumpkin.activity = trackActivity(
    "Coins Spent",
    bumpkin?.activity,
    new Decimal(price),
  );
  bumpkin.activity = trackActivity(
    `${feed} Mixed`,
    bumpkin?.activity,
    new Decimal(amount ?? 0),
  );
  stateCopy.coins -= price;
  stateCopy.inventory = {
    ...subtractedInventory,
    [feed]: oldAmount.add(1),
  };

  return stateCopy;
}
