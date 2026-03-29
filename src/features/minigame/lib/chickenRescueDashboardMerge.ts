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
      name: "Cluckcoin",
      description:
        "Premium rescue currency. Spend it in the shop to unlock stronger chickens that earn coins faster.",
    },
    {
      token: "Coin",
      name: "Coins",
      description:
        "Earned from feeding your chickens on timers. Used to start standard Chicken Rescue runs.",
    },
    {
      token: "FatChicken",
      name: "Fat Chicken",
      description:
        "Your starter bird. Feed it on a timer to produce coins. Each fat chicken can run one coin job at a time.",
    },
    {
      token: "LoveChicken",
      name: "Love Chicken",
      description:
        "A mid-tier chicken bought with Cluckcoin. Runs its own timed coin payout lane.",
    },
    {
      token: "AlienChicken",
      name: "Alien Chicken",
      description:
        "An exotic hen with a parallel coin drop—stack it with your other chickens for more throughput.",
    },
    {
      token: "RoosterChicken",
      name: "Rooster",
      description:
        "Top-tier production chicken. The most expensive Cluckcoin unlock, with the strongest idle coin lane.",
    },
    {
      token: "Chook",
      name: "Chook",
      description:
        "A reward from winning runs. Collect enough to trade up into rarer items on advanced paths.",
    },
    {
      token: "Nugget",
      name: "Nugget",
      description:
        "Crafted from chooks. Gates the advanced minigame—spend wisely before you commit to a run.",
    },
    {
      token: "GoldenChook",
      name: "Golden Chook",
      description:
        "A rare jackpot drop. Can be exchanged for Cluckcoin when you want to reinvest in the shop.",
    },
  ];

  const shopItems = [
    {
      id: "love",
      actionId: "BUY_LOVE_CHICKEN",
      name: "Love Chicken",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      listImage: tokenImages.LoveChicken,
      price: { token: "Cluckcoin", amount: 5 },
      ownedBalanceToken: "LoveChicken",
    },
    {
      id: "alien",
      actionId: "BUY_ALIEN_CHICKEN",
      name: "Alien Chicken",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      listImage: tokenImages.AlienChicken,
      price: { token: "Cluckcoin", amount: 15 },
      ownedBalanceToken: "AlienChicken",
    },
    {
      id: "rooster",
      actionId: "BUY_ROOSTER_CHICKEN",
      name: "Rooster Chicken",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      listImage: tokenImages.RoosterChicken,
      price: { token: "Cluckcoin", amount: 50 },
      ownedBalanceToken: "RoosterChicken",
    },
    {
      id: "nugget",
      actionId: "BUY_NUGGET",
      name: "Nugget",
      description:
        "Craft a Nugget from Chooks. Spend Nuggets to enter advanced Chicken Rescue runs for Golden Chook drops.",
      listImage: tokenImages.Nugget,
      price: { token: "Chook", amount: 50 },
    },
    {
      id: "cluckcoin",
      actionId: "BUY_CLUCKCOIN",
      name: "Cluckcoin",
      description:
        "Trade a Golden Chook for Cluckcoin. Reinvest in stronger chickens and faster coin lanes.",
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
