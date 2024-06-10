import "lib/__mocks__/configMock";

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
          kingdomChores: undefined,
        },
      })
    ).toThrow("No kingdom chores found");
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
          kingdomChores: {
            choresCompleted: 0,
            choresSkipped: 0,
            chores: {},
            week: 1,
            weeklyChores: 0,
            weeklyChoresCompleted: 0,
            weeklyChoresSkipped: 0,
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
          kingdomChores: {
            choresCompleted: 0,
            choresSkipped: 0,
            chores: {
              1: {
                activity: "Sunflower Harvested",
                description: "Harvest 30 Sunflowers",
                createdAt: 1000,
                bumpkinId: INITIAL_BUMPKIN.id,
                startCount: 0,
                requirement: 30,
                marks: 3,
                resource: "Sunflower",
              },
            },
            week: 1,
            weeklyChores: 0,
            weeklyChoresCompleted: 0,
            weeklyChoresSkipped: 0,
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
                createdAt: 1000,
                bumpkinId: INITIAL_BUMPKIN.id,
                startCount: 0,
                requirement: 30,
                marks: 3,
                resource: "Sunflower",
                active: true,
              },
            },
            week: 1,
            weeklyChores: 0,
            weeklyChoresCompleted: 0,
            weeklyChoresSkipped: 0,
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
                createdAt: 1000,
                bumpkinId: INITIAL_BUMPKIN.id,
                startCount: 0,
                requirement: 30,
                marks: 3,
                resource: "Sunflower",
                completedAt: 1000,
              },
            },
            week: 1,
            weeklyChores: 0,
            weeklyChoresCompleted: 0,
            weeklyChoresSkipped: 0,
          },
        },
      })
    ).toThrow("Chore is already completed");
  });

  it("throws if the bumpkin changed", () => {
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
            id: 2,
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
                createdAt: 1000,
                bumpkinId: 1,
                startCount: 0,
                requirement: 30,
                marks: 3,
                resource: "Sunflower",
                active: true,
              },
            },
            week: 1,
            weeklyChores: 0,
            weeklyChoresCompleted: 0,
            weeklyChoresSkipped: 0,
          },
        },
      })
    ).toThrow("Not the same bumpkin");
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
              createdAt: 1000,
              bumpkinId: INITIAL_BUMPKIN.id,
              startCount: 0,
              requirement: 30,
              marks: 3,
              resource: "Sunflower",
              active: true,
            },
          },
          week: 1,
          weeklyChores: 0,
          weeklyChoresCompleted: 0,
          weeklyChoresSkipped: 0,
        },
      },
    });

    expect(result.kingdomChores?.choresCompleted).toBe(1);
  });

  it("rewards Faction Marks", () => {
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
              createdAt: 1000,
              bumpkinId: INITIAL_BUMPKIN.id,
              startCount: 0,
              requirement: 30,
              marks: 3,
              resource: "Sunflower",
              active: true,
            },
          },
          week: 1,
          weeklyChores: 0,
          weeklyChoresCompleted: 0,
          weeklyChoresSkipped: 0,
        },
      },
    });

    expect(result.inventory["Faction Mark"]).toStrictEqual(new Decimal(3));
  });
});
