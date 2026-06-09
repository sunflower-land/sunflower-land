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
    const result = getPlacedBedNames({
      collectibles: {},
      home: { collectibles: {} },
      interior: { ground: { collectibles: { "Basic Bed": placed() } } },
    });

    expect(result.has("Basic Bed")).toBe(true);
  });

  it("counts a bed placed on the interior level_one floor", () => {
    const result = getPlacedBedNames({
      collectibles: {},
      home: { collectibles: {} },
      interior: {
        ground: { collectibles: {} },
        level_one: { collectibles: { "Sturdy Bed": placed() } },
      },
    });

    expect(result.has("Sturdy Bed")).toBe(true);
  });

  it("merges and dedupes bed types across every placement surface", () => {
    const result = getPlacedBedNames({
      collectibles: { "Basic Bed": placed() },
      home: { collectibles: { "Floral Bed": placed() } },
      interior: {
        // Same bed type placed both on the farm and the interior — counted once.
        ground: { collectibles: { "Basic Bed": placed() } },
        level_one: { collectibles: { "Pearl Bed": placed() } },
      },
    });

    expect(result).toEqual(new Set(["Basic Bed", "Floral Bed", "Pearl Bed"]));
  });

  it("ignores non-bed collectibles", () => {
    const farm: Collectibles = {
      "Sunflower Statue": placed(),
      "Basic Bed": placed(),
    };

    const result = getPlacedBedNames({
      collectibles: farm,
      home: { collectibles: {} },
    });

    expect(result).toEqual(new Set(["Basic Bed"]));
  });

  it("returns an empty set when no beds are placed anywhere", () => {
    expect(
      getPlacedBedNames({ collectibles: {}, home: { collectibles: {} } }),
    ).toEqual(new Set());
  });
});
