import { randomDouble, randomID, randomInt } from "./random";

describe("random", () => {
  describe("randomDouble", () => {
    it("should return values in correct range", () => {
      const min = 1.2;
      const max = 1.21;

      Array.from({ length: 100 }, (_) => {
        const value = randomDouble(min, max);
        expect(value).toBeGreaterThanOrEqual(min);
        expect(value).toBeLessThan(max);
      });
    });
  });

  describe("randomID", () => {
    it("should return values in correct format", () => {
      Array.from({ length: 100 }, (_) => {
        const value = randomID();
        expect(value).toMatch(/^_([0-9]|[a-z]){7}$/);
      });
    });
  });

  describe("randomInt", () => {
    it("should return values in correct range", () => {
      const min = 6;
      const max = 9;

      Array.from({ length: 100 }, (_) => {
        const value = randomInt(min, max);
        expect(value).toBe(Math.floor(value));
        expect(value).toBeGreaterThanOrEqual(min);
        expect(value).toBeLessThan(max);
      });
    });
  });
});
