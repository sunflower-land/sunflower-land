import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import { expandLand, expansionRequirements } from "./expandLand";
import { ascensionBaseline } from "features/game/lib/level";
import Decimal from "decimal.js-light";
import { BB_TO_GEM_RATIO } from "features/game/types/game";

describe("expandLand", () => {
  it("does not allow expanding basic island past 9 (must upgrade)", () => {
    expect(() =>
      expandLand({
        action: {
          type: "land.expanded",
          farmId: 0,
        },
        state: {
          ...TEST_FARM,
          island: { type: "basic" },
          inventory: { "Basic Land": new Decimal(9) },
        },
      }),
    ).toThrow("Upgrade your island to expand further");
  });

  it("forces legacy basic farms above 9 to upgrade rather than expand", () => {
    expect(() =>
      expandLand({
        action: {
          type: "land.expanded",
          farmId: 0,
        },
        state: {
          ...TEST_FARM,
          island: { type: "basic" },
          inventory: { "Basic Land": new Decimal(15) },
        },
      }),
    ).toThrow("Upgrade your island to expand further");
  });

  it("does not allow expanding spring island past 16 (must upgrade)", () => {
    expect(() =>
      expandLand({
        action: {
          type: "land.expanded",
          farmId: 0,
        },
        state: {
          ...TEST_FARM,
          island: { type: "spring" },
          inventory: { "Basic Land": new Decimal(16) },
        },
      }),
    ).toThrow("Upgrade your island to expand further");
  });

  it("blocks expansion for legacy spring farms beyond 16 (they remain but cannot expand)", () => {
    expect(() =>
      expandLand({
        action: {
          type: "land.expanded",
          farmId: 0,
        },
        state: {
          ...TEST_FARM,
          island: { type: "spring" },
          inventory: { "Basic Land": new Decimal(18) },
        },
      }),
    ).toThrow("Upgrade your island to expand further");
  });

  it("does not allow expanding volcano past its max (must upgrade)", () => {
    expect(() =>
      expandLand({
        action: {
          type: "land.expanded",
          farmId: 0,
        },
        state: {
          ...TEST_FARM,
          island: { type: "volcano" },
          inventory: { "Basic Land": new Decimal(30) },
        },
      }),
    ).toThrow("Upgrade your island to expand further");
  });

  it("requires player has sufficient coins", () => {
    expect(() =>
      expandLand({
        action: {
          type: "land.expanded",
          farmId: 0,
        },
        state: {
          ...TEST_FARM,
          bumpkin: {
            ...INITIAL_BUMPKIN,
            experience: 1000000000,
          },
          inventory: {
            "Basic Land": new Decimal(9),
            Wood: new Decimal(100),
            Stone: new Decimal(50),
            Iron: new Decimal(10),
            Gold: new Decimal(5),
            Crimstone: new Decimal(12),
            Oil: new Decimal(10),
            Gem: new Decimal(3 * BB_TO_GEM_RATIO),
          },
          island: {
            type: "desert",
          },
        },
      }),
    ).toThrow("Insufficient coins");
  });

  it("subtracts full coin requirement when player does not have VIP", () => {
    // Desert expansion 10: 384 coins full price
    const state = expandLand({
      action: {
        type: "land.expanded",
        farmId: 0,
      },
      state: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          experience: 1000000000,
        },
        inventory: {
          "Basic Land": new Decimal(9),
          Wood: new Decimal(100),
          Stone: new Decimal(50),
          Iron: new Decimal(10),
          Gold: new Decimal(5),
          Crimstone: new Decimal(12),
          Oil: new Decimal(10),
          Gem: new Decimal(3 * BB_TO_GEM_RATIO),
        },
        coins: 389,
        island: {
          type: "desert",
        },
      },
    });

    expect(state.coins).toEqual(5); // 389 - 384
    expect(state.farmActivity["Coins Spent"]).toEqual(384);
  });

  it("subtracts discounted coin amount when player has VIP", () => {
    // Desert expansion 21: 9600 full, VIP discount max(500, 20%) = 1920, effective = 7680
    const now = Date.now();
    const state = expandLand({
      action: {
        type: "land.expanded",
        farmId: 0,
      },
      state: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          experience: 1000000000,
        },
        inventory: {
          "Basic Land": new Decimal(20),
          Wood: new Decimal(550),
          Stone: new Decimal(150),
          Iron: new Decimal(30),
          Gold: new Decimal(25),
          Crimstone: new Decimal(45),
          Oil: new Decimal(350),
          Gem: new Decimal(4 * BB_TO_GEM_RATIO),
        },
        coins: 8000,
        vip: {
          expiresAt: now + 86400000,
          trialStartedAt: undefined,
          bundles: [],
        },
        island: {
          type: "desert",
        },
      },
    });

    expect(state.coins).toEqual(320); // 8000 - 7680 (VIP discounted)
    expect(state.farmActivity["Coins Spent"]).toEqual(7680);
  });

  it("tracks the bumpkin activity", () => {
    // Volcano expansion 9: 1152 coins full price
    const state = expandLand({
      action: {
        type: "land.expanded",
        farmId: 0,
      },
      state: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          experience: 1000000000,
        },
        inventory: {
          "Basic Land": new Decimal(8),
          Wood: new Decimal(400),
          Stone: new Decimal(150),
          Iron: new Decimal(35),
          Gold: new Decimal(25),
          Crimstone: new Decimal(12),
          Oil: new Decimal(90),
          Gem: new Decimal(3 * BB_TO_GEM_RATIO),
        },
        coins: 1200,
        island: {
          type: "volcano",
        },
      },
    });

    expect(state.farmActivity["Coins Spent"]).toBe(1152);
  });

  it("gates swamp expansions on the within-ascension level", () => {
    // Basic Land 30 → expansion 31 (local e=1) requires within-ascension level 1.
    // Experience just below the band baseline reads as within-ascension level 0.
    expect(() =>
      expandLand({
        action: { type: "land.expanded", farmId: 0 },
        state: {
          ...TEST_FARM,
          coins: 100000,
          island: { type: "swamp", ascensionLevel: 1 },
          bumpkin: {
            ...INITIAL_BUMPKIN,
            experience: ascensionBaseline(1) - 1,
          },
          inventory: {
            "Basic Land": new Decimal(30),
            Crimstone: new Decimal(100),
            Oil: new Decimal(100),
            Obsidian: new Decimal(100),
          },
        },
      }),
    ).toThrow("Insufficient Bumpkin Level");
  });

  it("allows expanding swamp once the within-ascension level is met", () => {
    const state = expandLand({
      action: { type: "land.expanded", farmId: 0 },
      state: {
        ...TEST_FARM,
        coins: 100000,
        island: { type: "swamp", ascensionLevel: 1 },
        bumpkin: {
          ...INITIAL_BUMPKIN,
          experience: ascensionBaseline(1), // within-ascension level 1
        },
        inventory: {
          "Basic Land": new Decimal(30),
          Crimstone: new Decimal(100),
          Oil: new Decimal(100),
          Obsidian: new Decimal(100),
        },
      },
    });

    // Expansion 31 coins = 5000.
    expect(state.coins).toEqual(95000);
  });
});

describe("expansionRequirements", () => {
  it("returns normal expansion requirements", () => {
    const { requirements } = expansionRequirements({ game: TEST_FARM });

    expect(requirements?.resources).toEqual({
      Wood: 3,
    });
  });
  it("returns discounted expansion requirements with Grinx Hammer", () => {
    const { requirements } = expansionRequirements({
      game: {
        ...TEST_FARM,
        collectibles: {
          "Grinx's Hammer": [
            {
              coordinates: { x: 1, y: 1 },
              createdAt: Date.now(),
              id: "123",
              readyAt: Date.now(),
            },
          ],
        },
      },
    });

    expect(requirements?.resources).toEqual({
      Wood: 1.5,
    });
  });

  it("returns swamp formula requirements for swamp island with ascensionLevel 1", () => {
    const HOUR = 60 * 60;
    const { requirements, boostsUsed } = expansionRequirements({
      game: {
        ...TEST_FARM,
        island: { type: "swamp", ascensionLevel: 1 },
        inventory: {
          ...TEST_FARM.inventory,
          "Basic Land": new Decimal(30),
        },
      },
    });

    // expansion = 30 + 1 = 31, first swamp ascension slot
    expect(requirements?.resources).toEqual({
      Crimstone: 10,
      Oil: 50,
      Obsidian: 2,
    });
    expect(requirements?.coins).toBe(5000);
    expect(requirements?.seconds).toBe(7 * HOUR);
    expect(boostsUsed).toHaveLength(0);
  });

  it("applies Grinx's Hammer halving to swamp resources (not Gem)", () => {
    const { requirements, boostsUsed } = expansionRequirements({
      game: {
        ...TEST_FARM,
        island: { type: "swamp", ascensionLevel: 1 },
        inventory: {
          ...TEST_FARM.inventory,
          "Basic Land": new Decimal(30),
        },
        collectibles: {
          "Grinx's Hammer": [
            {
              coordinates: { x: 1, y: 1 },
              createdAt: Date.now(),
              id: "456",
              readyAt: Date.now(),
            },
          ],
        },
      },
    });

    expect(requirements?.resources).toEqual({
      Crimstone: 5,
      Oil: 25,
      Obsidian: 1,
    });
    expect(boostsUsed).toEqual([{ name: "Grinx's Hammer", value: "x0.5" }]);
  });

  it("returns undefined requirements when swamp expansion is beyond range (Basic Land 42)", () => {
    const { requirements } = expansionRequirements({
      game: {
        ...TEST_FARM,
        island: { type: "swamp", ascensionLevel: 1 },
        inventory: {
          ...TEST_FARM.inventory,
          "Basic Land": new Decimal(42),
        },
      },
    });

    // expansion = 42 + 1 = 43, outside the 31-42 swamp range → no requirements
    expect(requirements).toBeUndefined();
  });

  it("returns swamp requirements at ascensionLevel 2 with scaled costs", () => {
    const HOUR = 60 * 60;
    const { requirements } = expansionRequirements({
      game: {
        ...TEST_FARM,
        island: { type: "swamp", ascensionLevel: 2 },
        inventory: {
          ...TEST_FARM.inventory,
          "Basic Land": new Decimal(41),
        },
      },
    });

    // expansion 42, ascensionLevel 2: costs × 1.3
    expect(requirements?.resources).toEqual({
      Crimstone: 65,
      Oil: 520,
      Obsidian: 26,
    });
    expect(requirements?.seconds).toBe(84 * HOUR);
  });
});
