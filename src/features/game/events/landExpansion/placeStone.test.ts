import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "features/game/lib/constants";
import { placeStone } from "./placeStone";

describe("placeStone", () => {
  it("ensures stones are in inventory", () => {
    expect(() =>
      placeStone({
        action: {
          coordinates: {
            x: 1,
            y: 1,
          },
          id: "1",
          name: "Stone Rock",
          type: "stone.placed",
        },
        state: {
          ...INITIAL_FARM,
          inventory: {
            "Stone Rock": new Decimal(0),
          },
        },
      }),
    ).toThrow("No stone available");
  });

  it("ensures stones are available", () => {
    expect(() =>
      placeStone({
        action: {
          coordinates: {
            x: 1,
            y: 1,
          },
          id: "1",
          name: "Stone Rock",
          type: "stone.placed",
        },
        state: {
          ...INITIAL_FARM,
          inventory: {
            "Stone Rock": new Decimal(1),
          },
          stones: {
            "123": {
              createdAt: Date.now(),
              stone: {
                minedAt: 0,
              },
              x: 1,
              y: 1,
            },
          },
        },
      }),
    ).toThrow("No stone available");
  });

  it("places a stone", () => {
    const state = placeStone({
      action: {
        coordinates: {
          x: 2,
          y: 2,
        },
        id: "1",
        name: "Stone Rock",
        type: "stone.placed",
      },
      state: {
        ...INITIAL_FARM,
        buildings: {},
        inventory: {
          "Stone Rock": new Decimal(2),
        },
        stones: {
          "123": {
            createdAt: Date.now(),
            stone: {
              minedAt: 0,
            },
            x: 0,
            y: 0,
          },
        },
      },
    });

    expect(state.stones).toEqual({
      "1": {
        createdAt: expect.any(Number),
        stone: {
          minedAt: 0,
        },
        x: 2,
        y: 2,
        name: "Stone Rock",
        multiplier: 1,
        tier: 1,
      },
      "123": {
        createdAt: expect.any(Number),
        stone: {
          minedAt: 0,
        },
        x: 0,
        y: 0,
      },
    });
  });

  it("reinstates current progress when stone was mined", () => {
    const dateNow = Date.now();
    const state = placeStone({
      action: {
        coordinates: {
          x: 2,
          y: 2,
        },
        id: "1", // ID doesn't matter since it's an existing stone
        name: "Stone Rock",
        type: "stone.placed",
      },
      state: {
        ...INITIAL_FARM,
        buildings: {},
        inventory: {
          "Stone Rock": new Decimal(2),
        },
        stones: {
          "123": {
            createdAt: dateNow,
            stone: { minedAt: dateNow - 180000 },
            removedAt: dateNow - 120000,
          },
        },
      },
      createdAt: dateNow,
    });

    expect(state.stones).toEqual({
      "123": {
        createdAt: expect.any(Number),
        stone: {
          minedAt: dateNow - 60000,
        },
        x: 2,
        y: 2,
      },
    });
  });
});
