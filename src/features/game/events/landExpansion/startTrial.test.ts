import { INITIAL_FARM } from "features/game/lib/constants";
import { startTrial } from "./startTrial";

describe("startTrial", () => {
  it("should throw an error if trial is already started", () => {
    expect(() =>
      startTrial({
        state: {
          ...INITIAL_FARM,
          vip: { trialStartedAt: Date.now(), bundles: [], expiresAt: 0 },
        },
        action: { type: "trial.started" },
        createdAt: Date.now(),
      }),
    ).toThrow("VIP already started");
  });

  it("should start a trial", () => {
    const now = Date.now();
    const state = startTrial({
      state: INITIAL_FARM,
      action: { type: "trial.started" },
      createdAt: now,
    });
    expect(state.vip?.trialStartedAt).toBe(now);
  });
});
