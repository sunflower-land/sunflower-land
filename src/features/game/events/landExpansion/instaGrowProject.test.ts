import { INITIAL_FARM } from "features/game/lib/constants";
import { instantGrowProject } from "./instaGrowProject";
import Decimal from "decimal.js-light";
import { REQUIRED_CHEERS } from "features/game/types/monuments";

describe("instaGrowProject", () => {
  it("requires project can be insta-grown", () => {
    expect(() =>
      instantGrowProject({
        state: INITIAL_FARM,
        action: {
          type: "project.instantGrow",
          project: "Basic Cooking Pot",
        },
      }),
    ).toThrow("Project can not be insta-grown");
  });

  it("requires project exists", () => {
    expect(() =>
      instantGrowProject({
        state: INITIAL_FARM,
        action: {
          type: "project.instantGrow",
          project: "Big Orange",
        },
      }),
    ).toThrow("Project does not exist");
  });

  it("requires project is not already finished", () => {
    expect(() =>
      instantGrowProject({
        state: {
          ...INITIAL_FARM,
          socialFarming: {
            ...INITIAL_FARM.socialFarming,
            villageProjects: {
              "Big Orange": {
                cheers: 100000,
              },
            },
          },
        },
        action: {
          type: "project.instantGrow",
          project: "Big Orange",
        },
      }),
    ).toThrow("Project is already finished");
  });

  it("requires obsidian exists", () => {
    expect(() =>
      instantGrowProject({
        state: {
          ...INITIAL_FARM,
          socialFarming: {
            ...INITIAL_FARM.socialFarming,
            villageProjects: {
              "Big Orange": {
                cheers: 5,
              },
            },
          },
        },
        action: {
          type: "project.instantGrow",
          project: "Big Orange",
        },
      }),
    ).toThrow("Insufficient Obsidian");
  });

  it("burns obsidian", () => {
    const state = instantGrowProject({
      state: {
        ...INITIAL_FARM,
        inventory: {
          ...INITIAL_FARM.inventory,
          Obsidian: new Decimal(5),
        },
        socialFarming: {
          ...INITIAL_FARM.socialFarming,
          villageProjects: {
            "Big Orange": {
              cheers: 5,
            },
          },
        },
      },
      action: {
        type: "project.instantGrow",
        project: "Big Orange",
      },
    });

    expect(state.inventory.Obsidian).toEqual(new Decimal(4));
  });

  it("sets cheers to the required amount", () => {
    const state = instantGrowProject({
      state: {
        ...INITIAL_FARM,
        inventory: {
          ...INITIAL_FARM.inventory,
          Obsidian: new Decimal(5),
        },
        socialFarming: {
          ...INITIAL_FARM.socialFarming,
          villageProjects: {
            "Big Orange": {
              cheers: 5,
            },
          },
        },
      },
      action: {
        type: "project.instantGrow",
        project: "Big Orange",
      },
    });

    expect(
      state.socialFarming?.villageProjects?.["Big Orange"]?.cheers,
    ).toEqual(REQUIRED_CHEERS["Big Orange"]);
  });
});
