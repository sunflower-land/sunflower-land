import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "features/game/lib/constants";
import { placePlot } from "./placePlot";
import { CROP_PLOT_BOOST_SPEED } from "features/game/lib/boostWindows";

describe("placePlot", () => {
  const dateNow = Date.now();
  it("ensures crops are in inventory", () => {
    expect(() =>
      placePlot({
        action: {
          coordinates: {
            x: 1,
            y: 1,
          },
          id: "1",
          name: "Crop Plot",
          type: "plot.placed",
        },
        state: {
          ...INITIAL_FARM,
          inventory: {
            "Crop Plot": new Decimal(0),
          },
        },
      }),
    ).toThrow("No plots available");
  });

  it("ensures crops are available", () => {
    expect(() =>
      placePlot({
        action: {
          coordinates: {
            x: 1,
            y: 1,
          },
          id: "1",
          name: "Crop Plot",
          type: "plot.placed",
        },
        state: {
          ...INITIAL_FARM,
          inventory: {
            "Crop Plot": new Decimal(1),
          },
          crops: {
            "123": {
              createdAt: dateNow,
              x: 1,
              y: 1,
            },
          },
        },
      }),
    ).toThrow("No plots available");
  });

  it("places a crop", () => {
    const createdAt = dateNow;
    const state = placePlot({
      action: {
        coordinates: {
          x: 2,
          y: 2,
        },
        id: "1",
        name: "Crop Plot",
        type: "plot.placed",
      },
      state: {
        ...INITIAL_FARM,
        buildings: {},
        inventory: {
          "Crop Plot": new Decimal(2),
        },
        crops: {
          "123": {
            createdAt: dateNow,

            x: 0,
            y: 0,
          },
        },
      },
      createdAt,
    });

    expect(state.crops).toEqual({
      "1": {
        createdAt,
        x: 2,
        y: 2,
      },
      "123": {
        createdAt,
        x: 0,
        y: 0,
      },
    });
  });

  it("reinstates current progress", () => {
    const createdAt = dateNow;
    const state = placePlot({
      action: {
        coordinates: {
          x: 2,
          y: 2,
        },
        id: "156", // ID doesn't matter since it's an existing plot
        name: "Crop Plot",
        type: "plot.placed",
      },
      state: {
        ...INITIAL_FARM,
        buildings: {},
        inventory: {
          "Crop Plot": new Decimal(3),
        },
        crops: {
          "123": {
            createdAt: dateNow,
            crop: {
              name: "Pumpkin",
              plantedAt: dateNow - 180000,
            },
            removedAt: dateNow - 120000,
          },
          "1": {
            createdAt: dateNow,
            x: 0,
            y: 0,
          },
        },
      },
      createdAt,
    });

    expect(state.crops["123"].crop?.plantedAt).toBe(dateNow - 60000);
  });

  it("pauses a windowed crop on lift and resumes the remaining work on replace", () => {
    const createdAt = dateNow;
    const plantedAt = dateNow - 180000;
    const removedAt = dateNow - 120000; // 60s of work accrued before the lift
    const baseDurationMs = 120000; // 120s total work

    const state = placePlot({
      action: {
        coordinates: { x: 2, y: 2 },
        id: "156",
        name: "Crop Plot",
        type: "plot.placed",
      },
      state: {
        ...INITIAL_FARM,
        buildings: {},
        inventory: { "Crop Plot": new Decimal(3) },
        crops: {
          "123": {
            createdAt: dateNow,
            crop: { name: "Pumpkin", plantedAt, baseDurationMs },
            removedAt,
          },
          "1": { createdAt: dateNow, x: 0, y: 0 },
        },
      },
      createdAt,
    });

    const crop = state.crops["123"].crop;
    // No active windows: 60s of work banked at 1x; 60s of work still to do,
    // resuming from the replace time (the lifted interval is excluded).
    expect(crop?.plantedAt).toBe(createdAt);
    expect(crop?.baseDurationMs).toBe(60000);
    expect(crop?.boostedTime).toBe(60000);
  });

  it("banks boosted work when a speed window covered the pre-lift period", () => {
    const createdAt = dateNow;
    const plantedAt = dateNow - 180000;
    const removedAt = dateNow - 120000; // 60s real time before the lift
    const baseDurationMs = 200000;
    const speed = CROP_PLOT_BOOST_SPEED["Sparrow Shrine"]; // 1.35x

    const state = placePlot({
      action: {
        coordinates: { x: 2, y: 2 },
        id: "156",
        name: "Crop Plot",
        type: "plot.placed",
      },
      state: {
        ...INITIAL_FARM,
        buildings: {},
        inventory: { "Crop Plot": new Decimal(3) },
        collectibles: {
          // Placed before the crop, so its 1.35x window covers the whole pre-lift period.
          "Sparrow Shrine": [
            {
              id: "sh",
              coordinates: { x: 5, y: 5 },
              createdAt: dateNow - 200000,
              readyAt: dateNow - 200000,
            },
          ],
        },
        crops: {
          "123": {
            createdAt: dateNow,
            crop: { name: "Pumpkin", plantedAt, baseDurationMs },
            removedAt,
          },
          "1": { createdAt: dateNow, x: 0, y: 0 },
        },
      },
      createdAt,
    });

    const crop = state.crops["123"].crop;
    const banked = 60000 * speed; // 60s of real time at 1.35x = 81000ms of work
    expect(crop?.plantedAt).toBe(createdAt);
    expect(crop?.boostedTime).toBeCloseTo(banked, 5);
    expect(crop?.baseDurationMs).toBeCloseTo(baseDurationMs - banked, 5);
  });

  it("accumulates banked work across repeated lifts", () => {
    const createdAt = dateNow;
    // Already lifted once (boostedTime present); now lifted again.
    const plantedAt = dateNow - 40000;
    const removedAt = dateNow - 10000; // 30s more work accrued (1x)

    const state = placePlot({
      action: {
        coordinates: { x: 2, y: 2 },
        id: "156",
        name: "Crop Plot",
        type: "plot.placed",
      },
      state: {
        ...INITIAL_FARM,
        buildings: {},
        inventory: { "Crop Plot": new Decimal(3) },
        crops: {
          "123": {
            createdAt: dateNow,
            crop: {
              name: "Pumpkin",
              plantedAt,
              baseDurationMs: 90000,
              boostedTime: 30000, // banked from the previous lift
            },
            removedAt,
          },
          "1": { createdAt: dateNow, x: 0, y: 0 },
        },
      },
      createdAt,
    });

    const crop = state.crops["123"].crop;
    expect(crop?.plantedAt).toBe(createdAt);
    expect(crop?.boostedTime).toBe(60000); // 30000 prior + 30000 new
    expect(crop?.baseDurationMs).toBe(60000); // 90000 - 30000 new
  });
});
