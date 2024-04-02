import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import { buyChicken } from "./buyChicken";
import { ANIMALS } from "features/game/types/craftables";

describe("buyChicken", () => {
  it("throws an error if no bumpkin exists", () => {
    expect(() =>
      buyChicken({
        state: {
          ...TEST_FARM,
          bumpkin: undefined,
        },
        action: {
          id: "1234asd",
          coordinates: {
            x: 2,
            y: 2,
          },
          type: "chicken.bought",
        },
      })
    ).toThrow("You do not have a Bumpkin");
  });

  it("requires coins to purchase chicken", () => {
    expect(() =>
      buyChicken({
        state: {
          ...TEST_FARM,
          coins: 0,
          buildings: {
            "Hen House": [
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
          id: "1234asd",
          coordinates: {
            x: 2,
            y: 2,
          },
          type: "chicken.bought",
        },
      })
    ).toThrow("Insufficient Coins");
  });

  it("burns coins", () => {
    const coins = 1000;
    const state = buyChicken({
      state: {
        ...TEST_FARM,
        coins,
        buildings: {
          "Hen House": [
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
        id: "1234asd",
        coordinates: {
          x: 2,
          y: 2,
        },
        type: "chicken.bought",
      },
    });

    expect(state.coins).toEqual(coins - (ANIMALS["Chicken"].price ?? 0));
  });

  it("places a chicken on land", () => {
    const state = buyChicken({
      state: {
        ...TEST_FARM,
        chickens: {},
        coins: 1000,
        buildings: {
          "Hen House": [
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
        id: "1234asd",
        coordinates: {
          x: 2,
          y: 2,
        },
        type: "chicken.bought",
      },
    });

    expect(state.chickens).toEqual({
      "1234asd": {
        coordinates: {
          x: 2,
          y: 2,
        },
        multiplier: 1,
      },
    });
  });

  it("places a chicken on land with chicken coop available", () => {
    const state = buyChicken({
      state: {
        ...TEST_FARM,
        inventory: {
          "Chicken Coop": new Decimal(1),
          "Hen House": new Decimal(1),
          Chicken: new Decimal(10),
        },
        chickens: {},
        coins: 1000,
        collectibles: {
          "Chicken Coop": [
            {
              id: "123",
              createdAt: 0,
              coordinates: { x: 1, y: 1 },
              readyAt: 0,
            },
          ],
        },
        buildings: {
          "Hen House": [
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
        id: "1234asd",
        coordinates: {
          x: 2,
          y: 2,
        },
        type: "chicken.bought",
      },
    });

    expect(state.chickens).toEqual({
      "1234asd": {
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
        ...TEST_FARM,
        chickens: {},
        coins: 1000,
        buildings: {
          "Hen House": [
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
        id: "112",
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
        id: "1234asd",
        coordinates: {
          x: 3,
          y: 3,
        },
        type: "chicken.bought",
      },
    });

    expect(state.chickens).toEqual({
      "112": {
        coordinates: {
          x: 2,
          y: 2,
        },
        multiplier: 1,
      },
      "1234asd": {
        coordinates: {
          x: 3,
          y: 3,
        },
        multiplier: 1,
      },
    });
  });

  it("increments spent coins activity", () => {
    const state = buyChicken({
      state: {
        ...TEST_FARM,
        chickens: {},
        coins: 1000,
        buildings: {
          "Hen House": [
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
        id: "1234asd",
        coordinates: {
          x: 2,
          y: 2,
        },
        type: "chicken.bought",
      },
    });

    expect(state.bumpkin?.activity?.["Coins Spent"]).toEqual(
      ANIMALS.Chicken.price ?? 0
    );
  });

  it("throws an error if not enough room for more chickens without chicken coop", () => {
    expect(() =>
      buyChicken({
        state: {
          ...TEST_FARM,
          coins: 1000,
          inventory: {
            Chicken: new Decimal(10),
          },
          buildings: {
            "Hen House": [
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
          id: "1234asd",
          coordinates: {
            x: 2,
            y: 2,
          },
          type: "chicken.bought",
        },
      })
    ).toThrow("Insufficient space for more chickens");
  });

  it("throws an error if not enough room for more chickens with chicken coop available", () => {
    expect(() =>
      buyChicken({
        state: {
          ...TEST_FARM,
          coins: 1000,
          inventory: {
            Chicken: new Decimal(15),
            "Chicken Coop": new Decimal(1),
          },
          buildings: {
            "Hen House": [
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
          id: "1234asd",
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
        ...TEST_FARM,
        chickens: {},
        coins: 1000,
        buildings: {
          "Hen House": [
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
        id: "1234asd",
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
        ...TEST_FARM,
        chickens: {},
        inventory: {
          Sunflower: new Decimal(100),
        },
        coins: 1000,
        buildings: {
          "Hen House": [
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
        id: "1234asd",
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
