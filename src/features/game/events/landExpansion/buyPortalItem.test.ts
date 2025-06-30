import { INITIAL_FARM } from "features/game/lib/constants";
import { buyEventShopItem } from "./buyPortalItem";
import Decimal from "decimal.js-light";

describe("minigameItem.bought", () => {
  it("requries minigame has a shop", () => {
    expect(() =>
      buyEventShopItem({
        action: {
          id: "board-game",
          name: "Bunny Mask",
          type: "minigameItem.bought",
        },
        state: {
          ...INITIAL_FARM,
          minigames: {
            prizes: {},
            games: {
              "board-game": {
                highscore: 0,
                history: {},
              },
            },
          },
        },
      }),
    ).toThrow("Minigame does not have a shop");
  });

  it("requries shop has item", () => {
    expect(() =>
      buyEventShopItem({
        action: {
          id: "festival-of-colors-2025",
          name: "Bunny Mask",
          type: "minigameItem.bought",
        },
        state: {
          ...INITIAL_FARM,
          minigames: {
            prizes: {},
            games: {
              "festival-of-colors-2025": {
                highscore: 0,
                history: {},
              },
            },
          },
        },
      }),
    ).toThrow("Item not found in Shop");
  });
  it("requries player has flower", () => {
    expect(() =>
      buyEventShopItem({
        action: {
          id: "festival-of-colors-2025",
          name: "Floating Toy",
          type: "minigameItem.bought",
        },
        state: {
          ...INITIAL_FARM,
          minigames: {
            prizes: {},
            games: {
              "festival-of-colors-2025": {
                highscore: 0,
                history: {},
              },
            },
          },
        },
      }),
    ).toThrow("Insufficient SFL");
  });
  it("requries player has ingredients", () => {
    expect(() =>
      buyEventShopItem({
        action: {
          id: "festival-of-colors-2025",
          name: "Paint Buckets",
          type: "minigameItem.bought",
        },
        state: {
          ...INITIAL_FARM,
          minigames: {
            prizes: {},
            games: {
              "festival-of-colors-2025": {
                highscore: 0,
                history: {},
              },
            },
          },
        },
      }),
    ).toThrow("Insufficient Colors Token 2025");
  });

  it("requires player has not already bought collectible", () => {
    const state = buyEventShopItem({
      action: {
        id: "festival-of-colors-2025",
        name: "Treasure Key",
        type: "minigameItem.bought",
      },
      state: {
        ...INITIAL_FARM,
        inventory: { "Colors Token 2025": new Decimal(1000) },
        minigames: {
          prizes: {},
          games: {
            "festival-of-colors-2025": {
              highscore: 0,
              history: {},
            },
          },
        },
      },
    });

    expect(() =>
      buyEventShopItem({
        action: {
          id: "festival-of-colors-2025",
          name: "Treasure Key",
          type: "minigameItem.bought",
        },
        state,
      }),
    ).toThrow("Item already purchased");
  });

  it("requires player has not already bought wearable", () => {
    const state = buyEventShopItem({
      action: {
        id: "festival-of-colors-2025",
        name: "Paint Splattered Hair",
        type: "minigameItem.bought",
      },
      state: {
        ...INITIAL_FARM,
        inventory: { "Colors Token 2025": new Decimal(1000) },
        minigames: {
          prizes: {},
          games: {
            "festival-of-colors-2025": {
              highscore: 0,
              history: {},
            },
          },
        },
      },
    });

    expect(() =>
      buyEventShopItem({
        action: {
          id: "festival-of-colors-2025",
          name: "Paint Splattered Hair",
          type: "minigameItem.bought",
        },
        state,
      }),
    ).toThrow("Wearable already purchased");
  });

  it("buys a collectible", () => {
    const state = buyEventShopItem({
      action: {
        id: "festival-of-colors-2025",
        name: "Floating Toy",
        type: "minigameItem.bought",
      },
      state: {
        ...INITIAL_FARM,
        balance: new Decimal(100),
        inventory: { "Colors Token 2025": new Decimal(1000) },
        minigames: {
          prizes: {},
          games: {
            "festival-of-colors-2025": {
              highscore: 0,
              history: {},
            },
          },
        },
      },
    });

    expect(state.balance).toEqual(new Decimal(80));
    expect(state.inventory["Floating Toy"]).toEqual(new Decimal(1));

    expect(state.minigames.games["festival-of-colors-2025"]!.shop).toEqual({
      items: {
        "Floating Toy": 1,
      },
      wearables: {},
    });
  });

  it("buys a collectible with VIP discount", () => {
    const state = buyEventShopItem({
      action: {
        id: "festival-of-colors-2025",
        name: "Floating Toy",
        type: "minigameItem.bought",
      },
      state: {
        ...INITIAL_FARM,
        vip: {
          bundles: [],
          expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 30,
        },
        balance: new Decimal(100),
        inventory: { "Colors Token 2025": new Decimal(1000) },
        minigames: {
          prizes: {},
          games: {
            "festival-of-colors-2025": {
              highscore: 0,
              history: {},
            },
          },
        },
      },
    });

    expect(state.balance).toEqual(new Decimal(90));
    expect(state.inventory["Floating Toy"]).toEqual(new Decimal(1));

    expect(state.minigames.games["festival-of-colors-2025"]!.shop).toEqual({
      items: {
        "Floating Toy": 1,
      },
      wearables: {},
    });
  });

  it("buys a wearable", () => {
    const state = buyEventShopItem({
      action: {
        id: "festival-of-colors-2025",
        name: "Paint Splattered Hair",
        type: "minigameItem.bought",
      },
      state: {
        ...INITIAL_FARM,
        balance: new Decimal(100),
        inventory: { "Colors Token 2025": new Decimal(1000) },
        minigames: {
          prizes: {},
          games: {
            "festival-of-colors-2025": {
              highscore: 0,
              history: {},
            },
          },
        },
      },
    });

    expect(state.inventory["Colors Token 2025"]).toEqual(new Decimal(850));
    expect(state.wardrobe["Paint Splattered Hair"]).toEqual(1);

    expect(state.minigames.games["festival-of-colors-2025"]!.shop).toEqual({
      items: {},
      wearables: {
        "Paint Splattered Hair": 1,
      },
    });
  });
  it("buys multiple", () => {
    let state = buyEventShopItem({
      action: {
        id: "festival-of-colors-2025",
        name: "Paint Splattered Hair",
        type: "minigameItem.bought",
      },
      state: {
        ...INITIAL_FARM,
        balance: new Decimal(100),
        inventory: { "Colors Token 2025": new Decimal(1000) },
        minigames: {
          prizes: {},
          games: {
            "festival-of-colors-2025": {
              highscore: 0,
              history: {},
            },
          },
        },
      },
    });

    state = buyEventShopItem({
      action: {
        id: "festival-of-colors-2025",
        name: "Floating Toy",
        type: "minigameItem.bought",
      },
      state,
    });

    state = buyEventShopItem({
      action: {
        id: "festival-of-colors-2025",
        name: "Treasure Key",
        type: "minigameItem.bought",
      },
      state,
    });

    state = buyEventShopItem({
      action: {
        id: "festival-of-colors-2025",
        name: "Paint Splattered Overalls",
        type: "minigameItem.bought",
      },
      state,
    });

    expect(state.wardrobe["Paint Splattered Hair"]).toEqual(1);
    expect(state.wardrobe["Paint Splattered Overalls"]).toEqual(1);
    expect(state.inventory["Treasure Key"]).toEqual(new Decimal(1));
    expect(state.inventory["Floating Toy"]).toEqual(new Decimal(1));

    expect(state.minigames.games["festival-of-colors-2025"]!.shop).toEqual({
      items: {
        "Floating Toy": 1,
        "Treasure Key": 1,
      },
      wearables: {
        "Paint Splattered Hair": 1,
        "Paint Splattered Overalls": 1,
      },
    });
  });

  it("buys multiple of same item under the max", () => {
    let state = buyEventShopItem({
      action: {
        id: "festival-of-colors-2025",
        name: "Colors Ticket 2025",
        type: "minigameItem.bought",
      },
      state: {
        ...INITIAL_FARM,
        balance: new Decimal(100),
        inventory: { "Colors Token 2025": new Decimal(1000) },
        minigames: {
          prizes: {},
          games: {
            "festival-of-colors-2025": {
              highscore: 0,
              history: {},
            },
          },
        },
      },
    });

    state = buyEventShopItem({
      action: {
        id: "festival-of-colors-2025",
        name: "Colors Ticket 2025",
        type: "minigameItem.bought",
      },
      state,
    });

    expect(state.inventory["Colors Ticket 2025"]).toEqual(new Decimal(2));

    expect(state.minigames.games["festival-of-colors-2025"]!.shop).toEqual({
      items: {
        "Colors Ticket 2025": 2,
      },
      wearables: {},
    });
  });
});
