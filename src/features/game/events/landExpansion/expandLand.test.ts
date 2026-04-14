import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import { expandLand } from "./expandLand";
import Decimal from "decimal.js-light";
import { BB_TO_GEM_RATIO } from "features/game/types/game";

describe("expandLand", () => {
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
});
