import Decimal from "decimal.js-light";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import { EXOTIC_CROPS, ExoticCropName } from "features/game/types/beans";
import { trackFarmActivity } from "features/game/types/farmActivity";
import { BoostName, GameState } from "features/game/types/game";
import {
  SellableTreasure,
  BeachBountyTreasure,
  SELLABLE_TREASURE,
} from "features/game/types/treasure";
import { isExoticCrop } from "features/game/types/crops";
import { produce } from "immer";
import { setPrecision } from "lib/utils/formatNumber";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";
import { getCountAndType } from "features/island/hud/components/inventory/utils/inventory";

export type SellTreasureAction = {
  type: "treasure.sold";
  item: BeachBountyTreasure | ExoticCropName;
  amount: number;
};

type Options = {
  state: Readonly<GameState>;
  action: SellTreasureAction;
};

export const getSellPrice = (
  item: SellableTreasure,
  game: GameState,
): { price: number; boostsUsed: BoostName[] } => {
  const sellPrice = item.sellPrice;
  let price = sellPrice;
  const boostsUsed: BoostName[] = [];

  if (isCollectibleBuilt({ name: "Treasure Map", game })) {
    price += sellPrice * 0.2;
    boostsUsed.push("Treasure Map");
  }

  if (isCollectibleBuilt({ name: "Camel", game })) {
    price += sellPrice * 0.3;
    boostsUsed.push("Camel");
  }

  return { price, boostsUsed };
};

export function sellTreasure({ state, action }: Options) {
  return produce(state, (game) => {
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

    const { count } = getCountAndType(game, item);

    if (count.lessThan(amount)) {
      throw new Error("Insufficient quantity to sell");
    }

    const { price, boostsUsed } = isExoticCrop(item)
      ? { price: EXOTIC_CROPS[item].sellPrice, boostsUsed: [] }
      : getSellPrice(SELLABLES[item], game);
    const earned = price * amount;
    game.farmActivity = trackFarmActivity(
      "Coins Earned",
      game.farmActivity,
      new Decimal(earned),
    );

    game.farmActivity = trackFarmActivity(
      `${item} Sold`,
      game.farmActivity,
      new Decimal(amount),
    );

    game.coins = coins + earned;
    game.inventory[item] = setPrecision(
      (game.inventory[item] ?? new Decimal(0)).sub(amount),
    );

    game.boostsUsedAt = updateBoostUsed({
      game,
      boostNames: boostsUsed,
      createdAt: Date.now(),
    });

    return game;
  });
}
