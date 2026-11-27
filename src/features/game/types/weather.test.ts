import {
  WEATHER_EVENTS,
  getActiveWeather,
  type ScheduledWeatherEvent,
  type Weather,
} from "./weather";

const DAY = 24 * 60 * 60 * 1000;

describe("getActiveWeather", () => {
  // Monday 2026-11-16 00:00 UTC
  const WEEK_START = Date.UTC(2026, 10, 16);

  const first: ScheduledWeatherEvent = {
    name: "beeMigration",
    startAt: WEEK_START,
    endAt: WEEK_START + 3 * DAY,
  };
  const second: ScheduledWeatherEvent = {
    name: "flood",
    startAt: WEEK_START + 3 * DAY,
    endAt: WEEK_START + 7 * DAY,
  };
  const weather: Weather = { forecast: [first, second], overlays: [] };

  it("returns nothing when the farm has no weather", () => {
    expect(
      getActiveWeather({ weather: undefined, now: WEEK_START }),
    ).toBeUndefined();
  });

  it("returns nothing before the first event", () => {
    expect(getActiveWeather({ weather, now: WEEK_START - 1 })).toBeUndefined();
  });

  it("is active from the exact start", () => {
    expect(getActiveWeather({ weather, now: WEEK_START })).toEqual(first);
  });

  it("is active until the millisecond before the end", () => {
    expect(getActiveWeather({ weather, now: first.endAt - 1 })).toEqual(first);
  });

  it("hands over to the next event at the exact end", () => {
    expect(getActiveWeather({ weather, now: first.endAt })).toEqual(second);
  });

  it("returns nothing once the last event has ended", () => {
    expect(getActiveWeather({ weather, now: second.endAt })).toBeUndefined();
  });
});

describe("WEATHER_EVENTS", () => {
  // The season table is the rule the schedule is checked against, so each row
  // is pinned by hand rather than derived.
  it("has one threat per season", () => {
    expect(WEATHER_EVENTS.flood).toEqual({
      kind: "threat",
      seasons: ["spring"],
    });
    expect(WEATHER_EVENTS.insectPlague).toEqual({
      kind: "threat",
      seasons: ["summer"],
    });
    expect(WEATHER_EVENTS.tornado).toEqual({
      kind: "threat",
      seasons: ["autumn"],
    });
    expect(WEATHER_EVENTS.greatFreeze).toEqual({
      kind: "threat",
      seasons: ["winter"],
    });
  });

  it("lists the seasons each positive event can fall in", () => {
    expect(WEATHER_EVENTS.beeMigration).toEqual({
      kind: "positive",
      seasons: ["spring", "summer", "autumn"],
    });
    expect(WEATHER_EVENTS.heavyRains).toEqual({
      kind: "positive",
      seasons: ["spring", "autumn"],
    });
    expect(WEATHER_EVENTS.sunshower).toEqual({
      kind: "positive",
      seasons: ["spring", "winter"],
    });
    expect(WEATHER_EVENTS.bountifulHarvest).toEqual({
      kind: "positive",
      seasons: ["summer", "autumn", "winter"],
    });
    expect(WEATHER_EVENTS.fishFrenzy).toEqual({
      kind: "positive",
      seasons: ["spring", "summer", "autumn", "winter"],
    });
  });

  it("has nine events", () => {
    expect(Object.keys(WEATHER_EVENTS)).toHaveLength(9);
  });
});
