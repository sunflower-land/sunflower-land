import Decimal from "decimal.js-light";
import { trackActivity } from "features/game/types/bumpkinActivity";
import { getKeys } from "features/game/types/craftables";
import { GameState, Order } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

export type DeliverOrderAction = {
  type: "order.delivered";
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: DeliverOrderAction;
};

export function getDeliverySlots(game: GameState) {
  if (game.inventory["Basic Land"]?.gte(5)) {
    return 6;
  }

  return 3;
}

export function populateOrders(
  game: GameState,
  createdAt: number = Date.now()
) {
  let orders = game.delivery.orders;
  const slots = getDeliverySlots(game);

  while (orders.length < slots) {
    const upcomingOrderTimes = game.delivery.orders.map(
      (order) => order.readyAt
    );
    const baseTime = Math.max(...upcomingOrderTimes, createdAt);

    // Orders are generated on backend - use this just to show the next readyAt
    const fakeOrder: Order = {
      createdAt: Date.now(),
      readyAt: baseTime + (24 / getDeliverySlots(game)) * 60 * 60 * 1000,
      from: "betty",
      id: Date.now().toString(),
      items: {},
      reward: {},
    };

    orders.push(fakeOrder);
  }

  return orders;
}

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

  // bumpkin.activity = trackActivity(`${order.from} Delivered`, 1);

  game.delivery.orders = populateOrders(game);

  return game;
}
