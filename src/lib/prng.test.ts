import { prng } from "./prng";

describe("prng", () => {
  it("returns a value between 0 and 1", () => {
    const result = prng(1);
    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.value).toBeLessThan(1);
  });

  it("should return the next seed between -2^31 and 2^31 - 1", () => {
    const result = prng(1);
    expect(result.nextSeed).toBeGreaterThanOrEqual(-(2 ** 31));
    expect(result.nextSeed).toBeLessThan(2 ** 31 - 1);
  });

  it("should return two different values for two different seeds", () => {
    const result1 = prng(1);
    const result2 = prng(2);
    expect(result1.value).not.toBe(result2.value);
  });

  it("should return two different nextSeeds for two different seeds", () => {
    const result1 = prng(1);
    const result2 = prng(2);
    expect(result1.nextSeed).not.toBe(result2.nextSeed);
  });

  it("should return the same value for the same seed", () => {
    const result = prng(1);
    const result2 = prng(1);
    expect(result.value).toBe(result2.value);
  });

  it("should return the same nextSeed for the same seed", () => {
    const result = prng(1);
    const result2 = prng(1);
    expect(result.nextSeed).toBe(result2.nextSeed);
  });
});
