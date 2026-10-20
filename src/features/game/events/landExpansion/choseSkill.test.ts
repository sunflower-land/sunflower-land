import { TEST_FARM, INITIAL_BUMPKIN } from "features/game/lib/constants";
import {
  LEVEL_EXPERIENCE,
  ascensionBaseline,
  levelXp,
} from "features/game/lib/level";
import Decimal from "decimal.js-light";
import { CONFIG } from "lib/config";
import type { GameState } from "features/game/types/game";
import { BUMPKIN_REVAMP_SKILL_TREE } from "features/game/types/bumpkinSkills";
import {
  choseSkill,
  getAvailableBumpkinSkillPoints,
  SKILL_POINTS_PER_TIER,
} from "./choseSkill";

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

  describe("Pig skills", () => {
    // 4 tier-1 + 2 tier-2 Animals skills = 8 points, unlocking Animals tier 3.
    const ANIMALS_TIER_3 = {
      "Efficient Feeding": 1,
      "Restless Animals": 1,
      "Fine Fibers": 1,
      "Bountiful Bounties": 1,
      "Abundant Harvest": 1,
      "Heartwarming Instruments": 1,
    };

    const pigFarm = (overrides: Partial<GameState> = {}): GameState => ({
      ...TEST_FARM,
      island: { ...TEST_FARM.island, type: "spring" },
      bumpkin: {
        ...INITIAL_BUMPKIN,
        experience: LEVEL_EXPERIENCE[30],
        skills: ANIMALS_TIER_3,
      },
      ...overrides,
    });

    const choose = (
      skill: "Swill Savvy" | "Truffle Yield" | "Bristle Payout",
      state = pigFarm(),
    ) =>
      choseSkill({
        state,
        action: { type: "skill.chosen", skill },
        createdAt: dateNow,
      });

    // jest runs on amoy, so the testnet-only Pig skills are available.
    it.each(["Swill Savvy", "Truffle Yield", "Bristle Payout"] as const)(
      "claims %s on testnet",
      (skill) => {
        expect(choose(skill).bumpkin.skills[skill]).toEqual(1);
      },
    );

    describe("off testnet", () => {
      let previousNetwork: (typeof CONFIG)["NETWORK"];

      beforeEach(() => {
        previousNetwork = CONFIG.NETWORK;
        (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = "mainnet";
      });

      afterEach(() => {
        (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = previousNetwork;
      });

      it.each(["Swill Savvy", "Truffle Yield", "Bristle Payout"] as const)(
        "rejects %s",
        (skill) => {
          expect(() => choose(skill)).toThrow("This skill is not available");
        },
      );

      it("accepts a Pig skill with a Beta Pass", () => {
        expect(() =>
          choose(
            "Truffle Yield",
            pigFarm({
              inventory: {
                ...TEST_FARM.inventory,
                "Beta Pass": new Decimal(1),
              },
            }),
          ),
        ).not.toThrow();
      });

      it("still lets other Animals skills be claimed", () => {
        expect(() =>
          choseSkill({
            state: pigFarm(),
            action: { type: "skill.chosen", skill: "Chonky Feed" },
            createdAt: dateNow,
          }),
        ).not.toThrow();
      });
    });
  });

  describe("Cave skills", () => {
    const caveFarm = (
      skills: GameState["bumpkin"]["skills"] = {},
      island: GameState["island"]["type"] = "spring",
    ): GameState => ({
      ...TEST_FARM,
      island: { ...TEST_FARM.island, type: island },
      bumpkin: {
        ...INITIAL_BUMPKIN,
        experience: LEVEL_EXPERIENCE[30],
        skills,
      },
    });

    const choose = (
      skill: "Lean Compost" | "Fungal Harvest" | "Rare Breeds",
      state: GameState,
    ) =>
      choseSkill({
        state,
        action: { type: "skill.chosen", skill },
        createdAt: dateNow,
      });

    it("claims a tier 1 Cave skill on Spring island", () => {
      expect(
        choose("Lean Compost", caveFarm()).bumpkin.skills["Lean Compost"],
      ).toEqual(1);
    });

    it("is locked before Spring island", () => {
      expect(() => choose("Lean Compost", caveFarm({}, "basic"))).toThrow(
        "You are not at the correct island!",
      );
    });

    it("needs 3 Cave points spent for tier 2", () => {
      const twoPoints = { "Lean Compost": 1, "Rapid Mycelium": 1 };
      expect(() => choose("Fungal Harvest", caveFarm(twoPoints))).toThrow(
        "You need to unlock tier 2 first",
      );

      const threePoints = { ...twoPoints, "Mushroom Bloom": 1 };
      expect(
        choose("Fungal Harvest", caveFarm(threePoints)).bumpkin.skills[
          "Fungal Harvest"
        ],
      ).toEqual(1);
    });

    it("needs 6 Cave points spent for tier 3", () => {
      // All 5 tier-1 skills = 5 points: tier 1 alone never unlocks tier 3.
      const allTierOne = {
        "Lean Compost": 1,
        "Rapid Mycelium": 1,
        "Mushroom Bloom": 1,
        "Muddy Bounty": 1,
        "Sturdy Shovel": 1,
      };
      expect(() => choose("Rare Breeds", caveFarm(allTierOne))).toThrow(
        "You need to unlock tier 3 first",
      );

      // 4 tier-1 skills + 1 tier-2 skill = 6 points.
      const sixPoints = {
        "Lean Compost": 1,
        "Rapid Mycelium": 1,
        "Mushroom Bloom": 1,
        "Muddy Bounty": 1,
        "Fungal Harvest": 1,
      };
      expect(
        choose("Rare Breeds", caveFarm(sixPoints)).bumpkin.skills[
          "Rare Breeds"
        ],
      ).toEqual(1);
    });

    describe("off testnet", () => {
      let previousNetwork: (typeof CONFIG)["NETWORK"];

      beforeEach(() => {
        previousNetwork = CONFIG.NETWORK;
        (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = "mainnet";
      });

      afterEach(() => {
        (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = previousNetwork;
      });

      it("rejects every Cave skill", () => {
        expect(() => choose("Lean Compost", caveFarm())).toThrow(
          "This skill is not available",
        );
      });
    });
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
          // Green Thumb (tier 1) at rank 3: base 1 + upgrades 1 * 2 = 3 used.
          skills: { "Green Thumb": 3 },
        },
      });

      // Level 10 earns 10 points; 3 spent => 7 available.
      expect(result).toBe(7);
    });
  });

  describe("SKILL_POINTS_PER_TIER", () => {
    it("derives tier thresholds from each tree's tier 1 skills", () => {
      expect(SKILL_POINTS_PER_TIER.Crops).toEqual({ 1: 0, 2: 3, 3: 7 });
      expect(SKILL_POINTS_PER_TIER["Fruit Patch"]).toEqual({
        1: 0,
        2: 3,
        3: 6,
      });
      expect(SKILL_POINTS_PER_TIER.Greenhouse).toEqual({ 1: 0, 2: 2, 3: 5 });
      expect(SKILL_POINTS_PER_TIER.Animals).toEqual({ 1: 0, 2: 4, 3: 8 });
      expect(SKILL_POINTS_PER_TIER.Cave).toEqual({ 1: 0, 2: 3, 3: 6 });
    });

    it("never lets tier 1 skills alone unlock tier 3", () => {
      Object.entries(SKILL_POINTS_PER_TIER).forEach(([tree, tiers]) => {
        const tierOnePoints = Object.values(BUMPKIN_REVAMP_SKILL_TREE)
          .filter(
            (skill) => skill.tree === tree && skill.requirements.tier === 1,
          )
          .reduce((acc, skill) => acc + skill.requirements.points, 0);

        expect(tiers[3]).toBeGreaterThan(tierOnePoints);
      });
    });

    it("keeps a legacy tier 3 skill but locks new ones until the threshold is met", () => {
      // All 5 Fruit Patch tier 1 skills = 5 points, below the tier 3 threshold
      // of 6, while still owning a tier 3 skill picked under the old threshold.
      const legacySkills = {
        "Fruitful Fumble": 1,
        "Fruity Heaven": 1,
        "Fruity Profit": 1,
        "Loyal Macaw": 1,
        "No Axe No Worries": 1,
        "Generous Orchard": 1,
      };
      const farm = (skills: GameState["bumpkin"]["skills"]): GameState => ({
        ...TEST_FARM,
        island: { ...TEST_FARM.island, type: "spring" },
        bumpkin: {
          ...INITIAL_BUMPKIN,
          experience: LEVEL_EXPERIENCE[30],
          skills,
        },
      });

      expect(() =>
        choseSkill({
          state: farm(legacySkills),
          action: { type: "skill.chosen", skill: "Long Pickings" },
          createdAt: dateNow,
        }),
      ).toThrow("You need to unlock tier 3 first");

      const result = choseSkill({
        state: farm({ ...legacySkills, Catchup: 1 }),
        action: { type: "skill.chosen", skill: "Long Pickings" },
        createdAt: dateNow,
      });

      expect(result.bumpkin.skills["Generous Orchard"]).toEqual(1);
      expect(result.bumpkin.skills["Long Pickings"]).toEqual(1);
    });
  });
});
