import { emptyMinigameState } from "./processMinigameAction";
import type { MinigameConfig, MinigameRuntimeState } from "./types";

const EIGHT_HOURS_MS = 8 * 1000; // 60 * 60 * 1000;

/**
 * Chicken Rescue v2 — mirrors `sunflower-land-api` `domain/minigames/configs/chickenRescue.ts`
 * (portal / minigame slug `chicken-rescue-v2`).
 */
export const CHICKEN_RESCUE_CONFIG: MinigameConfig = {
  itemIds: {
    GoldenNugget: 0,
    Worm: 1,
    Wormery: 2,
    Chook: 3,
    ChickenFeet: 4,
    Wormery_2: 5,
    Wormery_3: 6,
    Wormery_4: 7,
    GoldenChook: 8,
  },
  actions: {
    START_WORMERY_DROP: {
      produce: {
        Worm: {
          msToComplete: EIGHT_HOURS_MS,
          requires: "Wormery",
        },
      },
    },
    COLLECT_WORMERY_WORMS: {
      collect: {
        Worm: { amount: 3 },
      },
    },
    BUY_MOSS_WORMERY: {
      burn: {
        GoldenNugget: { amount: 15 },
      },
      mint: {
        Wormery_2: { amount: 1 },
      },
    },
    BUY_GLOW_WORMERY: {
      burn: {
        GoldenNugget: { amount: 100 },
      },
      mint: {
        Wormery_3: { amount: 1 },
      },
    },
    BUY_GRAND_WORMERY: {
      burn: {
        GoldenNugget: { amount: 500 },
      },
      mint: {
        Wormery_4: { amount: 1 },
      },
    },
    START_MOSS_WORMERY_DROP: {
      produce: {
        Worm: {
          msToComplete: EIGHT_HOURS_MS,
          limit: 999,
          requires: "Wormery_2",
        },
      },
    },
    COLLECT_MOSS_WORMERY_WORMS: {
      collect: {
        Worm: { amount: 3 },
      },
    },
    START_GLOW_WORMERY_DROP: {
      produce: {
        Worm: {
          msToComplete: EIGHT_HOURS_MS,
          limit: 999,
          requires: "Wormery_3",
        },
      },
    },
    COLLECT_GLOW_WORMERY_WORMS: {
      collect: {
        Worm: { amount: 3 },
      },
    },
    START_GRAND_WORMERY_DROP: {
      produce: {
        Worm: {
          msToComplete: EIGHT_HOURS_MS,
          limit: 999,
          requires: "Wormery_4",
        },
      },
    },
    COLLECT_GRAND_WORMERY_WORMS: {
      collect: {
        Worm: { amount: 3 },
      },
    },
    START: {
      mint: {
        LIVE_GAME: { amount: 1 },
      },
      burn: {
        Worm: { amount: 1 },
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
    BUY_WORM_BALL: {
      burn: {
        Chook: { amount: 50 },
      },
      mint: {
        ChickenFeet: { amount: 1 },
      },
    },

    BUY_GOLDEN_NUGGET: {
      mint: {
        GoldenNugget: { amount: 1 },
      },
      burn: {
        GoldenChook: { amount: 1 },
      },
    },

    BUY_WORM_PACK: {
      mint: {
        Worm: { amount: 5 },
      },
      burn: {
        GoldenNugget: { amount: 1 },
      },
    },
    START_ADVANCED_GAME: {
      mint: {
        ADVANCED_GAME: { amount: 1 },
      },
      burn: {
        ChickenFeet: { amount: 1 },
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

export const CHICKEN_RESCUE_BOOTSTRAP_WORMS_JOB_ID =
  "bootstrap-wormery-worms-0";

/** Links each `requires`-lane start action to its collect action (same as API config). */
export const CHICKEN_RESCUE_COLLECT_BY_START: Record<string, string> = {
  START_WORMERY_DROP: "COLLECT_WORMERY_WORMS",
  START_MOSS_WORMERY_DROP: "COLLECT_MOSS_WORMERY_WORMS",
  START_GLOW_WORMERY_DROP: "COLLECT_GLOW_WORMERY_WORMS",
  START_GRAND_WORMERY_DROP: "COLLECT_GRAND_WORMERY_WORMS",
};

export function createChickenRescueInitialState(
  now: number,
): MinigameRuntimeState {
  const base = emptyMinigameState(now);
  return {
    ...base,
    balances: {
      Wormery: 1,
    },
    producing: {
      [CHICKEN_RESCUE_BOOTSTRAP_WORMS_JOB_ID]: {
        outputToken: "Worm",
        requires: "Wormery",
        startedAt: now - 1,
        completesAt: now,
      },
    },
  };
}
