import { CONFIG } from "lib/config";
import { INITIAL_FARM } from "../../lib/constants";
import { TEST_BUMPKIN } from "../../lib/bumpkinData";
import type { GameState, PlacedItem } from "../../types/game";
import type { ScheduledWeatherEvent } from "../../types/weather";
import { getCropYieldAmount } from "./harvest";
import { getFruitYield } from "./fruitHarvested";
import { getGreenhouseCropYieldAmount } from "./harvestGreenHouse";

const HOUR = 60 * 60 * 1000;

// The windfalls in the schedule: Bountiful Harvest closes the summer week of
// 2026-11-23, Fish Frenzy the winter week of 2027-01-04. Catches are rolled
// on the server, so only Bountiful Harvest is tested here.
const HARVEST: ScheduledWeatherEvent = {
  name: "bountifulHarvest",
  startAt: Date.UTC(2026, 10, 27),
  endAt: Date.UTC(2026, 10, 30),
};
const FRENZY: ScheduledWeatherEvent = {
  name: "fishFrenzy",
  startAt: Date.UTC(2027, 0, 8),
  endAt: Date.UTC(2027, 0, 11),
};
const MID_HARVEST = Date.UTC(2026, 10, 28, 12);

const placed = (fields: Partial<PlacedItem> = {}): PlacedItem => ({
  id: "1",
  coordinates: { x: 0, y: 0 },
  createdAt: 0,
  readyAt: 0,
  ...fields,
});

const farm = (
  collectibles: GameState["collectibles"] = {},
  skills: GameState["bumpkin"]["skills"] = {},
): GameState => ({
  ...INITIAL_FARM,
  bumpkin: { ...TEST_BUMPKIN, skills },
  collectibles,
  boostHistory: undefined,
  // The client reads the forecast; the server reads the whole schedule.
  weather: { forecast: [HARVEST, FRENZY] },
});

const sunflowers = (game: GameState, createdAt = MID_HARVEST) =>
  getCropYieldAmount({
    crop: "Sunflower",
    game,
    createdAt,
    prngArgs: { farmId: 1, counter: 0 },
  }).amount;

const apples = (game: GameState, createdAt = MID_HARVEST) =>
  getFruitYield({
    name: "Apple",
    game,
    now: createdAt,
    prngArgs: { farmId: 1, counter: 0 },
  }).amount;

describe("Bountiful Harvest (weather)", () => {
  it("leaves crops and fruit alone outside the event", () => {
    const game = farm();

    expect(sunflowers(game, HARVEST.endAt + HOUR)).toBe(1);
    expect(apples(game, HARVEST.endAt + HOUR)).toBe(1);
  });

  it("adds 0.4 to each crop harvest", () => {
    expect(sunflowers(farm())).toBe(1.4);
  });

  it("adds 0.4 to each fruit harvest", () => {
    expect(apples(farm())).toBe(1.4);
  });

  it("adds 0.4 to Greenhouse crops and fruit", () => {
    const greenhouse = (crop: "Rice" | "Grape") =>
      getGreenhouseCropYieldAmount({
        crop,
        game: farm(),
        createdAt: MID_HARVEST,
        prngArgs: { farmId: 1, counter: 0 },
      }).amount;

    expect(greenhouse("Rice")).toBe(1.4);
    expect(greenhouse("Grape")).toBe(1.4);
  });

  it("adds 0.8 when the summer Guardian was out when it started", () => {
    const game = farm({
      "Summer Guardian": [placed({ placedAt: HARVEST.startAt - HOUR })],
    });

    expect(sunflowers(game)).toBe(1.8);
    expect(apples(game)).toBe(1.8);
  });

  it("adds 0.4 when the Guardian came out after the start", () => {
    const game = farm({
      "Summer Guardian": [placed({ placedAt: HARVEST.startAt + HOUR })],
    });

    expect(sunflowers(game)).toBe(1.4);
    expect(apples(game)).toBe(1.4);
  });

  it("adds its bonus on top of the other boosts", () => {
    // Onion 1 + Giant Onion 3 + Bountiful Harvest 0.4 = 4.4.
    const amount = getCropYieldAmount({
      crop: "Onion",
      game: farm({ "Giant Onion": [placed()] }),
      createdAt: MID_HARVEST,
      prngArgs: { farmId: 1, counter: 0 },
    }).amount;

    expect(amount).toBe(4.4);
  });

  it("ignores a leftover calendar Bountiful Harvest", () => {
    // A calendar record from before the flag can still be active. The client
    // checks it against the clock, so pin it to the harvest.
    jest.useFakeTimers({ now: MID_HARVEST });
    try {
      const game: GameState = {
        ...farm(),
        calendar: {
          dates: [],
          bountifulHarvest: {
            startedAt: MID_HARVEST - HOUR,
            triggeredAt: MID_HARVEST - HOUR,
          },
        },
      };

      expect(sunflowers(game)).toBe(1.4);
      expect(apples(game)).toBe(1.4);
    } finally {
      jest.useRealTimers();
    }
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
      expect(apples(farm())).toBe(1);
    });
  });
});
