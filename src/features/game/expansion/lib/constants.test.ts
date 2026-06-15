import {
  EXPANSION_ORIGINS,
  LAND_SIZE,
  getLandBounds,
  getLandLeftEdge,
} from "./constants";

describe("expansion spiral", () => {
  const listedCount = Object.keys(EXPANSION_ORIGINS).length;

  // getLandBounds derives the spiral algorithmically, while other land logic
  // reads the hand-listed EXPANSION_ORIGINS table. Guard against the two
  // encodings drifting apart.
  it("getLandBounds matches EXPANSION_ORIGINS for every listed count", () => {
    for (let count = 1; count <= listedCount; count++) {
      const xs = Array.from(
        { length: count },
        (_, i) => EXPANSION_ORIGINS[i].x,
      );
      const ys = Array.from(
        { length: count },
        (_, i) => EXPANSION_ORIGINS[i].y,
      );

      expect(getLandBounds(count)).toEqual({
        left: Math.min(...xs) - LAND_SIZE / 2,
        right: Math.max(...xs) + LAND_SIZE / 2,
        top: Math.max(...ys) + LAND_SIZE / 2,
        bottom: Math.min(...ys) - LAND_SIZE / 2,
      });

      // getLandLeftEdge is computed standalone (not via getLandBounds), so
      // guard it against the table directly too.
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
