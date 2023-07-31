import Decimal from "decimal.js-light";
import "lib/__mocks__/configMock";

import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import { completeChore } from "./completeChore";

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
    });

    expect(state.bumpkin?.activity?.["Chore Completed"]).toEqual(1);
  });
});
