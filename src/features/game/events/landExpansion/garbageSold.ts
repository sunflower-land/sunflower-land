import Decimal from "decimal.js-light";
import { trackActivity } from "features/game/types/bumpkinActivity";
import { GameState } from "features/game/types/game";
import { GARBAGE, Garbage, GarbageName } from "features/game/types/garbage";

import { setPrecision } from "lib/utils/formatNumber";
import cloneDeep from "lodash.clonedeep";
import { translate } from "lib/i18n/translate";

export type SellGarbageAction = {
  type: "garbage.sold";
  item: GarbageName;
  amount: number;
};

type Options = {
  state: Readonly<GameState>;
  action: SellGarbageAction;
};

export const getGarbageSellPrice = (item: Garbage) => {
  const price = item.sellPrice || new Decimal(0);

  return price;
};

export function sellGarbage({ state, action }: Options) {
  const statecopy = cloneDeep(state);
  const { item, amount } = action;

  const { bumpkin, inventory, balance } = statecopy;

  if (!bumpkin) {
    throw new Error(translate("harvestflower.noBumpkin"));
  }
  if (!(item in GARBAGE)) {
    throw new Error("Not for sale");
  }

  if (!new Decimal(amount).isInteger()) {
    throw new Error("Invalid amount");
  }

  const count = inventory[item] || new Decimal(0);

  if (count.lessThan(amount)) {
    throw new Error("Insufficient quantity to sell");
  }

  const price = getGarbageSellPrice(GARBAGE[item]);
  const sflEarned = price.mul(amount);
  bumpkin.activity = trackActivity("SFL Earned", bumpkin.activity, sflEarned);
  bumpkin.activity = trackActivity(
    `${item} Sold`,
    bumpkin?.activity,
    new Decimal(amount)
  );

  return {
    ...statecopy,
    bumpkin,
    balance: balance.add(sflEarned),
    inventory: {
      ...inventory,
      [item]: setPrecision(count.sub(amount)),
    },
  };
}
