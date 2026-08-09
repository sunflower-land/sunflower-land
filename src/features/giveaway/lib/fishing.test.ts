import {
  FISH_POOL,
  fishSchedule,
  fishProgress,
  fishXFraction,
} from "./fishing";
import { RACE_DURATION_MS } from "./sim";

describe("fishing stream", () => {
  it("has a non-empty pool with real XP + icons", () => {
    expect(FISH_POOL.length).toBeGreaterThan(6);
    FISH_POOL.forEach((f) => {
      expect(f.xp).toBeGreaterThan(0);
      // Image assets are string URLs in the real build; jest mocks them to a
      // stub object, so only assert they resolved (truthy).
      expect(f.image).toBeTruthy();
    });
  });

  it("is deterministic for a giveaway id", () => {
    expect(fishSchedule("abc-123")).toEqual(fishSchedule("abc-123"));
  });

  it("differs across giveaways", () => {
    const a = JSON.stringify(fishSchedule("abc-123"));
    const b = JSON.stringify(fishSchedule("xyz-789"));
    expect(a).not.toEqual(b);
  });

  it("produces well-formed fish that cross within the round", () => {
    const fish = fishSchedule("abc-123");
    expect(fish.length).toBeGreaterThan(10);
    // Sorted by spawn time.
    for (let i = 1; i < fish.length; i += 1) {
      expect(fish[i].spawnAt).toBeGreaterThanOrEqual(fish[i - 1].spawnAt);
    }
    fish.forEach((f) => {
      expect(f.xp).toBeGreaterThan(0);
      expect(f.lane).toBeGreaterThanOrEqual(0);
      expect(f.lane).toBeLessThanOrEqual(1);
      expect(f.spawnAt).toBeGreaterThanOrEqual(0);
      expect(f.spawnAt).toBeLessThan(RACE_DURATION_MS);
      // At spawn it enters (fraction at the entry edge), later it's further across.
      const entry = fishXFraction(f, f.spawnAt);
      expect(entry).toBeCloseTo(f.fromLeft ? 0 : 1, 5);
      // Mid-cross it sits on-screen (0..1).
      const mid = fishProgress(f, f.spawnAt + f.crossMs / 2);
      expect(mid).toBeCloseTo(0.5, 5);
    });
  });
});
