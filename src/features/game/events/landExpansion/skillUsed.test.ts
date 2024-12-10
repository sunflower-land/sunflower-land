import { INITIAL_FARM } from "features/game/lib/constants";
import { skillUse } from "./skillUsed";

describe("skillUse", () => {
  const dateNow = Date.now();

  it("requires Bumpkin to have a skill", () => {
    expect(() => {
      skillUse({
        state: {
          ...INITIAL_FARM,
          bumpkin: {
            ...INITIAL_FARM.bumpkin,
            skills: {},
          },
        },
        action: { type: "skill.used", skill: "Green Thumb" },
        createdAt: dateNow,
      });
    }).toThrow("You do not have this skill");
  });

  it("requires the skill to be a power", () => {
    expect(() => {
      skillUse({
        state: {
          ...INITIAL_FARM,
          bumpkin: {
            ...INITIAL_FARM.bumpkin,
            skills: { "Green Thumb": 1 },
          },
        },
        action: { type: "skill.used", skill: "Green Thumb" },
        createdAt: dateNow,
      });
    }).toThrow("This skill does not have a power");
  });

  it("requires the skill to be off cooldown", () => {
    expect(() => {
      skillUse({
        state: {
          ...INITIAL_FARM,
          bumpkin: {
            ...INITIAL_FARM.bumpkin,
            skills: { "Instant Growth": 1 },
            previousPowerUseAt: { "Instant Growth": dateNow },
          },
        },
        action: { type: "skill.used", skill: "Instant Growth" },
        createdAt: dateNow,
      });
    }).toThrow("This skill is still under cooldown");
  });

  it("adds the power.useAt to the bumpkin", () => {
    const result = skillUse({
      state: {
        ...INITIAL_FARM,
        bumpkin: {
          ...INITIAL_FARM.bumpkin,
          skills: { "Instant Growth": 1 },
        },
      },
      action: { type: "skill.used", skill: "Instant Growth" },
      createdAt: dateNow,
    });

    expect(result.bumpkin?.previousPowerUseAt).toEqual({
      "Instant Growth": dateNow,
    });
  });

  describe("useInstantGrowth", () => {
    it("activates Instant Growth", () => {
      const state = skillUse({
        state: {
          ...INITIAL_FARM,
          bumpkin: {
            ...INITIAL_FARM.bumpkin,
            skills: { "Instant Growth": 1 },
          },
          crops: {
            "123": {
              crop: {
                id: "456",
                name: "Kale",
                plantedAt: Date.now(),
                amount: 20,
              },
              createdAt: Date.now(),
              x: 1,
              y: 1,
              height: 1,
              width: 1,
            },
            "789": {
              crop: {
                id: "147",
                name: "Kale",
                plantedAt: Date.now(),
                amount: 20,
              },
              createdAt: Date.now(),
              x: 1,
              y: 1,
              height: 1,
              width: 1,
            },
          },
        },
        action: {
          type: "skill.used",
          skill: "Instant Growth",
        },
        createdAt: Date.now(),
      });

      expect(state.crops["123"].crop?.plantedAt).toEqual(1);
      expect(state.crops["789"].crop?.plantedAt).toEqual(1);
    });

    it("doesn't activate Instant Growth if they have a different skill", () => {
      const state = skillUse({
        state: {
          ...INITIAL_FARM,
          bumpkin: {
            ...INITIAL_FARM.bumpkin,
            skills: { "Instant Gratification": 1 },
          },
          crops: {
            "123": {
              crop: {
                id: "456",
                name: "Kale",
                plantedAt: Date.now(),
                amount: 20,
              },
              createdAt: Date.now(),
              x: 1,
              y: 1,
              height: 1,
              width: 1,
            },
            "789": {
              crop: {
                id: "147",
                name: "Kale",
                plantedAt: Date.now(),
                amount: 20,
              },
              createdAt: Date.now(),
              x: 1,
              y: 1,
              height: 1,
              width: 1,
            },
          },
        },
        action: {
          type: "skill.used",
          skill: "Instant Gratification",
        },
        createdAt: Date.now(),
      });

      expect(state.crops["123"].crop?.plantedAt).toEqual(Date.now());
      expect(state.crops["789"].crop?.plantedAt).toEqual(Date.now());
    });
  });

  describe("useTreeBlitz", () => {
    it("activates Tree Blitz", () => {
      const state = skillUse({
        state: {
          ...INITIAL_FARM,
          bumpkin: {
            ...INITIAL_FARM.bumpkin,
            skills: { "Tree Blitz": 1 },
          },
          trees: {
            "123": {
              wood: {
                amount: 1,
                choppedAt: Date.now(),
              },
              x: 1,
              y: 1,
              height: 2,
              width: 2,
              createdAt: Date.now(),
            },
            "456": {
              wood: {
                amount: 1,
                choppedAt: Date.now(),
              },
              x: 3,
              y: 1,
              height: 2,
              width: 2,
              createdAt: Date.now(),
            },
          },
        },
        action: { type: "skill.used", skill: "Tree Blitz" },
        createdAt: Date.now(),
      });

      expect(state.trees["123"].wood.choppedAt).toEqual(1);
      expect(state.trees["456"].wood.choppedAt).toEqual(1);
    });
    it("does not activate Tree Blitz when they have a different skill", () => {
      const state = skillUse({
        state: {
          ...INITIAL_FARM,
          bumpkin: {
            ...INITIAL_FARM.bumpkin,
            skills: { "Instant Growth": 1 },
          },
          trees: {
            "123": {
              wood: {
                amount: 1,
                choppedAt: Date.now(),
              },
              x: 1,
              y: 1,
              height: 2,
              width: 2,
              createdAt: Date.now(),
            },
            "456": {
              wood: {
                amount: 1,
                choppedAt: Date.now(),
              },
              x: 3,
              y: 1,
              height: 2,
              width: 2,
              createdAt: Date.now(),
            },
          },
        },
        action: { type: "skill.used", skill: "Instant Growth" },
        createdAt: Date.now(),
      });

      expect(state.trees["123"].wood.choppedAt).toEqual(Date.now());
      expect(state.trees["456"].wood.choppedAt).toEqual(Date.now());
    });
  });

  describe.only("useGreenhouseGuru", () => {
    it("activates Greenhouse Guru", () => {
      const state = skillUse({
        state: {
          ...INITIAL_FARM,
          bumpkin: {
            ...INITIAL_FARM.bumpkin,
            skills: { "Greenhouse Guru": 1 },
          },
          greenhouse: {
            oil: 76,
            pots: {
              "1": {
                plant: {
                  amount: 1,
                  name: "Olive",
                  plantedAt: 1733803854974,
                },
              },
              "2": {
                plant: {
                  amount: 1,
                  name: "Olive",
                  plantedAt: 1733803856819,
                },
              },
              "3": {
                plant: {
                  amount: 1,
                  name: "Olive",
                  plantedAt: 1733803855784,
                },
              },
              "4": {
                plant: {
                  amount: 1,
                  name: "Olive",
                  plantedAt: 1733803857337,
                },
              },
            },
          },
        },
        action: { type: "skill.used", skill: "Greenhouse Guru" },
        createdAt: Date.now(),
      });

      expect(state.greenhouse.pots[1].plant?.plantedAt).toEqual(1);
    });
  });

  describe("usePetalBlessed", () => {
    it("activates Petal Blessed", () => {
      const state = skillUse({
        state: {
          ...INITIAL_FARM,
          bumpkin: {
            ...INITIAL_FARM.bumpkin,
            skills: { "Petal Blessed": 1 },
          },
          flowers: {
            flowerBeds: {
              "123": {
                x: 1,
                width: 3,
                createdAt: 1715650356584,
                y: -10,
                height: 1,
                flower: {
                  plantedAt: 1733412398960,
                  amount: 2,
                  name: "Yellow Carnation",
                },
              },
              "456": {
                x: 1,
                width: 3,
                createdAt: 1715650403667,
                y: -9,
                height: 1,
                flower: {
                  plantedAt: 1733412401734,
                  amount: 4,
                  name: "Yellow Carnation",
                },
              },
              "789": {
                x: 1,
                width: 3,
                createdAt: 1715649513672,
                y: -11,
                height: 1,
                flower: {
                  plantedAt: 1733412395200,
                  amount: 1,
                  name: "Yellow Carnation",
                },
              },
            },
            discovered: {},
          },
        },
        action: { type: "skill.used", skill: "Petal Blessed" },
        createdAt: Date.now(),
      });

      expect(state.flowers.flowerBeds["123"].flower?.plantedAt).toEqual(1);
      expect(state.flowers.flowerBeds["456"].flower?.plantedAt).toEqual(1);
      expect(state.flowers.flowerBeds["789"].flower?.plantedAt).toEqual(1);
    });
  });
  describe("useGreaseLightning", () => {
    it("activates Grease Lightning", () => {
      const state = skillUse({
        state: {
          ...INITIAL_FARM,
          bumpkin: {
            ...INITIAL_FARM.bumpkin,
            skills: { "Grease Lightning": 1 },
          },
          oilReserves: {
            "123": {
              createdAt: 1718896710652,
              oil: {
                drilledAt: 1733773070581,
                amount: 22.1,
              },
              width: 2,
              x: 10,
              y: -1,
              drilled: 147,
              height: 2,
            },
            "456": {
              createdAt: 1715647670891,
              oil: {
                drilledAt: 1733773070329,
                amount: 22.1,
              },
              width: 2,
              x: 8,
              y: -1,
              drilled: 189,
              height: 2,
            },
            "789": {
              createdAt: 1716767207652,
              oil: {
                drilledAt: 1733773071663,
                amount: 22.1,
              },
              width: 2,
              x: 6,
              y: -1,
              drilled: 174,
              height: 2,
            },
          },
        },
        action: { type: "skill.used", skill: "Grease Lightning" },
        createdAt: Date.now(),
      });

      expect(state.oilReserves["123"].oil.drilledAt).toEqual(1);
      expect(state.oilReserves["456"].oil.drilledAt).toEqual(1);
      expect(state.oilReserves["789"].oil.drilledAt).toEqual(1);
    });
  });
});
