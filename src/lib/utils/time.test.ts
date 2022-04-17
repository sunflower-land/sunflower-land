import { secondsToMidString, secondsToLongString } from "./time";

const ONE_SEC = 1;
const ONE_MIN = ONE_SEC * 60;
const ONE_HR = ONE_MIN * 60;
const ONE_DAY = ONE_HR * 24;

describe("time", () => {
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
});
