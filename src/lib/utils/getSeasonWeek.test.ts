import { getSeasonChangeover } from "./getSeasonWeek";

describe("seasonChangeover", () => {
  it("provides changeover period for Witches Eve", () => {
    const changeover = getSeasonChangeover(new Date("2023-10-25").getTime());

    expect(changeover).toEqual({
      tasksCloseAt: new Date("2023-10-31").getTime(),
      tasksStartAt: new Date("2023-08-01T03:00:00Z").getTime(),
      tasksAreClosing: false,
      tasksAreFrozen: false,
    });
  });

  it("sets warning mode when tasks are about to freeze", () => {
    const changeover = getSeasonChangeover(
      new Date("2023-10-30T02:00:00Z").getTime()
    );

    expect(changeover).toEqual({
      tasksCloseAt: new Date("2023-10-31").getTime(),
      tasksStartAt: new Date("2023-08-01T03:00:00Z").getTime(),
      tasksAreClosing: true,
      tasksAreFrozen: false,
    });
  });

  it("freezes tasks", () => {
    const changeover = getSeasonChangeover(
      new Date("2023-10-31T02:00:00Z").getTime()
    );

    expect(changeover).toEqual({
      tasksCloseAt: new Date("2023-10-31").getTime(),
      tasksStartAt: new Date("2023-11-01T03:00:00Z").getTime(),
      tasksAreClosing: false,
      tasksAreFrozen: true,
    });
  });

  it("freezes tasks during testing period", () => {
    const changeover = getSeasonChangeover(
      new Date("2023-11-01T02:00:00Z").getTime()
    );

    expect(changeover).toEqual({
      tasksCloseAt: new Date("2024-01-31").getTime(),
      tasksStartAt: new Date("2023-11-01T03:00:00Z").getTime(),
      tasksAreClosing: false,
      tasksAreFrozen: true,
    });
  });

  it("starts tasks once season is in flight", () => {
    const changeover = getSeasonChangeover(
      new Date("2023-11-01T03:01:00Z").getTime()
    );

    expect(changeover).toEqual({
      tasksCloseAt: new Date("2024-01-31").getTime(),
      tasksStartAt: new Date("2023-11-01T03:00:00Z").getTime(),
      tasksAreClosing: false,
      tasksAreFrozen: false,
    });
  });
});
