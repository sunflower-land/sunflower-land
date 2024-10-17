import "lib/__mocks__/configMock";
import { TEST_FARM, INITIAL_BUMPKIN } from "features/game/lib/constants";
import { LEVEL_EXPERIENCE } from "features/game/lib/level";
import { choseSkill } from "./choseSkill";
import Decimal from "decimal.js-light";

describe("choseSkill", () => {
  const dateNow = Date.now();

  it("prevents Bumpkin from picking the same skill twice", () => {
    expect(() => {
      choseSkill({
        state: {
          ...TEST_FARM,
          bumpkin: {
            ...INITIAL_BUMPKIN,
            experience: LEVEL_EXPERIENCE[4],
            skills: { "Green Thumb 2": 1 },
          },
        },
        action: { type: "skill.chosen", skill: "Green Thumb 2" },
        createdAt: dateNow,
      });
    }).toThrow("You already have this skill");
  });

  it("adds the Green Thumb skill to bumpkin", () => {
    const result = choseSkill({
      state: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          experience: LEVEL_EXPERIENCE[2],
          skills: {},
        },
      },
      action: { type: "skill.chosen", skill: "Green Thumb 2" },
      createdAt: dateNow,
    });

    expect(result.bumpkin?.skills).toEqual({ "Green Thumb 2": 1 });
  });

  it("adds the Cultivator skill to bumpkin", () => {
    const result = choseSkill({
      state: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          experience: LEVEL_EXPERIENCE[3],
          skills: { "Green Thumb 2": 1 },
        },
      },
      action: { type: "skill.chosen", skill: "Young Farmer" },
      createdAt: dateNow,
    });

    expect(result.bumpkin?.skills).toEqual({
      "Young Farmer": 1,
      "Green Thumb 2": 1,
    });
  });

  it("adds a Flower Bed & Beehive to the inventory when claiming Flowery Abode", () => {
    const result = choseSkill({
      state: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          experience: LEVEL_EXPERIENCE[50],
          skills: {
            "Sweet Bonus": 1,
            "Hyper Bees": 1,
            "Blooming Boost": 1,
            "Buzzworthy Treats": 1,
            "Blossom Bonding": 1,
            "Pollen Power Up": 1,
          },
        },
        inventory: {},
      },
      action: { type: "skill.chosen", skill: "Flowery Abode" },
      createdAt: dateNow,
    });

    expect(result.inventory).toEqual({
      "Flower Bed": new Decimal(1),
      Beehive: new Decimal(1),
    });
  });
});
