import { TEST_FARM } from "features/game/lib/constants";
import type { GameState } from "./game";
import { getHelpRequired } from "./monuments";

const GAME_STATE: GameState = {
  ...TEST_FARM,
  socialFarming: {
    ...TEST_FARM.socialFarming,
    villageProjects: {
      "Basic Cooking Pot": { cheers: 0 },
    },
  },
};

describe("getHelpRequired", () => {
  it("counts a project placed on the land", () => {
    const helpRequired = getHelpRequired({
      game: {
        ...GAME_STATE,
        collectibles: {
          "Basic Cooking Pot": [
            {
              id: "1",
              createdAt: 0,
              readyAt: 0,
              coordinates: { x: 0, y: 0 },
            },
          ],
        },
      },
    });

    expect(helpRequired.totalCount).toEqual(1);
    expect(helpRequired.tasks.farm.projects).toEqual(["Basic Cooking Pot"]);
  });

  it("counts a project placed in the legacy home", () => {
    const helpRequired = getHelpRequired({
      game: {
        ...GAME_STATE,
        home: {
          collectibles: {
            "Basic Cooking Pot": [
              {
                id: "1",
                createdAt: 0,
                readyAt: 0,
                coordinates: { x: 0, y: 0 },
              },
            ],
          },
        },
      },
    });

    expect(helpRequired.totalCount).toEqual(1);
    expect(helpRequired.tasks.home.projects).toEqual(["Basic Cooking Pot"]);
  });

  it("counts a project placed on the interior ground floor", () => {
    const helpRequired = getHelpRequired({
      game: {
        ...GAME_STATE,
        interior: {
          ground: {
            collectibles: {
              "Basic Cooking Pot": [
                {
                  id: "1",
                  createdAt: 0,
                  readyAt: 0,
                  coordinates: { x: 0, y: 0 },
                },
              ],
            },
          },
        },
      },
    });

    expect(helpRequired.totalCount).toEqual(1);
    expect(helpRequired.tasks.home.projects).toEqual(["Basic Cooking Pot"]);
  });

  it("counts a project placed on the interior level one floor", () => {
    const helpRequired = getHelpRequired({
      game: {
        ...GAME_STATE,
        interior: {
          ground: { collectibles: {} },
          level_one: {
            collectibles: {
              "Basic Cooking Pot": [
                {
                  id: "1",
                  createdAt: 0,
                  readyAt: 0,
                  coordinates: { x: 0, y: 0 },
                },
              ],
            },
          },
        },
      },
    });

    expect(helpRequired.totalCount).toEqual(1);
    expect(helpRequired.tasks.home.projects).toEqual(["Basic Cooking Pot"]);
  });

  it("does not count a project that is in the interior but not placed", () => {
    const helpRequired = getHelpRequired({
      game: {
        ...GAME_STATE,
        interior: {
          ground: {
            collectibles: {
              "Basic Cooking Pot": [{ id: "1", createdAt: 0, readyAt: 0 }],
            },
          },
        },
      },
    });

    expect(helpRequired.totalCount).toEqual(0);
  });

  it("counts a pet placed on the interior ground floor", () => {
    const helpRequired = getHelpRequired({
      game: {
        ...TEST_FARM,
        pets: {
          common: {
            Barkley: {
              name: "Barkley",
              experience: 0,
              energy: 0,
              requests: { food: [], fedAt: 0 },
              pettedAt: 0,
            },
          },
        },
        interior: {
          ground: {
            collectibles: {
              Barkley: [
                {
                  id: "1",
                  createdAt: 0,
                  readyAt: 0,
                  coordinates: { x: 0, y: 0 },
                },
              ],
            },
          },
        },
      },
    });

    expect(helpRequired.totalCount).toEqual(1);
    expect(helpRequired.tasks.home.pets).toEqual(["Barkley"]);
  });

  it("counts a pet NFT living on an interior floor", () => {
    const helpRequired = getHelpRequired({
      game: {
        ...TEST_FARM,
        pets: {
          nfts: {
            1: {
              id: 1,
              name: "Pet #1",
              location: "level_one",
              coordinates: { x: 0, y: 0 },
              experience: 0,
              energy: 0,
              requests: { food: [], fedAt: 0 },
              pettedAt: 0,
            },
          },
        },
      },
    });

    expect(helpRequired.totalCount).toEqual(1);
    expect(helpRequired.tasks.home.pets).toEqual(["Pet #1"]);
  });
});
