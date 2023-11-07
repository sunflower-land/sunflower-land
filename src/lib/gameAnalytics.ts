import { GameAnalytics, EGAResourceFlowType } from "gameanalytics";
import { CONFIG } from "./config";
import { InventoryItemName } from "features/game/types/game";
import { BumpkinItem } from "features/game/types/bumpkin";

/**
 * Analytics for in-game events. These are useful once a player has logged into the game.
 * Game Analytics is focussed on tracking usage + player progression
 * It mainly uses one-off events that players accomplish. (i.e. not tracking every Sunflower Harvested)
 * There is a limit of 500 events per daily user
 * https://docs.gameanalytics.com/
 */
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
   * https://docs.gameanalytics.com/event-types/business-events
   */
  private trackPurchase() {
    // TODO - debounce and prevent duplicate events (e.g. Hoarding calling this method)
  }

  /**
   * Track the source of SFL, Mermaid Scales & Block Bucks
   * Does not include frequent events like selling crops - just irregular changes
   * E.g. Claiming Rewards, Deliveries & Airdrops
   * https://docs.gameanalytics.com/event-types/resource-events
   */
  public trackSource({
    item,
    amount,
    type,
    from,
  }: {
    item: "Block Buck" | "SFL" | "Seasonal Ticket";
    amount: number;
    type: "Exchange" | "Reward" | "IAP" | "Web3" | "Quest";
    from:
      | "Delivery"
      | "Daily Reward"
      | "Delivery Streak"
      | "IAP"
      | "Deposit"
      | "Kraken";
  }) {
    // TODO - debounce and prevent duplicate events (e.g. Hoarding calling this method)

    GameAnalytics.addResourceEvent(
      EGAResourceFlowType.Source,
      item.replace(/\s/g, ""), // Camel Case naming
      amount,
      type.replace(/\s/g, ""), // Camel Case naming,
      from.replace(/\s/g, "") // Camel Case naming
    );
  }

  /**
   * Track the sinks of SFL, Mermaid Scales & Block Bucks
   * Used for in frequent events like shop purchases
   * E.g. Purchasing a Wearable, Crafting a Decoration, Buying a Lure
   * https://docs.gameanalytics.com/event-types/resource-events
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
    // TODO - debounce and prevent duplicate events (e.g. Hoarding calling this method)

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
   * Game Analytics follows a hierachy event structure - [category]:[sub_category]:[outcome]
   * https://docs.gameanalytics.com/event-types/design-events
   */
  public trackMilestone(event: string) {
    GameAnalytics.addDesignEvent(
      event.replace(/\s/g, "") // Camel Case naming
    );
  }
}

export const gameAnalytics = new GameAnalyticTracker();
