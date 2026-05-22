import { TEST_FARM, INITIAL_BUMPKIN } from "features/game/lib/constants";
import Decimal from "decimal.js-light";
import { Skills } from "features/game/types/game";
import { LEVEL_EXPERIENCE } from "features/game/lib/level";
import { updateSkills } from "./updateSkills";

describe("updateSkills", () => {
  const dateNow = Date.now();

  it("updates a valid skill build", () => {
    const result = updateSkills({
      state: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          experience: LEVEL_EXPERIENCE[3],
          skills: { "Green Thumb": 1 },
        },
      },
      action: {
        type: "skills.updated",
        skills: { "Young Farmer": 1 },
        paymentType: "free",
      },
      createdAt: dateNow,
    });

    expect(result.bumpkin?.skills).toEqual({ "Young Farmer": 1 });
  });

  it("rejects no-op updates so the player isn't charged", () => {
    expect(() =>
      updateSkills({
        state: {
          ...TEST_FARM,
          bumpkin: {
            ...INITIAL_BUMPKIN,
            experience: LEVEL_EXPERIENCE[3],
            skills: { "Green Thumb": 1 },
          },
        },
        action: {
          type: "skills.updated",
          skills: { "Green Thumb": 1 },
          paymentType: "free",
        },
        createdAt: dateNow,
      }),
    ).toThrow("No skill changes to apply");
  });

  it("prevents updating skills without a Bumpkin", () => {
    expect(() =>
      updateSkills({
        state: {
          ...TEST_FARM,
          bumpkin: undefined,
        } as unknown as typeof TEST_FARM,
        action: {
          type: "skills.updated",
          skills: { "Young Farmer": 1 },
          paymentType: "free",
        },
        createdAt: dateNow,
      }),
    ).toThrow("You do not have a Bumpkin!");
  });

  it("removes invalid skill entries when updating skills", () => {
    const result = updateSkills({
      state: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          experience: LEVEL_EXPERIENCE[3],
          skills: { "Green Thumb": 1 },
        },
      },
      action: {
        type: "skills.updated",
        skills: {
          "Young Farmer": 1,
          "Green Thumb": 0,
          Unknown: 1,
        } as Skills,
        paymentType: "free",
      },
      createdAt: dateNow,
    });

    expect(result.bumpkin?.skills).toEqual({ "Young Farmer": 1 });
  });

  it("prevents updating to an island-restricted skill build", () => {
    expect(() =>
      updateSkills({
        state: {
          ...TEST_FARM,
          island: {
            ...TEST_FARM.island,
            type: "spring",
          },
          bumpkin: {
            ...INITIAL_BUMPKIN,
            experience: LEVEL_EXPERIENCE[10],
            skills: {
              "Green Thumb": 1,
              "Young Farmer": 1,
              "Experienced Farmer": 1,
              "Strong Roots": 1,
            },
          },
        },
        action: {
          type: "skills.updated",
          skills: {
            "Green Thumb": 1,
            "Young Farmer": 1,
            "Experienced Farmer": 1,
            "Strong Roots": 1,
            "Oil Gadget": 1,
          },
          paymentType: "free",
        },
        createdAt: dateNow,
      }),
    ).toThrow("You are not at the correct island!");
  });

  it("prevents updating to tier 2 without enough lower-tier points", () => {
    expect(() =>
      updateSkills({
        state: {
          ...TEST_FARM,
          bumpkin: {
            ...INITIAL_BUMPKIN,
            experience: LEVEL_EXPERIENCE[10],
            skills: {},
          },
        },
        action: {
          type: "skills.updated",
          skills: { "Strong Roots": 1 },
          paymentType: "free",
        },
        createdAt: dateNow,
      }),
    ).toThrow("You need to unlock tier 2 first");
  });

  it("prevents removing lower-tier skills while keeping higher-tier skills", () => {
    expect(() =>
      updateSkills({
        state: {
          ...TEST_FARM,
          bumpkin: {
            ...INITIAL_BUMPKIN,
            experience: LEVEL_EXPERIENCE[10],
            skills: {
              "Green Thumb": 1,
              "Young Farmer": 1,
              "Old Farmer": 1,
              "Strong Roots": 1,
            },
          },
        },
        action: {
          type: "skills.updated",
          skills: { "Strong Roots": 1 },
          paymentType: "free",
        },
        createdAt: dateNow,
      }),
    ).toThrow("You need to unlock tier 2 first");
  });

  it("prevents updating to a skill build with too many points", () => {
    expect(() =>
      updateSkills({
        state: {
          ...TEST_FARM,
          bumpkin: {
            ...INITIAL_BUMPKIN,
            experience: LEVEL_EXPERIENCE[1],
            skills: {},
          },
        },
        action: {
          type: "skills.updated",
          skills: { "Green Thumb": 1, "Young Farmer": 1 },
          paymentType: "free",
        },
        createdAt: dateNow,
      }),
    ).toThrow("You do not have enough skill points");
  });

  it("prevents paid skill updates when gems are missing", () => {
    expect(() =>
      updateSkills({
        state: {
          ...TEST_FARM,
          inventory: {
            ...TEST_FARM.inventory,
            Gem: undefined,
          },
          bumpkin: {
            ...INITIAL_BUMPKIN,
            experience: LEVEL_EXPERIENCE[3],
            skills: { "Green Thumb": 1 },
            previousFreeSkillResetAt: dateNow,
          },
        },
        action: {
          type: "skills.updated",
          skills: { "Young Farmer": 1 },
          paymentType: "gems",
        },
        createdAt: dateNow,
      }),
    ).toThrow("Not enough gems");
  });

  it("charges 1 gem per removed point and increments skillPointsUsed", () => {
    const result = updateSkills({
      state: {
        ...TEST_FARM,
        inventory: {
          ...TEST_FARM.inventory,
          Gem: new Decimal(10),
        },
        bumpkin: {
          ...INITIAL_BUMPKIN,
          experience: LEVEL_EXPERIENCE[3],
          skills: { "Green Thumb": 1 },
          previousFreeSkillResetAt: dateNow,
        },
      },
      action: {
        type: "skills.updated",
        skills: { "Young Farmer": 1 },
        paymentType: "gems",
      },
      createdAt: dateNow,
    });

    expect(result.bumpkin?.skills).toEqual({ "Young Farmer": 1 });
    expect(result.inventory.Gem?.toNumber()).toEqual(9);
    expect(result.bumpkin?.skillPointsUsed).toEqual(1);
  });

  it("doubles gem rate past 200 skill points used", () => {
    const result = updateSkills({
      state: {
        ...TEST_FARM,
        inventory: {
          ...TEST_FARM.inventory,
          Gem: new Decimal(10),
        },
        bumpkin: {
          ...INITIAL_BUMPKIN,
          experience: LEVEL_EXPERIENCE[3],
          skills: { "Green Thumb": 1 },
          skillPointsUsed: 200,
          previousFreeSkillResetAt: dateNow,
        },
      },
      action: {
        type: "skills.updated",
        skills: { "Young Farmer": 1 },
        paymentType: "gems",
      },
      createdAt: dateNow,
    });

    expect(result.inventory.Gem?.toNumber()).toEqual(8);
    expect(result.bumpkin?.skillPointsUsed).toEqual(201);
  });

  it("does not charge or burn cooldown for pure additions", () => {
    const result = updateSkills({
      state: {
        ...TEST_FARM,
        inventory: {
          ...TEST_FARM.inventory,
          Gem: new Decimal(0),
        },
        bumpkin: {
          ...INITIAL_BUMPKIN,
          experience: LEVEL_EXPERIENCE[3],
          skills: { "Green Thumb": 1 },
          skillPointsUsed: 50,
          previousFreeSkillResetAt: dateNow,
        },
      },
      action: {
        type: "skills.updated",
        skills: { "Green Thumb": 1, "Young Farmer": 1 },
        paymentType: "free",
      },
      createdAt: dateNow,
    });

    expect(result.bumpkin?.skills).toEqual({
      "Green Thumb": 1,
      "Young Farmer": 1,
    });
    expect(result.bumpkin?.skillPointsUsed).toEqual(50);
    expect(result.bumpkin?.previousFreeSkillResetAt).toEqual(dateNow);
  });

  it("zeroes skillPointsUsed when paid as a free update", () => {
    const sixMonthsAgo = new Date(dateNow);
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const result = updateSkills({
      state: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          experience: LEVEL_EXPERIENCE[3],
          skills: { "Green Thumb": 1 },
          skillPointsUsed: 50,
          previousFreeSkillResetAt: sixMonthsAgo.getTime(),
        },
      },
      action: {
        type: "skills.updated",
        skills: { "Young Farmer": 1 },
        paymentType: "free",
      },
      createdAt: dateNow,
    });

    expect(result.bumpkin?.skillPointsUsed).toEqual(0);
    expect(result.bumpkin?.previousFreeSkillResetAt).toEqual(dateNow);
  });

  it("skips gem cost but increments skillPointsUsed when paid by ticket", () => {
    const result = updateSkills({
      state: {
        ...TEST_FARM,
        inventory: {
          ...TEST_FARM.inventory,
          "Skill Reset Ticket": new Decimal(1),
          Gem: new Decimal(0),
        },
        bumpkin: {
          ...INITIAL_BUMPKIN,
          experience: LEVEL_EXPERIENCE[3],
          skills: { "Green Thumb": 1 },
          skillPointsUsed: 10,
          previousFreeSkillResetAt: dateNow,
        },
      },
      action: {
        type: "skills.updated",
        skills: { "Young Farmer": 1 },
        paymentType: "ticket",
      },
      createdAt: dateNow,
    });

    expect(result.bumpkin?.skillPointsUsed).toEqual(11);
    expect(result.inventory["Skill Reset Ticket"]?.toNumber()).toEqual(0);
    expect(result.inventory.Gem?.toNumber()).toEqual(0);
  });
});
