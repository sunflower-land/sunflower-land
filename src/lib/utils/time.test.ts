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
      expect(secondsToString(ONE_SEC)).toBe("1 sec");
      expect(secondsToString(2 * ONE_SEC)).toBe("2 secs");
      expect(secondsToString(59 * ONE_SEC)).toBe("59 secs");
      expect(secondsToString(ONE_MIN)).toBe("1 min");
      expect(secondsToString(ONE_MIN + ONE_SEC)).toBe("2 mins");
      expect(secondsToString(59 * ONE_MIN)).toBe("59 mins");
      expect(secondsToString(ONE_HR)).toBe("1 hr");
      expect(secondsToString(ONE_HR + ONE_SEC)).toBe("2 hrs");
      expect(secondsToString(23 * ONE_HR)).toBe("23 hrs");
      expect(secondsToString(ONE_DAY)).toBe("1 day");
      expect(secondsToString(ONE_DAY + ONE_SEC)).toBe("2 days");
    });
  });

  describe("secondsToMidString", () => {
    it("should return correct string", () => {
      expect(secondsToMidString(ONE_SEC)).toBe("1 sec");
      expect(secondsToMidString(2 * ONE_SEC)).toBe("2 secs");
      expect(secondsToMidString(ONE_MIN)).toBe("1 min");
      expect(secondsToMidString(2 * ONE_MIN)).toBe("2 mins");
      expect(secondsToMidString(ONE_HR)).toBe("1 hr");
      expect(secondsToMidString(2 * ONE_HR)).toBe("2 hrs");
      expect(secondsToMidString(ONE_DAY)).toBe("1 day");
      expect(secondsToMidString(2 * ONE_DAY)).toBe("2 days");

      expect(secondsToMidString(ONE_MIN + 30 * ONE_SEC)).toBe("1 min 30 secs");
      expect(secondsToMidString(2 * ONE_HR + 11 * ONE_MIN + 50 * ONE_SEC)).toBe(
        "2 hrs 11 mins"
      );
      expect(secondsToMidString(2 * ONE_DAY + ONE_HR + 20 * ONE_MIN)).toBe(
        "2 days 1 hr"
      );
    });
  });

  describe("secondsToLongString", () => {
    it("should return correct string", () => {
      expect(secondsToLongString(2 * ONE_DAY + ONE_MIN + 30 * ONE_SEC)).toBe(
        "2 days 1 min 30 secs"
      );
      expect(secondsToLongString(ONE_HR + 20 * ONE_MIN + 5 * ONE_SEC)).toBe(
        "1 hr 20 mins 5 secs"
      );
      expect(secondsToLongString(2 * ONE_DAY + ONE_HR + 20 * ONE_MIN)).toBe(
        "2 days 1 hr 20 mins"
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
