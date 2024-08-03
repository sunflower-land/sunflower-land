import { GameAnalytics } from "gameanalytics";
import { CONFIG } from "./config";
import { Currency, InventoryItemName } from "features/game/types/game";
import { BumpkinItem } from "features/game/types/bumpkin";
import { DigAnalytics } from "features/world/scenes/BeachScene";

// Their type definition has some issues, extract to here
enum EGAResourceFlowType {
  Undefined = 0,
  Source = 1,
  Sink = 2,
}

/**
 * Analytics for in-game events. These are useful once a player has logged into the game.
 * Game Analytics is focussed on tracking usage + player progression
 * It mainly uses one-off events that players accomplish. (i.e. not tracking every Sunflower Harvested)
 * There is a limit of 500 events per daily user
 * https://docs.gameanalytics.com/
 */
class GameAnalyticTracker {
  private executed: Record<string, boolean> = {};

  public async initialise(id: number) {
    try {
      if (!id) {
        throw new Error("Missing User ID for analytics");
      }
      // GameAnalytics.setEnabledInfoLog(true);
      // GameAnalytics.setEnabledVerboseLog(true);

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
        "Quest",
        "Delivery",
      ]);

      GameAnalytics.initialize(
        CONFIG.GAME_ANALYTICS_APP_ID,
        CONFIG.GAME_ANALYTICS_PUB_KEY,
      );

      GameAnalytics.startSession();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(`Game analytics error: `, e);
    }
  }

  /**
   * Tracks Block Buck and Gold Pass purchases
   * https://docs.gameanalytics.com/event-types/business-events
   */
  // private trackPurchase({}: { id: string }) {}

  /**
   * Track the source of SFL, Mermaid Scales & Block Bucks
   * Does not include frequent events like selling crops - just irregular changes
   * E.g. Claiming Rewards, Deliveries & Airdrops
   * https://docs.gameanalytics.com/event-types/resource-events
   */
  public trackSource(event: {
    item: Currency;
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
    const { item, amount, type, from } = event;

    GameAnalytics.addResourceEvent(
      EGAResourceFlowType.Source,
      item.replace(/\s/g, ""), // Camel Case naming
      amount,
      type.replace(/\s/g, ""), // Camel Case naming,
      from.replace(/\s/g, ""), // Camel Case naming
    );
  }

  /**
   * Track the sinks of SFL, Mermaid Scales & Block Bucks
   * Used for in frequent events like shop purchases
   * E.g. Purchasing a Wearable, Crafting a Decoration, Buying a Lure
   * https://docs.gameanalytics.com/event-types/resource-events
   */
  public trackSink(event: {
    currency: Currency;
    amount: number;
    type: "Consumable" | "Fee" | "Wearable" | "Collectible" | "Web3";
    item: InventoryItemName | BumpkinItem | "Stock" | "Trade" | "DesertDigs";
  }) {
    const { currency, amount, type, item } = event;

    GameAnalytics.addResourceEvent(
      EGAResourceFlowType.Sink,
      currency.replace(/\s/g, ""), // Camel Case naming
      amount,
      type.replace(/\s/g, ""), // Camel Case naming,
      item.replace(/\s/g, ""), // Camel Case naming
    );
  }

  /**
   * Tracks one off milestone events
   * Useful for tracking tutorial progress and achievements
   * Game Analytics follows a hierachy event structure - [category]:[sub_category]:[outcome]
   * https://docs.gameanalytics.com/event-types/design-events
   */
  public trackMilestone(milestone: { event: string }) {
    const key = JSON.stringify(milestone);

    // Milestones can only be tracked once
    if (this.executed[key]) {
      return;
    }

    const { event } = milestone;

    GameAnalytics.addDesignEvent(
      event.replace(/\s/g, ""), // Camel Case naming
    );

    this.executed[key] = true;
  }

  public trackBeachDiggingAttempt(analytics: DigAnalytics) {
    const { outputCoins, percentageFound } = analytics;

    GameAnalytics.addDesignEvent(
      "Beach:Digging:PercentageFound",
      percentageFound,
    );

    GameAnalytics.addDesignEvent("Beach:Digging:OutputCoins", outputCoins);
  }
}

export const gameAnalytics = new GameAnalyticTracker();
