import { INITIAL_BUMPKIN, TEST_FARM } from "../../lib/constants";
import { skillUse } from "./skillUsed";

describe("skillUse", () => {
  const dateNow = Date.now();

  it("requires Bumpkin to have a skill", () => {
    expect(() => {
      skillUse({
        state: {
          ...TEST_FARM,
          bumpkin: {
            ...INITIAL_BUMPKIN,
            skills: {},
          },
        },
        action: { type: "skill.used", skill: "Green Thumb 2" },
        createdAt: dateNow,
      });
    }).toThrow("You do not have this skill");
  });

  it("requires the skill to be a power", () => {
    expect(() => {
      skillUse({
        state: {
          ...TEST_FARM,
          bumpkin: {
            ...INITIAL_BUMPKIN,
            skills: { "Green Thumb 2": 1 },
          },
        },
        action: { type: "skill.used", skill: "Green Thumb 2" },
        createdAt: dateNow,
      });
    }).toThrow("This skill does not have a power");
  });

  it("requires the skill to be off cooldown", () => {
    expect(() => {
      skillUse({
        state: {
          ...TEST_FARM,
          bumpkin: {
            ...INITIAL_BUMPKIN,
            skills: { "Instant Growth": 1 },
            previousPowerUseAt: { "Instant Growth": dateNow },
          },
        },
        action: { type: "skill.used", skill: "Instant Growth" },
        createdAt: dateNow,
      });
    }).toThrow("This skill is still under cooldown");
  });

  it("adds the power.useAt to the bumpkin", () => {
    const result = skillUse({
      state: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          skills: { "Instant Growth": 1 },
        },
      },
      action: { type: "skill.used", skill: "Instant Growth" },
      createdAt: dateNow,
    });

    expect(result.bumpkin?.previousPowerUseAt).toEqual({
      "Instant Growth": dateNow,
    });
  });
});
