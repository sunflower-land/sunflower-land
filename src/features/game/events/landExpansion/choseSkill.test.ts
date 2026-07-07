import { TEST_FARM, INITIAL_BUMPKIN } from "features/game/lib/constants";
import {
  LEVEL_EXPERIENCE,
  ascensionBaseline,
  levelXp,
} from "features/game/lib/level";
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
          experience: LEVEL_EXPERIENCE[5],
          skills: { "Green Thumb": 1, "Young Farmer": 1, "Old Farmer": 1 },
        },
      },
      action: { type: "skill.chosen", skill: "Strong Roots" },
      createdAt: dateNow,
    });

    expect(result.bumpkin?.skills).toEqual({
      "Green Thumb": 1,
      "Young Farmer": 1,
      "Old Farmer": 1,
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
          experience: LEVEL_EXPERIENCE[11],
          skills: {
            "Green Thumb": 1,
            "Young Farmer": 1,
            "Old Farmer": 1,
            "Experienced Farmer": 1,
            "Strong Roots": 1,
            "Horror Mike": 1,
          },
        },
      },
      action: { type: "skill.chosen", skill: "Instant Growth" },
      createdAt: dateNow,
    });

    expect(result.bumpkin?.skills).toEqual({
      "Green Thumb": 1,
      "Young Farmer": 1,
      "Old Farmer": 1,
      "Experienced Farmer": 1,
      "Strong Roots": 1,
      "Horror Mike": 1,
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
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          experience: LEVEL_EXPERIENCE[1],
          skills: {},
        },
      });

      expect(result).toBe(1);
    });

    it("makes sure level 10 bumpkin with no skills has 10 skill points", () => {
      const result = getAvailableBumpkinSkillPoints({
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          experience: LEVEL_EXPERIENCE[10],
          skills: {},
        },
      });

      expect(result).toBe(10);
    });

    it("makes sure level 5 bumpkins with one tier 1 skills has 4 skill points", () => {
      const result = getAvailableBumpkinSkillPoints({
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          experience: LEVEL_EXPERIENCE[5],
          skills: { "Young Farmer": 1 },
        },
      });

      expect(result).toBe(4);
    });

    it("makes sure level 5 bumpkins with one tier 2 skills has 3 skill points", () => {
      const result = getAvailableBumpkinSkillPoints({
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          experience: LEVEL_EXPERIENCE[5],
          skills: { "Strong Roots": 1 },
        },
      });

      expect(result).toBe(3);
    });

    it("makes sure level 5 bumpkins with one tier 3 skills has 2 skill points", () => {
      const result = getAvailableBumpkinSkillPoints({
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          experience: LEVEL_EXPERIENCE[5],
          skills: { "Instant Growth": 1 },
        },
      });

      expect(result).toBe(2);
    });

    it("makes sure level 10 bumpkins with one skill of each tier has 5 skill points", () => {
      const result = getAvailableBumpkinSkillPoints({
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          experience: LEVEL_EXPERIENCE[10],
          skills: {
            "Young Farmer": 1,
            "Strong Roots": 1,
            "Instant Growth": 1,
          },
        },
      });

      expect(result).toBe(4);
    });

    it("grants 150 skill points at the pre-ascension cap (level 150)", () => {
      const result = getAvailableBumpkinSkillPoints({
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          experience: LEVEL_EXPERIENCE[150],
          skills: {},
        },
      });

      expect(result).toBe(150);
    });

    it("grants 150 + within-ascension level skill points (A1 L1 → 151)", () => {
      const result = getAvailableBumpkinSkillPoints({
        ...TEST_FARM,
        island: { type: "swamp", ascensionLevel: 1 },
        bumpkin: {
          ...INITIAL_BUMPKIN,
          experience: ascensionBaseline(1),
          skills: {},
        },
      });

      expect(result).toBe(151);
    });

    it("grants 200 skill points at A1 L50 (band complete)", () => {
      const result = getAvailableBumpkinSkillPoints({
        ...TEST_FARM,
        island: { type: "swamp", ascensionLevel: 1 },
        bumpkin: {
          ...INITIAL_BUMPKIN,
          experience: ascensionBaseline(2),
          skills: {},
        },
      });

      expect(result).toBe(200);
    });

    it("stacks prior bands: A2 L25 → 150 + 50 + 25 = 225 skill points", () => {
      let experience = ascensionBaseline(2);
      for (let n = 1; n < 25; n++) experience += levelXp(2, n);

      const result = getAvailableBumpkinSkillPoints({
        ...TEST_FARM,
        island: { type: "swamp", ascensionLevel: 2 },
        bumpkin: {
          ...INITIAL_BUMPKIN,
          experience,
          skills: {},
        },
      });

      expect(result).toBe(225);
    });

    it("subtracts skill points spent on rank upgrades", () => {
      const result = getAvailableBumpkinSkillPoints({
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          experience: LEVEL_EXPERIENCE[10],
          // Green Thumb (tier 1) at rank 3: base 1 + upgrades 3 * 2 = 7 used.
          skills: { "Green Thumb": 3 },
        },
      });

      // Level 10 earns 10 points; 7 spent => 3 available.
      expect(result).toBe(3);
    });
  });
});
