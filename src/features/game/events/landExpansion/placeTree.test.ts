import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "features/game/lib/constants";
import { placeTree } from "./placeTree";

describe("placeTree", () => {
  const dateNow = Date.now();
  it("ensures trees are in inventory", () => {
    expect(() =>
      placeTree({
        action: {
          coordinates: {
            x: 1,
            y: 1,
          },
          id: "1",
          name: "Tree",
          type: "tree.placed",
        },
        state: {
          ...INITIAL_FARM,
          inventory: {
            Tree: new Decimal(0),
          },
        },
      }),
    ).toThrow("No trees available");
  });

  it("ensures trees are available", () => {
    expect(() =>
      placeTree({
        action: {
          coordinates: {
            x: 1,
            y: 1,
          },
          id: "1",
          name: "Tree",
          type: "tree.placed",
        },
        state: {
          ...INITIAL_FARM,
          inventory: {
            Tree: new Decimal(1),
          },
          trees: {
            "123": {
              createdAt: dateNow,
              wood: {
                choppedAt: 0,
              },
              x: 1,
              y: 1,
            },
          },
        },
      }),
    ).toThrow("No trees available");
  });

  it("places a tree", () => {
    const createdAt = dateNow;
    const state = placeTree({
      action: {
        coordinates: {
          x: 2,
          y: 2,
        },
        id: "1",
        name: "Tree",
        type: "tree.placed",
      },
      state: {
        ...INITIAL_FARM,
        buildings: {},
        inventory: {
          Tree: new Decimal(2),
        },
        trees: {
          "123": {
            createdAt: dateNow,
            wood: {
              choppedAt: 0,
            },
            x: 0,
            y: 0,
          },
        },
      },
      createdAt,
    });

    expect(state.trees).toEqual({
      "1": {
        createdAt,
        wood: {
          choppedAt: 0,
        },
        x: 2,
        y: 2,
        multiplier: 1,
        tier: 1,
        name: "Tree",
      },
      "123": {
        createdAt,
        wood: {
          choppedAt: 0,
        },
        x: 0,
        y: 0,
      },
    });
  });

  it("reinstates current progress", () => {
    const createdAt = dateNow;
    const state = placeTree({
      action: {
        coordinates: {
          x: 2,
          y: 2,
        },
        id: "156", // ID doesn't matter since it's an existing tree
        name: "Tree",
        type: "tree.placed",
      },
      state: {
        ...INITIAL_FARM,
        buildings: {},
        inventory: {
          Tree: new Decimal(2),
        },
        trees: {
          "123": {
            createdAt: dateNow,
            wood: {
              choppedAt: dateNow - 180000,
            },
            removedAt: dateNow - 120000,
          },
        },
      },
      createdAt,
    });

    expect(state.trees).toEqual({
      "123": {
        createdAt,
        wood: {
          choppedAt: dateNow - 60000,
        },
        x: 2,
        y: 2,
      },
    });
  });
});
