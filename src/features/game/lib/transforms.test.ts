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

  describe("updateExpansions", () => {
    it("returns old crop values if nothing has changed", () => {
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
          } as GameState["plots"],
        },
      ];

      const newExpansions = [...oldExpansions];

      const expansions = updateExpansions(oldExpansions, newExpansions);

      expect(expansions[0]?.plots?.["0"]?.crop).toEqual(
        oldExpansions[0]?.plots?.["0"]?.crop
      );
    });

    it("adds a reward to a crop", () => {
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
          } as GameState["plots"],
        },
      ];

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
        },
      ];

      const expansions = updateExpansions(oldExpansions, newExpansions);

      expect(expansions[0]?.plots?.["0"]?.crop?.reward).toBeDefined();
      expect(expansions[0]?.plots?.["0"]?.crop?.reward?.items?.[0].amount).toBe(
        3
      );
      expect(expansions[0]?.plots?.["1"]?.crop?.reward).not.toBeDefined();
    });

    it("updated the drop amount for the crop", () => {
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
          } as GameState["plots"],
        },
      ];

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
                amount: 1.25,
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
        },
      ];

      const expansions = updateExpansions(oldExpansions, newExpansions);

      expect(expansions[0]?.plots?.["0"]?.crop?.amount).toBe(1.25);
    });

    it("updates the next drop amount for an updated tree", () => {
      const oldExpansions: LandExpansion[] = [
        {
          createdAt: 0,
          readyAt: 0,
          trees: {
            0: {
              wood: {
                amount: 1,
                choppedAt: 0,
              },
              x: -3,
              y: 3,
              height: 2,
              width: 2,
            },
            1: {
              wood: {
                amount: 1,
                choppedAt: 0,
              },
              x: -3,
              y: 3,
              height: 2,
              width: 2,
            },
          },
        },
      ];

      const newExpansions: LandExpansion[] = [
        {
          createdAt: 0,
          readyAt: 0,
          trees: {
            0: {
              wood: {
                amount: 10,
                choppedAt: 0,
              },
              x: -3,
              y: 3,
              height: 2,
              width: 2,
            },
            1: {
              wood: {
                amount: 1,
                choppedAt: 0,
              },
              x: -3,
              y: 3,
              height: 2,
              width: 2,
            },
          },
        },
      ];

      const expansions = updateExpansions(oldExpansions, newExpansions);

      expect(expansions[0]?.trees?.["0"]?.wood?.amount).toBeDefined();
      expect(expansions[0]?.trees?.["0"]?.wood?.amount).toBe(10);
      expect(expansions[0]?.trees?.["1"]).toEqual(
        oldExpansions[0]?.trees?.["1"]
      );
    });

    it("updates the next drop amount for an updated stone", () => {
      const oldExpansions: LandExpansion[] = [
        {
          createdAt: 0,
          readyAt: 0,
          stones: {
            0: {
              x: 0,
              y: 3,
              width: 1,
              height: 1,
              stone: {
                amount: 1,
                minedAt: 0,
              },
            },
            1: {
              x: 0,
              y: 4,
              width: 1,
              height: 1,
              stone: {
                amount: 1,
                minedAt: 0,
              },
            },
          },
        },
      ];

      const newExpansions: LandExpansion[] = [
        {
          createdAt: 0,
          readyAt: 0,
          stones: {
            0: {
              x: 0,
              y: 3,
              width: 1,
              height: 1,
              stone: {
                amount: 1,
                minedAt: 0,
              },
            },
            1: {
              x: 0,
              y: 4,
              width: 1,
              height: 1,
              stone: {
                amount: 10,
                minedAt: 0,
              },
            },
          },
        },
      ];

      const expansions = updateExpansions(oldExpansions, newExpansions);

      expect(expansions[0]?.stones?.["1"]?.stone?.amount).toBeDefined();
      expect(expansions[0]?.stones?.["1"]?.stone?.amount).toBe(10);
      expect(expansions[0]?.stones?.["0"]).toEqual(
        oldExpansions[0]?.stones?.["0"]
      );
    });

    it("updates the next drop amount for an updated gold", () => {
      const oldExpansions: LandExpansion[] = [
        {
          createdAt: 0,
          readyAt: 0,
          gold: {
            0: {
              x: 0,
              y: 3,
              width: 1,
              height: 1,
              stone: {
                amount: 1,
                minedAt: 0,
              },
            },
            1: {
              x: 0,
              y: 4,
              width: 1,
              height: 1,
              stone: {
                amount: 1,
                minedAt: 0,
              },
            },
          },
        },
      ];

      const newExpansions: LandExpansion[] = [
        {
          createdAt: 0,
          readyAt: 0,
          gold: {
            0: {
              x: 0,
              y: 3,
              width: 1,
              height: 1,
              stone: {
                amount: 1,
                minedAt: 0,
              },
            },
            1: {
              x: 0,
              y: 4,
              width: 1,
              height: 1,
              stone: {
                amount: 10,
                minedAt: 0,
              },
            },
          },
        },
      ];

      const expansions = updateExpansions(oldExpansions, newExpansions);

      expect(expansions[0]?.gold?.["1"]?.stone?.amount).toBeDefined();
      expect(expansions[0]?.gold?.["1"]?.stone?.amount).toBe(10);
      expect(expansions[0]?.gold?.["0"]).toEqual(oldExpansions[0]?.gold?.["0"]);
    });

    it("updates the next drop amount for an updated iron", () => {
      const oldExpansions: LandExpansion[] = [
        {
          createdAt: 0,
          readyAt: 0,
          iron: {
            0: {
              x: 0,
              y: 3,
              width: 1,
              height: 1,
              stone: {
                amount: 1,
                minedAt: 0,
              },
            },
            1: {
              x: 0,
              y: 4,
              width: 1,
              height: 1,
              stone: {
                amount: 1,
                minedAt: 0,
              },
            },
          },
        },
      ];

      const newExpansions: LandExpansion[] = [
        {
          createdAt: 0,
          readyAt: 0,
          iron: {
            0: {
              x: 0,
              y: 3,
              width: 1,
              height: 1,
              stone: {
                amount: 1,
                minedAt: 0,
              },
            },
            1: {
              x: 0,
              y: 4,
              width: 1,
              height: 1,
              stone: {
                amount: 10,
                minedAt: 0,
              },
            },
          },
        },
      ];

      const expansions = updateExpansions(oldExpansions, newExpansions);

      expect(expansions[0]?.iron?.["1"]?.stone?.amount).toBeDefined();
      expect(expansions[0]?.iron?.["1"]?.stone?.amount).toBe(10);
      expect(expansions[0]?.iron?.["0"]).toEqual(oldExpansions[0]?.iron?.["0"]);
    });
  });
});
