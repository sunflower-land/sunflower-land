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
                amount: 1,
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
              amount: 1,
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
          amount: 1,
          choppedAt: 0,
        },
        x: 2,
        y: 2,
      },
      "123": {
        createdAt,
        wood: {
          amount: 1,
          choppedAt: 0,
        },
        x: 0,
        y: 0,
      },
    });
  });
});
