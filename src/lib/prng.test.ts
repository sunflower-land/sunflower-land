import { prng } from "./prng";

describe("prng", () => {
  it("returns a value between 0 and 1", () => {
    const result = prng({
      farmId: 1,
      itemId: 2,
      counter: 3,
      criticalHitName: "Green Amulet",
    });
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThan(1);
  });

  it("should return two different values for two different seeds", () => {
    const result1 = prng({
      farmId: 1,
      itemId: 2,
      counter: 3,
      criticalHitName: "Green Amulet",
    });
    const result2 = prng({
      farmId: 2,
      itemId: 2,
      counter: 3,
      criticalHitName: "Green Amulet",
    });
    expect(result1).not.toBe(result2);
  });

  it("should return the same value for the same seed", () => {
    const result = prng({
      farmId: 1,
      itemId: 2,
      counter: 3,
      criticalHitName: "Green Amulet",
    });
    const result2 = prng({
      farmId: 1,
      itemId: 2,
      counter: 3,
      criticalHitName: "Green Amulet",
    });
    expect(result).toBe(result2);
  });

  it("should reliably produce different values for different farmIds", () => {
    const itemId = 5;
    const counter = 10;
    const numFarmIds = 10000;
    const results = new Set<number>();
    const values: number[] = [];

    // Test many different farmIds
    for (let farmId = 1; farmId <= numFarmIds; farmId++) {
      const result = prng({
        farmId,
        itemId,
        counter,
        criticalHitName: "Green Amulet",
      });
      results.add(result);
      values.push(result);
    }

    // All values should be unique (no collisions)
    expect(results.size).toBe(numFarmIds);

    // Values should be well-distributed across [0, 1)
    // Check that values span a reasonable range
    const min = Math.min(...values);
    const max = Math.max(...values);
    expect(max - min).toBeGreaterThan(0.5); // Should span at least half the range

    // Check distribution: values should be spread across different buckets
    const buckets = 10;
    const bucketCounts = new Array(buckets).fill(0);
    values.forEach((value) => {
      const bucket = Math.floor(value * buckets);
      bucketCounts[bucket] += 1;
    });

    // Each bucket should have some values (at least 1% of total)
    const minExpectedPerBucket = numFarmIds * 0.01;
    bucketCounts.forEach((count) => {
      expect(count).toBeGreaterThan(minExpectedPerBucket);
    });
  });
});
