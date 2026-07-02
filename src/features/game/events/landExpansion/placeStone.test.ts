import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "features/game/lib/constants";
import { MINE_BOOST_SPEED } from "features/game/lib/boostWindows";
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

  it("banks boosted work when a mine speed window covered the pre-lift period", () => {
    const dateNow = Date.now();
    const minedAt = dateNow - 180000;
    const removedAt = dateNow - 120000; // 60s of real recovery before the lift
    const baseDurationMs = 200000;
    const speed = MINE_BOOST_SPEED["Ore Hourglass"]; // 2x

    const state = placeStone({
      action: {
        coordinates: { x: 2, y: 2 },
        id: "1",
        name: "Stone Rock",
        type: "stone.placed",
      },
      state: {
        ...INITIAL_FARM,
        buildings: {},
        inventory: { "Stone Rock": new Decimal(2) },
        collectibles: {
          // Placed before the rock was mined, so its window covers the whole pre-lift period.
          "Ore Hourglass": [
            {
              id: "hg",
              coordinates: { x: 5, y: 5 },
              createdAt: dateNow - 200000,
              readyAt: dateNow - 200000,
            },
          ],
        },
        stones: {
          "123": {
            createdAt: dateNow,
            stone: { minedAt, baseDurationMs },
            removedAt,
          },
        },
      },
      createdAt: dateNow,
    });

    const stone = state.stones["123"].stone;
    const banked = 60000 * speed; // 60s of real time at 2x = 120000ms of work
    // Recovery resumes from the replace time; the boost credit earned before the
    // lift is banked, so far more than the 60s wall-clock is subtracted.
    expect(stone.minedAt).toBe(dateNow);
    expect(stone.baseDurationMs).toBeCloseTo(baseDurationMs - banked, 5);
  });

  it("does not credit a mine boost that was only added during the lift", () => {
    const dateNow = Date.now();
    const minedAt = dateNow - 180000;
    const removedAt = dateNow - 120000; // 60s of UNBOOSTED recovery before the lift
    const baseDurationMs = 200000;

    const state = placeStone({
      action: {
        coordinates: { x: 2, y: 2 },
        id: "1",
        name: "Stone Rock",
        type: "stone.placed",
      },
      state: {
        ...INITIAL_FARM,
        buildings: {},
        inventory: { "Stone Rock": new Decimal(2) },
        collectibles: {
          // Placed AFTER the rock was lifted — must not retro-credit pre-lift recovery.
          "Ore Hourglass": [
            {
              id: "hg",
              coordinates: { x: 5, y: 5 },
              createdAt: dateNow - 60000,
              readyAt: dateNow - 60000,
            },
          ],
        },
        stones: {
          "123": {
            createdAt: dateNow,
            stone: { minedAt, baseDurationMs },
            removedAt,
          },
        },
      },
      createdAt: dateNow,
    });

    const stone = state.stones["123"].stone;
    // 60s of pre-lift recovery accrued at 1x (no boost then): exactly 60000 banked.
    expect(stone.minedAt).toBe(dateNow);
    expect(stone.baseDurationMs).toBe(baseDurationMs - 60000);
  });
});
