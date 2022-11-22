import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import { collectReward } from "./collectReward";

describe("collectReward", () => {
  const dateNow = Date.now();

  it("only checks for rewards on plots that exist", () => {
    expect(() =>
      collectReward({
        state: TEST_FARM,
        action: {
          type: "reward.collected",
          expansionIndex: 10,
          plotIndex: 30,
        },
        createdAt: dateNow,
      })
    ).toThrow("Plot does not exist");
  });

  it("only checks for rewards if a crop exists", () => {
    expect(() =>
      collectReward({
        state: {
          ...TEST_FARM,
          expansions: [
            {
              createdAt: 0,
              readyAt: 0,
              plots: {
                0: {
                  x: -2,
                  y: -1,
                  height: 1,
                  width: 1,
                },
              },
            },
          ],
        },
        action: {
          type: "reward.collected",
          expansionIndex: 0,
          plotIndex: 0,
        },
        createdAt: dateNow,
      })
    ).toThrow("Plot does not have a crop");
  });

  it("checks if plot has reward", () => {
    expect(() =>
      collectReward({
        state: {
          ...TEST_FARM,
          expansions: [
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
                    name: "Sunflower",
                    plantedAt: dateNow,
                    amount: 1,
                  },
                },
              },
            },
          ],
        },
        action: {
          type: "reward.collected",
          expansionIndex: 0,
          plotIndex: 0,
        },
        createdAt: dateNow,
      })
    ).toThrow("Crop does not have a reward");
  });

  it("checks it reward is ready", () => {
    expect(() =>
      collectReward({
        state: {
          ...TEST_FARM,
          expansions: [
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
                    name: "Sunflower",
                    plantedAt: dateNow,
                    amount: 1,
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
              },
            },
          ],
        },
        action: {
          type: "reward.collected",
          plotIndex: 0,
          expansionIndex: 0,
        },
        createdAt: dateNow,
      })
    ).toThrow("Not ready");
  });

  it("provides seed rewards", () => {
    const state = collectReward({
      state: {
        ...TEST_FARM,
        expansions: [
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
                  name: "Sunflower",
                  plantedAt: 0,
                  amount: 1,
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
            },
          },
        ],
      },
      action: {
        type: "reward.collected",
        plotIndex: 0,
        expansionIndex: 0,
      },
      createdAt: dateNow,
    });

    const { expansions } = state;

    expect(expansions[0].plots?.[0]?.crop?.reward).toBeUndefined();
    expect(state.inventory["Sunflower Seed"]).toEqual(new Decimal(3));
  });

  it("provides gold rewards", () => {
    const state = collectReward({
      state: {
        ...TEST_FARM,
        expansions: [
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
                  name: "Sunflower",
                  plantedAt: 0,
                  amount: 1,
                  reward: {
                    items: [
                      {
                        name: "Gold",
                        amount: 1,
                      },
                    ],
                  },
                },
              },
            },
          },
        ],
      },
      action: {
        type: "reward.collected",
        plotIndex: 0,
        expansionIndex: 0,
      },
      createdAt: dateNow,
    });

    const { expansions } = state;

    expect(expansions[0].plots?.[0]?.crop?.reward).toBeUndefined();
    expect(state.inventory["Gold"]).toEqual(new Decimal(1));
  });

  it("provides sfl rewards", () => {
    const state = collectReward({
      state: {
        ...TEST_FARM,
        expansions: [
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
                  name: "Sunflower",
                  plantedAt: 0,
                  amount: 1,
                  reward: {
                    sfl: new Decimal(10),
                  },
                },
              },
            },
          },
        ],
      },
      action: {
        type: "reward.collected",
        plotIndex: 0,
        expansionIndex: 0,
      },
      createdAt: dateNow,
    });

    const { expansions } = state;

    expect(expansions[0].plots?.[0]?.crop?.reward).toBeUndefined();
    expect(state.balance).toEqual(new Decimal(10));
  });
});
