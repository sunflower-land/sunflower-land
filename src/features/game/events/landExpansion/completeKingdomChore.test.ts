import "lib/__mocks__/configMock";

import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import { completeKingdomChore } from "./completeKingdomChore";
import { KingdomChore } from "features/game/types/game";
import { SEASONS } from "features/game/types/seasons";

describe("kingdomChore.completed", () => {
  beforeEach(() => {
    jest.useRealTimers();
  });

  it.only("throws if no kingdom chores found", () => {
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

  it("throws an error if the chore is not active", () => {
    const { startDate } = SEASONS["Clash of Factions"];

    const oneMinuteAfterStart = new Date(startDate.getTime() + 1 * 60 * 1000);

    jest.useFakeTimers();
    jest.setSystemTime(oneMinuteAfterStart);

    const chore: KingdomChore = {
      activity: "Sunflower Harvested",
      description: "Harvest 30 Sunflowers",
      createdAt: oneMinuteAfterStart.getTime(),
      bumpkinId: INITIAL_BUMPKIN.id,
      startCount: 0,
      requirement: 30,
      marks: 3,
      resource: "Sunflower",
    };

    expect(() =>
      completeKingdomChore({
        createdAt: oneMinuteAfterStart.getTime(),
        action: {
          type: "kingdomChore.completed",
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
          kingdomChores: {
            choresCompleted: 0,
            choresSkipped: 0,
            chores: {
              "1": chore,
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
});
