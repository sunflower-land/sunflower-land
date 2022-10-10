import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "features/game/lib/constants";
import { placeChicken } from "./placeChicken";

describe("buyChicken", () => {
  it("throws an error if no bumpkin exists", () => {
    expect(() =>
      placeChicken({
        state: {
          ...INITIAL_FARM,
          bumpkin: undefined,
          chickens: {},
        },
        action: {
          coordinates: {
            x: 2,
            y: 2,
          },
          type: "chicken.placed",
        },
      })
    ).toThrow("You do not have a Bumpkin");
  });

  it("throws an error if no chickens are available", () => {
    expect(() =>
      placeChicken({
        state: {
          ...INITIAL_FARM,
          chickens: {},
          inventory: {
            Chicken: new Decimal(0),
          },
        },
        action: {
          coordinates: {
            x: 2,
            y: 2,
          },
          type: "chicken.placed",
        },
      })
    ).toThrow("You do not have any available chickens");
  });

  it("places a chicken", () => {
    const state = placeChicken({
      state: {
        ...INITIAL_FARM,
        chickens: {},
        inventory: {
          Chicken: new Decimal(1),
        },
      },
      action: {
        coordinates: {
          x: 2,
          y: 2,
        },
        type: "chicken.placed",
      },
    });

    expect(state.chickens).toEqual({
      0: {
        coordinates: {
          x: 2,
          y: 2,
        },
        multiplier: 1,
      },
    });
  });

  it("places multiple chickens", () => {
    let state = placeChicken({
      state: {
        ...INITIAL_FARM,
        chickens: {},
        inventory: {
          Chicken: new Decimal(2),
        },
      },
      action: {
        coordinates: {
          x: 2,
          y: 2,
        },
        type: "chicken.placed",
      },
    });

    state = placeChicken({
      state,
      action: {
        coordinates: {
          x: 3,
          y: 3,
        },
        type: "chicken.placed",
      },
    });

    expect(state.chickens).toEqual({
      0: {
        coordinates: {
          x: 2,
          y: 2,
        },
        multiplier: 1,
      },
      1: {
        coordinates: {
          x: 3,
          y: 3,
        },
        multiplier: 1,
      },
    });
  });
});
