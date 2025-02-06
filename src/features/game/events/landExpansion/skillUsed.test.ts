import { INITIAL_FARM } from "features/game/lib/constants";
import { skillUse } from "./skillUsed";
import { CROPS } from "features/game/types/crops";

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
    }).toThrow("Power Skill on Cooldown");
  });

  it("adds the power.useAt to the bumpkin", () => {
    const result = skillUse({
      state: {
        ...INITIAL_FARM,
        bumpkin: {
          ...INITIAL_FARM.bumpkin,
          skills: { "Instant Growth": 1 },
        },
        crops: {
          1: {
            crop: {
              id: "123",
              name: "Wheat",
              plantedAt: dateNow,
              amount: 20,
            },
            createdAt: dateNow,
            x: 1,
            y: 1,
            height: 1,
            width: 1,
          },
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
    it("throws error if no plots are available", () => {
      expect(() =>
        skillUse({
          state: {
            ...INITIAL_FARM,
            bumpkin: {
              ...INITIAL_FARM.bumpkin,
              skills: { "Instant Growth": 1 },
            },
          },
          action: { type: "skill.used", skill: "Instant Growth" },
          createdAt: dateNow,
        }),
      ).toThrow("You don't have any plots to grow crops on");
    });

    it("requires all plots are growing to use Instant Growth", () => {
      expect(() =>
        skillUse({
          state: {
            ...INITIAL_FARM,
            bumpkin: {
              ...INITIAL_FARM.bumpkin,
              skills: { "Instant Growth": 1 },
            },
            crops: {
              "0": {
                createdAt: dateNow,
                x: 0,
                y: 0,
                height: 1,
                width: 1,
              },
              "1": {
                createdAt: dateNow,
                x: 1,
                y: 1,
                height: 1,
                width: 1,
                crop: {
                  id: "123",
                  name: "Wheat",
                  plantedAt: dateNow - CROPS["Wheat"].harvestSeconds * 1000,
                  amount: 20,
                },
              },
            },
          },
          action: { type: "skill.used", skill: "Instant Growth" },
          createdAt: dateNow,
        }),
      ).toThrow("No crops are growing");
    });

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
                plantedAt: dateNow,
                amount: 20,
              },
              createdAt: dateNow,
              x: 1,
              y: 1,
              height: 1,
              width: 1,
            },
            "789": {
              crop: {
                id: "147",
                name: "Kale",
                plantedAt: dateNow,
                amount: 20,
              },
              createdAt: dateNow,
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
        createdAt: dateNow,
      });

      expect(state.crops["123"].crop?.plantedAt).toEqual(1);
      expect(state.crops["789"].crop?.plantedAt).toEqual(1);
    });

    it("doesn't activate Instant Growth if they have a different skill", () => {
      expect(() =>
        skillUse({
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
                  plantedAt: dateNow,
                  amount: 20,
                },
                createdAt: dateNow,
                x: 1,
                y: 1,
                height: 1,
                width: 1,
              },
              "789": {
                crop: {
                  id: "147",
                  name: "Kale",
                  plantedAt: dateNow,
                  amount: 20,
                },
                createdAt: dateNow,
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
          createdAt: dateNow,
        }),
      ).toThrow("You do not have this skill");
    });
  });

  describe("useTreeBlitz", () => {
    it("requires all trees to be recovering to use Tree Blitz", () => {
      expect(() =>
        skillUse({
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
                  choppedAt: 0,
                },
                x: 1,
                y: 1,
                height: 2,
                width: 2,
                createdAt: 0,
              },
            },
          },
          action: { type: "skill.used", skill: "Tree Blitz" },
          createdAt: dateNow,
        }),
      ).toThrow("No trees are recovering");
    });

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
                choppedAt: dateNow,
              },
              x: 1,
              y: 1,
              height: 2,
              width: 2,
              createdAt: dateNow,
            },
            "456": {
              wood: {
                amount: 1,
                choppedAt: dateNow,
              },
              x: 3,
              y: 1,
              height: 2,
              width: 2,
              createdAt: dateNow,
            },
          },
        },
        action: { type: "skill.used", skill: "Tree Blitz" },
        createdAt: dateNow,
      });

      expect(state.trees["123"].wood.choppedAt).toEqual(1);
      expect(state.trees["456"].wood.choppedAt).toEqual(1);
    });
    it("does not activate Tree Blitz when they have a different skill", () => {
      expect(() =>
        skillUse({
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
                  choppedAt: dateNow,
                },
                x: 1,
                y: 1,
                height: 2,
                width: 2,
                createdAt: dateNow,
              },
              "456": {
                wood: {
                  amount: 1,
                  choppedAt: dateNow,
                },
                x: 3,
                y: 1,
                height: 2,
                width: 2,
                createdAt: dateNow,
              },
            },
          },
          action: { type: "skill.used", skill: "Tree Blitz" },
          createdAt: dateNow,
        }),
      ).toThrow("You do not have this skill");
    });
  });

  describe("useGreenhouseGuru", () => {
    it("throws an error if pots are empty", () => {
      expect(() =>
        skillUse({
          state: {
            ...INITIAL_FARM,
            bumpkin: {
              ...INITIAL_FARM.bumpkin,
              skills: { "Greenhouse Guru": 1 },
            },
          },
          action: { type: "skill.used", skill: "Greenhouse Guru" },
          createdAt: dateNow,
        }),
      ).toThrow("No greenhouse produce is growing");
    });

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
        createdAt: dateNow,
      });

      expect(state.greenhouse.pots[1].plant?.plantedAt).toEqual(1);
    });
  });

  describe("usePetalBlessed", () => {
    it("throws an error when flower beds are empty", () => {
      expect(() =>
        skillUse({
          state: {
            ...INITIAL_FARM,
            bumpkin: {
              ...INITIAL_FARM.bumpkin,
              skills: { "Petal Blessed": 1 },
            },
            flowers: {
              discovered: {},
              flowerBeds: {},
            },
          },
          action: { type: "skill.used", skill: "Petal Blessed" },
          createdAt: dateNow,
        }),
      ).toThrow("No flowers are growing in flower beds");
    });

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
        createdAt: dateNow,
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
                drilledAt: dateNow - 1000 * 60,
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
                drilledAt: dateNow - 1000 * 60,
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
        createdAt: dateNow,
      });

      expect(state.oilReserves["123"].oil.drilledAt).toEqual(1);
      expect(state.oilReserves["456"].oil.drilledAt).toEqual(1);
      expect(state.oilReserves["789"].oil.drilledAt).toEqual(1);
    });
  });

  describe("useInstantGratification", () => {
    it("throws an error if all cooking buildings are not cooking", () => {
      expect(() =>
        skillUse({
          state: {
            ...INITIAL_FARM,
            bumpkin: {
              ...INITIAL_FARM.bumpkin,
              skills: { "Instant Gratification": 1 },
            },
            buildings: {
              "Fire Pit": [
                {
                  id: "123",
                  createdAt: dateNow,
                  coordinates: {
                    x: -4,
                    y: -8,
                  },
                  readyAt: 0,
                  oil: 0,
                },
              ],
              "Smoothie Shack": [
                {
                  id: "456",
                  createdAt: dateNow,
                  coordinates: {
                    x: -7,
                    y: -8,
                  },
                  readyAt: 0,
                  oil: 0,
                },
              ],
            },
          },
          action: { type: "skill.used", skill: "Instant Gratification" },
          createdAt: dateNow,
        }),
      ).toThrow("No buildings are cooking");
    });

    it("activates Instant Gratification", () => {
      const state = skillUse({
        state: {
          ...INITIAL_FARM,
          bumpkin: {
            ...INITIAL_FARM.bumpkin,
            skills: { "Instant Gratification": 1 },
          },
          buildings: {
            "Fire Pit": [
              {
                coordinates: {
                  x: -4,
                  y: -8,
                },
                readyAt: 1718582635573,
                createdAt: 1718582635573,
                id: "2c7826e2",
                oil: 1.36458333333333,
                crafting: {
                  name: "Antipasto",
                  boost: {
                    Oil: 0.125,
                  },
                  amount: 1,
                  readyAt: 1733818134518,
                },
              },
            ],
            "Smoothie Shack": [
              {
                id: "cf3cf862",
                createdAt: 1725322118500,
                coordinates: {
                  x: -7,
                  y: -8,
                },
                readyAt: 1725322118500,
                oil: 13.25,
                crafting: {
                  name: "Grape Juice",
                  boost: {
                    Oil: 1,
                  },
                  amount: 1,
                  readyAt: 1733819691587,
                },
              },
            ],
          },
        },
        action: { type: "skill.used", skill: "Instant Gratification" },
        createdAt: dateNow,
      });
      expect(state.buildings["Fire Pit"]?.[0].crafting?.readyAt).toEqual(
        dateNow,
      );
      expect(state.buildings["Smoothie Shack"]?.[0].crafting?.readyAt).toEqual(
        dateNow,
      );
    });
  });

  describe("useBarnyardRouse", () => {
    it("doesn't activate Barnyard Rouse if the animals are not asleep", () => {
      expect(() =>
        skillUse({
          state: {
            ...INITIAL_FARM,
            bumpkin: {
              ...INITIAL_FARM.bumpkin,
              skills: { "Barnyard Rouse": 1 },
            },
            henHouse: {
              level: 1,
              animals: {
                "123": {
                  id: "123",
                  type: "Chicken",
                  state: "idle",
                  createdAt: dateNow,
                  awakeAt: dateNow - 1000 * 60 * 60 * 24,
                  experience: 120,
                  asleepAt: 0,
                  lovedAt: 0,
                  item: "Petting Hand",
                },
                "456": {
                  id: "456",
                  type: "Chicken",
                  state: "idle",
                  createdAt: dateNow,
                  awakeAt: dateNow - 1000 * 60 * 60 * 24,
                  experience: 120,
                  asleepAt: 0,
                  lovedAt: 0,
                  item: "Petting Hand",
                },
              },
            },
          },
          action: { type: "skill.used", skill: "Barnyard Rouse" },
          createdAt: dateNow,
        }),
      ).toThrow("All your animals are not asleep");
    });

    it("activates Barnyard Rouse", () => {
      const state = skillUse({
        state: {
          ...INITIAL_FARM,
          bumpkin: {
            ...INITIAL_FARM.bumpkin,
            skills: { "Barnyard Rouse": 1 },
          },
          henHouse: {
            level: 1,
            animals: {
              "123": {
                id: "123",
                type: "Chicken",
                state: "idle",
                createdAt: dateNow,
                awakeAt: dateNow + 1000 * 60 * 60 * 24,
                experience: 120,
                asleepAt: dateNow,
                lovedAt: 0,
                item: "Petting Hand",
              },
            },
          },
        },
        action: { type: "skill.used", skill: "Barnyard Rouse" },
        createdAt: dateNow,
      });
      expect(state.henHouse.animals["123"].awakeAt).toEqual(dateNow);
    });
  });
});
