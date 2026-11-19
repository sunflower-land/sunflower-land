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
  const weather: Weather = { forecast: [first, second] };

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
  it("marks the four threats", () => {
    expect(WEATHER_EVENTS).toEqual({
      flood: { kind: "threat" },
      insectPlague: { kind: "threat" },
      tornado: { kind: "threat" },
      greatFreeze: { kind: "threat" },
      beeMigration: { kind: "positive" },
      heavyRains: { kind: "positive" },
      sunshower: { kind: "positive" },
      bountifulHarvest: { kind: "positive" },
      fishFrenzy: { kind: "positive" },
    });
  });
});
