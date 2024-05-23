import { TEST_FARM } from "features/game/lib/constants";
import { purchaseMinigameItem } from "./purchaseMinigameItem";

describe("minigame.itemPurchased", () => {
  it("requires minigame exists", () => {
    expect(() =>
      purchaseMinigameItem({
        state: TEST_FARM,
        action: {
          id: "not-a-game" as any,
          type: "minigame.itemPurchased",
          sfl: 5,
        },
      })
    ).toThrow("not-a-game is not a valid minigame");
  });

  it("stores the purchase", () => {
    const state = purchaseMinigameItem({
      state: {
        ...TEST_FARM,
        minigames: {
          prizes: {},
          games: {},
        },
      },
      action: {
        id: "chicken-rescue",
        type: "minigame.itemPurchased",
        sfl: 10,
      },
    });

    expect(state.minigames.games["chicken-rescue"]).toEqual({
      highscore: 0,
      history: {},
      purchases: [
        {
          sfl: 10,
          purchasedAt: expect.any(Number),
        },
      ],
    });
  });

  it("stores multiple purchases", () => {
    const state = purchaseMinigameItem({
      state: {
        ...TEST_FARM,
        minigames: {
          prizes: {},
          games: {
            "chicken-rescue": {
              highscore: 10,
              history: {},
              purchases: [
                {
                  sfl: 10,
                  purchasedAt: 10002000,
                },
              ],
            },
          },
        },
      },
      action: {
        id: "chicken-rescue",
        type: "minigame.itemPurchased",
        sfl: 5,
      },
    });

    expect(state.minigames.games["chicken-rescue"]).toEqual({
      highscore: 10,
      history: {},
      purchases: [
        {
          sfl: 10,
          purchasedAt: 10002000,
        },
        {
          sfl: 5,
          purchasedAt: expect.any(Number),
        },
      ],
    });
  });
});
