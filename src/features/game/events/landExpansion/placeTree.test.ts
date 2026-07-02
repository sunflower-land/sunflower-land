import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "features/game/lib/constants";
import { TREE_BOOST_SPEED } from "features/game/lib/boostWindows";
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

  it("banks boosted work when a tree speed window covered the pre-lift period", () => {
    const now = Date.now();
    const choppedAt = now - 180000;
    const removedAt = now - 120000; // 60s of real recovery before the lift
    const baseDurationMs = 200000;
    const speed = TREE_BOOST_SPEED["Timber Hourglass"]; // 1.35x

    const state = placeTree({
      action: {
        coordinates: { x: 2, y: 2 },
        id: "156",
        name: "Tree",
        type: "tree.placed",
      },
      state: {
        ...INITIAL_FARM,
        buildings: {},
        inventory: { Tree: new Decimal(2) },
        collectibles: {
          "Timber Hourglass": [
            {
              id: "hg",
              coordinates: { x: 5, y: 5 },
              createdAt: now - 200000,
              readyAt: now - 200000,
            },
          ],
        },
        trees: {
          "123": {
            createdAt: now,
            wood: { choppedAt, baseDurationMs },
            removedAt,
          },
        },
      },
      createdAt: now,
    });

    const wood = state.trees["123"].wood;
    const banked = 60000 * speed;
    expect(wood.choppedAt).toBe(now);
    expect(wood.baseDurationMs).toBeCloseTo(baseDurationMs - banked, 5);
  });
});
