import { INITIAL_BUMPKIN, TEST_FARM } from "./constants";
import { isWearableActive } from "./wearables";

describe("wearables", () => {
  it("returns true when active on main bumpkin", () => {
    const inUse = isWearableActive({
      game: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: {
            ...INITIAL_BUMPKIN.equipped,
            wings: "Angel Wings",
          },
        },
      },
      name: "Angel Wings",
    });

    expect(inUse).toBeTruthy();
  });

  it("returns true when active on farm hand", () => {
    const inUse = isWearableActive({
      game: {
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
      },
      name: "Angel Wings",
    });

    expect(inUse).toBeTruthy();
  });

  it("returns false when not in use", () => {
    const inUse = isWearableActive({
      game: {
        ...TEST_FARM,
      },
      name: "Angel Wings",
    });

    expect(inUse).toBeFalsy();
  });
});
