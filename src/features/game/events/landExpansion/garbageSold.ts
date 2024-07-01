import Decimal from "decimal.js-light";
import { trackActivity } from "features/game/types/bumpkinActivity";
import { GameState } from "features/game/types/game";
import { GARBAGE, GarbageName } from "features/game/types/garbage";

import { setPrecision } from "lib/utils/formatNumber";
import cloneDeep from "lodash.clonedeep";

export type SellGarbageAction = {
  type: "garbage.sold";
  item: GarbageName;
  amount: number;
};

type Options = {
  state: Readonly<GameState>;
  action: SellGarbageAction;
};

export function sellGarbage({ state, action }: Options) {
  const game: GameState = cloneDeep(state);
  const { item, amount } = action;

  const { bumpkin, inventory, coins } = game;

  if (!bumpkin) {
    throw new Error("You do not have a Bumpkin!");
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

  const price = GARBAGE[item].sellPrice ?? 0;
  const coinsEarned = price * amount;
  bumpkin.activity = trackActivity(
    "Coins Earned",
    bumpkin.activity,
    new Decimal(coinsEarned),
  );
  bumpkin.activity = trackActivity(
    `${item} Sold`,
    bumpkin?.activity,
    new Decimal(amount),
  );

  game.coins = coins + coinsEarned;
  game.inventory[item] = setPrecision(count.sub(amount));

  return game;
}
