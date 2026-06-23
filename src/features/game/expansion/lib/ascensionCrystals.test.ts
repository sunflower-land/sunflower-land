import {
  getAscensionLayout,
  getExpansionCrystalCount,
  getExpectedAscensionCrystals,
} from "./ascension";

describe("getExpectedAscensionCrystals", () => {
  it("grants nothing on basic land", () => {
    expect(
      getExpectedAscensionCrystals({
        islandType: "basic",
        ascensionLevel: 0,
        basicLand: 9,
      }),
    ).toBe(0);
  });

  it("grants the cumulative A0 node on each pre-ascension island", () => {
    expect(
      getExpectedAscensionCrystals({
        islandType: "spring",
        ascensionLevel: 0,
        basicLand: 16,
      }),
    ).toBe(1);
    expect(
      getExpectedAscensionCrystals({
        islandType: "desert",
        ascensionLevel: 0,
        basicLand: 25,
      }),
    ).toBe(2);
    expect(
      getExpectedAscensionCrystals({
        islandType: "volcano",
        ascensionLevel: 0,
        basicLand: 30,
      }),
    ).toBe(3);
  });

  it("grants A0 (3) + the upgrade node on arriving at A1 (e=0)", () => {
    expect(
      getExpectedAscensionCrystals({
        islandType: "swamp",
        ascensionLevel: 1,
        basicLand: 30,
      }),
    ).toBe(4);
  });

  it("adds one per expansion across A1's first 3 expansions, then caps", () => {
    expect(
      getExpectedAscensionCrystals({
        islandType: "swamp",
        ascensionLevel: 1,
        basicLand: 31,
      }),
    ).toBe(5);
    expect(
      getExpectedAscensionCrystals({
        islandType: "swamp",
        ascensionLevel: 1,
        basicLand: 33,
      }),
    ).toBe(7);
    expect(
      getExpectedAscensionCrystals({
        islandType: "swamp",
        ascensionLevel: 1,
        basicLand: 42,
      }),
    ).toBe(7);
  });

  it("carries completed bands forward cumulatively (A2 arrival)", () => {
    expect(
      getExpectedAscensionCrystals({
        islandType: "spooky",
        ascensionLevel: 2,
        basicLand: 30,
      }),
    ).toBe(8);
    expect(
      getExpectedAscensionCrystals({
        islandType: "spooky",
        ascensionLevel: 2,
        basicLand: 34,
      }),
    ).toBe(12);
  });

  it("caps the per-band expansion nodes at 12 from A10 onward", () => {
    const a10End = getExpectedAscensionCrystals({
      islandType: "marble",
      ascensionLevel: 10,
      basicLand: 42,
    });
    const a9End = getExpectedAscensionCrystals({
      islandType: "marble",
      ascensionLevel: 9,
      basicLand: 42,
    });
    expect(a10End - a9End).toBe(13);

    const a11End = getExpectedAscensionCrystals({
      islandType: "marble",
      ascensionLevel: 11,
      basicLand: 42,
    });
    expect(a11End - a10End).toBe(13);
  });
});

describe("getExpansionCrystalCount", () => {
  it("is 0 off an ascension island", () => {
    expect(getExpansionCrystalCount({ ascensionLevel: 0, expansion: 10 })).toBe(
      0,
    );
  });

  it("is 1 on each of a band's first N expansions, else 0", () => {
    expect(getExpansionCrystalCount({ ascensionLevel: 1, expansion: 30 })).toBe(
      0,
    );
    expect(getExpansionCrystalCount({ ascensionLevel: 1, expansion: 31 })).toBe(
      1,
    );
    expect(getExpansionCrystalCount({ ascensionLevel: 1, expansion: 33 })).toBe(
      1,
    );
    expect(getExpansionCrystalCount({ ascensionLevel: 1, expansion: 34 })).toBe(
      0,
    );
    expect(getExpansionCrystalCount({ ascensionLevel: 2, expansion: 34 })).toBe(
      1,
    );
    expect(getExpansionCrystalCount({ ascensionLevel: 2, expansion: 35 })).toBe(
      0,
    );
  });
});

describe("getAscensionLayout — crystal placement", () => {
  it("places one crystal on each of A1's first 3 expansions, none after", () => {
    expect(
      getAscensionLayout({ expansion: 31, ascensionLevel: 1 })
        .ascensionCrystals,
    ).toHaveLength(1);
    expect(
      getAscensionLayout({ expansion: 33, ascensionLevel: 1 })
        .ascensionCrystals,
    ).toHaveLength(1);
    expect(
      getAscensionLayout({ expansion: 34, ascensionLevel: 1 })
        .ascensionCrystals,
    ).toHaveLength(0);
  });

  it("placed crystal coordinates sit inside the 6x6 block", () => {
    const layout = getAscensionLayout({ expansion: 31, ascensionLevel: 1 });
    const [crystal] = layout.ascensionCrystals ?? [];
    expect(crystal).toBeDefined();
    expect(crystal.x).toBeGreaterThanOrEqual(-3);
    expect(crystal.x + 2).toBeLessThanOrEqual(3);
    expect(crystal.y).toBeLessThanOrEqual(3);
    expect(crystal.y - 2).toBeGreaterThanOrEqual(-3);
  });
});
