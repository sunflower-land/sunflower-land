import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import { completeSocialTask, InGameTaskName } from "./completeSocialTask";

describe("completeSocialTask", () => {
  const now = Date.now();

  it("throws if the task does not exist", () => {
    expect(() =>
      completeSocialTask({
        createdAt: now,
        action: {
          type: "socialTask.completed",
          taskId: "Non-existent task" as InGameTaskName,
        },
        state: INITIAL_FARM,
      }),
    ).toThrow("Task not found");
  });

  it("throws if the requirement is not met", () => {
    expect(() =>
      completeSocialTask({
        createdAt: now,
        action: {
          type: "socialTask.completed",
          taskId: "Link your Discord",
        },
        state: {
          ...INITIAL_FARM,
          referrals: { totalReferrals: 0 },
        },
      }),
    ).toThrow("Requirement not met");
  });

  it("throws if the task is already completed", () => {
    expect(() =>
      completeSocialTask({
        createdAt: now,
        action: {
          type: "socialTask.completed",
          taskId: "Link your Discord",
        },
        state: {
          ...INITIAL_FARM,
          discord: { connected: true },
          socialTasks: {
            completed: {
              "Link your Discord": { completedAt: now - 1000 },
            },
          },
        },
      }),
    ).toThrow("Task already completed");
  });

  it("completes the 'Link your Discord' task and gives reward", () => {
    const state = completeSocialTask({
      createdAt: now,
      action: {
        type: "socialTask.completed",
        taskId: "Link your Discord",
      },
      state: {
        ...INITIAL_FARM,
        discord: { connected: true },
      },
    });

    expect(state.inventory["Love Charm"]).toEqual(new Decimal(25));
    expect(state.socialTasks?.completed["Link your Discord"]).toEqual({
      completedAt: now,
    });
  });

  it("completes the 'Link your Telegram' task and gives reward", () => {
    const state = completeSocialTask({
      createdAt: now,
      action: {
        type: "socialTask.completed",
        taskId: "Link your Telegram",
      },
      state: {
        ...INITIAL_FARM,
        telegram: { linkedAt: now - 1000 },
      },
    });

    expect(state.inventory["Love Charm"]).toEqual(new Decimal(25));
    expect(state.socialTasks?.completed["Link your Telegram"]).toEqual({
      completedAt: now,
    });
  });

  it("completes the 'Upgrade to Petal Paradise' task and gives reward", () => {
    const state = completeSocialTask({
      createdAt: now,
      action: {
        type: "socialTask.completed",
        taskId: "Upgrade to Petal Paradise",
      },
      state: {
        ...INITIAL_FARM,
        island: { type: "spring" },
      },
    });

    expect(state.inventory["Love Charm"]).toEqual(new Decimal(25));
    expect(state.socialTasks?.completed["Upgrade to Petal Paradise"]).toEqual({
      completedAt: now,
    });
  });

  it("throws if 'Complete 50 deliveries' task has less than 50 deliveries", () => {
    expect(() =>
      completeSocialTask({
        createdAt: now,
        action: {
          type: "socialTask.completed",
          taskId: "Complete 50 deliveries",
        },
        state: {
          ...INITIAL_FARM,
          delivery: { ...INITIAL_FARM.delivery, fulfilledCount: 49 },
        },
      }),
    ).toThrow("Requirement not met");
  });

  it("completes the 'Complete 50 deliveries' task and gives reward", () => {
    const state = completeSocialTask({
      createdAt: now,
      action: {
        type: "socialTask.completed",
        taskId: "Complete 50 deliveries",
      },
      state: {
        ...INITIAL_FARM,
        delivery: { ...INITIAL_FARM.delivery, fulfilledCount: 50 },
      },
    });

    expect(state.inventory["Love Charm"]).toEqual(new Decimal(25));
    expect(state.socialTasks?.completed["Complete 50 deliveries"]).toEqual({
      completedAt: now,
    });
  });

  it("adds to existing inventory when completing a task", () => {
    const state = completeSocialTask({
      createdAt: now,
      action: {
        type: "socialTask.completed",
        taskId: "Link your Discord",
      },
      state: {
        ...INITIAL_FARM,
        discord: { connected: true },
        inventory: {
          "Love Charm": new Decimal(10),
        },
      },
    });

    expect(state.inventory["Love Charm"]).toEqual(new Decimal(35)); // 10 + 25
  });

  it("initializes socialTasks if it doesn't exist", () => {
    const baseState: GameState = {
      ...INITIAL_FARM,
      discord: { connected: true },
    };

    // Ensure socialTasks is undefined
    delete baseState.socialTasks;

    const state = completeSocialTask({
      createdAt: now,
      action: {
        type: "socialTask.completed",
        taskId: "Link your Discord",
      },
      state: baseState,
    });

    expect(state.socialTasks).toBeDefined();
    expect(state.socialTasks?.completed["Link your Discord"]).toEqual({
      completedAt: now,
    });
  });
});
