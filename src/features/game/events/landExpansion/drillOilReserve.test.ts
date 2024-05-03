import Decimal from "decimal.js-light";
import { BASE_OIL_DROP_AMOUNT, drillOilReserve } from "./drillOilReserve";
import { TEST_FARM } from "features/game/lib/constants";

describe("drillOilReserve", () => {
  it("throws an error if the oil reserve does not exist", () => {
    expect(() =>
      drillOilReserve({
        action: {
          id: "2",
          type: "oilReserve.drilled",
        },
        state: {
          ...TEST_FARM,
          oilReserves: {
            "1": {
              x: 1,
              y: 1,
              height: 2,
              width: 2,
              createdAt: 0,
              drilled: 0,
              oil: {
                amount: 1,
                drilledAt: 0,
              },
            },
          },
        },
      })
    ).toThrow("Oil reserve #2 not found");
  });

  it("throws an error if the player does not have any drills", () => {
    expect(() =>
      drillOilReserve({
        action: {
          id: "1",
          type: "oilReserve.drilled",
        },
        state: {
          ...TEST_FARM,
          oilReserves: {
            "1": {
              x: 1,
              y: 1,
              height: 2,
              width: 2,
              createdAt: 0,
              drilled: 0,
              oil: {
                amount: 1,
                drilledAt: 0,
              },
            },
          },
        },
      })
    ).toThrow("No oil drills available");
  });

  it("throws and error if the oil reserve is still recovering", () => {
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;

    expect(() =>
      drillOilReserve({
        action: {
          id: "1",
          type: "oilReserve.drilled",
        },
        state: {
          ...TEST_FARM,
          inventory: {
            "Oil Drill": new Decimal(1),
          },
          oilReserves: {
            "1": {
              x: 1,
              y: 1,
              height: 2,
              width: 2,
              createdAt: now,
              drilled: 0,
              oil: {
                amount: 1,
                drilledAt: now - oneHour,
              },
            },
          },
        },
      })
    ).toThrow("Oil reserve is still recovering");
  });

  it("drills the oil reserve", () => {
    const now = Date.now();

    const game = drillOilReserve({
      action: {
        id: "1",
        type: "oilReserve.drilled",
      },
      state: {
        ...TEST_FARM,
        inventory: {
          "Oil Drill": new Decimal(2),
        },
        oilReserves: {
          "1": {
            x: 1,
            y: 1,
            height: 2,
            width: 2,
            createdAt: now,
            drilled: 0,
            oil: {
              amount: BASE_OIL_DROP_AMOUNT,
              drilledAt: 0,
            },
          },
        },
      },
    });

    const reserve = game.oilReserves["1"];

    expect(reserve.oil.drilledAt).toBe(now);
    expect(reserve.drilled).toBe(1);
    expect(game.inventory["Oil Drill"]?.toNumber()).toBe(1);
    expect(game.inventory.Oil?.toNumber()).toEqual(BASE_OIL_DROP_AMOUNT);
  });
});
