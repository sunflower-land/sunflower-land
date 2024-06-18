import Decimal from "decimal.js-light";
import { purchaseMinigameItem } from "./purchaseMinigameItem";
import { TEST_FARM } from "features/game/lib/constants";

describe("minigame.itemPurchased", () => {
  it("requires minigame exists", () => {
    expect(() =>
      purchaseMinigameItem({
        state: TEST_FARM,
        action: {
          id: "not-a-game" as any,
          type: "minigame.itemPurchased",
          sfl: 5,
          items: {},
        },
      })
    ).toThrow("not-a-game is not a valid minigame");
  });

  it("requires player has SFL", () => {
    expect(() =>
      purchaseMinigameItem({
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
          items: {},
        },
      })
    ).toThrow("Insufficient SFL");
  });

  it("requires purchase is within SFL limit", () => {
    expect(() =>
      purchaseMinigameItem({
        state: {
          ...TEST_FARM,
          balance: new Decimal(10000000),
          minigames: {
            prizes: {},
            games: {},
          },
        },
        action: {
          id: "chicken-rescue",
          type: "minigame.itemPurchased",
          sfl: 101,
          items: {},
        },
      })
    ).toThrow("SFL is greater than purchase limit");
  });

  it("requires player has resources", () => {
    expect(() =>
      purchaseMinigameItem({
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
          sfl: 0,
          items: { Eggplant: 25 },
        },
      })
    ).toThrow("Insufficient resource: Eggplant");
  });

  it("requires resources are in purchase limit", () => {
    expect(() =>
      purchaseMinigameItem({
        state: {
          ...TEST_FARM,
          inventory: {
            Eggplant: new Decimal(10000),
          },
          minigames: {
            prizes: {},
            games: {},
          },
        },
        action: {
          id: "chicken-rescue",
          type: "minigame.itemPurchased",
          sfl: 0,
          items: { Eggplant: 1250 },
        },
      })
    ).toThrow("Purchase limit exceeded: Eggplant");
  });

  it("spends resources", () => {
    const state = purchaseMinigameItem({
      state: {
        ...TEST_FARM,
        inventory: {
          Sunflower: new Decimal(100),
          Eggplant: new Decimal(100),
        },
        minigames: {
          prizes: {},
          games: {},
        },
      },
      action: {
        id: "chicken-rescue",
        type: "minigame.itemPurchased",
        sfl: 0,
        items: { Eggplant: 20 },
      },
    });

    expect(state.inventory).toEqual({
      Sunflower: new Decimal(100),
      Eggplant: new Decimal(80),
    });

    expect(state.minigames.games["chicken-rescue"]).toEqual({
      highscore: 0,
      history: {},
      purchases: [
        {
          sfl: 0,
          items: { Eggplant: 20 },
          purchasedAt: expect.any(Number),
        },
      ],
    });
  });

  it("spends SFL", () => {
    const state = purchaseMinigameItem({
      state: {
        ...TEST_FARM,
        balance: new Decimal(25),
        minigames: {
          prizes: {},
          games: {},
        },
      },
      action: {
        id: "chicken-rescue",
        type: "minigame.itemPurchased",
        sfl: 10,
        items: {},
      },
    });

    expect(state.balance).toEqual(new Decimal(15));
    expect(state.minigames.games["chicken-rescue"]).toEqual({
      highscore: 0,
      history: {},
      purchases: [
        {
          sfl: 10,
          purchasedAt: expect.any(Number),
          items: {},
        },
      ],
    });
  });

  it("stores multiple purchases", () => {
    const state = purchaseMinigameItem({
      state: {
        ...TEST_FARM,
        balance: new Decimal(100),
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
                  items: {},
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
        items: {},
      },
    });

    expect(state.minigames.games["chicken-rescue"]).toEqual({
      highscore: 10,
      history: {},
      purchases: [
        {
          sfl: 10,
          purchasedAt: 10002000,
          items: {},
        },
        {
          sfl: 5,
          purchasedAt: expect.any(Number),
          items: {},
        },
      ],
    });
  });
});
