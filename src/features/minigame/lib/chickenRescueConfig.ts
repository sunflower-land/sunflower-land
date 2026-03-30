import { emptyMinigameState } from "./processMinigameAction";
import type { MinigameConfig, MinigameRuntimeState } from "./types";

const EIGHT_HOURS_MS = 8 * 1000; // 60 * 60 * 1000;

/**
 * Chicken Rescue v2 — mirrors `sunflower-land-api` `domain/minigames/configs/chickenRescue.ts`
 * (portal / minigame slug `chicken-rescue-v2`).
 *
 * Balance keys (API-facing) vs player-facing names in the dashboard:
 * - `Cluckcoin` → Golden Nuggets
 * - `Coin` → Worms
 * - `FatChicken` / `LoveChicken` / `AlienChicken` / `RoosterChicken` → all shown as “Wormery” in UI
 * - `Chook` → Chooks
 * - `Nugget` → Chicken Feet
 * - `GoldenChook` → Golden Chook
 */
export const CHICKEN_RESCUE_CONFIG: MinigameConfig = {
  itemIds: {
    Cluckcoin: 0,
    Coin: 1,
    FatChicken: 2,
    Chook: 3,
    Nugget: 4,
    LoveChicken: 5,
    AlienChicken: 6,
    RoosterChicken: 7,
    GoldenChook: 8,
  },
  actions: {
    START_FAT_CHICKEN_DROP: {
      produce: {
        Coin: {
          msToComplete: EIGHT_HOURS_MS,
          requires: "FatChicken",
        },
      },
    },
    COLLECT_FAT_CHICKEN: {
      collect: {
        Coin: { amount: 3 },
      },
    },
    BUY_LOVE_CHICKEN: {
      burn: {
        Cluckcoin: { amount: 15 },
      },
      mint: {
        LoveChicken: { amount: 1 },
      },
    },
    BUY_ALIEN_CHICKEN: {
      burn: {
        Cluckcoin: { amount: 100 },
      },
      mint: {
        AlienChicken: { amount: 1 },
      },
    },
    BUY_ROOSTER_CHICKEN: {
      burn: {
        Cluckcoin: { amount: 500 },
      },
      mint: {
        RoosterChicken: { amount: 1 },
      },
    },
    START_LOVE_COIN_DROP: {
      produce: {
        Coin: {
          msToComplete: EIGHT_HOURS_MS,
          limit: 999,
          requires: "LoveChicken",
        },
      },
    },
    COLLECT_LOVE_COINS: {
      collect: {
        Coin: { amount: 3 },
      },
    },
    START_ALIEN_COIN_DROP: {
      produce: {
        Coin: {
          msToComplete: EIGHT_HOURS_MS,
          limit: 999,
          requires: "AlienChicken",
        },
      },
    },
    COLLECT_ALIEN_COINS: {
      collect: {
        Coin: { amount: 3 },
      },
    },
    START_ROOSTER_COIN_DROP: {
      produce: {
        Coin: {
          msToComplete: EIGHT_HOURS_MS,
          limit: 999,
          requires: "RoosterChicken",
        },
      },
    },
    COLLECT_ROOSTER_COINS: {
      collect: {
        Coin: { amount: 3 },
      },
    },
    START: {
      mint: {
        LIVE_GAME: { amount: 1 },
      },
      burn: {
        Coin: { amount: 1 },
      },
    },
    LOSE: {
      burn: {
        LIVE_GAME: { amount: 1 },
      },
    },
    WIN: {
      mint: {
        Chook: { min: 0, max: 100, dailyCap: 1000 },
      },
      burn: {
        LIVE_GAME: { amount: 1 },
      },
    },
    BUY_NUGGET: {
      burn: {
        Chook: { amount: 50 },
      },
      mint: {
        Nugget: { amount: 1 },
      },
    },

    BUY_CLUCKCOIN: {
      mint: {
        Cluckcoin: { amount: 1 },
      },
      burn: {
        GoldenChook: { amount: 1 },
      },
    },

    BUY_QUEENS: {
      mint: {
        Coin: { amount: 5 },
      },
      burn: {
        Cluckcoin: { amount: 1 },
      },
    },
    START_ADVANCED_GAME: {
      mint: {
        ADVANCED_GAME: { amount: 1 },
      },
      burn: {
        Nugget: { amount: 1 },
      },
    },
    LOSE_ADVANCED_GAME: {
      burn: {
        ADVANCED_GAME: { amount: 1 },
      },
    },
    WIN_ADVANCED_GAME: {
      mint: {
        Chook: { min: 0, max: 100, dailyCap: 1000 },
        GoldenChook: { min: 0, max: 3, dailyCap: 300 },
      },
      burn: {
        ADVANCED_GAME: { amount: 1 },
      },
    },
  },
};

export const CHICKEN_RESCUE_BOOTSTRAP_COIN_JOB_ID =
  "bootstrap-fat-chicken-coin-0";

/** Links each `requires`-lane start action to its collect action (same as API config). */
export const CHICKEN_RESCUE_COLLECT_BY_START: Record<string, string> = {
  START_FAT_CHICKEN_DROP: "COLLECT_FAT_CHICKEN",
  START_LOVE_COIN_DROP: "COLLECT_LOVE_COINS",
  START_ALIEN_COIN_DROP: "COLLECT_ALIEN_COINS",
  START_ROOSTER_COIN_DROP: "COLLECT_ROOSTER_COINS",
};

export function createChickenRescueInitialState(
  now: number,
): MinigameRuntimeState {
  const base = emptyMinigameState(now);
  return {
    ...base,
    balances: {
      FatChicken: 1,
    },
    producing: {
      [CHICKEN_RESCUE_BOOTSTRAP_COIN_JOB_ID]: {
        outputToken: "Coin",
        requires: "FatChicken",
        startedAt: now - 1,
        completesAt: now,
      },
    },
  };
}
