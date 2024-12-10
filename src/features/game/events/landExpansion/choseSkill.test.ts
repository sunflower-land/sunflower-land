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

  it("throws an error if player doesn't have enough used skill points for tier 2", () => {
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
          experience: LEVEL_EXPERIENCE[4],
          skills: { "Green Thumb": 1, "Young Farmer": 1 },
        },
      },
      action: { type: "skill.chosen", skill: "Strong Roots" },
      createdAt: dateNow,
    });

    expect(result.bumpkin?.skills).toEqual({
      "Green Thumb": 1,
      "Young Farmer": 1,
      "Strong Roots": 1,
    });
  });

  it("throws an error if player doesn't have enough used skill points for tier 3", () => {
    expect(() => {
      choseSkill({
        state: {
          ...TEST_FARM,
          bumpkin: {
            ...INITIAL_BUMPKIN,
            experience: LEVEL_EXPERIENCE[8],
            skills: {
              "Green Thumb": 1,
              "Young Farmer": 1,
              "Experienced Farmer": 1,
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
          experience: LEVEL_EXPERIENCE[8],
          skills: {
            "Green Thumb": 1,
            "Young Farmer": 1,
            "Experienced Farmer": 1,
            "Strong Roots": 1,
          },
        },
      },
      action: { type: "skill.chosen", skill: "Instant Growth" },
      createdAt: dateNow,
    });

    expect(result.bumpkin?.skills).toEqual({
      "Green Thumb": 1,
      "Young Farmer": 1,
      "Experienced Farmer": 1,
      "Strong Roots": 1,
      "Instant Growth": 1,
    });
  });

  it("doesn't allow player to claim skill if in correct island", () => {
    expect(() =>
      choseSkill({
        state: {
          ...TEST_FARM,
          island: {
            ...TEST_FARM.island,
            type: "spring",
          },
          bumpkin: {
            ...INITIAL_BUMPKIN,
            experience: LEVEL_EXPERIENCE[8],
            skills: {
              "Green Thumb": 1,
              "Young Farmer": 1,
              "Experienced Farmer": 1,
              "Strong Roots": 1,
            },
          },
        },
        action: { type: "skill.chosen", skill: "Oil Gadget" },
        createdAt: dateNow,
      }),
    ).toThrow("You are not at the correct island!");
  });

  it("allow player to claim skill if in correct island", () => {
    expect(() =>
      choseSkill({
        state: {
          ...TEST_FARM,
          island: {
            ...TEST_FARM.island,
            type: "desert",
          },
          bumpkin: {
            ...INITIAL_BUMPKIN,
            experience: LEVEL_EXPERIENCE[8],
            skills: {
              "Green Thumb": 1,
              "Young Farmer": 1,
              "Experienced Farmer": 1,
              "Strong Roots": 1,
            },
          },
        },
        action: { type: "skill.chosen", skill: "Sweet Bonus" },
        createdAt: dateNow,
      }),
    ).not.toThrow();
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
