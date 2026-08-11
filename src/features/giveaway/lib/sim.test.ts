import {
  distanceAt,
  getRacerProfile,
  isRaceOver,
  seedFor,
  RACE_DURATION_MS,
} from "./sim";

describe("giveaway race sim (30s furthest-distance)", () => {
  const giveawayId = "abc-123";

  it("is deterministic for a given (farmId, giveawayId)", () => {
    expect(getRacerProfile(42, giveawayId)).toEqual(
      getRacerProfile(42, giveawayId),
    );
    expect(seedFor(42, giveawayId)).toEqual(seedFor(42, giveawayId));
  });

  it("produces different outcomes for different farms / giveaways", () => {
    expect(getRacerProfile(1, giveawayId).score).not.toEqual(
      getRacerProfile(2, giveawayId).score,
    );
    expect(getRacerProfile(1, "other").score).not.toEqual(
      getRacerProfile(1, giveawayId).score,
    );
  });

  it("score is the distance travelled at exactly 30s", () => {
    const p = getRacerProfile(7, giveawayId);
    expect(p.score).toBe(Math.round(distanceAt(p, RACE_DURATION_MS)));
    expect(p.score).toBeGreaterThan(0);
  });

  it("distance starts at 0, only moves forward, and caps at 30s", () => {
    const p = getRacerProfile(99, giveawayId);
    expect(distanceAt(p, 0)).toBe(0);
    expect(distanceAt(p, -100)).toBe(0);

    let prev = -1;
    for (let t = 0; t <= RACE_DURATION_MS; t += 500) {
      const d = distanceAt(p, t);
      expect(d).toBeGreaterThanOrEqual(prev); // never runs backward
      prev = d;
    }

    // Past the finish, distance is frozen at the 30s value.
    expect(distanceAt(p, RACE_DURATION_MS + 5000)).toBe(
      distanceAt(p, RACE_DURATION_MS),
    );
  });

  it("knows when the race is over", () => {
    expect(isRaceOver(RACE_DURATION_MS - 1)).toBe(false);
    expect(isRaceOver(RACE_DURATION_MS)).toBe(true);
  });
});
