import {
  secondsToMidString,
  secondsToLongString,
  secondsToString,
  getTimeLeft,
} from "./time";

const ONE_SEC = 1;
const ONE_MIN = ONE_SEC * 60;
const ONE_HR = ONE_MIN * 60;
const ONE_DAY = ONE_HR * 24;

describe("time", () => {
  describe("secondsToString", () => {
    it("should return correct string", () => {
      expect(secondsToString(0)).toBe("0s");
      expect(secondsToString(ONE_SEC)).toBe("1s");
      expect(secondsToString(2 * ONE_SEC)).toBe("2s");
      expect(secondsToString(59 * ONE_SEC)).toBe("59s");
      expect(secondsToString(ONE_MIN)).toBe("1m");
      expect(secondsToString(ONE_MIN + ONE_SEC)).toBe("1m");
      expect(secondsToString(59 * ONE_MIN)).toBe("59m");
      expect(secondsToString(59 * ONE_MIN + 59 * ONE_SEC)).toBe("59m");
      expect(secondsToString(ONE_HR)).toBe("1h");
      expect(secondsToString(ONE_HR + ONE_SEC)).toBe("1h");
      expect(secondsToString(23 * ONE_HR)).toBe("23h");
      expect(secondsToString(ONE_DAY)).toBe("1d");
      expect(secondsToString(ONE_DAY + ONE_SEC)).toBe("1d");
    });
  });

  describe("secondsToMidString", () => {
    it("should return correct string", () => {
      expect(secondsToMidString(0)).toBe("0s");
      expect(secondsToMidString(ONE_SEC)).toBe("1s");
      expect(secondsToMidString(2 * ONE_SEC)).toBe("2s");
      expect(secondsToMidString(ONE_MIN)).toBe("1m 0s");
      expect(secondsToMidString(2 * ONE_MIN)).toBe("2m 0s");
      expect(secondsToMidString(59 * ONE_MIN + 59 * ONE_SEC)).toBe("59m 59s");
      expect(secondsToMidString(ONE_HR)).toBe("1h 0m");
      expect(secondsToMidString(2 * ONE_HR)).toBe("2h 0m");
      expect(secondsToMidString(ONE_DAY)).toBe("1d 0h");
      expect(secondsToMidString(2 * ONE_DAY)).toBe("2d 0h");

      expect(secondsToMidString(ONE_MIN + 30 * ONE_SEC)).toBe("1m 30s");
      expect(secondsToMidString(2 * ONE_HR + 11 * ONE_MIN + 50 * ONE_SEC)).toBe(
        "2h 11m"
      );
      expect(secondsToMidString(2 * ONE_DAY + ONE_HR + 20 * ONE_MIN)).toBe(
        "2d 1h"
      );
    });
  });

  describe("secondsToLongString", () => {
    it("should return correct string", () => {
      expect(secondsToLongString(0)).toBe("0s");
      expect(secondsToLongString(2 * ONE_DAY + ONE_MIN + 30 * ONE_SEC)).toBe(
        "2d 0h 1m 30s"
      );
      expect(secondsToLongString(ONE_HR + 20 * ONE_MIN + 5 * ONE_SEC)).toBe(
        "1h 20m 5s"
      );
      expect(secondsToLongString(2 * ONE_DAY + ONE_HR + 20 * ONE_MIN)).toBe(
        "2d 1h 20m 0s"
      );
    });
  });

  describe("getTimeLeft", () => {
    const RealDate = Date;

    const getTimestamp = (datetime: string) => new Date(datetime).getTime();

    beforeAll(() => {
      global.Date.now = jest.fn(() => getTimestamp("2022-04-17T00:00:00"));
    });

    it("should return 0 if elapsed", () => {
      expect(getTimeLeft(getTimestamp("2022-04-15T11:00:00"), ONE_DAY)).toBe(0);
      expect(getTimeLeft(getTimestamp("2022-04-16T00:00:00"), ONE_DAY)).toBe(0);
    });

    it("should return correct time left", () => {
      expect(getTimeLeft(getTimestamp("2022-04-16T01:00:00"), ONE_DAY)).toBe(
        ONE_HR
      );
      expect(getTimeLeft(getTimestamp("2022-04-16T23:59:30"), ONE_MIN)).toBe(
        30 * ONE_SEC
      );
      expect(getTimeLeft(getTimestamp("2022-04-16T23:30:00"), ONE_HR)).toBe(
        30 * ONE_MIN
      );
    });

    afterAll(() => {
      global.Date = RealDate;
    });
  });
});
