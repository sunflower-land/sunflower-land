import {
  EXPANSION_ORIGINS,
  LAND_SIZE,
  getLandLeftEdge,
  getWharfCoordinates,
} from "./constants";

describe("expansion spiral", () => {
  const listedCount = Object.keys(EXPANSION_ORIGINS).length;

  // getLandLeftEdge derives the spiral algorithmically, while other land logic
  // reads the hand-listed EXPANSION_ORIGINS table. Guard against the two
  // encodings drifting apart.
  it("getLandLeftEdge matches EXPANSION_ORIGINS for every listed count", () => {
    for (let count = 1; count <= listedCount; count++) {
      const xs = Array.from(
        { length: count },
        (_, i) => EXPANSION_ORIGINS[i].x,
      );

      expect(getLandLeftEdge(count)).toBe(Math.min(...xs) - LAND_SIZE / 2);
    }
  });

  // Also catches a typo in the hand-listed entries themselves: each origin
  // must be exactly one plot step from the previous, with no repeats.
  it("EXPANSION_ORIGINS is a contiguous spiral with no gaps or duplicates", () => {
    const seen = new Set<string>();

    for (let i = 0; i < listedCount; i++) {
      const origin = EXPANSION_ORIGINS[i];
      expect(origin).toBeDefined();

      const key = `${origin.x},${origin.y}`;
      expect(seen.has(key)).toBe(false);
      seen.add(key);

      if (i > 0) {
        const prev = EXPANSION_ORIGINS[i - 1];
        const step = Math.abs(origin.x - prev.x) + Math.abs(origin.y - prev.y);
        expect(step).toBe(LAND_SIZE);
      }
    }
  });
});

describe("getWharfCoordinates", () => {
  // The dock sits at the 2nd tile from the left on the south edge of the SW
  // anchor plot — plot.x*LAND_SIZE-2, plot.y*LAND_SIZE-3 — stepping at 7 and 21
  // as that plot moves from (0,0) to (-1,-1) to (-2,-2).
  it("sits on the SW anchor plot's 2nd tile and steps at 7 and 21", () => {
    for (const count of [1, 3, 6]) {
      expect(getWharfCoordinates(count)).toEqual({
        x: 0 * LAND_SIZE - 2,
        y: 0 * LAND_SIZE - 3,
      });
    }
    for (const count of [7, 14, 20]) {
      expect(getWharfCoordinates(count)).toEqual({
        x: -1 * LAND_SIZE - 2,
        y: -1 * LAND_SIZE - 3,
      });
    }
    for (const count of [21, 30, 42]) {
      expect(getWharfCoordinates(count)).toEqual({
        x: -2 * LAND_SIZE - 2,
        y: -2 * LAND_SIZE - 3,
      });
    }
  });
});
