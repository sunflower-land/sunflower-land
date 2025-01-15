import { GameState } from "features/game/types/game";
import { completeNPCChore } from "./completeNPCChore";
import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import Decimal from "decimal.js-light";
import { NpcChore } from "features/game/types/choreBoard";

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
});
