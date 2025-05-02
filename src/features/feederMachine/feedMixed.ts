import {
  GameState,
  AnimalFoodName,
  AnimalMedicineName,
} from "features/game/types/game";
import Decimal from "decimal.js-light";
import { trackActivity } from "features/game/types/bumpkinActivity";
import { getKeys } from "features/game/types/decorations";
import { ANIMAL_FOODS } from "features/game/types/animals";
import { produce } from "immer";
import { isWearableActive } from "features/game/lib/wearables";

export type FeedMixedAction = {
  type: "feed.mixed";
  item: AnimalFoodName | AnimalMedicineName;
  amount?: number;
};

type Options = {
  state: Readonly<GameState>;
  action: FeedMixedAction;
};

export function getIngredients({
  state,
  name,
}: {
  state: GameState;
  name: AnimalFoodName | AnimalMedicineName;
}) {
  let { ingredients } = ANIMAL_FOODS[name];

  if (state.bumpkin.skills["Kale Mix"] && name === "Mixed Grain") {
    ingredients = {
      Kale: new Decimal(3),
    };
  }

  if (state.bumpkin.skills["Alternate Medicine"] && name === "Barn Delight") {
    ingredients = Object.fromEntries(
      Object.entries(ingredients).map(([key, value]) => [key, value.minus(1)]),
    );
  }

  if (
    isWearableActive({ game: state, name: "Medic Apron" }) &&
    name === "Barn Delight"
  ) {
    ingredients = Object.fromEntries(
      Object.entries(ingredients).map(([key, value]) => [key, value.div(2)]),
    );
  }

  return { ingredients };
}

export function feedMixed({ state, action }: Options) {
  return produce(state, (copy) => {
    const { bumpkin } = copy;

    if (!bumpkin) {
      throw new Error("Bumpkin not found");
    }

    const { item, amount = 1 } = action;

    const selectedItem = ANIMAL_FOODS[item];
    if (!selectedItem) {
      throw new Error("Item is not a feed!");
    }

    const { coins } = selectedItem;
    const price = (coins ?? 0) * amount;

    if (price && copy.coins < price) {
      throw new Error("Insufficient Coins");
    }

    const { ingredients } = getIngredients({ state: copy, name: item });

    const subtractedInventory = getKeys(ingredients)?.reduce(
      (inventory, ingredient) => {
        const count = inventory[ingredient] ?? new Decimal(0);
        const requiredIngredients = new Decimal(
          ingredients[ingredient] ?? 0,
        ).mul(amount);

        if (count.lessThan(requiredIngredients)) {
          throw new Error(`Insufficient Ingredient: ${ingredient}`);
        }
        return {
          ...inventory,
          [ingredient]: count.sub(requiredIngredients),
        };
      },
      copy.inventory,
    );

    const oldAmount = copy.inventory[item] ?? new Decimal(0);

    bumpkin.activity = trackActivity(
      "Coins Spent",
      bumpkin?.activity,
      new Decimal(price),
    );
    bumpkin.activity = trackActivity(
      `${item} Mixed`,
      bumpkin?.activity,
      new Decimal(amount ?? 0),
    );
    copy.coins -= price;
    copy.inventory = {
      ...subtractedInventory,
      [item]: oldAmount.add(amount ?? 0),
    };

    return copy;
  });
}
