import Decimal from "decimal.js-light";
import { GameState, LandExpansion } from "../types/game";
import { TEST_FARM } from "./constants";
import { getLowestGameState, updateExpansions } from "./transforms";

describe("transform", () => {
  it("gets the lowest balance from the first object", () => {
    const lowest = getLowestGameState({
      first: {
        ...TEST_FARM,
        balance: new Decimal(0.5),
      },
      second: {
        ...TEST_FARM,
        balance: new Decimal(5),
      },
    });

    expect(lowest.balance).toEqual(new Decimal(0.5));
  });

  it("gets the lowest balance from the second object", () => {
    const lowest = getLowestGameState({
      first: {
        ...TEST_FARM,
        balance: new Decimal(2),
      },
      second: {
        ...TEST_FARM,
        balance: new Decimal(105),
      },
    });

    expect(lowest.balance).toEqual(new Decimal(2));
  });

  it("gets the lowest inventory", () => {
    const lowest = getLowestGameState({
      first: {
        ...TEST_FARM,
        inventory: {
          Sunflower: new Decimal(5),
          Axe: new Decimal(100),
          Stone: new Decimal(20),
        },
      },
      second: {
        ...TEST_FARM,
        inventory: {
          Sunflower: new Decimal(10),
          Axe: new Decimal(90),
          Gold: new Decimal(0.5),
        },
      },
    });

    expect(lowest.inventory).toEqual({
      Sunflower: new Decimal(5),
      Axe: new Decimal(90),
    });
  });

  describe.only("updateExpansions", () => {
    const oldExpansions: LandExpansion[] = [
      {
        createdAt: 0,
        readyAt: 0,
        plots: {
          0: {
            x: -2,
            y: -1,
            height: 1,
            width: 1,
            crop: {
              plantedAt: 10,
              amount: 1,
              name: "Sunflower",
            },
          },
          1: {
            x: -1,
            y: -1,
            height: 1,
            width: 1,
          },
          2: {
            x: -2,
            y: -2,
            height: 1,
            width: 1,
          },
        } as GameState["plots"],
        trees: {
          0: {
            wood: {
              amount: 3,
              choppedAt: 0,
            },
            x: 1,
            y: 1,
            height: 2,
            width: 2,
          },
        },
      },
    ];

    it("adds a reward to a crop", () => {
      const newExpansions: LandExpansion[] = [
        {
          createdAt: 4,
          readyAt: 0,
          plots: {
            0: {
              x: -2,
              y: -1,
              height: 1,
              width: 1,
              crop: {
                plantedAt: 10,
                amount: 1,
                name: "Sunflower",
                reward: {
                  items: [
                    {
                      name: "Sunflower Seed",
                      amount: 3,
                    },
                  ],
                },
              },
            },
            1: {
              x: -1,
              y: -1,
              height: 1,
              width: 1,
            },
            2: {
              x: -2,
              y: -2,
              height: 1,
              width: 1,
            },
          } as GameState["plots"],

          trees: {
            0: {
              wood: {
                amount: 3,
                choppedAt: 0,
              },
              x: 1,
              y: 1,
              height: 2,
              width: 2,
            },
          },
        },
      ];

      const expansions = updateExpansions(oldExpansions, newExpansions);

      expect(expansions[0]?.plots?.["0"]?.crop?.reward).toBeDefined();
      expect(expansions[0]?.plots?.["0"]?.crop?.reward?.items?.[0].amount).toBe(
        3
      );
    });
  });
});
