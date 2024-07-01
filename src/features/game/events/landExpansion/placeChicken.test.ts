import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import { Chicken } from "features/game/types/game";
import { placeChicken } from "./placeChicken";

const makeChickensStateObject = (numOfChickens: number) => {
  return Array.from(Array(numOfChickens).keys()).reduce(
    (obj, curr) => {
      obj[curr] = {
        coordinates: {
          x: curr,
          y: curr,
        },
        multiplier: 1,
      };

      return obj;
    },
    {} as Record<number, Chicken>,
  );
};

describe("buyChicken", () => {
  it("throws an error if no bumpkin exists", () => {
    expect(() =>
      placeChicken({
        state: {
          ...TEST_FARM,
          bumpkin: undefined,
          chickens: {},
        },
        action: {
          id: "1234asdf",
          coordinates: {
            x: 2,
            y: 2,
          },
          type: "chicken.placed",
        },
      }),
    ).toThrow("You do not have a Bumpkin");
  });

  it("throws an error if no chickens are available", () => {
    expect(() =>
      placeChicken({
        state: {
          ...TEST_FARM,
          chickens: {},
          inventory: {
            Chicken: new Decimal(0),
          },
        },
        action: {
          id: "1234asdf",
          coordinates: {
            x: 2,
            y: 2,
          },
          type: "chicken.placed",
        },
      }),
    ).toThrow("You do not have any available chickens");
  });

  it("throws an error if not enough room for more chickens with chicken coop available", () => {
    expect(() =>
      placeChicken({
        state: {
          ...TEST_FARM,
          balance: new Decimal(10),
          inventory: {
            Chicken: new Decimal(16),
            "Chicken Coop": new Decimal(1),
          },
          chickens: {
            ...makeChickensStateObject(15),
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
          collectibles: {
            "Chicken Coop": [
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
          id: "1234asdf",
          coordinates: {
            x: 2,
            y: 2,
          },
          type: "chicken.placed",
        },
      }),
    ).toThrow("Insufficient space for more chickens");
  });

  it("throws an error if not enough room for more chickens without chicken coop available", () => {
    expect(() =>
      placeChicken({
        state: {
          ...TEST_FARM,
          balance: new Decimal(10),
          inventory: {
            Chicken: new Decimal(12),
          },
          chickens: makeChickensStateObject(10),
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
          id: "1234asdf",
          coordinates: {
            x: 2,
            y: 2,
          },
          type: "chicken.placed",
        },
      }),
    ).toThrow("Insufficient space for more chickens");
  });

  it("places a chicken", () => {
    const state = placeChicken({
      state: {
        ...TEST_FARM,
        chickens: {},
        inventory: {
          Chicken: new Decimal(1),
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
        id: "1234asdf",
        coordinates: {
          x: 2,
          y: 2,
        },
        type: "chicken.placed",
      },
    });

    expect(state.chickens).toEqual({
      "1234asdf": {
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
        ...TEST_FARM,
        chickens: {},
        inventory: {
          Chicken: new Decimal(11),
          "Chicken Coop": new Decimal(1),
        },
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
        id: "1234asdf",
        coordinates: {
          x: 2,
          y: 2,
        },
        type: "chicken.placed",
      },
    });

    expect(state.chickens).toEqual({
      "1234asdf": {
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
        ...TEST_FARM,
        chickens: {},
        inventory: {
          Chicken: new Decimal(2),
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
        id: "1234asdf",
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
        id: "asdfg",
        coordinates: {
          x: 3,
          y: 3,
        },
        type: "chicken.placed",
      },
    });

    expect(state.chickens).toEqual({
      "1234asdf": {
        coordinates: {
          x: 2,
          y: 2,
        },
        multiplier: 1,
      },
      asdfg: {
        coordinates: {
          x: 3,
          y: 3,
        },
        multiplier: 1,
      },
    });
  });
});
