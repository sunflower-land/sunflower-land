import {
  INTERIOR_CANVAS,
  INTERIOR_LAYOUTS,
  isValidInteriorBox,
  isValidInteriorTile,
} from "./interiorLayouts";

describe("interiorLayouts", () => {
  it("defines a 24x24 canvas (the spec max)", () => {
    expect(INTERIOR_CANVAS.width).toBe(24);
    expect(INTERIOR_CANVAS.height).toBe(24);
  });

  it("places the tent room near the bottom-left of the canvas for the basic island", () => {
    // After hand-tuning via the dev overlay the tent room covers x=3..8, y=2..7.
    expect(isValidInteriorTile("basic", 3, 2)).toBe(true);
    expect(isValidInteriorTile("basic", 8, 7)).toBe(true);
    expect(isValidInteriorTile("basic", 2, 2)).toBe(false); // outside (left wall)
    expect(isValidInteriorTile("basic", 9, 2)).toBe(false); // outside (right wall)
    expect(isValidInteriorTile("basic", 3, 1)).toBe(false); // outside (below tent)
    expect(isValidInteriorTile("basic", 3, 8)).toBe(false); // outside (above tent)
  });

  it("adds rooms additively as islands progress — earlier rooms remain valid", () => {
    for (const key of INTERIOR_LAYOUTS.basic) {
      expect(INTERIOR_LAYOUTS.spring.has(key)).toBe(true);
    }
    for (const key of INTERIOR_LAYOUTS.spring) {
      expect(INTERIOR_LAYOUTS.desert.has(key)).toBe(true);
    }
    for (const key of INTERIOR_LAYOUTS.desert) {
      expect(INTERIOR_LAYOUTS.volcano.has(key)).toBe(true);
    }
  });

  it("grows strictly (each progression has more valid tiles than the last)", () => {
    expect(INTERIOR_LAYOUTS.spring.size).toBeGreaterThan(
      INTERIOR_LAYOUTS.basic.size,
    );
    expect(INTERIOR_LAYOUTS.desert.size).toBeGreaterThan(
      INTERIOR_LAYOUTS.spring.size,
    );
    expect(INTERIOR_LAYOUTS.volcano.size).toBeGreaterThan(
      INTERIOR_LAYOUTS.desert.size,
    );
  });

  it("matches the hand-tuned tile counts", () => {
    // Tile counts after manual tuning via the /interior dev overlay.
    // If you re-tune the layouts, update these counts to match.
    expect(INTERIOR_LAYOUTS.basic.size).toBe(36);
    expect(INTERIOR_LAYOUTS.spring.size).toBe(113);
    expect(INTERIOR_LAYOUTS.desert.size).toBe(228);
    expect(INTERIOR_LAYOUTS.volcano.size).toBe(296);
  });

  describe("isValidInteriorBox", () => {
    it("returns true when every cell of a 2x2 box sits inside the tent", () => {
      // Tent covers (3..8, 2..7). A 2x2 at top-left (4, 5) covers
      // (4,5), (5,5), (4,4), (5,4) — all inside.
      expect(
        isValidInteriorBox("basic", { x: 4, y: 5, width: 2, height: 2 }),
      ).toBe(true);
    });

    it("returns false when any cell is outside the valid tile set", () => {
      // (8,3) is valid but (9,3) is outside the tent → a 2x2 at (8, 3)
      // covers (8,3),(9,3),(8,2),(9,2) — invalid because of the (9, *) cells.
      expect(
        isValidInteriorBox("basic", { x: 8, y: 3, width: 2, height: 2 }),
      ).toBe(false);
    });

    it("returns false for a 1x1 placed on a wall tile", () => {
      expect(
        isValidInteriorBox("basic", { x: 0, y: 1, width: 1, height: 1 }),
      ).toBe(false);
    });
  });
});
