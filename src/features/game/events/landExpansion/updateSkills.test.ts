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

  it("updates skills and deducts gems when paid with gems", () => {
    const result = updateSkills({
      state: {
        ...TEST_FARM,
        inventory: {
          ...TEST_FARM.inventory,
          Gem: new Decimal(250),
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
    expect(result.inventory.Gem).toEqual(new Decimal(50));
  });
});
