import { TEST_FARM } from "features/game/lib/constants";
import { triggerTornado } from "./triggerTornado";
import { CropPlot, GameState } from "features/game/types/game";
import Decimal from "decimal.js-light";

describe("triggerTornado", () => {
  it("the tornado should already be triggered", () => {
    expect(() =>
      triggerTornado({
        state: {
          ...TEST_FARM,
          calendar: {
            dates: [],
          },
        },
        action: {
          type: "tornado.triggered",
        },
      }),
    ).toThrow("There is no tornado");
  });

  it("should not trigger tornado that is 3 days old", () => {
    const state: GameState = {
      ...TEST_FARM,
      calendar: {
        dates: [
          {
            name: "tornado",
            date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3 - 100)
              .toISOString()
              .substring(0, 10),
          },
        ],
      },
    };

    expect(() =>
      triggerTornado({
        state,
        action: {
          type: "tornado.triggered",
        },
      }),
    ).toThrow("Tornado is too old");
  });

  it("should avoid debuffs if they had a pinwheel", () => {
    const now = Date.now();
    const state: GameState = {
      ...TEST_FARM,
      calendar: {
        dates: [
          {
            name: "tornado",
            date: now.toString(),
          },
        ],
      },
      collectibles: {
        "Tornado Pinwheel": [
          {
            coordinates: { x: 1, y: 1 },
            id: "tornado-pinwheel",
            readyAt: now,
            createdAt: now,
          },
        ],
      },
      inventory: {
        "Tornado Pinwheel": new Decimal(1),
      },
    };

    const newState = triggerTornado({
      state,
      action: {
        type: "tornado.triggered",
      },
    });

    expect(newState.calendar.tornado?.protected).toBeTruthy();
  });

  it("should remove a pinwheel", () => {
    const now = Date.now();
    const state: GameState = {
      ...TEST_FARM,
      calendar: {
        dates: [
          {
            name: "tornado",
            date: now.toString(),
          },
        ],
      },
      collectibles: {
        "Tornado Pinwheel": [
          {
            coordinates: { x: 1, y: 1 },
            id: "tornado-pinwheel",
            readyAt: now,
            createdAt: now,
          },
        ],
      },
      inventory: {
        "Tornado Pinwheel": new Decimal(1),
      },
    };

    const newState = triggerTornado({
      state,
      action: {
        type: "tornado.triggered",
      },
    });

    expect(newState.collectibles["Tornado Pinwheel"]).toBeUndefined();
    expect(newState.inventory["Tornado Pinwheel"]).toBeUndefined();
  });

  it("should remove crops if they had no pinwheel", () => {
    const FAKE_CROP: CropPlot = {
      createdAt: 100,
      height: 1,
      width: 1,
      x: 1,
      y: 1,
      crop: {
        amount: 1,
        name: "Cabbage",
        plantedAt: 100,
      },
    };
    const now = Date.now();
    const state: GameState = {
      ...TEST_FARM,
      crops: {
        "1": {
          ...FAKE_CROP,
          createdAt: 1,
        },
        zf5a: {
          ...FAKE_CROP,
          createdAt: 2,
        },
        a3tg: {
          ...FAKE_CROP,
          createdAt: 3,
        },
        bis1: {
          ...FAKE_CROP,
          createdAt: 4,
        },
      },
      calendar: {
        dates: [
          {
            name: "tornado",
            date: now.toString(),
          },
        ],
      },
      collectibles: {},
      inventory: {},
    };

    const newState = triggerTornado({
      state,
      action: {
        type: "tornado.triggered",
      },
    });

    expect(newState.calendar.tornado?.protected).toBeFalsy();

    expect(newState.crops[1].crop).toBeUndefined();
    expect(newState.crops["bis1"].crop).toBeDefined();
    expect(newState.crops["zf5a"].crop).toBeUndefined();
    expect(newState.crops["a3tg"].crop).toBeDefined();
  });

  it("should trigger the tornado", () => {
    const now = Date.now();
    const date = new Date(now).toISOString().substring(0, 10);
    const state: GameState = {
      ...TEST_FARM,
      calendar: {
        dates: [
          {
            name: "tornado",
            date,
          },
        ],
      },
    };

    const newState = triggerTornado({
      state,
      action: {
        type: "tornado.triggered",
      },
      createdAt: now,
    });

    expect(newState.calendar.tornado?.triggeredAt).toEqual(now);
  });
});
