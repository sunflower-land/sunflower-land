import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "features/game/lib/constants";
import { placeGold } from "./placeGold";

describe("placeGold", () => {
  it("ensures gold are in inventory", () => {
    expect(() =>
      placeGold({
        action: {
          coordinates: {
            x: 1,
            y: 1,
          },
          id: "1",
          name: "Gold Rock",
          type: "gold.placed",
        },
        state: {
          ...INITIAL_FARM,
          inventory: {
            "Gold Rock": new Decimal(0),
          },
        },
      }),
    ).toThrow("No gold available");
  });

  it("ensures gold are available", () => {
    expect(() =>
      placeGold({
        action: {
          coordinates: {
            x: 1,
            y: 1,
          },
          id: "1",
          name: "Gold Rock",
          type: "gold.placed",
        },
        state: {
          ...INITIAL_FARM,
          inventory: {
            "Gold Rock": new Decimal(1),
          },
          gold: {
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
    ).toThrow("No gold available");
  });

  it("places a gold rock", () => {
    const state = placeGold({
      action: {
        coordinates: {
          x: 2,
          y: 2,
        },
        id: "1",
        name: "Gold Rock",
        type: "gold.placed",
      },
      state: {
        ...INITIAL_FARM,
        buildings: {},
        inventory: {
          "Gold Rock": new Decimal(2),
        },
        gold: {
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

    expect(state.gold).toEqual({
      "1": {
        createdAt: expect.any(Number),
        stone: {
          minedAt: 0,
        },
        x: 2,
        y: 2,
        name: "Gold Rock",
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
    const state = placeGold({
      action: {
        coordinates: {
          x: 2,
          y: 2,
        },
        id: "1",
        name: "Gold Rock",
        type: "gold.placed",
      },
      state: {
        ...INITIAL_FARM,
        buildings: {},
        inventory: {
          "Gold Rock": new Decimal(2),
        },
        gold: {
          "123": {
            createdAt: dateNow,
            stone: { minedAt: dateNow - 180000 },
            removedAt: dateNow - 120000,
          },
        },
      },
      createdAt: dateNow,
    });

    expect(state.gold).toEqual({
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
