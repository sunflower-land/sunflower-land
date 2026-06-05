import { BED_FARMHAND_COUNT, getPlacedBedNames } from "./beds";
import { getKeys } from "lib/object";
import type { Collectibles, PlacedItem } from "./game";

const placed = (): PlacedItem[] => [{ id: "1" }];

describe("BED_FARMHAND_COUNT", () => {
  it("grants a 12th farmhand slot when Salt Crystal Bed is owned", () => {
    expect(BED_FARMHAND_COUNT["Salt Crystal Bed"]).toEqual(12);
  });

  it("makes Salt Crystal Bed the highest-tier bed (sorts last by slot count)", () => {
    const sorted = getKeys(BED_FARMHAND_COUNT).sort(
      (a, b) => BED_FARMHAND_COUNT[a] - BED_FARMHAND_COUNT[b],
    );
    expect(sorted[sorted.length - 1]).toEqual("Salt Crystal Bed");
  });

  it("assigns a unique slot count to every bed", () => {
    const counts = Object.values(BED_FARMHAND_COUNT);
    expect(new Set(counts).size).toEqual(counts.length);
  });
});

describe("getPlacedBedNames", () => {
  it("counts a bed placed in the interior ground floor", () => {
    const interiorGround: Collectibles = { "Basic Bed": placed() };

    const result = getPlacedBedNames([
      undefined,
      undefined,
      interiorGround,
      undefined,
    ]);

    expect(result.has("Basic Bed")).toBe(true);
  });

  it("counts a bed placed on the interior level_one floor", () => {
    const levelOne: Collectibles = { "Sturdy Bed": placed() };

    const result = getPlacedBedNames([
      undefined,
      undefined,
      undefined,
      levelOne,
    ]);

    expect(result.has("Sturdy Bed")).toBe(true);
  });

  it("merges and dedupes bed types across every placement surface", () => {
    const farm: Collectibles = { "Basic Bed": placed() };
    const home: Collectibles = { "Floral Bed": placed() };
    // Same bed type placed both on the farm and the interior — counted once.
    const interiorGround: Collectibles = { "Basic Bed": placed() };
    const levelOne: Collectibles = { "Pearl Bed": placed() };

    const result = getPlacedBedNames([farm, home, interiorGround, levelOne]);

    expect(result).toEqual(new Set(["Basic Bed", "Floral Bed", "Pearl Bed"]));
  });

  it("ignores non-bed collectibles", () => {
    const farm: Collectibles = {
      "Sunflower Statue": placed(),
      "Basic Bed": placed(),
    };

    const result = getPlacedBedNames([farm]);

    expect(result).toEqual(new Set(["Basic Bed"]));
  });

  it("returns an empty set when no beds are placed anywhere", () => {
    expect(
      getPlacedBedNames([undefined, undefined, undefined, undefined]),
    ).toEqual(new Set());
  });
});
