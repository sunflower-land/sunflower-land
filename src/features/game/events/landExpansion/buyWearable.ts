import Decimal from "decimal.js-light";
import { BumpkinItem } from "features/game/types/bumpkin";
import { trackActivity } from "features/game/types/bumpkinActivity";
import { getKeys } from "features/game/types/craftables";

import { GameState } from "features/game/types/game";
import { STYLIST_WEARABLES } from "features/game/types/stylist";
import cloneDeep from "lodash.clonedeep";

export type BuyWearableAction = {
  type: "wearable.bought";
  name: BumpkinItem;
};

type Options = {
  state: Readonly<GameState>;
  action: BuyWearableAction;
  createdAt?: number;
};

export function buyWearable({
  state,
  action,
  createdAt = Date.now(),
}: Options) {
  const stateCopy = cloneDeep(state);
  const { name } = action;
  const wearable = STYLIST_WEARABLES(state)[name];

  if (!wearable) {
    throw new Error("This item is not available");
  }

  const { bumpkin } = stateCopy;

  if (!bumpkin) {
    throw new Error("Bumpkin not found");
  }

  if (wearable.from && wearable.from?.getTime() > createdAt) {
    throw new Error("Too early");
  }

  if (wearable.to && wearable.to?.getTime() < createdAt) {
    throw new Error("Too late");
  }

  if (wearable.hoursPlayed) {
    const hoursPlayed = (Date.now() - stateCopy.createdAt) / 1000 / 60 / 60;
    console.log({ hours: wearable.hoursPlayed, hoursPlayed });

    if (hoursPlayed < wearable.hoursPlayed) {
      throw new Error("Not available");
    }
  }

  const totalExpenses = new Decimal(wearable.sfl);

  if (totalExpenses && stateCopy.balance.lessThan(totalExpenses)) {
    throw new Error("Insufficient tokens");
  }

  const subtractedInventory = getKeys(wearable.ingredients)?.reduce(
    (inventory, ingredient) => {
      const count = inventory[ingredient] || new Decimal(0);
      const desiredCount = wearable.ingredients[ingredient] || new Decimal(0);

      if (count.lessThan(desiredCount)) {
        throw new Error(`Insufficient ingredient: ${ingredient}`);
      }

      return {
        ...inventory,
        [ingredient]: count.sub(desiredCount),
      };
    },
    stateCopy.inventory
  );

  bumpkin.activity = trackActivity(
    "SFL Spent",
    bumpkin?.activity,
    totalExpenses ?? new Decimal(0)
  );

  const oldAmount = stateCopy.wardrobe[name] ?? 0;

  return {
    ...stateCopy,
    balance: totalExpenses
      ? stateCopy.balance.sub(totalExpenses)
      : stateCopy.balance,
    wardrobe: {
      ...stateCopy.wardrobe,
      [name]: oldAmount + 1,
    },
    inventory: {
      ...subtractedInventory,
    },
  };
}
