import { TEST_FARM } from "features/game/lib/constants";
import { getFruitHarvests } from "./utils";

describe("getFruitHarvests", () => {
  it("gets 3-5 harvests if no immortal pear is placed on island", () => {
    const result = getFruitHarvests(
      {
        ...TEST_FARM,
        inventory: {},
        collectibles: {},
      },
      "Apple Seed",
    );
    expect(result).toEqual([3, 5]);
  });
  it("gets 4-6 harvests if immortal pear is placed on island", () => {
    const result = getFruitHarvests(
      {
        ...TEST_FARM,
        inventory: {},
        collectibles: {
          "Immortal Pear": [
            {
              coordinates: {
                x: 1,
                y: 1,
              },
              createdAt: 0,
              id: "123",
              readyAt: 0,
            },
          ],
        },
      },
      "Apple Seed",
    );
    expect(result).toEqual([4, 6]);
  });
});
