import Decimal from "decimal.js-light";
import "lib/__mocks__/configMock";

import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import { getSeasonalTicket } from "features/game/types/seasons";
import { startChore } from "./startChore";
describe("chore.started", () => {
  it("requires start is not started", () => {
    expect(() => {
      startChore({
        action: {
          type: "chore.started",
        },
        state: {
          ...TEST_FARM,
          hayseedHank: {
            choresCompleted: 0,
            chore: {
              activity: "Sunflower Harvested",
              description: "Harvest 10 Sunflowers",
              requirement: 10,
              reward: {
                items: {
                  [getSeasonalTicket()]: new Decimal(5),
                },
              },
            },

            progress: {
              bumpkinId: INITIAL_BUMPKIN.id,
              startCount: 0,
              startedAt: Date.now(),
            },
          },
        },
      });
    }).toThrow("Chore already in progress");
  });

  it("starts a chore", () => {
    const now = Date.now();
    const bumpkin = {
      ...INITIAL_BUMPKIN,
      activity: {
        "Sunflower Harvested": 13,
      },
    };
    const state = startChore({
      createdAt: now,
      action: {
        type: "chore.started",
      },
      state: {
        ...TEST_FARM,
        bumpkin,
        hayseedHank: {
          choresCompleted: 0,
          chore: {
            description: "Harvest 10 Sunflowers",
            activity: "Sunflower Harvested",
            requirement: 10,
            reward: {
              items: {
                [getSeasonalTicket()]: new Decimal(5),
              },
            },
          },
        },
      },
    });

    expect(state.hayseedHank?.progress).toEqual({
      bumpkinId: bumpkin.id,
      startedAt: now,
      startCount: bumpkin.activity["Sunflower Harvested"],
    });
  });

  it("starts a chore for a new bumpkin", () => {
    const bumpkin = {
      ...INITIAL_BUMPKIN,
      activity: {
        "Sunflower Harvested": 13,
      },
    };
    const state = startChore({
      action: {
        type: "chore.started",
      },
      state: {
        ...TEST_FARM,
        bumpkin,
        hayseedHank: {
          choresCompleted: 0,
          chore: {
            description: "Harvest 10 Sunflowers",
            activity: "Sunflower Harvested",
            requirement: 10,
            reward: {
              items: {
                [getSeasonalTicket()]: new Decimal(5),
              },
            },
          },
          progress: {
            bumpkinId: 2000, // Other Bumpkin
            startCount: 50,
            startedAt: Date.now(),
          },
        },
      },
    });

    expect(state.hayseedHank?.progress).toEqual({
      bumpkinId: bumpkin.id,
      startedAt: expect.any(Number),
      startCount: bumpkin.activity["Sunflower Harvested"],
    });
  });
});
