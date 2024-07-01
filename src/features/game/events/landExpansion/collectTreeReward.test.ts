import { TEST_FARM } from "features/game/lib/constants";
import { collectTreeReward } from "features/game/events/landExpansion/collectTreeReward";

describe("collectTreeReward", () => {
  const dateNow = Date.now();

  it("only checks for rewards on tree that exist", () => {
    expect(() =>
      collectTreeReward({
        state: TEST_FARM,
        action: {
          type: "treeReward.collected",
          treeIndex: "30",
        },
        createdAt: dateNow,
      }),
    ).toThrow("Tree does not exist");
  });

  it("checks if tree has reward", () => {
    expect(() =>
      collectTreeReward({
        state: {
          ...TEST_FARM,
          trees: {
            0: {
              x: -2,
              y: -1,
              height: 1,
              width: 1,
              wood: {
                choppedAt: dateNow,
                amount: 1,
              },
            },
          },
        },
        action: {
          type: "treeReward.collected",
          treeIndex: "0",
        },
        createdAt: dateNow,
      }),
    ).toThrow("Tree does not have a reward");
  });

  it("checks it reward is ready", () => {
    expect(() =>
      collectTreeReward({
        state: {
          ...TEST_FARM,
          trees: {
            0: {
              x: -2,
              y: -1,
              height: 1,
              width: 1,
              wood: {
                choppedAt: dateNow,
                amount: 1,
                reward: {
                  coins: 100,
                },
              },
            },
          },
        },
        action: {
          type: "treeReward.collected",
          treeIndex: "0",
        },
        createdAt: dateNow,
      }),
    ).toThrow("Tree is still growing");
  });

  it("provides coin rewards", () => {
    const state = collectTreeReward({
      state: {
        ...TEST_FARM,
        trees: {
          0: {
            x: -2,
            y: -1,
            height: 1,
            width: 1,
            wood: {
              choppedAt: 0,
              amount: 1,
              reward: {
                coins: 100,
              },
            },
          },
        },
      },
      action: {
        type: "treeReward.collected",
        treeIndex: "0",
      },
      createdAt: dateNow,
    });

    const { trees } = state;

    expect(trees?.[0]?.wood?.reward).toBeUndefined();
    expect(state.coins).toEqual(100);
  });
});
