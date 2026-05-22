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
          previousFreeSkillResetAt: dateNow,
        },
      },
      action: {
        type: "skills.updated",
        skills: { "Young Farmer": 1 },
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
          previousFreeSkillResetAt: dateNow,
        },
      },
      action: {
        type: "skills.updated",
        skills: {
          "Young Farmer": 1,
          "Green Thumb": 0,
          Unknown: 1,
        } as Skills,
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
        },
        createdAt: dateNow,
      }),
    ).toThrow("You do not have enough skill points");
  });

  it("prevents the edit when gems are missing past the free window", () => {
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
            skillPointsUsed: 200,
            previousFreeSkillResetAt: dateNow,
          },
        },
        action: {
          type: "skills.updated",
          skills: { "Young Farmer": 1 },
        },
        createdAt: dateNow,
      }),
    ).toThrow("Not enough gems");
  });

  it("does not charge while skillPointsUsed is still inside the free window", () => {
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
      },
      createdAt: dateNow,
    });

    expect(result.bumpkin?.skills).toEqual({ "Young Farmer": 1 });
    expect(result.inventory.Gem?.toNumber()).toEqual(10);
    expect(result.bumpkin?.skillPointsUsed).toEqual(1);
  });

  it("charges 1 gem per point once history passes the free 200", () => {
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
      },
      createdAt: dateNow,
    });

    expect(result.inventory.Gem?.toNumber()).toEqual(9);
    expect(result.bumpkin?.skillPointsUsed).toEqual(201);
  });

  it("doubles the gem rate every 200 points past the free window", () => {
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
          skillPointsUsed: 400,
          previousFreeSkillResetAt: dateNow,
        },
      },
      action: {
        type: "skills.updated",
        skills: { "Young Farmer": 1 },
      },
      createdAt: dateNow,
    });

    expect(result.inventory.Gem?.toNumber()).toEqual(8);
    expect(result.bumpkin?.skillPointsUsed).toEqual(401);
  });

  it("does not charge or burn anything for pure additions", () => {
    const result = updateSkills({
      state: {
        ...TEST_FARM,
        inventory: {
          ...TEST_FARM.inventory,
          Gem: new Decimal(0),
          "Skill Reset Ticket": new Decimal(1),
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
      },
      createdAt: dateNow,
    });

    expect(result.bumpkin?.skills).toEqual({
      "Green Thumb": 1,
      "Young Farmer": 1,
    });
    expect(result.bumpkin?.skillPointsUsed).toEqual(50);
    expect(result.bumpkin?.previousFreeSkillResetAt).toEqual(dateNow);
    expect(result.inventory["Skill Reset Ticket"]?.toNumber()).toEqual(1);
  });

  it("auto-resets skillPointsUsed and stamps the timer after the 180-day window expires", () => {
    const sixMonthsAgo = new Date(dateNow);
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const result = updateSkills({
      state: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          experience: LEVEL_EXPERIENCE[3],
          skills: { "Green Thumb": 1 },
          skillPointsUsed: 500,
          previousFreeSkillResetAt: sixMonthsAgo.getTime(),
        },
      },
      action: {
        type: "skills.updated",
        skills: { "Young Farmer": 1 },
      },
      createdAt: dateNow,
    });

    // 1 point removed inside the fresh free window — no gem cost.
    expect(result.bumpkin?.skillPointsUsed).toEqual(1);
    expect(result.bumpkin?.previousFreeSkillResetAt).toEqual(dateNow);
  });

  it("auto-consumes a ticket to absorb paid points instead of charging gems", () => {
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
          skillPointsUsed: 200,
          previousFreeSkillResetAt: dateNow,
        },
      },
      action: {
        type: "skills.updated",
        skills: { "Young Farmer": 1 },
      },
      createdAt: dateNow,
    });

    // 1 paid point at history 200 → ticket absorbs it, no gems charged.
    expect(result.inventory["Skill Reset Ticket"]?.toNumber()).toEqual(0);
    expect(result.inventory.Gem?.toNumber()).toEqual(0);
    expect(result.bumpkin?.skillPointsUsed).toEqual(201);
  });
});
