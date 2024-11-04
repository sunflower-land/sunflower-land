import Decimal from "decimal.js-light";

import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import { completeChore } from "./completeChore";
import { ChoreV2 } from "features/game/types/game";
import { getSeasonalTicket, SEASONS } from "features/game/types/seasons";
import cloneDeep from "lodash.clonedeep";

describe("chore.completed", () => {
  beforeEach(() => {
    jest.useRealTimers();
  });
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
      }),
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
      }),
    ).toThrow("Chore is not completed");
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
      }),
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
      }),
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

  it("rewards easy tickets", () => {
    const now = new Date("2024-05-09").getTime();

    const chore: ChoreV2 = {
      activity: "Sunflower Harvested",
      description: "Harvest 30 Sunflowers",
      createdAt: now,
      bumpkinId: INITIAL_BUMPKIN.id,
      startCount: 0,
      requirement: 30,
    };

    const state = completeChore({
      createdAt: now,
      action: {
        type: "chore.completed",
        id: 1,
      },
      state: {
        ...cloneDeep(TEST_FARM),

        faction: {
          name: "bumpkins",
          pledgedAt: 0,
          history: {},
          points: 0,
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

    expect(state.inventory["Scroll"]).toEqual(new Decimal(1));
  });

  it("rewards hard tickets", () => {
    const now = new Date("2024-05-09").getTime();

    const chore: ChoreV2 = {
      activity: "Sunflower Harvested",
      description: "Harvest 30 Sunflowers",
      createdAt: now,
      bumpkinId: INITIAL_BUMPKIN.id,
      startCount: 0,
      requirement: 30,
    };

    const state = completeChore({
      createdAt: now,
      action: {
        type: "chore.completed",
        id: 5,
      },
      state: {
        ...cloneDeep(TEST_FARM),

        faction: {
          name: "bumpkins",
          pledgedAt: 0,
          history: {},
          points: 0,
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

    expect(state.inventory["Scroll"]).toEqual(new Decimal(5));
  });

  it("provides +2 tickets for banner holders", () => {
    const now = new Date("2024-05-09").getTime();

    const chore: ChoreV2 = {
      activity: "Sunflower Harvested",
      description: "Harvest 30 Sunflowers",
      createdAt: now,
      bumpkinId: INITIAL_BUMPKIN.id,
      startCount: 0,
      requirement: 30,
    };

    const state = completeChore({
      createdAt: now,
      action: {
        type: "chore.completed",
        id: 4,
      },
      state: {
        ...cloneDeep(TEST_FARM),

        inventory: {
          "Clash of Factions Banner": new Decimal(1),
        },
        faction: {
          name: "bumpkins",
          pledgedAt: 0,
          history: {},
          points: 0,
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

    expect(state.inventory["Scroll"]).toEqual(new Decimal(6));
  });

  it("provides +2 tickets for lifetime banner holders", () => {
    const now = new Date("2024-05-09").getTime();

    const chore: ChoreV2 = {
      activity: "Sunflower Harvested",
      description: "Harvest 30 Sunflowers",
      createdAt: now,
      bumpkinId: INITIAL_BUMPKIN.id,
      startCount: 0,
      requirement: 30,
    };

    const state = completeChore({
      createdAt: now,
      action: {
        type: "chore.completed",
        id: 4,
      },
      state: {
        ...cloneDeep(TEST_FARM),
        inventory: {
          "Lifetime Farmer Banner": new Decimal(1),
        },
        faction: {
          name: "bumpkins",
          pledgedAt: 0,
          history: {},
          points: 0,
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

    expect(state.inventory["Scroll"]).toEqual(new Decimal(6));
  });

  it("provides +1 tickets when Cowboy Hat is worn at Bull Run Season", () => {
    const mockDate = new Date(2024, 11, 11).getTime();
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);

    const chore: ChoreV2 = {
      activity: "Sunflower Harvested",
      description: "Harvest 30 Sunflowers",
      createdAt: mockDate,
      bumpkinId: INITIAL_BUMPKIN.id,
      startCount: 0,
      requirement: 30,
    };

    const state = completeChore({
      createdAt: mockDate,
      action: {
        type: "chore.completed",
        id: 4,
      },
      state: {
        ...TEST_FARM,
        inventory: {},
        faction: {
          name: "bumpkins",
          pledgedAt: 0,
          points: 0,
          history: {},
        },
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: {
            ...INITIAL_BUMPKIN.equipped,
            hat: "Cowboy Hat",
          },
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

    expect(state.inventory[getSeasonalTicket()]).toEqual(new Decimal(5));
  });

  it("provides +1 tickets when Cowboy Shirt is worn at Bull Run Season", () => {
    const mockDate = new Date(2024, 11, 11).getTime();
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);

    const chore: ChoreV2 = {
      activity: "Sunflower Harvested",
      description: "Harvest 30 Sunflowers",
      createdAt: mockDate,
      bumpkinId: INITIAL_BUMPKIN.id,
      startCount: 0,
      requirement: 30,
    };

    const state = completeChore({
      createdAt: mockDate,
      action: {
        type: "chore.completed",
        id: 4,
      },
      state: {
        ...TEST_FARM,
        inventory: {},
        faction: {
          name: "bumpkins",
          pledgedAt: 0,
          points: 0,
          history: {},
        },
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: {
            ...INITIAL_BUMPKIN.equipped,
            shirt: "Cowboy Shirt",
          },
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

    expect(state.inventory[getSeasonalTicket()]).toEqual(new Decimal(5));
  });

  it("provides +1 tickets when Cowboy Trouser is worn at Bull Run Season", () => {
    const mockDate = new Date(2024, 11, 11).getTime();
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);

    const chore: ChoreV2 = {
      activity: "Sunflower Harvested",
      description: "Harvest 30 Sunflowers",
      createdAt: mockDate,
      bumpkinId: INITIAL_BUMPKIN.id,
      startCount: 0,
      requirement: 30,
    };

    const state = completeChore({
      createdAt: mockDate,
      action: {
        type: "chore.completed",
        id: 4,
      },
      state: {
        ...TEST_FARM,
        inventory: {},
        faction: {
          name: "bumpkins",
          pledgedAt: 0,
          points: 0,
          history: {},
        },
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: {
            ...INITIAL_BUMPKIN.equipped,
            pants: "Cowboy Trouser",
          },
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

    expect(state.inventory[getSeasonalTicket()]).toEqual(new Decimal(5));
  });

  it("stacks Cowboy Set boost at Bull Run Season", () => {
    const mockDate = new Date(2024, 11, 11).getTime();
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);

    const chore: ChoreV2 = {
      activity: "Sunflower Harvested",
      description: "Harvest 30 Sunflowers",
      createdAt: mockDate,
      bumpkinId: INITIAL_BUMPKIN.id,
      startCount: 0,
      requirement: 30,
    };

    const state = completeChore({
      createdAt: mockDate,
      action: {
        type: "chore.completed",
        id: 4,
      },
      state: {
        ...TEST_FARM,
        inventory: {},
        faction: {
          name: "bumpkins",
          pledgedAt: 0,
          points: 0,
          history: {},
        },
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: {
            ...INITIAL_BUMPKIN.equipped,
            hat: "Cowboy Hat",
            shirt: "Cowboy Shirt",
            pants: "Cowboy Trouser",
          },
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

    expect(state.inventory[getSeasonalTicket()]).toEqual(new Decimal(7));
  });

  it("does not provide +1 tickets when Cowboy Trouser is worn outside Bull Run Season", () => {
    const mockDate = new Date("2024-10-30T15:00:00Z").getTime();
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);

    const chore: ChoreV2 = {
      activity: "Sunflower Harvested",
      description: "Harvest 30 Sunflowers",
      createdAt: mockDate,
      bumpkinId: INITIAL_BUMPKIN.id,
      startCount: 0,
      requirement: 30,
    };

    const state = completeChore({
      createdAt: mockDate,
      action: {
        type: "chore.completed",
        id: 4,
      },
      state: {
        ...TEST_FARM,
        inventory: {},
        faction: {
          name: "bumpkins",
          pledgedAt: 0,
          points: 0,
          history: {},
        },
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: {
            ...INITIAL_BUMPKIN.equipped,
            pants: "Cowboy Trouser",
          },
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

    expect(state.inventory[getSeasonalTicket()]).toEqual(new Decimal(4));
  });
});
