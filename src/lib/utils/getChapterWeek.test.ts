import { getChapterChangeover } from "./getChapterWeek";

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
