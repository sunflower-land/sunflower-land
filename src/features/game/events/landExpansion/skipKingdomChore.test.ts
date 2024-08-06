import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import { skipKingdomChore } from "./skipKingdomChore";
import { GameState } from "features/game/types/game";

describe("skipKingdomChore", () => {
  it("throws if no kingdom chores found", () => {
    expect(() =>
      skipKingdomChore({
        action: {
          type: "kingdomChore.skipped",
          id: 0,
        },
        state: { ...TEST_FARM, bumpkin: INITIAL_BUMPKIN },
      }),
    ).toThrow("Chore not found");
  });

  it("throws if the skip is not available", () => {
    expect(() =>
      skipKingdomChore({
        action: {
          type: "kingdomChore.skipped",
          id: 0,
        },
        state: {
          ...TEST_FARM,
          bumpkin: INITIAL_BUMPKIN,
          kingdomChores: {
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
            skipAvailableAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
            choresCompleted: 0,
            choresSkipped: 0,
          },
        },
      }),
    ).toThrow("Skip is not available");
  });

  it("throws if the chore is not active", () => {
    expect(() =>
      skipKingdomChore({
        action: {
          type: "kingdomChore.skipped",
          id: 0,
        },
        state: {
          ...TEST_FARM,
          bumpkin: INITIAL_BUMPKIN,
          kingdomChores: {
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
            skipAvailableAt: Date.now(),
            choresCompleted: 0,
            choresSkipped: 0,
          },
        },
      }),
    ).toThrow("Chore is not active");
  });

  it("throws if the chore is already skipped", () => {
    expect(() =>
      skipKingdomChore({
        action: {
          type: "kingdomChore.skipped",
          id: 0,
        },
        state: {
          ...TEST_FARM,
          bumpkin: INITIAL_BUMPKIN,
          kingdomChores: {
            chores: [
              {
                activity: "Sunflower Harvested",
                description: "Harvest 30 Sunflowers",
                requirement: 30,
                marks: 3,
                image: "Sunflower",
                startedAt: 0,
                startCount: 0,
                skippedAt: 0,
              },
            ],
            resetsAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
            skipAvailableAt: Date.now(),
            choresCompleted: 0,
            choresSkipped: 0,
          },
        },
      }),
    ).toThrow("Chore was already skipped");
  });

  it("throws if the chore is complete", () => {
    expect(() =>
      skipKingdomChore({
        action: {
          type: "kingdomChore.skipped",
          id: 0,
        },
        state: {
          ...TEST_FARM,
          bumpkin: INITIAL_BUMPKIN,
          kingdomChores: {
            chores: [
              {
                activity: "Sunflower Harvested",
                description: "Harvest 30 Sunflowers",
                requirement: 30,
                marks: 3,
                image: "Sunflower",
                startedAt: 0,
                startCount: 0,
                completedAt: 0,
              },
            ],
            resetsAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
            skipAvailableAt: Date.now(),
            choresCompleted: 0,
            choresSkipped: 0,
          },
        },
      }),
    ).toThrow("Chore is already completed");
  });

  it("updates the skipAvailableAt", () => {
    const createdAt = Date.now();
    const state: GameState = {
      ...TEST_FARM,
      bumpkin: INITIAL_BUMPKIN,
      kingdomChores: {
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
        skipAvailableAt: 0,
        choresCompleted: 0,
        choresSkipped: 0,
      },
    };

    const game = skipKingdomChore({
      action: {
        type: "kingdomChore.skipped",
        id: 0,
      },
      state,
      createdAt,
    });

    expect(game.kingdomChores.skipAvailableAt).toBe(
      createdAt + 24 * 60 * 60 * 1000,
    );
  });

  it("increments the skipped count", () => {
    const state: GameState = {
      ...TEST_FARM,
      bumpkin: INITIAL_BUMPKIN,
      kingdomChores: {
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
        skipAvailableAt: Date.now(),
        choresCompleted: 0,
        choresSkipped: 0,
      },
    };

    const game = skipKingdomChore({
      action: {
        type: "kingdomChore.skipped",
        id: 0,
      },
      state,
    });

    expect(game.kingdomChores.choresSkipped).toBe(1);
  });

  it("sets the chore skippedAt", () => {
    const createdAt = Date.now();
    const state: GameState = {
      ...TEST_FARM,
      bumpkin: INITIAL_BUMPKIN,
      kingdomChores: {
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
        resetsAt: createdAt + 1000 * 60 * 60 * 24 * 7,
        skipAvailableAt: createdAt,
        choresCompleted: 0,
        choresSkipped: 0,
      },
    };

    const game = skipKingdomChore({
      action: {
        type: "kingdomChore.skipped",
        id: 0,
      },
      state,
      createdAt,
    });

    expect(game.kingdomChores.chores[0].skippedAt).toBe(createdAt);
  });

  it("marks the next chore as active", () => {
    const state: GameState = {
      ...TEST_FARM,
      bumpkin: INITIAL_BUMPKIN,
      kingdomChores: {
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
          {
            activity: "Corn Harvested",
            description: "Harvest 30 Corn",
            requirement: 30,
            marks: 3,
            image: "Corn",
          },
        ],
        resetsAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
        skipAvailableAt: Date.now(),
        choresCompleted: 0,
        choresSkipped: 0,
      },
    };

    const game = skipKingdomChore({
      action: {
        type: "kingdomChore.skipped",
        id: 0,
      },
      state,
    });

    expect(game.kingdomChores.chores[1].startedAt).toBeGreaterThan(0);
  });
});
