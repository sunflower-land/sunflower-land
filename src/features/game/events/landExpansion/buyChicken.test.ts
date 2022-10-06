import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "features/game/lib/constants";
import { marketRate } from "features/game/lib/halvening";
import { buyChicken } from "./buyChicken";

describe("buyChicken", () => {
  it("throws an error if no bumpkin exists", () => {
    expect(() =>
      buyChicken({
        state: {
          ...INITIAL_FARM,
          bumpkin: undefined,
        },
        action: {
          coordinates: {
            x: 2,
            y: 2,
          },
          type: "chicken.bought",
        },
      })
    ).toThrow("You do not have a Bumpkin");
  });

  it("requires SFL to purchase chicken", () => {
    expect(() =>
      buyChicken({
        state: {
          ...INITIAL_FARM,
          balance: new Decimal(0.01),
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
          type: "chicken.bought",
        },
      })
    ).toThrow("Insufficient SFL");
  });

  it("burns SFL", () => {
    const state = buyChicken({
      state: {
        ...INITIAL_FARM,
        balance: new Decimal(10),
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
        type: "chicken.bought",
      },
    });

    expect(state.balance).toEqual(new Decimal(10).sub(marketRate(200)));
  });
  it("places a chicken on land", () => {
    const state = buyChicken({
      state: {
        ...INITIAL_FARM,
        chickens: {},
        balance: new Decimal(10),
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
        type: "chicken.bought",
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
    let state = buyChicken({
      state: {
        ...INITIAL_FARM,
        chickens: {},
        balance: new Decimal(10),
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
            {
              coordinates: {
                x: 2,
                y: 2,
              },
              createdAt: 0,
              id: "435",
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
        type: "chicken.bought",
      },
    });

    state = buyChicken({
      state,
      action: {
        coordinates: {
          x: 3,
          y: 3,
        },
        type: "chicken.bought",
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
  it("increments spent SFL activity", () => {
    const state = buyChicken({
      state: {
        ...INITIAL_FARM,
        chickens: {},
        balance: new Decimal(10),
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
        type: "chicken.bought",
      },
    });

    expect(state.bumpkin?.activity?.["SFL Spent"]).toEqual(
      marketRate(200).toNumber()
    );
  });

  it("throws an error if not enough room for more chickens", () => {
    expect(() =>
      buyChicken({
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
          type: "chicken.bought",
        },
      })
    ).toThrow("Insufficient space for more chickens");
  });
  it("increments bought chicken activity", () => {
    const state = buyChicken({
      state: {
        ...INITIAL_FARM,
        chickens: {},
        balance: new Decimal(10),
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
        type: "chicken.bought",
      },
    });

    expect(state.bumpkin?.activity?.["Chicken Bought"]).toEqual(1);
  });

  it("mints a chicken", () => {
    const state = buyChicken({
      state: {
        ...INITIAL_FARM,
        chickens: {},
        inventory: {
          Sunflower: new Decimal(100),
        },
        balance: new Decimal(10),
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
            {
              coordinates: {
                x: 2,
                y: 2,
              },
              createdAt: 0,
              id: "435",
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
        type: "chicken.bought",
      },
    });

    expect(state.inventory).toEqual({
      Sunflower: new Decimal(100),
      Chicken: new Decimal(1),
    });
  });
});
