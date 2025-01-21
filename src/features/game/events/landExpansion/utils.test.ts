import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import { getFruitHarvests, getSupportedChickens } from "./utils";

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

describe("getSupportedChickens", () => {
  it("gives the correct amount of supported chicken without chicken coop", () => {
    const result = getSupportedChickens({
      ...TEST_FARM,
      inventory: {},
      buildings: {
        "Hen House": [
          {
            coordinates: {
              x: 0,
              y: 0,
            },
            createdAt: 0,
            id: "123",
            readyAt: 0,
          },
        ],
      },
    });
    expect(result).toBe(10);
  });
  it("gives the correct amount of supported chicken with chicken coop", () => {
    const result = getSupportedChickens({
      ...TEST_FARM,
      inventory: {
        "Chicken Coop": new Decimal(1),
      },
      collectibles: {
        "Chicken Coop": [
          {
            id: "123",
            createdAt: 0,
            coordinates: { x: 1, y: 1 },
            readyAt: 0,
          },
        ],
      },
      buildings: {
        "Hen House": [
          {
            coordinates: {
              x: 0,
              y: 0,
            },
            createdAt: 0,
            id: "123",
            readyAt: 0,
          },
        ],
      },
    });
    expect(result).toBe(15);
  });
});
