import { GameAnalytics } from "gameanalytics";
import { CONFIG } from "./config";
import { Currency, InventoryItemName } from "features/game/types/game";
import { BumpkinItem } from "features/game/types/bumpkin";
import { DigAnalytics } from "features/world/scenes/BeachScene";
import { ExperimentName } from "./flags";
import { VipBundle } from "features/game/lib/vipAccess";

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

  public async initialise({
    id,
    experiments,
  }: {
    id: number;
    experiments: ExperimentName[];
  }) {
    try {
      if (!id) {
        throw new Error("Missing User ID for analytics");
      }
      // GameAnalytics.setEnabledInfoLog(true);
      // GameAnalytics.setEnabledVerboseLog(true);

      GameAnalytics.configureBuild(CONFIG.RELEASE_VERSION);

      GameAnalytics.configureUserId(`account${id}`);

      const validExperiments: ExperimentName[] = ["ONBOARDING_CHALLENGES"];
      GameAnalytics.configureAvailableCustomDimensions01([
        "NONE",
        ...validExperiments,
      ]);

      if (experiments.length > 0) {
        GameAnalytics.setCustomDimension01(experiments[0]);
      }

      GameAnalytics.configureAvailableResourceCurrencies([
        "SFL",
        "BlockBuck",
        "Gem",
        "ChapterTicket",
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
    item:
      | InventoryItemName
      | BumpkinItem
      | VipBundle
      | "Stock"
      | "Trade"
      | "DesertDigs"
      | "FishingReels"
      | "Instant Expand"
      | "Instant Build"
      | "Instant Cook"
      | "Skills Reset"
      | "Username Change"
      | "Instant Craft";
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
   * Game Analytics follows a hierarchy event structure - [category]:[sub_category]:[outcome]
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

  /**
   * Tracks the time taken for a player to return and claim a daily reward.
   * Reports are grouped by day number (D1, D2, D3, etc) with the value as days since last claim (ceiled).
   */
  public trackDailyRewardReturn({
    totalClaimed,
    daysSinceLastClaim,
  }: {
    totalClaimed: number;
    daysSinceLastClaim: number;
  }) {
    if (totalClaimed < 1) return;

    GameAnalytics.addDesignEvent(
      `DailyReward:Return:Box${totalClaimed}`,
      Math.max(0, daysSinceLastClaim),
    );
  }

  public trackTracksViewed({
    chapter,
    hasVip,
  }: {
    chapter: string;
    hasVip: boolean;
  }) {
    try {
      GameAnalytics.addDesignEvent(`Tracks:Viewed:${chapter}`, hasVip ? 1 : 0);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(`Game analytics error: `, e);
    }
  }

  public trackTracksReturn({
    chapter,
    lastTier,
    inactiveDays,
  }: {
    chapter: string;
    lastTier: number;
    inactiveDays: number;
  }) {
    try {
      GameAnalytics.addDesignEvent(
        `Tracks:Return:${chapter}:LastTier${lastTier}`,
        inactiveDays,
      );
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(`Game analytics error: `, e);
    }
  }

  public trackTracksPremiumUpsellOpened({ chapter }: { chapter: string }) {
    try {
      GameAnalytics.addDesignEvent(`Tracks:Premium:UpsellOpened:${chapter}`);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(`Game analytics error: `, e);
    }
  }

  public trackTracksPremiumActivated({ chapter }: { chapter: string }) {
    try {
      GameAnalytics.addDesignEvent(`Tracks:Premium:Activated:${chapter}`, 1);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(`Game analytics error: `, e);
    }
  }

  public trackTracksActivated({
    chapter,
    source,
  }: {
    chapter: string;
    source: "delivery" | "chore" | "bounty" | "coinDelivery";
  }) {
    try {
      GameAnalytics.addDesignEvent(`Tracks:Activated:${chapter}:${source}`);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(`Game analytics error: `, e);
    }
  }

  public trackTracksPoints({
    chapter,
    source,
    points,
  }: {
    chapter: string;
    source: "delivery" | "chore" | "bounty" | "coinDelivery";
    points: number;
  }) {
    try {
      GameAnalytics.addDesignEvent(
        `Tracks:Points:${chapter}:${source}`,
        points,
      );
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(`Game analytics error: `, e);
    }
  }

  public trackTracksMilestoneReached({
    chapter,
    milestone,
    daysSinceStart,
  }: {
    chapter: string;
    milestone: number;
    daysSinceStart: number;
  }) {
    try {
      GameAnalytics.addDesignEvent(
        `Tracks:Milestone:Reached:${chapter}:M${milestone}`,
        daysSinceStart,
      );
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(`Game analytics error: `, e);
    }
  }

  public trackTracksMilestoneClaimed({
    chapter,
    track,
    milestone,
    daysSinceStart,
  }: {
    chapter: string;
    track: "free" | "premium";
    milestone: number;
    daysSinceStart: number;
  }) {
    try {
      GameAnalytics.addDesignEvent(
        `Tracks:Milestone:Claimed:${chapter}:${track}:M${milestone}`,
        daysSinceStart,
      );
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(`Game analytics error: `, e);
    }
  }

  public trackTracksComplete({
    chapter,
    daysSinceStart,
  }: {
    chapter: string;
    daysSinceStart: number;
  }) {
    try {
      GameAnalytics.addDesignEvent(
        `Tracks:Complete:${chapter}`,
        daysSinceStart,
      );
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(`Game analytics error: `, e);
    }
  }
}

export const gameAnalytics = new GameAnalyticTracker();
