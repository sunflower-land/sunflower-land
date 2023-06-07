import Decimal from "decimal.js-light";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import { trackActivity } from "features/game/types/bumpkinActivity";
import { Collectibles, GameState } from "features/game/types/game";
import {
  SellableTreasure,
  BeachBountyTreasure,
  SELLABLE_TREASURE,
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

export const getSellPrice = (
  item: SellableTreasure,
  collectibles: Collectibles
) => {
  const price = item.sellPrice || new Decimal(0);

  if (isCollectibleBuilt("Treasure Map", collectibles)) {
    return price.mul(1.2);
  }

  return price;
};

export function sellTreasure({ state, action }: Options) {
  const statecopy = cloneDeep(state);
  const { item, amount } = action;

  const { bumpkin, collectibles, inventory, balance } = statecopy;

  if (!bumpkin) {
    throw new Error("You do not have a Bumpkin");
  }
  if (!(item in SELLABLE_TREASURE)) {
    throw new Error("Not for sale");
  }

  if (!new Decimal(amount).isInteger()) {
    throw new Error("Invalid amount");
  }

  const count = inventory[item] || new Decimal(0);

  if (count.lessThan(amount)) {
    throw new Error("Insufficient quantity to sell");
  }

  const price = getSellPrice(SELLABLE_TREASURE[item], collectibles);
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
