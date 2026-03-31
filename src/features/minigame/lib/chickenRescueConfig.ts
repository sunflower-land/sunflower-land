import { emptyMinigameState } from "./processMinigameAction";
import type { MinigameConfig, MinigameRuntimeState } from "./types";

const SEVEN_HOURS_MS = 7 * 60 * 60 * 1000;
const EIGHT_HOURS_MS = 8 * 60 * 60 * 1000;

/** Same relative paths as `sunflower-land-api` `domain/minigames/configs/chickenRescue.ts`. */
const CR = "minigames/chicken-rescue-v2";
const CHICKEN_RESCUE_ITEM_IMAGES = {
  GoldenNugget: `${CR}/golden_nugget.webp`,
  Worm: `${CR}/worm.png`,
  Wormery: `${CR}/wormery.webp`,
  Chook: `${CR}/chook.webp`,
  ChickenFeet: `${CR}/chicken_feet.webp`,
  Wormery_2: `${CR}/wormery.webp`,
  Wormery_3: `${CR}/wormery.webp`,
  Wormery_4: `${CR}/wormery.webp`,
  GoldenChook: `${CR}/golden_chook.png`,
} as const;

/** @deprecated Prefer `CHICKEN_RESCUE_CONFIG.dashboard.productionCollectByStartId`. */
export const CHICKEN_RESCUE_COLLECT_BY_START: Record<string, string> = {
  START_WORMERY_DROP: "COLLECT_WORMERY_WORMS",
  START_WORMERY_2_DROP: "COLLECT_WORMERY_2_WORMS",
  START_WORMERY_3_DROP: "COLLECT_WORMERY_3_WORMS",
  START_WORMERY_4_DROP: "COLLECT_WORMERY_4_WORMS",
};

/**
 * Chicken Rescue v2 — mirrors `sunflower-land-api` `domain/minigames/configs/chickenRescue.ts`.
 */
export const CHICKEN_RESCUE_CONFIG: MinigameConfig = {
  playUrl: "https://chicken-rescue-v2.minigames.sunflower-land.com",
  items: {
    GoldenNugget: {
      name: "Golden Nuggets",
      description:
        "Premium currency. Spend it in the shop to unlock better wormeries that produce more worms.",
      image: CHICKEN_RESCUE_ITEM_IMAGES.GoldenNugget,
      id: 0,
      tradeable: true,
    },
    Worm: {
      name: "Worm",
      description:
        "Produced on timers from your wormeries. Spend worms to start standard Chicken Rescue runs.",
      image: CHICKEN_RESCUE_ITEM_IMAGES.Worm,
      id: 1,
    },
    Wormery: {
      name: "Wormery",
      description:
        "Your starter wormery. Run a timer to produce worms. Each wormery can run one worm job at a time.",
      image: CHICKEN_RESCUE_ITEM_IMAGES.Wormery,
      id: 2,
    },
    Chook: {
      name: "Chooks",
      description:
        "Earned from winning runs. Collect enough to trade up into rarer items on advanced paths.",
      image: CHICKEN_RESCUE_ITEM_IMAGES.Chook,
      id: 3,
    },
    ChickenFeet: {
      name: "Chicken Feet",
      description:
        "Crafted from chooks. Gates the advanced minigame—spend wisely before you commit to a run.",
      image: CHICKEN_RESCUE_ITEM_IMAGES.ChickenFeet,
      id: 4,
    },
    Wormery_2: {
      name: "Wormery 2",
      description: "Wormery 2. Collect worms from an 8-hour timer.",
      image: CHICKEN_RESCUE_ITEM_IMAGES.Wormery_2,
      id: 5,
    },
    Wormery_3: {
      name: "Wormery 3",
      description: "Wormery 3. Collect worms from an 8-hour timer.",
      image: CHICKEN_RESCUE_ITEM_IMAGES.Wormery_3,
      id: 6,
    },
    Wormery_4: {
      name: "Wormery 4",
      description: "Wormery 4. Collect worms from an 8-hour timer.",
      image: CHICKEN_RESCUE_ITEM_IMAGES.Wormery_4,
      id: 7,
    },
    GoldenChook: {
      name: "Golden Chook",
      description:
        "A rare jackpot drop. Can be traded for Golden Nuggets when you want to reinvest in the shop.",
      image: CHICKEN_RESCUE_ITEM_IMAGES.GoldenChook,
      id: 8,
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
  dashboard: {
    displayName: "Chicken Rescue v2",
    headerBalanceToken: "GoldenNugget",
    inventoryShortcutTokens: ["Worm", "Chook", "Wormery"],
    productionCollectByStartId: { ...CHICKEN_RESCUE_COLLECT_BY_START },
    visualTheme: "chicken-rescue",
    shop: [
      {
        id: "wormery2",
        actionId: "BUY_WORMERY_2",
        name: "Wormery 2",
        description: "Buy Wormery 2 for Golden Nuggets.",
        listImageToken: "Wormery_2",
        price: { token: "GoldenNugget", amount: 15 },
        ownedBalanceToken: "Wormery_2",
      },
      {
        id: "wormery3",
        actionId: "BUY_WORMERY_3",
        name: "Wormery 3",
        description: "Buy Wormery 3 for Golden Nuggets.",
        listImageToken: "Wormery_3",
        price: { token: "GoldenNugget", amount: 100 },
        ownedBalanceToken: "Wormery_3",
      },
      {
        id: "wormery4",
        actionId: "BUY_WORMERY_4",
        name: "Wormery 4",
        description: "Buy Wormery 4 for Golden Nuggets.",
        listImageToken: "Wormery_4",
        price: { token: "GoldenNugget", amount: 500 },
        ownedBalanceToken: "Wormery_4",
      },
      {
        id: "chickenFeet",
        actionId: "BUY_WORM_BALL",
        name: "Chicken Feet",
        description:
          "Craft Chicken Feet from Chooks. Spend them to enter advanced Chicken Rescue runs for Golden Chook drops.",
        listImageToken: "ChickenFeet",
        price: { token: "Chook", amount: 50 },
      },
      {
        id: "goldenNugget",
        actionId: "BUY_GOLDEN_NUGGET",
        name: "Golden Nuggets",
        description: "Trade a Golden Chook for Golden Nuggets.",
        listImageToken: "GoldenNugget",
        price: { token: "GoldenChook", amount: 1 },
      },
    ],
  },
  actions: {
    START_WORMERY_DROP: {
      produce: {
        Worm: {
          msToComplete: SEVEN_HOURS_MS,
          requires: "Wormery",
        },
      },
    },
    COLLECT_WORMERY_WORMS: {
      collect: {
        Worm: { amount: 3 },
      },
    },
    BUY_WORMERY_2: {
      burn: {
        GoldenNugget: { amount: 15 },
      },
      mint: {
        Wormery_2: { amount: 1 },
      },
    },
    BUY_WORMERY_3: {
      burn: {
        GoldenNugget: { amount: 100 },
      },
      mint: {
        Wormery_3: { amount: 1 },
      },
    },
    BUY_WORMERY_4: {
      burn: {
        GoldenNugget: { amount: 500 },
      },
      mint: {
        Wormery_4: { amount: 1 },
      },
    },
    START_WORMERY_2_DROP: {
      produce: {
        Worm: {
          msToComplete: EIGHT_HOURS_MS,
          limit: 999,
          requires: "Wormery_2",
        },
      },
    },
    COLLECT_WORMERY_2_WORMS: {
      collect: {
        Worm: { amount: 3 },
      },
    },
    START_WORMERY_3_DROP: {
      produce: {
        Worm: {
          msToComplete: EIGHT_HOURS_MS,
          limit: 999,
          requires: "Wormery_3",
        },
      },
    },
    COLLECT_WORMERY_3_WORMS: {
      collect: {
        Worm: { amount: 3 },
      },
    },
    START_WORMERY_4_DROP: {
      produce: {
        Worm: {
          msToComplete: EIGHT_HOURS_MS,
          limit: 999,
          requires: "Wormery_4",
        },
      },
    },
    COLLECT_WORMERY_4_WORMS: {
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
