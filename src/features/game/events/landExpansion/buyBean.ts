import Decimal from "decimal.js-light";
import cloneDeep from "lodash.clonedeep";

import { GameState } from "features/game/types/game";
import { trackActivity } from "features/game/types/bumpkinActivity";
import { BeanName, BEANS } from "features/game/types/beans";
import { getKeys } from "features/game/types/craftables";

export type BeanBoughtAction = {
  type: "bean.bought";
  bean: BeanName;
};

type Options = {
  state: Readonly<GameState>;
  action: BeanBoughtAction;
};

export function beanBought({ state, action }: Options) {
  const stateCopy = cloneDeep(state);
  const { bean } = action;
  const desiredItem = BEANS()[bean];

  if (!desiredItem) {
    throw new Error("This item is not a bean");
  }

  const { bumpkin } = stateCopy;

  if (!bumpkin) {
    throw new Error("Bumpkin not found");
  }

  if (stateCopy.stock[bean]?.lt(1)) {
    throw new Error("Not enough stock");
  }

  const totalExpenses = desiredItem.sfl;

  if (totalExpenses && stateCopy.balance.lessThan(totalExpenses)) {
    throw new Error("Insufficient SFL");
  }

  const subtractedInventory = getKeys(desiredItem.ingredients)?.reduce(
    (inventory, ingredient) => {
      const count = inventory[ingredient] || new Decimal(0);
      const desiredCount =
        desiredItem.ingredients[ingredient] || new Decimal(0);

      if (count.lessThan(desiredCount)) {
        throw new Error(`Insufficient ${ingredient}`);
      }

      return {
        ...inventory,
        [ingredient]: count.sub(desiredCount),
      };
    },
    stateCopy.inventory
  );

  const oldAmount = stateCopy.inventory[bean] ?? new Decimal(0);
  const oldStock = stateCopy.stock[bean] ?? new Decimal(0);

  bumpkin.activity = trackActivity(
    "SFL Spent",
    bumpkin?.activity,
    totalExpenses ?? new Decimal(0)
  );
  bumpkin.activity = trackActivity(
    `${bean} Bought`,
    bumpkin?.activity,
    new Decimal(1)
  );

  return {
    ...stateCopy,
    balance: totalExpenses
      ? stateCopy.balance.sub(totalExpenses)
      : stateCopy.balance,
    inventory: {
      ...stateCopy.inventory,
      ...subtractedInventory,
      [bean]: oldAmount.add(1) as Decimal,
    },
    stock: {
      [bean]: oldStock.minus(1) as Decimal,
    },
  };
}
