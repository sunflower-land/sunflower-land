import Decimal from "decimal.js-light";
import "lib/__mocks__/configMock";
import { TEST_FARM } from "features/game/lib/constants";
import { collectCropReward } from "./collectCropReward";

describe("collectCropReward", () => {
  const dateNow = Date.now();

  it("only checks for rewards on plots that exist", () => {
    expect(() =>
      collectCropReward({
        state: TEST_FARM,
        action: {
          type: "cropReward.collected",
          plotIndex: "30",
        },
        createdAt: dateNow,
      }),
    ).toThrow("Plot does not exist");
  });

  it("only checks for rewards if a crop exists", () => {
    expect(() =>
      collectCropReward({
        state: {
          ...TEST_FARM,
          crops: {
            0: {
              createdAt: Date.now(),
              x: -2,
              y: -1,
              height: 1,
              width: 1,
            },
          },
        },
        action: {
          type: "cropReward.collected",
          plotIndex: "0",
        },
        createdAt: dateNow,
      }),
    ).toThrow("Plot does not have a crop");
  });

  it("checks if plot has reward", () => {
    expect(() =>
      collectCropReward({
        state: {
          ...TEST_FARM,
          crops: {
            0: {
              createdAt: Date.now(),
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
        action: {
          type: "cropReward.collected",
          plotIndex: "0",
        },
        createdAt: dateNow,
      }),
    ).toThrow("Crop does not have a reward");
  });

  it("checks it reward is ready", () => {
    expect(() =>
      collectCropReward({
        state: {
          ...TEST_FARM,
          crops: {
            0: {
              createdAt: Date.now(),
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
        action: {
          type: "cropReward.collected",
          plotIndex: "0",
        },
        createdAt: dateNow,
      }),
    ).toThrow("Not ready");
  });

  it("provides seed rewards", () => {
    const state = collectCropReward({
      state: {
        ...TEST_FARM,
        crops: {
          0: {
            createdAt: Date.now(),
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
      action: {
        type: "cropReward.collected",
        plotIndex: "0",
      },
      createdAt: dateNow,
    });

    const { crops: plots } = state;

    expect(plots?.[0]?.crop?.reward).toBeUndefined();
    expect(state.inventory["Sunflower Seed"]).toEqual(new Decimal(3));
  });

  it("provides gold rewards", () => {
    const state = collectCropReward({
      state: {
        ...TEST_FARM,
        crops: {
          0: {
            createdAt: Date.now(),
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
      action: {
        type: "cropReward.collected",
        plotIndex: "0",
      },
      createdAt: dateNow,
    });

    const { crops: plots } = state;

    expect(plots?.[0]?.crop?.reward).toBeUndefined();
    expect(state.inventory["Gold"]).toEqual(new Decimal(1));
  });

  it("provides sfl rewards", () => {
    const state = collectCropReward({
      state: {
        ...TEST_FARM,
        crops: {
          0: {
            createdAt: Date.now(),
            x: -2,
            y: -1,
            height: 1,
            width: 1,
            crop: {
              name: "Sunflower",
              plantedAt: 0,
              amount: 1,
              reward: {
                coins: 100,
              },
            },
          },
        },
      },
      action: {
        type: "cropReward.collected",
        plotIndex: "0",
      },
      createdAt: dateNow,
    });

    const { crops: plots } = state;

    expect(plots?.[0]?.crop?.reward).toBeUndefined();
    expect(state.coins).toEqual(100);
  });
});
