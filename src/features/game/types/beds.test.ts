import { BED_FARMHAND_COUNT } from "./beds";
import { getKeys } from "lib/object";

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
