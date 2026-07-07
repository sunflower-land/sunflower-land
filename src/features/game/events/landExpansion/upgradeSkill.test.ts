import Decimal from "decimal.js-light";
import { TEST_FARM, INITIAL_BUMPKIN } from "features/game/lib/constants";
import { LEVEL_EXPERIENCE } from "features/game/lib/level";
import { CONFIG } from "lib/config";
import { upgradeSkill } from "./upgradeSkill";
import { getAvailableBumpkinSkillPoints } from "./choseSkill";

describe("upgradeSkill", () => {
  const dateNow = Date.now();

  it("upgrades a tier 1 skill, spending 1 shard and 3 skill points", () => {
    const result = upgradeSkill({
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
    });

    expect(result.bumpkin?.skills["Green Thumb"]).toEqual(2);
    expect(result.inventory["Ascension Shard"]).toEqual(new Decimal(4));
  });

  it("spends a tier-scaled cost for a tier 2 skill (2 shards)", () => {
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
          skills: { "Strong Roots": 1 },
        },
      },
      action: { type: "skill.upgraded", skill: "Strong Roots" },
      createdAt: dateNow,
    });

    expect(result.bumpkin?.skills["Strong Roots"]).toEqual(2);
    expect(result.inventory["Ascension Shard"]).toEqual(new Decimal(3));
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
        skills: { "Green Thumb": 2 },
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
    // Tier 1 rank-up costs 3 skill points; available drops by exactly that.
    expect(getAvailableBumpkinSkillPoints(result)).toEqual(before - 3);
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
            experience: LEVEL_EXPERIENCE[5],
            skills: { "Green Thumb": 1 },
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
            // Level 1 grants 1 point; owning Green Thumb spends it all.
            experience: LEVEL_EXPERIENCE[1],
            skills: { "Green Thumb": 1 },
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
            skills: { "Fruitful Fumble": 1 },
          },
        },
        action: { type: "skill.upgraded", skill: "Fruitful Fumble" },
        createdAt: dateNow,
      }),
    ).toThrow("This skill cannot be upgraded");
  });

  describe("when SWAMP_ASCENSION is off (mainnet)", () => {
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
