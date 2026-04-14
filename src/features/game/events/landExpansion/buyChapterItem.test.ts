import Decimal from "decimal.js-light";
import { buyChapterItem } from "./buyChapterItem";
import { TEST_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";

describe("buyChapterItem", () => {
  const mockState: GameState = {
    ...TEST_FARM,
    balance: new Decimal(1000),
    inventory: {
      Wood: new Decimal(100),
    },
    wardrobe: {},
  };

  const mockDate = new Date("2024-08-01T00:00:00Z").getTime();

  // Remove beforeEach and afterEach hooks

  it("throws an error if the item is not found in the chapter store", () => {
    expect(() =>
      buyChapterItem({
        state: mockState,
        action: {
          type: "chapterItem.bought",
          name: "Non-existent Item" as any,
          tier: "basic",
        },
        createdAt: mockDate,
      }),
    ).toThrow("Item not found in the chapter store");
  });

  it("throws an error if the player doesn't have enough SFL", () => {
    const poorState = { ...mockState, balance: new Decimal(0) };
    expect(() =>
      buyChapterItem({
        state: poorState,
        action: {
          type: "chapterItem.bought",
          name: "Treasure Key",
          tier: "basic",
        },
        createdAt: mockDate,
      }),
    ).toThrow("Insufficient SFL");
  });

  it("throws an error if the player doesn't have enough items", () => {
    const lowInventoryState = {
      ...mockState,
      inventory: { Wood: new Decimal(0) },
    };
    expect(() =>
      buyChapterItem({
        state: lowInventoryState,
        action: {
          type: "chapterItem.bought",
          name: "Basic Bear",
          tier: "basic",
        },
        createdAt: mockDate,
      }),
    ).toThrow("Insufficient Wood");
  });

  it("subtracts SFL when buying an item", () => {
    const result = buyChapterItem({
      state: mockState,
      action: {
        type: "chapterItem.bought",
        name: "Treasure Key",
        tier: "basic",
      },
      createdAt: mockDate,
    });

    expect(result.balance).toEqual(new Decimal(990));
  });

  it("subtracts items when buying an item", () => {
    const result = buyChapterItem({
      state: mockState,
      action: {
        type: "chapterItem.bought",
        name: "Basic Bear",
        tier: "basic",
      },
      createdAt: mockDate,
    });

    expect(result.inventory.Wood).toEqual(new Decimal(99));
  });

  it("successfully buys a collectible item", () => {
    const result = buyChapterItem({
      state: mockState,
      action: {
        type: "chapterItem.bought",
        name: "Basic Bear",
        tier: "basic",
      },
      createdAt: mockDate,
    });

    expect(result.inventory["Basic Bear"]).toEqual(new Decimal(1));
  });

  it("successfully buys a wearable item", () => {
    const result = buyChapterItem({
      state: mockState,
      action: {
        type: "chapterItem.bought",
        name: "Red Farmer Shirt",
        tier: "basic",
      },
      createdAt: mockDate,
    });

    expect(result.wardrobe["Red Farmer Shirt"]).toEqual(1);
  });

  it("throws an error if key already bought today", () => {
    expect(() =>
      buyChapterItem({
        state: {
          ...mockState,
          inventory: {
            "Treasure Key": new Decimal(0),
            Wood: new Decimal(100),
          },
          megastore: {
            boughtAt: {
              "Treasure Key": new Date("2024-08-09").getTime(),
            },
          },
        },
        action: {
          type: "chapterItem.bought",
          name: "Treasure Key",
          tier: "basic",
        },
        createdAt: new Date("2024-08-09").getTime(),
      }),
    ).toThrow("Item cannot be bought while in cooldown");
  });

  it("updates createdAt when key is bought", () => {
    const state = buyChapterItem({
      state: {
        ...mockState,
        inventory: {
          "Treasure Key": new Decimal(0),
          Wood: new Decimal(100),
        },
      },
      action: {
        type: "chapterItem.bought",
        name: "Treasure Key",
        tier: "basic",
      },
      createdAt: new Date("2024-09-01").getTime(),
    });
    expect(state.inventory["Treasure Key"]).toStrictEqual(new Decimal(1));
    expect(state.inventory.Wood).toStrictEqual(new Decimal(0));
    expect(state.megastore?.boughtAt["Treasure Key"]).toEqual(
      new Date("2024-09-01").getTime(),
    );
  });

  it("throws an error if Acorn House item is already crafted", () => {
    const mockedDate = new Date(2025, 1, 5);
    jest.useFakeTimers();
    jest.setSystemTime(mockedDate);
    expect(() =>
      buyChapterItem({
        state: {
          ...mockState,
          balance: new Decimal(5),
          inventory: {
            "Acorn House": new Decimal(0),
          },
          farmActivity: { "Acorn House Bought": 1 },
        },
        action: {
          type: "chapterItem.bought",
          name: "Acorn House",
          tier: "basic",
        },
        createdAt: new Date("2025-02-05").getTime(),
      }),
    ).toThrow("This item has already been crafted");
  });

  it("does not throw an error if Treasure Key item is already crafted", () => {
    const mockedDate = new Date(2025, 1, 5);
    jest.useFakeTimers();
    jest.setSystemTime(mockedDate);
    const state = buyChapterItem({
      state: {
        ...mockState,
        balance: new Decimal(5),
        inventory: {
          "Treasure Key": new Decimal(1),
          Timeshard: new Decimal(300),
        },
        farmActivity: {
          "Treasure Key Bought": 1,
        },
      },
      action: {
        type: "chapterItem.bought",
        name: "Treasure Key",
        tier: "basic",
      },
      createdAt: new Date("2025-02-05").getTime(),
    });
    expect(state.inventory["Treasure Key"]).toStrictEqual(new Decimal(2));
    expect(state.farmActivity["Treasure Key Bought"])?.toEqual(2);
    expect(state.inventory["Timeshard"]).toStrictEqual(new Decimal(100));
  });

  it("throws an error if Igloo item is already crafted", () => {
    const mockedDate = new Date(2025, 1, 5);
    jest.useFakeTimers();
    jest.setSystemTime(mockedDate);
    expect(() =>
      buyChapterItem({
        state: {
          ...mockState,
          balance: new Decimal(5),
          inventory: {
            Timeshard: new Decimal(600),
          },
          farmActivity: {
            "Acorn House Bought": 1,
            "Kite Bought": 1,
            "Spring Duckling Bought": 1,
            "Acorn Hat Bought": 1,
            "Igloo Bought": 1,
          },
        },
        action: {
          type: "chapterItem.bought",
          name: "Igloo",
          tier: "rare",
        },
        createdAt: new Date("2025-02-05").getTime(),
      }),
    ).toThrow("This item has already been crafted");
  });

  it("does not throw an error if Rare Key item is already crafted", () => {
    const mockedDate = new Date(2025, 1, 5);
    jest.useFakeTimers();
    jest.setSystemTime(mockedDate);

    const state = buyChapterItem({
      state: {
        ...mockState,
        balance: new Decimal(5),
        inventory: {
          Timeshard: new Decimal(600),
          "Rare Key": new Decimal(1),
        },
        farmActivity: {
          "Acorn House Bought": 1,
          "Kite Bought": 1,
          "Spring Duckling Bought": 1,
          "Acorn Hat Bought": 1,
          "Rare Key Bought": 1,
        },
      },
      action: {
        type: "chapterItem.bought",
        name: "Rare Key",
        tier: "rare",
      },
      createdAt: new Date("2025-02-05").getTime(),
    });
    expect(state.inventory["Rare Key"]).toStrictEqual(new Decimal(2));
    expect(state.farmActivity["Rare Key Bought"])?.toEqual(2);
  });

  it("throws an error if Mammoth item is already crafted", () => {
    const mockedDate = new Date(2025, 1, 5);
    jest.useFakeTimers();
    jest.setSystemTime(mockedDate);
    expect(() =>
      buyChapterItem({
        state: {
          ...mockState,
          balance: new Decimal(5),
          inventory: {
            Timeshard: new Decimal(2000),
          },
          farmActivity: {
            "Acorn House Bought": 1,
            "Kite Bought": 1,
            "Spring Duckling Bought": 1,
            "Acorn Hat Bought": 1,
            "Igloo Bought": 1,
            "Ladybug Suit Bought": 1,
            "Ugly Duckling Bought": 1,
            "Lake Rug Bought": 1,
            "Mammoth Bought": 1,
          },
        },
        action: {
          type: "chapterItem.bought",
          name: "Mammoth",
          tier: "epic",
        },
        createdAt: new Date("2025-02-05").getTime(),
      }),
    ).toThrow("This item has already been crafted");
  });

  it("does not throw an error if Luxury Key item is already crafted", () => {
    const mockedDate = new Date(2025, 1, 5);
    jest.useFakeTimers();
    jest.setSystemTime(mockedDate);

    const state = buyChapterItem({
      state: {
        ...mockState,
        balance: new Decimal(5),
        inventory: {
          Timeshard: new Decimal(1000),
          "Luxury Key": new Decimal(1),
        },
        farmActivity: {
          "Acorn House Bought": 1,
          "Kite Bought": 1,
          "Spring Duckling Bought": 1,
          "Acorn Hat Bought": 1,
          "Igloo Bought": 1,
          "Ladybug Suit Bought": 1,
          "Ugly Duckling Bought": 1,
          "Lake Rug Bought": 1,
          "Mammoth Bought": 1,
          "Luxury Key Bought": 1,
        },
      },
      action: {
        type: "chapterItem.bought",
        name: "Luxury Key",
        tier: "epic",
      },
      createdAt: new Date("2025-02-05").getTime(),
    });
    expect(state.inventory["Luxury Key"]).toStrictEqual(new Decimal(2));
    expect(state.farmActivity["Luxury Key Bought"])?.toEqual(2);
  });

  it("throws an error if Sickle item is already crafted", () => {
    const mockedDate = new Date(2025, 1, 5);
    jest.useFakeTimers();
    jest.setSystemTime(mockedDate);
    expect(() =>
      buyChapterItem({
        state: {
          ...mockState,
          balance: new Decimal(5),
          inventory: {
            Timeshard: new Decimal(4500),
          },
          farmActivity: {
            "Acorn House Bought": 1,
            "Kite Bought": 1,
            "Spring Duckling Bought": 1,
            "Acorn Hat Bought": 1,
            "Igloo Bought": 1,
            "Ladybug Suit Bought": 1,
            "Ugly Duckling Bought": 1,
            "Lake Rug Bought": 1,
            "Mammoth Bought": 1,
            "Hammock Bought": 1,
            "Crab Hat Bought": 1,
            "Cup of Chocolate Bought": 1,
            "Sickle Bought": 1,
          },
        },
        action: {
          type: "chapterItem.bought",
          name: "Sickle",
          tier: "mega",
        },
        createdAt: new Date("2025-02-05").getTime(),
      }),
    ).toThrow("This item has already been crafted");
  });

  // Pet Egg tests - one per chapter limit
  describe("Pet Egg", () => {
    // Paw Prints chapter: 2025-11-03 to 2026-02-02
    const pawPrintsDate = new Date("2025-12-01T00:00:00Z").getTime();

    const pawPrintsStateWithEpicUnlocked: GameState = {
      ...mockState,
      balance: new Decimal(1000),
      inventory: {
        "Pet Cookie": new Decimal(5000),
      },
      farmActivity: {
        // Need 4 items from rare tier to unlock epic (getChapterItemsCrafted checks lower tier)
        "Pet Playground Bought": 1,
        "Fish Bowl Bought": 1,
        "Giant Gold Bone Bought": 1,
        "Pet Specialist Pants Bought": 1,
      },
    };

    it("successfully buys Pet Egg for the first time in a chapter", () => {
      const mockedDate = new Date("2025-12-01");
      jest.useFakeTimers();
      jest.setSystemTime(mockedDate);

      const state = buyChapterItem({
        state: pawPrintsStateWithEpicUnlocked,
        action: {
          type: "chapterItem.bought",
          name: "Pet Egg",
          tier: "epic",
        },
        createdAt: pawPrintsDate,
      });

      expect(state.inventory["Pet Egg"]).toStrictEqual(new Decimal(1));
      expect(state.farmActivity["Pet Egg Bought"]).toEqual(1);
      expect(state.megastore?.boughtAt["Pet Egg"]).toEqual(pawPrintsDate);
    });

    it("throws an error if Pet Egg already bought within the same chapter", () => {
      const mockedDate = new Date("2025-12-01");
      jest.useFakeTimers();
      jest.setSystemTime(mockedDate);

      // Pet Egg was bought earlier in the same chapter (Paw Prints)
      const stateWithPetEggBoughtThisChapter: GameState = {
        ...pawPrintsStateWithEpicUnlocked,
        megastore: {
          boughtAt: {
            "Pet Egg": new Date("2025-11-15T00:00:00Z").getTime(), // Within Paw Prints chapter
          },
        },
        farmActivity: {
          ...pawPrintsStateWithEpicUnlocked.farmActivity,
          "Pet Egg Bought": 1,
        },
      };

      expect(() =>
        buyChapterItem({
          state: stateWithPetEggBoughtThisChapter,
          action: {
            type: "chapterItem.bought",
            name: "Pet Egg",
            tier: "epic",
          },
          createdAt: pawPrintsDate,
        }),
      ).toThrow("Pet Egg already bought this chapter");
    });

    it("allows buying Pet Egg even with high farmActivity count if not bought this chapter", () => {
      const mockedDate = new Date("2025-12-01");
      jest.useFakeTimers();
      jest.setSystemTime(mockedDate);

      // Pet Egg was bought in a previous chapter (before Paw Prints started)
      const stateWithPetEggBoughtPreviousChapter: GameState = {
        ...pawPrintsStateWithEpicUnlocked,
        megastore: {
          boughtAt: {
            "Pet Egg": new Date("2025-10-01T00:00:00Z").getTime(), // Before Paw Prints chapter
          },
        },
        farmActivity: {
          ...pawPrintsStateWithEpicUnlocked.farmActivity,
          "Pet Egg Bought": 5, // Bought 5 times in previous chapters
        },
      };

      const state = buyChapterItem({
        state: stateWithPetEggBoughtPreviousChapter,
        action: {
          type: "chapterItem.bought",
          name: "Pet Egg",
          tier: "epic",
        },
        createdAt: pawPrintsDate,
      });

      expect(state.inventory["Pet Egg"]).toStrictEqual(new Decimal(1));
      expect(state.farmActivity["Pet Egg Bought"]).toEqual(6);
    });

    it("correctly updates megastore.boughtAt when Pet Egg is purchased", () => {
      const mockedDate = new Date("2025-12-01");
      jest.useFakeTimers();
      jest.setSystemTime(mockedDate);

      const purchaseTime = new Date("2025-12-15T12:00:00Z").getTime();

      const state = buyChapterItem({
        state: pawPrintsStateWithEpicUnlocked,
        action: {
          type: "chapterItem.bought",
          name: "Pet Egg",
          tier: "epic",
        },
        createdAt: purchaseTime,
      });

      expect(state.megastore?.boughtAt["Pet Egg"]).toEqual(purchaseTime);
    });

    it("deducts Pet Cookie cost when buying Pet Egg", () => {
      const mockedDate = new Date("2025-12-01");
      jest.useFakeTimers();
      jest.setSystemTime(mockedDate);

      const state = buyChapterItem({
        state: pawPrintsStateWithEpicUnlocked,
        action: {
          type: "chapterItem.bought",
          name: "Pet Egg",
          tier: "epic",
        },
        createdAt: pawPrintsDate,
      });

      // Pet Egg costs 2000 Pet Cookies
      expect(state.inventory["Pet Cookie"]).toStrictEqual(new Decimal(3000));
    });

    it("throws an error if player doesn't have enough Pet Cookies", () => {
      const mockedDate = new Date("2025-12-01");
      jest.useFakeTimers();
      jest.setSystemTime(mockedDate);

      const stateWithInsufficientCookies: GameState = {
        ...pawPrintsStateWithEpicUnlocked,
        inventory: {
          "Pet Cookie": new Decimal(1000), // Not enough (need 2000)
        },
      };

      expect(() =>
        buyChapterItem({
          state: stateWithInsufficientCookies,
          action: {
            type: "chapterItem.bought",
            name: "Pet Egg",
            tier: "epic",
          },
          createdAt: pawPrintsDate,
        }),
      ).toThrow("Insufficient Pet Cookie");
    });

    it("throws an error if epic tier is not unlocked", () => {
      const mockedDate = new Date("2025-12-01");
      jest.useFakeTimers();
      jest.setSystemTime(mockedDate);

      const stateWithoutEpicUnlocked: GameState = {
        ...mockState,
        inventory: {
          "Pet Cookie": new Decimal(5000),
        },
        farmActivity: {
          // Only 2 rare items - not enough for epic tier (need 4)
          "Pet Playground Bought": 1,
          "Fish Bowl Bought": 1,
        },
      };

      expect(() =>
        buyChapterItem({
          state: stateWithoutEpicUnlocked,
          action: {
            type: "chapterItem.bought",
            name: "Pet Egg",
            tier: "epic",
          },
          createdAt: pawPrintsDate,
        }),
      ).toThrow(
        "You need to buy more basic and rare items to unlock epic items",
      );
    });

    it("throws an error if farmActivity shows Pet Egg purchase but boughtAt is missing (legacy data fallback)", () => {
      const mockedDate = new Date("2025-12-01");
      jest.useFakeTimers();
      jest.setSystemTime(mockedDate);

      // Legacy data scenario: farmActivity has a purchase but megastore.boughtAt is missing
      const stateWithLegacyPurchase: GameState = {
        ...pawPrintsStateWithEpicUnlocked,
        farmActivity: {
          ...pawPrintsStateWithEpicUnlocked.farmActivity,
          "Pet Egg Bought": 1, // Purchase recorded in farmActivity
        },
        // Note: megastore.boughtAt["Pet Egg"] is NOT set (legacy data issue)
      };

      expect(() =>
        buyChapterItem({
          state: stateWithLegacyPurchase,
          action: {
            type: "chapterItem.bought",
            name: "Pet Egg",
            tier: "epic",
          },
          createdAt: pawPrintsDate,
        }),
      ).toThrow("Pet Egg already bought this chapter");
    });
  });
});
