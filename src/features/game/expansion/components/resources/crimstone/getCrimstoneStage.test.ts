import { CRIMSTONE_RECOVERY_TIME } from "features/game/lib/constants";
import { getCrimstoneStage } from "./getCrimstoneStage";

describe("getCrimstoneStage", () => {
  const recovery = CRIMSTONE_RECOVERY_TIME * 1000;
  const minedAt = 1_000_000;

  it("returns a valid recovered stage (not 6) for a boosted rock that recovered early", () => {
    // A Mole Shrine pulled readyAt earlier than the base recovery.
    const readyAt = minedAt + recovery / 2;
    const now = readyAt + 1; // recovered, but still within the base recovery window

    // now - minedAt < base recovery, so the old constant-based check returned 6
    // and over-indexed the Recovered view's 5-frame sprite array.
    expect(now - minedAt).toBeLessThan(recovery);
    expect(getCrimstoneStage(5, minedAt, now, readyAt)).toBe(1);
  });

  it("returns stage 6 while a fresh rock is still recovering", () => {
    const readyAt = minedAt + recovery;
    const now = minedAt + 1; // not ready yet

    expect(getCrimstoneStage(5, minedAt, now, readyAt)).toBe(6);
  });

  it("matches legacy behaviour when readyAt === minedAt + base recovery", () => {
    const readyAt = minedAt + recovery;

    expect(getCrimstoneStage(5, minedAt, readyAt - 1, readyAt)).toBe(6); // recovering
    expect(getCrimstoneStage(5, minedAt, readyAt + 1, readyAt)).toBe(1); // recovered
  });

  it("maps intermediate minesLeft to stages 2-5", () => {
    const readyAt = minedAt + recovery;
    const now = minedAt + 1;

    expect(getCrimstoneStage(4, minedAt, now, readyAt)).toBe(2);
    expect(getCrimstoneStage(3, minedAt, now, readyAt)).toBe(3);
    expect(getCrimstoneStage(2, minedAt, now, readyAt)).toBe(4);
    expect(getCrimstoneStage(1, minedAt, now, readyAt)).toBe(5);
  });
});
