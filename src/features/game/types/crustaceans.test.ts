import { getWaterTrapCoordinates } from "./crustaceans";
import type { IslandType } from "./game";
import { getWharfCoordinates } from "../expansion/lib/constants";

// The back end owns the set of trap ids per island (getWaterTrapPositions); the
// FE only renders them, so it must have a base coordinate for every id the BE
// can produce. Keep this in sync with the BE id counts.
const TRAP_IDS_PER_ISLAND: Record<IslandType, string[]> = {
  basic: ["1"],
  spring: ["1", "2"],
  desert: ["1", "2", "3"],
  volcano: ["1", "2", "3", "4"],
  swamp: ["1", "2", "3", "4"],
  // Ascension islands (spooky onward) reuse the swamp value for now.
  spooky: ["1", "2", "3", "4"],
  crystal: ["1", "2", "3", "4"],
  galaxy: ["1", "2", "3", "4"],
  marble: ["1", "2", "3", "4"],
};

describe("getWaterTrapCoordinates", () => {
  it("has a position for every trap id the back end produces per island", () => {
    for (const [island, ids] of Object.entries(TRAP_IDS_PER_ISLAND)) {
      for (const id of ids) {
        expect(
          getWaterTrapCoordinates(21, island as IslandType, id),
        ).toBeDefined();
      }
    }
  });

  it("returns undefined for an unknown trap id", () => {
    expect(getWaterTrapCoordinates(21, "spring", "99")).toBeUndefined();
  });

  // Traps are anchored to the dock, so each keeps a constant offset from the
  // wharf at every land size — moving with the dock instead of drifting.
  it("keeps a constant offset from the dock at every land size", () => {
    const offsetFromDock = (count: number, id: string) => {
      const c = getWaterTrapCoordinates(count, "volcano", id)!;
      const dock = getWharfCoordinates(count);
      return { dx: c.x - dock.x, dy: c.y - dock.y };
    };

    for (const id of TRAP_IDS_PER_ISLAND.volcano) {
      const ref = offsetFromDock(3, id);
      for (const count of [7, 14, 21, 42]) {
        expect(offsetFromDock(count, id)).toEqual(ref);
      }
    }
  });
});
