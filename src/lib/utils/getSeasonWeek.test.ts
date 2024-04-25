import "lib/__mocks__/configMock";
import { getSeasonChangeover } from "./getSeasonWeek";

describe("getSeasonChangeover", () => {
  it("delays tasks for one week", () => {
    const now = new Date("2024-04-31");
    const result = getSeasonChangeover({ id: 100, now: now.getTime() });

    expect(result.tasksStartAt).toEqual(new Date("2024-05-08").getTime());
  });

  it("tasks end one day before seasons finishes", () => {
    const now = new Date("2024-04-25");
    const result = getSeasonChangeover({ id: 100, now: now.getTime() });

    expect(result.tasksCloseAt).toEqual(new Date("2024-04-30").getTime());
  });

  it("tasks end one day before seasons finishes", () => {
    const now = new Date("2024-04-25");
    const result = getSeasonChangeover({ id: 100, now: now.getTime() });

    expect(result.tasksCloseAt).toEqual(new Date("2024-04-30").getTime());
  });

  it("tasks are frozen for non-admins", () => {
    const now = new Date("2024-05-07");
    const result = getSeasonChangeover({ id: 100, now: now.getTime() });

    expect(result.tasksAreFrozen).toBeTruthy();
  });

  it("tasks are not frozen for admins", () => {
    const now = new Date("2024-05-07");
    const result = getSeasonChangeover({ id: 1, now: now.getTime() });

    expect(result.tasksAreFrozen).toBeFalsy();
  });
});
