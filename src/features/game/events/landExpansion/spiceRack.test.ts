import { getMaxSpiceRackSlots } from "features/game/types/spiceRack";

describe("getMaxSpiceRackSlots", () => {
  it("returns 1 for non-positive levels", () => {
    expect(getMaxSpiceRackSlots(0)).toEqual(1);
    expect(getMaxSpiceRackSlots(-1)).toEqual(1);
  });

  it("returns level for 1 through 4", () => {
    expect(getMaxSpiceRackSlots(1)).toEqual(1);
    expect(getMaxSpiceRackSlots(3)).toEqual(3);
    expect(getMaxSpiceRackSlots(4)).toEqual(4);
  });

  it("caps at 4 for higher levels", () => {
    expect(getMaxSpiceRackSlots(5)).toEqual(4);
    expect(getMaxSpiceRackSlots(6)).toEqual(4);
  });
});
