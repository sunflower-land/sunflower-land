import { factionKitchenWeekEndTime } from "./utils";

describe("factionKitchenWeekEndTime", () => {
  it("should return 11:59pm June 7 2023 in milliseconds if start time is June 1 2023 midnight", () => {
    const START_TIME = new Date("2023-06-01T00:00:00Z").getTime();
    const oneDayAfterStart = new Date("2023-06-02T00:00:00Z").getTime();
    const expected = new Date("2023-06-07T23:59:59.999Z").getTime();
    const result = factionKitchenWeekEndTime({
      startTimeMs: START_TIME,
      now: oneDayAfterStart,
    });

    expect(result).toBe(expected);
  });

  it("should return 11:59pm June 14 2023 in milliseconds if start time is June 1 2023 midnight", () => {
    const START_TIME = new Date("2023-06-01T00:00:00Z").getTime();
    const expected = new Date("2023-06-14T23:59:59.999Z").getTime();
    const twoWeeksAfterStart = new Date("2023-06-08T00:00:00Z").getTime();
    const result = factionKitchenWeekEndTime({
      startTimeMs: START_TIME,
      now: twoWeeksAfterStart,
    });

    expect(result).toBe(expected);
  });

  it("should return 11:59pm Sept 7 2023 in milliseconds if start time is June 1 2023 midnight", () => {
    const START_TIME = new Date("2023-06-01T00:00:00Z").getTime();
    const now = new Date("2023-09-06T00:00:00Z").getTime();
    const expected = new Date("2023-09-06T23:59:59.999Z").getTime();
    const result = factionKitchenWeekEndTime({
      startTimeMs: START_TIME,
      now,
    });

    expect(result).toBe(expected);
  });

  it("should return 11:59pm Jan 21 2024 in milliseconds if start time is June 1 2023 midnight", () => {
    const START_TIME = new Date("2023-06-01T00:00:00Z").getTime();
    const now = new Date("2024-01-20T00:00:00Z").getTime();
    const expected = new Date("2024-01-24T23:59:59.999Z").getTime();
    const result = factionKitchenWeekEndTime({
      startTimeMs: START_TIME,
      now,
    });

    expect(result).toBe(expected);
  });
});
