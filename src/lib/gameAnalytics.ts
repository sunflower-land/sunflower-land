import { GameAnalytics, EGAResourceFlowType } from "gameanalytics";
import { CONFIG } from "./config";
import { InventoryItemName } from "features/game/types/game";
import { BumpkinItem } from "features/game/types/bumpkin";
import { SeasonalTicket } from "features/game/types/seasons";

class GameAnalyticTracker {
  public async initialise(id: number) {
    try {
      GameAnalytics.setEnabledInfoLog(true);
      GameAnalytics.setEnabledVerboseLog(true);

      GameAnalytics.configureBuild(CONFIG.RELEASE_VERSION);

      GameAnalytics.configureUserId(`account${id}`);

      GameAnalytics.configureAvailableResourceCurrencies([
        "SFL",
        "BlockBuck",
        "SeasonalTicket",
        // TODO add future seasonal tickets
      ]);

      GameAnalytics.configureAvailableResourceItemTypes([
        "Consumable",
        "Fee",
        "Wearable",
        "Collectible",
        "Reward",
        "Exchange",
        "IAP",
        "Web3",
      ]);

      GameAnalytics.initialize(
        CONFIG.GAME_ANALYTICS_APP_ID,
        CONFIG.GAME_ANALYTICS_PUB_KEY
      );

      GameAnalytics.startSession();
    } catch (e) {
      console.log(`Game analytics error: `, e);
    }
  }

  /**
   * Tracks Block Buck and Gold Pass purchases
   */
  private trackPurchase() {}

  /**
   * Track the source of SFL, Mermaid Scales & Block Bucks
   * Does not include frequent events like selling crops - just irregular changes
   * E.g. Claiming Rewards, Deliveries & Airdrops
   */
  public trackSource() {}

  /**
   * Track the sinks of SFL, Mermaid Scales & Block Bucks
   * Used for in frequent events like shop purchases
   * E.g. Purchasing a Wearable, Crafting a Decoration, Buying a Lure
   */
  public trackSink({
    currency,
    amount,
    type,
    item,
  }: {
    currency: "Block Buck" | "SFL" | "Seasonal Ticket";
    amount: number;
    type: "Consumable" | "Fee" | "Wearable" | "Collectible" | "Web3";
    item: InventoryItemName | BumpkinItem | "Stock" | "Trade";
  }) {
    GameAnalytics.addResourceEvent(
      EGAResourceFlowType.Sink,
      currency.replace(/\s/g, ""), // Camel Case naming
      amount,
      type.replace(/\s/g, ""), // Camel Case naming,
      item.replace(/\s/g, "") // Camel Case naming
    );
  }

  /**
   * Tracks one off milestone events
   * Useful for tracking tutorial progress and achievements
   * "Tutorial:Welcome:TreeChopped - 120 seconds"
   * "Tutorial:Codex:Opened - 90 seconds"
   * "Building:Expansion:3_Expansions - 60 seconds"
   * "Building:HenHouse:1_Crafted" - 500 seconds
   * "Building:HenHouse:2_Crafted" - 10000 seconds
   * "Achievement:Fishing:Angler - 1600 seconds"
   */
  public trackMilestone() {}
}

export const gameAnalytics = new GameAnalyticTracker();
