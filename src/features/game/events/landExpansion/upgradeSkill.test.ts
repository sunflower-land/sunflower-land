import Decimal from "decimal.js-light";
import { TEST_FARM, INITIAL_BUMPKIN } from "features/game/lib/constants";
import { LEVEL_EXPERIENCE } from "features/game/lib/level";
import { CONFIG } from "lib/config";
import { upgradeSkill } from "./upgradeSkill";
import { getAvailableBumpkinSkillPoints } from "./choseSkill";

describe("upgradeSkill", () => {
  const dateNow = Date.now();

  // Rank-ups are gated behind same-tree progression (getUnlockedTierForTree),
  // which sums each owned skill's base skill points regardless of its rank.
  // Owning these Crops skills invests enough base points to unlock the tree to
  // Tier 2 / Tier 3, satisfying the gate for the skill under test.
  const CROPS_TIER_2 = { "Young Farmer": 1, "Experienced Farmer": 1 }; // 2 base pts
  const CROPS_TIER_3 = {
    "Young Farmer": 1,
    "Experienced Farmer": 1,
    "Old Farmer": 1,
    "Chonky Scarecrow": 1,
    "Betty's Friend": 1,
    "Strong Roots": 1,
  }; // 7 base pts (5 tier-1 + Strong Roots tier-2)

  it("upgrades a tier 1 skill, spending 1 shard and 1 skill point", () => {
    const result = upgradeSkill({
      state: {
        ...TEST_FARM,
        inventory: {
          ...TEST_FARM.inventory,
          "Ascension Shard": new Decimal(5),
        },
        bumpkin: {
          ...INITIAL_BUMPKIN,
          experience: LEVEL_EXPERIENCE[10],
          // Green Thumb (Tier 1) -> Rank 2 needs Crops Tier 2 unlocked.
          skills: { "Green Thumb": 1, ...CROPS_TIER_2 },
        },
      },
      action: { type: "skill.upgraded", skill: "Green Thumb" },
      createdAt: dateNow,
    });

    expect(result.bumpkin?.skills["Green Thumb"]).toEqual(2);
    expect(result.inventory["Ascension Shard"]).toEqual(new Decimal(4));
  });

  it("spends a tier-scaled cost for a tier 2 skill (2 shards, 3 skill points)", () => {
    const state = {
      ...TEST_FARM,
      inventory: {
        ...TEST_FARM.inventory,
        "Ascension Shard": new Decimal(5),
      },
      bumpkin: {
        ...INITIAL_BUMPKIN,
        experience: LEVEL_EXPERIENCE[15],
        // Strong Roots (Tier 2) -> Rank 2 needs Crops Tier 3 unlocked.
        skills: { ...CROPS_TIER_3 },
      },
    };
    const before = getAvailableBumpkinSkillPoints(state);

    const result = upgradeSkill({
      state,
      action: { type: "skill.upgraded", skill: "Strong Roots" },
      createdAt: dateNow,
    });

    expect(result.bumpkin?.skills["Strong Roots"]).toEqual(2);
    expect(result.inventory["Ascension Shard"]).toEqual(new Decimal(3));
    // Tier 2 rank-up costs 3 skill points.
    expect(getAvailableBumpkinSkillPoints(result)).toEqual(before - 3);
  });

  it("spends a tier-scaled cost for a tier 3 skill (3 shards, 6 skill points)", () => {
    const state = {
      ...TEST_FARM,
      inventory: {
        ...TEST_FARM.inventory,
        "Ascension Shard": new Decimal(5),
      },
      bumpkin: {
        ...INITIAL_BUMPKIN,
        experience: LEVEL_EXPERIENCE[20],
        // Acre Farm (Tier 3) needs Crops Tier 3 unlocked for any rank-up.
        skills: { ...CROPS_TIER_3, "Acre Farm": 1 },
      },
    };
    const before = getAvailableBumpkinSkillPoints(state);

    const result = upgradeSkill({
      state,
      action: { type: "skill.upgraded", skill: "Acre Farm" },
      createdAt: dateNow,
    });

    expect(result.bumpkin?.skills["Acre Farm"]).toEqual(2);
    expect(result.inventory["Ascension Shard"]).toEqual(new Decimal(2));
    // Tier 3 rank-up costs 6 skill points.
    expect(getAvailableBumpkinSkillPoints(result)).toEqual(before - 6);
  });

  it("upgrades a rank 2 skill to rank 3 and keeps point accounting aligned", () => {
    const state = {
      ...TEST_FARM,
      inventory: {
        ...TEST_FARM.inventory,
        "Ascension Shard": new Decimal(5),
      },
      bumpkin: {
        ...INITIAL_BUMPKIN,
        experience: LEVEL_EXPERIENCE[15],
        // Green Thumb (Tier 1) -> Rank 3 needs Crops Tier 3 unlocked.
        skills: { ...CROPS_TIER_3, "Green Thumb": 2 },
      },
    };
    const before = getAvailableBumpkinSkillPoints(state);

    const result = upgradeSkill({
      state,
      action: { type: "skill.upgraded", skill: "Green Thumb" },
      createdAt: dateNow,
    });

    expect(result.bumpkin?.skills["Green Thumb"]).toEqual(3);
    expect(result.inventory["Ascension Shard"]).toEqual(new Decimal(4));
    // Tier 1 rank-up costs 1 skill point; available drops by exactly that.
    expect(getAvailableBumpkinSkillPoints(result)).toEqual(before - 1);
  });

  it("throws when the tree tier is not unlocked", () => {
    expect(() =>
      upgradeSkill({
        state: {
          ...TEST_FARM,
          inventory: {
            ...TEST_FARM.inventory,
            "Ascension Shard": new Decimal(5),
          },
          bumpkin: {
            ...INITIAL_BUMPKIN,
            experience: LEVEL_EXPERIENCE[10],
            // Only Green Thumb owned -> Crops still at Tier 1, but Rank 2 needs
            // Tier 2 unlocked.
            skills: { "Green Thumb": 1 },
          },
        },
        action: { type: "skill.upgraded", skill: "Green Thumb" },
        createdAt: dateNow,
      }),
    ).toThrow("You need to unlock tier 2 first");
  });

  it("throws when the player does not own the skill", () => {
    expect(() =>
      upgradeSkill({
        state: {
          ...TEST_FARM,
          inventory: {
            ...TEST_FARM.inventory,
            "Ascension Shard": new Decimal(5),
          },
          bumpkin: {
            ...INITIAL_BUMPKIN,
            experience: LEVEL_EXPERIENCE[5],
            skills: {},
          },
        },
        action: { type: "skill.upgraded", skill: "Green Thumb" },
        createdAt: dateNow,
      }),
    ).toThrow("You do not own this skill");
  });

  it("throws when the skill is already at max level", () => {
    expect(() =>
      upgradeSkill({
        state: {
          ...TEST_FARM,
          inventory: {
            ...TEST_FARM.inventory,
            "Ascension Shard": new Decimal(5),
          },
          bumpkin: {
            ...INITIAL_BUMPKIN,
            experience: LEVEL_EXPERIENCE[9],
            skills: { "Green Thumb": 3 },
          },
        },
        action: { type: "skill.upgraded", skill: "Green Thumb" },
        createdAt: dateNow,
      }),
    ).toThrow("Skill is already at max level");
  });

  it("throws when there are not enough Ascension Shards", () => {
    expect(() =>
      upgradeSkill({
        state: {
          ...TEST_FARM,
          inventory: {
            ...TEST_FARM.inventory,
            "Ascension Shard": new Decimal(0),
          },
          bumpkin: {
            ...INITIAL_BUMPKIN,
            experience: LEVEL_EXPERIENCE[10],
            // Tier 2 unlocked so the gate passes and we reach the shard check.
            skills: { "Green Thumb": 1, ...CROPS_TIER_2 },
          },
        },
        action: { type: "skill.upgraded", skill: "Green Thumb" },
        createdAt: dateNow,
      }),
    ).toThrow("You do not have enough Ascension Shards");
  });

  it("throws when there are not enough skill points", () => {
    expect(() =>
      upgradeSkill({
        state: {
          ...TEST_FARM,
          inventory: {
            ...TEST_FARM.inventory,
            "Ascension Shard": new Decimal(5),
          },
          bumpkin: {
            ...INITIAL_BUMPKIN,
            // Tier 2 unlocked (3 base points), but level 3 grants 3 points and
            // owning those skills spends them all -> nothing left for the rank-up.
            experience: LEVEL_EXPERIENCE[3],
            skills: { "Green Thumb": 1, ...CROPS_TIER_2 },
          },
        },
        action: { type: "skill.upgraded", skill: "Green Thumb" },
        createdAt: dateNow,
      }),
    ).toThrow("You do not have enough skill points");
  });

  it("throws when the skill cannot be upgraded", () => {
    expect(() =>
      upgradeSkill({
        state: {
          ...TEST_FARM,
          inventory: {
            ...TEST_FARM.inventory,
            "Ascension Shard": new Decimal(5),
          },
          bumpkin: {
            ...INITIAL_BUMPKIN,
            experience: LEVEL_EXPERIENCE[5],
            skills: { "Tap Prospector": 1 },
          },
        },
        action: { type: "skill.upgraded", skill: "Tap Prospector" },
        createdAt: dateNow,
      }),
    ).toThrow("This skill cannot be upgraded");
  });

  describe("when ASCENSION_SKILLS is off (mainnet)", () => {
    // The flag is on by default in tests (amoy), so force mainnet to exercise
    // the flag-off path.
    let previousNetwork: (typeof CONFIG)["NETWORK"];
    beforeEach(() => {
      previousNetwork = CONFIG.NETWORK;
      CONFIG.NETWORK = "mainnet";
    });
    afterEach(() => {
      CONFIG.NETWORK = previousNetwork;
    });

    it("throws because skill upgrades are not available", () => {
      expect(() =>
        upgradeSkill({
          state: {
            ...TEST_FARM,
            inventory: {
              ...TEST_FARM.inventory,
              "Ascension Shard": new Decimal(5),
            },
            bumpkin: {
              ...INITIAL_BUMPKIN,
              experience: LEVEL_EXPERIENCE[5],
              skills: { "Green Thumb": 1 },
            },
          },
          action: { type: "skill.upgraded", skill: "Green Thumb" },
          createdAt: dateNow,
        }),
      ).toThrow("Skill upgrades are not available");
    });
  });
});
