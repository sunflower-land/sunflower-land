import {
  areFlowerTransfersFrozen,
  FLOWER_TRANSFERS_FROZEN_UNTIL,
} from "./flowerTransferFreeze";

describe("areFlowerTransfersFrozen", () => {
  it("reopens at the start of 24 August 2026 UTC", () => {
    expect(FLOWER_TRANSFERS_FROZEN_UNTIL.toISOString()).toEqual(
      "2026-08-24T00:00:00.000Z",
    );
  });

  it("is frozen before the cutoff", () => {
    expect(
      areFlowerTransfersFrozen(FLOWER_TRANSFERS_FROZEN_UNTIL.getTime() - 1),
    ).toBe(true);
  });

  it("lifts on the cutoff itself", () => {
    expect(
      areFlowerTransfersFrozen(FLOWER_TRANSFERS_FROZEN_UNTIL.getTime()),
    ).toBe(false);
  });

  it("stays lifted afterwards", () => {
    expect(
      areFlowerTransfersFrozen(FLOWER_TRANSFERS_FROZEN_UNTIL.getTime() + 1),
    ).toBe(false);
  });
});
