import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "features/game/lib/constants";
import { placePlot } from "./placePlot";

describe("placePlot", () => {
  const dateNow = Date.now();
  it("ensures crops are in inventory", () => {
    expect(() =>
      placePlot({
        action: {
          coordinates: {
            x: 1,
            y: 1,
          },
          id: "1",
          name: "Crop Plot",
          type: "plot.placed",
        },
        state: {
          ...INITIAL_FARM,
          inventory: {
            "Crop Plot": new Decimal(0),
          },
        },
      }),
    ).toThrow("No plots available");
  });

  it("ensures crops are available", () => {
    expect(() =>
      placePlot({
        action: {
          coordinates: {
            x: 1,
            y: 1,
          },
          id: "1",
          name: "Crop Plot",
          type: "plot.placed",
        },
        state: {
          ...INITIAL_FARM,
          inventory: {
            "Crop Plot": new Decimal(1),
          },
          crops: {
            "123": {
              createdAt: dateNow,
              x: 1,
              y: 1,
            },
          },
        },
      }),
    ).toThrow("No plots available");
  });

  it("places a crop", () => {
    const createdAt = dateNow;
    const state = placePlot({
      action: {
        coordinates: {
          x: 2,
          y: 2,
        },
        id: "1",
        name: "Crop Plot",
        type: "plot.placed",
      },
      state: {
        ...INITIAL_FARM,
        buildings: {},
        inventory: {
          "Crop Plot": new Decimal(2),
        },
        crops: {
          "123": {
            createdAt: dateNow,

            x: 0,
            y: 0,
          },
        },
      },
      createdAt,
    });

    expect(state.crops).toEqual({
      "1": {
        createdAt,
        x: 2,
        y: 2,
      },
      "123": {
        createdAt,
        x: 0,
        y: 0,
      },
    });
  });
});
