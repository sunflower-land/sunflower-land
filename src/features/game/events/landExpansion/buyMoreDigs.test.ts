import { TEST_FARM } from "features/game/lib/constants";
import { buyMoreDigs, TOTAL_DIG_SPOTS } from "./buyMoreDigs";
import Decimal from "decimal.js-light";

describe("buyMoreDigs", () => {
  it("throws an error if the player does not have any block bucks", () => {
    expect(() =>
      buyMoreDigs({
        state: {
          ...TEST_FARM,
          inventory: {
            ...TEST_FARM.inventory,
            "Block Buck": undefined,
          },
        },
        action: { type: "desert.digsBought" },
      }),
    ).toThrow("Player does not have enough block bucks to buy more digs");
  });

  it("throws an error if there are no spots left to dig for the current dig site", () => {
    expect(() =>
      buyMoreDigs({
        state: {
          ...TEST_FARM,
          inventory: {
            ...TEST_FARM.inventory,
            "Block Buck": new Decimal(1),
          },
          desert: {
            digging: {
              patterns: [],
              grid: new Array(TOTAL_DIG_SPOTS).fill(null).map(() => ({
                x: 0,
                y: 0,
                formation: [],
                dugAt: 0,
                items: {
                  Sand: 1,
                },
                tool: "Sand Shovel",
              })),
            },
          },
        },
        action: { type: "desert.digsBought" },
      }),
    ).toThrow("No more spots left to dig");
  });

  it("throws an error if the player has extra digs already that will use all remaining digs", () => {
    expect(() =>
      buyMoreDigs({
        state: {
          ...TEST_FARM,
          inventory: {
            ...TEST_FARM.inventory,
            "Block Buck": new Decimal(1),
          },
          desert: {
            digging: {
              extraDigs: 4,
              patterns: [],
              grid: new Array(TOTAL_DIG_SPOTS - 4).fill(null).map(() => ({
                x: 0,
                y: 0,
                formation: [],
                dugAt: 0,
                items: {
                  Sand: 1,
                },
                tool: "Sand Shovel",
              })),
            },
          },
        },
        action: { type: "desert.digsBought" },
      }),
    ).toThrow("No more spots left to dig");
  });

  it("adds 5 extra digs", () => {
    const state = {
      ...TEST_FARM,
      inventory: {
        ...TEST_FARM.inventory,
        "Block Buck": new Decimal(1),
      },
      desert: {
        digging: {
          patterns: [],
          grid: new Array(TOTAL_DIG_SPOTS - 1).fill(null).map(() => ({
            x: 0,
            y: 0,
            formation: [],
            dugAt: 0,
            items: {
              Sand: 1,
            },
            tool: "Sand Shovel",
          })),
        },
      },
    };

    const result = buyMoreDigs({
      state: {
        ...TEST_FARM,
        inventory: {
          ...TEST_FARM.inventory,
          "Block Buck": new Decimal(1),
        },
        desert: {
          digging: {
            patterns: [],
            grid: new Array(TOTAL_DIG_SPOTS - 1).fill(null).map(() => ({
              x: 0,
              y: 0,
              formation: [],
              dugAt: 0,
              items: {
                Sand: 1,
              },
              tool: "Sand Shovel",
            })),
          },
        },
      },
      action: { type: "desert.digsBought" },
    });

    expect(result.desert.digging.extraDigs).toEqual(5);
  });

  it("removes a block buck from the player's inventory", () => {
    const result = buyMoreDigs({
      state: {
        ...TEST_FARM,
        inventory: {
          ...TEST_FARM.inventory,
          "Block Buck": new Decimal(1),
        },
      },
      action: { type: "desert.digsBought" },
    });

    expect(result.inventory["Block Buck"]).toEqual(new Decimal(0));
  });

  it("adds 5 extra digs if the player only has 1 remaining dig left on the site", () => {
    const result = buyMoreDigs({
      state: {
        ...TEST_FARM,
        inventory: {
          ...TEST_FARM.inventory,
          "Block Buck": new Decimal(1),
        },
        desert: {
          digging: {
            patterns: [],
            grid: new Array(TOTAL_DIG_SPOTS - 1).fill(null).map(() => ({
              x: 0,
              y: 0,
              formation: [],
              dugAt: 0,
              items: {
                Sand: 1,
              },
              tool: "Sand Shovel",
            })),
          },
        },
      },
      action: { type: "desert.digsBought" },
    });

    expect(result.desert.digging.extraDigs).toEqual(5);
  });
});
