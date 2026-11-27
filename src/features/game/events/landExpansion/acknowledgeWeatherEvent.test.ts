import { TEST_FARM } from "../../lib/constants";
import type { GameState } from "../../types/game";
import type { ScheduledWeatherEvent } from "../../types/weather";
import { CONFIG } from "lib/config";
import { acknowledgeWeatherEvent } from "./acknowledgeWeatherEvent";

// The Insect Plague of the season-week starting Monday 23 Nov 2026 runs
// Mon 00:00 UTC to Fri 00:00 UTC (4 days) on the weather schedule.
const PLAGUE_START = new Date("2026-11-23T00:00:00Z").getTime();
const PLAGUE_END = new Date("2026-11-27T00:00:00Z").getTime();
const DURING_PLAGUE = PLAGUE_START + 60 * 60 * 1000;

const PLAGUE: ScheduledWeatherEvent = {
  name: "insectPlague",
  startAt: PLAGUE_START,
  endAt: PLAGUE_END,
};

const farm = (weather?: GameState["weather"]): GameState => ({
  ...TEST_FARM,
  weather,
});

const WEATHER: GameState["weather"] = { forecast: [PLAGUE], overlays: [] };

describe("weather.acknowledged", () => {
  it("records the start of the event running now", () => {
    const state = acknowledgeWeatherEvent({
      state: farm(WEATHER),
      action: { type: "weather.acknowledged", startAt: PLAGUE_START },
      createdAt: DURING_PLAGUE,
    });

    expect(state.weather?.acknowledged).toBe(PLAGUE_START);
  });

  it("keeps the rest of the stored weather", () => {
    const tornado = { startAt: 1, buildings: [] };
    const state = acknowledgeWeatherEvent({
      state: farm({ ...WEATHER, tornado }),
      action: { type: "weather.acknowledged", startAt: PLAGUE_START },
      createdAt: DURING_PLAGUE,
    });

    expect(state.weather?.tornado).toEqual(tornado);
  });

  it("records the event even after it ended", () => {
    // Closing a popup that stayed open past the event's end (Fri 00:00 UTC).
    const afterPlague = new Date("2026-11-27T00:00:30Z").getTime();
    const state = acknowledgeWeatherEvent({
      state: farm(WEATHER),
      action: { type: "weather.acknowledged", startAt: PLAGUE_START },
      createdAt: afterPlague,
    });

    expect(state.weather?.acknowledged).toBe(PLAGUE_START);
  });

  it("throws for an event that isn't on the schedule", () => {
    expect(() =>
      acknowledgeWeatherEvent({
        state: farm(WEATHER),
        action: { type: "weather.acknowledged", startAt: PLAGUE_START + 1 },
        createdAt: DURING_PLAGUE,
      }),
    ).toThrow("Weather event not found");
  });

  it("throws for an event that hasn't started", () => {
    expect(() =>
      acknowledgeWeatherEvent({
        state: farm(WEATHER),
        action: { type: "weather.acknowledged", startAt: PLAGUE_START },
        createdAt: PLAGUE_START - 1,
      }),
    ).toThrow("Weather event not found");
  });

  it("throws when the farm has no weather", () => {
    expect(() =>
      acknowledgeWeatherEvent({
        state: farm(undefined),
        action: { type: "weather.acknowledged", startAt: PLAGUE_START },
        createdAt: DURING_PLAGUE,
      }),
    ).toThrow("Weather event not found");
  });

  describe("without the Weather flag", () => {
    const network = CONFIG.NETWORK;
    beforeAll(() => {
      CONFIG.NETWORK = "mainnet";
    });
    afterAll(() => {
      CONFIG.NETWORK = network;
    });

    it("throws", () => {
      expect(() =>
        acknowledgeWeatherEvent({
          state: farm(WEATHER),
          action: { type: "weather.acknowledged", startAt: PLAGUE_START },
          createdAt: DURING_PLAGUE,
        }),
      ).toThrow("Weather is not available");
    });
  });
});
