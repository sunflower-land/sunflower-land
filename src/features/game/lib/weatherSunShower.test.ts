import Decimal from "decimal.js-light";
import { CONFIG } from "lib/config";
import { TEST_FARM } from "./constants";
import type { GameState, PlacedItem } from "../types/game";
import type { ScheduledWeatherEvent } from "../types/weather";
import { placeCollectible } from "../events/landExpansion/placeCollectible";
import { removeCollectible } from "../events/landExpansion/removeCollectible";
import { renewWeatherCollectible } from "../events/landExpansion/renewWeatherCollectible";
import {
  computeReadyAt,
  getCropPlotBoostWindows,
  getWeatherSunShowerWindows,
} from "./boostWindows";

const HOUR = 60 * 60 * 1000;

// The winter week of 2026-12-07 opens with a four-day Sun Shower.
const SUN: ScheduledWeatherEvent = {
  name: "sunshower",
  startAt: Date.UTC(2026, 11, 7),
  endAt: Date.UTC(2026, 11, 11),
};
const MID = SUN.startAt + 24 * HOUR;
// The next one in the schedule.
const NEXT_SUN: ScheduledWeatherEvent = {
  name: "sunshower",
  startAt: Date.UTC(2027, 1, 4),
  endAt: Date.UTC(2027, 1, 8),
};

const placed = (fields: Partial<PlacedItem> = {}): PlacedItem => ({
  id: "1",
  coordinates: { x: 0, y: 0 },
  createdAt: 0,
  readyAt: 0,
  ...fields,
});

const farm = (collectibles: GameState["collectibles"] = {}): GameState => ({
  ...TEST_FARM,
  inventory: {
    ...TEST_FARM.inventory,
    "Shade Cloth": new Decimal(1),
    "Winter Guardian": new Decimal(1),
  },
  collectibles,
  buildings: {},
  trees: {},
  stones: {},
  gold: {},
  iron: {},
  crimstones: {},
  sunstones: {},
  oilReserves: {},
  crops: {},
  fruitPatches: {},
  beehives: {},
  lavaPits: {},
  flowers: { ...TEST_FARM.flowers, flowerBeds: {} },
  boostHistory: undefined,
  // The client reads the forecast the server sends.
  weather: { forecast: [SUN, NEXT_SUN], overlays: [] },
});

const CLOTH = (fields: Partial<PlacedItem> = {}) => ({
  "Shade Cloth": [placed({ placedAt: SUN.startAt - HOUR, ...fields })],
});
const GUARDIAN = (fields: Partial<PlacedItem> = {}) => ({
  "Winter Guardian": [
    placed({ id: "g", placedAt: SUN.startAt - HOUR, ...fields }),
  ],
});

const move = (
  state: GameState,
  name: "Shade Cloth" | "Winter Guardian",
  id: string,
  type: "placed" | "removed",
  createdAt: number,
) =>
  type === "placed"
    ? placeCollectible({
        state,
        action: {
          type: "collectible.placed",
          name,
          id,
          coordinates: { x: id === "g" ? 4 : 0, y: 0 },
          location: "farm",
        },
        createdAt,
      })
    : removeCollectible({
        state,
        action: { type: "collectible.removed", name, id, location: "farm" },
        createdAt,
      });

describe("getWeatherSunShowerWindows", () => {
  it("speeds crops up 1.3× for the whole Sun Shower", () => {
    expect(getWeatherSunShowerWindows(farm())).toContainEqual({
      from: SUN.startAt,
      to: SUN.endAt,
      speed: 1.3,
    });
  });

  it("gives 1.6× with the Shade Cloth out", () => {
    expect(getWeatherSunShowerWindows(farm(CLOTH()))).toContainEqual({
      from: SUN.startAt,
      to: SUN.endAt,
      speed: 1.6,
    });
  });

  it("gives 1.6× with the winter Guardian out", () => {
    expect(getWeatherSunShowerWindows(farm(GUARDIAN()))).toContainEqual({
      from: SUN.startAt,
      to: SUN.endAt,
      speed: 1.6,
    });
  });

  it("gives 2× with both", () => {
    expect(
      getWeatherSunShowerWindows(farm({ ...CLOTH(), ...GUARDIAN() })),
    ).toContainEqual({ from: SUN.startAt, to: SUN.endAt, speed: 2 });
  });

  it("ignores another season's Guardian", () => {
    const game = farm({
      "Summer Guardian": [placed({ placedAt: SUN.startAt - HOUR })],
    });

    expect(getWeatherSunShowerWindows(game)).toContainEqual({
      from: SUN.startAt,
      to: SUN.endAt,
      speed: 1.3,
    });
  });

  it("boosts from the moment the Shade Cloth is placed", () => {
    const state = move(farm(), "Shade Cloth", "1", "placed", MID);

    const windows = getWeatherSunShowerWindows(state);
    expect(windows).toContainEqual({ from: SUN.startAt, to: MID, speed: 1.3 });
    expect(windows).toContainEqual({ from: MID, to: SUN.endAt, speed: 1.6 });
  });

  it("stops boosting when the Shade Cloth is lifted", () => {
    const state = move(farm(CLOTH()), "Shade Cloth", "1", "removed", MID);

    const windows = getWeatherSunShowerWindows(state);
    expect(windows).toContainEqual({ from: SUN.startAt, to: MID, speed: 1.6 });
    expect(windows).toContainEqual({ from: MID, to: SUN.endAt, speed: 1.3 });
  });

  it("boosts again when the Shade Cloth is placed back during the same Sun Shower", () => {
    const lifted = move(farm(CLOTH()), "Shade Cloth", "1", "removed", MID);
    const state = move(lifted, "Shade Cloth", "1", "placed", MID + HOUR);

    const windows = getWeatherSunShowerWindows(state);
    expect(windows).toContainEqual({ from: SUN.startAt, to: MID, speed: 1.6 });
    expect(windows).toContainEqual({ from: MID, to: MID + HOUR, speed: 1.3 });
    expect(windows).toContainEqual({
      from: MID + HOUR,
      to: SUN.endAt,
      speed: 1.6,
    });
  });

  it("doesn't boost with a Shade Cloth used up on an earlier Sun Shower", () => {
    // SUN is the first Sun Shower in the schedule: mark it used on an
    // earlier event.
    const game = farm(CLOTH({ placedAt: SUN.startAt - HOUR, usedUntil: 1 }));

    expect(getWeatherSunShowerWindows(game)).toContainEqual({
      from: SUN.startAt,
      to: SUN.endAt,
      speed: 1.3,
    });
  });

  it("doesn't let a used Shade Cloth lifted and placed back cover the next Sun Shower", () => {
    const next = NEXT_SUN;
    // Used on SUN, lifted after it, placed back before the next one.
    const used = move(
      farm(CLOTH()),
      "Shade Cloth",
      "1",
      "removed",
      SUN.endAt + HOUR,
    );
    const state = move(
      used,
      "Shade Cloth",
      "1",
      "placed",
      SUN.endAt + 2 * HOUR,
    );

    expect(getWeatherSunShowerWindows(state)).toContainEqual({
      from: next.startAt,
      to: next.endAt,
      speed: 1.3,
    });

    // Lifted again during the next one, it still covered none of it.
    const relifted = move(
      state,
      "Shade Cloth",
      "1",
      "removed",
      next.startAt + 24 * HOUR,
    );
    expect(getWeatherSunShowerWindows(relifted)).toContainEqual({
      from: next.startAt,
      to: next.endAt,
      speed: 1.3,
    });
  });

  it("counts the Guardian only while it is placed", () => {
    const lifted = move(
      farm(GUARDIAN()),
      "Winter Guardian",
      "g",
      "removed",
      MID,
    );

    const windows = getWeatherSunShowerWindows(lifted);
    expect(windows).toContainEqual({ from: SUN.startAt, to: MID, speed: 1.6 });
    expect(windows).toContainEqual({ from: MID, to: SUN.endAt, speed: 1.3 });
  });

  it("stacks a Guardian placed mid-event on the Shade Cloth", () => {
    const state = move(farm(CLOTH()), "Winter Guardian", "g", "placed", MID);

    const windows = getWeatherSunShowerWindows(state);
    expect(windows).toContainEqual({ from: SUN.startAt, to: MID, speed: 1.6 });
    expect(windows).toContainEqual({ from: MID, to: SUN.endAt, speed: 2 });
  });

  it("grows a crop planted at the start 1.3× / 1.6× / 2× faster", () => {
    // 13h of growth at 1.3× takes 10h; 16h at 1.6× and 20h at 2× too.
    const readyAt = (game: GameState, hours: number) =>
      computeReadyAt({
        startedAt: SUN.startAt,
        baseDurationMs: hours * HOUR,
        windows: getCropPlotBoostWindows(game),
      });

    expect(readyAt(farm(), 13)).toBe(SUN.startAt + 10 * HOUR);
    expect(readyAt(farm(CLOTH()), 16)).toBe(SUN.startAt + 10 * HOUR);
    expect(readyAt(farm({ ...CLOTH(), ...GUARDIAN() }), 20)).toBe(
      SUN.startAt + 10 * HOUR,
    );
  });

  it("doesn't stack a calendar Sun Shower left from before the flag", () => {
    // A calendar Sun Shower record (2×) from just before SUN until 1 day in.
    const game: GameState = {
      ...farm(),
      boostHistory: {
        Sunshower: [
          { from: SUN.startAt - 10 * HOUR, to: SUN.startAt + 24 * HOUR },
        ],
      },
    };

    // Planted 10h before SUN: 10h at the calendar's 2× = 20h of growth, then
    // 13h more at the weather 1.3× (not 2.6×) takes 10h.
    expect(
      computeReadyAt({
        startedAt: SUN.startAt - 10 * HOUR,
        baseDurationMs: 33 * HOUR,
        windows: getCropPlotBoostWindows(game),
      }),
    ).toBe(SUN.startAt + 10 * HOUR);
  });

  it("keeps the Basic Scarecrow's stored time in step when the Shade Cloth is placed", () => {
    const next = NEXT_SUN;
    const plantedAt = next.startAt + HOUR;
    const base = 10 * HOUR;
    const game: GameState = {
      ...farm({
        "Basic Scarecrow": [placed({ id: "s", coordinates: { x: -4, y: 3 } })],
      }),
      crops: {
        "1": {
          createdAt: 0,
          x: -3,
          y: 3,
          crop: { name: "Sunflower", plantedAt, baseDurationMs: base },
        },
      },
      aoe: { "Basic Scarecrow": { 1: { 0: plantedAt + base } } },
    };

    // Placed an hour after planting, during the Sun Shower: the cell's stored
    // time must match the crop's live ready time (1.3× then 1.6×).
    const state = move(game, "Shade Cloth", "1", "placed", plantedAt + HOUR);

    expect(state.aoe["Basic Scarecrow"]?.[1]?.[0]).toBe(
      computeReadyAt({
        startedAt: plantedAt,
        baseDurationMs: base,
        windows: getCropPlotBoostWindows(state),
      }),
    );
  });

  it("keeps the Basic Scarecrow's stored time in step when the Shade Cloth is lifted", () => {
    const plantedAt = SUN.startAt + HOUR;
    const base = 10 * HOUR;
    const planted: GameState = {
      ...farm({
        ...CLOTH(),
        "Basic Scarecrow": [placed({ id: "s", coordinates: { x: -4, y: 3 } })],
      }),
      crops: {
        "1": {
          createdAt: 0,
          x: -3,
          y: 3,
          crop: { name: "Sunflower", plantedAt, baseDurationMs: base },
        },
      },
    };
    // Planted with the Shade Cloth out, so the cell holds the 1.6× ready time.
    const stale = computeReadyAt({
      startedAt: plantedAt,
      baseDurationMs: base,
      windows: getCropPlotBoostWindows(planted),
    });
    const game: GameState = {
      ...planted,
      aoe: { "Basic Scarecrow": { 1: { 0: stale } } },
    };

    // Lifted an hour after planting: the rest of the grow runs at 1.3×, so the
    // crop finishes later and the cell's stored time must follow it.
    const state = move(game, "Shade Cloth", "1", "removed", plantedAt + HOUR);

    const expected = computeReadyAt({
      startedAt: plantedAt,
      baseDurationMs: base,
      windows: getCropPlotBoostWindows(state),
    });
    expect(expected).toBeGreaterThan(stale);
    expect(state.aoe["Basic Scarecrow"]?.[1]?.[0]).toBe(expected);
  });

  it("keeps the Basic Scarecrow's stored time in step when a used Shade Cloth is renewed", () => {
    const next = NEXT_SUN;
    const plantedAt = next.startAt + HOUR;
    const base = 10 * HOUR;
    const planted: GameState = {
      ...farm({
        // Used up on the Sun Shower before, so greyed for this one.
        ...CLOTH(),
        "Basic Scarecrow": [placed({ id: "s", coordinates: { x: -4, y: 3 } })],
      }),
      crops: {
        "1": {
          createdAt: 0,
          x: -3,
          y: 3,
          crop: { name: "Sunflower", plantedAt, baseDurationMs: base },
        },
      },
    };
    planted.inventory = {
      ...planted.inventory,
      "Pig Bristles": new Decimal(25),
      "Merino Wool": new Decimal(10),
    };
    // Planted with the Shade Cloth greyed, so the cell holds the 1.3× ready time.
    const stale = computeReadyAt({
      startedAt: plantedAt,
      baseDurationMs: base,
      windows: getCropPlotBoostWindows(planted),
    });
    const game: GameState = {
      ...planted,
      aoe: { "Basic Scarecrow": { 1: { 0: stale } } },
    };

    // Renewed an hour after planting: the rest of the grow runs at 1.6×, so the
    // crop finishes sooner and the cell's stored time must follow it.
    const state = renewWeatherCollectible({
      state: game,
      action: {
        type: "weatherCollectible.renewed",
        name: "Shade Cloth",
        location: "farm",
        id: "1",
      },
      createdAt: plantedAt + HOUR,
    });

    const expected = computeReadyAt({
      startedAt: plantedAt,
      baseDurationMs: base,
      windows: getCropPlotBoostWindows(state),
    });
    expect(expected).toBeLessThan(stale);
    expect(state.aoe["Basic Scarecrow"]?.[1]?.[0]).toBe(expected);
  });

  describe("without the Weather flag", () => {
    const network = CONFIG.NETWORK;
    beforeAll(() => {
      CONFIG.NETWORK = "mainnet";
    });
    afterAll(() => {
      CONFIG.NETWORK = network;
    });

    it("has no weather Sun Shower", () => {
      expect(getWeatherSunShowerWindows(farm(CLOTH()))).toEqual([]);
    });
  });
});
