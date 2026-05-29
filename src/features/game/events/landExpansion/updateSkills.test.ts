import { TEST_FARM, INITIAL_BUMPKIN } from "features/game/lib/constants";
import Decimal from "decimal.js-light";
import type { Skills } from "features/game/types/game";
import { LEVEL_EXPERIENCE } from "features/game/lib/level";
import { updateSkills } from "./updateSkills";
import { REGEN_MS } from "./chargeSkillEdit";
import { CONFIG } from "lib/config";

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
          freeSkillPoints: 50,
          lastFreeSkillPointsRegenAt: dateNow,
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
          freeSkillPoints: 50,
          lastFreeSkillPointsRegenAt: dateNow,
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

  it("prevents the edit when free balance is empty and gems are missing", () => {
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
            freeSkillPoints: 0,
            lastFreeSkillPointsRegenAt: dateNow,
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

  it("absorbs the removal with the free balance when sufficient", () => {
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
          freeSkillPoints: 10,
          lastFreeSkillPointsRegenAt: dateNow,
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
    expect(result.bumpkin?.freeSkillPoints).toEqual(9);
  });

  it("charges 5 gems per point once the free balance is exhausted", () => {
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
          freeSkillPoints: 0,
          lastFreeSkillPointsRegenAt: dateNow,
        },
      },
      action: {
        type: "skills.updated",
        skills: { "Young Farmer": 1 },
      },
      createdAt: dateNow,
    });

    expect(result.inventory.Gem?.toNumber()).toEqual(5);
    expect(result.bumpkin?.freeSkillPoints).toEqual(0);
  });

  it("splits cost across free balance and gems on the boundary", () => {
    const result = updateSkills({
      state: {
        ...TEST_FARM,
        inventory: {
          ...TEST_FARM.inventory,
          Gem: new Decimal(100),
        },
        bumpkin: {
          ...INITIAL_BUMPKIN,
          experience: LEVEL_EXPERIENCE[20],
          skills: {
            "Green Thumb": 1,
            "Young Farmer": 1,
            "Experienced Farmer": 1,
          },
          freeSkillPoints: 2,
          lastFreeSkillPointsRegenAt: dateNow,
        },
      },
      action: {
        type: "skills.updated",
        skills: {},
      },
      createdAt: dateNow,
    });

    // 3 points removed, 2 absorbed by free balance, 1 paid at 5 gems.
    expect(result.inventory.Gem?.toNumber()).toEqual(95);
    expect(result.bumpkin?.freeSkillPoints).toEqual(0);
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
          freeSkillPoints: 10,
          lastFreeSkillPointsRegenAt: dateNow,
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
    expect(result.bumpkin?.freeSkillPoints).toEqual(10);
    expect(result.inventory["Skill Reset Ticket"]?.toNumber()).toEqual(1);
  });

  it("regenerates a single +50 tick once the 90-day window has elapsed", () => {
    const ninetyOneDaysAgo = dateNow - REGEN_MS - 24 * 60 * 60 * 1000;

    const result = updateSkills({
      state: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          experience: LEVEL_EXPERIENCE[3],
          skills: { "Green Thumb": 1 },
          freeSkillPoints: 10,
          lastFreeSkillPointsRegenAt: ninetyOneDaysAgo,
        },
      },
      action: {
        type: "skills.updated",
        skills: { "Young Farmer": 1 },
      },
      createdAt: dateNow,
    });

    // Started with 10, tick added 50 (cap 100 not hit), removed 1 = 59.
    expect(result.bumpkin?.freeSkillPoints).toEqual(59);
    expect(result.bumpkin?.lastFreeSkillPointsRegenAt).toEqual(dateNow);
  });

  it("caps the regen tick at MAX_FREE_POINTS even if dormant for years", () => {
    const yearsAgo = dateNow - 10 * REGEN_MS;

    const result = updateSkills({
      state: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          experience: LEVEL_EXPERIENCE[3],
          skills: { "Green Thumb": 1 },
          freeSkillPoints: 60,
          lastFreeSkillPointsRegenAt: yearsAgo,
        },
      },
      action: {
        type: "skills.updated",
        skills: { "Young Farmer": 1 },
      },
      createdAt: dateNow,
    });

    // 60 + 50 = 110, capped at 100, then -1 for the removal = 99.
    expect(result.bumpkin?.freeSkillPoints).toEqual(99);
  });

  it("treats saves without freeSkillPoints as 50 (migration default)", () => {
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
      },
      createdAt: dateNow,
    });

    expect(result.bumpkin?.freeSkillPoints).toEqual(49);
    expect(result.bumpkin?.lastFreeSkillPointsRegenAt).toEqual(dateNow);
  });

  it("clears all skills when handed an empty skills payload (replacing the old reset event)", () => {
    const result = updateSkills({
      state: {
        ...TEST_FARM,
        inventory: {
          ...TEST_FARM.inventory,
          Gem: new Decimal(100),
        },
        bumpkin: {
          ...INITIAL_BUMPKIN,
          experience: LEVEL_EXPERIENCE[10],
          skills: {
            "Green Thumb": 1,
            "Young Farmer": 1,
            "Experienced Farmer": 1,
            "Old Farmer": 1,
          },
          freeSkillPoints: 100,
          lastFreeSkillPointsRegenAt: dateNow,
        },
      },
      action: {
        type: "skills.updated",
        skills: {},
      },
      createdAt: dateNow,
    });

    expect(result.bumpkin?.skills).toEqual({});
    // 4 points removed, all absorbed by the 100-point free balance.
    expect(result.bumpkin?.freeSkillPoints).toEqual(96);
    expect(result.inventory.Gem?.toNumber()).toEqual(100);
  });

  describe("useTicket", () => {
    it("burns one ticket and grants +50 free balance (capped 100) before charging", () => {
      const result = updateSkills({
        state: {
          ...TEST_FARM,
          inventory: {
            ...TEST_FARM.inventory,
            "Skill Reset Ticket": new Decimal(2),
            Gem: new Decimal(0),
          },
          bumpkin: {
            ...INITIAL_BUMPKIN,
            experience: LEVEL_EXPERIENCE[3],
            skills: { "Green Thumb": 1 },
            freeSkillPoints: 0,
            lastFreeSkillPointsRegenAt: dateNow,
          },
        },
        action: {
          type: "skills.updated",
          skills: { "Young Farmer": 1 },
          useTicket: true,
        },
        createdAt: dateNow,
      });

      // Ticket bumped balance from 0 to 50, edit consumed 1, leaving 49.
      expect(result.bumpkin?.freeSkillPoints).toEqual(49);
      expect(result.inventory["Skill Reset Ticket"]?.toNumber()).toEqual(1);
      expect(result.inventory.Gem?.toNumber()).toEqual(0);
    });

    it("caps the ticket bump at MAX_FREE_POINTS even with surplus", () => {
      const result = updateSkills({
        state: {
          ...TEST_FARM,
          inventory: {
            ...TEST_FARM.inventory,
            "Skill Reset Ticket": new Decimal(1),
          },
          bumpkin: {
            ...INITIAL_BUMPKIN,
            experience: LEVEL_EXPERIENCE[3],
            skills: { "Green Thumb": 1 },
            freeSkillPoints: 70,
            lastFreeSkillPointsRegenAt: dateNow,
          },
        },
        action: {
          type: "skills.updated",
          skills: { "Young Farmer": 1 },
          useTicket: true,
        },
        createdAt: dateNow,
      });

      // 70 + 50 = 120, capped at 100, edit consumed 1, leaving 99.
      expect(result.bumpkin?.freeSkillPoints).toEqual(99);
      expect(result.inventory["Skill Reset Ticket"]?.toNumber()).toEqual(0);
    });

    it("throws if the player has no ticket", () => {
      expect(() =>
        updateSkills({
          state: {
            ...TEST_FARM,
            inventory: {
              ...TEST_FARM.inventory,
              "Skill Reset Ticket": new Decimal(0),
            },
            bumpkin: {
              ...INITIAL_BUMPKIN,
              experience: LEVEL_EXPERIENCE[3],
              skills: { "Green Thumb": 1 },
              freeSkillPoints: 0,
              lastFreeSkillPointsRegenAt: dateNow,
            },
          },
          action: {
            type: "skills.updated",
            skills: { "Young Farmer": 1 },
            useTicket: true,
          },
          createdAt: dateNow,
        }),
      ).toThrow("You do not have a Skill Reset Ticket");
    });
  });

  describe("skill cooldown", () => {
    const DAY = 24 * 60 * 60 * 1000;

    it("stamps the cooldown for every transitioned skill on apply", () => {
      const result = updateSkills({
        state: {
          ...TEST_FARM,
          inventory: { ...TEST_FARM.inventory, Gem: new Decimal(100) },
          bumpkin: {
            ...INITIAL_BUMPKIN,
            experience: LEVEL_EXPERIENCE[3],
            skills: { "Green Thumb": 1 },
            freeSkillPoints: 50,
            lastFreeSkillPointsRegenAt: dateNow,
          },
        },
        action: {
          type: "skills.updated",
          skills: { "Young Farmer": 1 },
        },
        createdAt: dateNow,
      });

      expect(result.bumpkin?.skillLastChangedAt?.["Green Thumb"]).toEqual(
        dateNow,
      );
      expect(result.bumpkin?.skillLastChangedAt?.["Young Farmer"]).toEqual(
        dateNow,
      );
    });

    it("rejects re-picking a skill within 7 days of removal", () => {
      const threeDaysAgo = dateNow - 3 * DAY;
      expect(() =>
        updateSkills({
          state: {
            ...TEST_FARM,
            inventory: { ...TEST_FARM.inventory, Gem: new Decimal(100) },
            bumpkin: {
              ...INITIAL_BUMPKIN,
              experience: LEVEL_EXPERIENCE[3],
              skills: {},
              freeSkillPoints: 50,
              lastFreeSkillPointsRegenAt: dateNow,
              skillLastChangedAt: { "Green Thumb": threeDaysAgo },
            },
          },
          action: {
            type: "skills.updated",
            skills: { "Green Thumb": 1 },
          },
          createdAt: dateNow,
        }),
      ).toThrow("on cooldown");
    });

    it("rejects removing a skill within 7 days of picking it", () => {
      const oneDayAgo = dateNow - DAY;
      expect(() =>
        updateSkills({
          state: {
            ...TEST_FARM,
            inventory: { ...TEST_FARM.inventory, Gem: new Decimal(100) },
            bumpkin: {
              ...INITIAL_BUMPKIN,
              experience: LEVEL_EXPERIENCE[3],
              skills: { "Green Thumb": 1 },
              freeSkillPoints: 50,
              lastFreeSkillPointsRegenAt: dateNow,
              skillLastChangedAt: { "Green Thumb": oneDayAgo },
            },
          },
          action: {
            type: "skills.updated",
            skills: {},
          },
          createdAt: dateNow,
        }),
      ).toThrow("on cooldown");
    });

    it("allows the transition once the 7-day window has elapsed", () => {
      const eightDaysAgo = dateNow - 8 * DAY;
      const result = updateSkills({
        state: {
          ...TEST_FARM,
          inventory: { ...TEST_FARM.inventory, Gem: new Decimal(100) },
          bumpkin: {
            ...INITIAL_BUMPKIN,
            experience: LEVEL_EXPERIENCE[3],
            skills: {},
            freeSkillPoints: 50,
            lastFreeSkillPointsRegenAt: dateNow,
            skillLastChangedAt: { "Green Thumb": eightDaysAgo },
          },
        },
        action: {
          type: "skills.updated",
          skills: { "Green Thumb": 1 },
        },
        createdAt: dateNow,
      });

      expect(result.bumpkin?.skills).toEqual({ "Green Thumb": 1 });
      expect(result.bumpkin?.skillLastChangedAt?.["Green Thumb"]).toEqual(
        dateNow,
      );
    });

    it("prunes expired entries so the map stays bounded", () => {
      const eightDaysAgo = dateNow - 8 * DAY;
      const result = updateSkills({
        state: {
          ...TEST_FARM,
          inventory: { ...TEST_FARM.inventory, Gem: new Decimal(100) },
          bumpkin: {
            ...INITIAL_BUMPKIN,
            experience: LEVEL_EXPERIENCE[3],
            skills: { "Green Thumb": 1 },
            freeSkillPoints: 50,
            lastFreeSkillPointsRegenAt: dateNow,
            skillLastChangedAt: {
              "Old Farmer": eightDaysAgo,
              "Green Thumb": eightDaysAgo,
            },
          },
        },
        action: {
          type: "skills.updated",
          skills: { "Young Farmer": 1 },
        },
        createdAt: dateNow,
      });

      expect(
        result.bumpkin?.skillLastChangedAt?.["Old Farmer"],
      ).toBeUndefined();
      expect(result.bumpkin?.skillLastChangedAt?.["Green Thumb"]).toEqual(
        dateNow,
      );
      expect(result.bumpkin?.skillLastChangedAt?.["Young Farmer"]).toEqual(
        dateNow,
      );
    });
  });

  it("throws when the cohort lacks EDIT_SKILLSET access", () => {
    const previousNetwork = CONFIG.NETWORK;
    CONFIG.NETWORK = "mainnet";
    try {
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
            skills: { "Young Farmer": 1 },
          },
          createdAt: dateNow,
        }),
      ).toThrow("skills.updated requires the EDIT_SKILLSET feature flag");
    } finally {
      CONFIG.NETWORK = previousNetwork;
    }
  });
});
