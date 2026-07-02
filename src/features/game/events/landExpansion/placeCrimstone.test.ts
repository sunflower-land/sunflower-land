import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "features/game/lib/constants";
import { MINE_BOOST_SPEED } from "features/game/lib/boostWindows";
import { placeCrimstone } from "./placeCrimstone";

describe("placeRuby", () => {
  it("ensures crimstone are in inventory", () => {
    expect(() =>
      placeCrimstone({
        action: {
          coordinates: {
            x: 1,
            y: 1,
          },
          id: "1",
          name: "Crimstone Rock",
          type: "crimstone.placed",
        },
        state: {
          ...INITIAL_FARM,
          inventory: {
            "Crimstone Rock": new Decimal(0),
          },
        },
      }),
    ).toThrow("No crimstones available");
  });

  it("ensures crimstone are available", () => {
    expect(() =>
      placeCrimstone({
        action: {
          coordinates: {
            x: 1,
            y: 1,
          },
          id: "1",
          name: "Crimstone Rock",
          type: "crimstone.placed",
        },
        state: {
          ...INITIAL_FARM,
          inventory: {
            "Crimstone Rock": new Decimal(1),
          },
          crimstones: {
            "123": {
              createdAt: Date.now(),
              stone: {
                minedAt: 0,
              },
              x: 1,
              y: 1,
              minesLeft: 5,
            },
          },
        },
      }),
    ).toThrow("No crimstones available");
  });

  it("places a crimstone", () => {
    const state = placeCrimstone({
      action: {
        coordinates: {
          x: 2,
          y: 2,
        },
        id: "1",
        name: "Crimstone Rock",
        type: "crimstone.placed",
      },
      state: {
        ...INITIAL_FARM,
        buildings: {},
        inventory: {
          "Crimstone Rock": new Decimal(2),
        },
        crimstones: {
          "123": {
            createdAt: Date.now(),
            stone: {
              minedAt: 0,
            },
            x: 0,
            y: 0,
            minesLeft: 5,
          },
        },
      },
    });

    expect(state.crimstones).toEqual({
      "1": {
        createdAt: expect.any(Number),
        stone: {
          minedAt: 0,
        },
        x: 2,
        y: 2,
        minesLeft: 5,
      },
      "123": {
        createdAt: expect.any(Number),
        stone: {
          minedAt: 0,
        },
        x: 0,
        y: 0,
        minesLeft: 5,
      },
    });
  });

  it("reinstates current progress when stone was mined", () => {
    const dateNow = Date.now();
    const state = placeCrimstone({
      action: {
        coordinates: {
          x: 2,
          y: 2,
        },
        id: "1", // ID doesn't matter since it's an existing stone
        name: "Crimstone Rock",
        type: "crimstone.placed",
      },
      state: {
        ...INITIAL_FARM,
        buildings: {},
        inventory: {
          "Crimstone Rock": new Decimal(2),
        },
        crimstones: {
          "123": {
            createdAt: dateNow,
            stone: { minedAt: dateNow - 180000 },
            removedAt: dateNow - 120000,
            minesLeft: 5,
          },
        },
      },
      createdAt: dateNow,
    });

    expect(state.crimstones).toEqual({
      "123": {
        createdAt: expect.any(Number),
        stone: {
          minedAt: dateNow - 60000,
        },
        x: 2,
        y: 2,
        minesLeft: 5,
      },
    });
  });

  it("banks boosted work when a Mole Shrine window covered the pre-lift period", () => {
    const dateNow = Date.now();
    const minedAt = dateNow - 180000;
    const removedAt = dateNow - 120000; // 60s of real recovery before the lift
    const baseDurationMs = 200000;
    const speed = MINE_BOOST_SPEED["Mole Shrine"]; // 1.35x

    const state = placeCrimstone({
      action: {
        coordinates: { x: 2, y: 2 },
        id: "1",
        name: "Crimstone Rock",
        type: "crimstone.placed",
      },
      state: {
        ...INITIAL_FARM,
        buildings: {},
        inventory: { "Crimstone Rock": new Decimal(2) },
        collectibles: {
          "Mole Shrine": [
            {
              id: "ms",
              coordinates: { x: 5, y: 5 },
              createdAt: dateNow - 200000,
              readyAt: dateNow - 200000,
            },
          ],
        },
        crimstones: {
          "123": {
            createdAt: dateNow,
            stone: { minedAt, baseDurationMs },
            removedAt,
            minesLeft: 5,
          },
        },
      },
      createdAt: dateNow,
    });

    const stone = state.crimstones["123"].stone;
    const banked = 60000 * speed;
    expect(stone.minedAt).toBe(dateNow);
    expect(stone.baseDurationMs).toBeCloseTo(baseDurationMs - banked, 5);
  });
});
