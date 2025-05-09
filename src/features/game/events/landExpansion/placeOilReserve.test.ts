import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "features/game/lib/constants";
import { placeOilReserve } from "./placeOilReserve";

describe("placeOil", () => {
  it("ensures oil reserves are in inventory", () => {
    expect(() =>
      placeOilReserve({
        action: {
          coordinates: {
            x: 1,
            y: 1,
          },
          id: "1",
          type: "oilReserve.placed",
        },
        state: {
          ...INITIAL_FARM,
          inventory: {
            "Oil Reserve": new Decimal(0),
          },
        },
      }),
    ).toThrow("No oil reserve available");
  });

  it("ensures oil reserves are available", () => {
    expect(() =>
      placeOilReserve({
        action: {
          coordinates: {
            x: 1,
            y: 1,
          },
          id: "1",

          type: "oilReserve.placed",
        },
        state: {
          ...INITIAL_FARM,
          inventory: {
            "Oil Reserve": new Decimal(1),
          },
          oilReserves: {
            "123": {
              createdAt: Date.now(),
              oil: {
                amount: 1,
                drilledAt: 0,
              },
              x: 1,
              y: 1,
              drilled: 5,
            },
          },
        },
      }),
    ).toThrow("No oil reserve available");
  });

  it("places a oil reserve", () => {
    const state = placeOilReserve({
      action: {
        coordinates: {
          x: 2,
          y: 2,
        },
        id: "1",
        type: "oilReserve.placed",
      },
      state: {
        ...INITIAL_FARM,
        buildings: {},
        inventory: {
          "Oil Reserve": new Decimal(2),
        },
        oilReserves: {
          "123": {
            createdAt: Date.now(),
            oil: {
              amount: 10,
              drilledAt: 0,
            },
            x: 0,
            y: 0,
            drilled: 0,
          },
        },
      },
    });

    expect(state.oilReserves).toEqual({
      "1": {
        createdAt: expect.any(Number),
        oil: {
          amount: 10,
          drilledAt: 0,
        },
        x: 2,
        y: 2,
        drilled: 0,
      },
      "123": {
        createdAt: expect.any(Number),
        oil: {
          amount: 10,
          drilledAt: 0,
        },
        x: 0,
        y: 0,
        drilled: 0,
      },
    });
  });
});
