import { CONFIG } from "lib/config";
import { INITIAL_FARM } from "../../lib/constants";
import { TEST_BUMPKIN } from "../../lib/bumpkinData";
import type { GameState, PlacedItem } from "../../types/game";
import type { ScheduledWeatherEvent } from "../../types/weather";
import { getCropYieldAmount } from "./harvest";
import { getGreenhouseCropYieldAmount } from "./harvestGreenHouse";

const HOUR = 60 * 60 * 1000;

// The insect plague in the schedule: the summer week of 2026-11-23.
const PLAGUE: ScheduledWeatherEvent = {
  name: "insectPlague",
  startAt: Date.UTC(2026, 10, 23),
  endAt: Date.UTC(2026, 10, 27),
};
const MID_PLAGUE = Date.UTC(2026, 10, 24, 12);

const placed = (fields: Partial<PlacedItem> = {}): PlacedItem => ({
  id: "1",
  coordinates: { x: 0, y: 0 },
  createdAt: 0,
  readyAt: 0,
  ...fields,
});

const farm = (collectibles: GameState["collectibles"] = {}): GameState => ({
  ...INITIAL_FARM,
  bumpkin: TEST_BUMPKIN,
  collectibles,
  boostHistory: undefined,
  // The client reads the forecast; the server reads the whole schedule.
  weather: { forecast: [PLAGUE], overlays: [] },
});

const sunflowers = (game: GameState, createdAt = MID_PLAGUE) =>
  getCropYieldAmount({
    crop: "Sunflower",
    game,
    createdAt,
    prngArgs: { farmId: 1, counter: 0 },
  }).amount;

describe("insect plague (weather)", () => {
  it("leaves the yield alone outside the plague", () => {
    // Before it: a Bountiful Harvest follows it in the schedule.
    expect(sunflowers(farm(), PLAGUE.startAt - HOUR)).toBe(1);
  });

  it("halves the yield during the plague", () => {
    expect(sunflowers(farm())).toBe(0.5);
  });

  it("halves the yield last, after flat bonuses", () => {
    // Onion 1 + Giant Onion 3 = 4, halved = 2 (not 1 × 0.5 + 3).
    const amount = getCropYieldAmount({
      crop: "Onion",
      game: farm({ "Giant Onion": [placed()] }),
      createdAt: MID_PLAGUE,
      prngArgs: { farmId: 1, counter: 0 },
    }).amount;

    expect(amount).toBe(2);
  });

  it("ignores a leftover calendar Bountiful Harvest", () => {
    // A leftover calendar record (from before the flag) can still be active.
    // The client checks it against the clock, so pin it to the harvest.
    jest.useFakeTimers({ now: MID_PLAGUE });
    try {
      const game: GameState = {
        ...farm(),
        calendar: {
          dates: [],
          bountifulHarvest: {
            startedAt: MID_PLAGUE - HOUR,
            triggeredAt: MID_PLAGUE - HOUR,
          },
        },
      };

      // Sunflower 1, halved = 0.5: under the flag the calendar record adds
      // nothing (weatherWindfalls.test.ts).
      expect(sunflowers(game)).toBe(0.5);
    } finally {
      jest.useRealTimers();
    }
  });

  describe("in the Greenhouse", () => {
    const greenhouse = (
      crop: "Rice" | "Grape",
      game: GameState,
      createdAt = MID_PLAGUE,
    ) =>
      getGreenhouseCropYieldAmount({
        crop,
        game,
        createdAt,
        prngArgs: { farmId: 1, counter: 0 },
      }).amount;

    it("halves a crop after its Greenhouse bonuses", () => {
      // Rice 1 + Rice Panda 0.25 = 1.25, halved = 0.625 (not 1 × 0.5 + 0.25).
      expect(greenhouse("Rice", farm({ "Rice Panda": [placed()] }))).toBe(
        0.625,
      );
    });

    it("leaves a Greenhouse fruit alone, as before", () => {
      const game = farm();

      expect(greenhouse("Grape", game)).toBe(
        greenhouse("Grape", game, PLAGUE.startAt - HOUR),
      );
    });
  });

  it("is blocked by a Pest Smoker placed before the plague", () => {
    const game = farm({
      "Pest Smoker": [placed({ placedAt: PLAGUE.startAt - HOUR })],
    });

    expect(sunflowers(game)).toBe(1);
  });

  it("is blocked from the moment a Pest Smoker is placed mid-plague", () => {
    const game = farm({
      "Pest Smoker": [placed({ placedAt: MID_PLAGUE - HOUR })],
    });

    expect(sunflowers(game)).toBe(1);
  });

  it("halves the yield once the Pest Smoker is lifted", () => {
    const game = farm({
      "Pest Smoker": [
        placed({ coordinates: undefined, usedUntil: PLAGUE.endAt }),
      ],
    });

    expect(sunflowers(game)).toBe(0.5);
  });

  it("halves the yield when the Pest Smoker was used on an earlier plague", () => {
    const game = farm({
      "Pest Smoker": [
        placed({
          placedAt: PLAGUE.startAt - HOUR,
          usedUntil: Date.UTC(2026, 9, 31),
        }),
      ],
    });

    expect(sunflowers(game)).toBe(0.5);
  });

  it("is blocked by the summer Guardian out when the plague started", () => {
    const game = farm({
      "Summer Guardian": [placed({ placedAt: PLAGUE.startAt - HOUR })],
    });

    expect(sunflowers(game)).toBe(1);
  });

  it("halves the yield when the Guardian came out after the start", () => {
    const game = farm({
      "Summer Guardian": [placed({ placedAt: PLAGUE.startAt + HOUR })],
    });

    expect(sunflowers(game)).toBe(0.5);
  });

  it("ignores the old Protective Pesticide", () => {
    const game = farm({ "Protective Pesticide": [placed()] });

    expect(sunflowers(game)).toBe(0.5);
  });

  describe("without the Weather flag", () => {
    const network = CONFIG.NETWORK;
    beforeAll(() => {
      CONFIG.NETWORK = "mainnet";
    });
    afterAll(() => {
      CONFIG.NETWORK = network;
    });

    it("ignores the weather schedule", () => {
      expect(sunflowers(farm())).toBe(1);
    });
  });
});
