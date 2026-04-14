import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "features/game/lib/constants";
import { placeIron } from "./placeIron";

describe("placeIron", () => {
  it("ensures iron are in inventory", () => {
    expect(() =>
      placeIron({
        action: {
          coordinates: {
            x: 1,
            y: 1,
          },
          id: "1",
          name: "Iron Rock",
          type: "iron.placed",
        },
        state: {
          ...INITIAL_FARM,
          inventory: {
            "Iron Rock": new Decimal(0),
          },
        },
      }),
    ).toThrow("No iron available");
  });

  it("ensures iron are available", () => {
    expect(() =>
      placeIron({
        action: {
          coordinates: {
            x: 1,
            y: 1,
          },
          id: "1",
          name: "Iron Rock",
          type: "iron.placed",
        },
        state: {
          ...INITIAL_FARM,
          inventory: {
            "Iron Rock": new Decimal(1),
          },
          iron: {
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
    ).toThrow("No iron available");
  });

  it("places a iron rock", () => {
    const state = placeIron({
      action: {
        coordinates: {
          x: 2,
          y: 2,
        },
        id: "1",
        name: "Iron Rock",
        type: "iron.placed",
      },
      state: {
        ...INITIAL_FARM,
        buildings: {},
        inventory: {
          "Iron Rock": new Decimal(2),
        },
        iron: {
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

    expect(state.iron).toEqual({
      "1": {
        createdAt: expect.any(Number),
        stone: {
          minedAt: 0,
        },
        x: 2,
        y: 2,
        name: "Iron Rock",
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
    const state = placeIron({
      action: {
        coordinates: {
          x: 2,
          y: 2,
        },
        id: "1", // ID doesn't matter since it's an existing stone
        name: "Iron Rock",
        type: "iron.placed",
      },
      state: {
        ...INITIAL_FARM,
        buildings: {},
        inventory: {
          "Iron Rock": new Decimal(2),
        },
        iron: {
          "123": {
            createdAt: dateNow,
            stone: { minedAt: dateNow - 180000 },
            removedAt: dateNow - 120000,
          },
        },
      },
      createdAt: dateNow,
    });

    expect(state.iron).toEqual({
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
