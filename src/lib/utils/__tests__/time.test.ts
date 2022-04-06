import { secondsToMidString, secondsToString } from "lib/utils/time";

const minute = 60;
const hour = 60 * minute;
const day = hour * 24;

describe("time", () => {
  it("secondsToString", () => {
    expect(secondsToString(0)).toBe("0secs");

    expect(secondsToString(minute - 1)).toBe("59secs");
    expect(secondsToString(minute)).toBe("1min");
    expect(secondsToString(minute + 1)).toBe("2mins");

    expect(secondsToString(hour - 1)).toBe("60mins");
    expect(secondsToString(hour)).toBe("1hr");
    expect(secondsToString(hour + 1)).toBe("2hrs");

    expect(secondsToString(day - 1)).toBe("24hrs");
    expect(secondsToString(day)).toBe("1day");
    expect(secondsToString(day + 1)).toBe("2days");
  });

  it("secondsToMidString", () => {
    expect(secondsToMidString(0)).toBe("");

    expect(secondsToMidString(minute - 1)).toBe("59secs");
    expect(secondsToMidString(minute)).toBe("1mins");
    expect(secondsToMidString(minute + 1)).toBe("1mins 1secs");

    expect(secondsToMidString(2 * minute - 1)).toBe("1mins 59secs");
    expect(secondsToMidString(2 * minute)).toBe("2mins");
    expect(secondsToMidString(2 * minute + 1)).toBe("2mins 1secs");

    expect(secondsToMidString(hour - 1)).toBe("59mins 59secs");
    expect(secondsToMidString(hour)).toBe("1hrs");
    expect(secondsToMidString(hour + 1)).toBe("1hrs 1secs");

    expect(secondsToMidString(day - 1)).toBe("23hrs 59mins");
    expect(secondsToMidString(day)).toBe("1days");
    expect(secondsToMidString(day + 1)).toBe("1days 1secs");
  });
});
