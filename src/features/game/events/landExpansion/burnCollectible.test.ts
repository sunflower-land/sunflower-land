import Decimal from "decimal.js-light";
import { burnCollectible } from "./burnCollectible";
import { TEST_FARM } from "features/game/lib/constants";
import { getExpiryCooldown } from "features/game/lib/collectibleBuilt";

describe("burnCollectible", () => {
  it("requires Hourglass exists", () => {
    expect(() =>
      burnCollectible({
        state: {
          ...TEST_FARM,
          inventory: {
            "Gourmet Hourglass": new Decimal(2),
          },
          home: {
            collectibles: {},
          },
        },
        action: {
          id: "1",
          location: "home",
          name: "Gourmet Hourglass",
          type: "collectible.burned",
        },
      }),
    ).toThrow("Invalid collectible");
  });

  it("burns a Hourglass in the home", () => {
    const state = burnCollectible({
      state: {
        ...TEST_FARM,
        inventory: {
          "Gourmet Hourglass": new Decimal(2),
        },
        home: {
          collectibles: {
            "Gourmet Hourglass": [
              {
                coordinates: {
                  x: 0,
                  y: 0,
                },
                id: "1",
                createdAt: 0,
                readyAt: 0,
              },
            ],
          },
        },
      },
      action: {
        id: "1",
        location: "home",
        name: "Gourmet Hourglass",
        type: "collectible.burned",
      },
    });

    expect(state.inventory["Gourmet Hourglass"]).toEqual(new Decimal(1));
    expect(state.home.collectibles).toEqual({});
  });

  it("burns a Hourglass in the interior", () => {
    const state = burnCollectible({
      state: {
        ...TEST_FARM,
        inventory: {
          "Gourmet Hourglass": new Decimal(2),
        },
        interior: {
          ground: {
            collectibles: {
              "Gourmet Hourglass": [
                {
                  coordinates: {
                    x: 0,
                    y: 0,
                  },
                  id: "1",
                  createdAt: 0,
                  readyAt: 0,
                },
              ],
            },
          },
        },
      },
      action: {
        id: "1",
        location: "interior",
        name: "Gourmet Hourglass",
        type: "collectible.burned",
      },
    });

    expect(state.inventory["Gourmet Hourglass"]).toEqual(new Decimal(1));
    expect(state.interior.ground.collectibles).toEqual({});
  });

  it("burns a Hourglass in level one", () => {
    const state = burnCollectible({
      state: {
        ...TEST_FARM,
        inventory: {
          "Gourmet Hourglass": new Decimal(2),
        },
        interior: {
          ground: { collectibles: {} },
          level_one: {
            collectibles: {
              "Gourmet Hourglass": [
                {
                  coordinates: { x: 0, y: 0 },
                  id: "1",
                  createdAt: 0,
                  readyAt: 0,
                },
              ],
            },
          },
        },
      },
      action: {
        id: "1",
        location: "level_one",
        name: "Gourmet Hourglass",
        type: "collectible.burned",
      },
    });

    expect(state.inventory["Gourmet Hourglass"]).toEqual(new Decimal(1));
    expect(state.interior.level_one?.collectibles).toEqual({});
  });

  it("throws when burning in level one if it is not unlocked", () => {
    expect(() =>
      burnCollectible({
        state: {
          ...TEST_FARM,
          inventory: {
            "Gourmet Hourglass": new Decimal(2),
          },
          interior: { ground: { collectibles: {} } },
        },
        action: {
          id: "1",
          location: "level_one",
          name: "Gourmet Hourglass",
          type: "collectible.burned",
        },
      }),
    ).toThrow("Level one floor has not been unlocked");
  });

  it("burns a Hourglass in the farm", () => {
    const state = burnCollectible({
      state: {
        ...TEST_FARM,
        inventory: {
          "Gourmet Hourglass": new Decimal(1),
        },
        collectibles: {
          "Gourmet Hourglass": [
            {
              coordinates: {
                x: 0,
                y: 0,
              },
              id: "1",
              createdAt: 0,
              readyAt: 0,
            },
            {
              coordinates: {
                x: 0,
                y: 0,
              },
              id: "2",
              createdAt: 0,
              readyAt: 0,
            },
          ],
        },
      },
      action: {
        id: "1",
        location: "farm",
        name: "Gourmet Hourglass",
        type: "collectible.burned",
      },
    });

    expect(state.inventory["Gourmet Hourglass"]).toEqual(new Decimal(0));
    expect(state.collectibles).toEqual({
      "Gourmet Hourglass": [
        {
          coordinates: {
            x: 0,
            y: 0,
          },
          id: "2",
          createdAt: 0,
          readyAt: 0,
        },
      ],
    });
  });

  it("requires Time Warp Totem exists", () => {
    expect(() =>
      burnCollectible({
        state: {
          ...TEST_FARM,
          inventory: {
            "Time Warp Totem": new Decimal(2),
          },
          home: {
            collectibles: {},
          },
        },
        action: {
          id: "1",
          location: "home",
          name: "Time Warp Totem",
          type: "collectible.burned",
        },
      }),
    ).toThrow("Invalid collectible");
  });

  it("burns Time Warp Totem in the home", () => {
    const state = burnCollectible({
      state: {
        ...TEST_FARM,
        inventory: {
          "Time Warp Totem": new Decimal(2),
        },
        home: {
          collectibles: {
            "Time Warp Totem": [
              {
                coordinates: {
                  x: 0,
                  y: 0,
                },
                id: "1",
                createdAt: 0,
                readyAt: 0,
              },
            ],
          },
        },
      },
      action: {
        id: "1",
        location: "home",
        name: "Time Warp Totem",
        type: "collectible.burned",
      },
    });

    expect(state.inventory["Time Warp Totem"]).toEqual(new Decimal(1));
    expect(state.home.collectibles).toEqual({});
  });

  it("burns Time Warp Totem in the farm", () => {
    const state = burnCollectible({
      state: {
        ...TEST_FARM,
        inventory: {
          "Time Warp Totem": new Decimal(1),
        },
        collectibles: {
          "Time Warp Totem": [
            {
              coordinates: {
                x: 0,
                y: 0,
              },
              id: "1",
              createdAt: 0,
              readyAt: 0,
            },
            {
              coordinates: {
                x: 0,
                y: 0,
              },
              id: "2",
              createdAt: 0,
              readyAt: 0,
            },
          ],
        },
      },
      action: {
        id: "1",
        location: "farm",
        name: "Time Warp Totem",
        type: "collectible.burned",
      },
    });

    expect(state.inventory["Time Warp Totem"]).toEqual(new Decimal(0));
    expect(state.collectibles).toEqual({
      "Time Warp Totem": [
        {
          coordinates: {
            x: 0,
            y: 0,
          },
          id: "2",
          createdAt: 0,
          readyAt: 0,
        },
      ],
    });
  });

  it("requires Super Totem exists", () => {
    expect(() =>
      burnCollectible({
        state: {
          ...TEST_FARM,
          inventory: {
            "Super Totem": new Decimal(2),
          },
          home: {
            collectibles: {},
          },
        },
        action: {
          id: "1",
          location: "home",
          name: "Super Totem",
          type: "collectible.burned",
        },
      }),
    ).toThrow("Invalid collectible");
  });

  it("burns Super Totem in the home", () => {
    const state = burnCollectible({
      state: {
        ...TEST_FARM,
        inventory: {
          "Super Totem": new Decimal(2),
        },
        home: {
          collectibles: {
            "Super Totem": [
              {
                coordinates: {
                  x: 0,
                  y: 0,
                },
                id: "1",
                createdAt: 0,
                readyAt: 0,
              },
            ],
          },
        },
      },
      action: {
        id: "1",
        location: "home",
        name: "Super Totem",
        type: "collectible.burned",
      },
    });

    expect(state.inventory["Super Totem"]).toEqual(new Decimal(1));
    expect(state.home.collectibles).toEqual({});
  });

  it("burns Super Totem in the farm", () => {
    const state = burnCollectible({
      state: {
        ...TEST_FARM,
        inventory: {
          "Super Totem": new Decimal(1),
        },
        collectibles: {
          "Super Totem": [
            {
              coordinates: {
                x: 0,
                y: 0,
              },
              id: "1",
              createdAt: 0,
              readyAt: 0,
            },
            {
              coordinates: {
                x: 0,
                y: 0,
              },
              id: "2",
              createdAt: 0,
              readyAt: 0,
            },
          ],
        },
      },
      action: {
        id: "1",
        location: "farm",
        name: "Super Totem",
        type: "collectible.burned",
      },
    });

    expect(state.inventory["Super Totem"]).toEqual(new Decimal(0));
    expect(state.collectibles).toEqual({
      "Super Totem": [
        {
          coordinates: {
            x: 0,
            y: 0,
          },
          id: "2",
          createdAt: 0,
          readyAt: 0,
        },
      ],
    });
  });

  it("requires Shrine exists", () => {
    expect(() =>
      burnCollectible({
        state: {
          ...TEST_FARM,
          inventory: {
            "Hound Shrine": new Decimal(2),
          },
          collectibles: {},
        },
        action: {
          id: "1",
          location: "farm",
          name: "Hound Shrine",
          type: "collectible.burned",
        },
      }),
    ).toThrow("Invalid collectible");
  });

  it("burns a Shrine in the farm", () => {
    const state = burnCollectible({
      state: {
        ...TEST_FARM,
        inventory: {
          "Hound Shrine": new Decimal(1),
        },
        collectibles: {
          "Hound Shrine": [
            {
              coordinates: {
                x: 0,
                y: 0,
              },
              id: "1",
              createdAt: 0,
              readyAt: 0,
            },
            {
              coordinates: {
                x: 0,
                y: 0,
              },
              id: "2",
              createdAt: 0,
              readyAt: 0,
            },
          ],
        },
      },
      action: {
        id: "1",
        location: "farm",
        name: "Hound Shrine",
        type: "collectible.burned",
      },
    });

    expect(state.inventory["Hound Shrine"]).toEqual(new Decimal(0));
    expect(state.collectibles).toEqual({
      "Hound Shrine": [
        {
          coordinates: {
            x: 0,
            y: 0,
          },
          id: "2",
          createdAt: 0,
          readyAt: 0,
        },
      ],
    });
  });

  it("records the active window in boostHistory when a windowed booster is burned", () => {
    const now = Date.now();
    const cooldown = getExpiryCooldown("Harvest Hourglass", TEST_FARM);
    // Anchor the window math to the known rebalanced constant (jest runs flag-on),
    // so an accidental helper misuse in the burn/history path is caught here.
    expect(cooldown).toBe(9 * 60 * 60 * 1000);
    const createdAt = now - cooldown - 1000; // just expired

    const state = burnCollectible({
      state: {
        ...TEST_FARM,
        inventory: { "Harvest Hourglass": new Decimal(1) },
        collectibles: {
          "Harvest Hourglass": [
            {
              coordinates: { x: 0, y: 0 },
              id: "1",
              createdAt,
              readyAt: createdAt,
            },
          ],
        },
      },
      action: {
        id: "1",
        location: "farm",
        name: "Harvest Hourglass",
        type: "collectible.burned",
      },
      createdAt: now,
    });

    // The placed record is gone…
    expect(state.collectibles["Harvest Hourglass"]).toBeUndefined();
    // …but its active window is preserved so in-progress crops keep the credit.
    expect(state.boostHistory?.["Harvest Hourglass"]).toEqual([
      { from: createdAt, to: createdAt + cooldown },
    ]);
  });

  it("records boostHistory for any burned temporary collectible (future-proof)", () => {
    const now = Date.now();
    const cooldown = getExpiryCooldown("Gourmet Hourglass", TEST_FARM);
    const createdAt = now - cooldown - 1000;

    const state = burnCollectible({
      state: {
        ...TEST_FARM,
        inventory: { "Gourmet Hourglass": new Decimal(1) },
        collectibles: {
          "Gourmet Hourglass": [
            {
              coordinates: { x: 0, y: 0 },
              id: "1",
              createdAt,
              readyAt: createdAt,
            },
          ],
        },
      },
      action: {
        id: "1",
        location: "farm",
        name: "Gourmet Hourglass",
        type: "collectible.burned",
      },
      createdAt: now,
    });

    expect(state.boostHistory?.["Gourmet Hourglass"]).toEqual([
      { from: createdAt, to: createdAt + cooldown },
    ]);
  });
});
