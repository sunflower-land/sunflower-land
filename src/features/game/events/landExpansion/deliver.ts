import Decimal from "decimal.js-light";
import { trackActivity } from "features/game/types/bumpkinActivity";
import { CAKES, getKeys } from "features/game/types/craftables";
import { Bumpkin, GameState, Order } from "features/game/types/game";
import { getSeasonalTicket } from "features/game/types/seasons";
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
  if (game.inventory["Basic Land"]?.gte(14)) {
    return 6;
  }

  if (game.inventory["Basic Land"]?.gte(8)) {
    return 5;
  }

  if (game.inventory["Basic Land"]?.gte(5)) {
    return 4;
  }

  return 3;
}

export function populateOrders(
  game: GameState,
  createdAt: number = Date.now()
) {
  const orders = game.delivery.orders;
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

export function getOrderSellPrice(bumpkin: Bumpkin, order: Order) {
  const { skills } = bumpkin;

  let mul = 1;

  if (skills["Michelin Stars"]) {
    mul += 0.05;
  }

  const items = getKeys(order.items);
  if (
    items.some((name) => name in CAKES()) &&
    bumpkin.equipped.coat == "Chef Apron"
  ) {
    mul += 0.2;
  }

  return new Decimal(order.reward.sfl ?? 0).mul(mul);
}

export function deliverOrder({ state, action }: Options): GameState {
  const game = clone(state);
  const bumpkin = game.bumpkin;

  if (!bumpkin) {
    throw new Error("You do not have a Bumpkin");
  }

  const order = game.delivery.orders.find((order) => order.id === action.id);

  if (!order) {
    throw new Error("Order does not exist");
  }

  if (order.readyAt > Date.now()) {
    throw new Error("Order has not started");
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
    const sfl = getOrderSellPrice(bumpkin, order);
    game.balance = game.balance.add(sfl);

    bumpkin.activity = trackActivity("SFL Earned", bumpkin.activity, sfl);
  }

  // Always give a seasonal ticket
  const items = {
    ...(order.reward.items ?? {}),
    [getSeasonalTicket()]: 5,
  };

  if (items) {
    getKeys(items).forEach((name) => {
      const previousAmount = game.inventory[name] || new Decimal(0);

      game.inventory[name] = previousAmount.add(items[name] || 0);
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
