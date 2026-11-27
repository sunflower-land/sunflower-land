import Decimal from "decimal.js-light";
import { CONFIG } from "lib/config";
import { TEST_FARM } from "./constants";
import type { GameState, PlacedItem } from "../types/game";
import type { ScheduledWeatherEvent } from "../types/weather";
import { getHoneyRateBreakdown } from "./honeyRateBreakdown";

const HOUR = 60 * 60 * 1000;

// The spring week of 2026-12-14 opens with a three-day Flood.
const FLOOD: ScheduledWeatherEvent = {
  name: "flood",
  startAt: Date.UTC(2026, 11, 14),
  endAt: Date.UTC(2026, 11, 17),
};
const MID_FLOOD = FLOOD.startAt + 24 * HOUR;

// The summer week of 2026-12-21 opens with a three-day Bee Migration.
const BEES: ScheduledWeatherEvent = {
  name: "beeMigration",
  startAt: Date.UTC(2026, 11, 21),
  endAt: Date.UTC(2026, 11, 24),
};
const MID_BEES = BEES.startAt + 24 * HOUR;

// Between the two events: no weather on the honey.
const CLEAR = Date.UTC(2026, 11, 19);

const placed = (fields: Partial<PlacedItem> = {}): PlacedItem => ({
  id: "1",
  coordinates: { x: 0, y: 0 },
  createdAt: 0,
  readyAt: 0,
  placedAt: FLOOD.startAt - HOUR,
  ...fields,
});

const farm = (
  collectibles: GameState["collectibles"] = {},
  fields: Partial<GameState> = {},
): GameState => ({
  ...TEST_FARM,
  inventory: {
    ...TEST_FARM.inventory,
    "Queen Bee": new Decimal(1),
    "Wildflower Lure": new Decimal(1),
    "Summer Guardian": new Decimal(1),
    "Spring Guardian": new Decimal(1),
  },
  bumpkin: { ...TEST_FARM.bumpkin, skills: {} },
  collectibles,
  buildings: {},
  beehives: {},
  boostHistory: undefined,
  weather: { forecast: [FLOOD, BEES], overlays: [] },
  ...fields,
});

const QUEEN_BEE = {
  "Queen Bee": [placed({ id: "q", coordinates: { x: 8, y: 0 } })],
};
const LURE = { "Wildflower Lure": [placed()] };
const SUMMER_GUARDIAN = {
  "Summer Guardian": [placed({ id: "g", coordinates: { x: 4, y: 0 } })],
};
const SPRING_GUARDIAN = {
  "Spring Guardian": [placed({ id: "s", coordinates: { x: 4, y: 4 } })],
};

describe("getHoneyRateBreakdown", () => {
  it("has no rows for an unboosted hive in clear weather", () => {
    expect(
      getHoneyRateBreakdown({ game: farm(), now: CLEAR, speed: 1 }),
    ).toEqual({
      rows: [],
      boosted: false,
    });
  });

  it("lists a permanent boost", () => {
    expect(
      getHoneyRateBreakdown({ game: farm(QUEEN_BEE), now: CLEAR, speed: 2 }),
    ).toEqual({
      rows: [{ name: "Queen Bee", value: "+1" }],
      boosted: true,
    });
  });

  it("lists Bee Migration's own +0.2 as a weather row", () => {
    expect(
      getHoneyRateBreakdown({ game: farm(), now: MID_BEES, speed: 1.2 }),
    ).toEqual({
      rows: [{ weatherEvent: "beeMigration", value: "+0.2" }],
      boosted: true,
    });
  });

  it("lists the Guardian's and the Lure's shares after Bee Migration", () => {
    // 1 + 1 (Queen Bee) + 0.2 (event) + 0.1 (Guardian) + 1.875 (Lure, with
    // the Guardian) = 4.175.
    expect(
      getHoneyRateBreakdown({
        game: farm({ ...QUEEN_BEE, ...LURE, ...SUMMER_GUARDIAN }),
        now: MID_BEES,
        speed: 4.175,
      }),
    ).toEqual({
      rows: [
        { name: "Queen Bee", value: "+1" },
        { weatherEvent: "beeMigration", value: "+0.2" },
        { name: "Summer Guardian", value: "+0.1" },
        { name: "Wildflower Lure", value: "+1.875" },
      ],
      boosted: true,
    });
  });

  it("lists the Lure at +1.25 without the Guardian", () => {
    expect(
      getHoneyRateBreakdown({ game: farm(LURE), now: MID_BEES, speed: 2.45 })
        .rows,
    ).toEqual([
      { weatherEvent: "beeMigration", value: "+0.2" },
      { name: "Wildflower Lure", value: "+1.25" },
    ]);
  });

  it("lists a Flood as a final x0.5 row that is no boost", () => {
    expect(
      getHoneyRateBreakdown({ game: farm(), now: MID_FLOOD, speed: 0.5 }),
    ).toEqual({
      rows: [{ weatherEvent: "flood", value: "x0.5" }],
      boosted: false,
    });
  });

  it("puts the Flood after the boosts it halves", () => {
    expect(
      getHoneyRateBreakdown({
        game: farm(QUEEN_BEE),
        now: MID_FLOOD,
        speed: 1,
      }),
    ).toEqual({
      rows: [
        { name: "Queen Bee", value: "+1" },
        { weatherEvent: "flood", value: "x0.5" },
      ],
      boosted: true,
    });
  });

  it("has no Flood row while the season's Guardian protects the farm", () => {
    expect(
      getHoneyRateBreakdown({
        game: farm(SPRING_GUARDIAN),
        now: MID_FLOOD,
        speed: 1,
      }).rows,
    ).toEqual([]);
  });

  it("has no rows when they wouldn't add up to the speed shown", () => {
    // The hive's speed was set when its flower was attached, e.g. while a
    // Bear Shrine (+0.5) that has since expired was still active: 1 + 1 + 0.5.
    expect(
      getHoneyRateBreakdown({ game: farm(QUEEN_BEE), now: CLEAR, speed: 2.5 }),
    ).toEqual({ rows: [], boosted: false });
  });

  describe("without the Weather flag", () => {
    const network = CONFIG.NETWORK;
    beforeAll(() => {
      CONFIG.NETWORK = "mainnet";
    });
    afterAll(() => {
      CONFIG.NETWORK = network;
    });

    it("has no weather rows", () => {
      expect(
        getHoneyRateBreakdown({ game: farm(LURE), now: MID_BEES, speed: 1 })
          .rows,
      ).toEqual([]);
      expect(
        getHoneyRateBreakdown({ game: farm(), now: MID_FLOOD, speed: 1 }).rows,
      ).toEqual([]);
    });
  });
});
