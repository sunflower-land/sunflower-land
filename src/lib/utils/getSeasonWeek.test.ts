import { getBumpkinHoliday, getChapterChangeover } from "./getSeasonWeek";

describe("getChapterChangeover", () => {
  it("delays tasks for one week", () => {
    const now = new Date("2024-04-31");
    const result = getChapterChangeover({ id: 100, now: now.getTime() });

    expect(result.tasksStartAt).toEqual(new Date("2024-05-08").getTime());
  });

  it("tasks are frozen for non-admins", () => {
    const now = new Date("2024-05-07");
    const result = getChapterChangeover({ id: 100, now: now.getTime() });

    expect(result.ticketTasksAreFrozen).toBeTruthy();
  });

  it("tasks are not frozen for admins", () => {
    const now = new Date("2024-05-07");
    const result = getChapterChangeover({ id: 1, now: now.getTime() });

    expect(result.ticketTasksAreFrozen).toBeFalsy();
  });
});

describe("getBumpkinHoliday", () => {
  // Salt Awakening starts Mon 2026-05-04 UTC; 2nd Monday of May 2026 is 2026-05-11.
  // Holiday window is [2026-05-04T00:00:00Z, 2026-05-11T00:00:00Z).

  it("is active on the chapter start date", () => {
    const now = new Date("2026-05-04T00:00:00.000Z").getTime();
    expect(getBumpkinHoliday({ now }).holiday).toEqual("2026-05-04");
  });

  it("is active mid-window", () => {
    const now = new Date("2026-05-08T12:00:00.000Z").getTime();
    expect(getBumpkinHoliday({ now }).holiday).toEqual("2026-05-08");
  });

  it("is active on the last full day (Sun 2026-05-10)", () => {
    const now = new Date("2026-05-10T23:59:59.000Z").getTime();
    expect(getBumpkinHoliday({ now }).holiday).toEqual("2026-05-10");
  });

  it("is no longer active at midnight UTC of the 2nd Monday", () => {
    const now = new Date("2026-05-11T00:00:00.000Z").getTime();
    expect(getBumpkinHoliday({ now }).holiday).not.toEqual("2026-05-11");
  });
});
