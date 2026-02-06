import { INITIAL_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import { startProject } from "./startProject";

describe("startProject", () => {
  const baseState: GameState = INITIAL_FARM;

  it("should throw if the project is not placed", () => {
    const stateWithCompletedProject: GameState = {
      ...baseState,
      socialFarming: {
        ...baseState.socialFarming,
        completedProjects: ["Big Orange"],
      },
      coins: 1000,
    };

    expect(() =>
      startProject({
        state: stateWithCompletedProject,
        action: {
          type: "project.started",
          project: "Big Orange",
        },
        createdAt: Date.now(),
      }),
    ).toThrow("Project is not placed");
  });

  it("should throw if the project is already active", () => {
    const stateWithActiveProject: GameState = {
      ...baseState,
      collectibles: {
        ...baseState.collectibles,
        "Big Orange": [
          {
            id: "1",
            coordinates: { x: 0, y: 0 },
          },
        ],
      },
      socialFarming: {
        ...baseState.socialFarming,
        villageProjects: {
          "Big Orange": {
            cheers: 10,
          },
        },
      },
    };

    expect(() =>
      startProject({
        state: stateWithActiveProject,
        action: {
          type: "project.started",
          project: "Big Orange",
        },
        createdAt: Date.now(),
      }),
    ).toThrow("Project is already active");
  });

  it("should add village project and remove from completedProjects", () => {
    const stateWithInactiveProject: GameState = {
      ...baseState,
      collectibles: {
        ...baseState.collectibles,
        "Big Orange": [
          {
            id: "1",
            coordinates: { x: 0, y: 0 },
          },
        ],
      },
      socialFarming: {
        ...baseState.socialFarming,
        completedProjects: ["Big Orange"],
      },
      coins: 1000,
    };

    const result = startProject({
      state: stateWithInactiveProject,
      action: {
        type: "project.started",
        project: "Big Orange",
      },
      createdAt: Date.now(),
    });

    expect(result.socialFarming.villageProjects["Big Orange"]).toEqual({
      cheers: 0,
    });
    expect(result.socialFarming.completedProjects).not.toContain("Big Orange");
  });

  it("should work when collectible is in home", () => {
    const stateWithInactiveInHome: GameState = {
      ...baseState,
      home: {
        ...baseState.home,
        collectibles: {
          "Big Orange": [
            {
              id: "1",
              coordinates: { x: 0, y: 0 },
            },
          ],
        },
      },
      socialFarming: {
        ...baseState.socialFarming,
        villageProjects: {},
        completedProjects: ["Big Orange"],
      },
      coins: 1000,
    };

    const result = startProject({
      state: stateWithInactiveInHome,
      action: {
        type: "project.started",
        project: "Big Orange",
      },
      createdAt: Date.now(),
    });

    expect(result.socialFarming.villageProjects["Big Orange"]).toEqual({
      cheers: 0,
    });
  });
});
