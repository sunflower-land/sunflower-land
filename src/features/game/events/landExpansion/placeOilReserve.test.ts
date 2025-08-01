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
          drilledAt: 0,
        },
        x: 2,
        y: 2,
        drilled: 0,
      },
      "123": {
        createdAt: expect.any(Number),
        oil: {
          drilledAt: 0,
        },
        x: 0,
        y: 0,
        drilled: 0,
      },
    });
  });
  it("reinstates current progress when oil was drilled", () => {
    const dateNow = Date.now();
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
            createdAt: dateNow,
            oil: {
              drilledAt: dateNow - 180000,
            },
            drilled: 5,
            removedAt: dateNow - 120000,
          },
        },
      },
      createdAt: dateNow,
    });

    expect(state.oilReserves).toEqual({
      "123": {
        createdAt: expect.any(Number),
        oil: {
          drilledAt: dateNow - 60000,
        },
        x: 2,
        y: 2,
        drilled: 5,
      },
    });
  });
});
