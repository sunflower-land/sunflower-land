import {
  getMaxSpiceRackSlots,
  isSpiceRackRecipeName,
  isStartableSpiceRackRecipeName,
} from "features/game/types/spiceRack";

describe("isSpiceRackRecipeName", () => {
  it("rejects Object.prototype keys such as toString", () => {
    expect(isSpiceRackRecipeName("toString")).toBe(false);
    expect(isSpiceRackRecipeName("hasOwnProperty")).toBe(false);
  });

  it("accepts real recipe ids", () => {
    expect(isSpiceRackRecipeName("Refined Salt")).toBe(true);
    expect(isSpiceRackRecipeName("Honey Treat")).toBe(true);
  });

  it("accepts legacy recipe ids for resolution", () => {
    expect(isSpiceRackRecipeName("Spice Base")).toBe(true);
    expect(isSpiceRackRecipeName("Spiced Cheese")).toBe(true);
  });

  it("rejects unknown strings", () => {
    expect(isSpiceRackRecipeName("not_a_recipe")).toBe(false);
  });
});

describe("isStartableSpiceRackRecipeName", () => {
  it("accepts startable recipe ids", () => {
    expect(isStartableSpiceRackRecipeName("Refined Salt")).toBe(true);
    expect(isStartableSpiceRackRecipeName("Honey Treat")).toBe(true);
    expect(isStartableSpiceRackRecipeName("Salt Lick")).toBe(true);
  });

  it("rejects legacy recipe ids", () => {
    expect(isStartableSpiceRackRecipeName("Spice Base")).toBe(false);
    expect(isStartableSpiceRackRecipeName("Spiced Cheese")).toBe(false);
  });

  it("rejects unknown strings", () => {
    expect(isStartableSpiceRackRecipeName("not_a_recipe")).toBe(false);
  });
});

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
