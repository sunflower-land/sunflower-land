import Decimal from "decimal.js-light";
import "lib/__mocks__/configMock";

import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import { completeChore } from "./completeChore";
import { ChoreV2 } from "features/game/types/game";
import { SEASONS } from "features/game/types/seasons";

describe("chore.completed", () => {
  it("requires chore has started", () => {
    expect(() =>
      completeChore({
        action: {
          type: "chore.completed",
        },
        state: {
          ...TEST_FARM,
          hayseedHank: {
            choresCompleted: 0,
            chore: {
              activity: "Sunflower Harvested",
              requirement: 10,
              reward: {
                items: { "Solar Flare Ticket": 1 },
              },
              description: "Harvest 10 Sunflowers",
            },
          },
        },
      })
    ).toThrow("Chore has not started");
  });

  it("requires same Bumpkin is working on chore", () => {
    expect(() =>
      completeChore({
        action: {
          type: "chore.completed",
        },
        state: {
          ...TEST_FARM,
          hayseedHank: {
            choresCompleted: 0,
            chore: {
              activity: "Sunflower Harvested",
              requirement: 10,
              reward: {
                items: { "Solar Flare Ticket": 1 },
              },
              description: "Harvest 10 Sunflowers",
            },
            progress: {
              bumpkinId: 22,
              startCount: 0,
              startedAt: 0,
            },
          },
        },
      })
    ).toThrow("Not the same Bumpkin");
  });

  it("requires chore is completed", () => {
    expect(() =>
      completeChore({
        action: {
          type: "chore.completed",
        },
        state: {
          ...TEST_FARM,
          bumpkin: {
            ...INITIAL_BUMPKIN,
            activity: {
              "Sunflower Harvested": 5,
            },
          },
          hayseedHank: {
            choresCompleted: 0,
            chore: {
              activity: "Sunflower Harvested",
              requirement: 10,
              reward: {
                items: { "Solar Flare Ticket": 1 },
              },
              description: "Harvest 10 Sunflowers",
            },
            progress: {
              bumpkinId: INITIAL_BUMPKIN.id,
              startCount: 0,
              startedAt: 0,
            },
          },
        },
        // 1693526400000 = Friday, September 1, 2023 12:00:00 AM GMT
        createdAt: 1693526400000,
      })
    ).toThrow("Chore is not completed");
  });

  it("requires chore is completed based on new progress", () => {
    expect(() =>
      completeChore({
        action: {
          type: "chore.completed",
        },
        state: {
          ...TEST_FARM,
          bumpkin: {
            ...INITIAL_BUMPKIN,
            activity: {
              "Sunflower Harvested": 50,
            },
          },
          hayseedHank: {
            choresCompleted: 0,
            chore: {
              activity: "Sunflower Harvested",
              requirement: 10,
              reward: {
                items: { "Solar Flare Ticket": 1 },
              },
              description: "Harvest 10 Sunflowers",
            },
            progress: {
              bumpkinId: INITIAL_BUMPKIN.id,
              startCount: 45,
              startedAt: 0,
            },
          },
        },
        // 1693526400000 = Friday, September 1, 2023 12:00:00 AM GMT
        createdAt: 1693526400000,
      })
    ).toThrow("Chore is not completed");
  });

  it("increments chores completed", () => {
    const state = completeChore({
      action: {
        type: "chore.completed",
      },
      state: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          activity: {
            "Sunflower Harvested": 50,
          },
        },
        hayseedHank: {
          choresCompleted: 0,
          chore: {
            activity: "Sunflower Harvested",
            requirement: 10,
            reward: {
              items: { "Solar Flare Ticket": 1 },
            },
            description: "Harvest 10 Sunflowers",
          },
          progress: {
            bumpkinId: INITIAL_BUMPKIN.id,
            startCount: 0,
            startedAt: 0,
          },
        },
      },
      // 1693526400000 = Friday, September 1, 2023 12:00:00 AM GMT
      createdAt: 1693526400000,
    });

    expect(state.hayseedHank?.choresCompleted).toEqual(1);
  });

  it("claims the reward", () => {
    const state = completeChore({
      action: {
        type: "chore.completed",
      },
      state: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          activity: {
            "Sunflower Harvested": 50,
          },
        },
        hayseedHank: {
          choresCompleted: 0,
          chore: {
            activity: "Sunflower Harvested",
            requirement: 10,
            reward: {
              items: { "Solar Flare Ticket": 1, "Sunflower Seed": 5 },
            },
            description: "Harvest 10 Sunflowers",
          },
          progress: {
            bumpkinId: INITIAL_BUMPKIN.id,
            startCount: 0,
            startedAt: 0,
          },
        },
      },
      // 1693526400000 = Friday, September 1, 2023 12:00:00 AM GMT
      createdAt: 1693526400000,
    });

    expect(state.inventory["Solar Flare Ticket"]).toEqual(new Decimal(1));
    expect(state.inventory["Sunflower Seed"]).toEqual(new Decimal(5));
  });

  it("increments chores completed for Bumpkin", () => {
    const state = completeChore({
      action: {
        type: "chore.completed",
      },
      state: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          activity: {
            "Sunflower Harvested": 50,
          },
        },
        hayseedHank: {
          choresCompleted: 0,
          chore: {
            activity: "Sunflower Harvested",
            requirement: 10,
            reward: {
              items: { "Solar Flare Ticket": 1 },
            },
            description: "Harvest 10 Sunflowers",
          },
          progress: {
            bumpkinId: INITIAL_BUMPKIN.id,
            startCount: 0,
            startedAt: 0,
          },
        },
      },
      // 1693526400000 = Friday, September 1, 2023 12:00:00 AM GMT
      createdAt: 1693526400000,
    });

    expect(state.bumpkin?.activity?.["Chore Completed"]).toEqual(1);
  });

  describe("Witches' Eve", () => {
    it("throws an error if the chore number doesn't exits", () => {
      const { startDate } = SEASONS["Witches' Eve"];

      const oneMinuteAfterStart = new Date(startDate.getTime() + 1 * 60 * 1000);

      jest.useFakeTimers();
      jest.setSystemTime(oneMinuteAfterStart);

      const chore: ChoreV2 = {
        activity: "Sunflower Harvested",
        description: "Harvest 30 Sunflowers",
        createdAt: oneMinuteAfterStart.getTime(),
        bumpkinId: INITIAL_BUMPKIN.id,
        startCount: 0,
        requirement: 30,
        tickets: 1,
      };

      expect(() =>
        completeChore({
          createdAt: oneMinuteAfterStart.getTime(),
          action: {
            type: "chore.completed",
            id: undefined,
          },
          state: {
            ...TEST_FARM,
            bumpkin: {
              ...INITIAL_BUMPKIN,
              activity: {
                "Sunflower Harvested": 50,
              },
            },
            chores: {
              choresCompleted: 0,
              choresSkipped: 0,
              chores: {
                "1": chore,
                "2": chore,
                "3": chore,
                "4": chore,
                "5": chore,
              },
            },
          },
        })
      ).toThrow("Chore ID not supplied");
    });

    it("errors if the chore is not complete", () => {
      const { startDate } = SEASONS["Witches' Eve"];

      const oneMinuteAfterStart = new Date(startDate.getTime() + 1 * 60 * 1000);

      jest.useFakeTimers();
      jest.setSystemTime(oneMinuteAfterStart);

      const chore: ChoreV2 = {
        activity: "Sunflower Harvested",
        description: "Harvest 30 Sunflowers",
        createdAt: oneMinuteAfterStart.getTime(),
        bumpkinId: INITIAL_BUMPKIN.id,
        startCount: 0,
        requirement: 30,
        tickets: 1,
      };

      expect(() =>
        completeChore({
          createdAt: oneMinuteAfterStart.getTime(),
          action: {
            type: "chore.completed",
            id: 1,
          },
          state: {
            ...TEST_FARM,
            bumpkin: {
              ...INITIAL_BUMPKIN,
              activity: {
                "Sunflower Harvested": 0,
              },
            },
            chores: {
              choresCompleted: 0,
              choresSkipped: 0,
              chores: {
                "1": chore,
                "2": chore,
                "3": chore,
                "4": chore,
                "5": chore,
              },
            },
          },
        })
      ).toThrow("Chore is not completed");
    });

    it("errors if the bumpkin does not exist", () => {
      const { startDate } = SEASONS["Witches' Eve"];

      const oneMinuteAfterStart = new Date(startDate.getTime() + 1 * 60 * 1000);

      jest.useFakeTimers();
      jest.setSystemTime(oneMinuteAfterStart);

      const chore: ChoreV2 = {
        activity: "Sunflower Harvested",
        description: "Harvest 30 Sunflowers",
        createdAt: oneMinuteAfterStart.getTime(),
        bumpkinId: INITIAL_BUMPKIN.id,
        startCount: 0,
        requirement: 30,
        tickets: 1,
      };

      expect(() =>
        completeChore({
          createdAt: oneMinuteAfterStart.getTime(),
          action: {
            type: "chore.completed",
            id: 1,
          },
          state: {
            ...TEST_FARM,
            bumpkin: undefined,
            chores: {
              choresCompleted: 0,
              choresSkipped: 0,
              chores: {
                "1": chore,
                "2": chore,
                "3": chore,
                "4": chore,
                "5": chore,
              },
            },
          },
        })
      ).toThrow("No bumpkin found");
    });

    it("adds the reward into the inventory", () => {
      const { startDate } = SEASONS["Witches' Eve"];

      const oneMinuteAfterStart = new Date(startDate.getTime() + 1 * 60 * 1000);

      jest.useFakeTimers();
      jest.setSystemTime(oneMinuteAfterStart);

      const chore: ChoreV2 = {
        activity: "Sunflower Harvested",
        description: "Harvest 30 Sunflowers",
        createdAt: oneMinuteAfterStart.getTime(),
        bumpkinId: INITIAL_BUMPKIN.id,
        startCount: 0,
        requirement: 30,
        tickets: 1,
      };

      const state = completeChore({
        createdAt: oneMinuteAfterStart.getTime(),
        action: {
          type: "chore.completed",
          id: 1,
        },
        state: {
          ...TEST_FARM,
          bumpkin: {
            ...INITIAL_BUMPKIN,
            activity: {
              "Sunflower Harvested": 50,
            },
          },
          chores: {
            choresCompleted: 0,
            choresSkipped: 0,
            chores: {
              "1": chore,
              "2": chore,
              "3": chore,
              "4": chore,
              "5": chore,
            },
          },
        },
      });

      expect(state.inventory["Crow Feather"]).toEqual(new Decimal(1));
    });

    it("marks chores as complete", () => {
      const { startDate } = SEASONS["Witches' Eve"];

      const oneMinuteAfterStart = new Date(startDate.getTime() + 1 * 60 * 1000);

      jest.useFakeTimers();
      jest.setSystemTime(oneMinuteAfterStart);

      const chore: ChoreV2 = {
        activity: "Sunflower Harvested",
        description: "Harvest 30 Sunflowers",
        createdAt: oneMinuteAfterStart.getTime(),
        bumpkinId: INITIAL_BUMPKIN.id,
        startCount: 0,
        requirement: 30,
        tickets: 1,
      };

      const state = completeChore({
        createdAt: oneMinuteAfterStart.getTime(),
        action: {
          type: "chore.completed",
          id: 1,
        },
        state: {
          ...TEST_FARM,
          bumpkin: {
            ...INITIAL_BUMPKIN,
            activity: {
              "Sunflower Harvested": 50,
            },
          },
          chores: {
            choresCompleted: 0,
            choresSkipped: 0,
            chores: {
              "1": chore,
              "2": chore,
              "3": chore,
              "4": chore,
              "5": chore,
            },
          },
        },
      });

      expect(state.chores?.chores["1"].completedAt).toBeGreaterThan(0);
    });

    it("prevents players from completing chores twice", () => {
      const { startDate } = SEASONS["Witches' Eve"];

      const oneMinuteAfterStart = new Date(startDate.getTime() + 1 * 60 * 1000);

      jest.useFakeTimers();
      jest.setSystemTime(oneMinuteAfterStart);

      const chore: ChoreV2 = {
        activity: "Sunflower Harvested",
        description: "Harvest 30 Sunflowers",
        createdAt: oneMinuteAfterStart.getTime(),
        bumpkinId: INITIAL_BUMPKIN.id,
        startCount: 0,
        requirement: 30,
        tickets: 1,
      };

      const state = completeChore({
        createdAt: oneMinuteAfterStart.getTime(),
        action: {
          type: "chore.completed",
          id: 1,
        },
        state: {
          ...TEST_FARM,
          bumpkin: {
            ...INITIAL_BUMPKIN,
            activity: {
              "Sunflower Harvested": 50,
            },
          },
          chores: {
            choresCompleted: 0,
            choresSkipped: 0,
            chores: {
              "1": chore,
              "2": chore,
              "3": chore,
              "4": chore,
              "5": chore,
            },
          },
        },
      });

      expect(() =>
        completeChore({
          createdAt: oneMinuteAfterStart.getTime(),
          action: {
            type: "chore.completed",
            id: 1,
          },
          state,
        })
      ).toThrow("Chore is already completed");
    });

    it("errors if the bumpkin changed", () => {
      const { startDate } = SEASONS["Witches' Eve"];

      const oneMinuteAfterStart = new Date(startDate.getTime() + 1 * 60 * 1000);

      jest.useFakeTimers();
      jest.setSystemTime(oneMinuteAfterStart);

      const chore: ChoreV2 = {
        activity: "Sunflower Harvested",
        description: "Harvest 30 Sunflowers",
        createdAt: oneMinuteAfterStart.getTime(),
        bumpkinId: INITIAL_BUMPKIN.id,
        startCount: 0,
        requirement: 30,
        tickets: 1,
      };

      expect(() =>
        completeChore({
          createdAt: oneMinuteAfterStart.getTime(),
          action: {
            type: "chore.completed",
            id: 1,
          },
          state: {
            ...TEST_FARM,
            bumpkin: {
              ...INITIAL_BUMPKIN,
              id: 1000,
              activity: {
                "Sunflower Harvested": 50,
              },
            },
            chores: {
              choresCompleted: 0,
              choresSkipped: 0,
              chores: {
                "1": chore,
                "2": chore,
                "3": chore,
                "4": chore,
                "5": chore,
              },
            },
          },
        })
      ).toThrow("Not the same bumpkin");
    });

    it("adds to the completed count", () => {
      const { startDate } = SEASONS["Witches' Eve"];

      const oneMinuteAfterStart = new Date(startDate.getTime() + 1 * 60 * 1000);

      jest.useFakeTimers();
      jest.setSystemTime(oneMinuteAfterStart);

      const chore: ChoreV2 = {
        activity: "Sunflower Harvested",
        description: "Harvest 30 Sunflowers",
        createdAt: oneMinuteAfterStart.getTime(),
        bumpkinId: INITIAL_BUMPKIN.id,
        startCount: 0,
        requirement: 30,
        tickets: 1,
      };

      const state = completeChore({
        createdAt: oneMinuteAfterStart.getTime(),
        action: {
          type: "chore.completed",
          id: 1,
        },
        state: {
          ...TEST_FARM,
          bumpkin: {
            ...INITIAL_BUMPKIN,
            activity: {
              "Sunflower Harvested": 50,
            },
          },
          chores: {
            choresCompleted: 0,
            choresSkipped: 0,
            chores: {
              "1": chore,
              "2": chore,
              "3": chore,
              "4": chore,
              "5": chore,
            },
          },
        },
      });

      expect(state.chores?.choresCompleted).toBe(1);
    });
  });

  it("does not reward faction points if the faction does not exist", () => {
    const now = Date.now();

    const chore: ChoreV2 = {
      activity: "Sunflower Harvested",
      description: "Harvest 30 Sunflowers",
      createdAt: now,
      bumpkinId: INITIAL_BUMPKIN.id,
      startCount: 0,
      requirement: 30,
      tickets: 1,
    };

    const state = completeChore({
      createdAt: now,
      action: {
        type: "chore.completed",
        id: 1,
      },
      state: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          activity: {
            "Sunflower Harvested": 50,
          },
        },
        chores: {
          choresCompleted: 0,
          choresSkipped: 0,
          chores: {
            "1": chore,
            "2": chore,
            "3": chore,
            "4": chore,
            "5": chore,
          },
        },
      },
    });

    expect(state.faction?.points).toBeUndefined();
  });

  it("rewards 5 faction points for every ticket rewarded", () => {
    const now = Date.now();

    const chore: ChoreV2 = {
      activity: "Sunflower Harvested",
      description: "Harvest 30 Sunflowers",
      createdAt: now,
      bumpkinId: INITIAL_BUMPKIN.id,
      startCount: 0,
      requirement: 30,
      tickets: 1,
    };

    const state = completeChore({
      createdAt: now,
      action: {
        type: "chore.completed",
        id: 1,
      },
      state: {
        ...TEST_FARM,
        faction: {
          name: "bumpkins",
          pledgedAt: 0,
          points: 0,
          donated: {
            daily: {
              sfl: {},
              resources: {},
            },
            totalItems: {},
          },
        },
        bumpkin: {
          ...INITIAL_BUMPKIN,
          activity: {
            "Sunflower Harvested": 50,
          },
        },
        chores: {
          choresCompleted: 0,
          choresSkipped: 0,
          chores: {
            "1": chore,
            "2": chore,
            "3": chore,
            "4": chore,
            "5": chore,
          },
        },
      },
    });

    expect(state.faction?.points).toBe(5);
  });
});
