import Decimal from "decimal.js-light";
import { trackActivity } from "features/game/types/bumpkinActivity";
import { GameState } from "features/game/types/game";
import {
  BeachBountyTreasure,
  BEACH_BOUNTY_TREASURE,
} from "features/game/types/treasure";
import { setPrecision } from "lib/utils/formatNumber";
import cloneDeep from "lodash.clonedeep";

export type SellTreasureAction = {
  type: "treasure.sold";
  item: BeachBountyTreasure;
  amount: number;
};

type Options = {
  state: Readonly<GameState>;
  action: SellTreasureAction;
};

export function sellTreasure({ state, action }: Options) {
  const statecopy = cloneDeep(state);
  const { item, amount } = action;

  const { bumpkin } = statecopy;

  if (!bumpkin) {
    throw new Error("You do not have a Bumpkin");
  }
  if (!(item in BEACH_BOUNTY_TREASURE)) {
    throw new Error("Not for sale");
  }

  if (!new Decimal(amount).isInteger()) {
    throw new Error("Invalid amount");
  }

  const count = statecopy.inventory[item] || new Decimal(0);

  if (count.lessThan(amount)) {
    throw new Error("Insufficient quantity to sell");
  }

  const price = BEACH_BOUNTY_TREASURE[item].sellPrice;
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
    balance: statecopy.balance.add(sflEarned),
    inventory: {
      ...statecopy.inventory,
      [item]: setPrecision(count.sub(amount)),
    },
  };
}
