import Decimal from "decimal.js-light";
import { completeSpecialEventTask } from "./completeSpecialEventTask";
import { TEST_FARM } from "features/game/lib/constants";

describe("completeEventTask", () => {
  const now = Date.now();

  it("throws if the event does not exist", () => {
    expect(() =>
      completeSpecialEventTask({
        createdAt: now,
        action: {
          type: "specialEvent.taskCompleted",
          event: "Jest Test",
          task: 1,
        },
        state: TEST_FARM,
      }),
    ).toThrow("Event does not exist");
  });

  it("throws if the task does not exist", () => {
    expect(() =>
      completeSpecialEventTask({
        createdAt: now,
        action: {
          type: "specialEvent.taskCompleted",
          event: "Lunar New Year",
          task: 1,
        },
        state: {
          ...TEST_FARM,
          specialEvents: {
            history: {},
            current: {
              "Lunar New Year": {
                isEligible: true,
                requiresWallet: false,
                text: "",
                startAt: 0,
                endAt: now + 1,
                tasks: [],
              },
            },
          },
        },
      }),
    ).toThrow("Task does not exist");
  });

  it("throws if the event has not started", () => {
    expect(() =>
      completeSpecialEventTask({
        createdAt: now,
        action: {
          type: "specialEvent.taskCompleted",
          event: "Lunar New Year",
          task: 1,
        },
        state: {
          ...TEST_FARM,
          specialEvents: {
            history: {},
            current: {
              "Lunar New Year": {
                isEligible: true,
                requiresWallet: false,
                text: "",
                startAt: now + 1,
                endAt: now + 1,
                tasks: [
                  {
                    reward: { wearables: {}, items: {}, sfl: 0 },
                    requirements: { items: {}, sfl: 0 },
                  },
                ],
              },
            },
          },
        },
      }),
    ).toThrow("Lunar New Year has not started");
  });

  it("throws if the event has finished", () => {
    expect(() =>
      completeSpecialEventTask({
        createdAt: now,
        action: {
          type: "specialEvent.taskCompleted",
          event: "Lunar New Year",
          task: 1,
        },
        state: {
          ...TEST_FARM,
          specialEvents: {
            history: {},
            current: {
              "Lunar New Year": {
                isEligible: true,
                requiresWallet: false,
                text: "",
                startAt: 0,
                endAt: now - 1,
                tasks: [
                  {
                    reward: { wearables: {}, items: {}, sfl: 0 },
                    requirements: { items: {}, sfl: 0 },
                  },
                ],
              },
            },
          },
        },
      }),
    ).toThrow("Lunar New Year has finished");
  });

  it("throws if the task is already completed", () => {
    expect(() =>
      completeSpecialEventTask({
        createdAt: now,
        action: {
          type: "specialEvent.taskCompleted",
          event: "Lunar New Year",
          task: 1,
        },
        state: {
          ...TEST_FARM,
          specialEvents: {
            history: {},
            current: {
              "Lunar New Year": {
                isEligible: true,
                requiresWallet: false,

                text: "",
                startAt: 0,
                endAt: now + 1,
                tasks: [
                  {
                    completedAt: now,
                    requirements: { items: {}, sfl: 0 },
                    reward: { wearables: {}, items: {}, sfl: 0 },
                  },
                ],
              },
            },
          },
        },
      }),
    ).toThrow("Task 1 already completed");
  });

  it("throws if the previous task was completed today", () => {
    expect(() =>
      completeSpecialEventTask({
        createdAt: now,
        action: {
          type: "specialEvent.taskCompleted",
          event: "Lunar New Year",
          task: 2,
        },
        state: {
          ...TEST_FARM,
          specialEvents: {
            history: {},
            current: {
              "Lunar New Year": {
                isEligible: true,
                requiresWallet: false,

                text: "",
                startAt: now,
                endAt: now + 1,
                tasks: [
                  {
                    completedAt: now,
                    reward: { wearables: {}, items: {}, sfl: 0 },
                    requirements: { items: {}, sfl: 0 },
                  },
                  {
                    reward: { wearables: {}, items: {}, sfl: 0 },
                    requirements: { items: {}, sfl: 0 },
                  },
                ],
              },
            },
          },
        },
      }),
    ).toThrow("Task already completed today");
  });

  it("throws if previous task not completed", () => {
    expect(() =>
      completeSpecialEventTask({
        createdAt: now,
        action: {
          type: "specialEvent.taskCompleted",
          event: "Lunar New Year",
          task: 2,
        },
        state: {
          ...TEST_FARM,
          inventory: {
            "Sea Bass": new Decimal(1),
          },
          specialEvents: {
            history: {},
            current: {
              "Lunar New Year": {
                isEligible: true,
                requiresWallet: false,
                text: "",
                startAt: 0,
                endAt: now + 1,
                tasks: [
                  {
                    reward: { wearables: {}, items: {}, sfl: 0 },
                    requirements: { items: { Anchovy: 1 }, sfl: 0 },
                  },
                  {
                    reward: { wearables: {}, items: {}, sfl: 0 },
                    requirements: { items: { "Sea Bass": 1 }, sfl: 0 },
                  },
                ],
              },
            },
          },
        },
      }),
    ).toThrow("Task 1 not completed");
  });

  it("throws if the item requirements are not met", () => {
    expect(() =>
      completeSpecialEventTask({
        createdAt: now,
        action: {
          type: "specialEvent.taskCompleted",
          event: "Lunar New Year",
          task: 1,
        },
        state: {
          ...TEST_FARM,
          specialEvents: {
            history: {},
            current: {
              "Lunar New Year": {
                isEligible: true,
                requiresWallet: false,
                text: "",
                startAt: 0,
                endAt: now + 1,
                tasks: [
                  {
                    reward: { wearables: {}, items: {}, sfl: 0 },
                    requirements: { items: { Anchovy: 1 }, sfl: 0 },
                  },
                ],
              },
            },
          },
        },
      }),
    ).toThrow("Anchovy requirements not met");
  });

  it("throws if the sfl requirement is not met", () => {
    expect(() =>
      completeSpecialEventTask({
        createdAt: now,
        action: {
          type: "specialEvent.taskCompleted",
          event: "Lunar New Year",
          task: 1,
        },
        state: {
          ...TEST_FARM,
          specialEvents: {
            history: {},
            current: {
              "Lunar New Year": {
                isEligible: true,
                requiresWallet: false,
                text: "",
                startAt: 0,
                endAt: now + 1,
                tasks: [
                  {
                    reward: { wearables: {}, items: {}, sfl: 0 },
                    requirements: { items: {}, sfl: 999 },
                  },
                ],
              },
            },
          },
        },
      }),
    ).toThrow("SFL requirement not met");
  });

  it("subtracts item requirements", () => {
    const state = completeSpecialEventTask({
      createdAt: now,
      action: {
        type: "specialEvent.taskCompleted",
        event: "Lunar New Year",
        task: 1,
      },
      state: {
        ...TEST_FARM,
        inventory: {
          Anchovy: new Decimal(2),
        },
        specialEvents: {
          history: {},
          current: {
            "Lunar New Year": {
              isEligible: true,
              requiresWallet: false,
              text: "",
              startAt: 0,
              endAt: now + 1,
              tasks: [
                {
                  reward: { wearables: {}, items: {}, sfl: 0 },
                  requirements: { items: { Anchovy: 1 }, sfl: 0 },
                },
              ],
            },
          },
        },
      },
    });

    expect(state.inventory.Anchovy).toEqual(new Decimal(1));
  });

  it("subtracts sfl requirements", () => {
    const state = completeSpecialEventTask({
      createdAt: now,
      action: {
        type: "specialEvent.taskCompleted",
        event: "Lunar New Year",
        task: 1,
      },
      state: {
        ...TEST_FARM,
        balance: new Decimal(2),
        specialEvents: {
          history: {},
          current: {
            "Lunar New Year": {
              isEligible: true,
              requiresWallet: false,
              text: "",
              startAt: 0,
              endAt: now + 1,
              tasks: [
                {
                  reward: { wearables: {}, items: {}, sfl: 0 },
                  requirements: { items: {}, sfl: 1 },
                },
              ],
            },
          },
        },
      },
    });

    expect(state.balance).toEqual(new Decimal(1));
  });

  it("marks the task as completed", () => {
    const state = completeSpecialEventTask({
      createdAt: now,
      action: {
        type: "specialEvent.taskCompleted",
        event: "Lunar New Year",
        task: 1,
      },
      state: {
        ...TEST_FARM,
        balance: new Decimal(2),
        specialEvents: {
          history: {},
          current: {
            "Lunar New Year": {
              isEligible: true,
              requiresWallet: false,
              text: "",
              startAt: 0,
              endAt: now + 1,
              tasks: [
                {
                  reward: { wearables: {}, items: {}, sfl: 0 },
                  requirements: { items: {}, sfl: 1 },
                },
              ],
            },
          },
        },
      },
    });

    expect(
      state.specialEvents.current["Lunar New Year"]?.tasks[0].completedAt,
    ).toBe(now);
  });

  it("completes the second task on the forth day", () => {
    const startAt = now - 4 * 24 * 60 * 60 * 1000;

    const state = completeSpecialEventTask({
      createdAt: now,
      action: {
        type: "specialEvent.taskCompleted",
        event: "Lunar New Year",
        task: 2,
      },
      state: {
        ...TEST_FARM,
        specialEvents: {
          history: {},
          current: {
            "Lunar New Year": {
              isEligible: true,
              requiresWallet: false,
              text: "",
              startAt: startAt,
              endAt: now + 1,
              tasks: [
                {
                  reward: { wearables: {}, items: {}, sfl: 0 },
                  requirements: { items: {}, sfl: 0 },
                  completedAt: startAt,
                },
                {
                  reward: { wearables: {}, items: {}, sfl: 0 },
                  requirements: { items: {}, sfl: 0 },
                },
              ],
            },
          },
        },
      },
    });

    expect(
      state.specialEvents.current["Lunar New Year"]?.tasks[1].completedAt,
    ).toBe(now);
  });

  it("adds history", () => {
    const state = completeSpecialEventTask({
      createdAt: now,
      action: {
        type: "specialEvent.taskCompleted",
        event: "Lunar New Year",
        task: 1,
      },
      state: {
        ...TEST_FARM,
        specialEvents: {
          history: {},
          current: {
            "Lunar New Year": {
              isEligible: true,
              requiresWallet: false,
              text: "",
              startAt: now,
              endAt: now + 1,
              tasks: [
                {
                  reward: { wearables: {}, items: {}, sfl: 0 },
                  requirements: { items: {}, sfl: 0 },
                },
              ],
            },
          },
        },
      },
    });

    expect(state.specialEvents.history["2024"]["Lunar New Year"]).toBe(100);
  });

  it("adds partial history", () => {
    const state = completeSpecialEventTask({
      createdAt: now,
      action: {
        type: "specialEvent.taskCompleted",
        event: "Lunar New Year",
        task: 1,
      },
      state: {
        ...TEST_FARM,
        specialEvents: {
          history: {},
          current: {
            "Lunar New Year": {
              isEligible: true,
              requiresWallet: false,
              text: "",
              startAt: now,
              endAt: now + 1,
              tasks: [
                {
                  reward: { wearables: {}, items: {}, sfl: 0 },
                  requirements: { items: {}, sfl: 0 },
                },
                {
                  reward: { wearables: {}, items: {}, sfl: 0 },
                  requirements: { items: {}, sfl: 0 },
                },
              ],
            },
          },
        },
      },
    });

    expect(state.specialEvents?.history["2024"]["Lunar New Year"]).toBe(50);
  });

  it("gives the item reward", () => {
    const state = completeSpecialEventTask({
      createdAt: now,
      action: {
        type: "specialEvent.taskCompleted",
        event: "Lunar New Year",
        task: 1,
      },
      state: {
        ...TEST_FARM,
        balance: new Decimal(0),
        inventory: {},
        specialEvents: {
          history: {},
          current: {
            "Lunar New Year": {
              isEligible: true,
              requiresWallet: false,
              text: "",
              startAt: 0,
              endAt: now + 1,
              tasks: [
                {
                  reward: { wearables: {}, items: { Blueberry: 1 }, sfl: 0 },
                  requirements: { items: {}, sfl: 0 },
                },
              ],
            },
          },
        },
      },
    });

    expect(state["inventory"]["Blueberry"]).toEqual(new Decimal(1));
  });

  it("gives the wearable reward", () => {
    const state = completeSpecialEventTask({
      createdAt: now,
      action: {
        type: "specialEvent.taskCompleted",
        event: "Lunar New Year",
        task: 1,
      },
      state: {
        ...TEST_FARM,
        balance: new Decimal(0),
        inventory: {},
        specialEvents: {
          history: {},
          current: {
            "Lunar New Year": {
              isEligible: true,
              requiresWallet: false,
              text: "",
              startAt: 0,
              endAt: now + 1,
              tasks: [
                {
                  reward: {
                    wearables: { "Abyssal Angler Hat": 1 },
                    items: {},
                    sfl: 0,
                  },
                  requirements: { items: {}, sfl: 0 },
                },
              ],
            },
          },
        },
      },
    });

    expect(state["wardrobe"]["Abyssal Angler Hat"]).toEqual(1);
  });

  it("gives the sfl reward", () => {
    const state = completeSpecialEventTask({
      createdAt: now,
      action: {
        type: "specialEvent.taskCompleted",
        event: "Lunar New Year",
        task: 1,
      },
      state: {
        ...TEST_FARM,
        balance: new Decimal(0),
        inventory: {},
        specialEvents: {
          history: {},
          current: {
            "Lunar New Year": {
              isEligible: true,
              requiresWallet: false,
              text: "",
              startAt: 0,
              endAt: now + 1,
              tasks: [
                {
                  reward: { wearables: {}, items: {}, sfl: 1 },
                  requirements: { items: {}, sfl: 0 },
                },
              ],
            },
          },
        },
      },
    });

    expect(state.balance).toEqual(new Decimal(1));
  });

  it("throws if the user is not eligible", () => {
    expect(() =>
      completeSpecialEventTask({
        createdAt: now,
        action: {
          type: "specialEvent.taskCompleted",
          event: "Lunar New Year",
          task: 1,
        },
        state: {
          ...TEST_FARM,
          specialEvents: {
            history: {},
            current: {
              "Lunar New Year": {
                text: "",
                startAt: 0,
                endAt: now + 1,
                tasks: [
                  {
                    reward: { wearables: {}, items: {}, sfl: 0 },
                    requirements: { items: {}, sfl: 0 },
                  },
                ],
                isEligible: false,
                requiresWallet: false,
              },
            },
          },
        },
      }),
    ).toThrow("You are not eligible");
  });
});
