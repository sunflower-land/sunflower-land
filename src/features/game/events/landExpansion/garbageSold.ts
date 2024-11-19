import Decimal from "decimal.js-light";
import { trackActivity } from "features/game/types/bumpkinActivity";
import { getKeys } from "features/game/types/decorations";
import { GameState } from "features/game/types/game";
import { GARBAGE, GarbageName } from "features/game/types/garbage";
import { produce } from "immer";

import { setPrecision } from "lib/utils/formatNumber";

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
  return produce(state, (game) => {
    const { item, amount } = action;

    const { bumpkin, inventory } = game;

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

    const limit = GARBAGE[item].limit ?? 0;

    if (count.sub(amount).lessThan(limit)) {
      throw new Error("Limit Reached");
    }

    const coins = GARBAGE[item].sellPrice ?? 0;
    if (coins) {
      const coinsEarned = coins * amount;
      bumpkin.activity = trackActivity(
        "Coins Earned",
        bumpkin.activity,
        new Decimal(coinsEarned),
      );

      game.coins += coinsEarned;
    }

    const gems = GARBAGE[item].gems ?? 0;
    if (gems) {
      const previous = game.inventory.Gem ?? new Decimal(0);
      game.inventory.Gem = previous.add(gems * amount);
    }

    const items = GARBAGE[item].items;
    if (items) {
      getKeys(items).forEach((itemName) => {
        const previous = game.inventory[itemName] ?? new Decimal(0);
        game.inventory[itemName] = previous.add(
          GARBAGE[item].items?.[itemName] ?? 0,
        );
      });
    }

    bumpkin.activity = trackActivity(
      `${item} Sold`,
      bumpkin?.activity,
      new Decimal(amount),
    );

    game.inventory[item] = setPrecision(count.sub(amount));

    return game;
  });
}
