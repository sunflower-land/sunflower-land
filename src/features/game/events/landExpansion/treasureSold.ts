import Decimal from "decimal.js-light";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import { EXOTIC_CROPS, ExoticCropName } from "features/game/types/beans";
import { trackActivity } from "features/game/types/bumpkinActivity";
import { GameState } from "features/game/types/game";
import {
  SellableTreasure,
  BeachBountyTreasure,
  SELLABLE_TREASURE,
} from "features/game/types/treasure";
import { setPrecision } from "lib/utils/formatNumber";
import cloneDeep from "lodash.clonedeep";

export type SellTreasureAction = {
  type: "treasure.sold";
  item: BeachBountyTreasure | ExoticCropName;
  amount: number;
};

type Options = {
  state: Readonly<GameState>;
  action: SellTreasureAction;
};

export const getSellPrice = (item: SellableTreasure, game: GameState) => {
  const price = item.sellPrice;

  if (isCollectibleBuilt({ name: "Treasure Map", game })) {
    return price * 1.2;
  }

  return price;
};

export const isExoticCrop = (
  item: BeachBountyTreasure | ExoticCropName
): item is ExoticCropName => {
  return item in EXOTIC_CROPS;
};

export function sellTreasure({ state, action }: Options) {
  const game: GameState = cloneDeep(state);
  const { item, amount } = action;

  const { bumpkin, coins } = game;

  if (!bumpkin) {
    throw new Error("You do not have a Bumpkin");
  }

  const SELLABLES = { ...SELLABLE_TREASURE, ...EXOTIC_CROPS };
  if (!(item in SELLABLES)) {
    throw new Error("Not for sale");
  }

  if (!new Decimal(amount).isInteger()) {
    throw new Error("Invalid amount");
  }

  const count = game.inventory[item] || new Decimal(0);

  if (count.lessThan(amount)) {
    throw new Error("Insufficient quantity to sell");
  }

  const price = isExoticCrop(item)
    ? EXOTIC_CROPS[item].sellPrice
    : getSellPrice(SELLABLES[item], game);
  const earned = price * amount;
  bumpkin.activity = trackActivity(
    "Coins Earned",
    bumpkin.activity,
    new Decimal(earned)
  );

  bumpkin.activity = trackActivity(
    `${item} Sold`,
    bumpkin?.activity,
    new Decimal(amount)
  );

  game.coins = coins + earned;
  game.inventory[item] = setPrecision(count.sub(amount));

  return game;
}
