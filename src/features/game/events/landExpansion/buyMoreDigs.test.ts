import { TEST_FARM } from "features/game/lib/constants";
import { buyMoreDigs, GRID_DIG_SPOTS } from "./buyMoreDigs";
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

  it("adds 5 extra digs", () => {
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
            grid: new Array(GRID_DIG_SPOTS - 1).fill(null).map(() => ({
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
});
