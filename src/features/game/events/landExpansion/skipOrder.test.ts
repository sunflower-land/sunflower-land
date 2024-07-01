import "lib/__mocks__/configMock";

import { GameState, Order } from "features/game/types/game";
import { skipOrder } from "./skipOrder";
import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";

const GAME_STATE: GameState = {
  ...TEST_FARM,
  bumpkin: INITIAL_BUMPKIN,
};

describe("skipOrder", () => {
  it("throws an error if the order does not exist", () => {
    const id = "NOT_AN_ORDER";

    expect(() =>
      skipOrder({
        state: GAME_STATE,
        action: {
          type: "order.skipped",
          id,
        },
      }),
    ).toThrow(`Order ${id} not found`);
  });

  it("skips a delivery", () => {
    const id = "ORDER";

    const order: Order = {
      from: "betty",
      createdAt: 0,
      id,
      items: {},
      readyAt: 0,
      reward: {},
    };

    const state = skipOrder({
      state: {
        ...GAME_STATE,
        delivery: {
          ...GAME_STATE.delivery,
          orders: [order],
        },
      },
      action: {
        type: "order.skipped",
        id,
      },
    });

    expect(
      state.delivery.orders.find((order) => order.id === id),
    ).toBeUndefined();
  });

  it("prevents skipping an within 24 hours", () => {
    const createdAt = new Date("2023-08-08T21:00:00Z").getTime();

    const id1 = "ORDER1";

    const order1: Order = {
      from: "betty",
      createdAt: createdAt - 1 * 60 * 60 * 1000,
      id: id1,
      items: {},
      readyAt: 0,
      reward: {},
    };

    expect(() =>
      skipOrder({
        state: {
          ...GAME_STATE,
          delivery: {
            ...GAME_STATE.delivery,
            orders: [order1],
          },
        },
        action: {
          type: "order.skipped",
          id: id1,
        },
        createdAt,
      }),
    ).toThrow(
      `Order skipped within 24 hours; time now ${createdAt}, time of last skip ${order1.createdAt}`,
    );
  });

  it("only skips one order", () => {
    const createdAt = Date.now();

    const id1 = "ORDER1";
    const id2 = "ORDER2";

    const order1: Order = {
      from: "betty",
      createdAt: 0,
      id: id1,
      items: {},
      readyAt: 0,
      reward: {},
    };

    const order2: Order = {
      from: "betty",
      createdAt: 0,
      id: id2,
      items: {},
      readyAt: 0,
      reward: {},
    };

    const state = skipOrder({
      state: {
        ...GAME_STATE,
        delivery: {
          ...GAME_STATE.delivery,
          orders: [order1, order2],
        },
      },
      action: {
        type: "order.skipped",
        id: id1,
      },
      createdAt,
    });

    expect(
      state.delivery.orders.find((order) => order.id === id1),
    ).toBeUndefined();
    expect(
      state.delivery.orders.find((order) => order.id === id2),
    ).toBeDefined();
  });

  it("increments the skippedAt count", async () => {
    const id = "ORDER";

    const order: Order = {
      from: "betty",
      createdAt: 0,
      id,
      items: {},
      readyAt: 0,
      reward: {},
    };

    const state = skipOrder({
      state: {
        ...GAME_STATE,
        delivery: {
          ...GAME_STATE.delivery,
          orders: [order],
        },
      },
      action: {
        type: "order.skipped",
        id,
      },
    });

    expect(state.delivery.skippedCount).toBe(1);
  });
});
