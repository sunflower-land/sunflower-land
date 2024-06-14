import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import { completeKingdomChore } from "./completeKingdomChore";
import Decimal from "decimal.js-light";

describe("kingdomChore.completed", () => {
  beforeEach(() => {
    jest.useRealTimers();
  });

  it("throws if no kingdom chores found", () => {
    expect(() =>
      completeKingdomChore({
        action: {
          type: "kingdomChore.completed",
          id: 1,
        },
        state: {
          ...TEST_FARM,
          bumpkin: INITIAL_BUMPKIN,
          kingdomChores: {
            choresCompleted: 0,
            choresSkipped: 0,
            chores: {},
            weeklyChoresCompleted: [],
            weeklyChoresSkipped: [],
            activeChores: {},
            resetsAt: 0,
          },
        },
      })
    ).toThrow("Chore not found");
  });

  it("throws if the chore does not exist", () => {
    expect(() =>
      completeKingdomChore({
        action: {
          type: "kingdomChore.completed",
          id: 1,
        },
        state: {
          ...TEST_FARM,
          bumpkin: INITIAL_BUMPKIN,
          kingdomChores: {
            choresCompleted: 0,
            choresSkipped: 0,
            chores: {},
            weeklyChoresCompleted: [],
            weeklyChoresSkipped: [],
            activeChores: {},
            resetsAt: 0,
          },
        },
      })
    ).toThrow("Chore not found");
  });

  it("throws an error if the chore is not active", () => {
    expect(() =>
      completeKingdomChore({
        action: {
          type: "kingdomChore.completed",
          id: 1,
        },
        state: {
          ...TEST_FARM,
          bumpkin: INITIAL_BUMPKIN,
          kingdomChores: {
            choresCompleted: 0,
            choresSkipped: 0,
            chores: {
              1: {
                activity: "Sunflower Harvested",
                description: "Harvest 30 Sunflowers",
                requirement: 30,
                marks: 3,
                image: "Sunflower",
              },
            },
            weeklyChoresCompleted: [],
            weeklyChoresSkipped: [],
            activeChores: {},
            resetsAt: 0,
          },
        },
      })
    ).toThrow("Chore is not active");
  });

  it("throws an error if chore is not complete", () => {
    expect(() =>
      completeKingdomChore({
        action: {
          type: "kingdomChore.completed",
          id: 1,
        },
        state: {
          ...TEST_FARM,
          bumpkin: {
            ...INITIAL_BUMPKIN,
            activity: {
              "Sunflower Harvested": 20,
            },
          },
          kingdomChores: {
            choresCompleted: 0,
            choresSkipped: 0,
            chores: {
              1: {
                activity: "Sunflower Harvested",
                description: "Harvest 30 Sunflowers",
                requirement: 30,
                marks: 3,
                image: "Sunflower",
              },
            },
            weeklyChoresCompleted: [],
            weeklyChoresSkipped: [],
            activeChores: { 1: { startCount: 0, startedAt: 0 } },
            resetsAt: 0,
          },
        },
      })
    ).toThrow("Chore is not complete");
  });

  it("throws an error if chore is already completed", () => {
    expect(() =>
      completeKingdomChore({
        action: {
          type: "kingdomChore.completed",
          id: 1,
        },
        state: {
          ...TEST_FARM,
          bumpkin: {
            ...INITIAL_BUMPKIN,
            activity: {
              "Sunflower Harvested": 30,
            },
          },
          kingdomChores: {
            choresCompleted: 0,
            choresSkipped: 0,
            chores: {
              1: {
                activity: "Sunflower Harvested",
                description: "Harvest 30 Sunflowers",
                requirement: 30,
                marks: 3,
                image: "Sunflower",
              },
            },
            weeklyChoresCompleted: [1],
            weeklyChoresSkipped: [],
            activeChores: {},
            resetsAt: 0,
          },
        },
      })
    ).toThrow("Chore is already completed");
  });

  it("throws an error if chore is skipped", () => {
    expect(() =>
      completeKingdomChore({
        action: {
          type: "kingdomChore.completed",
          id: 1,
        },
        state: {
          ...TEST_FARM,
          bumpkin: {
            ...INITIAL_BUMPKIN,
            activity: {
              "Sunflower Harvested": 30,
            },
          },
          kingdomChores: {
            choresCompleted: 0,
            choresSkipped: 0,
            chores: {
              1: {
                activity: "Sunflower Harvested",
                description: "Harvest 30 Sunflowers",
                requirement: 30,
                marks: 3,
                image: "Sunflower",
              },
            },
            weeklyChoresCompleted: [],
            weeklyChoresSkipped: [1],
            activeChores: {},
            resetsAt: 0,
          },
        },
      })
    ).toThrow("Chore was already skipped");
  });

  it("adds to the completed count", () => {
    const result = completeKingdomChore({
      action: {
        type: "kingdomChore.completed",
        id: 1,
      },
      state: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          activity: {
            "Sunflower Harvested": 30,
          },
        },
        kingdomChores: {
          choresCompleted: 0,
          choresSkipped: 0,
          chores: {
            1: {
              activity: "Sunflower Harvested",
              description: "Harvest 30 Sunflowers",
              requirement: 30,
              marks: 3,
              image: "Sunflower",
            },
          },
          weeklyChoresCompleted: [],
          weeklyChoresSkipped: [],
          activeChores: { 1: { startCount: 0, startedAt: 0 } },
          resetsAt: 0,
        },
      },
    });

    expect(result.kingdomChores?.choresCompleted).toBe(1);
  });

  it("rewards Marks", () => {
    const result = completeKingdomChore({
      action: {
        type: "kingdomChore.completed",
        id: 1,
      },
      state: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          activity: {
            "Sunflower Harvested": 30,
          },
        },
        kingdomChores: {
          choresCompleted: 0,
          choresSkipped: 0,
          chores: {
            1: {
              activity: "Sunflower Harvested",
              description: "Harvest 30 Sunflowers",
              requirement: 30,
              marks: 3,
              image: "Sunflower",
            },
          },
          weeklyChoresCompleted: [],
          weeklyChoresSkipped: [],
          activeChores: { 1: { startCount: 0, startedAt: 0 } },
          resetsAt: 0,
        },
      },
    });

    expect(result.inventory["Mark"]).toStrictEqual(new Decimal(3));
  });

  it("marks the chore as completed", () => {
    const now = Date.now();
    const result = completeKingdomChore({
      action: {
        type: "kingdomChore.completed",
        id: 1,
      },
      state: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          activity: {
            "Sunflower Harvested": 30,
          },
        },
        kingdomChores: {
          choresCompleted: 0,
          choresSkipped: 0,
          chores: {
            1: {
              activity: "Sunflower Harvested",
              description: "Harvest 30 Sunflowers",
              requirement: 30,
              marks: 3,
              image: "Sunflower",
            },
          },
          weeklyChoresCompleted: [],
          weeklyChoresSkipped: [],
          activeChores: { 1: { startCount: 0, startedAt: 0 } },
          resetsAt: 0,
        },
      },
      createdAt: now,
    });

    expect(result.kingdomChores?.weeklyChoresCompleted).toStrictEqual([1]);
  });
});
