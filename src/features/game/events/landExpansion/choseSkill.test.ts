import { TEST_FARM, INITIAL_BUMPKIN } from "features/game/lib/constants";
import { LEVEL_EXPERIENCE } from "features/game/lib/level";
import { choseSkill, getAvailableBumpkinSkillPoints } from "./choseSkill";

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

  it("throws an error if player doesn't have enough claimed skills for tier 2", () => {
    expect(() => {
      choseSkill({
        state: {
          ...TEST_FARM,
          bumpkin: {
            ...INITIAL_BUMPKIN,
            experience: LEVEL_EXPERIENCE[5],
            skills: { "Green Thumb 2": 1 },
          },
        },
        action: { type: "skill.chosen", skill: "Strong Roots" },
        createdAt: dateNow,
      });
    }).toThrow("You need to unlock tier 2 first");
  });

  it("claims a tier 2 skill", () => {
    const result = choseSkill({
      state: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          experience: LEVEL_EXPERIENCE[5],
          skills: { "Green Thumb 2": 1, "Young Farmer": 1 },
        },
      },
      action: { type: "skill.chosen", skill: "Strong Roots" },
      createdAt: dateNow,
    });

    expect(result.bumpkin?.skills).toEqual({
      "Green Thumb 2": 1,
      "Young Farmer": 1,
      "Strong Roots": 1,
    });
  });

  it("throws an error if player doesn't have enough claimed skills for tier 3", () => {
    expect(() => {
      choseSkill({
        state: {
          ...TEST_FARM,
          bumpkin: {
            ...INITIAL_BUMPKIN,
            experience: LEVEL_EXPERIENCE[7],
            skills: {
              "Green Thumb 2": 1,
              "Young Farmer": 1,
              "Experienced Farmer": 1,
              "Betty's Friend": 1,
            },
          },
        },
        action: { type: "skill.chosen", skill: "Instant Growth" },
        createdAt: dateNow,
      });
    }).toThrow("You need to unlock tier 3 first");
  });

  it("claims a tier 3 skill", () => {
    const result = choseSkill({
      state: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          experience: LEVEL_EXPERIENCE[10],
          skills: {
            "Green Thumb 2": 1,
            "Young Farmer": 1,
            "Experienced Farmer": 1,
            "Betty's Friend": 1,
            "Efficient Bin": 1,
          },
        },
      },
      action: { type: "skill.chosen", skill: "Instant Growth" },
      createdAt: dateNow,
    });

    expect(result.bumpkin?.skills).toEqual({
      "Green Thumb 2": 1,
      "Young Farmer": 1,
      "Experienced Farmer": 1,
      "Betty's Friend": 1,
      "Efficient Bin": 1,
      "Instant Growth": 1,
    });
  });

  describe("getAvailableBumpkinSkillPoints", () => {
    it("makes sure level 1 bumpkin with no skills has 1 skill point", () => {
      const result = getAvailableBumpkinSkillPoints({
        ...INITIAL_BUMPKIN,
        experience: LEVEL_EXPERIENCE[1],
        skills: {},
      });

      expect(result).toBe(1);
    });

    it("makes sure level 10 bumpkin with no skills has 10 skill points", () => {
      const result = getAvailableBumpkinSkillPoints({
        ...INITIAL_BUMPKIN,
        experience: LEVEL_EXPERIENCE[10],
        skills: {},
      });

      expect(result).toBe(10);
    });

    it("makes sure level 5 bumpkins with one tier 1 skills has 4 skill points", () => {
      const result = getAvailableBumpkinSkillPoints({
        ...INITIAL_BUMPKIN,
        experience: LEVEL_EXPERIENCE[5],
        skills: { "Young Farmer": 1 },
      });

      expect(result).toBe(4);
    });

    it("makes sure level 5 bumpkins with one tier 2 skills has 3 skill points", () => {
      const result = getAvailableBumpkinSkillPoints({
        ...INITIAL_BUMPKIN,
        experience: LEVEL_EXPERIENCE[5],
        skills: { "Strong Roots": 1 },
      });

      expect(result).toBe(3);
    });

    it("makes sure level 5 bumpkins with one tier 3 skills has 2 skill points", () => {
      const result = getAvailableBumpkinSkillPoints({
        ...INITIAL_BUMPKIN,
        experience: LEVEL_EXPERIENCE[5],
        skills: { "Instant Growth": 1 },
      });

      expect(result).toBe(2);
    });

    it("makes sure level 10 bumpkins with one skill of each tier has 5 skill points", () => {
      const result = getAvailableBumpkinSkillPoints({
        ...INITIAL_BUMPKIN,
        experience: LEVEL_EXPERIENCE[10],
        skills: {
          "Young Farmer": 1,
          "Strong Roots": 1,
          "Instant Growth": 1,
        },
      });

      expect(result).toBe(4);
    });
  });
});
