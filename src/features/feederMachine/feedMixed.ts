import type {
  GameState,
  AnimalFoodName,
  InventoryItemName,
  AnimalMedicineName,
} from "features/game/types/game";
import Decimal from "decimal.js-light";
import { getSkillLevel, SKILL_RANKS } from "features/game/types/bumpkinSkills";
import { trackFarmActivity } from "features/game/types/farmActivity";
import { getKeys } from "lib/object";
import { ANIMAL_FOODS } from "features/game/types/animals";
import { getPigFeedIngredients, isPigFeed } from "features/game/types/pigFeeds";
import { hasFeatureAccess } from "lib/flags";
import { produce } from "immer";

export type FeedMixedAction = {
  type: "feed.mixed";
  item: AnimalFoodName | AnimalMedicineName;
  /** The one input a Pig Slop is mixed from; never set for other feeds. */
  ingredient?: InventoryItemName;
  amount?: number;
};

type Options = {
  state: Readonly<GameState>;
  action: FeedMixedAction;
};

export function getIngredients({
  state,
  name,
  ingredient,
}: {
  state: GameState;
  name: AnimalFoodName | AnimalMedicineName;
  ingredient?: InventoryItemName;
}) {
  if (isPigFeed(name)) {
    const ingredients = getPigFeedIngredients(name, ingredient);
    if (!ingredients) throw new Error("Invalid ingredient");

    return { ingredients };
  }

  if (ingredient !== undefined) throw new Error("Invalid ingredient");

  let { ingredients } = ANIMAL_FOODS[name];

  const kaleMixLevel = getSkillLevel(state.bumpkin.skills, "Kale Mix");
  if (kaleMixLevel && name === "Mixed Grain") {
    // An absolute Kale requirement, not a delta — Decimal keeps rank 2's 2.5 exact.
    ingredients = {
      Kale: new Decimal(SKILL_RANKS["Kale Mix"].ranks[kaleMixLevel - 1]),
    };
  }

  if (state.bumpkin.skills["Alternate Medicine"] && name === "Barn Delight") {
    ingredients = {
      Lemon: ANIMAL_FOODS["Barn Delight"].ingredients.Lemon?.sub(1),
      Honey: ANIMAL_FOODS["Barn Delight"].ingredients.Honey?.sub(1),
    };
  }

  return { ingredients };
}

export function getMaxFeedMixAmount({
  state,
  name,
  ingredient,
}: {
  state: GameState;
  name: AnimalFoodName | AnimalMedicineName;
  ingredient?: InventoryItemName;
}) {
  const { coins } = ANIMAL_FOODS[name];
  const { ingredients } = getIngredients({ state, name, ingredient });

  const limits = getKeys(ingredients).reduce<number[]>(
    (amounts, ingredient) => {
      const required = ingredients[ingredient];
      if (!required || required.lessThanOrEqualTo(0)) return amounts;

      const available = state.inventory[ingredient] ?? new Decimal(0);
      amounts.push(
        available
          .div(required)
          .toDecimalPlaces(0, Decimal.ROUND_DOWN)
          .toNumber(),
      );

      return amounts;
    },
    [],
  );

  if (coins && coins > 0) {
    limits.push(Math.floor(state.coins / coins));
  }

  if (limits.length === 0) return 0;

  return Math.max(0, Math.min(Number.MAX_SAFE_INTEGER, ...limits));
}

/**
 * Mixes one feed into an existing draft. Kept separate from the event so the
 * bulk mixer can apply several feeds within a single `produce` cycle - and so
 * a throw part way through discards the whole draft, never committing a
 * partial mix.
 */
export function applyMix(
  copy: GameState,
  {
    item,
    ingredient,
    amount,
  }: {
    item: AnimalFoodName | AnimalMedicineName;
    ingredient?: InventoryItemName;
    amount: number;
  },
) {
  const { bumpkin } = copy;

  if (!bumpkin) {
    throw new Error("Bumpkin not found");
  }

  const selectedItem = ANIMAL_FOODS[item];
  if (!selectedItem) {
    throw new Error("Item is not a feed!");
  }

  if (isPigFeed(item) && !hasFeatureAccess(copy, "PIGPEN")) {
    throw new Error("Pig feeds are not available");
  }

  const { coins } = selectedItem;
  const price = (coins ?? 0) * amount;

  if (price && copy.coins < price) {
    throw new Error("Insufficient Coins");
  }

  const { ingredients } = getIngredients({
    state: copy,
    name: item,
    ingredient,
  });

  const subtractedInventory = getKeys(ingredients)?.reduce(
    (inventory, ingredient) => {
      const count = inventory[ingredient] ?? new Decimal(0);
      const requiredIngredients = new Decimal(ingredients[ingredient] ?? 0).mul(
        amount,
      );

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

  copy.farmActivity = trackFarmActivity(
    "Coins Spent",
    copy.farmActivity,
    new Decimal(price),
  );
  copy.farmActivity = trackFarmActivity(
    `${item} Mixed`,
    copy.farmActivity,
    new Decimal(amount),
  );
  copy.coins -= price;
  copy.inventory = {
    ...subtractedInventory,
    [item]: oldAmount.add(amount),
  };

  return copy;
}

export function feedMixed({ state, action }: Options) {
  return produce(state, (copy) => {
    const { item, ingredient, amount = 1 } = action;

    if (!Number.isSafeInteger(amount) || amount <= 0) {
      throw new Error("Invalid amount");
    }

    return applyMix(copy, { item, ingredient, amount });
  });
}
