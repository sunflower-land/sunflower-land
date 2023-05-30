import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import { equip } from "./equip";

describe("equip", () => {
  it("equips a single part of clothing", () => {
    const state = equip({
      state: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: {
            ...INITIAL_BUMPKIN.equipped,
            shirt: "Blue Farmer Shirt",
          },
        },
        wardrobe: {
          "Red Farmer Shirt": 1,
        },
      },
      action: {
        type: "bumpkin.equipped",
        equipment: {
          shirt: "Red Farmer Shirt",
        },
      },
    });

    expect(state.bumpkin?.equipped.shirt).toEqual("Red Farmer Shirt");
  });

  it("equips multiple parts of clothing", () => {
    const state = equip({
      state: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: {
            ...INITIAL_BUMPKIN.equipped,
            shirt: "Blue Farmer Shirt",
          },
        },
        wardrobe: {
          "Yellow Farmer Shirt": 1,
          "Angel Wings": 1,
          "Blacksmith Hair": 2,
        },
      },
      action: {
        type: "bumpkin.equipped",
        equipment: {
          shirt: "Yellow Farmer Shirt",
          hair: "Blacksmith Hair",
          wings: "Angel Wings",
        },
      },
    });

    expect(state.bumpkin?.equipped.shirt).toEqual("Yellow Farmer Shirt");
    expect(state.bumpkin?.equipped.hair).toEqual("Blacksmith Hair");
    expect(state.bumpkin?.equipped.wings).toEqual("Angel Wings");
  });
});
