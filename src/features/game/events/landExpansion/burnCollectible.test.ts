import Decimal from "decimal.js-light";
import { burnCollectible } from "./burnCollectible";
import { TEST_FARM } from "features/game/lib/constants";

describe("burnCollectible", () => {
  it("requires collectible exists", () => {
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

  it("burns a collectible in the home", () => {
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

  it("burns a collectible in the farm", () => {
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
});
