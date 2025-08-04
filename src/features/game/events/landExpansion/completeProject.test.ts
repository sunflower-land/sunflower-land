import { INITIAL_FARM } from "features/game/lib/constants";
import { completeProject } from "./completeProject";
import Decimal from "decimal.js-light";

describe("completeProject", () => {
  it("throw if the project is not found", () => {
    expect(() =>
      completeProject({
        state: INITIAL_FARM,
        action: {
          type: "project.completed",
          project: "Farmer's Monument",
        },
      }),
    ).toThrow("Project not found");
  });

  it("should throw if the project is not complete", () => {
    expect(() =>
      completeProject({
        state: {
          ...INITIAL_FARM,
          socialFarming: {
            ...INITIAL_FARM.socialFarming,
            villageProjects: {
              "Big Orange": {
                cheers: 0,
              },
            },
          },
        },
        action: {
          type: "project.completed",
          project: "Big Orange",
        },
      }),
    ).toThrow("Project is not complete");
  });

  it("should throw if the project does not have a reward", () => {
    expect(() =>
      completeProject({
        state: {
          ...INITIAL_FARM,
          socialFarming: {
            ...INITIAL_FARM.socialFarming,
            villageProjects: {
              "Farmer's Monument": {
                cheers: 1000,
              },
            },
          },
        },
        action: {
          type: "project.completed",
          project: "Farmer's Monument",
        },
      }),
    ).toThrow("Project does not have a reward");
  });

  it("should add the reward to the inventory", () => {
    const state = completeProject({
      state: {
        ...INITIAL_FARM,
        socialFarming: {
          ...INITIAL_FARM.socialFarming,
          villageProjects: {
            "Big Orange": {
              cheers: 50,
            },
          },
        },
      },
      action: {
        type: "project.completed",
        project: "Big Orange",
      },
    });

    expect(state.inventory["Love Charm"]?.toNumber()).toBe(200);
  });

  it("should remove the project from the village projects", () => {
    const state = completeProject({
      state: {
        ...INITIAL_FARM,
        inventory: {
          ...INITIAL_FARM.inventory,
          "Big Orange": new Decimal(1),
        },
        socialFarming: {
          ...INITIAL_FARM.socialFarming,
          villageProjects: {
            "Big Orange": {
              cheers: 50,
            },
          },
        },
      },
      action: {
        type: "project.completed",
        project: "Big Orange",
      },
    });

    expect(state.socialFarming.villageProjects["Big Orange"]).toBeUndefined();
    expect(state.inventory["Big Orange"]?.toNumber()).toBe(0);
  });

  it("should remove all the placed monuments of this type", () => {
    const state = completeProject({
      state: {
        ...INITIAL_FARM,
        inventory: {
          ...INITIAL_FARM.inventory,
          "Big Orange": new Decimal(1),
        },
        collectibles: {
          ...INITIAL_FARM.collectibles,
          "Big Orange": [
            {
              createdAt: 1,
              readyAt: 1,
              id: "1",
              coordinates: {
                x: 0,
                y: 0,
              },
            },
          ],
        },
        home: {
          collectibles: {
            "Big Orange": [
              {
                createdAt: 1,
                readyAt: 1,
                id: "1",
                coordinates: {
                  x: 0,
                  y: 0,
                },
              },
            ],
          },
        },
        socialFarming: {
          ...INITIAL_FARM.socialFarming,
          villageProjects: {
            "Big Orange": {
              cheers: 50,
            },
          },
        },
      },
      action: {
        type: "project.completed",
        project: "Big Orange",
      },
    });

    expect(state.collectibles["Big Orange"]).toBeUndefined();
    expect(state.home.collectibles["Big Orange"]).toBeUndefined();
  });

  it("should apply 1% love charm boost to the inventory with completed Farmers Monument", () => {
    const state = completeProject({
      state: {
        ...INITIAL_FARM,
        inventory: {
          ...INITIAL_FARM.inventory,
          "Love Charm": new Decimal(0),
          "Farmer's Monument": new Decimal(1),
        },
        socialFarming: {
          ...INITIAL_FARM.socialFarming,
          villageProjects: {
            "Big Orange": {
              cheers: 50,
            },
            "Farmer's Monument": {
              cheers: 10000,
            },
          },
        },
      },
      action: {
        type: "project.completed",
        project: "Big Orange",
      },
    });

    expect(state.inventory["Love Charm"]?.toNumber()).toBe(202);
  });

  it("should apply 4% love charm boost to the inventory with completed Farmers Monument and Woodcutter Monument", () => {
    const state = completeProject({
      state: {
        ...INITIAL_FARM,
        inventory: {
          ...INITIAL_FARM.inventory,
          "Love Charm": new Decimal(0),
          "Farmer's Monument": new Decimal(1),
          "Woodcutter's Monument": new Decimal(1),
        },
        socialFarming: {
          ...INITIAL_FARM.socialFarming,
          villageProjects: {
            "Big Orange": {
              cheers: 50,
            },
            "Farmer's Monument": {
              cheers: 10000,
            },
            "Woodcutter's Monument": {
              cheers: 10000,
            },
          },
        },
      },
      action: {
        type: "project.completed",
        project: "Big Orange",
      },
    });

    expect(state.inventory["Love Charm"]?.toNumber()).toBe(208);
  });

  it("should apply 10% love charm boost to the inventory with completed Farmers Monument, Woodcutter Monument and Miner Monument", () => {
    const state = completeProject({
      state: {
        ...INITIAL_FARM,
        inventory: {
          ...INITIAL_FARM.inventory,
          "Love Charm": new Decimal(0),
          "Farmer's Monument": new Decimal(1),
          "Woodcutter's Monument": new Decimal(1),
        },
        socialFarming: {
          ...INITIAL_FARM.socialFarming,
          villageProjects: {
            "Big Orange": {
              cheers: 50,
            },
            "Farmer's Monument": {
              cheers: 10000,
            },
            "Woodcutter's Monument": {
              cheers: 10000,
            },
            "Miner's Monument": {
              cheers: 10000,
            },
          },
        },
      },
      action: {
        type: "project.completed",
        project: "Big Orange",
      },
    });

    expect(state.inventory["Love Charm"]?.toNumber()).toBe(220);
  });

  it("should apply 20% love charm boost to the inventory with completed Farmers Monument, Woodcutter Monument, Miner Monument and Teamwork Monument", () => {
    const state = completeProject({
      state: {
        ...INITIAL_FARM,
        inventory: {
          ...INITIAL_FARM.inventory,
          "Love Charm": new Decimal(0),
          "Farmer's Monument": new Decimal(1),
          "Woodcutter's Monument": new Decimal(1),
        },
        socialFarming: {
          ...INITIAL_FARM.socialFarming,
          villageProjects: {
            "Big Orange": {
              cheers: 50,
            },
            "Farmer's Monument": {
              cheers: 10000,
            },
            "Woodcutter's Monument": {
              cheers: 10000,
            },
            "Miner's Monument": {
              cheers: 10000,
            },
            "Teamwork Monument": {
              cheers: 10000,
            },
          },
        },
      },
      action: {
        type: "project.completed",
        project: "Big Orange",
      },
    });

    expect(state.inventory["Love Charm"]?.toNumber()).toBe(240);
  });
});
