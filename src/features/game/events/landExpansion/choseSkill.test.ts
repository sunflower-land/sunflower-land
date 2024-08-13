import "lib/__mocks__/configMock";
import { TEST_FARM, INITIAL_BUMPKIN } from "features/game/lib/constants";
import { LEVEL_EXPERIENCE } from "features/game/lib/level";
import { choseSkill } from "./choseSkill";

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
            skills: { "Green Thumb": 1 },
          },
        },
        action: { type: "skill.chosen", skill: "Green Thumb" },
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
      action: { type: "skill.chosen", skill: "Green Thumb" },
      createdAt: dateNow,
    });

    expect(result.bumpkin?.skills).toEqual({ "Green Thumb": 1 });
  });

  it("adds the Cultivator skill to bumpkin", () => {
    const result = choseSkill({
      state: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          experience: LEVEL_EXPERIENCE[3],
          skills: { "Green Thumb": 1 },
        },
      },
      action: { type: "skill.chosen", skill: "Young Farmer" },
      createdAt: dateNow,
    });

    expect(result.bumpkin?.skills).toEqual({
      "Young Farmer": 1,
      "Green Thumb": 1,
    });
  });
});
