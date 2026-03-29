import type { MinigameName } from "features/game/types/minigames";
import {
  CHICKEN_RESCUE_COLLECT_BY_START,
  CHICKEN_RESCUE_CONFIG,
} from "./chickenRescueConfig";
import type { MinigameConfig, MinigameRuntimeState } from "./types";
import type { MinigameSessionApiPayload } from "./minigameSessionApi";
import type { MinigameDashboardData, MinigameDashboardUi } from "./minigameDashboardTypes";
import { CHICKEN_RESCUE_MOCK_TOKEN_IMAGES } from "./mock/chickenRescueTokenImages";

/** Client-only shop, inventory copy, and images (not returned by minigame GET). */
export function getChickenRescueDashboardUi(): MinigameDashboardUi {
  const tokenImages = { ...CHICKEN_RESCUE_MOCK_TOKEN_IMAGES };

  const inventoryItems = [
    {
      token: "Cluckcoin",
      name: "Golden Nuggets",
      description:
        "Premium currency. Spend it in the shop to unlock better wormeries that produce more worms.",
    },
    {
      token: "Coin",
      name: "Worms",
      description:
        "Produced on timers from your wormeries. Spend worms to start standard Chicken Rescue runs.",
    },
    {
      token: "FatChicken",
      name: "Wormery",
      description:
        "Your starter wormery. Run a timer to produce worms. Each wormery can run one worm job at a time.",
    },
    {
      token: "LoveChicken",
      name: "Wormery",
      description:
        "First shop upgrade. Runs its own timed worm payout alongside your other wormeries.",
    },
    {
      token: "AlienChicken",
      name: "Wormery",
      description:
        "Second shop upgrade—another parallel worm lane to stack with your other wormeries.",
    },
    {
      token: "RoosterChicken",
      name: "Wormery",
      description:
        "Top shop wormery upgrade with the strongest idle worm lane.",
    },
    {
      token: "Chook",
      name: "Chooks",
      description:
        "Earned from winning runs. Collect enough to trade up into rarer items on advanced paths.",
    },
    {
      token: "Nugget",
      name: "Chicken Feet",
      description:
        "Crafted from chooks. Gates the advanced minigame—spend wisely before you commit to a run.",
    },
    {
      token: "GoldenChook",
      name: "Golden Chook",
      description:
        "A rare jackpot drop. Can be traded for Golden Nuggets when you want to reinvest in the shop.",
    },
  ];

  const shopItems = [
    {
      id: "love",
      actionId: "BUY_LOVE_CHICKEN",
      name: "Wormery",
      description: "Unlock an extra wormery that produces worms on a timer.",
      listImage: tokenImages.LoveChicken,
      price: { token: "Cluckcoin", amount: 15 },
      ownedBalanceToken: "LoveChicken",
    },
    {
      id: "alien",
      actionId: "BUY_ALIEN_CHICKEN",
      name: "Wormery",
      description: "Unlock another wormery for parallel worm production.",
      listImage: tokenImages.AlienChicken,
      price: { token: "Cluckcoin", amount: 100 },
      ownedBalanceToken: "AlienChicken",
    },
    {
      id: "rooster",
      actionId: "BUY_ROOSTER_CHICKEN",
      name: "Wormery",
      description: "Unlock the top-tier wormery for maximum worm throughput.",
      listImage: tokenImages.RoosterChicken,
      price: { token: "Cluckcoin", amount: 500 },
      ownedBalanceToken: "RoosterChicken",
    },
    {
      id: "nugget",
      actionId: "BUY_NUGGET",
      name: "Chicken Feet",
      description:
        "Craft Chicken Feet from Chooks. Spend them to enter advanced Chicken Rescue runs for Golden Chook drops.",
      listImage: tokenImages.Nugget,
      price: { token: "Chook", amount: 50 },
    },
    {
      id: "cluckcoin",
      actionId: "BUY_CLUCKCOIN",
      name: "Golden Nuggets",
      description:
        "Trade a Golden Chook for Golden Nuggets. Reinvest in stronger wormeries and faster worm lanes.",
      listImage: tokenImages.Cluckcoin,
      price: { token: "GoldenChook", amount: 1 },
    },
  ];

  return {
    headerBalanceToken: "Cluckcoin",
    shopItems,
    inventoryItems,
    inventoryShortcutTokens: ["Coin", "Chook", "FatChicken"],
    tokenImages,
  };
}

function sessionMinigameToRuntime(
  m: MinigameSessionApiPayload["minigame"],
): MinigameRuntimeState {
  return {
    balances: m.balances,
    producing: m.producing as MinigameRuntimeState["producing"],
    dailyMinted: m.dailyMinted,
    activity: m.activity,
    dailyActivity: m.dailyActivity,
  };
}

/**
 * Builds dashboard state from `GET /portal/:portalId/minigame` JSON.
 * Merges server `actions` with local `itemIds` mirror (API does not send itemIds).
 */
export function buildChickenRescueDashboardFromSession(
  session: MinigameSessionApiPayload,
): MinigameDashboardData {
  const config: MinigameConfig = {
    actions: session.actions as MinigameConfig["actions"],
    itemIds: CHICKEN_RESCUE_CONFIG.itemIds,
  };

  return {
    slug: "chicken-rescue",
    portalName: "chicken-rescue" as MinigameName,
    displayName: "Chicken Rescue",
    config,
    state: sessionMinigameToRuntime(session.minigame),
    ui: getChickenRescueDashboardUi(),
    productionCollectByStartId: { ...CHICKEN_RESCUE_COLLECT_BY_START },
  };
}
