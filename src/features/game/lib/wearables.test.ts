import { INITIAL_BUMPKIN, TEST_FARM } from "./constants";
import { isWearableActive } from "./wearables";

describe("wearables", () => {
  it("returns true when active on main bumpkin", () => {
    const game = {
      ...TEST_FARM,
      bumpkin: {
        ...INITIAL_BUMPKIN,
        equipped: {
          ...INITIAL_BUMPKIN.equipped,
          wings: "Angel Wings",
        },
      },
    };

    const inUse = isWearableActive({
      name: "Angel Wings",
      bumpkinEquipped: game.bumpkin.equipped,
      farmHands: game.farmHands,
    });

    expect(inUse).toBeTruthy();
  });

  it("returns true when active on farm hand", () => {
    const game = {
      ...TEST_FARM,
      farmHands: {
        bumpkins: {
          1: {
            equipped: {
              ...INITIAL_BUMPKIN.equipped,
              wings: "Angel Wings",
            },
          },
        },
      },
    };

    const inUse = isWearableActive({
      name: "Angel Wings",
      bumpkinEquipped: game.bumpkin.equipped,
      farmHands: game.farmHands,
    });

    expect(inUse).toBeTruthy();
  });

  it("returns false when not in use", () => {
    const game = {
      ...TEST_FARM,
    };

    const inUse = isWearableActive({
      name: "Angel Wings",
      bumpkinEquipped: game.bumpkin.equipped,
      farmHands: game.farmHands,
    });

    expect(inUse).toBeFalsy();
  });
});
