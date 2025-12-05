import { INITIAL_FARM } from "features/game/lib/constants";
import { bumpkinWave } from "./bumpkinWave";

describe("bumpkinWave", () => {
  it("awards +1 all-time social point", () => {
    const state = bumpkinWave({
      state: INITIAL_FARM,
      action: { type: "bumpkin.wave" },
    });

    expect(state.socialFarming.points).toBe(
      (INITIAL_FARM.socialFarming.points ?? 0) + 1,
    );
  });

  it("increments weekly social point total by 1", () => {
    const state = bumpkinWave({
      state: INITIAL_FARM,
      action: { type: "bumpkin.wave" },
    });

    expect(state.socialFarming.weeklyPoints.points).toBe(
      (INITIAL_FARM.socialFarming.weeklyPoints.points ?? 0) + 1,
    );
  });

  it("is additive across multiple waves", () => {
    const once = bumpkinWave({
      state: INITIAL_FARM,
      action: { type: "bumpkin.wave" },
    });

    const twice = bumpkinWave({
      state: once,
      action: { type: "bumpkin.wave" },
    });

    expect(twice.socialFarming.points).toBe(
      (INITIAL_FARM.socialFarming.points ?? 0) + 2,
    );

    expect(twice.socialFarming.weeklyPoints.points).toBe(
      (INITIAL_FARM.socialFarming.weeklyPoints.points ?? 0) + 2,
    );
  });
});
