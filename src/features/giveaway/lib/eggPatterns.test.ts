import { RACE_DURATION_MS } from "./sim";
import { eggSchedule, EGG_LANES, EGG_FALL_MS, EGG_POINTS } from "./eggPatterns";

describe("eggSchedule", () => {
  it("is deterministic for a given giveaway id", () => {
    expect(eggSchedule("abc")).toEqual(eggSchedule("abc"));
  });

  it("produces different schedules for different ids", () => {
    expect(eggSchedule("abc")).not.toEqual(eggSchedule("xyz"));
  });

  it("keeps every egg in-bounds and catchable within the 30s", () => {
    for (const egg of eggSchedule("stream-race-42")) {
      expect(egg.lane).toBeGreaterThanOrEqual(0);
      expect(egg.lane).toBeLessThan(EGG_LANES);
      expect(egg.fallMs).toBe(EGG_FALL_MS);
      // Lands (spawn + fall) by the time the clock runs out.
      expect(egg.spawnAt + egg.fallMs).toBeLessThanOrEqual(RACE_DURATION_MS);
      expect(["normal", "gold", "red"]).toContain(egg.type);
    }
  });

  it("includes all three egg types and ramps up (more eggs late than early)", () => {
    const eggs = eggSchedule("a-decently-long-seed");
    const types = new Set(eggs.map((e) => e.type));
    expect(types).toEqual(new Set(["normal", "gold", "red"]));

    const half = RACE_DURATION_MS / 2;
    const early = eggs.filter((e) => e.spawnAt < half).length;
    const late = eggs.filter((e) => e.spawnAt >= half).length;
    expect(late).toBeGreaterThan(early);
  });

  it("prices the eggs as designed (normal +1, gold +10, red bomb negative)", () => {
    expect(EGG_POINTS.normal).toBe(1);
    expect(EGG_POINTS.gold).toBe(10);
    expect(EGG_POINTS.red).toBeLessThan(0);
  });
});
