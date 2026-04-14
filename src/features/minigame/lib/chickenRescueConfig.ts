import { emptyPlayerEconomyState } from "./processPlayerEconomyAction";
import type { PlayerEconomyConfig, PlayerEconomyRuntimeState } from "./types";

const SEVEN_HOURS_MS = 7 * 60 * 60 * 1000;
const EIGHT_HOURS_MS = 8 * 60 * 60 * 1000;

/** Editor / CDN assets (matches DB-backed `chicken-rescue-v2` items). */
const CR_ASSETS =
  "https://hannigan-minigame-editor-assets.s3.us-east-1.amazonaws.com/minigames/chicken-rescue-v2/items";

/**
 * Chicken Rescue v2 — local fallback config; production uses DB-backed config with the same
 * item keys (`"0"`…`"8"`) and ids.
 */
export const CHICKEN_RESCUE_CONFIG: PlayerEconomyConfig = {
  playUrl: "https://chicken-rescue-v2.minigames.sunflower-land.com",
  mainCurrencyToken: "0",
  items: {
    "0": {
      name: "Golden Nugget",
      description: "A suspicious nugget - used to upgrade your Chook Empire",
      image: `${CR_ASSETS}/0.webp`,
      id: 0,
      tradeable: true,
    },
    "1": {
      name: "Chook",
      description: "A cheeky chook found in adventure mode",
      image: `${CR_ASSETS}/1.webp`,
      id: 1,
    },
    "2": {
      name: "Golden Chook",
      description: "A rare chook found in advanced adventures.",
      image: `${CR_ASSETS}/2.webp`,
      id: 2,
    },
    "3": {
      name: "Chicken Feet",
      description:
        "A lucky pair of feet - this is sure to attract Golden Chooks!",
      image: `${CR_ASSETS}/3.webp`,
      id: 3,
    },
    "4": {
      name: "Worm",
      description: "A tasty worm that Chooks love!",
      image: `${CR_ASSETS}/4.png`,
      id: 4,
      initialBalance: 3,
    },
    "5": {
      name: "Wormery",
      description: "A basic wormery that produces worms",
      image: `${CR_ASSETS}/5.webp`,
      id: 5,
      generator: true,
      initialBalance: 1,
    },
    "6": {
      name: "Refined Wormery",
      description: "A more advanced wormery",
      image: `${CR_ASSETS}/6.webp`,
      id: 6,
      generator: true,
    },
    "7": {
      name: "Primal Wormery",
      description: "A magical wormery that produces even more worms",
      image: `${CR_ASSETS}/7.webp`,
      id: 7,
      generator: true,
    },
    "8": {
      name: "Mythic Wormery",
      description: "It's worm's galore!",
      image: `${CR_ASSETS}/8.webp`,
      id: 8,
      generator: true,
    },
  },
  descriptions: {
    title: "Chicken Rescue",
    subtitle: "Play and earn Golden Nuggets.",
    welcome:
      "Rescue chickens, run your wormeries on timers, and spend Golden Nuggets in the shop to grow your setup.",
    rules:
      "You will open the Chicken Rescue portal. Play runs to earn chooks and other rewards; worm production keeps ticking while you are away.",
  },
  visualTheme: "chicken-rescue",
  actions: {
    START_WORMERY_DROP: {
      produce: {
        "4": {
          msToComplete: SEVEN_HOURS_MS,
          requires: "5",
          collectActionId: "COLLECT_WORMERY_WORMS",
        },
      },
    },
    COLLECT_WORMERY_WORMS: {
      collect: {
        "4": { amount: 3 },
      },
    },
    BUY_WORMERY_2: {
      burn: {
        "0": { amount: 15 },
      },
      mint: {
        "6": { amount: 1 },
      },
    },
    BUY_WORMERY_3: {
      burn: {
        "0": { amount: 100 },
      },
      mint: {
        "7": { amount: 1 },
      },
    },
    BUY_WORMERY_4: {
      burn: {
        "0": { amount: 500 },
      },
      mint: {
        "8": { amount: 1 },
      },
    },
    START_WORMERY_2_DROP: {
      produce: {
        "4": {
          msToComplete: EIGHT_HOURS_MS,
          limit: 999,
          requires: "6",
          collectActionId: "COLLECT_WORMERY_2_WORMS",
        },
      },
    },
    COLLECT_WORMERY_2_WORMS: {
      collect: {
        "4": { amount: 3 },
      },
    },
    START_WORMERY_3_DROP: {
      produce: {
        "4": {
          msToComplete: EIGHT_HOURS_MS,
          limit: 999,
          requires: "7",
          collectActionId: "COLLECT_WORMERY_3_WORMS",
        },
      },
    },
    COLLECT_WORMERY_3_WORMS: {
      collect: {
        "4": { amount: 3 },
      },
    },
    START_WORMERY_4_DROP: {
      produce: {
        "4": {
          msToComplete: EIGHT_HOURS_MS,
          limit: 999,
          requires: "8",
          collectActionId: "COLLECT_WORMERY_4_WORMS",
        },
      },
    },
    COLLECT_WORMERY_4_WORMS: {
      collect: {
        "4": { amount: 3 },
      },
    },
    START_GAME: {
      showInShop: false,
      mint: {
        LIVE_GAME: { amount: 1 },
      },
      burn: {
        "4": { amount: 1 },
      },
    },
    GAMEOVER: {
      showInShop: false,
      mint: {
        "1": { min: 0, max: 100, dailyCap: 1000 },
      },
      burn: {
        LIVE_GAME: { amount: 1 },
      },
    },
    BUY_WORM_BALL: {
      burn: {
        "1": { amount: 50 },
      },
      mint: {
        "3": { amount: 1 },
      },
    },

    BUY_GOLDEN_NUGGET: {
      mint: {
        "0": { amount: 1 },
      },
      burn: {
        "2": { amount: 1 },
      },
    },

    BUY_WORM_PACK: {
      mint: {
        "4": { amount: 5 },
      },
      burn: {
        "0": { amount: 1 },
      },
    },
    START_ADVANCED_GAME: {
      showInShop: false,
      mint: {
        ADVANCED_GAME: { amount: 1 },
      },
      burn: {
        "3": { amount: 1 },
      },
    },
    ADVANCED_GAMEOVER: {
      showInShop: false,
      mint: {
        "1": { min: 0, max: 100, dailyCap: 1000 },
        "2": { min: 0, max: 3, dailyCap: 300 },
      },
      burn: {
        ADVANCED_GAME: { amount: 1 },
      },
    },
  },
};

export const CHICKEN_RESCUE_BOOTSTRAP_WORMS_JOB_ID =
  "bootstrap-wormery-worms-0";

export function createChickenRescueInitialState(
  now: number,
): PlayerEconomyRuntimeState {
  const base = emptyPlayerEconomyState(now);
  return {
    ...base,
    balances: {
      "5": 1,
    },
    generating: {
      [CHICKEN_RESCUE_BOOTSTRAP_WORMS_JOB_ID]: {
        outputToken: "4",
        requires: "5",
        startedAt: now - 1,
        completesAt: now,
      },
    },
  };
}
