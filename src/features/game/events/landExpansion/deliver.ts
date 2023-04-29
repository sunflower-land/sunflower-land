import Decimal from "decimal.js-light";
import {
  AchievementName,
  ACHIEVEMENTS,
} from "features/game/types/achievements";
import { getKeys } from "features/game/types/craftables";
import { GameState } from "features/game/types/game";
import { analytics } from "lib/analytics";
import cloneDeep from "lodash.clonedeep";

export type DeliverOrderAction = {
  type: "order.delivered";
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: DeliverOrderAction;
};

const clone = (state: GameState): GameState => {
  return cloneDeep(state);
};

export function deliverOrder({ state, action }: Options): GameState {
  const game = clone(state);
  const bumpkin = game.bumpkin;

  if (!bumpkin) {
    throw new Error("You do not have a Bumpkin");
  }

  const order = game.delivery.orders.find((order) => order.id === action.id);

  if (!order) {
    throw new Error("No order available");
  }

  getKeys(order.items).forEach((name) => {
    const count = game.inventory[name] || new Decimal(0);
    const amount = order.items[name] || new Decimal(0);

    if (count.lessThan(amount)) {
      throw new Error(`Insufficient ingredient: ${name}`);
    }

    game.inventory[name] = count.sub(amount);
  });

  if (order.reward.sfl) {
    game.balance = game.balance.add(order.reward.sfl);
  }

  if (order.reward.items) {
    getKeys(order.reward.items).forEach((name) => {
      const previousAmount = game.inventory[name] || new Decimal(0);

      game.inventory[name] = previousAmount.add(
        order.reward.items?.[name] || 0
      );
    });
  }

  game.delivery.orders = game.delivery.orders.filter(
    (order) => order.id !== action.id
  );

  game.delivery.fulfilledCount += 1;

  return game;
}
