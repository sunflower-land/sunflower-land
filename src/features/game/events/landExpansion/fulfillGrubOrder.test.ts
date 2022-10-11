import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "features/game/lib/constants";
import { fulfillGrubOrder } from "./fulfillGrubOrder";

describe("fulfillGrubOrder", () => {
  it("require the grub shop is open", () => {
    expect(() =>
      fulfillGrubOrder({
        state: {
          ...INITIAL_FARM,
          grubShop: {
            opensAt: new Date("1999-01-01").getTime(),
            closesAt: new Date("2000-01-01").getTime(),
            orders: [],
          },
        },
        action: {
          id: "23",
          type: "grubOrder.fulfilled",
        },
      })
    ).toThrow("Grub shop is not open");
  });

  it("require order is not already fulfilled", () => {
    expect(() =>
      fulfillGrubOrder({
        state: {
          ...INITIAL_FARM,
          grubShop: {
            opensAt: Date.now() - 1 * 60 * 60 * 1000,
            closesAt: Date.now() + 1 * 60 * 60 * 1000,
            orders: [
              {
                id: "23",
                name: "Mashed Potato",
                sfl: new Decimal(100),
              },
            ],
          },
          grubOrdersFulfilled: [
            {
              id: "23",
              fulfilledAt: Date.now() - 1000,
            },
          ],
        },
        action: {
          id: "23",
          type: "grubOrder.fulfilled",
        },
      })
    ).toThrow("Order is already fulfilled");
  });

  it("require the order exists", () => {
    expect(() =>
      fulfillGrubOrder({
        state: {
          ...INITIAL_FARM,
          inventory: {
            "Mashed Potato": new Decimal(0),
          },
          grubShop: {
            opensAt: Date.now() - 1 * 60 * 60 * 1000,
            closesAt: Date.now() + 1 * 60 * 60 * 1000,
            orders: [
              {
                id: "23",
                name: "Mashed Potato",
                sfl: new Decimal(100),
              },
            ],
          },
          grubOrdersFulfilled: [],
        },
        action: {
          id: "44_NOT_EXIST_44",
          type: "grubOrder.fulfilled",
        },
      })
    ).toThrow("Order does not exist");
  });

  it("require the player has the consumable", () => {
    expect(() =>
      fulfillGrubOrder({
        state: {
          ...INITIAL_FARM,
          inventory: {},
          grubShop: {
            opensAt: Date.now() - 1 * 60 * 60 * 1000,
            closesAt: Date.now() + 1 * 60 * 60 * 1000,
            orders: [
              {
                id: "23",
                name: "Mashed Potato",
                sfl: new Decimal(100),
              },
            ],
          },
          grubOrdersFulfilled: [],
        },
        action: {
          id: "23",
          type: "grubOrder.fulfilled",
        },
      })
    ).toThrow("Player does not have food");
  });

  it("require the order is unlocked", () => {
    expect(() =>
      fulfillGrubOrder({
        state: {
          ...INITIAL_FARM,
          inventory: {
            "Mashed Potato": new Decimal(5),
          },
          grubShop: {
            opensAt: Date.now() - 1 * 60 * 60 * 1000,
            closesAt: Date.now() + 1 * 60 * 60 * 1000,
            orders: [
              {
                id: "23",
                name: "Mashed Potato",
                sfl: new Decimal(100),
              },
              {
                id: "24",
                name: "Mashed Potato",
                sfl: new Decimal(100),
              },
              {
                id: "25",
                name: "Mashed Potato",
                sfl: new Decimal(100),
              },
              {
                id: "26",
                name: "Mashed Potato",
                sfl: new Decimal(100),
              },
              {
                id: "27",
                name: "Mashed Potato",
                sfl: new Decimal(100),
              },
            ],
          },
          grubOrdersFulfilled: [],
        },
        action: {
          id: "27",
          type: "grubOrder.fulfilled",
        },
      })
    ).toThrow("Order is locked");
  });

  it("player receives SFL", () => {
    const state = fulfillGrubOrder({
      state: {
        ...INITIAL_FARM,
        balance: new Decimal(1),
        inventory: {
          "Mashed Potato": new Decimal(5),
        },
        grubShop: {
          opensAt: Date.now() - 1 * 60 * 60 * 1000,
          closesAt: Date.now() + 1 * 60 * 60 * 1000,
          orders: [
            {
              id: "23",
              name: "Mashed Potato",
              sfl: new Decimal(100),
            },
          ],
        },
        grubOrdersFulfilled: [],
      },
      action: {
        id: "23",
        type: "grubOrder.fulfilled",
      },
    });

    expect(state.balance).toEqual(new Decimal(101));
  });

  it("order is fulfilled", () => {
    const fulfilledAt = Date.now();
    const state = fulfillGrubOrder({
      state: {
        ...INITIAL_FARM,
        balance: new Decimal(1),
        inventory: {
          "Mashed Potato": new Decimal(5),
        },
        grubShop: {
          opensAt: Date.now() - 1 * 60 * 60 * 1000,
          closesAt: Date.now() + 1 * 60 * 60 * 1000,
          orders: [
            {
              id: "23",
              name: "Mashed Potato",
              sfl: new Decimal(100),
            },
          ],
        },
        grubOrdersFulfilled: [],
      },
      action: {
        id: "23",
        type: "grubOrder.fulfilled",
      },
      createdAt: fulfilledAt,
    });

    expect(state.grubOrdersFulfilled).toEqual([
      {
        id: "23",
        fulfilledAt,
      },
    ]);
  });
  it("consumable is removed", () => {
    const fulfilledAt = Date.now();
    const state = fulfillGrubOrder({
      state: {
        ...INITIAL_FARM,
        balance: new Decimal(1),
        inventory: {
          "Mashed Potato": new Decimal(5),
        },
        grubShop: {
          opensAt: Date.now() - 1 * 60 * 60 * 1000,
          closesAt: Date.now() + 1 * 60 * 60 * 1000,
          orders: [
            {
              id: "23",
              name: "Mashed Potato",
              sfl: new Decimal(100),
            },
          ],
        },
        grubOrdersFulfilled: [],
      },
      action: {
        id: "23",
        type: "grubOrder.fulfilled",
      },
      createdAt: fulfilledAt,
    });

    expect(state.inventory["Mashed Potato"]).toEqual(new Decimal(4));
  });

  it("fulfills multiple orders", () => {
    let state = fulfillGrubOrder({
      state: {
        ...INITIAL_FARM,
        inventory: {
          "Mashed Potato": new Decimal(5),
        },
        grubShop: {
          opensAt: Date.now() - 1 * 60 * 60 * 1000,
          closesAt: Date.now() + 1 * 60 * 60 * 1000,
          orders: [
            {
              id: "23",
              name: "Mashed Potato",
              sfl: new Decimal(100),
            },
            {
              id: "24",
              name: "Mashed Potato",
              sfl: new Decimal(100),
            },
            {
              id: "25",
              name: "Mashed Potato",
              sfl: new Decimal(100),
            },
            {
              id: "26",
              name: "Mashed Potato",
              sfl: new Decimal(100),
            },
            {
              id: "27",
              name: "Mashed Potato",
              sfl: new Decimal(100),
            },
          ],
        },
        grubOrdersFulfilled: [],
      },
      action: {
        id: "23",
        type: "grubOrder.fulfilled",
      },
    });

    state = fulfillGrubOrder({
      state,
      action: {
        id: "24",
        type: "grubOrder.fulfilled",
      },
    });

    state = fulfillGrubOrder({
      state,
      action: {
        id: "25",
        type: "grubOrder.fulfilled",
      },
    });

    state = fulfillGrubOrder({
      state,
      action: {
        id: "26",
        type: "grubOrder.fulfilled",
      },
    });

    state = fulfillGrubOrder({
      state,
      action: {
        id: "27",
        type: "grubOrder.fulfilled",
      },
    });

    expect(state.balance).toEqual(new Decimal(500));
    expect(state.inventory["Mashed Potato"]).toEqual(new Decimal(0));
    expect(state.grubOrdersFulfilled).toHaveLength(5);
  });
});
