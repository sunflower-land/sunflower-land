import Decimal from "decimal.js-light";
import {
  BASE_OIL_DROP_AMOUNT,
  OIL_BONUS_DROP_AMOUNT,
  drillOilReserve,
} from "./drillOilReserve";
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
        createdAt: now,
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
      createdAt: now,
    });

    const reserve = game.oilReserves["1"];

    expect(reserve.oil.drilledAt).toBe(now);
    expect(reserve.drilled).toBe(1);
    expect(game.inventory["Oil Drill"]?.toNumber()).toBe(1);
    expect(game.inventory.Oil?.toNumber()).toEqual(BASE_OIL_DROP_AMOUNT);
  });

  it("sets a +20 bonus on every third drill", () => {
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
            drilled: 1,
            oil: {
              amount: 10,
              drilledAt: 0,
            },
          },
        },
      },
      createdAt: now,
    });

    const reserve = game.oilReserves["1"];

    const baseAmountPlusBonus = BASE_OIL_DROP_AMOUNT + OIL_BONUS_DROP_AMOUNT;

    expect(reserve.oil.drilledAt).toBe(now);
    expect(reserve.drilled).toBe(2);
    expect(game.inventory["Oil Drill"]?.toNumber()).toBe(1);
    expect(game.inventory.Oil?.toNumber()).toEqual(BASE_OIL_DROP_AMOUNT);
    expect(reserve.oil.amount).toEqual(baseAmountPlusBonus);
  });

  it("gives a +20 bonus on every third drill", () => {
    const now = Date.now();

    // Drill the reserve twice
    const firstState = drillOilReserve({
      action: {
        id: "1",
        type: "oilReserve.drilled",
      },
      state: {
        ...TEST_FARM,
        inventory: {
          "Oil Drill": new Decimal(3),
        },
        oilReserves: {
          "1": {
            x: 1,
            y: 1,
            height: 2,
            width: 2,
            createdAt: now,
            drilled: 1,
            oil: {
              amount: 10,
              drilledAt: 0,
            },
          },
        },
      },
      createdAt: now,
    });

    // move time forward 21 hrs
    const futureTime = now + 21 * 60 * 60 * 1000;

    const game = drillOilReserve({
      action: {
        id: "1",
        type: "oilReserve.drilled",
      },
      createdAt: futureTime,
      state: {
        ...firstState,
      },
    });

    const reserve = game.oilReserves["1"];
    const baseAmountPlusBonus = BASE_OIL_DROP_AMOUNT + OIL_BONUS_DROP_AMOUNT;
    const expectedOil = firstState.inventory.Oil?.add(baseAmountPlusBonus);

    expect(reserve.oil.drilledAt).toBe(futureTime);
    expect(reserve.drilled).toBe(3);
    expect(game.inventory["Oil Drill"]?.toNumber()).toBe(1);
    expect(game.inventory.Oil).toStrictEqual(expectedOil);
    expect(reserve.oil.amount).toEqual(BASE_OIL_DROP_AMOUNT);
  });

  it("gives a +0.05 Bonus with Battle Fish", () => {
    const boost = 0.05;
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
          "Battle Fish": new Decimal(1),
        },
        collectibles: {
          "Battle Fish": [
            {
              id: "123",
              coordinates: { x: 1, y: 1 },
              createdAt: 0,
              readyAt: 0,
            },
          ],
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
              amount: 10,
              drilledAt: 0,
            },
          },
        },
      },
      createdAt: now,
    });

    const reserve = game.oilReserves["1"];

    expect(reserve.oil.amount).toEqual(BASE_OIL_DROP_AMOUNT + boost);
  });

  it("gives a +0.1 Bonus with Knight Chicken", () => {
    const boost = 0.1;
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
          "Knight Chicken": new Decimal(1),
        },
        collectibles: {
          "Knight Chicken": [
            {
              id: "123",
              coordinates: { x: 1, y: 1 },
              createdAt: 0,
              readyAt: 0,
            },
          ],
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
              amount: 10,
              drilledAt: 0,
            },
          },
        },
      },
      createdAt: now,
    });

    const reserve = game.oilReserves["1"];

    expect(reserve.oil.amount).toEqual(BASE_OIL_DROP_AMOUNT + boost);
  });

  it("gives a +0.15 Bonus with Battle Fish and Knight Chicken", () => {
    const boost = 0.15;
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
          "Battle Fish": new Decimal(1),
          "Knight Chicken": new Decimal(1),
        },
        collectibles: {
          "Battle Fish": [
            {
              id: "123",
              coordinates: { x: 1, y: 1 },
              createdAt: 0,
              readyAt: 0,
            },
          ],
          "Knight Chicken": [
            {
              id: "123",
              coordinates: { x: 1, y: 1 },
              createdAt: 0,
              readyAt: 0,
            },
          ],
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
              amount: 10,
              drilledAt: 0,
            },
          },
        },
      },
      createdAt: now,
    });

    const reserve = game.oilReserves["1"];

    expect(reserve.oil.amount).toEqual(BASE_OIL_DROP_AMOUNT + boost);
  });
});
