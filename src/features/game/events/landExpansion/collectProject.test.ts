import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "features/game/lib/constants";
import type { SoloProjectName } from "features/game/types/monuments";
import type { GameState } from "features/game/types/game";
import { collectProject } from "./collectProject";

const now = new Date("2026-09-09T00:00:00Z").getTime();

const withProject = (
  state: GameState,
  cheers: number,
  project: "Big Orange" | "Basic Cooking Pot" = "Big Orange",
): GameState => ({
  ...state,
  socialFarming: {
    ...state.socialFarming,
    villageProjects: {
      ...state.socialFarming.villageProjects,
      [project]: { cheers },
    },
  },
});

describe("collectProject", () => {
  const baseState: GameState = INITIAL_FARM;

  it("throws if the project has not been started", () => {
    expect(() =>
      collectProject({
        state: baseState,
        action: { type: "project.collected", project: "Big Orange" },
        createdAt: now,
      }),
    ).toThrow("Project not found");
  });

  it("throws if the project has not hit the required cheers", () => {
    expect(() =>
      collectProject({
        state: withProject(baseState, 24),
        action: { type: "project.collected", project: "Big Orange" },
        createdAt: now,
      }),
    ).toThrow("Project is not complete");
  });

  // The action type rules this out, but it arrives as JSON from the client, so
  // the reducer has to reject it rather than quietly skip the winner's payout.
  it("throws for a project that hands a prize to a raffle winner", () => {
    expect(() =>
      collectProject({
        state: withProject(baseState, 10, "Basic Cooking Pot"),
        action: {
          type: "project.collected",
          project: "Basic Cooking Pot" as SoloProjectName,
        },
        createdAt: now,
      }),
    ).toThrow("Project must be completed on the server");
  });

  it("rewards the player with the project item", () => {
    const state = collectProject({
      state: withProject(baseState, 25),
      action: { type: "project.collected", project: "Big Orange" },
      createdAt: now,
    });

    expect(state.inventory["Giant Orange"]).toEqual(new Decimal(1));
  });

  it("adds to an existing stack of the reward item", () => {
    const state = collectProject({
      state: {
        ...withProject(baseState, 25),
        inventory: {
          ...baseState.inventory,
          "Giant Orange": new Decimal(3),
        },
      },
      action: { type: "project.collected", project: "Big Orange" },
      createdAt: now,
    });

    expect(state.inventory["Giant Orange"]).toEqual(new Decimal(4));
  });

  it("gives an extra fruit when a Cornucopia is active", () => {
    const withCornucopia: GameState = {
      ...withProject(baseState, 25),
      collectibles: {
        ...baseState.collectibles,
        Cornucopia: [
          {
            id: "1",
            createdAt: now,
            readyAt: now,
            coordinates: { x: 0, y: 0 },
          },
        ],
      },
    };
    withCornucopia.socialFarming.villageProjects.Cornucopia = { cheers: 1000 };

    const state = collectProject({
      state: withCornucopia,
      action: { type: "project.collected", project: "Big Orange" },
      createdAt: now,
    });

    expect(state.inventory["Giant Orange"]).toEqual(new Decimal(2));
    expect(state.boostsUsedAt?.Cornucopia).toEqual(now);
  });

  it("clears the village project and marks it completed", () => {
    const state = collectProject({
      state: withProject(baseState, 25),
      action: { type: "project.collected", project: "Big Orange" },
      createdAt: now,
    });

    expect(state.socialFarming.villageProjects["Big Orange"]).toBeUndefined();
    expect(state.socialFarming.completedProjects).toContain("Big Orange");
  });

  it("does not duplicate an already completed project", () => {
    const state = collectProject({
      state: {
        ...withProject(baseState, 25),
        socialFarming: {
          ...withProject(baseState, 25).socialFarming,
          completedProjects: ["Big Orange"],
        },
      },
      action: { type: "project.collected", project: "Big Orange" },
      createdAt: now,
    });

    expect(state.socialFarming.completedProjects).toEqual(["Big Orange"]);
  });

  it("tracks the completion in farm activity", () => {
    const state = collectProject({
      state: withProject(baseState, 25),
      action: { type: "project.collected", project: "Big Orange" },
      createdAt: now,
    });

    expect(state.farmActivity["Big Orange Completed"]).toEqual(1);
  });
});
