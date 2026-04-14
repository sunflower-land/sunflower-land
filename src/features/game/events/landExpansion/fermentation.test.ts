import { getMaxFermentationSlots } from "features/game/types/fermentation";

describe("getMaxFermentationSlots", () => {
  it("returns 1 for non-positive levels", () => {
    expect(getMaxFermentationSlots(0)).toEqual(1);
    expect(getMaxFermentationSlots(-1)).toEqual(1);
  });

  it("returns level for 1 through 6", () => {
    expect(getMaxFermentationSlots(1)).toEqual(1);
    expect(getMaxFermentationSlots(3)).toEqual(3);
    expect(getMaxFermentationSlots(6)).toEqual(6);
  });

  it("caps at 6 for higher levels", () => {
    expect(getMaxFermentationSlots(7)).toEqual(6);
  });
});
