import { INITIAL_FARM } from "features/game/lib/constants";
import { buyEventShopItem } from "./buyPortalItem";
import Decimal from "decimal.js-light";
import {
  HALLOWEEN_2026_STORE,
  type EventShopItemName,
} from "features/game/types/minigameShop";
import { HALLOWEEN_2026_EVENT_ITEMS } from "features/game/types/halloween2026EventShop";

describe("minigameItem.bought", () => {
  const now = Date.now();
  it("requries minigame has a shop", () => {
    expect(() =>
      buyEventShopItem({
        createdAt: now,
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
        createdAt: now,
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
        createdAt: now,
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
        createdAt: now,
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
      createdAt: now,
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
        createdAt: now,
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
      createdAt: now,
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
        createdAt: now,
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
      createdAt: now,
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

  it("tracks FLOWER Spent farm activity", () => {
    const state = buyEventShopItem({
      createdAt: now,
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

    expect(state.farmActivity["FLOWER Spent"]).toEqual(20);
  });

  it("buys a collectible with VIP discount", () => {
    const state = buyEventShopItem({
      createdAt: now,
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
      createdAt: now,
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
      createdAt: now,
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
      createdAt: now,
      action: {
        id: "festival-of-colors-2025",
        name: "Floating Toy",
        type: "minigameItem.bought",
      },
      state,
    });

    state = buyEventShopItem({
      createdAt: now,
      action: {
        id: "festival-of-colors-2025",
        name: "Treasure Key",
        type: "minigameItem.bought",
      },
      state,
    });

    state = buyEventShopItem({
      createdAt: now,
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
      createdAt: now,
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
      createdAt: now,
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

  describe("halloween-2026-game-2 tiers", () => {
    const game = (shop?: {
      items?: Record<string, number>;
      wearables?: Record<string, number>;
    }) => ({
      ...INITIAL_FARM,
      balance: new Decimal(1000),
      inventory: { "Halloween Token 2026": new Decimal(10000) },
      minigames: {
        prizes: {},
        games: {
          "halloween-2026-game-2": {
            highscore: 0,
            history: {},
            ...(shop ? { shop: { items: {}, wearables: {}, ...shop } } : {}),
          },
        },
      },
    });

    const buy = (state: ReturnType<typeof game>, name: EventShopItemName) =>
      buyEventShopItem({
        state,
        action: {
          id: "halloween-2026-game-2",
          name,
          type: "minigameItem.bought",
        },
        createdAt: now,
      });

    it("sells basic items straight away", () => {
      const state = buy(game(), "Zombie Hand Toy");

      expect(state.inventory["Zombie Hand Toy"]).toEqual(new Decimal(1));
    });

    it("locks a rare item until 6 different items are bought", () => {
      expect(() =>
        buy(
          game({
            items: {
              "Treasure Key": 1,
              "Halloween Ticket 2026": 40,
              "Destroyed Sign": 5,
              "Zombie Hand Toy": 1,
            },
            wearables: { "Butcher Knife": 1 },
          }),
          "Skeleton Crow",
        ),
      ).toThrow("rare tier is locked");
    });

    it("sells a rare item once 6 different items are bought", () => {
      const state = buy(
        game({
          items: {
            "Treasure Key": 1,
            "Halloween Ticket 2026": 40,
            "Destroyed Sign": 5,
            "Zombie Hand Toy": 1,
          },
          wearables: { "Butcher Knife": 1, "Vampire Footwear": 1 },
        }),
        "Skeleton Crow",
      );

      expect(state.inventory["Skeleton Crow"]).toEqual(new Decimal(1));
    });

    it("locks a mega wearable for a new player", () => {
      expect(() => buy(game(), "Bat Aura")).toThrow("mega tier is locked");
    });

    it("locks the extra tier until every other item is bought", () => {
      expect(() =>
        buy(game({ items: { "Super Totem": 1 } }), "Huge Jack-o'-lantern"),
      ).toThrow("extra tier is locked");
    });

    it("puts every store item in exactly one tier", () => {
      const tiered = Object.values(HALLOWEEN_2026_EVENT_ITEMS).flatMap((tier) =>
        tier.items.map((item) =>
          "wearable" in item ? item.wearable : item.collectible,
        ),
      );

      expect([...tiered].sort()).toEqual(
        Object.keys(HALLOWEEN_2026_STORE).sort(),
      );
    });
  });
});
