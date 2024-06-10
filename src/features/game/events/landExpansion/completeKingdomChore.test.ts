import "lib/__mocks__/configMock";

import { TEST_FARM } from "features/game/lib/constants";
import { completeKingdomChore } from "./completeKingdomChore";

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
});
