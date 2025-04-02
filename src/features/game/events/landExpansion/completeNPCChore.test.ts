import { GameState } from "features/game/types/game";
import { completeNPCChore } from "./completeNPCChore";
import {
  INITIAL_BUMPKIN,
  INITIAL_FARM,
  TEST_FARM,
} from "features/game/lib/constants";
import Decimal from "decimal.js-light";
import { NpcChore } from "features/game/types/choreBoard";
import { TEST_BUMPKIN } from "features/game/lib/bumpkinData";

describe("completeNPCChore", () => {
  const CHORE: NpcChore = {
    name: "CHOP_1_TREE",
    reward: { items: { Wood: 1 } },
    initialProgress: 0,
    startedAt: Date.now(),
  };

  it("throws an error if no chore exists for the NPC", () => {
    const state: GameState = {
      ...TEST_FARM,
      choreBoard: {
        chores: {},
      },
    };

    expect(() =>
      completeNPCChore({
        state,
        action: { type: "chore.fulfilled", npcName: "pumpkin' pete" },
      }),
    ).toThrow("No chore exists for this NPC");
  });

  it("throws an error if the chore is already completed", () => {
    const state: GameState = {
      ...TEST_FARM,
      choreBoard: {
        chores: {
          "pumpkin' pete": { ...CHORE, completedAt: Date.now() },
        },
      },
    };

    expect(() =>
      completeNPCChore({
        state,
        action: { type: "chore.fulfilled", npcName: "pumpkin' pete" },
      }),
    ).toThrow("Chore is already completed");
  });

  it("throws an error if chore requirements are not met", () => {
    const state: GameState = {
      ...TEST_FARM,
      bumpkin: {
        ...INITIAL_BUMPKIN,
        activity: {},
      },
      choreBoard: {
        chores: {
          "pumpkin' pete": CHORE,
        },
      },
    };

    expect(() =>
      completeNPCChore({
        state,
        action: { type: "chore.fulfilled", npcName: "pumpkin' pete" },
      }),
    ).toThrow("Chore requirements not met");
  });

  it("completes the chore when requirements are met", () => {
    const state: GameState = {
      ...TEST_FARM,
      bumpkin: {
        ...INITIAL_BUMPKIN,
        activity: { "Tree Chopped": 1 },
      },
      choreBoard: {
        chores: {
          "pumpkin' pete": CHORE,
        },
      },
    };

    const newState = completeNPCChore({
      state,
      action: { type: "chore.fulfilled", npcName: "pumpkin' pete" },
    });

    expect(
      newState.choreBoard.chores["pumpkin' pete"]?.completedAt,
    ).toBeDefined();
  });

  it("completes the chore when requirements are met with initial progress", () => {
    const state: GameState = {
      ...TEST_FARM,
      bumpkin: {
        ...INITIAL_BUMPKIN,
        activity: { "Tree Chopped": 2 },
      },
      choreBoard: {
        chores: {
          "pumpkin' pete": { ...CHORE, initialProgress: 1 },
        },
      },
    };

    const newState = completeNPCChore({
      state,
      action: { type: "chore.fulfilled", npcName: "pumpkin' pete" },
    });

    expect(
      newState.choreBoard.chores["pumpkin' pete"]?.completedAt,
    ).toBeDefined();
  });

  it("provides rewards when completing the chore", () => {
    const state: GameState = {
      ...TEST_FARM,
      bumpkin: {
        ...INITIAL_BUMPKIN,
        activity: { "Tree Chopped": 1 },
      },
      choreBoard: {
        chores: {
          "pumpkin' pete": CHORE,
        },
      },
    };

    const newState = completeNPCChore({
      state,
      action: { type: "chore.fulfilled", npcName: "pumpkin' pete" },
    });

    expect(newState.inventory.Wood).toEqual(new Decimal(1));
  });

  it("increases NPC friendship points when completing the chore", () => {
    const state: GameState = {
      ...TEST_FARM,
      bumpkin: {
        ...INITIAL_BUMPKIN,
        activity: { "Tree Chopped": 1 },
      },
      choreBoard: {
        chores: {
          "pumpkin' pete": CHORE,
        },
      },
    };

    const newState = completeNPCChore({
      state,
      action: { type: "chore.fulfilled", npcName: "pumpkin' pete" },
    });

    expect(newState.npcs?.["pumpkin' pete"]?.friendship?.points).toBe(1);
  });

  it("provides normal ticket rewards", () => {
    const state: GameState = {
      ...TEST_FARM,
      bumpkin: {
        ...INITIAL_BUMPKIN,
        activity: { "Tree Chopped": 1 },
      },
      choreBoard: {
        chores: {
          "pumpkin' pete": {
            ...CHORE,
            reward: { items: { ["Amber Fossil"]: 1 } },
          },
        },
      },
    };

    const newState = completeNPCChore({
      state,
      action: { type: "chore.fulfilled", npcName: "pumpkin' pete" },
      createdAt: new Date("2024-10-22").getTime(),
    });

    expect(newState.inventory["Amber Fossil"]).toEqual(new Decimal(1));
  });

  it("provides VIP ticket rewards", () => {
    const state: GameState = {
      ...TEST_FARM,
      bumpkin: {
        ...INITIAL_BUMPKIN,
        activity: { "Tree Chopped": 1 },
      },
      inventory: {
        "Lifetime Farmer Banner": new Decimal(1),
      },
      choreBoard: {
        chores: {
          "pumpkin' pete": {
            ...CHORE,
            reward: { items: { ["Amber Fossil"]: 1 } },
          },
        },
      },
    };

    const newState = completeNPCChore({
      state,
      action: { type: "chore.fulfilled", npcName: "pumpkin' pete" },
      createdAt: new Date("2024-10-22").getTime(),
    });

    expect(newState.inventory["Amber Fossil"]).toEqual(new Decimal(3));
  });

  it("provides +1 ticket rewards for Cowboy Hat at Bull Run Season", () => {
    const mockDate = new Date(2024, 11, 11);
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
    const state: GameState = {
      ...TEST_FARM,
      bumpkin: {
        ...INITIAL_BUMPKIN,
        activity: { "Tree Chopped": 1 },
        equipped: {
          ...INITIAL_BUMPKIN.equipped,
          hat: "Cowboy Hat",
        },
      },
      inventory: {},
      choreBoard: {
        chores: {
          "pumpkin' pete": {
            ...CHORE,
            reward: { items: { ["Horseshoe"]: 1 } },
          },
        },
      },
    };

    const newState = completeNPCChore({
      state,
      action: { type: "chore.fulfilled", npcName: "pumpkin' pete" },
      createdAt: mockDate.getTime(),
    });

    expect(newState.inventory["Horseshoe"]).toEqual(new Decimal(2));
  });

  it("provides +1 ticket rewards for Cowboy Shirt at Bull Run Season", () => {
    const mockDate = new Date(2024, 11, 11);
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
    const state: GameState = {
      ...TEST_FARM,
      bumpkin: {
        ...INITIAL_BUMPKIN,
        activity: { "Tree Chopped": 1 },
        equipped: {
          ...INITIAL_BUMPKIN.equipped,
          shirt: "Cowboy Shirt",
        },
      },
      inventory: {},
      choreBoard: {
        chores: {
          "pumpkin' pete": {
            ...CHORE,
            reward: { items: { ["Horseshoe"]: 1 } },
          },
        },
      },
    };

    const newState = completeNPCChore({
      state,
      action: { type: "chore.fulfilled", npcName: "pumpkin' pete" },
      createdAt: mockDate.getTime(),
    });

    expect(newState.inventory["Horseshoe"]).toEqual(new Decimal(2));
  });

  it("provides +1 ticket rewards for Cowboy Trouser at Bull Run Season", () => {
    const mockDate = new Date(2024, 11, 11);
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
    const state: GameState = {
      ...TEST_FARM,
      bumpkin: {
        ...INITIAL_BUMPKIN,
        activity: { "Tree Chopped": 1 },
        equipped: {
          ...INITIAL_BUMPKIN.equipped,
          pants: "Cowboy Trouser",
        },
      },
      inventory: {},
      choreBoard: {
        chores: {
          "pumpkin' pete": {
            ...CHORE,
            reward: { items: { ["Horseshoe"]: 1 } },
          },
        },
      },
    };

    const newState = completeNPCChore({
      state,
      action: { type: "chore.fulfilled", npcName: "pumpkin' pete" },
      createdAt: mockDate.getTime(),
    });

    expect(newState.inventory["Horseshoe"]).toEqual(new Decimal(2));
  });

  it("stacks Cowboy Set boost at Bull Run Season", () => {
    const mockDate = new Date(2024, 11, 11);
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
    const state: GameState = {
      ...TEST_FARM,
      bumpkin: {
        ...INITIAL_BUMPKIN,
        activity: { "Tree Chopped": 1 },
        equipped: {
          ...INITIAL_BUMPKIN.equipped,
          hat: "Cowboy Hat",
          shirt: "Cowboy Shirt",
          pants: "Cowboy Trouser",
        },
      },
      inventory: {},
      choreBoard: {
        chores: {
          "pumpkin' pete": {
            ...CHORE,
            reward: { items: { ["Horseshoe"]: 1 } },
          },
        },
      },
    };

    const newState = completeNPCChore({
      state,
      action: { type: "chore.fulfilled", npcName: "pumpkin' pete" },
      createdAt: mockDate.getTime(),
    });

    expect(newState.inventory["Horseshoe"]).toEqual(new Decimal(4));
  });

  it("does not provide +1 tickets when Cowboy Trouser is worn outside Bull Run Season", () => {
    const mockDate = new Date("2024-10-30T15:00:00Z");
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
    const state: GameState = {
      ...TEST_FARM,
      bumpkin: {
        ...INITIAL_BUMPKIN,
        activity: { "Tree Chopped": 1 },
        equipped: {
          ...INITIAL_BUMPKIN.equipped,
          pants: "Cowboy Trouser",
        },
      },
      inventory: {},
      choreBoard: {
        chores: {
          "pumpkin' pete": {
            ...CHORE,
            reward: { items: { ["Horseshoe"]: 1 } },
          },
        },
      },
    };

    const newState = completeNPCChore({
      state,
      action: { type: "chore.fulfilled", npcName: "pumpkin' pete" },
      createdAt: mockDate.getTime(),
    });

    expect(newState.inventory["Horseshoe"]).toEqual(new Decimal(1));
  });

  it("provides +1 ticket rewards for Acorn Hat at Winds of Change", () => {
    const mockDate = new Date(2025, 2, 5);
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
    const state: GameState = {
      ...TEST_FARM,
      bumpkin: {
        ...INITIAL_BUMPKIN,
        activity: { "Tree Chopped": 1 },
        equipped: {
          ...INITIAL_BUMPKIN.equipped,
          hat: "Acorn Hat",
        },
      },
      inventory: {},
      choreBoard: {
        chores: {
          "pumpkin' pete": {
            ...CHORE,
            reward: { items: { ["Timeshard"]: 1 } },
          },
        },
      },
    };

    const newState = completeNPCChore({
      state,
      action: { type: "chore.fulfilled", npcName: "pumpkin' pete" },
      createdAt: mockDate.getTime(),
    });

    expect(newState.inventory["Timeshard"]).toEqual(new Decimal(2));
  });
  it("stacks timeshard boosts at Winds of Change", () => {
    const mockDate = new Date(2025, 2, 5);
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
    const state: GameState = {
      ...TEST_FARM,
      bumpkin: {
        ...INITIAL_BUMPKIN,
        activity: { "Tree Chopped": 1 },
        equipped: {
          ...INITIAL_BUMPKIN.equipped,
          hat: "Acorn Hat",
        },
      },
      inventory: {},
      collectibles: {
        Igloo: [
          {
            id: "123",
            coordinates: { x: -1, y: -1 },
            createdAt: Date.now() - 100,
            readyAt: Date.now() - 100,
          },
        ],
        Hammock: [
          {
            id: "123",
            coordinates: { x: -1, y: -1 },
            createdAt: Date.now() - 100,
            readyAt: Date.now() - 100,
          },
        ],
      },
      choreBoard: {
        chores: {
          "pumpkin' pete": {
            ...CHORE,
            reward: { items: { ["Timeshard"]: 1 } },
          },
        },
      },
    };

    const newState = completeNPCChore({
      state,
      action: { type: "chore.fulfilled", npcName: "pumpkin' pete" },
      createdAt: mockDate.getTime(),
    });

    expect(newState.inventory["Timeshard"]).toEqual(new Decimal(4));
  });
  describe("Love Rush", () => {
    const eventTime = new Date("2025-04-07T15:00:00Z").getTime();
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(eventTime);
    });

    afterEach(() => {
      jest.useRealTimers();
    });
    it("rewards love charms for completing chores during the event", () => {
      const state = completeNPCChore({
        state: {
          ...INITIAL_FARM,
          bumpkin: {
            ...TEST_BUMPKIN,
            activity: { "Tree Chopped": 1 },
          },
          inventory: {},
          choreBoard: {
            chores: {
              "pumpkin' pete": {
                name: "CHOP_1_TREE",
                reward: { coins: 100, items: {} },
                initialProgress: 0,
                startedAt: eventTime,
              },
              bert: {
                name: "CHOP_1_TREE",
                reward: { coins: 100, items: {} },
                initialProgress: 0,
                startedAt: eventTime,
              },
            },
          },
        },
        action: { type: "chore.fulfilled", npcName: "pumpkin' pete" },
        createdAt: eventTime,
      });
      expect(state.inventory["Love Charm"]).toEqual(new Decimal(3));
    });
    it("rewards double love charms for VIPs", () => {
      const state = completeNPCChore({
        state: {
          ...INITIAL_FARM,
          bumpkin: {
            ...TEST_BUMPKIN,
            activity: { "Tree Chopped": 1 },
          },
          inventory: {
            "Lifetime Farmer Banner": new Decimal(1),
          },
          choreBoard: {
            chores: {
              "pumpkin' pete": {
                name: "CHOP_1_TREE",
                reward: { coins: 100, items: {} },
                initialProgress: 0,
                startedAt: eventTime,
              },
              bert: {
                name: "CHOP_1_TREE",
                reward: { coins: 100, items: {} },
                initialProgress: 0,
                startedAt: eventTime,
              },
            },
          },
        },
        action: { type: "chore.fulfilled", npcName: "pumpkin' pete" },
        createdAt: eventTime,
      });
      expect(state.inventory["Love Charm"]).toEqual(new Decimal(6));
    });

    it("rewards 100 extra love charms for completing all chores", () => {
      const state = completeNPCChore({
        state: {
          ...INITIAL_FARM,
          bumpkin: { ...TEST_BUMPKIN, activity: { "Tree Chopped": 21 } },
          inventory: {},
          choreBoard: {
            chores: {
              "pumpkin' pete": {
                name: "CHOP_1_TREE",
                reward: { coins: 100, items: {} },
                initialProgress: 0,
                startedAt: eventTime,
                completedAt: eventTime,
              },
              bert: {
                name: "CHOP_1_TREE",
                reward: { coins: 100, items: {} },
                initialProgress: 0,
                startedAt: eventTime,
                completedAt: eventTime,
              },
              blacksmith: {
                name: "CHOP_1_TREE",
                reward: { coins: 100, items: {} },
                initialProgress: 0,
                startedAt: eventTime,
              },
              betty: {
                name: "CHOP_1_TREE",
                reward: { coins: 100, items: {} },
                initialProgress: 0,
                startedAt: eventTime,
                completedAt: eventTime,
              },
              billy: {
                name: "CHOP_1_TREE",
                reward: { coins: 100, items: {} },
                initialProgress: 0,
                startedAt: eventTime,
                completedAt: eventTime,
              },
              birdie: {
                name: "CHOP_1_TREE",
                reward: { coins: 100, items: {} },
                initialProgress: 0,
                startedAt: eventTime,
                completedAt: eventTime,
              },
              corale: {
                name: "CHOP_1_TREE",
                reward: { coins: 100, items: {} },
                initialProgress: 0,
                startedAt: eventTime,
                completedAt: eventTime,
              },
              cornwell: {
                name: "CHOP_1_TREE",
                reward: { coins: 100, items: {} },
                initialProgress: 0,
                startedAt: eventTime,
                completedAt: eventTime,
              },
              finley: {
                name: "CHOP_1_TREE",
                reward: { coins: 100, items: {} },
                initialProgress: 0,
                startedAt: eventTime,
                completedAt: eventTime,
              },
              finn: {
                name: "CHOP_1_TREE",
                reward: { coins: 100, items: {} },
                initialProgress: 0,
                startedAt: eventTime,
                completedAt: eventTime,
              },
              gambit: {
                name: "CHOP_1_TREE",
                reward: { coins: 100, items: {} },
                initialProgress: 0,
                startedAt: eventTime,
                completedAt: eventTime,
              },
              gordo: {
                name: "CHOP_1_TREE",
                reward: { coins: 100, items: {} },
                initialProgress: 0,
                startedAt: eventTime,
                completedAt: eventTime,
              },
              guria: {
                name: "CHOP_1_TREE",
                reward: { coins: 100, items: {} },
                initialProgress: 0,
                startedAt: eventTime,
                completedAt: eventTime,
              },
              grimbly: {
                name: "CHOP_1_TREE",
                reward: { coins: 100, items: {} },
                initialProgress: 0,
                startedAt: eventTime,
                completedAt: eventTime,
              },
              grimtooth: {
                name: "CHOP_1_TREE",
                reward: { coins: 100, items: {} },
                initialProgress: 0,
                startedAt: eventTime,
                completedAt: eventTime,
              },
              jester: {
                name: "CHOP_1_TREE",
                reward: { coins: 100, items: {} },
                initialProgress: 0,
                startedAt: eventTime,
                completedAt: eventTime,
              },
              miranda: {
                name: "CHOP_1_TREE",
                reward: { coins: 100, items: {} },
                initialProgress: 0,
                startedAt: eventTime,
                completedAt: eventTime,
              },
              "old salty": {
                name: "CHOP_1_TREE",
                reward: { coins: 100, items: {} },
                initialProgress: 0,
                startedAt: eventTime,
                completedAt: eventTime,
              },
              pharaoh: {
                name: "CHOP_1_TREE",
                reward: { coins: 100, items: {} },
                initialProgress: 0,
                startedAt: eventTime,
                completedAt: eventTime,
              },
              raven: {
                name: "CHOP_1_TREE",
                reward: { coins: 100, items: {} },
                initialProgress: 0,
                startedAt: eventTime,
                completedAt: eventTime,
              },
              timmy: {
                name: "CHOP_1_TREE",
                reward: { coins: 100, items: {} },
                initialProgress: 0,
                startedAt: eventTime,
                completedAt: eventTime,
              },
            },
          },
        },
        action: { type: "chore.fulfilled", npcName: "blacksmith" },
        createdAt: eventTime,
      });
      expect(state.inventory["Love Charm"]).toEqual(new Decimal(100 + 7));
    });

    it("doesn't reward love charms for completing chores after the event", () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date("2025-05-05T15:00:00Z").getTime());
      const state = completeNPCChore({
        state: {
          ...INITIAL_FARM,
          bumpkin: {
            ...TEST_BUMPKIN,
            activity: { "Tree Chopped": 1 },
          },
          inventory: {
            "Lifetime Farmer Banner": new Decimal(1),
          },
          choreBoard: {
            chores: {
              "pumpkin' pete": {
                name: "CHOP_1_TREE",
                reward: { coins: 100, items: {} },
                initialProgress: 0,
                startedAt: eventTime,
              },
            },
          },
        },
        action: { type: "chore.fulfilled", npcName: "pumpkin' pete" },
        createdAt: eventTime,
      });
      expect(state.inventory["Love Charm"]).toBeUndefined();
    });
  });
});
