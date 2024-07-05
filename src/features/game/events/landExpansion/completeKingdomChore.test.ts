import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import { completeKingdomChore } from "./completeKingdomChore";
import Decimal from "decimal.js-light";
import { getFactionWeek } from "features/game/lib/factions";
import { GameState } from "features/game/types/game";

const state: GameState = {
  ...TEST_FARM,
  faction: {
    name: "goblins",
    pledgedAt: 0,
    points: 0,

    history: {},
  },
};

describe("kingdomChore.completed", () => {
  beforeEach(() => {
    jest.useRealTimers();
  });

  it("throws if no faction", () => {
    expect(() =>
      completeKingdomChore({
        action: {
          type: "kingdomChore.completed",
          id: 0,
        },
        state: {
          ...TEST_FARM,
          bumpkin: INITIAL_BUMPKIN,
          kingdomChores: {
            choresCompleted: 0,
            choresSkipped: 0,
            chores: [],
            resetsAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
          },
        },
      }),
    ).toThrow("No faction found");
  });

  it("throws if no kingdom chores found", () => {
    expect(() =>
      completeKingdomChore({
        action: {
          type: "kingdomChore.completed",
          id: 0,
        },
        state: {
          ...state,
          bumpkin: INITIAL_BUMPKIN,
          kingdomChores: {
            choresCompleted: 0,
            choresSkipped: 0,
            chores: [],
            resetsAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
          },
        },
      }),
    ).toThrow("Chore not found");
  });

  it("throws if the chore does not exist", () => {
    expect(() =>
      completeKingdomChore({
        action: {
          type: "kingdomChore.completed",
          id: 0,
        },
        state: {
          ...state,
          bumpkin: INITIAL_BUMPKIN,
          kingdomChores: {
            choresCompleted: 0,
            choresSkipped: 0,
            chores: [],
            resetsAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
          },
        },
      }),
    ).toThrow("Chore not found");
  });

  it("throws an error if the chore is not active", () => {
    expect(() =>
      completeKingdomChore({
        action: {
          type: "kingdomChore.completed",
          id: 0,
        },
        state: {
          ...state,
          bumpkin: INITIAL_BUMPKIN,
          kingdomChores: {
            choresCompleted: 0,
            choresSkipped: 0,
            chores: [
              {
                activity: "Sunflower Harvested",
                description: "Harvest 30 Sunflowers",
                requirement: 30,
                marks: 3,
                image: "Sunflower",
              },
            ],
            resetsAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
          },
        },
      }),
    ).toThrow("Chore is not active");
  });

  it("throws an error if chore is not finished", () => {
    expect(() =>
      completeKingdomChore({
        action: {
          type: "kingdomChore.completed",
          id: 0,
        },
        state: {
          ...state,
          bumpkin: {
            ...INITIAL_BUMPKIN,
            activity: {
              "Sunflower Harvested": 20,
            },
          },
          kingdomChores: {
            choresCompleted: 0,
            choresSkipped: 0,
            chores: [
              {
                activity: "Sunflower Harvested",
                description: "Harvest 30 Sunflowers",
                requirement: 30,
                marks: 3,
                image: "Sunflower",
                startedAt: 0,
                startCount: 0,
              },
            ],
            resetsAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
          },
        },
      }),
    ).toThrow("Chore is not complete");
  });

  it("throws an error if chore is already completed", () => {
    expect(() =>
      completeKingdomChore({
        action: {
          type: "kingdomChore.completed",
          id: 0,
        },
        state: {
          ...state,
          bumpkin: {
            ...INITIAL_BUMPKIN,
            activity: {
              "Sunflower Harvested": 30,
            },
          },
          kingdomChores: {
            choresCompleted: 0,
            choresSkipped: 0,
            chores: [
              {
                activity: "Sunflower Harvested",
                description: "Harvest 30 Sunflowers",
                requirement: 30,
                marks: 3,
                image: "Sunflower",
                completedAt: 0,
              },
            ],
            resetsAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
          },
        },
      }),
    ).toThrow("Chore is already completed");
  });

  it("throws an error if chore is skipped", () => {
    expect(() =>
      completeKingdomChore({
        action: {
          type: "kingdomChore.completed",
          id: 0,
        },
        state: {
          ...state,
          bumpkin: {
            ...INITIAL_BUMPKIN,
            activity: {
              "Sunflower Harvested": 30,
            },
          },
          kingdomChores: {
            choresCompleted: 0,
            choresSkipped: 0,
            chores: [
              {
                activity: "Sunflower Harvested",
                description: "Harvest 30 Sunflowers",
                requirement: 30,
                marks: 3,
                image: "Sunflower",
                skippedAt: 0,
              },
            ],
            resetsAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
          },
        },
      }),
    ).toThrow("Chore was already skipped");
  });

  it("adds to the completed count", () => {
    const result = completeKingdomChore({
      action: {
        type: "kingdomChore.completed",
        id: 0,
      },
      state: {
        ...state,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          activity: {
            "Sunflower Harvested": 30,
          },
        },
        kingdomChores: {
          choresCompleted: 0,
          choresSkipped: 0,
          chores: [
            {
              activity: "Sunflower Harvested",
              description: "Harvest 30 Sunflowers",
              requirement: 30,
              marks: 3,
              image: "Sunflower",
              startedAt: 0,
              startCount: 0,
            },
          ],
          resetsAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
        },
      },
    });

    expect(result.kingdomChores?.choresCompleted).toBe(1);
  });

  it("rewards Marks", () => {
    const result = completeKingdomChore({
      action: {
        type: "kingdomChore.completed",
        id: 0,
      },
      state: {
        ...state,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          activity: {
            "Sunflower Harvested": 30,
          },
        },
        kingdomChores: {
          choresCompleted: 0,
          choresSkipped: 0,
          chores: [
            {
              activity: "Sunflower Harvested",
              description: "Harvest 30 Sunflowers",
              requirement: 30,
              marks: 3,
              image: "Sunflower",
              startedAt: 0,
              startCount: 0,
            },
          ],
          resetsAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
        },
      },
    });

    expect(result.inventory["Mark"]).toStrictEqual(new Decimal(3));
  });

  it("marks the chore as completed", () => {
    const now = Date.now();
    const choreId = 0;

    const result = completeKingdomChore({
      action: {
        type: "kingdomChore.completed",
        id: choreId,
      },
      state: {
        ...state,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          activity: {
            "Sunflower Harvested": 30,
          },
        },
        kingdomChores: {
          choresCompleted: 0,
          choresSkipped: 0,
          chores: [
            {
              activity: "Sunflower Harvested",
              description: "Harvest 30 Sunflowers",
              requirement: 30,
              marks: 3,
              image: "Sunflower",
              startedAt: now,
              startCount: 0,
            },
          ],
          resetsAt: now + 1000 * 60 * 60 * 24 * 7,
        },
      },
      createdAt: now,
    });

    expect(result.kingdomChores.chores[choreId].completedAt).toBe(now);
  });

  it("rewards +5% bonus marks if wearing faction shoes", () => {
    const result = completeKingdomChore({
      action: {
        type: "kingdomChore.completed",
        id: 0,
      },
      state: {
        ...state,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          activity: {
            "Sunflower Harvested": 30,
          },
          equipped: {
            ...INITIAL_BUMPKIN.equipped,
            shoes: "Goblin Sabatons",
          },
        },
        kingdomChores: {
          choresCompleted: 0,
          choresSkipped: 0,
          chores: [
            {
              activity: "Sunflower Harvested",
              description: "Harvest 30 Sunflowers",
              requirement: 30,
              marks: 3,
              image: "Sunflower",
              startedAt: 0,
              startCount: 0,
            },
          ],
          resetsAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
        },
      },
    });

    expect(result.inventory["Mark"]?.toNumber()).toBeCloseTo(
      new Decimal(3).mul(1.05).toNumber(),
    );
  });

  it("rewards 400% bonus marks if top rank in faction", () => {
    const result = completeKingdomChore({
      action: {
        type: "kingdomChore.completed",
        id: 0,
      },
      state: {
        ...state,
        inventory: {
          "Goblin Emblem": new Decimal(100_000),
        },
        bumpkin: {
          ...INITIAL_BUMPKIN,
          activity: {
            "Sunflower Harvested": 30,
          },
        },
        kingdomChores: {
          choresCompleted: 0,
          choresSkipped: 0,
          chores: [
            {
              activity: "Sunflower Harvested",
              description: "Harvest 30 Sunflowers",
              requirement: 30,
              marks: 3,
              image: "Sunflower",
              startedAt: 0,
              startCount: 0,
            },
          ],
          resetsAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
        },
      },
    });

    expect(result.inventory["Mark"]?.toNumber()).toBeCloseTo(
      new Decimal(3).mul(5).toNumber(),
    );
  });

  it("rewards 405% bonus marks if top rank and wearing faction shoes", () => {
    const result = completeKingdomChore({
      action: {
        type: "kingdomChore.completed",
        id: 0,
      },
      state: {
        ...state,
        inventory: {
          "Goblin Emblem": new Decimal(100_000),
        },
        bumpkin: {
          ...INITIAL_BUMPKIN,
          activity: {
            "Sunflower Harvested": 30,
          },
          equipped: {
            ...INITIAL_BUMPKIN.equipped,
            shoes: "Goblin Sabatons",
          },
        },
        kingdomChores: {
          choresCompleted: 0,
          choresSkipped: 0,
          chores: [
            {
              activity: "Sunflower Harvested",
              description: "Harvest 30 Sunflowers",
              requirement: 30,
              marks: 3,
              image: "Sunflower",
              startedAt: 0,
              startCount: 0,
            },
          ],
          resetsAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
        },
      },
    });

    expect(result.inventory["Mark"]?.toNumber()).toBeCloseTo(
      new Decimal(3).mul(5.05).toNumber(),
    );
  });

  it("adds to the weekly history", () => {
    const now = Date.now();

    const result = completeKingdomChore({
      createdAt: now,
      action: {
        type: "kingdomChore.completed",
        id: 0,
      },
      state: {
        ...state,
        inventory: {
          "Goblin Emblem": new Decimal(100_000),
        },
        bumpkin: {
          ...INITIAL_BUMPKIN,
          activity: {
            "Sunflower Harvested": 30,
          },
          equipped: {
            ...INITIAL_BUMPKIN.equipped,
            shoes: "Goblin Sabatons",
          },
        },
        kingdomChores: {
          choresCompleted: 0,
          choresSkipped: 0,
          chores: [
            {
              activity: "Sunflower Harvested",
              description: "Harvest 30 Sunflowers",
              requirement: 30,
              marks: 3,
              image: "Sunflower",
              startedAt: 0,
              startCount: 0,
            },
          ],
          resetsAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
        },
      },
    });

    const week = getFactionWeek({ date: new Date(now) });
    expect(result.faction?.history[week].score).toBe(
      new Decimal(3).mul(5.05).toNumber(),
    );
  });
});
