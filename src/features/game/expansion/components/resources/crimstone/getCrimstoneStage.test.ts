import { CRIMSTONE_RECOVERY_TIME } from "features/game/lib/constants";
import { getCrimstoneResetAt, getCrimstoneStage } from "./getCrimstoneStage";

describe("getCrimstoneStage", () => {
  const recovery = CRIMSTONE_RECOVERY_TIME * 1000;
  const minedAt = 1_000_000;
  const resetAt = getCrimstoneResetAt(minedAt);

  it("returns a valid recovered stage (not 6) for a boosted rock that recovered early", () => {
    // A Mole Shrine pulled readyAt earlier than the base recovery.
    const readyAt = minedAt + recovery / 2;
    const now = readyAt + 1; // recovered, but still within the base recovery window

    // now - minedAt < base recovery, so the old constant-based check returned 6
    // and over-indexed the Recovered view's 5-frame sprite array.
    expect(now - minedAt).toBeLessThan(recovery);
    expect(getCrimstoneStage(5, now, readyAt, resetAt)).toBe(1);
  });

  it("returns stage 6 while a fresh rock is still recovering", () => {
    const readyAt = minedAt + recovery;
    const now = minedAt + 1; // not ready yet

    expect(getCrimstoneStage(5, now, readyAt, resetAt)).toBe(6);
  });

  it("matches legacy behaviour when readyAt === minedAt + base recovery", () => {
    const readyAt = minedAt + recovery;

    expect(getCrimstoneStage(5, readyAt - 1, readyAt, resetAt)).toBe(6); // recovering
    expect(getCrimstoneStage(5, readyAt + 1, readyAt, resetAt)).toBe(1); // recovered
  });

  it("maps intermediate minesLeft to stages 2-5", () => {
    const readyAt = minedAt + recovery;
    const now = minedAt + 1;

    expect(getCrimstoneStage(4, now, readyAt, resetAt)).toBe(2);
    expect(getCrimstoneStage(3, now, readyAt, resetAt)).toBe(3);
    expect(getCrimstoneStage(2, now, readyAt, resetAt)).toBe(4);
    expect(getCrimstoneStage(1, now, readyAt, resetAt)).toBe(5);
  });

  it("resets to stage 1 at the reducer's threshold, minedAt + base recovery + 24h", () => {
    const dayMs = 24 * 60 * 60 * 1000;
    // mineCrimstone resets minesLeft once createdAt - minedAt > base recovery + 24h.
    // 1_000_000 + 86_400_000 + 86_400_000 = 173_800_000
    expect(resetAt).toBe(173_800_000);

    // Boosted rock: recovered early (readyAt well before minedAt + base recovery).
    const readyAt = minedAt + recovery / 2;

    // 24h after the boosted readyAt the reducer still decrements, so no reset yet.
    expect(getCrimstoneStage(4, readyAt + dayMs + 1, readyAt, resetAt)).toBe(2);
    // At the threshold: not reset (the reducer's check is strictly greater).
    expect(getCrimstoneStage(4, resetAt, readyAt, resetAt)).toBe(2);
    // Past the threshold: fully reset to stage 1.
    expect(getCrimstoneStage(4, resetAt + 1, readyAt, resetAt)).toBe(1);
  });
});
