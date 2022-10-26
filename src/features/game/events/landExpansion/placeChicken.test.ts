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

  it("throws an error if not enough room for more chickens with chicken coop available", () => {
    expect(() =>
      placeChicken({
        state: {
          ...INITIAL_FARM,
          balance: new Decimal(10),
          inventory: {
            Chicken: new Decimal(15),
            "Chicken Coop": new Decimal(1),
          },
          buildings: {
            "Chicken House": [
              {
                coordinates: {
                  x: 0,
                  y: 0,
                },
                createdAt: 0,
                id: "123",
                readyAt: 0,
              },
            ],
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
    ).toThrow("Insufficient space for more chickens");
  });

  it("throws an error if not enough room for more chickens without chicken coop available", () => {
    expect(() =>
      placeChicken({
        state: {
          ...INITIAL_FARM,
          balance: new Decimal(10),
          inventory: {
            Chicken: new Decimal(10),
          },
          buildings: {
            "Chicken House": [
              {
                coordinates: {
                  x: 0,
                  y: 0,
                },
                createdAt: 0,
                id: "123",
                readyAt: 0,
              },
            ],
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
    ).toThrow("Insufficient space for more chickens");
  });

  it("places a chicken", () => {
    const state = placeChicken({
      state: {
        ...INITIAL_FARM,
        chickens: {},
        inventory: {
          Chicken: new Decimal(1),
        },
        buildings: {
          "Chicken House": [
            {
              coordinates: {
                x: 0,
                y: 0,
              },
              createdAt: 0,
              id: "123",
              readyAt: 0,
            },
          ],
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

  it("places a chicken with chicken coop available", () => {
    const state = placeChicken({
      state: {
        ...INITIAL_FARM,
        chickens: {},
        inventory: {
          Chicken: new Decimal(11),
          "Chicken Coop": new Decimal(1),
        },
        buildings: {
          "Chicken House": [
            {
              coordinates: {
                x: 0,
                y: 0,
              },
              createdAt: 0,
              id: "123",
              readyAt: 0,
            },
          ],
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
        buildings: {
          "Chicken House": [
            {
              coordinates: {
                x: 0,
                y: 0,
              },
              createdAt: 0,
              id: "123",
              readyAt: 0,
            },
          ],
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
