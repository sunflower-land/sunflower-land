import { INITIAL_FARM } from "features/game/lib/constants";
import { bumpkinWave } from "./bumpkinWave";

describe("bumpkinWave", () => {
  it("awards +1 all-time social point for the first wave with a player on a given day", () => {
    const createdAt = new Date("2025-01-01T00:00:00.000Z").getTime();

    const state = bumpkinWave({
      state: INITIAL_FARM,
      action: { type: "bumpkin.wave", otherFarmId: 2 },
      createdAt,
    });

    expect(state.socialFarming.points).toBe(
      (INITIAL_FARM.socialFarming.points ?? 0) + 1,
    );
    expect(state.socialFarming.weeklyPoints.points).toBe(
      (INITIAL_FARM.socialFarming.weeklyPoints.points ?? 0) + 1,
    );
    expect(state.socialFarming.waves).toEqual({
      date: new Date(createdAt).toISOString().split("T")[0],
      farms: [2],
    });
  });

  it("does not award additional points when waving the same player again on the same day", () => {
    const today = new Date("2025-01-01T00:00:00.000Z");
    const createdAt = today.getTime();

    const once = bumpkinWave({
      state: INITIAL_FARM,
      action: { type: "bumpkin.wave", otherFarmId: 2 },
      createdAt,
    });

    const twice = bumpkinWave({
      state: once,
      action: { type: "bumpkin.wave", otherFarmId: 2 },
      createdAt,
    });

    expect(twice.socialFarming.points).toBe(once.socialFarming.points);
    expect(twice.socialFarming.weeklyPoints.points).toBe(
      once.socialFarming.weeklyPoints.points,
    );
    expect(twice.socialFarming.waves?.farms).toEqual([2]);
  });

  it("limits wave points to 20 unique players per day", () => {
    const createdAt = new Date("2025-01-01T00:00:00.000Z").getTime();

    let state = INITIAL_FARM;
    for (let i = 1; i <= 25; i++) {
      state = bumpkinWave({
        state,
        action: { type: "bumpkin.wave", otherFarmId: i },
        createdAt,
      });
    }

    expect(state.socialFarming.waves?.farms.length).toBe(20);
    expect(state.socialFarming.points).toBe(
      (INITIAL_FARM.socialFarming.points ?? 0) + 20,
    );
    expect(state.socialFarming.weeklyPoints.points).toBe(
      (INITIAL_FARM.socialFarming.weeklyPoints.points ?? 0) + 20,
    );
  });

  it("resets wave tracking on a new day", () => {
    const day1 = new Date("2025-01-01T00:00:00.000Z").getTime();
    const day2 = new Date("2025-01-02T00:00:00.000Z").getTime();

    const firstDay = bumpkinWave({
      state: INITIAL_FARM,
      action: { type: "bumpkin.wave", otherFarmId: 2 },
      createdAt: day1,
    });

    const secondDay = bumpkinWave({
      state: firstDay,
      action: { type: "bumpkin.wave", otherFarmId: 2 },
      createdAt: day2,
    });

    expect(secondDay.socialFarming.points).toBe(
      (INITIAL_FARM.socialFarming.points ?? 0) + 2,
    );
    expect(secondDay.socialFarming.waves?.date).toBe(
      new Date(day2).toISOString().split("T")[0],
    );
    expect(secondDay.socialFarming.waves?.farms).toEqual([2]);
  });
});
