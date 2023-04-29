import Decimal from "decimal.js-light";
import { trackActivity } from "features/game/types/bumpkinActivity";
import { GameState } from "features/game/types/game";
import { DISCARD, DiscardName } from "features/game/types/garbage";

import { setPrecision } from "lib/utils/formatNumber";
import cloneDeep from "lodash.clonedeep";

export type DiscardGarbageAction = {
  type: "garbage.discarded";
  item: DiscardName;
  amount: number;
};

type Options = {
  state: Readonly<GameState>;
  action: DiscardGarbageAction;
};

export function discardGarbage({ state, action }: Options) {
  const statecopy = cloneDeep(state);
  const { item, amount } = action;

  const { bumpkin, inventory, balance } = statecopy;

  if (!bumpkin) {
    throw new Error("You do not have a Bumpkin");
  }
  if (!(DISCARD.indexOf(item) > -1)) {
    throw new Error("Not discardable");
  }

  if (!new Decimal(amount).isInteger()) {
    throw new Error("Invalid amount");
  }

  const count = inventory[item] || new Decimal(0);

  if (count.lessThan(amount)) {
    throw new Error("Insufficient quantity to sell");
  }

  bumpkin.activity = trackActivity(
    `${item} Discarded`,
    bumpkin?.activity,
    new Decimal(amount)
  );

  return {
    ...statecopy,
    bumpkin,
    inventory: {
      ...inventory,
      [item]: setPrecision(count.sub(amount)),
    },
  };
}
