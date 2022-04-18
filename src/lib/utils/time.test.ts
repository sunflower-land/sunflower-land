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
      expect(secondsToString(ONE_SEC)).toBe("1sec");
      expect(secondsToString(2 * ONE_SEC)).toBe("2secs");
      expect(secondsToString(59 * ONE_SEC)).toBe("59secs");
      expect(secondsToString(ONE_MIN)).toBe("1min");
      expect(secondsToString(ONE_MIN + ONE_SEC)).toBe("2mins");
      expect(secondsToString(59 * ONE_MIN)).toBe("59mins");
      expect(secondsToString(ONE_HR)).toBe("1hr");
      expect(secondsToString(ONE_HR + ONE_SEC)).toBe("2hrs");
      expect(secondsToString(23 * ONE_HR)).toBe("23hrs");
      expect(secondsToString(ONE_DAY)).toBe("1day");
      expect(secondsToString(ONE_DAY + ONE_SEC)).toBe("2days");
    });
  });

  describe("secondsToMidString", () => {
    it("should return correct string", () => {
      expect(secondsToMidString(ONE_SEC)).toBe("1sec");
      expect(secondsToMidString(2 * ONE_SEC)).toBe("2secs");
      expect(secondsToMidString(ONE_MIN)).toBe("1min");
      expect(secondsToMidString(2 * ONE_MIN)).toBe("2mins");
      expect(secondsToMidString(ONE_HR)).toBe("1hr");
      expect(secondsToMidString(2 * ONE_HR)).toBe("2hrs");
      expect(secondsToMidString(ONE_DAY)).toBe("1day");
      expect(secondsToMidString(2 * ONE_DAY)).toBe("2days");

      expect(secondsToMidString(ONE_MIN + 30 * ONE_SEC)).toBe("1min 30secs");
      expect(secondsToMidString(2 * ONE_HR + 11 * ONE_MIN + 50 * ONE_SEC)).toBe(
        "2hrs 11mins"
      );
      expect(secondsToMidString(2 * ONE_DAY + ONE_HR + 20 * ONE_MIN)).toBe(
        "2days 1hr"
      );
    });
  });

  describe("secondsToLongString", () => {
    it("should return correct string", () => {
      expect(secondsToLongString(2 * ONE_DAY + ONE_MIN + 30 * ONE_SEC)).toBe(
        "2days 1min 30secs"
      );
      expect(secondsToLongString(ONE_HR + 20 * ONE_MIN + 5 * ONE_SEC)).toBe(
        "1hr 20mins 5secs"
      );
      expect(secondsToLongString(2 * ONE_DAY + ONE_HR + 20 * ONE_MIN)).toBe(
        "2days 1hr 20mins"
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
